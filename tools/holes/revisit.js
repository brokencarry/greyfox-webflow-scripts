// THE REVISIT PASS (10/29). The hole detector (holes.js) measures empty screen; this one measures content that is on the
// screen but not painted: text, numbers or pictures inside the window whose effective opacity is under 0.1, whose lines
// are still under a mask, or whose centre is covered by something else. It walks every page down in half-screen stops,
// back up to the top, and down again, because a reveal that replays on a return (the Home climb at 1280x631, 10/29) empties
// a room for a second each time and a replay frame lands in it. At every stop: measure at 0.5 s; if anything is unpainted,
// measure again at 1.7 s; what is still unpainted then is a flag. A flag names the page, the window, the pass, the scroll
// position and the first words of what was missing. Shots of flagged stops go to <outdir>/shots.
// Usage: node revisit.js <outdir> [pages=/,/investors,...] [sizes=1280x631,...]   env PW=<playwright module dir>
const pw = require(process.env.PW || 'C:/Users/shiva/Claude/02-website/greyfoxpartners/node_modules/playwright');
const fs = require('fs');
const OUT = process.argv[2]; fs.mkdirSync(OUT + '/shots', { recursive: true });
const PAGES = (process.argv[3] || '/,/business-owners,/investors,/insights,/contact,/team,/tony-giudice,/articles/the-work-behind-a-first-conversation,/privacy').split(',');
const SIZES = (process.argv[4] || '1280x631,1366x657,1440x789,1536x746,1920x969,390x844,1280x800').split(',').map((s) => s.split('x').map(Number));
const STEP = 0.5, SETTLE = 500, LATE = 1200, NAV = 90;
const results = [];
const measure = ({ NAV }) => {
  const vw = innerWidth, vh = innerHeight, out = [];
  const effOpacity = (e) => { let o = 1, n = e; while (n && n !== document.documentElement) { const cs = getComputedStyle(n); if (cs.display === 'none' || cs.visibility === 'hidden') return 0; o *= +cs.opacity; n = n.parentElement; } return o; };
  const related = (a, b) => a === b || a.contains(b) || b.contains(a);
  for (const e of document.body.querySelectorAll('*')) {
    if (e.closest('.gfx-nav, .w-nav, .gfx-skip, [aria-hidden="true"], .gfx-marq-copy, script, style, noscript')) continue;
    // by design: the hero slides under the next room (covered), the close's fox and the footer's are faint ornaments, and the
    // climb's figures leave with the field as it turns to the black (gfx-home.css: html.gfx-tone-dark .gfx-case-figs)
    if (e.closest('.footer-logo-subtle, [data-o~="ow-close-fox"], .gfc-fox, .gfx-fi-logo')) continue;
    if (document.documentElement.classList.contains('gfx-tone-dark') && e.closest('.gfx-case-figs')) continue;
    // by design: a drawing's own labels come with the drawing (svg text), and the held climb shows one chapter at a time
    if (e.closest('svg') && e.tagName !== 'svg') continue;
    if (e.closest('[data-o~="pt-later"], [data-o~="pt-t"] tfoot, [data-o~="pt-mearn"]')) continue;   // the partnership ledger's last rows fill as the five-year film ends
    if (e.closest('.gfx-pg-ow-acc-p, [data-o~="ow-acc-p"], .gfx-pg-ow-acc-in')) continue;   // a closed question's answer
    if (e.closest('[data-o~="iv2-stage"]')) continue;   // Investors stage 1 is scrubbed: each median settles as its step is reached
    if (e.closest('.navbar, .nav_desktop, .nav_mobile, [class*="navigation"], .w-nav-overlay')) continue;   // the bar and its menu
    if (e.closest('footer, .footer_section_wrapper') && scrollY < document.documentElement.scrollHeight - vh * 1.6) continue;   // the footer lights up at the end
    if (document.documentElement.classList.contains('gfx-pinned') && e.closest('.gfx-case-ch, .gfx-case-rail')) continue;   // its chapters swap with the scroll (a 1.2 s cut), its ridge's labels come as it is climbed
    const inHero = !!e.closest('.gfx-hero-sec, [class*="hero"]');
    const tag = e.tagName; let text = '';
    if (/^(IMG|CANVAS|VIDEO|SVG|PICTURE)$/.test(tag)) text = '<' + tag.toLowerCase() + (e.alt ? ' ' + e.alt : '') + '>';
    else { for (const n of e.childNodes) if (n.nodeType === 3 && n.textContent.trim().length > 1) text += n.textContent.trim() + ' '; if (!text) continue; }
    const r = e.getBoundingClientRect(); if (r.width < 4 || r.height < 4) continue;
    // judged only once a fair part of it is on the screen: at least half of it, or 40px, below the header's band, and its
    // top above the reveal line (Flow plays a block as it reaches 88% of the window; below that line nothing has arrived yet)
    const top = Math.max(r.top, NAV), bottom = Math.min(r.bottom, vh); if (bottom - top < Math.min(40, r.height * 0.5)) continue;
    if (r.top > vh * 0.85) continue;
    if (/^(BUTTON)$/.test(tag) || e.getAttribute('role') === 'button' || e.closest('button, [role="button"]')) continue;   // controls appear when their film allows
    if (r.right <= 0 || r.left >= vw) continue;
    const cx = Math.min(vw - 2, Math.max(2, (Math.max(r.left, 0) + Math.min(r.right, vw)) / 2)), cy = (top + bottom) / 2;
    const op = effOpacity(e);
    let why = '';
    // something else sits over this point (the page over the fixed footer, the next room over the hero, a link's overlay):
    // the element is not what the reader sees there, so it is not measured here
    const hit = document.elementFromPoint(cx, cy); if (!hit || (!related(hit, e) && !/^(A|BUTTON)$/.test(hit.tagName))) continue;
    if (op < 0.1) why = 'faded';
    if (!why) { // under a mask: the line box is clipped out by an overflow-hidden ancestor (SplitText masks)
      let n = e.parentElement; while (n && n !== document.body) { const cs = getComputedStyle(n); if (/hidden|clip/.test(cs.overflowY) || /hidden|clip/.test(cs.overflow)) { const q = n.getBoundingClientRect(); if (r.top >= q.bottom - 1 || r.bottom <= q.top + 1) { why = 'masked'; break; } } n = n.parentElement; }
    }
    out.push({ why: why || '', text: text.trim().slice(0, 60), y: Math.round(r.top + scrollY), tag: tag.toLowerCase(), foot: !!e.closest('footer, .footer_section_wrapper') });
  }
  return { sy: Math.round(scrollY), max: document.documentElement.scrollHeight - vh, items: out };
};
const key = (i) => i.tag + '|' + i.text;
(async () => {
  const b = await pw.chromium.launch();
  for (const [w, h] of SIZES) {
    const c = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, isMobile: w < 500, hasTouch: w < 992 });
    for (const pg of PAGES) {
      const p = await c.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(String(e.message).slice(0, 120)));
      // SWAP=<folder/file.dist.js>=<url or local path>: serve another build of a page script (a check against an old version, or a
      // rebuilt file before it is staged); the page's own integrity attributes are stripped so the swap loads
      if (process.env.SWAP) {
        const [file, src] = process.env.SWAP.split('=');
        await p.route(new RegExp('greyfox-webflow-scripts@[0-9a-f]+/' + file.replace(/[.]/g, '\\.')), async (r) => { if (/^https?:/.test(src)) { const res = await r.fetch({ url: src }); r.fulfill({ response: res }); } else r.fulfill({ status: 200, contentType: 'application/javascript', body: fs.readFileSync(src, 'utf8') }); });
        await p.route('https://www.greyfoxpartners.com/**', async (r) => { if (r.request().resourceType() !== 'document') return r.continue(); const res = await r.fetch(); const html = (await res.text()).replace(/\sintegrity="[^"]+"/g, '').replace(/\scrossorigin="[^"]+"/g, ''); r.fulfill({ status: 200, contentType: 'text/html', body: html }); });
      }
      try { await p.goto('https://www.greyfoxpartners.com' + pg + '?rv=' + Date.now(), { waitUntil: 'load', timeout: 60000 }); } catch (e) { results.push({ pg, w, h, err: 'load ' + e.message.slice(0, 60) }); await p.close(); continue; }
      await p.waitForTimeout(3500); await p.mouse.move(w / 2, h / 2);
      const flags = []; let stops = 0, shots = 0; const painted = new Set();   // everything seen painted on the first pass
      const stopHere = async (pass) => {
        await p.waitForTimeout(SETTLE);
        let m = await p.evaluate(measure, { NAV });
        // on a return (pass 2 or 3): content painted on the first pass and unpainted now replays its reveal: a flag at once
        const replays = pass > 1 ? m.items.filter((i) => i.why && !i.foot && painted.has(key(i))).map((i) => ({ ...i, why: 'replays (' + i.why + ')' })) : [];   // the footer lights up on each arrival at the end, by design
        let late = m.items.filter((i) => i.why);
        if (late.length) { await p.waitForTimeout(LATE); m = await p.evaluate(measure, { NAV }); late = m.items.filter((i) => i.why).map((i) => ({ ...i, why: 'stuck (' + i.why + ')' })); }
        if (pass === 1) for (const i of m.items) if (!i.why) painted.add(key(i));
        stops++;
        const found = replays.concat(late);
        if (found.length) {
          const seen = new Set(); const items = found.filter((i) => { const k = i.why + '|' + i.text; if (seen.has(k)) return false; seen.add(k); return true; }).slice(0, 8);
          flags.push({ pass, sy: m.sy, items });
          if (shots < 4) { shots++; await p.screenshot({ path: `${OUT}/shots/${pg.replace(/\//g, '_').replace(/^_/, '') || 'home'}-${w}x${h}-p${pass}-at${m.sy}.png` }); }
        }
        return m;
      };
      const walk = async (pass, dir) => {
        let last = -1, same = 0, guard = 0;
        while (guard++ < 300) {
          const m = await stopHere(pass);
          same = m.sy === last ? same + 1 : 0; last = m.sy;
          if (dir > 0 ? m.sy >= m.max - 2 : m.sy <= 1) break;
          if (same >= 5) break;
          await p.mouse.wheel(0, Math.round(h * STEP) * dir);
        }
      };
      await walk(1, 1); await walk(2, -1); await walk(3, 1);
      results.push({ pg, w, h, stops, flags, errs });
      const line = `${pg} ${w}x${h}: ${stops} stops, ${flags.length} flagged stops` + (flags.length ? ' :: ' + flags.slice(0, 3).map((f) => `p${f.pass}@${f.sy} ${f.items.map((i) => i.why + ' "' + i.text.slice(0, 28) + '"').join('; ')}`).join(' | ') : '') + (errs.length ? ' ERR ' + errs[0] : '');
      console.log(line);
      await p.close();
    }
    await c.close();
  }
  await b.close();
  fs.writeFileSync(OUT + '/revisit.json', JSON.stringify(results, null, 1));
  const flagged = results.filter((r) => r.flags && r.flags.length);
  console.log(`\nDONE ${results.length} page x size runs, ${flagged.length} with flags`);
})();
