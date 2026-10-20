/* Grey Fox · Owners · the partnership film (Webflow port of the local prototype's B v7, approved 10/20; film7.js).
   Loaded by the Owners layer only as the room approaches (owners/pt/pt-film.js = the map data geo4.js + this engine).
   Port changes: the room's parts are found by their data-o names (ow-pt, pt-map, pt-film, pt-tl); no blur option and no
   SVG filter (WebKit); no Lenis of its own (the site's runs); started by window.gfxPtFilm(room). window.__p6.seek kept
   for the partnership session's tests.
   B v7: B v6 with the owner's choice in the left column. One time vocabulary: "At the sale", "Five years later". ONE screen.
   The words and the outcome on the left; on the right a live film of the map (not a video file) that plays ONCE when it
   comes into view (pauses if it leaves, holds on its final frame, a quiet Replay), on a STILL camera: only the business
   moves. One clock drives the year label, the earnings, the timeline (its progress bar) and the two bars.
   Map, places, territory and numbers: as B v4 (stage4.js; the second bite's model on six add-ons). */
(function (w, d) {
  const G = w.GF_PGEO, PF = w.GF_PFIELD, NS = 'http://www.w3.org/2000/svg';
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v)), f1 = n => (+n).toFixed(1), f2 = n => (+n).toFixed(2);
  // the house curves (gf-line.css): moves on cubic-bezier(.45, 0, .25, 1); arrivals on (.16, 1, .3, 1)
  const bez = (x1, y1, x2, y2) => t => { if (t <= 0) return 0; if (t >= 1) return 1; let u = t; for (let i = 0; i < 8; i++) { const x = 3 * (1 - u) * (1 - u) * u * x1 + 3 * (1 - u) * u * u * x2 + u * u * u - t, dx = 3 * (1 - u) * (1 - u) * x1 + 6 * (1 - u) * u * (x2 - x1) + 3 * u * u * (1 - x2); if (Math.abs(x) < 1e-5 || !dx) break; u = clamp(u - x / dx, 0, 1); } return 3 * (1 - u) * (1 - u) * u * y1 + 3 * (1 - u) * u * u * y2 + u * u * u; };
  const MOVE = bez(.45, 0, .25, 1), ARRIVE = bez(.16, 1, .3, 1);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- the story ---------- */
  const A = G.at, M = PF.metros;
  // each company is a small cluster of branches around its metro (offsets in plan units, about 2.3 to the mile)
  const at = (m, dx = 0, dy = 0) => [m[0] + dx, m[1] + dy];
  const PL = [
    { k: 'HQ', at: A.HQ, from: 0, hq: true }, { k: 'L1', at: A.L1, from: 1 }, { k: 'L2', at: A.L2, from: 1 },
    { k: 'a1a', at: A.I1a, join: 2 }, { k: 'a1b', at: A.I1b, join: 2 }, { k: 'a1c', at: M.Trenton, join: 2 },
    { k: 'a2a', at: M.Baltimore, join: 3 }, { k: 'a2b', at: at(M.Baltimore, 30, 30), join: 3 }, { k: 'a2c', at: M.Richmond, join: 3 }, { k: 'a2d', at: at(M.Richmond, -44, -34), join: 3 }, { k: 'a2e', at: at(M.Richmond, 18, 54), join: 3 },
    { k: 'a3a', at: M.Albany, join: 3 }, { k: 'a3b', at: at(M.Albany, -60, -8), join: 3 }, { k: 'a3c', at: at(M.Albany, 12, -72), join: 3 },
    { k: 'n1', at: M.Reading, open: 3 },
    { k: 'a4a', at: M.Hartford, join: 4 }, { k: 'a4b', at: M['New Haven'], join: 4 }, { k: 'a4c', at: M.Springfield, join: 4 },
    { k: 'a5a', at: M.Columbus, join: 4 }, { k: 'a5b', at: at(M.Columbus, 62, -40), join: 4 }, { k: 'a5c', at: at(M.Columbus, -50, 34), join: 4 },
    { k: 'a6a', at: M.Raleigh, join: 5 }, { k: 'a6b', at: at(M.Raleigh, -62, -18), join: 5 }, { k: 'a6c', at: at(M.Raleigh, 38, 50), join: 5 },
    { k: 'n2', at: M.Allentown, open: 5 }, { k: 'n3', at: M.Scranton, open: 5 }, { k: 'n4', at: M.Frederick, open: 5 }, { k: 'n5', at: M['Bel Air'], open: 5 }, { k: 'n6', at: M.Fredericksburg, open: 5 }
  ];
  const IN = p => p.from != null ? p.from : p.join != null ? p.join : p.open;   // the step from which a place is the business
  const STATES_AT = { PA: 1, NJ: 2, MD: 3, VA: 3, NY: 3, CT: 4, MA: 4, OH: 4, NC: 5 };
  const EARN = [2.5, 2.5, 2.7, 3.9, 6.6, 10.3, 12.5, 12.5];     // by step (0 and 1 are the sale; 7 is the later sale)
  const YEAR = ['', 'At the sale', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'A later sale', 'A later sale'];
  const LBL = { PA: 'Pennsylvania', NJ: 'New Jersey', NY: 'New York', CT: 'Connecticut', MA: 'Massachusetts', MD: 'Maryland', VA: 'Virginia', OH: 'Ohio', NC: 'North Carolina',
    DE: 'Delaware', WV: 'West Virginia', VT: 'Vermont', NH: 'New Hampshire', KY: 'Kentucky', RI: 'Rhode Island' };
  const LBL_AT = G.labels;

  // field dots: drop the ones under the business's own places
  const FIELD = PF.pts.filter(([x, y]) => PL.every(p => Math.hypot(p.at[0] - x, p.at[1] - y) > 16));

  /* ---------- the territory: a smooth field around each location, contoured once per step ---------- */
  const R = 66, CELL = 5, LEVELS = [0.1, 0.18, 0.28, 0.4, 0.52, 0.65, 0.8, 0.95];   // eight faint levels, no outline, no filter: a wash, not a drawn shape
  const contour = (pts, T) => {
    const X0 = -760, Y0 = -420, X1 = 1300, Y1 = 1460, nx = Math.ceil((X1 - X0) / CELL) + 1, ny = Math.ceil((Y1 - Y0) / CELL) + 1;
    const v = new Float32Array(nx * ny), R2 = R * R, rr = 3 * R;
    pts.forEach(([px, py, wt]) => {
      const i0 = Math.max(0, Math.floor((px - rr - X0) / CELL)), i1 = Math.min(nx - 1, Math.ceil((px + rr - X0) / CELL));
      const j0 = Math.max(0, Math.floor((py - rr - Y0) / CELL)), j1 = Math.min(ny - 1, Math.ceil((py + rr - Y0) / CELL));
      for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) { const dx = X0 + i * CELL - px, dy = Y0 + j * CELL - py; v[j * nx + i] += wt * Math.exp(-(dx * dx + dy * dy) / R2); }
    });
    const P = new Map(), N = new Map(), lr = (a, b) => (T - a) / (b - a);
    const link = (ka, pa, kb, pb) => { P.set(ka, pa); P.set(kb, pb); (N.get(ka) || N.set(ka, []).get(ka)).push(kb); (N.get(kb) || N.set(kb, []).get(kb)).push(ka); };
    for (let j = 0; j < ny - 1; j++) for (let i = 0; i < nx - 1; i++) {
      const a = v[j * nx + i], b = v[j * nx + i + 1], c = v[(j + 1) * nx + i + 1], e = v[(j + 1) * nx + i];
      const id = (a > T ? 8 : 0) | (b > T ? 4 : 0) | (c > T ? 2 : 0) | (e > T ? 1 : 0);
      if (id === 0 || id === 15) continue;
      const E = {
        t: ['h' + i + ',' + j, [X0 + (i + lr(a, b)) * CELL, Y0 + j * CELL]], b: ['h' + i + ',' + (j + 1), [X0 + (i + lr(e, c)) * CELL, Y0 + (j + 1) * CELL]],
        l: ['v' + i + ',' + j, [X0 + i * CELL, Y0 + (j + lr(a, e)) * CELL]], r: ['v' + (i + 1) + ',' + j, [X0 + (i + 1) * CELL, Y0 + (j + lr(b, c)) * CELL]]
      };
      const S = { 1: ['lb'], 2: ['br'], 3: ['lr'], 4: ['tr'], 5: ['tl', 'br'], 6: ['tb'], 7: ['tl'], 8: ['tl'], 9: ['tb'], 10: ['tr', 'lb'], 11: ['tr'], 12: ['lr'], 13: ['br'], 14: ['lb'] }[id];
      S.forEach(s => link(E[s[0]][0], E[s[0]][1], E[s[1]][0], E[s[1]][1]));
    }
    const seen = new Set(), loops = [];
    for (const k0 of N.keys()) {
      if (seen.has(k0)) continue;
      const loop = []; let prev = null, k = k0;
      while (k && !seen.has(k)) { seen.add(k); loop.push(P.get(k)); const nb = N.get(k).find(q => q !== prev && !seen.has(q)); prev = k; k = nb; }
      if (loop.length > 6) loops.push(loop);
    }
    const chaikin = L => { let Q = L; for (let it = 0; it < 2; it++) { const O = []; for (let i = 0; i < Q.length; i++) { const p = Q[i], q = Q[(i + 1) % Q.length]; O.push([p[0] * .75 + q[0] * .25, p[1] * .75 + q[1] * .25], [p[0] * .25 + q[0] * .75, p[1] * .25 + q[1] * .75]); } Q = O; } return Q; };
    return loops.map(L => 'M' + chaikin(L).filter((p, i) => i % 2 === 0).map(p => f1(p[0]) + ' ' + f1(p[1])).join('L') + 'Z').join('');
  };
  const TERR = [];
  for (let s = 0; s <= 7; s++) { const pts = PL.filter(p => IN(p) <= Math.min(s, 6)).map(p => [p.at[0], p.at[1], p.hq ? 1.15 : 1]); TERR[s] = s < 1 ? [] : LEVELS.map(T => contour(pts, T)); }

  /* ---------- the camera: each step frames what matters, inside the part of the screen the words leave free ---------- */
  const WIDE = (() => { const X = PF.pts.map(p => p[0]), Y = PF.pts.map(p => p[1]); return [Math.min(...X) - 60, Math.max(...X) + 60, Math.min(...Y) - 60, Math.max(...Y) + 60]; })();   // the eastern United States
  const box = s => {
    if (s === 0) return WIDE;
    if (s >= 6) { const b = box(5.5); return [b[0] - 110, b[1] + 110, b[2] - 80, b[3] + 80]; }
    const P = PL.filter(p => IN(p) <= Math.ceil(s)), pad = s === 1 ? 200 : 110;
    return [Math.min(...P.map(p => p.at[0])) - pad, Math.max(...P.map(p => p.at[0])) + pad, Math.min(...P.map(p => p.at[1])) - pad, Math.max(...P.map(p => p.at[1])) + pad];
  };
  const SAFE = { d: { cx: .685, w: .56 }, m: { cx: .5, cy: .3, w: .92, h: .5 } };

  /* ---------- the house head (gf-site.js gfArrow.headPaths, copied: two strokes flicked back 30°, tapering) ---------- */
  const ribbon = P => { const Mx = P.length - 1, L = [], Rr = []; P.forEach((p, i) => { const a = P[Math.max(0, i - 1)], b = P[Math.min(Mx, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l; L.push(f2(p[0] + nx * p[2] / 2) + ' ' + f2(p[1] + ny * p[2] / 2)); Rr.push(f2(p[0] - nx * p[2] / 2) + ' ' + f2(p[1] - ny * p[2] / 2)); }); return 'M' + L.join(' L') + ' L' + Rr.reverse().join(' L') + ' Z'; };
  const headPaths = (x, y, ux, uy, len, wd) => [1, -1].map(sg => { const ang = Math.atan2(uy, ux) + Math.PI + sg * 0.52, P = []; for (let j = 0; j <= 12; j++) { const k = j / 12, bend = sg * 0.12 * Math.sin(Math.PI * k); P.push([x + Math.cos(ang + bend) * len * k, y + Math.sin(ang + bend) * len * k, wd * (1 - k * 0.8)]); } return ribbon(P); });

  /* ---------- (pt 1.1.0) B v8, founder-approved 10/20: the routes and the covered field ---------- */
  const groupOf = p => p.k.replace(/[a-z]$/, '');                      // a1a, a1b → a1 (one company)
  const ROUTES = [];
  PL.forEach(p => {
    if (p.join != null) { const mine = ROUTES.filter(r => r.g === groupOf(p)); const dist = r => Math.hypot(r.to[0] - p.at[0], r.to[1] - p.at[1]); if (!mine.length) ROUTES.push({ step: p.join, from: A.HQ, to: p.at, g: groupOf(p) }); else if (mine.every(r => dist(r) > 90)) ROUTES.push({ step: p.join, from: mine.sort((a, b) => dist(a) - dist(b))[0].to, to: p.at, g: groupOf(p), cont: true }); return; }
  });
  const arc = (a, b, bow) => { const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, dx = b[0] - a[0], dy = b[1] - a[1]; return `M${f1(a[0])} ${f1(a[1])}Q${f1(mx - dy * bow)} ${f1(my + dx * bow)} ${f1(b[0])} ${f1(b[1])}`; };
  // the field a step's territory covers (within 34 plan units of any place in by then)
  const COVER = FIELD.map(([x, y]) => { let c = 99; PL.forEach(p => { if (Math.hypot(p.at[0] - x, p.at[1] - y) < 34) c = Math.min(c, Math.max(1, IN(p))); }); return c; });

  /* ---------- build ---------- */
  const dot = (x, y) => `M${f1(x)} ${f1(y)}h0`;
  const part = (root, name) => root.querySelector('[data-o~="' + name + '"]');
  const build = sec => {
    const map = part(sec, 'pt-map');
    const g = [];
    g.push(`<defs></defs><g class="p3-land">${G.states.map(s => `<path d="${s.d}"/>`).join('')}</g><path class="p3-bd" d="${G.borders}"/>`);
    g.push(`<g class="p3-terr">${TERR.map((L, s) => `<g data-s="${s}">${L.map((t, i) => `<path class="lv${i}" d="${t}"/>`).join('')}</g>`).join('')}</g>`);
    g.push(`<g class="p8-routes">${ROUTES.map(r => `<path class="p8-r${r.cont ? ' is-cont' : ''}" data-step="${r.step}" pathLength="1" d="${arc(r.from, r.to, r.cont ? 0.08 : 0.12)}"/>`).join('')}</g>`);
    g.push(`<g class="p3-lbl">${Object.entries(LBL).filter(([k]) => STATES_AT[k]).map(([k, n]) => `<g class="p3-s${STATES_AT[k] ? ' is-fp' : ''}" data-st="${k}" data-x="${LBL_AT[k][0]}" data-y="${LBL_AT[k][1]}"><text>${n}</text></g>`).join('')}</g>`);
    for (const c of [...new Set(COVER)]) g.push(`<path class="p3-field" data-cov="${c}" d="${FIELD.filter((_, i) => COVER[i] === c).map(([x, y]) => dot(x, y)).join('')}"/>`);
    g.push(`<g class="p3-you"><path class="p3-you-o" d="${dot(...A.HQ)}"/><path class="p3-you-i" d="${dot(...A.HQ)}"/></g>`);
    g.push(`<g class="p3-locs">${PL.map(p => `<path class="p3-halo" data-k="${p.k}" d="${dot(...p.at)}"/><path class="p3-loc${p.hq ? ' is-hq' : ''}${p.open != null ? ' is-new' : ''}" data-k="${p.k}" d="${dot(...p.at)}"/>`).join('')}</g>`);
    g.push(`<g class="p3-s p3-youl" data-x="${A.HQ[0]}" data-y="${A.HQ[1]}"><text x="0" y="-20" text-anchor="middle">Your company</text></g>`);
    map.innerHTML = `<svg class="p3-svg" viewBox="${WIDE[0]} ${WIDE[2]} ${WIDE[1] - WIDE[0]} ${WIDE[3] - WIDE[2]}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="An illustrative company over five years with a partner. It starts as one of hundreds of owner-run companies across the eastern United States: three locations around Lancaster, Pennsylvania. Over four years six companies join it, in New Jersey, Maryland and Virginia, upstate New York, Connecticut and Massachusetts, Ohio and North Carolina, and new locations open between them. By year five it is one company across nine states.">${g.join('')}</svg>`;
    const top = map.querySelector('svg');
    const layer = cls => { const v = d.createElementNS(NS, 'svg'); v.setAttribute('class', 'p3-svg ' + cls); v.setAttribute('viewBox', top.getAttribute('viewBox')); v.setAttribute('preserveAspectRatio', 'xMidYMid slice'); v.setAttribute('aria-hidden', 'true'); return v; };
    const base = layer('p7-base'), wash = layer('p7-wash');
    base.append(top.querySelector('.p3-land'), top.querySelector('.p3-bd'));
    wash.append(top.querySelector('defs'), top.querySelector('.p3-terr'));
    map.insertBefore(wash, top); map.insertBefore(base, wash); top.classList.add('p7-top');
    return top;
  };

  // Webflow stores the Replay control as a link block with no address (not reachable by keyboard): make it a real button,
  // keeping its attributes and words
  const asButton = el => {
    if (!el || el.tagName === 'BUTTON') return el;
    const b = d.createElement('button'); b.type = 'button';
    [...el.attributes].forEach(a => { if (a.name !== 'href' && a.name !== 'type') b.setAttribute(a.name, a.value); });
    b.textContent = el.textContent.trim(); el.replaceWith(b); return b;
  };
  const init = sec => {
    asButton(sec.querySelector('[data-replay]'));
    const S = build(sec), map = part(sec, 'pt-map'), film = part(sec, 'pt-film');
    const scal = [...S.querySelectorAll('.p3-s')].map(el => ({ el, x: +el.dataset.x, y: +el.dataset.y }));
    const locs = PL.map(p => ({ p, el: S.querySelector(`.p3-loc[data-k="${p.k}"]`), halo: S.querySelector(`.p3-halo[data-k="${p.k}"]`) }));
    const routes = [...S.querySelectorAll('.p8-r')], fields = [...S.querySelectorAll('.p3-field')], terr = [...map.querySelectorAll('.p3-terr > g')], lbls = [...S.querySelectorAll('.p3-lbl .p3-s')];
    const tl = part(sec, 'pt-tl'), yrs = [...sec.querySelectorAll('[data-yr]')], nums = [...sec.querySelectorAll('[data-num]')], num = { set textContent(v) { nums.forEach(n => n.textContent = v); } }, yr = { set textContent(v) { yrs.forEach(n => n.textContent = v); } }, replay = sec.querySelector('[data-replay]');
    const phone = () => matchMedia('(max-width: 767px)').matches;

    // the timeline under the film: six stops, then the rise into the house head at the later sale (the film's progress bar)
    let tlFill, tlDots = [];
    const drawTl = () => {
      const Wd = Math.max(240, tl.clientWidth), W0 = 4, W1 = Wd - 46, Y = 26, xs = [0, 1, 2, 3, 4, 5].map(i => W0 + (W1 - W0) * i / 5), tx = W1 + 26, ty = Y - 26 * 0.787;
      const L = Math.hypot(tx - W1, ty - Y), [h1, h2] = headPaths(tx, ty, (tx - W1) / L, (ty - Y) / L, 11, 1.8);
      const names = ['At the sale', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'];
      tl.innerHTML = `<svg viewBox="0 0 ${Wd} 58" width="${Wd}" height="58" aria-hidden="true"><path class="tl-track" d="M${W0} ${Y}H${W1}"/><path class="tl-fill" d="M${W0} ${Y}H${W1}" pathLength="1" style="transition:none"/>` +
        xs.map((x, i) => `<circle class="tl-dot" data-i="${i}" cx="${x}" cy="${Y}" r="3.2"/><text class="tl-n" data-i="${i}" x="${x}" y="50" text-anchor="${i === 0 ? 'start' : 'middle'}">${phone() && i > 0 && i < 5 ? '' : names[i]}</text>`).join('') +
        `<path class="tl-rise" d="M${W1} ${Y}L${f2(tx)} ${f2(ty)}" pathLength="1"/><g class="tl-head"><path d="${h1}"/><path d="${h2}"/></g><text class="tl-n tl-end" x="${f2(tx + 4)}" y="${f2(ty - 10)}" text-anchor="end">Five years later</text></svg>`;
      tlFill = tl.querySelector('.tl-fill'); tlDots = [...tl.querySelectorAll('.tl-dot, .tl-n[data-i]')];
    };

    // the still camera: everything the business will become, inside the film, with the field around it
    const frame = () => {
      const bw = map.clientWidth || 1, bh = map.clientHeight || 1, X = PL.map(p => p.at[0]), Y = PL.map(p => p.at[1]);
      const x0 = Math.min(...X) - (phone() ? 70 : 120), x1 = Math.max(...X) + (phone() ? 300 : 120), y0 = Math.min(...Y) - 110, y1 = Math.max(...Y) + 110;
      const Z = phone() ? { cx: .5, cy: .5, w: .94, h: .9 } : { cx: .5, cy: .47, w: .9, h: .84 };
      const vw = Math.max((x1 - x0) / Z.w, (y1 - y0) / Z.h * bw / bh), vh = vw * bh / bw;
      const c = [(x0 + x1) / 2 - Z.cx * vw, (y0 + y1) / 2 - Z.cy * vh, vw, vh];
      const vb = c.map(f1).join(' '); map.querySelectorAll('svg').forEach(v => v.setAttribute('viewBox', vb));
      const k = vw / bw; scal.forEach(o => o.el.setAttribute('transform', `translate(${o.x} ${o.y}) scale(${k.toFixed(4)})`));
    };

    // the territory spreads from its new places (as v4)
    let mk = 0;
    const spread = (s, back) => {
      const tg = map.querySelector('.p3-terr'); tg.classList.toggle('no-fade', !back && s >= 2 && s <= 6);
      terr.forEach((p, i) => { p.classList.toggle('is-on', i === Math.min(s, 7)); p.removeAttribute('mask'); });
      requestAnimationFrame(() => requestAnimationFrame(() => tg.classList.remove('no-fade')));
      const P = PL.filter(p => IN(p) === Math.min(s, 6));
      if (back || reduce || s < 2 || s > 6 || !P.length) return;
      const id = 'p5m' + (++mk), defs = map.querySelector('.p7-wash defs');
      defs.querySelectorAll('mask').forEach(m => m.remove());
      const m = d.createElementNS(NS, 'mask'); m.setAttribute('id', id); m.setAttribute('maskUnits', 'userSpaceOnUse'); m.setAttribute('x', -3000); m.setAttribute('y', -3000); m.setAttribute('width', 7000); m.setAttribute('height', 7000);
      m.innerHTML = `<path d="${TERR[s - 1][0] || ''}" fill="#fff"/>` + P.map(p => `<circle cx="${p.at[0]}" cy="${p.at[1]}" r="0" fill="#fff"/>`).join('');
      defs.appendChild(m); terr[s].setAttribute('mask', `url(#${id})`);
      const cs = [...m.querySelectorAll('circle')], st = performance.now() + 650, Dur = 900;
      const grow = now => { const e = ARRIVE(clamp((now - st) / Dur, 0, 1)); cs.forEach(c => c.setAttribute('r', f1(e * R * 3.2))); if (e < 1 && terr[s].getAttribute('mask') === `url(#${id})`) requestAnimationFrame(grow); else if (e >= 1) terr[s].removeAttribute('mask'); };
      requestAnimationFrame(grow);
    };
    const countIn = (a, v) => { const st = performance.now() + (reduce ? 0 : 600), Dur = reduce ? 0 : 800;
      const run = now => { const e = Dur ? ARRIVE(clamp((now - st) / Dur, 0, 1)) : 1; if (now < st) { requestAnimationFrame(run); return; } num.textContent = '$' + (a + (v - a) * e).toFixed(1) + 'M'; if (e < 1) requestAnimationFrame(run); }; requestAnimationFrame(run); };

    // one step of the story (0 your company · 1 at the sale · 2-6 years 1-5 · 7 the later sale)
    let cur = -1;
    const setStep = (s, back) => {
      if (s === cur) return; cur = s; sec.dataset.step = s;
      locs.forEach(({ p, el, halo }, i) => {
        const on = s >= IN(p), was = el.classList.contains('is-in');
        el.classList.toggle('is-in', on);
        if (on && !was && !back && (p.join != null || p.open != null)) { { const cand = ROUTES.filter(r => r.step === IN(p) && (r.g ? r.g === groupOf(p) : r.to === p.at)); const r0 = cand.sort((a, b) => Math.hypot(a.to[0] - p.at[0], a.to[1] - p.at[1]) - Math.hypot(b.to[0] - p.at[0], b.to[1] - p.at[1]))[0]; const lead = r0 && r0.to; const dd = lead ? Math.hypot(lead[0] - p.at[0], lead[1] - p.at[1]) : 0; el.style.transitionDelay = halo.style.animationDelay = Math.round(600 + dd * 2.2) + 'ms'; } if (p.join != null) { halo.classList.remove('is-pulse'); void halo.getBBox(); halo.classList.add('is-pulse'); } }
        else if (!on) { el.style.transitionDelay = '0ms'; halo.classList.remove('is-pulse'); }
      });
      lbls.forEach(el => el.classList.toggle('is-in', STATES_AT[el.dataset.st] != null && s >= STATES_AT[el.dataset.st]));
      routes.forEach(r => r.classList.toggle('is-in', s >= +r.dataset.step)); routes.forEach(r => r.classList.toggle('is-now', !back && s === +r.dataset.step));
      fields.forEach(f => f.classList.toggle('is-cov', s >= +f.dataset.cov));
      spread(s, back);
      yr.textContent = s <= 1 ? 'At the sale' : 'Year ' + Math.min(s - 1, 5);
      if (back) num.textContent = '$' + EARN[Math.min(s, 6)].toFixed(1) + 'M'; else if (s >= 2 && s <= 6) countIn(EARN[s - 1], EARN[s]);
      tlDots.forEach(c => c.classList.toggle('is-in', s - 1 >= +c.dataset.i));
      sec.classList.toggle('is-later', s >= 7);
    };

    // the clock: plays once in view, pauses out of view, holds on the last frame
    // (pt 1.1.0, B v8 approved 10/20) each year 1.5s, so the route draws, then the place arrives, then the count; payoff ~10.4s
    // the 1.2s territory spread and the 0.9s count
    const T = [0, 1600, 3100, 4600, 6100, 7600, 9100, 10400], END = 12800, P0 = T[1], P1 = T[6];
    let t = 0, playing = false, last = 0, done = false;
    const paint = () => { const s = T.filter(x => t >= x).length - 1; setStep(s, false); tlFill.style.strokeDashoffset = 1 - clamp((t - P0) / (P1 - P0), 0, 1); };
    const loop = now => { if (!playing) return; t += Math.min(250, now - last); last = now; paint(); if (t >= END) { playing = false; done = true; sec.classList.add('is-done'); return; } requestAnimationFrame(loop); };
    const play = () => { if (playing || done) return; playing = true; last = performance.now(); requestAnimationFrame(loop); };
    const reset = () => { t = 0; done = false; cur = -1; sec.classList.remove('is-done'); setStep(0, true); tlFill.style.strokeDashoffset = 1; };
    drawTl(); frame(); reset();
    if (reduce) { sec.classList.add('is-seen'); t = END; cur = -1; setStep(7, true); tlFill.style.strokeDashoffset = 0; done = true; sec.classList.add('is-done'); }
    else if (w.IntersectionObserver) { let to = 0; new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { sec.classList.add('is-seen'); clearTimeout(to); to = setTimeout(play, 600); } else { clearTimeout(to); playing = false; } }), { threshold: 0.45 }).observe(film); }
    else play();
    replay.addEventListener('click', () => { playing = false; reset(); requestAnimationFrame(() => play()); });
    addEventListener('resize', () => { drawTl(); frame(); tlFill.style.strokeDashoffset = done ? 0 : 1 - clamp((t - P0) / (P1 - P0), 0, 1); tlDots.forEach(c => c.classList.toggle('is-in', cur - 1 >= +c.dataset.i)); });
    w.__p6 = { seek: ms => { playing = false; reset(); t = ms; const s = T.filter(x => t >= x).length - 1; for (let i = 1; i <= s; i++) setStep(i, true); tlFill.style.strokeDashoffset = 1 - clamp((t - P0) / (P1 - P0), 0, 1); if (t >= END) { done = true; sec.classList.add('is-done'); } } };
    sec.classList.add('is-ready');
  };

  // started by the Owners layer, once per room
  w.gfxPtFilm = sec => { if (!sec || sec._ptFilm) return; sec._ptFilm = true; init(sec); };
})(window, document);
