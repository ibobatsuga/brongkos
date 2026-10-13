#!/usr/bin/env python3
"""Placement-safe preview: sample frames from a render and overlay the zones
Meta's vertical placements cover with UI, plus the title-safe box.

  python3 scripts/placement_preview.py RENDERS/previews/x.mp4 [--at 3,10,20] [-o out.png]

Zones (1080x1920): top 14% (0-269 px) and bottom 35% (1248-1920 px) shaded red,
title-safe (10% inset) outlined green. Keep captions, headlines and the CTA out
of the red zones. Zone sizes are Meta's published Reels guidance; re-check them
against current Meta specs before media buying.
"""
import argparse
import subprocess
import sys
import tempfile
from pathlib import Path

W, H = 1080, 1920
TOP, BOTTOM = round(H * 0.14), round(H * 0.35)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("video")
    ap.add_argument("--at", default="1.5,10,18,26,35,44,53,59")
    ap.add_argument("-o", "--out")
    a = ap.parse_args()
    src = Path(a.video)
    if not src.is_file():
        sys.exit(f"no such file: {src}")
    out = Path(a.out or src.with_suffix(".placement.png"))
    times = [float(t) for t in a.at.split(",")]
    overlay = (
        f"drawbox=x=0:y=0:w={W}:h={TOP}:color=red@0.28:t=fill,"
        f"drawbox=x=0:y={H - BOTTOM}:w={W}:h={BOTTOM}:color=red@0.28:t=fill,"
        f"drawbox=x={W // 10}:y={H // 10}:w={W * 8 // 10}:h={H * 8 // 10}:color=lime@0.9:t=4"
    )
    with tempfile.TemporaryDirectory() as tmp:
        frames = []
        for i, t in enumerate(times):
            f = Path(tmp) / f"{i:02d}.png"
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(t), "-i", str(src), "-frames:v", "1",
                            "-vf", f"{overlay},drawtext=text='{t:g}s':x=24:y=24:fontsize=48:fontcolor=white:box=1:boxcolor=black@0.6",
                            str(f)], check=True)
            frames.append(f)
        inputs = sum((["-i", str(f)] for f in frames), [])
        subprocess.run(["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex",
                        f"hstack=inputs={len(frames)},scale={min(len(frames) * 360, 3240)}:-1", str(out)], check=True)
    print(out)


if __name__ == "__main__":
    main()
