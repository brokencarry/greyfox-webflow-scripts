#!/usr/bin/env node
// Posts the daily site check's verdict to Mission Control (api/site-status.js there): one line, all good or needs you.
// Run by the cloud routine "Grey Fox site: daily FullStory check" after it has read FullStory. Signs the exact bytes
// with the Ed25519 private key in GF_SITE_STATUS_KEY (pkcs8 der, base64; lives only in the routine's environment).
//
//   node tools/holes/report-status.js --status ok|attention --line "<one sentence, up to 140>" [--note "<up to 600>"] [--sessions N]
//
// Exit 0 when Mission Control stored it; prints the answer either way.
const crypto = require('crypto');
const https = require('https');

const URL_ = process.env.GF_SITE_STATUS_URL || 'https://missioncontrol.greyfoxadvisors.com/api/site-status/sync';
const KEY_ID = process.env.GF_SITE_STATUS_KEY_ID || 'gf-site-1';

function arg(name) { const i = process.argv.indexOf('--' + name); return i > 0 ? process.argv[i + 1] : undefined; }
const status = arg('status'), line = arg('line'), note = arg('note'), sessions = arg('sessions');
if (!['ok', 'attention'].includes(status) || !line) { console.error('usage: --status ok|attention --line "<sentence>" [--note "<text>"] [--sessions N]'); process.exit(2); }
const b64 = String(process.env.GF_SITE_STATUS_KEY || '').trim();
if (!b64) { console.error('GF_SITE_STATUS_KEY is not set in this environment: nothing was posted.'); process.exit(2); }

let key;
try { key = crypto.createPrivateKey({ key: Buffer.from(b64, 'base64'), format: 'der', type: 'pkcs8' }); }
catch (e) { console.error('GF_SITE_STATUS_KEY is not a pkcs8 der base64 Ed25519 key:', e.message); process.exit(2); }

const now = new Date().toISOString();
const doc = { version: 1, signedAt: now, checkedAt: now, status, line: String(line).slice(0, 140) };
if (note) doc.note = String(note).slice(0, 600);
if (sessions != null && /^\d+$/.test(String(sessions))) doc.sessions = Number(sessions);
const bytes = Buffer.from(JSON.stringify(doc));
const sig = crypto.sign(null, bytes, key).toString('base64');

const u = new URL(URL_);
const req = https.request({ host: u.hostname, path: u.pathname, method: 'POST', headers: {
  'Content-Type': 'application/json', 'Content-Length': bytes.length, 'X-GF-Site-Key': KEY_ID, 'X-GF-Site-Signature': sig } }, (res) => {
  let s = ''; res.on('data', (c) => { s += c; });
  res.on('end', () => { console.log(res.statusCode, s.slice(0, 300)); process.exit(res.statusCode === 200 ? 0 : 1); });
});
req.on('error', (e) => { console.error('Mission Control could not be reached:', e.message); process.exit(1); });
req.end(bytes);
