/*!
 * Grey Fox · gfx Privacy (Flow 3), the Privacy layer on the shared core + the inner-page layer (pages/gfx-pages.js).
 * privacy 1.0.0 · 2026-10-20 · Webflow page "Privacy v2 (Claude build)" (/privacy-v2).
 *
 * WHAT IT IS
 *   What the approved local Privacy (prototype/privacy/index.html + privacy.js) adds to the inner pages:
 *   - the contents list: a section's link takes the reader there (the page's own smoothing, at once under reduced motion),
 *     moves focus to the section's heading, and the list marks the section being read (aria-current);
 *   - the sections' arrival: as each section comes up the screen its hairline draws and its heading rises. Only sections
 *     still below the screen when the script runs are held back; the text itself never moves;
 *   - a link from elsewhere to a section (/privacy#security) lands with that section's heading just under the bar.
 *   In Flow 3 nothing holds, so a section's place is its place in the page.
 * Reduced motion: nothing is held back; the list still marks the section being read.
 */
(function () {
  'use strict';
  var W = window, D = document, gfx = W.gfx;
  if (!gfx || !gfx.pages || W.__gfxPrivacy) return;
  W.__gfxPrivacy = '1.0.0';
  const P = gfx.pages, O = P.O, H = D.documentElement, $ = gfx.$, $$ = gfx.$$, safe = gfx.safe, REDUCE = gfx.REDUCE;
  const zone = () => (parseFloat(getComputedStyle(H).getPropertyValue('--gf-zone')) || 74) + 24;
  const go = (y, smooth, done) => { y = Math.max(0, Math.round(y)); const L = gfx.lenis;
    if (L && smooth && !REDUCE) L.scrollTo(y, { duration: 1.1, force: true, onComplete: done });
    else { if (L) L.scrollTo(y, { immediate: true, force: true }); else W.scrollTo(0, y); if (done) done(); } };

  // ---- the sections' arrival (privacy.css pv-wait / pv-in) ----
  function arrival() {
    const secs = $$(O('pv-sec'));
    if (REDUCE || !('IntersectionObserver' in W) || !secs.length) return;
    const below = secs.filter(s => s.getBoundingClientRect().top > W.innerHeight * 0.92);
    below.forEach(s => s.classList.add('pv-wait'));
    H.classList.add('pv-anim');
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting || e.boundingClientRect.top < 0) { e.target.classList.add('pv-in'); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -12% 0px' });
    below.forEach(s => io.observe(s));
    W.addEventListener('beforeprint', () => below.forEach(s => s.classList.add('pv-in')));
  }

  // ---- the contents list ----
  function contents() {
    const toc = $(O('pv-toc')); if (!toc) return;
    const links = $$('a[href*="#"]', toc);
    const secs = links.map(a => D.getElementById(decodeURIComponent((a.getAttribute('href') || '').split('#')[1] || '')));
    if (!links.length || secs.some(s => !s)) return;
    const flowY = sec => sec.getBoundingClientRect().top + W.scrollY;
    let cur = -1, tops = null, docH = 0;
    const measure = () => { tops = secs.map(flowY); docH = H.scrollHeight; };
    const mark = () => {
      if (!tops) measure();
      const y = W.scrollY, line = W.innerHeight * 0.33, end = W.innerHeight + y >= docH - 4;
      let i = -1; tops.forEach((t, k) => { if (t - y <= line) i = k; });
      if (end && tops[tops.length - 1] - y < W.innerHeight) i = secs.length - 1;
      if (i === cur) return; cur = i;
      links.forEach((a, k) => { if (k === i) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current'); });
    };
    let raf = 0; const req = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; mark(); }); };
    const again = () => { tops = null; req(); };
    W.addEventListener('scroll', req, { passive: true }); W.addEventListener('resize', again); W.addEventListener('load', again);
    if (D.fonts) D.fonts.ready.then(again);
    if (W.ScrollTrigger) W.ScrollTrigger.addEventListener('refresh', again);
    mark();
    const land = t => { t.classList.add('pv-in'); requestAnimationFrame(() => { go(flowY(t) - zone(), false); again(); }); };
    // a link from elsewhere to a section lands with its heading just under the bar, once the page has laid out
    const t0 = location.hash && secs.find(s => '#' + s.id === decodeURIComponent(location.hash));
    if (t0) { if (D.readyState === 'complete') setTimeout(() => land(t0), 300); else W.addEventListener('load', () => setTimeout(() => land(t0), 300)); }
    W.addEventListener('hashchange', () => { const t = secs.find(s => '#' + s.id === decodeURIComponent(location.hash)); if (t) land(t); });
    toc.addEventListener('click', e => {
      const a = e.target.closest('a[href*="#"]'); if (!a) return;
      const i = links.indexOf(a), sec = secs[i]; if (!sec) return;
      e.preventDefault();
      sec.classList.add('pv-in');
      const h = $(O('pv-h'), sec) || sec;
      const arrive = () => { if (!h.hasAttribute('tabindex')) h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); req(); };
      go(flowY(sec) - zone(), true, arrive);
      try { history.replaceState(null, '', '#' + sec.id); } catch (err) { /* */ }
    });
  }

  P.run({
    current: '',
    // (as the local page: the sections below the screen are read as the page is parsed, before the fonts settle)
    dom: () => { safe('arrival', arrival); safe('contents', contents); }
  });
})();
