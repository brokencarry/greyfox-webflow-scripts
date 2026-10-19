/*!
 * Grey Fox · gfx Owners (Flow 3), the Business Owners layer on the shared core (core/gfx-core.js).
 * owners 1.0.1 · 2026-10-20 (1.0.1: the call's arrow is the house head; the owner's words always fit their frame) · Webflow page "Business Owners v2" (/business-owners-v2, 6ace925aabbdb42421fe3cb6).
 *
 * WHAT IT IS
 *   The approved local Flow 3 Owners (prototype/owners/index.html, Flow 3 the default: ow-flow2.js + ow-flow2.css with
 *   gf-site.js, gf-turn.js, gf-flow2-base.css and footer I), its own rooms only; everything every page shares (the field,
 *   the turn, the bar, the arrow, footer I, the close's fox) is the core's. The DOM is Webflow's own (gfx- classes, every
 *   element also carrying data-o="<the local classes>", see audit/webflow-build/f3-owners-map.md); this layer animates it
 *   and draws only what is decoration (the call's drawing, the second bite's line, the close's arrow).
 *
 * THE ROOMS (paper throughout; the one turn is into the close and footer I)
 *   hero         the copy kept, the headline on the display rule rising line by line as the page opens; the still
 *                photograph settles; the firms as a still wall (no marquee). Hero → the call is a slide-over.
 *   the call     proc.js design A "The line" on the paper: no hold; its film plays once as the room arrives (2.2 s).
 *   partnership  KEPT AS IT IS ON STAGING (the founder decides later): charcoal, av-k.js held 0.45 screen, its film at the
 *                lock (ported unchanged from owners-v2-motion.js 1.0.4 §6). Not part of the field.
 *   second bite  the two rows on one grid; the green line draws from $3M along the room's floor and turns up at the fox's
 *                angle into the house head at $13.4M, linked to the scroll.
 *   questions    a quiet accordion (one answer open at a time); the rows' hairlines draw in with the scroll.
 *   the close    headline + lede, the house arrow under "taking.", one "Start a conversation" action, the two doors with
 *                their addresses; black (the turn: gfTurn closeAt), opaque over footer I; the faint fox hands off.
 * Reduced motion: every room settled. ?gfm=0: the page exactly as Webflow serves it.
 */
(function () {
  'use strict';
  var W = window, D = document, gfx = W.gfx;
  if (!gfx || !gfx.page || W.__gfxOwners) return;
  W.__gfxOwners = '1.0.2';
  const H = D.documentElement, G = gfx.G, $ = gfx.$, $$ = gfx.$$, safe = gfx.safe, mq = gfx.mq, clamp = gfx.clamp;
  const NS = gfx.NS, TAN = gfx.TAN, REDUCE = gfx.REDUCE;
  const O = c => '[data-o~="' + c + '"]';
  const HOLDQ = '(min-width: 992px) and (min-height: 681px)', STACK = '(max-width: 991px)', SHORT = '(min-width: 992px) and (max-height: 680px)';
  const eo = t => 1 - Math.pow(1 - t, 3), seg = (p, a, b) => clamp((p - a) / (b - a), 0, 1);
  const c01 = v => Math.min(1, Math.max(0, +v || 0)), f1 = n => (+n).toFixed(1), nv = (v, d) => (v == null ? d : v);
  const expo = t => (t <= 0 ? 0 : t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
  const rnd = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const phone = () => W.innerWidth <= 767;
  let gsap = null, ST = null;
  const refresh = () => gfx.refresh();
  safe('head', () => { H.classList.add('gfx-ow3'); if (!REDUCE && mq(HOLDQ)) H.classList.add('gfx-hold'); });

  // a style write only when it changes
  const css = (el, k, v) => { if (!el) return; const c = '_c' + k; if (el[c] !== v) { el.style.setProperty(k, v); el[c] = v; } };
  const show = (el, k, dy) => { if (!el) return; dy = dy == null ? 14 : dy; css(el, 'opacity', k >= 0.999 ? '1' : k.toFixed(3)); css(el, 'transform', k >= 0.999 ? 'none' : `translate3d(0, ${((1 - k) * dy).toFixed(2)}px, 0)`); };
  const rise = (els, k) => (els || []).forEach(el => css(el, 'transform', k >= 0.999 ? 'none' : `translate3d(0, ${((1 - k) * 106).toFixed(2)}%, 0)`));
  const rel = (el, box) => { let x = 0, y = 0, n = el; while (n && n !== box) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; } return { l: x, t: y, r: x + el.offsetWidth, b: y + el.offsetHeight, w: el.offsetWidth, h: el.offsetHeight }; };
  // where an element sits in the page's flow (a sticky stage is measured at its track)
  const INNER = O('av-stage');
  const flowY = el => {
    if (!el) return 0;
    const r0 = el.getBoundingClientRect().top;
    for (let a = el; a && a !== D.body; a = a.parentElement) if (a.matches && a.matches(INNER) && getComputedStyle(a).position === 'sticky' && a.parentElement) return flowY(a.parentElement) + (r0 - a.getBoundingClientRect().top);
    return r0 + W.scrollY;
  };
  const R = {};
  const findRooms = () => { const k = c => $(O(c)); R.hero = k('ow-hero'); R.proc = k('ow-proc'); R.av = k('ow-av'); R.ret = k('ow-ret'); R.qs = k('ow-qs'); R.close = k('ow-close'); };
  findRooms();

  /* ========================= the rooms and their chapters (ow-flow2.js, Flow 3) =========================
     Paper throughout; the one turn is into the close (gf-turn.js closeAt: the later of the close's top at 60 % and the
     questions' last line in the top eighth, and done before the close's headline reaches 72 %). The partnership room is
     not in the field: it keeps its own charcoal, as on staging. The paper rooms keep their own inks (noInk): they are never
     shown on the black (the questions leave as the field turns). */
  const field = {
    rooms: [
      { el: O('ow-hero'), native: 'L', tone: 'L', noInk: true },
      { el: O('ow-proc'), native: 'L', tone: 'L', noInk: true },
      { el: O('ow-ret'), native: 'L', tone: 'L', noInk: true },
      { el: O('ow-qs'), native: 'L', tone: 'L', noInk: true },
      { el: O('ow-close'), native: 'D', tone: 'D', opaque: true, foot: true, turnAt: (ym, c) => {
        const room = c.room.el, top = c.docTop(room); let at = top - c.vh * 0.6;
        const lb = c.lastBottom(c.prev.el); if (Number.isFinite(lb)) at = Math.max(at, lb - c.vh * 0.12);
        const hd = $('h2', room); if (hd) at = Math.min(at, c.docTop(hd) - c.vh * 0.72);
        return Math.min(at, c.max - c.vh * 0.04); } }
    ]
  };

  /* ========================= the static structure (also without motion) ========================= */
  function dom() {
    findRooms();
    // the bar: "Business Owners" is the page you are on
    $$('.gfx-nav a.navigation-item').forEach(a => { if ((a.textContent || '').trim().toLowerCase() === 'business owners') { a.classList.add('gfx-current'); a.setAttribute('aria-current', 'page'); } });
    // the second bite's figures rise through their own masks (each value in a mask; the copy is unchanged)
    if (R.ret) $$(O('rv-v'), R.ret).forEach(v => { if (v.querySelector('.gfx-ow3-m')) return; const t = v.textContent; v.textContent = ''; const m = D.createElement('span'), s = D.createElement('span'); m.className = 'gfx-ow3-m'; s.textContent = t; m.appendChild(s); v.appendChild(m); });
    // the questions open and close in place (all open without JavaScript, and in print)
    if (R.qs) { H.classList.add('gfx-acc-js'); $$(O('ow-acc-b'), R.qs).forEach(b => b.setAttribute('aria-expanded', 'false')); }
  }

  /* ========================= the hero (ow-flow2.js hero, slide) ========================= */
  let heroHead = null;
  function heroInit() {
    const room = R.hero; if (!room) return;
    const h1 = $(O('ow-h1'), room), lede = $(O('ow-hero-lede'), room), act = $(O('ow-actions'), room), pic = $(O('ow-hero-pic'), room), firms = $(O('ow-firms'), room);
    heroHead = gfx.lineSplit(h1);
    const tl = gsap.timeline({ delay: 0.12, onComplete: () => { if (heroHead && !heroHead.reverted) heroHead.revert(); } });
    heroHead.played = true;
    tl.fromTo(heroHead.lines, { y: 0, yPercent: 106 }, { y: 0, yPercent: 0, duration: 1.6, ease: 'expo.out', stagger: 0.09 }, 0)
      .fromTo([lede, act].filter(Boolean), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 1.4, ease: 'expo.out', stagger: 0.1, clearProps: 'transform' }, 0.3)
      .fromTo(pic, { opacity: 0, scale: 1.06 }, { opacity: 1, scale: 1, duration: 2.2, ease: 'expo.out', clearProps: 'transform' }, 0.15)
      .fromTo(firms, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 1.4, ease: 'expo.out', clearProps: 'transform' }, 0.7);
    H.classList.add('gfx-ow3-hero-on', 'gfx-ready');
    W.addEventListener('resize', () => { if (tl.progress() < 1) tl.progress(1); });
  }
  // a slide-over: the call comes over the hero at full speed; the hero travels at 0.6 of the scroll, its photograph under a
  // light shade (10/19: the shade on the photograph only)
  function slide(out, inn, dimMax, dimIn) {
    if (!out || !inn) return;
    out.classList.add('gfx-ow3-out'); inn.classList.add('gfx-ow3-in');
    const dim = D.createElement('i'); dim.className = 'gfx-ow3-dim'; dim.setAttribute('aria-hidden', 'true'); (dimIn || out).appendChild(dim);
    let last = '';
    ST.create({ trigger: inn, start: 'top bottom', end: 'top top', invalidateOnRefresh: true,
      onUpdate: s => { const p = s.progress, dist = s.end - s.start, t = p > 0 && p < 1 ? `translate3d(0, ${(p * dist * 0.4).toFixed(1)}px, 0)` : ''; if (t !== last) { out.style.transform = t; last = t; } dim.style.opacity = p < 1 ? (dimMax * eo(p)).toFixed(3) : '0'; },
      onLeave: () => { out.style.transform = ''; last = ''; dim.style.opacity = '0'; out.style.visibility = 'hidden'; },
      onEnterBack: () => { out.style.visibility = ''; } });
  }

  /* ========================= the call (proc.js design A "The line", owners-v2-motion.js §5; Flow 3: no hold) =========================
     Four beats on one line: research (your company found inside a mapped market), outreach (one line reaching one company),
     conversation (a two-way exchange beside the owner's words), introduction (two sides joining, then the line turning up
     into the arrow at 38.2°, once). The script measures the four cells and writes every path. Desktop: one film as the room
     arrives (the headline's lines, then the four beats), the whole of it in 2.2 s, from the room's top at 45 %; back above
     the room it resets. Phones: each beat as it reaches 88 %. The market's layout is illustrative (seeded), never data. */
  const marketField = o => {
    const Rn = rnd(o.seed || 7), rows = [], pts = [], fit = [];
    const n = Math.max(3, Math.round((o.y1 - o.y0) / o.sp)), sp = (o.y1 - o.y0) / (n - 1);
    for (let i = 0; i < n; i++) rows.push(+(o.y0 + i * sp).toFixed(1));
    const you = { x: o.x0 + (o.x1 - o.x0) * o.ux, y: rows[Math.max(0, Math.min(n - 1, o.urow < 0 ? n + o.urow : o.urow))] };
    rows.forEach(y => {
      const k = Math.round((o.x1 - o.x0) / o.dx * (0.75 + Rn() * 0.5));
      const xs = []; for (let j = 0; j < k; j++) xs.push(o.x0 + 6 + Rn() * (o.x1 - o.x0 - 12));
      xs.sort((a, b) => a - b).forEach((x, j) => {
        if (j && x - xs[j - 1] < 7) return;
        if (Math.abs(y - you.y) < 1 && Math.abs(x - you.x) < 18) return;
        (Rn() < (o.fit || 0.14) ? fit : pts).push([x, y]);
      });
    });
    const dots = a => a.map(([x, y]) => `M${f1(x)} ${f1(y)}h0`).join('');
    return { rows: rows.map(y => `M${f1(o.x0)} ${y}H${f1(o.x1)}`).join(''), pts: dots(pts), fit: dots(fit), you, n };
  };
  let callApi = null;
  function callBuild() {
    const room = R.proc; if (!room) return null;
    const beats = $$(O('pc-beat'), room), svgs = beats.map(b => $('svg.pa-svg', b)), n = beats.length;
    if (n < 4 || svgs.some(s => !s)) return null;
    const pq = $(O('pc-q'), room), quoteEls = pq ? [$('blockquote', pq), $('figcaption', pq)] : [];
    const ti = beats.map(b => $(O('pc-ti'), b)), ps = beats.map(b => $(O('pc-p'), b)), ws = beats.map(b => $(O('pc-w'), b));
    const P2 = (s, c) => s.querySelector('.' + c);
    const S = {};
    const heads = new Map(); let waitA = false;
    /* (owners 1.0.1, the founder at about 1910 px: the owner's words ran below the rule into "Conversation", their
       attribution over its heading) the words and their attribution always sit inside the frame, between the upper line and
       the rule: their box is the drawing's height below the upper line (gfx-owners.css), so where the words need more than
       that (a large screen's larger size, another serif's metrics, a window's height) the drawing grows to hold them, with a
       clear gap above and below; the drawing is measured after, so it scales with it */
    const fitQuote = (stacked, laneF) => {
      if (!pq) return; room.style.removeProperty('--pc-draw'); pq.style.removeProperty('top'); pq.style.removeProperty('height'); if (stacked) return;
      const bq = $('blockquote', pq), fc = $('figcaption', pq), beat = pq.closest(O('pc-beat')), dEl = beat && $(O('pc-draw'), beat), wEl = beat && $(O('pc-w'), beat); if (!bq || !dEl || !wEl) return;
      const need = bq.offsetHeight + (fc ? fc.offsetHeight + (parseFloat(getComputedStyle(fc).marginTop) || 0) : 0);
      // the frame as it stands: from the upper line (the drawing's lane) down to the rule the beat hangs from
      const frame = () => { const dr = dEl.getBoundingClientRect(), lane = dr.top + dr.height * laneF; return { dr, lane, rule: wEl.getBoundingClientRect().top }; };
      let f = frame(); const gap = Math.max(20, f.dr.height * 0.06);
      if (need + 2 * gap > f.rule - f.lane) { room.style.setProperty('--pc-draw', Math.ceil(f.dr.height + (need + 2 * gap - (f.rule - f.lane)) / (1 - laneF)) + 'px'); f = frame(); }
      // and the words' box is set on that frame exactly (whatever offset the designer's class gives it), so they centre in it
      const op = (pq.offsetParent || beat).getBoundingClientRect();
      pq.style.setProperty('top', (f.lane - op.top).toFixed(1) + 'px', 'important'); pq.style.setProperty('height', (f.rule - f.lane).toFixed(1) + 'px', 'important');
    };
    const layout = () => {
      const stacked = mq(STACK);
      const laneF = parseFloat(getComputedStyle(room).getPropertyValue('--pc-lane')) || 0.16;
      fitQuote(stacked, laneF);
      const boxes = beats.map(b => { const d = $(O('pc-draw'), b); return d ? d.getBoundingClientRect() : { left: 0, top: 0, width: 0, height: 0 }; }), base = boxes[0];
      svgs.forEach((s, k) => { const r = boxes[k]; s.setAttribute('width', f1(r.width)); s.setAttribute('height', f1(r.height)); s.setAttribute('viewBox', `0 0 ${f1(r.width)} ${f1(r.height)}`); });
      const set = (s, c, d) => { const p = P2(s, c); if (p) p.setAttribute('d', d || ''); };
      const circ = (s, c, x, y) => { const p = P2(s, c); if (!p) return; p.setAttribute('cx', f1(x)); p.setAttribute('cy', f1(y)); p.style.display = ''; };
      const note = (s, c, x, y, anchor) => { const t = P2(s, c); if (!t) return; t.setAttribute('x', f1(x)); t.setAttribute('y', f1(y)); t.setAttribute('text-anchor', anchor || 'start'); t.style.display = ''; };
      const clear = s => {
        ['pa-rows', 'pa-pts', 'pa-fit', 'pa-lane', 'pa-reach', 'pa-xa', 'pa-xb', 'pa-gr', 'pa-grt', 'pa-hd'].forEach(c => set(s, c, ''));
        ['pa-pulse', 'pa-ring', 'pa-you', 'pa-nring', 'pa-node', 'pa-xad', 'pa-xbd', 'pa-nu', 'pa-nb'].forEach(c => { const p = P2(s, c); if (p) p.style.display = 'none'; });
        const sw = P2(s, 'pa-sw'); if (sw) { sw.setAttribute('width', 0); sw.dataset.w = 0; }
        ['pa-lane', 'pa-gr'].forEach(c => { const p = P2(s, c); if (p) delete p.dataset.k; });
        const hd = heads.get(s); if (hd) { hd.remove(); heads.delete(s); }
      };
      const splitAt = (s, c, tail) => { const p = P2(s, c); if (!p) return; const L = p.getTotalLength ? p.getTotalLength() : 0; if (L > tail) p.dataset.k = ((L - tail) / L).toFixed(4); };
      svgs.forEach(clear);
      // (owners 1.0.1, one brand arrow) the head is THE head, the fox's ears (gfArrow.head), at the chart's weight, uncovered
      // from its tip as the line arrives (channel hd), made at the channel's present value; the old corner (pa-hd) stays empty
      const arrow = (s, xj, yh, xEnd, Hh) => {
        const rise = Math.max(18, Math.min(34, Hh * 0.11)), run = rise / TAN, tip = xEnd, xt = tip - run;
        set(s, 'pa-grt', `M${f1(xj)} ${yh}H${f1(xt)}L${f1(tip)} ${f1(yh - rise)}`);
        const A = W.gfArrow; if (!A) { if (!waitA) { waitA = true; D.addEventListener('gf-arrow', () => relayout(), { once: true }); } return; }
        const dl = Math.hypot(run, rise) || 1, hk = S['hd' + svgs.indexOf(s)];
        heads.set(s, A.head(s, tip, yh - rise, run / dl, -rise / dl, { len: 12, w: A.CHART, cls: 'pa-head', at: c01(hk == null ? 1 : hk) }));
      };
      const exchange = (s, x, yl, yh) => {
        set(s, 'pa-xa', `M${x - 6} ${f1(yl + 7)}V${f1(yh - 7)}`); set(s, 'pa-xb', `M${x + 6} ${f1(yh - 7)}V${f1(yl + 7)}`);
        circ(s, 'pa-xad', x - 6, yh - 7); circ(s, 'pa-xbd', x + 6, yl + 7);
      };
      const market = (s, o) => {
        const fd = marketField(o); set(s, 'pa-rows', fd.rows); set(s, 'pa-pts', fd.pts); set(s, 'pa-fit', fd.fit);
        const sw = P2(s, 'pa-sw'); if (sw) { sw.dataset.w = o.x1 + 12; sw.setAttribute('height', o.H + 80); }
        const u = fd.you; circ(s, 'pa-you', u.x, u.y); circ(s, 'pa-ring', u.x, u.y); circ(s, 'pa-pulse', u.x, u.y);
        return u;
      };
      if (!stacked) {
        const s = svgs[0], Hh = base.height, yh = +(Hh + 0.5).toFixed(1), yl = Math.round(Hh * laneF) + 0.5;
        const X = boxes.map(r => r.left - base.left), Wd = boxes.map(r => r.width), END = X[3] + Wd[3] - 2;
        const u = market(s, { x0: 0, x1: Wd[0] - 40, y0: Math.round(Hh * 0.05) + 0.5, y1: Math.round(Hh * 0.7) + 0.5, sp: Hh > 320 ? 22 : 19, dx: 15, ux: 0.86, urow: -2, seed: 11, fit: 0.12, H: Hh });
        const rr = 9;
        note(s, 'pa-nu', u.x + rr + 12, Math.round(Hh * 0.7) + 30, 'start');
        const nx = X[1] + Wd[1] * 0.5;
        circ(s, 'pa-node', nx, yl); circ(s, 'pa-nring', nx, yl);
        note(s, 'pa-nb', nx - 14, yl + 4.5, 'end');
        set(s, 'pa-reach', `M${f1(nx)} ${f1(yl + 8)}C${f1(nx)} ${f1(yl + (u.y - yl) * 0.92)} ${f1(u.x + rr + (nx - u.x - rr) * 0.42)} ${f1(u.y)} ${f1(u.x + rr)} ${f1(u.y)}`);
        const xs = X[3] - 24, xj = X[3] + Math.min(Wd[3] * 0.58, Wd[3] - 110), c = (xj - xs) * 0.5;
        set(s, 'pa-lane', `M${f1(nx + 8)} ${yl}H${f1(xs)}C${f1(xs + c)} ${yl} ${f1(xj - c)} ${yh} ${f1(xj)} ${yh}`);
        set(s, 'pa-gr', `M${f1(u.x)} ${f1(u.y + rr)}V${f1(yh - 16)}Q${f1(u.x)} ${yh} ${f1(u.x + 16)} ${yh}H${f1(xj)}`);
        const lp = P2(s, 'pa-lane'); if (lp && lp.getTotalLength) { const L = lp.getTotalLength(), hl = xs - nx - 8; if (L > hl && hl > 0) lp.dataset.k = (hl / L).toFixed(4); }
        splitAt(s, 'pa-gr', xj - xs);
        exchange(s, Math.round(X[2]) + 6.5, yl, yh);
        arrow(s, xj, yh, END, Hh);
      } else {
        svgs.forEach((s, k) => {
          const r = boxes[k], Wk = r.width, Hh = r.height, yh = +(Hh + 0.5).toFixed(1), yl = Math.round(Hh * 0.24) + 0.5;
          if (k === 0) {
            const u = market(s, { x0: 0, x1: Wk - 8, y0: 6.5, y1: Math.round(Hh * 0.66) + 0.5, sp: 17, dx: 13, ux: 0.74, urow: -1, seed: 11, fit: 0.12, H: Hh });
            note(s, 'pa-nu', u.x - 20, Math.round(Hh * 0.66) + 30, 'end');
            set(s, 'pa-gr', `M${f1(u.x)} ${f1(u.y + 9)}V${f1(yh - 14)}Q${f1(u.x)} ${yh} ${f1(u.x + 14)} ${yh}H${f1(Wk)}`);
          }
          if (k === 1) {
            const ux = Wk * 0.24, uy = yh, nx = Wk * 0.72, ny = yl;
            circ(s, 'pa-ring', ux, uy); circ(s, 'pa-you', ux, uy); circ(s, 'pa-pulse', ux, uy); circ(s, 'pa-node', nx, ny); circ(s, 'pa-nring', nx, ny);
            note(s, 'pa-nb', nx - 14, ny + 4.5, 'end');
            set(s, 'pa-reach', `M${f1(nx)} ${f1(ny + 8)}C${f1(nx)} ${f1(ny + (uy - ny) * 0.9)} ${f1(ux + 9 + (nx - ux) * 0.4)} ${f1(uy)} ${f1(ux + 9)} ${f1(uy)}`);
            set(s, 'pa-gr', `M0 ${yh}H${f1(ux - 9)}M${f1(ux + 9)} ${yh}H${f1(Wk)}`);
          }
          if (k === 2) { set(s, 'pa-lane', `M0 ${yl}H${f1(Wk)}`); set(s, 'pa-gr', `M0 ${yh}H${f1(Wk)}`); exchange(s, 6.5, yl, yh); }
          if (k === 3) {
            const xj = Wk * 0.46, c = xj * 0.5;
            set(s, 'pa-lane', `M0 ${yl}C${f1(c)} ${yl} ${f1(xj - c)} ${yh} ${f1(xj)} ${yh}`); set(s, 'pa-gr', `M0 ${yh}H${f1(xj)}`);
            arrow(s, xj, yh, Wk - 2, Hh);
          }
        });
      }
    };
    const CH = ['f', 'fit', 'you', 'pulse', 'node', 'reach', 'lane', 'lnd', 'xa', 'xb', 'gr', 'grj', 'grt', 'hd'];
    const names = [];
    for (let k = 0; k < 4; k++) CH.forEach(c => names.push(c + k));
    for (let k = 0; k < 4; k++) names.push('t' + k, 'p' + k, 'r' + k);
    names.push('q', 'qa');
    const dash = (p, v) => { if (!p) return; p.style.strokeDasharray = '1 2'; p.style.strokeDashoffset = f1((1 - c01(v)) * 1000) / 1000; };
    const pop = (el, v) => { if (!el) return; const y = c01(v); el.style.opacity = y; el.style.transform = y >= 1 ? '' : `scale(${(0.4 + 0.6 * expo(y)).toFixed(3)})`; };
    const paintDraw = () => {
      svgs.forEach((s, k) => {
        const v = c => nv(S[c + k], 1);
        const sw = P2(s, 'pa-sw'); if (sw) sw.setAttribute('width', f1((+sw.dataset.w || 0) * c01(v('f')) + (v('f') >= 1 ? 40 : 0)));
        const fit = P2(s, 'pa-fit'); if (fit) fit.style.opacity = c01(v('fit'));
        dash(P2(s, 'pa-ring'), v('you')); pop(P2(s, 'pa-you'), v('you') * 1.6);
        const nu = P2(s, 'pa-nu'); if (nu) nu.style.opacity = c01(v('you') * 2 - 1);
        const pu = P2(s, 'pa-pulse'), pv = c01(v('pulse')); if (pu) { pu.setAttribute('r', f1(9 + 16 * pv)); pu.style.opacity = pv > 0 && pv < 1 ? ((1 - pv) * 0.7).toFixed(3) : 0; }
        pop(P2(s, 'pa-node'), v('node') * 1.4); dash(P2(s, 'pa-nring'), v('node'));
        const nb = P2(s, 'pa-nb'); if (nb) nb.style.opacity = c01(v('node') * 2 - 1);
        ['reach', 'xa', 'xb', 'grt'].forEach(c => dash(P2(s, 'pa-' + c), v(c)));
        const hd = heads.get(s); if (hd) hd.set(c01(v('hd')));
        [['lane', 'lnd'], ['gr', 'grj']].forEach(([a, b]) => { const p = P2(s, 'pa-' + a); if (!p) return; const kk = +(p.dataset.k || 1); dash(p, kk >= 1 ? v(a) : kk * c01(v(a)) + (1 - kk) * c01(v(b))); });
        pop(P2(s, 'pa-xad'), (v('xa') - 0.85) / 0.15); pop(P2(s, 'pa-xbd'), (v('xb') - 0.85) / 0.15);
      });
      beats.forEach((b, k) => {
        const t = c01(nv(S['t' + k], 1)), p = c01(nv(S['p' + k], 1));
        if (ti[k]) ti[k].style.transform = t >= 1 ? '' : `translateY(${f1((1 - t) * 108)}%)`;
        if (ps[k]) { ps[k].style.opacity = p >= 1 ? '' : p; ps[k].style.transform = p >= 1 ? '' : `translateY(${f1((1 - p) * G.body.y)}px)`; }
        const r = c01(nv(S['r' + k], 1)); if (ws[k]) ws[k].style.setProperty('--pc-rl', r >= 1 ? '' : r.toFixed(4));
      });
      if (pq) [[quoteEls[0], 'q'], [quoteEls[1], 'qa']].forEach(([el, c]) => { if (!el) return; const v = c01(nv(S[c], 1)); el.style.opacity = v >= 1 ? '' : v; el.style.transform = v >= 1 ? '' : `translateY(${f1((1 - v) * G.body.y)}px)`; });
    };
    // the film (proc.js): one beat every 0.65 s; each beat's name rises, its sentence follows, its hairline draws, then its drawing
    const film = (tl, ch) => {
      const Dr = G.DRAW, E = G.SETTLE, T = G.headline.duration, B = G.body.duration, L = G.hairline.duration, A = G.arrow.duration;
      const beat = (k, b) => { ch('t' + k, b, T, E); ch('p' + k, b + 0.2, B, E); ch('r' + k, b + 0.45, L, Dr); };
      beat(0, 0.1); ch('f0', 0.45, 0.9, Dr); ch('fit0', 0.95, 0.6, E); ch('you0', 1.1, 0.6, E);
      beat(1, 0.75); ch('node0', 1.05, 0.6, E); ch('reach0', 1.25, 0.7, Dr); ch('pulse0', 1.9, 1.0, E);
      ch('gr0', 1.5, 0.8, Dr); ch('lane0', 1.6, 0.8, Dr);
      beat(2, 1.4); ch('q', 1.7, B, E); ch('xa0', 1.85, 0.55, Dr); ch('qa', 2.0, G.detail.duration, E); ch('xb0', 2.05, 0.55, Dr);
      beat(3, 2.05); ch('lnd0', 2.3, 0.6, Dr); ch('grj0', 2.35, 0.55, Dr); ch('grt0', 2.8, 0.45, Dr); ch('hd0', 2.8 + 0.27, 0.5, 'power3.out');   // (1.0.1: the house head's uncover, 0.5 s cubic, from three fifths of the way up the line)
    };
    const parts = ch => {
      const Dr = G.DRAW, E = G.SETTLE, T = G.headline.duration, B = G.body.duration, L = G.hairline.duration, A = G.arrow.duration;
      const words = k => { ch('t' + k, 0, T, E); ch('p' + k, 0.2, B, E); ch('r' + k, 0.45, L, Dr); };
      return [
        [beats[0], () => { words(0); ch('f0', 0.6, 0.9, Dr); ch('fit0', 1.1, 0.5, E); ch('you0', 1.3, 0.6, E); ch('gr0', 1.6, 0.8, Dr); }],
        [beats[1], () => { words(1); ch('gr1', 0.6, 0.7, Dr); ch('you1', 0.75, 0.5, E); ch('node1', 0.9, 0.5, E); ch('reach1', 1.05, 0.7, Dr); ch('pulse1', 1.7, 1.0, E); }],
        [beats[2], () => { words(2); ch('lane2', 0.6, 0.8, Dr); ch('gr2', 0.7, 0.8, Dr); ch('xa2', 1.25, 0.6, Dr); ch('xb2', 1.5, 0.6, Dr); }],
        [pq || beats[2], () => { ch('q', 0, B, E); ch('qa', 0.3, G.detail.duration, E); }],
        [beats[3], () => { words(3); ch('lane3', 0.6, 0.8, Dr); ch('gr3', 0.6, 0.8, Dr); ch('grt3', 1.4, 0.5, Dr); ch('hd3', 1.4 + 0.3, 0.5, 'power3.out'); }]
      ];
    };
    const one = () => names.forEach(c => { S[c] = 1; }), zero = () => names.forEach(c => { S[c] = 0; });
    const relayout = () => { safe('call layout', layout); paintDraw(); };
    one(); relayout();
    let rz = 0; W.addEventListener('resize', () => { cancelAnimationFrame(rz); rz = requestAnimationFrame(relayout); });
    if (D.fonts && D.fonts.ready) D.fonts.ready.then(relayout);
    // (1.0.1) the words' height changes with a late font or a new width: the frame is fitted again
    if (pq && 'ResizeObserver' in W) { let qh = 0, rq = 0; const bq = $('blockquote', pq);
      if (bq) new ResizeObserver(() => { const h = bq.offsetHeight; if (!h || h === qh) return; const first = !qh; qh = h; if (first) return; cancelAnimationFrame(rq); rq = requestAnimationFrame(relayout); }).observe(bq); }
    return { room, S, names, one, zero, relayout, paintDraw, film, parts, h2: $(O('pc-h'), room) };
  }
  function callInit() {
    const A = callApi; if (!A) return;
    const { room, S, one, zero, relayout, paintDraw, film, parts } = A;
    ST.addEventListener('refresh', () => requestAnimationFrame(relayout));
    const head = A.h2 ? gfx.lineSplit(A.h2) : null;
    if (head) head.played = true;   // (the headline's lines are driven here, never by the core's reveal)
    const hl = () => (head ? head.lines : []);
    const chIn = tl => (name, at, dur, ease) => tl.fromTo(S, { [name]: 0 }, { [name]: 1, duration: dur, ease: ease || G.SETTLE, immediateRender: false }, at);
    const mm = gsap.matchMedia();
    mm.add('(min-width: 992px)', () => {
      zero(); relayout(); gsap.set(hl(), { yPercent: 106 });
      const tl = gsap.timeline({ paused: true, onUpdate: paintDraw });
      tl.fromTo(hl(), { y: 0, yPercent: 106 }, { y: 0, yPercent: 0, duration: 1.2, ease: 'expo.out', stagger: 0.08, immediateRender: false }, 0);
      const f = gsap.timeline({ onUpdate: paintDraw }); film(f, chIn(f)); tl.add(f, 0.2);
      tl.timeScale(tl.duration() / 2.2);   // (the whole film in 2.2 s, the house's longest timed beat)
      const sts = [
        ST.create({ trigger: room, start: 'top 45%', onEnter: () => { if (tl.progress() < 1) tl.play(); } }),
        ST.create({ trigger: room, start: 'top bottom', onLeaveBack: () => { tl.pause(0); zero(); paintDraw(); gsap.set(hl(), { yPercent: 106 }); } })
      ];
      D.addEventListener('gfx:resplit', () => { if (tl.progress() >= 1) gsap.set(hl(), { yPercent: 0 }); });
      // (arriving mid-page, a reload or a link: the room is simply there)
      requestAnimationFrame(() => { if (room.getBoundingClientRect().top < W.innerHeight * 0.45) { tl.progress(1); paintDraw(); } });
      return () => { sts.forEach(s => s.kill()); tl.kill(); one(); paintDraw(); gsap.set(hl(), { yPercent: 0 }); };
    });
    mm.add(STACK, () => {
      zero(); relayout();
      const made = [], tls = [];
      const h = gsap.timeline({ paused: true }); h.fromTo(hl(), { y: 0, yPercent: 106 }, { y: 0, yPercent: 0, duration: 1.4, ease: 'expo.out', stagger: 0.08 }); tls.push(h);
      if (A.h2) made.push(ST.create({ trigger: A.h2, start: 'top 88%', once: true, onEnter: () => h.play() }));
      let bt = null; const ch = (name, at, dur, ease) => chIn(bt)(name, at, dur, ease);
      parts(ch).forEach(([el, build]) => { const t = bt = gsap.timeline({ paused: true, onUpdate: paintDraw }); build(); bt = null; tls.push(t);
        made.push(ST.create({ trigger: el, start: 'top 88%', once: true, onEnter: () => t.play() })); });
      return () => { made.forEach(s => s.kill()); tls.forEach(t => t.kill()); one(); paintDraw(); gsap.set(hl(), { yPercent: 0 }); };
    });
    refresh();
  }

  /* ========================= the partnership room: AS ON STAGING (owners-v2-motion.js 1.0.4 §6, av/av-k.js K) =========================
     Unchanged by the Flow 3 port (the founder decides on it later): the company drawn twice, "Today" (still) and "With
     the right partner" (changing lever by lever, each change named on the drawing); held 0.45 screen on a tall desktop,
     the film (about 3.5 s) once the room locks; short desktops play it on arrival; phones each lever as it arrives.
     Layout is illustrative and seeded, never data. */
  function avInit(live) {
    const room = R.av; if (!room || room.__gfxAv) return; room.__gfxAv = true;
    const LEVER = { growth: 'g', acquisitions: 'a', leadership: 'l', systems: 's', succession: 'u' };
    const R2D = Math.PI / 180;
    const LOC = [[60, 0.8], [100, 0.8], [180, 0.8], [260, 0.8], [300, 0.8]];
    const ACQ = [[204, 1.42], [150, 1.42], [52, 1.3]];
    const ACQ_PHONE = [[148, 1.3], [116, 1.36], [318, 1.3]];
    const JOIN = 2;
    const TEAM = [0, 140, 220];
    const fig = $(O('avh-fig'), room), its = $$(O('avh-it'), room), n = its.length, draws = $$(O('avh-draw'), room);
    if (!fig || n < 2 || draws.length < 2 || !draws[0].querySelector('.ah-pt') || !draws[1].querySelector('.ah-pt')) return;
    const keyOf = li => (/\bis-([a-z]+)\b/.exec((li.getAttribute('data-o') || '').replace(/\bis-k\d+\b/g, '')) || [])[1];
    const lev = its.map(li => LEVER[keyOf(li)] || li.getAttribute('data-lv') || '');
    const lead = lev.indexOf('l') > -1, four = !lead;
    const ti = its.map(x => $(O('avh-ti'), x)), ps = its.map(x => $(O('avh-p'), x));
    const stacked = () => mq(STACK);
    const plan = o => {
      const R1 = o.R1, R0 = Math.max(16, R1 * 0.3), mx0 = o.box[0], my0 = o.box[1], mx1 = o.box[2], my1 = o.box[3];
      const nr = Math.max(3, Math.round((my1 - my0) / o.sp) + 1), sp = (my1 - my0) / (nr - 1);
      const rows = []; for (let i = 0; i < nr; i++) rows.push(Math.round(my0 + i * sp) + 0.5);
      const near = y => rows.reduce((b, r) => (Math.abs(r - y) < Math.abs(b - y) ? r : b), rows[0]);
      const cy = near(o.cy), cx = Math.round(o.cx) + 0.5;
      const at = (a, d) => [cx + Math.cos(a * R2D) * d, cy + Math.sin(a * R2D) * d];
      const off = y => { const r = near(y); if (r !== cy) return r; const i = rows.indexOf(r); return rows[y < cy ? Math.max(0, i - 1) : Math.min(nr - 1, i + 1)]; };
      const rt = clamp(R1 * 0.46, 28, 90), rc = clamp(R1 * 0.055, 5.5, 9), sq = R1 > 110 ? 7 : 6;
      const team = (o.lead ? TEAM : [0]).map(a => at(a, rt));
      const succ = team[0];
      const F = [cx, cy];
      const l0 = [cx, off(cy + clamp(R1 * 0.2, 16, 34))];
      const locs = [l0].concat(LOC.map(([a, f]) => { const p = at(a, f * R1); p[1] = off(p[1]); return p; }));
      const acq = (o.acqAt || ACQ).map(([a, f]) => { const p = at(a, f * R1 * (o.aq || 1)); p[1] = clamp(off(p[1]), my0 + rc + 3, my1 - rc - 3); p[0] = clamp(p[0], mx0 + rc + 4, mx1 - rc - 4); return p; });
      const d2 = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
      const cut = (p, q, a, b) => { const L = d2(p, q) || 1, ux = (q[0] - p[0]) / L, uy = (q[1] - p[1]) / L; return [p[0] + ux * a, p[1] + uy * a, q[0] - ux * b, q[1] - uy * b]; };
      const cross = (a, b) => { const o3 = (p, q, r) => Math.sign((q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0])); const A = [a[0], a[1]], B = [a[2], a[3]], C2 = [b[0], b[1]], Dd = [b[2], b[3]]; return o3(A, B, C2) !== o3(A, B, Dd) && o3(C2, Dd, A) !== o3(C2, Dd, B); };
      const segD = s => `M${f1(s[0])} ${f1(s[1])}L${f1(s[2])} ${f1(s[3])}`;
      const dseg = (s, p) => { const vx = s[2] - s[0], vy = s[3] - s[1], L2 = vx * vx + vy * vy || 1, t = clamp(((p[0] - s[0]) * vx + (p[1] - s[1]) * vy) / L2, 0, 1); return Math.hypot(s[0] + vx * t - p[0], s[1] + vy * t - p[1]); };
      const joined = acq.slice(0, JOIN);
      const used = []; const reachFrom = joined.map(p => { const q = locs.filter(l => used.indexOf(l) < 0).reduce((b, qq) => (d2(qq, p) < d2(b, p) ? qq : b)); used.push(q); return q; });
      const reachS = joined.map((p, i) => cut(reachFrom[i], p, sq, rc + 3));
      const spokeS = o.lead ? team.map(p => cut(F, p, 11, 6)) : [];
      const nodes = locs.slice();
      const cost = (i, j) => { const s = [nodes[i][0], nodes[i][1], nodes[j][0], nodes[j][1]]; let c = d2(nodes[i], nodes[j]);
        if (dseg(s, F) < Math.max(24, rt * 0.55)) c += 1e4; team.forEach(t => { if (dseg(s, t) < 14) c += 1e4; }); spokeS.forEach(k => { if (cross(s, k)) c += 1e4; }); return c; };
      const netE = [];
      { const inT = [0], left = nodes.map((_, i) => i).slice(1);
        while (left.length) { let best = null; inT.forEach(i => left.forEach(j => { const c = cost(i, j); if (!best || c < best[2]) best = [i, j, c]; })); netE.push([best[0], best[1]]); inT.push(best[1]); left.splice(left.indexOf(best[1]), 1); } }
      const netS = netE.map(([i, j]) => cut(nodes[i], nodes[j], sq, sq));
      const netR = Math.max.apply(null, nodes.map(p => d2(F, p))) + rc + 8;
      const rise2 = o.rise, run = rise2 / TAN, sy = succ[1], tipX = o.tip, xt = tipX - run, hs = Math.round(clamp(rise2 * 0.34, 7, 11));
      const hc = [(cx + succ[0]) / 2, Math.min(cy, succ[1]) - Math.max(18, d2(F, succ) * 0.55)];
      const ho = `M${f1(cx)} ${f1(cy)}Q${f1(hc[0])} ${f1(hc[1])} ${f1(succ[0])} ${f1(succ[1])}`;
      const ln = `M${f1(succ[0] + 9)} ${f1(sy)}H${f1(xt)}L${f1(tipX)} ${f1(sy - rise2)}`;
      const hd = `M${f1(tipX - hs)} ${f1(sy - rise2)}H${f1(tipX)}V${f1(sy - rise2 + hs)}`;
      const arcS = []; for (let i = 0; i < 8; i++) { const Pq = t => { const w0 = (1 - t) * (1 - t), w1 = 2 * (1 - t) * t, w2 = t * t; return [w0 * cx + w1 * hc[0] + w2 * succ[0], w0 * cy + w1 * hc[1] + w2 * succ[1]]; }; const a = Pq(i / 8), b = Pq((i + 1) / 8); arcS.push([a[0], a[1], b[0], b[1]]); }
      const ring = r => { const s = []; for (let i = 0; i < 48; i++) { const a = at(i * 7.5, r), b = at((i + 1) * 7.5, r); s.push([a[0], a[1], b[0], b[1]]); } return s; };
      const lineS = reachS.concat(spokeS, netS, arcS, [[succ[0] + 9, sy, xt, sy], [xt, sy, tipX, sy - rise2]], ring(R1));
      const lineS0 = ring(R0);
      const Rn = rnd(o.seed || 23), pts = [];
      const rects = (o.rects || []).map(r => [r[0] - 10, r[1] - 7, r[2] + 10, r[3] + 7]);
      const inRect = (x, y) => rects.some(r => x > r[0] && x < r[2] && y > r[1] && y < r[3]);
      const keep = (x, y) => !(d2([x, y], F) < rt + 14 || locs.some(p => d2(p, [x, y]) < 10) || acq.some(p => d2(p, [x, y]) < rc + 7) ||
        team.some(p => d2(p, [x, y]) < 10) || (Math.abs(y - sy) < 2 && x > succ[0] - 6 && x < xt + 6) || inRect(x, y) ||
        (o.clear || []).some(([y0, x0, x1]) => Math.abs(y - y0) < 2 && x > x0 && x < x1));
      rows.forEach(y => {
        const k = Math.round((mx1 - mx0) / o.dx * (0.75 + Rn() * 0.5)), xs = [];
        for (let j = 0; j < k; j++) xs.push(mx0 + 6 + Rn() * (mx1 - mx0 - 12));
        xs.sort((a, b) => a - b).forEach((x, j) => { if (j && x - xs[j - 1] < 7) return; if (keep(x, y)) pts.push(`M${f1(x)} ${y}h0`); });
      });
      const quiet = rt + 12;
      const rowD = y => { const cuts = rects.filter(r => y > r[1] && y < r[3]).map(r => [r[0], r[2]]); if (Math.abs(y - cy) < quiet) { const dx = Math.sqrt(quiet * quiet - (y - cy) * (y - cy)); cuts.push([cx - dx, cx + dx]); } cuts.sort((a, b) => a[0] - b[0]); let x = mx0, d = '';
        cuts.forEach(([a, b]) => { if (a > x) d += `M${f1(x)} ${y}H${f1(a)}`; x = Math.max(x, b); }); if (x < mx1) d += `M${f1(x)} ${y}H${f1(mx1)}`; return d; };
      return { rows: rows.map(rowD).join(''), pts: pts.join(''), mx1, my1, cx, cy, R0, R1, rc, ra: rc, rt, sq, team, succ, locs, loc: locs.slice(1), acq, joined,
        feeds: reachFrom, reach: reachS.map(segD), tl: spokeS.map(segD).join(''), net: netS.map(segD).join(''), netR, ln, hd, ho, hc, tip: [tipX, sy - rise2], xt, sy,
        nodes, netE, lineS, lineS0 };
    };
    const draw = (box, Wd, Hh, P) => {
      const q = c => $$('.' + c, box), one = c => $('.' + c, box);
      $$('svg', box).forEach(s => { s.setAttribute('width', f1(Wd)); s.setAttribute('height', f1(Hh)); s.setAttribute('viewBox', `0 0 ${f1(Wd)} ${f1(Hh)}`); });
      const pt = (el, p) => { if (!el) return; if (!p) { el.style.display = 'none'; return; } el.style.display = ''; el.setAttribute('cx', f1(p[0])); el.setAttribute('cy', f1(p[1])); };
      const sd = (c, d) => { const e = one(c); if (e) e.setAttribute('d', d); };
      sd('ah-rows', P.rows); sd('ah-pts', P.pts); sd('ah-net', P.net);
      const nc = one('ah-nc'); if (nc) { nc.setAttribute('cx', f1(P.cx)); nc.setAttribute('cy', f1(P.cy)); nc.dataset.r = f1(P.netR); }
      const ter = one('ah-ter'); if (ter) { pt(ter, [P.cx, P.cy]); ter.setAttribute('r', f1(P.R1)); }
      q('ah-ao').forEach((c, i) => { pt(c, P.acq[i]); c.setAttribute('r', f1(P.rc)); });
      q('ah-ad').forEach((c, i) => { pt(c, P.joined[i]); c.setAttribute('r', f1(P.rc + 0.75)); });
      q('ah-ar').forEach((p, i) => p.setAttribute('d', P.reach[i] || ''));
      sd('ah-tl', P.tl); sd('ah-ho', P.ho);
      q('ah-loc').forEach((r, i) => { const p = P.locs[i]; if (!p) { r.style.display = 'none'; return; } r.style.display = ''; r.setAttribute('x', f1(p[0] - P.sq / 2)); r.setAttribute('y', f1(p[1] - P.sq / 2)); r.setAttribute('width', P.sq); r.setAttribute('height', P.sq); });
      q('ah-tm').forEach((c, i) => pt(c, P.team[i]));
      pt(one('ah-fw'), [P.cx, P.cy]); pt(one('ah-pt'), [P.cx, P.cy]);
      sd('ah-ln', P.ln); sd('ah-hd', '');
      // (owners 1.0.1, one brand arrow) the line's head is THE head, the fox's ears (gfArrow.head), at the chart's weight,
      // uncovered from its tip on channel hd; made at the channel's last value, so a re-draw never hides a head already drawn
      q('ah-hd').forEach(p => { const sv = p.ownerSVGElement, A = W.gfArrow; if (!sv) return; const old = AHD.get(sv); if (old) old.remove(); AHD.delete(sv); if (!A) return;
        const dx = P.tip[0] - P.xt, dy = P.tip[1] - P.sy, dl = Math.hypot(dx, dy) || 1, k0 = AHDK.get(sv);
        AHD.set(sv, A.head(sv, P.tip[0], P.tip[1], dx / dl, dy / dl, { len: 12, w: A.CHART, cls: 'ah-head', at: k0 == null ? 1 : k0 })); });
    };
    const AHD = new WeakMap(), AHDK = new WeakMap();
    const ELS = new WeakMap(), MEMO = new WeakMap();
    const els = (box, sel) => { let m = ELS.get(box); if (!m) ELS.set(box, m = {}); return m[sel] || (m[sel] = $$(sel, box)); };
    const put = (el, k, val) => { if (!el) return; let m = MEMO.get(el); if (!m) MEMO.set(el, m = {}); if (m[k] !== val) { m[k] = val; el.style[k] = val; } };
    const putA = (el, k, val) => { if (!el) return; let m = MEMO.get(el); if (!m) MEMO.set(el, m = {}); if (m['@' + k] !== val) { m['@' + k] = val; el.setAttribute(k, val); } };
    const dashM = (p, v) => { v = c01(v); if (v >= 1) { put(p, 'strokeDasharray', ''); put(p, 'strokeDashoffset', ''); put(p, 'opacity', ''); return; } put(p, 'strokeDasharray', '1 2'); put(p, 'strokeDashoffset', (1 - v).toFixed(4)); put(p, 'opacity', v <= 0 ? '0' : ''); };
    const popM = (el, v) => { v = c01(v); put(el, 'opacity', v >= 1 ? '' : v.toFixed(3)); put(el, 'transform', v >= 1 ? '' : 'scale(' + (0.4 + 0.6 * v).toFixed(3) + ')'); };
    const fadeM = (el, v, y) => { v = c01(v); put(el, 'opacity', v >= 1 ? '' : v.toFixed(3)); put(el, 'transform', v >= 1 ? '' : 'translateY(' + ((1 - v) * y).toFixed(1) + 'px)'); };
    const kRise = (el, v) => { if (!el) return; v = c01(v); el.style.transform = v >= 1 ? '' : `translateY(${f1((1 - v) * G.headline.yPercent)}%)`; };
    const kFade = (el, v) => { if (!el) return; v = c01(v); el.style.opacity = v >= 1 ? '' : v.toFixed(3); el.style.transform = v >= 1 ? '' : `translateY(${f1((1 - v) * G.body.y)}px)`; };
    const paintScene = (box, P, v) => {
      if (!P) return;
      const Dr = G.DRAW, q = c => els(box, '.' + c), one = c => els(box, '.' + c)[0];
      const win = (x, a, w) => c01((x - a) / w);
      const m = c01(v('m')), sl = ((1 - m) * 100).toFixed(2);
      put(els(box, O('ah-mkw'))[0], 'transform', m >= 1 ? '' : 'translateX(-' + sl + '%)'); put(els(box, O('ah-mki'))[0], 'transform', m >= 1 ? '' : 'translateX(' + sl + '%)');
      const c = c01(v('c'));
      const locs = q('ah-loc');
      popM(locs[0], c * 1.5);
      q('ah-ao').forEach((el, i) => { const o = c01(c * 1.5 - 0.2 - i * 0.1); put(el, 'opacity', o >= 1 ? '' : o.toFixed(3)); });
      const ter = one('ah-ter'), g = c01(v('g')), s0 = P.R0 / P.R1, sc = s0 + (1 - s0) * g;
      dashM(ter, c); put(ter, 'transform', sc >= 1 ? '' : `scale(${sc.toFixed(4)})`);
      const gl = c01(v('gl')) * 0.8;
      locs.slice(1).forEach((el, i) => popM(el, expo(win(gl, i * 0.1, 0.4))));
      const a = c01(v('a'));
      q('ah-ar').forEach((el, i) => dashM(el, Dr(win(a, i * 0.18, 0.5))));
      q('ah-ad').forEach((el, i) => popM(el, expo(win(a, i * 0.18 + 0.42, 0.4))));
      const l = c01(v('l')) * 0.9, u = c01(v('u'));
      q('ah-tm').forEach((el, i) => popM(el, four ? expo(win(u, 0, 0.3)) : expo(win(l, i * 0.1, 0.4))));
      dashM(one('ah-tl'), Dr(win(l, 0.2, 0.7)));
      const s = c01(v('s')), nc = one('ah-nc'); if (nc) putA(nc, 'r', s >= 1 ? '9999' : f1((+nc.dataset.r || 0) * Dr(s)));
      const mv = Dr(win(u, four ? 0.25 : 0, four ? 0.75 : 1)), w0 = (1 - mv) * (1 - mv), w1 = 2 * (1 - mv) * mv, w2 = mv * mv;
      const bx = w0 * P.cx + w1 * P.hc[0] + w2 * P.succ[0] - P.cx, by = w0 * P.cy + w1 * P.hc[1] + w2 * P.succ[1] - P.cy;
      const gp = one('ah-pt'); if (c * 1.6 < 1 || mv <= 0) popM(gp, c * 1.6); else { put(gp, 'opacity', ''); put(gp, 'transform', `translate(${f1(bx)}px, ${f1(by)}px)`); }
      dashM(one('ah-ho'), mv); popM(one('ah-fw'), expo(win(mv, 0.3, 0.5)));
      dashM(one('ah-ln'), v('ln'));
      { const k = c01(v('hd')); els(box, '.ah-hd').forEach(p => { const sv = p.ownerSVGElement; if (!sv) return; AHDK.set(sv, k); const h = AHD.get(sv); if (h) h.set(k); }); }
    };
    let hover = '', filmFocus = '', shownF = null;
    const applyFocus = () => { const f = filmFocus || hover; if (f === shownF) return; shownF = f; if (f) fig.setAttribute('data-focus', f); else fig.removeAttribute('data-focus'); };
    its.forEach((li, k) => {
      if (!lev[k]) return; li.setAttribute('data-lv', lev[k]); li.tabIndex = 0;
      const on = () => { hover = lev[k]; applyFocus(); }, off = () => { if (hover === lev[k]) { hover = ''; applyFocus(); } };
      li.addEventListener('mouseenter', on); li.addEventListener('mouseleave', off); li.addEventListener('focus', on); li.addEventListener('blur', off);
    });
    const S = {}, names = ['m', 'c', 'g', 'gl', 'a', 'l', 's', 'u', 'ln', 'hd', 'z'];
    for (let k = 0; k < n; k++) names.push('t' + k, 'p' + k, 'r' + k);
    const plans = [];
    const sizeOf = el => { const r = el.getBoundingClientRect(); return [r.width, r.height]; };
    const base = (Wd, Hh, extra) => Object.assign({ sp: Hh > 300 ? 22 : 17, dx: Hh > 300 ? 21 : 16, lead, seed: 23, rise: clamp(Hh * 0.08, 18, 34) }, extra);
    const notesOf = box => $$(O('avh-note'), box);
    const placeNotes = (box, P, Wd, Hh, today, pre) => {
      const C = [[P.cx, P.cy, 9]].concat(P.locs.map(p => [p[0], p[1], P.sq]), P.acq.map(p => [p[0], p[1], P.rc + 2]));
      if (!today) { C.push([P.succ[0], P.succ[1], 9]); P.team.forEach(p => C.push([p[0], p[1], 6])); }
      const segs = today ? [] : P.lineS.slice(0, -48), ring = today ? P.lineS0 : P.lineS.slice(-48), placed = (pre || []).slice(), out = (pre || []).slice();
      const hits = (x0, y0, x1, y1) => { let k = 0; const pad = 4;
        C.forEach(([x, y, r]) => { if (x > x0 - r - pad && x < x1 + r + pad && y > y0 - r - pad && y < y1 + r + pad) k++; });
        const on = s => { const L = Math.hypot(s[2] - s[0], s[3] - s[1]), kk = Math.max(1, Math.ceil(L / 4)); for (let i = 0; i <= kk; i++) { const x = s[0] + (s[2] - s[0]) * i / kk, y = s[1] + (s[3] - s[1]) * i / kk; if (x > x0 - pad && x < x1 + pad && y > y0 - pad && y < y1 + pad) return true; } return false; };
        segs.forEach(s => { if (on(s)) k++; }); if (ring.some(on)) k++;
        placed.forEach(q => { if (x0 < q[2] + 10 && q[0] < x1 + 10 && y0 < q[3] + 6 && q[1] < y1 + 6) k += 50; else if (x0 < q[2] + 36 && q[0] < x1 + 36 && y0 < q[3] + 18 && q[1] < y1 + 18) k += 0.3; });
        if (x0 < 2 || y0 < 2 || x1 > Wd - 2 || y1 > Hh - 2) k += 20; return k; };
      const X = (a, b) => { const o3 = (p, q, s) => Math.sign((q[0] - p[0]) * (s[1] - p[1]) - (q[1] - p[1]) * (s[0] - p[0])); return o3([a[0], a[1]], [a[2], a[3]], [b[0], b[1]]) !== o3([a[0], a[1]], [a[2], a[3]], [b[2], b[3]]) && o3([b[0], b[1]], [b[2], b[3]], [a[0], a[1]]) !== o3([b[0], b[1]], [b[2], b[3]], [a[2], a[3]]); };
      const leadCost = (A, r, x0, y0, w, h) => { const tx = clamp(A[0], x0, x0 + w), ty = clamp(A[1], y0, y0 + h), L = Math.hypot(tx - A[0], ty - A[1]); if (L <= r + 12) return 0;
        const s = [A[0] + (tx - A[0]) / L * (r + 3), A[1] + (ty - A[1]) / L * (r + 3), tx, ty]; let k = 0;
        segs.forEach(q => { if (Math.hypot(q[0] - A[0], q[1] - A[1]) > r + 6 && Math.hypot(q[2] - A[0], q[3] - A[1]) > r + 6 && X(s, q)) k++; });
        C.forEach(([x, y, rr]) => { if (Math.hypot(x - A[0], y - A[1]) > 2) { const vx = s[2] - s[0], vy = s[3] - s[1], t = clamp(((x - s[0]) * vx + (y - s[1]) * vy) / (vx * vx + vy * vy || 1), 0, 1); if (Math.hypot(s[0] + vx * t - x, s[1] + vy * t - y) < rr + 2) k++; } }); return k; };
      const netMids = () => { const m = P.netE.map(([i, j]) => [(P.nodes[i][0] + P.nodes[j][0]) / 2, (P.nodes[i][1] + P.nodes[j][1]) / 2]); return m.length ? m.sort((a, b) => b[1] - a[1]) : [[P.cx, P.cy + P.R1 * 0.7]]; };
      const spec = {
        founder: [[[P.cx, P.cy]], 7, ['r', 'ur', 'dr', 'u', 'l']],
        location: [[P.locs[0]], 5, ['l', 'dl', 'r', 'dr', 'd']],
        rivals: [P.acq, P.rc + 2, ['r', 'u', 'ur', 'l', 'ul']],
        g: [P.locs.slice(1).filter(p => P.feeds.indexOf(p) < 0).sort((p, q) => p[1] - q[1]), 5, ['u', 'ur', 'ul', 'r', 'l', 'd']],
        a: [[P.joined.reduce((s, p) => [s[0] + p[0] / P.joined.length, s[1] + p[1] / P.joined.length], [0, 0])], 0, ['l', 'ul', 'dl', 'u', 'd'], P.joined],
        l: [P.team.length > 2 ? [P.team[2], P.team[1]] : [P.team[0]], 5, ['ul', 'u', 'l', 'dl']],
        s: [netMids(), 3, ['d', 'dl', 'dr', 'l', 'r']],
        u: [[P.succ], 9, ['ur', 'u', 'dr', 'r']]
      };
      const lds = $$('.ah-nl', box); lds.forEach(p => p.setAttribute('d', ''));
      const U = { r: [1, 0], l: [-1, 0], u: [0, -1], d: [0, 1], ur: [0.72, -0.72], ul: [-0.72, -0.72], dr: [0.72, 0.72], dl: [-0.72, 0.72] };
      const ORDER = ['u', 'l', 'founder', 'location', 'a', 'g', 'rivals', 's'];
      notesOf(box).map((el, k) => [el, k]).sort((x, y) => ORDER.indexOf(x[0].getAttribute('data-n')) - ORDER.indexOf(y[0].getAttribute('data-n'))).forEach(([el, k]) => {
        const sp = spec[el.getAttribute('data-n')]; if (!sp) return; const As = sp[0], r = sp[1], dirs = sp[2], T = sp[3], w = el.offsetWidth, h = el.offsetHeight; let A = As[0];
        const reach = (t, x0, y0) => Math.hypot(clamp(t[0], x0, x0 + w) - t[0], clamp(t[1], y0, y0 + h) - t[1]);
        const lcost = (x0, y0) => (T ? T.reduce((s, t) => s + leadCost(t, P.rc + 2, x0, y0, w, h) + (reach(t, x0, y0) > 80 ? 1 : 0), 0) : leadCost(A, r, x0, y0, w, h));
        let best = null;
        const all = dirs.concat(Object.keys(U).filter(d => dirs.indexOf(d) < 0));
        As.filter(Boolean).forEach((AA, ai) => { A = AA; (T ? [36, 48, 60, 76, 96, 120] : [8, 16, 24, 34, 44, 56, 68, 82, 96, 112, 128, 148]).forEach(gap => all.forEach(dn => [0, -0.35, 0.35, -0.7, 0.7].forEach(sl => {
          const ux = U[dn][0], uy = U[dn][1], ex = A[0] + ux * (r + gap), ey = A[1] + uy * (r + gap);
          const sx = Math.abs(uy) > 0.9 ? sl * w : 0, sy2 = Math.abs(ux) > 0.9 ? sl * h * 1.6 : 0;
          const x0 = clamp((ux > 0.1 ? ex : ux < -0.1 ? ex - w : ex - w / 2) + sx, 2, Wd - 2 - w), y0 = clamp((uy > 0.1 ? ey : uy < -0.1 ? ey - h : ey - h / 2) + sy2, 2, Hh - 2 - h);
          const inside = !today && Math.hypot(x0 + w / 2 - P.cx, y0 + h / 2 - P.cy) < P.R1 ? 350 : 0;
          const nh = hits(x0, y0, x0 + w, y0 + h), sc = nh * 1000 + lcost(x0, y0) * 400 + inside + gap + all.indexOf(dn) * 3 + Math.abs(sl) * 12;
          if (!best || sc + ai * 6 < best.sc) best = { sc: sc + ai * 6, nh, x0, y0, A: AA };
        }))); });
        if (!best) return;
        A = best.A;
        const x0 = best.x0, y0 = best.y0; placed.push([x0, y0, x0 + w, y0 + h]); out.push([x0, y0, x0 + w, y0 + h]);
        el.style.left = f1(x0) + 'px'; el.style.top = f1(y0) + 'px'; el.setAttribute('data-hits', best.nh);
        let d = '';
        (T || [A]).forEach(t => { const rr = T ? P.rc + 2 : r; if (reach(t, x0, y0) <= rr + 12) return;
          const side = T ? (A[0] > x0 + w ? 'r' : A[0] < x0 ? 'l' : A[1] < y0 ? 't' : 'b') : null;
          const tx = side === 'r' ? x0 + w + 4 : side === 'l' ? x0 - 4 : side ? clamp(A[0], x0 + 10, x0 + w - 10) : clamp(t[0], x0, x0 + w);
          const ty = side === 'r' || side === 'l' ? y0 + h * 0.5 : side === 't' ? y0 - 3 : side === 'b' ? y0 + h + 3 : t[1] < y0 ? y0 : t[1] > y0 + h ? y0 + h : y0 + h * 0.5, L = Math.hypot(tx - t[0], ty - t[1]) || 1;
          const sx = t[0] + (tx - t[0]) / L * (rr + 3), sy = t[1] + (ty - t[1]) / L * (rr + 3), exx = tx - (tx - t[0]) / L * 5, eyy = ty - (ty - t[1]) / L * 5;
          d += `M${f1(sx)} ${f1(sy)}L${f1(exx)} ${f1(eyy)}`; });
        if (lds[k]) { lds[k].setAttribute('d', d); lds[k].setAttribute('data-lv', el.getAttribute('data-n')); }
      });
      return out;
    };
    let lastK = '';
    const layout = () => {
      const st = stacked();
      const sz0 = sizeOf(draws[0]), sz1 = sizeOf(draws[1]), Wt = sz0[0], Ht = sz0[1], Wn = sz1[0], Hn = sz1[1];
      if (!Wt || !Wn) return;
      const memo = [Wt, Ht, Wn, Hn].map(Math.round).join() + '|' + draws.map(d => notesOf(d).map(e => e.offsetWidth).join()).join('|');
      if (memo === lastK && plans[0] && plans[1]) return;
      lastK = memo;
      const R1 = Math.min(Hn * 0.36, Wn * (st ? 0.28 : 0.24));
      const pn = base(Wn, Hn, { acqAt: st ? ACQ_PHONE : null, cx: Wn * (st ? 0.46 : 0.45), cy: Hn * 0.5, R1, box: [0, Math.round(Hn * 0.04), Wn - 4, Math.round(Hn * 0.96)], tip: Wn - 2 });
      const cxT = Wt * (st ? 0.4 : 0.5), aqT = Math.min(1, (Math.min(cxT, Wt - cxT) - 12) / (R1 * 1.34), (Ht / 2 - 16) / (R1 * 1.3 * 0.8));
      const ptd = base(Wt, Ht, { acqAt: st ? ACQ_PHONE : null, cx: cxT, cy: Ht * 0.5, R1, aq: aqT, box: [0, Math.round(Ht * 0.04), Wt, Math.round(Ht * 0.96)], tip: Wt - 2, seed: 41 });
      [[ptd, Wt, Ht, 0], [pn, Wn, Hn, 1]].forEach(([o, Wd, Hh, k]) => {
        const cap = draws[k].parentElement.querySelector(O('avh-cap')), pre = [];
        if (cap && getComputedStyle(cap).position === 'absolute') { const a = cap.getBoundingClientRect(), d = draws[k].getBoundingClientRect(); pre.push([a.left - d.left, a.top - d.top, a.right - d.left, a.bottom - d.top]); }
        const P = plan(o), rects = placeNotes(draws[k], P, Wd, Hh, k === 0, pre);
        o.rects = rects; plans[k] = plan(o); draw(draws[k], Wd, Hh, plans[k]);
      });
    };
    const paint = () => {
      const v = c => nv(S[c], 1);
      const still = c => ((c === 'm' || c === 'c') ? v(c) : 0);
      paintScene(draws[0], plans[0], still); paintScene(draws[1], plans[1], v);
      const win = (x, a, w) => c01((x - a) / w), Dr = G.DRAW;
      const at = { founder: win(v('c'), 0.45, 0.55), location: win(v('c'), 0.55, 0.45), rivals: win(v('c'), 0.65, 0.35),
        g: win(v('gl'), 0.3, 0.6), a: win(v('a'), 0.55, 0.45), l: win(v('l'), 0.45, 0.55), s: win(v('s'), 0.45, 0.55), u: win(v('u'), 0.6, 0.4) };
      draws.forEach(bx => { const lds = els(bx, '.ah-nl'); els(bx, O('avh-note')).forEach((el, k) => { const t = nv(at[el.getAttribute('data-n')], 1); fadeM(el, expo(t), 6); if (lds[k]) dashM(lds[k], Dr(t)); }); });
      let lit = '';
      for (let k = 0; k < n; k++) {
        kRise(ti[k], S['t' + k]); kFade(ps[k], S['p' + k]);
        if (!stacked()) { const nx = k < n - 1 ? c01(nv(S['t' + (k + 1)], 1) * 2.5) : 0, o = 1 - 0.6 * nx * (1 - c01(nv(S.z, 1))); its[k].style.opacity = o >= 0.999 ? '' : o.toFixed(3); } else its[k].style.opacity = '';
        const tk = nv(S['t' + k], 1); if (lev[k] && tk > 0 && (stacked() ? tk < 1 : c01(nv(S.z, 1)) < 1)) lit = lev[k];
        const r = c01(nv(S['r' + k], 1));
        its[k].style.setProperty('--avh-rl', r >= 1 ? '' : r.toFixed(4));
      }
      if (lit !== filmFocus) { filmFocus = lit; applyFocus(); }
    };
    const lever = (ch, L, b) => {
      const Dr = G.DRAW, E = G.SETTLE, A = G.arrow.duration;
      if (L === 'g') { ch('g', b + 0.1, 0.8, E); ch('gl', b + 0.4, 0.8, 'none'); }
      if (L === 'a') ch('a', b + 0.1, 1.0, 'none');
      if (L === 'l') ch('l', b + 0.1, 0.9, 'none');
      if (L === 's') ch('s', b + 0.1, 0.85, Dr);
      if (L === 'u') { ch('u', b + 0.1, 0.75, 'none'); ch('ln', b + 0.6, 0.45, Dr); ch('hd', b + 0.9, 0.5, 'power3.out'); }
    };
    const words = (ch, k, b, ph) => { ch('t' + k, b, G.headline.duration, G.SETTLE); ch('p' + k, b + (ph ? 0.2 : 0.15), G.body.duration, G.SETTLE); ch('r' + k, b + 0.3, G.hairline.duration * 0.55, G.DRAW); };
    const film = ch => {
      const STEP = n > 4 ? 0.5 : 0.62, B0 = 0.5;
      ch('m', 0, 0.6, G.DRAW); ch('c', 0.2, 0.55, G.SETTLE);
      for (let k = 0; k < n; k++) { const b = B0 + STEP * k; words(ch, k, b); if (lev[k]) lever(ch, lev[k], b); }
      if (lev.indexOf('u') < 0) { ch('ln', B0 + STEP * n, 0.45, G.DRAW); ch('hd', B0 + 0.3 + STEP * n, 0.5, 'power3.out'); }
      ch('z', B0 + STEP * (n - 1) + 1.0, 0.6, G.SETTLE);
    };
    const parts = () => [[$(O('avh-pair'), room) || draws[0], ch => { ch('m', 0, 0.6, G.DRAW); ch('c', 0.2, 0.55, G.SETTLE); }]]
      .concat(its.map((li, k) => [li, ch => { words(ch, k, 0, true); if (lev[k]) lever(ch, lev[k], 0);
        if (k === n - 1 && lev.indexOf('u') < 0) { ch('ln', 0.6, 0.55, G.DRAW); ch('hd', 1.0, 0.5, 'power3.out'); } }]));
    const one = () => names.forEach(c => { S[c] = 1; }), zero = () => names.forEach(c => { S[c] = 0; });
    const relayout = () => { safe('partnership layout', layout); paint(); };
    one(); relayout();
    let rz = 0; W.addEventListener('resize', () => { cancelAnimationFrame(rz); rz = requestAnimationFrame(() => { lastK = ''; relayout(); }); });
    if (D.fonts && D.fonts.ready) D.fonts.ready.then(() => { lastK = ''; relayout(); });
    if (!live) return;
    ST.addEventListener('refresh', () => requestAnimationFrame(relayout));
    const trk = $(O('av-track'), room) || room;
    const holdPx = () => Math.max(1, trk.offsetHeight - W.innerHeight);
    const top = () => flowY(room);
    const chIn = tl => (name, at, dur, ease) => tl.fromTo(S, { [name]: 0 }, { [name]: 1, duration: dur, ease: ease || G.SETTLE, immediateRender: false }, at);
    const mm = gsap.matchMedia();
    mm.add(HOLDQ, () => {
      if (!H.classList.contains('gfx-hold')) { one(); paint(); return undefined; }
      zero(); relayout();
      const tl = gsap.timeline({ paused: true, onUpdate: paint });
      film(chIn(tl));
      let ffTw = null;
      const play = () => { if (tl.progress() < 1 && !tl.isActive() && !(ffTw && ffTw.isActive())) tl.play(); };
      const ff = () => { if (tl.progress() >= 1) return; tl.pause(); ffTw = gsap.to(tl, { progress: 1, duration: G.fastForward, ease: 'power1.out', onUpdate: paint }); };
      const reset = () => { if (ffTw) ffTw.kill(); ffTw = null; tl.pause(0); zero(); paint(); };
      const sts = [
        ST.create({ start: () => top() - W.innerHeight * 0.05, end: () => top(), onEnter: play }),
        ST.create({ start: () => top() + holdPx() + Math.round(W.innerHeight * 0.33), end: () => top() + holdPx() + Math.round(W.innerHeight * 0.33) + 1, onEnter: ff }),
        ST.create({ start: () => top() - W.innerHeight, end: () => top(), onLeaveBack: reset })
      ];
      requestAnimationFrame(() => safe('partnership arrival', () => { const t = top() - W.scrollY; if (t < -(holdPx() + W.innerHeight * 0.33)) { tl.progress(1); paint(); } else if (t < W.innerHeight * 0.05) play(); }));
      return () => { sts.forEach(s => s.kill()); if (ffTw) ffTw.kill(); tl.kill(); one(); paint(); };
    });
    mm.add(SHORT, () => {
      zero(); relayout();
      const tl = gsap.timeline({ paused: true, onUpdate: paint });
      film(chIn(tl));
      const at = () => top() - W.innerHeight * 0.62;
      const st = ST.create({ start: at, end: () => at() + 1, onEnter: () => tl.play(), onLeave: () => { tl.progress(1); paint(); } });
      return () => { st.kill(); tl.kill(); one(); paint(); };
    });
    mm.add(STACK, () => {
      zero(); relayout();
      const made = [], tls = [];
      let nextAt = 0;
      const queue = tl => { const now = performance.now() / 1000, d = Math.max(0, nextAt - now); nextAt = Math.max(now, nextAt) + 0.24; if (d) gsap.delayedCall(d, () => { if (tl.progress() < 1) tl.play(); }); else tl.play(); };
      parts().forEach(([el, build]) => {
        const tl = gsap.timeline({ paused: true, onUpdate: paint }); build(chIn(tl)); tls.push(tl);
        const at = () => flowY(el) - W.innerHeight * 0.82;
        made.push(ST.create({ start: at, end: () => at() + 1, onEnter: s => { queue(tl); s.kill(); }, onLeave: s => { tl.progress(1); paint(); s.kill(); } }));
      });
      return () => { made.forEach(s => s.kill()); tls.forEach(t => t.kill()); one(); paint(); };
    });
    refresh();
  }
  // the partnership room's head, as on staging: its headline's lines rise and its paragraph follows as it arrives
  function avHeadInit() {
    const room = R.av; if (!room) return;
    const h2 = $(O('ow-h2'), room); if (!h2) return;
    gfx.room({ trigger: $(O('ow-open'), room) || h2, headline: h2, body: $(O('ow-lead'), room) });
  }

  /* ========================= the second bite (ow-flow2.js bite) =========================
     The room settles as it arrives; the two rows rise into their grid (row one, then row two; within a row, the cells
     settle left to right); the green line draws from $3M along the room's floor and turns up at the fox's angle into the
     house head at $13.4M, linked to the scroll; the total and the note follow. */
  const pen = (pts, width) => {
    const dense = [];
    for (let i = 0; i < pts.length - 1; i++) { const [x0, y0] = pts[i], [x1, y1] = pts[i + 1], L = Math.hypot(x1 - x0, y1 - y0), k = Math.max(1, Math.round(L / 2)); for (let j = 0; j < k; j++) dense.push([x0 + (x1 - x0) * j / k, y0 + (y1 - y0) * j / k]); }
    dense.push(pts[pts.length - 1]);
    const K = 5, sm = dense.map((p, i) => { if (i < K || i > dense.length - 1 - K) return p; let x = 0, y = 0; for (let j = -K; j <= K; j++) { x += dense[i + j][0]; y += dense[i + j][1]; } return [x / (2 * K + 1), y / (2 * K + 1)]; });
    let s = 0; const len = [0]; for (let i = 1; i < sm.length; i++) { s += Math.hypot(sm[i][0] - sm[i - 1][0], sm[i][1] - sm[i - 1][1]); len.push(s); }
    const Lt = s || 1, Lft = [], Rt = [];
    sm.forEach((p, i) => {
      const a = sm[Math.max(0, i - 1)], b = sm[Math.min(sm.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l;
      const wv = width(len[i], Lt, p) / 2;
      Lft.push(`${(p[0] + nx * wv).toFixed(2)} ${(p[1] + ny * wv).toFixed(2)}`); Rt.push(`${(p[0] - nx * wv).toFixed(2)} ${(p[1] - ny * wv).toFixed(2)}`);
    });
    const step = Math.max(1, Math.floor(sm.length / 160));
    const centre = 'M' + sm.filter((_, i) => i % step === 0 || i === sm.length - 1).map(p => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' L');
    return { shape: 'M' + Lft.join(' L') + ' L' + Rt.reverse().join(' L') + ' Z', centre, length: Lt };
  };
  let penId = 0;
  const penSVG = cls => {
    const id = 'gfx-ow3-pm' + (++penId);
    const svg = D.createElementNS(NS, 'svg'); svg.setAttribute('class', 'gfx-ow3-pen ' + cls); svg.setAttribute('aria-hidden', 'true'); svg.setAttribute('focusable', 'false');
    svg.innerHTML = `<defs><mask id="${id}" maskUnits="userSpaceOnUse"><path class="gfx-ow3-pen-m" pathLength="1" fill="none" stroke="#fff" stroke-width="14" stroke-linecap="butt" stroke-linejoin="round"/></mask></defs><path class="gfx-ow3-pen-s" mask="url(#${id})"/>`;
    return svg;
  };
  let biteApi = null;
  function biteBuild(live) {
    const room = R.ret; if (!room) return null;
    const h2 = $('h2', room), lede = $(O('ow-lead'), room), rule = $(O('ow-rule'), room);
    const eqs = $$(O('rv-eq') + ' > *', room), stake = $(O('rv-figs'), room);
    const fs = $$(O('rv-f'), room), kept = fs[0], later = fs[1];
    const tot = $(O('rv-tot'), room), note = $(O('rv-note'), room);
    if (!stake || !kept || !later) return null;
    const kv = $(O('rv-pv'), kept), kk = $(O('rv-k'), kept), lv = $(O('rv-pv'), later), lk = $(O('rv-k'), later);
    const api = { head: null };
    const hl = () => (api.head ? api.head.lines : []);
    const svg = penSVG('gfx-ow3-bite-line'); stake.insertBefore(svg, stake.firstChild);
    let hd = null, headK = live ? 0 : 1;
    const place = () => {
      const Wd = stake.clientWidth, Hh = stake.clientHeight; if (!Wd || !Hh) return;
      svg.setAttribute('width', Wd); svg.setAttribute('height', Hh); svg.setAttribute('viewBox', `0 0 ${Wd} ${Hh}`);
      const a = rel(kv, stake), b = rel(lv, stake);
      const y0 = a.t + a.h * 0.62, yEnd = b.t + b.h * 0.66;
      const x0 = a.r + 28, xEnd = b.l - 26;
      let up = y0 - yEnd, run = up / TAN;
      if (xEnd - run < x0 + 60) { run = Math.max(40, xEnd - x0 - 60); up = run * TAN; }
      const xTurn = xEnd - run, yE = y0 - up;
      const P = pen([[x0, y0], [xTurn, y0], [xEnd, yE]], (s, Lt) => (1.5 + 1.4 * Math.exp(-s / 14)) * (0.82 + 0.18 * clamp((Lt - s) / 120, 0, 1)));
      $('.gfx-ow3-pen-s', svg).setAttribute('d', P.shape); $('.gfx-ow3-pen-m', svg).setAttribute('d', P.centre);
      if (hd) hd.remove(); hd = null;
      if (W.gfArrow) { const dl = Math.hypot(xEnd - xTurn, yE - y0) || 1; hd = W.gfArrow.head(svg, xEnd, yE, (xEnd - xTurn) / dl, (yE - y0) / dl, { len: 12, w: W.gfArrow.CHART, at: headK }); }
    };
    place();
    const m = $('.gfx-ow3-pen-m', svg);
    const masks = eqs.map(el => el.querySelector('.gfx-ow3-m > span'));
    const update = (E, Rr, Dd) => {
      rise(hl(), eo(clamp(E * 1.45, 0, 1)));
      show(lede, eo(clamp(E * 1.45 - 0.3, 0, 1)), 14);
      if (rule) css(rule, 'transform', `scaleX(${eo(clamp(E * 1.45 - 0.45, 0, 1)).toFixed(4)})`);
      eqs.forEach((el, i) => { const r = i < 7 ? 0 : 1, c = i % 7, k = eo(clamp(Rr * 1.9 - r * 0.45 - c * 0.05, 0, 1)); if (masks[i]) { rise([masks[i]], k); css(el, 'opacity', '1'); } else show(el, k, 8); });
      show(kv, eo(clamp(Dd * 4, 0, 1)), 12); show(kk, eo(clamp(Dd * 4 - 0.3, 0, 1)), 8);
      css(m, 'stroke-dashoffset', (1 - clamp(Dd / 0.82, 0, 1)).toFixed(4));
      headK = eo(seg(Dd, 0.8, 0.9)); if (hd) hd.set(headK);
      show(lv, eo(seg(Dd, 0.72, 0.9)), 16); show(lk, eo(seg(Dd, 0.8, 0.95)), 8);
      show(tot, eo(seg(Dd, 0.86, 1)), 10); show(note, eo(seg(Dd, 0.9, 1)), 10);
    };
    W.addEventListener('resize', () => requestAnimationFrame(place));
    D.addEventListener('gfx:resplit', () => requestAnimationFrame(place));
    if (D.fonts && D.fonts.ready) D.fonts.ready.then(place);
    return Object.assign(api, { room, h2, stake, place, update, eq: $(O('rv-eq'), room) });
  }
  function biteInit() {
    const B = biteApi; if (!B) return;
    if (B.h2) { B.head = gfx.lineSplit(B.h2); B.head.played = true; }
    let E = 0, Rr = 0, Dd = 0;
    const up = () => B.update(E, Rr, Dd);
    ST.create({ trigger: B.room, start: 'top bottom', end: 'top 12%', onUpdate: s => { E = s.progress; up(); }, onRefresh: s => { E = s.progress; } });
    if (B.eq) ST.create({ trigger: B.eq, start: 'top 92%', end: 'top 58%', onUpdate: s => { Rr = s.progress; up(); }, onRefresh: s => { Rr = s.progress; } });
    // (Flow 3: $13.4M lands with the whole room, equations and chart, inside the screen)
    ST.create({ trigger: B.stake, start: 'top 86%', end: () => (phone() ? 'bottom 70%' : 'bottom 93%'), onUpdate: s => { Dd = s.progress; up(); }, onRefresh: s => { Dd = s.progress; } });
    ST.addEventListener('refresh', () => { B.place(); up(); });
    D.addEventListener('gfx:resplit', () => requestAnimationFrame(up));
    up();
  }

  /* ========================= the questions (ow-flow2.js questions + gf-site.js f) =========================
     One answer open at a time: opening a question closes the open one in the same list; the clicked question stays where
     it is on the screen while one above it closes. Each row's hairline draws in from the left as it arrives. */
  function questionsWire() {
    const room = R.qs; if (!room) return null;
    const items = $$(O('ow-acc-item'), room);
    let hold = 0;
    items.forEach(it => {
      const b = $(O('ow-acc-b'), it); if (!b) return;
      const toggle = () => {
        const open = !it.classList.contains('is-open');
        if (open) {
          const others = items.filter(x => x !== it && x.classList.contains('is-open'));
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
        setTimeout(refresh, 700);
      };
      b.addEventListener('click', toggle);
      // (the Webflow element is a DOM button: Enter and Space are the button's own)
      if (b.tagName !== 'BUTTON') { b.setAttribute('role', 'button'); b.tabIndex = 0; b.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } }); }
    });
    return { room, items };
  }
  function questionsInit(Q) {
    if (!Q) return;
    const room = Q.room, h2 = $('h2', room), more = $(O('ow-more'), room), acc = $(O('ow-acc'), room);
    const head = h2 ? gfx.lineSplit(h2) : null; if (head) head.played = true;
    const update = (E, Rr) => {
      rise(head ? head.lines : [], eo(clamp(E * 1.5, 0, 1))); show(more, eo(clamp(E * 1.5 - 0.35, 0, 1)), 10);
      Q.items.forEach((it, i) => { const k = eo(clamp(Rr * 1.7 - i * 0.14, 0, 1)); css(it, '--ow-rl', k.toFixed(3)); show($(O('ow-acc-h'), it), k, 10); });
      if (acc) css(acc, '--ow-rl', eo(clamp(Rr * 1.7 - Q.items.length * 0.14, 0, 1)).toFixed(3));
    };
    let E = 0, Rr = 0;
    ST.create({ trigger: room, start: 'top 92%', end: 'top 45%', onUpdate: s => { E = s.progress; update(E, Rr); }, onRefresh: s => { E = s.progress; } });
    if (acc) ST.create({ trigger: acc, start: 'top 88%', end: 'bottom 70%', onUpdate: s => { Rr = s.progress; update(E, Rr); }, onRefresh: s => { Rr = s.progress; } });
    D.addEventListener('gfx:resplit', () => requestAnimationFrame(() => update(E, Rr)));
    update(E, Rr);
  }

  /* ========================= the close (gf-site.js e + ow-flow2.js close) =========================
     The headline and its lede rise as the close arrives; the house underline on its last word turns up into the arrow
     (gfArrow, drawn once as it reaches 72 %); the action arrives with it; the doors are type. While footer I's green call
     is in view and the close has mostly left, the close's arrow and its action step back (one green call in view). */
  let closeMark = null;
  function closeMarkInit(still) {
    const room = R.close; if (!room || !W.gfArrow) return;
    const h2 = $('h2', room), host = $(O('ow-open'), room) || (h2 && h2.parentElement); if (!h2 || !host) return;
    const mark = W.gfArrow.word({ el: h2, host, cls: 'gfx-ow3-close-mark', auto: false });
    if (!mark) return;
    closeMark = mark;
    if (still) { mark.still(); room.classList.add('gfx-ow3-in'); return; }
    ST.create({ trigger: host, start: 'top 72%', once: true, onEnter: () => { mark.draw(0.35); room.classList.add('gfx-ow3-in'); } });
    let near = false, rq = 0;
    const seenFa = fa => { const b = fa.getBoundingClientRect(); if (!(b.width > 0 && b.top < W.innerHeight && b.bottom > 0)) return false; const x = Math.min(W.innerWidth - 1, Math.max(0, b.left + b.width / 2)), y = Math.min(W.innerHeight - 1, Math.max(0, b.top + b.height / 2)), e = D.elementFromPoint(x, y); return !!(e && e.closest('.footer_section_wrapper')); };
    const check = () => { rq = 0; const fa = $('.gfx-fi-act'); if (!fa) return; const cr = room.getBoundingClientRect(), k = Math.max(0, Math.min(cr.bottom, W.innerHeight) - Math.max(cr.top, 0)) / (cr.height || 1); room.classList.toggle('gfx-ow3-rest', near && k <= 0.4 && seenFa(fa)); };
    const ask = () => { if (near && !rq) rq = requestAnimationFrame(check); };
    if ('IntersectionObserver' in W) new IntersectionObserver(es => es.forEach(e => { near = e.isIntersecting; ask(); })).observe(room);
    W.addEventListener('scroll', ask, { passive: true }); W.addEventListener('resize', ask);
  }
  function closeInit() {
    const room = R.close; if (!room) return;
    const h2 = $('h2', room), lede = $(O('ow-lead'), room);
    const head = h2 ? gfx.lineSplit(h2) : null; if (head) head.played = true;
    const hl = () => (head ? head.lines : []);
    gsap.set(hl(), { yPercent: 106 }); if (lede) gsap.set(lede, { opacity: 0, y: 14 });
    const mk = () => gsap.timeline({ paused: true })
      .fromTo(hl(), { yPercent: 106 }, { yPercent: 0, duration: 1.4, ease: 'expo.out', stagger: 0.09 }, 0)
      .fromTo([lede].filter(Boolean), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 1.4, ease: 'expo.out' }, 0.2);
    let tl = mk();
    ST.create({ trigger: room, start: 'top 78%', onEnter: () => tl.play(), onLeaveBack: () => tl.reverse() });
    D.addEventListener('gfx:resplit', () => { const p = tl.progress(), fwd = !tl.reversed(); tl.kill(); tl = mk(); tl.progress(p); if (p > 0 && p < 1) { if (fwd) tl.play(); else tl.reverse(); } });
    if (room.getBoundingClientRect().top < W.innerHeight * 0.78) tl.progress(1);
  }

  /* ========================= reduced motion / no library: every room settled ========================= */
  function still() {
    gsap = W.gsap || null; ST = W.ScrollTrigger || null;
    H.classList.add('gfx-ow3-hero-on', 'gfx-ow3-still');
    if (callApi) { callApi.one(); callApi.relayout(); }
    safe('partnership still', () => avInit(false));
    if (biteApi) { biteApi.place(); biteApi.update(1, 1, 1); }
    if (R.close) R.close.classList.add('gfx-ow3-in');
    if (W.gfArrow) closeMarkInit(true);
  }

  gfx.page({
    field,
    foot: { close: O('ow-close') },
    fox: O('ow-close') + ' ' + O('ow-close-fox'),
    dom: () => {
      safe('dom', dom);
      safe('call build', () => { callApi = callBuild(); });
      safe('bite build', () => { biteApi = biteBuild(!REDUCE); });
      safe('questions', () => { questionsWire(); });
    },
    start: () => {
      gsap = gfx.gsap; ST = gfx.ST;
      safe('hero', heroInit);
      safe('slide', () => slide(R.hero, R.proc, 0.06, R.hero && $(O('ow-hero-pic'), R.hero)));
    },
    rooms: () => {
      safe('call', callInit);
      safe('partnership', () => avInit(true));
      safe('partnership head', avHeadInit);
      safe('bite', biteInit);
      safe('questions motion', () => questionsInit({ room: R.qs, items: R.qs ? $$(O('ow-acc-item'), R.qs) : [] }));
      safe('close', closeInit);
    },
    late: () => { safe('close mark', () => closeMarkInit(false)); },
    still
  });
})();
