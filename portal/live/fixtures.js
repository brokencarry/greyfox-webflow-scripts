/* (10/20, Webflow port: the parameters may come as window.__GF_PORTAL_Q, set by desktop-portal.js in the srcdoc frame)
   The real client portal (portal.html, copied from greyfox-live-pipelines) runs here on FICTIONAL data: this replaces its one
   API call (/api/pipeline/:mandate) with an invented pipeline, and every other call with an empty answer. No Salesforce, no
   real company, no network. ?c=fuel (Home: Arlenby Fuel Partners) or ?c=hvac (Investors: Halverne Capital). */
(function () {
  const co = (name, web, rev, ebitda, states, notes, extra) => Object.assign({ accountId: 'a-' + name.replace(/\W+/g, '').toLowerCase(), oppId: 'o-' + name.replace(/\W+/g, '').toLowerCase(), name, website: web,
    revenue: rev, revenueRaw: parseFloat(String(rev).replace(/[^\d.]/g, '')) * 1e6, ebitda, ebitdaRaw: parseFloat(String(ebitda).replace(/[^\d.]/g, '')) * 1e6, states, statesRaw: states, notes,
    ballInCourt: 'Grey Fox', nextAction: 'Site visit scheduled', nextActionDate: '2026-10-21', stageChangeDate: '2026-10-' + String(3 + (name.length % 8)).padStart(2, '0') }, extra || {});
  const HVAC = { clientName: 'Halverne Capital', clientWordmarkMain: 'Halverne', clientWordmarkSub: 'Capital', subSectors: ['Commercial HVAC & Mechanical Services'], period: 'October 2026', reportDate: 'October 12, 2026', generatedAt: '2026-10-12T14:00:00Z',
    activePipeline: 27, totalTracked: 412, features: { namedOwner: false, nextAction: true }, stageOrder: [],
    summary: [{ stage: 'Handoff', count: 4 }, { stage: 'Qualified', count: 9 }, { stage: 'Engaged', count: 12 }, { stage: 'Nurture', count: 2 }, { stage: 'Seller Pass', count: 6 }, { stage: 'Internal Pass', count: 11 }],
    movements: [{ company: 'Brackwell Mechanical', from: 'Qualified', to: 'Handoff' }, { company: 'Ostrander Air & Heat', from: 'Engaged', to: 'Qualified' }, { company: 'Quillon Climate Services', from: 'Engaged', to: 'Qualified' }, { company: 'Tessaly Comfort Systems', from: 'Engaged', to: 'Seller Pass', isPass: true }],
    activeSections: [
      { stage: 'Handoff', count: 4, companies: [
        co('Brackwell Mechanical', 'brackwellmech.com', '$38M', '$4.6M', 'NC, SC', 'Founder-owned commercial HVAC contractor in the Carolinas, started in 1994.\n64 service technicians and 18 installers; about 70% of the work is service.\nRevenue of $35M to $40M, as described by the owner.\nMaintenance agreements are about 45% of revenue and renew at about 92%.', { nextAction: 'Notes sent to Halverne · Site visit scheduled 10/21' }),
        co('Ostrander Air & Heat', 'ostranderair.com', '$22M', '$2.9M', 'GA', 'Second-generation owner; open to a partner with capital for a second branch.'),
        co('Quillon Climate Services', 'quillonclimate.com', '$31M', '$3.8M', 'TN, KY', 'Service-led; strong recurring base in hospitals and schools.'),
        co('Marrowdale Mechanical', 'marrowdale.com', '$17M', '$2.1M', 'VA', 'Owner wants to stay on through a transition of two to three years.') ] },
      { stage: 'Qualified', count: 9, companies: [
        co('Fenwick Ridge HVAC', 'fenwickridge.com', '$14M', '$1.7M', 'NC', 'Founder near retirement; no family successor.'),
        co('Calder Point Mechanical', 'calderpoint.com', '$26M', '$3.1M', 'SC, GA', 'Commercial service and controls; strong in light industrial.'),
        co('Harlow & Pike Services', 'harlowpike.com', '$11M', '$1.3M', 'FL', 'Growing maintenance book; asked about rollover equity.') ] },
      { stage: 'Engaged', count: 12, companies: [co('Wexley Air Systems', 'wexleyair.com', '$9M', '$1.1M', 'AL', 'First call held; owner asked for a second conversation.')] },
      { stage: 'Nurture', count: 2, companies: [co('Dunmore Climate', 'dunmoreclimate.com', '$7M', '$0.8M', 'MS', 'Not ready until 2027.')] }],
    passSections: [{ stage: 'Seller Pass', count: 1, companies: [co('Tessaly Comfort Systems', 'tessalycomfort.com', '$12M', '$1.2M', 'GA', '', { reason: 'Owner decided to keep the business in the family.' })] }] };
  const FUEL = JSON.parse(JSON.stringify(HVAC));
  const rename = { 'Brackwell Mechanical': 'Kessington Markets', 'Ostrander Air & Heat': 'Abberly Stop & Go', 'Quillon Climate Services': 'Ostwick Travel Centers', 'Marrowdale Mechanical': 'Callowell Corner Markets', 'Fenwick Ridge HVAC': 'Cobbleton Quick Stop', 'Calder Point Mechanical': 'Pevenley Petro & Market', 'Harlow & Pike Services': 'Lindwick Express', 'Wexley Air Systems': 'Tarrow Gas & Go', 'Dunmore Climate': 'Elsby Corner Stores', 'Tessaly Comfort Systems': 'Ravenmoor Fuel',
    'brackwellmech.com': 'kessingtonmarkets.com', 'ostranderair.com': 'abberlystop.com', 'quillonclimate.com': 'ostwicktravel.com', 'marrowdale.com': 'callowellmarkets.com', 'fenwickridge.com': 'cobbletonquick.com', 'calderpoint.com': 'pevenley.com', 'harlowpike.com': 'lindwickexpress.com', 'wexleyair.com': 'tarrowgas.com', 'dunmoreclimate.com': 'elsbystores.com', 'tessalycomfort.com': 'ravenmoorfuel.com' };
  const swap = o => { if (Array.isArray(o)) return o.forEach(swap); if (o && typeof o === 'object') for (const k in o) { if (typeof o[k] === 'string' && rename[o[k]]) o[k] = rename[o[k]]; else swap(o[k]); } };
  swap(FUEL);
  Object.assign(FUEL, { clientName: 'Arlenby Fuel Partners', clientWordmarkMain: 'Arlenby', clientWordmarkSub: 'Fuel Partners', subSectors: ['Convenience & Fuel Retail'], period: 'September 2026', reportDate: 'September 8, 2026', generatedAt: '2026-09-08T14:00:00Z', activePipeline: 32, totalTracked: 226 });
  FUEL.summary = [{ stage: 'Handoff', count: 4 }, { stage: 'Qualified', count: 10 }, { stage: 'Engaged', count: 16 }, { stage: 'Nurture', count: 2 }, { stage: 'Seller Pass', count: 5 }, { stage: 'Internal Pass', count: 9 }];
  const h = FUEL.activeSections[0].companies;
  Object.assign(h[0], { revenue: '$150M', revenueRaw: 150e6, ebitda: '$9.8M', ebitdaRaw: 9.8e6, states: 'TN, KY', statesRaw: 'TN, KY', nextAction: 'Notes sent to Arlenby · Site visit scheduled 9/16', nextActionDate: '2026-09-16', stageChangeDate: '2026-09-07',
    notes: 'Family-owned convenience chain in east Tennessee and southern Kentucky, now run by the second generation.\n38 stores across two states; fuel at 34 of them and oil-change bays at 6.\nRevenue of $140M to $160M, as described by the owner, about two-thirds of it fuel.\nOwns the land and buildings at 29 of the 38 stores.' });
  Object.assign(h[1], { revenue: '$46M', revenueRaw: 46e6, ebitda: '$3.1M', ebitdaRaw: 3.1e6, states: 'AR', statesRaw: 'AR', notes: 'Fourteen stores; the founder wants a partner who keeps the brand.' });
  Object.assign(h[2], { revenue: '$210M', revenueRaw: 210e6, ebitda: '$12.4M', ebitdaRaw: 12.4e6, states: 'OK, TX', statesRaw: 'OK, TX', notes: 'Nine highway travel centers with truck fuel and dining.' });
  Object.assign(h[3], { revenue: '$71M', revenueRaw: 71e6, ebitda: '$4.6M', ebitdaRaw: 4.6e6, states: 'GA, AL', statesRaw: 'GA, AL', notes: 'Twenty-two corner markets; owner open to a minority sale first.' });
  FUEL.activeSections.forEach(s => s.companies.forEach(c => { if (c.nextActionDate === '2026-10-21') c.nextActionDate = '2026-09-16'; if (/^2026-10/.test(c.stageChangeDate)) c.stageChangeDate = c.stageChangeDate.replace('2026-10', '2026-09'); }));
  FUEL.activeSections[1].count = 10; FUEL.activeSections[2].count = 16;
  const DATA = { hvac: HVAC, fuel: FUEL };
  const key = (new URLSearchParams(window.__GF_PORTAL_Q || location.search).get('c')) || 'fuel';
  window.__MANDATE_KEY__ = key;
  // (the report is read on its own date: 'in stage' and 'due' are counted from it, as on the day it was sent)
  const NOW = new Date((DATA[key] || FUEL).generatedAt).getTime(), _D = Date;
  window.Date = class extends _D { constructor(...a) { if (a.length) super(...a); else super(NOW); } static now() { return NOW; } };
  // (the report's own dates are read against "today": pinned to the report's date, so "in stage" reads as on that day)
  const _real = window.fetch;
  window.fetch = (u) => { const s = String(u); const m = /\/api\/pipeline\/([\w-]+)/.exec(s);
    const body = m ? JSON.stringify(DATA[m[1]] || DATA[key]) : '{}';
    return Promise.resolve(new Response(body, { status: 200, headers: { 'content-type': 'application/json' } })); };
  try { sessionStorage.setItem('gfx_notes_hint', '1'); localStorage.removeItem('gf_theme'); } catch (e) {}
  // (?t=dark: the portal's own dark theme, for comparison; light is what every client sees by default)
  if (new URLSearchParams(window.__GF_PORTAL_Q || location.search).get('t') === 'dark') { document.documentElement.setAttribute('data-theme', 'dark'); try { localStorage.setItem('gf_theme', 'dark'); } catch (e) {} }
  if (navigator.sendBeacon) navigator.sendBeacon = () => true;
  /* (10/19, found on the GPU walk) INSIDE THE SITE'S FRAME THE PORTAL MOVES ITS OWN PAGE ONLY. Its scrollIntoView (the
     movement link's "scroll to the card", a stage jump) also scrolled every page around the frame, so a reader who had
     moved on was carried back up to the window seconds later (Home: from the page's end back to the market stage). Framed,
     it now scrolls the portal's own scroller to the same place; focus never scrolls the page around it either */
  if (window.parent !== window) {
    const scroller = el => { for (let n = el.parentElement; n && n !== document.body && n !== document.documentElement; n = n.parentElement) { const cs = getComputedStyle(n); if (/(auto|scroll|overlay)/.test(cs.overflowY) && n.scrollHeight > n.clientHeight + 1) return n; } return null; };
    /* (10/19, final critic) THE WINDOW'S EDGE FALLS BETWEEN ROWS: wherever the story rests, a row the window's bottom edge
       would cut in half (a stage count without its label, "Ravenmoor Fuel" halved) is shown whole when that moves the page
       less, or kept wholly out of view otherwise. Rows are the report's own lines: table rows, the strips, the cards' lines */
    const ROWS = 'tr, .summary-strip, .meta-row, .company-row, .stage-header, h1, h2, h3, h4, p, li, dt, dd';
    window.__gfSnap = y => {
      const se = document.scrollingElement || document.documentElement, max = se.scrollHeight - innerHeight;
      // (the lines themselves: a row that holds other rows, a whole card, is never "cut", its lines are)
      // (and every element that carries words of its own: a card's header line, a figure, a label)
      const own = e => [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
      const cur = se.scrollTop, R = [...document.querySelectorAll(ROWS)].filter(e => !e.querySelector(ROWS)).concat([...document.body.querySelectorAll('*')].filter(own)).map(e => e.getBoundingClientRect())
        .filter(r => r.height > 4 && r.width > 4 && r.height < innerHeight * 0.5).map(r => [r.top + cur, r.bottom + cur]);
      const cuts = v => R.filter(([t, b]) => (t < v - 2 && b > v + 2) || (t < v + innerHeight - 2 && b > v + innerHeight + 2)).length;
      // the nearest place, within 160 px either way, where the edges cut the fewest lines (none, wherever that exists)
      let best = Math.max(0, Math.min(max, y)), bc = cuts(best);
      for (let d = 2; d <= 160 && bc; d += 2) for (const v of [y + d, y - d]) { if (v < 0 || v > max) continue; const c = cuts(v); if (c < bc) { bc = c; best = v; if (!c) break; } }
      return Math.round(best);
    };
    Element.prototype.scrollIntoView = function (o) {
      const opt = o && typeof o === 'object' ? o : { block: o === false ? 'end' : 'start' }, sc = scroller(this), r = this.getBoundingClientRect();
      const box = sc ? sc.getBoundingClientRect() : { top: 0, height: innerHeight }, cur = sc ? sc.scrollTop : (document.scrollingElement || document.documentElement).scrollTop;
      let y = cur + r.top - box.top;
      if (opt.block === 'center') y -= (box.height - r.height) / 2; else if (opt.block === 'end') y -= box.height - r.height;
      else if (opt.block === 'nearest') { if (r.top >= box.top && r.bottom <= box.top + box.height) return; if (r.bottom > box.top + box.height) y -= box.height - r.height; }
      if (!sc) y = window.__gfSnap(Math.max(0, y));
      (sc || window).scrollTo({ top: Math.max(0, y), behavior: opt.behavior === 'smooth' ? 'smooth' : 'auto' });
    };
    const focus = HTMLElement.prototype.focus;
    HTMLElement.prototype.focus = function (o) { return focus.call(this, Object.assign({}, o, { preventScroll: true })); };
  }
})();
