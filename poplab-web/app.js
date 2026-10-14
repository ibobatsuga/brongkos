/* Pop Lab · interaksi, tipografi kinetic, beat clock, deck Web Audio, perakit rental. */
(function () {
  "use strict";
  var D = window.POPLAB;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  // string -> teks; { isi } -> chip placeholder
  function val(v) {
    if (v && typeof v === "object") return '<span class="ph">isi ' + esc(v.isi) + "</span>";
    return esc(v);
  }
  function plain(v) { return v && typeof v === "object" ? "(" + v.isi + " belum diisi)" : v; }

  /* ---------- render data ---------- */
  $("#shelf").innerHTML = D.lini.map(function (l) {
    return '<article class="spec">' +
      '<div class="spec-code"><span>' + esc(l.kode) + '</span><span class="spec-ring" aria-hidden="true"></span></div>' +
      '<h3 class="spec-name">' + esc(l.nama) + "</h3>" +
      '<p class="spec-text">' + esc(l.teks) + "</p>" +
      (l.harga ? '<p class="spec-price">' + esc(l.harga) + "</p>" : "") +
      (l.catatan ? '<p class="spec-foot">' + esc(l.catatan) + "</p>" : "") +
      "</article>";
  }).join("");

  var tabs = $("#kelas-tabs"), panel = $("#kelas-panel");
  tabs.innerHTML = D.kelas.map(function (k, i) {
    return '<button class="tab" role="tab" type="button" id="tab-' + k.id + '" aria-controls="kelas-panel" aria-selected="' + (i === 0) + '" tabindex="' + (i === 0 ? 0 : -1) + '">' + esc(k.nama) + "</button>";
  }).join("");
  function showKelas(i) {
    var k = D.kelas[i];
    $$(".tab", tabs).forEach(function (t, j) {
      t.setAttribute("aria-selected", String(j === i));
      t.tabIndex = j === i ? 0 : -1;
    });
    panel.setAttribute("aria-labelledby", "tab-" + k.id);
    panel.innerHTML =
      '<div class="stripes" aria-hidden="true"></div>' +
      "<div>" +
        '<p class="program-name kin" aria-label="' + esc(k.nama) + '">' + esc(k.nama) + "</p>" +
        '<p class="program-sub">' + esc(k.sub) + "</p>" +
        '<dl class="meta">' +
          "<div><dt>Pertemuan</dt><dd>" + val(k.pertemuan) + "</dd></div>" +
          "<div><dt>Per sesi</dt><dd>" + val(k.durasi) + "</dd></div>" +
          "<div><dt>Biaya</dt><dd>" + val(k.harga) + "</dd></div>" +
        "</dl>" +
      "</div>" +
      '<ol class="modules" aria-label="Modul kelas ' + esc(k.nama) + '">' +
        k.modul.map(function (m, j) { return '<li style="--i:' + j + '">' + esc(m) + "</li>"; }).join("") +
      "</ol>";
    var name = $(".program-name", panel);
    splitKin(name);
    if (!reduce) requestAnimationFrame(function () { name.classList.add("go"); });
  }
  tabs.addEventListener("click", function (e) {
    var b = e.target.closest(".tab"); if (!b) return;
    showKelas($$(".tab", tabs).indexOf(b));
  });
  tabs.addEventListener("keydown", function (e) {
    var all = $$(".tab", tabs), i = all.indexOf(document.activeElement);
    if (i < 0) return;
    var n = e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : e.key === "Home" ? 0 : e.key === "End" ? all.length - 1 : null;
    if (n === null) return;
    e.preventDefault();
    n = (n + all.length) % all.length;
    all[n].focus(); showKelas(n);
  });

  $("#timeline").innerHTML = D.event.map(function (ev) {
    return '<li class="ev">' +
      '<span class="ev-date">' + esc(ev.tanggal) + "</span>" +
      '<div><h3 class="ev-name">' + esc(ev.nama) + '</h3><p class="ev-ket">' + esc(ev.ket) + "</p></div>" +
      '<ul class="lineup" aria-label="Lineup">' + ev.lineup.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>" +
      "</li>";
  }).join("");

  $("#syarat").innerHTML = D.syaratRental.map(function (s) {
    return "<div><dt>" + esc(s.label) + "</dt><dd>" + val(s.nilai) + "</dd></div>";
  }).join("");

  $("#contact").innerHTML = D.kontak.map(function (k) {
    var v = k.link ? '<a href="' + esc(k.link) + '" target="_blank" rel="noopener">' + val(k.nilai) + "</a>" : val(k.nilai);
    if (k.salin) v += '<button class="copy" type="button" data-copy="' + esc(k.nilai) + '">Salin</button>';
    return "<div><dt>" + esc(k.label) + "</dt><dd>" + v + "</dd></div>";
  }).join("");

  var ICON = {
    deck: '<span class="ic-deck"><span></span></span>',
    monitor: '<span class="ic-monitor" data-pulse><span></span><span></span></span>',
    laptop: '<span class="ic-wave">' + "<i></i>".repeat(9) + "</span>",
    rec: '<span class="ic-rec"><span></span>REC</span>',
    ruang: '<span class="ic-ring"></span>'
  };
  $("#bench").innerHTML = D.studio.map(function (t, i) {
    return '<article class="tool">' +
      '<div class="tool-ic" aria-hidden="true">' + (ICON[t.ikon] || "") + "</div>" +
      '<p class="tool-no mono">ALAT ' + String(i + 1).padStart(2, "0") + "</p>" +
      '<h3 class="tool-name">' + esc(t.nama) + "</h3>" +
      '<p class="tool-text">' + esc(t.teks) + "</p></article>";
  }).join("");

  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-copy]"); if (!b) return;
    var t = b.getAttribute("data-copy");
    var done = function () { b.textContent = "Tersalin"; setTimeout(function () { b.textContent = "Salin"; }, 1600); };
    try { navigator.clipboard.writeText(t).then(done, function () { b.textContent = "Salin manual"; }); }
    catch (err) { b.textContent = "Salin manual"; }
  });

  /* ---------- kinetic split ---------- */
  function splitKin(el) {
    if (el.dataset.split) return;
    var text = el.textContent.trim(), i = 0;
    if (!el.hasAttribute("aria-label")) el.setAttribute("aria-label", text);
    el.innerHTML = '<span aria-hidden="true">' + text.split(" ").map(function (w) {
      return '<span class="w">' + Array.prototype.map.call(w, function (c) {
        return '<span class="ch" style="--i:' + (i++) + '">' + esc(c) + "</span>";
      }).join("") + "</span>";
    }).join(" ") + "</span>";
    el.dataset.split = "1";
  }
  $$(".kin").forEach(splitKin);
  if (!reduce && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("go"); io.unobserve(en.target); }
      });
    }, { threshold: 0.4 });
    $$(".kin").forEach(function (el) { io.observe(el); });
  }

  /* ---------- hero letters ---------- */
  var heroChars = [];
  $$("[data-hero]").forEach(function (w) {
    var t = w.textContent; w.textContent = "";
    w.setAttribute("aria-hidden", "true");
    Array.prototype.forEach.call(t, function (c) {
      var s = document.createElement("span"); s.className = "hc"; s.textContent = c;
      w.appendChild(s); heroChars.push({ el: s, kick: 0 });
    });
  });
  var pointer = { x: -9999, y: -9999 };
  window.addEventListener("pointermove", function (e) { pointer.x = e.clientX; pointer.y = e.clientY; }, { passive: true });

  /* ---------- beat clock ---------- */
  var bpm = 122, lastBeatAt = performance.now(), beatCount = 0, idleNext = performance.now();
  var pulseEls = $$("[data-pulse], .platter, .play");
  var audio = null; // diisi saat deck dinyalakan
  function onBeat() {
    lastBeatAt = performance.now(); beatCount++;
    if (heroChars.length) heroChars[beatCount % heroChars.length].kick = 1;
  }

  var progress = $("#progress");
  function frame(now) {
    // beat: ikut audio kalau menyala, kalau tidak pakai jam internal
    if (audio && audio.playing) {
      while (audio.beats.length && audio.beats[0] <= audio.ctx.currentTime) { audio.beats.shift(); onBeat(); }
    } else if (now >= idleNext) {
      idleNext = now + 60000 / bpm; onBeat();
    }
    var amp = audio && audio.playing ? 1 : 0.55;
    var beat = reduce ? 0 : Math.exp(-(now - lastBeatAt) / 140) * amp;
    for (var i = 0; i < pulseEls.length; i++) pulseEls[i].style.setProperty("--beat", beat.toFixed(3));

    if (!reduce) {
      var t = now / 1000;
      for (var j = 0; j < heroChars.length; j++) {
        var h = heroChars[j], r = h.el.getBoundingClientRect();
        var dx = pointer.x - (r.left + r.width / 2), dy = pointer.y - (r.top + r.height / 2);
        var prox = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / 420);
        h.kick *= 0.9;
        var wd = 78 + 12 * (0.5 + 0.5 * Math.sin(t * 1.3 + j * 0.9)) + 10 * prox;
        h.el.style.setProperty("--wd", Math.min(100, wd).toFixed(1));
        h.el.style.setProperty("--wg", (700 + 100 * prox).toFixed(0));
        h.el.style.transform = "translateY(" + (-h.kick * 0.12).toFixed(3) + "em) scaleY(" + (1 + h.kick * 0.1 + prox * 0.06).toFixed(3) + ") rotate(" + (h.kick * (j % 2 ? 4 : -4)).toFixed(2) + "deg)";
      }
    }
    drawScope(now);
    requestAnimationFrame(frame);
  }

  function onScroll() {
    var max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = "scaleX(" + (max > 0 ? scrollY / max : 0).toFixed(4) + ")";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- deck: Web Audio ---------- */
  var deckui = $("#deckui"), playBtn = $("#play"), status = $("#deck-status");
  var scope = $("#scope"), sctx = scope.getContext("2d");
  var ink = getComputedStyle(document.documentElement).getPropertyValue("--paper").trim() || "#ffffff";

  function fitScope() {
    var dpr = Math.min(2, window.devicePixelRatio || 1), w = scope.clientWidth, h = scope.clientHeight;
    scope.width = Math.max(1, w * dpr); scope.height = Math.max(1, h * dpr); sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  fitScope(); window.addEventListener("resize", fitScope);

  var fbuf;
  function drawScope(now) {
    var w = scope.clientWidth, h = scope.clientHeight;
    sctx.clearRect(0, 0, w, h);
    sctx.fillStyle = ink; sctx.strokeStyle = ink;
    if (audio && audio.playing) {
      if (!fbuf) fbuf = new Uint8Array(audio.an.frequencyBinCount);
      audio.an.getByteFrequencyData(fbuf);
      var bars = 40, bw = w / bars;
      for (var i = 0; i < bars; i++) {
        var v = fbuf[Math.floor(Math.pow(i / bars, 1.6) * fbuf.length * 0.7)] / 255;
        var bh = Math.max(2, v * (h - 16));
        sctx.fillRect(i * bw + 2, h - 8 - bh, bw - 4, bh);
      }
    } else {
      sctx.lineWidth = 2; sctx.beginPath();
      for (var x = 0; x <= w; x += 4) {
        var y = h / 2 + Math.sin(x / 22 + now / 500) * 6 * Math.sin(x / w * Math.PI);
        x === 0 ? sctx.moveTo(x, y) : sctx.lineTo(x, y);
      }
      sctx.stroke();
    }
  }

  function makeAudio() {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    var ctx = new AC();
    var comp = ctx.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 4;
    var master = ctx.createGain(); master.gain.value = 0.75;
    var an = ctx.createAnalyser(); an.fftSize = 512; an.smoothingTimeConstant = 0.7;
    master.connect(comp); comp.connect(an); an.connect(ctx.destination);
    function bus() {
      var inp = ctx.createGain(), f = ctx.createBiquadFilter(), x = ctx.createGain();
      f.type = "lowpass"; f.frequency.value = 20000; f.Q.value = 6;
      inp.connect(f); f.connect(x); x.connect(master);
      return { in: inp, f: f, x: x };
    }
    var noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate), nd = noise.getChannelData(0);
    for (var i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
    return { ctx: ctx, master: master, an: an, A: bus(), B: bus(), fx: bus(), noise: noise, playing: false, beats: [], step: 0, next: 0, timer: null };
  }

  function env(g, t, a, peak, d) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
  }
  function osc(type, freq, t, dur, dest) {
    var o = audio.ctx.createOscillator(); o.type = type; o.frequency.setValueAtTime(freq, t);
    o.connect(dest); o.start(t); o.stop(t + dur + 0.05); return o;
  }
  function nz(t, dur, dest) {
    var s = audio.ctx.createBufferSource(); s.buffer = audio.noise; s.connect(dest);
    s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.05); return s;
  }
  var I = {
    kick: function (t, out, lvl) {
      var g = audio.ctx.createGain(); g.connect(out); env(g, t, 0.003, lvl || 1, 0.38);
      var o = osc("sine", 150, t, 0.4, g); o.frequency.exponentialRampToValueAtTime(42, t + 0.13);
    },
    hat: function (t, out, open, lvl) {
      var g = audio.ctx.createGain(), f = audio.ctx.createBiquadFilter();
      f.type = "highpass"; f.frequency.value = 7500; f.connect(g); g.connect(out);
      env(g, t, 0.002, lvl || 0.25, open ? 0.2 : 0.04); nz(t, open ? 0.25 : 0.06, f);
    },
    snare: function (t, out) {
      var g = audio.ctx.createGain(), f = audio.ctx.createBiquadFilter();
      f.type = "bandpass"; f.frequency.value = 1900; f.Q.value = 0.8; f.connect(g); g.connect(out);
      env(g, t, 0.002, 0.7, 0.18); nz(t, 0.22, f);
      var g2 = audio.ctx.createGain(); g2.connect(out); env(g2, t, 0.002, 0.4, 0.08); osc("triangle", 190, t, 0.1, g2);
    },
    bass: function (t, out, freq, len) {
      var g = audio.ctx.createGain(), f = audio.ctx.createBiquadFilter();
      f.type = "lowpass"; f.Q.value = 8; f.frequency.setValueAtTime(900, t); f.frequency.exponentialRampToValueAtTime(140, t + len);
      f.connect(g); g.connect(out); env(g, t, 0.005, 0.45, len); osc("sawtooth", freq, t, len, f);
    },
    stab: function (t, out, lvl) {
      var g = audio.ctx.createGain(), f = audio.ctx.createBiquadFilter();
      f.type = "lowpass"; f.frequency.value = 2200; f.connect(g); g.connect(out); env(g, t, 0.004, lvl || 0.22, 0.28);
      [220, 261.63, 329.63, 392].forEach(function (fr) { osc("sawtooth", fr, t, 0.32, f); });
    },
    clap: function (t, out) {
      var g = audio.ctx.createGain(), f = audio.ctx.createBiquadFilter();
      f.type = "bandpass"; f.frequency.value = 1300; f.Q.value = 1.2; f.connect(g); g.connect(out);
      g.gain.setValueAtTime(0.0001, t);
      [0, 0.012, 0.024].forEach(function (o) { g.gain.setValueAtTime(0.8, t + o); g.gain.exponentialRampToValueAtTime(0.1, t + o + 0.01); });
      g.gain.setValueAtTime(0.7, t + 0.036); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.24);
      nz(t, 0.3, f);
    },
    scratch: function (t, out) {
      var g = audio.ctx.createGain(), f = audio.ctx.createBiquadFilter();
      f.type = "bandpass"; f.Q.value = 3; f.connect(g); g.connect(out);
      f.frequency.setValueAtTime(400, t); f.frequency.linearRampToValueAtTime(2600, t + 0.09);
      f.frequency.linearRampToValueAtTime(300, t + 0.2); f.frequency.linearRampToValueAtTime(1800, t + 0.28);
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.9, t + 0.02);
      g.gain.setValueAtTime(0.9, t + 0.1); g.gain.linearRampToValueAtTime(0.05, t + 0.12);
      g.gain.linearRampToValueAtTime(0.8, t + 0.16); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.32);
      var o = osc("sawtooth", 180, t, 0.32, f); o.frequency.linearRampToValueAtTime(520, t + 0.09); o.frequency.linearRampToValueAtTime(120, t + 0.2); o.frequency.linearRampToValueAtTime(400, t + 0.28);
      nz(t, 0.32, f);
    },
    riser: function (t, out) {
      var dur = 60 / bpm * 4, g = audio.ctx.createGain(), f = audio.ctx.createBiquadFilter();
      f.type = "bandpass"; f.Q.value = 4; f.frequency.setValueAtTime(300, t); f.frequency.exponentialRampToValueAtTime(7000, t + dur);
      f.connect(g); g.connect(out); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.5, t + dur); g.gain.linearRampToValueAtTime(0.0001, t + dur + 0.05);
      nz(t, dur, f);
    }
  };

  var BASS = { 2: 55, 6: 55, 10: 65.41, 13: 49, 14: 49 };
  function playStep(s, t) {
    var A = audio.A.in, B = audio.B.in, sx = 60 / bpm / 4, bar = Math.floor(audio.step / 16);
    // Deck A · Groove (four-on-the-floor)
    if (s % 4 === 0) I.kick(t, A);
    if (s % 4 === 2) I.hat(t, A, true, 0.18);
    if (s % 2 === 1) I.hat(t, A, false, 0.08);
    if (BASS[s]) I.bass(t, A, BASS[s], sx * 1.6);
    // Deck B · Break
    if (s === 0 || s === 7 || s === 10) I.kick(t, B, 0.9);
    if (s === 4 || s === 12) I.snare(t, B);
    if (s % 2 === 0) I.hat(t, B, false, 0.12);
    if ((s === 3 || s === 11) && bar % 2 === 0) I.stab(t, B, 0.16);
    if (s % 4 === 0) audio.beats.push(t);
  }
  function scheduler() {
    var sx = 60 / bpm / 4;
    while (audio.next < audio.ctx.currentTime + 0.12) {
      playStep(audio.step % 16, audio.next);
      audio.next += sx; audio.step++;
    }
  }

  function applyMix() {
    if (!audio) return;
    var x = $("#xfade").value / 100, t = audio.ctx.currentTime;
    audio.A.x.gain.setTargetAtTime(Math.cos(x * Math.PI / 2), t, 0.02);
    audio.B.x.gain.setTargetAtTime(Math.sin(x * Math.PI / 2), t, 0.02);
    ["a", "b"].forEach(function (k) {
      var v = $("#filter-" + k).value / 100;
      audio[k.toUpperCase()].f.frequency.setTargetAtTime(110 * Math.pow(20000 / 110, v), t, 0.03);
    });
  }
  function updateLabels() {
    var x = +$("#xfade").value, n = Math.round(x / 25);
    $("#xfade-out").textContent = "A " + "▮▮▮▮▮".slice(0, 4 - n) + "▯" + "▮▮▮▮▮".slice(0, n) + " B";
    ["a", "b"].forEach(function (k) {
      var v = +$("#filter-" + k).value;
      $("#filter-" + k + "-out").textContent = v > 96 ? "buka" : v < 8 ? "tertutup" : v + "%";
    });
    $("#bpm-out").textContent = bpm + " BPM";
    $$(".platter").forEach(function (p) { p.style.animationDuration = (120 / bpm).toFixed(2) + "s"; });
  }
  ["xfade", "filter-a", "filter-b"].forEach(function (id) {
    $("#" + id).addEventListener("input", function () { applyMix(); updateLabels(); });
  });
  $("#bpm").addEventListener("input", function (e) { bpm = +e.target.value; updateLabels(); });
  updateLabels();

  playBtn.addEventListener("click", function () {
    if (!audio) {
      audio = makeAudio();
      if (!audio) { status.textContent = "Browser ini belum mendukung Web Audio."; return; }
    }
    if (!audio.playing) {
      audio.ctx.resume();
      audio.playing = true; audio.step = 0; audio.beats = [];
      audio.next = audio.ctx.currentTime + 0.06;
      applyMix(); scheduler();
      audio.timer = setInterval(scheduler, 25);
      deckui.classList.add("on");
      playBtn.setAttribute("aria-pressed", "true"); $(".play-txt", playBtn).textContent = "Hentikan";
      status.textContent = "Sedang bunyi. Geser crossfader ke B, lalu tutup filter A pelan-pelan.";
    } else {
      clearInterval(audio.timer); audio.playing = false; audio.beats = [];
      audio.ctx.suspend();
      deckui.classList.remove("on");
      playBtn.setAttribute("aria-pressed", "false"); $(".play-txt", playBtn).textContent = "Nyalakan";
      status.textContent = "Berhenti. Mau belajar transisi yang beneran? Cek kelas Pemula.";
    }
  });

  function hitPad(name) {
    var b = $('.pad[data-pad="' + name + '"]');
    if (b) { b.classList.add("hit"); setTimeout(function () { b.classList.remove("hit"); }, 140); }
    if (!audio || !audio.playing) { status.textContent = "Nyalakan deck dulu, baru pad-nya bunyi."; return; }
    I[name](audio.ctx.currentTime + 0.005, audio.fx.in);
  }
  $$(".pad").forEach(function (b) { b.addEventListener("click", function () { hitPad(b.dataset.pad); }); });
  document.addEventListener("keydown", function (e) {
    if (/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) && document.activeElement.type !== "range") return;
    var map = { "1": "clap", "2": "stab", "3": "scratch", "4": "riser" };
    if (map[e.key]) hitPad(map[e.key]);
  });

  /* ---------- rental builder ---------- */
  var picked = { ctrl2: true, monitor: true }, durasi = D.durasiRental[0];
  $("#rental-list").innerHTML = D.rental.map(function (r) {
    return '<label class="ritem" for="r-' + r.id + '">' +
      '<input type="checkbox" id="r-' + r.id + '" value="' + r.id + '"' + (picked[r.id] ? " checked" : "") + ">" +
      '<span class="ritem-name">' + esc(r.nama) + '<span class="ritem-cat">' + esc(r.kategori) + "</span></span>" +
      '<span class="ritem-price">' + val(r.harga) + "</span></label>";
  }).join("");
  $("#durasi").innerHTML = D.durasiRental.map(function (d, i) {
    return '<button type="button" class="chip" role="radio" aria-checked="' + (i === 0) + '" tabindex="' + (i === 0 ? 0 : -1) + '">' + esc(d) + "</button>";
  }).join("");

  function tanggalID(v) {
    if (!v) return "(belum dipilih)";
    var d = new Date(v + "T00:00:00");
    if (isNaN(d)) return v;
    try { return d.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }); }
    catch (err) { return v; }
  }
  function buildMsg() {
    var items = D.rental.filter(function (r) { return picked[r.id]; });
    var nama = $("#nama").value.trim();
    var lines = ["Halo Pop Lab! Aku mau tanya rental alat:"];
    if (items.length) items.forEach(function (r) { lines.push("• " + r.nama); });
    else lines.push("• (pilih alat dulu di daftar)");
    lines.push("", "Durasi: " + durasi, "Tanggal: " + tanggalID($("#tanggal").value));
    if (nama) lines.push("Nama: " + nama);
    lines.push("", "Masih tersedia? Berapa totalnya?");
    $("#pesan").textContent = lines.join("\n");
  }
  $("#rental-list").addEventListener("change", function (e) { picked[e.target.value] = e.target.checked; buildMsg(); });
  $("#durasi").addEventListener("click", function (e) {
    var b = e.target.closest(".chip"); if (!b) return;
    $$(".chip", $("#durasi")).forEach(function (c) { c.setAttribute("aria-checked", String(c === b)); c.tabIndex = c === b ? 0 : -1; });
    durasi = b.textContent; buildMsg();
  });
  $("#durasi").addEventListener("keydown", function (e) {
    var all = $$(".chip", $("#durasi")), i = all.indexOf(document.activeElement);
    var n = e.key === "ArrowRight" || e.key === "ArrowDown" ? i + 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? i - 1 : null;
    if (n === null || i < 0) return;
    e.preventDefault(); n = (n + all.length) % all.length; all[n].focus(); all[n].click();
  });
  $("#tanggal").addEventListener("input", buildMsg);
  $("#nama").addEventListener("input", buildMsg);
  $("#rental-form").addEventListener("submit", function (e) { e.preventDefault(); });
  buildMsg();

  $("#salin").addEventListener("click", function () {
    var msg = $("#salin-msg"), text = $("#pesan").textContent;
    function selectIt() {
      var r = document.createRange(); r.selectNodeContents($("#pesan"));
      var s = getSelection(); s.removeAllRanges(); s.addRange(r);
      msg.textContent = "Teks sudah diblok. Tekan Ctrl+C (atau ⌘+C) untuk menyalin.";
    }
    try {
      navigator.clipboard.writeText(text).then(function () {
        msg.textContent = "Pesan tersalin. Tempel di DM Instagram @poplab97.";
      }, selectIt);
    } catch (err) { selectIt(); }
  });

  showKelas(0);
  requestAnimationFrame(frame);
})();
