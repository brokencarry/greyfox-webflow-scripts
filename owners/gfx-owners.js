/*!
 * Grey Fox · gfx Owners (Flow 3), the Business Owners layer on the shared core (core/gfx-core.js).
 * owners 1.1.0 · 2026-10-20 (1.1.0: the partnership room is B v7, the founder's approved design, and the second bite room is
 * gone, its figures now in the partnership's table; 1.0.1: the call's arrow is the house head; the owner's words always fit
 * their frame) · Webflow page "Business Owners v2" (/business-owners-v2, 6ace925aabbdb42421fe3cb6).
 *
 * WHAT IT IS
 *   The approved local Flow 3 Owners (prototype/owners/index.html, Flow 3 the default: ow-flow2.js + ow-flow2.css with
 *   gf-site.js, gf-turn.js, gf-flow2-base.css and footer I), its own rooms only; everything every page shares (the field,
 *   the turn, the bar, the arrow, footer I, the close's fox) is the core's. The DOM is Webflow's own (gfx- classes, every
 *   element also carrying data-o="<the local classes>", see audit/webflow-build/f3-owners-map.md); this layer animates it
 *   and draws only what is decoration (the call's drawing, the partnership's map film, the close's arrow).
 *
 * THE ROOMS (paper throughout; the one turn is into the close and footer I)
 *   hero         the copy kept, the headline on the display rule rising line by line as the page opens; the still
 *                photograph settles; the firms as a still wall (no marquee). Hero → the call is a slide-over.
 *   the call     proc.js design A "The line" on the paper: no hold; its film plays once as the room arrives (2.2 s).
 *   partnership  B v7 (approved 10/20): paper, normal flow, no pin. Words and the owner's choice (sell 100% or sell 80% and
 *                keep 20%) on the left; a live map film on the right that plays once in view and holds its last frame
 *                (owners/pt/pt-film.js, loaded as the room nears). Green is the owner's money only.
 *   questions    a quiet accordion (one answer open at a time); the rows' hairlines draw in with the scroll.
 *   the close    headline + lede, the house arrow under "taking.", one "Start a conversation" action, the two doors with
 *                their addresses; black (the turn: gfTurn closeAt), opaque over footer I; the faint fox hands off.
 * Reduced motion: every room settled. ?gfm=0: the page exactly as Webflow serves it.
 */
(function () {
  'use strict';
  var W = window, D = document, gfx = W.gfx;
  if (!gfx || !gfx.page || W.__gfxOwners) return;
  W.__gfxOwners = '1.2.11';
  const H = D.documentElement, G = gfx.G, $ = gfx.$, $$ = gfx.$$, safe = gfx.safe, mq = gfx.mq, clamp = gfx.clamp;
  // (1.2.8, founder 10/26) two firms' marks are off the row until they confirm (Accordion, Ventura): eight marks sit two
  // rows of four instead of five and three. DELETE THIS RULE when the ten are back (the stylesheet's five columns return).
  if (!$('#gfx-ow-firms-8')) { const st = D.createElement('style'); st.id = 'gfx-ow-firms-8'; st.textContent = '@media (min-width:992px){html:not(#gfx-o) [data-o~=ow-marq-track]{grid-template-columns:repeat(4,minmax(0,1fr))!important}}'; (D.head || H).appendChild(st); }
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
  const findRooms = () => { const k = c => $(O(c)); R.hero = k('ow-hero'); R.proc = k('ow-proc'); R.pt = k('ow-pt'); R.qs = k('ow-qs'); R.close = k('ow-close'); };
  findRooms();

  /* ========================= the rooms and their chapters (ow-flow2.js, Flow 3) =========================
     Paper throughout; the one turn is into the close (gf-turn.js closeAt: the later of the close's top at 60 % and the
     questions' last line in the top eighth, and done before the close's headline reaches 72 %). The partnership room is
     not in the field: it keeps its own charcoal, as on staging. The paper rooms keep their own inks (noInk): they are never
     shown on the black (the questions leave as the field turns). */
  const field = {
    phoneRhythm: true,   // (1.2.0) the house phone rhythm on every room
    rooms: [
      { el: O('ow-hero'), native: 'L', tone: 'L', noInk: true },
      { el: O('ow-proc'), native: 'L', tone: 'L', noInk: true },
      // (1.1.1) the partnership and the questions take the house rhythm (the visible gap from the last thing seen in the
      // room before to the first thing seen in this one is the standard tier: 160px on a 900px-tall screen, 80px on a phone)
      { el: O('ow-pt'), native: 'L', tone: 'L', noInk: true, tier: 'standard' },
      { el: O('ow-qs'), native: 'L', tone: 'L', noInk: true, tier: 'standard' },
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
    // (1.2.0, final audit) a phone scrolls the hero away normally: the slide-over covered the hero's button before the
    // reader could tap it (the founder, on Home); phones keep motion restrained
    if (!out || !inn || W.matchMedia('(max-width: 767px)').matches) return;
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
    const S = {}, RAIL_X = 11;   // (1.2.2) the phone rail's x, in the list's and the market drawing's coordinates
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
            // (1.2.2) on a phone the market leaves the rail's column free (x 0-30) and your company's line turns left into
            // the rail that carries the four steps (phoneRail)
            const PH = mq('(max-width: 991px)');
            const u = market(s, { x0: PH ? 30 : 0, x1: Wk - 8, y0: 6.5, y1: Math.round(Hh * 0.66) + 0.5, sp: 17, dx: 13, ux: 0.74, urow: -1, seed: 11, fit: 0.12, H: Hh });
            note(s, 'pa-nu', u.x - 20, Math.round(Hh * 0.66) + 30, 'end');
            set(s, 'pa-gr', PH ? `M${f1(u.x)} ${f1(u.y + 9)}V${f1(yh - 16)}Q${f1(u.x)} ${yh} ${f1(u.x - 16)} ${yh}H${RAIL_X}` : `M${f1(u.x)} ${f1(u.y + 9)}V${f1(yh - 14)}Q${f1(u.x)} ${yh} ${f1(u.x + 14)} ${yh}H${f1(Wk)}`);
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
    /* (1.2.2, founder 10/20: the phone version still read as fragments and the owner's words sat between the steps) on a
       phone the desktop's one line stands upright: it leaves your company in the market, runs down the left of the four
       steps (a node at each: Research your company's ring, Outreach the buyer's dot, Conversation the two-way marks,
       Introduction the turn up into the house arrow) and draws in green with the scroll; the owner's words follow the
       four steps. Desktop and tablet keep the horizontal line. */
    const list = beats[0] && beats[0].parentElement, pqHome = pq ? { p: pq.parentElement, n: pq.nextSibling } : null;
    let rail = null, railFg = null, railLen = 0;
    const railPaint = () => { if (!rail || !railFg) return; const r = rail.getBoundingClientRect(), H = r.height || 1; const p = c01((W.innerHeight * 0.72 - r.top) / H); railFg.style.strokeDashoffset = (1 - p).toFixed(4); rail.querySelectorAll('[data-at]').forEach(n => n.classList.toggle('is-on', p * H >= +n.dataset.at - 4)); };
    const phoneRail = () => {
      const on = !!list && mq('(max-width: 991px)');
      room.classList.toggle('gfx-pc-phone', on);
      let moved = false;
      if (pq && pqHome && list) { if (on && pq.parentElement !== list.parentElement) { list.after(pq); moved = true; } else if (!on && pq.parentElement !== pqHome.p) { pqHome.p.insertBefore(pq, pqHome.n); moved = true; } }
      if (moved) setTimeout(() => safe('rhythm after move', () => { if (W.gfxField && W.gfxField.rhythm) W.gfxField.rhythm(); if (gfx.refresh) gfx.refresh(); }), 60);   // (the room's height changed: the spacing and the triggers are measured again)
      if (!on) { if (rail) rail.style.display = 'none'; return; }
      if (!rail) { rail = D.createElementNS(NS, 'svg'); rail.setAttribute('class', 'gfx-pc-rail'); rail.setAttribute('aria-hidden', 'true'); list.appendChild(rail); }
      rail.style.display = '';
      const lr = list.getBoundingClientRect(), H = list.offsetHeight, X = RAIL_X;
      const d0 = $(O('pc-draw'), beats[0]), y0 = d0 ? d0.getBoundingClientRect().bottom - lr.top : 0;
      const ys = ti.map(t => { const r = t ? t.getBoundingClientRect() : null; return r ? r.top - lr.top + r.height / 2 : 0; });
      // (1.2.7, founder 10/21: the arrow pointed above "Introduction") the head's last stroke is steep (8 across, 20 up),
      // so it aims ~17 px above its tip: the tip sits 16 px below the words' middle and the stroke, carried on, meets
      // their middle - the same rule as Investors' stage line. Measured on WebKit iPhone: ys[3] runs 27 px below the
      // words' middle here, so the turn is 9 px below it
      const yE = ys[3] + 9, tip = 40, rise = 20;
      const d = `M${X} ${f1(y0)}V${f1(yE - 14)}Q${X} ${f1(yE)} ${X + 14} ${f1(yE)}H${tip - 8}L${tip} ${f1(yE - rise)}`;
      rail.setAttribute('width', 48); rail.setAttribute('height', f1(H)); rail.setAttribute('viewBox', `0 0 48 ${f1(H)}`);
      rail.innerHTML = `<path class="gfx-pc-r-bg" d="${d}"/><path class="gfx-pc-r-fg" d="${d}" pathLength="1"/>` +
        `<circle class="gfx-pc-n gfx-pc-n-you" data-at="${f1(ys[0])}" cx="${X}" cy="${f1(ys[0])}" r="7"/><circle class="gfx-pc-n gfx-pc-n-dot" data-at="${f1(ys[0])}" cx="${X}" cy="${f1(ys[0])}" r="2.6"/>` +
        `<circle class="gfx-pc-n gfx-pc-n-dot" data-at="${f1(ys[1])}" cx="${X}" cy="${f1(ys[1])}" r="3.6"/>` +
        `<path class="gfx-pc-n gfx-pc-n-x" data-at="${f1(ys[2])}" d="M${X - 6} ${f1(ys[2] + 7)}V${f1(ys[2] - 7)}M${X + 6} ${f1(ys[2] - 7)}V${f1(ys[2] + 7)}"/>` +
        `<path class="gfx-pc-n gfx-pc-n-hd" data-at="${f1(yE)}" d="M${tip - 9} ${f1(yE - rise + 2)}L${tip} ${f1(yE - rise)}L${tip + 1} ${f1(yE - rise + 10)}"/>`;
      railFg = $('.gfx-pc-r-fg', rail); railPaint();
    };
    const relayout = () => { safe('call layout', layout); paintDraw(); safe('phone rail', phoneRail); };
    // (smoothness lab 10/21) once a frame, and only while the rail is within a screen of view (it measured itself on every
    // scroll event from the top of the page down); leaving that range it is painted once more, so it rests right
    let rrq = 0, rNear = true;
    const railSoon = () => { if (rNear && !rrq && rail && rail.style.display !== 'none') rrq = requestAnimationFrame(() => { rrq = 0; railPaint(); }); };
    if (list && 'IntersectionObserver' in W) new IntersectionObserver(es => es.forEach(e => { rNear = e.isIntersecting; if (rail && rail.style.display !== 'none') railPaint(); }), { rootMargin: '100% 0px' }).observe(list);
    W.addEventListener('scroll', railSoon, { passive: true });
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

  /* ========================= the partnership (B v7, approved 10/20) =========================
     A normal-flow paper room (no pin, no dark turn): the words and the owner's choice on the left, a live map film on the
     right (phone: head, words, film, table). The film plays once when it is 45% in view, pauses out of view and holds on
     its final frame; Replay restarts it. Its engine and the map data (owners/pt/pt-film.js, ~110 KB) load only as the room
     approaches, so the page's first screen never waits for them; without them the room shows its final figures.
     (Replaces the old partnership stage and the second bite room, whose figures now live in this room's table.) */
  let ptP = null;
  const ptLoad = () => {
    if (ptP) return ptP;
    ptP = new Promise(res => {
      if (W.gfxPtFilm) { res(true); return; }
      const s = D.createElement('script'); s.src = gfx.BASE + 'owners/pt/pt-film.js'; s.async = true;
      s.onload = () => res(!!W.gfxPtFilm); s.onerror = () => res(false); D.head.appendChild(s);
    });
    return ptP;
  };
  function ptInit() {
    const room = R.pt; if (!room || room._ptInit) return; room._ptInit = true;
    // (1.2.1, final audit: building the map as the room neared froze the scroll ~0.5 s) the film loads and builds in the
    // first idle moment after the page opens, while the reader is still on the hero; the nearing room is the fallback
    let started = false;
    const go = () => { if (started) return; started = true; ptLoad().then(ok => { if (ok) safe('partnership film', () => W.gfxPtFilm(room)); }); };
    const idle = () => (W.requestIdleCallback ? W.requestIdleCallback(go, { timeout: 2500 }) : setTimeout(go, 1200));
    if (D.readyState === 'complete') idle(); else W.addEventListener('load', idle, { once: true });
    if ('IntersectionObserver' in W) { const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { io.disconnect(); go(); } }, { rootMargin: '150% 0px' }); io.observe(room); }
    else go();
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
    // (smoothness lab 10/21) read just after a frame is drawn (core postFrame), not mid-frame as the close arrives
    const ask = () => { if (near && !rq) { rq = 1; ((W.gfx && W.gfx.postFrame) || requestAnimationFrame)(check); } };
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
    safe('partnership', ptInit);   // the film shows its final frame under reduced motion
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
      safe('questions', () => { questionsWire(); });
    },
    start: () => {
      gsap = gfx.gsap; ST = gfx.ST;
      safe('hero', heroInit);
      safe('slide', () => slide(R.hero, R.proc, 0.06, R.hero && $(O('ow-hero-pic'), R.hero)));
    },
    rooms: () => {
      safe('call', callInit);
      safe('partnership', ptInit);
      safe('questions motion', () => questionsInit({ room: R.qs, items: R.qs ? $$(O('ow-acc-item'), R.qs) : [] }));
      safe('close', closeInit);
    },
    late: () => { safe('close mark', () => closeMarkInit(false)); },
    still
  });
})();
