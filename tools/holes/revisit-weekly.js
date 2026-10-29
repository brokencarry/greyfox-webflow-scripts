// THE WEEKLY REVISIT (10/29). Runs the revisit pass (revisit.js) over every page at the three windows that matter most,
// three workers at once, then hands one verdict to Mission Control through report-status.js (the same path the daily
// FullStory check uses): "attention" with the first flags named when anything is stuck or replays, "ok" otherwise.
// Scheduled on this machine (Task Scheduler "Grey Fox site: weekly revisit", Sundays 6:00 AM Central); the daily check's
// 7:00 AM verdict follows it, so a clean week reads as the daily line by breakfast and a bad one is in the bell first.
// Usage: node tools/holes/revisit-weekly.js [outdir]   env PAGES=/,/investors  SIZES=1280x631  REPORT=0 (no verdict)
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const HERE = __dirname;
const day = new Date().toISOString().slice(0, 10);
const OUT = process.argv[2] || path.join('C:/Users/shiva/Claude/02-website/holes-revisit', day);
fs.mkdirSync(OUT, { recursive: true });
const PAGES = process.env.PAGES || '/,/business-owners,/investors,/insights,/contact,/team,/tony-giudice,/articles/the-work-behind-a-first-conversation,/privacy';
const SIZES = (process.env.SIZES || '1280x631,1440x789,390x844').split(',');
const run = (size) => new Promise((res) => {
  const dir = path.join(OUT, size), log = fs.openSync(path.join(OUT, size + '.log'), 'w');
  const c = spawn(process.execPath, [path.join(HERE, 'revisit.js'), dir, PAGES, size], { stdio: ['ignore', log, log], env: Object.assign({}, process.env, { MSYS_NO_PATHCONV: '1' }) });
  c.on('exit', (code) => { fs.closeSync(log); res({ size, code, dir }); });
});
(async () => {
  const t0 = Date.now();
  const runs = await Promise.all(SIZES.map(run));
  const flagged = [];
  let combos = 0;
  for (const r of runs) {
    const f = path.join(r.dir, 'revisit.json'); if (!fs.existsSync(f)) { flagged.push({ pg: '(worker ' + r.size + ')', w: r.size, h: '', items: ['the worker did not finish (exit ' + r.code + ')'] }); continue; }
    for (const row of JSON.parse(fs.readFileSync(f, 'utf8'))) {
      combos++;
      if (row.err) { flagged.push({ pg: row.pg, w: row.w, h: row.h, items: [row.err] }); continue; }
      if (row.errs && row.errs.length) flagged.push({ pg: row.pg, w: row.w, h: row.h, items: row.errs.map((e) => 'page error: ' + e) });
      if (row.flags && row.flags.length) flagged.push({ pg: row.pg, w: row.w, h: row.h, items: row.flags.slice(0, 2).map((g) => 'p' + g.pass + '@' + g.sy + ' ' + g.items.map((i) => i.why + ' "' + i.text.slice(0, 24) + '"').join('; ')) });
    }
  }
  const mins = Math.round((Date.now() - t0) / 60000);
  const summary = { day, minutes: mins, combos, flagged };
  fs.writeFileSync(path.join(OUT, 'summary.json'), JSON.stringify(summary, null, 1));
  // every load failed: the site was unreachable from here (a sandbox without the host, a machine without a network), which
  // says nothing about the site; no verdict goes to Mission Control, the log says why
  const loads = flagged.filter((f) => f.items.some((i) => /^load /.test(i)));
  if (combos && loads.length === combos) { console.log('The site could not be reached from here (' + loads[0].items[0].slice(0, 90) + '); nothing was checked and no verdict is sent.'); return; }
  const pages = [...new Set(flagged.map((f) => f.pg))];
  const line = flagged.length
    ? ('Revisit pass: ' + flagged.length + ' flagged on ' + pages.slice(0, 3).join(', ') + (pages.length > 3 ? ' and ' + (pages.length - 3) + ' more' : '') + '.').slice(0, 140)
    : ('Revisit pass clean: ' + combos + ' page and window runs, nothing stuck or replaying.').slice(0, 140);
  const note = flagged.slice(0, 6).map((f) => f.pg + ' ' + f.w + 'x' + f.h + ': ' + f.items.join(' | ')).join('\n').slice(0, 600);
  console.log(line); if (note) console.log(note);
  if (process.env.REPORT === '0') return;
  const args = [path.join(HERE, 'report-status.js'), '--status', flagged.length ? 'attention' : 'ok', '--line', line];
  if (note) args.push('--note', note);
  const rep = spawn(process.execPath, args, { stdio: 'inherit' });
  rep.on('exit', (code) => { console.log('report-status exit', code); process.exit(code || 0); });
})();
