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
  W.__gfxHome = '1.1.27';
  const H = D.documentElement, G = gfx.G, $ = gfx.$, $$ = gfx.$$, safe = gfx.safe, mq = gfx.mq, clamp = gfx.clamp;
  // (1.1.16, launch regression 10/24) the market film's step index between 768 and 991px (tablets, phones held sideways):
  // four equal columns of ~70-90px could not hold "conversation" (109px at 18px) and the word ran past its rule. Each
  // column now takes its own longest word; the four still fit the index's width with room to spare.
  if (!$('#gfx-mk-idx-fit')) { const st = D.createElement('style'); st.id = 'gfx-mk-idx-fit'; st.textContent = '@media (min-width:768px) and (max-width:991px){html .gfx-mk .gfx-mk-idx{grid-template-columns:repeat(4,auto)!important;column-gap:16px!important}}'; (D.head || H).appendChild(st); }
  const NS = gfx.NS, TAN = gfx.TAN, REDUCE = gfx.REDUCE, GROUP = G.group, LEAVE = G.leave;
  const PIN = '(min-width: 992px) and (min-height: 641.01px)', UNPIN = '(max-width: 991px), (max-height: 640.99px)';
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
      // (1.1.27, the owners site; desktop review 10/28: on paper the letter was read on black and turned mid-read) the
      // founder's note belongs to the black chapter: the market narrows to one owner, and the next thing on the black is
      // who is calling. One turn follows, into the team.
      { el: '[data-o~="gn-sec"]', native: 'D', tone: 'D', tier: 'standard' },
      // (back to paper once the letter has all but left: its last line in the top eighth, and black-free by the time the
      // team's headline is in the lower seventh, as the close's turn is placed)
      { el: '.gfx-team-sec', native: 'L', tone: 'L', tier: 'turn', turnAt: (ym, c) => {
        const lb = c.lastBottom(c.prev.el); if (Number.isFinite(lb) && lb - c.vh * 0.12 > ym) ym = Math.min(lb - c.vh * 0.12, c.max - c.vh * 0.05);
        const hd = $('.heading-2', c.room.el); if (hd) ym = Math.min(ym, c.docTop(hd) - c.vh * 0.86);
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
  /* (1.1.23, the owners site, founder 10/28) the first-call card is gone: the market has no window on the right, so step 04
     gathers the prioritized strands into one point (marketInit). The founder's note is its own room on paper, after the
     market and before the team: the photograph on the left, the letter on the right, the signature under it. Its words are
     static elements, editable in the Designer (data-o gn-*). */
  function ownersStyle() {
    if ($('#gfx-owners-css')) return;
    const st = D.createElement('style'); st.id = 'gfx-owners-css';
    st.textContent =
      // (1.1.24) the room keeps the team's gutter and width, so the photograph lines up with the team's left edge below
      'html [data-o~="gn-sec"]{padding-left:var(--gfx-gutter,48px)!important;padding-right:var(--gfx-gutter,48px)!important}' +
      // (1.1.27, desktop review 10/28) the letter keeps the quote room's prose column (the last 34% of the content width, at
      // every width), and the photograph stands just left of it, one unit with the letter
      'html [data-o~="gn-in"]{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,34.1%);column-gap:0;align-items:start;max-width:1400px;margin:0 auto;padding:0;box-sizing:border-box}' +
      // (1.1.25, founder 10/28: his outdoor photo, head and shoulders) a portrait frame, held to the photograph's own width
      'html [data-o~="gn-pic"]{position:sticky;top:clamp(96px,14vh,140px);justify-self:end;width:100%;max-width:420px;margin-right:clamp(64px,7vw,128px);aspect-ratio:4/5;overflow:hidden;background:#1b1b1c}' +
      'html [data-o~="gn-img"]{display:block;width:100%;height:100%;object-fit:cover;object-position:50% 50%}' +
      // (1.1.27) the room is native to the black: its inks are the dark field's
      'html [data-o~="gn-sec"] .heading-2{margin:0 0 clamp(28px,3vw,44px)!important;color:var(--gfx-ink-d1,#f2f1ee)}' +
      'html [data-o~="gn-p"]{margin:0 0 1.15em!important;font:400 clamp(17px,1.3vw,20px)/1.62 var(--gfx-sans,"DM Sans",sans-serif);color:var(--gfx-ink-d1,#f2f1ee);text-wrap:pretty}' +
      // (1.1.26) the photograph arrives as the portraits do (a cover of the field lifting off it), and the signature's rule
      // is drawn, not shown
      'html [data-o~="gn-cover"]{position:absolute;inset:0;z-index:2;background-color:var(--gfx-field,#f6f5f2);transform-origin:50% 0;pointer-events:none}' +
      'html [data-o~="gn-sign"]{position:relative;margin-top:clamp(32px,3.4vw,48px);padding-top:clamp(20px,2vw,28px)}' +
      'html [data-o~="gn-rule"]{position:absolute;left:0;right:0;top:0;height:1px;background:var(--gfx-line-d,rgba(242,241,238,.16));transform-origin:0 50%}' +
      'html.gfx-tone-light [data-o~="gn-rule"]{background:var(--gfx-line-l,rgba(17,17,18,.14))}' +
      'html.gfx-failsafe [data-o~="gn-cover"]{display:none!important}' +
      'html [data-o~="gn-name"]{margin:0 0 4px!important;font-family:var(--gfx-serif,Sentient,Georgia,serif);font-weight:300;font-size:clamp(22px,1.7vw,28px);line-height:1.2;color:var(--gfx-ink-d1,#f2f1ee)}' +
      'html [data-o~="gn-role"]{margin:0!important}' +
      '@media (max-width:991px){html [data-o~="gn-in"]{grid-template-columns:1fr;row-gap:clamp(32px,6vw,48px)}html [data-o~="gn-pic"]{position:relative;top:auto;justify-self:start;margin-right:0}}' +
      // (desktop review 10/28) the pull quote breaks evenly: no word left alone on its last line
      'html .gfx-pull-q{text-wrap:pretty}' +
      // (the reading list's cards are whole-card links: no browser underline under their words at any width)
      'html .gfx-ins-sec .gfx-ink-card a,html .gfx-ins-sec .gfx-ink-lead{text-decoration:none!important}';
    (D.head || H).appendChild(st);
  }
  function noteInit() {
    const sec = $('[data-o~="gn-sec"]'); if (!sec) return;
    const head = $('.heading-2', sec), pic = $('[data-o~="gn-pic"]', sec), img = $('[data-o~="gn-img"]', sec), sign = $('[data-o~="gn-sign"]', sec);
    const mk = (host, o) => { if (!host) return null; let e = $(`[data-o~="${o}"]`, host); if (!e) { e = D.createElement('i'); e.setAttribute('data-o', o); e.setAttribute('aria-hidden', 'true'); host.prepend(e); } return e; };
    const cover = REDUCE ? null : mk(pic, 'gn-cover'), rule = mk(sign, 'gn-rule');
    if (cover && covers) covers.push(cover);
    // one film, in the house order: the headline rises, the letter follows, the photograph is uncovered, the rule under
    // the letter is drawn, and the name settles
    gfx.room({ trigger: head || sec, headline: head, body: $$('[data-o~="gn-p"]', sec), hairline: rule, detail: $$('[data-o~="gn-name"], [data-o~="gn-role"]', sec), extraPicture: !!cover,
      extra: (tl, at) => { if (cover) tl.to(cover, { scaleY: 0, duration: G.picture.duration, ease: G.DRAW }, at('picture')); } });
    // the photograph settles from 1.06 to 1 as it rises into view, as the team's portraits do
    if (img) { if (img.srcset) img.sizes = '(max-width: 991px) 92vw, 420px'; let last = ''; img.style.scale = '1.06';
      ST.create({ trigger: pic || img, start: 'top bottom', end: 'top 35%', onUpdate: s => { const v = (1.06 - 0.06 * eo(s.progress)).toFixed(4); if (v !== last) { img.style.scale = v; last = v; } } }); }
  }
  function marketDom() {
    safe('owners css', ownersStyle);
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
    // (1.1.23, the owners site) without the window the gathered line ends in a point three quarters across: the one owner
    // the whole market narrowed to; as the stage releases, the line runs on to the edge and the point lets go
    // (1.1.27, desktop review 10/28: at 1920 the point sat well inside the content, the right third empty) on a desktop the
    // point stands on the content's right edge (32px in, room for its ring), where the window's own edge was
    const pointU = () => { const cw = Math.min(Wd - 96, 1400), xr = (Wd + cw) / 2 - 32; return (xr + Wd * 0.04) / (Wd * 1.06); };
    const PORTAL_U = () => (!portal ? (phone() ? 0.86 : pointU()) : phone() ? 1.02 : 0.575);
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
        const gIn = gateIn(), gA = gIn * (1 - c * 0.85) * (portal ? 1 : 1 - d);   // (1.1.24) the checks step aside for the point
        if (gA > 0.01) GATES.forEach((g, i) => { const r = gateReach(i), x = F.x0 + (F.x1 - F.x0) * g, y1 = F.top + fh * gIn; ctx.lineWidth = 1;
          if (r < 0.99) { ctx.globalAlpha = gA * 0.45 * (1 - r); ctx.strokeStyle = ink(0.4); ctx.beginPath(); ctx.moveTo(x, F.top); ctx.lineTo(x, y1); ctx.stroke(); }
          if (r > 0.01) { ctx.globalAlpha = gA * 0.8 * r; ctx.strokeStyle = '#2f9a6c'; ctx.beginPath(); ctx.moveTo(x, F.top); ctx.lineTo(x, y1); ctx.stroke(); } });
      }
      const y = (t, u) => {
        let amp = t.amp * fh * (1 - c * 0.7) * (1 - d);
        if (b > 0) for (const g of GATES) if (u > g) amp *= 1 - 0.28 * b;
        // (1.1.24) without the window the funnel closes at the point, not at the edge, so the strands meet in it
        const uf = portal ? u : u / lerp(1, PORTAL_U(), d);
        const wave = Math.sin(t.ph + u * t.f * 6.283) * amp, spread = F.top + t.y0 * fh, funnel = ss(clamp((uf - 0.25) / 0.75, 0, 1));
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
      if (!portal) {
        // the point: it forms once the strands have gathered, a single ring opens from it with the scroll, and it lets go
        // as the line runs on past it
        const k = ss(seg(P, 0.7, 0.8)) * (1 - ss(clamp(X * 1.6, 0, 1))), px = F.x0 + (F.x1 - F.x0) * PORTAL_U();
        if (k > 0.01) {
          ctx.globalAlpha = k; ctx.fillStyle = GREEN; ctx.beginPath(); ctx.arc(px, yc, 4.5, 0, Math.PI * 2); ctx.fill();
          const r = ss(seg(P, 0.74, 0.92)); if (r > 0.01 && r < 0.99) { ctx.globalAlpha = k * 0.55 * (1 - r); ctx.strokeStyle = GREEN; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(px, yc, 4.5 + r * 26, 0, Math.PI * 2); ctx.stroke(); }
        }
      }
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
    const ensureDemo = () => { if (demo || !portalIn || portalIn.hasAttribute('data-gfx-card')) return; demo = 'loading'; loadPortal().then(ok => { if (!ok) return; demo = W.GFPortalDemo.mount(portalIn, { theme: 'dark', autoplay: false, loop: false, reducedMotion: REDUCE, frame: true, fit: 'fill', label: 'A client’s pipeline in the Grey Fox portal: the handoff stage, with one company’s note open. Illustrative companies and notes.' }); if (demoWant) demo[demoWant](); }); };
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
    else if (portal) ST.create({ trigger: sec, start: 'bottom 95%', onEnter: () => gsap.to(portal, { opacity: 0, duration: 0.45, ease: 'power2.in', overwrite: 'auto', onUpdate: rd, onComplete: rd }),
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
    // (1.1.20, the owners site) a portal that holds its own card (data-gfx-card) is never replaced by the demo
    if (portalIn && !portalIn.hasAttribute('data-gfx-card')) loadPortal().then(ok => { if (ok) { const d = W.GFPortalDemo.mount(portalIn, { theme: 'dark', autoplay: false, loop: false, reducedMotion: true, label: 'A client’s pipeline in the Grey Fox portal. Illustrative companies and notes.' }); d.settle(); } });
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
    (covers || (covers = $$('.gfx-team-sec .reveal_block, [data-o~="gn-cover"]'))).forEach(e => e.style.setProperty('--gfx-field', s));
    clearTimeout(rootT); rootT = setTimeout(() => H.style.setProperty('--gfx-field', s), 160);
    // (core 1.0.31) the footer is see-through; the page's background shows behind it
  };

  gfx.page({
    field,
    foot: { close: '.gfx-cta-sec' },
    fox: '.gfx-cta-sec .footer-logo-subtle',
    foxZone: [2, 6, false],
    // (1.1.19) the reading list's lead cover is a second link to the lead's article; the designer's block left it at an
    // older one. Set at DOM time, so the still page (Reduce Motion, no motion library) gets it too, not only the rooms.
    dom: () => { marketDom(); safe('mirror', () => gfx.onField(mirror)); safe('inslead', () => { const top = $('.gfx-ins-sec .gfx-ink-top'); if (!top) return; const lead = $('.gfx-ink-lead', top), frame = $('.gfx-ins-frame', top); if (lead && frame && lead.getAttribute('href')) frame.setAttribute('href', lead.getAttribute('href')); }); },
    start: () => {
      gsap = gfx.gsap; ST = gfx.ST;
      let intro = null;
      safe('intro', () => { intro = introInit(); });
      pauseControl();
      safe('hero', () => heroInit(intro));
      safe('marquee', marqueeInit);
      safe('slide', () => slide($('.gfx-hero-sec'), $('.gfx-std-sec'), 0.32));
    },
    rooms: () => { [standardInit, casesInit, noteInit, teamInit, insightsInit, closeInit].forEach(f => safe(f.name, f)); },
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
