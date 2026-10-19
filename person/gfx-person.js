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
  W.__gfxPerson = '1.0.1';
  const H = D.documentElement, $ = gfx.$, $$ = gfx.$$, safe = gfx.safe, REDUCE = gfx.REDUCE, G = gfx.G;
  const O = c => '[data-o~="' + c + '"]';
  // the local page's html classes, before the body is parsed (the ported stylesheet reads them); tp-m holds the arrival
  // states until the motion runs (and lets go after 4 s if it never does)
  H.classList.add('gf-flow', 'gf-flow2', 'gf-flow3', 'gf-dark-black', 'ow-js', 'gfx-tp-js', 'tp', 'tp-v-a');
  if (REDUCE) H.classList.add('ow-reduce');
  else { H.classList.add('tp-m'); setTimeout(() => { if (!H.classList.contains('tp-go')) H.classList.remove('tp-m'); }, 4000); }
  const MAIL = '<svg class="tp-ico-g" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><rect x="2.75" y="4.75" width="14.5" height="10.5" rx=".5"/><path d="M3.2 5.3 10 10.6l6.8-5.3"/></svg>';
  let root = null;
  const field = { rooms: [] };

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
      W.SplitText.create(b1, { type: 'lines', mask: 'lines', linesClass: 'tp-sl', autoSplit: true, onSplit(self) {
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
