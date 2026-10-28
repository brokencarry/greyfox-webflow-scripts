// A worker's log -> holes.json shape (pg, w, h, worstHole, worstAt, flagged, narrow[]) for the FLAGGED rerun and the report.
const fs = require('fs'); const [log, out] = process.argv.slice(2); const rows = [];
for (const line of fs.readFileSync(log, 'utf8').split('\n')) { const m = /^(\S+)\s+(\d+)x(\d+)\s+stops\s+(\d+)\s+worst hole ([\d.]+) at y=(\d+)\s+flagged (\d+)\s+narrow (.*)$/.exec(line.trim()); if (!m) continue;
  const narrow = m[8].trim() === '-' ? [] : m[8].split('|').map(s => s.trim()).filter(Boolean).map(s => { const k = s.lastIndexOf(' '); return { sec: s.slice(0, k), share: +s.slice(k + 1) }; });
  rows.push({ pg: m[1], w: +m[2], h: +m[3], stops: +m[4], worstHole: +m[5], worstAt: +m[6], flagged: +m[7], narrow }); }
fs.mkdirSync(require('path').dirname(out), { recursive: true }); fs.writeFileSync(out, JSON.stringify(rows, null, 1)); console.log(log.split('/').pop(), 'rows', rows.length);
