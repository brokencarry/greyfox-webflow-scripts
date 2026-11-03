/* ====================================================================================================
   GREY FOX · THE CLIENT PORTAL, AS CLIENTS SEE IT ON A DESKTOP (10/18). The founder: "every product view should look
   accurate. It is a DIRECT representation of us." So this is not a drawing of the portal: it IS the portal. The real
   client page (greyfox-live-pipelines public/, copied read-only into portal-demo/live/ by make-live-portal.js) runs in the
   window on FICTIONAL data (live/fixtures.js) with the site's colours (live/brand-gf.css). Its layout, type, spacing and
   behaviour are the product's own; it lays itself out at the window's width, as it would in a browser that size.

   The window: one shared, quiet browser frame. A slim tab strip with one tab (the real Grey Fox gold fox favicon, the
   page's real title, "{client} - Pipeline"), an address bar with the client's own subdomain in the real pattern
   ({client}.greyfoxpartners.com), window controls, a 1 px border, 10 px corners, no heavy shadow.

   The story (about 7 s, then it holds): the report sits at its top; the page reads down to the stage movements; the pointer
   goes to the company that has just moved into Handoff and clicks it; the portal's own behaviour scrolls to that company's
   card and lights it, its next action and notes open beneath.

   API (unchanged, so the pages keep their calls)
     GFPortalDemo.mount(el, opts)   the convenience-store search (Arlenby Fuel Partners), Home
     GFSearchScene.mount(el, opts)  the commercial HVAC search (Halverne Capital), Investors
     opts: { autoplay, loop, reducedMotion, label }  → { play(), pause(), settle(), restart(), destroy(), ready, el, state }
   ==================================================================================================== */
(function () {
  'use strict';
  if (window.GFDesktopPortal) return;
  const me = document.currentScript, BASE = me && me.src ? me.src.replace(/[^/]*$/, '') : 'portal-demo/';
  const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const CLIENTS = {
    fuel: { title: 'Arlenby Fuel Partners - Pipeline', host: 'arlenby.greyfoxpartners.com', hero: 'Kessington Markets' },
    hvac: { title: 'Halverne Capital - Pipeline', host: 'halverne.greyfoxpartners.com', hero: 'Brackwell Mechanical' }
  };
  const LOCK = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4.5 7V5.2a3.5 3.5 0 0 1 7 0V7" fill="none" stroke="currentColor" stroke-width="1.3"/><rect x="3.2" y="7" width="9.6" height="7" rx="1.4" fill="currentColor"/></svg>';
  const CURSOR = '<svg viewBox="0 0 15 21" aria-hidden="true"><path d="M1.3 1.1v15.6l3.9-3.7 2.6 6.2 2.9-1.2-2.6-6.1h5.5z" fill="#fff" stroke="#111112" stroke-width="1.05" stroke-linejoin="round"/></svg>';
  const ease = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const mount = (host, o) => {
    o = o || {}; const key = o.client || 'fuel', C = CLIENTS[key] || CLIENTS.fuel;
    const reduce = o.reducedMotion != null ? !!o.reducedMotion : matchMedia('(prefers-reduced-motion: reduce)').matches;
    const label = o.label || ('A client’s pipeline report in the Grey Fox portal. Illustrative companies and figures.');
    host.classList.add('dp-host');
    host.innerHTML = `<div class="dp-win${o.theme === 'dark' ? ' is-dark' : ''}" role="img" aria-label="${esc(label)}">
      <div class="dp-tabs" aria-hidden="true"><div class="dp-tab"><img class="dp-fav" src="${BASE}../assets/favicon-gold.svg" alt=""><span>${esc(C.title)}</span></div><div class="dp-wc"><i></i><i></i><i></i></div></div>
      <div class="dp-bar" aria-hidden="true"><div class="dp-nav"><i></i><i></i></div><div class="dp-url">${LOCK}<span>${esc(C.host)}</span></div></div>
      <div class="dp-view" aria-hidden="true"><iframe class="dp-frame" title="" tabindex="-1" loading="eager"></iframe><div class="dp-cur">${CURSOR}</div><div class="dp-shield"></div></div></div>`;
    const frame = host.querySelector('.dp-frame'), view = host.querySelector('.dp-view'), cur = host.querySelector('.dp-cur');
    /* (10/20, Webflow port) jsDelivr serves .html as text/plain, so the portal's page cannot be framed by its address: it is
       fetched as text and written into the frame (srcdoc), with a <base> at its own folder on the CDN, so its stylesheets,
       scripts and fonts load from there as before. Its parameters (?c, ?t) travel as window.__GF_PORTAL_Q (fixtures.js and
       app.js read that first); srcdoc keeps the frame same-origin, so the story below reads its document as before. */
    const q = `?c=${key}${o.theme === 'dark' ? '&t=dark' : ''}`, live = BASE + 'live/';
    fetch(live + 'portal.html', { mode: 'cors', credentials: 'omit' }).then(r => r.text()).then(t => {
      const head = `<base href="${esc(live)}"><script>window.__GF_PORTAL_Q=${JSON.stringify(q)};</script>`;
      // (10/29, engine pass) Firefox's preloader reads a srcdoc frame's files before it applies the <base>: the page's five
      // relative files were first asked of the site itself (five 404s on every Home and Investors view); they are written in full
      t = t.replace(/(\s(?:src|href)=")(?![a-z][a-z0-9+.-]*:|\/|#)([^"]+)"/gi, (m, a, u) => a + live + u + '"');
      frame.srcdoc = t.replace(/<head([^>]*)>/i, m => m + head);
    }).catch(() => {});
    // ZOOMED OUT (the founder: 'so a viewer can see more'): the portal is laid out at a wider desktop (the window's width / Z) and
    // shown at Z, so more of the real page shows; Z keeps its body text at 11 px or more. Text stays vector-sharp at any DPR
    let Z = 0.75; const fit = () => { const w = view.clientWidth || 800; Z = Math.max(0.7, Math.min(0.8, w / 1120)); frame.style.width = (100 / Z) + '%'; frame.style.height = (100 / Z) + '%'; frame.style.transform = 'scale(' + Z + ')'; };
    fit(); addEventListener('resize', fit);
    let state = 'idle', timers = [], raf = 0, io = null;
    const ready = new Promise(res => { const chk = () => { try { const d = frame.contentDocument; if (d && d.querySelector('.company-row')) return res(); } catch (e) {} setTimeout(chk, 120); }; frame.addEventListener('load', chk); chk(); });
    const win = () => frame.contentWindow, doc = () => frame.contentDocument;
    const clear = () => { timers.forEach(clearTimeout); timers = []; cancelAnimationFrame(raf); };
    const at = (ms, f) => timers.push(setTimeout(f, ms));
    const scrollTo = (y, dur) => new Promise(res => { const w = win(); const y0 = w.scrollY, t0 = performance.now();
      const step = now => { const t = Math.min(1, (now - t0) / dur); w.scrollTo(0, y0 + (y - y0) * ease(t)); if (t < 1) raf = requestAnimationFrame(step); else res(); }; raf = requestAnimationFrame(step); });
    const heroRow = () => doc().querySelector(`.company-row[data-company="${C.hero.replace(/"/g, '\\"')}"]`);
    const moveRow = () => [...doc().querySelectorAll('#movementBody .mv-link')].find(td => td.textContent.trim() === C.hero);
    const pointer = (x, y, ms) => { x *= Z; y *= Z; cur.style.transition = ms ? `transform ${ms}ms cubic-bezier(.45,0,.25,1), opacity .3s` : 'none'; cur.style.transform = `translate3d(${x}px, ${y}px, 0)`; };
    const end = () => { clear(); ready.then(() => { const r = heroRow(); if (!r) return; const w = win(); const y = r.getBoundingClientRect().top + w.scrollY - 24; w.scrollTo(0, w.__gfSnap ? w.__gfSnap(y) : y); cur.style.opacity = 0; state = 'done'; }); };
    const play = () => {
      if (state === 'running' || state === 'done') return;
      if (reduce) return end();
      state = 'running';
      ready.then(() => {
        const w = win(), mv = moveRow(); if (!mv) return end();
        w.scrollTo(0, 0); cur.style.opacity = 0;
        // 1 · the report, read down to the stage movements
        at(900, () => { const mr = mv.closest('table, section, .movements-section') || mv; const y = Math.max(0, mv.getBoundingClientRect().top + w.scrollY - 150); scrollTo(w.__gfSnap ? w.__gfSnap(y) : y, 1600); });
        // 2 · the pointer comes to the newest movement and clicks it
        at(2700, () => { const r = mv.getBoundingClientRect(); pointer(r.left + Math.min(110, r.width * 0.5) + 160, r.top + 120, 0); cur.style.opacity = 1;
          requestAnimationFrame(() => pointer(r.left + Math.min(110, r.width * 0.5), r.top + r.height * 0.6, 1000)); });
        at(3850, () => { cur.classList.add('is-press'); });
        at(4000, () => { cur.classList.remove('is-press'); mv.click(); });   // the portal's own behaviour: scroll to the card, light it
        at(4600, () => { cur.style.opacity = 0; });
        at(6200, () => { state = 'done'; if (o.loop) at(7000, () => { state = 'idle'; play(); }); });
      });
    };
    const api = { el: host, get state() { return state; }, play, settle: end, pause: clear, restart: () => { clear(); state = 'idle'; play(); },
      destroy: () => { clear(); io && io.disconnect(); host.innerHTML = ''; }, ready: ready.then(() => api) };
    if (reduce) end();
    else if (o.autoplay && 'IntersectionObserver' in window) { io = new IntersectionObserver(es => es.forEach(e => { if (e.intersectionRatio >= 0.5 && state === 'idle') play(); }), { threshold: [0, 0.5] }); io.observe(host); }
    return api;
  };
  window.GFDesktopPortal = { mount };
  window.GFPortalDemo = { mount: (el, o) => mount(el, Object.assign({ client: 'fuel' }, o)) };
  window.GFSearchScene = { mount: (el, o) => mount(el, Object.assign({ client: 'hvac' }, o)) };
})();
