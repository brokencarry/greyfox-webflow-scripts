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
 * THE CMS TEMPLATE (insights 1.1, 10/20): the collection page "Insights Template" (/insights/<slug>) holds the article's
 *   fields bound to the Insights collection and ONE Rich Text bound to Body ([data-o~="gi-rt"]; its presence is how the
 *   layer knows the page). Before anything else runs, that page becomes the built article's DOM (template() below): the
 *   Body's H2s open the sections (ids kept, else the heading's slug), the contents lists are drawn from them, a blockquote
 *   becomes a pull quote, the "Sources" H2 and its list become the sources; the title, date, reading time and topic are
 *   set as the built article sets them; the drawn cover is fetched from this same pinned commit (insights/covers/<key>.svg,
 *   SRI-checked; no key = the index's typographic plate); "Next article" (the one published before this one, the newest
 *   after the oldest) and "More from Grey Fox" (three of the same topic, then the newest others) come from a hidden list
 *   of every item ([data-o~="gi-feed"]). The static article and the index never take this path.
 * Reduced motion: everything settled, the turn a 0.15 s step; the contents and the progress still follow the reading.
 */
(function () {
  'use strict';
  var W = window, D = document, gfx = W.gfx;
  if (!gfx || !gfx.pages || W.__gfxInsights) return;
  W.__gfxInsights = '1.2.6';
  // (1.1) this bundle's own address: the covers live beside it, on the same pinned commit
  const SRC = (D.currentScript && D.currentScript.src) || '';
  const P = gfx.pages, O = P.O, H = D.documentElement, $ = gfx.$, $$ = gfx.$$, safe = gfx.safe, REDUCE = gfx.REDUCE;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const eo = t => 1 - Math.pow(1 - t, 3);
  const EXPO = 'expo.out';
  /* (1.2.5, overnight 10/23 audit) a source number in an article ([1]) was a 20 x 21 px target on a phone, fiddly under a
     thumb: each gets an invisible 44 px tap area around it (Apple's minimum), centred on the number; nothing on screen changes */
  if (!D.getElementById('gfx-gi-tap')) { const st = D.createElement('style'); st.id = 'gfx-gi-tap';
    st.textContent = '[data-o~="gi-ref"] a{position:relative}[data-o~="gi-ref"] a::after{content:"";position:absolute;left:50%;top:50%;width:44px;height:44px;transform:translate(-50%,-50%)}' +
      // (1.2.6, polish 10/23) phones: the list's date · topic · reading time wrapped with the dot opening the second line; the
      // dot now ends the item before it, so a line breaks between items and never starts on a separator
      '@media (max-width:767px){[data-o~="gi-row-r"]>span+span::before{content:none!important}[data-o~="gi-row-r"]>span:not(:last-child)::after{content:"";display:inline-block;width:3px;height:3px;margin:0 0 0 10px;border-radius:50%;background:currentColor;opacity:.7;transform:translateY(-3px)}}';
    D.head.appendChild(st); }
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
  let req = () => {}, rescan = () => {};
  function scroll() {
    let plates = [], frames = [];
    // (1.1) the template's covers arrive after the fetch: each arrival reads the plates again
    rescan = () => { plates = $$(O('gi-plate-in')); frames = plates.map(p => p.closest(O('gi-plate')) || p.parentElement); req(); };
    plates = $$(O('gi-plate-in')); frames = plates.map(p => p.closest(O('gi-plate')) || p.parentElement);
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
  /* (insights 1.2.0, founder 10/20) ONLY THE PE PIECES STAY: Shivam keeps the 8 origination / PE-strategy articles; the 15
     owner-facing ones go back to draft in the CMS (review: audit/final-1020/ARTICLE-KEEP.txt). The index is a static
     page, so it drops their rows here, then every count on the page is taken from the rows that are left (topic buttons,
     the opening's "N articles · N topics · Since <month>"); a topic left empty leaves the filter. To bring one back:
     publish it in the CMS and take its slug off this list. */
  const DRAFTED = ['what-drives-hoa-management-exit-value', 'hoa-community-manager-retention-challenge',
    'leadership-infrastructure-enterprise-value', 'service-complexity-enterprise-value', 'sales-infrastructure-before-talent',
    'exit-preparation-timeline-value', 'buyers-quantify-founder-dependency', 'operational-metrics-scalable-growth',
    'buyability-gap-transferable-value', 'value-leaks-in-service-businesses', 'repeatability-diagnostic-valuation-multiples',
    'how-buyers-analyze-financials', 'field-margin-erosion', 'fire-20-percent-revenue', 'growtheright20'];
  const slugOfRow = r => { const a = $('a[href*="/insights/"], a[href*="/articles/"]', r); const m = a && (a.getAttribute('href') || '').match(/\/(?:insights|articles)\/([a-z0-9-]+)/); return m ? m[1] : ''; };
  function prune() {
    const list = $(O('gi-list')); if (!list) return;
    $$(O('gi-row'), list).forEach(r => { if (DRAFTED.indexOf(slugOfRow(r)) >= 0) r.remove(); });
    $$(O('gi-tile')).forEach(t => { if (DRAFTED.indexOf(slugOfRow(t)) >= 0) t.remove(); });
    const rws = $$(O('gi-row'), list), by = {};
    rws.forEach(r => { const t = topicOf(r); by[t] = (by[t] || 0) + 1; });
    $$(O('gi-topic')).forEach(b => { const t = b.getAttribute('data-topic') || '', n = t ? (by[t] || 0) : rws.length, c = $(O('gi-topic-c'), b); if (c) c.textContent = String(n); if (t && !n) b.remove(); });
    const note = $('[data-gi-note]'); if (note) note.textContent = `Showing all ${rws.length} articles.`;
    // (1.2.1, founder 10/20: option A) one topic left: a filter of one choice is not shown (the heading reads "All articles")
    if (Object.keys(by).filter(Boolean).length <= 1) { const g = $(O('gi-topics')); if (g) { g.hidden = true; g.style.setProperty('display', 'none', 'important'); } }
    const cnt = $(O('gi-open-count'));
    if (cnt) {
      const k = Object.keys(by).filter(Boolean).length, first = $('.gfx-pg-t', cnt), mis = $$(O('gi-mi'), cnt);
      const dates = rws.map(r => ($('time[datetime]', r) || { getAttribute: () => '' }).getAttribute('datetime')).filter(Boolean).sort();
      if (first) first.textContent = `${rws.length} ${rws.length === 1 ? 'article' : 'articles'}`;
      const set = (el, s) => { if (!el) return; const sep = $(O('gi-sep'), el); el.textContent = s; if (sep) el.insertBefore(sep, el.firstChild); };
      mis.forEach(el => {
        // (1.2.6, polish 10/23) one topic is no count worth printing: the item waits, hidden, until there are two
        if (/topic/i.test(el.textContent)) { if (k <= 1) { el.hidden = true; el.style.setProperty('display', 'none', 'important'); } else set(el, `${k} topics`); }
        else if (/^\s*since\b/i.test(el.textContent) && dates[0]) { const d = new Date(dates[0] + 'T12:00:00'); set(el, 'Since ' + d.toLocaleString('en-US', { month: 'long', year: 'numeric' })); }
      });
    }
  }
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

  /* ========================= the CMS template (insights 1.1) =========================
     The template's Rich Text ([data-o~="gi-rt"]) is rebuilt as the built article's body; the rest of the page is set from
     the bound fields and the hidden list of every item. Markup = the static article's (audit/webflow-build/f3-insights/
     native/article-wf.html), so the ported stylesheet reads it the same way. */
  const BASE = (SRC || (($('script[src*="/insights/gfx-insights"]') || {}).src) || '').replace(/insights\/[^/]*$/, '');
  // the drawn covers on this commit (insights/covers/<key>.svg, written by f3-insights/tools/covers-pack.js); a key not
  // listed here is not fetched (the typographic plate stands in)
  const COVER_SRI = {
    'buyability-gap': 'sha384-HVSVbVFZ6GKiVmSpPQ+o6U1LSeiZ8jpAu3+UPCOjQMHFRYs9aegbH/daaFn+epFL',
    'buyer-financials': 'sha384-UGXC22PJYJjHkh5iL4B/JGRD/WlkWrl+3HN+T2zKK0mq77q1n0eq0hOaHz4gKRTk',
    'cold-call': 'sha384-K6ixKY/zEtbf6WyCHEWWhyMw6uXQ65OQZJDYyZsHUFHwEdYa20tjNT7/0xAxwJWY',
    'company-problem': 'sha384-kk/NKIJvUOB8I1evJoaPdWjZsNz5o5szPVWx008ofs/xd4Q32tPTZvWGvcXlph6V',
    'exit-timeline': 'sha384-33YuPYaEbtWq0ex7nNk+FZplz6sxv6zxnOJi2ReB/PYNkTiBWaGh03leSc/qfOn0',
    'field-margin': 'sha384-HJKzCuVq3394L8uokafJZV1nrFFqoR7s0QxoFG9zMTu9rZhsgR5DuZCRdNdoSiRo',
    'fifty-email': 'sha384-3ntOLDx7YzSLeqtWH9n65uEZa+hHAip/VYrgM7Ku0O+kS4gobMBqnqOWnRhIUYZJ',
    'fire-twenty': 'sha384-oCsqhyHIACfKxr5K73OrRA7DvvyLcctIMR/SIoUZax/B7m9uKg4xoKfbiQftl2DR',
    'first-five-minutes': 'sha384-/OQug0DzaaJvpUCrHI/Fap7WGhy6VtOokNwXKaytFPmzIRzQp6Gc1eURu2E5s7Bc',
    'five-metrics': 'sha384-gQ2RBQNSXyIJ4S0bEPQfS2zQ/D4A8F7gZuOWcezvJPy1Rnb0CtTAUblU/0N4ZX3e',
    'founder-dependency': 'sha384-gzcbLXTH8ECdU3E9JiPQtvuRwAFj5J1mdzl57uVHaI16uIn0LbJdq/46bWfiQRwa',
    'hidden-forty': 'sha384-VDofMCeeokXxgehzPZMGE0sTUQSfdNflgsxd0iz7US3Nkvwqbzs4tDquO7WzeV0a',
    'hoa-exit-value': 'sha384-0nZxdzWtwi/0nL/dZW07X0Z9/SOMx+pqCdIvzgHOYYNly4UAwHjYcKNkNiaIof+m',
    'judge-partner': 'sha384-q0xPNsWSD0WN4S/Rw1MgJmXyUoWzC59w+o3zo8pt8n5X6HoGW6GqvBjP+tbd6k9i',
    'leadership-infra': 'sha384-w07uMMqi3bNIT4qVOlNlKVn3WZI2HQODo9Uk2YzdtyvEyuxYFtjGy8K2wo9tNaGq',
    'manager-retention': 'sha384-C756Hzkc8c4+bRz6dzTAh3Ht16KLu1j8ZckBwRjcctpegpsjS/maRBFg7AxHl03Y',
    'plausible-list': 'sha384-gpP82BllNxgz3CpDQkU5bCh9BsC1voM/tBzs4aKJgLvyAo6UMw2qHA3z6Bn65mGh',
    'repeatability': 'sha384-GvstzaG/aW9YKY9Q5+6m7Nen/SpFmSEJyKmcktlAGGuJ7R1w1eMDCISG8tYgd25A',
    'right-twenty': 'sha384-DawDoElTiUKcio0ltuAubq4RdG9Yi+TR8sELqGcogbCNAIvjpvjvG1OT4qJYDU8k',
    'sales-before-hire': 'sha384-54bSmTQ2s5RlkkqpZjx6pVsnVTMyv/Z7Da8N69tBHJbUvTPY78UFpuxKoR9IrEia',
    'service-complexity': 'sha384-34WsVX/HPc6S+uMTuRT8AQX589bVsTdj0LjDChA4HvGjOBp+fp3AiR0WZUlJIRo3',
    'value-leaks': 'sha384-e7cfHyADER+q7wU6rddlToAxGwhH9e/+1tlgd0NZyDLqmiU3Bu7h/nmb090YbVCB',
    'what-inning': 'sha384-/SUk/cdWwPXOCeZrgj9Z1yQjL4PIYWjM+Wn6yqZqZBVvzk+0eXNxK8VBHKjTzaaA'
  };
  const SITE = 'https://www.greyfoxpartners.com';
  // (1.2.4) the firm's mark for the article publisher, and each author's page after the launch renames (LAUNCH.txt 1b)
  const LOGO = 'https://cdn.prod.website-files.com/67c0e116387e8248a0d7e10a/6ad9b63e75f1cad7b6871bde_gfx-logo-mark-256.png';
  const PEOPLE = { 'Shivam Shirolawala': '/shivam-shirolawala', 'Tony Giudice': '/tony-giudice', 'Burke Widhelm': '/burke-widhelm' };
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const escH = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  // (build.js) a hyphenated word never breaks; a title's part after ": " is its own line on a desktop (gi-sub)
  const nb = t => escH(t).replace(/(\S+-\S+)/g, '<span class="gfx-pg-gi-nb" data-o="gi-nb">$1</span>');
  const titleHtml = t => t.includes(': ') ? nb(t.split(': ')[0]) + ':<span class="gfx-pg-gi-sub" data-o="gi-sub"> ' + nb(t.split(': ').slice(1).join(': ')) + '</span>' : nb(t);
  const slugify = s => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  // the contents: the section heads in sentence case (the headings themselves stay as written; build.js's rule, which kept
  // an all-capitals word, here also keeps a word part with two capitals (P&L, AI), "I", a capital after a full stop, and the
  // house's name)
  const sentenceHead = t => {
    let cap = true;
    return t.split(' ').map(w => {
      const out = w.split('-').map((p, i) => ((cap && !i) || /[A-Z].*[A-Z]/.test(p) || /^I(['’]\w+)?$/.test(p) ? p : p.toLowerCase())).join('-');
      cap = /[.?!]$/.test(w); return out;
    }).join(' ').replace(/\bgrey fox\b/gi, 'Grey Fox');
  };
  const pad = n => (n < 10 ? '0' : '') + n;
  // a date as Webflow writes it (or an ISO date) -> { iso, label }: "2026-02-17", "February 17, 2026"
  const parseDate = s => {
    s = (s || '').trim(); if (!s) return null;
    let y, m, d; const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(s);
    if (iso) { y = +iso[1]; m = +iso[2]; d = +iso[3]; } else { const t = Date.parse(s); if (isNaN(t)) return null; const x = new Date(t); y = x.getFullYear(); m = x.getMonth() + 1; d = x.getDate(); }
    return { iso: `${y}-${pad(m)}-${pad(d)}`, label: `${MONTHS[m - 1]} ${d}, ${y}` };
  };
  const mkEl = (tag, o, attrs) => { const n = D.createElement(tag); if (o) { n.className = 'gfx-pg-' + o.split(' ').pop(); n.setAttribute('data-o', o); } Object.entries(attrs || {}).forEach(([k, v]) => n.setAttribute(k, v)); return n; };
  const SEP = '<span class="gfx-pg-gi-sep" aria-hidden="true" data-o="gi-sep"></span>';
  const mi = h => `<span class="gfx-pg-gi-mi" data-o="gi-mi">${h}</span>`;
  const timeH = a => a.date ? `<time datetime="${a.date.iso}">${a.date.label}</time>` : '';
  const metaH = (a, topic) => { const parts = [timeH(a), topic && a.topicName ? escH(a.topicName) : '', a.mins ? escH(a.mins) + ' min read' : ''].filter(Boolean); return `<p class="gfx-pg-gi-meta" data-o="gi-meta">${parts.map((p, i) => mi((i ? SEP : '') + p)).join('')}</p>`; };
  const hrefOf = a => '/articles/' + encodeURIComponent(a.slug);   // (1.2.0) the collection lives at /articles
  const figH = (cls, o, a) => `<figure class="${cls}" data-gi-settle="" data-o="${o}" data-gi-cover="${escH(a.cover)}" data-gi-title="${escH(a.name)}"></figure>`;

  /* covers: fetched once per key, SRI-checked, their ids made unique per plate (build.js uniq) */
  const coverReq = {}; let plateN = 0;
  const coverText = key => coverReq[key] || (coverReq[key] = fetch(BASE + 'insights/covers/' + key + '.svg', { integrity: COVER_SRI[key], mode: 'cors' }).then(r => (r.ok ? r.text() : Promise.reject(new Error('cover ' + r.status)))));
  const uniq = svg => { const n = 'c' + (++plateN); return svg.replace(/id="([^"]+)"/g, (m, id) => `id="${id}-${n}"`).replace(/url\(#([^)]+)\)/g, (m, id) => `url(#${id}-${n})`).replace(/href="#([^"]+)"/g, (m, id) => `href="#${id}-${n}"`); };
  const typeIn = title => `<span class="gi-plate-in" data-o="gi-plate-in"><svg viewBox="0 0 1200 750" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="M84 78V64H98M1102 64H1116V78M1116 672V686H1102M98 686H84V672" fill="none" stroke="#a9a8a4" stroke-width="1" vector-effect="non-scaling-stroke"></path></svg><span class="gi-type-t" data-o="gi-type-t">${nb(title)}</span></span>`;
  const putIn = (fig, inner) => { const e = D.createElement('div'); e.className = 'w-embed'; e.innerHTML = inner; fig.textContent = ''; fig.appendChild(e); rescan(); };
  const asType = (fig, title) => { const o = (fig.getAttribute('data-o') || '').split(/\s+/).filter(Boolean); if (!o.includes('gi-plate-type')) o.push('gi-plate-type'); fig.setAttribute('data-o', o.join(' ')); fig.classList.add('gfx-pg-gi-plate-type'); putIn(fig, typeIn(title)); };
  const plate = (fig, key, title) => {
    if (!fig || fig.__gi) return; fig.__gi = 1;
    key = (key || '').trim();
    if (!key || !COVER_SRI[key] || !BASE || !W.fetch) { asType(fig, title); return; }
    coverText(key).then(svg => putIn(fig, `<span class="gi-plate-in" data-o="gi-plate-in">${uniq(svg)}</span>`), () => asType(fig, title));
  };

  /* the body: one Rich Text -> the intro, the sections, the pull quotes, the sources */
  function body(rt) {
    const out = D.createDocumentFragment(), secs = []; let into = null, sources = null;
    const blank = n => n.nodeType === 3 ? !n.textContent.trim() : n.nodeType !== 1;
    const empty = n => n.tagName === 'P' && !n.querySelector('img, svg, iframe, video') && !n.textContent.replace(/[\s​-‍﻿]/g, '');
    const free = id => { let k = id || 'section', i = 2; while (D.getElementById(k)) k = id + '-' + i++; return k; };
    const pq = bq => {
      const f = mkEl('figure', 'gi-pq', { 'data-gi-pq': '' }), r = mkEl('div', 'gi-pq-rule', { 'aria-hidden': 'true' });
      if (!$(':scope > p', bq)) { const p = D.createElement('p'); while (bq.firstChild) p.appendChild(bq.firstChild); bq.appendChild(p); }
      f.append(r, bq); return f;
    };
    const kids = [...rt.childNodes];
    kids.forEach((n, i) => {
      if (blank(n) || empty(n)) return;
      if (n.tagName === 'H2') {
        const text = n.textContent.replace(/\s+/g, ' ').trim(), next = kids.slice(i + 1).find(k => k.nodeType === 1);
        const own = n.id; n.removeAttribute('id');
        if (/^sources$/i.test(text) && next && /^(OL|UL)$/.test(next.tagName)) {
          const id = free(own || 'sources');
          sources = into = mkEl('section', 'gi-sources', { id, 'aria-labelledby': id + '-h' });
          n.className = 'gfx-pg-gi-src-h'; n.setAttribute('data-o', 'gi-src-h'); n.id = id + '-h';
          into.appendChild(n); out.appendChild(into); return;
        }
        const id = free(own || slugify(text));
        into = mkEl('section', 'gi-sec', { id, 'aria-labelledby': id + '-h' });
        n.className = 'gfx-pg-gi-sec-h'; n.setAttribute('data-o', 'gi-sec-h'); n.id = id + '-h';
        into.appendChild(n); out.appendChild(into); secs.push({ id, text }); return;
      }
      if (!into) { into = mkEl('div', 'gi-intro'); out.appendChild(into); }
      into.appendChild(n.tagName === 'BLOCKQUOTE' ? pq(n) : n);
    });
    // the source references: the built article's (a number in the margin's ink, its source named for a screen reader)
    $$('sup', out).forEach(s => { const a = $('a[href^="#src-"]', s); if (!a) return; s.className = 'gfx-pg-gi-ref'; s.setAttribute('data-o', 'gi-ref'); if (!a.hasAttribute('aria-label')) a.setAttribute('aria-label', 'Source ' + a.textContent.trim()); });
    rt.replaceWith(out);
    return { secs, sources };
  }

  /* the contents (both lists: the sidebar's and the phone's) */
  function tocFill(entries) {
    [[O('gi-toc'), 'nav'], [O('gi-toc-m'), 'details']].forEach(([sel]) => $$(sel).forEach(box => {
      let ol = $(O('gi-toc-l'), box);
      if (!ol) { ol = mkEl('ol', 'gi-toc-l'); box.appendChild(ol); }
      ol.innerHTML = entries.map(e => `<li><a href="#${e.id}">${escH(e.text)}</a></li>`).join('');
      if (!entries.length) box.hidden = true;
    }));
  }

  function template() {
    const rt = $(O('gi-rt')); if (!rt) return false;
    H.classList.add('gi-cms');
    // the hidden list of every item (newest first), then out of the page
    const feed = $$(O('gi-feed-i')).map(e => ({
      slug: (e.getAttribute('data-slug') || '').trim(), name: (e.getAttribute('data-name') || '').trim(), summary: (e.getAttribute('data-summary') || '').trim(),
      date: parseDate(e.getAttribute('data-date')), mins: (e.getAttribute('data-mins') || '').trim(), topic: (e.getAttribute('data-topic') || '').trim(),
      topicName: (e.getAttribute('data-topic-name') || '').trim(), cover: (e.getAttribute('data-cover') || '').trim()
    })).filter(a => a.slug && a.name);
    feed.sort((a, b) => (b.date ? b.date.iso : '').localeCompare(a.date ? a.date.iso : ''));
    $$(O('gi-feed')).forEach(e => e.remove());
    const story = $(O('gi-story'));
    const slug = ((story && story.getAttribute('data-gi-slug')) || location.pathname.replace(/\/+$/, '').split('/').pop() || '').trim();
    const me = feed.find(a => a.slug === slug) || null;

    // the header: the title's lines, the date, the reading time, the topic's address
    const h1 = $('#gi-h1') || $(O('gi-atitle')), title = h1 ? h1.textContent.replace(/\s+/g, ' ').trim() : (me ? me.name : '');
    if (h1 && title) h1.innerHTML = titleHtml(title);
    const ameta = $(O('gi-ameta'));
    if (ameta) {
      const t = $('time', ameta), d = (t && parseDate(t.textContent)) || (me && me.date);
      if (t && d) { t.setAttribute('datetime', d.iso); t.textContent = d.label; }
      const m = $('[data-gi-mins]', ameta), mm = m && m.closest(O('gi-mi'));
      if (mm) { const n = m.textContent.trim() || (me ? me.mins : ''); mm.innerHTML = SEP + escH(n) + ' min read'; }
      const cat = $(O('gi-acat'), ameta);
      if (cat) { const ts = (cat.getAttribute('data-gi-topic') || '').trim() || (me && me.topic) || slugify(cat.textContent); cat.setAttribute('href', '/insights' + (ts ? '?topic=' + encodeURIComponent(ts) : '') + '#all'); cat.removeAttribute('data-gi-topic'); }
    }
    // the body, the contents
    const b = body(rt);
    tocFill(b.secs.map(s => ({ id: s.id, text: sentenceHead(s.text) })).concat(b.sources ? [{ id: b.sources.id, text: 'Sources' }] : []));
    // share: the article's address on the site
    const url = SITE + '/articles/' + slug;
    const SH = { in: 'https://www.linkedin.com/sharing/share-offsite/?url=', x: 'https://x.com/intent/post?url=', fb: 'https://www.facebook.com/sharer/sharer.php?u=' };
    $$('a[data-gi-ico]').forEach(a => { const k = a.getAttribute('data-gi-ico'); if (SH[k]) a.setAttribute('href', SH[k] + encodeURIComponent(url)); });
    $$('[data-gi-copy]').forEach(c => c.setAttribute('data-gi-copy', url));
    // (10/22) structured data for search: the article, its date and the firm that published it (Google reads script-built JSON-LD)
    safe('article ld', () => {
      if (D.querySelector('script[data-gi-ld]')) return;
      const meta = n => { const m = D.querySelector('meta[property="' + n + '"],meta[name="' + n + '"]'); return m ? m.content : ''; };
      const t = ameta && $('time', ameta), iso = (t && t.getAttribute('datetime')) || (me && me.date ? me.date.iso : '');
      const org = { '@type': 'Organization', name: 'Grey Fox Partners', url: SITE, logo: { '@type': 'ImageObject', url: LOGO } };
      // (1.2.4) the author is the byline's person (as the page shows), not the firm: name from the byline, LinkedIn from the
      // end-of-piece author note, the person's page on the site when the roster knows it; the firm when there is no byline
      const byEl = $(O('gi-author-n')) || $(O('gi-ea-n')), byName = byEl ? byEl.textContent.replace(/\s+/g, ' ').trim() : '';
      const liEl = $(O('gi-endauthor') + ' a[href*="linkedin.com/in/"]') || $(O('gi-author') + ' a[href*="linkedin.com/in/"]');
      const author = byName ? { '@type': 'Person', name: byName } : org;
      if (byName && PEOPLE[byName]) author.url = SITE + PEOPLE[byName];
      if (byName && liEl) author.sameAs = [liEl.getAttribute('href')];
      if (byName) author.worksFor = { '@type': 'Organization', name: 'Grey Fox Partners', url: SITE };
      const ld = { '@context': 'https://schema.org', '@type': 'Article', headline: title.slice(0, 110), mainEntityOfPage: url, author, publisher: org };
      const desc = meta('description'), img = meta('og:image');
      if (desc) ld.description = desc; if (img) ld.image = img; if (iso) ld.datePublished = iso;
      const sc = D.createElement('script'); sc.type = 'application/ld+json'; sc.setAttribute('data-gi-ld', ''); sc.textContent = JSON.stringify(ld); D.head.appendChild(sc);
    });
    // the hero's cover (the key bound on the plate)
    const hero = $(O('gi-plate-hero'));
    if (hero) plate(hero, hero.getAttribute('data-gi-cover') || (me ? me.cover : ''), title);

    // Next: the piece published before this one (after the oldest, the newest); More: three of the same topic, then the newest others
    const at = me ? feed.indexOf(me) : -1, others = feed.filter(a => a !== me);
    const next = others.length ? (at >= 0 && feed[at + 1]) || others[0] : null;
    const topic = (me && me.topic) || '';
    const rest = others.filter(a => a !== next), more = rest.filter(a => topic && a.topic === topic).slice(0, 3);
    rest.forEach(a => { if (more.length < 3 && !more.includes(a)) more.push(a); });
    const nextSec = $(O('gi-next'));
    if (nextSec && next) {
      let grid = $(O('gi-next-grid'), nextSec); if (!grid) { grid = mkEl('div', 'gi-wrap gi-next-grid'); grid.className = 'gfx-pg-gi-next-grid'; nextSec.appendChild(grid); }
      grid.innerHTML = `<div class="gfx-pg-gi-next-txt" data-o="gi-next-txt"><p class="gfx-pg-gi-next-k" data-o="gi-next-k">Next article</p><h2 id="gi-next-h" class="gfx-pg-gi-next-t" data-gi-rise="" data-o="gi-next-t"><a class="gfx-pg-gi-tlink" href="${hrefOf(next)}" data-o="gi-tlink">${nb(next.name)}</a></h2>${next.summary ? `<p class="gfx-pg-gi-dek" data-o="gi-dek">${escH(next.summary)}</p>` : ''}${metaH(next, true)}</div><a class="gfx-pg-gi-next-pic" href="${hrefOf(next)}" tabindex="-1" aria-hidden="true" data-o="gi-next-pic">${figH('gfx-pg-gi-plate-next', 'gi-plate gi-plate-next', next)}</a>`;
    }
    const moreSec = $(O('gi-more')), mgrid = moreSec && $(O('gi-more-grid'), moreSec);
    if (mgrid && more.length) {
      const card = (a, l) => `<article class="gfx-pg-gi-mcard-${l ? 'l' : 's'}" data-o="gi-mcard gi-mcard-${l ? 'l' : 's'}"><a class="gfx-pg-gi-card-pic" href="${hrefOf(a)}" tabindex="-1" aria-hidden="true" data-o="gi-card-pic">${figH('gfx-pg-gi-plate', 'gi-plate', a)}</a><div class="gfx-pg-gi-mcard-txt" data-o="gi-mcard-txt">${metaH(a, l)}<h3 class="gfx-pg-gi-card-t" data-o="gi-card-t"><a class="gfx-pg-gi-tlink" href="${hrefOf(a)}" data-o="gi-tlink">${nb(a.name)}</a></h3>${l && a.summary ? `<p class="gfx-pg-gi-dek-s" data-o="gi-dek gi-dek-s">${escH(a.summary)}</p>` : ''}</div></article>`;
      mgrid.innerHTML = card(more[0], true) + (more.length > 1 ? `<div class="gfx-pg-gi-more-side" data-o="gi-more-side">${more.slice(1).map(a => card(a, false)).join('')}</div>` : '');
    }
    $$('figure[data-gi-cover]').forEach(f => { if (f !== hero) plate(f, f.getAttribute('data-gi-cover'), f.getAttribute('data-gi-title') || ''); });
    return true;
  }

  /* ========================= the page ========================= */
  const orig = gfx.page;
  gfx.page = def => { FIELD = def.field; orig(def); };
  P.run({
    current: 'Insights',
    dom: () => {
      safe('cms template', template);   // (1.1) the template page only: before the rooms, the contents and share are read
      safe('prune', prune);   // (1.2.0) the index: the drafted rows go before the rooms are read
      if (FIELD) { FIELD.rooms = rooms(); FIELD.drawnCovers = true; }   // (final audit) the cards' drawn covers count for the tablet rhythm
      safe('share', share); safe('contents', contents); safe('topics', topics);
    },
    start: api => { gsap = api.gsap; anim = !!gsap && !REDUCE; if (anim) H.classList.add('gi-anim'); safe('opening', opening); safe('scroll', scroll); },
    rooms: () => { safe('risers', risers); safe('quotes', quotes); },
    late: () => safe('sidebar arrow', () => sidebarArrow(false)),
    still: () => { gsap = W.gsap || null; anim = false; safe('scroll', scroll); syncDark(); safe('sidebar arrow', () => sidebarArrow(true)); }
  });
  gfx.page = orig;
})();
