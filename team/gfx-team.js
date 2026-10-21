/*!
 * Grey Fox · gfx Team (Flow 3), the Team layer on the shared core + the inner-page layer (pages/gfx-pages.js).
 * team 1.0.1 · 2026-10-20 (1.0.1: the hiring link's arrow steps aside at rest, one arrowhead per view) · Webflow page "Team v2 (Claude build)" (/team-v2).
 *
 * WHAT IT IS
 *   What the approved local Team (prototype/team/final.html: r2.js + r3.js + t-flow2.js, Flow 3 the default) adds to the
 *   inner pages (pages/gfx-pages.js plays the hero's words, the rooms' heads, the close and the one turn into it):
 *   - the name room's emblem (r2.js A·0): the logo's outline, large, half past the right edge, its chin on the room's
 *     hairline, 130 % of the words' height, never nearer the words than the grid's gap (a phone, 1.0.3: under the words, 72 % of the screen wide, drawn as it comes into view). The line draws once
 *     from the brow outward (DRAW), the faint fill settles behind it (SETTLE); it moves 3.5 % slower than the words.
 *     Drawn once (t2-once: no light passes). Its two drawings are the page's decoration, drawn here into the native box;
 *   - the people (r2.js A·2, Flow 3: nothing holds): each portrait opens upward as it reaches 88 % of the screen
 *     (clip + 1.06 -> 1), its name, title and Biography line with it; a hard flick past the band's top at 45 % finishes them
 *     in 0.3 s (t-flow2.js); the photographs settle 1.04 -> 1 while the band is on screen;
 *   - the names are links to the person pages (native links; t-flow2.js made them so locally);
 *   - the small arrow beside "See open roles" (gfArrow.icon, as gf-site.js draws every small arrow).
 * Reduced motion: every room settled, the emblem drawn and filled.
 */
(function () {
  'use strict';
  var W = window, D = document, gfx = W.gfx;
  if (!gfx || !gfx.pages || W.__gfxTeam) return;
  W.__gfxTeam = '1.0.3';
  const P = gfx.pages, O = P.O, H = D.documentElement, G = gfx.G, $ = gfx.$, $$ = gfx.$$, safe = gfx.safe, REDUCE = gfx.REDUCE;
  const SETTLE = G.SETTLE, DRAW = G.DRAW;
  // the local page's html classes the ported stylesheet reads (t2-once: the emblem draws once; tf-on: Team on the field)
  H.classList.add('t2-once', 'tf-on', 't3-on');

  const EMB = '<svg class="t2-emb-fill" viewBox="0 0 41 40" focusable="false"><path d="M25.6328 40H22.5586V38.4798L23.4889 38.1458C24.0676 37.9387 24.4529 37.3905 24.4529 36.7757V24.1881C24.4529 20.694 27.2856 17.8613 30.7796 17.8613H38.198V18.3494C38.198 19.6658 37.1313 20.7325 35.8149 20.7325H31.8231C29.9673 20.7325 28.4631 22.2367 28.4631 24.0925V25.787H30.7315C32.0158 25.787 33.0576 24.7459 33.0576 23.4608H39.3748C39.3748 23.4608 38.1972 26.0735 34.5795 27.4236C30.961 28.7729 28.2657 30.0653 28.2906 34.057C28.3194 38.6226 25.6312 40 25.6312 40H25.6328Z"/><path d="M36.5033 29.1838C36.5033 29.1838 30.4912 29.6534 29.8643 37.1063C29.8643 37.1063 31.399 31.9707 36.5033 29.1838Z"/><path d="M38.1638 16.1379C38.1638 16.1379 40.2323 7.86708 37.5329 3.73167C37.5329 3.73167 33.6295 5.91413 31.7641 10.564C31.8291 10.5327 33.0379 9.94037 34.5196 10.1073C34.5196 10.1073 33.3405 12.8943 29.7798 13.6383C26.2199 14.3848 22.1857 17.4591 22.1857 23.4463V35.4969C21.9778 35.3829 21.741 35.3203 21.4897 35.3203H19.2928C18.8915 35.3203 18.5262 35.4824 18.2653 35.7457C17.9997 36.009 17.8375 36.3718 17.8375 36.7756C17.8375 37.3896 18.2244 37.9378 18.804 38.1457L19.7318 38.4796V39.9999H16.66C15.517 39.4364 14.9294 38.3031 14.63 37.1071C14.4799 36.957 8.3049 30.855 0.595154 27.6258C-0.279769 22.4365 1.69721 17.9295 6.06459 16.3418C9.40455 15.1257 13.2863 15.991 16.1431 18.4953L14.4992 20.4796C13.4886 19.1576 11.8937 18.3067 10.1029 18.3067C7.04547 18.3067 4.56842 20.7838 4.56842 23.8412C4.56842 26.8986 7.04547 29.3781 10.1029 29.3781C11.0356 29.3781 11.9129 29.1461 12.6843 28.74C12.2782 28.288 11.7757 27.8578 11.1472 27.4733C8.19654 25.6657 8.49835 23.1445 8.49835 23.1445H11.1255C11.1231 23.1589 11.1207 23.1734 11.1183 23.1854C10.9008 24.3573 11.8311 25.4281 13.0231 25.4281H15.6478C17.2861 26.6754 18.5985 30.5106 18.5985 30.5106V23.4463C18.5985 17.4599 14.565 14.3856 11.0043 13.6383C7.442 12.8943 6.26448 10.1073 6.26448 10.1073C7.74623 9.94037 8.95427 10.5327 9.02009 10.564C7.15145 5.91413 3.25121 3.73167 3.25121 3.73167C0.551796 7.86708 2.61789 16.1379 2.61789 16.1379C-2.54977 10.9678 1.52788 0 1.52788 0C10.8887 2.12469 15.0819 10.6708 15.0819 10.6708C17.083 9.53743 20.3917 9.71163 20.3917 9.71163C20.3917 9.71163 23.6979 9.53743 25.7014 10.6708C25.7014 10.6708 29.8946 2.12469 39.2554 0C39.2554 0 43.3331 10.9678 38.163 16.1379H38.1638Z"/></svg>' +
    '<svg class="t2-emb-line" viewBox="0 0 41 40" focusable="false"><path class="t2-emb-left" d="M20.3917 9.7116C20.3917 9.7116 17.083 9.5374 15.0819 10.6708C15.0819 10.6708 10.8887 2.1247 1.5279 0C1.5279 0 -2.5498 10.9678 2.6179 16.1379C2.6179 16.1379 0.5518 7.8671 3.2512 3.7317C3.2512 3.7317 7.1514 5.9141 9.0201 10.564C8.9543 10.5327 7.7462 9.9404 6.2645 10.1073C6.2645 10.1073 7.442 12.8943 11.0043 13.6383C14.565 14.3856 18.5985 17.4599 18.5985 23.4463L18.5985 30.5106C18.5985 30.5106 17.2861 26.6754 15.6478 25.4281L13.0231 25.4281C11.8311 25.4281 10.9008 24.3573 11.1183 23.1854C11.1207 23.1734 11.1231 23.1589 11.1255 23.1445L8.4984 23.1445C8.4984 23.1445 8.1965 25.6657 11.1472 27.4733C11.7757 27.8578 12.2782 28.288 12.6843 28.74C11.9129 29.1461 11.0356 29.3781 10.1029 29.3781C7.0455 29.3781 4.5684 26.8986 4.5684 23.8412C4.5684 20.7838 7.0455 18.3067 10.1029 18.3067C11.8937 18.3067 13.4886 19.1576 14.4992 20.4796L16.1431 18.4953C13.2863 15.991 9.4046 15.1257 6.0646 16.3418C1.6972 17.9295 -0.2798 22.4365 0.5952 27.6258C8.3049 30.855 14.4799 36.957 14.63 37.1071C14.9294 38.3031 15.517 39.4364 16.66 39.9999L19.7318 39.9999" pathLength="1"/><path class="t2-emb-right" d="M20.3917 9.7116C20.3917 9.7116 23.6979 9.5374 25.7014 10.6708C25.7014 10.6708 29.8946 2.1247 39.2554 0C39.2554 0 43.3331 10.9678 38.163 16.1379L38.1638 16.1379C38.1638 16.1379 40.2323 7.8671 37.5329 3.7317C37.5329 3.7317 33.6295 5.9141 31.7641 10.564C31.8291 10.5327 33.0379 9.9404 34.5196 10.1073C34.5196 10.1073 33.3405 12.8943 29.7798 13.6383C26.2199 14.3848 22.1857 17.4591 22.1857 23.4463L22.1857 35.4969C21.9778 35.3829 21.741 35.3203 21.4897 35.3203L19.2928 35.3203C18.8915 35.3203 18.5262 35.4824 18.2653 35.7457C17.9997 36.009 17.8375 36.3718 17.8375 36.7756C17.8375 37.3896 18.2244 37.9378 18.804 38.1457L19.7318 38.4796L19.7318 39.9999" pathLength="1"/><path class="t2-emb-jaw" d="M22.5586 40V38.4798L23.4889 38.1458C24.0676 37.9387 24.4529 37.3905 24.4529 36.7757V24.1881C24.4529 20.694 27.2856 17.8613 30.7796 17.8613H38.198V18.3494C38.198 19.6658 37.1313 20.7325 35.8149 20.7325H31.8231C29.9673 20.7325 28.4631 22.2367 28.4631 24.0925V25.787H30.7315C32.0158 25.787 33.0576 24.7459 33.0576 23.4608H39.3748C39.3748 23.4608 38.1972 26.0735 34.5795 27.4236C30.961 28.7729 28.2657 30.0653 28.2906 34.057C28.3194 38.6226 25.6312 40 25.6312 40H22.5586" pathLength="1"/><path class="t2-emb-flick" d="M36.5033 29.1838C36.5033 29.1838 30.4912 29.6534 29.8643 37.1063" pathLength="1"/></svg>' +
    '<span class="t2-emb-lit"><i></i></span>';

  /* ========================= the emblem (r2.js A·0, as Flow 3 plays it) ========================= */
  let E = null;
  function emblem() {
    const emb = $(O('t2-name') + ' ' + O('t2-emb')), Pb = emb && $(O('t2-emb-p'), emb); if (!emb || !Pb) return null;
    if (!$('.t2-emb-line', Pb)) Pb.innerHTML = EMB;
    emb.classList.add('is-wait');
    const hero = emb.closest(O('t2-name')), fill = $('.t2-emb-fill', emb), lit = $('.t2-emb-lit', emb);
    const line = { left: $('.t2-emb-left', emb), right: $('.t2-emb-right', emb), jaw: $('.t2-emb-jaw', emb), flick: $('.t2-emb-flick', emb) };
    const FILLS = $$('.t2-emb-fill path', emb).map(p => p.getAttribute('d')), LINES = Object.values(line).map(p => p.getAttribute('d'));
    const hwrap = $(O('ow-hwrap'), hero), h1 = $('h1, h2', hero), paras = $$(O('t2-lede') + ' ' + O('ow-lead'), hero), rule = $(O('ow-hero-foot') + ' ' + O('ow-rule'), hero) || $(O('ow-hero-foot'), hero);
    const K = { weight: 2, tall: 1.3, brow: 20.39 / 41, par: 0.035, fillA: 0.065, min: 280 };
    const textBox = () => {
      const rg = D.createRange(), boxes = [];
      [h1, ...paras].forEach(n => { if (!n) return; const tw = D.createTreeWalker(n, NodeFilter.SHOW_TEXT);
        for (let t; (t = tw.nextNode());) { if (!t.textContent.trim()) continue; rg.selectNodeContents(t); boxes.push(rg.getBoundingClientRect()); } });
      return { right: Math.max(...boxes.map(b => b.right)), bottom: Math.max(...boxes.map(b => b.bottom)) };
    };
    let geo = null, motion = false, pend = false, under = false;
    const lay = () => {
      geo = null;
      const hr = hero.getBoundingClientRect(), vw = hero.clientWidth; if (!vw || !hwrap || !rule) return;
      const gap = parseFloat(getComputedStyle(hero).getPropertyValue('--gap')) || 96;
      const tb = textBox(), top = hwrap.getBoundingClientRect().top - hr.top, bottom = ($(O('ow-hero-l'), hero) || hwrap).getBoundingClientRect().bottom - hr.top, right = tb.right - hr.left;
      const ruleY = rule.getBoundingClientRect().top - hr.top;
      // (1.0.3, founder 10/21: option A) a phone: the fox stands under the words in the room gfx-team.css holds for it,
      // 72 % of the screen wide (at most 340 px), chin on the hairline, a fifth past the right edge
      under = W.matchMedia('(max-width: 767px)').matches;
      let Hh = K.tall * (bottom - top), on = true, Wd, X;
      if (under) {
        Wd = Math.min(0.72 * vw, 340); Hh = Wd * 40 / 41; X = vw - 0.78 * Wd;
      } else {
        Hh = Math.min(Hh, ruleY - 72 - 24);
        const room = vw - right - gap;
        if (K.brow * Hh * 41 / 40 > room) Hh = room / K.brow * 40 / 41;
        if (Hh < K.min) on = false;
        Wd = Hh * 41 / 40; X = vw - K.brow * Wd;
      }
      emb.classList.toggle('is-off', !on); emb.classList.add('is-set');
      if (!on) return;
      emb.style.setProperty('--emb-s', Wd.toFixed(1) + 'px');
      emb.style.setProperty('--emb-x', X.toFixed(1) + 'px');
      emb.style.setProperty('--emb-y', (ruleY - Hh).toFixed(1) + 'px');
      const w = K.weight * 41 / Wd; emb.style.setProperty('--emb-w', w.toFixed(4));
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 43 42" preserveAspectRatio="none"><g fill-opacity=".16">${FILLS.map(d => `<path d="${d}"/>`).join('')}</g>` +
        `<g fill="none" stroke="#000" stroke-width="${w.toFixed(4)}" stroke-linejoin="miter">${LINES.map(d => `<path d="${d}"/>`).join('')}</g></svg>`;
      emb.style.setProperty('--emb-mask', `url("data:image/svg+xml,${encodeURIComponent(svg)}")`);
      par();
    };
    // the parallax: the room's own movement on screen, the fox 3.5 % behind it (measured once per layout)
    const par = () => {
      pend = false;
      if (!motion) { Pb.style.transform = ''; return; }
      if (!geo) geo = { top: hero.getBoundingClientRect().top + W.scrollY, h: hero.offsetHeight };
      const top = geo.top - W.scrollY; if (top + geo.h < 0 || top > W.innerHeight) return;
      Pb.style.transform = `translate3d(0, ${(-K.par * top).toFixed(2)}px, 0)`;
    };
    addEventListener('scroll', () => { if (!pend && motion) { pend = true; requestAnimationFrame(par); } }, { passive: true });
    addEventListener('resize', () => { geo = null; requestAnimationFrame(lay); });
    if ('ResizeObserver' in W) new ResizeObserver(() => requestAnimationFrame(lay)).observe(hero);
    lay(); if (D.fonts && D.fonts.ready) D.fonts.ready.then(lay);
    const gsap = () => W.gsap;
    let tl = null;
    const film = delay => {
      const g = gsap(); emb.classList.remove('is-wait'); if (!g) return;
      const len = k => line[k].getTotalLength(), L = { left: len('left'), right: len('right'), jaw: len('jaw') };
      const total = Math.max(L.right + L.jaw, L.left), s = { v: 0 }, OFF = 1.02;
      const paint = () => { const x = s.v * total;
        line.left.style.strokeDashoffset = OFF * (1 - Math.min(1, x / L.left));
        line.right.style.strokeDashoffset = OFF * (1 - Math.min(1, x / L.right));
        line.jaw.style.strokeDashoffset = OFF * (1 - Math.max(0, Math.min(1, (x - L.right) / L.jaw))); };
      g.set([line.left, line.right, line.jaw, line.flick], { strokeDashoffset: OFF }); g.set(fill, { opacity: 0 }); g.set(lit, { opacity: 0 });
      const Dd = G.hairline.duration * 2, F = G.picture.settle || 1.6;
      tl = g.timeline({ delay })
        .to(s, { v: 1, duration: Dd, ease: DRAW, onUpdate: paint }, 0)
        .fromTo(line.flick, { strokeDashoffset: OFF }, { strokeDashoffset: 0, duration: G.arrow.duration, ease: SETTLE }, Dd - 0.15)
        .to(fill, { opacity: K.fillA, duration: F, ease: SETTLE }, Dd - 0.15);
    };
    return {
      lay,
      reduced: () => { emb.classList.remove('is-wait'); emb.classList.add('is-set'); lay(); },
      // (1.0.3) on a phone the fox stands below the first screen's words: it draws when a third of it is on screen, so the
      // reader sees it drawn rather than finding it finished
      start: delay => { motion = true; par();
        if (!under || !('IntersectionObserver' in W)) return film(delay);
        const io = new IntersectionObserver(es => { if (!es.some(e => e.isIntersecting)) return; io.disconnect(); film(Math.min(delay, 0.2)); }, { threshold: 0.33 });
        io.observe(Pb); },
      ff: () => { const g = gsap(); if (g && tl && tl.progress() < 1) g.to(tl, { progress: 1, duration: G.fastForward || 0.3, overwrite: true }); }
    };
  }

  /* ========================= the people (r2.js A·2, not held: each portrait as it reaches 88 %) ========================= */
  function people(api) {
    const gsap = api.gsap, ST = api.ST;
    const tri = $(O('t2-tri')); if (!tri) return;
    const band = $(O('t2-band'), tri), cards = $$(O('t2-p'), tri), imgs = $$(O('t2-p-pic') + ' img', tri), creds = $$(O('t2-p-w') + ' > *', tri);
    gsap.set(imgs, { clipPath: 'inset(100% 0% 0% 0%)', scale: G.picture.scaleFrom });
    gsap.set(creds, { opacity: 0, y: G.detail.y }); creds.forEach(e => e.setAttribute('data-gfx-reveal', ''));
    if (band) band.style.removeProperty('--fx');
    const once = (trigger, start, play) => { let done = false;
      ST.create({ trigger, start, onEnter: s => { if (done) return; done = true; play(false); s.kill(); }, onLeave: s => { if (done) return; done = true; play(true); s.kill(); } }); };
    const tls = cards.map(c => {
      const im = imgs.filter(m => c.contains(m)), cr = creds.filter(e => c.contains(e)), t = gsap.timeline({ paused: true });
      t.to(im, { clipPath: 'inset(0% 0% 0% 0%)', duration: G.picture.duration, ease: DRAW }, 0)
        .to(im, { scale: 1, duration: G.picture.duration + 0.5, ease: SETTLE }, 0.2)
        .to(cr, { opacity: 1, y: 0, duration: Math.min(0.7, G.detail.duration), ease: SETTLE, stagger: G.detail.stagger, clearProps: 'transform' }, 0.3);
      once(c, 'top 88%', skip => skip ? t.progress(1) : t.play());
      return t;
    });
    // a hard flick (t-flow2.js): finished in 0.3 s once the band's top has passed 45 % of the screen
    if (band) ST.create({ trigger: band, start: 'top 45%', once: true, onEnter: () => tls.forEach(t => { if (t.progress() < 1) gsap.to(t, { progress: 1, duration: 0.3, overwrite: true }); }) });
    // the breath: the photographs settle slowly while the band is on screen
    imgs.forEach(img => { img.style.scale = 1.04; ST.create({ trigger: band || tri, start: 'top bottom', end: 'bottom top', onUpdate: s => { img.style.scale = (1.04 - 0.04 * s.progress).toFixed(4); } }); });
  }

  /* ========================= the small arrow beside a text link (gf-site.js glyphs) ========================= */
  function glyphs() {
    const A = W.gfArrow; if (!A) return;
    $$(O('ow-tl') + ' ' + O('ow-nw')).forEach(nw => { if ($('svg', nw)) return; const t = D.createElement('div'); t.innerHTML = A.icon('ow-arw'); nw.appendChild(t.firstChild); });
  }

  P.run({
    dom: () => { safe('glyphs', glyphs); E = safe('emblem', emblem) || null; },
    start: () => { if (E) E.start(0.1 + G.hairline.at); },   // (1.0.3) with the hairline, not a second after it
    rooms: api => safe('people', () => people(api)),
    still: () => { if (E) E.reduced(); H.classList.add('t2-on'); }
  });
})();
