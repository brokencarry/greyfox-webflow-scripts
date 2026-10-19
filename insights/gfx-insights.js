/*!
 * Grey Fox · gfx Insights (Flow 3), the Insights layer on the shared core + the inner-page layer (pages/gfx-pages.js).
 * insights 1.0.0 · 2026-10-20 · Webflow pages "Insights v2 (Claude build)" (/insights-v2) and "Insights v2 article (Claude
 * build)" (/insights-v2-article): ONE script, ONE stylesheet for both.
 *
 * WHAT IT IS
 *   What the approved local Insights (prototype/insights/index.html + article.html + insights.js, Flow 3) adds to the inner
 *   pages (pages/gfx-pages.js plays the close: its rise, the action's arrival, the house underline, footer I's hand-off):
 *   - THE TURN, one per page: the field crossfades paper -> #111112 (the core's timed turn, gf-turn.js) as the turn's empty
 *     space (gi-turn) passes 90 % of the screen; the index's dark chapter is the close, the article's is "Next article",
 *     "More from Grey Fox" and the close. The local stylesheet's dark tokens follow html.gi-dark, set with the core's tone;
 *   - the opening: the title rises line by line (1.6 s, expo out), the words after it follow, the hairline draws;
 *   - the plates (the drawn covers in their green cut-corner frame) settle 1.04 -> 1 as they come up the screen, by the
 *     scroll; the collage's tiles rise their last few pixels one after another; a pull quote's rule draws as it arrives;
 *     the dark chapter's headings rise once;
 *   - the article: the green reading-progress hairline (top and sidebar), the contents marking the section being read (both
 *     lists: the sidebar's and the phone's), a section's link gliding there and moving focus to its heading; share (the
 *     four marks drawn here; copy the link); the sidebar's "Start a conversation" carries the house underline (gfArrow),
 *     stepping back while the close is on screen (one arrow in view);
 *   - the index: the topics filter the list (pressed-state buttons, a FLIP crossfade of about 400 ms, the count announced,
 *     ?topic= kept in the address; #all lands under the bar).
 *   Nothing in the reading text ever moves.
 * THE DOM: Webflow's own (native elements, one gfx- class each, data-o = the local classes; covers = Embeds holding the
 *   local span.gi-plate-in + svg). See audit/webflow-build/f3-insights/PLAN-writes.md.
 * Reduced motion: everything settled, the turn a 0.15 s step; the contents and the progress still follow the reading.
 */
(function () {
  'use strict';
  var W = window, D = document, gfx = W.gfx;
  if (!gfx || !gfx.pages || W.__gfxInsights) return;
  W.__gfxInsights = '1.0.0';
  const P = gfx.pages, O = P.O, H = D.documentElement, $ = gfx.$, $$ = gfx.$$, safe = gfx.safe, REDUCE = gfx.REDUCE;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const eo = t => 1 - Math.pow(1 - t, 3);
  const EXPO = 'expo.out';
  // the local page's html class (the ported stylesheet's tokens live on html.gi-html)
  H.classList.add('gi-html');
  let gsap = null, anim = false;

  /* ========================= the field: the core's, with the Insights rooms and the local turn ========================= */
  // (pages.run gives the core an empty room list on these pages: no ow-room. The rooms are named here once the DOM is in.)
  let FIELD = null;
  const turnAt = (ym, c) => { const t = $(O('gi-turn')); return t ? c.docTop(t) + t.offsetHeight - c.vh * 0.9 : ym; };
  const rooms = () => {
    const L = el => el && { el, native: 'L', tone: 'L', noInk: true }, Dk = (el, x) => el && Object.assign({ el, native: 'D', tone: 'D', noInk: true }, x || {});
    const close = $(O('gi-close')), last = close && { opaque: true, foot: true };
    if ($(O('gi-index'))) return [L($(O('gi-open'))), L($(O('gi-collage'))), L($(O('gi-arch'))), Dk(close, Object.assign({ turnAt }, last))].filter(Boolean);
    return [L($(O('gi-story'))), Dk($(O('gi-next')), { turnAt }), Dk($(O('gi-more'))), Dk(close, last)].filter(Boolean);
  };
  // the local inks follow html.gi-dark: set with the core's tone (it flips at the turn's ink moment)
  const syncDark = () => { const on = H.classList.contains('gfx-tone-dark'); if (H.classList.contains('gi-dark') !== on) H.classList.toggle('gi-dark', on); };
  if ('MutationObserver' in W) new MutationObserver(syncDark).observe(H, { attributes: true, attributeFilter: ['class'] });

  /* ========================= lines: a heading split into its rendered lines, each rising out of its own mask ========================= */
  const splitLines = el => {
    const orig = el.innerHTML, words = [];
    const walk = node => [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = D.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(p => { if (!p) return; if (/^\s+$/.test(p)) frag.append(D.createTextNode(p)); else { const s = D.createElement('span'); s.className = 'gi-w'; s.textContent = p; words.push(s); frag.append(s); } });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && (n.matches(O('gi-nb')) || n.classList.contains('gi-nb'))) words.push(n);
      else if (n.nodeType === 1) walk(n);
    });
    walk(el);
    const rws = [];
    words.forEach(w => { const t = w.offsetTop; const r = rws.find(r => Math.abs(r.t - t) < 4); if (r) r.w.push(w); else rws.push({ t, w: [w] }); });
    el.innerHTML = rws.map(r => `<span class="gi-ln"><span>${r.w.map(w => w.outerHTML).join(' ')}</span></span>`).join(' ');
    return { lines: $$('.gi-ln > span', el), restore: () => { el.innerHTML = orig; } };
  };
  const rise = (el, delay) => {
    if (!anim) return;
    const { lines, restore } = splitLines(el);
    gsap.fromTo(lines, { yPercent: 108 }, { yPercent: 0, duration: 1.6, ease: EXPO, stagger: 0.12, delay: delay || 0, onComplete: restore });
  };
  const fonts = () => (D.fonts && D.fonts.ready) || Promise.resolve();

  /* ========================= the opening, the dark chapter's headings, the pull quotes ========================= */
  function opening() {
    const after = $$('[data-gi-after]'), draws = $$('[data-gi-draw]');
    after.forEach(e => e.classList.add('gi-pre')); gsap.set(draws, { scaleX: 0 });
    fonts().then(() => {
      const title = $('[data-gi-lines]'); if (title) rise(title, 0.1);
      after.forEach(e => e.classList.remove('gi-pre'));
      gsap.fromTo(after, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 1.4, ease: EXPO, stagger: 0.12, delay: 0.55, clearProps: 'transform' });
      gsap.to(draws, { scaleX: 1, duration: 1.6, ease: 'power3.inOut', delay: 0.7 });
    });
  }
  function risers() {
    const rs = $$('[data-gi-rise]'); if (!rs.length || !('IntersectionObserver' in W)) return;
    rs.forEach(r => gsap.set(r, { opacity: 0 }));
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting && e.boundingClientRect.top > 0) return;
      io.unobserve(e.target); gsap.set(e.target, { opacity: 1 });
      if (e.boundingClientRect.top < 0) return;           // already passed (a jump): settled
      rise(e.target, 0);
    }), { rootMargin: '0px 0px -12% 0px' });
    fonts().then(() => rs.forEach(r => io.observe(r)));
  }
  function quotes() {
    const pqs = $$('[data-gi-pq] ' + O('gi-pq-rule')); if (!pqs.length || !('IntersectionObserver' in W)) return;
    gsap.set(pqs, { scaleX: 0 });
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting && e.boundingClientRect.top > 0) return;
      io.unobserve(e.target);
      gsap.to(e.target, { scaleX: 1, duration: e.boundingClientRect.top < 0 ? 0 : 1.6, ease: 'power3.inOut' });
    }), { rootMargin: '0px 0px -15% 0px' });
    pqs.forEach(p => io.observe(p));
  }

  /* ========================= the scroll: plates settle, the tiles, the progress, the contents ========================= */
  let req = () => {};
  function scroll() {
    const plates = $$(O('gi-plate-in')), frames = plates.map(p => p.closest(O('gi-plate')) || p.parentElement);
    const tiles = $$('[data-gi-tile]');
    const progs = $$(O('gi-progress') + ' > i, ' + O('gi-aprog') + ' > i'), body = D.getElementById('gi-body');
    const lists = $$(O('gi-toc-l')).map(l => $$('a[href^="#"]', l));
    const secs = (lists[0] || []).map(a => D.getElementById(decodeURIComponent(a.hash.slice(1))));
    let curSec = -1;
    const frame = () => {
      const vh = W.innerHeight;
      const pr = frames.map(f => f.getBoundingClientRect());
      const tr0 = tiles.map(t => t.getBoundingClientRect().top - (parseFloat(t.dataset.giY) || 0));
      const br = progs.length && body ? body.getBoundingClientRect() : null;
      const st = secs.length && secs.every(Boolean) ? secs.map(s => s.getBoundingClientRect().top) : null;
      // the collage settles as it arrives: each tile rises the last few pixels a little after the one before (scroll-linked)
      if (anim) tiles.forEach((t, i) => { const top = tr0[i]; if (top > vh + 80) return; const k = eo(clamp((vh * 0.98 - top) / (vh * 0.62) - i * 0.06)); const y = ((1 - k) * (36 + i * 8)).toFixed(1); t.dataset.giY = y; t.style.transform = +y ? `translate3d(0, ${y}px, 0)` : ''; });
      if (anim) plates.forEach((p, i) => { const r = pr[i]; if (r.bottom < -40 || r.top > vh + 40) return; const k = eo(clamp((vh - r.top) / (vh * 0.8))); p.style.transform = `scale(${(1.04 - 0.04 * k).toFixed(4)})`; });
      if (br) { const t = `scaleX(${clamp((vh * 0.35 - br.top) / Math.max(1, br.height - vh * 0.3)).toFixed(4)})`; progs.forEach(p => { p.style.transform = t; }); }
      if (st) {
        let i = -1; st.forEach((t, k) => { if (t <= vh * 0.33) i = k; });
        if (i !== curSec) { curSec = i; lists.forEach(l => l.forEach((a, k) => k === i ? a.setAttribute('aria-current', 'location') : a.removeAttribute('aria-current'))); }
      }
    };
    let raf = 0; req = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; frame(); }); };
    W.addEventListener('scroll', req, { passive: true }); W.addEventListener('resize', req); W.addEventListener('load', req);
    if (gfx.lenis && gfx.lenis.on) gfx.lenis.on('scroll', req);
    frame(); fonts().then(req);
  }

  /* ========================= contents: a section's link glides there and moves focus to its heading ========================= */
  const navZone = () => 72 + 32;
  const glideTo = (el, focusEl) => {
    const y = Math.max(0, Math.round(el.getBoundingClientRect().top + W.scrollY - navZone()));
    const L = gfx.lenis;
    const done = () => { if (focusEl) { if (!focusEl.hasAttribute('tabindex')) focusEl.setAttribute('tabindex', '-1'); focusEl.focus({ preventScroll: true }); } req(); };
    if (L && !REDUCE) L.scrollTo(y, { duration: 1.2, force: true, onComplete: done });
    else { if (L) L.scrollTo(y, { immediate: true, force: true }); else W.scrollTo(0, y); done(); }
  };
  function contents() {
    $$(O('gi-toc-l')).forEach(l => $$('a[href^="#"]', l).forEach(a => a.addEventListener('click', e => {
      const s = D.getElementById(decodeURIComponent(a.hash.slice(1))); if (!s) return;
      // (and no further: the site's own smooth-scroll would take the anchor too)
      e.preventDefault(); e.stopPropagation(); glideTo(s, $('h2', s));
      try { history.replaceState(null, '', a.hash); } catch (err) { /* */ }
    })));
  }

  /* ========================= share: the four marks (single ink strokes, green on hover), copy the link ========================= */
  const G = d => `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${d}"/></svg>`;
  const GLYPH = {
    in: G('M6.5 10v8M6.5 6.2v.1M10.5 18v-8M10.5 13.6c0-2.3 1.4-3.6 3.3-3.6s3.2 1.2 3.2 3.6V18'),
    x: G('M5.5 5.5l13 13M18.5 5.5l-13 13'),
    fb: G('M14.5 4.5h-1.6a3 3 0 0 0-3 3v12M7.5 11h6.5'),
    copy: G('M10 14l4-4M9 11.5l-2 2a3 3 0 0 0 4.2 4.3l2-2M15 12.5l2-2a3 3 0 0 0-4.2-4.3l-2 2')
  };
  function share() {
    $$('[data-gi-ico]').forEach(a => { const g = GLYPH[a.getAttribute('data-gi-ico')]; if (g && !$('svg', a)) a.insertAdjacentHTML('afterbegin', g); });
    $$('[data-gi-copy]').forEach(b => {
      if (b.tagName !== 'BUTTON') { b.setAttribute('role', 'button'); b.tabIndex = 0; b.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); b.click(); } }); }
      b.addEventListener('click', e => {
        e.preventDefault();
        const box = b.closest(O('gi-share')), note = box && $(O('gi-share-note'), box);
        const done = ok => { if (note) { note.textContent = ok ? 'Link copied.' : b.getAttribute('data-gi-copy'); clearTimeout(b._t); b._t = setTimeout(() => { note.textContent = ''; }, 2600); } };
        try { navigator.clipboard.writeText(b.getAttribute('data-gi-copy')).then(() => done(true), () => done(false)); } catch (err) { done(false); }
      });
    });
  }

  /* ========================= the sidebar's arrow (gfArrow, the house underline) and one arrow in view ========================= */
  function sidebarArrow(still) {
    const A = W.gfArrow; if (!A) return;
    $$(O('gi-scta-a')).forEach(a => { const w = $(O('gi-scta-w'), a); if (!w) return; const m = A.word({ el: w, key: true, host: a, cls: 'gi-line-svg', color: 'var(--gi-green)', auto: !still }); if (still && m && m.still) m.still(); });
    const scta = $('[data-gi-scta]'), closeSec = $(O('gi-close'));
    if (scta && closeSec && 'IntersectionObserver' in W) new IntersectionObserver(es => es.forEach(e => scta.classList.toggle('is-away', e.isIntersecting))).observe(closeSec);
  }

  /* ========================= the index: topics ========================= */
  const topicOf = r => r.getAttribute('data-topic') || '';
  function topics() {
    const list = $(O('gi-list')); if (!list) return;
    const btns = $$(O('gi-topic')), rws = $$(O('gi-row'), list), arch = D.getElementById('all'), note = $('[data-gi-note]');
    const nameOf = t => { const b = btns.find(x => (x.getAttribute('data-topic') || '') === t); const n = b && $(O('gi-topic-n'), b); return n ? n.textContent : ''; };
    let busy = null;
    const apply = (topic, animate) => {
      const want = r => !topic || topicOf(r) === topic;
      btns.forEach(b => b.setAttribute('aria-pressed', String((b.getAttribute('data-topic') || '') === topic)));
      const n = rws.filter(want).length;
      if (note) note.textContent = topic ? `Showing ${n} ${n === 1 ? 'article' : 'articles'} on ${nameOf(topic)}.` : `Showing all ${n} articles.`;
      const g = gsap || W.gsap;
      if (!animate || REDUCE || !g) { rws.forEach(r => { r.hidden = !want(r); if (g) g.set(r, { clearProps: 'opacity,transform' }); }); req(); gfx.refresh && gfx.refresh(); return; }
      if (busy) busy.progress(1);
      const leaving = rws.filter(r => !r.hidden && !want(r)), staying = rws.filter(r => !r.hidden && want(r)), arriving = rws.filter(r => r.hidden && want(r));
      const first = new Map(staying.map(r => [r, r.getBoundingClientRect().top]));
      busy = g.timeline({ onComplete: () => { busy = null; req(); gfx.refresh && gfx.refresh(); } });
      busy.to(leaving, { opacity: 0, duration: 0.16, ease: 'power1.out' })
        .add(() => {
          leaving.forEach(r => { r.hidden = true; g.set(r, { clearProps: 'opacity' }); });
          arriving.forEach(r => { r.hidden = false; });
          staying.forEach(r => { const d = first.get(r) - r.getBoundingClientRect().top; if (d) g.fromTo(r, { y: d }, { y: 0, duration: 0.42, ease: 'power3.out', clearProps: 'transform' }); });
          g.fromTo(arriving, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.42, ease: 'power3.out', stagger: 0.02, clearProps: 'opacity,transform' });
          // the list's head stays in reach: if the reader is below it, the page glides back to it
          if (arch && arch.getBoundingClientRect().top < -40) glideTo(arch);
        });
    };
    btns.forEach(b => b.addEventListener('click', () => {
      const t = b.getAttribute('data-topic') || '';
      if (b.getAttribute('aria-pressed') === 'true') return;
      apply(t, true);
      try { const u = new URL(location.href); if (t) u.searchParams.set('topic', t); else u.searchParams.delete('topic'); history.replaceState(null, '', u.pathname + u.search + u.hash); } catch (err) { /* */ }
    }));
    const q = new URLSearchParams(location.search).get('topic');
    if (q && btns.some(b => b.getAttribute('data-topic') === q)) apply(q, false);
    if (location.hash === '#all' && arch) {
      const land = () => { const y = Math.max(0, Math.round(arch.getBoundingClientRect().top + W.scrollY - navZone())); if (gfx.lenis) gfx.lenis.scrollTo(y, { immediate: true, force: true }); else W.scrollTo(0, y); req(); };
      fonts().then(() => setTimeout(land, 60)); W.addEventListener('load', () => setTimeout(land, 120), { once: true });
    }
  }

  /* ========================= the page ========================= */
  const orig = gfx.page;
  gfx.page = def => { FIELD = def.field; orig(def); };
  P.run({
    current: 'Insights',
    dom: () => {
      if (FIELD) FIELD.rooms = rooms();
      safe('share', share); safe('contents', contents); safe('topics', topics);
    },
    start: api => { gsap = api.gsap; anim = !!gsap && !REDUCE; if (anim) H.classList.add('gi-anim'); safe('opening', opening); safe('scroll', scroll); },
    rooms: () => { safe('risers', risers); safe('quotes', quotes); },
    late: () => safe('sidebar arrow', () => sidebarArrow(false)),
    still: () => { gsap = W.gsap || null; anim = false; safe('scroll', scroll); syncDark(); safe('sidebar arrow', () => sidebarArrow(true)); }
  });
  gfx.page = orig;
})();
