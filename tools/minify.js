/* A small, careful minifier for home-v2-motion.js (no dependencies).
   A tokenizer that respects strings, template literals (with ${} nesting), regex literals and comments. It strips
   comments, indentation and blank lines and squeezes spaces between tokens, but keeps a newline wherever the source
   had one between statements, so automatic semicolon insertion behaves exactly as in the source.
   Usage: node minify.js <in.js> <out.min.js> */
const fs = require('fs');
const [, , IN, OUT] = process.argv;
const src = fs.readFileSync(IN, 'utf8');

const ID = /[A-Za-z0-9_$\u0080-￿]/;
const REGEX_AFTER_WORD = new Set(['return', 'typeof', 'case', 'do', 'else', 'in', 'of', 'new', 'delete', 'void', 'throw', 'instanceof', 'yield', 'await']);

// tokens: { t: 'ws' | 'nl' | 'code' | 'str' | 'tpl' | 're' | 'word' | 'num' | 'punct', v }
function tokenize(s) {
  const out = [];
  let i = 0;
  const n = s.length;
  const braceStack = [];   // for template ${ } nesting: each entry counts open braces inside the current ${
  const lastSig = () => { for (let k = out.length - 1; k >= 0; k--) if (out[k].t !== 'ws' && out[k].t !== 'nl') return out[k]; return null; };
  const regexAllowed = () => {
    const p = lastSig(); if (!p) return true;
    if (p.t === 'word') return REGEX_AFTER_WORD.has(p.v);
    if (p.t === 'num' || p.t === 'str' || p.t === 'tpl' || p.t === 're') return false;
    if (p.t === 'punct') return !/^[)\]}]$/.test(p.v) && p.v !== '++' && p.v !== '--';
    return true;
  };
  // read a template literal starting at s[i] === '`' or continuing after a '}' that closes a ${
  const readTemplate = (start) => {
    let j = start; let buf = '';
    while (j < n) {
      const c = s[j];
      if (c === '\\') { buf += s.slice(j, j + 2); j += 2; continue; }
      if (c === '`') { buf += c; j++; return { buf, j, open: false }; }
      if (c === '$' && s[j + 1] === '{') { buf += '${'; j += 2; return { buf, j, open: true }; }
      buf += c; j++;
    }
    throw new Error('unterminated template literal');
  };
  while (i < n) {
    const c = s[i];
    // template continuation: a '}' closing a ${ ... }
    if (c === '}' && braceStack.length && braceStack[braceStack.length - 1] === 0) {
      braceStack.pop();
      const r = readTemplate(i + 1);
      out.push({ t: 'tpl', v: '}' + r.buf });
      i = r.j; if (r.open) braceStack.push(0);
      continue;
    }
    if (c === '`') {
      const r = readTemplate(i + 1);
      out.push({ t: 'tpl', v: '`' + r.buf });
      i = r.j; if (r.open) braceStack.push(0);
      continue;
    }
    if (c === '\n') { out.push({ t: 'nl', v: '\n' }); i++; continue; }
    if (c === ' ' || c === '\t' || c === '\r') { let j = i; while (j < n && /[ \t\r]/.test(s[j])) j++; out.push({ t: 'ws', v: ' ' }); i = j; continue; }
    if (c === '/' && s[i + 1] === '/') { let j = i; while (j < n && s[j] !== '\n') j++; i = j; continue; }   // line comment (the newline stays)
    if (c === '/' && s[i + 1] === '*') {
      const e = s.indexOf('*/', i + 2); if (e < 0) throw new Error('unterminated comment');
      const body = s.slice(i, e + 2);
      out.push(body.includes('\n') ? { t: 'nl', v: '\n' } : { t: 'ws', v: ' ' });
      i = e + 2; continue;
    }
    if (c === '"' || c === "'") {
      let j = i + 1;
      while (j < n && s[j] !== c) { if (s[j] === '\\') j++; if (s[j] === '\n') throw new Error('newline in string at ' + j); j++; }
      out.push({ t: 'str', v: s.slice(i, j + 1) }); i = j + 1; continue;
    }
    if (c === '/' && regexAllowed()) {
      let j = i + 1, inClass = false;
      while (j < n) {
        const d = s[j];
        if (d === '\\') { j += 2; continue; }
        if (d === '\n') throw new Error('newline in regex at ' + j);
        if (inClass) { if (d === ']') inClass = false; }
        else if (d === '[') inClass = true;
        else if (d === '/') break;
        j++;
      }
      j++; while (j < n && /[a-z]/i.test(s[j])) j++;   // flags
      out.push({ t: 're', v: s.slice(i, j) }); i = j; continue;
    }
    if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(s[i + 1] || ''))) {
      let j = i; while (j < n && /[0-9A-Za-z_.]/.test(s[j])) { if ((s[j] === 'e' || s[j] === 'E') && /[+-]/.test(s[j + 1] || '')) j++; j++; }
      out.push({ t: 'num', v: s.slice(i, j) }); i = j; continue;
    }
    if (ID.test(c)) { let j = i; while (j < n && ID.test(s[j])) j++; out.push({ t: 'word', v: s.slice(i, j) }); i = j; continue; }
    // punctuators (longest first)
    const P = ['>>>=', '...', '===', '!==', '**=', '<<=', '>>=', '>>>', '&&=', '||=', '??=', '=>', '==', '!=', '<=', '>=', '&&', '||', '??', '?.', '++', '--', '+=', '-=', '*=', '/=', '%=', '&=', '|=', '^=', '**', '<<', '>>'];
    const p = P.find(x => s.startsWith(x, i)) || c;
    if (p === '{' && braceStack.length) braceStack[braceStack.length - 1]++;
    if (p === '}' && braceStack.length) braceStack[braceStack.length - 1]--;
    out.push({ t: 'punct', v: p }); i += p.length;
  }
  if (braceStack.length) throw new Error('unbalanced template braces');
  return out;
}

function emit(tokens) {
  let out = '', pendingWs = false, pendingNl = false, prev = null;
  const isWordy = t => t && (t.t === 'word' || t.t === 'num');
  for (const t of tokens) {
    if (t.t === 'ws') { pendingWs = true; continue; }
    if (t.t === 'nl') { pendingNl = true; continue; }
    if (prev) {
      if (pendingNl) out += '\n';
      else if (pendingWs) {
        // keep a space only where removing it would join two tokens into one, or change their meaning
        const a = prev.v[prev.v.length - 1], b = t.v[0];
        const need = (isWordy(prev) || prev.t === 're') && (isWordy(t) || /^[A-Za-z0-9_$]/.test(t.v))
          || (/[+-]/.test(a) && /[+-]/.test(b))
          || a === '/' || b === '/'
          || (prev.t === 'num' && b === '.');
        if (need) out += ' ';
      }
    }
    out += t.v; prev = t; pendingWs = false; pendingNl = false;
  }
  return out;
}

// (indentation and blank lines go in emit(): a run of spaces and newlines between tokens becomes one newline; the text
// inside template literals, such as the injected CSS, is kept exactly)
const body = emit(tokenize(src)).replace(/^\n+/, '');
// (10/20: the banner is the third argument)
const banner = (process.argv[4] || '/*! Grey Fox gfx (minified) */') + '\n';
fs.writeFileSync(OUT, banner + body + '\n');
// self-check: the significant tokens of the copy are exactly the source's (only spaces, newlines and comments differ)
const sig = s => tokenize(s).filter(t => t.t !== 'ws' && t.t !== 'nl').map(t => t.t + ':' + t.v);
const a = sig(src), b = sig(banner + body);
const diff = a.findIndex((x, k) => x !== b[k]);
if (a.length !== b.length || diff > -1) { console.error('TOKEN MISMATCH at', diff, a[diff], b[diff]); process.exit(1); }
console.log(`token check: ${a.length} tokens identical`);
console.log(`${IN}: ${Buffer.byteLength(src)} bytes -> ${OUT}: ${Buffer.byteLength(banner + body + '\n')} bytes`);
