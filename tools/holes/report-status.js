#!/usr/bin/env node
// Hands the daily site check's verdict to Mission Control (api/site-status.js there): one line, all good or needs you.
// Run by the cloud routine "Grey Fox site: daily FullStory check" after it has read FullStory.
//
//   node tools/holes/report-status.js --status ok|attention --line "<one sentence, up to 140>" [--note "<up to 600>"] [--sessions N]
//
// Two ways to deliver, in this order:
//   1. GitHub (no secret): writes the verdict as tools/holes/status.json on the branch `site-status` of this repository
//      (a one-file branch built in a temporary folder and force-pushed; the working copy here is not touched and nothing
//      on master changes). Mission Control reads that file from raw.githubusercontent.com on its hourly sweep.
//   2. Signed POST (instant): when GF_SITE_STATUS_KEY (Ed25519 private key, pkcs8 der base64) is set in the environment,
//      the same verdict is also posted straight to Mission Control, signed over the exact bytes.
// Exit 0 when at least one way succeeded; prints what happened either way.
const crypto = require('crypto');
const https = require('https');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const URL_ = process.env.GF_SITE_STATUS_URL || 'https://missioncontrol.greyfoxadvisors.com/api/site-status/sync';
const KEY_ID = process.env.GF_SITE_STATUS_KEY_ID || 'gf-site-1';
const BRANCH = 'site-status';
const ROOT = path.resolve(__dirname, '..', '..');

function arg(name) { const i = process.argv.indexOf('--' + name); return i > 0 ? process.argv[i + 1] : undefined; }
const status = arg('status'), line = arg('line'), note = arg('note'), sessions = arg('sessions');
if (!['ok', 'attention'].includes(status) || !line) { console.error('usage: --status ok|attention --line "<sentence>" [--note "<text>"] [--sessions N]'); process.exit(2); }

const now = new Date().toISOString();
const doc = { version: 1, signedAt: now, checkedAt: now, status, line: String(line).slice(0, 140) };
if (note) doc.note = String(note).slice(0, 600);
if (sessions != null && /^\d+$/.test(String(sessions))) doc.sessions = Number(sessions);
const bytes = Buffer.from(JSON.stringify(doc));

// ─── 1. GitHub: a one-file branch, built apart from the working copy ─────────────
function git(args, cwd) { return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim(); }
function viaGithub() {
  let tmp = null;
  try {
    const remote = git(['remote', 'get-url', 'origin'], ROOT);
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'gfx-site-status-'));
    git(['init', '-q', '-b', BRANCH], tmp);
    fs.mkdirSync(path.join(tmp, 'tools', 'holes'), { recursive: true });
    fs.writeFileSync(path.join(tmp, 'tools', 'holes', 'status.json'), bytes);
    git(['add', 'tools/holes/status.json'], tmp);
    git(['-c', 'user.name=Grey Fox site check', '-c', 'user.email=noreply@greyfoxpartners.com', 'commit', '-qm', `site check ${now}: ${status}`], tmp);
    git(['push', '-f', remote, `${BRANCH}:refs/heads/${BRANCH}`], tmp);
    console.log('github: pushed tools/holes/status.json to branch', BRANCH);
    return true;
  } catch (e) {
    console.error('github: could not push the verdict:', String(e.stderr || e.message).trim().split('\n').slice(-3).join(' | '));
    return false;
  } finally {
    if (tmp) { try { fs.rmSync(tmp, { recursive: true, force: true }); } catch (_) { /* a temp folder */ } }
  }
}

// ─── 2. Signed POST, when the key is there ────────────────────────────────────────
function viaPost() {
  const b64 = String(process.env.GF_SITE_STATUS_KEY || '').trim();
  if (!b64) { console.log('post: GF_SITE_STATUS_KEY is not set in this environment, so no direct post (the GitHub branch is the path).'); return Promise.resolve(null); }
  let key;
  try { key = crypto.createPrivateKey({ key: Buffer.from(b64, 'base64'), format: 'der', type: 'pkcs8' }); }
  catch (e) { console.error('post: GF_SITE_STATUS_KEY is not a pkcs8 der base64 Ed25519 key:', e.message); return Promise.resolve(false); }
  const sig = crypto.sign(null, bytes, key).toString('base64');
  const u = new URL(URL_);
  return new Promise((resolve) => {
    const req = https.request({ host: u.hostname, path: u.pathname, method: 'POST', headers: {
      'Content-Type': 'application/json', 'Content-Length': bytes.length, 'X-GF-Site-Key': KEY_ID, 'X-GF-Site-Signature': sig } }, (res) => {
      let s = ''; res.on('data', (c) => { s += c; });
      res.on('end', () => { console.log('post:', res.statusCode, s.slice(0, 300)); resolve(res.statusCode === 200); });
    });
    req.on('error', (e) => { console.error('post: Mission Control could not be reached:', e.message); resolve(false); });
    req.end(bytes);
  });
}

(async () => {
  const gh = viaGithub();
  const post = await viaPost();
  process.exit(gh || post === true ? 0 : 1);
})();
