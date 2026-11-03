// Reads one or more holes.json files and prints the rows worth a look: hole >= 0.40, or a section narrower than 60% of
// min(width, 1500) (the site's column cap is 1400). Errors always.
const fs = require('fs'); const rows = [];
for (const d of process.argv.slice(2)) { const f = d + '/holes.json'; if (fs.existsSync(f)) rows.push(...JSON.parse(fs.readFileSync(f, 'utf8'))); }
console.log('rows', rows.length);
const bad = rows.filter(r => r.err || (r.errs && r.errs.length) || r.worstHole >= 0.4 || (r.narrow || []).some(n => n.share * r.w / Math.min(r.w, 1500) < 0.6));
bad.sort((a, b) => a.pg.localeCompare(b.pg) || b.worstHole - a.worstHole);
for (const r of bad) { const nr = (r.narrow || []).map(n => n.sec.trim().split(' ')[0] + ' ' + (n.share * r.w / Math.min(r.w, 1500)).toFixed(2)).filter(s => +s.split(' ')[1] < 0.6); console.log(r.pg.padEnd(28), String(r.w + 'x' + r.h).padEnd(10), 'hole', (r.worstHole || 0).toFixed(2), 'y=' + String(r.worstAt || 0).padEnd(6), 'flagged', r.flagged || 0, nr.length ? 'NARROW ' + nr.join(' | ') : '', r.err || (r.errs && r.errs[0]) || ''); }
