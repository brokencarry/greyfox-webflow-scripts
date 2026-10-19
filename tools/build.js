// Build the hosted files: each page's bundle (core + the page layer, one header script), the minified stylesheets, and
// their SRI hashes (manifest.json). Usage: node tools/build.js
// Served files carry no ".min." in their names: jsDelivr re-minifies any .min.js/.min.css that has a source sibling and the SRI then fails.
// Outputs:  home/gfx-home.bundle.js (readable), home/gfx-home.dist.js, core/gfx-core.dist.css, home/gfx-home.dist.css,
//           owners/gfx-owners.bundle.js (readable), owners/gfx-owners.dist.js, owners/gfx-owners.dist.css (10/20, owners 1.0.0),
//           contact/gfx-contact.bundle.js, .dist.js, .dist.css; privacy/gfx-privacy.* (10/20, the inner pages: core + pages + page),
//           manifest.json { file: { bytes, sri } }
const fs = require('fs'), path = require('path'), crypto = require('crypto'), cp = require('child_process');
const R = path.resolve(__dirname, '..');
const rd = f => fs.readFileSync(path.join(R, f), 'utf8');
const wr = (f, s) => fs.writeFileSync(path.join(R, f), s);
const core = rd('core/gfx-core.js'), home = rd('home/gfx-home.js'), owners = rd('owners/gfx-owners.js');
const cv = (/const VERSION = '([\d.]+)'/.exec(core) || [0, '?'])[1], hv = (/__gfxHome = '([\d.]+)'/.exec(home) || [0, '?'])[1], ov = (/__gfxOwners = '([\d.]+)'/.exec(owners) || [0, '?'])[1];
wr('home/gfx-home.bundle.js', `/* Grey Fox · Home v2 (Flow 3) page script: core ${cv} + home ${hv}. Sources: core/gfx-core.js, home/gfx-home.js */\n` + core + '\n' + home);
cp.execFileSync(process.execPath, [path.join(__dirname, 'minify.js'), path.join(R, 'home/gfx-home.bundle.js'), path.join(R, 'home/gfx-home.dist.js'),
  `/*! Grey Fox · Home v2 (Flow 3) · core ${cv} + home ${hv} · minified bundle of core/gfx-core.js + home/gfx-home.js (read those for the notes) */`], { stdio: 'inherit' });
wr('owners/gfx-owners.bundle.js', `/* Grey Fox · Business Owners v2 (Flow 3) page script: core ${cv} + owners ${ov}. Sources: core/gfx-core.js, owners/gfx-owners.js */\n` + core + '\n' + owners);
cp.execFileSync(process.execPath, [path.join(__dirname, 'minify.js'), path.join(R, 'owners/gfx-owners.bundle.js'), path.join(R, 'owners/gfx-owners.dist.js'),
  `/*! Grey Fox · Business Owners v2 (Flow 3) · core ${cv} + owners ${ov} · minified bundle of core/gfx-core.js + owners/gfx-owners.js (read those for the notes) */`], { stdio: 'inherit' });
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
wr('owners/gfx-owners.dist.css', `/*! Grey Fox · gfx Owners ${ov} stylesheet (minified owners/gfx-owners.css) */\n` + minCss(rd('owners/gfx-owners.css')));
// the inner pages (10/20): core + the shared inner-page layer (pages/gfx-pages.js) + the page's layer, one header script;
// one stylesheet = pages/gfx-pages.css + the page's ported local rules (generated) + the page's extras
const pages = rd('pages/gfx-pages.js'), pv = (/__gfxPages = '([\d.]+)'/.exec(pages) || [0, '?'])[1];
const inner = [['contact', 'Contact v2', '__gfxContact'], ['privacy', 'Privacy v2', '__gfxPrivacy'], ['team', 'Team v2', '__gfxTeam']].filter(([k]) => fs.existsSync(path.join(R, k, 'gfx-' + k + '.js')));
const iv = {};
inner.forEach(([k, name, flag]) => {
  const src = rd(k + '/gfx-' + k + '.js'), v = (new RegExp(flag + " = '([\\d.]+)'").exec(src) || [0, '?'])[1]; iv[k] = v;
  wr(k + '/gfx-' + k + '.bundle.js', `/* Grey Fox · ${name} (Flow 3) page script: core ${cv} + pages ${pv} + ${k} ${v}. Sources: core/gfx-core.js, pages/gfx-pages.js, ${k}/gfx-${k}.js */\n` + core + '\n' + pages + '\n' + src);
  cp.execFileSync(process.execPath, [path.join(__dirname, 'minify.js'), path.join(R, k + '/gfx-' + k + '.bundle.js'), path.join(R, k + '/gfx-' + k + '.dist.js'),
    `/*! Grey Fox · ${name} (Flow 3) · core ${cv} + pages ${pv} + ${k} ${v} · minified bundle of core/gfx-core.js + pages/gfx-pages.js + ${k}/gfx-${k}.js (read those for the notes) */`], { stdio: 'inherit' });
  wr(k + '/gfx-' + k + '.dist.css', `/*! Grey Fox · gfx ${name} ${v} stylesheet (minified pages/gfx-pages.css ${pv} + ${k}/gfx-${k}.ported.css + ${k}/gfx-${k}.css) */\n` +
    minCss(rd('pages/gfx-pages.css') + '\n' + rd(k + '/gfx-' + k + '.ported.css') + '\n' + rd(k + '/gfx-' + k + '.css')));
});
// the person pages (10/20): core + the person layer (no inner-page layer: no hero/rooms/close of the inner pages), one header
// script shared by the three person pages; one stylesheet = the ported local rules + the extras
const personSrc = fs.existsSync(path.join(R, 'person/gfx-person.js')) ? rd('person/gfx-person.js') : null;
if (personSrc) {
  const v = (/__gfxPerson = '([\d.]+)'/.exec(personSrc) || [0, '?'])[1]; iv.person = v;
  wr('person/gfx-person.bundle.js', `/* Grey Fox · person pages v2 (Flow 3) page script: core ${cv} + person ${v}. Sources: core/gfx-core.js, person/gfx-person.js */\n` + core + '\n' + personSrc);
  cp.execFileSync(process.execPath, [path.join(__dirname, 'minify.js'), path.join(R, 'person/gfx-person.bundle.js'), path.join(R, 'person/gfx-person.dist.js'),
    `/*! Grey Fox · person pages v2 (Flow 3) · core ${cv} + person ${v} · minified bundle of core/gfx-core.js + person/gfx-person.js (read those for the notes) */`], { stdio: 'inherit' });
  wr('person/gfx-person.dist.css', `/*! Grey Fox · gfx person pages ${v} stylesheet (minified person/gfx-person.ported.css + person/gfx-person.css) */\n` +
    minCss(rd('person/gfx-person.ported.css') + '\n' + rd('person/gfx-person.css')));
  inner.push(['person']);
}
const man = {};
['home/gfx-home.dist.js', 'core/gfx-core.dist.css', 'home/gfx-home.dist.css', 'portal/desktop-portal.js', 'portal/desktop-portal.css', 'owners/gfx-owners.dist.js', 'owners/gfx-owners.dist.css']
  .concat(...inner.map(([k]) => [k + '/gfx-' + k + '.dist.js', k + '/gfx-' + k + '.dist.css'])).forEach(f => {
  const b = fs.readFileSync(path.join(R, f)); man[f] = { bytes: b.length, sri: 'sha384-' + crypto.createHash('sha384').update(b).digest('base64') };
});
man._versions = Object.assign({ core: cv, home: hv, owners: ov }, inner.length ? { pages: pv } : {}, iv);
wr('manifest.json', JSON.stringify(man, null, 1) + '\n');
console.log(JSON.stringify(man, null, 1));
