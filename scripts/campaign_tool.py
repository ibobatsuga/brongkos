#!/usr/bin/env python3
"""Keep a campaign's HyperFrames project in sync with its approved storyboard.

  verify  CAMPAIGNS/<id> [--final]   timing, copy, captions, claims and asset gates
  build   CAMPAIGNS/<id>             write caption cues into scenes/captions.html + SRT
  align   CAMPAIGNS/<id> transcript.json
                                     set cue times from a word-level VO transcript
                                     (`npx hyperframes transcribe vo.wav -m small -l id`)

Exit status is nonzero when any ERROR is reported. WARN lines are blockers for a
final render only; `verify --final` turns them into errors.
"""
import html
import json
import math
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PRESET = json.loads((ROOT / "PRESETS/production-default.json").read_text())
COMMERCIAL = json.loads((ROOT / "BRAND/commercial.json").read_text())
FPS = PRESET["fps"]
TOTAL_FRAMES = PRESET["totalFrames"]
# CLAUDE.md "Story and voice-over timing": scene boundaries in seconds.
STORY_BEATS = [0, 6, 14, 22, 31, 40, 49, 56, 60]
FULL_LENGTH_HOSTS = ["canvas", "captions", "draft-mark"]
CHARS_PER_LINE = 34  # Inter 600 @ 44px in an 864px box, conservative
MAX_CPS_WARN = 17.0
MAX_CPS_ERR = 21.0
PLATFORMS = ["instagram", "facebook", "tiktok", "linkedin", "threads", "youtube", "pinterest", "twitter"]


class Report:
    def __init__(self, final):
        self.final, self.errors, self.warns = final, [], []

    def error(self, msg):
        self.errors.append(msg)
        print("ERROR", msg)

    def warn(self, msg):
        (self.errors if self.final else self.warns).append(msg)
        print("ERROR" if self.final else "WARN ", msg)

    def ok(self, msg):
        print("ok   ", msg)

    def section(self):
        self._mark = len(self.errors)

    def ok_if_clean(self, msg):
        if len(self.errors) == self._mark:
            self.ok(msg)


class Hosts(HTMLParser):
    """Collect elements carrying data-composition-id in a root index.html."""

    def __init__(self):
        super().__init__()
        self.items = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if "data-composition-id" in a:
            self.items.append(a)


def norm_ws(s):
    return re.sub(r"\s+", " ", s).strip()


def words(s):
    return re.findall(r"[0-9A-Za-zÀ-ÿ]+", s.lower())


def visible_copy(scene_html):
    """On-screen text of a scene: template markup minus scripts, styles, comments
    and the explicitly labelled placeholder blocks (*-ph)."""
    t = scene_html.split("<template>", 1)[-1]
    t = re.sub(r"<script.*?</script>|<style.*?</style>|<!--.*?-->", " ", t, flags=re.S)
    t = re.sub(r'<div id="[a-z0-9]+-ph".*?</div>', " ", t, flags=re.S)
    return norm_ws(html.unescape(re.sub(r"<[^>]+>", " ", t)))


def load(camp):
    sb = json.loads((camp / "storyboard.json").read_text())
    caps = json.loads((camp / "captions.json").read_text())
    return sb, caps


def frame(t):
    return round(t * FPS)


def cue_times(sb, caps):
    """Explicit start/end when aligned; otherwise a char-weighted estimate."""
    out = []
    for s in sb:
        cues = [c for c in caps["cues"] if c["scene"] == s["scene"]]
        if all("start" in c and "end" in c for c in cues):
            out += [(c, c["start"], c["end"]) for c in cues]
            continue
        lead, tail = 0.25, (0.1 if s["endSec"] == STORY_BEATS[-1] else 0.45)
        a, b, gap = s["startSec"] + lead, s["endSec"] - tail, 0.1
        span = b - a - gap * (len(cues) - 1)
        total = sum(len(c["text"]) for c in cues)
        t = a
        for c in cues:
            d = span * len(c["text"]) / total
            out.append((c, t, t + d))
            t += d + gap
    # Snap to frame boundaries so SRT and burned-in captions agree exactly.
    return [(c, frame(i) / FPS, frame(o) / FPS) for c, i, o in out]


def verify(camp, final):
    r = Report(final)
    sb, caps = load(camp)

    # 1. Storyboard timing vs preset and CLAUDE.md beats.
    starts = [s["startSec"] for s in sb] + [sb[-1]["endSec"]]
    if starts != STORY_BEATS:
        r.error(f"storyboard beats {starts} != CLAUDE.md {STORY_BEATS}")
    for i, s in enumerate(sb):
        if s["frames"] != [s["startSec"] * FPS, s["endSec"] * FPS]:
            r.error(f"scene {s['scene']} frames {s['frames']} != seconds x {FPS}")
        if i and sb[i - 1]["frames"][1] != s["frames"][0]:
            r.error(f"gap/overlap before scene {s['scene']}")
    if sb[0]["frames"][0] != 0 or sb[-1]["frames"][1] != TOTAL_FRAMES:
        r.error(f"storyboard does not span 0..{TOTAL_FRAMES} frames")
    else:
        r.ok(f"storyboard: {len(sb)} contiguous scenes, {TOTAL_FRAMES} frames @ {FPS} fps")

    # 2. index.html hosts vs storyboard.
    r.section()
    p = Hosts()
    p.feed((camp / "index.html").read_text())
    by_id = {a["data-composition-id"]: a for a in p.items}
    root = p.items[0]
    w, h = PRESET["resolution"]
    want = {"data-width": str(w), "data-height": str(h), "data-fps": str(FPS),
            "data-duration": str(PRESET["durationSeconds"])}
    bad = {k: root.get(k) for k, v in want.items() if root.get(k) != v}
    if bad:
        r.error(f"root composition {bad} != {want}")
    else:
        r.ok(f"root: {w}x{h}, {PRESET['durationSeconds']} s, {FPS} fps")
    for s in sb:
        hid = next((k for k in by_id if k.startswith(f"s{s['scene']}-")), None)
        if not hid:
            r.error(f"no host for scene {s['scene']}")
            continue
        a = by_id[hid]
        st, du = float(a["data-start"]), float(a["data-duration"])
        if [frame(st), frame(st + du)] != s["frames"]:
            r.error(f"host {hid} frames {[frame(st), frame(st + du)]} != storyboard {s['frames']}")
        src = camp / a["data-composition-src"]
        if not src.is_file():
            r.error(f"missing {src.relative_to(ROOT)}")
            continue
        body = src.read_text()
        if f'data-composition-id="{hid}"' not in body or f'__timelines["{hid}"]' not in body:
            r.error(f"{src.name}: composition id / timeline key must be {hid}")
        copy = visible_copy(body)
        missing = [x for x in words(s["text"]) if x not in words(copy)]
        if missing:
            r.error(f"{src.name}: on-screen text missing {missing} from '{s['text']}'")
        s["_copy"] = copy
    for hid in FULL_LENGTH_HOSTS:
        a = by_id.get(hid)
        if not a or float(a["data-start"]) != 0 or float(a["data-duration"]) != PRESET["durationSeconds"]:
            r.error(f"host {hid} must span the full {PRESET['durationSeconds']} s")
    r.ok_if_clean("index.html hosts match storyboard")

    # 3. Copy integrity: script.md == storyboard == captions.
    r.section()
    md = (camp / "script.md").read_text()
    vo_md = [norm_ws(x) for x in re.findall(r"^VO:\s*(.+)$", md, flags=re.M)]
    os_md = [norm_ws(x) for x in re.findall(r"^On-screen:\s*(.+)$", md, flags=re.M)]
    if vo_md != [norm_ws(s["voiceover"]) for s in sb]:
        r.error("script.md VO lines differ from storyboard.json voiceover")
    if os_md != [norm_ws(s["text"]) for s in sb]:
        r.error("script.md On-screen lines differ from storyboard.json text")
    for s in sb:
        joined = norm_ws(" ".join(c["text"] for c in caps["cues"] if c["scene"] == s["scene"]))
        if joined != norm_ws(s["voiceover"]):
            r.error(f"captions scene {s['scene']} != approved VO: '{joined}'")
    r.ok_if_clean("script.md, storyboard.json and captions.json carry identical copy")

    # 4. Caption timing and fit.
    prev_out = 0.0
    for c, i, o in cue_times(sb, caps):
        n = len(c["text"])
        if n > 2 * CHARS_PER_LINE:
            r.error(f"cue too long for 2 lines ({n} chars): {c['text']}")
        if i < prev_out - 1e-6 or o <= i or o > PRESET["durationSeconds"]:
            r.error(f"cue timing invalid {i:.3f}-{o:.3f}: {c['text']}")
        cps = n / (o - i)
        if cps > MAX_CPS_ERR:
            r.error(f"cue {cps:.1f} chars/s (> {MAX_CPS_ERR}): {c['text']}")
        elif cps > MAX_CPS_WARN:
            print(f"note  cue {cps:.1f} chars/s, fast read: {c['text']}")
        prev_out = o
    if caps.get("timingSource") == "provisional-estimate":
        r.warn("caption timing is a provisional estimate (no VO aligned yet)")
    elif not caps.get("manualVerification"):
        r.warn("aligned caption timing not yet verified by ear (set manualVerification: true)")

    # 5. Claims and register guard over every piece of ad copy.
    r.section()
    copy_all = " ".join([*(s["voiceover"] for s in sb), *(s.get("_copy", "") for s in sb),
                         *(c["text"] for c in caps["cues"])])
    approvals = COMMERCIAL["promotionCopyApproval"]
    guards = [
        (r"\bRp\s?\d|\b\d{2,3}\.\d{3}\b", approvals["pricesAndPlans"], "price"),
        (r"\b(gratis|uji coba|trial|\d+\s*(hari|minggu))\b", approvals["trialDuration"], "trial terms"),
        (r"\b(" + "|".join(PLATFORMS) + r")\b", approvals["supportedPlatforms"], "auto-post platform"),
        (r"\d+\s*%|\bviral\b|terbaik|termurah|tanpa batas|unlimited|pelanggan|testimoni", False, "unsupported claim"),
    ]
    for pat, allowed, label in guards:
        hits = sorted({m.group(0) for m in re.finditer(pat, copy_all, flags=re.I)})
        if hits and not allowed:
            r.error(f"{label} in ad copy without approval in BRAND/commercial.json: {hits}")
    if re.search(r"\bkamu\b", copy_all, re.I) and re.search(r"\bAnda\b", copy_all):
        r.error("mixed address register: both 'kamu' and 'Anda' in one asset")
    r.ok_if_clean("claims guard: no prices, trial terms, platforms or stats in copy")

    # 6. Assets and final-render readiness.
    for f in ["assets/vendor/gsap.min.js", "assets/fonts/inter-latin-400-normal.woff2",
              "assets/fonts/inter-latin-600-normal.woff2", "assets/fonts/inter-latin-700-normal.woff2"]:
        if not (camp / f).is_file():
            r.error(f"missing {f}: run scripts/sync_campaign_assets.sh")
    scenes = {f.name: f.read_text() for f in (camp / "scenes").glob("*.html")}
    if any("extracted-from-brandkit" in t for t in scenes.values()):
        r.warn("logo is the raster preview extracted from the brand kit, not the official SVG/PDF master")
    ph = sorted(n for n, t in scenes.items() if re.search(r'id="[a-z0-9]+-ph"', t))
    if ph:
        r.warn(f"UI footage placeholders still in {ph}")
    index = (camp / "index.html").read_text()
    if not re.search(r"<audio\b", re.sub(r"<!--.*?-->", "", index, flags=re.S)):
        r.warn("no <audio> in index.html: VO, licensed music and SFX not placed")
    dm = by_id.get("draft-mark", {})
    if "data-hidden" not in dm:
        r.warn("draft-mark watermark is visible (add data-hidden to its host for the final)")
    if not all(approvals.values()):
        print("note  commercial terms not approved; copy correctly stays non-numeric:",
              {k: v for k, v in approvals.items() if not v})

    print(f"\nRESULT: {len(r.errors)} error(s), {len(r.warns)} final-render blocker(s)")
    return 1 if r.errors else 0


def build(camp):
    sb, caps = load(camp)
    cues = cue_times(sb, caps)
    block = "\n".join(
        f'        <div id="cap-{n:02d}" class="cap" data-in="{i:.3f}" data-out="{o:.3f}">'
        f'<span class="cap-box">{html.escape(c["text"])}</span></div>'
        for n, (c, i, o) in enumerate(cues, 1))
    f = camp / "scenes/captions.html"
    t = f.read_text()
    t = re.sub(r"(<!-- BEGIN GENERATED CUES.*?-->).*?(<!-- END GENERATED CUES -->)",
               lambda m: f"{m.group(1)}\n{block}\n        {m.group(2)}", t, flags=re.S)
    f.write_text(t)

    def ts(x):
        ms = round(x * 1000)
        return f"{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}"

    provisional = caps.get("timingSource") == "provisional-estimate"
    out = camp / "subtitles"
    out.mkdir(exist_ok=True)
    name = f"{camp.name}.id{'.PROVISIONAL' if provisional else ''}.srt"
    for old in out.glob(f"{camp.name}.id*.srt"):
        old.unlink()
    (out / name).write_text("\n".join(
        f"{n}\n{ts(i)} --> {ts(o)}\n{c['text']}\n" for n, (c, i, o) in enumerate(cues, 1)))
    print(f"wrote {len(cues)} cues -> scenes/captions.html, subtitles/{name}")
    return 0


def align(camp, transcript_path):
    sb, caps = load(camp)
    raw = json.loads(Path(transcript_path).read_text())
    seq = raw.get("words", raw) if isinstance(raw, dict) else raw
    tw = [(w2, float(x["start"]), float(x["end"])) for x in seq
          if x.get("type", "word") == "word" for w2 in words(x.get("text", x.get("word", "")))[:1]]
    if not tw:
        print("ERROR transcript has no words")
        return 1
    k, misses = 0, []
    for c in caps["cues"]:
        hit = []
        for tok in words(c["text"]):
            j = next((j for j in range(k, min(k + 4, len(tw))) if tw[j][0] == tok), None)
            if j is None:
                misses.append(tok)
                continue
            hit.append(j)
            k = j + 1
        if not hit:
            print(f"ERROR could not place cue: {c['text']}")
            return 1
        c["start"], c["end"] = tw[hit[0]][1], tw[hit[-1]][2]
    cs = caps["cues"]
    for a, b in zip(cs, cs[1:] + [None]):  # hold each cue a little for reading
        limit = (b["start"] - 0.05) if b else PRESET["durationSeconds"] - 0.05
        a["end"] = round(min(limit, max(a["end"] + 0.4, a["start"] + 1.0)), 3)
        a["start"] = round(a["start"], 3)
    caps["timingSource"] = f"whisper-aligned:{Path(transcript_path).name}"
    caps["manualVerification"] = False
    (camp / "captions.json").write_text(json.dumps(caps, ensure_ascii=False, indent=2) + "\n")
    vo_end = tw[-1][2]
    print(f"aligned {len(cs)} cues; VO speech ends at {vo_end:.2f} s; unmatched tokens: {misses or 'none'}")
    for s in sb:
        sc = [c for c in cs if c["scene"] == s["scene"]]
        if sc[0]["start"] < s["startSec"] or sc[-1]["end"] > s["endSec"]:
            print(f"WARN  scene {s['scene']} VO {sc[0]['start']:.2f}-{sc[-1]['end']:.2f} s spills outside "
                  f"{s['startSec']}-{s['endSec']} s: adjust pauses/layout before touching approved copy")
    print("Next: listen through, fix any cue by hand, set manualVerification: true, then run build.")
    return 0


def main(argv):
    if len(argv) < 3 or argv[1] not in {"verify", "build", "align"}:
        sys.exit(__doc__)
    camp = (ROOT / argv[2]).resolve()
    if argv[1] == "verify":
        return verify(camp, "--final" in argv)
    if argv[1] == "build":
        return build(camp)
    return align(camp, argv[3])


if __name__ == "__main__":
    sys.exit(main(sys.argv))
