/* Grey Fox · Home v2 (Flow 3) page script: core 1.0.43 + home 1.1.15. Sources: core/gfx-core.js, home/gfx-home.js */
/*!
 * Grey Fox · gfx core (Flow 3), the shared layer every Flow 3 page runs on Webflow.
 * core 1.0.2 · 2026-10-20 (1.0.1: the text arrow re-finds its words at every placing and leaves with them under the header zone; 1.0.2: one brand arrow, the link glyph is the fox-ear mark, gfArrow.line for the opening's line) · front-end only (nothing secret).
 *
 * WHAT IT IS
 *   The parts of the approved local Flow 3 site (brand-motion-1008/prototype, "Flow 3") that every page shares, ported
 *   once, so each page adds only its own layer (home/gfx-home.js, …). It is bundled in front of the page layer into the
 *   page's one header script (home/gfx-home.bundle.min.js), and its stylesheet (core/gfx-core.min.css) is linked from the
 *   page's head code. The page layer calls gfx.page({ … }) once; this core runs it.
 *
 * PORTED FROM (local masters, 10/20)
 *   gf-grammar.js        the motion grammar (verbatim)
 *   gf-site.js           gfArrow (verbatim), the fox watch, the close's fox hand-off (foxStep)
 *   gf-turn.js           the turn: one time-based paper ↔ black crossfade (verbatim)
 *   gf-flow.js           the field engine: colour chapters, inks, rhythm tiers, the reader's place (Flow 3 only; no
 *                        Flow 1/2 or Hold branches; the page layer gives the rooms and the turns' waits)
 *   sbx-m1.js            room(): the house order, per-block reveals (Flow has no holds), fitFilm
 *   sbx.js               the bar in Flow: the solid bar after half a screen, leaving on the way down, back on any 6 px up
 *   foot/foot*.js        footer I (D's columns, G's ending, I's lights), written from the page's own footer links
 *   home-v2-motion.js    1.0.9's Webflow plumbing: the Lenis trap, the IX2/IX3 hold-back, the GSAP fallback, the failsafe
 *
 * CONTRACT
 *   Header-safe: before DOMContentLoaded it only sets classes on <html>, traps window.Lenis and window.Webflow and
 *   strips IX2 hooks as elements are parsed. Everything else waits for DOMContentLoaded + GSAP + fonts.
 *   ?gfm=0 turns the whole bundle off (the page exactly as Webflow serves it). ?gfxdebug logs guarded failures.
 */
(function () {
  'use strict';
  var W = window, D = document;
  if (W.gfx && W.gfx.core) return;
  if (/[?&]gfm=0(&|$)/.test(location.search)) { W.gfx = { core: 'off', page: function () {} }; return; }

  /* ========================= 0 · the grammar (gf-grammar.js, verbatim) ========================= */
  (function (w) {
    function bezier(x1, y1, x2, y2) {
      const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
      const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
      const sx = t => ((ax * t + bx) * t + cx) * t, sy = t => ((ay * t + by) * t + cy) * t;
      const dx = t => (3 * ax * t + 2 * bx) * t + cx;
      return x => {
        if (x <= 0) return 0; if (x >= 1) return 1;
        let t = x;
        for (let i = 0; i < 8; i++) { const e = sx(t) - x, d = dx(t); if (Math.abs(e) < 1e-6) break; if (Math.abs(d) < 1e-6) break; t -= e / d; }
        if (t < 0 || t > 1) { let lo = 0, hi = 1; t = x; for (let i = 0; i < 30; i++) { const v = sx(t); if (Math.abs(v - x) < 1e-6) break; if (v < x) lo = t; else hi = t; t = (lo + hi) / 2; } }
        return sy(t);
      };
    }
    w.GF_GRAMMAR = {
      SETTLE: 'expo.out',
      DRAW: bezier(0.807, 0.014, 0.392, 0.985),
      headline: { yPercent: 108, duration: 1.2, stagger: 0.09, start: 'top 82%' },
      body: { y: 16, duration: 1.1, at: 0.2 },
      hairline: { duration: 1.5, at: 0.45 },
      arrow: { duration: 0.45, at: 0.85 },
      picture: { clipFrom: 'inset(100% 0% 0% 0%)', scaleFrom: 1.06, duration: 1.5, settle: 1.6, at: 0.95 },
      figure: { duration: 1.6, at: 1.0 },
      detail: { y: 16, duration: 0.9, at: 1.2, stagger: 0.06 },
      seam: { dimDark: 0.5, dimLight: 0.3, lightTo: '#ffffff', hairline: 1.5 },
      leave: { ease: 'power2.in', duration: 0.45 },
      group: 0.12, tight: 0.08,
      hold: { short: 0.5, standard: 0.7 },
      fastForward: 0.3,
      breath: { scaleFrom: 1.06, scaleTo: 1 },
      reduced: () => w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches
    };
  })(W);

  /* ========================= 1 · header-safe setup ========================= */
  const H = D.documentElement, G = W.GF_GRAMMAR;
  const VERSION = '1.0.43';
  const DEBUG = /[?&]gfxdebug(&|$)/.test(location.search);
  const log = (where, e) => { if (DEBUG) { try { console.warn('[gfx] ' + where, e); } catch (x) { /* nothing */ } } };
  const safe = (where, fn) => { try { return fn(); } catch (e) { log(where, e); return undefined; } };
  const mq = q => { try { return W.matchMedia(q).matches; } catch (e) { return false; } };
  const REDUCE = !!G.reduced(), TOUCH = mq('(pointer: coarse)');
  /* (1.0.41, launch QA 10/22, Safari) a reload or Back mid-page that is NOT served from the back/forward cache: the browser puts
     the reader at the old number before the pinned stages are built (Home: ~1800px short), so for ~0.5 s it showed a later part
     of the story, then the place snapped back. The rooms stay out of sight until the place is restored, then fade in (0.3 s);
     a 2.2 s safety always shows the page. A fresh visit, the page's top and reduced motion are untouched. */
  const RESTORING = !REDUCE && (() => { try { const t = (performance.getEntriesByType('navigation')[0] || {}).type; if (t !== 'reload' && t !== 'back_forward') return false; const sv = JSON.parse(W.sessionStorage.getItem('gfxFlowAt:' + location.pathname) || 'null'); return !!(sv && (sv.i > 0 || sv.f > 0.15)); } catch (e) { return false; } })();
  const unhide = () => { if (!H.classList.contains('gfx-restoring')) return; H.classList.add('gfx-restore-in'); H.classList.remove('gfx-restoring'); setTimeout(() => H.classList.remove('gfx-restore-in'), 450); };
  // (1.0.42, overnight audit 10/23) the site's head code makes the same call before the first paint (the top of the page
  // showed for ~0.3 s before this script ran) with its own 3.5 s safety; from here on this script decides
  try { clearTimeout(W.__gfxRestoreT); } catch (e) { /* none */ }
  if (!RESTORING) H.classList.remove('gfx-restoring');
  if (RESTORING) { H.classList.add('gfx-restoring'); const st = D.createElement('style'); st.id = 'gfx-restore'; st.textContent = 'html.gfx-restoring .page-wrapper{opacity:0!important}html.gfx-restore-in .page-wrapper{transition:opacity .3s cubic-bezier(.16,1,.3,1)!important}'; (D.head || H).appendChild(st); setTimeout(unhide, 2200); }
  const store = { get: k => { try { return W.sessionStorage.getItem(k); } catch (e) { return null; } }, set: (k, v) => { try { W.sessionStorage.setItem(k, v); } catch (e) { /* private mode */ } } };
  const GROUP = G.group, LEAVE = G.leave;
  // the reading standard (sbx-m1.js GF_READ): a film is held to 1.6 s; a reader at 600 px/s
  const READ = W.GF_READ = { v: 600, rest: 0.6, approach: 0.35, min: 0.5, film: 1.6 };
  W.GF_LEAVE = LEAVE; W.GF_GROUP = GROUP;

  safe('head', () => {
    H.classList.add('gfx-js', 'gfx-f3');
    if (!REDUCE) H.classList.add('gfx-m');
    // the opening plays once a session (as local: sessionStorage sbx-intro-seen); ?intro forces it, ?intro=0 skips it
    const qs = location.search;
    const intro = !REDUCE && !/[?&]intro=0(&|$)/.test(qs) && (/[?&]intro(&|=1|$)/.test(qs) || (!location.hash && !store.get('gfx-intro-seen')));
    if (intro) H.classList.add('gfx-intro');
  });

  /* (1.0.27, smoothness lab 10/21) the menu button's own code (the hamburger embed in the bar) styles its three parts
     with class-text selectors ([class^="hamburger_line"], [class*=" hamburger_line"]). Those make the browser re-check
     the whole page on ANY class change anywhere: every root class the scroll flips (the bar leaving and returning, a
     tone turn, the footer's states) cost a full restyle - ~150 ms on a mid-range phone at a quarter speed, 2 ms
     without them. The same rules are rewritten once to plain class selectors (.hamburger_line): the same three
     elements (one class each), the same styles, the same open/close. */
  const plainHamburger = () => safe('hamburger selectors', () => {
    D.querySelectorAll('style').forEach(st => {
      const t = st.textContent; if (t.indexOf('hamburger_') < 0 || t.indexOf('[class') < 0) return;
      const nt = t.replace(/\[class\^="(hamburger_[\w-]+)"\]|\[class\*=" (hamburger_[\w-]+)"\]/g, (m, a, b) => '.' + (a || b));
      if (nt !== t) st.textContent = nt;
    });
  });
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', plainHamburger, { once: true }); else plainHamburger();

  // the failsafe: if the motion never takes the page (a blocked CDN, an error), everything shows
  const failsafe = () => {
    if (H.classList.contains('gfx-ready')) return;
    H.classList.add('gfx-failsafe'); H.classList.remove('gfx-intro'); ix3Late();
    safe('failsafe', () => { const p = D.querySelector('.page-wrapper'); p && p.removeAttribute('inert'); });
  };
  setTimeout(failsafe, 6000);

  /* ---------- Lenis: one instance, the local settings, one clock (home-v2-motion.js 1.0.9) ---------- */
  // (1.0.21, founder 10/20: "slightly lagging" on a Mac) 0.085 trailed the trackpad, which already carries its own
  // momentum; 0.12 follows the hand more closely and is still smooth
  const LENIS_OPTS = { lerp: 0.12, wheelMultiplier: 0.95, smoothWheel: true };
  let RealLenis = null, shared = null, sharedRaf = null, tempLoop = 0, tickerOn = false;
  const lenisStub = () => ({
    __gfxStub: true, raf() {}, on() {}, off() {}, start() {}, stop() {}, destroy() {}, resize() {},
    get scroll() { return W.scrollY; },
    scrollTo(t, o) {
      try {
        const off = (o && o.offset) || 0;
        if (typeof t === 'number') W.scrollTo(0, t + off);
        else { const el = typeof t === 'string' ? D.querySelector(t) : t; if (el && el.getBoundingClientRect) W.scrollTo(0, el.getBoundingClientRect().top + W.scrollY + off); }
      } catch (e) { /* a bad selector */ }
    }
  });
  const makeShared = () => {
    if (shared) return shared;
    if (REDUCE || TOUCH || !RealLenis) return null;
    try {
      const inst = new RealLenis(LENIS_OPTS);
      sharedRaf = inst.raf.bind(inst);
      inst.raf = function () {};   // any other loop (the site-wide one) steps nothing: one clock drives it
      shared = W.lenis = inst;
      const loop = () => { if (tickerOn) return; sharedRaf(performance.now()); tempLoop = requestAnimationFrame(loop); };
      tempLoop = requestAnimationFrame(loop);
      // (core 1.0.5) Webflow sets html to the viewport height, so Lenis's own content observer never fires and its scroll
      // limit stays at the load-time page height; a page that grows afterwards (Investors, +54px) could not reach its
      // footer. Watch the body instead and refresh the limit whenever the page height changes.
      if ('ResizeObserver' in W) {
        let lastH = 0, rz = 0;
        const watch = () => new ResizeObserver(() => { const h = D.body.scrollHeight; if (Math.abs(h - lastH) < 1) return; lastH = h; cancelAnimationFrame(rz); rz = requestAnimationFrame(() => { try { inst.resize(); } catch (e) { /* ignore */ } }); }).observe(D.body);
        if (D.body) watch(); else D.addEventListener('DOMContentLoaded', watch, { once: true });
      }
    } catch (e) { log('lenis', e); }
    return shared;
  };
  function GfxLenis() { return makeShared() || lenisStub(); }
  GfxLenis.__gfx = true;
  safe('lenis trap', () => {
    const cur = W.Lenis;
    if (cur && !cur.__gfx) RealLenis = cur;
    Object.defineProperty(W, 'Lenis', { configurable: true, enumerable: true, get: () => (RealLenis ? GfxLenis : undefined), set: v => { if (v && !v.__gfx) RealLenis = v; } });
  });

  /* ---------- Webflow IX2 / IX3: the local site never ran them; on Webflow the designer's page interactions are held
     back on our pages (1.0.9: the attribute IX2 binds to is stripped as each element is parsed; IX3's register call is
     handed only the interactions of components with a rendered instance). His interactions themselves are untouched. ---------- */
  let NAV_VAR = 'w-variant-6001bf23-3a7c-ba13-070d-00867ad512f5';
  const KEEP = '.navigation_wrapper, .button, [data-wf-component-id]';
  let navTop = true;
  const strip = el => {
    if (!el || el.nodeType !== 1) return;
    const one = x => {
      if (x.hasAttribute('data-wf--gfx-navigation-home-v2--variant')) { const c = Array.prototype.find.call(x.classList, k => k.indexOf('w-variant-') === 0); if (c) NAV_VAR = c; }
      if (x.hasAttribute('data-w-id') && !x.closest(KEEP)) { x.setAttribute('data-gfx-wid', x.getAttribute('data-w-id')); x.removeAttribute('data-w-id'); }
      if (navTop && x.classList.contains(NAV_VAR) && x.closest('.gfx-nav')) { x.classList.remove(NAV_VAR); x.setAttribute('data-gfx-var', ''); }
    };
    one(el);
    if (el.firstElementChild) Array.prototype.forEach.call(el.querySelectorAll('[data-w-id], [data-wf--gfx-navigation-home-v2--variant], .' + NAV_VAR), one);
  };
  let ixObs = null;
  safe('ix2 strip', () => { ixObs = new MutationObserver(ms => ms.forEach(m => Array.prototype.forEach.call(m.addedNodes, strip))); ixObs.observe(H, { childList: true, subtree: true }); if (D.body) strip(D.body); });
  const patchIx3 = m => safe('ix3 patch', () => {
    if (!m || m.__gfx || typeof m.getInstance !== 'function') return;
    m.__gfx = true;
    const gi = m.getInstance;
    m.getInstance = function () {
      const inst = gi.apply(this, arguments);
      if (inst && !inst.__gfx && typeof inst.register === 'function') {
        inst.__gfx = true;
        const reg = inst.register;
        inst.register = function (ints) {
          const args = Array.prototype.slice.call(arguments);
          const onPage = x => { const sc = x && x.scope; if (!sc || sc.type !== 'component') return false; try { return Array.prototype.some.call(D.querySelectorAll('[data-wf-component-id="' + sc.componentId + '"]'), e => e.getClientRects().length > 0); } catch (e) { return true; } };
          if (Array.isArray(ints)) args[0] = ints.filter(onPage);
          return reg.apply(this, args);
        };
      }
      return inst;
    };
  });
  const wrapWebflow = wf => safe('webflow wrap', () => {
    if (!wf || Array.isArray(wf) || wf.__gfxWrapped || typeof wf.require !== 'function') return;
    wf.__gfxWrapped = true;
    const req = wf.require;
    wf.require = function (name) { const m = req.apply(this, arguments); if (name === 'ix3') patchIx3(m); return m; };
  });
  safe('webflow trap', () => {
    let cur = W.Webflow;
    Object.defineProperty(W, 'Webflow', { configurable: true, enumerable: true, get: () => cur, set: v => { cur = v; wrapWebflow(v); } });
    wrapWebflow(cur);
  });
  const ix3Late = () => { if (!H.classList.contains('w-mod-ix3')) H.classList.add('w-mod-ix3'); };
  const stopIX2 = () => safe('ix2', () => { const wf = W.Webflow; if (!wf || typeof wf.require !== 'function') return; const ix = wf.require('ix2'); if (ix && typeof ix.destroy === 'function') ix.destroy(); });
  safe('ix2 queue', () => { W.Webflow = W.Webflow || []; W.Webflow.push(stopIX2); });

  /* ========================= 2 · helpers ========================= */
  const $ = (s, r) => (r || D).querySelector(s);
  const $$ = (s, r) => Array.prototype.slice.call((r || D).querySelectorAll(s));
  const NS = 'http://www.w3.org/2000/svg', TAN = Math.tan(38.2 * Math.PI / 180);
  const arr = x => (x ? [].concat(x) : []).reduce((a, e) => a.concat(typeof e === 'string' ? $$(e) : [e]), []).filter(Boolean);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  /* (1.0.27, smoothness lab 10/21) a read of the page's geometry in the middle of a frame (after the motion has written
     its styles) makes the browser lay the page out again, there and then. postFrame runs a reader just AFTER the
     frame is drawn, when the layout is settled and reading it is nearly free. For the watchers that only look. */
  const postFrame = (() => {
    const q = []; let mc = null, armed = false;
    const flush = () => { armed = false; const fs = q.splice(0); for (const f of fs) { try { f(); } catch (e) { /* a watcher's own error stays its own */ } } };
    return f => { q.push(f); if (armed) return; armed = true;
      if (!mc && W.MessageChannel) { mc = new MessageChannel(); mc.port1.onmessage = flush; }
      requestAnimationFrame(() => { if (mc) mc.port2.postMessage(0); else setTimeout(flush, 0); }); };
  })();
  const docTop = el => { let y = 0; for (let n = el; n; n = n.offsetParent) y += n.offsetTop; return y; };
  const scrollNow = () => (shared ? shared.scroll : W.scrollY);
  let ST = null, gsap = null;
  const scrollToY = (y, dur) => { y = Math.max(0, Math.round(y)); if (shared) shared.scrollTo(y, { duration: dur || 1.4, easing: k => 1 - Math.pow(1 - k, 4) }); else W.scrollTo({ top: y, behavior: REDUCE ? 'auto' : 'smooth' }); };
  const refresh = (() => { let t = 0; return () => { clearTimeout(t); t = setTimeout(() => { if (ST) ST.refresh(); }, 90); }; })();
  // where the bundle was loaded from (jsDelivr @SHA): the portal and other assets sit beside it in the same commit
  const BASE = (() => { const s = D.currentScript && D.currentScript.src; return s ? s.replace(/\/[^/]*\/[^/]*$/, '/') : ''; })();

  /* ========================= 3 · the arrow (gf-site.js gfArrow, verbatim) =========================
     ONE device for the whole site: every arrow on every page is drawn here. The underline hugs the key word and turns up
     at the fox's 38.2° into the house head; drawn once, 1.6 s expo-out, the head uncovered from 0.95 s. */
  (function () {
    if (W.gfArrow) return;
    var SPREAD = 0.52, uid = 0;
    var reduce = REDUCE;
    var expo = function (t) { return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t); }, cubic = function (t) { return 1 - Math.pow(1 - t, 3); };
    var f2 = function (v) { return v.toFixed(2); };
    var ribbon = function (P) {
      var M = P.length - 1, L = [], R = [];
      P.forEach(function (p, i) { var a = P[Math.max(0, i - 1)], b = P[Math.min(M, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l;
        L.push(f2(p[0] + nx * p[2] / 2) + ' ' + f2(p[1] + ny * p[2] / 2)); R.push(f2(p[0] - nx * p[2] / 2) + ' ' + f2(p[1] - ny * p[2] / 2)); });
      return 'M' + L.join(' L') + ' L' + R.reverse().join(' L') + ' Z';
    };
    var headPaths = function (x, y, ux, uy, len, w) {
      return [1, -1].map(function (sg) { var ang = Math.atan2(uy, ux) + Math.PI + sg * SPREAD, P = [], k, bend;
        for (var j = 0; j <= 12; j++) { k = j / 12; bend = sg * 0.12 * Math.sin(Math.PI * k); P.push([x + Math.cos(ang + bend) * len * k, y + Math.sin(ang + bend) * len * k, w * (1 - k * 0.8)]); }
        return ribbon(P); });
    };
    var ink = function (x0, y0, xr, x2, y2, fs, withHead) {
      var run = xr - x0, bow = Math.min(1.6, fs * 0.03), dirx = x2 - xr, diry = y2 - y0, dl = withHead ? (Math.hypot(dirx, diry) || 1) : 0;
      var ux = withHead ? dirx / dl : 1, uy = withHead ? diry / dl : 0, r = withHead ? Math.min(run * 0.08, dl * 0.45, 8) : 0;
      var A = [xr - r, y0], B = [xr + ux * r, y0 + uy * r], C = [xr, y0], L1 = run - r, L2 = withHead ? r * 1.6 : 0, L3 = withHead ? dl - r : 0, total = L1 + L2 + L3;
      var centre = function (t) { var s = t * total, k, a;
        if (s <= L1 || !withHead) { k = s / L1; return [x0 + s, y0 - Math.sin(Math.PI * k) * bow]; }
        if (s <= L1 + L2) { k = (s - L1) / L2; a = 1 - k; return [a * a * A[0] + 2 * a * k * C[0] + k * k * B[0], a * a * A[1] + 2 * a * k * C[1] + k * k * B[1]]; }
        k = (s - L1 - L2) / L3; return [B[0] + (x2 - B[0]) * k, B[1] + (y2 - B[1]) * k]; };
      var pts = [], N = 72;
      for (var i = 0; i <= N; i++) { var t = i / N, s = t * total, c = centre(t); pts.push([c[0], c[1], (1.1 + 1.4 * Math.exp(-s / 8)) * (1 + 0.08 * Math.sin(Math.PI * t)) * (0.55 + 0.45 * clamp((total - s) / (fs * 0.9), 0, 1))]); }
      return { shape: ribbon(pts), centre: 'M' + pts.map(function (p) { return f2(p[0]) + ' ' + f2(p[1]); }).join(' L'), ux: ux, uy: uy };
    };
    var sizes = function (fs) { var rise = clamp(fs * 0.26, 7, 14); return { rise: rise, run: rise / TAN, len: clamp(fs * 0.22, 7, 12), w: 1.9 }; };
    var head = function (svg, x, y, ux, uy, o) {
      o = o || {}; var len = o.len || 10, w = o.w || 1.7, id = 'gfa-h' + (++uid), reach = len + 3;
      var defs = svg.querySelector('defs') || svg.insertBefore(D.createElementNS(NS, 'defs'), svg.firstChild);
      var m = D.createElementNS(NS, 'mask'); m.setAttribute('id', id); m.setAttribute('maskUnits', 'userSpaceOnUse');
      m.setAttribute('x', f2(x - reach - 4)); m.setAttribute('y', f2(y - reach - 4)); m.setAttribute('width', f2(2 * reach + 8)); m.setAttribute('height', f2(2 * reach + 8));
      var c = D.createElementNS(NS, 'circle'); c.setAttribute('cx', f2(x)); c.setAttribute('cy', f2(y)); c.setAttribute('r', '0'); c.setAttribute('fill', '#fff'); m.appendChild(c); defs.appendChild(m);
      var g = D.createElementNS(NS, 'g'); g.setAttribute('class', 'gfa-head' + (o.cls ? ' ' + o.cls : '')); g.setAttribute('data-gfa-head', ''); g.setAttribute('mask', 'url(#' + id + ')');
      g.innerHTML = headPaths(x, y, ux, uy, len, w).map(function (d) { return '<path class="gfa-b" d="' + d + '"/>'; }).join('');
      svg.appendChild(g);
      var set = function (k) { c.setAttribute('r', f2(reach * clamp(k, 0, 1))); };
      set(o.at == null ? 0 : o.at);
      return { g: g, set: set, remove: function () { g.remove(); m.remove(); } };
    };
    // (1.0.2, the founder: one brand arrow) the small glyph is the house mark at a link's size: an inked shaft at the fox's
    // 38.2° and THE head (the two curved, tapering ears), filled in the link's colour; never a chevron on a stick
    var icon = function (cls, vb) {
      vb = vb || 16; var s = vb / 16, a = 38.2 * Math.PI / 180, ux = Math.cos(a), uy = -Math.sin(a);
      var tx = 13.8 * s, ty = 3.4 * s, L = 14 * s, sx = tx - ux * L, sy = ty - uy * L, P = [], N = 18;
      for (var i = 0; i <= N; i++) { var k = i / N, bow = Math.sin(Math.PI * k) * 0.3 * s;
        P.push([sx + ux * L * k + uy * bow, sy + uy * L * k - ux * bow, 1.5 * s * (1 + 0.5 * Math.exp(-k * 5)) * (0.62 + 0.38 * (1 - k))]); }
      var d = '<path class="gfa-if gfa-is" d="' + ribbon(P) + '"/>' + headPaths(tx, ty, ux, uy, 8.4 * s, 2.4 * s).map(function (h) { return '<path class="gfa-if gfa-ib" d="' + h + '"/>'; }).join('');
      return '<svg class="gfa-icon' + (cls ? ' ' + cls : '') + '" viewBox="0 0 ' + vb + ' ' + vb + '" aria-hidden="true" focusable="false" data-gfa-head>' + d + '</svg>';
    };
    // the house timing at t seconds: the line 1.6 s expo-out, the head uncovered from its tip 0.5 s from 0.95 s
    var timing = function (t) { return { l: 1 - expo(clamp(t / 1.6, 0, 1)), h: cubic(clamp((t - 0.95) / 0.5, 0, 1)) }; };
    // (1.0.2) THE LINE on its own (the opening's line under the logo): the text device's ink and head, not under words.
    // From (x0, y) to xr, then up at the fox's angle into the head; fs the size it is scaled to. at(t) draws it on the house
    // timing. The mask's stroke is inline, so no page rule for its svg's paths can thin it
    var line = function (svg, x0, y, xr, fs, o) {
      o = o || {}; var withHead = o.head !== false, sz = sizes(fs), x2 = withHead ? xr + sz.run : xr, y2 = withHead ? y - sz.rise : y, id = 'gfa-n' + (++uid);
      var g = ink(x0, y, xr, x2, y2, fs, withHead);
      var defs = svg.querySelector('defs') || svg.insertBefore(D.createElementNS(NS, 'defs'), svg.firstChild);
      var m = D.createElementNS(NS, 'mask'); m.setAttribute('id', id); m.setAttribute('maskUnits', 'userSpaceOnUse');
      m.setAttribute('x', '-4000'); m.setAttribute('y', '-4000'); m.setAttribute('width', '12000'); m.setAttribute('height', '12000');
      var mp = D.createElementNS(NS, 'path'); mp.setAttribute('class', 'gfa-m'); mp.setAttribute('d', g.centre); mp.setAttribute('pathLength', '1');
      mp.setAttribute('style', 'fill:none;stroke:#fff;stroke-width:9px;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:1;stroke-dashoffset:1');
      m.appendChild(mp); defs.appendChild(m);
      var p = D.createElementNS(NS, 'path'); p.setAttribute('class', 'gfa-ink'); p.setAttribute('d', g.shape); p.setAttribute('mask', 'url(#' + id + ')'); svg.appendChild(p);
      var hd = withHead ? head(svg, x2, y2, g.ux, g.uy, { len: sz.len, w: sz.w, at: 0 }) : null;
      var set = function (l, h) { mp.style.strokeDashoffset = f2(clamp(l, 0, 1)); if (hd) hd.set(h); };
      var at = function (t) { var k = timing(t); set(k.l, k.h); };
      at(o.at == null ? 0 : o.at);
      return { at: at, set: set, DUR: 1.6, tip: [x2, y2], remove: function () { p.remove(); m.remove(); if (hd) hd.remove(); } };
    };
    var restBox = function (range, host) {
      var rs = [].slice.call(range.getClientRects()).filter(function (q) { return q.width > 0.5; }); if (!rs.length) return null;
      var bot = Math.max.apply(null, rs.map(function (q) { return q.bottom; })), hh = rs[rs.length - 1].height;
      rs = rs.filter(function (q) { return q.bottom > bot - hh * 0.5; });
      var hb = host.getBoundingClientRect(), dx = 0, dy = 0, n = range.startContainer.nodeType === 3 ? range.startContainer.parentElement : range.startContainer;
      for (; n && n !== host; n = n.parentElement) { var tf = getComputedStyle(n).transform; if (tf && tf !== 'none') { var m = new DOMMatrixReadOnly(tf); dx += m.m41; dy += m.m42; } }
      var el = range.startContainer.nodeType === 3 ? range.startContainer.parentElement : range.startContainer;
      return { left: Math.min.apply(null, rs.map(function (q) { return q.left; })) - hb.left - dx, right: Math.max.apply(null, rs.map(function (q) { return q.right; })) - hb.left - dx,
        bottom: bot - hb.top - dy, fs: parseFloat(getComputedStyle(el).fontSize) || 16, w: hb.width, h: hb.height };
    };
    var rangeOf = function (el, key) {
      var w = D.createTreeWalker(el, NodeFilter.SHOW_TEXT), nodes = [], n; while ((n = w.nextNode())) if (n.textContent.trim()) nodes.push(n);
      if (!nodes.length) return null; var r = D.createRange();
      var punct = function (i, e) { var s2 = nodes[i].textContent; while (e < s2.length && /[.,;:!?’”]/.test(s2[e])) e++;
        if (e >= s2.length && nodes[i + 1]) { var t = nodes[i + 1].textContent, k = 0; while (k < t.length && /[.,;:!?’”]/.test(t[k])) k++; if (k) { r.setEnd(nodes[i + 1], k); return; } }
        r.setEnd(nodes[i], e); };
      if (key === true) { r.setStart(nodes[0], nodes[0].textContent.search(/\S/)); var L = nodes.length - 1, tl = nodes[L].textContent.replace(/\s+$/, '').length; punct(L, tl); return r; }
      if (key) { for (var i = 0; i < nodes.length; i++) { var at = nodes[i].textContent.indexOf(key); if (at >= 0) { r.setStart(nodes[i], at); punct(i, at + key.length); return r; } } }
      var tn = nodes[nodes.length - 1], mm = /(\S+)\s*$/.exec(tn.textContent); if (!mm) return null;
      r.setStart(tn, mm.index); r.setEnd(tn, mm.index + mm[1].length); return r;
    };
    var word = function (o) {
      /* (core 1.0.1, 10/20, the founder's stray line on Team's close) the key words are found AGAIN at every placing: a headline
         split into lines for its rise replaces its text nodes, and a range kept from before measured a detached node (a box
         mid-headline). And the mark leaves with its words: while they pass under the header's zone (the bar's clear band,
         --gf-zone, where the room's cap hides them) the mark fades too, so it never floats alone at the cap's edge */
      var fixed = o.range && typeof o.range !== 'function' ? o.range : null;
      /* (1.0.27, smoothness lab 10/21: on a phone the marks were 2 s of a scroll's work) the words' range is kept until
         the words change (a re-split replaces the text nodes; the watch below drops it), not searched for every frame */
      var kept = null;
      var rng = typeof o.range === 'function' ? o.range : function () {
        if (fixed && fixed.startContainer && fixed.startContainer.isConnected) return fixed;
        if (!o.el) return fixed;
        if (kept && kept.startContainer.isConnected && kept.endContainer.isConnected) return kept;
        return (kept = rangeOf(o.el, o.key));
      };
      var host = o.host; if (!host || !rng()) return null;
      var withHead = o.head !== false, id = 'gfa-l' + (++uid), lAt = 1, hAt = 0, hd = null, drawn = false, raf = 0;
      if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
      var svg = D.createElementNS(NS, 'svg'); svg.setAttribute('class', 'gfa' + (o.cls ? ' ' + o.cls : '')); svg.setAttribute('aria-hidden', 'true'); svg.setAttribute('focusable', 'false');
      if (o.color) svg.style.setProperty('--gfa-c', o.color);
      host.appendChild(svg);
      var set = function () { var p = svg.querySelector('.gfa-m'); if (p) p.style.strokeDashoffset = f2(lAt); if (hd) hd.set(hAt); };
      var place = function () {
        var r0 = rng(); if (!r0) return; var b = restBox(r0, host); if (!b) return;
        var s = sizes(b.fs), y = b.bottom + 2, x0 = b.left, xr = b.right + 3, x2 = xr + s.run, y2 = y - s.rise;
        var g = ink(x0, y, xr, withHead ? x2 : xr, withHead ? y2 : y, b.fs, withHead);
        svg.setAttribute('width', Math.ceil(Math.max(b.w, x2 + 16))); svg.setAttribute('height', Math.ceil(Math.max(b.h, y + 16)));
        svg.innerHTML = '<defs><mask id="' + id + '" maskUnits="userSpaceOnUse" x="-4000" y="-4000" width="12000" height="12000"><path class="gfa-m" d="' + g.centre + '" pathLength="1" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" style="stroke-dasharray:1;stroke-dashoffset:' + f2(lAt) + '"/></mask></defs>' +
          '<path class="gfa-ink" d="' + g.shape + '" mask="url(#' + id + ')"/>';
        hd = withHead ? head(svg, x2, y2, g.ux, g.uy, { len: s.len, w: s.w, at: hAt }) : null;
      };
      var draw = function (delay) {
        if (drawn) return; drawn = true; place();
        if (reduce) { lAt = 0; hAt = 1; set(); return; }
        var t0 = performance.now() + (delay || 0) * 1000;
        var step = function (now) { var t = (now - t0) / 1000; if (t < 0) { raf = requestAnimationFrame(step); return; }
          lAt = 1 - expo(clamp(t / 1.6, 0, 1)); hAt = cubic(clamp((t - 0.95) / 0.5, 0, 1)); set();
          if (t < 1.6) raf = requestAnimationFrame(step); };
        // (placed again as the words' own rise settles: they may still carry part of their move when the line sets off)
        [0.7, 1.7, 2.8].forEach(function (s) { setTimeout(re, s * 1000 + (delay || 0) * 1000); });
        raf = requestAnimationFrame(step);
      };
      var still = function () { drawn = true; lAt = 0; hAt = 1; place(); };
      place();
      /* (1.0.27) a mark off the screen is not placed or watched; it is placed the moment it comes within half a screen */
      var near = true, owed = false;
      // (placed just after a frame is drawn, postFrame: placing mid-frame, as a close arrives, laid the whole page out
      // again each time - ~125 ms a placing on a mid-range phone)
      var rq0 = 0, re = function () { if (!near) { owed = true; return; } if (!rq0) { rq0 = 1; postFrame(function () { rq0 = 0; place(); }); } };
      if ('IntersectionObserver' in W) new IntersectionObserver(function (es) { es.forEach(function (e) { near = e.isIntersecting; if (near && owed) { owed = false; re(); } if (near) zoneSoon(); }); }, { rootMargin: '50% 0px' }).observe(host);
      addEventListener('resize', function () { zoneZ = 0; re(); }); D.addEventListener('gfx:resplit', function () { kept = null; re(); });
      if (W.ScrollTrigger) ScrollTrigger.addEventListener('refresh', re);
      if (D.fonts && D.fonts.ready) D.fonts.ready.then(re);
      // (a re-split or a late reveal of the words: placed again once it has happened, and again as the rise settles)
      if (o.el && 'MutationObserver' in W) new MutationObserver(function () { kept = null; re(); }).observe(o.el, { childList: true, subtree: true, characterData: true });
      if (o.el) { o.el.addEventListener('transitionend', re); o.el.addEventListener('animationend', re); }
      // the zone: the mark is hidden while its words are under the header's clear band (the band's depth read once)
      var zoneZ = 0, zq = 0, zoneOut = false, zone = function () { zq = 0; if (!near) return; var r0 = rng(); if (!r0) return; var rs = r0.getClientRects(); if (!rs.length) return;
        var z = zoneZ || (zoneZ = parseFloat(getComputedStyle(D.documentElement).getPropertyValue('--gf-zone')) || 74), top = rs[rs.length - 1].top;
        var out = top < z - 2; if (out !== zoneOut) { zoneOut = out; svg.style.opacity = out ? '0' : ''; } };
      var zoneSoon = function () { if (!zq) { zq = 1; postFrame(zone); } };
      addEventListener('scroll', function () { if (near) zoneSoon(); }, { passive: true });
      if (W.lenis && W.lenis.on) W.lenis.on('scroll', function () { if (near) zoneSoon(); });
      if (o.auto !== false) {
        if ('IntersectionObserver' in W) { var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { io.disconnect(); draw(o.delay == null ? 0.35 : o.delay); } }); }, { rootMargin: '0px 0px -28% 0px' }); io.observe(host); }
        else still();
      }
      return { svg: svg, place: place, draw: draw, still: still };
    };
    W.gfArrow = { TAN: TAN, SPREAD: SPREAD, CHART: 1.8, ribbon: ribbon, headPaths: headPaths, head: head, ink: ink, icon: icon, word: word, rangeOf: rangeOf, sizes: sizes, line: line, timing: timing };
  })();

  /* ========================= 4 · the turn (gf-turn.js, verbatim) =========================
     A turn is a crossfade in TIME, never in scroll: to black 0.8 s, to paper 0.9 s, even in lightness (CIE L*), the inks
     swapping 80 ms after the field passes the middle of its lightness. Reduced motion: an instant switch. */
  (function () {
    if (W.gfTurn) return;
    var DUR = { dark: 800, light: 900 }, INK_LAG = 80;
    var lin = function (c) { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
    var unlin = function (v) { v = v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055; return Math.max(0, Math.min(255, v * 255)); };
    var Y = function (rgb) { return 0.2126 * lin(rgb[0]) + 0.7152 * lin(rgb[1]) + 0.0722 * lin(rgb[2]); };
    var Lstar = function (y) { return y > 216 / 24389 ? 116 * Math.cbrt(y) - 16 : y * 24389 / 27; };
    var lightness = function (rgb) { return Lstar(Y(rgb)); };
    var ss = function (t) { return t * t * (3 - 2 * t); };
    var ease = function (t, toDark) { t = Math.max(0, Math.min(1, t)); return toDark ? ss(t) : Math.pow(ss(t), 1.35); };
    var mixL = function (a, b, k) {
      var la = a.map(lin), lb = b.map(lin), La = lightness(a), Lb = lightness(b);
      if (Math.abs(Lb - La) < 0.5) return a.map(function (v, i) { return Math.round(v + (b[i] - v) * k); });
      var L = La + (Lb - La) * k, y = L > 8 ? Math.pow((L + 16) / 116, 3) : L * 27 / 24389, ya = Y(a), yb = Y(b);
      var f = (y - ya) / ((yb - ya) || 1);
      return la.map(function (v, i) { return Math.round(unlin(v + (lb[i] - v) * f)); });
    };
    var run = function (o) {
      var from = o.from.slice(), to = o.to.slice(), toDark = lightness(to) < lightness(from);
      var dur = toDark ? DUR.dark : DUR.light, inkDone = false, raf = 0, dead = false, resolve;
      var done = new Promise(function (r) { resolve = r; });
      if (o.reduce || REDUCE) { o.onFrame && o.onFrame(to); o.onInk && o.onInk(); resolve(); return { cancel: function () {}, done: done }; }
      var mid = 0.5, lo = 0, hi = 1; for (var i = 0; i < 18; i++) { mid = (lo + hi) / 2; if (ease(mid, toDark) < 0.5) lo = mid; else hi = mid; }
      var inkAt = mid * dur + INK_LAG, t0 = performance.now(), hb = 0, ht0 = 0, hd = 0;
      var step = function (now) {
        raf = 0; if (dead) return;
        // (core 1.0.35) a hurried turn carries on from where it was and lands in hd ms
        var el = now - t0, t = hd ? Math.min(1, hb + (1 - hb) * (now - ht0) / hd) : Math.min(1, el / dur), c = mixL(from, to, ease(t, toDark));
        o.onFrame && o.onFrame(c);
        if (!inkDone && (hd ? t >= mid : el >= inkAt)) { inkDone = true; o.onInk && o.onInk(); }
        if (t < 1 || !inkDone) raf = requestAnimationFrame(step); else resolve();
      };
      raf = requestAnimationFrame(step);
      return { cancel: function () { dead = true; if (raf) cancelAnimationFrame(raf); resolve(); }, done: done, toDark: toDark,
        hurry: function (ms) { if (dead || hd) return; var now = performance.now(); hb = Math.min(1, (now - t0) / dur); ht0 = now; hd = Math.max(16, ms); } };
    };
    var docY = function () { return W.scrollY || D.documentElement.scrollTop || 0; };
    var lastBottom = function (room) {
      var lo = -Infinity, y = docY(), all = room.querySelectorAll('h1, h2, h3, h4, p, li, dd, dt, img, picture, video, figure, button, a, blockquote, table');
      for (var i = 0; i < all.length; i++) { var e = all[i], r = e.getBoundingClientRect(); if (r.height < 2 || r.width < 2) continue; var cs = getComputedStyle(e); if (cs.visibility === 'hidden' || +cs.opacity < 0.05 || e.closest('[aria-hidden="true"]')) continue; lo = Math.max(lo, r.bottom + y); }
      return lo;
    };
    W.gfTurn = { run: run, ease: ease, lightness: lightness, mix: mixL, DUR: DUR, INK_LAG: INK_LAG, lastBottom: lastBottom };
  })();

  /* ========================= 5 · the conductor (sbx-m1.js room(), Flow: per-block) =========================
     A heading splits on the lines it finally sets (its balanced breaks are kept as <br class="gfx-br">), rises under a
     mask and returns to plain text. In Flow nothing holds, so a room's blocks play on their own as each reaches 88 % of the
     screen (sbx-m1.js PER), groups GROUP apart; jumped past, a block lands finished. */
  const unbreak = el => { $$('br.gfx-br', el).forEach(b => b.remove()); el.normalize(); };
  const breakBalanced = el => {
    unbreak(el);
    const words = [], tw = D.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    for (let n; (n = tw.nextNode());) { const re = /\S+/g; let m; while ((m = re.exec(n.textContent))) words.push([n, m.index]); }
    const breaks = []; let prev = null;
    words.forEach(([n, i]) => {
      const r = D.createRange(); r.setStart(n, i); r.setEnd(n, i + 1);
      const q = r.getClientRects()[0]; if (!q) return;
      if (prev != null && q.top > prev + q.height * 0.5) breaks.push([n, i]);
      prev = q.top;
    });
    const afterBreak = (n, i) => {
      if (n.textContent.slice(0, i).trim()) return false;
      for (let x = n; x && x !== el;) {
        const s = x.previousSibling;
        if (!s) { x = x.parentNode; continue; }
        if (s.nodeType === 3 && !s.textContent.trim()) { x = s; continue; }
        return s.nodeName === 'BR';
      }
      return false;
    };
    breaks.reverse().forEach(([n, i]) => {
      if (afterBreak(n, i)) return;
      const br = D.createElement('br'); br.className = 'gfx-br';
      if (!n.textContent.slice(0, i).trim()) i = 0;
      if (i === 0) { let host = n; while (host.parentNode !== el && host.parentNode.firstChild === host) host = host.parentNode; host.parentNode.insertBefore(br, host); }
      else { const rest = n.splitText(i); rest.parentNode.insertBefore(br, rest); }
    });
  };
  const lineSplit = el => {
    const o = { lines: [], played: false, split: null, reverted: false, revert() {} };
    if (!el || !W.SplitText) return o;
    const opts = { type: 'lines', mask: 'lines', linesClass: 'gfx-line', aria: 'none', onSplit: self => { o.lines = self.lines; if (!o.played) gsap.set(self.lines, { yPercent: G.headline.yPercent }); } };
    breakBalanced(el);
    o.split = W.SplitText.create(el, opts);
    /* (1.0.15) the field gives inks to the split lines and the spans inside them; a revert or a resplit rebuilds those
       nodes and the inks went with them, so a headline seen in the other tone kept its native ink (Home's team heading,
       ink on black while the turn waits). Carry them over: the headline takes its lines' ink, inner spans theirs. */
    const inkKeep = () => {
      const m = {};
      if (!el.hasAttribute('data-gfx-ink')) { const k = el.querySelector('.gfx-line[data-gfx-ink]'); if (k) el.setAttribute('data-gfx-ink', k.getAttribute('data-gfx-ink')); }
      el.querySelectorAll('[data-gfx-ink]:not(.gfx-line)').forEach(n => { const key = n.tagName + '.' + n.className; if (!(key in m)) m[key] = n.getAttribute('data-gfx-ink'); });
      return m;
    };
    const inkPut = m => el.querySelectorAll('*').forEach(n => { const v = m[n.tagName + '.' + n.className]; if (v && !n.hasAttribute('data-gfx-ink')) n.setAttribute('data-gfx-ink', v); });
    let lastW = W.innerWidth, rt = 0;
    W.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => safe('resplit', () => {
      if (W.innerWidth === lastW) return; lastW = W.innerWidth;
      const m = inkKeep();
      if (!o.reverted) o.split.revert();
      breakBalanced(el);
      if (!o.reverted) { o.split = W.SplitText.create(el, opts); if (o.played) gsap.set(o.lines, { yPercent: 0 }); }
      inkPut(m);
      requestAnimationFrame(() => D.dispatchEvent(new Event('gfx:resplit')));
    }), 160); });
    o.revert = () => { if (o.reverted) return; o.reverted = true; const m = inkKeep(); o.split.revert(); inkPut(m); };
    return o;
  };
  const fitFilm = (tl, max) => { max = max || READ.film; const d = tl.duration(); if (d > max + 0.01) tl.timeScale(d / max); return Math.min(d, max); };
  const LINES = ['clamp(top 88%)', 'clamp(bottom bottom)', 'clamp(top bottom-=8px)'];
  const rooms = [];
  function room(o) {
    const trig = typeof o.trigger === 'string' ? $(o.trigger) : o.trigger; if (!trig) return null;
    const hEl = o.headline ? (typeof o.headline === 'string' ? $(o.headline) : o.headline) : null;
    const head = hEl ? lineSplit(hEl) : null;
    const body = arr(o.body), hair = arr(o.hairline), pics = arr(o.pictures), det = arr(o.detail), draws = arr(o.draws);
    const slots = { headline: head ? 0 : null, body: body.length ? G.body.at : null, hairline: hair.length || draws.length ? G.hairline.at : null,
      picture: pics.length || o.extraPicture ? G.picture.at : null, detail: det.length || o.extraDetail ? G.detail.at : null };
    const base = Math.min.apply(null, Object.keys(slots).map(k => slots[k]).filter(v => v != null).concat(o.base != null ? [o.base] : [Infinity]));
    const at = k => (k in slots && slots[k] != null ? slots[k] : (G[k] && G[k].at) || 0) - (isFinite(base) ? base : 0);
    body.forEach(e => e.setAttribute('data-gfx-reveal', '')); det.forEach(e => e.setAttribute('data-gfx-reveal', ''));
    const set = (els, v) => { if (els.length) gsap.set(els, v); };
    set(body, { opacity: 0, y: G.body.y }); set(hair, { scaleX: 0, transformOrigin: '0% 50%' }); set(det, { opacity: 0, y: G.detail.y });
    set(pics, { clipPath: G.picture.clipFrom, scale: G.picture.scaleFrom }); set(draws, { clipPath: 'inset(0% 100% 0% 0%)' });
    const host = o.arriving && (typeof o.arriving === 'string' ? $(o.arriving) : o.arriving);
    const tl = gsap.timeline({ paused: true, onStart: () => host && host.classList.add('gfx-arriving'), onComplete: () => { host && host.classList.remove('gfx-arriving'); } });
    // per block (sbx-m1.js PER): whichever comes first, a block's top at 88 %, the block wholly on screen, or its first 8 px
    const done = new WeakSet();
    const batch = (els, from, to0, dur, ease, stg, clear) => {
      const to = clear ? Object.assign({}, to0, { clearProps: clear }) : to0;
      if (!els.length) return;
      LINES.forEach(start => ST.batch(els, { start, end: 'bottom top',
        onEnter: b => { b = b.filter(e => !done.has(e)); if (!b.length) return; b.forEach(e => done.add(e)); gsap.fromTo(b, from, Object.assign({}, to, { duration: dur, ease, stagger: b.length > 2 ? Math.min(stg, 0.24 / (b.length - 1)) : stg, immediateRender: false })); },
        onLeave: b => { b = b.filter(e => !done.has(e)); b.forEach(e => done.add(e)); if (b.length) gsap.to(b, Object.assign({}, to, { duration: G.fastForward })); },
        onEnterBack: b => { b = b.filter(e => !done.has(e)); b.forEach(e => done.add(e)); if (b.length) gsap.to(b, Object.assign({}, to, { duration: G.fastForward })); } }));
    };
    batch(body, { opacity: 0, y: G.body.y }, { opacity: 1, y: 0 }, G.body.duration, G.SETTLE, GROUP, 'transform');
    batch(hair, { scaleX: 0 }, { scaleX: 1 }, G.hairline.duration, G.DRAW, GROUP);
    batch(draws, { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)' }, G.hairline.duration, G.DRAW, GROUP, 'clipPath');
    batch(pics, { clipPath: G.picture.clipFrom, scale: G.picture.scaleFrom }, { clipPath: 'inset(0% 0% 0% 0%)', scale: 1 }, G.picture.duration, G.DRAW, GROUP, 'clipPath');
    batch(det, { opacity: 0, y: G.detail.y }, { opacity: 1, y: 0 }, G.detail.duration, G.SETTLE, o.group ? GROUP : Math.min(0.3, o.stagger != null ? o.stagger : G.detail.stagger), 'transform');
    if (head) {
      let hp = false;
      const rise = d => { if (hp) return; hp = true; head.played = true; gsap.to(head.lines, { yPercent: 0, duration: d, stagger: d > 0.5 ? G.headline.stagger : 0, ease: G.SETTLE, onComplete: () => { head.revert(); requestAnimationFrame(() => D.dispatchEvent(new Event('gfx:resplit'))); } }); };
      LINES.forEach(start => ST.create({ trigger: hEl, start, end: 'bottom top', onEnter: () => rise(G.headline.duration), onLeave: () => rise(G.fastForward), onEnterBack: () => rise(G.fastForward) }));
    }
    if (o.extra) safe('room extra', () => o.extra(tl, at));
    fitFilm(tl);
    let entered = false;
    const play = () => { if (entered) return; entered = true; tl.play(); };
    const ff = () => { entered = true; if (tl.progress() < 1) { tl.pause(); gsap.to(tl, { progress: 1, duration: G.fastForward, ease: 'power1.out' }); } };
    ST.create({ trigger: trig, start: 'clamp(' + (o.start || 'top 88%') + ')', end: self => Math.max(self.start + 1, Math.min(self.start + W.innerHeight * 1.4, ST.maxScroll(W) - 2)), onEnter: play, onLeave: ff });
    ST.create({ trigger: trig, start: 'top bottom', onLeaveBack: () => { if (entered) ff(); } });
    const r = { tl, head, trig }; rooms.push(r); return r;
  }

  /* ========================= 6 · the field (gf-flow.js, Flow 3) =========================
     The rooms are transparent; the page's colour is one backdrop (the body). Each chapter turn is a timed crossfade
     (gfTurn), placed by the arriving room's first content; the page's tone flips at the ink moment and a room shown in
     the other tone takes that tone's inks (data-gfx-ink, read from the room's own colours). The opaque room (the close,
     over footer I) is painted the same colour, and the close's last 0.3 screen takes the field down to the footer's.
     Rhythm: the gap between two rooms is exactly its tier, measured from last line to first line. The reader's place
     is kept through a resize, a reload and back. */
  const FIELD = { DARK: [17, 17, 18], LIGHT: [246, 245, 242], FOOT: [17, 17, 18] };
  let fieldRooms = [], fieldDef = null, turns = [], opaque = [], lastSpans = [], spanOf = null;
  // (1.0.30) set by the footer once it is built: it takes the field's colour and settles its columns only on a dark field
  let footTone = null;
  // (1.0.37) until then the field paints without fades (see paint); a reload or Back starts calm for its first 1.6 s
  let calmUntil = (() => { try { const t = (performance.getEntriesByType("navigation")[0] || {}).type; return t === "reload" || t === "back_forward" ? performance.now() + 1600 : 0; } catch (e) { return 0; } })();
  /* (1.0.35, founder 10/22: one move at a time) set by the footer: true while any of it is open. A turn running then (a quick
     reader outran the close's crossfade) finishes from where it is in 160 ms, so the footer always opens on settled black. */
  let footOpen = null;
  const hurryTurn = () => { if (fade && fade.h && fade.h.hurry) fade.h.hurry(160); };
  /* (1.0.31, founder 10/22: no seam anywhere) the bar's backing wears the field's colour frame by frame; before, it switched
     paper/black in one step at the ink moment while the field behind it was mid-fade (a band at the top when scrolling up
     through a turn). The variable sits on the bar alone, so a turn restyles the bar and nothing else. */
  let navs = null;
  const navTone = s => {
    if (!navs || !navs.length) { navs = $$('.gfx-nav'); if (navs.length && !$('#gfx-nav-field')) { const st = D.createElement('style'); st.id = 'gfx-nav-field'; st.textContent = 'html.gfx-f3 .gfx-nav[data-gfx-fc]::before{background-color:var(--gfx-fc)!important;transition:box-shadow .1s linear!important}'; /* (1.0.34) no easing on the colour: the stylesheet's .1 s background fade left the bar a tenth of a second behind the page mid-turn */ D.head.appendChild(st); } }
    for (const n of navs) { n.style.setProperty('--gfx-fc', s); if (!n.hasAttribute('data-gfx-fc')) n.setAttribute('data-gfx-fc', ''); }
  };
  const toneRGB = t => (t === 'D' ? FIELD.DARK : FIELD.LIGHT);
  const css = c => `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
  const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
  const fieldListeners = [];
  const setupRooms = () => {
    if (fieldDef.phoneRhythm) H.classList.add('gfx-ph-rhythm'); if (fieldDef.phoneRhythm === true) H.classList.add('gfx-tab-rhythm');
    fieldRooms = (fieldDef.rooms || []).map(o => Object.assign({}, o, { el: typeof o.el === 'string' ? $(o.el) : o.el })).filter(o => o.el);
    fieldRooms.forEach((o, i) => {
      const r = o.el; r.classList.add('gfx-fr'); r.setAttribute('data-gfx-native', o.native);
      if (o.tier) r.setAttribute('data-gfx-tier', o.tier);
      if (o.opaque) r.setAttribute('data-gfx-opaque', '');
      if (o.foot) r.setAttribute('data-gfx-foot', ''); if (i === fieldRooms.length - 1) r.setAttribute('data-gfx-last', '');
      if (i && o.tone !== fieldRooms[i - 1].tone && fieldRooms[i - 1].native !== 'M') r.setAttribute('data-gfx-turn', '');
    });
    /* (1.0.27, smoothness lab 10/21: the worst moment on most pages was the turn into the close) when the tone flips,
       every inked line on the page took a 150 ms colour fade at once, hundreds of them off screen, all run by the page
       itself. The fade now runs only in the rooms on screen (data-gfx-tv); the rest change where no one sees them. */
    if ('IntersectionObserver' in W) { const tv = new IntersectionObserver(es => es.forEach(e => e.target.toggleAttribute('data-gfx-tv', e.isIntersecting)), { rootMargin: '25% 0px' }); fieldRooms.forEach(o => tv.observe(o.el)); }
    else fieldRooms.forEach(o => o.el.setAttribute('data-gfx-tv', ''));
  };
  const measure = () => {
    const vh = W.innerHeight, max = D.documentElement.scrollHeight - vh;
    turns = [];
    fieldRooms.forEach((o, i) => {
      if (i && o.tone !== fieldRooms[i - 1].tone) {
        const pad = parseFloat(getComputedStyle(o.el).paddingTop) || 0, sp = spanOf && spanOf(o.el);
        const T = sp && Number.isFinite(sp.top) ? sp.top : docTop(o.el) + pad;
        const y1 = Math.min(T - vh * 0.85, max - vh * 0.05), band = W.innerWidth <= 991 ? 0.3 : 0.4;
        let ym = y1 - vh * band / 2;
        // the page's own rule for when this turn may run (gf-flow.js's Flow 3 waits, given by the page layer)
        if (o.turnAt) { const v = safe('turnAt', () => o.turnAt(ym, { vh, max, prev: fieldRooms[i - 1], room: o, docTop, lastBottom: W.gfTurn.lastBottom })); if (Number.isFinite(v)) ym = v; }
        turns.push({ y0: ym - vh * band / 2, y1: ym + vh * band / 2, ym, timed: true, from: toneRGB(fieldRooms[i - 1].tone), to: toneRGB(o.tone), tf: fieldRooms[i - 1].tone, tt: o.tone });
      }
      if (o.foot) {
        const end = Math.min(docTop(o.el) + o.el.offsetHeight - vh, max), last = turns.length ? turns[turns.length - 1].to : toneRGB(o.tone);
        turns.push({ y0: end - vh * 0.3, y1: end, from: last, to: FIELD.FOOT, tf: o.tone, tt: o.tone });
      }
    });
    opaque = fieldRooms.filter(o => o.opaque).map(o => o.el);
    // (1.0.31) the close is see-through: the page's background is the one colour behind the close and the footer, so the
    // browser can never draw them apart during a turn (1.0.30 painted both, and a large screen still showed them a few frames apart)
    for (const e of opaque) e.style.setProperty('background-color', 'transparent', 'important');
  };
  let lastC = '', lastTone = '', shown = null, fade = null, fadeRaf = 0, toningT = 0;
  const ease3 = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const apply = (c, tone) => {
    const s = css(c);
    if (s !== lastC) { lastC = s; D.body.style.backgroundColor = s; if (footTone) footTone(s); navTone(s); fieldListeners.forEach(f => safe('field listener', () => f(s, c))); }
    if (tone !== lastTone) {
      if (lastTone) { H.classList.add('gfx-toning'); clearTimeout(toningT); toningT = setTimeout(() => H.classList.remove('gfx-toning'), 220); }
      lastTone = tone;
      H.classList.toggle('gfx-tone-dark', tone === 'D'); H.classList.toggle('gfx-tone-light', tone !== 'D');
      if (footTone) footTone(null);
    }
  };
  const fadeStep = () => {
    fadeRaf = 0; if (!fade || fade.h) return;
    const f = fade; f.ink = f.tf;
    f.h = W.gfTurn.run({ from: f.from, to: f.to, reduce: REDUCE,
      onFrame: c => { if (fade !== f) return; shown = c; apply(c, f.ink); },
      onInk: () => { if (fade !== f) return; f.ink = f.tt; apply(shown, f.tt); } });
    f.h.done.then(() => { if (fade === f) { shown = f.to.slice(); apply(shown, f.tt); fade = null; } });
    if (footOpen && footOpen()) hurryTurn();
  };
  const paint = sy => {
    if (!fieldRooms.length) return;
    const y = typeof sy === 'number' ? sy : scrollNow();
    let tone = fieldRooms[0].tone, c = toneRGB(tone);
    for (const u of turns) {
      if (u.timed) { if (y >= u.ym) { tone = u.tt; c = u.to; continue; } break; }
      if (y >= u.y1) { tone = u.tt; c = u.to; continue; }
      if (y > u.y0) { const t = (y - u.y0) / (u.y1 - u.y0); tone = t < 0.5 ? u.tf : u.tt; c = REDUCE ? (t < 0.5 ? u.from : u.to) : mix(u.from, u.to, ease3(t)); }
      break;
    }
    // (1.0.37, launch QA 10/22) while the reader is being put back in place (reload, Back), the colour lands at once: the
    // first measures overshoot (Home: dark for ~1 s, then a fade back to paper); a turn fades only when the reader scrolls
    if (!shown || REDUCE || performance.now() < calmUntil) { if (fade && fade.h) fade.h.cancel(); fade = null; shown = c; apply(c, tone); return; }
    if (tone !== (fade ? fade.tt : lastTone)) {
      if (fade && fade.h) fade.h.cancel();
      fade = { from: shown.slice(), to: c, tf: lastTone, tt: tone };
      if (!fadeRaf) fadeRaf = requestAnimationFrame(fadeStep);
    } else if (fade) fade.to = c;
    else { shown = c; apply(c, tone); }
  };
  /* inks: an element is marked where it declares a colour; islands (pictures, svg drawings, anything with its own
     background) keep theirs; a background that only repeated the room's colour is cleared */
  const rgba = s => { const m = /rgba?\(([^)]+)\)/.exec(s); if (!m) return null; const v = m[1].split(/[\s,/]+/).filter(Boolean).map(Number); return { r: v[0], g: v[1], b: v[2], a: v.length > 3 ? v[3] : 1 }; };
  const lum = c => (0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b) / 255;
  const green = c => c.g > c.r + 40 && c.g > c.b + 20;
  const sameAsRoom = (c, native) => native === 'L' ? lum(c) > 0.96 : lum(c) < 0.1;
  const inkOf = (c, native) => {
    if (green(c)) return 'g';
    if (native === 'L') return lum(c) < 0.2 ? 'h' : 'b';
    if (c.a >= 0.9 && lum(c) > 0.8) return 'h';
    return c.a >= 0.66 ? 'b' : 'q';
  };
  const SKIP = /^(IMG|VIDEO|PICTURE|CANVAS|SOURCE|SCRIPT|STYLE|IFRAME|svg|BR)$/;
  const inkQ = [];
  const classify = o => {
    if (o.native === 'M' || o.noInk) return;
    const rc = getComputedStyle(o.el).color, k = rgba(rc); if (k) o.el.setAttribute('data-gfx-ink', inkOf(k, o.native));
    inkQ.push([o.el, rc, o]);
  };
  const hasOwnText = e => { for (let n = e.firstChild; n; n = n.nextSibling) if (n.nodeType === 3 && /\S/.test(n.data)) return true; return false; };
  const inkSlice = () => {
    const t0 = performance.now(), Wr = [];
    while (inkQ.length && performance.now() - t0 < 8) {
      const [el, parentColor, o] = inkQ.pop();
      for (const c of el.children) {
        if (SKIP.test(c.tagName) || c.hasAttribute('data-gfx-skip')) continue;
        const cs = getComputedStyle(c);
        if (cs.display === 'none') continue;
        const bg = rgba(cs.backgroundColor), thin = c.offsetHeight <= 2 && c.offsetWidth > 24;
        if (bg && bg.a > 0.5) { if (sameAsRoom(bg, o.native)) Wr.push([c, 'data-gfx-clear', '']); else if (!thin) continue; }
        if (bg && bg.a > 0.05 && thin) Wr.push([c, 'data-gfx-line', '']);
        const bt = parseFloat(cs.borderTopWidth) || 0, bb = parseFloat(cs.borderBottomWidth) || 0;
        if ((bt > 0 && bt < 3 && (rgba(cs.borderTopColor) || {}).a > 0.05) || (bb > 0 && bb < 3 && (rgba(cs.borderBottomColor) || {}).a > 0.05)) Wr.push([c, 'data-gfx-bline', '']);
        const col = cs.color, kk = rgba(col);
        if (kk && (col !== parentColor || hasOwnText(c))) Wr.push([c, 'data-gfx-ink', inkOf(kk, o.native)]);
        inkQ.push([c, col, o]);
      }
    }
    Wr.forEach(([e, a, v]) => e.setAttribute(a, v));
    return inkQ.length > 0;
  };
  /* rhythm: the tier's gap runs from the last thing seen in the room before to the first thing seen in this one */
  const TIERS = () => {
    const vh = W.innerHeight, phone = W.innerWidth <= 991, cl = (a, v, b) => Math.min(b, Math.max(a, v));
    const turn = Math.max(224, vh * 0.35);
    /* (1.0.10) below 768px the gap is the designer's Webflow variable phone / section-gap (80px), the one the other pages'
       rooms use; breath stays 1.6 times it */
    if (W.innerWidth <= 767) { const g = parseFloat(getComputedStyle(D.documentElement).getPropertyValue('--_phone---section-gap')) || 80; return { tight: g, standard: g, breath: Math.round(g * 1.6), turn: Math.max(192, vh * 0.3) }; }
    if (phone) return { tight: 80, standard: 96, breath: 128, turn: Math.max(192, vh * 0.3) };
    return { tight: cl(64, vh * 0.0711, 93) * 2, standard: cl(96, vh * 0.1067, 139) + cl(64, vh * 0.0711, 93), breath: cl(192, vh * 0.2133, 278) + cl(96, vh * 0.1067, 139), turn };
  };
  let STICKY = new Set();
  const stickyShift = (el, rm) => {
    let s = 0;
    for (let n = el.parentElement; n && n !== rm; n = n.parentElement) {
      if (!STICKY.has(n)) continue;
      const p = n.parentElement; s += Math.max(0, (docTop(p) + p.offsetHeight - (parseFloat(getComputedStyle(p).paddingBottom) || 0)) - (docTop(n) + n.offsetHeight));
    }
    return s;
  };
  const SKIPSPAN = '.gfx-cap, .gfx-seam, .gfx-mark, .gfa, [data-gfx-skip], .gfx-sr, .gfx-mk-sr';
  const DECOR = '[data-o~="ow-close-fox"], [data-o~="gfc-fox"], .gfc-fox, .gfx-ow-close-fox, .footer-logo-subtle, .gfx-dim';
  const spans = () => {
    const all = fieldRooms.map(o => [o.el].concat($$('*:not(svg *)', o.el)));
    const st = [], clip = new Set();
    all.forEach(list => list.forEach(e => { const cs = getComputedStyle(e); if (cs.position === 'sticky') st.push(e); if (cs.overflowY !== 'visible') clip.add(e); }));
    const keep = st.map(e => ['position', 'top', 'bottom'].map(p => [p, e.style.getPropertyValue(p), e.style.getPropertyPriority(p)]));
    st.forEach(e => { e.style.setProperty('position', 'relative', 'important'); e.style.setProperty('top', 'auto', 'important'); e.style.setProperty('bottom', 'auto', 'important'); }); STICKY = new Set(st);
    const memo = new Map(), top0 = el => { if (!el) return 0; let v = memo.get(el); if (v == null) { v = el.offsetTop + top0(el.offsetParent); memo.set(el, v); } return v; };
    const drawn = !!(fieldDef && fieldDef.drawnCovers) && W.innerWidth <= 991;
    try {
      return fieldRooms.map((o, k) => {
        const rm = o.el; let top = Infinity, bot = -Infinity;
        all[k].forEach(e => {
          if (e === rm) return;
          // (final audit) a page whose cards are drawn (field.drawnCovers: Insights) counts each cover on a tablet
          if (drawn && e.tagName === 'svg' && !e.closest(SKIPSPAN) && !e.closest(DECOR)) { const r = e.getBoundingClientRect(); if (r.width >= 48 && r.height >= 48) { const t = r.top + (W.scrollY || 0); top = Math.min(top, t); bot = Math.max(bot, t + r.height); } return; }
          if (!(e.tagName === 'IMG' || e.tagName === 'VIDEO' || hasOwnText(e))) return;
          if (!e.offsetParent || e.offsetWidth < 3 || e.offsetHeight < 3 || e.closest(SKIPSPAN)) return;
          let t = top0(e), b = t + e.offsetHeight;
          for (let n = e.parentElement; n && n !== rm; n = n.parentElement) if (clip.has(n)) { const nt = top0(n); t = Math.max(t, nt); b = Math.min(b, nt + n.offsetHeight); break; }
          if (b - t < 2) return;
          top = Math.min(top, t); bot = Math.max(bot, b + stickyShift(e, rm));
        });
        const rt = top0(rm), pad = parseFloat(getComputedStyle(rm).paddingTop) || 0;
        return { pad, inner: Number.isFinite(top) ? top - (rt + pad) : 0, trail: Number.isFinite(bot) ? Math.max(0, rt + rm.offsetHeight - bot) : 0, top, bot, rtop: rt, rbot: rt + rm.offsetHeight };
      });
    } finally { STICKY = new Set(); st.forEach((e, i) => keep[i].forEach(([p, v, pr]) => { if (v) e.style.setProperty(p, v, pr); else e.style.removeProperty(p); })); }
  };
  const spansLite = () => {
    const memo = new Map(), top0 = el => { if (!el) return 0; let v = memo.get(el); if (v == null) { v = el.offsetTop + top0(el.offsetParent); memo.set(el, v); } return v; };
    /* (1.0.12, final audit) every word and every picture counts, and the room's edges are its true first and last ones
       (before: the first 6 and last 12 in code order, words only, so a drawing, a film or the client's window at a
       room's foot was read as empty space and a phone gap came out 60 where it meant 256) */
    // (hidden items, like a list's later pages, take no part: visibility counts, not only display)
    const seen = e => !e.checkVisibility || e.checkVisibility({ visibilityProperty: true });
    const Y = W.scrollY || 0, r0 = e => { const r = e.getBoundingClientRect(); return { t: r.top + Y, b: r.bottom + Y, w: r.width, h: r.height }; };
    return fieldRooms.map(o => {
      // (every element that holds its own words: the case figures and their captions are plain blocks)
      const rm = o.el, c = $$('*', rm).filter(e => !(e.ownerSVGElement) && e.tagName !== 'svg' && hasOwnText(e) && e.offsetParent && e.offsetHeight > 2 && e.offsetWidth > 2 && !e.closest(SKIPSPAN) && !e.closest(DECOR) && seen(e));
      // (the close's fox watermark is decoration: it does not decide the room's edges)
      const media = $$('svg, canvas, video, img, .gfx-mk-portal', rm).filter(e => !(e.ownerSVGElement) && !e.closest(SKIPSPAN) && !e.closest(DECOR) && seen(e)).map(e => Object.assign(r0(e), { inLink: !!e.closest('a, button') })).filter(r => r.w > 8 && r.h > 8 && !(r.inLink && r.w < 48 && r.h < 48));   // (an icon in a link is not a picture; a card's cover is)
      const rt = top0(rm), pad = parseFloat(getComputedStyle(rm).paddingTop) || 0;
      if (!c.length && !media.length) return { pad, inner: 0, trail: 0, rtop: rt, rbot: rt + rm.offsetHeight };
      const top = Math.min(...c.map(top0), ...media.map(r => r.t)), bot = Math.max(...c.map(e => top0(e) + e.offsetHeight), ...media.map(r => r.b));
      return { pad, inner: top - (rt + pad), trail: Math.max(0, rt + rm.offsetHeight - bot), top, bot, rtop: rt, rbot: rt + rm.offsetHeight };
    });
  };
  const rhythm = () => {
    const T = TIERS(), S = lastSpans = W.innerWidth <= 767 ? spansLite() : spans();
    let changed = false;
    // (1.0.12, final audit) tierPhone: a room that keeps its own desktop spacing joins the house rhythm on a phone only
    const ph = W.innerWidth <= 767;
    // on a phone (pages that opt in with field.phoneRhythm) every room after the first takes the house rhythm: 80 within a colour, the turn where the colour changes
    // (a page may still name its own tierPhone); desktop keeps each room's own tier
    const auto = (o, i) => fieldDef && fieldDef.phoneRhythm && i && fieldRooms[i - 1].native !== 'M' ? (o.tone !== fieldRooms[i - 1].tone ? 'turn' : 'standard') : null;
    // (final audit) a tablet (768-991) takes the same rhythm on pages that opt in fully (phoneRhythm true; 'phone' = phones only)
    const rh = ph || (!!fieldDef && fieldDef.phoneRhythm === true && W.innerWidth <= 991);
    const writes = fieldRooms.map((o, i) => {
      const turnHere = fieldDef && fieldDef.phoneRhythm && i && fieldRooms[i - 1].native !== 'M' && o.tone !== fieldRooms[i - 1].tone;
      const tier = rh ? (o.tierPhone || (turnHere ? 'turn' : o.tier || auto(o, i))) : o.tier;   // (a colour change is always the turn on a phone)
      if (!tier) { if (o._phPad) { o.el.style.removeProperty('padding-top'); o._phPad = false; S[i].pad = parseFloat(getComputedStyle(o.el).paddingTop) || 0; } return null; }
      if (tier !== o.tier) o._phPad = true;
      // (final audit) whatever sits between two rooms (a block outside the field) counts toward the gap
      const prevTrail = i && fieldRooms[i - 1].native !== 'M' ? S[i - 1].trail + (rh ? Math.max(0, (S[i].rtop || 0) - (S[i - 1].rbot || 0)) : 0) : 0;   // (phones only: desktop keeps its approved gaps)
      const want = Math.max(0, Math.round(T[tier] - S[i].inner - prevTrail));
      return Math.abs(want - S[i].pad) > 1 ? want : null;
    });
    writes.forEach((w, i) => { if (w != null) { fieldRooms[i].el.style.setProperty('padding-top', w + 'px', 'important'); lastSpans[i].pad = w; changed = true; } });
    return changed;
  };
  spanOf = el => { const i = fieldRooms.findIndex(o => o.el === el), s = lastSpans[i]; return s ? { top: docTop(el) + (parseFloat(el.style.paddingTop) || s.pad) + s.inner } : null; };
  /* the reader's place: the room at the top of the screen and how far into it; within a visit, the line being read */
  const inSticky = el => { for (let n = el; n && n !== D.body; n = n.parentElement) if (getComputedStyle(n).position === 'sticky') return true; return false; };
  const placeNow = live => {
    const y = scrollNow(); let at = null;
    fieldRooms.forEach((o, i) => { const t = docTop(o.el); if (t <= y + 1) at = { i, f: (y - t) / Math.max(1, o.el.offsetHeight) }; });
    at = at || { i: 0, f: 0 };
    if (live) for (const fy of [0.3, 0.45, 0.6]) {
      const e = D.elementFromPoint(W.innerWidth * 0.3, W.innerHeight * fy);
      const t = e && e.closest('h1,h2,h3,h4,p,.heading-2,.heading-4,.paragraph,img');
      if (t && !inSticky(t)) { at.el = t; at.off = t.getBoundingClientRect().top; break; }
    }
    return at;
  };
  let lastPlace = null;
  const goPlace = at => {
    calmUntil = performance.now() + 450;
    const o = fieldRooms[at.i]; if (!o) return;
    let y = Math.max(0, Math.round(docTop(o.el) + at.f * o.el.offsetHeight));
    if (at.el && at.el.isConnected && at.el.getBoundingClientRect().height > 0 && !inSticky(at.el)) y = Math.max(0, Math.round(at.el.getBoundingClientRect().top + scrollNow() - at.off));
    if (Math.abs(y - scrollNow()) >= 2) { if (shared) shared.scrollTo(y, { immediate: true, force: true }); else W.scrollTo(0, y); if (ST) ST.update(); }
    if (at.el) lastPlace = at;
  };
  function fieldStill() {
    // reduced motion / no library: the turns placed once the layout is settled, painted from the scroll alone
    setupRooms(); rhythm(); measure(); paint();
    addEventListener('scroll', () => paint(), { passive: true });
    addEventListener('resize', () => { measure(); paint(); });
    addEventListener('load', () => { rhythm(); measure(); paint(); });
    if (D.fonts && D.fonts.ready) D.fonts.ready.then(() => { rhythm(); measure(); paint(); });
    fieldRooms.forEach(classify); const idle = W.requestIdleCallback || (f => setTimeout(f, 60)); const next = () => { if (inkSlice()) idle(next, { timeout: 1500 }); }; idle(next, { timeout: 1500 });
  }
  function fieldInit() {
    setupRooms();
    try { history.scrollRestoration = 'manual'; } catch (e) { /* old browsers */ }
    const KEYP = 'gfxFlowAt:' + location.pathname;
    addEventListener('pagehide', () => { try { W.sessionStorage.setItem(KEYP, JSON.stringify(placeNow())); } catch (e) { /* private */ } });
    let pending = null, pendT = 0, lpT = 0;
    addEventListener('scroll', () => { clearTimeout(lpT); lpT = setTimeout(() => { if (!pending) lastPlace = placeNow(true); }, 150); }, { passive: true });
    // (1.0.42, overnight audit 10/23) a resize while a reload restores the place re-arms this timer, which replaced the one that
    // shows the rooms again: the page stayed blank until the 2.2 s safety. Either timer now shows them once the place is back
    const holdPlace = () => { if (!pending) pending = lastPlace || placeNow(true); clearTimeout(pendT); pendT = setTimeout(() => { if (pending) goPlace(pending); pending = null; requestAnimationFrame(() => requestAnimationFrame(unhide)); }, 1700); };
    rhythm();
    let rw = W.innerWidth, rh = W.innerHeight, rt = 0;
    // (final audit) only the window's own resize: a capture listener also hears a <video>'s "resize" (fired when its
    // first frame loads), which held the reader's place mid-scroll and pulled them back up to 1500px (Investors MC films)
    addEventListener('resize', e => { if (e.target !== W) return; if (W.innerWidth === rw && Math.abs(W.innerHeight - rh) < 120 && TOUCH) return; holdPlace(); rw = W.innerWidth; rh = W.innerHeight; clearTimeout(rt); rt = setTimeout(() => { rhythm(); ST.refresh(); }, 220); }, true);
    const nav = (performance.getEntriesByType && performance.getEntriesByType('navigation')[0] || {}).type;
    let saved = null; try { saved = JSON.parse(W.sessionStorage.getItem(KEYP) || 'null'); } catch (e) { /* none */ }
    // (1.0.42, overnight audit 10/23) the place is set once the page holds still (its height unchanged 0.4 s, fonts in), at
    // most 1.4 s as before: this runs after load, so a fixed 1.4 s left a reload or Back blank until the 2.2 s safety
    if (saved && (nav === 'reload' || nav === 'back_forward')) {
      pending = saved; clearTimeout(pendT); const t0 = performance.now(); let lastH = -1, calm = 0;
      const check = () => { const h = D.documentElement.scrollHeight; calm = Math.abs(h - lastH) < 2 ? calm + 1 : 0; lastH = h;
        if ((calm >= 4 && (!D.fonts || D.fonts.status === 'loaded')) || performance.now() - t0 > 1400) { if (pending) goPlace(pending); pending = null; requestAnimationFrame(() => requestAnimationFrame(unhide)); } else pendT = setTimeout(check, 100); };
      pendT = setTimeout(check, 100);
    }
    addEventListener('pageshow', e => { if (e.persisted && saved) setTimeout(() => goPlace(saved), 300); });
    const idle = W.requestIdleCallback || (f => setTimeout(f, 60));
    fieldRooms.forEach(classify);
    const next = () => { if (inkSlice()) idle(next, { timeout: 1500 }); };
    idle(next, { timeout: 1500 });
    let settles = 0, settleUntil = performance.now() + 4000;
    ST.addEventListener('refresh', () => { if (settles < 3 && performance.now() < settleUntil && rhythm()) { settles++; ST.refresh(); return; } measure(); if (pending) goPlace(pending); paint(); });
    addEventListener('resize', () => { settles = 0; settleUntil = performance.now() + 2500; });
    ST.create({ start: 0, end: 'max', onUpdate: s => paint(s.scroll()), onRefresh: s => paint(s.scroll()) });
    ST.refresh(); measure(); paint();
    const settle = () => { ST.refresh(); measure(); paint(); };
    const decoded = Array.prototype.filter.call(D.images, i => !i.complete && i.loading !== 'lazy').map(i => (i.decode ? i.decode() : Promise.resolve()).catch(() => {}));
    Promise.all([D.fonts ? D.fonts.ready : Promise.resolve()].concat(decoded)).then(() => requestAnimationFrame(settle));
    if (D.readyState === 'complete') requestAnimationFrame(settle); else addEventListener('load', () => requestAnimationFrame(settle), { once: true });
    if ('ResizeObserver' in W) { let lastH = D.documentElement.scrollHeight, rt2 = 0; new ResizeObserver(() => { const h = D.documentElement.scrollHeight; if (Math.abs(h - lastH) < 2) return; lastH = h; clearTimeout(rt2); rt2 = setTimeout(() => { if (ST) ST.refresh(); measure(); paint(); }, 150); }).observe(D.body); } // (1.0.35) and every scroll trigger re-measures: Contact's questions close after the triggers were placed, which left the footer's entrance below the page's end on tablets and phones
    W.gfxField = { turns: () => turns, spans: () => lastSpans, paint, measure, rhythm, place: { now: placeNow, go: goPlace } };
  }
  // before the layers have run, the backdrop already follows the scroll (a reload mid-page never shows the wrong field)
  // (1.0.40, launch QA 10/22) a reload or Back mid-page skips this early guess: before the page's own layers are built the
  // rooms measure short and the guess can be the wrong colour (Home: black for ~0.15 s, then paper); the first real paint lands calm
  const early = () => safe('early field', () => { if (!fieldDef) return; if (performance.now() < calmUntil && W.scrollY > W.innerHeight * 0.5) return; if (!fieldRooms.length) setupRooms(); measure(); paint(); });

  /* ========================= 7 · the bar (sbx.js, Flow) =========================
     One bar on Webflow (our nav copy). At the top it wears the regular look (transparent, white links, no button) over
     the film; past half a screen it is the solid bar: it leaves on the way down and returns on any 6 px up (0.45 s,
     cubic-bezier(.16,1,.3,1)), its backing the field's own tone; the fox stays. The fox steps aside while words or a
     picture pass within 28 px of it (gf-site.js foxWatch). */
  const barEase = t => { const c = [0.16, 1, 0.3, 1]; let x = t; for (let i = 0; i < 6; i++) { const bx = 3 * c[0] * x * (1 - x) * (1 - x) + 3 * c[2] * x * x * (1 - x) + x * x * x - t, d = 3 * c[0] * (1 - x) * (1 - x) + 6 * (c[2] - c[0]) * x * (1 - x) + 3 * (1 - c[2]) * x * x; if (Math.abs(bx) < 1e-5 || !d) break; x -= bx / d; } return 3 * c[1] * x * (1 - x) * (1 - x) + 3 * c[3] * x * x * (1 - x) + x * x * x; };
  const navLook = top => safe('nav look', () => {
    const bar = $('.gfx-nav'); if (!bar) return;
    navTop = top;
    $$('.' + NAV_VAR + ', [data-gfx-var]', bar).forEach(e => { e.setAttribute('data-gfx-var', ''); e.classList.toggle(NAV_VAR, !top); });
    bar.classList.toggle('gfx-top', top); H.classList.toggle('gfx-bar-top', top);
  });
  /* (core 1.0.9) THE PHONE MENU'S FOOT: the open menu on phones and tablets was four links on a dark panel. Under them,
     quietly: the house action and the direct lines (the owners' and investors' addresses, the telephone), so a reader
     reaches the firm in one tap. Shown only where the menu is the overlay (CSS, max-width 991px). */
  function menuFoot() {
    const menu = $('.w-nav-menu'); if (!menu || $('.gfx-menu-foot', menu)) return;
    const cta = $$('.gfx-nav a, .w-nav a').find(a => /^start a conversation$/i.test(a.textContent.trim()));
    const href = (cta && cta.getAttribute('href')) || '/contact';
    menu.insertAdjacentHTML('beforeend', `<div class="gfx-menu-foot"><a class="gfx-menu-cta" href="${href}">Start a conversation</a><ul class="gfx-menu-lines"><li><a href="mailto:inquiries@greyfoxpartners.com"><span>Write to us</span>inquiries@greyfoxpartners.com</a></li><li><a href="tel:+16469466641"><span>Telephone</span>(646) 946-6641</a></li></ul></div>`);
  }
  /* (1.0.11) the logo link is two images with empty alt text, so it had no name for a screen reader: it is named here */
  function navName() {
    $$('a.w-nav-brand, a.logo-link').forEach(a => {
      const named = (a.getAttribute('aria-label') || a.textContent || $$('img', a).map(i => i.alt).join('')).trim();
      if (!named) a.setAttribute('aria-label', 'Grey Fox Partners, home');
    });
  }
  /* (1.0.12, final audit; the founder: a white bar above the logo on his iPhone) the browser's top strip (iPhone Safari's
     status bar, Android's address bar, Safari's tab bar) takes the colour of what is at the top of the screen right now:
     a photo or film reads as its dark, otherwise the first solid background under the bar (paper, the black, the menu).
     Without it Safari painted the body's paper over Home's dark hero. Checked as the page scrolls and every 0.6 s. */
  function topTint() {
    let m = $('meta[name="theme-color"]'); if (!m) { m = D.createElement('meta'); m.name = 'theme-color'; D.head.appendChild(m); }
    let last = '', raf = 0;
    const solid = c => { const v = (c || '').match(/[\d.]+/g); return v && (v.length < 4 || +v[3] > 0.5) ? `rgb(${v[0]}, ${v[1]}, ${v[2]})` : null; };
    const pick = () => {
      const els = D.elementsFromPoint ? D.elementsFromPoint(W.innerWidth / 2, 1) : [];
      for (const e of els) {
        if (e.tagName === 'IMG' || e.tagName === 'VIDEO' || e.tagName === 'CANVAS') return 'rgb(20, 20, 21)';
        const s = getComputedStyle(e); if (+s.opacity === 0 || s.visibility === 'hidden') continue;
        if (s.backgroundImage !== 'none' && !/gradient/.test(s.backgroundImage)) return 'rgb(20, 20, 21)';
        const c = solid(s.backgroundColor); if (c) return c;
      }
      return solid(getComputedStyle(D.body).backgroundColor) || 'rgb(246, 245, 242)';
    };
    /* (1.0.27, smoothness lab 10/21) the strip's colour is read at most every 200 ms while the page moves (it was a probe
       every frame), and the slow look-again runs only for 2 s after a scroll or a tap (a turn's crossfade finishing in
       time), not every 0.6 s for as long as the page is open */
    let ran = 0, tmo = 0, poked = 0;
    const run = () => { raf = 0; ran = performance.now(); const c = pick(); if (c !== last) { m.setAttribute('content', c); last = c; } };
    const soon = () => { if (raf || tmo) return; const wait = 200 - (performance.now() - ran); if (wait > 0) tmo = setTimeout(() => { tmo = 0; raf = 1; postFrame(run); }, wait); else { raf = 1; postFrame(run); } };
    const poke = () => { poked = performance.now(); soon(); };
    addEventListener('scroll', poke, { passive: true }); addEventListener('resize', poke); D.addEventListener('click', () => { poked = performance.now(); setTimeout(soon, 350); }, true);
    setInterval(() => { if (!D.hidden && performance.now() - poked < 2000) soon(); }, 500); run();
  }
  function navInit() {
    safe('menu foot', menuFoot);
    safe('nav name', navName);
    safe('top tint', topTint);
    const bar = $('.gfx-nav'); if (!bar) return;
    /* (1.0.17, granular audit 10/20) ONE BAR ON EVERY PAGE: the inner pages (Insights, Team, Contact, Privacy, the people,
       the articles) carry the nav's "base" variant, whose "Start a conversation" shows only through the pages' top rule
       (.gfx-top). Past half a screen the bar drops gfx-top and the button vanished there, while Home, Owners and Investors
       (the "dark" variant) kept it. The solid bar shows it on every page; on phones it sits in the folded menu. */
    /* (1.0.18, founder 10/20: "is the size of the fox on every footer the same? should be consistent") the close's fox at
       Home's size on every page: 64% of the screen's height (Home's 577px on 1440x900), at most 744px, where it was 88%
       of each close (314px on Insights to 589px on Home). A close shorter than the drawing trims it above and below. */
    if (!$('#gfx-bar-btn')) { const st = D.createElement('style'); st.id = 'gfx-bar-btn'; st.textContent = 'html.gfx-f3 .gfx-nav:not(.gfx-top) .button_wrapper.show{display:block!important}' +
      // (1.0.36, launch QA 10/22) the open menu's icon is the two turning bars alone (the outer bars stayed white across the X), and the
      // fox stays above the menu while it closes (it was lifted only while open, so the closing panel covered it for ~0.3 s)
      'html body .w-nav-button.w--open [class*="hamburger_line"]:not(#gfx-mo){background-color:transparent!important}html body .w-nav .w-nav-brand{position:relative;z-index:3}' +
      // (1.0.38, launch QA 10/22) keyboard focus on the bar over Home's photo: the ring was near-black on the dark picture
      'html.gfx-f3:has(.gfx-hero-sec) .gfx-nav.gfx-top :focus-visible{outline-color:#fff!important}' +
      // (1.0.42, overnight audit 10/23) the bar never hides what has keyboard focus (:focus-visible, so a mouse click never pins it): tabbing back to it at the page's end (the bar
      // slid away, or the fox flown to the footer) left focus on an invisible logo or link; while focus is in it, it is all there
      'html.gfx-f3 .gfx-nav:has(:focus-visible){--gfx-away:0!important}@media (max-width:767px){html.gfx-f3 .gfx-nav:has(:focus-visible){transform:none!important}}@media (min-width:992px){html.gfx-f3 .gfx-nav:has(:focus-visible) .navigation-wrap>*{opacity:1!important;transform:none!important}}html.gfx-f3 .gfx-nav:has(:focus-visible) .logo-link{opacity:1!important;visibility:visible!important;pointer-events:auto!important}' +
      'html body :is(.gfx-cta-sec .footer-logo-subtle,[data-o~="ow-close-fox"],[data-o~="gfc-fox"],.gfc-fox){height:min(64vh,744px)!important}' +
      'html body :is(.gfx-cta-sec,[data-o~="ow-close"],.gfc-on):has(:is(.footer-logo-subtle,[data-o~="ow-close-fox"],[data-o~="gfc-fox"],.gfc-fox)){overflow-y:clip!important}' +
      // (1.0.19, founder 10/20: "on iPhone the footer's grey lines push up against the logo, Navigate and the left column")
      // the column rules divide columns standing side by side; stacked on a phone they ran down the text's own edge
      '@media (max-width:767px){html.gfx-f3 .gfx-fi-rule{display:none!important}}' +
      // (1.0.20, founder 10/20: "slightly lagging on a Mac") the designer's frosted menu re-blurred the page under the bar on
      // every scrolled frame; past the top the bar is solid and the blur showed nothing. It stays where it shows: the top.
      'html.gfx-f3 .gfx-nav:not(.gfx-top) :is(.navigation_items,.w-nav-menu,.button){-webkit-backdrop-filter:none!important;backdrop-filter:none!important}' +
      // (1.0.24, final sweeps) phones and tablets: a heading never ends on one word alone ("introductions within / weeks.",
      // "the whole / market."); the browser evens a heading's lines (within each designed line where a heading is built of
      // them). "pretty" left these as they were. Desktop breaks are the approved ones, untouched
      '@media (max-width:991px){html.gfx-f3 :is(h1,h2,h3,h4,[data-o~="gi-tile-t"],[data-o~="gi-sec-h"]){text-wrap:balance}}' +
      // (1.0.25) article card titles and question lines at every width ("...Origination / Partner", "the same / sector?" at
      // 992-1024): balancing never adds a line, so no card or row changes height
      'html.gfx-f3 :is([data-o~="gi-tile-t"],[data-o~="gi-card-t"],[data-o~="ow-acc-h"]){text-wrap:balance}' +
      // (1.0.24) phone tap zones: the person pages' text links (36 and 29px tall) and an article's note numbers (23px)
      // answer a thumb across 44px or more; nothing moves, an invisible margin takes the touch
      '@media (max-width:767px){html.gfx-f3 :is(.gfx-pg-tp-u,sup>a){position:relative}html.gfx-f3 :is(.gfx-pg-tp-u,sup>a)::after{content:"";position:absolute;inset:-9px -8px}}' +
      // (1.0.42, overnight audit 10/23) print: a reader printing an article, the privacy policy or a bio got the bar and the
      // footer's contact block on every sheet, dark panels, and text still waiting for its scroll reveal (most of a bio, an
      // article's section heading). On paper everything is shown at rest in ink on white; the screen is untouched.
      '@media print{@page{margin:14mm 14mm 16mm}html.gfx-f3,html.gfx-f3 body{background:#fff!important;color:#111!important;height:auto!important;overflow:visible!important}' +
      'html.gfx-f3 body *{color:#111!important;-webkit-text-fill-color:#111!important;text-shadow:none!important;box-shadow:none!important;border-color:#c8c8c8!important}' +
      'html.gfx-f3 body *:not(img,svg,svg *,video,canvas),html.gfx-f3 body *::before,html.gfx-f3 body *::after{background-color:transparent!important}html.gfx-f3 body .gfx-pg-t2-p-w{background-image:none!important}' +
      // a filled button prints as an outlined one; a team card prints its photo with the name under it, not over it
      'html.gfx-f3:not(#gfx-pa):not(#gfx-pb):not(#gfx-pc) body :is(a,button):is([data-o~="gfc-btn"],.button,.w-button,[class*="-btn"]){background:transparent!important;color:#111!important;-webkit-text-fill-color:#111!important;border:1px solid #111!important}' +
      'html.gfx-f3 body .gfx-pg-t3-card{display:block!important;height:auto!important;min-height:0!important}html.gfx-f3 body .gfx-pg-t2-p-pic{position:relative!important;inset:auto!important;height:auto!important;aspect-ratio:5/8}html.gfx-f3 body .gfx-pg-t2-p-w{position:static!important;padding-top:10px!important}' +
      'html.gfx-f3 body :is(.gfx-skip,.gfx-nav,.navigation_wrapper,.preloader,.gfx-intro-mark,.gfx-fly,.gfx-ftg-host>.footer_section_wrapper.gfx-foot,.footer_section_wrapper,video,.gfx-pull-mark,.gfx-pg-gfc-fox,[data-o~="gi-toc-m"],[data-o~="gi-aside"]){display:none!important}' +
      'html.gfx-f3 .gfx-ftg-host{min-height:0!important;padding-bottom:0!important;margin-bottom:0!important}html.gfx-f3 :is(.gfx-pg-tp-facts,.gfx-pg-gi-aside-in,.gfx-pg-pv-toc){position:static!important}' +
      'html.gfx-f3 body :is(p,h1,h2,h3,h4,h5,h6,blockquote,figcaption,figure,li,ul,ol,dl,dt,dd,img,picture,[data-o],[data-gfx-reveal],.team_member_description,.hero_buttons,.button_wrapper,.gfx-ink-card,.gfx-ink-r,.gfx-marq,.gfx-mk-steps):not(.gfx-mk-cap,.gfx-mk-cap *,.gfx-mk-sr,.gfx-fly *){opacity:1!important}' +
      'html.gfx-f3 body :is(p,h1,h2,h3,h4,h5,h6,blockquote,figcaption,li,dt,dd,[data-gfx-reveal]):not([data-o~="gi-plate-in"] *,.gfx-mk-cap,.gfx-mk-cap *){transform:none!important;translate:none!important;scale:none!important}' +
      'html.gfx-f3 body :is(img,picture,[data-o~="iv-case-bg"]){clip-path:none!important}html.gfx-f3:not(#gfx-pa) body [data-o~="gi-plate-hero"]{height:auto!important;aspect-ratio:16/10!important}' +
      'html.gfx-f3:not(#gfx-pa) body [data-o~="ow-hero-pic"]{position:relative!important;inset:auto!important;grid-row:auto!important;grid-column:1/-1!important;margin-inline:0!important;clip-path:none!important;width:100%!important;height:auto!important;aspect-ratio:3/2;margin-top:8mm!important}' +
      'html.gfx-f3 :is(h1,h2,h3,h4){break-after:avoid}html.gfx-f3 :is(img,figure,blockquote,li,dt,dd){break-inside:avoid}' +
      // a paragraph split into screen lines runs as one paragraph again; icon links and addresses print no URL after them
      'html.gfx-f3 p :is(.tp-sl-mask,.tp-sl){display:inline!important}html.gfx-f3 a:is([href^="mailto:"],[aria-label],:has(svg,img))::after{content:none!important}' +
      'html.gfx-f3 body::after{content:"Grey Fox Partners  \\00B7  greyfoxpartners.com  \\00B7  inquiries@greyfoxpartners.com\\AGrey Fox Partners represents buyers. Nothing on this site is an offer or advice.";white-space:pre-line;display:block;margin-top:12mm;padding-top:4mm;border-top:1px solid #c8c8c8;font:11px/1.4 "DM Sans",sans-serif;color:#555!important;-webkit-text-fill-color:#555!important}}'; (D.head || H).appendChild(st); }
    let showing = true, upFrom = null, prevY = null;
    gsap.set(bar, { '--gfx-away': 0 });
    const setShown = want => {
      if (want === showing) return; showing = want;
      gsap.to(bar, { '--gfx-away': want ? 0 : 1, duration: 0.45, ease: barEase, overwrite: true });
      bar.classList.toggle('gfx-away', !want); H.classList.toggle('gfx-bar-away', !want);
    };
    const kbFocus = () => { const a = D.activeElement; if (!a || !bar.contains(a)) return false; try { return a.matches(':focus-visible'); } catch (e) { return true; } };
    bar.addEventListener('focusin', () => { if (kbFocus()) setShown(true); });
    const past = ST.create({ start: () => W.innerHeight * 0.5, end: 'max',
      onUpdate: s => {
        const y = s.scroll(), py = prevY == null ? y : prevY; prevY = y;
        if (s.direction > 0) upFrom = null; else if (upFrom == null) upFrom = py;
        const up = s.direction < 0 && upFrom != null && upFrom - y >= 6;
        // (1.0.42, overnight audit 10/23) only keyboard focus holds the bar: a tap on the phone menu left the button focused
        // and the bar stayed down for the rest of the page once the menu closed
        setShown(up || (showing && s.direction < 0) || s.progress < 0.002 || kbFocus());
      },
      onEnter: () => navLook(false),
      onLeaveBack: () => { navLook(true); setShown(true); } });
    navLook(!past.isActive && W.scrollY < W.innerHeight * 0.5);
    if (past.isActive) setShown(true);
    /* (1.0.18, founder 10/20: "if I scroll down and hit Next, the bar goes away" - Shivam -> Tony / Burke) a page shown with
       the bar tucked away while the reader is in its first half screen (a page restored from the browser's cache with the
       state it left in, or a scroll event that reached the new page): the bar is never away there. Checked on show, on
       load and once settled. */
    const barHome = () => { if (scrollNow() < W.innerHeight * 0.5) { navLook(true); upFrom = null; prevY = null; if (!showing) setShown(true); else { gsap.set(bar, { '--gfx-away': 0 }); bar.classList.remove('gfx-away'); H.classList.remove('gfx-bar-away'); } } };
    W.addEventListener('pageshow', () => setTimeout(barHome, 60)); W.addEventListener('load', () => setTimeout(barHome, 300)); setTimeout(barHome, 1200);
  }
  function foxWatch(M) {
    M = M || [28, 36, true];   // [in, out, look ahead]: Home keeps its own tighter zone (sbx.js: 2 / 6 px, no look ahead)
    const bar = $('.gfx-nav'), link = bar && $('.logo-link', bar); if (!link) return;
    const CHROME = '.navigation_wrapper, .gfx-skip, .preloader, .gfx-ftg-fly, .gfx-fly';
    let away = false, since = 0, rq = 0, last = -1, lastY = W.scrollY;
    const shownEl = el => { for (let n = el; n && n !== D.body; n = n.parentElement) { const cs = getComputedStyle(n); if (cs.visibility === 'hidden' || +cs.opacity < 0.05) return false; } return true; };
    const hit = (q, z) => q.right > z.left && q.left < z.right && q.bottom > z.top && q.top < z.bottom;
    /* (1.0.27, smoothness lab 10/21: with the CPU slowed to a laptop's or a phone's, this check was most of a scroll's
       work - up to 30 "what is here?" probes a frame, each making the browser settle the page first; on a mid-range
       phone 5-12 s of a 30 s scroll) The browser itself now keeps the list of words and pictures inside the fox's
       zone (an IntersectionObserver whose root is the zone, at its widest look-ahead). With nothing there the check
       costs nothing; with something there only those lines are measured, and one probe at the line confirms it is
       the thing on top (not covered by a picture, a room or the waiting footer). Runs once per 50 ms, looking ahead
       by the distance the page moved in that time. Without IntersectionObserver: the probe grid below. */
    const MEDIA = /^(IMG|VIDEO|CANVAS|svg)$/;
    const ownText = el => { for (let n = el.firstChild; n; n = n.nextSibling) if (n.nodeType === 3 && /\S/.test(n.data)) return true; return false; };
    const outerSvg = e => { while (e && e.ownerSVGElement) e = e.ownerSVGElement; return e; };
    const wants = el => MEDIA.test(el.tagName) ? !(el.tagName === 'svg' && el.ownerSVGElement) : ownText(el);
    const CAND = new Set(), ALL = [], seenEl = new WeakSet(); let io = null, ioZ = 0;
    const watchEl = el => { if (seenEl.has(el) || !wants(el)) return; seenEl.add(el); ALL.push(el); if (io) io.observe(el); };
    // the page is walked a few elements at a time in idle moments (never one long task on a slow phone); the bar and
    // the other chrome are never watched
    const pend = []; let pendT = 0;
    const drain = dl => { const t0 = performance.now(); while (pend.length && (dl && dl.timeRemaining ? dl.timeRemaining() > 2 : performance.now() - t0 < 6)) { const n = pend.pop(); if (!n || n.nodeType !== 1 || !n.isConnected || n.matches(CHROME) || /^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE|IFRAME)$/.test(n.tagName)) continue; watchEl(n); if (n.tagName !== 'svg') for (let c = n.lastElementChild; c; c = c.previousElementSibling) pend.push(c); } pendT = pend.length ? later(drain) : 0; };
    const later = f => W.requestIdleCallback ? W.requestIdleCallback(f, { timeout: 400 }) : setTimeout(f, 60);
    const queue = n => { if (!n || n.nodeType !== 1 || (n !== D.body && n.closest(CHROME))) return; pend.push(n); if (!pendT) pendT = later(drain); };
    const zoneIO = () => {
      if (!('IntersectionObserver' in W)) return;
      const im = $$('img', link).filter(i => i.offsetWidth)[0] || link, r = im.getBoundingClientRect(), vw = W.innerWidth, vh = W.innerHeight;
      const Z = Math.max(M[1], M[0] + (M[2] ? 180 : 48)) + 2, t = Math.max(0, r.top - Z), l = Math.max(0, r.left - Z), b = Math.min(vh, r.bottom + Z), rt = Math.min(vw, r.right + Z);
      const key = [t, l, b, rt].map(Math.round).join(); if (io && key === ioZ) return; ioZ = key;
      if (io) io.disconnect(); CAND.clear();
      io = new IntersectionObserver(es => { es.forEach(e => { if (e.isIntersecting) CAND.add(e.target); else CAND.delete(e.target); }); ask(); },
        { rootMargin: `${-Math.round(t)}px ${-Math.round(vw - rt)}px ${-Math.round(vh - b)}px ${-Math.round(l)}px` });
      for (let i = ALL.length - 1; i >= 0; i--) { if (ALL[i].isConnected) io.observe(ALL[i]); else ALL.splice(i, 1); }
    };
    const onTop = (e, q, z) => {
      const x = clamp((Math.max(q.left, z.left) + Math.min(q.right, z.right)) / 2, 0, W.innerWidth - 1), y = clamp((Math.max(q.top, z.top) + Math.min(q.bottom, z.bottom)) / 2, 0, W.innerHeight - 1);
      let top = D.elementsFromPoint(x, y).filter(el => !el.closest(CHROME))[0]; if (top instanceof SVGElement) top = outerSvg(top) || top;
      return !!top && (top === e || e.contains(top));
    };
    const nearIO = (r, m) => {
      if (!CAND.size) return false;
      const z = { left: r.left - m, top: r.top - m, right: r.right + m, bottom: r.bottom + m };
      for (const e of CAND) {
        if (!e.isConnected) { CAND.delete(e); continue; }
        if (MEDIA.test(e.tagName)) { const qi = e.getBoundingClientRect(); if (qi.width < W.innerWidth * 0.6 && hit(qi, z) && shownEl(e) && onTop(e, qi, z)) return true; continue; }
        for (let nd = e.firstChild; nd; nd = nd.nextSibling) { if (nd.nodeType !== 3 || !/\S/.test(nd.data)) continue; const rg = D.createRange(); rg.selectNodeContents(nd); const qs = rg.getClientRects(); for (let q = 0; q < qs.length; q++) if (hit(qs[q], z) && shownEl(e) && onTop(e, qs[q], z)) return true; }
      }
      return false;
    };
    const nearGrid = (r, m) => {
      const z = { left: r.left - m, top: r.top - m, right: r.right + m, bottom: r.bottom + m }, seen = [];
      const nj = Math.max(3, Math.min(9, Math.ceil((z.bottom - z.top) / 24)));
      for (let i = 0; i <= 2; i++) for (let j = 0; j <= nj; j++) {
        const x = clamp(z.left + (z.right - z.left) * i / 2, 0, W.innerWidth - 1), y = clamp(z.top + (z.bottom - z.top) * j / nj, 0, W.innerHeight - 1);
        let e = D.elementsFromPoint(x, y).filter(el => !el.closest(CHROME))[0];
        if (e && e instanceof SVGElement && e.ownerSVGElement) e = e.closest('svg') ? (function f(s) { return s.ownerSVGElement ? f(s.ownerSVGElement) : s; })(e.closest('svg')) : e;
        if (!e || seen.indexOf(e) >= 0) continue; seen.push(e);
        if (/^(IMG|VIDEO|CANVAS|svg)$/.test(e.tagName)) { const qi = e.getBoundingClientRect(); if (qi.width < W.innerWidth * 0.6 && hit(qi, z) && shownEl(e)) return true; continue; }
        for (let k = 0; k < e.childNodes.length; k++) { const nd = e.childNodes[k]; if (nd.nodeType !== 3 || !nd.textContent.trim()) continue; const rg = D.createRange(); rg.selectNodeContents(nd); const qs = rg.getClientRects(); for (let q = 0; q < qs.length; q++) if (hit(qs[q], z) && shownEl(e)) return true; }
      }
      return false;
    };
    const near = (r, m) => (io ? nearIO(r, m) : nearGrid(r, m));
    const GAP = 50; let ran = 0, tmo = 0;
    const tick = () => {
      rq = 0; const now = performance.now(); ran = now;
      const dy = Math.abs(W.scrollY - lastY); lastY = W.scrollY; const ahead = M[0] + (M[2] ? Math.min(180, dy * 1.5) : Math.min(48, dy));
      // nothing in the zone at all: no need even to read where the fox is
      const empty = !!io && !CAND.size; let r = null;
      const isNear = m => { if (empty) return false; if (!r) { const im = $$('img', link).filter(i => i.offsetWidth)[0] || link; r = im.getBoundingClientRect(); } return near(r, m); };
      if (!away) { if (isNear(ahead)) { away = true; bar.classList.add('gfx-fox-away'); } }
      else if (isNear(M[1])) since = 0;
      else if (!since) { since = now; ask(); }
      else if (now - since > 350) { away = false; since = 0; bar.classList.remove('gfx-fox-away'); }
      else ask();
    };
    // (the reads run just after a frame is drawn: postFrame)
    const ask = () => { if (rq || tmo) return; const wait = GAP - (performance.now() - ran); if (wait > 0) tmo = setTimeout(() => { tmo = 0; rq = 1; postFrame(tick); }, wait); else { rq = 1; postFrame(tick); } };
    addEventListener('scroll', ask, { passive: true });
    let rzT = 0; addEventListener('resize', () => { clearTimeout(rzT); rzT = setTimeout(() => { zoneIO(); ask(); }, 150); });
    setInterval(() => { const y = W.scrollY; if (y !== last) { last = y; ask(); } }, 250);
    // the words and pictures to watch: everything now (in idle slices), and whatever is added later (split headlines,
    // the footer, late rooms)
    if ('IntersectionObserver' in W) {
      zoneIO(); queue(D.body);
      if ('MutationObserver' in W) new MutationObserver(ms => ms.forEach(mu => { if (mu.type !== 'childList') return; mu.addedNodes.forEach(n => queue(n.nodeType === 1 ? n : mu.target)); })).observe(D.body, { childList: true, subtree: true });
      if (D.fonts && D.fonts.ready) D.fonts.ready.then(() => { zoneIO(); ask(); });
    }
    ask();
  }

  /* ========================= 8 · footer I (foot.js + foot-d.js + foot-gx.js + foot-i.js) =========================
     The footer's markup is written here from the page's own footer (the "gfx Footer" component: its links, addresses,
     phone, copyright and notice), so the component stays shared and untouched; without the script the component shows.
     Columns: the lockup (the gold fox head + the wordmark, centred), Navigate, Offices (live clocks whose colons keep
     the seconds while the footer is seen), Write us + "Start a conversation". On a wide screen (≥992 × 680, footer ≤ 80 %
     of the screen) it waits fixed beneath the page; the close lifts off it; the bar's fox flies home into the lockup
     (never two foxes in view); the lights, rules, columns, base and bar arrive as one settled block (0.9 s). Elsewhere
     it arrives in the flow; reduced motion: still. */
  const FOX = 'https://cdn.prod.website-files.com/67c0e116387e8248a0d7e10a/6ace72f97fb1cddac2a0305c_gfx-logo-fox-gold.svg';
  const LOGO = 'https://cdn.prod.website-files.com/67c0e116387e8248a0d7e10a/6aac4f63ec128fc57da36e73_logo-full.png';
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  let footApi = null;
  function footBuild() {
    const foot = $('.footer_section_wrapper.gfx-foot') || $('.footer_section_wrapper'); if (!foot || foot.__gfxFi) return null;
    foot.__gfxFi = true;
    const txt = e => (e ? e.textContent.replace(/\s+/g, ' ').trim() : '');
    const cols = $$('.footer_item_wrapper', foot);
    const navA = cols[0] ? $$('a[href]', cols[0]) : [];
    const data = {
      nav: navA.length ? navA.map(a => [txt(a), a.getAttribute('href')]) : [['Business Owners', '/business-owners'], ['Investors', '/investors'], ['Team', '#team'], ['Insights', 'https://www.greyfoxpartners.com/insights'], ['Contact', '/contact']],
      mail: $$('a[href^="mailto:"]', foot).map(a => a.getAttribute('href').slice(7)),
      tel: (() => { const t = $('a[href^="tel:"]', foot); return t ? [txt(t), t.getAttribute('href')] : ['(646) 946-6641', 'tel:+16469466641']; })(),
      offices: [{ full: 'New York, NY', tz: 'America/New_York' }, { full: 'Austin, TX', tz: 'America/Chicago' }],
      legal: $$('.tos_pp_wrapper a, .gfx-ft-legal a', foot).map(a => [txt(a), a.getAttribute('href') || '#']),
      copy: txt($('.gfx-foot-cap, .footer_caption_grid > :first-child', foot)) || ('© ' + new Date().getFullYear() + ' Grey Fox Partners'),
      notice: txt($('.gfx-notice', foot)) || 'Grey Fox Partners represents buyers. Nothing on this site is an offer or advice.'
    };
    // (1.0.28, founder 10/22) one public address for owners and investors alike
    if (!data.mail.length) data.mail = ['inquiries@greyfoxpartners.com'];
    // (1.0.28) the footer's year follows the clock (it was typed "2026")
    data.copy = data.copy.split(/\b20\d\d\b/).join(String(new Date().getFullYear()));
    // (1.0.26, founder 10/21: "remove Terms") no Terms page: the legal row carries the Privacy Policy alone
    data.legal = data.legal.filter(([t]) => !/^terms/i.test(t));
    if (!data.legal.length) data.legal = [['Privacy Policy', '#']];
    const contact = (data.nav.find(([t]) => /contact/i.test(t)) || [0, '/contact'])[1];
    const clock = tz => `<span class="gfx-fi-time" data-gfx-clock="${tz}" aria-hidden="true"><span class="gfx-fi-h"></span><span class="gfx-fi-colon">:</span><span class="gfx-fi-m"></span><span class="gfx-fi-ap"></span></span>`;
    const col = (key, inner) => `<div class="gfx-fi-col gfx-fi-${key}"><i class="gfx-fi-rule" aria-hidden="true"></i><div class="gfx-fi-in">${inner}</div></div>`;
    // (core 1.0.8) the lockup is the way home, as the bar's fox is (the founder kept tapping it)
    const lockup = `<a class="gfx-fi-lockup" href="/" aria-label="Grey Fox Partners, home"><img class="gfx-fi-head" src="${FOX}" alt="" width="41" height="40" decoding="async"><img class="gfx-fi-logo gfx-fi-word" src="${LOGO}" alt="" width="600" height="198" decoding="async"></a>`;
    const nav = `<h2 class="gfx-fi-label" id="gfx-fi-l-nav">Navigate</h2><nav aria-labelledby="gfx-fi-l-nav"><ul class="gfx-fi-list gfx-fi-rows">${data.nav.map(([t, h]) => `<li><a class="gfx-fi-link" href="${esc(h)}">${esc(t)}</a></li>`).join('')}</ul></nav>`;
    const offices = `<h2 class="gfx-fi-label">Offices</h2><ul class="gfx-fi-list gfx-fi-rows gfx-fi-offices">${data.offices.map(o => `<li><span class="gfx-fi-city">${o.full}</span>${clock(o.tz)}</li>`).join('')}</ul>`;
    const write = `<h2 class="gfx-fi-label">Write us</h2><address class="gfx-fi-contact"><ul class="gfx-fi-list gfx-fi-rows">${data.mail.map(m => `<li><a class="gfx-fi-link" href="mailto:${esc(m)}">${esc(m)}</a></li>`).join('')}<li><a class="gfx-fi-link" href="${esc(data.tel[1])}">${esc(data.tel[0])}</a></li></ul></address>` +
      `<p class="gfx-fi-actrow"><a class="gfx-fi-act" href="${esc(contact)}"><span class="gfx-fi-act-t">Start a <span class="gfx-fi-nw">conversation</span></span></a></p>`;
    foot.classList.add('gfx-fi-on'); foot.setAttribute('role', 'contentinfo');
    foot.innerHTML = `<div class="gfx-fi-layer" aria-hidden="true"><i class="gfx-fi-lip"></i><div class="gfx-fi-lights"><i class="gfx-fi-bay"></i><i class="gfx-fi-bay"></i><i class="gfx-fi-bay"></i><i class="gfx-fi-bay"></i></div></div>` +
      `<div class="gfx-fi-wrap"><div class="gfx-fi"><div class="gfx-fi-grid">${col('brand', lockup)}${col('navc', nav)}${col('offices', offices)}${col('write', write)}</div>` +
      `<i class="gfx-fi-base" aria-hidden="true"></i><div class="gfx-fi-bar"><p class="gfx-fi-small gfx-fi-copy">${esc(data.copy)}</p><p class="gfx-fi-small gfx-fi-notice">${esc(data.notice)}</p>` +
      `<ul class="gfx-fi-list gfx-fi-legal">${data.legal.map(([t, h]) => `<li><a class="gfx-fi-link" href="${esc(h)}">${esc(t)}</a></li>`).join('')}</ul></div></div></div>`;
    // the clocks: tick on the minute; the colons keep the seconds only while the footer is seen
    const fmts = {};
    const now = tz => { const f = fmts[tz] || (fmts[tz] = new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: 'numeric', minute: '2-digit', hour12: true })); const p = f.formatToParts(new Date()), g = t => (p.find(x => x.type === t) || {}).value || ''; return { h: g('hour'), m: g('minute'), ap: ' ' + g('dayPeriod').toUpperCase() }; };
    const tick = () => $$('[data-gfx-clock]', foot).forEach(el => { const t = now(el.getAttribute('data-gfx-clock')); [['.gfx-fi-h', t.h], ['.gfx-fi-m', t.m], ['.gfx-fi-ap', t.ap]].forEach(([s, v]) => { const n = $(s, el); if (n && n.textContent !== v) n.textContent = v; }); });
    const aim = () => { tick(); setTimeout(aim, 60000 - (Date.now() % 60000) + 30); };
    aim(); D.addEventListener('visibilitychange', () => { if (!D.hidden) tick(); });
    H.style.setProperty('--gfx-sec', -(Date.now() % 1000) + 'ms');
    if ('IntersectionObserver' in W) new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) H.style.setProperty('--gfx-sec', -(Date.now() % 1000) + 'ms'); foot.classList.toggle('gfx-fi-live', e.isIntersecting); })).observe(foot);
    else foot.classList.add('gfx-fi-live');
    foot.parentElement.classList.add('gfx-ftg-host');
    return (footApi = { foot });
  }
  function footInit(o) {
    const F = footApi; if (!F) return;
    const foot = F.foot, host = foot.parentElement, q = s => $$(s, foot);
    const head = $('.gfx-fi-head', foot), word = $('.gfx-fi-word', foot), lockup = $('.gfx-fi-lockup', foot), lip = $('.gfx-fi-lip', foot);
    const close = o && o.close ? $(o.close) : null; if (close) close.classList.add('gfx-ftg-close');
    const still = () => { H.classList.remove('gfx-ftg-reveal'); H.setAttribute('data-gfx-foot', 'still'); };
    if (REDUCE || !gsap) { still(); return; }
    const S = G.SETTLE;
    const wide = W.matchMedia('(min-width: 992px) and (min-height: 680px)');
    const maxY = () => ST.maxScroll(W);
    const film = reveal => { const tl = gsap.timeline({ paused: true }); const all = q(reveal ? '.gfx-fi-navc .gfx-fi-in, .gfx-fi-offices .gfx-fi-in, .gfx-fi-write .gfx-fi-in' : '.gfx-fi-in');
      tl.fromTo(q('.gfx-fi-bay'), { opacity: 0 }, { opacity: 1, duration: 0.9, ease: 'power2.out' }, 0)
        .fromTo(q('.gfx-fi-rule'), { scaleY: 0 }, { scaleY: 1, duration: 0.9, ease: S }, 0)
        .fromTo(all, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.9, ease: S }, 0)
        .fromTo(q('.gfx-fi-base'), { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: S }, 0)
        .fromTo(q('.gfx-fi-bar > *'), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.9, ease: S }, 0);
      return tl; };
    let mode = null, tl = null, st = null, st2 = null, fly = null, state = 'bar', flight = null, wordTw = null, H0 = 0, lockR = null, lastNav = null, prog = 0, ro = null, raf = 0, hostTop = 0, lockIO = null;
    const navRect = () => {
      const el = $$('.gfx-nav .logo__navbar').find(i => { const r = i.getBoundingClientRect(); if (!r.width) return false; const wr = i.closest('.navigation_wrapper'); if (!wr) return true; const cs = getComputedStyle(wr); return cs.visibility !== 'hidden' && +cs.opacity > 0.5; });
      if (el) { const r = el.getBoundingClientRect(); lastNav = { left: r.left, top: r.top, width: r.width, height: r.height }; }
      return lastNav || { left: 50, top: 17, width: 40, height: 40 };
    };
    const makeFly = () => { if (fly) return; fly = D.createElement('div'); fly.className = 'gfx-ftg-fly'; fly.setAttribute('aria-hidden', 'true'); const i = new Image(); i.alt = ''; i.src = FOX; fly.appendChild(i); D.body.appendChild(fly); };
    const flyAt = (r, scale) => { const n = navRect(); Object.assign(fly.style, { width: n.width + 'px', height: n.height + 'px', visibility: 'visible' }); gsap.set(fly, { x: r.left, y: r.top, scale }); };
    const stopFlight = () => { if (flight) flight.kill(); flight = null; };
    const navShown = () => { const wr = $('.gfx-nav'); if (!wr) return false; const cs = getComputedStyle(wr); if (cs.visibility === 'hidden' || +cs.opacity <= 0.5 || wr.getBoundingClientRect().bottom <= 0) return false; if (wr.classList.contains('gfx-away') || wr.classList.contains('gfx-fox-away')) return false; return wr.getBoundingClientRect().top > -20; };
    const showWord = on => { if (wordTw) wordTw.kill(); wordTw = on ? gsap.fromTo(word, { autoAlpha: 0, x: -8 }, { autoAlpha: 1, x: 0, duration: G.body.duration, ease: S }) : gsap.to(word, { autoAlpha: 0, x: -8, duration: LEAVE.duration, ease: LEAVE.ease }); };
    const setHome = () => { stopFlight(); if (wordTw) wordTw.kill(); state = 'home'; H.classList.remove('gfx-ftg-flying'); H.classList.add('gfx-ftg-home'); if (fly) fly.style.visibility = 'hidden'; gsap.set(word, { autoAlpha: 1, x: 0 }); if (tl) tl.timeScale(1).reversed(false).progress(1).pause(); };
    const setBar = () => { stopFlight(); if (wordTw) wordTw.kill(); state = 'bar'; H.classList.remove('gfx-ftg-flying', 'gfx-ftg-home'); if (fly) fly.style.visibility = 'hidden'; gsap.set(word, { autoAlpha: 0, x: -8 }); if (tl) tl.timeScale(1).reversed(false).pause(0); };
    const goHome = () => {
      makeFly(); state = 'out';
      const n = navRect(), b = head.getBoundingClientRect();
      const fresh = !flight; if (!flight) flyAt(n, 1); else stopFlight();
      H.classList.add('gfx-ftg-flying');
      if (fresh) { gsap.killTweensOf(fly, 'opacity'); if (navShown()) gsap.set(fly, { opacity: 1 }); else gsap.fromTo(fly, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out' }); }
      flight = gsap.timeline({ onComplete: () => { flight = null; state = 'home'; H.classList.add('gfx-ftg-home'); H.classList.remove('gfx-ftg-flying'); fly.style.visibility = 'hidden'; showWord(true); if (tl) { tl.timeScale(1); if (tl.progress() < 1) tl.play(); } } })
        .to(fly, { x: b.left, y: b.top, duration: 1.3, ease: G.DRAW }, 0)
        .to(fly, { scale: b.width / n.width, duration: 1.3, ease: G.DRAW }, 0);
    };
    const goBar = () => {
      makeFly(); state = 'back';
      const n = navRect();
      if (H.classList.contains('gfx-ftg-home')) { const b = head.getBoundingClientRect(); flyAt(b, b.width / n.width); H.classList.add('gfx-ftg-flying'); H.classList.remove('gfx-ftg-home'); }
      stopFlight(); showWord(false); gsap.killTweensOf(fly, 'opacity'); gsap.set(fly, { opacity: 1 });
      if (tl && tl.progress() > 0) tl.timeScale(2.2).reverse();
      flight = gsap.timeline({ onUpdate: function () { if (this.progress() <= 0.72) return; const sh = navShown();
        if (!sh && !fly._out) { fly._out = true; gsap.to(fly, { opacity: 0, duration: 0.3, ease: 'power2.in', overwrite: 'auto' }); }
        else if (sh && fly._out) { fly._out = false; gsap.to(fly, { opacity: 1, duration: 0.18, ease: 'power2.out', overwrite: 'auto' }); } }, onComplete: () => {
        fly._out = false; flight = null; state = 'bar'; H.classList.remove('gfx-ftg-flying'); fly.style.visibility = 'hidden'; gsap.set(fly, { opacity: 1 });
        if (tl) { tl.timeScale(1); if (prog <= 0.001) tl.pause(0); } } }).to(fly, { x: n.left, y: n.top, scale: 1, duration: 1.2, ease: G.DRAW }, 0.1);
    };
    let CH = 0, K = -1;
    /* (1.0.30, founder 10/22 "you can see the cuts in the footer. This needs to be seamless") the close's turn is a crossfade
       in time that can start late, so a quick reader uncovered the black footer while the close was still grey. The footer
       now wears the field's colour frame by frame (close and footer are one surface), and its columns wait for a dark field. */
    /* (1.0.33) phones (the footer in the flow): the see-through footer's columns wait for a dark field too, as the reveal's do
       (a jump to the page's end before the turn finished showed its white type on paper) */
    const fiEl = $('.gfx-fi', foot);
    const flowTone = () => { if (!fiEl) return; const on = mode === 'flow'; fiEl.style.transition = on ? 'opacity .35s cubic-bezier(.16, 1, .3, 1)' : ''; fiEl.style.opacity = on && H.classList.contains('gfx-tone-light') ? '0' : ''; };
    footOpen = () => (mode === 'reveal' ? prog > 0.001 : foot.getBoundingClientRect().top < W.innerHeight);
    const openNow = () => H.classList.toggle('gfx-ftg-open', prog >= 0.34 && !H.classList.contains('gfx-tone-light'));
    // (1.0.31) see-through as the close is: the page's background shows behind its columns
    if (fieldRooms.some(o => o.foot)) { foot.style.setProperty('background-color', 'transparent', 'important'); /* (1.0.32) and its wrapper: the inner pages' footer wrapper (gfx-ow-foot) carried its own near-black, a band below the close mid-turn */ host.style.setProperty('background-color', 'transparent', 'important'); footTone = () => { if (mode === 'reveal') openNow(); else flowTone(); }; }
    const inner = () => q(':scope > .gfx-fi-wrap, :scope > .gfx-fi-layer');
    const cut = k => { if (k === K) return; K = k; foot.style.transform = k ? `translate3d(0,${k}px,0)` : ''; inner().forEach(e => { e.style.transform = k ? `translate3d(0,${-k}px,0)` : ''; }); };
    // (1.0.31) CH stays 0 on every page: with a see-through close the waiting footer must start at the close's last line, as
    // it already did on the person pages (no close)
    const measureF = () => { CH = 0; cut(0); H0 = foot.offsetHeight; host.style.setProperty('--gfx-ftg-h', H0 + 'px'); const r = lockup.getBoundingClientRect(), f = foot.getBoundingClientRect(); lockR = { localBottom: r.bottom - f.top }; hostTop = host.getBoundingClientRect().top + W.scrollY; };
    const step = (p, instant) => {
      prog = p;
      if (p > 0.001) hurryTurn();
      const covered = p <= 0.001;
      H.classList.toggle('gfx-ftg-covered', covered);
      // (1.0.29, founder 10/22 "why is the footer dead here?") the columns settle once a third of the footer is uncovered (was
      // 97%: a reader who stopped short of the very end saw only the black and the faint foxes); (1.0.30) and the field is dark
      openNow();
      const local = H0 * (1 - p);
      /* (1.0.21, founder 10/20: "when I scroll on my bio down to Tony, his name gets covered") a page with no close (the
         person pages) has nothing opaque over the waiting footer, so it painted over the way on. Its top now meets the
         page's end there too (CH is 0 without a close). */
      cut(Math.max(0, Math.round(H0 * (1 - p) - CH)));
      const home = local <= lockR.localBottom + 2, away = local > lockR.localBottom + 72;
      if (instant) { if (state === 'out' || state === 'home' ? !away : home) setHome(); else setBar(); }
      else if (home && (state === 'bar' || state === 'back')) goHome();
      else if (away && (state === 'home' || state === 'out')) goBar();
      if (covered && state === 'bar' && tl && tl.progress() > 0) tl.pause(0);
      if (lip) { const op = clamp(p / 0.12, 0, 1) * (1 - clamp((p - 0.8) / 0.2, 0, 1)); lip.style.transform = `translate3d(0,${Math.round(local)}px,0)`; lip.style.opacity = op.toFixed(3); }
    };
    const onFocus = () => {
      if (mode === 'reveal' && prog < 0.99) { const y = maxY(); if (shared) shared.scrollTo(y, { immediate: true, force: true }); else W.scrollTo(0, y); ST.update(); if (prog < 0.99) step(1, true); setHome(); }
      if (tl && tl.progress() < 1) tl.progress(1);
    };
    const teardown = () => {
      if (fiEl) { fiEl.style.opacity = ''; fiEl.style.transition = ''; }
      if (st) st.kill(); st = null; if (st2) st2.kill(); st2 = null; if (tl) tl.kill(); tl = null; stopFlight(); if (wordTw) wordTw.kill(); if (ro) ro.disconnect(); ro = null; if (lockIO) lockIO.disconnect(); lockIO = null;
      H.classList.remove('gfx-ftg-reveal', 'gfx-ftg-covered', 'gfx-ftg-home', 'gfx-ftg-flying', 'gfx-ftg-lock-in', 'gfx-ftg-open');
      cut(0); host.style.removeProperty('--gfx-ftg-h'); if (fly) fly.style.visibility = 'hidden'; state = 'bar';
      if (lip) { lip.style.transform = ''; lip.style.opacity = ''; }
      gsap.set([word].concat(q('.gfx-fi-rule, .gfx-fi-in, .gfx-fi-base, .gfx-fi-bar > *, .gfx-fi-bay, .gfx-fi-lip')), { clearProps: 'all' });
    };
    const setup = () => {
      const fits = () => foot.offsetHeight <= W.innerHeight * 0.8;
      const next = wide.matches && fits() ? 'reveal' : 'flow';
      if (next === mode) return; const was = mode; if (was) teardown(); mode = next;
      H.setAttribute('data-gfx-foot', mode);
      if (mode === 'flow') {
        flowTone();
        tl = film(false);
        st = ST.create({ trigger: foot, start: 'top 92%', end: 'max', onEnter: () => { hurryTurn(); if (tl.progress() < 1 && !tl.isActive()) tl.play(); } });
        st2 = ST.create({ trigger: foot, start: 'top 125%', onLeaveBack: () => tl.pause(0) });
        if (was) tl.progress(foot.getBoundingClientRect().top < W.innerHeight ? 1 : 0);
        if ('IntersectionObserver' in W) { lockIO = new IntersectionObserver(es => es.forEach(e => H.classList.toggle('gfx-ftg-lock-in', e.isIntersecting))); lockIO.observe(lockup); }
        ST.refresh(); return;
      }
      H.classList.add('gfx-ftg-reveal');
      measureF(); tl = film(true);
      /* (1.0.22, final audit: reload or Back at the bottom of Contact left the footer shut over an empty screen) the
         page's end was a remembered figure, taken at the last refresh; a page that settles after that (a reload lands
         mid-load) moved its end without telling us. Read where the end is now, every time. */
      const live = () => Math.min(1, Math.max(0, (W.innerHeight - host.getBoundingClientRect().top) / (H0 || 1)));
      let first = true;
      st = ST.create({ start: 0, end: 'max', onRefresh: () => { measureF(); step(live(), true); first = false; }, onUpdate: () => { step(live(), first); first = false; } });
      ro = new ResizeObserver(() => { if (foot.offsetHeight !== H0) { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => ST.refresh()); } });
      ro.observe(foot);
      ST.refresh();
    };
    foot.addEventListener('focusin', onFocus);
    const re = () => setup();
    if (wide.addEventListener) wide.addEventListener('change', re); else wide.addListener(re);
    let rz = 0; W.addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(re, 180); });
    setup();
    // a visit that arrives at the end (reload, Back, a link to the foot) has no scroll to wake the footer: look again
    // once the page has settled
    const settle = () => { if (mode === 'reveal' && H0) { const r = host.getBoundingClientRect().top; step(Math.min(1, Math.max(0, (W.innerHeight - r) / H0)), true); } };
    W.addEventListener('load', () => setTimeout(settle, 60)); W.addEventListener('pageshow', () => setTimeout(settle, 60)); setTimeout(settle, 1200);
    W.gfxFoot = { get state() { return state; }, get mode() { return mode; }, get p() { return prog; }, get film() { return tl; } };
  }

  /* ========================= 9 · the close's fox (gf-site.js, Flow 3) =========================
     The designer's fox line drawing, large and faint behind the close's headline (62 % of the drawing's own 5 %); as
     the footer arrives it dissolves, linked to the scroll, in step with the footer's fox flying home: never two foxes at
     full strength in one view. */
  function foxStep(sel) {
    let rq = 0, last = '';
    const tick = () => {
      rq = 0; const fox = $(sel); if (!fox) return; const sec = fox.parentElement;
      const y = scrollNow(), vh = W.innerHeight, r = sec.getBoundingClientRect(), top = r.top + y, bot = r.bottom + y;
      const max = D.documentElement.scrollHeight - vh, ft = $('.footer_section_wrapper'), fh = ft ? ft.offsetHeight : vh * 0.6;
      let y0 = Math.max(bot - vh, top - vh * 0.15), span = Math.max(vh * 0.45, fh * 0.6);
      if (y0 + span > max) { y0 = Math.max(top - vh * 0.15, max - span); span = Math.max(vh * 0.2, max - y0); }
      // (core 1.0.6) on a tall screen the close and the footer fit in one view, so the scroll window above never opens and
      // the fox stayed at full strength over the arrived footer (Owners, Investors). The footer's own arrival (footer I's
      // progress) now drives it too, so the dissolve always completes as the footer comes in.
      const fp = (W.gfxFoot && W.gfxFoot.mode === 'reveal') ? +W.gfxFoot.p || 0 : 0;
      const t = Math.max(fp, Math.min(1, Math.max(0, (y - y0) / span))), k = t * t * t * (t * (t * 6 - 15) + 10), o = (0.62 * (1 - k)).toFixed(3);
      if (o !== last) { fox.style.opacity = o; last = o; }
    };
    // (1.0.27, smoothness lab 10/21) it measured the close and the page on every frame from the top down; now only while
    // the close is within a screen and a half (once more as it leaves that range, so the drawing rests where it should)
    let nearC = true;
    const ask = force => { if ((nearC || force === true) && !rq) { rq = 1; postFrame(tick); } };
    const fox0 = $(sel); if (fox0 && fox0.parentElement && 'IntersectionObserver' in W) new IntersectionObserver(es => es.forEach(e => { nearC = e.isIntersecting; ask(true); }), { rootMargin: '150% 0px' }).observe(fox0.parentElement);
    addEventListener('scroll', ask, { passive: true }); addEventListener('resize', () => ask(true)); if (shared && shared.on) shared.on('scroll', ask);
    setTimeout(() => ask(true), 600); addEventListener('load', () => ask(true));
  }

  /* ========================= 10 · keyboard: a control reached before its reveal is shown at once ========================= */
  function keyboardInit() {
    W.addEventListener('focusin', e => safe('focus reveal', () => {
      for (let el = e.target; el && el !== D.body; el = el.parentElement) {
        if (el.hasAttribute && el.hasAttribute('data-gfx-reveal') && +getComputedStyle(el).opacity < 0.99) gsap.set(el, { opacity: 1, y: 0 });
        gsap.getTweensOf(el).forEach(t => { let root = t; while (root.parent && root.parent !== gsap.globalTimeline) root = root.parent; const st = root.scrollTrigger; if (st && st.vars.scrub) return; if (root.progress() < 1 && !root.reversed()) root.progress(1); });
      }
    }), true);
  }
  const skipLink = () => safe('skip', () => {
    if ($('.gfx-skip') || !D.body) return;
    const first = $('main, .page-wrapper section'); if (!first) return;
    const a = D.createElement('a'); a.className = 'gfx-skip'; a.href = '#'; a.textContent = 'Skip to content';
    // (1.0.43, overnight audit 10/23) the page's <main> is display:contents, which cannot take focus: Enter did nothing and the
    // next Tab went to the bar. Focus now lands on the page's heading (as owners.js did), brought into view if it is not; while
    // Home's opening still holds the hero (the heading cannot take focus yet) it tries again until it can, for up to 4 s
    a.addEventListener('click', e => {
      e.preventDefault(); const t = $('h1') || first; t.setAttribute('tabindex', '-1'); t.setAttribute('data-gfx-skipto', ''); let n = 0;
      const go = () => { t.focus({ preventScroll: true }); if (D.activeElement !== t && n++ < 40) { setTimeout(go, 100); return; } const r = t.getBoundingClientRect(); if (r.bottom < 0 || r.top > W.innerHeight) W.scrollTo(0, W.scrollY + r.top - 120); };
      go();
    });
    if (!$('#gfx-skipto')) { const st = D.createElement('style'); st.id = 'gfx-skipto'; st.textContent = '[data-gfx-skipto]:focus{outline:none}'; (D.head || H).appendChild(st); }
    D.body.insertBefore(a, D.body.firstChild);
  });
  /* what IX2 left behind (its initial states), cleared before the rooms set their own */
  const cleanIX = () => safe('clean ix', () => {
    const clr = (el, props) => props.forEach(p => el.style.removeProperty(p));
    $$('[data-gfx-wid]').forEach(el => { if (el.closest('.w-nav, .button, .nav-button')) return; const s = el.style; if (s.opacity === '0' || s.visibility === 'hidden') clr(el, ['opacity', 'visibility', 'transform', '-webkit-transform', 'filter']); });
    $$('.preloader, .preloader .logo-full').forEach(el => clr(el, ['display', 'opacity', 'visibility', 'transform', '-webkit-transform']));
    $$('.reveal_block').forEach(el => clr(el, ['display', 'opacity', 'transform', '-webkit-transform', 'width', 'height']));
    $$('.divider').forEach(el => clr(el, ['width', 'transform', '-webkit-transform']));
  });

  /* ========================= 11 · boot ========================= */
  const onReady = fn => (D.readyState === 'loading' ? D.addEventListener('DOMContentLoaded', fn, { once: true }) : fn());
  // (core 1.0.4) THE OPENING IS HOME'S ALONE: the head marks a session's first page `gfx-intro` before any layer has run,
  // and only Home's opening ever took it off. On any other first page it stayed, and `html.gfx-intro body{overflow:hidden}`
  // made the body the scroll container, so every sticky stage broke (Owners' partnership hold among them). Once the page's
  // own layer has run (the bundle evaluates it right after the core), a page without Home's layer drops it at once
  onReady(() => { if (!W.__gfxHome) H.classList.remove('gfx-intro'); });
  /* (1.0.20, founder 10/20: "slightly lagging on a Mac") A FILM NO ONE CAN SEE IS STOPPED: the designer's background
     video (Home's hero, under the still that replaced it) is hidden but looped and decoded for the whole visit. A video
     with no box on the screen (hidden, not displayed, or 0 x 0) that the page did not start itself is paused and not
     fetched further; checked at load and after a resize. Our own films (Mission Control, the stages) are untouched. */
  const idleFilms = () => safe('idle films', () => D.querySelectorAll('video').forEach(v => {
    if (v.closest('[data-o], .gfx-mc-still')) return;   // our rooms' films are run by their pages
    const cs = getComputedStyle(v), r = v.getBoundingClientRect();
    let hidden = cs.display === 'none' || cs.visibility === 'hidden' || r.width < 2 || r.height < 2;
    for (let n = v.parentElement; !hidden && n && n !== D.body; n = n.parentElement) { const s = getComputedStyle(n); if (s.display === 'none' || s.visibility === 'hidden') hidden = true; }
    if (hidden) { if (!v.paused) v.pause(); v.removeAttribute('autoplay'); v.autoplay = false; v.preload = 'none'; v.dataset.gfxIdle = '1'; }
    else if (v.dataset.gfxIdle) { delete v.dataset.gfxIdle; v.autoplay = true; const p = v.play(); if (p && p.catch) p.catch(() => {}); }
  }));
  onReady(idleFilms); W.addEventListener('load', () => setTimeout(idleFilms, 200)); { let vt = 0; W.addEventListener('resize', () => { clearTimeout(vt); vt = setTimeout(idleFilms, 400); }); }
  // (core 1.0.4, STAGING ONLY) while the Flow 3 pages live on their -v2 slugs, every link to the designer's Contact page
  // reaches Contact v2 instead (the closes' "Start a conversation", footer I's action, the nav). Inert once the v2 pages
  // replace the originals at launch (no page path carries "-v2" then): delete this block at launch
  // (1.0.14) also every page on the staging host (the CMS article pages live at /insights/<slug>, no "-v2")
  const STAGING = /(^|\/)[a-z0-9-]*-v2(-[a-z0-9-]+)?\/?$/.test(location.pathname) || /\.webflow\.io$/.test(location.hostname);
  // (core 1.0.7) and the other built pages the shared nav and footer can't reach yet: Insights (it pointed at the live
  // site), the footer's Team (Home's #team) and Privacy Policy ("#"). Terms of Service has no page; it stays as it is.
  const toV2 = a => {
    const h = a.getAttribute('href') || '', t = (a.textContent || '').trim();
    if (/^(https?:\/\/[^/]*greyfox[^/]*)?\/contact\/?([?#].*)?$/.test(h)) a.setAttribute('href', h.replace(/\/contact\/?/, '/contact-v2'));
    else if (/^(https?:\/\/[^/]*greyfox[^/]*)?\/insights\/?([?#].*)?$/.test(h)) a.setAttribute('href', '/insights-v2' + (h.match(/[?#].*$/) || [''])[0]);
    else if (t === 'Team' && /^(\/team\/?|(\/[a-z0-9-]*)?#team)$/.test(h)) a.setAttribute('href', '/team-v2');
    else if (/^privacy( policy)?$/i.test(t) && (h === '#' || /^\/privacy(-policy)?\/?$/.test(h))) a.setAttribute('href', '/privacy-v2');
    else if (h === '/' || h === '/#') a.setAttribute('href', '/home-v2');   // (1.0.8) home links: the logos
  };
  /* (1.0.16, founder 10/20) THE ARTICLES MOVED: the list page keeps /insights and the CMS articles live at
     /articles/<slug> (Webflow won't let a page and a collection share "insights"). Every page still holds the old
     address (greyfoxpartners.com/insights/<slug>, and the static /insights-v2-article for the Plausible List); a link
     goes straight to the article, on every host, so nobody rides the launch 301 (/insights/(.*) -> /articles/%1). */
  const ART = '/articles/', PLAUSIBLE = 'ai-deal-origination-structural-risk-plausible-list-problem';
  const toArticle = a => {
    const h = a.getAttribute('href') || '', m = h.match(/^(?:https?:\/\/(?:www\.)?greyfoxpartners\.com)?\/insights\/([a-z0-9-]+)\/?([?#].*)?$/);
    if (m && m[1] !== 'category' && m[1] !== 'tag') a.setAttribute('href', ART + m[1] + (m[2] || ''));
    else if (/^\/insights-v2-article\/?([?#].*)?$/.test(h)) a.setAttribute('href', ART + PLAUSIBLE);
    // after launch the list page is /insights: a link still naming the staging slug (the template's way back) goes there
    else if (!STAGING && /^\/insights-v2\/?([?#].*)?$/.test(h)) a.setAttribute('href', h.replace(/^\/insights-v2\/?/, '/insights'));
  };
  { const sweepA = () => D.querySelectorAll('a[href*="insights"]').forEach(toArticle);
    onReady(sweepA); W.addEventListener('load', () => { sweepA(); setTimeout(sweepA, 1500); });
    D.addEventListener('click', e => { const a = e.target && e.target.closest && e.target.closest('a[href]'); if (a) toArticle(a); }, true); }
  if (STAGING) {
    const sweep = () => D.querySelectorAll('a[href]').forEach(toV2);
    onReady(sweep); W.addEventListener('load', () => { sweep(); setTimeout(sweep, 1500); });
    D.addEventListener('click', e => { const a = e.target && e.target.closest && e.target.closest('a[href]'); if (a) toV2(a); }, true);
  }
  const loadScript = src => new Promise((res, rej) => { const s = D.createElement('script'); s.src = src; s.async = false; s.onload = res; s.onerror = rej; (D.head || H).appendChild(s); });
  const haveGsap = () => !!(W.gsap && W.ScrollTrigger && W.SplitText);
  const ensureGsap = () => new Promise(res => {
    if (haveGsap()) { res(true); return; }
    let done = false;
    const fallback = () => {
      if (done) return; done = true;
      if (haveGsap()) { res(true); return; }
      const v = (W.gsap && W.gsap.version) || '3.13.0', base = 'https://cdn.jsdelivr.net/npm/gsap@' + v + '/dist/';
      (W.gsap ? Promise.resolve() : loadScript(base + 'gsap.min.js'))
        .then(() => (W.ScrollTrigger ? 0 : loadScript(base + 'ScrollTrigger.min.js')))
        .then(() => (W.SplitText ? 0 : loadScript(base + 'SplitText.min.js')))
        .then(() => res(haveGsap()), () => res(haveGsap()));
    };
    if (D.readyState === 'complete') fallback(); else { W.addEventListener('load', fallback, { once: true }); setTimeout(fallback, 2500); }
  });
  const ensureLenis = () => new Promise(res => {
    if (REDUCE || TOUCH || shared) { res(); return; }
    if (RealLenis) { makeShared(); res(); return; }
    if (H.classList.contains('lenis')) { res(); return; }
    loadScript('https://unpkg.com/lenis@1.1.18/dist/lenis.min.js').then(() => { makeShared(); res(); }, () => res());
  });
  const fontsReady = () => {
    let capped = false;
    const cap = new Promise(r => setTimeout(() => { capped = true; r(); }, 1500));
    const fr = D.fonts && D.fonts.ready ? D.fonts.ready : Promise.resolve();
    fr.then(() => { if (capped) setTimeout(() => W.dispatchEvent(new Event('resize')), 60); });
    return Promise.race([fr, cap]);
  };

  let PAGE = null;
  const api = {
    core: VERSION, G, $, $$, safe, mq, store, clamp, docTop, NS, TAN, BASE, REDUCE, TOUCH, READ,
    room, lineSplit, fitFilm, rooms, scrollToY, refresh, esc, postFrame,
    get gsap() { return gsap; }, get ST() { return ST; }, get lenis() { return shared; }, scrollNow,
    arrow: () => W.gfArrow, turn: () => W.gfTurn,
    onField: f => fieldListeners.push(f),
    page: def => { PAGE = def; fieldDef = def.field || null; }
  };
  W.gfx = api;

  onReady(() => {
    safe('ix2 sweep', () => { strip(D.body); if (ixObs) ixObs.disconnect(); });
    skipLink(); stopIX2(); cleanIX();
    W.addEventListener('load', () => { stopIX2(); setTimeout(ix3Late, 3000); }, { once: true });
    if (!PAGE) { H.classList.add('gfx-ready'); return; }
    safe('page dom', () => PAGE.dom && PAGE.dom(api));
    safe('footer I', footBuild);
    // (1.0.39, launch QA 10/22) an article's picture link repeats its title link: one stop and one name per article for
    // keyboards and screen readers (the drawing's own words - 'Caller 40% Founder 60%...' - were read as the link's name)
    safe('pic links', () => { const named = new Set($$('a[href*="/articles/"]').filter(x => !x.querySelector('svg, img, picture') && x.textContent.trim()).map(x => x.getAttribute('href'))); $$('a[href*="/articles/"]').forEach(x => { if (x.querySelector('svg, img, picture') && named.has(x.getAttribute('href'))) { x.setAttribute('aria-hidden', 'true'); x.tabIndex = -1; } }); });
    if (fieldDef) { addEventListener('scroll', early, { passive: true }); early(); }
    if (REDUCE) { stillInit(); return; }
    Promise.all([ensureGsap(), ensureLenis()]).then(([ok]) => { if (!ok) { staticInit(); return; } safe('start', start); });
  });
  function stillInit() {
    safe('reduced', () => {
      H.classList.add('gfx-still-page');
      if (fieldDef) { removeEventListener('scroll', early); fieldStill(); }
      safe('page still', () => PAGE.still && PAGE.still(api));
      H.classList.add('gfx-ready');
      if (W.gsap) { gsap = W.gsap; } footInit(PAGE.foot);
      if (PAGE.fox) foxStep(PAGE.fox);
    });
  }
  function staticInit() {
    safe('static', () => {
      H.classList.remove('gfx-m', 'gfx-intro'); H.classList.add('gfx-static');
      const p = $('.page-wrapper'); p && p.removeAttribute('inert');
      if (fieldDef) { removeEventListener('scroll', early); fieldStill(); }
      safe('page still', () => PAGE.still && PAGE.still(api));
      H.classList.add('gfx-ready');
    });
  }
  function start() {
    gsap = W.gsap; ST = W.ScrollTrigger;
    gsap.registerPlugin(ST, W.SplitText);
    ST.defaults({ toggleActions: 'play complete none none' });
    if (TOUCH) ST.config({ ignoreMobileResize: true });
    if (shared && sharedRaf) { tickerOn = true; cancelAnimationFrame(tempLoop); gsap.ticker.add(() => sharedRaf(performance.now())); gsap.ticker.lagSmoothing(0); shared.on('scroll', ST.update); }
    safe('page start', () => PAGE.start && PAGE.start(api));
    safe('nav', navInit);
    fontsReady().then(() => {
      safe('page rooms', () => PAGE.rooms && PAGE.rooms(api));
      safe('keyboard', keyboardInit);
      setTimeout(() => {
        if (fieldDef) { removeEventListener('scroll', early); safe('field', fieldInit); }
        setTimeout(() => {
          safe('page late', () => PAGE.late && PAGE.late(api));
          safe('footer I motion', () => footInit(PAGE.foot));
          if (PAGE.fox) safe('fox step', () => foxStep(PAGE.fox));
          safe('fox watch', () => foxWatch(PAGE.foxZone));
          H.classList.add('gfx-rooms');
          ST.refresh();
          /* (1.0.22) every scroll beat measures the page at a refresh. A page that changes height afterwards (images,
             a reload that lands mid-load) leaves them measuring a page that is gone. Webflow pins html to the viewport,
             so nothing notices on its own: look at the height after load and once more later, and re-measure only if
             it moved. */
          safe('height watch', () => {
            // the smooth scroll keeps its own page end too (its watcher waits on a frame): bring it along every time
            // (only when it is wrong: a resize also settles a glide in progress)
            const lim = () => { if (shared && !shared.__gfxStub) try { if (Math.abs(shared.limit - ST.maxScroll(W)) > 1) shared.resize(); } catch (e) { /* ignore */ } };
            let lastH = D.documentElement.scrollHeight;
            ST.addEventListener('refresh', () => { lastH = D.documentElement.scrollHeight; lim(); });
            const check = () => { lim(); const h = D.documentElement.scrollHeight; if (Math.abs(h - lastH) > 2) ST.refresh(); };
            const later = () => { setTimeout(check, 300); setTimeout(check, 1800); };
            if (D.readyState === 'complete') later(); else W.addEventListener('load', later);
          });
        }, 60);
      }, 200);
    });
  }
})();

/*!
 * Grey Fox · gfx Home (Flow 3), the Home layer on the shared core (core/gfx-core.js).
 * home 1.1.1 · 2026-10-20 (1.1.1: the opening's line is the house line, gfArrow.line) · Webflow page "Home v2" (/home-v2, 6ace6f7b7422f227be0447ed).
 *
 * WHAT IT IS
 *   The approved local Flow 3 Home (prototype/v14.html with Flow 3 on), its own rooms only; everything every page
 *   shares (the field, the turn, the bar, the arrow, footer I, the close's fox) is the core's. The DOM is Webflow's own
 *   (gfx- classes, see audit/webflow-build/f3-home-map.md); this layer animates it and draws the decoration that is
 *   not content (the market's strands and method labels, the odometer reels, the arrows, the portal window).
 *
 * PORTED FROM (local masters, 10/20; Flow 3 paths only)
 *   gf-flow.js homeLine3   the rooms and their chapters: hero (film) and paper for the standard, the case studies, the
 *                          team, the thinking; the black for the market stage and the close; the turns' waits
 *   gf-flow3.js            the field mirrored into the portraits' reveal covers and the footer; the portal leaves with
 *                          the stage; the doors' addresses (native here)
 *   gf-line.js             the market stage (the strands, the figure, the four steps, the portal), the hero's line born
 *                          under "engage.", hero → standard slide-over, the portraits' settle, the statement, the close's
 *                          arrow under "human."
 *   sbx4.js / sbx-m1.js    the climb in Flow (pinned 2.0 screens at most, the ridge catching up over 0.6 s, the chapter
 *                          picked at 0.92, figures settling in 0.6 s, chapter films held to 1.2 s); the standard's beats;
 *                          the team and the reading list as rooms; the close as a room
 *   home-v2-motion.js      1.0.9's opening (preloader line + fox flight), hero film order, logo marquee, pause control,
 *                          climb ridge in the rail's own pixels
 *   (removed in Flow 3 on Home: the process room and the industries room, hidden natively)
 */
(function () {
  'use strict';
  var W = window, D = document, gfx = W.gfx;
  if (!gfx || !gfx.page || W.__gfxHome) return;
  W.__gfxHome = '1.1.15';
  const H = D.documentElement, G = gfx.G, $ = gfx.$, $$ = gfx.$$, safe = gfx.safe, mq = gfx.mq, clamp = gfx.clamp;
  const NS = gfx.NS, TAN = gfx.TAN, REDUCE = gfx.REDUCE, GROUP = G.group, LEAVE = G.leave;
  const PIN = '(min-width: 992px) and (min-height: 681.01px)', UNPIN = '(max-width: 991px), (max-height: 680.99px)';
  const ss = t => t * t * (3 - 2 * t), eo = t => 1 - Math.pow(1 - t, 3), eio = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const seg = (p, a, b) => clamp((p - a) / (b - a), 0, 1), lerp = (a, b, t) => a + (b - a) * t;
  const arrowReady = cb => (W.gfArrow ? cb(W.gfArrow) : null);
  let gsap = null, ST = null;
  const flowY = el => el.getBoundingClientRect().top + W.scrollY;

  /* ========================= the rooms and their chapters (gf-flow.js homeLine3) ========================= */
  const field = {
    phoneRhythm: 'phone',   // (1.1.6) the house phone rhythm on every room (phones only: the tablet market hold keeps its own tiers)
    rooms: [
      { el: '.gfx-hero-sec', native: 'M', tone: 'L' },
      { el: '.gfx-std-sec', native: 'L', tone: 'L', tier: 'standard' },
      { el: '.gfx-case-sec', native: 'L', tone: 'L', tier: 'breath' },
      // (the turn into the market waits until the climb's room has all but left: its foot within the top fifth)
      { el: '.gfx-mk', native: 'D', tone: 'D', turnAt: (ym, c) => { const pv = c.prev.el, out = c.docTop(pv) + pv.offsetHeight - c.vh * 0.2; return out > ym ? Math.min(out, c.max - c.vh * 0.05) : ym; } },
      // (back to paper once the stage has released and its portal has faded, its foot at 70%, and not before the
      // market's last line has left the screen)
      { el: '.gfx-team-sec', native: 'L', tone: 'L', tier: 'standard', turnAt: (ym, c) => {
        const pv = c.prev.el, out = c.docTop(pv) + pv.offsetHeight - c.vh * 0.7; if (out > ym) ym = Math.min(out, c.max - c.vh * 0.05);
        const stg = $('.gfx-mk-stage', pv);
        if (stg) { const st = stg.getBoundingClientRect().top; let lo = 0; $$('p, h2, h3, .gfx-mk-cap, .gfx-mk-ill, .gfx-mk-fig, .gfx-mk-steps, li', stg).forEach(e => { if (e.closest('.gfx-mk-sr')) return; const r = e.getBoundingClientRect(); if (r.height > 1 && r.width > 1) lo = Math.max(lo, r.bottom - st); });
          const gone = c.docTop(pv) + pv.offsetHeight - stg.offsetHeight + lo; if (lo && gone > ym) ym = Math.min(gone, c.max - c.vh * 0.05); }
        return ym; } },
      { el: '.gfx-ins-sec', native: 'L', tone: 'L', tier: 'standard' },
      // (the close's turn waits for the thinking's last line to rise into the top eighth; it is black by the time its
      // headline is in the lower seventh)
      { el: '.gfx-cta-sec', native: 'D', tone: 'D', tier: 'turn', opaque: true, foot: true, turnAt: (ym, c) => {
        const lb = c.lastBottom(c.prev.el); if (Number.isFinite(lb) && lb - c.vh * 0.12 > ym) ym = Math.min(lb - c.vh * 0.12, c.max - c.vh * 0.04);
        const hd = $('.heading-2', c.room.el); if (hd) ym = Math.min(ym, c.docTop(hd) - c.vh * 0.86);
        return ym; } }
    ]
  };

  /* ========================= the market's own drawing (built at DOMContentLoaded) ========================= */
  const MK = {};
  const reel = n => '<span class="gfx-mk-reels">' + [...n.toLocaleString('en-US')].map(c => c === ',' ? '<span class="gfx-mk-c">,</span>' :
    '<span class="gfx-mk-d"><span class="gfx-mk-r">' + '0123456789'.split('').map(d => `<i>${d}</i>`).join('') + '<i>0</i></span></span>').join('') + '</span>';
  function marketDom() {
    const sec = $('.gfx-mk'); if (!sec) return;
    const stage = $('.gfx-mk-stage', sec);
    MK.sec = sec; MK.stage = stage;
    if (!$('.gfx-mk-threads', stage)) stage.insertAdjacentHTML('afterbegin', '<canvas class="gfx-mk-threads" aria-hidden="true"></canvas><div class="gfx-mk-gates" aria-hidden="true"><span class="gfx-mk-gate">Web research</span><span class="gfx-mk-gate">On-site evidence</span><span class="gfx-mk-gate">Satellite imagery</span></div>');
    $$('.gfx-mk-odo', sec).forEach(o => { const v = $('.gfx-mk-val', o), n = +(o.getAttribute('data-n') || (v ? v.textContent.replace(/\D/g, '') : 0)); if (v && !$('.gfx-mk-reels', o)) { v.insertAdjacentHTML('afterend', reel(n)); v.classList.add('gfx-mk-val-off'); } });
  }

  /* ========================= the hero (home-v2-motion.js 1.0.9 + gf-line.js's birth) ========================= */
  function introInit() {
    if (!H.classList.contains('gfx-intro')) return null;
    const pre = $('.preloader'), logo = pre && $('.logo-full', pre);
    if (!pre || !logo) { H.classList.remove('gfx-intro'); return null; }
    gfx.store.set('gfx-intro-seen', '1');
    const page = $('.page-wrapper'); if (page) page.setAttribute('inert', '');
    const lenis = gfx.lenis; if (lenis && lenis.stop) lenis.stop();
    const tl = gsap.timeline();
    /* (home 1.1.1, the founder: the opening's green line is the approved line) the house line, gfArrow.line (core 1.0.2):
       the ink gathers where the pen touches down, a faint bow, thinning as it lifts into the turn at the fox's angle, and the
       fox-ear head uncovered from its tip; on the house timing (the line 1.6 s expo-out, the head 0.5 s from 0.95 s). Not
       .gfx-mark (its stroke rule would reach the ink's mask); fixed in the preloader, on the black of the hero it opens on */
    const svg = D.createElementNS(NS, 'svg'); svg.setAttribute('class', 'gfx-intro-mark gfx-intro-line'); svg.setAttribute('aria-hidden', 'true'); svg.setAttribute('focusable', 'false');
    svg.style.cssText = 'position:fixed;left:0;top:0;overflow:visible;pointer-events:none;z-index:2;--gfa-c:#3aa678';
    pre.appendChild(svg);
    let mk = null; const lk = { t: 0 };
    const place = () => safe('intro mark', () => {
      const A = W.gfArrow, b = logo.getBoundingClientRect(); if (!b.width || !A || !A.line) return;
      const inset = b.width * 27 / 600, w = b.width - 2 * inset, fs = Math.max(30, Math.min(60, b.height * 0.46)), S = A.sizes(fs), top = S.rise + 6;
      svg.style.left = (b.left + inset) + 'px'; svg.style.top = (b.bottom + Math.max(18, b.height * 0.14) - 4) + 'px';
      svg.setAttribute('width', Math.ceil(w + S.run + 12)); svg.setAttribute('height', Math.ceil(top + 8));
      if (mk) mk.remove(); mk = A.line(svg, 0, top, w, fs, { at: lk.t });
    });
    const navFox = $$('.gfx-nav .logo__navbar').filter(i => i.offsetWidth || i.getClientRects().length)[0];
    const FLY = !!navFox;
    let fly = null;
    if (FLY) {
      fly = D.createElement('div'); fly.className = 'gfx-fly'; fly.setAttribute('aria-hidden', 'true');
      const png = new Image(), sv = new Image(); png.alt = sv.alt = ''; png.className = 'gfx-fly-png'; sv.className = 'gfx-fly-svg';
      png.src = logo.currentSrc || logo.src; sv.src = navFox.currentSrc || navFox.src; fly.appendChild(png); fly.appendChild(sv); D.body.appendChild(fly);
    }
    const flyOff = () => safe('fly', () => {
      const b = logo.getBoundingClientRect(), t = navFox.getBoundingClientRect(), sx = b.width / 600, sy = b.height / 189;
      const w = 176 * sx, pad = (w - 172 * sy) / 2, left = b.left + 27 * sx, top = b.top + 8 * sy - pad;
      Object.assign(fly.style, { width: w + 'px', height: w + 'px', visibility: 'visible' }); gsap.set(fly, { x: left, y: top });
      Object.assign(fly.firstChild.style, { left: -27 * sx + 'px', top: pad - 8 * sy + 'px', width: b.width + 'px', height: b.height + 'px' });
      logo.style.clipPath = 'inset(0 0 0 36.2%)';
      gsap.to(fly, { x: t.left, y: t.top, scale: t.width / w, duration: G.seam.hairline, ease: G.DRAW });
      gsap.to(fly.lastChild, { opacity: 1, duration: 0.45, ease: 'none', delay: 0.6 });
      gsap.to(fly.firstChild, { opacity: 0, duration: 0.45, ease: 'none', delay: 0.6 });
    });
    tl.fromTo(logo, { autoAlpha: 0, scale: 0.96 }, { autoAlpha: 1, scale: 1, duration: G.detail.duration, ease: G.SETTLE }, 0);
    let t = 0.5;
    tl.add(place, t).fromTo(lk, { t: 0 }, { t: 1.6, duration: 1.6, ease: 'none', immediateRender: false, onUpdate: () => { if (mk) mk.at(lk.t); } }, t);
    t += 1.45;   // (the breath follows the head's arrival)
    tl.addLabel('out', t + 0.25);
    if (FLY) tl.add(flyOff, 'out');
    const CUR = G.seam.hairline;
    tl.to([logo, svg], { autoAlpha: 0, y: -12, duration: LEAVE.duration, ease: LEAVE.ease }, 'out')
      .to(pre, { yPercent: -100, duration: CUR, ease: G.DRAW,
        onComplete: () => { H.classList.remove('gfx-intro'); if (fly) fly.remove(); gsap.set(pre, { clearProps: 'transform' }); logo.style.clipPath = ''; gsap.set([logo, svg], { clearProps: 'opacity,visibility,transform' }); svg.remove(); } }, 'out+=0.15')
      .addLabel('heroIn', 'out+=' + (0.15 + CUR * 0.6))
      .add(() => { if (page) page.removeAttribute('inert'); const l = gfx.lenis; if (l && l.start) l.start(); }, 'heroIn');
    return tl;
  }
  let birth = null;
  const birthBuild = () => { const host = $('.gfx-hero-sec .hero_title'), el = host && $('.gfx-hero-h', host); if (!host || !el || !W.gfArrow) return null; return W.gfArrow.word({ el, host, cls: 'gfx-birth', auto: false }); };
  function heroInit(introTl) {
    const title = $('.gfx-hero-h');
    const para = $('.gfx-hero-p'), btns = $$('.gfx-hero-content .hero_buttons');
    const late = !introTl && performance.now() > 3300;
    let lines = [], started = late, tw = null;
    const rise = () => gsap.fromTo(lines, { yPercent: G.headline.yPercent }, { yPercent: 0, duration: G.headline.duration, stagger: G.headline.stagger, ease: G.SETTLE, paused: !started });
    if (title) W.SplitText.create(title, { type: 'lines', mask: 'lines', linesClass: 'gfx-line', autoSplit: true, aria: 'none',
      onSplit: self => { lines = self.lines; requestAnimationFrame(() => { D.dispatchEvent(new Event('gfx:resplit')); if (birth) birth.place(); }); if (late) return undefined; tw = rise(); return tw; } });
    if (!late) { if (para) gsap.set(para, { opacity: 0.32 }); if (btns.length) gsap.set(btns, { opacity: 0, y: G.detail.y }); }
    H.classList.add('gfx-ready');
    const still = $('.gfx-hero-still img');
    // the line is born once the film's own opening has played (gf-line.js birthPlay: 0.9 s after ready, 2.6 s after an intro)
    const born = () => {
      H.classList.add('gfx-born');
      birth = birth || birthBuild(); if (birth) { if (REDUCE) birth.still(); else birth.draw(0.15); }
      const fox = $('.gfx-nav .logo-link'); if (fox) setTimeout(() => fox.classList.add('gfx-breath1'), 300);
    };
    // (1.1.15, founder: the line was already there when the page appeared) after an intro it is drawn as the fox lands in
    // the nav (the fly runs G.seam.hairline from the intro's "out"), so the reader sees it written; without one, 0.9 s after ready
    const outAt = introTl && introTl.labels ? introTl.labels.out : null;
    if (outAt != null) introTl.call(born, null, outAt + G.seam.hairline); else setTimeout(born, introTl ? 2600 : 900);
    if (late) {
      if (still) gsap.set(still, { scale: 1 });
      [para].concat(btns).filter(Boolean).forEach(e => { const o = +getComputedStyle(e).opacity; if (o < 1) gsap.fromTo(e, { opacity: o }, { opacity: 1, duration: 0.6, ease: G.SETTLE, clearProps: 'opacity' }); });
      return;
    }
    const tl = introTl || gsap.timeline();
    if (!introTl) tl.addLabel('heroIn', 0.15);
    tl.add(() => { started = true; if (tw) tw.play(); }, 'heroIn');
    if (para) tl.to(para, { opacity: 1, y: 0, duration: G.body.duration, ease: G.SETTLE, clearProps: 'opacity,transform' }, 'heroIn+=' + G.body.at);
    if (btns.length) tl.to(btns, { opacity: 1, y: 0, duration: G.detail.duration, stagger: G.detail.stagger, ease: G.SETTLE, clearProps: 'opacity,transform' }, 'heroIn+=' + G.detail.at);
    if (still && H.classList.contains('gfx-still')) gsap.set(still, { scale: 1 });
    else if (still) tl.add(() => {
      const go = () => gsap.fromTo(still, { scale: 1.04 }, { scale: 1, duration: 7, ease: G.SETTLE });
      if (still.complete && still.naturalWidth) go(); else { still.addEventListener('load', go, { once: true }); still.addEventListener('error', () => gsap.set(still, { scale: 1 }), { once: true }); }
    }, 'heroIn');
  }
  /* hero → standard (gf-line.js slide()): the hero travels at 0.6 of the scroll and takes a dim of at most 0.32, while
     the standard comes over it at full speed, on its own paper */
  function slide(out, inn, dimMax) {
    // (1.1.6, final audit; the founder: on a phone the standard came up over "For investors" before it could be tapped)
    // a phone scrolls the hero away normally; phones keep motion restrained
    if (!out || !inn || W.matchMedia('(max-width: 767px)').matches) return;
    out.classList.add('gfx-out'); inn.classList.add('gfx-in');
    const dim = D.createElement('i'); dim.className = 'gfx-dim'; dim.setAttribute('aria-hidden', 'true'); out.appendChild(dim);
    let last = '';
    // (1.1.12, iPad walk) clamp: where the next room already shows at the top of the page (a hero shorter than a tall
    // tablet), the slide starts at 0 instead of half-way through (it had pushed the hero 184px down at load on 834x1194)
    ST.create({ trigger: inn, start: 'clamp(top bottom)', end: 'top top', invalidateOnRefresh: true,
      onUpdate: s => { const p = s.progress, dist = s.end - s.start, t = `translate3d(0, ${(p * dist * 0.4).toFixed(1)}px, 0)`; if (t !== last) { out.style.transform = p > 0 ? t : ''; last = t; dim.style.opacity = (dimMax * eo(p)).toFixed(3); } },
      onLeave: () => { out.style.transform = ''; dim.style.opacity = '0'; last = ''; out.style.visibility = 'hidden'; },
      onEnterBack: () => { out.style.visibility = ''; } });
  }

  /* ========================= the standard (sbx-m1.js room + sbx4.js beats, Flow) ========================= */
  function marqueeInit() {
    const lw = $('.gfx-logos'), track = lw && $('.gfx-marq-track', lw); if (!track) return;
    const logos = $$('img', track); if (!logos.length || track.querySelector('.gfx-marq-copy')) return;
    logos.forEach(l => { l.loading = 'eager'; l.decoding = 'async'; });
    for (let k = 1; k < 4; k++) logos.forEach(l => { const c = l.cloneNode(true); c.setAttribute('aria-hidden', 'true'); c.alt = ''; c.classList.add('gfx-marq-copy'); c.removeAttribute('id'); track.appendChild(c); });
    lw.classList.add('gfx-marq');
    if ('IntersectionObserver' in W) new IntersectionObserver(es => es.forEach(e => lw.classList.toggle('gfx-off', !e.isIntersecting))).observe(lw);
  }
  const pauseControl = () => safe('pause', () => {
    const label = $('.gfx-logos-label'); if (!label || $('.gfx-motion')) return;
    const btn = D.createElement('button'); btn.type = 'button'; btn.className = 'gfx-motion';
    const apply = still => {
      H.classList.toggle('gfx-still', still); btn.dataset.still = still ? 'true' : 'false';
      btn.innerHTML = '<i aria-hidden="true"></i><span>' + (still ? 'Play motion' : 'Pause motion') + '</span>';
      gfx.store.set('gfx-still', still ? '1' : '');
    };
    btn.addEventListener('click', () => apply(!H.classList.contains('gfx-still')));
    const slot = D.createElement('span'); slot.className = 'gfx-motion-slot'; slot.appendChild(btn); label.classList.add('gfx-firms-head'); label.appendChild(slot);
    btn.addEventListener('focus', () => { const row = [label, $('.gfx-logos')].filter(e => e && +getComputedStyle(e).opacity < 1); if (row.length) gsap.to(row, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out', overwrite: 'auto' }); });
    apply(gfx.store.get('gfx-still') === '1');
  });
  function standardInit() {
    const sec = $('.gfx-std-sec'); if (!sec) return;
    const head = $('.gfx-std-title .heading-2');
    gfx.room({ trigger: head || sec, headline: head, body: $$('.gfx-std-grid > .gfx-lead').slice(0, 1), hairline: '.gfx-std-rule' });
    const pull = $('.gfx-pull'), q = pull && $('.gfx-pull-q', pull), markImg = pull && $('.gfx-pull-mark', pull), attr = pull && $('.gfx-attr', pull), pic = pull && $('.gfx-attr-pic', pull);
    const logos = [$('.gfx-logos-label'), $('.gfx-logos')].filter(Boolean);
    const played = [false, false];
    let pullLines = [], pullSplit = null;
    if (q) pullSplit = W.SplitText.create(q, { type: 'lines', mask: 'lines', aria: 'none', autoSplit: true, onSplit: self => { pullLines = self.lines; if (!played[0]) gsap.set(self.lines, { yPercent: G.headline.yPercent }); } });
    if (markImg) gsap.set(markImg, { opacity: 0, y: 10 });
    if (pic) gsap.set(pic, { clipPath: G.picture.clipFrom, scale: G.picture.scaleFrom });
    if (attr) { attr.setAttribute('data-gfx-reveal', ''); gsap.set(attr, { opacity: 0, y: G.detail.y }); }
    if (logos.length) { logos.forEach(l => l.setAttribute('data-gfx-reveal', '')); gsap.set(logos, { opacity: 0, y: G.detail.y }); }
    const beats = [
      () => pull && gfx.fitFilm(gsap.timeline({ onComplete: () => { if (pullSplit) pullSplit.revert(); D.dispatchEvent(new Event('gfx:resplit')); } })
        .to(pullLines, { yPercent: 0, duration: G.headline.duration, stagger: G.headline.stagger, ease: G.SETTLE }, 0)
        .to(markImg || {}, { opacity: 1, y: 0, duration: G.detail.duration, ease: G.SETTLE }, 0)
        .to(pic || {}, { clipPath: 'inset(0% 0% 0% 0%)', duration: G.picture.duration, ease: G.DRAW }, G.picture.at)
        .to(pic || {}, { scale: 1, duration: G.picture.duration, ease: G.SETTLE }, G.picture.at)
        .to(attr || {}, { opacity: 1, y: 0, duration: G.detail.duration, ease: G.SETTLE }, G.detail.at)),
      () => logos.length && gsap.to(logos, { opacity: 1, y: 0, duration: G.detail.duration, stagger: G.detail.stagger, ease: G.SETTLE })
    ];
    const beat = i => { if (played[i]) return; played[i] = true; safe('std beat', beats[i]); };
    [[pull, 0], [$('.testimonials_wrapper', sec) || logos[0], 1]].forEach(([el, i]) => { if (el) ST.create({ trigger: el, start: 'clamp(top 88%)', onEnter: () => beat(i), onLeave: () => beat(i) }); });
  }

  /* ========================= the case studies: the climb, in Flow (sbx4.js) ========================= */
  function casesInit() {
    const sec = $('.gfx-case-sec'); if (!sec) return;
    const content = $('.gfx-case-content', sec), tlBox = $('.gfx-case-tl', sec), rail = $('.gfx-case-rail', sec);
    const head = $('.gfx-case-head .heading-2', sec);
    gfx.room({ trigger: head || sec, headline: head, body: $('.gfx-case-head .paragraph', sec), draws: rail && rail.offsetWidth ? [rail] : [] });
    const chs = $$('.gfx-case-ch', sec); if (!chs.length) return;
    chs.forEach(c => c.classList.remove('gfx-on'));
    const parts = chs.map(ch => {
      const p = { ch, lines: [], meta: $$('.gfx-case-meta > *', ch), figs: $$('.gfx-case-fig-lead, .gfx-case-fig', ch), nums: $$('.gfx-case-num-lead, .gfx-case-num', ch), caps: $$('.gfx-case-cap', ch) };
      const when = $('.gfx-case-when', ch);
      if (when) W.SplitText.create(when, { type: 'lines', mask: 'lines', linesClass: 'gfx-line', aria: 'none', autoSplit: true, onSplit: self => { p.lines = self.lines; gsap.set(self.lines, { yPercent: ch.classList.contains('gfx-on') ? 0 : G.headline.yPercent }); } });
      return p;
    });
    // a chapter arrives in one room's order; its figures never roll (Flow 2/3): each settles with a short rise, 0.6 s
    const enter = (i, dir) => {
      dir = dir || 1;
      const p = parts[i], t = gsap.timeline();
      p.ch.classList.add('gfx-on');
      if (p.lines.length) t.fromTo(p.lines, { yPercent: G.headline.yPercent * dir }, { yPercent: 0, duration: G.headline.duration, stagger: G.headline.stagger, ease: G.SETTLE }, 0);
      if (p.meta.length) t.fromTo(p.meta, { opacity: 0, y: G.body.y * dir }, { opacity: 1, y: 0, duration: G.body.duration, stagger: G.detail.stagger, ease: G.SETTLE }, G.body.at);
      if (p.figs.length) t.fromTo(p.figs, { '--r': 0 }, { '--r': 1, duration: G.hairline.duration, stagger: GROUP, ease: G.DRAW }, G.hairline.at);
      if (p.caps.length) t.fromTo(p.caps, { opacity: 0, y: G.detail.y }, { opacity: 1, y: 0, duration: G.detail.duration, stagger: G.detail.stagger, ease: G.SETTLE }, G.detail.at);
      p.nums.forEach((b, k) => t.fromTo(b, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' }, G.figure.at + k * GROUP));
      if (p.figs.length) t.set(p.figs, { opacity: 1, y: 0 }, 0);
      return t;
    };
    const leave = (i, dir) => {
      dir = dir || 1;
      const p = parts[i], t = gsap.timeline({ onComplete: () => p.ch.classList.remove('gfx-on') });
      if (p.lines.length) t.to(p.lines, { yPercent: -G.headline.yPercent * dir, duration: LEAVE.duration, stagger: G.detail.stagger, ease: LEAVE.ease }, 0);
      const rest = p.meta.concat(p.figs); if (rest.length) t.to(rest, { opacity: 0, y: -G.body.y * dir, duration: LEAVE.duration, stagger: 0.02, ease: LEAVE.ease }, 0);
      return t;
    };
    parts.forEach(p => { if (p.lines.length) gsap.set(p.lines, { yPercent: 105 }); gsap.set(p.meta.concat(p.nums), { opacity: 0 }); gsap.set(p.figs, { '--r': 0 }); gsap.set(p.caps, { opacity: 0 }); });
    /* (1.1.7) how far the climb's stop labels come within 16px of the header text they overlap sideways, measured on the
       layout (offsetTop within the room: the rise and reveal transforms do not count), 0 when clear */
    const headText = $$('.gfx-case-head .heading-2, .gfx-case-head .paragraph', sec);
    const layY = e => { let y = 0, n = e; while (n && sec.contains(n) && n !== sec) { y += n.offsetTop; n = n.offsetParent; } return y; };
    const labelsNeed = ls => {
      let need = 0;
      ls.forEach(l => { if (!l || !l.offsetHeight) return; const q = l.getBoundingClientRect(), lt = layY(l);
        headText.forEach(h => { if (!h.offsetHeight) return; const r = h.getBoundingClientRect(); if (Math.min(q.right, r.right) - Math.max(q.left, r.left) > 0) need = Math.max(need, layY(h) + h.offsetHeight + 16 - lt); }); });
      return Math.ceil(need);
    };
    /* (1.1.9, granular audit 10/20) A CHAPTER TALLER THAN THE HELD SCREEN: at 1280x689 to ~1280x760 (a 1280x800 laptop
       with the browser's bars) and 1366x700 the held chapter ran past the screen's foot - its figures' captions sat 8 to
       66px below it, each chapter swapped out before they could be read. The rule under 681px (every chapter in turn,
       the rail aside) now also holds wherever a chapter's last line would reach the held screen's foot (within 4px),
       measured on the layout. 1366x720, 1536x730, 1440x789 and taller fit and keep the held climb, unchanged. */
    const caseShort = () => {
      if (!tlBox || !W.matchMedia(PIN).matches) return false;
      const rel = el => { let y = 0, n = el; while (n && n !== tlBox) { y += n.offsetTop; n = n.offsetParent; } return n === tlBox ? y : null; };
      let low = 0;
      chs.forEach(ch => $$('.gfx-case-cap, .gfx-case-meta > *, .gfx-case-num, .gfx-case-num-lead', ch).forEach(e => { const y = rel(e); if (y != null && e.offsetHeight) low = Math.max(low, y + e.offsetHeight); }));
      return low > tlBox.offsetHeight - 4;   // (the approved 1440x900 ends 10px above the foot: it holds)
    };
    let mm = null;
    const setupCases = () => {
    mm = gsap.matchMedia();
    const SHORT = H.classList.contains('gfx-case-short');
    // (1.1.7) a desktop under 681px tall shows the climb unpinned: the same clearance, taken as room above the rail
    const shortClear = () => {
      const fit = () => safe('climb clear', () => { if (!rail) return; rail.style.removeProperty('margin-top'); const need = labelsNeed($$('[class*="gfx-case-lbl-"]', rail)); if (need > 0) rail.style.setProperty('margin-top', (parseFloat(getComputedStyle(rail).marginTop) + need) + 'px', 'important'); });
      fit(); ST.addEventListener('refresh', fit);
      return () => { ST.removeEventListener('refresh', fit); if (rail) rail.style.removeProperty('margin-top'); };
    };
    mm.add('(min-width: 992px) and (max-height: 680.99px)', shortClear);
    if (SHORT) { mm.add(PIN, () => { const off = shortClear(); const sts = parts.map((p, i) => ST.create({ trigger: p.ch, start: 'top 88%', onEnter: () => enter(i), onLeave: () => enter(i).progress(1) })); return () => { off(); sts.forEach(s => s.kill()); }; }); }
    else mm.add(PIN, () => {
      const arrow = $('.gfx-rail-arrow', rail), stops = ['a', 'b', 'c'].map(k => $('.gfx-case-stop-' + k, rail)).filter(Boolean);
      const svg = $('.gfx-climb-svg', rail), cTrack = $('.gfx-climb-track', rail), cRect = $('#gfxc-rect', rail) || $('clipPath rect', rail);
      if (!content || !tlBox || !rail || !svg || !cTrack || !cRect || stops.length < 3) { enter(0).progress(1); return undefined; }
      H.classList.add('gfx-pinned');
      // the summit: the ridge's last pitch is the shaft; the house head sits at its tip (gf-site.js glyphs)
      if (arrow && W.gfArrow && !arrow.hasAttribute('data-gfa-sum')) { arrow.setAttribute('data-gfa-sum', ''); arrow.innerHTML = ''; const a = 38.2 * Math.PI / 180; W.gfArrow.head(arrow, 14, 6, Math.cos(a), -Math.sin(a), { len: 12, w: W.gfArrow.CHART, at: 1 }); }
      let cur = -1, run = null;
      const go = i => {
        if (i === cur) return;
        const dir = i > cur ? 1 : -1;
        if (run) run.progress(1);
        const t = gsap.timeline();
        if (cur >= 0) t.add(leave(cur, dir), 0);
        t.add(enter(i, dir), cur >= 0 ? LEAVE.duration * 0.6 : 0);
        gfx.fitFilm(t, 1.2);   // (Flow: a chapter's film, its leave included, is held to 1.2 s)
        run = t; cur = i;
        stops.forEach((s, k) => { s.classList.toggle('gfx-passed', k <= i); if (k === i) s.setAttribute('aria-current', 'step'); else s.removeAttribute('aria-current'); });
      };
      // the hold (sbx4.js flowHC): the climb draws over 1.7 screens, then the last chapter's reading time; 2.0 at most
      const CLIMB = 1.7, PICK = 0.92, FILM = 0.874;
      const HC = () => {
        let low = 0; const t0 = tlBox.getBoundingClientRect().top;
        $$('.gfx-case-cap, .gfx-case-meta > *', chs[2] || tlBox).forEach(s => { const q = s.getBoundingClientRect(); if (q.height) low = Math.max(low, q.bottom - t0); });
        const run = Math.max(0, Math.min(low || W.innerHeight * 0.85, W.innerHeight) - 74), before = (1 - PICK) * CLIMB * W.innerHeight;
        return Math.min(2.0, CLIMB + Math.max(0.3, (gfx.READ.v * (FILM + gfx.READ.rest) * 1.3 - run - before) / W.innerHeight));
      };
      let hc = HC(), HOLD = CLIMB / hc;
      const setHold = () => { hc = HC(); HOLD = CLIMB / hc; H.style.setProperty('--gfx-hold-cases', hc.toFixed(4)); };
      setHold(); ST.addEventListener('refreshInit', setHold);
      const camps = [0, 0.5, 1];
      let cF = 0, midX = 0;
      let ridgeTop = 14;   // (1.1.7) raised only when a stop's label would meet the header text (fitRidge)
      const ridge = () => {
        const Wr = rail.offsetWidth, Hr = rail.offsetHeight, top = ridgeTop, bot = Hr - 10, span = bot - top;
        const lastV = 0.86, x1 = Wr - span * (1 - lastV) / TAN;
        const pts = [[0, 0], [0.15, 0.12], [0.23, 0.145], [0.42, 0.37], [0.5, 0.40], [0.72, 0.66], [0.8, 0.69], [1, lastV]].map(([u, v]) => [u * x1, bot - v * span]).concat([[Wr, top]]);
        const d = 'M' + pts.map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L');
        svg.setAttribute('viewBox', `0 0 ${Wr} ${Hr}`);
        $$('.gfx-climb-track, .gfx-climb-fill', rail).forEach(p => p.setAttribute('d', d));
        $$('.gfx-climb-massif, .gfx-climb-climbed', rail).forEach(p => p.setAttribute('d', `${d} L${Wr} ${Hr} L0 ${Hr} Z`));
        const mr = $('mask rect', svg); if (mr) { mr.setAttribute('width', Wr); mr.setAttribute('height', Hr); }
        cRect.setAttribute('height', Hr + 40);
        midX = pts[4][0];
      };
      const cPt = t => { const p = cTrack.getPointAtLength(t * cTrack.getTotalLength()); return { x: p.x, y: p.y }; };
      const snapMid = () => { const L = cTrack.getTotalLength(); let dd = Infinity; for (let i = 0; i <= 800; i++) { const t = i / 800, e = Math.abs(cTrack.getPointAtLength(t * L).x - midX); if (e < dd) { dd = e; camps[1] = t; } } };
      const leaders = stops.map(s => $(':scope > [class*="gfx-case-leader"]', s)), labels = stops.map(s => $(':scope > [class*="gfx-case-lbl-"]', s));
      gsap.set(leaders.filter(Boolean), { transformOrigin: '50% 100%' });
      const campReveal = (k, f) => {
        const s = camps[k], win = k === 0 ? 0.07 : 0.16;
        const a = k === 0 ? Math.min(1, f / win) : clamp((f - (s - win)) / win, 0, 1);
        const grow = gsap.parseEase('power2.out')(clamp(a / 0.7, 0, 1)), text = gsap.parseEase('power3.out')(clamp((a - 0.3) / 0.7, 0, 1));
        if (leaders[k]) gsap.set(leaders[k], { scaleY: grow, autoAlpha: grow > 0 ? 1 : 0 });
        if (labels[k]) gsap.set(labels[k], { y: (1 - grow) * 60 + (1 - text) * 10, autoAlpha: text });
      };
      const drawClimb = f => {
        cF = f; const p = cPt(f);
        if (arrow) { arrow.style.left = p.x + 'px'; arrow.style.top = p.y + 'px'; arrow.classList.toggle('gfx-summit', f >= 0.97); }
        cRect.setAttribute('width', f >= 1 ? rail.offsetWidth + 30 : p.x + 10);
        camps.forEach((_, k) => campReveal(k, f));
        stops.forEach((s, k) => s.classList.toggle('gfx-dot-on', f >= camps[k] - 0.015));
      };
      const placeStops = () => { ridge(); snapMid(); camps.forEach((t, k) => { const p = cPt(t); stops[k].style.left = p.x + 'px'; stops[k].style.top = p.y + 'px'; }); };
      /* (1.1.7, final audit) on a short desktop (the rail is 11vh) the summit's label ("14 years later") rose into the
         header's lede. Only when a label (in its settled place) would come within 16px of a header line it overlaps
         sideways: lower the ridge's top inside the rail by that much (at most half the rail). Nothing else moves. */
      const fitRidge = () => labelsNeed(labels);
      const placeClimb = () => safe('climb', () => {
        ridgeTop = 14; placeStops();
        const need = fitRidge(); if (need > 0) { ridgeTop = Math.min(14 + need, Math.max(14, (rail.offsetHeight - 10) * 0.5)); placeStops(); }
        drawClimb(cF);
      });
      placeClimb(); ST.addEventListener('refresh', placeClimb);
      const flowF = { f: 0 };
      const st = ST.create({ trigger: content, start: 'top top', end: () => '+=' + W.innerHeight * hc, invalidateOnRefresh: true,
        onUpdate: self => { const f = Math.min(1, self.progress / HOLD); gsap.to(flowF, { f, duration: 0.6, ease: 'power3.out', overwrite: true, onUpdate: () => drawClimb(flowF.f) }); go(f >= PICK ? 2 : f >= camps[1] ? 1 : 0); } });
      // the first chapter arrives as the climb arrives (its top 35 % of a screen before its lock)
      ST.create({ trigger: content, start: 'top ' + gfx.READ.approach * 100 + '%', end: 'top top', onEnter: () => { if (cur < 0) go(0); } });
      tlBox.setAttribute('data-gfx-held', '');
      const offs = stops.map((s, k) => {
        const lt = $('.gfx-case-lbl-t', s); s.setAttribute('role', 'button'); s.tabIndex = -1; if (lt) s.setAttribute('aria-label', lt.textContent.trim());
        const click = () => gfx.scrollToY(st.start + (k === 0 ? 0.004 : k === 1 ? camps[1] + 0.02 : 1) * HOLD * (st.end - st.start), 1.6);
        s.addEventListener('click', click); return () => s.removeEventListener('click', click);
      });
      return () => {
        if (run) run.kill(); chs.forEach(c => c.classList.remove('gfx-on')); st.kill(); offs.forEach(f => f());
        ST.removeEventListener('refresh', placeClimb); ST.removeEventListener('refreshInit', setHold); tlBox.removeAttribute('data-gfx-held'); H.classList.remove('gfx-pinned');
        stops.forEach(s => { s.style.left = ''; s.style.top = ''; s.classList.remove('gfx-passed', 'gfx-dot-on'); });
        if (arrow) { arrow.style.left = ''; arrow.style.top = ''; }
        gsap.set(leaders.concat(labels).filter(Boolean), { clearProps: 'all' });
      };
    });
    mm.add(UNPIN, () => { parts.forEach((p, i) => ST.create({ trigger: p.ch, start: 'top 88%', onEnter: () => enter(i), onLeave: () => enter(i).progress(1) })); return undefined; });
    };
    // decided on the held layout (the class off), again after a resize that changes the answer
    const decide = () => { H.classList.remove('gfx-case-short'); const s = caseShort(); H.classList.toggle('gfx-case-short', s); return s; };
    let shortNow = decide(); setupCases();
    let rz = 0;
    W.addEventListener('resize', e => { if (e.target !== W) return; clearTimeout(rz); rz = setTimeout(() => safe('cases fit', () => {
      const was = shortNow; shortNow = decide(); if (shortNow === was) return;
      mm.revert(); parts.forEach(p => { p.ch.classList.remove('gfx-on'); }); setupCases(); ST.refresh();
    }), 260); });
  }

  /* ========================= the market stage (gf-line.js) =========================
     A sticky stage of about 2.75 screens (1.1.5; was 2.15) on the black. The scroll decides which beat the reader is in; each beat plays
     as a short committed film and holds its true state; the strands, the method lines' green and the active step's
     hairline are drawn with the scroll. Step 04 opens the client's live pipeline (the real portal, fictional data). */
  function marketInit() {
    const sec = MK.sec; if (!sec) return;
    const stage = MK.stage, cv = $('.gfx-mk-threads', stage), ctx = cv.getContext('2d'), portal = $('.gfx-mk-portal', sec), portalIn = $('.gfx-mk-portal-in', sec);
    let isPhone = W.innerWidth <= 767; W.addEventListener('resize', () => { isPhone = W.innerWidth <= 767; });
    const phone = () => isPhone;
    const ink = a => `rgba(244, 243, 240, ${a})`, GREEN = '#3aa678';
    let seed = 92631; const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    const mk = n => Array.from({ length: n }, (_, i) => { const pri = rnd() < 100 / 226; return { y0: (i + rnd() * 0.9) / n, amp: 0.008 + rnd() * 0.022, f: 0.5 + rnd() * 1.3, ph: rnd() * Math.PI * 2, pri, lane: pri ? 4 + Math.floor(rnd() * 4) : (rnd() < 0.5 ? Math.floor(rnd() * 4) : 8 + Math.floor(rnd() * 4)) }; });
    let TH = []; const build = () => { seed = 92631; TH = mk(phone() ? 30 : 110); }; build();
    let Wd = 0, Hd = 0, DPR = 1, P = 0, E = 0, gInk = null, gGreen = null, dirty = true;
    const size = () => {
      Wd = stage.clientWidth; Hd = stage.clientHeight; DPR = Math.min(phone() ? 1.25 : 2, W.devicePixelRatio || 1);
      cv.width = Math.round(Wd * DPR); cv.height = Math.round(Hd * DPR); cv.style.width = Wd + 'px'; cv.style.height = Hd + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      const x0 = Wd * 0.28, x1 = Wd * 0.5;
      const g = c => { const gr = ctx.createLinearGradient(x0, 0, x1 + 1, 0); gr.addColorStop(0, c.replace('A', '0')); gr.addColorStop(1, c.replace('A', '1')); return gr; };
      gInk = phone() ? ink(1) : g('rgba(244, 243, 240, A)'); gGreen = phone() ? GREEN : g('rgba(58, 166, 120, A)');
      dirty = true;
    };
    // (1.1.10, final sweeps) the gates' top never rises under the bar (74px): at 1280x720 their labels sat at 67px and the
    // returning bar cut them; 900px-tall screens and up are unchanged (14% is already past 118px). CSS .gfx-mk-gate matches
    // (1.1.11) tablets carry their labels on two lines, so their gates start a little lower (132)
    const fieldR = () => phone() ? { x0: -8, x1: Wd + 8, top: Hd * 0.36, bot: Hd * 0.6 } : { x0: -Wd * 0.04, x1: Wd * 1.02, top: Math.max(Hd * 0.14, W.innerWidth < 992 ? 132 : 118), bot: Hd * 0.9 };
    const PORTAL_U = () => (phone() ? 1.02 : 0.575);
    const GATES = [0.6, 0.71, 0.82];
    /* (home 1.1.5, founder 10/20: "feels like your scroll is moving the lines") each step's change runs across the first
       two thirds of its window, so the strands move for as long as the reader scrolls and rest once the step has said
       its piece (windows 0–.22, .22–.42, .42–.6, .6–1; before: 3% to 14% bursts that a flick of the wheel jumped) */
    const gateIn = () => ss(seg(P, 0.2, 0.28)), gateReach = i => ss(seg(P, 0.25 + i * 0.045, 0.31 + i * 0.045));
    let X = 0;   // the stage's exit, 0 → 1 as it releases (the portal fades; the gathered line runs on to the edge)
    const drawStage = () => {
      dirty = false; ctx.clearRect(0, 0, Wd, Hd);
      const F = fieldR(), fh = F.bot - F.top, yc = phone() ? F.top + fh * 0.5 : Hd * 0.5;
      const a = ss(seg(P, 0.0, 0.16)), b = ss(seg(P, 0.22, 0.36)), c = ss(seg(P, 0.42, 0.57)), d = ss(seg(P, 0.6, 0.78));   // (1.1.5) smoothstep, not a steep in-out: even with the wheel
      const birthK = eo(clamp(E * 1.25, 0, 1));
      const uEnd = lerp(lerp(1, PORTAL_U(), d), 1, ss(X)) * birthK, SEG = phone() ? 14 : 28;
      const laneY = k => yc + (k - 5.5) * fh * 0.052 * (1 - d * 0.85);
      if (!phone()) {
        const gIn = gateIn(), gA = gIn * (1 - c * 0.85);
        if (gA > 0.01) GATES.forEach((g, i) => { const r = gateReach(i), x = F.x0 + (F.x1 - F.x0) * g, y1 = F.top + fh * gIn; ctx.lineWidth = 1;
          if (r < 0.99) { ctx.globalAlpha = gA * 0.45 * (1 - r); ctx.strokeStyle = ink(0.4); ctx.beginPath(); ctx.moveTo(x, F.top); ctx.lineTo(x, y1); ctx.stroke(); }
          if (r > 0.01) { ctx.globalAlpha = gA * 0.8 * r; ctx.strokeStyle = '#2f9a6c'; ctx.beginPath(); ctx.moveTo(x, F.top); ctx.lineTo(x, y1); ctx.stroke(); } });
      }
      const y = (t, u) => {
        let amp = t.amp * fh * (1 - c * 0.7) * (1 - d);
        if (b > 0) for (const g of GATES) if (u > g) amp *= 1 - 0.28 * b;
        const wave = Math.sin(t.ph + u * t.f * 6.283) * amp, spread = F.top + t.y0 * fh, funnel = ss(clamp((u - 0.25) / 0.75, 0, 1));
        const sorted = laneY(t.lane) + (t.y0 - 0.5) * fh * 0.04;
        let tgt = lerp(lerp(spread, yc + (t.y0 - 0.5) * fh * 0.62, a * 0.35), sorted, c);
        if (t.pri) tgt = lerp(tgt, yc, d);
        return lerp(spread, tgt, funnel * Math.max(a * 0.35, c, d)) + wave;
      };
      const group = (list, style, alpha, width) => {
        if (alpha < 0.005 || !list.length) return;
        ctx.globalAlpha = alpha; ctx.strokeStyle = style; ctx.lineWidth = width; ctx.beginPath();
        for (const t of list) { const u1 = t.pri ? uEnd : uEnd * (1 - d * 0.25); for (let s = 0; s <= SEG; s++) { const u = (s / SEG) * u1, x = F.x0 + (F.x1 - F.x0) * u; if (s) ctx.lineTo(x, y(t, u)); else ctx.moveTo(x, y(t, u)); } }
        ctx.stroke();
      };
      const np = TH.filter(t => !t.pri), pr = TH.filter(t => t.pri);
      group(np, gInk, 0.2 * birthK * (1 - c * 0.62) * (1 - d * 0.9), 1);
      group(pr, gInk, 0.2 * birthK * (1 - c), 1);
      group(pr, gGreen, birthK * lerp(0, 0.6, c) * (1 - d * 0.35), lerp(1, 1.25, c));
      if (d > 0.01) { ctx.globalAlpha = d; ctx.strokeStyle = gGreen; ctx.lineWidth = 1.75; ctx.beginPath(); ctx.moveTo(F.x0 + (F.x1 - F.x0) * 0.3, yc); ctx.lineTo(F.x0 + (F.x1 - F.x0) * uEnd, yc); ctx.stroke(); }
      ctx.globalAlpha = 1;
    };
    const odoSet = (el, v) => {
      if (!el) return;
      if (!el._reels) { el._reels = $$('.gfx-mk-r', el); el._kids = [...el.querySelectorAll('.gfx-mk-reels > *')]; el._about = $('.gfx-mk-about', el); }
      const ds = el._reels, n = ds.length;
      for (let i = 0; i < n; i++) { const k = n - 1 - i, p = Math.pow(10, k), base = Math.floor(v / p) % 10, frac = (v % p) / p; const r = base + (k === 0 ? (v % 1) : ss(clamp((frac - 0.9) / 0.1, 0, 1))); const tr = `translate3d(0, ${(-r / 11) * 100}%, 0)`; if (ds[i]._t !== tr) { ds[i].style.transform = tr; ds[i]._t = tr; } }
      let di = n;
      for (const c of el._kids) { const isC = c.classList.contains('gfx-mk-c'); if (!isC) di--; const place = Math.pow(10, di), op = di === 0 ? '1' : ss(clamp((v - place * 0.6) / (place * 0.4), 0, 1)).toFixed(3); if (c._o !== op) { c.style.opacity = op; c._o = op; } }
      if (el._about) { const op = el._kids[0]._o; if (el._about._o !== op) { el._about.style.opacity = op; el._about._o = op; } }
    };
    const nA = $('.gfx-mk-num-a', sec), nC = $('.gfx-mk-num-c', sec), oA = $('.gfx-mk-num-a .gfx-mk-odo', sec), oC = $('.gfx-mk-num-c .gfx-mk-odo', sec);
    const capList = ['.gfx-mk-cap-a', '.gfx-mk-cap-b', '.gfx-mk-cap-c', '.gfx-mk-cap-d'].map(s => $(s, sec));
    const ixs = $$('.gfx-mk-ix', sec); ixs.forEach(li => { li._bar = $('.gfx-mk-ix-fill', li); });
    const hls = $$('.gfx-mk-hlt', sec), lede = $('.gfx-mk-lede', sec), gatesBox = $('.gfx-mk-gates', sec), gates = $$('.gfx-mk-gate', sec), steps = $('.gfx-mk-steps', sec);
    // the portal: mounted as the stage arrives (built and primed long before it opens), played once open
    let demo = null, demoWant = null;
    const ensureDemo = () => { if (demo || !portalIn) return; demo = 'loading'; loadPortal().then(ok => { if (!ok) return; demo = W.GFPortalDemo.mount(portalIn, { theme: 'dark', autoplay: false, loop: false, reducedMotion: REDUCE, frame: true, fit: 'fill', label: 'A client’s pipeline in the Grey Fox portal: the handoff stage, with one company’s note open. Illustrative companies and notes.' }); if (demoWant) demo[demoWant](); }); };
    const demoDo = k => { demoWant = k; if (demo && demo !== 'loading') demo[k](); };
    const STEP_AT = [0.22, 0.42, 0.6], WIN = [[0, 0.22], [0.22, 0.42], [0.42, 0.6], [0.6, 1]];
    const stepOf = p => (p < STEP_AT[0] ? 0 : p < STEP_AT[1] ? 1 : p < STEP_AT[2] ? 2 : 3);
    let arrived = false, step = -1, led = false; const cntA = { v: 0 }, portalK = { k: 0 };
    const setPortal = k => { if (!portal) return; portal.style.clipPath = `inset(0% ${((1 - k) * 100).toFixed(2)}% 0% 0%)`; portal.firstElementChild.style.transform = `scale(${(1.04 - 0.04 * k).toFixed(4)})`; portal.style.visibility = k > 0.001 ? 'visible' : 'hidden'; };
    const tw = (target, vars) => gsap.to(target, Object.assign({ overwrite: true }, vars));
    const fadeTo = (el, o, dur, delay, dy) => { if (!el) return; dy = dy == null ? 12 : dy; gsap.to(el, { opacity: o, y: o ? 0 : -dy * 0.5, duration: dur, delay: delay || 0, ease: o ? 'expo.out' : 'power2.in', overwrite: true }); };
    const enterStep = (s, from) => {
      capList.forEach((c, i) => { if (i === s) fadeTo(c, 1, 0.5, from >= 0 ? 0.18 : 0.35); else if (i === from || (c && c.style.opacity !== '0')) fadeTo(c, 0, 0.3); });
      ixs.forEach((li, i) => li.classList.toggle('gfx-on', i === s));
      if (gatesBox) gatesBox.classList.toggle('gfx-on', s === 1);
      if (s >= 2 && from < 2) { odoSet(oC, 100); fadeTo(nA, 0, 0.3); fadeTo(nC, 1, 0.6, 0.15); }
      if (s < 2 && from >= 2) { fadeTo(nC, 0, 0.35); fadeTo(nA, 1, 0.6, 0.2); odoSet(oA, 92631); }
      if (phone() && nC) { if (s === 3) fadeTo(nC, 0, 0.4); else if (s === 2 && from === 3) fadeTo(nC, 1, 0.5); }
      // (1.1.5) from a tablet up the window opens with the scroll, in step with the line gathering into it (words())
      if (s === 3 && from < 3) { ensureDemo(); if (phone()) { tw(portalK, { k: 1, duration: 1.0, ease: 'power3.inOut', onUpdate: () => setPortal(portalK.k) }); demoDo('play'); } }
      if (s < 3 && from === 3 && phone()) tw(portalK, { k: 0, duration: 0.5, ease: 'power2.in', onUpdate: () => setPortal(portalK.k) });
    };
    const lead = on => {
      led = on;
      if (on) { gsap.fromTo(hls, { yPercent: 105, y: 0 }, { yPercent: 0, duration: 1.2, ease: 'expo.out', stagger: 0.12, overwrite: true }); fadeTo(lede, 1, 0.9, 0.3); }
      else { gsap.to(hls, { yPercent: 105, duration: 0.4, ease: 'power2.in', overwrite: true }); fadeTo(lede, 0, 0.3); }
    };
    const arrive = on => {
      arrived = on;
      if (on) {
        if (step < 2) { fadeTo(nA, 1, 0.7, 0.2); cntA.v = 50000; tw(cntA, { v: 92631, duration: 0.7, delay: 0.1, ease: 'expo.out', onUpdate: () => odoSet(oA, Math.round(cntA.v)) }); }
        if (steps) steps.classList.add('gfx-in'); ensureDemo();
      } else {
        fadeTo(nA, 0, 0.3); fadeTo(nC, 0, 0.3); capList.forEach(c => fadeTo(c, 0, 0.3));
        if (steps) steps.classList.remove('gfx-in'); if (gatesBox) gatesBox.classList.remove('gfx-on');
        ixs.forEach(li => li.classList.remove('gfx-on')); step = -1;
      }
    };
    const words = () => {
      if (!led && E > 0.35) lead(true); else if (led && E < 0.25) lead(false);
      if (!arrived && E > 0.84) arrive(true); else if (arrived && E < 0.74) arrive(false);
      if (arrived) { const s = stepOf(P); if (s !== step) { const from = step; step = s; enterStep(s, from); } }
      ixs.forEach((li, i) => { const f = `scaleX(${clamp(seg(P, WIN[i][0], WIN[i][1] - 0.01), 0, 1).toFixed(4)})`; if (li._f !== f && li._bar) { li._bar.style.transform = f; li._f = f; } });
      gates.forEach((g, i) => { const r = gateReach(i).toFixed(3); if (g._g !== r) { g.style.setProperty('--g', r); g._g = r; } });
      if (!phone() && portal) {
        const k = arrived ? ss(seg(P, 0.6, 0.76)) : 0, o = (1 - eo(X)).toFixed(3);
        if (portalK.k !== k) { portalK.k = k; setPortal(k); } if (portal._o !== o) { portal.style.opacity = o; portal._o = o; }
        // the client's window plays once it is half open, and again each time it opens from closed
        if (k > 0.5 && !portalK.played) { portalK.played = true; demoDo('play'); } else if (k === 0) portalK.played = false;
      }
    };
    /* (final audit, Tony's laptop) on a short screen (under ~780px tall: 1366x768, 1536 at 125% with the browser bar)
       the column runs out of height: the flex column squeezes the figure box and the count (16vh tall, pinned to the
       box's bottom) rises into the lede. Only when it would come within 20px of the lede: shrink the count just enough
       (not under 72px), then take the rest from the column's top padding. Screens that fit (1440x900, 1920x1080) are
       untouched: nothing is written. */
    const fig = $('.gfx-mk-fig', sec), col = $('.gfx-mk-col', sec), odos = [oA, oC].filter(Boolean), nums = [nA, nC].filter(Boolean);
    const fitCount = () => safe('market count fit', () => {
      if (!fig || !lede || !col || !odos.length) return;
      odos.forEach(o => o.style.removeProperty('font-size')); col.style.removeProperty('padding-top');
      if (phone()) return;
      for (let i = 0; i < 3; i++) {
        const nh = Math.max.apply(null, nums.map(n => n.offsetHeight)), numTop = fig.offsetTop + fig.offsetHeight - nh;
        const need = Math.ceil(lede.offsetTop + lede.offsetHeight + 20 - numTop); if (need <= 0) return;
        const fs = parseFloat(getComputedStyle(odos[0]).fontSize), cut = Math.min(need, Math.max(0, fs - 72));
        if (cut > 0) odos.forEach(o => o.style.setProperty('font-size', (fs - cut) + 'px', 'important'));
        const rest = need - cut;
        if (rest > 0) { const pad = parseFloat(getComputedStyle(col).paddingTop); col.style.setProperty('padding-top', Math.max(48, pad - rest) + 'px', 'important'); }
      }
    });
    fitCount(); ST.addEventListener('refresh', fitCount);
    if (D.fonts && D.fonts.ready) D.fonts.ready.then(fitCount);
    hls.forEach(h => { h.style.transform = 'translate3d(0, 105%, 0)'; });
    [lede, nA, nC].concat(capList).forEach(e => { if (e) e.style.opacity = '0'; });
    setPortal(0); odoSet(oC, 100);
    let raf = 0, stageOn = false;
    const tick = () => { raf = 0; if (dirty && stageOn) drawStage(); };
    const wake = () => { if (!raf) raf = requestAnimationFrame(tick); };
    size();
    ST.create({ trigger: sec, start: 'top bottom', end: 'top top', onUpdate: s => { E = s.progress; dirty = true; words(); wake(); }, onRefresh: s => { E = s.progress; } });
    ST.create({ trigger: sec, start: 'top top', end: 'bottom bottom', onUpdate: s => { P = s.progress; dirty = true; words(); wake(); }, onRefresh: s => { P = s.progress; } });
    ST.create({ trigger: sec, start: 'top bottom', end: 'bottom top', onToggle: s => { stageOn = s.isActive; if (stageOn) { dirty = true; wake(); } } });
    ST.addEventListener('refresh', () => { size(); words(); dirty = true; wake(); });
    W.addEventListener('resize', build);
    // THE PORTAL LEAVES WITH THE STAGE: (1.1.5) with the scroll, as the stage releases; the lines stay (the method lines
    // no longer fade with it) and the gathered line runs on past the window to the edge, so nothing cuts off
    const rd = () => { dirty = true; wake(); };
    if (!phone()) ST.create({ trigger: sec, start: 'bottom bottom', end: 'bottom 55%', onUpdate: s => { X = s.progress; dirty = true; words(); wake(); }, onRefresh: s => { X = s.progress; } });
    else ST.create({ trigger: sec, start: 'bottom 95%', onEnter: () => gsap.to(portal, { opacity: 0, duration: 0.45, ease: 'power2.in', overwrite: 'auto', onUpdate: rd, onComplete: rd }),
      onLeaveBack: () => gsap.to(portal, { opacity: 1, duration: 0.6, ease: 'expo.out', overwrite: 'auto', onUpdate: rd, onComplete: rd }) });
    words(); wake();
    // (home 1.1.3) on a phone the room is a plain stack (gfx-home.css, "THE MARKET ROOM ON A PHONE"): the client's window
    // plays when it is in view, not at a pinned step
    if (phone() && portal && 'IntersectionObserver' in W) safe('mk phone', () => {
      const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { ensureDemo(); demoDo('play'); io.disconnect(); } }), { threshold: 0.35 });
      io.observe(portal);
    });
    // (1.1.6, final audit: mounting the client's window as the market arrived dropped 3-4 frames on a phone) the window is
    // built in the first idle moment after load, long before the reader reaches it
    // (1.1.14, smoothness lab 10/21: the idle moment can fall just as a thumb starts the scroll) and only while the page
    // is still - no scroll in the last 0.4 s, else it looks again shortly; arriving at the market still builds it at once
    let moved = 0; W.addEventListener('scroll', () => { moved = performance.now(); }, { passive: true });
    const idleMount = () => { if (demo) return; const still = () => { if (demo) return; if (performance.now() - moved < 400) { setTimeout(idleMount, 300); return; } safe('mk idle', ensureDemo); };
      if (W.requestIdleCallback) W.requestIdleCallback(still, { timeout: 3000 }); else setTimeout(still, 1500); };
    if (D.readyState === 'complete') idleMount(); else W.addEventListener('load', idleMount, { once: true });
    W.gfxMarket = { state: () => ({ P, E, step }), redraw: rd };
  }
  // the reduced page: every part in its final, true state at once (the still stage shows all four steps)
  function marketStill() {
    const sec = MK.sec; if (!sec) return;
    H.classList.add('gfx-mk-still');
    $$('.gfx-mk-ix', sec).forEach(li => li.classList.add('gfx-on')); $$('.gfx-mk-gate', sec).forEach(g => g.style.setProperty('--g', '1'));
    const portalIn = $('.gfx-mk-portal-in', sec);
    if (portalIn) loadPortal().then(ok => { if (ok) { const d = W.GFPortalDemo.mount(portalIn, { theme: 'dark', autoplay: false, loop: false, reducedMotion: true, label: 'A client’s pipeline in the Grey Fox portal. Illustrative companies and notes.' }); d.settle(); } });
  }
  let portalP = null;
  function loadPortal() {
    if (portalP) return portalP;
    portalP = new Promise(res => {
      if (W.GFPortalDemo) return res(true);
      const base = (W.GFX_PORTAL_BASE || gfx.BASE + 'portal/');
      const l = D.createElement('link'); l.rel = 'stylesheet'; l.href = base + 'desktop-portal.css'; D.head.appendChild(l);
      const s = D.createElement('script'); s.src = base + 'desktop-portal.js'; s.async = true; s.onload = () => res(!!W.GFPortalDemo); s.onerror = () => res(false); D.head.appendChild(s);
    });
    return portalP;
  }

  /* ========================= the team and its statement (sbx-m1.js + gf-line.js) ========================= */
  function teamInit() {
    const sec = $('.gfx-team-sec'); if (!sec) return;
    const head = $('.gfx-team-head .heading-2', sec);
    gfx.room({ trigger: head || sec, headline: head, body: $('.gfx-team-head .gfx-lead, .gfx-team-head .paragraph', sec), hairline: $('.gfx-team-hr', sec) });
    const imgs = $$('.gfx-team-img', sec), members = $$('.gfx-team-m', sec), stacked = W.innerWidth < 768;
    const byRow = ms => { const rows = []; ms.forEach(m => { const t = m.getBoundingClientRect().top + W.scrollY, r = rows.find(x => Math.abs(x.t - t) < 8); if (r) r.ms.push(m); else rows.push({ t, ms: [m] }); }); return rows.map(x => x.ms); };
    (stacked ? byRow(members) : [members]).forEach(group => {
      if (!group.length) return;
      const pick = sel => group.reduce((a, m) => a.concat($$(sel, m)), []);
      const bl = pick('.gfx-team-pic .reveal_block');
      gfx.room({ trigger: stacked ? group[0] : ($('.gfx-team-grid', sec) || group[0]), start: stacked ? 'top 88%' : 'top 85%', detail: pick('.team_member_description'), group: true, extraPicture: true, arriving: sec,
        extra: (tl, at) => { if (bl.length) tl.to(bl, { scaleY: 0, transformOrigin: '50% 0%', duration: G.picture.duration, stagger: GROUP, ease: G.DRAW }, at('picture')); } });
    });
    // the portraits settle from 1.06 to 1 as they rise into view (gf-line.js teamMotion: the CSS scale property)
    imgs.forEach(img => {
      if (img.srcset) img.sizes = '(max-width: 767px) 86vw, 31vw';
      let last = ''; img.style.scale = '1.06';
      ST.create({ trigger: img.closest('.gfx-team-pic') || img, start: 'top bottom', end: 'top 35%', onUpdate: s => { const v = (1.06 - 0.06 * eo(s.progress)).toFixed(4); if (v !== last) { img.style.scale = v; last = v; } } });
    });
  }
  let grownMark = null;
  function grownInit() {
    const g = $('.gfx-grown'); if (!g) return;
    const rule = $('.gfx-grown-rule', g), t = $('.gfx-grown-t', g), p = $('.gfx-grown-p', g), em = $('.gfx-grown-em', g);
    arrowReady(A => { if (em && !grownMark) grownMark = A.word({ el: em, key: true, host: t || em, head: false, cls: 'gfx-grown-mark', auto: false }); });
    let lr = '', lt = '';
    const show = (el, k, dy) => { if (!el) return; const o = k.toFixed(3), tr = `translate3d(0, ${((1 - k) * dy).toFixed(2)}px, 0)`; if (el._o !== o) { el.style.opacity = o; el._o = o; } if (el._tr !== tr) { el.style.transform = tr; el._tr = tr; } };
    const set = k => {
      const r = `scaleX(${eo(clamp(k * 1.5, 0, 1)).toFixed(4)})`; if (r !== lr && rule) { rule.style.transform = r; lr = r; }
      const y = `translate3d(0, ${((1 - eo(clamp(k * 1.6 - 0.15, 0, 1))) * 105).toFixed(2)}%, 0)`; if (y !== lt && t) { t.style.transform = y; lt = y; }
      if (p) show(p, eo(clamp(k * 1.6 - 0.4, 0, 1)), 14);
      if (grownMark && k * 1.6 - 0.75 > 0) grownMark.draw(0);
    };
    set(0);
    ST.create({ trigger: g, start: 'top 92%', end: 'top 40%', onUpdate: s => set(s.progress), onRefresh: s => set(s.progress) });
  }

  /* ========================= the reading list (sbx-m1.js, Flow: the opener, the lead, the three) ========================= */
  const ARW = () => (W.gfArrow ? W.gfArrow.icon('gfx-arw') : '');
  function insightsInit() {
    const sec = $('.gfx-ins-sec'); if (!sec) return;
    let n = 0;
    $$('.gfx-ink-lead, .gfx-ink-card').forEach(a => { const t = $('h3', a), d = $('.gfx-ink-p, .gfx-ink-sum', a); if (!t) return; t.id = t.id || 'gfx-ink-t-' + (++n); a.setAttribute('aria-labelledby', t.id); if (d) { d.id = d.id || 'gfx-ink-d-' + n; a.setAttribute('aria-describedby', d.id); } });
    $$('.gfx-ink-all').forEach(g => { if (!g.querySelector('svg')) g.insertAdjacentHTML('beforeend', ARW()); });
    // (1.1.1, one brand arrow, as local gf-site.js glyphs()) the covers' own arrowheads come off, their lines stay: the room's
    // arrow is its "View all articles" glyph
    $$('svg[viewBox="0 0 1200 800"] path', sec).forEach(p => { const d = (p.getAttribute('d') || '').trim(); if (/^M[\d.]+ [\d.]+H[\d.]+V[\d.]+$/.test(d) || /^M708 390L718 400L708 410$/.test(d)) p.remove(); });
    const box = $('.gfx-ink', sec), head = $('.gfx-ins-title .heading-2', sec);
    gfx.room({ trigger: head || sec, headline: head, body: $('.gfx-ink-r', sec), hairline: $('.gfx-ins-rule', sec) });
    if (!box) return;
    const cover = $$('.gfx-ins-pic-lead .gfx-ins-cvsvg', box), leadWords = $$('.gfx-ink-lead > *', box);
    const top = $('.gfx-ink-top', box);
    if (top) gfx.room({ trigger: top, start: 'top 80%', pictures: cover, detail: leadWords, arriving: box });
    const three = $('.gfx-ink-three', box);
    if (three) gfx.room({ trigger: three, start: 'top 88%', hairline: $('.gfx-ink-rule', box), detail: $$('.gfx-ink-card', box), group: true });
  }

  /* ========================= the close (sbx-m1.js room + gf-line.js's arrow) ========================= */
  let closeMark = null;
  function closeInit() {
    const sec = $('.gfx-cta-sec'); if (!sec) return;
    const head = $('.gfx-cta-title .heading-2', sec);
    gfx.room({ trigger: head || sec, headline: head, body: $('.gfx-cta-title .button_wrapper', sec), hairline: $('.gfx-cta-rule', sec), detail: $$('.gfx-door', sec), group: true });
    $$('.divider', sec).forEach(d => {
      const t = gsap.fromTo(d, { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: G.hairline.duration, ease: G.DRAW, paused: true });
      ST.create({ trigger: d, start: 'clamp(top bottom)', end: 'max', onEnter: () => t.play() });
      ST.create({ trigger: d, start: 'top bottom+=50%', onLeaveBack: () => t.pause(0) });
    });
  }
  function closeMarkInit(still) {
    const cta = $('.gfx-cta-sec'), head = cta && $('.gfx-cta-title .heading-2', cta), box = cta && $('.gfx-cta-title', cta);
    if (!cta || !head || !box || !W.gfArrow) return;
    const mark = W.gfArrow.word({ el: head, key: /human/.test(head.textContent) ? 'human' : null, host: box, cls: 'gfx-close-mark', auto: false });
    if (!mark) return;
    closeMark = mark;
    if (still) { mark.still(); return; }
    ST.create({ trigger: box, start: 'top 72%', once: true, onEnter: () => mark.draw(0.35) });
    // one green call in view: while footer I's call is seen and the close is 40 % or less of the screen, the close's
    // arrow and its button step back
    let near = false, rq = 0;
    const seenFa = fa => { const b = fa.getBoundingClientRect(); if (!(b.width > 0 && b.top < W.innerHeight && b.bottom > 0)) return false; const x = Math.min(W.innerWidth - 1, Math.max(0, b.left + b.width / 2)), y = Math.min(W.innerHeight - 1, Math.max(0, b.top + b.height / 2)), e = D.elementFromPoint(x, y); return !!(e && e.closest('.footer_section_wrapper')); };
    const check = () => { rq = 0; const fa = $('.gfx-fi-act'); if (!fa) return; const cr = cta.getBoundingClientRect(), shownK = Math.max(0, Math.min(cr.bottom, W.innerHeight) - Math.max(cr.top, 0)) / (cr.height || 1); const on = near && shownK <= 0.4 && seenFa(fa); mark.svg.classList.toggle('gfx-cm-off', on); cta.classList.toggle('gfx-cta-rest', on); };
    // (smoothness lab 10/21) read just after a frame is drawn (core postFrame), not mid-frame as the close arrives
    const ask = () => { if (near && !rq) { rq = 1; ((W.gfx && W.gfx.postFrame) || requestAnimationFrame)(check); } };
    if ('IntersectionObserver' in W) new IntersectionObserver(es => es.forEach(e => { near = e.isIntersecting; ask(); })).observe(cta);
    W.addEventListener('scroll', ask, { passive: true }); W.addEventListener('resize', ask);
  }

  /* ========================= the field, mirrored where it must show through (gf-flow3.js) =========================
     The portraits' reveal covers are the field itself (a fast arrival never shows three empty boxes); the footer's field
     follows the page's (the close runs on into the footer as one black). */
  let covers = null, rootT = 0;
  const mirror = s => {
    (covers || (covers = $$('.gfx-team-sec .reveal_block'))).forEach(e => e.style.setProperty('--gfx-field', s));
    clearTimeout(rootT); rootT = setTimeout(() => H.style.setProperty('--gfx-field', s), 160);
    // (core 1.0.31) the footer is see-through; the page's background shows behind it
  };

  gfx.page({
    field,
    foot: { close: '.gfx-cta-sec' },
    fox: '.gfx-cta-sec .footer-logo-subtle',
    foxZone: [2, 6, false],
    dom: () => { marketDom(); safe('mirror', () => gfx.onField(mirror)); },
    start: () => {
      gsap = gfx.gsap; ST = gfx.ST;
      let intro = null;
      safe('intro', () => { intro = introInit(); });
      pauseControl();
      safe('hero', () => heroInit(intro));
      safe('marquee', marqueeInit);
      safe('slide', () => slide($('.gfx-hero-sec'), $('.gfx-std-sec'), 0.32));
    },
    rooms: () => { [standardInit, casesInit, teamInit, insightsInit, closeInit].forEach(f => safe(f.name, f)); },
    // (1.1.7) a window under 680px tall (a 1366x768 laptop with the browser's bars) has no room for the pinned market stage
    // even with the count fitted: it gets the still stage (every step shown, as with reduced motion). Decided at load.
    late: () => { const short = W.innerWidth > 767 && W.innerHeight < 680; [short ? marketStill : marketInit, grownInit, () => closeMarkInit(false)].forEach(f => safe(f.name || 'late', f)); },
    still: () => {
      gsap = W.gsap || null; ST = W.ScrollTrigger || null;
      $$('.gfx-case-ch').forEach(c => c.classList.add('gfx-on'));
      safe('market still', marketStill);
      if (W.gfArrow) {
        birth = birthBuild(); if (birth) birth.still();
        const em = $('.gfx-grown-em'); if (em) { const w = W.gfArrow.word({ el: em, key: true, host: $('.gfx-grown-t') || em, head: false, cls: 'gfx-grown-mark', auto: false }); if (w) w.still(); }
        closeMarkInit(true);
        $$('.gfx-ink-all').forEach(g => { if (!g.querySelector('svg')) g.insertAdjacentHTML('beforeend', ARW()); });
      }
    }
  });
})();
