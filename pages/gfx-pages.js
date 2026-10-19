/*!
 * Grey Fox · gfx pages (Flow 3), the shared inner-page layer (Contact, Privacy; Team later) on the shared core.
 * pages 1.0.0 · 2026-10-20 · front-end only (nothing secret).
 *
 * WHAT IT IS
 *   The parts of the approved local inner pages (prototype/contact/final.html, prototype/privacy/index.html, Flow 3 the
 *   default) that those pages share, on top of core/gfx-core.js: the owners.js house grammar as the inner pages use it
 *   (the hero opening, room heads, the questions' film and the one-at-a-time accordion), pages-flow2.js's one turn into the
 *   close (the core's field, gfTurn closeAt timing), and gf-site.js's close (the action, the house underline under the
 *   headline's last word, the two doors, the faint fox handing off to footer I).
 *   Each page's own layer (contact/gfx-contact.js, privacy/gfx-privacy.js) calls gfx.pages.run({ ... }) once.
 *
 * THE DOM
 *   Webflow's own (native elements, one gfx- class each); every element also carries data-o="<the local classes>", and
 *   the page's ported stylesheet reads those (see audit/webflow-build/f3-contact-map.md). State classes are set here.
 *
 * Reduced motion: every room settled. ?gfm=0: the page exactly as Webflow serves it.
 */
(function () {
  'use strict';
  var W = window, D = document, gfx = W.gfx;
  if (!gfx || !gfx.page || W.__gfxPages) return;
  W.__gfxPages = '1.0.0';
  const H = D.documentElement, G = gfx.G, $ = gfx.$, $$ = gfx.$$, safe = gfx.safe, REDUCE = gfx.REDUCE;
  const O = c => '[data-o~="' + c + '"]';
  const GROUP = G.group, TIGHT = G.tight || 0.08;
  // the local page's html classes, before the body is parsed (the ported stylesheet reads them)
  H.classList.add('gf-flow', 'gf-flow2', 'gf-flow3', 'gf-dark-black', 'ow-js', 'gfx-pg-js');
  if (REDUCE) H.classList.add('ow-reduce');
  let gsap = null, ST = null;
  const R = {};
  const findRooms = () => { R.main = $('#main') || $(O('ow-main')); R.rooms = $$(O('ow-room')); R.hero = $(O('ow-hero')); R.qs = $(O('ow-qs')); R.close = $(O('ow-close')); };
  findRooms();
  // a made element carries its local classes both ways (class for the script, data-o for the stylesheet)
  const mk = (tag, cls, text) => { const n = D.createElement(tag); if (cls) { n.className = cls; n.setAttribute('data-o', cls); } if (text != null) n.textContent = text; return n; };

  /* ========================= the field: paper, one turn into the close (pages-flow2.js + gf-turn.js closeAt) =========================
     The close turns the field to black (the core's timed crossfade): the later of the close's top at 60 % and the last
     paper room's last line in the top eighth, and done before the close's headline reaches 72 %. The paper rooms keep
     their own inks; the last one re-inks with the field (pf-leave). */
  const fieldDef = () => ({
    rooms: R.rooms.map(r => r === R.close
      ? { el: r, native: 'D', tone: 'D', opaque: true, foot: true, noInk: true, turnAt: (ym, c) => {
          const room = c.room.el, top = c.docTop(room); let at = top - c.vh * 0.6;
          const lb = c.lastBottom(c.prev.el); if (Number.isFinite(lb)) at = Math.max(at, lb - c.vh * 0.12);
          const hd = $('h2', room); if (hd) at = Math.min(at, c.docTop(hd) - c.vh * 0.72);
          return Math.min(at, c.max - c.vh * 0.04); } }
      : { el: r, native: 'L', tone: 'L', noInk: true })
  });

  /* ========================= the static structure (also without motion) ========================= */
  function dom(def) {
    findRooms();
    // the bar: the page you are on
    const cur = (def.current || '').toLowerCase();
    if (cur) $$('.gfx-nav a.navigation-item').forEach(a => { if ((a.textContent || '').trim().toLowerCase() === cur) { a.classList.add('gfx-current'); a.setAttribute('aria-current', 'page'); } });
    // the questions open and close in place (all open without JavaScript, and in print)
    if (R.qs) { H.classList.add('ow-acc-js'); $$(O('ow-acc-item'), R.qs).forEach(it => it.classList.remove('is-open')); $$(O('ow-acc-b'), R.qs).forEach(b => b.setAttribute('aria-expanded', 'false')); }
    // the close is the site's one close; the last paper room re-inks with the turn
    if (R.close) { R.close.classList.add('gfc-on'); let before = R.close.previousElementSibling; while (before && !before.matches(O('ow-room'))) before = before.previousElementSibling; if (before) before.classList.add('pf-leave'); }
  }

  /* ========================= the hero (owners.js hero) =========================
     The headline rises line by line; the lede and the actions settle; the hairline draws; the photograph opens upward like
     a window, settles, and its corner cuts in; then the page's own detail (def.heroDetail). The photograph keeps a very
     slow settle while it is on screen (the breath), tied to the scroll. */
  let heroTl = null;
  function heroInit(def) {
    const room = R.hero; if (!room) return;
    const h1 = $('h1', room), lede = $(O('ow-hero-lede'), room), act = $(O('ow-actions'), room), rule = $(O('ow-rule'), room);
    const pic = $(O('ow-hero-pic'), room), imgs = pic ? $$('img', pic) : [];
    const words = [act].concat(def.heroWords ? def.heroWords(room) : []).filter(Boolean);
    const head = h1 ? gfx.lineSplit(h1) : null; if (head) head.played = true;
    if (words.length) gsap.set(words, { opacity: 0, y: G.body.y }); if (lede) gsap.set(lede, { y: G.body.y });
    if (rule) gsap.set(rule, { scaleX: 0, transformOrigin: '0% 50%' });
    const fx = pic ? (getComputedStyle(pic).getPropertyValue('--fx').trim() || '96px') : '96px';
    if (imgs.length) { gsap.set(imgs, { clipPath: G.picture.clipFrom, scale: G.picture.scaleFrom }); gsap.set(pic, { '--fx': '0px' }); }
    H.classList.add('ow-hero-on');
    const tl = heroTl = gsap.timeline({ delay: 0.1, onComplete: () => { if (head && !head.reverted) head.revert(); } });
    if (head) tl.to(head.lines, { yPercent: 0, duration: G.headline.duration, stagger: G.headline.stagger, ease: G.SETTLE }, 0);
    if (lede) tl.to(lede, { y: 0, duration: G.body.duration, ease: G.SETTLE, clearProps: 'transform' }, G.body.at);
    if (words.length) tl.to(words, { opacity: 1, y: 0, duration: G.body.duration, stagger: GROUP, ease: G.SETTLE, clearProps: 'transform' }, G.body.at);
    if (rule) tl.to(rule, { scaleX: 1, duration: G.hairline.duration, ease: G.DRAW }, G.hairline.at);
    if (imgs.length) tl.to(imgs, { clipPath: 'inset(0% 0% 0% 0%)', duration: G.picture.duration, ease: G.DRAW }, 0)
      .to(imgs, { scale: 1, duration: G.picture.duration + 0.5, ease: G.SETTLE, clearProps: 'clipPath' }, 0.2)
      .to(pic, { '--fx': fx, duration: G.hairline.duration, ease: G.DRAW, clearProps: '--fx' }, G.detail.at + G.detail.stagger);
    if (def.heroDetail) safe('hero detail', () => def.heroDetail(tl, room));
    W.addEventListener('resize', () => { if (tl.progress() < 1) tl.progress(1); });
    // the breath: from 1.06 to rest across the photograph's time on screen (the hero: until the next room covers it)
    if (imgs.length && G.breath) {
      const B = G.breath; let last = -1;
      const set = u => { const v = u >= 1 ? B.scaleTo : +(B.scaleFrom + (B.scaleTo - B.scaleFrom) * Math.max(0, u)).toFixed(4); if (v !== last) { last = v; imgs.forEach(i => { i.style.scale = v; }); } };
      set(0);
      ST.create({ trigger: pic, start: 0, end: () => Math.max(W.innerHeight, room.offsetHeight), invalidateOnRefresh: true, onUpdate: s => set(s.progress), onRefresh: s => set(s.progress) });
    }
  }

  /* ========================= room heads (owners.js roomHead, Flow: per block) ========================= */
  function headsInit() {
    R.rooms.filter(r => r !== R.hero && r !== R.close).forEach(r => {
      const h2 = $(O('ow-open') + ' h2', r) || $('h2', r); if (!h2) return;
      const words = $$('[data-ow-appear]', r);
      gfx.room({ trigger: h2, headline: h2, body: words, start: 'top 84%' });
    });
  }

  /* ========================= the questions (owners.js + gf-site.js f) =========================
     One answer open at a time: opening a question closes the open one in the same list; the clicked question stays where
     it is on the screen while one above it closes. The rows' hairlines draw in, 0.08 s apart, then the questions rise. */
  function questionsWire() {
    const room = R.qs; if (!room) return;
    let hold = 0;
    $$(O('ow-acc-item'), room).forEach(it => {
      const b = $(O('ow-acc-b'), it); if (!b) return;
      const toggle = () => {
        const open = !it.classList.contains('is-open'), list = it.parentElement;
        if (open) {
          const others = $$(O('ow-acc-item'), list).filter(x => x !== it && x.classList.contains('is-open'));
          const top0 = b.getBoundingClientRect().top;
          const above = others.filter(x => x.getBoundingClientRect().top < top0);
          const panels = above.map(x => { const pn = $(O('ow-acc-p'), x); if (!pn) return null; const h0 = pn.getBoundingClientRect().height; pn.style.setProperty('transition', 'none', 'important'); pn.style.overflow = 'hidden'; pn.style.height = h0 + 'px'; pn.style.gridTemplateRows = '1fr'; return { pn, h0, h: h0 }; }).filter(Boolean);
          others.forEach(x => { x.classList.remove('is-open'); const ob = $(O('ow-acc-b'), x); if (ob) ob.setAttribute('aria-expanded', 'false'); });
          if (panels.length) {
            const setY = to => { const L = gfx.lenis; if (L && L.scrollTo) { try { L.scrollTo(to, { immediate: true, force: true }); return; } catch (e) { /* native */ } } W.scrollTo(0, to); };
            cancelAnimationFrame(hold); const t0 = performance.now(), Dn = REDUCE ? 1 : 450;
            const step = now => {
              const t = Math.min(1, (now - t0) / Dn), k = t >= 1 ? 1 : 1 - Math.pow(2, -10 * t); let shift = 0;
              panels.forEach(o => { const hh = o.h0 * (1 - k); shift += o.h - hh; o.h = hh; o.pn.style.height = hh.toFixed(2) + 'px'; });
              if (shift > 0.01) setY((W.scrollY || 0) - shift);
              if (t < 1) hold = requestAnimationFrame(step);
              else {
                panels.forEach(o => { o.pn.style.setProperty('transition', 'none', 'important'); o.pn.style.gridTemplateRows = ''; o.pn.style.height = ''; o.pn.style.overflow = ''; o.pn.offsetHeight; });
                requestAnimationFrame(() => requestAnimationFrame(() => panels.forEach(o => o.pn.style.removeProperty('transition'))));
              }
            };
            hold = requestAnimationFrame(step);
          }
        }
        it.classList.toggle('is-open', open); b.setAttribute('aria-expanded', String(open));
        setTimeout(gfx.refresh, 700);
      };
      b.addEventListener('click', toggle);
      // (a DOM button on Webflow: Enter and Space are the button's own; anything else is given them)
      if (b.tagName !== 'BUTTON') { b.setAttribute('role', 'button'); b.tabIndex = 0; b.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } }); }
    });
  }
  // the rows' film, per list (a list shown later, the other reader's, plays when it is shown)
  const played = new Set(); let qsInView = false;
  const heads = g => $$(O('ow-acc-item'), g).map(r => $(O('ow-acc-h'), r)).filter(Boolean);
  function playList(g) {
    if (!gsap || REDUCE || played.has(g) || g.hidden) return; played.add(g);
    const rows = $$(O('ow-acc-item'), g);
    gsap.to(rows, { '--ow-rl': 1, duration: G.hairline.duration, ease: G.DRAW, stagger: TIGHT });
    gsap.to(heads(g), { opacity: 1, y: 0, duration: G.body.duration, ease: G.SETTLE, stagger: TIGHT, delay: G.arrow.at - G.hairline.at, clearProps: 'transform' });
  }
  const lists = () => { const acc = R.qs && $(O('ow-acc'), R.qs); if (!acc) return []; const g = $$(O('r4-qgroup'), acc); return g.length ? g : [acc]; };
  function questionsInit() {
    const acc = R.qs && $(O('ow-acc'), R.qs); if (!acc) return;
    lists().forEach(g => { gsap.set($$(O('ow-acc-item'), g), { '--ow-rl': 0 }); gsap.set(heads(g), { opacity: 0, y: G.body.y }); heads(g).forEach(h => h.setAttribute('data-gfx-reveal', '')); });
    ST.create({ trigger: acc, start: 'top 88%', once: true, onEnter: () => { qsInView = true; lists().forEach(playList); } });
  }

  /* ========================= the close (gf-site.js e + pages-flow2.js) =========================
     The headline rises as the close arrives; the action arrives with it (gfc-in); the house underline on its last word
     turns up into the arrow (gfArrow); the doors are type. While footer I's green call is in view and the close has mostly
     left, the close's arrow and its action step back (one green call in view). */
  let closeMark = null;
  function closeMarkInit(still) {
    const room = R.close; if (!room || !W.gfArrow) return;
    const h2 = $('h2', room), top = $(O('gfc-top'), room); if (!h2 || !top) return;
    closeMark = W.gfArrow.word({ el: h2, host: top, cls: 'gfc-mark', auto: !still });
    if (still && closeMark) closeMark.still();
  }
  function closeInit() {
    const room = R.close; if (!room) return;
    const h2 = $('h2', room), top = $(O('gfc-top'), room);
    if (h2) gfx.room({ trigger: h2, headline: h2, start: 'top 84%' });
    if (top && 'IntersectionObserver' in W) { const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { room.classList.add('gfc-in'); io.disconnect(); } }), { rootMargin: '0px 0px -28% 0px' }); io.observe(top); }
    else room.classList.add('gfc-in');
    let near = false, rq = 0;
    const seen = fa => { const b = fa.getBoundingClientRect(); if (!(b.width > 0 && b.top < W.innerHeight && b.bottom > 0)) return false; const e = D.elementFromPoint(Math.min(W.innerWidth - 1, Math.max(0, b.left + b.width / 2)), Math.min(W.innerHeight - 1, Math.max(0, b.top + b.height / 2))); return !!(e && e.closest('.footer_section_wrapper')); };
    const check = () => { rq = 0; const fa = $('.gfx-fi-act'); if (!fa) return; const cr = room.getBoundingClientRect(), k = Math.max(0, Math.min(cr.bottom, W.innerHeight) - Math.max(cr.top, 0)) / (cr.height || 1); room.classList.toggle('gfc-rest', near && k <= 0.4 && seen(fa)); };
    const ask = () => { if (near && !rq) rq = requestAnimationFrame(check); };
    if ('IntersectionObserver' in W) new IntersectionObserver(es => es.forEach(e => { near = e.isIntersecting; ask(); })).observe(room);
    W.addEventListener('scroll', ask, { passive: true }); W.addEventListener('resize', ask);
  }

  /* ========================= the page: one call from the page's layer ========================= */
  function run(def) {
    def = def || {};
    // (the header runs before the body is parsed: the rooms are read once the DOM is there, before the field starts)
    const field = { rooms: [] };
    gfx.page({
      field,
      foot: { close: O('ow-close') },
      fox: O('ow-close') + ' ' + O('gfc-fox'),
      dom: () => { safe('pages dom', () => dom(def)); field.rooms = fieldDef().rooms; safe('questions', questionsWire); if (def.dom) safe('page dom', () => def.dom(api)); },
      start: () => {
        gsap = gfx.gsap; ST = gfx.ST;
        safe('hero', () => heroInit(def));
        if (def.start) safe('page start', () => def.start(api));
      },
      rooms: () => {
        safe('heads', headsInit);
        safe('questions motion', questionsInit);
        safe('close', closeInit);
        if (def.rooms) safe('page rooms', () => def.rooms(api));
      },
      late: () => { safe('close mark', () => closeMarkInit(false)); if (def.late) safe('page late', () => def.late(api)); },
      still: () => {
        gsap = W.gsap || null; ST = W.ScrollTrigger || null;
        H.classList.add('ow-hero-on');
        if (R.close) R.close.classList.add('gfc-in');
        safe('close mark', () => closeMarkInit(true));
        if (def.still) safe('page still', () => def.still(api));
      }
    });
  }
  const api = {
    O, R, mk, run, playList, lists,
    get heroTl() { return heroTl; }, get qsInView() { return qsInView; },
    get gsap() { return gsap || W.gsap; }, get ST() { return ST || W.ScrollTrigger; }
  };
  gfx.pages = api;
})();
