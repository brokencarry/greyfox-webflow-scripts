/* Site consistency probe (10/19). Runs IN the page (his Chrome, live staging), returns one JSON "signature" of every
   shared component so pages can be compared with each other and with the locked rules.
   Use: store the source in localStorage once (key gfxProbe), then on each page: await eval(localStorage.gfxProbe)
   The runner (compare.js) diffs the collected signatures. Nothing here writes to the page except scroll position. */
(async () => {
  const W = window, D = document, L = W.lenis;
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const go = y => (L && L.scrollTo) ? L.scrollTo(y, { immediate: true, force: true }) : W.scrollTo(0, y);
  const maxY = () => D.documentElement.scrollHeight - innerHeight;
  await sleep(2500);
  // walk the page so lazy rooms, reveals and the footer reveal all run, then rest at the bottom
  for (let y = 0; y < maxY(); y += Math.round(innerHeight * 0.6)) { go(y); await sleep(80); }
  try { L && L.resize && L.resize(); } catch (e) {}
  go(maxY() + 9999); await sleep(2200); for (let i = 0; i < 20 && D.documentElement.classList.contains('gfx-ftg-reveal') && !D.documentElement.classList.contains('gfx-ftg-open'); i++) { try { L && L.resize && L.resize(); } catch (e) {} go(maxY() + 9999); await sleep(250); } await sleep(700);

  const cs = e => getComputedStyle(e);
  const vis = e => { if (!e) return false; const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && cs(e).display !== 'none' && cs(e).visibility !== 'hidden'; };
  const effOp = e => { let o = 1, n = e; while (n && n.nodeType === 1) { const s = cs(n); if (s.display === 'none' || s.visibility === 'hidden') return 0; o *= +s.opacity; const m = /opacity\(([\d.]+)\)/.exec(s.filter); if (m) o *= +m[1]; n = n.parentElement; } return +o.toFixed(3); };
  const hex = c => { const m = /rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/.exec(c || ''); if (!m) return c; const h = [m[1], m[2], m[3]].map(v => (+v).toString(16).padStart(2, '0')).join(''); return '#' + h + (m[4] !== undefined && +m[4] < 1 ? '/' + Math.round(m[4] * 100) : ''); };
  const type = e => { if (!e) return null; const s = cs(e); return `${s.fontFamily.split(',')[0].replace(/["']/g, '')} ${s.fontSize}/${s.lineHeight} w${s.fontWeight} ${hex(s.color)}${s.letterSpacing !== 'normal' ? ' ls' + s.letterSpacing : ''}${s.textTransform !== 'none' ? ' ' + s.textTransform : ''}`; };
  const box = e => { if (!e) return null; const r = e.getBoundingClientRect(); return { x: Math.round(r.left), w: Math.round(r.width), h: Math.round(r.height) }; };
  const btn = e => { if (!e) return null; const s = cs(e); return `${type(e)} bg${hex(s.backgroundColor)} pad${s.paddingTop}/${s.paddingRight} r${s.borderTopLeftRadius} bd${s.borderTopWidth}${s.borderTopWidth !== '0px' ? hex(s.borderTopColor) : ''} h${Math.round(e.getBoundingClientRect().height)}`; };
  const byText = (root, re, sel = 'a,button') => [...(root || D).querySelectorAll(sel)].filter(a => re.test(a.textContent.trim()));
  const out = { page: location.pathname, vw: innerWidth, html: (D.documentElement.className.match(/gfx-tone-S+|gfx-ftg-S+|gf-flowd/g) || []).join(' ') };

  // ---- footer
  const foot = D.querySelector('.footer_section_wrapper') || D.querySelector('footer');
  if (foot) {
    const lab = [...foot.querySelectorAll('*')].filter(e => e.children.length === 0 && /^(Navigate|Offices|Write us)$/.test(e.textContent.trim()));
    const nav = byText(foot, /^Business Owners$/)[0];
    const logo = foot.querySelector('img, svg');
    const legal = [...foot.querySelectorAll('*')].find(e => e.children.length === 0 && /represents buyers/.test(e.textContent));
    const cta = byText(foot, /^Start a conversation$/)[0];
    out.footer = {
      h: Math.round(foot.getBoundingClientRect().height), bg: hex(cs(foot).backgroundColor), x: box(foot.querySelector('.gfx-fi-grid') || foot).x,
      contentOpacity: effOp(nav || foot), labels: lab.map(e => e.textContent.trim()).join('|'), labelType: type(lab[0]), linkType: type(nav),
      logo: logo && { ...box(logo), src: (logo.currentSrc || logo.getAttribute('src') || 'svg').split('/').pop().slice(-40) },
      legal: legal && legal.textContent.trim().slice(0, 60), legalType: type(legal), cta: cta && type(cta), clocks: foot.querySelectorAll('.ft-time').length,
      links: [...foot.querySelectorAll('a')].filter(vis).map(a => a.textContent.trim() + '>' + (a.getAttribute('href') || '')).join(' | ')
    };
  }

  // ---- the close (the last visible section before the footer)
  const secs = [...D.querySelectorAll('section, .cta_section, [data-room]')].filter(s => vis(s) && !(foot && (foot.contains(s) || s.contains(foot))));
  const close = secs.filter(s => byText(s, /^Start a conversation$/).length).pop() || secs.pop();
  if (close) {
    const h = [...close.querySelectorAll('h2,h3,.gfx-cta-h,[class*=close-h],.heading-2')].find(vis);
    const b = byText(close, /^Start a conversation$/).find(vis);
    const doors = [...close.querySelectorAll('a')].filter(a => vis(a) && /^mailto:/.test(a.getAttribute('href') || ''));
    const lede = h && [...close.querySelectorAll('p')].find(p => vis(p) && p.textContent.trim().length > 10);
    const mark = close.querySelector('svg.gfa');
    let bg = 'transparent', n = close; while (n && (bg === 'transparent' || /\/0$/.test(bg) || bg === '#000000/0')) { bg = hex(cs(n).backgroundColor); n = n.parentElement; }
    out.close = {
      bg, headline: h && h.textContent.trim().slice(0, 50), headType: type(h), headX: h && box(h).x, lede: lede && lede.textContent.trim().slice(0, 60), ledeType: type(lede),
      button: b && btn(b), buttonHref: b && b.getAttribute('href'), doors: doors.map(a => a.textContent.trim().replace(/\s+/g, ' ').slice(0, 30)).join(' / '),
      doorTitleType: doors[0] && type(doors[0].querySelector('span,div') || doors[0]), arrowMark: !!mark, ph: Math.round(close.getBoundingClientRect().height)
    };
    // the fox watermark: every fox-like image in the close or the footer host
    const host = close.closest('.gfx-ftg-host') || close.parentElement;
    const foxes = [...D.querySelectorAll('img,svg')].filter(e => { const id = ((e.className && (e.className.baseVal ?? e.className)) + ' ' + (e.getAttribute('data-o') || '') + ' ' + (e.getAttribute('src') || '')).toLowerCase(); return /fox|footer-group|footer-logo-subtle/.test(id) && !(foot && foot.contains(e) && e === (foot.querySelector('img, svg'))); });
    out.fox = foxes.map(e => { const r = e.getBoundingClientRect(); const shown = Math.max(0, Math.min(r.right, innerWidth) - Math.max(r.left, 0)); return { id: ((e.getAttribute('data-o') || (e.className && (e.className.baseVal ?? e.className)) || e.tagName) + '').slice(0, 40), op: effOp(e), w: Math.round(r.width), left: Math.round(r.left), shownFrac: r.width ? +(shown / r.width).toFixed(2) : 0, inClose: close.contains(e), inFoot: !!(foot && foot.contains(e)) }; }).filter(f => f.w > 0);
  }

  // ---- the top bar (computed styles persist even when it is hidden on scroll)
  const bar = D.querySelector('.navbar_component, .navbar, .w-nav, header');
  if (bar) {
    const link = byText(bar, /^Investors$/)[0], cta = byText(bar, /^Start a conversation$/)[0], logo = bar.querySelector('img, svg');
    out.bar = { h: Math.round(bar.getBoundingClientRect().height), linkType: type(link), cta: cta && btn(cta), logo: logo && box(logo), links: [...bar.querySelectorAll('a')].map(a => a.textContent.trim() || '(logo)').filter(Boolean).join('|') };
  }

  // ---- arrows: the brand arrow is svg.gfa; anything else that looks like an arrow is flagged
  const txtArrows = []; const tw = D.createTreeWalker(D.body, NodeFilter.SHOW_TEXT); let t; while ((t = tw.nextNode())) if (/[→↗↘›»]/.test(t.nodeValue) && t.parentElement && vis(t.parentElement)) txtArrows.push(t.nodeValue.trim().slice(0, 30));
  const otherSvgArrows = [...D.querySelectorAll('a svg:not(.gfa), button svg:not(.gfa)')].filter(s => vis(s) && !s.closest('.footer_section_wrapper img') && /arrow|chev/i.test((s.className.baseVal || '') + (s.parentElement.className || '') + (s.innerHTML.length < 400 ? s.innerHTML : ''))).length;
  out.arrows = { gfa: [...D.querySelectorAll('svg.gfa')].filter(vis).length, text: txtArrows, otherSvg: otherSvgArrows };

  // ---- buttons (anything with a fill or an outline) and headings: the distinct styles in use
  const uniq = arr => { const m = {}; arr.forEach(k => { if (k) m[k] = (m[k] || 0) + 1; }); return m; };
  out.buttons = uniq([...D.querySelectorAll('a,button')].filter(a => { if (!vis(a) || a.closest('.footer_section_wrapper')) return false; const s = cs(a); return (hex(s.backgroundColor) !== '#000000/0' && !/\/0$/.test(hex(s.backgroundColor))) || s.borderTopWidth !== '0px'; }).map(a => a.textContent.trim().slice(0, 24) + ' :: ' + btn(a)));
  out.headings = {}; ['h1', 'h2', 'h3'].forEach(l => { out.headings[l] = uniq([...D.querySelectorAll(l)].filter(vis).map(type)); });
  out.body = uniq([...D.querySelectorAll('main p, section p, p')].filter(p => vis(p) && p.textContent.trim().length > 60 && !p.closest('.footer_section_wrapper')).map(type));

  // ---- colours in use vs the token set (designer tokens + Flow 3)
  const TOK = ['#1e1e1e', '#585e6b', '#f6f5f2', '#111112', '#156946', '#9b8858', '#ffffff', '#ffffff/54', '#e7e8ea', '#000000/0', '#f3f3f5', '#f5f5f7', '#1e1e20'];
  const col = {}; [...D.querySelectorAll('body *')].forEach(e => { if (!vis(e)) return; const s = cs(e); if (e.childNodes.length && [...e.childNodes].some(n => n.nodeType === 3 && n.nodeValue.trim())) { const c = hex(s.color); if (!TOK.includes(c)) col['text ' + c] = (col['text ' + c] || 0) + 1; } const b = hex(s.backgroundColor); if (!TOK.includes(b) && !/\/0$/.test(b)) col['bg ' + b] = (col['bg ' + b] || 0) + 1; });
  out.offTokenColours = col;
  return out;
})();
