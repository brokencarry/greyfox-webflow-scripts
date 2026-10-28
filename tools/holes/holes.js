// THE HOLE DETECTOR. Every page x every window in the matrix, on the live site: wheel-scroll through, and at each stop
// measure the screen for a hole: a stretch of the viewport with no visible content (text, picture, canvas, video, svg,
// a drawn border or a non-field background). Reports, per page x size, the worst stop (largest empty share) and any
// section whose content fills under 60% of a desktop width. Shots of the worst stops go to shots/<page>-<w>x<h>-<y>.png.
// Usage: node holes.js <outdir> [pages=/,/business-owners,...] [sizes=1267x634,...]   env HOLE=0.35 (empty share flag)
const pw = require('C:/Users/shiva/Dev/greyfox/greyfoxpartners/node_modules/playwright'); const fs = require('fs'); const path = require('path');
const OUT = process.argv[2]; fs.mkdirSync(OUT + '/shots', { recursive: true });
const PAGES = (process.argv[3] || '/,/business-owners,/investors,/insights,/contact,/team').split(',');
const SIZES = (process.argv[4] || fs.readFileSync(__dirname + '/matrix.txt', 'utf8').split(/\s+/).filter(Boolean).join(',')).split(',').map(s => s.split('x').map(Number));
const HOLE = +(process.env.HOLE || 0.35), WIDE = 0.6;
const FLAGGED = process.env.FLAGGED ? JSON.parse(fs.readFileSync(process.env.FLAGGED, 'utf8')).filter(r => r.worstHole >= 0.4 || (r.narrow || []).some(n => n.share * r.w / Math.min(r.w, 1500) < 0.6)).map(r => r.pg + '@' + r.w + 'x' + r.h) : null;
const STEP = 0.5;   // of a viewport, per stop
const results = [];
(async () => { const b = await pw.chromium.launch();
  for (const [w, h] of SIZES) {
    const mob = w < 500 || (w < 992 && h > w);
    const c = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, isMobile: w < 500, hasTouch: w < 992 });
    for (const pg of PAGES) {
      if (FLAGGED && !FLAGGED.includes(pg + '@' + w + 'x' + h)) continue;
      const p = await c.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e.message).slice(0, 120)));
      try { await p.goto('https://www.greyfoxpartners.com' + pg, { waitUntil: 'load', timeout: 60000 }); } catch (e) { results.push({ pg, w, h, err: 'load ' + e.message.slice(0, 60) }); await p.close(); continue; }
      await p.waitForTimeout(3500); await p.mouse.move(w / 2, h / 2);
      const stops = []; let last = -1, same = 0, guard = 0; let shotsNow = 0;
      while (guard++ < 400) {
        const measure = ({ WIDE }) => {
          const vw = innerWidth, vh = innerHeight; const cols = 24, rows = 24; const grid = new Uint8Array(cols * rows);
          const mark = r => { const x0 = Math.max(0, Math.floor(r.left / vw * cols)), x1 = Math.min(cols - 1, Math.floor((r.right - 1) / vw * cols)), y0 = Math.max(0, Math.floor(r.top / vh * rows)), y1 = Math.min(rows - 1, Math.floor((r.bottom - 1) / vh * rows)); for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) grid[y * cols + x] = 1; };
          const vis = e => { const cs = getComputedStyle(e); return cs.visibility !== 'hidden' && cs.display !== 'none' && +cs.opacity > 0.08; };
          const upVis = e => { let n = e; while (n && n !== document.body) { const cs = getComputedStyle(n); if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity < 0.08 || (cs.clipPath && cs.clipPath !== 'none' && /inset\(0(px)? 100%/.test(cs.clipPath))) return false; n = n.parentElement; } return true; };
          const isField = (bg) => /rgba?\(0, 0, 0, 0\)|transparent/.test(bg);
          const sections = new Map();
          for (const e of document.body.querySelectorAll('*')) {
            if (e.closest('.gfx-nav, .w-nav, .gfx-skip, [aria-hidden="true"].gfx-marq-copy')) continue;
            const r = e.getBoundingClientRect(); if (r.bottom <= 0 || r.top >= vh || r.right <= 0 || r.left >= vw || r.width < 6 || r.height < 6) continue;
            if (!upVis(e)) continue;
            const tag = e.tagName; let content = false;
            if (/^(IMG|CANVAS|VIDEO|SVG|PICTURE|IFRAME)$/.test(tag)) content = true;
            else { let t = false; for (const n of e.childNodes) { if (n.nodeType === 3 && n.textContent.trim()) { t = true; try { const rg = document.createRange(); rg.selectNodeContents(n); for (const lr of rg.getClientRects()) if (lr.width > 1 && lr.height > 1) { mark(lr); const s = e.closest('section, footer, [class*="-sec"], .gfx-fr'); if (s) { const o = sections.get(s) || { l: 1e9, r: 0 }; o.l = Math.min(o.l, lr.left); o.r = Math.max(o.r, lr.right); sections.set(s, o); } } } catch (x) { content = true; } } } if (t) { /* marked by its lines */ }
              else { const cs = getComputedStyle(e); if ((cs.borderTopWidth !== '0px' && cs.borderTopStyle !== 'none') || (cs.borderBottomWidth !== '0px' && cs.borderBottomStyle !== 'none')) { mark({ left: r.left, right: r.right, top: r.top, bottom: Math.min(r.bottom, r.top + 2) }); mark({ left: r.left, right: r.right, top: Math.max(r.top, r.bottom - 2), bottom: r.bottom }); }
                if (cs.backgroundImage !== 'none' && r.width < vw * 0.98) content = true; } }
            if (content) { mark(r); const s = e.closest('section, footer, [class*="-sec"], .gfx-fr'); if (s) { const k = s; const o = sections.get(k) || { l: 1e9, r: 0 }; o.l = Math.min(o.l, r.left); o.r = Math.max(o.r, r.right); sections.set(k, o); } } }
          let empty = 0; for (let i = 0; i < grid.length; i++) if (!grid[i]) empty++;
          // the largest empty rectangle-ish: the biggest run of fully-empty rows, and of fully-empty columns in the lower 80%
          let runR = 0, best = 0; for (let y = 0; y < rows; y++) { let e = true; for (let x = 0; x < cols; x++) if (grid[y * cols + x]) { e = false; break; } runR = e ? runR + 1 : 0; best = Math.max(best, runR); }
          let runC = 0, bestC = 0; for (let x = 0; x < cols; x++) { let e = true; for (let y = 2; y < rows; y++) if (grid[y * cols + x]) { e = false; break; } runC = e ? runC + 1 : 0; bestC = Math.max(bestC, runC); }
          // a section's width share counts only while the section covers the screen (top above the first tenth, bottom below the last)
          const narrow = []; if (vw >= 992) for (const [s, o] of sections) { const sr = s.getBoundingClientRect(); if (sr.top > vh * 0.1 || sr.bottom < vh * 0.9) continue; const share = (o.r - o.l) / vw; narrow.push({ sec: s.className.toString().slice(0, 36), share: +share.toFixed(2), l: Math.round(o.l), r: Math.round(o.r) }); }
          return { sy: scrollY, max: document.documentElement.scrollHeight - vh, emptyShare: +(empty / grid.length).toFixed(2), emptyRows: +(best / rows).toFixed(2), emptyCols: +(bestC / cols).toFixed(2), narrow };
        };
        const m = await p.evaluate(measure, { WIDE });
        // a candidate hole is measured again after the motion has had its time (a section revealing, a footer rising)
        if (Math.max(m.emptyRows, m.emptyCols) >= HOLE) { await p.waitForTimeout(1500); const m2 = await p.evaluate(measure, { WIDE }); if (Math.max(m2.emptyRows, m2.emptyCols) < Math.max(m.emptyRows, m.emptyCols)) Object.assign(m, m2, { sy: m.sy }); }
        if (Math.max(m.emptyRows, m.emptyCols) >= 0.4 && shotsNow < 3) { shotsNow++; await p.screenshot({ path: `${OUT}/shots/${pg.replace(/\//g, '') || 'home'}-${w}x${h}-at${Math.round(m.sy)}.png` }); }
        if (m.sy !== last || stops.length === 0) stops.push(m);
        same = m.sy === last ? same + 1 : 0; last = m.sy;
        if (m.sy >= m.max - 2 || same >= 6) break;
        await p.mouse.wheel(0, Math.round(h * STEP)); await p.waitForTimeout(same ? 900 : 420);
      }
      // worst stops: by largest empty rows band or columns band (a hole), then overall empty share
      const scored = stops.map(s => ({ ...s, hole: Math.max(s.emptyRows, s.emptyCols) })).sort((a, b) => b.hole - a.hole || b.emptyShare - a.emptyShare);
      const flagged = scored.filter(s => s.hole >= HOLE); const worst = scored[0];
      // a section is narrow when its widest covering stop still fills under 60% of the width
      const best = {}; stops.forEach(s => s.narrow.forEach(n => { if (!best[n.sec] || n.share > best[n.sec].share) best[n.sec] = n; }));
      const narrow = {}; Object.values(best).forEach(n => { if (n.share < WIDE) narrow[n.sec] = n; });
      const row = { pg, w, h, stops: stops.length, worstHole: worst ? worst.hole : 0, worstAt: worst ? worst.sy : 0, flagged: flagged.length, narrow: Object.values(narrow), errs };
      results.push(row);
      // shoot the worst stop and the first flagged narrow section's stop
      if (worst && (worst.hole >= HOLE || Object.keys(narrow).length)) { await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(300); await p.mouse.move(w / 2, h / 2); let y = 0; while (y < worst.sy - 10) { await p.mouse.wheel(0, Math.min(Math.round(h * STEP), worst.sy - y)); await p.waitForTimeout(120); y = await p.evaluate(() => scrollY); if (y >= worst.sy - 2) break; } await p.waitForTimeout(1200); await p.screenshot({ path: `${OUT}/shots/${pg.replace(/\//g, '') || 'home'}-${w}x${h}-${Math.round(worst.sy)}.png` }); }
      console.log(`${pg.padEnd(17)} ${String(w + 'x' + h).padEnd(10)} stops ${String(stops.length).padStart(3)}  worst hole ${(worst ? worst.hole : 0).toFixed(2)} at y=${worst ? worst.sy : 0}  flagged ${flagged.length}  narrow ${Object.values(narrow).map(n => n.sec + ' ' + n.share).join(' | ') || '-'}${errs.length ? '  ERR ' + errs[0] : ''}`);
      await p.close(); }
    await c.close(); }
  fs.writeFileSync(OUT + '/holes.json', JSON.stringify(results, null, 1));
  await b.close(); })();
