// Build the hosted files: the Home bundle (core + Home layer, one header script), the minified stylesheets, and their
// SRI hashes (manifest.json). Usage: node tools/build.js
// Served files carry no ".min." in their names: jsDelivr re-minifies any .min.js/.min.css that has a source sibling and the SRI then fails.
// Outputs:  home/gfx-home.bundle.js (readable), home/gfx-home.dist.js, core/gfx-core.dist.css, home/gfx-home.dist.css,
//           manifest.json { file: { bytes, sri } }
const fs = require('fs'), path = require('path'), crypto = require('crypto'), cp = require('child_process');
const R = path.resolve(__dirname, '..');
const rd = f => fs.readFileSync(path.join(R, f), 'utf8');
const wr = (f, s) => fs.writeFileSync(path.join(R, f), s);
const core = rd('core/gfx-core.js'), home = rd('home/gfx-home.js');
const cv = (/const VERSION = '([\d.]+)'/.exec(core) || [0, '?'])[1], hv = (/__gfxHome = '([\d.]+)'/.exec(home) || [0, '?'])[1];
wr('home/gfx-home.bundle.js', `/* Grey Fox · Home v2 (Flow 3) page script: core ${cv} + home ${hv}. Sources: core/gfx-core.js, home/gfx-home.js */\n` + core + '\n' + home);
cp.execFileSync(process.execPath, [path.join(__dirname, 'minify.js'), path.join(R, 'home/gfx-home.bundle.js'), path.join(R, 'home/gfx-home.dist.js'),
  `/*! Grey Fox · Home v2 (Flow 3) · core ${cv} + home ${hv} · minified bundle of core/gfx-core.js + home/gfx-home.js (read those for the notes) */`], { stdio: 'inherit' });
// CSS: comments out, whitespace squeezed (strings and url() kept as they are)
const minCss = s => {
  let out = '', i = 0;
  while (i < s.length) {
    const c = s[i];
    if (c === '/' && s[i + 1] === '*') { const e = s.indexOf('*/', i + 2); i = e < 0 ? s.length : e + 2; continue; }
    if (c === '"' || c === "'") { let j = i + 1; while (j < s.length && s[j] !== c) { if (s[j] === '\\') j++; j++; } out += s.slice(i, j + 1); i = j + 1; continue; }
    if (/\s/.test(c)) { let j = i; while (j < s.length && /\s/.test(s[j])) j++; const p = out[out.length - 1], n = s[j]; if (p && n && !/[{}:;,>(]/.test(p) && !/[{};,)]/.test(n)) out += ' '; i = j; continue; }
    out += c; i++;
  }
  return out.replace(/;}/g, '}').trim() + '\n';
};
wr('core/gfx-core.dist.css', `/*! Grey Fox · gfx core ${cv} stylesheet (minified core/gfx-core.css) */\n` + minCss(rd('core/gfx-core.css')));
wr('home/gfx-home.dist.css', `/*! Grey Fox · gfx Home ${hv} stylesheet (minified home/gfx-home.css) */\n` + minCss(rd('home/gfx-home.css')));
const man = {};
['home/gfx-home.dist.js', 'core/gfx-core.dist.css', 'home/gfx-home.dist.css', 'portal/desktop-portal.js', 'portal/desktop-portal.css'].forEach(f => {
  const b = fs.readFileSync(path.join(R, f)); man[f] = { bytes: b.length, sri: 'sha384-' + crypto.createHash('sha384').update(b).digest('base64') };
});
man._versions = { core: cv, home: hv };
wr('manifest.json', JSON.stringify(man, null, 1) + '\n');
console.log(JSON.stringify(man, null, 1));
