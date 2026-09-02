/* ============================================================
   LANI COLORS — site engine
   Everything on the page is rendered from data/releases.json.
   Audio is Apple Music's public 30-second preview stream.
   ============================================================ */
(() => {
  'use strict';

  /* ─────────────────────────────────────────────────────────
     WHERE THE IDEAS FORM POSTS
     GitHub Pages is static — there is no server to receive a
     form, so this has to go to a form service. Paste the
     endpoint here and the form starts working; see README.
     Left empty, the section shows an Instagram route instead
     of a form that silently swallows what people write.
     ───────────────────────────────────────────────────────── */
  const IDEAS_ENDPOINT = '';

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const state = {
    releases: [],
    filter: 'all',
    query: '',
    queue: [],     // [{title, preview, release}]
    index: -1,
  };

  /* ── helpers ─────────────────────────────────────────── */
  const mmss = (s) => {
    if (!isFinite(s)) return '0:00';
    const m = Math.floor(s / 60);
    return `${m}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  };

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const typeLabel = (t) => ({ album: 'Album', ep: 'EP', single: 'Single' }[t] || t);

  /* ── the room follows the cursor ──────────────────────── */
  const spot = $('#spot');
  if (spot && !REDUCED && matchMedia('(pointer: fine)').matches) {
    let tx = 50, ty = 34, cx = 50, cy = 34;
    addEventListener('pointermove', (e) => {
      tx = (e.clientX / innerWidth) * 100;
      ty = (e.clientY / innerHeight) * 100;
    }, { passive: true });
    (function drift() {
      cx += (tx - cx) * 0.045;
      cy += (ty - cy) * 0.045;
      spot.style.setProperty('--mx', cx.toFixed(2) + '%');
      spot.style.setProperty('--my', cy.toFixed(2) + '%');
      requestAnimationFrame(drift);
    })();
  }

  /* ── nav shrinks onto the background once you leave the hero ── */
  const nav = $('#nav');
  addEventListener('scroll', () => {
    nav.classList.toggle('is-stuck', scrollY > 60);
  }, { passive: true });

  /* ── the photograph ───────────────────────────────────
     assets/img/hero.jpg is the orange-room shot. When it is
     there it takes the whole hero and the drawn tube stands
     down; without it the CSS light carries the frame alone. */
  (() => {
    const fig = $('#heroFigure');
    const probe = new Image();
    probe.onload = () => {
      fig.style.backgroundImage = `url("${probe.src}")`;
      $('.hero').classList.add('has-photo');
      requestAnimationFrame(() => fig.classList.add('is-on'));
    };
    probe.src = 'assets/img/hero.jpg';
  })();

  /* ── reveal on scroll ─────────────────────────────────── */
  const io = REDUCED ? null : new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

  const reveal = (el, i = 0) => {
    if (!io) { el.classList.add('is-in'); return; }
    el.style.transitionDelay = `${Math.min(i, 8) * 55}ms`;
    io.observe(el);
  };

  /* ══════════════════════════════════════════════════════
     AUDIO
     ══════════════════════════════════════════════════════ */
  const audio = new Audio();
  audio.preload = 'none';

  const player = $('#player');
  const el = {
    art: $('#pArt'), track: $('#pTrack'), from: $('#pFrom'), time: $('#pTime'),
    play: $('#pPlay'), prev: $('#pPrev'), next: $('#pNext'), close: $('#pClose'),
    seek: $('#seek'), fill: $('#seekFill'),
  };

  const ICON_PLAY  = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
  const ICON_PAUSE = '<svg viewBox="0 0 24 24"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>';

  function playQueue(queue, index = 0) {
    if (!queue.length) return;
    state.queue = queue;
    state.index = index;
    const t = queue[index];
    if (!t || !t.preview) return;

    audio.src = t.preview;
    audio.play().catch(() => {/* autoplay blocked — the UI stays honest */});

    player.hidden = false;
    document.body.classList.add('has-player');
    el.art.src = t.release.cover;
    el.art.alt = `${t.release.title} cover`;
    el.track.textContent = t.title;
    el.from.textContent = `${t.release.title} · ${t.release.year}`;
    markPlaying();
  }

  function markPlaying() {
    const cur = state.queue[state.index];
    $$('.track').forEach((n) => {
      const on = cur && n.dataset.preview === cur.preview;
      n.classList.toggle('is-playing', !!on);
    });
  }

  const step = (d) => {
    const n = state.index + d;
    if (n >= 0 && n < state.queue.length) playQueue(state.queue, n);
  };

  el.play.addEventListener('click', () => (audio.paused ? audio.play() : audio.pause()));
  el.prev.addEventListener('click', () => step(-1));
  el.next.addEventListener('click', () => step(1));
  el.close.addEventListener('click', () => {
    audio.pause();
    player.hidden = true;
    document.body.classList.remove('has-player');
    state.index = -1;
    markPlaying();
  });

  audio.addEventListener('play',  () => { el.play.innerHTML = ICON_PAUSE; el.play.setAttribute('aria-label', 'Pause'); player.classList.add('is-playing'); });
  audio.addEventListener('pause', () => { el.play.innerHTML = ICON_PLAY;  el.play.setAttribute('aria-label', 'Play');  player.classList.remove('is-playing'); });
  audio.addEventListener('ended', () => step(1));
  audio.addEventListener('timeupdate', () => {
    const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
    el.fill.style.width = pct + '%';
    el.seek.setAttribute('aria-valuenow', Math.round(pct));
    el.time.textContent = `${mmss(audio.currentTime)} / ${mmss(audio.duration || 30)}`;
  });

  const seekTo = (clientX) => {
    const r = el.seek.getBoundingClientRect();
    if (audio.duration) audio.currentTime = ((clientX - r.left) / r.width) * audio.duration;
  };
  el.seek.addEventListener('click', (e) => seekTo(e.clientX));
  el.seek.addEventListener('keydown', (e) => {
    if (!audio.duration) return;
    if (e.key === 'ArrowRight') { audio.currentTime = Math.min(audio.duration, audio.currentTime + 2); e.preventDefault(); }
    if (e.key === 'ArrowLeft')  { audio.currentTime = Math.max(0, audio.currentTime - 2); e.preventDefault(); }
  });

  addEventListener('keydown', (e) => {
    const typing = /^(INPUT|TEXTAREA)$/.test(e.target.tagName);
    if (typing || player.hidden) return;
    if (e.code === 'Space') { e.preventDefault(); audio.paused ? audio.play() : audio.pause(); }
    if (e.key === 'ArrowRight' && e.altKey) step(1);
    if (e.key === 'ArrowLeft'  && e.altKey) step(-1);
  });

  /* build a play queue out of a release */
  const queueOf = (rel) =>
    rel.tracks.filter((t) => t.preview).map((t) => ({ title: t.title, preview: t.preview, release: rel }));

  /* ══════════════════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════════════════ */
  function tracklist(rel) {
    return `<ul class="tracks">${rel.tracks.map((t, i) => `
      <li><button class="track" type="button" data-rel="${esc(rel.slug)}" data-i="${i}"
                  data-preview="${esc(t.preview || '')}" ${t.preview ? '' : 'disabled'}>
        <span class="track__n">${t.n}</span>
        <span class="track__name">${esc(t.title)}</span>
        <span class="track__dur">${mmss(t.seconds)}</span>
      </button></li>`).join('')}</ul>`;
  }

  function renderTicker() {
    const once = state.releases.map((r) => `${r.title} <b>${r.year}</b>`).join(' &nbsp;✦&nbsp; ');
    // doubled so the -50% translate loops seamlessly
    $('#tickerRail').innerHTML = `<span>${once}</span><span>${once}</span>`;
  }

  function renderLatest() {
    const rel = state.releases.find((r) => r.type !== 'single' && r.artist === 'Lani Colors')
             || state.releases[0];
    if (!rel) return;

    $('#latestBody').innerHTML = `
      <article class="feature">
        <div class="feature__art">
          <img src="${esc(rel.cover)}" alt="${esc(rel.title)} cover art" width="600" height="600">
        </div>
        <div>
          <span class="feature__tag">${typeLabel(rel.type)} · ${rel.year}</span>
          <h3 class="feature__title">${esc(rel.title)}</h3>
          <p class="feature__meta">
            <b>${rel.trackCount}</b> tracks &nbsp;·&nbsp; ${esc(rel.genre)}
            &nbsp;·&nbsp; ${esc(rel.label || 'Independent')}
            &nbsp;·&nbsp; released ${esc(rel.released)}
          </p>
          ${tracklist(rel)}
        </div>
      </article>`;

    $('#playLatest').addEventListener('click', () => playQueue(queueOf(rel), 0));
  }

  function matches(rel) {
    const f = state.filter;
    if (f === 'album' && !(rel.type === 'album' || rel.type === 'ep')) return false;
    if (f === 'single' && rel.type !== 'single') return false;
    if (!state.query) return true;
    const q = state.query.toLowerCase();
    return rel.title.toLowerCase().includes(q)
        || rel.artist.toLowerCase().includes(q)
        || rel.year.includes(q)
        || rel.tracks.some((t) => t.title.toLowerCase().includes(q));
  }

  function renderGrid() {
    const list = state.releases.filter(matches);
    const grid = $('#grid');

    grid.innerHTML = list.map((r) => `
      <article class="card" data-slug="${esc(r.slug)}" tabindex="0" role="button"
               aria-label="${esc(r.title)}, ${typeLabel(r.type)}, ${r.year}">
        <div class="card__shot">
          <span class="card__type">${typeLabel(r.type)}</span>
          <img src="${esc(r.cover)}" alt="${esc(r.title)} cover art" loading="lazy" width="430" height="430">
          <span class="card__play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span>
        </div>
        <h3 class="card__name">${esc(r.title)}</h3>
        <p class="card__sub">${r.year} · ${r.trackCount} track${r.trackCount > 1 ? 's' : ''}</p>
      </article>`).join('');

    $$('.card', grid).forEach((c, i) => reveal(c, i));
    $('#empty').hidden = list.length > 0;
    $('#relCount').textContent = `${list.length} of ${state.releases.length}`;
  }

  /* ── detail sheet ─────────────────────────────────────── */
  const sheet = $('#sheet');
  let lastFocus = null;

  function openSheet(slug, push = true) {
    const rel = state.releases.find((r) => r.slug === slug);
    if (!rel) return;
    lastFocus = document.activeElement;

    const links = [
      rel.links.spotify   && `<a class="btn" href="${esc(rel.links.spotify)}" target="_blank" rel="noopener">Spotify</a>`,
      rel.links.appleMusic && `<a class="btn" href="${esc(rel.links.appleMusic)}" target="_blank" rel="noopener">Apple Music</a>`,
      `<button class="btn btn--hot" type="button" id="sheetPlay">Play preview</button>`,
    ].filter(Boolean).join('');

    $('#sheetBody').innerHTML = `
      <img class="sheet__art" src="${esc(rel.cover)}" alt="${esc(rel.title)} cover art" width="320" height="320">
      <h2 class="sheet__title" id="sheetTitle">${esc(rel.title)}</h2>
      <p class="sheet__meta">
        ${esc(rel.artist)} &nbsp;·&nbsp; ${typeLabel(rel.type)} &nbsp;·&nbsp; ${rel.year}
        &nbsp;·&nbsp; ${rel.trackCount} track${rel.trackCount > 1 ? 's' : ''}${rel.explicit ? ' &nbsp;·&nbsp; Explicit' : ''}
        <br>${esc(rel.label || 'Independent')}
      </p>
      <div class="sheet__links">${links}</div>
      ${tracklist(rel)}`;

    sheet.hidden = false;
    document.body.style.overflow = 'hidden';
    $('.sheet__x').focus();
    $('#sheetPlay').addEventListener('click', () => playQueue(queueOf(rel), 0));
    markPlaying();
    if (push) history.pushState({ slug }, '', '#' + slug);
  }

  function closeSheet(pop = true) {
    sheet.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
    if (pop && location.hash) history.pushState({}, '', location.pathname);
  }

  sheet.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) closeSheet(); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && !sheet.hidden) closeSheet(); });
  addEventListener('popstate', () => {
    const slug = location.hash.slice(1);
    if (slug && state.releases.some((r) => r.slug === slug)) openSheet(slug, false);
    else closeSheet(false);
  });

  /* ── delegated interaction ────────────────────────────── */
  document.addEventListener('click', (e) => {
    const trackBtn = e.target.closest('.track');
    if (trackBtn && !trackBtn.disabled) {
      const rel = state.releases.find((r) => r.slug === trackBtn.dataset.rel);
      if (rel) {
        const q = queueOf(rel);
        const i = q.findIndex((t) => t.preview === trackBtn.dataset.preview);
        playQueue(q, Math.max(0, i));
      }
      return;
    }
    const card = e.target.closest('.card');
    if (card) {
      // the round play button starts the record; anywhere else opens the sleeve
      if (e.target.closest('.card__play')) {
        const rel = state.releases.find((r) => r.slug === card.dataset.slug);
        if (rel) playQueue(queueOf(rel), 0);
      } else {
        openSheet(card.dataset.slug);
      }
    }
  });

  document.addEventListener('keydown', (e) => {
    const card = e.target.closest('.card');
    if (card && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openSheet(card.dataset.slug); }
  });

  $$('.chip').forEach((chip) => chip.addEventListener('click', () => {
    $$('.chip').forEach((c) => { c.classList.remove('is-on'); c.setAttribute('aria-selected', 'false'); });
    chip.classList.add('is-on');
    chip.setAttribute('aria-selected', 'true');
    state.filter = chip.dataset.filter;
    renderGrid();
  }));

  let debounce;
  $('#search').addEventListener('input', (e) => {
    clearTimeout(debounce);
    debounce = setTimeout(() => { state.query = e.target.value.trim(); renderGrid(); }, 120);
  });
  $('#clearSearch').addEventListener('click', () => {
    $('#search').value = ''; state.query = ''; renderGrid(); $('#search').focus();
  });

  /* ══════════════════════════════════════════════════════
     BOOT
     ══════════════════════════════════════════════════════ */
  fetch('data/releases.json')
    .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then((data) => {
      state.releases = data.releases || [];
      renderTicker();
      renderLatest();
      renderGrid();
      $('#footCount').textContent =
        `${state.releases.length} releases · ${state.releases.reduce((n, r) => n + r.trackCount, 0)} tracks`;
      $('#footUpdated').textContent = data.updated || '—';

      const years = state.releases.map((r) => +r.year).filter(Boolean);
      const tracks = state.releases.reduce((n, r) => n + r.trackCount, 0);
      $('#infoStats').innerHTML = `
        <div><dt>Releases</dt><dd>${state.releases.length}</dd></div>
        <div><dt>Tracks</dt><dd>${tracks}</dd></div>
        <div><dt>Active</dt><dd>${Math.min(...years)}&ndash;${Math.max(...years)}</dd></div>`;

      const slug = location.hash.slice(1);
      if (slug && state.releases.some((r) => r.slug === slug)) openSheet(slug, false);
    })
    .catch(() => {
      $('#latestBody').innerHTML =
        `<p class="loading">Couldn't load the catalogue. If you opened this file directly,
         serve the folder instead — <code>npx serve .</code> — since fetch() needs http.</p>`;
    });
  /* ══════════════════════════════════════════════════════
     IDEAS
     ══════════════════════════════════════════════════════ */
  (() => {
    const form = $('#ideasForm');
    if (!form) return;

    const status = $('#ideaStatus');
    const send = $('#ideaSend');
    const body = $('#ideaBody');

    /* Nothing to post to yet — so don't take people's writing and
       drop it. Point them somewhere that actually reaches him. */
    if (!IDEAS_ENDPOINT) {
      const box = document.createElement('div');
      box.className = 'ideas__fallback';
      box.innerHTML = `
        <p>The ideas box isn't hooked up yet. Until it is, send it straight to him —
           he reads his DMs.</p>
        <a class="btn btn--hot" href="https://www.instagram.com/lani_colors/"
           target="_blank" rel="noopener">Message @lani_colors</a>`;
      form.replaceWith(box);
      return;
    }

    const say = (msg, kind) => {
      status.textContent = msg;
      status.className = 'ideas__status' + (kind ? ' is-' + kind : '');
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (form._honey && form._honey.value) return;   // a bot filled the trap

      const field = body.closest('.field');
      if (!body.value.trim()) {
        field.classList.add('is-bad');
        body.focus();
        say('Write the idea first.', 'bad');
        return;
      }
      field.classList.remove('is-bad');

      send.disabled = true;
      say('Sending…');

      try {
        const res = await fetch(IDEAS_ENDPOINT, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: new FormData(form),
        });
        if (!res.ok) throw new Error(res.status);
        form.reset();
        say('Sent. He’ll see it.', 'good');
      } catch {
        say('That didn’t send. Try again, or DM @lani_colors.', 'bad');
      } finally {
        send.disabled = false;
      }
    });

    body.addEventListener('input', () => {
      if (body.value.trim()) body.closest('.field').classList.remove('is-bad');
    });
  })();
})();
