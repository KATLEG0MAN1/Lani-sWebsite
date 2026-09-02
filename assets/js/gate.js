/* ============================================================
   LANI COLORS — THE GATE
   A full sheet of his orange covers the screen. Swipe up and it
   drains off the top: the trailing edge stretches into tongues of
   liquid, they thin out, snap, and the beads fall away.

   Scroll position drives everything — there is no timeline. Swipe
   back down and the water pours back in.
   ============================================================ */
(() => {
  'use strict';

  const gate   = document.getElementById('gate');
  const canvas = document.getElementById('gateCanvas');
  const spacer = document.getElementById('gateScroll');
  const note   = document.getElementById('gateNote');
  const mark   = document.getElementById('markDownload');
  const nav    = document.getElementById('nav');
  if (!gate || !canvas) return;

  const ctx = canvas.getContext('2d');
  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;

  /* Start at the top so the gate is never skipped — browsers restore
     scroll after load, so reset on both beats.

     Unless the visitor arrived on a release link (…/#thank-god): that
     is a deliberate destination, and forcing them to the top would
     throw away the thing they followed the link for. */
  const deepLink = location.hash.length > 1;
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (!deepLink) {
    const toTop = () => scrollTo(0, 0);
    toTop();
    addEventListener('load', toTop, { once: true });
  }

  let W = 0, H = 0, dpr = 1;
  function size() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    build();
  }

  /* ── the liquid edge ──────────────────────────────────────
     A row of tongues hanging off the bottom of the sheet. Each
     has its own width and its own appetite for stretching, so
     the edge never reads as a repeating pattern.              */
  let drips = [], beads = [];

  const rnd = (a, b) => a + Math.random() * (b - a);

  function build() {
    const count = Math.max(5, Math.round(W / 150));
    drips = Array.from({ length: count }, (_, i) => ({
      x: (i + rnd(0.15, 0.85)) / count,   // normalised, jittered off the grid
      w: rnd(55, 150),                    // half-width in px — tongues, not spikes
      len: 0,
      /* Skewed hard towards nothing: draining water is mostly a level
         edge with two or three heavy runs, never an even sawtooth. */
      greed: Math.pow(Math.random(), 2.4),
      snap: rnd(0.5, 0.95),               // how far it stretches before it breaks
      lag: rnd(0.06, 0.14),               // each one answers the gesture at its own rate
    }));
    beads = [];
  }

  /* ── scroll → progress ───────────────────────────────────── */
  const drain = () => Math.max(1, spacer ? spacer.offsetHeight : innerHeight * 1.3);
  let p = 0, shownP = 0, vel = 0;

  const smooth = (t) => t * t * (3 - 2 * t);
  const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

  function readScroll() {
    p = clamp01(scrollY / drain());
  }

  /* ── paint ───────────────────────────────────────────────── */
  let t = 0;

  function paint() {
    ctx.clearRect(0, 0, W, H);
    if (shownP >= 0.999) return;

    /* The sheet's bottom edge. At rest it sits below the viewport so
       the ripple never exposes a seam along the bottom of the screen. */
    const base = (H + 70) * (1 - shownP);
    /* the edge only starts moving once the sheet is actually lifting */
    const edgeAmp = Math.min(1, shownP * 5);

    /* Tongues grow most in the middle of the drain — a full sheet
       has nothing to hang off, a nearly-gone one has no body left.
       A hard pull on the scroll wheel stretches them further.      */
    const env = Math.sin(Math.PI * clamp01(shownP)) ** 0.7;
    const pull = Math.min(Math.abs(vel) * 700, 200);
    const maxLen = H * 0.42;

    for (const d of drips) {
      /* greed is cubed into the pull as well, so a hard swipe lengthens
         the heavy runs and barely touches the rest */
      const target = env * d.greed * maxLen + pull * d.greed * d.greed;
      d.len += (target - d.len) * d.lag;

      /* stretched past its limit: a bead pinches off and falls */
      const limit = maxLen * d.snap;
      if (d.len > limit && Math.random() < 0.07) {
        beads.push({
          x: d.x * W + rnd(-8, 8),
          y: base + d.len * 1.5,
          vy: rnd(1.6, 4.2),
          r: Math.max(3, d.w * rnd(0.07, 0.13)),
          life: 1,
        });
        d.len *= 0.42;
      }
    }

    const wave = (x) => edgeAmp *
      (6 * Math.sin(x * 0.011 + t * 1.3) + 4 * Math.sin(x * 0.026 - t * 2.0));

    const dripAt = (x) => {
      let y = 0;
      for (const d of drips) {
        const dx = x - d.x * W;
        if (dx < -d.w || dx > d.w) continue;
        const r = Math.abs(dx) / d.w;
        /* the body of the tongue: wide where it leaves the sheet */
        y += d.len * Math.cos(r * Math.PI * 0.5) ** 1.8;
        /* and a thin runner down its centre, which is what actually drips */
        y += d.len * 0.5 * Math.cos(Math.min(1, r * 3.4) * Math.PI * 0.5) ** 3;
      }
      return y;
    };

    /* trace the sheet: off-screen at the top, liquid along the bottom */
    ctx.beginPath();
    ctx.moveTo(0, -60);
    ctx.lineTo(W, -60);
    const step = W > 900 ? 6 : 4;
    for (let x = W; x >= -step; x -= step) {
      const xx = Math.max(0, x);
      ctx.lineTo(xx, base + wave(xx) + dripAt(xx));
    }
    ctx.closePath();

    /* Body of the sheet, built the way the photograph is lit: a flat
       saturated floor, darkening towards the edges, with one hot pool
       of light sitting off-centre. */
    ctx.save();
    ctx.clip();

    const g = ctx.createLinearGradient(0, base - H, 0, base + maxLen);
    g.addColorStop(0.00, '#F0651A');
    g.addColorStop(0.60, '#EC5E14');
    g.addColorStop(0.90, '#C6440D');
    g.addColorStop(1.00, '#9E2E06');
    ctx.fillStyle = g;
    ctx.fillRect(0, base - H - 80, W, H + maxLen + 160);

    /* the spotlight pool */
    const poolY = base - H * 0.62;
    const pool = ctx.createRadialGradient(W * 0.40, poolY, 0, W * 0.40, poolY, H * 0.72);
    pool.addColorStop(0.00, 'rgba(250,180,92,.85)');
    pool.addColorStop(0.40, 'rgba(246,140,50,.45)');
    pool.addColorStop(1.00, 'rgba(246,140,50,0)');
    ctx.fillStyle = pool;
    ctx.fillRect(0, base - H - 80, W, H + maxLen + 160);

    /* the burnt corners */
    const vig = ctx.createRadialGradient(W * 0.45, poolY, H * 0.30, W * 0.45, poolY, H * 1.15);
    vig.addColorStop(0, 'rgba(90,26,4,0)');
    vig.addColorStop(1, 'rgba(90,26,4,.55)');
    ctx.fillStyle = vig;
    ctx.fillRect(0, base - H - 80, W, H + maxLen + 160);

    /* flow lines running down inside the sheet */
    ctx.globalCompositeOperation = 'overlay';
    for (let i = 0; i < 10; i++) {
      const x = ((i * 137.5) % W);
      const off = (t * (60 + (i % 5) * 34)) % (H + 400) - 200;
      const s = ctx.createLinearGradient(0, base - 400 + off, 0, base + off);
      s.addColorStop(0, 'rgba(255,220,170,0)');
      s.addColorStop(0.6, 'rgba(255,225,180,.055)');
      s.addColorStop(1, 'rgba(255,225,180,0)');
      ctx.fillStyle = s;
      ctx.fillRect(x, base - 400 + off, 22 + (i % 4) * 14, 400);
    }
    ctx.restore();

    /* the meniscus — a hot rim where the water breaks the light */
    ctx.beginPath();
    for (let x = 0; x <= W; x += step) {
      const y = base + wave(x) + dripAt(x);
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.strokeStyle = 'rgba(255,225,160,.6)';
    ctx.lineWidth = 2;
    ctx.shadowColor = 'rgba(255,160,60,.85)';
    ctx.shadowBlur = 18;
    ctx.stroke();
    ctx.shadowBlur = 0;

    /* beads that broke away */
    for (let i = beads.length - 1; i >= 0; i--) {
      const b = beads[i];
      b.vy += 0.42;
      b.y += b.vy;
      b.life -= 0.006;
      if (b.y - b.r > H || b.life <= 0) { beads.splice(i, 1); continue; }

      ctx.globalAlpha = Math.max(0, b.life);
      ctx.beginPath();
      /* squashed by its own fall — a teardrop, not a marble */
      ctx.ellipse(b.x, b.y, b.r * 0.82, b.r * (1 + Math.min(b.vy / 9, 0.85)), 0, 0, Math.PI * 2);
      ctx.fillStyle = '#EC5C13';
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  /* ── loop ────────────────────────────────────────────────── */
  let last = performance.now();

  function frame(now) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    t += dt;

    const prev = shownP;
    /* ease towards the scroll position so the water lags the gesture */
    shownP += (p - shownP) * (REDUCED ? 1 : 0.14);
    vel = shownP - prev;

    paint();

    /* the mark and hint clear out well before the sheet does */
    const fade = 1 - clamp01(smooth(clamp01(shownP / 0.45)));
    root.style.setProperty('--gate-o', fade.toFixed(3));

    gate.classList.toggle('is-open', shownP > 0.06);
    gate.classList.toggle('is-gone', shownP >= 0.999 && p >= 0.999);
    if (nav) nav.classList.toggle('is-lit', shownP > 0.5);

    requestAnimationFrame(frame);
  }

  addEventListener('scroll', readScroll, { passive: true });
  addEventListener('resize', size);
  size();
  readScroll();
  shownP = p;
  requestAnimationFrame(frame);

  /* ── the mark ────────────────────────────────────────────
     Points at the pack. Until that zip is committed, say so
     rather than handing over a 404.                          */
  if (mark) {
    let ready = false;
    fetch(mark.getAttribute('href'), { method: 'HEAD' })
      .then((r) => { ready = r.ok; })
      .catch(() => { ready = false; });

    mark.addEventListener('click', (e) => {
      if (ready) return;                       // let the download happen
      e.preventDefault();
      note.textContent = 'Pack drops soon';
      clearTimeout(mark._t);
      mark._t = setTimeout(() => { note.textContent = ''; }, 2400);
    });
  }
})();
