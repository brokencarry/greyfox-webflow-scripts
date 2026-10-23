/*!
 * Grey Fox · gfx Person (Flow 3), the person pages' layer on the shared core.
 * person 1.0.0 · 2026-10-20 · Webflow pages "Shivam Shirolawala / Tony Giudice / Burke Widhelm v2 (Claude build)"
 * (/team-v2-shivam, /team-v2-tony, /team-v2-burke): one static page per person, the same script and stylesheet.
 *
 * WHAT IT IS
 *   The approved local person page, variant A (prototype/team/person/a.html + person.js, Flow 3 the default; "the band", the
 *   founder's pick), on the core (field, bar, footer I, Lenis):
 *   - the page is black from top to bottom (one field, no turn); the bar reads it as dark;
 *   - THE ARRIVAL: the band draws in from the left; the name rises line by line (1.4 s, expo out); the way back to the team
 *     and the title and contacts follow; the hairline draws; the portrait opens upward out of the band (clip) and settles
 *     1.06 -> 1 (2.0 s); as the page scrolls the portrait moves up to 56 px with it;
 *   - THE READING: each fact's rule draws, then its label and value; the biography's first paragraph rises line by line,
 *     the others as they come; the cards' sheets open upward; the way on (Next) draws its rule, then the next person and
 *     All of the team;
 *   - a part not written yet (is-blank, "To come") is not shown (the ported stylesheet, as local): Tony and Burke show the
 *     portrait, then Next.
 *   - the e-mail glyph in the contacts is the page's decoration, drawn here.
 * Reduced motion: html.tp-m is never set, so the page is complete and still.
 */
(function () {
  'use strict';
  var W = window, D = document, gfx = W.gfx;
  if (!gfx || !gfx.page || W.__gfxPerson) return;
  W.__gfxPerson = '1.0.4';
  const H = D.documentElement, $ = gfx.$, $$ = gfx.$$, safe = gfx.safe, REDUCE = gfx.REDUCE, G = gfx.G;
  const O = c => '[data-o~="' + c + '"]';
  // the local page's html classes, before the body is parsed (the ported stylesheet reads them); tp-m holds the arrival
  // states until the motion runs (and lets go after 4 s if it never does)
  H.classList.add('gf-flow', 'gf-flow2', 'gf-flow3', 'gf-dark-black', 'ow-js', 'gfx-tp-js', 'tp', 'tp-v-a');
  if (REDUCE) H.classList.add('ow-reduce');
  else { H.classList.add('tp-m'); setTimeout(() => { if (!H.classList.contains('tp-go')) H.classList.remove('tp-m'); }, 4000); }
  /* (person 1.0.3, the founder 10/22: one structure for the whole team) each page has one card, the person's quote under
     'Something you should know' (Noteworthy is gone): the card runs the width of the column and the quote is set in the serif */
  if (!D.getElementById('gfx-tp-quote')) { const st = D.createElement('style'); st.id = 'gfx-tp-quote';
    st.textContent = '[data-o~="tp-cards"][data-o~="is-panels"]>[data-o~="tp-card"]:only-child{grid-column:1/-1}'
      + '[aria-labelledby^="tp-c-know"] [data-o~="tp-li"]{font:300 26px/1.4 var(--tp-serif);letter-spacing:-.005em;color:var(--i1);min-height:0;padding:20px 0 6px}'
      // a fact not written yet is hidden: the first fact shown then opens the list as the first one does (no rule above it)
      + '[data-o~="tp-a-l"] [data-o~="tp-f"][data-o~="is-blank"]:first-child+[data-o~="tp-f"]{padding-top:0}[data-o~="tp-a-l"] [data-o~="tp-f"][data-o~="is-blank"]:first-child+[data-o~="tp-f"] [data-o~="tp-f-rule"]{display:none}'
      + '@media (max-width:767px){[aria-labelledby^="tp-c-know"] [data-o~="tp-li"]{font-size:22px}}';
    D.head.appendChild(st); }
  const MAIL = '<svg class="tp-ico-g" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><rect x="2.75" y="4.75" width="14.5" height="10.5" rx=".5"/><path d="M3.2 5.3 10 10.6l6.8-5.3"/></svg>';
  let root = null;
  const field = { rooms: [] };

  /* (person 1.0.4, the founder 10/23: "let me see it for real") a private preview of three layouts for the person pages, only
     with ?look=1|2|3 in the address; visitors without it see the page as it is. A small bar flips between them.
     1 Dissolve: the portrait reaches the margin and fades into the page. 2 Half: the portrait is the hero's right half, off
     the screen's edge. 3 Aligned: the portrait aligned to the margin, larger, no fade. All three: the quote ends the bio in
     the serif under the site's gold mark, no panel. */
  const LOOK = (() => { try { const v = new URLSearchParams(location.search).get('look'); return /^[0-3]$/.test(v || '') ? +v : 0; } catch (e) { return 0; } })();
  if (LOOK || /[?&]look=/.test(location.search)) {
    const P = '[data-o~="tp-a-pic"]', ST = '[data-o~="tp-a-stage"]', K = '[aria-labelledby^="tp-c-know"]';
    const QM = 'https://cdn.prod.website-files.com/67c0e116387e8248a0d7e10a/6aac07e14a086611b4e0c064_quote_decoration_gold.svg';
    const quote = '[data-o~="tp-cards"]{margin-top:96px!important;display:block!important}'
      + K + ' [data-o~="tp-card-sheet"],' + K + ' [data-o~="tp-card-h"]{display:none!important}'
      + '[data-o~="tp-cards"] ' + K + '{padding:0!important}' + K + ' [data-o~="tp-list"]{margin-top:0!important}'
      + K + ' [data-o~="tp-li"]{position:relative;border-top:0!important;padding:68px 0 0!important;min-height:0!important;font:300 40px/1.22 var(--tp-serif)!important;letter-spacing:-.014em!important;color:#fff!important;max-width:17em}'
      + K + ' [data-o~="tp-li"]::before{content:"";position:absolute;left:0;top:0;width:44px;height:36px;background:url(' + QM + ') no-repeat 0 0/contain}'
      + '@media (max-width:767px){' + K + ' [data-o~="tp-li"]{font-size:28px!important;padding-top:52px!important}' + K + ' [data-o~="tp-li"]::before{width:34px;height:28px}[data-o~="tp-cards"]{margin-top:64px!important}}';
    const css = {
      1: ST + '{--nm:clamp(56px,6.8vw,120px)!important}'
        + P + '{right:0!important;height:calc(var(--bandh) + clamp(210px,28vh,320px))!important;-webkit-mask-image:radial-gradient(ellipse 66% 70% at 54% 52%,#000 46%,transparent 100%);mask-image:radial-gradient(ellipse 66% 70% at 54% 52%,#000 46%,transparent 100%)}'
        + '@media (max-width:767px){[data-o~="tp-person"] ' + P + '{width:92%!important;height:auto!important;aspect-ratio:4/5!important;margin:28px 0 0 auto!important}}' + quote,
      2: ST + '{--nm:clamp(56px,6.2vw,112px)!important}[data-o~="tp-a-hero"]{overflow:hidden}'
        + P + '{top:calc(-1 * (72px + clamp(40px,7vh,88px)))!important;bottom:0!important;height:auto!important;right:calc((min(100vw - 96px,1400px) - 100vw) / 2)!important;aspect-ratio:auto!important;width:min(52vw,820px)!important;'
        + '-webkit-mask-image:linear-gradient(to right,transparent 0,#000 34%),linear-gradient(to top,transparent 0,#000 16%);-webkit-mask-composite:source-in;mask-image:linear-gradient(to right,transparent 0,#000 34%),linear-gradient(to top,transparent 0,#000 16%);mask-composite:intersect}'
        + P + ' img{object-position:50% 22%!important}'
        + '@media (max-width:767px){[data-o~="tp-person"] ' + P + '{position:relative!important;top:auto!important;right:auto!important;width:100vw!important;height:auto!important;aspect-ratio:4/5!important;margin:28px 0 0 calc(50% - 50vw)!important;-webkit-mask-image:linear-gradient(to top,transparent 0,#000 22%);mask-image:linear-gradient(to top,transparent 0,#000 22%)}}' + quote,
      3: ST + '{--nm:clamp(56px,7vw,124px)!important}'
        + P + '{right:0!important;height:calc(var(--bandh) + clamp(200px,28vh,310px))!important}'
        + '@media (max-width:767px){[data-o~="tp-person"] ' + P + '{height:auto!important;aspect-ratio:4/5!important;width:86%!important;margin:28px 0 0 auto!important}}' + quote
    };
    const bar = '#gfx-look{position:fixed;left:16px;bottom:16px;z-index:9999;display:flex;gap:2px;padding:4px;border-radius:999px;background:rgba(17,17,18,.86);border:1px solid rgba(244,243,240,.18);font:500 13px/1 "DM Sans",sans-serif;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}'
      + '#gfx-look a{color:rgba(255,255,255,.72);text-decoration:none;padding:9px 13px;border-radius:999px}#gfx-look a[aria-current]{background:#f6f5f2;color:#111112}';
    const st = D.createElement('style'); st.id = 'gfx-look-css'; st.textContent = bar + (css[LOOK] || ''); D.head.appendChild(st);
    const ready = () => {
      if (LOOK) D.querySelectorAll(K + ' [data-o~="tp-li"] span').forEach(s => { if (!s.children.length) s.textContent = s.textContent.replace(/^[\u201c"]\s*|\s*[\u201d"]$/g, ''); });
      if (D.getElementById('gfx-look')) return;
      const nav = D.createElement('nav'); nav.id = 'gfx-look'; nav.setAttribute('aria-label', 'Layout preview');
      [['0', 'Current'], ['1', '1 Dissolve'], ['2', '2 Half'], ['3', '3 Aligned']].forEach(([k, t]) => {
        const a = D.createElement('a'); a.href = location.pathname + '?look=' + k; a.textContent = t; if (+k === LOOK) a.setAttribute('aria-current', 'page'); nav.appendChild(a); });
      D.body.appendChild(nav);
    };
    if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', ready); else ready();
  }

  function dom() {
    root = $(O('tp-person'));
    $$(O('tp-ico-a') + '[href^="mailto:"]', root || D).forEach(a => { if (!$('svg', a)) a.insertAdjacentHTML('afterbegin', MAIL); });
    // the field: black from the top, the footer's own black at the end (no turn)
    const rooms = root ? [$(O('tp-a-hero'), root), $(O('tp-a-body'), root), $(O('tp-end'), root)].filter(Boolean) : [];
    field.rooms = rooms.map((el, i) => ({ el, native: 'D', tone: 'D', noInk: true, foot: i === rooms.length - 1 }));
  }

  function arrival(gsap) {
    if (!root) return;
    H.classList.add('tp-go');
    const SETTLE = 'expo.out', DRAW = G.DRAW, ON = 'inset(0% 0% 0% 0%)';
    const lines = $$(O('tp-nl') + ' > span', root), meta = $('[data-tp-meta]', root), back = $(O('tp-back'), root);
    const pz = $('[data-tp-pic] ' + O('tp-pic-z'), root), img = pz && $('img', pz), band = $('[data-tp-band]', root), gl = $('[data-tp-line]', root);
    const tl = gsap.timeline({ defaults: { ease: SETTLE } });
    if (band) tl.fromTo(band, { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: ON, duration: 1.6, ease: DRAW }, 0);
    tl.fromTo(lines, { y: 0, yPercent: 108 }, { y: 0, yPercent: 0, duration: 1.4, stagger: 0.1 }, 0.1);
    if (back) tl.fromTo(back, { opacity: 0 }, { opacity: 1, duration: 1.2 }, 0.2);
    if (meta) tl.fromTo(meta, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 1.2, clearProps: 'transform' }, 0.45);
    if (gl) tl.fromTo(gl, { scaleX: 0 }, { scaleX: 1, duration: 2.0, ease: DRAW }, 0.35);
    if (pz) tl.fromTo(pz, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: ON, duration: 1.4, ease: DRAW }, 0.55);
    if (img) tl.fromTo(img, { scale: 1.06 }, { scale: 1, duration: 2.0 }, 0.55);
  }

  function reading(gsap, ST) {
    if (!root) return;
    const SETTLE = 'expo.out', DRAW = G.DRAW, ON = 'inset(0% 0% 0% 0%)';
    const at = (el, start, fn) => { if (!el) return; ST.create({ trigger: el, start, once: true, onEnter: fn }); };
    const rise = (els, o = {}) => gsap.fromTo(els, { opacity: 0, y: o.y != null ? o.y : 16 }, { opacity: 1, y: 0, duration: o.d != null ? o.d : 1.2, delay: o.delay || 0, stagger: o.stagger != null ? o.stagger : 0.08, ease: SETTLE, clearProps: 'transform' });
    // the portrait's depth (scroll-linked, restrained)
    const hero = $(O('tp-a-hero'), root), pic = $(O('tp-a-pic'), root);
    if (hero && pic) gsap.fromTo(pic, { y: 0 }, { y: -56, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
    // the facts: each rule draws, then its label and value
    $$(O('tp-f'), root).forEach(f => at(f, 'top 90%', () => {
      const r = $(O('tp-f-rule'), f); if (r) gsap.fromTo(r, { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: DRAW });
      rise([$(O('tp-f-k'), f), $(O('tp-f-v'), f)].filter(Boolean), { delay: 0.25 });
    }));
    // the bio: the first paragraph line by line (its lines in masks, as the name), then the others as they come
    const b1 = $(O('tp-b1'), root);
    if (b1 && W.SplitText) {
      let played = false;
      // (1.0.2, a11y sweep 10/21) aria 'none', as every other split on the site: SplitText's default hid the lines from
      // screen readers and named the paragraph with aria-label, which a <p> may not carry, so the bio's opening was silent
      W.SplitText.create(b1, { type: 'lines', mask: 'lines', linesClass: 'tp-sl', autoSplit: true, aria: 'none', onSplit(self) {
        b1.style.opacity = 1;
        if (played) return;
        return gsap.fromTo(self.lines, { yPercent: 108 }, { yPercent: 0, duration: 1.3, stagger: 0.08, ease: SETTLE,
          scrollTrigger: { trigger: b1, start: 'top 88%', once: true, onEnter: () => { played = true; } } });
      } });
    } else if (b1) at(b1, 'top 88%', () => rise(b1));
    $$(O('tp-b'), root).filter(p => p !== b1).forEach(p => at(p, 'top 90%', () => rise(p, { d: 1.1 })));
    // the cards: the sheet opens upward; the heading and the list follow
    $$('[data-tp-card]', root).forEach((c, i) => at(c, 'top 88%', () => {
      const d = W.innerWidth > 1199 ? i * 0.14 : 0;
      gsap.fromTo($(O('tp-card-sheet'), c), { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: ON, duration: 1.3, ease: DRAW, delay: d });
      rise([$(O('tp-card-h'), c), $(O('tp-list'), c)].filter(Boolean), { delay: d + 0.35, stagger: 0.12 });
    }));
    // the way on: its rule draws across, then the next person and the way back
    const next = $(O('tp-next'), root);
    if (next) at(next, 'top 86%', () => {
      const r = $(O('tp-next-rule'), next); if (r) gsap.fromTo(r, { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: DRAW });
      rise($$('[data-tp-r]', next), { delay: 0.3, stagger: 0.12 });
    });
  }

  gfx.page({
    field,
    foot: {},
    dom: () => safe('person dom', dom),
    start: api => safe('arrival', () => arrival(api.gsap)),
    rooms: api => safe('reading', () => reading(api.gsap, api.ST)),
    still: () => { H.classList.remove('tp-m'); }
  });
})();
