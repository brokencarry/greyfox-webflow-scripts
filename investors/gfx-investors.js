/*!
 * Grey Fox · gfx Investors (Flow 3), the Investors layer on the shared core (core/gfx-core.js).
 * investors 1.0.0 · 2026-10-20 · Webflow page "Investors v2" (/investors-v2, 6aceedf3e2088a6fa50541d9).
 *
 * WHAT IT IS
 *   The approved local Flow 3 Investors (prototype/investors/index.html, Flow 3 the default: iv-flow2.js + iv-flow2.css over
 *   investors.js's free-scroll path, with gf-site.js, gf-turn.js, gf-flow2-base.css and footer I), its own rooms only;
 *   everything every page shares (the field and its one turn, the bar, the arrow, footer I, the close's fox) is the core's.
 *   The DOM is Webflow's own: the 10/13 build's rooms (gfx- classes, data-o = the local classes) with the port's native
 *   structures in place of the ones the local page builds at runtime (stage 1, the pipeline's window, Mission Control's
 *   stage, the close's action and doors; audit/webflow-build/f3-investors/PLAN-writes.md). This layer animates that DOM
 *   and draws only what is decoration (stage 1's line, the window chrome of Mission Control, the odometer reels).
 *
 * THE ROOMS (paper, then ONE turn to the black at Mission Control; the black runs on through the close into footer I)
 *   hero          investors.js §1: the headline rises line by line, the words, the hairline, the tug photograph opens and
 *                 settles once (1.04 → 1, 7 s), the two figures roll (a share rolls its first number only)
 *   stage 1       iv-flow2.js STAGE 1: a sticky stage of 2.0 screens, scrubbed: the green line runs through the four
 *                 stages, each median settles as its step is reached, the line turns up into the house head, the closing
 *                 lines rise. Below 992 px or reduced motion: still, every fact settled
 *   delivery      investors.js §3 (the figures roll under their rules, the note) + iv-flow2.js DELIVERY: the client's live
 *                 pipeline (the repo's portal/, a fictional HVAC search, loaded from gfx.BASE + 'portal/') opens and plays
 *   Mission       iv-flow2.js STAGE 2: a sticky stage of 1.9 screens: the window opens as the stage arrives; the scroll
 *   Control       moves through Refined → Efficient → Transparent, each recording playing as its beat is active. Still:
 *                 the posters (last frames), the words as buttons, a Play control
 *   cases         investors.js §5: the client's words with the head; each photograph opens, its figure rolls, its words
 *   care          investors.js §6: the sentence, its three hairlines, the two quiet lines
 *   close         gf-site.js close (native here: the action, the doors) + the house arrow under "thesis."
 * Reduced motion: every room settled. ?gfm=0: the page exactly as Webflow serves it.
 */
(function () {
  'use strict';
  var W = window, D = document, gfx = W.gfx;
  if (!gfx || !gfx.page || W.__gfxInvestors) return;
  W.__gfxInvestors = '1.0.3';
  const H = D.documentElement, G = gfx.G, $ = gfx.$, $$ = gfx.$$, safe = gfx.safe, mq = gfx.mq, clamp = gfx.clamp;
  const NS = gfx.NS, TAN = gfx.TAN, REDUCE = gfx.REDUCE;
  const O = c => '[data-o~="' + c + '"]';
  const oHas = (el, c) => !!el && (' ' + (el.getAttribute('data-o') || '') + ' ').indexOf(' ' + c + ' ') > -1;
  const oSet = (el, c, on) => { if (!el) return; const t = (el.getAttribute('data-o') || '').split(/\s+/).filter(x => x && x !== c); if (on) t.push(c); el.setAttribute('data-o', t.join(' ')); };
  const SETTLE = G.SETTLE, GLIDE = G.DRAW, GROUP = G.group;
  const lerp = (a, b, t) => a + (b - a) * t, seg = (p, a, b) => clamp((p - a) / (b - a), 0, 1);
  const ss = t => t * t * (3 - 2 * t), eo = t => 1 - Math.pow(1 - t, 3), eio = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const txt = el => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  let gsap = null, ST = null;
  const refresh = () => gfx.refresh();
  const sy = () => gfx.scrollNow();
  // the local page's html states (the ported stylesheet keys on them): Flow 3 on, the rooms built; "live" = a desktop with motion
  let live = false;
  const decideLive = () => { live = !REDUCE && mq('(min-width: 992px)'); H.classList.toggle('iv2-live', live); };
  // (only Home has the first-visit opening: the core marks a session's first page html.gfx-intro, whose body { overflow:
  // hidden } waits for Home's splash to end. Here nothing would ever end it, and a hidden-overflow body is a scroll
  // container of its own, so the two sticky stages would never stick. Inner pages open straight on their room)
  safe('head', () => { H.classList.remove('gfx-intro'); H.classList.add('gfx-iv3', 'iv-f2', 'gf-flow3', 'ow-js'); if (REDUCE) H.classList.add('ow-reduce'); decideLive(); });

  const R = {};
  const findRooms = () => { const k = c => $(O(c)); R.hero = k('ow-hero'); R.res = k('iv-fun'); R.del = k('iv-client'); R.mc = k('iv-mc'); R.cases = k('iv-cases'); R.care = k('iv-std'); R.close = k('iv-close'); };
  findRooms();

  /* ========================= the field (iv-flow2.js THE TURN, Flow 3) =========================
     Light-led: the hero, stage 1 and delivery on the paper; ONE turn, into Mission Control (the black means the product),
     placed by gf-turn.js closeAt(Mission Control): the later of its top at 60 % and delivery's last line in the top eighth,
     and no later than its headline at 72 %. The black runs on through the cases, the care and the close into footer I.
     Every room keeps its own inks (the ported stylesheet: html.iv2-dt is the black's). */
  const prevRoom = room => { let p = room.previousElementSibling; while (p && !(p.matches('section, .ow-room, [class*="section"], [data-o~=ow-room]') && p.querySelector('h1, h2, h3, p, img'))) p = p.previousElementSibling; return p; };
  const closeAt = (room, c) => {
    const y = sy(), vh = W.innerHeight, top = room.getBoundingClientRect().top + y, max = D.documentElement.scrollHeight - vh;
    let at = top - vh * 0.6; const pv = prevRoom(room);
    if (pv && W.gfTurn && W.gfTurn.lastBottom) { const lb = W.gfTurn.lastBottom(pv); if (Number.isFinite(lb)) at = Math.max(at, lb - vh * 0.12); }
    const hd = room.querySelector('h2, .heading-2'); if (hd) at = Math.min(at, hd.getBoundingClientRect().top + y - vh * 0.72);
    return Math.min(at, max - vh * 0.04);
  };
  const field = {
    phoneRhythm: true,   // (1.0.2) the house phone rhythm on every room
    rooms: [
      { el: O('ow-hero'), native: 'L', tone: 'L', noInk: true },
      // (1.0.2, final audit) on a phone the rooms take the house rhythm (80 within a colour, the turn into the black)
      // like Home and Owners; their gaps had been 91 to 500px. Desktop keeps its own spacing.
      { el: O('iv-fun'), native: 'L', tone: 'L', noInk: true, tier: 'standard' },
      { el: O('iv-client'), native: 'L', tone: 'L', noInk: true, tier: 'standard' },
      { el: O('iv-mc'), native: 'D', tone: 'D', noInk: true, tier: 'turn', turnAt: (ym, c) => closeAt(c.room.el, c) },
      { el: O('iv-cases'), native: 'D', tone: 'D', noInk: true, tier: 'standard' },
      { el: O('iv-std'), native: 'D', tone: 'D', noInk: true, tier: 'standard' },
      { el: O('iv-close'), native: 'D', tone: 'D', noInk: true, opaque: true, foot: true, tier: 'standard' }
    ]
  };
  // the inks follow the field's tone (iv-flow2.js ink(): html.iv2-dt, stage 1 re-inked in place)
  const inks = () => { let dk = null; const f = () => { const d = H.classList.contains('gfx-tone-dark'); if (d === dk) return; dk = d; H.classList.toggle('iv2-dt', d); if (R.res) R.res.classList.toggle('ow-char', d); };
    f(); new MutationObserver(f).observe(H, { attributes: true, attributeFilter: ['class'] }); };

  /* ========================= the static structure (iv-flow2.js PREP, on the native DOM) ========================= */
  const S1 = {}, S2 = {}, CL = {};
  function dom() {
    findRooms();
    // the bar: "Investors" is the page you are on
    $$('.gfx-nav a.navigation-item').forEach(a => { if ((a.textContent || '').trim().toLowerCase() === 'investors') { a.classList.add('gfx-current'); a.setAttribute('aria-current', 'page'); } });
    // the state classes the local page carries as classes (a native element carries them in data-o only)
    $$('[data-o~="is-on"], [data-o~="ow-char"]').forEach(e => { if (oHas(e, 'is-on')) e.classList.add('is-on'); if (oHas(e, 'ow-char')) e.classList.add('ow-char'); });
    // (prep) delivery and the care are dark rooms in the local markup (on the paper they take the paper's inks)
    [R.del, R.care].forEach(r => r && r.classList.add('ow-char'));
    // the builder may drop the space between two inline spans: the headline's lines and the verdict's two sentences
    $$(O('iv2-h') + ', ' + O('iv2-verdict')).forEach(p => { const k = [...p.children].filter(c => c.tagName === 'SPAN'); k.slice(1).forEach(s => { const pv = s.previousSibling; if (!(pv && pv.nodeType === 3 && /\s/.test(pv.textContent))) s.before(D.createTextNode(' ')); }); });
    // STAGE 1
    if (R.res) {
      Object.assign(S1, { room: R.res, track: $(O('iv2-track'), R.res), stage: $(O('iv2-stage'), R.res), hls: $$(O('iv2-hl') + ' > span', R.res), lede: $(O('iv2-lede'), R.res),
        tl: $(O('iv2-tl'), R.res), stops: $$(O('iv2-stop'), R.res), vs: $$(O('iv2-verdict') + ' > span', R.res), vrule: $(O('iv2-vrule'), R.res) });
      if (S1.tl && !$('svg.iv2-line', S1.tl)) {
        S1.tl.insertAdjacentHTML('afterbegin', '<svg class="iv2-line" aria-hidden="true" focusable="false"><defs><mask id="iv2-lm" maskUnits="userSpaceOnUse"><path class="iv2-lm-p" pathLength="1"/></mask></defs><path class="iv2-ln" mask="url(#iv2-lm)"/></svg>');
      }
      S1.svg = $('svg.iv2-line', R.res); S1.ln = $('.iv2-ln', R.res); S1.mp = $('.iv2-lm-p', R.res);
      // (the medians: each shown whole once its step is reached; the local page's count never matches its figures, so
      // they arrive as they stand there: "4", "3.5 days", "10 days", "40%+")
      S1.stops.forEach(li => { li._num = $(O('iv2-num'), li); li._k = $(O('iv2-k'), li); });
    }
    // STAGE 2, Mission Control: the window in the site's one browser frame (one tab with the gold fox, a neutral address)
    if (R.mc) {
      const track = $(O('iv2-mtrack'), R.mc), stage = track && $(O('iv2-mstage'), track), win = track && $(O('iv2-mwin'), track);
      if (win && !$('.iv2-chrome', win)) win.insertAdjacentHTML('afterbegin', `<div class="iv2-chrome" aria-hidden="true"><div class="iv2-tabs"><div class="iv2-tab"><img src="${esc(gfx.BASE + 'assets/favicon-gold.svg')}" alt=""><span>Grey Fox Partners</span></div><div class="iv2-wc"><i></i><i></i><i></i></div></div><div class="iv2-bar"><div class="iv2-nav"><i></i><i></i></div><div class="iv2-url"><span>Mission Control</span></div></div></div>`);
      // still (below the desktop, reduced motion): the opener stands above the stage and the window is not held in a cell
      if (track && !live) {
        const inner = track.parentElement, open = $(O('ow-open'), stage), rule = $(':scope > ' + O('ow-rule'), stage), cell = $(O('iv2-mcell'), stage);
        if (open) inner.insertBefore(open, track); if (rule) inner.insertBefore(rule, track);
        if (cell && win) { cell.before(win); cell.remove(); }
        oSet(track, 'iv2-mheld', false);
      }
      Object.assign(S2, { room: R.mc, track, stage, win, winIn: track && $(O('iv2-mwin-in'), track), vids: track ? $$('video', track) : [],
        bs: track ? $$(O('iv2-mb'), track) : [], bbs: track ? $$(O('iv2-mbb'), track) : [], play: track && $(O('iv2-mplay'), track), foot: track && $(O('iv2-mfoot'), track) });
    }
    // THE CLOSE: the last word carries the line (gf-site.js close; the action and the doors are native)
    if (R.close) {
      const h = $('h2', R.close);
      if (h && !$('.iv2-cw', h)) { const t = h.textContent, i = t.trimEnd().lastIndexOf(' '); if (i > 0) h.innerHTML = `${esc(t.slice(0, i))} <span class="iv2-cw">${esc(t.slice(i + 1).trim())}</span>`; }
      R.close.classList.add('gfc-on');
      const fox = $(O('ow-close-fox'), R.close); if (fox) fox.classList.add('gfc-fox');
      Object.assign(CL, { room: R.close, top: $(O('gfc-top'), R.close), h });
    }
    H.classList.add('iv2-prepped');
  }

  /* ========================= helpers (investors.js) ========================= */
  const show = (el, k, dy) => { if (!el) return; dy = dy == null ? 14 : dy; const o = k.toFixed(3), t = `translate3d(0, ${((1 - k) * dy).toFixed(2)}px, 0)`; if (el._o !== o) { el.style.opacity = o; el._o = o; } if (el._tr !== t) { el.style.transform = t; el._tr = t; } };
  const setVar = (el, k, v) => { const s = v.toFixed(3); if (el['_' + k] !== s) { el.style.setProperty(k, s); el['_' + k] = s; } };
  const shownNow = els => gsap.set(els, { clearProps: 'pointerEvents' });
  const hideNow = els => { els = [].concat(els).filter(Boolean); els.forEach(e => e.setAttribute('data-ow-reveal', '')); if (els.length) gsap.set(els, { opacity: 0, y: G.body.y, pointerEvents: 'none' }); };
  const settleIn = (tl, els, at, o) => { o = o || {}; els = [].concat(els).filter(Boolean); if (!els.length) return; tl.fromTo(els, { opacity: 0, y: o.y != null ? o.y : G.body.y }, { opacity: 1, y: 0, duration: o.d != null ? o.d : G.body.duration, ease: SETTLE, stagger: o.st != null ? o.st : GROUP, immediateRender: false, onStart: () => shownNow(els) }, at); };
  // play once on arrival (or finish at once if skipped past), then the trigger is gone
  const once = (trigger, start, play, finish) => { let done = false;
    ST.create({ trigger, start, onEnter: s => { if (done) return; done = true; play(false); s.kill(); }, onLeave: s => { if (done) return; done = true; (finish || play)(true); s.kill(); } }); };
  // the odometer (investors.js odo): the text is always the locked value, a reader hears it once; the reels roll into it
  const odo = b => {
    const val = b.dataset.final || (b.dataset.final = b.textContent.trim());
    b.textContent = '';
    const sr = D.createElement('span'); sr.className = 'ow-sr'; sr.textContent = val; b.append(sr);
    const vis = D.createElement('span'); vis.setAttribute('aria-hidden', 'true'); b.append(vis);
    const reels = []; let k = 0;
    for (const ch of val) {
      if (!/[0-9]/.test(ch)) { vis.append(ch); continue; }
      const d = +ch, n = 4 + k, sq = []; for (let j = n; j >= 1; j--) sq.push((d - j + 100) % 10);
      const mask = D.createElement('ow-odo'), reel = D.createElement('ow-reel');
      reel.textContent = ch; reel.setAttribute('data-seq', sq.join('\n')); mask.append(reel); vis.append(mask); reels.push([reel, n, k]); k++;
    }
    reels.forEach(([reel, n]) => gsap.set(reel, { yPercent: n * 100 }));
    gsap.set(b, { opacity: 0 });
    const settle = gsap.parseEase(SETTLE), setY = reels.map(([reel]) => gsap.quickSetter(reel, 'yPercent'));
    return (tl, at) => {
      tl.set(b, { opacity: 1 }, at);
      if (!reels.length) return;
      const last = reels.length - 1, T = G.figure.duration, total = last * 0.07 + T + last * 0.1, clock = { t: 0 };
      tl.fromTo(clock, { t: 0 }, { t: total, duration: total, ease: 'none', immediateRender: false,
        onUpdate: () => reels.forEach(([, n, i], j) => { const s = Math.min(1, Math.max(0, (clock.t - i * 0.07) / (T + i * 0.1))); setY[j](n * 100 * (1 - settle(s))); }) }, at);
    };
  };
  const rolls = new Map();
  const roll = el => { if (!el) return null; if (!rolls.has(el)) { const t = el.textContent.trim(), f = /^([0-9]+)(\s(?:of|in|to)\s.+)$/.exec(t);
    if (f) { el.textContent = ''; const nEl = D.createElement('span'); nEl.className = 'iv-odo-n'; nEl.textContent = f[1]; el.append(nEl, f[2]); const play = odo(nEl); gsap.set(el, { opacity: 0 }); rolls.set(el, (tl, at) => { tl.set(el, { opacity: 1 }, at); play(tl, at); }); }
    else rolls.set(el, odo(el)); } return rolls.get(el); };
  // a film plays only as far as the blocks that have reached 88 % of the screen (investors.js filmAt, the free-scroll path:
  // Flow 3 never holds); jumped past, it completes
  const FILM_MAX = 1.4;
  const fitFilm = (tl, max) => { max = max || FILM_MAX; const d = tl.duration(); if (d > max) tl.timeScale(d / max); return tl; };
  const filmAt = (room, el, build) => {
    let tl = null, limit = 0, rows = null;
    const make = () => { if (!tl) { tl = gsap.timeline({ paused: true }); build(tl); fitFilm(tl); } return tl; };
    const measure = () => { const t = make(), top = el.getBoundingClientRect().top; let off = 0;
      return t.getChildren(false, true, true).sort((a, b) => a.startTime() - b.startTime()).map(k => {
        const g = k.targets ? k.targets().find(x => x && x.nodeType === 1) : null;
        if (g) { const r = g.getBoundingClientRect(); if (r.width || r.height) off = Math.max(0, r.top - top); }
        return { off, end: k.endTime() }; }); };
    const advance = off => {
      const t = make(); if (!rows) rows = measure();
      if (!t.owLimit) { t.owLimit = 1; t.owBase = t.timeScale(); t.eventCallback('onUpdate', () => { if (!t.paused() && t.time() >= limit - 1e-4) { t.pause(); t.time(Math.min(limit, t.duration()), true); t.timeScale(t.owBase); } }); }
      let L = limit; if (off === Infinity) L = t.duration(); else rows.forEach(r => { if (r.off <= off) L = Math.max(L, r.end); });
      if (L > limit) { limit = L; if (t.progress() < 1 && t.time() < limit) { t.timeScale(Math.max(t.owBase, (limit - t.time()) / 0.7)); t.play(); } }
    };
    ST.create({ trigger: el, start: 'top 88%', end: 'bottom 88%', invalidateOnRefresh: true,
      onEnter: s => advance(s.progress * el.offsetHeight + 1), onUpdate: s => { if (s.isActive) advance(s.progress * el.offsetHeight + 1); }, onLeave: () => advance(Infinity) });
  };
  // a room's head (investors.js roomHead): as its headline reaches 82 % its lines rise; its words follow; its rule draws
  const splitRise = (h, onSplitShown) => {
    let shown = false, first = true;
    W.SplitText.create(h, { type: 'lines', mask: 'lines', linesClass: 'ow-line', autoSplit: true, aria: 'none',
      onSplit: self => { gsap.set(self.lines, { yPercent: shown ? 0 : G.headline.yPercent }); if (!first) requestAnimationFrame(() => D.dispatchEvent(new Event('ow:resplit'))); first = false; } });
    return { lines: () => $$('.ow-line', h), shown: () => { shown = true; } };
  };
  const offIn = (el, room) => Math.max(0, Math.round(el.getBoundingClientRect().top - room.getBoundingClientRect().top));
  const headAt = (room, el, play) => { let done = false;
    ST.create({ trigger: room, start: () => 'top+=' + offIn(el, room) + ' 82%', end: '+=1', invalidateOnRefresh: true,
      onEnter: s => { if (done) return; done = true; play(false); s.kill(); }, onLeave: s => { if (done) return; done = true; play(true); s.kill(); } }); };
  const roomHead = room => {
    const open = room && $(O('ow-open'), room), h = open && $('h2', open); if (!h) return;
    const words = $$('[data-ow-appear]', open), rule = $$('[data-ow-draw]', room)[0] || null;
    const sp = splitRise(h);
    words.forEach(e => { e.removeAttribute('data-ow-appear'); e.setAttribute('data-ow-reveal', ''); });
    if (words.length) gsap.set(words, { opacity: 0, y: G.body.y, pointerEvents: 'none' });
    if (rule) { rule.removeAttribute('data-ow-draw'); gsap.set(rule, { scaleX: 0 }); }
    headAt(room, h, skip => {
      sp.shown(); const tl = gsap.timeline();
      tl.to(sp.lines(), { yPercent: 0, duration: G.headline.duration, stagger: G.headline.stagger, ease: SETTLE }, 0);
      if (words.length) tl.to(words, { opacity: 1, y: 0, duration: G.body.duration, stagger: GROUP, ease: SETTLE, onStart: () => shownNow(words) }, G.body.at);
      if (rule) tl.to(rule, { scaleX: 1, duration: G.hairline.duration, ease: GLIDE }, G.hairline.at);
      fitFilm(tl, 1.6); if (skip) { shownNow(words); tl.progress(1); }
    });
  };
  // a headline outside an opener (the care, the close): it rises as it reaches 84 %
  const rise = el => { if (!el) return; const sp = splitRise(el);
    once(el, 'top 84%', skip => { sp.shown(); const ls = sp.lines(); if (skip) gsap.set(ls, { yPercent: 0 }); else gsap.to(ls, { yPercent: 0, duration: G.headline.duration, stagger: G.headline.stagger, ease: SETTLE }); }); };

  /* ========================= 1 · the hero (investors.js §1) ========================= */
  function heroInit() {
    const room = R.hero; if (!room) return;
    const h1 = $(O('ow-h1'), room); if (!h1) return;
    let heroTl = null, prevLines = null, first = true;
    W.SplitText.create(h1, { type: 'lines', mask: 'lines', linesClass: 'ow-line', autoSplit: true, aria: 'none',
      onSplit: self => {
        const was = prevLines; prevLines = [...self.lines];
        if (h1.dataset.risen || !heroTl) gsap.set(self.lines, { yPercent: h1.dataset.risen ? 0 : G.headline.yPercent });
        else self.lines.forEach((l, i) => { const o = was && was[Math.min(i, was.length - 1)], from = o ? +gsap.getProperty(o, 'yPercent') || 0 : G.headline.yPercent;
          gsap.fromTo(l, { yPercent: from }, { yPercent: 0, duration: from > 0 ? G.headline.duration * (from / G.headline.yPercent) + 0.2 : 0.01, delay: from > 0 ? i * G.headline.stagger : 0, ease: SETTLE, overwrite: true }); });
        if (!first) requestAnimationFrame(() => D.dispatchEvent(new Event('ow:resplit'))); first = false; } });
    const words = [$(O('ow-hero-lede'), room), $(O('ow-actions'), room)].filter(Boolean), rule = $(O('ow-hero-foot') + ' > ' + O('ow-rule'), room) || $(O('ow-rule'), room), stats = $$(O('iv-stat'), room);
    const pic = $(O('ow-hero-pic'), room), img = pic && ($('img[data-o~="iv-hero-tug"]', pic) || $('img', pic)), fx = pic ? (getComputedStyle(pic).getPropertyValue('--fx').trim() || '96px') : '96px';
    const lede = $(O('ow-hero-lede'), room), wordsHid = words.filter(w => w !== lede);
    if (wordsHid.length) gsap.set(wordsHid, { opacity: 0, y: G.body.y }); if (lede) gsap.set(lede, { y: G.body.y }); if (rule) gsap.set(rule, { scaleX: 0 });
    const statK = stats.map(st => $(O('iv-stat-k'), st)), statPlay = stats.map(st => { const f = $('[data-ow-odo]', st); if (!f) return null; const m = /^([0-9]+)(\s.+)$/.exec(f.textContent.trim());
      if (!m) return odo(f); f.textContent = ''; const n = D.createElement('span'); n.className = 'iv-odo-n'; n.textContent = m[1]; f.append(n, m[2]); const p = odo(n); gsap.set(f, { opacity: 0 }); return (tl, at) => { tl.set(f, { opacity: 1 }, at); p(tl, at); }; });
    gsap.set(statK, { opacity: 0, y: G.detail.y });
    const tug = img && oHas(img, 'iv-hero-tug'), tugRest = tug && gfx.store.get('gfx-still') === '1';
    if (img) { gsap.set(img, { clipPath: G.picture.clipFrom, scale: tug ? (tugRest ? 1 : 1.04) : G.picture.scaleFrom }); gsap.set(pic, { '--fx': '0px' }); }
    H.classList.add('ow-hero-on', 'gfx-ready');
    const tl = heroTl = gsap.timeline({ paused: true });
    tl.to($$('.ow-line', h1), { yPercent: 0, duration: G.headline.duration, stagger: G.headline.stagger, ease: SETTLE, onComplete: () => { h1.dataset.risen = 1; } }, 0)
      .to(words, { opacity: 1, y: 0, duration: G.body.duration, stagger: GROUP, ease: SETTLE }, G.body.at)
      .to(rule, { scaleX: 1, duration: G.hairline.duration, ease: GLIDE }, G.hairline.at);
    const PIC_AT = 0.15;
    if (img && tug) {
      tl.to(img, { clipPath: 'inset(0% 0% 0% 0%)', duration: G.picture.duration, ease: GLIDE }, PIC_AT);
      if (!tugRest) tl.add(() => { const go = () => gsap.fromTo(img, { scale: 1.04 }, { scale: 1, duration: 7, ease: SETTLE });
        if (img.complete && img.naturalWidth) go(); else { img.addEventListener('load', go, { once: true }); img.addEventListener('error', () => gsap.set(img, { scale: 1 }), { once: true }); } }, PIC_AT);
    } else if (img) tl.to(img, { clipPath: 'inset(0% 0% 0% 0%)', duration: G.picture.duration, ease: GLIDE }, PIC_AT).to(img, { scale: 1, duration: G.picture.duration + 0.5, ease: SETTLE }, PIC_AT + 0.34);
    stats.forEach((st, i) => { const at = G.detail.at + i * 0.3; statPlay[i] && statPlay[i](tl, at); tl.to(statK[i], { opacity: 1, y: 0, duration: G.detail.duration, ease: SETTLE }, at + 0.15); });
    if (img) tl.to(pic, { '--fx': fx, duration: G.hairline.duration, ease: GLIDE }, G.detail.at + G.detail.stagger);
    // (as local: it plays once the rooms are set up, at most 1.2 s after load)
    const go = () => { if (tl.paused() && !tl.progress()) tl.play(); };
    W.ivHeroGo = go; setTimeout(go, 1200);
    W.addEventListener('resize', () => { if (tl.progress() < 1 && tl.isActive()) tl.progress(1); });
  }

  /* ========================= the breath (investors.js, sbx-m1.js M3): the cases' photographs settle with the scroll ========================= */
  function breathInit() {
    if (/[?&]motif=1(&|$)/.test(location.search) || !G.breath) { H.classList.add('ow-motif'); return; }
    H.classList.add('ow-motif', 'ow-breath');
    const B = G.breath;
    const breathe = (pic, frame, range) => { let last = -1, q = 0.0005;
      const set = u => { const raw = B.scaleFrom + (B.scaleTo - B.scaleFrom) * u, v = u >= 1 ? B.scaleTo : u <= 0 ? B.scaleFrom : +(Math.round(raw / q) * q).toFixed(4); if (v !== last) { last = v; pic.style.scale = v; } };
      set(0);
      ST.create({ trigger: frame, start: () => range()[0], end: () => range()[1], invalidateOnRefresh: true,
        onToggle: st => { pic.style.willChange = st.isActive ? 'transform' : ''; }, onUpdate: st => set(st.progress), onRefresh: st => { q = 1 / Math.max(400, frame.offsetWidth || 400); set(st.progress); } }); };
    $$(O('iv-case-bg')).forEach(bg => { const img = $('img', bg), rm = R.cases; if (img && rm) breathe(img, bg, () => { const t = rm.getBoundingClientRect().top + sy(); return [Math.max(0, t - W.innerHeight), t + rm.offsetHeight]; }); });
  }

  /* ========================= 3 · delivery (investors.js §3): the figures roll under their rules, the note ========================= */
  function deliveryInit() {
    const room = R.del, figsBox = room && $(O('iv-dfigs'), room); if (!figsBox) return;
    const dfs = $$(O('iv-df'), room), note = $(O('iv-df-note'), room), dRoll = dfs.map(d => roll($('[data-ow-odo]', d))), dText = dfs.map(d => $(O('iv-df-k'), d));
    gsap.set(dfs, { '--ow-rl': 0 }); hideNow([...dText, note]);
    filmAt(room, figsBox, tl => {
      dfs.forEach((d, i) => { const a = 0.1 + i * 0.3; tl.to(d, { '--ow-rl': 1, duration: G.hairline.duration, ease: GLIDE }, a); dRoll[i] && dRoll[i](tl, a + 0.15); settleIn(tl, dText[i], a + 0.3, { y: G.detail.y, d: G.detail.duration }); });
      settleIn(tl, note, 0.1 + dfs.length * 0.3 + 0.3, { y: G.detail.y, d: G.detail.duration });
    });
  }
  /* ========================= 5 · three searches (investors.js §5) ========================= */
  function casesInit() {
    const room = R.cases, list = room && $(O('iv-case-list'), room); if (!list) return;
    const cases = $$(O('iv-case'), room), bgs = cases.map(c => $(O('iv-case-bg'), c)), kRoll = cases.map(c => roll($('[data-ow-odo]', c)));
    const kText = cases.map(c => [...$(O('iv-case-in'), c).children].filter(e => !oHas(e, 'iv-case-fig')));
    const qTop = $(O('iv-cq') + O('is-top'), room);
    gsap.set(bgs, { clipPath: G.picture.clipFrom }); hideNow(kText.flat());
    if (qTop) { hideNow(qTop); headAt(room, $('h2', room), skip => { const tl = gsap.timeline(); settleIn(tl, qTop, G.body.at, { d: G.body.duration }); if (skip) tl.progress(1); }); }
    filmAt(room, list, tl => {
      cases.forEach((c, i) => { const a = i * 0.35; tl.to(bgs[i], { clipPath: 'inset(0% 0% 0% 0%)', duration: G.picture.duration, ease: GLIDE }, a); settleIn(tl, kText[i][0], a + 0.35, { y: G.detail.y, d: G.detail.duration }); kRoll[i] && kRoll[i](tl, a + 0.5); settleIn(tl, kText[i].slice(1), a + 0.65, { st: 0.1, y: G.detail.y, d: G.detail.duration }); });
    });
  }
  /* ========================= 6 · chosen with care (investors.js §6; Flow 3 never holds) ========================= */
  function careInit() {
    const room = R.care, body = room && $(O('iv-std-r'), room); if (!body) return;
    const line = $(O('iv-std-line'), body), rules = $$(O('iv-std-rules') + ' > *', body), ps = $$(O('iv-std-p'), body), h = $('h2', room);
    gsap.set(rules, { '--ow-rl': 0 }); hideNow([line, ...ps]);
    rise(h);
    headAt(room, h, skip => { const tl = gsap.timeline();
      settleIn(tl, line, G.body.at, { d: G.body.duration });
      tl.to(rules, { '--ow-rl': 1, duration: G.hairline.duration, ease: GLIDE, stagger: GROUP }, G.hairline.at);
      fitFilm(tl, FILM_MAX); if (skip) tl.progress(1); });
    if (ps.length) once(ps[0], 'top 88%', skip => { const t2 = gsap.timeline(); settleIn(t2, ps, 0, { y: G.detail.y, d: G.detail.duration, st: GROUP }); if (skip) t2.progress(1); });
  }
  /* ---------- a figure and its caption leave the screen together (gf-site.js pairs) ---------- */
  function pairs() {
    const items = $$(O('iv-stat') + ', ' + O('iv-df')); if (!items.length) return;
    let rq = 0; const tick = () => { rq = 0; items.forEach(el => { const r = el.getBoundingClientRect(); el.classList.toggle('gf-pair-gone', r.top < 96 && r.bottom > 0); }); };
    W.addEventListener('scroll', () => { if (!rq) rq = requestAnimationFrame(tick); }, { passive: true }); tick();
  }

  /* ========================= STAGE 1 (iv-flow2.js): the line through the four stages ========================= */
  let L = null, E1 = 0, P1 = 0;
  const s1Layout = () => {
    if (!S1.svg || !S1.stops.length) return;
    const tl = S1.tl, Wd = tl.clientWidth, y = 11.5;
    const xs = S1.stops.map(li => li.offsetLeft);
    const x0 = xs[0], xEnd = Wd, rs = 22, run = rs / TAN, xt = xEnd - run, y2 = y - rs;
    const Lh = xt - x0, Ld = Math.hypot(run, rs), len = Lh + Ld;
    const N = Math.max(40, Math.round(len / 9)), pts = [];
    for (let i = 0; i <= N; i++) {
      const s = (i / N) * len; let px, py;
      if (s <= Lh) { px = x0 + s; py = y + Math.sin(s / 97) * 0.35 + Math.sin(s / 31 + 1.3) * 0.12; }
      else { const u = (s - Lh) / Ld; px = xt + run * u; py = y - rs * u; }
      const wd = (1.25 + 1.45 * Math.exp(-s / 10)) * (0.55 + 0.45 * clamp((len - s) / 46, 0, 1));
      pts.push([px, py, wd]);
    }
    const nrm = i => { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(N, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return [-dy / l, dx / l]; };
    const Lp = [], Rp = []; pts.forEach((p, i) => { const [nx, ny] = nrm(i); Lp.push(`${(p[0] + nx * p[2] / 2).toFixed(2)} ${(p[1] + ny * p[2] / 2).toFixed(2)}`); Rp.push(`${(p[0] - nx * p[2] / 2).toFixed(2)} ${(p[1] - ny * p[2] / 2).toFixed(2)}`); });
    S1.ln.setAttribute('d', 'M' + Lp.join(' L') + ' L' + Rp.reverse().join(' L') + ' Z');
    S1.mp.setAttribute('d', `M${(x0 - 6).toFixed(1)} ${y} H${xt.toFixed(1)} L${(xEnd + 2).toFixed(1)} ${(y2 - 2 * TAN).toFixed(1)}`);
    // the arrowhead: the house head (gfArrow), uncovered from its tip as the line arrives
    const a = Math.atan2(y2 - y, xEnd - xt);
    if (S1.hd) S1.hd.remove(); S1.hd = W.gfArrow ? W.gfArrow.head(S1.svg, xEnd, y2, Math.cos(a), Math.sin(a), { len: 12, w: W.gfArrow.CHART, at: S1.hk || 0 }) : null;
    S1.svg.setAttribute('width', Math.ceil(Wd + 4)); S1.svg.setAttribute('height', 40); S1.svg.style.top = '0px';
    const m = len + 6;
    L = { len: m, stops: xs.map(x => (x - x0 + 6) / m), endH: (Lh + 6) / m };
  };
  const figTo = (li, on) => {
    if (!li._num) return; if (li._tl) li._tl.kill();
    if (on) li._tl = gsap.timeline().fromTo(li._num, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out' }, 0).fromTo(li._k, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' }, 0.25);
    else li._tl = gsap.timeline().to([li._num, li._k], { opacity: 0, y: 8, duration: 0.3, ease: 'power2.in' });
  };
  const STEP = 0.23, BEAT = 0.13;
  const s1Render = () => {
    if (!L) return;
    const E = E1, P = P1;
    S1.hls.forEach((h, i) => { const k = eo(clamp(E * 1.7 - 0.35 - i * 0.18, 0, 1)); const t = `translate3d(0, ${((1 - k) * 105).toFixed(2)}%, 0)`; if (h._t !== t) { h.style.transform = t; h._t = t; } });
    show(S1.lede, eo(clamp(E * 1.7 - 0.75, 0, 1)), 12);
    let f = lerp(0, L.stops[0] + 0.004, eo(clamp(E * 1.6 - 0.8, 0, 1)));
    for (let i = 0; i < 4; i++) { const a = i * STEP, k = eio(seg(P, a + 0.01, a + BEAT)), from = L.stops[i], to = i < 3 ? L.stops[i + 1] : 1; if (P > a) f = lerp(from, to, k); }
    const off = (1 - f).toFixed(4); if (S1.mp._off !== off) { S1.mp.style.strokeDashoffset = off; S1.mp._off = off; }
    const hk = ss(seg(P, 3 * STEP + BEAT - 0.01, 3 * STEP + BEAT + 0.03));
    if (S1.hk !== hk) { S1.hk = hk; if (S1.hd) S1.hd.set(hk); }
    S1.stops.forEach((li, i) => {
      const a = i * STEP, arrive = eo(clamp(E * 1.8 - 0.9 - i * 0.08, 0, 1));
      show($(O('iv2-sn'), li), arrive, 10);
      const dot = $(O('iv2-dot'), li); const dk = arrive.toFixed(3); if (dot && dot._o !== dk) { dot.style.opacity = dk; dot._o = dk; }
      const hit = i === 0 ? clamp(E * 1.6 - 0.8, 0, 1) : ss(seg(f, L.stops[i] - 0.01, L.stops[i] + 0.002));
      const start = i === 0 ? 1 : ss(seg(P, a - 0.02, a + 0.01)), end = i === 3 ? 0 : ss(seg(P, a + STEP - 0.02, a + STEP + 0.01));
      setVar(li, '--hit', Math.max(hit, i === 0 ? hit : 0));
      setVar(li, '--on', Math.min(i === 0 ? clamp(E * 1.6 - 0.8, 0, 1) : start, 1 - end));
      if (li._num) { const on = P > a + 0.003; if (on !== !!li._on) { li._on = on; figTo(li, on); } }
    });
    if (S1.vrule) { const t = `scaleX(${eo(clamp(E * 1.8 - 0.95, 0, 1)).toFixed(4)})`; if (S1.vrule._t !== t) { S1.vrule.style.transform = t; S1.vrule._t = t; } }
    S1.vs.forEach((v, i) => show(v, eo(seg(P, 3 * STEP + BEAT + 0.005 + i * 0.02, 3 * STEP + BEAT + 0.06 + i * 0.02)), 16));
  };
  const s1Still = () => {
    if (!S1.svg) return;
    if (L) { S1.mp.style.strokeDashoffset = '0'; S1.hk = 1; if (S1.hd) S1.hd.set(1); }
    S1.stops.forEach((li, i) => { li.style.setProperty('--hit', '1'); li.style.setProperty('--on', i === 3 ? '1' : '0'); });
  };

  /* ========================= DELIVERY (iv-flow2.js): the live pipeline, the repo's portal/ ========================= */
  let portalP = null;
  const loadPortal = () => {
    if (portalP) return portalP;
    portalP = new Promise(res => {
      if (W.GFSearchScene) { res(true); return; }
      const base = (W.GFX_PORTAL_BASE || gfx.BASE + 'portal/');
      const l = D.createElement('link'); l.rel = 'stylesheet'; l.href = base + 'desktop-portal.css'; D.head.appendChild(l);
      const s = D.createElement('script'); s.src = base + 'desktop-portal.js'; s.async = true; s.onload = () => res(!!W.GFSearchScene); s.onerror = () => res(false); D.head.appendChild(s);
    });
    return portalP;
  };
  function pipe() {
    const box = $(O('iv2-pipe-in')); if (!box) return;
    let started = false;
    const tall = () => {
      const fit = () => {
        const view = $('.dp-view', box), frame = $('.dp-frame', box), d = frame && frame.contentDocument, strip = d && d.querySelector('.summary-strip'); if (!view || !strip) return;
        box.style.height = ''; box.style.aspectRatio = '';
        const Z = view.clientWidth / Math.max(1, frame.offsetWidth), want = (strip.getBoundingClientRect().bottom + (d.scrollingElement || d.documentElement).scrollTop + 28) * Z, dh = Math.ceil(want - view.clientHeight);
        if (dh > 0) { const h0 = box.clientHeight; box.style.aspectRatio = 'auto'; box.style.height = (h0 + dh) + 'px'; }
        if (ST) ST.refresh();
      };
      fit(); let t = 0; W.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(fit, 260); });
    };
    const go = () => { if (started) return; started = true; loadPortal().then(ok => { if (!ok) return; const sc = W.GFSearchScene.mount(box, { theme: 'dark', autoplay: !REDUCE, loop: false, reducedMotion: REDUCE, frame: true, fit: 'fill',
      label: 'A client’s pipeline in the Grey Fox portal, a commercial HVAC search: the handoff stage, with one company’s note open. Illustrative companies and notes.' }); if (sc && sc.ready) sc.ready.then(tall); }); };
    if ('IntersectionObserver' in W) { const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { io.disconnect(); go(); } }, { rootMargin: '150% 0px' }); io.observe(box); } else go();
    if (live && ST) {
      let lc = '';
      ST.create({ trigger: box, start: 'top 96%', end: 'top 50%', onUpdate: s => { const k = eo(s.progress), c = `inset(0 0 ${((1 - k) * 14).toFixed(2)}% 0 round 10px)`; if (c !== lc) { box.style.clipPath = c; lc = c; } },
        onRefresh: s => { const k = eo(s.progress); box.style.clipPath = `inset(0 0 ${((1 - k) * 14).toFixed(2)}% 0 round 10px)`; } });
    }
  }

  /* ========================= STAGE 2, Mission Control (iv-flow2.js) ========================= */
  const posterOf = (v, kind) => v.getAttribute(`data-${kind}-${(W.devicePixelRatio || 1) * (S2.winIn ? S2.winIn.clientWidth : 1200) > 1300 ? 2560 : 1280}`) || v.getAttribute('poster');
  const vLoad = (v, eager) => { if (!v || v._src) return; v._src = true; v.preload = eager ? 'auto' : 'metadata'; v.src = v.getAttribute('data-src'); try { v.load(); } catch (e) { /* none */ } };
  const vPlay = v => { if (!v) return; vLoad(v, true); if (v.ended) { try { v.currentTime = 0; } catch (e) { /* none */ } } const p = v.play(); if (p && p.catch) p.catch(() => {}); };
  const vPause = v => { if (v && !v.paused) v.pause(); };
  // ("Pause motion" chosen on Home v2 / Owners v2: the films do not start by themselves; the words and Play still play them)
  const STILL = () => gfx.store.get('gfx-still') === '1';
  let E2 = 0, P2 = 0, s2Act = -1, s2In = false;
  const s2Weights = P => { const X = 0.035, b1 = 1 / 3, b2 = 2 / 3; const a = ss(seg(P, b1 - X, b1 + X)), c = ss(seg(P, b2 - X, b2 + X)); return [1 - a, a * (1 - c), c]; };
  const s2Render = () => {
    const E = E2, P = P2;
    const k = eo(seg(E, 0.3, 1)), ix = ((1 - k) * 7).toFixed(2), iy = ((1 - k) * 10).toFixed(2), rr = (16 + (1 - k) * 10).toFixed(1);
    const cp = `inset(${iy}% ${ix}% ${iy}% ${ix}% round ${rr}px)`; if (S2.win._cp !== cp) { S2.win.style.clipPath = cp; S2.win._cp = cp; }
    const sc = `scale(${(1.06 - 0.06 * k).toFixed(4)})`; if (S2.winIn._sc !== sc) { S2.winIn.style.transform = sc; S2.winIn._sc = sc; }
    show(S2.foot, eo(seg(E, 0.62, 1)), 14);
    const w = s2Weights(P), actNow = P < 1 / 3 ? 0 : P < 2 / 3 ? 1 : 2;
    S2.vids.forEach((v, i) => { const o = i === actNow ? '1' : '0'; if (v._o !== o) { v.style.opacity = o; v._o = o; clearTimeout(v._pt); if (o === '0') v._pt = setTimeout(() => vPause(v), 760); } });
    S2.bs.forEach((b, i) => { setVar(b, '--on', w[i]); const f = clamp((P - i / 3) * 3, 0, 1), bar = $('b', b), t = `scaleX(${f.toFixed(4)})`; if (bar && bar._t !== t) { bar.style.transform = t; bar._t = t; } });
    if (E > 0) vLoad(S2.vids[0], true);
    if (P > 0.12) vLoad(S2.vids[1], true);
    if (P > 0.45) vLoad(S2.vids[2], true);
    const shown = E > 0.92;
    if (actNow !== s2Act) { s2Act = actNow; S2.bbs.forEach((b, i) => b.setAttribute('aria-pressed', i === actNow ? 'true' : 'false')); S2.vids.forEach((v, i) => v.toggleAttribute('aria-hidden', i !== actNow)); }
    if (shown && s2In && !STILL()) vPlay(S2.vids[actNow]); else vPause(S2.vids[actNow]);
  };
  const s2Static = () => {
    if (!S2.vids || !S2.vids.length || !S2.play) return;
    let cur = 0;
    const lab = (t, l) => { S2.play.querySelector('span').textContent = t; S2.play.setAttribute('aria-label', l); };
    const toggle = () => {
      const v = S2.vids[cur];
      if (v.paused || v.ended) { vPlay(v); S2.play.dataset.state = 'pause'; lab('Pause', 'Pause'); }
      else { v.pause(); S2.play.dataset.state = 'play'; lab('Play', 'Play: ' + S2.bbs[cur].querySelector(O('iv2-mw')).textContent); }
    };
    const pick = k => {
      cur = k;
      S2.vids.forEach((v, i) => { v.classList.toggle('is-on', i === k); v.toggleAttribute('aria-hidden', i !== k); if (i !== k) vPause(v); });
      S2.bbs.forEach((b, i) => b.setAttribute('aria-pressed', i === k ? 'true' : 'false'));
      S2.bs.forEach((b, i) => { b.style.setProperty('--on', i === k ? '1' : '0'); const bar = $('b', b); if (bar) bar.style.transform = i === k ? 'scaleX(1)' : 'scaleX(0)'; });
      S2.play.dataset.state = 'play'; lab('Play', 'Play: ' + S2.bbs[k].querySelector(O('iv2-mw')).textContent);
    };
    const phone = mq('(max-width: 767px)');   // (1.0.1) a phone shows the stills (mcPhone), so the films' posters are not fetched
    S2.vids.forEach(v => { if (!phone) v.poster = posterOf(v, 'last'); v.addEventListener('ended', () => { v.poster = posterOf(v, 'last'); S2.play.dataset.state = 'play'; S2.play.querySelector('span').textContent = 'Play'; }); });
    S2.play.hidden = false; S2.play.addEventListener('click', toggle);
    S2.bbs.forEach((b, i) => b.addEventListener('click', () => pick(i)));
    pick(0);
  };
  /* (1.0.1, 10/20) MISSION CONTROL ON A PHONE: a still of the whole working area per tab (the founder's pick), not the film.
     The film is a 2240px desktop screen; below 768px each tab shows a sharp still of the same screen (no left menu, 16:9),
     the films are never fetched, and a tap opens the screen full size to slide across and read. Stills: investors/mc/. */
  const MC_ALT = [
    'Mission Control: the profile of Ambercote Elevator Co., an illustrative company, with this week’s calls and their notes.',
    'Mission Control: the research on Ambercote Elevator Co., an illustrative company: founded 1988, Overland Park, Kansas, one branch, 60 to 75 employees.',
    'Mission Control: the firm dashboard, with illustrative figures: 398 engaged, 137 qualified, 101 at handoff and 8 beyond handoff, and the effort across 14 sectors.'];
  const MC_KEY = ['refined', 'efficient', 'transparent'];
  function mcPhone() {
    if (!S2.winIn || !S2.vids || S2.vids.length !== 3 || $('.gfx-mc-still', S2.winIn)) return;
    const src = (i, k) => gfx.BASE + 'investors/mc/mc-' + MC_KEY[i] + '-' + k + '.webp';
    let lb = null, opener = null;
    const close = () => {
      if (!lb) return; lb.hidden = true; H.classList.remove('gfx-mc-open');
      if (gfx.lenis && gfx.lenis.start) gfx.lenis.start();
      if (opener) opener.focus({ preventScroll: true });
    };
    const open = (i, btn) => {
      if (!lb) {
        lb = D.createElement('div'); lb.className = 'gfx-mc-lb'; lb.hidden = true;
        lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', 'Mission Control, full size');
        lb.innerHTML = '<div class="gfx-mc-lb-sc"><img alt="" decoding="async"></div><button type="button" class="gfx-mc-lb-x" aria-label="Close">×</button><p class="gfx-mc-lb-cap">Slide sideways to read across</p>';
        D.body.appendChild(lb);
        $('.gfx-mc-lb-x', lb).addEventListener('click', close);
        lb.addEventListener('click', e => { if (e.target === lb) close(); });
        D.addEventListener('keydown', e => { if (e.key === 'Escape' && lb && !lb.hidden) close(); });
      }
      opener = btn; const img = $('img', lb); img.src = src(i, 'full'); img.alt = MC_ALT[i];
      lb.hidden = false; $('.gfx-mc-lb-sc', lb).scrollLeft = 0; H.classList.add('gfx-mc-open');
      if (gfx.lenis && gfx.lenis.stop) gfx.lenis.stop();
      $('.gfx-mc-lb-x', lb).focus({ preventScroll: true });
    };
    S2.vids.forEach((v, i) => {
      const name = S2.bbs[i] ? (S2.bbs[i].querySelector(O('iv2-mw')) || S2.bbs[i]).textContent.trim() : MC_KEY[i];
      v.insertAdjacentHTML('afterend', `<button type="button" class="gfx-mc-still" aria-label="${esc('Open Mission Control full size: ' + name)}"><img src="${esc(src(i, 'phone'))}" alt="${esc(MC_ALT[i])}" width="1170" height="658" loading="lazy" decoding="async"></button>`);
      v.nextElementSibling.addEventListener('click', e => open(i, e.currentTarget));
    });
  }
  function stagesLive() {
    if (S1.track) {
      ST.create({ trigger: S1.track, start: 'top bottom', end: 'top top', onUpdate: s => { E1 = s.progress; s1Render(); }, onRefresh: s => { E1 = s.progress; s1Render(); } });
      ST.create({ trigger: S1.track, start: 'top top', end: 'bottom bottom', onUpdate: s => { P1 = s.progress; s1Render(); }, onRefresh: s => { P1 = s.progress; s1Render(); } });
    }
    if (S2.track && S2.win && S2.winIn) {
      S2.vids.forEach(v => { v.poster = posterOf(v, 'first'); });
      ST.create({ trigger: S2.track, start: 'top bottom', end: 'top top', onUpdate: s => { E2 = s.progress; s2Render(); }, onRefresh: s => { E2 = s.progress; s2Render(); } });
      ST.create({ trigger: S2.track, start: 'top top', end: 'bottom bottom', onUpdate: s => { P2 = s.progress; s2Render(); }, onRefresh: s => { P2 = s.progress; s2Render(); } });
      ST.create({ trigger: S2.track, start: 'top bottom', end: 'bottom top', onToggle: s => { s2In = s.isActive; s2Render(); if (!s2In) S2.vids.forEach(vPause); } });
      // the words are the stage's index: each takes the reader to its view
      S2.bbs.forEach((b, i) => b.addEventListener('click', () => {
        const top = S2.track.getBoundingClientRect().top + sy(), span = S2.track.offsetHeight - W.innerHeight;
        gfx.scrollToY(top + span * (i / 3 + 1 / 6), 1.4);
      }));
      const fit = () => { S2.stage.style.setProperty('--iv2-mw', S2.win.offsetWidth + 'px'); };
      fit(); W.addEventListener('resize', fit); ST.addEventListener('refreshInit', fit);
    }
    ST.addEventListener('refresh', () => { s1Layout(); s1Render(); });
    W.addEventListener('resize', () => { s1Layout(); s1Render(); });
  }

  /* ========================= the close (gf-site.js e): the house arrow under "thesis.", the action arrives with it ========================= */
  let closeMark = null;
  function closeInit() {
    const room = R.close; if (!room) return;
    rise(CL.h);
    if ('IntersectionObserver' in W && !REDUCE && CL.top) { const aio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { room.classList.add('gfc-in'); aio.disconnect(); } }), { rootMargin: '0px 0px -28% 0px' }); aio.observe(CL.top); }
    else room.classList.add('gfc-in');
  }
  function closeMarkInit(still) {
    const room = R.close; if (!room || !W.gfArrow || !CL.h || !CL.top || closeMark) return;
    const mark = W.gfArrow.word({ el: CL.h, host: CL.top, cls: 'gfc-mark', auto: !still });
    if (!mark) return; closeMark = mark;
    if (still) { if (mark.still) mark.still(); room.classList.add('gfc-in'); return; }
    // (as local: the mark draws itself once its words are in view, gfArrow.word's own trigger, 0.35 s after)
    // one green call in view: while footer I's green call is seen and the close has mostly left, the close steps back
    let near = false, rq = 0;
    const seenFa = fa => { const b = fa.getBoundingClientRect(); if (!(b.width > 0 && b.top < W.innerHeight && b.bottom > 0)) return false; const x = Math.min(W.innerWidth - 1, Math.max(0, b.left + b.width / 2)), y = Math.min(W.innerHeight - 1, Math.max(0, b.top + b.height / 2)), e = D.elementFromPoint(x, y); return !!(e && e.closest('.footer_section_wrapper')); };
    const check = () => { rq = 0; const fa = $('.gfx-fi-act'); if (!fa) return; const cr = room.getBoundingClientRect(), k = Math.max(0, Math.min(cr.bottom, W.innerHeight) - Math.max(cr.top, 0)) / (cr.height || 1); room.classList.toggle('gfc-rest', near && k <= 0.4 && seenFa(fa)); };
    const ask = () => { if (near && !rq) rq = requestAnimationFrame(check); };
    if ('IntersectionObserver' in W) new IntersectionObserver(es => es.forEach(e => { near = e.isIntersecting; ask(); })).observe(room);
    W.addEventListener('scroll', ask, { passive: true }); W.addEventListener('resize', ask);
  }

  /* ========================= reduced motion / no library: every room settled ========================= */
  function still() {
    gsap = W.gsap || null; ST = W.ScrollTrigger || null;
    H.classList.remove('iv2-live'); live = false;
    H.classList.add('ow-hero-on', 'ow-ready', 'gfx-ready');
    safe('stage 1 still', () => { s1Layout(); s1Still(); W.addEventListener('resize', () => { s1Layout(); s1Still(); }); });
    safe('stage 2 still', s2Static);
    safe('mc phone', mcPhone);
    safe('pipe', pipe);
    safe('pairs', pairs);
    if (R.close) R.close.classList.add('gfc-in');
    if (W.gfArrow) safe('close mark', () => closeMarkInit(true));
    safe('inks', inks);
  }

  gfx.page({
    field,
    foot: { close: O('iv-close') },
    fox: O('iv-close') + ' ' + O('ow-close-fox'),
    dom: () => { safe('dom', dom); },
    start: () => {
      gsap = gfx.gsap; ST = gfx.ST;
      safe('inks', inks);
      safe('hero', heroInit);
    },
    rooms: () => {
      safe('breath', breathInit);
      safe('delivery', () => { $$(O('iv-client') + ' ' + O('ow-open')).length && roomHead(R.del); deliveryInit(); });
      safe('mc head', () => roomHead(R.mc));
      safe('cases head', () => roomHead(R.cases));
      safe('cases', casesInit);
      safe('care', careInit);
      safe('close', closeInit);
      safe('pairs', pairs);
      safe('stage 1 layout', s1Layout);
      safe('pipe', pipe);
      if (live) safe('stages', stagesLive);
      else { safe('stage 1 still', () => { s1Still(); W.addEventListener('resize', () => { s1Layout(); s1Still(); }); }); safe('stage 2 still', s2Static); safe('mc phone', mcPhone); }
      H.classList.add('ow-ready');
      if (W.ivHeroGo) requestAnimationFrame(() => requestAnimationFrame(W.ivHeroGo));
      refresh();
    },
    late: () => { safe('close mark', () => closeMarkInit(false)); },
    still
  });
})();
