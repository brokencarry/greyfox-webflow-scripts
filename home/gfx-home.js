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
  W.__gfxHome = '1.1.5';
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
    setTimeout(born, introTl ? 2600 : 900);
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
    if (!out || !inn) return;
    out.classList.add('gfx-out'); inn.classList.add('gfx-in');
    const dim = D.createElement('i'); dim.className = 'gfx-dim'; dim.setAttribute('aria-hidden', 'true'); out.appendChild(dim);
    let last = '';
    ST.create({ trigger: inn, start: 'top bottom', end: 'top top', invalidateOnRefresh: true,
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
    const mm = gsap.matchMedia();
    mm.add(PIN, () => {
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
      const ridge = () => {
        const Wr = rail.offsetWidth, Hr = rail.offsetHeight, top = 14, bot = Hr - 10, span = bot - top;
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
      const placeClimb = () => safe('climb', () => { ridge(); snapMid(); camps.forEach((t, k) => { const p = cPt(t); stops[k].style.left = p.x + 'px'; stops[k].style.top = p.y + 'px'; }); drawClimb(cF); });
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
  }

  /* ========================= the market stage (gf-line.js) =========================
     A sticky stage of about 2.15 screens on the black. The scroll decides which beat the reader is in; each beat plays
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
    const fieldR = () => phone() ? { x0: -8, x1: Wd + 8, top: Hd * 0.36, bot: Hd * 0.6 } : { x0: -Wd * 0.04, x1: Wd * 1.02, top: Hd * 0.14, bot: Hd * 0.9 };
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
      const a = ss(seg(P, 0.0, 0.16)), b = ss(seg(P, 0.22, 0.38)), c = eio(seg(P, 0.42, 0.56)), d = eio(seg(P, 0.6, 0.76));
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
      if (s === 3 && from < 3) { ensureDemo(); if (phone()) tw(portalK, { k: 1, duration: 1.0, ease: 'power3.inOut', onUpdate: () => setPortal(portalK.k) }); demoDo('play'); }
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
      if (!phone() && portal) { const k = arrived ? eio(seg(P, 0.6, 0.74)) : 0, o = (1 - eo(X)).toFixed(3); if (portalK.k !== k) { portalK.k = k; setPortal(k); } if (portal._o !== o) { portal.style.opacity = o; portal._o = o; } }
    };
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
    const ask = () => { if (near && !rq) rq = requestAnimationFrame(check); };
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
    $$('.footer_section_wrapper').forEach(f => f.style.setProperty('background-color', s, 'important'));
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
    late: () => { [marketInit, grownInit, () => closeMarkInit(false)].forEach(f => safe(f.name || 'late', f)); },
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
