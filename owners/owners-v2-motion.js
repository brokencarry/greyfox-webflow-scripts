/*!
 * Grey Fox · Business Owners v2 motion (Webflow page script)
 * Version 1.0.4 · 2026-10-14 · one bundle, one IIFE, front-end only (nothing secret).
 *
 * 1.0.4 (footg, 10/14, founder: "i love G", "go"): the footer is G, "the ending". The shared "gfx Footer (Home v2)"
 *       is restyled natively (four even columns, one 18 px size on 40 px rows, the gold fox + grey wordmark lockup on the
 *       grid, two tones, gfx-ft-* classes); this script adds the motion (footG, the same module in all three scripts): on a
 *       wide screen the footer waits fixed beneath the page, the last room lifts off it, the bar's fox flies into the
 *       lockup, the columns settle, the base hairline draws, reversed on the way up; narrow/short screens: a gentle arrival
 *       in the flow; reduced motion / no library: settled.
 *
 * 1.0.3 (scr3; found by ivm on Investors v2): after a resize across 992 px (or a tablet turning) the finished rooms above
 *   went back to hidden (the questions' rows, the close's doors, the whole second-bite room). Their films were made
 *   inside a held/flat trigger's callback, so the gsap.matchMedia context recorded them and reverted them on the switch.
 *   Now every room film (filmAt) is built at load, outside any context, and a fast-forward (ffTl) plays the existing
 *   timeline on at a higher speed instead of making a new tween. Nothing else changes.
 * 1.0.2 (retv): the final second-bite room ("The second bite depends on the partner.", ret-v; PORT-retained-v.md) is
 *   built on the page, and its motion lives here (section 7, retainedV): the house head (headline, paragraph, hairline;
 *   no mark), then the film at the lock (at 80% on phones and short desktops): each formula row's caption, its three
 *   figures rolling left to right with "earnings" and the operators settling between them; the arrow drawing from $3M,
 *   its head landing as $13.4M rolls; the total; the note (about 4.9 s). Held 0.5 screen before the questions arrive.
 *   Reduced motion, no GSAP, no JavaScript: the room as built (the final frame). The odometer's reel rules are also
 *   injected here (the page's "gfx Owners v2 styles 2" Embed carries the same). The hook stays: a page script that sets
 *   window.gfxOwnersRetained (or calls gfxOwners.retained(fn)) before the rooms start replaces retainedV.
 *   The questions (founder 10/13; local round n): no longer a whole held screen. The room is as tall as its content plus
 *   its own 96 px padding, held or not, so the close rises into the bottom of the same screen as the questions lock; an
 *   answer that opens grows the room in place and, if the locked room's stuck position changes, it glides there (regrow).
 *
 * 1.0.1 (batch1): the footer ("gfx Footer (Home v2)", shared with Home v2) as on Home v2 1.0.2: its links keep their
 *   normal size above 1800 px (the 16 px rule is gone, here and in the page's styles Embed; founder's call) and DM Sans 200
 *   is loaded for its small text. The build now fills the process dots and clears the question buttons' grey itself
 *   (styles Embed / gfx-ow-acc-b); the same two rules stay below as a guard.
 *
 * WHAT IT IS
 *   The approved local Owners page's motion (prototype/owners/: owners.js, proc/proc.js design A, av/av-k.js,
 *   gf-grammar.js) ported onto the Webflow page "Business Owners v2" (/business-owners-v2, page 6ace925aabbdb42421fe3cb6).
 *   The DOM is built natively in Webflow; this script only animates it. It finds the page through the DOM contract
 *   (audit/webflow-build/owners-v2-dom.md): every element carries data-o="<its local classes>", so a local selector .x
 *   is [data-o~="x"] here; SVG internals (pa-*, ah-*, kk-*, ow-arw, ow-door-a) keep plain classes; ids are gfx- prefixed.
 *   Every room is guarded: missing elements are skipped silently; nothing throws.
 *
 * PORTED (local file → here)
 *   gf-grammar.js   verbatim (section 0): every timing
 *   owners.js       the hero (headline, words, the photograph opening with its 38.2° facet, the arrow under
 *                   "considering?", the rule, the firms), the breath on the hero photograph, the bar (steps aside as you
 *                   read down, returns on the way up; its pill and links take the tone of the room under them; the gold
 *                   fox kept at 3:1 on whatever is beneath; "Business Owners" underlined as the current page; the bar's
 *                   button goes where the page's own button goes), the marquee (four sets, 56 s, paused under the
 *                   pointer, off screen, or by "Pause motion"), the room heads (headline, words, hairline, arrow), the
 *                   questions (their lines, then the arrow under "ask.", then the rows), the close (its line, the arrow
 *                   under "taking.", the doors), the footer's divider, the joins (every room held while the next slides
 *                   over it; it dims, .5 dark / .3 toward paper; a seam draws; a room still playing settles once covered),
 *                   the phone's flat seams, the keyboard (a control reached before its reveal is shown; a covered one is
 *                   brought into view), the hover marks, a resize keeps your place, the accordion, the skip link
 *   proc/proc.js    the process room, design A "The line" (final): one ~3.5 s film at the lock (hold 0.37 screen);
 *                   short desktops play it on arrival; phones play each beat at 82%
 *   av/av-k.js      the partnership room, K: Today and With the right partner, the company laid out (seeded,
 *                   illustrative), its words placed beside their marks, the film at the lock (hold 0.45 screen), each
 *                   lever 0.5 s apart; items and drawing linked both ways (hover / focus lights a lever)
 *   ret/ret-v.js    the second bite (1.0.2): the formula rows, the stake's arrow and figures, the total, the note
 *   NOT PORTED      the "Next" line
 *                   (removed by the founder), the right-edge rail and the bar's progress line (both display:none on the
 *                   local page since 10/11), the buyer histories / timing / growth / people / work rooms (not on the page)
 *
 * WEBFLOW NOTES (the same architecture as home-v2-motion.js 1.0.1)
 *   - Register as a page script in the page HEADER (Owners v2 only), a plain blocking script. Before DOMContentLoaded it
 *     only (a) sets classes on <html> (gfx-js; gfx-m unless reduced motion; gfx-hold on a desktop with room to hold),
 *     (b) appends one <style id="gfx-owners-css">, (c) traps window.Lenis, (d) traps window.Webflow to hold back page-scoped
 *     IX3 interactions and queues an IX2 stop. Everything else waits for DOMContentLoaded + the libraries + the fonts.
 *   - GSAP + ScrollTrigger + SplitText: taken from the page (site-wide code, 3.15.0); loaded from jsDelivr if missing.
 *   - Lenis: ONE instance with the local settings ({ lerp: .085, wheelMultiplier: .95 }), stepped by gsap.ticker; the
 *     site-wide `new Lenis({duration: 2, ...})` receives that instance (its raf() is a no-op) or, on touch screens and with
 *     reduced motion, an inert stub (native scroll).
 *   - Webflow Interactions: IX2 is detached ([data-w-id] stripped as parsed, then ix2.destroy()); IX3 page interactions are
 *     held back (only those of a component with a rendered instance on the page are registered).
 *   - html classes: gfx-js, gfx-m (motion), gfx-hold (held desktop), gfx-hero-on, gfx-ready, gfx-rooms, gfx-acc-js,
 *     gfx-marq-on, gfx-still, gfx-bar-away, gfx-seams-flat, gfx-static (no motion library), gfx-failsafe (6 s).
 *   - Reduced motion: no tween, no hold, no smooth scroll, no marquee; the settled page (both drawings in their final
 *     frame with their notes placed, the three arrows drawn, the accordion working, the bar's tone and the fox's tint).
 *     The same settled page if the motion libraries cannot load (html.gfx-static). No JS: the Webflow page as built
 *     (answers open, drawings empty, notes hidden, every word readable).
 *   - ?gfm=0 turns the whole script off; ?gfxdebug logs guarded failures. window.gfxOwners.status() reports each room's
 *     timeline (for the checks).
 */
(function () {
  'use strict';
  var W = window, D = document;
  if (W.__gfxOwnersV2) return;
  // ?gfm=0: the page exactly as Webflow serves it, with none of this script
  if (/[?&]gfm=0(&|$)/.test(location.search)) { W.__gfxOwnersV2 = 'off'; return; }
  W.__gfxOwnersV2 = '1.0.4';

  /* ========================= 0 · the grammar (gf-grammar.js, verbatim) ========================= */
/* Grey Fox motion grammar (10/12 night): one source of timing for every room on every page.
   Read by the homepage layers (sbx*.js) and the owners page (owners/*.js). Change a value here, never in a room.
   Derived from the choreography review (prototype/choreography.html, "the grammar"). Webflow: paste this file's
   contents at the top of the page's one script. */
(function (w) {
  // cubic-bezier as a plain function, so GSAP can use it without the CustomEase plugin
  function bezier(x1, y1, x2, y2) {
    const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
    const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
    const sx = t => ((ax * t + bx) * t + cx) * t, sy = t => ((ay * t + by) * t + cy) * t;
    const dx = t => (3 * ax * t + 2 * bx) * t + cx;
    return x => {
      if (x <= 0) return 0; if (x >= 1) return 1;
      let t = x;
      for (let i = 0; i < 8; i++) { const e = sx(t) - x, d = dx(t); if (Math.abs(e) < 1e-6) break; if (Math.abs(d) < 1e-6) break; t -= e / d; }
      if (t < 0 || t > 1) { let lo = 0, hi = 1; t = x; for (let i = 0; i < 30; i++) { const v = sx(t); if (Math.abs(v - x) < 1e-6) break; if (v < x) lo = t; else hi = t; t = (lo + hi) / 2; } }
      return sy(t);
    };
  }
  const G = {
    // the two curves: everything that arrives settles; everything that is drawn (lines, the arrow, pictures opening) draws
    SETTLE: 'expo.out',
    DRAW: bezier(0.807, 0.014, 0.392, 0.985),   // the designer's own Webflow divider curve
    // the order inside a room, as offsets from the room's start
    headline: { yPercent: 108, duration: 1.2, stagger: 0.09, start: 'top 82%' },
    body: { y: 16, duration: 1.1, at: 0.2 },
    hairline: { duration: 1.5, at: 0.45 },
    arrow: { duration: 0.45, at: 0.85 },
    picture: { clipFrom: 'inset(100% 0% 0% 0%)', scaleFrom: 1.06, duration: 1.5, settle: 1.6, at: 0.95 },   // after the arrow (0.85): the order rule; settle = the scale-to-rest time
    figure: { duration: 1.6, at: 1.0 },
    detail: { y: 16, duration: 0.9, at: 1.2, stagger: 0.06 },
    // the join between rooms: the next room slides over the held one, which dims; a hairline draws across the seam
    seam: { dimDark: 0.5, dimLight: 0.3, lightTo: '#ffffff', hairline: 1.5 },   // a held light room fades toward paper (never a black veil, which reads grey)
    leave: { ease: 'power2.in', duration: 0.45 },   // every exit (a chapter or sector leaving)
    group: 0.12,                                     // spacing within a group (portraits, doors, rows, a figure's rules)
    tight: 0.08,                                     // spacing for many small items drawn in one sweep (question rows, list lines)
    // holds: scroll picks the moment, time plays it
    hold: { short: 0.5, standard: 0.7 },   // in screens
    fastForward: 0.3,                       // seconds, when the reader scrolls past a room still playing
    // the living motifs
    breath: { scaleFrom: 1.06, scaleTo: 1 },   // pictures settle slowly across their whole time on screen
    reduced: () => w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches
  };
  w.GF_GRAMMAR = G;
})(window);

  /* ========================= 1 · header-safe setup ========================= */
  const H = D.documentElement;
  const G = W.GF_GRAMMAR;
  const DEBUG = /[?&]gfxdebug(&|$)/.test(location.search);
  const log = (where, e) => { if (DEBUG) { try { console.warn('[gfx owners] ' + where, e); } catch (x) { /* nothing */ } } };
  const safe = (where, fn) => { try { return fn(); } catch (e) { log(where, e); return undefined; } };
  const mq = q => { try { return W.matchMedia(q).matches; } catch (e) { return false; } };
  const REDUCE = !!G.reduced();
  const TOUCH = mq('(pointer: coarse)');
  const HOLDQ = '(min-width: 992px) and (min-height: 681px)';    // holds, joins, the films at the lock (owners.js HOLD)
  const FLATQ = '(max-width: 991px), (max-height: 680px)';       // nothing held: flat seams, films at 80%
  const STACK = '(max-width: 991px)';                            // the two drawings stack (proc.js / av-k.js)
  const SHORT = '(min-width: 992px) and (max-height: 680px)';    // a short desktop: no hold, the films play on arrival
  const O = c => '[data-o~="' + c + '"]';                        // the DOM contract: a local class c is data-o~=c
  const store = { get: k => { try { return W.sessionStorage.getItem(k); } catch (e) { return null; } }, set: (k, v) => { try { W.sessionStorage.setItem(k, v); } catch (e) { /* private mode */ } } };
  const GROUP = G.group, TIGHT = G.tight || 0.08;
  const STILL_KEY = 'gfx-still';   // one "Pause motion" choice with Home v2

  const CSS = `
.gfx-flow-mark{display:block;height:0;width:100%;margin:0;pointer-events:none}
.gfx-nav{display:block!important;opacity:1!important}
.gfx-nav{--gfx-away:0}
.gfx-nav .navigation-wrap>:not(.logo-link){transform:translate3d(0,calc(var(--gfx-away) * -110px),0);opacity:calc(1 - var(--gfx-away))}
.gfx-nav.gfx-away{pointer-events:none}.gfx-nav.gfx-away .logo-link{pointer-events:auto}
.gfx-nav .navigation_items,.gfx-nav .nav_desktop>a.navigation-item,.gfx-nav .nav-button,.gfx-nav .nav-button .navigation-item{transition:opacity .333s,background-color .35s,color .35s}
@media (min-width:992px){.gfx-nav.gfx-on-dark .navigation_items{background-color:rgba(22,22,22,.72)!important;box-shadow:none!important}}
.gfx-nav.gfx-on-dark .nav_desktop>a.navigation-item{color:#fff!important}
.gfx-nav.gfx-on-dark .button_wrapper.show .nav-button{background-color:#fff}
.gfx-nav.gfx-on-dark .button_wrapper.show .nav-button .navigation-item{color:#1e1e1e}
.gfx-nav.gfx-on-dark [class^="hamburger_line"],.gfx-nav.gfx-on-dark [class*=" hamburger_line"],.gfx-nav.gfx-on-dark .hamburger_inner{background-color:#fff!important}
@media (max-width:767px){.gfx-nav{transform:translate3d(0,calc(var(--gfx-away) * -110%),0)}.gfx-nav .navigation-wrap>:not(.logo-link){transform:none;opacity:1}}
.gfx-nav .logo__navbar{filter:brightness(var(--gfx-fox-k,1));transition:filter .35s linear}
.gfx-nav .nav_desktop a.navigation-item.gfx-current,.gfx-nav .nav_mobile a.navigation-item.gfx-current{text-decoration:underline!important;text-decoration-color:#156946!important;text-decoration-thickness:1px!important;text-underline-offset:7px!important}
.gfx-nav .navigation-item.button-text:hover,.footer_section_wrapper .footer-link.button-text:hover{opacity:1!important}
.gfx-nav a:focus-visible,.footer_section_wrapper a:focus-visible{outline:2px solid currentColor;outline-offset:4px}
@media (max-width:767px){[data-o~=gf-cap]{transition:transform .6s cubic-bezier(.19,1,.22,1)}html.gfx-bar-away [data-o~=gf-cap]{transform:translate3d(0,-100%,0);transition-duration:.45s;transition-timing-function:cubic-bezier(.55,.085,.68,.53)}}
@media (prefers-reduced-motion:reduce){[data-o~=gf-cap]{transform:none!important}}
@keyframes gfx-late{to{opacity:1;visibility:visible}}
@keyframes gfx-late-clip{to{clip-path:inset(0% 0% 0% 0%)}}
@keyframes gfx-late-x{to{transform:none}}
html.gfx-m:not(.gfx-hero-on) [data-o~=ow-h1],html.gfx-m:not(.gfx-hero-on) [data-o~=ow-hero-l]>:not([data-o~=ow-hwrap]),html.gfx-m:not(.gfx-hero-on) [data-o~=ow-firms]{opacity:0}
html.gfx-m:not(.gfx-hero-on) [data-o~=ow-hero-img]{clip-path:inset(100% 0% 0% 0%)}
html.gfx-m:not(.gfx-hero-on) [data-o~=ow-hero-foot] [data-o~=ow-rule]{transform:scaleX(0)}
html.gfx-m:not(.gfx-hero-on):not(.gfx-ready) [data-o~=ow-h1],html.gfx-m:not(.gfx-hero-on):not(.gfx-ready) [data-o~=ow-hero-l]>:not([data-o~=ow-hwrap]),html.gfx-m:not(.gfx-hero-on):not(.gfx-ready) [data-o~=ow-firms]{animation:gfx-late .6s ease 3.5s forwards}
html.gfx-m:not(.gfx-hero-on):not(.gfx-ready) [data-o~=ow-hero-img]{animation:gfx-late-clip .6s ease 3.5s forwards}
html.gfx-m:not(.gfx-hero-on):not(.gfx-ready) [data-o~=ow-hero-foot] [data-o~=ow-rule]{animation:gfx-late-x .6s ease 3.5s forwards}
html.gfx-m:not(.gfx-rooms):not(.gfx-failsafe) [data-o~=ow-h2]{visibility:hidden;animation:gfx-late 0s linear 3.5s forwards}
html.gfx-failsafe [data-gfx-reveal]{opacity:1!important;transform:none!important;pointer-events:auto!important}
html.gfx-failsafe .gfx-ow-line{transform:none!important}
html.gfx-js .pa-note:not([x]){visibility:hidden}
html.gfx-js [data-o~=avh-note]:not([style*="left"]){visibility:hidden}
.gfx-ow-line{white-space:nowrap}
.gfx-ow-line-mask{overflow:visible!important;clip-path:inset(0 -1.5em)}
.gfx-pc-line{will-change:transform}
html.gfx-m [data-o~=ow-facet-in]{--gfx-fxd:96px;clip-path:polygon(var(--gfx-fx,var(--gfx-fxd)) 0,100% 0,100% 100%,0 100%,0 calc(var(--gfx-fx,var(--gfx-fxd)) * .78687))}
@media (max-width:991px){html.gfx-m [data-o~=ow-facet-in]{--gfx-fxd:48px}}
@media (prefers-reduced-motion:reduce){[data-o~=ow-hero-img]{scale:none!important}}
.gfx-ow-mark{position:absolute;left:0;top:0;overflow:visible;pointer-events:none;z-index:2}
.gfx-ow-mark path{fill:none;stroke:#156946;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter}
[data-o~=ow-char] .gfx-ow-mark path{stroke:#2f9a6c}
.gfx-hm{position:absolute;left:0;top:0;overflow:visible;pointer-events:none;z-index:3}
.gfx-hm path{fill:none;stroke:#156946;stroke-width:1.5;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:1;stroke-dashoffset:1}
.gfx-hm.on-dark path{stroke:#2f9a6c}
.gfx-hm .h1{transition:stroke-dashoffset .5s cubic-bezier(.7,0,.84,0) .12s}.gfx-hm .h2{transition:stroke-dashoffset .16s cubic-bezier(.7,0,.84,0) 0s}
.gfx-hm-on>.gfx-hm .h1{stroke-dashoffset:0;transition:stroke-dashoffset .75s cubic-bezier(.86,0,.07,1) 0s}
.gfx-hm-on>.gfx-hm .h2{stroke-dashoffset:0;transition:stroke-dashoffset .42s cubic-bezier(.19,1,.22,1) .62s}
.gfx-hm-host .ow-arw{transition:opacity .35s cubic-bezier(.19,1,.22,1) .5s,transform .6s cubic-bezier(.19,1,.22,1)}
.gfx-hm-on .ow-arw{opacity:0;transition:opacity .2s ease 0s}
@media (prefers-reduced-motion:reduce){.gfx-hm path,.gfx-hm-on>.gfx-hm path,.ow-arw,.ow-door-a,.ow-door-a path{transition:none!important}}
.gfx-skip{position:fixed;left:16px;top:12px;z-index:10000;padding:10px 16px;background:#0e0e0e;color:#fff;font:500 14px/1 "DM Sans",sans-serif;text-decoration:none;transform:translateY(-160%);transition:transform .3s}
.gfx-skip:focus,.gfx-skip:focus-visible{transform:none;outline:2px solid #2f9a6c;outline-offset:2px}
@media (max-width:767px){html .gfx-skip{font-size:16px;padding-top:15px;padding-bottom:15px}}
.gfx-motion-slot{display:inline-flex;min-width:9.5em;height:24px}
.gfx-motion{display:inline-flex;align-items:center;gap:8px;margin:0;padding:6px 0;background:none;border:0;cursor:pointer;font:400 14px/1 "DM Sans",sans-serif;letter-spacing:0;text-transform:none;color:#585e6b}
.gfx-motion:hover{color:#1e1e1e}
.gfx-motion em{display:inline-block;width:8px;height:9px;border-left:2px solid currentColor;border-right:2px solid currentColor}
.gfx-motion[data-still="true"] em{width:0;height:0;border:0;border-left:8px solid currentColor;border-top:5px solid transparent;border-bottom:5px solid transparent}
@media (max-width:767px){.gfx-motion{min-height:44px;padding-top:0;padding-bottom:0;font-size:16px}.gfx-motion-slot .gfx-motion{margin:-10px 0}}
@media (prefers-reduced-motion:reduce){.gfx-motion-slot{display:none}}
html.gfx-marq-on [data-o~=ow-marq]{-webkit-mask-image:linear-gradient(90deg,transparent 0,#000 6%,#000 94%,transparent 100%);mask-image:linear-gradient(90deg,transparent 0,#000 6%,#000 94%,transparent 100%)}
html.gfx-marq-on [data-o~=ow-marq] [data-o~=ow-marq-track]{width:max-content;justify-content:flex-start;flex-wrap:nowrap;column-gap:0;row-gap:0;animation:gfx-ow-marq 56s linear infinite}
html.gfx-marq-on [data-o~=ow-marq-track]>li{margin:0 clamp(120px,11vw,200px) 0 0}
@media (max-width:767px){html.gfx-marq-on [data-o~=ow-marq-track]>li{margin-right:64px}}
[data-o~=ow-marq]:hover [data-o~=ow-marq-track],[data-o~=ow-marq]:focus-within [data-o~=ow-marq-track],[data-o~=ow-marq].gfx-off [data-o~=ow-marq-track],html.gfx-still [data-o~=ow-marq-track]{animation-play-state:paused!important}
@keyframes gfx-ow-marq{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.gfx-ow-dim{position:absolute;left:0;top:0;right:0;bottom:0;z-index:50;background:#0e0e0e;opacity:0;pointer-events:none}
.gfx-ow-seam{position:absolute;left:0;right:0;top:0;height:1px;z-index:6;pointer-events:none;display:block;background:#e7e8ea;transform:scaleX(0);transform-origin:0 50%}
[data-o~=ow-char]>.gfx-ow-seam,[data-o~=ow-foot]>.gfx-ow-seam{background:rgba(255,255,255,.2)}
[data-o~=ow-foot]>.gfx-ow-seam{left:calc((100vw - min(100vw - 96px,1400px))/2);right:calc((100vw - min(100vw - 96px,1400px))/2);z-index:2}
@media (max-width:991px){[data-o~=ow-foot]>.gfx-ow-seam{left:20px;right:20px}}
html.gfx-hold [data-o~=ow-foot]::before,html.gfx-seams-flat [data-o~=ow-foot]::before{display:none}
.gfx-ow-dwell{display:block;height:calc(var(--d,.4) * 100vh);pointer-events:none}
gfx-odo{display:inline-block;vertical-align:top;height:1em;line-height:1;overflow:hidden}
gfx-reel{display:block;position:relative;line-height:1;will-change:transform}
gfx-reel::before{content:attr(data-seq);position:absolute;left:0;right:0;bottom:100%;white-space:pre;text-align:center;line-height:1}
@media (prefers-reduced-motion:reduce){gfx-reel{transform:none!important}}
[data-o~=ow-acc] [data-o~=ow-acc-b]{background-color:transparent}
[data-o~=ow-acc-i]::before,[data-o~=ow-acc-i]::after{transition:transform .6s cubic-bezier(.19,1,.22,1)}
html.gfx-acc-js [data-o~=ow-acc-item]:not(.is-open) [data-o~=ow-acc-in] p{transition:visibility 0s linear .6s}
@media (prefers-reduced-motion:reduce){html.gfx-acc-js [data-o~=ow-acc-p],[data-o~=ow-acc-i]::before,[data-o~=ow-acc-i]::after,html.gfx-acc-js [data-o~=ow-acc-item]:not(.is-open) [data-o~=ow-acc-in] p{transition:none}}
@media print{html.gfx-acc-js [data-o~=ow-acc-p]{grid-template-rows:1fr!important}[data-o~=ow-acc-in] p{visibility:visible!important}.gfx-ow-dim,.gfx-ow-seam,.gfx-ow-dwell,.gfx-motion,.gfx-skip{display:none!important}[data-gfx-reveal],.gfx-ow-line{opacity:1!important;transform:none!important}}
[data-o~=ow-proc] svg .pa-you,[data-o~=ow-proc] svg .pa-xbd{fill:#2f9a6c;stroke:none}
[data-o~=ow-proc] svg .pa-node,[data-o~=ow-proc] svg .pa-xad{fill:#fff;stroke:none}
[data-o~=avh] .ah-lv{transition:opacity .35s cubic-bezier(.16,1,.3,1)}
[data-o~=avh] [data-o~=avh-note]{transition:color .35s cubic-bezier(.16,1,.3,1)}
[data-o~=avh] .ah-nl{transition:stroke .35s cubic-bezier(.16,1,.3,1)}
[data-o~=avh] [data-o~=avh-it][data-lv]{transition:opacity .35s cubic-bezier(.16,1,.3,1)}
[data-o~=avh] [data-o~=avh-it][data-lv]:focus{outline:none}
[data-o~=avh] [data-o~=avh-it][data-lv]:focus-visible{outline:1px solid #2f9a6c;outline-offset:6px}
[data-o~=avh-fig][data-focus=g] :not([data-o~=is-today])>[data-o~=avh-draw] .ah-lv:not([data-lv=g]),[data-o~=avh-fig][data-focus=g] :not([data-o~=is-today])>[data-o~=avh-draw] .ah-lv[data-lv=base],
[data-o~=avh-fig][data-focus=a] :not([data-o~=is-today])>[data-o~=avh-draw] .ah-lv:not([data-lv=a]),[data-o~=avh-fig][data-focus=a] :not([data-o~=is-today])>[data-o~=avh-draw] .ah-lv[data-lv=base],
[data-o~=avh-fig][data-focus=l] :not([data-o~=is-today])>[data-o~=avh-draw] .ah-lv:not([data-lv=l]),[data-o~=avh-fig][data-focus=l] :not([data-o~=is-today])>[data-o~=avh-draw] .ah-lv[data-lv=base],
[data-o~=avh-fig][data-focus=s] :not([data-o~=is-today])>[data-o~=avh-draw] .ah-lv:not([data-lv=s]),[data-o~=avh-fig][data-focus=s] :not([data-o~=is-today])>[data-o~=avh-draw] .ah-lv[data-lv=base],
[data-o~=avh-fig][data-focus=u] :not([data-o~=is-today])>[data-o~=avh-draw] .ah-lv:not([data-lv=u]),[data-o~=avh-fig][data-focus=u] :not([data-o~=is-today])>[data-o~=avh-draw] .ah-lv[data-lv=base]{opacity:.32}
[data-o~=avh-fig][data-focus=g] :not([data-o~=is-today])>[data-o~=avh-draw] [data-o~=avh-note]:not([data-n=g]),[data-o~=avh-fig][data-focus=a] :not([data-o~=is-today])>[data-o~=avh-draw] [data-o~=avh-note]:not([data-n=a]),[data-o~=avh-fig][data-focus=l] :not([data-o~=is-today])>[data-o~=avh-draw] [data-o~=avh-note]:not([data-n=l]),[data-o~=avh-fig][data-focus=s] :not([data-o~=is-today])>[data-o~=avh-draw] [data-o~=avh-note]:not([data-n=s]),[data-o~=avh-fig][data-focus=u] :not([data-o~=is-today])>[data-o~=avh-draw] [data-o~=avh-note]:not([data-n=u]){color:rgba(255,255,255,.22)}
[data-o~=avh-fig][data-focus=g] :not([data-o~=is-today])>[data-o~=avh-draw] .ah-nl:not([data-lv=g]),[data-o~=avh-fig][data-focus=a] :not([data-o~=is-today])>[data-o~=avh-draw] .ah-nl:not([data-lv=a]),[data-o~=avh-fig][data-focus=l] :not([data-o~=is-today])>[data-o~=avh-draw] .ah-nl:not([data-lv=l]),[data-o~=avh-fig][data-focus=s] :not([data-o~=is-today])>[data-o~=avh-draw] .ah-nl:not([data-lv=s]),[data-o~=avh-fig][data-focus=u] :not([data-o~=is-today])>[data-o~=avh-draw] .ah-nl:not([data-lv=u]){stroke:rgba(255,255,255,.1)}
[data-o~=avh-fig][data-focus=g] [data-o~=avh-it][data-lv]:not([data-lv=g]),[data-o~=avh-fig][data-focus=a] [data-o~=avh-it][data-lv]:not([data-lv=a]),[data-o~=avh-fig][data-focus=l] [data-o~=avh-it][data-lv]:not([data-lv=l]),[data-o~=avh-fig][data-focus=s] [data-o~=avh-it][data-lv]:not([data-lv=s]),[data-o~=avh-fig][data-focus=u] [data-o~=avh-it][data-lv]:not([data-lv=u]){opacity:.4}
@media (min-width:992px) and (min-height:681px){
html.gfx-hold [data-o~=ow-proc][data-o~=ow-room]{padding:0!important}
html.gfx-hold [data-o~=ow-proc] [data-o~=pc-track]{position:relative;height:calc(100vh + 37vh)}
html.gfx-hold [data-o~=ow-proc] [data-o~=pc-stage]{position:sticky;top:0;height:100vh;height:100svh;display:flex;flex-direction:column;justify-content:center;padding:clamp(84px,11vh,128px) 48px clamp(32px,6vh,72px);box-sizing:border-box}
html.gfx-hold [data-o~=ow-proc] [data-o~=pc-in]{width:100%}
html.gfx-hold [data-o~=ow-av][data-o~=ow-room]{padding:0!important}
html.gfx-hold [data-o~=ow-av] [data-o~=av-track]{position:relative;height:calc(100vh + 45vh)}
html.gfx-hold [data-o~=ow-av] [data-o~=av-stage]{position:sticky;top:0;height:100vh;height:100svh;display:flex;flex-direction:column;padding:clamp(84px,11vh,128px) 48px clamp(32px,6vh,72px);box-sizing:border-box}
html.gfx-hold [data-o~=ow-av] [data-o~=av-in]{flex:1 1 auto;min-height:0;display:flex;flex-direction:column;justify-content:center}
html.gfx-hold [data-o~=ow-av] [data-o~=avh]{flex:1 1 auto;min-height:0;max-height:720px;display:flex;flex-direction:column}
html.gfx-hold [data-o~=ow-av] [data-o~=avh] [data-o~=avh-fig]{flex:1 1 auto;height:auto;min-height:0}
html.gfx-hold [data-o~=ow-close]>[data-o~=ow-in]{width:100%}
html.gfx-hold [data-o~=ow-close][data-o~=ow-room]{min-height:max(320px,calc(100vh - var(--gfx-foot-h,600px)))!important;min-height:max(320px,calc(100svh - var(--gfx-foot-h,600px)))!important;display:flex;flex-direction:column;justify-content:center;padding-top:clamp(48px,7vh,80px)!important;padding-bottom:clamp(28px,4vh,48px)!important;box-sizing:border-box}
}
@media (min-width:1800px) and (min-height:1000px){
[data-o~=ow-proc] [data-o~=pc-draw]{height:clamp(340px,38vh,520px)}
[data-o~=ow-proc] [data-o~=pc-q]{top:calc(clamp(340px,38vh,520px) * .16);height:calc(clamp(340px,38vh,520px) * .84)}
[data-o~=ow-proc] [data-o~=pc-t]{font-size:28px}
[data-o~=ow-proc] [data-o~=pc-p]{font-size:19px}
[data-o~=ow-proc] [data-o~=pc-q] blockquote p{font-size:24px}
}
@media (min-width:2000px) and (min-height:1100px){
[data-o~=ow-proc] [data-o~=pc-draw]{height:clamp(420px,40vh,600px)}
[data-o~=ow-proc] [data-o~=pc-q]{top:calc(clamp(420px,40vh,600px) * .16);height:calc(clamp(420px,40vh,600px) * .84)}
[data-o~=ow-proc] [data-o~=pc-t]{font-size:36px}
[data-o~=ow-proc] [data-o~=pc-q] blockquote p{font-size:27px}
[data-o~=ow-proc] [data-o~=pc-q] figcaption{font-size:16px}
[data-o~=ow-proc] .pa-note{font-size:15px}
[data-o~=ow-proc] [data-o~=pc-beats]{margin-top:96px}
html.gfx-hold [data-o~=ow-av] [data-o~=avh]{max-height:940px}
[data-o~=ow-av] [data-o~=avh-t]{font-size:28px}
[data-o~=ow-av] [data-o~=avh-cap]{font-size:19px}
}
`;

  safe('head', () => {
    H.classList.add('gfx-js');
    if (!REDUCE) { H.classList.add('gfx-m'); if (mq(HOLDQ)) H.classList.add('gfx-hold'); }
    if (!D.getElementById('gfx-owners-css')) {
      const st = D.createElement('style'); st.id = 'gfx-owners-css'; st.textContent = CSS;
      (D.head || H).appendChild(st);
    }
    // (1.0.1, as Home v2 1.0.2) DM Sans 200 for the footer's small links, city labels and clocks: the site's font loader
    // stops at 300 (the local page loads 200 itself)
    if (!D.getElementById('gfx-dmsans-200')) {
      const ln = D.createElement('link'); ln.id = 'gfx-dmsans-200'; ln.rel = 'stylesheet';
      ln.href = 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@200&display=swap';
      (D.head || H).appendChild(ln);
    }
  });

  // the failsafe: if the motion never takes the page (a blocked CDN, an error), everything shows (owners.js ow-failsafe)
  const failsafe = () => {
    if (H.classList.contains('gfx-ready')) return;
    H.classList.add('gfx-failsafe', 'gfx-hero-on'); H.classList.remove('gfx-hold'); ix3Late();
  };
  setTimeout(failsafe, 6000);

  /* ---------- Lenis: one instance, the local page's settings, one clock (home-v2-motion.js) ---------- */
  const LENIS_OPTS = { lerp: 0.085, wheelMultiplier: 0.95, smoothWheel: true };
  let RealLenis = null, shared = null, sharedRaf = null, tempLoop = 0, tickerOn = false;
  const lenisStub = () => ({
    __gfxStub: true, raf() {}, on() {}, off() {}, start() {}, stop() {}, destroy() {}, resize() {},
    get scroll() { return W.scrollY; },
    scrollTo(t, o) {
      try {
        const off = (o && o.offset) || 0;
        if (typeof t === 'number') W.scrollTo(0, t + off);
        else { const el = typeof t === 'string' ? D.querySelector(t) : t; if (el && el.getBoundingClientRect) W.scrollTo(0, el.getBoundingClientRect().top + W.scrollY + off); }
      } catch (e) { /* a bad selector */ }
    }
  });
  const makeShared = () => {
    if (shared) return shared;
    if (REDUCE || TOUCH || !RealLenis) return null;
    try {
      const inst = new RealLenis(LENIS_OPTS);
      sharedRaf = inst.raf.bind(inst);
      inst.raf = function () {};   // any other loop (the site-wide one) steps nothing: one clock drives it
      shared = W.lenis = inst;
      const loop = () => { if (tickerOn) return; sharedRaf(performance.now()); tempLoop = requestAnimationFrame(loop); };
      tempLoop = requestAnimationFrame(loop);
    } catch (e) { log('lenis', e); }
    return shared;
  };
  function GfxLenis() { return makeShared() || lenisStub(); }
  GfxLenis.__gfx = true;
  safe('lenis trap', () => {
    const cur = W.Lenis;
    if (cur && !cur.__gfx) RealLenis = cur;
    Object.defineProperty(W, 'Lenis', {
      configurable: true, enumerable: true,
      get: () => (RealLenis ? GfxLenis : undefined),
      set: v => { if (v && !v.__gfx) RealLenis = v; }
    });
  });

  /* ---------- Webflow IX2: the local page never ran it. IX2 binds to [data-w-id]: the attribute is removed as each element
     is parsed (mutation records are delivered before each parser-inserted script, so before webflow.js starts IX2). The
     nav (hamburger) and component buttons keep theirs. The value is kept as data-gfx-wid. ix2.destroy() follows. ---------- */
  const KEEP = '.navigation_wrapper, .button, [data-wf-component-id]';
  const strip = el => {
    if (!el || el.nodeType !== 1) return;
    const one = x => { if (x.hasAttribute('data-w-id') && !x.closest(KEEP)) { x.setAttribute('data-gfx-wid', x.getAttribute('data-w-id')); x.removeAttribute('data-w-id'); } };
    one(el);
    if (el.firstElementChild) Array.prototype.forEach.call(el.querySelectorAll('[data-w-id]'), one);
  };
  let ixObs = null;
  safe('ix2 strip', () => {
    ixObs = new MutationObserver(ms => ms.forEach(m => Array.prototype.forEach.call(m.addedNodes, strip)));
    ixObs.observe(H, { childList: true, subtree: true });
    if (D.body) strip(D.body);
  });
  /* ---------- Webflow Interactions 3 (html.w-mod-ix3): page-scoped and site-scoped interactions are held back on this
     page (they are class-wide on the designer's classes and log "GSAP target not found" for targets this page does not
     have); an interaction of a component with a rendered instance here is kept. The global Webflow is trapped so its
     require('ix3') hands back a wrapped module whose instance filters the list (home-v2-motion.js 1.0.1). ---------- */
  const HELD_IX3 = [];
  const patchIx3 = m => safe('ix3 patch', () => {
    if (!m || m.__gfx || typeof m.getInstance !== 'function') return;
    m.__gfx = true;
    const gi = m.getInstance;
    m.getInstance = function () {
      const inst = gi.apply(this, arguments);
      if (inst && !inst.__gfx && typeof inst.register === 'function') {
        inst.__gfx = true;
        const reg = inst.register;
        inst.register = function (ints) {
          const args = Array.prototype.slice.call(arguments);
          const onPage = x => { const sc = x && x.scope; if (!sc || sc.type !== 'component') return false; try { return Array.prototype.some.call(D.querySelectorAll('[data-wf-component-id="' + sc.componentId + '"]'), e => e.getClientRects().length > 0); } catch (e) { return true; } };
          if (Array.isArray(ints)) args[0] = ints.filter(x => { const keep = onPage(x); if (!keep) HELD_IX3.push(x && x.id); return keep; });
          if (DEBUG && HELD_IX3.length) log('ix3: interactions held back on Owners v2', HELD_IX3.join(' '));
          return reg.apply(this, args);
        };
      }
      return inst;
    };
  });
  const wrapWebflow = wf => safe('webflow wrap', () => {
    if (!wf || Array.isArray(wf) || wf.__gfxWrapped || typeof wf.require !== 'function') return;
    wf.__gfxWrapped = true;
    const req = wf.require;
    wf.require = function (name) { const m = req.apply(this, arguments); if (name === 'ix3') patchIx3(m); return m; };
  });
  safe('webflow trap', () => {
    let cur = W.Webflow;
    Object.defineProperty(W, 'Webflow', { configurable: true, enumerable: true, get: () => cur, set: v => { cur = v; wrapWebflow(v); } });
    wrapWebflow(cur);
  });
  // the IX3 head style keeps the classes it animates hidden until html.w-mod-ix3; if IX3 never gets ready, show them
  function ix3Late() { if (!H.classList.contains('w-mod-ix3')) H.classList.add('w-mod-ix3'); }
  const stopIX2 = () => safe('ix2', () => {
    const wf = W.Webflow; if (!wf || typeof wf.require !== 'function') return;
    const ix = wf.require('ix2'); if (ix && typeof ix.destroy === 'function') ix.destroy();
  });
  safe('ix2 queue', () => { W.Webflow = W.Webflow || []; W.Webflow.push(stopIX2); });

  /* ========================= 2 · shared helpers ========================= */
  const $ = (s, r) => (r || D).querySelector(s);
  const $$ = (s, r) => Array.prototype.slice.call((r || D).querySelectorAll(s));
  const NS = 'http://www.w3.org/2000/svg', TAN = Math.tan(38.2 * Math.PI / 180);
  const c01 = v => Math.min(1, Math.max(0, +v || 0));
  const f1 = n => (+n).toFixed(1);
  const nv = (v, d) => (v == null ? d : v);
  const expo = t => (t <= 0 ? 0 : t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  // a seeded sequence: the drawings' points fall the same way on every load (illustrative, never data)
  const rnd = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const has = (el, c) => !!el && el.getAttribute && (' ' + (el.getAttribute('data-o') || '') + ' ').indexOf(' ' + c + ' ') > -1;
  const isDark = r => has(r, 'ow-char') || has(r, 'ow-foot');
  const list = x => (x ? [].concat(x) : []).filter(Boolean);
  let ST = null, gsap = null;
  // a GSAP call never receives an empty target (no "GSAP target not found")
  const gset = (t, v) => { const a = list(t); if (a.length && gsap) gsap.set(a, v); };
  const scrollNow = () => (shared ? shared.scroll : W.scrollY);
  const jump = y => { y = Math.max(0, Math.round(y)); if (shared) shared.scrollTo(y, { immediate: true, force: true }); else W.scrollTo(0, y); if (ST) ST.update(); };
  const refresh = (() => { let t = 0; return () => { clearTimeout(t); t = setTimeout(() => { if (ST) ST.refresh(); }, 90); }; })();
  const held = () => H.classList.contains('gfx-hold');

  /* the rooms, in page order (hero, process, partnership, retained, questions, close) and the footer */
  const R = { rooms: [] };
  const findRooms = () => {
    R.rooms = $$(O('ow-room'));
    const k = c => R.rooms.filter(r => has(r, c))[0] || null;
    R.hero = k('ow-hero'); R.proc = k('ow-proc'); R.av = k('ow-av'); R.ret = k('ow-ret'); R.qs = k('ow-qs'); R.close = k('ow-close');
    const fw = $('.footer_section_wrapper');
    R.foot = $(O('ow-foot')) || (fw ? fw.closest('footer') || fw : null);
  };

  /* where an element sits in the page's flow, whatever is held (owners.js topOf + the flow marks; home-v2-motion.js
     flowY). A held room is measured at its flow mark; a sticky stage inside a room at its track; anything inside them by
     its offset from that box (which a hold never changes). */
  const MARKS = new Map();
  const INNER = O('pc-stage') + ', ' + O('av-stage');
  const flowY = el => {
    if (!el) return 0;
    const r0 = el.getBoundingClientRect().top;
    for (let a = el; a && a !== D.body; a = a.parentElement) {
      if (MARKS.has(a)) return MARKS.get(a).getBoundingClientRect().top + W.scrollY + (r0 - a.getBoundingClientRect().top);
      if (a.matches && a.matches(INNER) && getComputedStyle(a).position === 'sticky' && a.parentElement) return flowY(a.parentElement) + (r0 - a.getBoundingClientRect().top);
    }
    return r0 + W.scrollY;
  };
  const addMark = room => {
    if (!room || MARKS.has(room)) return;
    const m = D.createElement('i'); m.className = 'gfx-flow-mark'; m.setAttribute('aria-hidden', 'true');
    room.parentNode.insertBefore(m, room); MARKS.set(room, m);
  };
  const markOf = room => MARKS.get(room) || room;

  /* a room's settle-now functions (fast-forward: the reader has scrolled on while it was still playing) */
  const films = new Map();
  const addFF = (room, f) => { if (!room) return; if (!films.has(room)) films.set(room, []); films.get(room).push(f); };
  const ffRoom = room => { (films.get(room) || []).forEach(f => safe('ff', f)); if (room && room.__gfxFF) safe('ff room', room.__gfxFF); };
  // (1.0.3, as Investors v2 1.0.0: no tween is made here: a fast-forward is usually called from a held join's trigger, and
  // anything a gsap.matchMedia context records is reverted when the screen crosses the hold threshold, which would hide a
  // finished room again; the timeline plays on at the speed that ends it in G.fastForward instead)
  const ffTl = tl => { if (!tl || tl.progress() >= 1) return; const left = tl.duration() - tl.time(); tl.eventCallback('onComplete', () => tl.timeScale(1)); tl.timeScale(Math.max(1, left / G.fastForward)).play(); };
  const STATUS = [];   // { name, tl() } for the checks: every room's timeline completes
  const track = (name, get) => STATUS.push({ name, get });

  /* ---------- the mark: a line under one word of a headline (its LAST occurrence, so the turn-up never runs into the
     next word) that turns up at the fox ear's 38.2° into the arrow (owners.js makeMark). Measured where the word RESTS
     (its line may still be rising), re-measured whenever the heading changes size (fonts, a resize, a re-split). ---------- */
  const MARK_LIST = [];
  const findWord = (el, w) => {
    if (!el || !w) return null;
    const tw = D.createTreeWalker(el, NodeFilter.SHOW_TEXT); let hit = null;
    for (let n; (n = tw.nextNode());) { const i = n.textContent.lastIndexOf(w); if (i > -1) hit = [n, i]; }
    if (!hit) return null;
    const r = D.createRange(); r.setStart(hit[0], hit[1]); r.setEnd(hit[0], hit[1] + w.length); return r;
  };
  const lineTy = n => { if (!n) return 0; const t = getComputedStyle(n).transform; return t && t !== 'none' ? new DOMMatrixReadOnly(t).m42 || 0 : 0; };
  const makeMark = (heading, drawn) => {
    const host = heading && heading.parentElement, word = heading && (heading.getAttribute('data-mark') || '').trim();
    if (!host || !word) return null;
    if (heading.__gfxMark) return heading.__gfxMark;
    if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
    const svg = D.createElementNS(NS, 'svg'); svg.setAttribute('class', 'gfx-ow-mark'); svg.setAttribute('aria-hidden', 'true'); svg.setAttribute('focusable', 'false');
    svg.setAttribute('width', '0'); svg.setAttribute('height', '0');
    const p1 = D.createElementNS(NS, 'path'), p2 = D.createElementNS(NS, 'path');
    [p1, p2].forEach(p => { p.setAttribute('pathLength', '1'); p.style.strokeDasharray = '1'; p.style.strokeDashoffset = drawn ? '0' : '1'; svg.appendChild(p); });
    host.appendChild(svg);
    const place = () => safe('mark', () => {
      const rg = findWord(heading, word); if (!rg) return;
      const hr = host.getBoundingClientRect(), br = rg.getBoundingClientRect(), h = br.height; if (!br.width) return;
      let w = br.width;
      // a full stop, comma or question mark after the word: the line runs under it and turns up clear of it
      const n = rg.endContainer, o = rg.endOffset;
      if (n.nodeType === 3 && o < n.textContent.length && /[.,;:!?]/.test(n.textContent[o])) { const r2 = D.createRange(); r2.setStart(n, o); r2.setEnd(n, o + 1); w += r2.getBoundingClientRect().width + h * 0.06; }
      const sp = rg.startContainer.parentElement, dy = lineTy(sp && sp.closest ? sp.closest('.gfx-ow-line') : null);
      const y = h * 0.96, rise = h * 0.42, run = rise / TAN, hs = h * 0.15;
      svg.style.left = (br.left - hr.left) + 'px'; svg.style.top = (br.top - hr.top - dy) + 'px';
      svg.setAttribute('width', w + run + 4); svg.setAttribute('height', h * 1.25);
      p1.setAttribute('d', `M0 ${y} H${w} L${w + run} ${y - rise}`);
      p2.setAttribute('d', `M${w + run - hs} ${y - rise} H${w + run} V${y - rise + hs}`);
    });
    const m = { heading, place, p1, p2, svg };
    heading.__gfxMark = m; MARK_LIST.push(m);
    if ('ResizeObserver' in W) safe('mark ro', () => new ResizeObserver(() => requestAnimationFrame(place)).observe(heading));
    place();
    return m;
  };
  const placeMarks = () => MARK_LIST.forEach(m => m.place());
  // the arrow: its line draws as a hairline does (DRAW), its head lands on SETTLE over the line's last 0.15 s
  const drawMark = (m, tl, at) => {
    if (!m) return;
    tl.add(m.place, at)
      .to(m.p1, { strokeDashoffset: 0, autoRound: false, duration: G.hairline.duration, ease: G.DRAW }, at)
      .to(m.p2, { strokeDashoffset: 0, autoRound: false, duration: G.arrow.duration, ease: G.SETTLE }, at + G.hairline.duration - 0.15);
  };
  const markDone = m => { if (!m) return; m.place(); if (gsap) gsap.set([m.p1, m.p2], { strokeDashoffset: 0 }); else { m.p1.style.strokeDashoffset = '0'; m.p2.style.strokeDashoffset = '0'; } };

  /* ---------- structure that does not depend on motion (owners.js) ---------- */
  const structure = () => safe('structure', () => {
    // the bar: "Business Owners" is the page you are on; its button goes where the page's own button goes
    $$('.gfx-nav a.navigation-item').forEach(a => { if ((a.textContent || '').trim().toLowerCase() === 'business owners') { a.classList.add('gfx-current'); a.setAttribute('aria-current', 'page'); } });
    const cta = $(O('ow-hero') + ' ' + O('ow-btn'));
    const href = cta && cta.getAttribute('href');
    if (href) $$('.gfx-nav a.nav-button').forEach(a => a.setAttribute('href', href));
    // the year in the footer
    $$('.footer_section_wrapper').forEach(f => { const tw = D.createTreeWalker(f, NodeFilter.SHOW_TEXT); for (let n; (n = tw.nextNode());) if (/©\s*20\d\d/.test(n.textContent)) n.textContent = n.textContent.replace(/20\d\d/, String(new Date().getFullYear())); });
  });

  /* 1.0.2 (founder 10/13, local round n): the questions are as tall as their content plus their own 96 px padding, held or
     not (no 100vh minimum). A held room is stuck at top min(0, screen - its height): shorter than the screen it locks at
     the top and the close rises into the screen beneath it. When an answer opens or closes the room changes height; if it
     is locked at that moment and its stuck position changes (grown past the screen, or shrunk back), it glides there
     (0.5 s, Settle) instead of jumping; then every trigger is measured again (owners.js owRegrow). */
  const regrow = room => safe('regrow', () => {
    if (!room || !ST) return;
    const cur = parseFloat(room.style.top) || 0, want = Math.min(0, W.innerHeight - room.offsetHeight);
    if (room.hasAttribute('data-gfx-held') && Math.abs(want - cur) > 1 && room.getBoundingClientRect().top <= cur + 1) gsap.to(room, { top: want, duration: 0.5, ease: G.SETTLE, overwrite: true, onComplete: refresh });
    else refresh();
  });

  /* the owners' questions open and close in place (all open without JavaScript, and in print) */
  const accordion = () => safe('accordion', () => {
    $$(O('ow-acc-b')).forEach(b => {
      const item = b.closest(O('ow-acc-item')); if (!item || b.__gfxAcc) return; b.__gfxAcc = true;
      item.classList.remove('is-open'); b.setAttribute('aria-expanded', 'false');
      b.addEventListener('click', () => {
        const open = !item.classList.contains('is-open');
        item.classList.toggle('is-open', open); b.setAttribute('aria-expanded', String(open));
        // (the page's length changed: once the answer has opened the room settles where it is held and the holds and
        // triggers are measured again; 1.0.2 regrow)
        if (ST) setTimeout(() => regrow(item.closest(O('ow-room'))), 650);
      });
    });
    H.classList.add('gfx-acc-js');
  });

  /* the skip link: the first stop for a keyboard; focus lands on the page's heading (owners.js .ow-skip) */
  const skipLink = () => safe('skip', () => {
    if ($('.gfx-skip') || !D.body) return;
    const h1 = $(O('ow-h1')); if (!h1) return;
    const a = D.createElement('a'); a.className = 'gfx-skip'; a.href = '#' + (h1.id || ''); a.textContent = 'Skip to content';
    a.addEventListener('click', e => {
      e.preventDefault(); if (!h1.hasAttribute('tabindex')) h1.setAttribute('tabindex', '-1');
      h1.focus({ preventScroll: true }); if (shared) shared.scrollTo(0, { immediate: true }); else W.scrollTo(0, 0);
    });
    D.body.insertBefore(a, D.body.firstChild);
  });

  /* ---------- the hover mark (owners.js): a green line draws under the label and turns up at 38.2° into the arrow; it
     retracts on leave. Hover-capable screens only. ---------- */
  const hoverInit = () => safe('hover', () => {
    if (mq('(hover: none)')) return;
    const textRect = label => {
      const r = D.createRange(), tw = D.createTreeWalker(label, NodeFilter.SHOW_TEXT, { acceptNode: t => (t.textContent.trim() && !t.parentElement.closest('svg') ? 1 : 2) });
      const nodes = []; for (let t; (t = tw.nextNode());) nodes.push(t);
      if (!nodes.length) return label.getBoundingClientRect();
      r.setStart(nodes[0], 0); r.setEnd(nodes[nodes.length - 1], nodes[nodes.length - 1].textContent.length);
      const rs = Array.prototype.slice.call(r.getClientRects()).filter(x => x.width > 0);
      if (rs.length < 2) return r.getBoundingClientRect();
      // the last LINE (several rects can share it): its left edge to its right edge
      const last = rs[rs.length - 1], same = rs.filter(x => Math.abs(x.bottom - last.bottom) < 2);
      const left = Math.min.apply(null, same.map(x => x.left)), right = Math.max.apply(null, same.map(x => x.right));
      return { left, right, top: last.top, bottom: last.bottom, width: right - left, height: last.height };
    };
    const onDarkEl = el => { for (let n = el; n && n !== D.body; n = n.parentElement) { if (isDark(n)) return true; if (n.classList && n.classList.contains('footer_section_wrapper')) return true; } return false; };
    const mark = (el, opts) => {
      const o = opts || {};
      if (!el || el.classList.contains('gfx-hm-host')) return;
      const label = o.label ? $(o.label, el) : el; if (!label) return;
      let svg = null, p1 = null, p2 = null;
      const place = () => safe('hover mark', () => {
        const er = el.getBoundingClientRect(); if (!er.width) return;
        if (!svg) {
          svg = D.createElementNS(NS, 'svg'); svg.setAttribute('class', 'gfx-hm'); svg.setAttribute('aria-hidden', 'true'); svg.setAttribute('focusable', 'false');
          p1 = D.createElementNS(NS, 'path'); p2 = D.createElementNS(NS, 'path'); p1.setAttribute('class', 'h1'); p2.setAttribute('class', 'h2');
          [p1, p2].forEach(p => p.setAttribute('pathLength', '1')); svg.appendChild(p1); svg.appendChild(p2); el.appendChild(svg);
        }
        const dark = typeof o.dark === 'function' ? o.dark() : onDarkEl(el);
        let x0, x1, y, tipX, tipY;
        const lr = textRect(label), h = lr.height, gap = Math.max(3, Math.round(h * 0.16));
        x0 = lr.left - er.left; y = lr.bottom - er.top + gap;
        const glyph = o.glyph !== false && $$('.ow-arw', el).filter(g => g.getClientRects().length)[0], gr = glyph ? glyph.getBoundingClientRect() : null;
        // the line turns up AT the arrow (the arrow sits after the last word, on its line)
        if (gr && gr.width) { x1 = Math.max(x0, gr.left - er.left - 2); const run = Math.max(6, gr.right - er.left - x1); tipX = x1 + run; tipY = y - run * TAN; }
        else { x1 = lr.right - er.left + h * 0.06; const rise = Math.max(5, h * 0.42); tipX = x1 + rise / TAN; tipY = y - rise; }
        const hs = Math.max(4, Math.min(8, (y - tipY) * 0.42));
        svg.setAttribute('width', er.width); svg.setAttribute('height', er.height); svg.classList.toggle('on-dark', !!dark);
        p1.setAttribute('d', `M${x0} ${y} H${x1} L${tipX} ${tipY}`); p2.setAttribute('d', `M${tipX - hs} ${tipY} H${tipX} V${tipY + hs}`);
      });
      if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
      el.classList.add('gfx-hm-host');
      // (a mark built just now has its resting style computed before it is switched on, so it draws in)
      const on = () => { const fresh = !svg; place(); if (fresh && p1) getComputedStyle(p1).strokeDashoffset; requestAnimationFrame(() => el.classList.add('gfx-hm-on')); };
      const off = () => el.classList.remove('gfx-hm-on');
      el.addEventListener('mouseenter', on); el.addEventListener('mouseleave', () => { if (!el.matches(':focus-visible')) off(); });
      el.addEventListener('focus', () => { if (el.matches(':focus-visible')) on(); }); el.addEventListener('blur', off);
    };
    $$(O('ow-btn')).forEach(b => mark(b, { label: O('ow-btn-t'), dark: () => has(b, 'is-dark') }));   // the mark reads against the button's own fill
    $$(O('ow-tl')).forEach(a => mark(a));
    $$('.gfx-nav .nav_desktop > a.navigation-item').forEach(a => mark(a));
    $$('.gfx-nav .nav_desktop .nav-button').forEach(a => mark(a, { label: '.navigation-item' }));
    $$('.footer_section_wrapper a').forEach(a => mark(a));
  });

  /* ---------- the bar's tone and the fox's tint (owners.js navTone + gfFoxWatch, clean): the pill and links take the
     tone of the room under them (the last room in page order covering the bar's middle: a later room paints over a held
     one); the gold fox is taken a little deeper or lighter (same hue) wherever the surface under it needs it for 3:1.
     Read while the page moves, never while it is still. Runs with reduced motion too. ---------- */
  function navWatch() {
    const bar = $('.gfx-nav'); if (!bar || bar.__gfxWatch) return; bar.__gfxWatch = true;
    const rgb = c => { const m = /rgba?\(([^)]+)\)/.exec(c || ''); if (!m) return null; const v = m[1].split(/[\s,/]+/).filter(Boolean).map(Number); return v.length > 3 && v[3] < 0.5 ? null : v.slice(0, 3); };
    const lin = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    const LUM = c => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
    const GOLD = [155, 136, 88], Lk = k => LUM(GOLD.map(v => Math.min(255, v * k)));
    const kFor = Lb => {
      if (Lb > 0.3) { for (let k = 1; k >= 0.6; k -= 0.02) if ((Lb + 0.05) / (Lk(k) + 0.05) >= 3.2) return +k.toFixed(2); return 0.6; }
      for (let k = 1; k <= 1.6; k += 0.02) if ((Lk(k) + 0.05) / (Lb + 0.05) >= 3.2) return +k.toFixed(2); return 1.6;
    };
    const CHROME = '.gfx-nav, .gfx-skip, .w-nav-overlay';
    const colourAt = (x, y) => {
      let c = [255, 255, 255], room = null;
      const els = D.elementsFromPoint ? D.elementsFromPoint(x, y) : [];
      for (let i = 0; i < els.length; i++) {
        const e = els[i]; if (e.closest(CHROME)) continue;
        if (isDark(e) || /^(IMG|VIDEO|CANVAS|PICTURE)$/.test(e.tagName)) { c = [14, 14, 14]; room = e; break; }
        const v = rgb(getComputedStyle(e).backgroundColor); if (v) { c = v; room = e; break; }
      }
      if (room) $$('.gfx-ow-dim').forEach(d => {
        const o = +getComputedStyle(d).opacity; if (o < 0.01 || !d.parentElement.contains(room)) return;
        const b = d.getBoundingClientRect(); if (x < b.left || x > b.right || y < b.top || y > b.bottom) return;
        const k = rgb(getComputedStyle(d).backgroundColor) || [0, 0, 0]; c = c.map((v, i) => v * (1 - o) + k[i] * o);
      });
      return c;
    };
    let dirty = true, n = 0, dark = null, kNow = 1, lastY = -1;
    W.addEventListener('scroll', () => { dirty = true; }, { passive: true });
    W.addEventListener('resize', () => { dirty = true; });
    const tick = () => {
      const y = W.scrollY; if (y !== lastY) { lastY = y; dirty = true; }
      if (dirty && (n++ % 2 === 0)) {
        dirty = false;
        safe('tone', () => {
          const yy = (($('.navbar', bar) || bar).offsetHeight || 72) / 2; let under = null;
          R.rooms.concat(R.foot ? [R.foot] : []).forEach(r => { const b = r.getBoundingClientRect(); if (b.top <= yy && b.bottom > yy) under = r; });
          const d = !!under && isDark(under);
          if (d !== dark) { dark = d; bar.classList.toggle('gfx-on-dark', d); }
          const im = $$('.logo__navbar', bar).filter(i => i.offsetWidth)[0];
          if (im) { const r = im.getBoundingClientRect(); const k = kFor(LUM(colourAt(r.left + r.width / 2, r.top + r.height / 2))); if (k !== kNow) { kNow = k; bar.style.setProperty('--gfx-fox-k', k); } }
        });
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* clear what IX2 may have left behind (its initial states) */
  const cleanIX = () => safe('clean ix', () => {
    const clr = (el, props) => props.forEach(p => el.style.removeProperty(p));
    $$('[data-gfx-wid]').forEach(el => { const s = el.style; if (s.opacity === '0' || s.visibility === 'hidden') clr(el, ['opacity', 'visibility', 'transform', '-webkit-transform', 'filter']); });
    $$('.footer_section_wrapper .divider').forEach(el => clr(el, ['width', 'transform', '-webkit-transform']));
  });

  /* ========================= 3 · boot ========================= */
  const onReady = fn => (D.readyState === 'loading' ? D.addEventListener('DOMContentLoaded', fn, { once: true }) : fn());
  const loadScript = src => new Promise((res, rej) => { const s = D.createElement('script'); s.src = src; s.async = false; s.onload = res; s.onerror = rej; (D.head || H).appendChild(s); });
  const haveGsap = () => !!(W.gsap && W.ScrollTrigger && W.SplitText);
  const ensureGsap = () => new Promise(res => {
    if (haveGsap()) { res(true); return; }
    let done = false;
    const fallback = () => {
      if (done) return; done = true;
      if (haveGsap()) { res(true); return; }
      const v = (W.gsap && W.gsap.version) || '3.13.0', base = 'https://cdn.jsdelivr.net/npm/gsap@' + v + '/dist/';
      (W.gsap ? Promise.resolve() : loadScript(base + 'gsap.min.js'))
        .then(() => (W.ScrollTrigger ? 0 : loadScript(base + 'ScrollTrigger.min.js')))
        .then(() => (W.SplitText ? 0 : loadScript(base + 'SplitText.min.js')))
        .then(() => res(haveGsap()), () => res(haveGsap()));
    };
    if (D.readyState === 'complete') fallback(); else { W.addEventListener('load', fallback, { once: true }); setTimeout(fallback, 2500); }
  });
  const ensureLenis = () => new Promise(res => {
    if (REDUCE || TOUCH || shared) { res(); return; }
    if (RealLenis) { makeShared(); res(); return; }
    if (H.classList.contains('lenis')) { res(); return; }   // a Lenis this script did not make: native scroll events still reach ScrollTrigger
    loadScript('https://unpkg.com/lenis@1.1.18/dist/lenis.min.js').then(() => { makeShared(); res(); }, () => res());
  });
  // the fonts gate, capped at 1.5 s (a late font sends a resize, which re-measures everything)
  const fontsReady = () => {
    let capped = false;
    const cap = new Promise(r => setTimeout(() => { capped = true; r(); }, 1500));
    const fr = D.fonts && D.fonts.ready ? D.fonts.ready : Promise.resolve();
    fr.then(() => { if (capped) setTimeout(() => W.dispatchEvent(new Event('resize')), 60); });
    return Promise.race([fr, cap]);
  };

  onReady(() => {
    safe('ix2 sweep', () => { strip(D.body); if (ixObs) ixObs.disconnect(); });
    findRooms();
    skipLink(); structure(); accordion(); hoverInit();
    stopIX2(); cleanIX();
    W.addEventListener('load', () => { stopIX2(); setTimeout(ix3Late, 3000); }, { once: true });
    if (REDUCE) { settledInit(false); return; }
    Promise.all([ensureGsap(), ensureLenis()]).then(([ok]) => {
      if (!ok) { settledInit(true); return; }
      safe('start', start);
    });
  });

  /* the settled page: reduced motion, or no motion library (owners.js finishStatic): the drawings in their final frame,
     the arrows drawn where their words rest, nothing held */
  function settledInit(noLib) {
    safe('settled', () => {
      if (noLib) { H.classList.remove('gfx-m', 'gfx-hold'); H.classList.add('gfx-static'); }
      $$('h1[data-mark], h2[data-mark]').forEach(h => makeMark(h, true));
      procInit(false); avInit(false); retainedInit(false); safe('footer G', () => footG({ close: '[data-o~=ow-close]', still: true }));
      H.classList.add('gfx-hero-on', 'gfx-ready', 'gfx-rooms');
      navWatch();
      if (D.fonts && D.fonts.ready) D.fonts.ready.then(placeMarks);
      let rz = 0; W.addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(placeMarks, 150); });
    });
  }

  /* ========================= footer G, "the ending" (10/14; one module, the same in all three page scripts) =========================
     Local source: prototype/foot/foot-g.js (+ foot-d.js). The footer is the shared "gfx Footer (Home v2)" component
     (gfx-foot, gfx-ft-* classes). The site's ending is the inverse of its opening: on a wide screen the footer waits,
     fixed, beneath the page; the page's last room (o.close) lifts off it like the opening curtain rising, the bar's gold
     fox flies down into the lockup, the wordmark fades in beside it, then the columns arrive (rules draw down, contents
     settle), the base hairline draws across, the bar last. Scrolling back up reverses it. Narrow screens, short screens
     and a footer taller than 80 % of the screen: the footer follows the close in the flow with a gentle arrival.
     Reduced motion / no library (o.still): settled, in the flow. The fox moves by transform only and is only ever in one
     place (the bar, the air, the lockup). ---------- */
  const FTG_CSS = `
.gfx-ft-rule{position:absolute;left:-1px;top:0;bottom:0;width:1px;background:rgba(255,255,255,.16);transform-origin:50% 0;pointer-events:none}
html.gfx-ftg .gfx-ft-col,html.gfx-ftg .gfx-ft-brand{border-left-color:transparent}
html.gfx-ftg .gfx-cta-sec .cta_content_wrapper>.divider.subtle:last-child{visibility:hidden}
.footer_section_wrapper.gfx-foot a{text-decoration:underline;text-decoration-color:transparent;text-decoration-thickness:1px;text-underline-offset:.28em;transition:text-decoration-color .35s cubic-bezier(.19,1,.22,1)}
.footer_section_wrapper.gfx-foot a:hover,.footer_section_wrapper.gfx-foot a:focus-visible{text-decoration-color:currentColor;opacity:1}
.gfx-ft-time .realtime-clock,.gfx-ft-time .realtime-clock-2{font:inherit;color:inherit;width:auto;line-height:inherit;font-variant-numeric:tabular-nums}
html.gfx-ftg-reveal .gfx-ftg-host{position:relative;z-index:4!important;height:var(--gfx-ftg-h,auto)}
html.gfx-ftg-reveal .gfx-ftg-close{position:relative;z-index:5!important;box-shadow:inset 0 -1px 0 rgba(255,255,255,.09),0 32px 64px -16px rgba(0,0,0,.7)}
html.gfx-ftg-reveal .footer_section_wrapper.gfx-foot{position:fixed!important;left:0;right:0;bottom:0;top:auto;z-index:0!important;margin-top:0!important}
html.gfx-ftg-reveal.gfx-ftg-covered .footer_section_wrapper.gfx-foot{opacity:0}
html.gfx-ftg-reveal .footer_section_wrapper.gfx-foot>.gfx-seam,html.gfx-ftg-reveal .gfx-ftg-host>.gfx-ow-seam,html.gfx-ftg-reveal .gfx-ftg-host::before{display:none!important}
html.gfx-ftg-reveal .gfx-ft-head{visibility:hidden}
html.gfx-ftg-reveal.gfx-ftg-home .gfx-ft-head{visibility:visible}
html.gfx-ftg-reveal.gfx-ftg-home .logo__navbar,html.gfx-ftg-reveal.gfx-ftg-flying .logo__navbar{visibility:hidden!important}
.gfx-ftg-fly{position:fixed;left:0;top:0;z-index:1000;visibility:hidden;transform-origin:0 0;pointer-events:none;will-change:transform}
.gfx-ftg-fly img{display:block;width:100%;height:100%;max-width:none}
`;
  function footG(o) {
    const foot = $('.footer_section_wrapper.gfx-foot'); if (!foot || foot.__gfxFtg) return;
    foot.__gfxFtg = true;
    const host = foot.parentElement, close = o.close ? $(o.close) : null;
    const head = $('.gfx-ft-head', foot), word = $('.gfx-ft-wordclip', foot), lockup = $('.gfx-ft-lockup', foot);
    if (!$('#gfx-ftg-css')) { const st = D.createElement('style'); st.id = 'gfx-ftg-css'; st.textContent = FTG_CSS; (D.head || H).appendChild(st); }
    // the column rules are drawn lines (the static border steps aside for them)
    const cols = $$('.gfx-ft-brand, .gfx-ft-col', foot);
    cols.forEach(c => { if (!$(':scope > .gfx-ft-rule', c)) { const r = D.createElement('i'); r.className = 'gfx-ft-rule'; r.setAttribute('aria-hidden', 'true'); c.insertBefore(r, c.firstChild); } });
    H.classList.add('gfx-ftg');
    host.classList.add('gfx-ftg-host'); if (close) close.classList.add('gfx-ftg-close');
    if (o.still || !head || !word || !lockup) return;

    const S = G.SETTLE || 'expo.out', DR = G.DRAW || 'power2.inOut', gp = G.group || 0.12;
    const HL = (G.hairline && G.hairline.duration) || 1.5, BODY = G.body || { y: 16, duration: 1.1, at: 0.2 }, DET = G.detail || { y: 16, duration: 0.9, at: 1.2, stagger: 0.06 };
    const LV = G.leave || { ease: 'power2.in', duration: 0.45 };
    const FOX = head.currentSrc || head.src;
    const wide = W.matchMedia('(min-width: 992px) and (min-height: 680px)');
    const maxY = () => ST.maxScroll(W);
    const scrollToEnd = () => (W.lenis && W.lenis.scrollTo ? W.lenis.scrollTo(maxY(), { duration: 1.2 }) : W.scrollTo({ top: maxY(), behavior: 'smooth' }));
    const kids = c => [...c.children].filter(x => !x.classList.contains('gfx-ft-rule'));

    // the columns' film: rules draw down left to right, each column's contents settle in behind its rule, the base
    // hairline draws across, the bar. On the reveal the lockup arrives with the fox (not in the film). Opacity, not
    // autoAlpha: the links stay in the tab order while they wait (focusing one glides the page to the end).
    const film = reveal => {
      const tl = gsap.timeline({ paused: true });
      const at = reveal ? { rule: 0.12, cols: 0.3, base: 1.05, bar: 1.55 } : { rule: 0, cols: BODY.at, base: 0.65, bar: DET.at };
      tl.fromTo($$('.gfx-ft-rule', foot), { scaleY: 0 }, { scaleY: 1, duration: HL, ease: DR, stagger: gp, immediateRender: true }, at.rule);
      cols.forEach((c, i) => { if (reveal && c.classList.contains('gfx-ft-brand')) return;
        tl.fromTo(kids(c), { opacity: 0, y: BODY.y }, { opacity: 1, y: 0, duration: BODY.duration, ease: S, immediateRender: true }, at.cols + (reveal ? i - 1 : i) * gp); });
      tl.fromTo($$('.gfx-ft-base', foot), { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: HL, ease: DR, immediateRender: true }, at.base)
        .fromTo($$('.gfx-ft-bar > *', foot), { opacity: 0, y: DET.y }, { opacity: 1, y: 0, duration: DET.duration, ease: S, stagger: DET.stagger || 0.06, immediateRender: true }, at.bar);
      return tl;
    };

    let mode = null, tl = null, st = null, fly = null, state = 'bar', flight = null, wordTw = null;
    let FH = 0, lockR = null, lastNav = null, prog = 0, ro = null, raf = 0, CH = 0, K = -1;

    /* the fox */
    const navRect = () => {
      const el = $$('.logo__navbar').find(i => {
        const r = i.getBoundingClientRect(); if (!r.width || r.bottom <= 0) return false;
        const wr = i.closest('.navigation_wrapper'); if (!wr) return true;
        const cs = getComputedStyle(wr); return cs.visibility !== 'hidden' && cs.display !== 'none' && +cs.opacity > 0.5;
      });
      if (el) { const r = el.getBoundingClientRect(); lastNav = { left: r.left, top: r.top, width: r.width, height: r.height }; }
      return lastNav || { left: 48, top: 17, width: 40, height: 40 };
    };
    const headRect = () => head.getBoundingClientRect();
    const makeFly = () => {
      if (fly) return;
      fly = D.createElement('div'); fly.className = 'gfx-ftg-fly'; fly.setAttribute('aria-hidden', 'true');
      const i = new Image(); i.alt = ''; i.src = FOX; fly.appendChild(i); D.body.appendChild(fly);
    };
    const flyAt = (r, scale) => { const n = navRect(); Object.assign(fly.style, { width: n.width + 'px', height: n.height + 'px', visibility: 'visible' }); gsap.set(fly, { x: r.left, y: r.top, scale }); };
    const stopFlight = () => { if (flight) flight.kill(); flight = null; };
    const showWord = on => {
      if (wordTw) wordTw.kill();
      wordTw = on ? gsap.fromTo(word, { autoAlpha: 0, x: -8 }, { autoAlpha: 1, x: 0, duration: BODY.duration, ease: S })
        : gsap.to(word, { autoAlpha: 0, x: -8, duration: LV.duration, ease: LV.ease });
    };
    const setHome = () => {
      stopFlight(); if (wordTw) wordTw.kill(); state = 'home';
      H.classList.remove('gfx-ftg-flying'); H.classList.add('gfx-ftg-home'); if (fly) fly.style.visibility = 'hidden';
      gsap.set(word, { autoAlpha: 1, x: 0 }); if (tl) tl.progress(1);
    };
    const setBar = () => {
      stopFlight(); if (wordTw) wordTw.kill(); state = 'bar';
      H.classList.remove('gfx-ftg-flying', 'gfx-ftg-home'); if (fly) fly.style.visibility = 'hidden';
      gsap.set(word, { autoAlpha: 0, x: -8 });
    };
    // home: from the bar (or from mid-air) down to the lockup, on the divider curve; it grows to the lockup's size on the
    // settle curve over the second half, so it arrives and settles as one move
    const goHome = () => {
      makeFly(); state = 'out';
      const n = navRect(), b = headRect();
      if (!flight) flyAt(n, 1); else stopFlight();
      H.classList.add('gfx-ftg-flying');
      flight = gsap.timeline({ onComplete: () => {
        flight = null; state = 'home';
        H.classList.add('gfx-ftg-home'); H.classList.remove('gfx-ftg-flying'); fly.style.visibility = 'hidden';
        showWord(true); if (tl && tl.progress() < 1) tl.play();
      } })
        .to(fly, { x: b.left, y: b.top, duration: 1.3, ease: DR }, 0)
        .to(fly, { scale: b.width / n.width, duration: 0.85, ease: S }, 0.45);
    };
    // back to the bar: the wordmark leaves first, the fox lifts out of the lockup and returns
    const goBar = () => {
      makeFly(); state = 'back';
      const n = navRect();
      if (H.classList.contains('gfx-ftg-home')) { const b = headRect(); flyAt(b, b.width / n.width); H.classList.add('gfx-ftg-flying'); H.classList.remove('gfx-ftg-home'); }
      stopFlight(); showWord(false);
      flight = gsap.timeline({ onComplete: () => {
        flight = null; state = 'bar'; H.classList.remove('gfx-ftg-flying'); fly.style.visibility = 'hidden';
        if (prog <= 0.001 && tl) tl.pause(0);
      } }).to(fly, { x: n.left, y: n.top, scale: 1, duration: 1.2, ease: DR }, 0.1);
    };

    /* the reveal: p = how much of the footer the close has uncovered (0 covered, 1 at the page's end) */
    const inner = () => [...foot.children].filter(x => !x.classList.contains('gfx-cap') && !x.classList.contains('gfx-seam'));
    // the cut: the footer never shows above the close's top edge (where the held room above still shows)
    const cut = k => { if (k === K) return; K = k; foot.style.transform = k ? `translate3d(0,${k}px,0)` : ''; inner().forEach(e => { e.style.transform = k ? `translate3d(0,${-k}px,0)` : ''; }); };
    const measure = () => {
      CH = close ? close.offsetHeight : 0;
      cut(0);
      FH = foot.offsetHeight;
      host.style.setProperty('--gfx-ftg-h', FH + 'px');
      const r = lockup.getBoundingClientRect(); lockR = { top: r.top, bottom: r.bottom };
    };
    const step = (p, instant) => {
      prog = p;
      const covered = p <= 0.001;
      H.classList.toggle('gfx-ftg-covered', covered);
      const edge = W.innerHeight - p * FH;
      cut(close ? Math.max(0, Math.round(FH * (1 - p) - CH)) : 0);
      const home = edge <= lockR.bottom + 2, away = edge > lockR.bottom + 72;
      if (instant) { if (state === 'out' || state === 'home' ? !away : home) setHome(); else setBar(); }
      else if (home && (state === 'bar' || state === 'back')) goHome();
      else if (away && (state === 'home' || state === 'out')) goBar();
      if (covered && state === 'bar' && tl && tl.progress() > 0) tl.pause(0);
    };
    const onFocus = () => { if (mode === 'reveal' && prog < 0.99) scrollToEnd(); };

    const teardown = () => {
      if (st) st.kill(); st = null; if (tl) tl.kill(); tl = null; stopFlight(); if (wordTw) wordTw.kill(); if (ro) ro.disconnect(); ro = null;
      H.classList.remove('gfx-ftg-reveal', 'gfx-ftg-covered', 'gfx-ftg-home', 'gfx-ftg-flying');
      cut(0); host.style.removeProperty('--gfx-ftg-h'); if (fly) fly.style.visibility = 'hidden'; state = 'bar';
      gsap.set([word, ...$$('.gfx-ft-rule, .gfx-ft-base, .gfx-ft-bar > *', foot), ...cols.flatMap(kids)], { clearProps: 'opacity,visibility,transform' });
    };
    const fits = () => foot.offsetHeight <= W.innerHeight * 0.8;
    const setup = () => {
      const next = wide.matches && fits() ? 'reveal' : 'flow';
      if (next === mode) return; const was = mode; if (was) teardown(); mode = next;
      if (mode === 'flow') {
        tl = film(false);
        st = ST.create({ trigger: foot, start: 'top 92%', end: 'max', onEnter: () => tl.play(), onLeaveBack: () => tl.pause(0) });
        if (was || foot.getBoundingClientRect().top < W.innerHeight) tl.progress(foot.getBoundingClientRect().top < W.innerHeight ? 1 : 0);
        ST.refresh(); return;
      }
      H.classList.add('gfx-ftg-reveal');
      measure(); tl = film(true);
      // p is read from the host's live box on every scroll (not from a trigger's cached range: on a live page a room can
      // change height after the last refresh, and a stale range never reaches the page's end)
      const live = () => { const r = host.getBoundingClientRect(); return Math.min(1, Math.max(0, (W.innerHeight - r.top) / (FH || 1))); };
      let first = true;
      st = ST.create({ start: 0, end: 'max',
        onRefresh: () => { measure(); step(live(), true); first = false; },
        onUpdate: () => { step(live(), first); first = false; } });
      ro = new ResizeObserver(() => { if (foot.offsetHeight !== FH) { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => ST.refresh()); } });
      ro.observe(foot);
      ST.refresh();
    };
    foot.addEventListener('focusin', onFocus);
    const re = () => safe('footer G', setup);
    if (wide.addEventListener) wide.addEventListener('change', re); else wide.addListener(re);
    let rz = 0; W.addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(re, 180); });
    setup();
    W.gfxFootG = { get state() { return state; }, get mode() { return mode; }, get p() { return prog; }, get film() { return tl; } };   // (for the checks)
  }

  /* ========================= 4 · motion ========================= */
  function start() {
    gsap = W.gsap; ST = W.ScrollTrigger;
    gsap.registerPlugin(ST, W.SplitText);
    // skipped past (a fast fling, an anchor, Ctrl+F)? a room lands finished instead of staying hidden
    ST.defaults({ toggleActions: 'play complete none none' });
    if (shared && sharedRaf) {
      tickerOn = true; cancelAnimationFrame(tempLoop);
      gsap.ticker.add(() => sharedRaf(performance.now()));
      gsap.ticker.lagSmoothing(0);
      shared.on('scroll', ST.update);
    }
    findRooms();
    R.rooms.forEach(addMark);   // a mark in the flow before every room: a held room's own box reports where it is held

    // the hero plays at once (no wait for the fonts: a late font re-splits its lines mid-rise and they carry on)
    safe('hero', heroInit);
    safe('breath', breathInit);
    safe('pause', pauseControl);
    safe('marquee', marqueeInit);
    safe('nav', navInit);
    navWatch();

    fontsReady().then(() => setTimeout(() => {
      // (the joins first: they set html.gfx-hold, which the rooms' own held layouts read)
      [joinsInit, headsInit, questionsInit, closeInit, () => procInit(true), () => avInit(true), () => retainedInit(true),
        flatInit, () => footG({ close: '[data-o~=ow-close]' }), keyboardInit, anchorInit, measureInit].forEach(f => safe(f.name || 'room', f));
      H.classList.add('gfx-rooms');   // the room headings' pre-paint hold stands down (each is split and set by now)
      refresh();
    }, 0));
  }

  /* ---------- the hero (owners.js §1): plays at once, in the grammar's order. Headline 0, and the photograph opens with
     it (the window opens on the Draw curve as the lines land) · words +0.2 · the rule +0.45 · the arrow under
     "considering?" +0.85 · the client logos and the photograph's corner last (+1.2) ---------- */
  function heroInit() {
    const hero = R.hero, h1 = hero && $(O('ow-h1'), hero);
    if (!h1) { H.classList.add('gfx-hero-on', 'gfx-ready'); return; }
    let first = true, prevLines = null, tl = null;
    // a re-split while the reveal is running: the timeline still moves the OLD, detached lines, so the new ones carry on
    // from where those had got to and finish the rise themselves
    W.SplitText.create(h1, { type: 'lines', mask: 'lines', linesClass: 'gfx-ow-line', autoSplit: true, aria: 'none',
      onSplit: self => {
        const was = prevLines; prevLines = self.lines.slice();
        if (h1.__gfxRisen || !tl) gsap.set(self.lines, { yPercent: h1.__gfxRisen ? 0 : G.headline.yPercent });
        else self.lines.forEach((l, i) => { const o = was && was[Math.min(i, was.length - 1)], from = o ? +gsap.getProperty(o, 'yPercent') || 0 : G.headline.yPercent;
          gsap.fromTo(l, { yPercent: from }, { yPercent: 0, duration: from > 0 ? G.headline.duration * (from / G.headline.yPercent) + 0.2 : 0.01, delay: from > 0 ? i * G.headline.stagger : 0, ease: G.SETTLE, overwrite: true }); });
        if (!first) requestAnimationFrame(() => { D.dispatchEvent(new Event('gfx:resplit')); }); first = false;
      } });
    const hm = makeMark(h1);
    const words = [$(O('ow-hero-lede'), hero), $(O('ow-actions'), hero)].filter(Boolean);
    const rule = $(O('ow-hero-foot') + ' ' + O('ow-rule'), hero), firms = $(O('ow-firms'), hero);
    const pic = $(O('ow-hero-pic'), hero), img = pic && $('img', pic), facet = !!pic && has(pic, 'ow-facet-in');
    words.concat(firms ? [firms] : []).forEach(e => e.setAttribute('data-gfx-reveal', ''));
    gset(words, { opacity: 0, y: G.body.y }); gset(firms, { opacity: 0, y: G.detail.y }); gset(rule, { scaleX: 0, transformOrigin: '0% 50%' });
    if (img) { gsap.set(img, { clipPath: G.picture.clipFrom, scale: G.picture.scaleFrom }); if (facet) gsap.set(pic, { '--gfx-fx': '0px' }); }
    H.classList.add('gfx-hero-on', 'gfx-ready');   // the script holds them now; the pre-paint states and their fallback stand down
    tl = gsap.timeline({ delay: 0.1 });
    const lines = $$('.gfx-ow-line', h1);
    if (lines.length) tl.to(lines, { yPercent: 0, duration: G.headline.duration, stagger: G.headline.stagger, ease: G.SETTLE, onComplete: () => { h1.__gfxRisen = true; } }, 0);
    else h1.__gfxRisen = true;
    if (words.length) tl.to(words, { opacity: 1, y: 0, duration: G.body.duration, stagger: GROUP, ease: G.SETTLE, clearProps: 'transform' }, G.body.at);
    if (rule) tl.to(rule, { scaleX: 1, duration: G.hairline.duration, ease: G.DRAW }, G.hairline.at);
    // the photograph opens upward like a window (DRAW) and settles (a little longer than it opens), with the headline
    if (img) tl.to(img, { clipPath: 'inset(0% 0% 0% 0%)', duration: G.picture.duration, ease: G.DRAW }, 0)
      .to(img, { scale: 1, duration: G.picture.duration + 0.5, ease: G.SETTLE }, 0.2);
    drawMark(hm, tl, G.arrow.at);
    if (firms) tl.to(firms, { opacity: 1, y: 0, duration: G.detail.duration, ease: G.SETTLE, clearProps: 'transform' }, G.detail.at);
    // the corner cuts in last (its resting size is the CSS one: 96 px, 48 px below 992)
    if (img && facet) tl.to(pic, { '--gfx-fx': mq(STACK) ? '48px' : '96px', duration: G.hairline.duration, ease: G.DRAW, onComplete: () => pic.style.removeProperty('--gfx-fx') }, G.detail.at + G.detail.stagger);
    if (img) tl.add(() => gsap.set(img, { clearProps: 'clipPath' }));
    addFF(hero, () => ffTl(tl));
    track('hero', () => tl);
  }

  /* ---------- the breath (owners.js, sbx-m1.js M3): the hero's photograph keeps a very slow settle while it is on screen,
     from the grammar's breath scale to rest, tied to the scroll (from the top until the next room has covered the hero).
     The scale is the photograph's own CSS scale, so it composes with its arrival (a timed transform). ---------- */
  function breathInit() {
    if (/[?&]motif=1(&|$)/.test(location.search) || !G.breath) return;
    const hero = R.hero, img = hero && $(O('ow-hero-pic') + ' img', hero); if (!img) return;
    const B = G.breath, frame = img.parentElement;
    let last = -1, q = 0.0005;
    const set = u => { const raw = B.scaleFrom + (B.scaleTo - B.scaleFrom) * u, v = u >= 1 ? B.scaleTo : u <= 0 ? B.scaleFrom : +(Math.round(raw / q) * q).toFixed(4); if (v !== last) { last = v; img.style.scale = v; } };
    set(0);
    ST.create({ start: 0, end: () => Math.max(W.innerHeight, hero.offsetHeight), invalidateOnRefresh: true,
      onToggle: s => { img.style.willChange = s.isActive ? 'transform' : ''; },
      onUpdate: s => set(s.progress), onRefresh: s => { q = 1 / Math.max(400, frame.offsetWidth || 400); set(s.progress); } });
  }

  /* ---------- pause motion (WCAG 2.2.2): the client logos are the one continuous motion; the control sits beside their
     label (the hero's bottom left, where the homepage keeps its control); the choice holds for the visit ---------- */
  function pauseControl() {
    const head = $(O('ow-firms-head')); if (!head || $('.gfx-motion', head)) return;
    const slot = D.createElement('span'); slot.className = 'gfx-motion-slot';
    const btn = D.createElement('button'); btn.type = 'button'; btn.className = 'gfx-motion';
    const apply = still => {
      H.classList.toggle('gfx-still', still);
      btn.dataset.still = String(still);           // one signal for assistive technology: the label (no aria-pressed)
      btn.innerHTML = '<em aria-hidden="true"></em><span>' + (still ? 'Play motion' : 'Pause motion') + '</span>';
      store.set(STILL_KEY, still ? '1' : '');
    };
    btn.addEventListener('click', () => apply(btn.dataset.still !== 'true'));
    slot.appendChild(btn); head.appendChild(slot);
    apply(store.get(STILL_KEY) === '1');
  }

  /* ---------- the client logos (owners.js + render.js): one slow line, four sets (moving by exactly half returns it to
     the start), paused under the pointer, off screen, or by "Pause motion". The static row is Webflow's. ---------- */
  function marqueeInit() {
    const marq = $(O('ow-marq')), trk = marq && $(O('ow-marq-track'), marq); if (!trk || trk.__gfxMarq) return;
    const items = Array.prototype.slice.call(trk.children).filter(li => li.tagName === 'LI'); if (!items.length) return;
    trk.__gfxMarq = true;
    // Webflow publishes images loading="lazy": in a moving line clipped by its window a lazy image starts loading only
    // as it slides into view. The ten are small: load them now.
    $$('img', trk).forEach(i => { i.loading = 'eager'; i.decoding = 'async'; });
    for (let k = 1; k < 4; k++) items.forEach(li => {
      const c = li.cloneNode(true); c.setAttribute('aria-hidden', 'true'); c.setAttribute('data-gfx-copy', '');
      $$('img', c).forEach(i => { i.alt = ''; i.removeAttribute('id'); }); c.removeAttribute('id'); trk.appendChild(c);
    });
    H.classList.add('gfx-marq-on');
    if ('IntersectionObserver' in W) new IntersectionObserver(es => es.forEach(e => marq.classList.toggle('gfx-off', !e.isIntersecting))).observe(marq);
  }

  /* ---------- the bar (owners.js): it steps aside while you read down (the links and the button; the gold fox stays; on a
     phone the whole bar and the caps leave) and returns on the way up or to the keyboard ---------- */
  function navInit() {
    const bar = $('.gfx-nav'); if (!bar) return;
    let hidden = false;
    gsap.set(bar, { '--gfx-away': 0 });
    const set = want => {
      if (want === hidden) return; hidden = want;
      H.classList.toggle('gfx-bar-away', want);
      gsap.to(bar, { '--gfx-away': want ? 1 : 0, duration: want ? 0.45 : 0.7, ease: want ? 'power2.in' : G.SETTLE, overwrite: true });
      bar.classList.toggle('gfx-away', want);
    };
    ST.create({ start: 160, end: 'max', onUpdate: s => set(s.direction > 0 && !bar.contains(D.activeElement)), onLeaveBack: () => set(false) });
    bar.addEventListener('focusin', () => set(false));
  }

  /* ---------- the joins (owners.js, held desktop): every room holds (CSS sticky) while the next slides over it, in page
     order; the held room dims (dark rooms .5 toward black, light rooms .3 toward their paper) and a hairline draws across
     the arriving room's top, complete as it locks. A room still playing settles once the next has covered it completely.
     The close and the footer arrive together as one screen (no hold between them). ---------- */
  const dwellOf = room => {
    const a = room.getAttribute('data-gfx-dwell'); if (a != null && a !== '') return Math.max(0, +a || 0);
    // the retained room, once built (no placeholder), holds a short while before the questions arrive (owners.js HOLDS)
    return has(room, 'ow-ret') && !room.hasAttribute('data-placeholder') ? G.hold.short : 0;
  };
  function joinsInit() {
    const foot = R.foot;
    const setFoot = () => { if (foot) H.style.setProperty('--gfx-foot-h', foot.offsetHeight + 'px'); };
    setFoot(); W.addEventListener('resize', setFoot); ST.addEventListener('refreshInit', setFoot);
    gsap.matchMedia().add(HOLDQ, () => {
      H.classList.add('gfx-hold');
      const undo = [];
      const pairs = R.rooms.map((r, i) => [r, R.rooms[i + 1]]).filter(p => p[1]);
      pairs.forEach(([prev, next]) => {
        const nextY = () => flowY(next);
        const dw = dwellOf(prev);
        if (dw) { const sp = D.createElement('div'); sp.className = 'gfx-ow-dwell'; sp.setAttribute('aria-hidden', 'true'); sp.style.setProperty('--d', dw); markOf(next).parentNode.insertBefore(sp, markOf(next)); undo.push(() => sp.remove()); }
        const light = !isDark(prev);
        const dim = D.createElement('div'); dim.className = 'gfx-ow-dim'; dim.setAttribute('aria-hidden', 'true');
        if (light) dim.style.background = G.seam.lightTo || '#ffffff';
        prev.appendChild(dim);
        const setTop = () => { prev.style.top = Math.min(0, W.innerHeight - prev.offsetHeight) + 'px'; };
        setTop(); prev.style.position = 'sticky'; prev.setAttribute('data-gfx-held', '');
        W.addEventListener('resize', setTop); ST.addEventListener('refreshInit', setTop);
        // the dim begins when the arriving room reaches the held one's foot, and is complete when it has covered it; once
        // the held room is wholly covered its dim is set aside (unseen), and comes back with the first pixel of the way up
        const tw = gsap.fromTo(dim, { opacity: 0 }, { opacity: light ? G.seam.dimLight : G.seam.dimDark, ease: 'none',
          scrollTrigger: { start: () => nextY() - Math.min(W.innerHeight, prev.offsetHeight), end: () => nextY(), scrub: true, invalidateOnRefresh: true,
            onLeave: () => { dim.style.visibility = 'hidden'; }, onEnterBack: () => { dim.style.visibility = ''; } } });
        // the seam: a hairline across the arriving room's top edge, drawn by the slide, complete as it locks
        const seam = D.createElement('i'); seam.className = 'gfx-ow-seam'; seam.setAttribute('aria-hidden', 'true'); next.insertBefore(seam, next.firstChild);
        const sw = gsap.fromTo(seam, { scaleX: 0 }, { scaleX: 1, ease: G.DRAW,
          scrollTrigger: { start: () => nextY() - W.innerHeight, end: () => nextY(), scrub: true, invalidateOnRefresh: true } });
        // a room still playing settles once the next has covered it completely (out of sight)
        const ff = ST.create({ start: () => nextY(), end: () => nextY() + 1, onEnter: () => ffRoom(prev) });
        undo.push(() => {
          [tw, sw].forEach(t => { if (t.scrollTrigger) t.scrollTrigger.kill(); t.kill(); }); ff.kill(); dim.remove(); seam.remove();
          prev.style.position = ''; prev.style.top = ''; prev.removeAttribute('data-gfx-held');
          W.removeEventListener('resize', setTop); ST.removeEventListener('refreshInit', setTop);
        });
      });
      refresh();
      return () => { undo.forEach(f => safe('unjoin', f)); H.classList.remove('gfx-hold'); };
    });
  }

  /* ---------- nothing held (phones, tablets, short desktops): nothing is left playing once its room has scrolled away; the
     line still draws at every seam, the footer's included, completing as the arriving room's top reaches the top of the
     screen (or at the page's end) ---------- */
  function flatInit() {
    gsap.matchMedia().add(FLATQ, () => {
      const ffs = R.rooms.map(r => ST.create({ start: () => flowY(r) + r.offsetHeight, end: () => flowY(r) + r.offsetHeight + 1, onEnter: () => ffRoom(r) }));
      H.classList.add('gfx-seams-flat');
      const flat = R.rooms.slice(1).concat(R.foot ? [R.foot] : []).map(r => {
        let seam = $(':scope > .gfx-ow-seam', r); const made = !seam;
        if (made) { seam = D.createElement('i'); seam.className = 'gfx-ow-seam'; seam.setAttribute('aria-hidden', 'true'); r.insertBefore(seam, r.firstChild); }
        const tw = gsap.fromTo(seam, { scaleX: 0 }, { scaleX: 1, ease: G.DRAW, immediateRender: true,
          scrollTrigger: { start: () => flowY(r) - W.innerHeight, end: () => Math.max(flowY(r) - W.innerHeight + 1, Math.min(ST.maxScroll(W), flowY(r))), scrub: true, invalidateOnRefresh: true } });
        return () => { if (tw.scrollTrigger) tw.scrollTrigger.kill(); tw.kill(); if (made) seam.remove(); };
      });
      refresh();
      return () => { ffs.forEach(s => s.kill()); flat.forEach(f => safe('unflat', f)); H.classList.remove('gfx-seams-flat'); };
    });
  }

  /* ---------- the rooms' heads (owners.js roomHead): as the headline reaches 82% of the screen its lines rise; its words
     follow (+0.2); the room's hairline draws (+0.45); the arrow under the key word (+0.85). Jumped past: set finished. ---------- */
  const pctOf = s => { const m = /(\d+(?:\.\d+)?)%/.exec(s || ''); return m ? +m[1] / 100 : 0.82; };
  // where an element sits below its room's top in the flow (a stage held inside the room is measured from where it would be)
  const offIn = (el, room) => {
    let off = el.getBoundingClientRect().top - room.getBoundingClientRect().top;
    for (let a = el.parentElement; a && a !== room; a = a.parentElement) {
      if (getComputedStyle(a).position !== 'sticky') continue;
      const p = a.parentElement; if (!p || a !== p.firstElementChild) continue;
      off -= a.getBoundingClientRect().top - p.getBoundingClientRect().top - (parseFloat(getComputedStyle(p).paddingTop) || 0) - (parseFloat(getComputedStyle(a).marginTop) || 0);
    }
    return Math.max(0, Math.round(off));
  };
  const headAt = (room, el, play) => {
    const pct = pctOf(G.headline.start);
    const at = () => flowY(room) + offIn(el, room) - W.innerHeight * pct;
    let done = false;
    ST.create({ start: at, end: () => at() + 1, invalidateOnRefresh: true,
      onEnter: s => { if (done) return; done = true; play(false); s.kill(); },
      onLeave: s => { if (done) return; done = true; play(true); s.kill(); } });
  };
  // the room's film: build(tl) adds its tweens to one timeline, played at the lock (held) or at 80% (flat); the close,
  // which arrives with the footer and is never held, plays as it reaches 40% (at the page's end it sits at the top)
  const filmAt = (room, el, build) => {
    let tl = null, done = false;
    // (1.0.3: built now, outside any gsap.matchMedia context: a film made inside a held or flat trigger's callback would
    // be recorded by that context and reverted, its room hidden again, when the screen crosses the hold threshold)
    const make = () => { if (!tl) { tl = gsap.timeline({ paused: true }); build(tl); } return tl; };
    make();
    const go = skip => { if (done) return; done = true; const t = make(); if (skip) t.progress(1); else t.play(); };
    addFF(room, () => { if (!done) go(true); else ffTl(tl); });
    const mm = gsap.matchMedia();
    mm.add(HOLDQ, () => {
      if (!held()) return undefined;
      const at = () => (has(room, 'ow-close') ? flowY(room) - W.innerHeight * 0.4 : flowY(room) - Math.min(0, W.innerHeight - room.offsetHeight));
      const st = ST.create({ start: at, end: () => at() + 1, invalidateOnRefresh: true, onEnter: () => go(false), onLeave: () => go(true) });
      return () => st.kill();
    });
    mm.add(FLATQ, () => {
      const at = () => flowY(el) - W.innerHeight * 0.8;
      const st = ST.create({ start: at, end: () => at() + 1, invalidateOnRefresh: true, onEnter: () => go(false), onLeave: () => go(true) });
      return () => st.kill();
    });
    return { go, tl: () => tl };
  };
  // a rule drawn as a CSS line (a pseudo-element whose scaleX is --ow-rl), or a real rule element
  const isVarRule = r => !(has(r, 'ow-rule') || r.hasAttribute('data-ow-draw'));
  const ruleFrom = r => (isVarRule(r) ? gsap.set(r, { '--ow-rl': 0 }) : gsap.set(r, { scaleX: 0, transformOrigin: '0% 50%' }));
  const ruleTo = (tl, r, at) => tl.to(r, isVarRule(r) ? { '--ow-rl': 1, duration: G.hairline.duration, ease: G.DRAW } : { scaleX: 1, duration: G.hairline.duration, ease: G.DRAW }, at);
  const shownNow = els => gset(els, { clearProps: 'pointerEvents' });
  const laterMarks = new Map();   // rooms whose arrow follows a line drawn in their film (the questions' rows)
  const roomHead = (room, opts) => {
    const o = opts || {};
    const open = $(O('ow-open'), room), h = open && $('h2', open); if (!h) return null;
    const words = $$(O('ow-open-r') + ' > *', open);
    const rule = o.rule || null;
    let m = (h.getAttribute('data-mark') || '').trim() ? makeMark(h) : null;
    if (m && o.markLater) { laterMarks.set(room, m); m = null; }
    let shown = false, first = true, tl = null;
    W.SplitText.create(h, { type: 'lines', mask: 'lines', linesClass: 'gfx-ow-line', autoSplit: true, aria: 'none',
      onSplit: self => { gsap.set(self.lines, { yPercent: shown ? 0 : G.headline.yPercent }); if (!first) requestAnimationFrame(() => { D.dispatchEvent(new Event('gfx:resplit')); }); first = false; } });
    words.forEach(e => e.setAttribute('data-gfx-reveal', ''));
    gset(words, { opacity: 0, y: G.body.y, pointerEvents: 'none' });
    if (rule) ruleFrom(rule);
    const play = skip => {
      shown = true; tl = gsap.timeline();
      const ls = $$('.gfx-ow-line', h);
      if (ls.length) tl.to(ls, { yPercent: 0, duration: G.headline.duration, stagger: G.headline.stagger, ease: G.SETTLE }, 0);
      if (words.length) tl.to(words, { opacity: 1, y: 0, duration: G.body.duration, stagger: GROUP, ease: G.SETTLE, onStart: () => shownNow(words) }, G.body.at);
      if (rule) ruleTo(tl, rule, G.hairline.at);
      if (m) drawMark(m, tl, G.arrow.at);
      if (skip) { shownNow(words); tl.progress(1); if (m) markDone(m); }
    };
    addFF(room, () => { if (!tl) play(true); else ffTl(tl); });
    headAt(room, h, play);
    return { tl: () => tl };
  };
  function headsInit() {
    [R.av, R.qs, R.close].filter(Boolean).forEach(r => {
      const hd = roomHead(r, r === R.close ? { rule: $(O('ow-close-row'), r) } : r === R.qs ? { markLater: true } : {});
      if (hd) track((r.id || 'room') + ' head', hd.tl);
    });
  }

  /* ---------- the questions (owners.js): one sequence; each row's line draws first, 0.08 s apart (a tight list); the arrow
     under "ask." follows as the grammar spaces a hairline and its arrow; then the questions rise row by row ---------- */
  function questionsInit() {
    const qs = R.qs, acc = qs && $(O('ow-acc'), qs); if (!acc) return;
    const items = $$(O('ow-acc-item'), acc), heads = items.map(i => $(O('ow-acc-h'), i)).filter(Boolean);
    if (!items.length) return;
    heads.forEach(e => e.setAttribute('data-gfx-reveal', ''));
    gsap.set(items.concat([acc]), { '--ow-rl': 0 }); gset(heads, { opacity: 0, y: G.body.y, pointerEvents: 'none' });
    const AFTER = G.arrow.at - G.hairline.at;
    const f = filmAt(qs, acc, tl => {
      const qm = laterMarks.get(qs);
      tl.to(items, { '--ow-rl': 1, duration: G.hairline.duration, ease: G.DRAW, stagger: TIGHT }, 0);
      if (qm) drawMark(qm, tl, AFTER);
      if (heads.length) tl.to(heads, { opacity: 1, y: 0, duration: G.body.duration, ease: G.SETTLE, stagger: TIGHT, onStart: () => shownNow(heads), clearProps: 'transform' }, qm ? AFTER + 0.35 : G.body.at);
      tl.to(acc, { '--ow-rl': 1, duration: G.hairline.duration, ease: G.DRAW }, TIGHT * items.length);
      tl.add(() => { shownNow(heads); if (qm) markDone(qm); });
    });
    track('questions film', f.tl);
  }

  /* ---------- the close (owners.js): the room's head (the line under its opener, the arrow under "taking."), then the two
     doors one after another; each door's arrow is its own glyph and arrives with it ---------- */
  function closeInit() {
    const cl = R.close; if (!cl) return;
    const row = $(O('ow-close-row'), cl), wrap = $(O('ow-doors'), cl), doors = $$(O('ow-door'), cl);
    if (!doors.length) return;
    doors.forEach(e => e.setAttribute('data-gfx-reveal', ''));
    gset(doors, { opacity: 0, y: G.detail.y, pointerEvents: 'none' });
    const f = filmAt(cl, row || wrap || cl, tl => {
      doors.forEach((d, i) => tl.to(d, { opacity: 1, y: 0, duration: G.detail.duration, ease: G.SETTLE, onStart: () => shownNow(d), clearProps: 'transform' }, i * GROUP));
      tl.add(() => shownNow(doors));
    });
    track('close film', f.tl);
  }

  /* ---------- the footer: its divider draws in as you arrive (the designer's own Webflow interaction on his "divider":
     from the left over 3 s, power1.inOut); back below the screen it resets out of sight ---------- */
  function footerInit() {
    $$('.footer_section_wrapper .divider').forEach(d => {
      const tw = gsap.fromTo(d, { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: 3, ease: 'power1.inOut', paused: true });
      const at = () => flowY(d) - W.innerHeight;
      ST.create({ start: at, end: 'max', onEnter: () => tw.play(), onLeaveBack: () => tw.pause(0) });
    });
  }

  /* ========================= 5 · the process room (proc.js, design A "The line": final) =========================
     Four beats on one line: research (your company found inside a mapped market), outreach (one line reaching one
     company), conversation (a two-way exchange beside the owner's words), introduction (two sides joining, then the line
     turning up into the green arrow at 38.2°, once). The script measures the four cells and writes every path (the turn
     is exactly 38.2° at any width). Held desktop: one ~3.5 s film once the room locks (hold 0.37 screen); once the next
     room has covered the whole screen a film still playing settles at once; back up it stays settled; a fresh arrival
     (the room off screen below) plays it again. Short desktop: the film plays once as the room arrives. Phones: each beat
     plays as it reaches 82% of the screen. Reduced motion / no GSAP: the settled frame. The market's layout is
     illustrative (seeded), never data. */
  const HOLDS = [];   // the held rooms' own triggers (a resize finds them again by name)
  // a market: ruled rows with points along them; one point is the owner's company (removed from the field: drawn apart)
  const field = o => {
    const Rn = rnd(o.seed || 7), rows = [], pts = [], fit = [];
    const n = Math.max(3, Math.round((o.y1 - o.y0) / o.sp)), sp = (o.y1 - o.y0) / (n - 1);
    for (let i = 0; i < n; i++) rows.push(+(o.y0 + i * sp).toFixed(1));
    const you = { x: o.x0 + (o.x1 - o.x0) * o.ux, y: rows[Math.max(0, Math.min(n - 1, o.urow < 0 ? n + o.urow : o.urow))] };
    rows.forEach(y => {
      const k = Math.round((o.x1 - o.x0) / o.dx * (0.75 + Rn() * 0.5));
      const xs = []; for (let j = 0; j < k; j++) xs.push(o.x0 + 6 + Rn() * (o.x1 - o.x0 - 12));
      xs.sort((a, b) => a - b).forEach((x, j) => {
        if (j && x - xs[j - 1] < 7) return;
        if (Math.abs(y - you.y) < 1 && Math.abs(x - you.x) < 18) return;
        (Rn() < (o.fit || 0.14) ? fit : pts).push([x, y]);
      });
    });
    const dots = a => a.map(([x, y]) => `M${f1(x)} ${f1(y)}h0`).join('');
    return { rows: rows.map(y => `M${f1(o.x0)} ${y}H${f1(o.x1)}`).join(''), pts: dots(pts), fit: dots(fit), you, n };
  };
  function procInit(live) {
    const room = R.proc; if (!room || room.__gfxProc) return; room.__gfxProc = true;
    const beats = $$(O('pc-beat'), room), svgs = beats.map(b => $('svg.pa-svg', b)), n = beats.length;
    if (n < 4 || svgs.some(s => !s)) return;
    const pq = $(O('pc-q'), room), quoteEls = pq ? [$('blockquote', pq), $('figcaption', pq)] : [];
    const ti = beats.map(b => $(O('pc-ti'), b)), ps = beats.map(b => $(O('pc-p'), b)), ws = beats.map(b => $(O('pc-w'), b));
    const P2 = (s, c) => s.querySelector('.' + c);
    const S = {};
    /* ---- geometry: desktop = one drawing across the four cells (all of it in the first cell's svg); phone = one per beat ---- */
    const layout = () => {
      const stacked = mq(STACK);
      const laneF = parseFloat(getComputedStyle(room).getPropertyValue('--pc-lane')) || 0.16;
      const boxes = beats.map(b => { const d = $(O('pc-draw'), b); return d ? d.getBoundingClientRect() : { left: 0, top: 0, width: 0, height: 0 }; }), base = boxes[0];
      svgs.forEach((s, k) => { const r = boxes[k]; s.setAttribute('width', f1(r.width)); s.setAttribute('height', f1(r.height)); s.setAttribute('viewBox', `0 0 ${f1(r.width)} ${f1(r.height)}`); });
      const set = (s, c, d) => { const p = P2(s, c); if (p) p.setAttribute('d', d || ''); };
      const circ = (s, c, x, y) => { const p = P2(s, c); if (!p) return; p.setAttribute('cx', f1(x)); p.setAttribute('cy', f1(y)); p.style.display = ''; };
      const note = (s, c, x, y, anchor) => { const t = P2(s, c); if (!t) return; t.setAttribute('x', f1(x)); t.setAttribute('y', f1(y)); t.setAttribute('text-anchor', anchor || 'start'); t.style.display = ''; };
      const clear = s => {
        ['pa-rows', 'pa-pts', 'pa-fit', 'pa-lane', 'pa-reach', 'pa-xa', 'pa-xb', 'pa-gr', 'pa-grt', 'pa-hd'].forEach(c => set(s, c, ''));
        ['pa-pulse', 'pa-ring', 'pa-you', 'pa-nring', 'pa-node', 'pa-xad', 'pa-xbd', 'pa-nu', 'pa-nb'].forEach(c => { const p = P2(s, c); if (p) p.style.display = 'none'; });
        const sw = P2(s, 'pa-sw'); if (sw) { sw.setAttribute('width', 0); sw.dataset.w = 0; }
        ['pa-lane', 'pa-gr'].forEach(c => { const p = P2(s, c); if (p) delete p.dataset.k; });
      };
      // a line drawn in two moments: the share of its length drawn by its first channel (the rest by the second)
      const splitAt = (s, c, tail) => { const p = P2(s, c); if (!p) return; const L = p.getTotalLength ? p.getTotalLength() : 0; if (L > tail) p.dataset.k = ((L - tail) / L).toFixed(4); };
      svgs.forEach(clear);
      const arrow = (s, xj, yh, xEnd, Hh) => {
        const rise = Math.max(18, Math.min(34, Hh * 0.11)), run = rise / TAN, tip = xEnd, xt = tip - run, hs = Math.round(rise * 0.36);
        set(s, 'pa-grt', `M${f1(xj)} ${yh}H${f1(xt)}L${f1(tip)} ${f1(yh - rise)}`);
        set(s, 'pa-hd', `M${f1(tip - hs)} ${f1(yh - rise)}H${f1(tip)}V${f1(yh - rise + hs)}`);
      };
      // a word down, a word back: two strokes between the lines, each ending in a point where it arrives
      const exchange = (s, x, yl, yh) => {
        set(s, 'pa-xa', `M${x - 6} ${f1(yl + 7)}V${f1(yh - 7)}`); set(s, 'pa-xb', `M${x + 6} ${f1(yh - 7)}V${f1(yl + 7)}`);
        circ(s, 'pa-xad', x - 6, yh - 7); circ(s, 'pa-xbd', x + 6, yl + 7);
      };
      const market = (s, o) => {
        const fd = field(o); set(s, 'pa-rows', fd.rows); set(s, 'pa-pts', fd.pts); set(s, 'pa-fit', fd.fit);
        const sw = P2(s, 'pa-sw'); if (sw) { sw.dataset.w = o.x1 + 12; sw.setAttribute('height', o.H + 80); }
        const u = fd.you; circ(s, 'pa-you', u.x, u.y); circ(s, 'pa-ring', u.x, u.y); circ(s, 'pa-pulse', u.x, u.y);
        return u;
      };
      if (!stacked) {
        const s = svgs[0], Hh = base.height, yh = +(Hh + 0.5).toFixed(1), yl = Math.round(Hh * laneF) + 0.5;
        const X = boxes.map(r => r.left - base.left), Wd = boxes.map(r => r.width), END = X[3] + Wd[3] - 2;
        // research: the market fills the first cell; the owner's company sits low and to the right in it
        const u = market(s, { x0: 0, x1: Wd[0] - 40, y0: Math.round(Hh * 0.05) + 0.5, y1: Math.round(Hh * 0.7) + 0.5, sp: Hh > 320 ? 22 : 19, dx: 15, ux: 0.86, urow: -2, seed: 11, fit: 0.12, H: Hh });
        const rr = 9;
        note(s, 'pa-nu', u.x + rr + 12, Math.round(Hh * 0.7) + 30, 'start');
        // outreach: one buyer, high in the second cell; one line from it to the company
        const nx = X[1] + Wd[1] * 0.5;
        circ(s, 'pa-node', nx, yl); circ(s, 'pa-nring', nx, yl);
        note(s, 'pa-nb', nx - 14, yl + 4.5, 'end');
        set(s, 'pa-reach', `M${f1(nx)} ${f1(yl + 8)}C${f1(nx)} ${f1(yl + (u.y - yl) * 0.92)} ${f1(u.x + rr + (nx - u.x - rr) * 0.42)} ${f1(u.y)} ${f1(u.x + rr)} ${f1(u.y)}`);
        // the two lines: ours (from the buyer) along the top, the company's (green) along the horizon; they meet in the last cell
        const xs = X[3] - 24, xj = X[3] + Math.min(Wd[3] * 0.58, Wd[3] - 110), c = (xj - xs) * 0.5;
        set(s, 'pa-lane', `M${f1(nx + 8)} ${yl}H${f1(xs)}C${f1(xs + c)} ${yl} ${f1(xj - c)} ${yh} ${f1(xj)} ${yh}`);
        set(s, 'pa-gr', `M${f1(u.x)} ${f1(u.y + rr)}V${f1(yh - 16)}Q${f1(u.x)} ${yh} ${f1(u.x + 16)} ${yh}H${f1(xj)}`);
        // (the buyer's line runs along the top through the conversation and comes down only with the introduction; the
        // company's line runs to the same point and meets it there, so the join is drawn with its words)
        const lp = P2(s, 'pa-lane'); if (lp && lp.getTotalLength) { const L = lp.getTotalLength(), hl = xs - nx - 8; if (L > hl && hl > 0) lp.dataset.k = (hl / L).toFixed(4); }
        splitAt(s, 'pa-gr', xj - xs);
        // conversation: the exchange, beside the owner's words (the word down on the cell's own edge)
        exchange(s, Math.round(X[2]) + 6.5, yl, yh);
        // introduction: joined, the line runs on and turns up at 38.2° into the arrow
        arrow(s, xj, yh, END, Hh);
      } else {
        svgs.forEach((s, k) => {
          const r = boxes[k], Wk = r.width, Hh = r.height, yh = +(Hh + 0.5).toFixed(1), yl = Math.round(Hh * 0.24) + 0.5;
          if (k === 0) {
            const u = market(s, { x0: 0, x1: Wk - 8, y0: 6.5, y1: Math.round(Hh * 0.66) + 0.5, sp: 17, dx: 13, ux: 0.74, urow: -1, seed: 11, fit: 0.12, H: Hh });
            note(s, 'pa-nu', u.x - 20, Math.round(Hh * 0.66) + 30, 'end');
            set(s, 'pa-gr', `M${f1(u.x)} ${f1(u.y + 9)}V${f1(yh - 14)}Q${f1(u.x)} ${yh} ${f1(u.x + 14)} ${yh}H${f1(Wk)}`);
          }
          if (k === 1) {
            const ux = Wk * 0.24, uy = yh, nx = Wk * 0.72, ny = yl;
            circ(s, 'pa-ring', ux, uy); circ(s, 'pa-you', ux, uy); circ(s, 'pa-pulse', ux, uy); circ(s, 'pa-node', nx, ny); circ(s, 'pa-nring', nx, ny);
            note(s, 'pa-nb', nx - 14, ny + 4.5, 'end');
            set(s, 'pa-reach', `M${f1(nx)} ${f1(ny + 8)}C${f1(nx)} ${f1(ny + (uy - ny) * 0.9)} ${f1(ux + 9 + (nx - ux) * 0.4)} ${f1(uy)} ${f1(ux + 9)} ${f1(uy)}`);
            set(s, 'pa-gr', `M0 ${yh}H${f1(ux - 9)}M${f1(ux + 9)} ${yh}H${f1(Wk)}`);
          }
          if (k === 2) {
            set(s, 'pa-lane', `M0 ${yl}H${f1(Wk)}`); set(s, 'pa-gr', `M0 ${yh}H${f1(Wk)}`);
            exchange(s, 6.5, yl, yh);
          }
          if (k === 3) {
            const xj = Wk * 0.46, c = xj * 0.5;
            set(s, 'pa-lane', `M0 ${yl}C${f1(c)} ${yl} ${f1(xj - c)} ${yh} ${f1(xj)} ${yh}`); set(s, 'pa-gr', `M0 ${yh}H${f1(xj)}`);
            arrow(s, xj, yh, Wk - 2, Hh);
          }
        });
      }
    };
    /* ---- channels (0 … 1), painted onto the drawing and the words ---- */
    const CH = ['f', 'fit', 'you', 'pulse', 'node', 'reach', 'lane', 'lnd', 'xa', 'xb', 'gr', 'grj', 'grt', 'hd'];
    const names = [];
    for (let k = 0; k < 4; k++) CH.forEach(c => names.push(c + k));
    for (let k = 0; k < 4; k++) names.push('t' + k, 'p' + k, 'r' + k);
    names.push('q', 'qa');
    const dash = (p, v) => { if (!p) return; p.style.strokeDasharray = '1 2'; p.style.strokeDashoffset = f1((1 - c01(v)) * 1000) / 1000; };
    const pop = (el, v) => { if (!el) return; const y = c01(v); el.style.opacity = y; el.style.transform = y >= 1 ? '' : `scale(${(0.4 + 0.6 * expo(y)).toFixed(3)})`; };
    const paintDraw = () => {
      svgs.forEach((s, k) => {
        const v = c => nv(S[c + k], 1);
        const sw = P2(s, 'pa-sw'); if (sw) sw.setAttribute('width', f1((+sw.dataset.w || 0) * c01(v('f')) + (v('f') >= 1 ? 40 : 0)));
        const fit = P2(s, 'pa-fit'); if (fit) fit.style.opacity = c01(v('fit'));
        dash(P2(s, 'pa-ring'), v('you')); pop(P2(s, 'pa-you'), v('you') * 1.6);
        const nu = P2(s, 'pa-nu'); if (nu) nu.style.opacity = c01(v('you') * 2 - 1);
        const pu = P2(s, 'pa-pulse'), pv = c01(v('pulse')); if (pu) { pu.setAttribute('r', f1(9 + 16 * pv)); pu.style.opacity = pv > 0 && pv < 1 ? ((1 - pv) * 0.7).toFixed(3) : 0; }
        pop(P2(s, 'pa-node'), v('node') * 1.4); dash(P2(s, 'pa-nring'), v('node'));
        const nb = P2(s, 'pa-nb'); if (nb) nb.style.opacity = c01(v('node') * 2 - 1);
        ['reach', 'xa', 'xb', 'grt', 'hd'].forEach(c => dash(P2(s, 'pa-' + c), v(c)));
        // the two long lines: the first channel draws their run, the second their last stretch (lnd, grj)
        [['lane', 'lnd'], ['gr', 'grj']].forEach(([a, b]) => { const p = P2(s, 'pa-' + a); if (!p) return; const kk = +(p.dataset.k || 1); dash(p, kk >= 1 ? v(a) : kk * c01(v(a)) + (1 - kk) * c01(v(b))); });
        pop(P2(s, 'pa-xad'), (v('xa') - 0.85) / 0.15); pop(P2(s, 'pa-xbd'), (v('xb') - 0.85) / 0.15);
      });
      beats.forEach((b, k) => {
        const t = c01(nv(S['t' + k], 1)), p = c01(nv(S['p' + k], 1));
        if (ti[k]) ti[k].style.transform = t >= 1 ? '' : `translateY(${f1((1 - t) * 108)}%)`;
        if (ps[k]) { ps[k].style.opacity = p >= 1 ? '' : p; ps[k].style.transform = p >= 1 ? '' : `translateY(${f1((1 - p) * G.body.y)}px)`; }
        const r = c01(nv(S['r' + k], 1)); if (ws[k]) ws[k].style.setProperty('--pc-rl', r >= 1 ? '' : r.toFixed(4));
      });
      if (pq) [[quoteEls[0], 'q'], [quoteEls[1], 'qa']].forEach(([el, c]) => { if (!el) return; const v = c01(nv(S[c], 1)); el.style.opacity = v >= 1 ? '' : v; el.style.transform = v >= 1 ? '' : `translateY(${f1((1 - v) * G.body.y)}px)`; });
    };
    /* ---- the film (desktop, the arrow's head lands at about 3.55 s): one beat every 0.65 s; each beat's name rises, its
       sentence follows (+0.2), its hairline draws (+0.45), then its drawing; lines on the Draw curve, points and words settle ---- */
    const film = (tl, ch) => {
      const Dr = G.DRAW, E = G.SETTLE, T = G.headline.duration, B = G.body.duration, L = G.hairline.duration, A = G.arrow.duration;
      const beat = (k, b) => { ch('t' + k, b, T, E); ch('p' + k, b + 0.2, B, E); ch('r' + k, b + 0.45, L, Dr); };
      // research: the market is drawn, the companies that fit light, then yours
      beat(0, 0.1); ch('f0', 0.45, 0.9, Dr); ch('fit0', 0.95, 0.6, E); ch('you0', 1.1, 0.6, E);
      // outreach: one buyer, one line to your company (it pulses as the line arrives)
      beat(1, 0.75); ch('node0', 1.05, 0.6, E); ch('reach0', 1.25, 0.7, Dr); ch('pulse0', 1.9, 1.0, E);
      // the two lines run on toward the introduction's cell (the company's along the horizon, the buyer's along the top)
      ch('gr0', 1.5, 0.8, Dr); ch('lane0', 1.6, 0.8, Dr);
      // conversation: the owner's words between the lines, a word each way beside them
      beat(2, 1.4); ch('q', 1.7, B, E); ch('xa0', 1.85, 0.55, Dr); ch('qa', 2.0, G.detail.duration, E); ch('xb0', 2.05, 0.55, Dr);
      // introduction: the buyer's line comes down as the company's arrives, they join, and the line turns up into the arrow
      beat(3, 2.05); ch('lnd0', 2.3, 0.6, Dr); ch('grj0', 2.35, 0.55, Dr); ch('grt0', 2.8, 0.45, Dr); ch('hd0', 2.8 + 0.45 - 0.15, A, E);
    };
    /* ---- phones: each beat plays as it arrives (the same order: name, sentence, hairline, drawing) ---- */
    const parts = ch => {
      const Dr = G.DRAW, E = G.SETTLE, T = G.headline.duration, B = G.body.duration, L = G.hairline.duration, A = G.arrow.duration;
      const words = k => { ch('t' + k, 0, T, E); ch('p' + k, 0.2, B, E); ch('r' + k, 0.45, L, Dr); };
      return [
        [beats[0], () => { words(0); ch('f0', 0.6, 0.9, Dr); ch('fit0', 1.1, 0.5, E); ch('you0', 1.3, 0.6, E); ch('gr0', 1.6, 0.8, Dr); }],
        [beats[1], () => { words(1); ch('gr1', 0.6, 0.7, Dr); ch('you1', 0.75, 0.5, E); ch('node1', 0.9, 0.5, E); ch('reach1', 1.05, 0.7, Dr); ch('pulse1', 1.7, 1.0, E); }],
        [beats[2], () => { words(2); ch('lane2', 0.6, 0.8, Dr); ch('gr2', 0.7, 0.8, Dr); ch('xa2', 1.25, 0.6, Dr); ch('xb2', 1.5, 0.6, Dr); }],
        [pq || beats[2], () => { ch('q', 0, B, E); ch('qa', 0.3, G.detail.duration, E); }],
        [beats[3], () => { words(3); ch('lane3', 0.6, 0.8, Dr); ch('gr3', 0.6, 0.8, Dr); ch('grt3', 1.4, 0.5, Dr); ch('hd3', 1.4 + 0.5 - 0.15, A, E); }]
      ];
    };
    /* ---- the core: one film, played once the room locks ---- */
    const h2 = $(O('pc-h'), room);
    const one = () => { names.forEach(c => { S[c] = 1; }); S.h = 1; };
    const zero = () => { names.forEach(c => { S[c] = 0; }); S.h = 0; };
    let lines = [];
    // the headline's lines rise under a mask, one after another (painted from one channel, so a re-split keeps its place)
    const paintHead = () => {
      if (!lines.length) return; const d = G.headline.duration, st = G.headline.stagger, T = d + st * (lines.length - 1), h = c01(nv(S.h, 1));
      lines.forEach((l, i) => { const p = c01((h * T - i * st) / d); l.style.transform = p >= 1 ? '' : `translateY(${(G.headline.yPercent * (1 - expo(p))).toFixed(2)}%)`; });
    };
    const paint = () => { paintDraw(); paintHead(); };
    const relayout = () => { safe('process layout', layout); paint(); };
    one(); relayout();
    let rz = 0; W.addEventListener('resize', () => { cancelAnimationFrame(rz); rz = requestAnimationFrame(relayout); });
    if (D.fonts && D.fonts.ready) D.fonts.ready.then(relayout);
    if (!live) return;
    if (W.SplitText && h2) W.SplitText.create(h2, { type: 'lines', mask: 'lines', linesClass: 'gfx-pc-line', autoSplit: true, aria: 'none', onSplit: self => { lines = self.lines; paintHead(); } });
    ST.addEventListener('refresh', () => requestAnimationFrame(relayout));
    const trk = $(O('pc-track'), room) || room;
    const holdPx = () => Math.max(1, trk.offsetHeight - W.innerHeight);
    const top = () => flowY(room);
    const chIn = tl => (name, at, dur, ease) => tl.fromTo(S, { [name]: 0 }, { [name]: 1, duration: dur, ease: ease || G.SETTLE, immediateRender: false }, at);
    const headDur = G.headline.duration + G.headline.stagger * 3;
    let cur = null;
    track('process film', () => cur);
    const mm = gsap.matchMedia();
    /* held desktop: the lock */
    mm.add(HOLDQ, () => {
      if (!held()) { one(); paint(); return undefined; }
      zero(); relayout();
      const tl = cur = gsap.timeline({ paused: true, onUpdate: paint });
      tl.fromTo(S, { h: 0 }, { h: 1, duration: headDur, ease: 'none', immediateRender: false }, 0);
      film(tl, chIn(tl));
      const play = () => { if (tl.progress() < 1 && !tl.isActive()) tl.play(); };
      // the next room has covered the whole screen: only then does a film still playing settle (out of sight, at once)
      const ffNow = () => { if (tl.progress() >= 1) return; tl.pause(); tl.progress(1); paint(); };
      const reset = () => { tl.pause(0); zero(); paint(); };
      const sts = [
        ST.create({ start: () => top() - W.innerHeight * 0.05, end: () => top(), onEnter: play }),
        ST.create({ start: () => top() + holdPx() + W.innerHeight, end: () => top() + holdPx() + W.innerHeight + 1, onEnter: ffNow }),
        ST.create({ start: () => top() - W.innerHeight, end: () => top(), onLeaveBack: reset })
      ];
      const hold = ST.create({ start: top, end: () => top() + holdPx() });
      const entry = { key: 'proc', st: hold }; HOLDS.push(entry);
      // arriving mid-page (a reload, a link): already past the lock, the room is simply there
      requestAnimationFrame(() => safe('process arrival', () => { const t = top() - W.scrollY; if (t < -(holdPx() + W.innerHeight)) { tl.progress(1); paint(); } else if (t < W.innerHeight * 0.05) play(); }));
      return () => { sts.forEach(s => s.kill()); hold.kill(); const i = HOLDS.indexOf(entry); if (i > -1) HOLDS.splice(i, 1); tl.kill(); cur = null; one(); paint(); };
    });
    /* short desktop: no hold; the film plays once as the room arrives */
    mm.add(SHORT, () => {
      zero(); relayout();
      const tl = cur = gsap.timeline({ paused: true, onUpdate: paint });
      tl.fromTo(S, { h: 0 }, { h: 1, duration: headDur, ease: 'none', immediateRender: false }, 0.02);
      film(tl, chIn(tl));
      const at = () => top() - W.innerHeight * 0.62;
      const st = ST.create({ start: at, end: () => at() + 1, onEnter: () => tl.play(), onLeave: () => { tl.progress(1); paint(); } });
      return () => { st.kill(); tl.kill(); cur = null; one(); paint(); };
    });
    /* phones: the room stacks; each beat plays as it reaches 82% of the screen */
    mm.add(STACK, () => {
      zero(); relayout();
      const made = [], tls = [];
      const head = gsap.timeline({ paused: true, onUpdate: paint }); head.fromTo(S, { h: 0 }, { h: 1, duration: headDur, ease: 'none', immediateRender: false }, 0); tls.push(head);
      const hAt = () => flowY(h2 || room) - W.innerHeight * 0.86;
      made.push(ST.create({ start: hAt, end: () => hAt() + 1, onEnter: s => { head.play(); s.kill(); }, onLeave: s => { head.progress(1); paint(); s.kill(); } }));
      let bt = null; const ch = (name, at, dur, ease) => chIn(bt)(name, at, dur, ease);
      // (two parts reaching the line together, as a quick scroll does, start 0.15 s apart: never a crowd)
      let nextAt = 0; const queue = tl => { const now = performance.now() / 1000, d = Math.max(0, nextAt - now); nextAt = Math.max(now, nextAt) + 0.15; if (d) gsap.delayedCall(d, () => { if (tl.progress() < 1) tl.play(); }); else tl.play(); };
      parts(ch).forEach(([el, build]) => {
        const tl = bt = gsap.timeline({ paused: true, onUpdate: paint }); build(); bt = null; tls.push(tl);
        const at = () => flowY(el) - W.innerHeight * 0.82;
        made.push(ST.create({ start: at, end: () => at() + 1, onEnter: s => { queue(tl); s.kill(); }, onLeave: s => { tl.progress(1); paint(); s.kill(); } }));
      });
      cur = { progress: () => Math.min.apply(null, tls.map(t => t.progress())) };
      addFF(room, () => tls.forEach(t => { if (t.progress() < 1) { t.progress(1); paint(); } }));
      return () => { made.forEach(s => s.kill()); tls.forEach(t => t.kill()); cur = null; one(); paint(); };
    });
    refresh();
  }

  /* ========================= 6 · the partnership room (av/av-k.js, K: the room's default) =========================
     The process room ends with the introduction; this room picks up the same company on its market of dots and shows
     what a partnership does to it. One vocabulary: the founder (the one gold point), a location (a small green square),
     another company (a ring; one that joins fills green and is joined by a line), the team (white points joined to the
     founder), shared systems (a fine dotted network), the territory (the fine green circle). The company is drawn twice:
     "Today" (still) and "With the right partner" (changing lever by lever, each change named on the drawing). The film
     (about 3.5 s, once the room locks; hold 0.45 screen): the market opens, the company arrives, then the five levers
     0.5 s apart. Phones: the drawings above the list; each lever as its item reaches 82% of the screen. Layout is
     illustrative and seeded, never data. */
  function avInit(live) {
    const room = R.av; if (!room || room.__gfxAv) return; room.__gfxAv = true;
    const LEVER = { growth: 'g', acquisitions: 'a', leadership: 'l', systems: 's', succession: 'u' };
    const R2D = Math.PI / 180;
    const LOC = [[60, 0.8], [100, 0.8], [180, 0.8], [260, 0.8], [300, 0.8]];   // its new locations: a horseshoe round the team
    const ACQ = [[204, 1.42], [150, 1.42], [52, 1.3]];
    const ACQ_PHONE = [[148, 1.3], [116, 1.36], [318, 1.3]];   // (phones: the two that join sit together below left)
    const JOIN = 2;
    const TEAM = [0, 140, 220];                                // the team around the founder; the first takes over
    const fig = $(O('avh-fig'), room), its = $$(O('avh-it'), room), n = its.length, draws = $$(O('avh-draw'), room);
    if (!fig || n < 2 || draws.length < 2 || !draws[0].querySelector('.ah-pt') || !draws[1].querySelector('.ah-pt')) return;
    const keyOf = li => (/\bis-([a-z]+)\b/.exec((li.getAttribute('data-o') || '').replace(/\bis-k\d+\b/g, '')) || [])[1];
    const lev = its.map(li => LEVER[keyOf(li)] || li.getAttribute('data-lv') || '');
    const lead = lev.indexOf('l') > -1, four = !lead;
    const ti = its.map(x => $(O('avh-ti'), x)), ps = its.map(x => $(O('avh-p'), x));
    const stacked = () => mq(STACK);

    /* the company and its market, laid out in one box (av-h.js plan) */
    const plan = o => {
      const R1 = o.R1, R0 = Math.max(16, R1 * 0.3), mx0 = o.box[0], my0 = o.box[1], mx1 = o.box[2], my1 = o.box[3];
      const nr = Math.max(3, Math.round((my1 - my0) / o.sp) + 1), sp = (my1 - my0) / (nr - 1);
      const rows = []; for (let i = 0; i < nr; i++) rows.push(Math.round(my0 + i * sp) + 0.5);
      const near = y => rows.reduce((b, r) => (Math.abs(r - y) < Math.abs(b - y) ? r : b), rows[0]);
      const cy = near(o.cy), cx = Math.round(o.cx) + 0.5;
      const at = (a, d) => [cx + Math.cos(a * R2D) * d, cy + Math.sin(a * R2D) * d];
      const off = y => { const r = near(y); if (r !== cy) return r; const i = rows.indexOf(r); return rows[y < cy ? Math.max(0, i - 1) : Math.min(nr - 1, i + 1)]; };
      const rt = clamp(R1 * 0.46, 28, 90), rc = clamp(R1 * 0.055, 5.5, 9), sq = R1 > 110 ? 7 : 6;
      const team = (o.lead ? TEAM : [0]).map(a => at(a, rt));
      const succ = team[0];
      const F = [cx, cy];
      // the founder's one location sits just under the founder; the new ones open across the widened territory
      const l0 = [cx, off(cy + clamp(R1 * 0.2, 16, 34))];
      const locs = [l0].concat(LOC.map(([a, f]) => { const p = at(a, f * R1); p[1] = off(p[1]); return p; }));
      const acq = (o.acqAt || ACQ).map(([a, f]) => { const p = at(a, f * R1 * (o.aq || 1)); p[1] = clamp(off(p[1]), my0 + rc + 3, my1 - rc - 3); p[0] = clamp(p[0], mx0 + rc + 4, mx1 - rc - 4); return p; });
      const d2 = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
      const cut = (p, q, a, b) => { const L = d2(p, q) || 1, ux = (q[0] - p[0]) / L, uy = (q[1] - p[1]) / L; return [p[0] + ux * a, p[1] + uy * a, q[0] - ux * b, q[1] - uy * b]; };
      const cross = (a, b) => { const o3 = (p, q, r) => Math.sign((q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0])); const A = [a[0], a[1]], B = [a[2], a[3]], C2 = [b[0], b[1]], Dd = [b[2], b[3]]; return o3(A, B, C2) !== o3(A, B, Dd) && o3(C2, Dd, A) !== o3(C2, Dd, B); };
      const segD = s => `M${f1(s[0])} ${f1(s[1])}L${f1(s[2])} ${f1(s[3])}`;
      const dseg = (s, p) => { const vx = s[2] - s[0], vy = s[3] - s[1], L2 = vx * vx + vy * vy || 1, t = clamp(((p[0] - s[0]) * vx + (p[1] - s[1]) * vy) / L2, 0, 1); return Math.hypot(s[0] + vx * t - p[0], s[1] + vy * t - p[1]); };
      // companies that join: a line from the company's nearest location to each (each at its own location)
      const joined = acq.slice(0, JOIN);
      const used = []; const reachFrom = joined.map(p => { const q = locs.filter(l => used.indexOf(l) < 0).reduce((b, qq) => (d2(qq, p) < d2(b, p) ? qq : b)); used.push(q); return q; });
      const reachS = joined.map((p, i) => cut(reachFrom[i], p, sq, rc + 3));
      // the team: each joined to the founder (no lines among them: the centre stays quiet)
      const spokeS = o.lead ? team.map(p => cut(F, p, 11, 6)) : [];
      // shared systems: the shortest network under the company's places, kept clear of the founder and the team
      const nodes = locs.slice();
      const cost = (i, j) => { const s = [nodes[i][0], nodes[i][1], nodes[j][0], nodes[j][1]]; let c = d2(nodes[i], nodes[j]);
        if (dseg(s, F) < Math.max(24, rt * 0.55)) c += 1e4; team.forEach(t => { if (dseg(s, t) < 14) c += 1e4; }); spokeS.forEach(k => { if (cross(s, k)) c += 1e4; }); return c; };
      const netE = [];
      { const inT = [0], left = nodes.map((_, i) => i).slice(1);
        while (left.length) { let best = null; inT.forEach(i => left.forEach(j => { const c = cost(i, j); if (!best || c < best[2]) best = [i, j, c]; })); netE.push([best[0], best[1]]); inT.push(best[1]); left.splice(left.indexOf(best[1]), 1); } }
      const netS = netE.map(([i, j]) => cut(nodes[i], nodes[j], sq, sq));
      const netR = Math.max.apply(null, nodes.map(p => d2(F, p))) + rc + 8;
      // the hand-off: the gold travels on an arc from the founder to the one who takes over; then the line runs on and
      // turns up at 38.2° into the arrow
      const rise = o.rise, run = rise / TAN, sy = succ[1], tipX = o.tip, xt = tipX - run, hs = Math.round(clamp(rise * 0.34, 7, 11));
      const hc = [(cx + succ[0]) / 2, Math.min(cy, succ[1]) - Math.max(18, d2(F, succ) * 0.55)];
      const ho = `M${f1(cx)} ${f1(cy)}Q${f1(hc[0])} ${f1(hc[1])} ${f1(succ[0])} ${f1(succ[1])}`;
      const ln = `M${f1(succ[0] + 9)} ${f1(sy)}H${f1(xt)}L${f1(tipX)} ${f1(sy - rise)}`;
      const hd = `M${f1(tipX - hs)} ${f1(sy - rise)}H${f1(tipX)}V${f1(sy - rise + hs)}`;
      // every line, as segments (for the words' placement)
      const arcS = []; for (let i = 0; i < 8; i++) { const Pq = t => { const w0 = (1 - t) * (1 - t), w1 = 2 * (1 - t) * t, w2 = t * t; return [w0 * cx + w1 * hc[0] + w2 * succ[0], w0 * cy + w1 * hc[1] + w2 * succ[1]]; }; const a = Pq(i / 8), b = Pq((i + 1) / 8); arcS.push([a[0], a[1], b[0], b[1]]); }
      const ring = r => { const s = []; for (let i = 0; i < 48; i++) { const a = at(i * 7.5, r), b = at((i + 1) * 7.5, r); s.push([a[0], a[1], b[0], b[1]]); } return s; };
      const lineS = reachS.concat(spokeS, netS, arcS, [[succ[0] + 9, sy, xt, sy], [xt, sy, tipX, sy - rise]], ring(R1));
      const lineS0 = ring(R0);
      // the market: ruled rows of other companies, kept clear of the company's own marks, the line, and the words
      const Rn = rnd(o.seed || 23), pts = [];
      const rects = (o.rects || []).map(r => [r[0] - 10, r[1] - 7, r[2] + 10, r[3] + 7]);
      const inRect = (x, y) => rects.some(r => x > r[0] && x < r[2] && y > r[1] && y < r[3]);
      const keep = (x, y) => !(d2([x, y], F) < rt + 14 || locs.some(p => d2(p, [x, y]) < 10) || acq.some(p => d2(p, [x, y]) < rc + 7) ||
        team.some(p => d2(p, [x, y]) < 10) || (Math.abs(y - sy) < 2 && x > succ[0] - 6 && x < xt + 6) || inRect(x, y) ||
        (o.clear || []).some(([y0, x0, x1]) => Math.abs(y - y0) < 2 && x > x0 && x < x1));
      rows.forEach(y => {
        const k = Math.round((mx1 - mx0) / o.dx * (0.75 + Rn() * 0.5)), xs = [];
        for (let j = 0; j < k; j++) xs.push(mx0 + 6 + Rn() * (mx1 - mx0 - 12));
        xs.sort((a, b) => a - b).forEach((x, j) => { if (j && x - xs[j - 1] < 7) return; if (keep(x, y)) pts.push(`M${f1(x)} ${y}h0`); });
      });
      // a row is broken where words sit on it, and round the founder and the team
      const quiet = rt + 12;
      const rowD = y => { const cuts = rects.filter(r => y > r[1] && y < r[3]).map(r => [r[0], r[2]]); if (Math.abs(y - cy) < quiet) { const dx = Math.sqrt(quiet * quiet - (y - cy) * (y - cy)); cuts.push([cx - dx, cx + dx]); } cuts.sort((a, b) => a[0] - b[0]); let x = mx0, d = '';
        cuts.forEach(([a, b]) => { if (a > x) d += `M${f1(x)} ${y}H${f1(a)}`; x = Math.max(x, b); }); if (x < mx1) d += `M${f1(x)} ${y}H${f1(mx1)}`; return d; };
      return { rows: rows.map(rowD).join(''), pts: pts.join(''), mx1, my1, cx, cy, R0, R1, rc, ra: rc, rt, sq, team, succ, locs, loc: locs.slice(1), acq, joined,
        feeds: reachFrom, reach: reachS.map(segD), tl: spokeS.map(segD).join(''), net: netS.map(segD).join(''), netR, ln, hd, ho, hc, tip: [tipX, sy - rise], xt, sy,
        nodes, netE, lineS, lineS0 };
    };
    /* write a plan into its drawing */
    const draw = (box, Wd, Hh, P) => {
      const q = c => $$('.' + c, box), one = c => $('.' + c, box);
      $$('svg', box).forEach(s => { s.setAttribute('width', f1(Wd)); s.setAttribute('height', f1(Hh)); s.setAttribute('viewBox', `0 0 ${f1(Wd)} ${f1(Hh)}`); });
      const pt = (el, p) => { if (!el) return; if (!p) { el.style.display = 'none'; return; } el.style.display = ''; el.setAttribute('cx', f1(p[0])); el.setAttribute('cy', f1(p[1])); };
      const sd = (c, d) => { const e = one(c); if (e) e.setAttribute('d', d); };
      sd('ah-rows', P.rows); sd('ah-pts', P.pts); sd('ah-net', P.net);
      const nc = one('ah-nc'); if (nc) { nc.setAttribute('cx', f1(P.cx)); nc.setAttribute('cy', f1(P.cy)); nc.dataset.r = f1(P.netR); }
      const ter = one('ah-ter'); if (ter) { pt(ter, [P.cx, P.cy]); ter.setAttribute('r', f1(P.R1)); }
      q('ah-ao').forEach((c, i) => { pt(c, P.acq[i]); c.setAttribute('r', f1(P.rc)); });
      q('ah-ad').forEach((c, i) => { pt(c, P.joined[i]); c.setAttribute('r', f1(P.rc + 0.75)); });
      q('ah-ar').forEach((p, i) => p.setAttribute('d', P.reach[i] || ''));
      sd('ah-tl', P.tl); sd('ah-ho', P.ho);
      q('ah-loc').forEach((r, i) => { const p = P.locs[i]; if (!p) { r.style.display = 'none'; return; } r.style.display = ''; r.setAttribute('x', f1(p[0] - P.sq / 2)); r.setAttribute('y', f1(p[1] - P.sq / 2)); r.setAttribute('width', P.sq); r.setAttribute('height', P.sq); });
      q('ah-tm').forEach((c, i) => pt(c, P.team[i]));
      pt(one('ah-fw'), [P.cx, P.cy]); pt(one('ah-pt'), [P.cx, P.cy]);
      sd('ah-ln', P.ln); sd('ah-hd', P.hd);
    };
    /* painting writes only what changed, from element lists found once */
    const ELS = new WeakMap(), MEMO = new WeakMap();
    const els = (box, sel) => { let m = ELS.get(box); if (!m) ELS.set(box, m = {}); return m[sel] || (m[sel] = $$(sel, box)); };
    const put = (el, k, val) => { if (!el) return; let m = MEMO.get(el); if (!m) MEMO.set(el, m = {}); if (m[k] !== val) { m[k] = val; el.style[k] = val; } };
    const putA = (el, k, val) => { if (!el) return; let m = MEMO.get(el); if (!m) MEMO.set(el, m = {}); if (m['@' + k] !== val) { m['@' + k] = val; el.setAttribute(k, val); } };
    const dashM = (p, v) => { v = c01(v); if (v >= 1) { put(p, 'strokeDasharray', ''); put(p, 'strokeDashoffset', ''); put(p, 'opacity', ''); return; } put(p, 'strokeDasharray', '1 2'); put(p, 'strokeDashoffset', (1 - v).toFixed(4)); put(p, 'opacity', v <= 0 ? '0' : ''); };
    const popM = (el, v) => { v = c01(v); put(el, 'opacity', v >= 1 ? '' : v.toFixed(3)); put(el, 'transform', v >= 1 ? '' : 'scale(' + (0.4 + 0.6 * v).toFixed(3) + ')'); };
    const fadeM = (el, v, y) => { v = c01(v); put(el, 'opacity', v >= 1 ? '' : v.toFixed(3)); put(el, 'transform', v >= 1 ? '' : 'translateY(' + ((1 - v) * y).toFixed(1) + 'px)'); };
    // the list's painters (the kit's): a name rising through its mask; words settling
    const kRise = (el, v) => { if (!el) return; v = c01(v); el.style.transform = v >= 1 ? '' : `translateY(${f1((1 - v) * G.headline.yPercent)}%)`; };
    const kFade = (el, v) => { if (!el) return; v = c01(v); el.style.opacity = v >= 1 ? '' : v.toFixed(3); el.style.transform = v >= 1 ? '' : `translateY(${f1((1 - v) * G.body.y)}px)`; };
    /* paint one drawing from its channels (v: name -> 0…1) */
    const paintScene = (box, P, v) => {
      if (!P) return;
      const Dr = G.DRAW, q = c => els(box, '.' + c), one = c => els(box, '.' + c)[0];
      const win = (x, a, w) => c01((x - a) / w);
      // the market sweeps in left to right (its own layer; two opposite slides, transforms only)
      const m = c01(v('m')), sl = ((1 - m) * 100).toFixed(2);
      put(els(box, O('ah-mkw'))[0], 'transform', m >= 1 ? '' : 'translateX(-' + sl + '%)'); put(els(box, O('ah-mki'))[0], 'transform', m >= 1 ? '' : 'translateX(' + sl + '%)');
      const c = c01(v('c'));
      // today: the founder, the one location, its small territory, the other companies nearby
      const locs = q('ah-loc');
      popM(locs[0], c * 1.5);
      q('ah-ao').forEach((el, i) => { const o = c01(c * 1.5 - 0.2 - i * 0.1); put(el, 'opacity', o >= 1 ? '' : o.toFixed(3)); });
      const ter = one('ah-ter'), g = c01(v('g')), s0 = P.R0 / P.R1, sc = s0 + (1 - s0) * g;
      dashM(ter, c); put(ter, 'transform', sc >= 1 ? '' : `scale(${sc.toFixed(4)})`);
      // growth: the territory widens and the new locations open in it
      const gl = c01(v('gl')) * 0.8;
      locs.slice(1).forEach((el, i) => popM(el, expo(win(gl, i * 0.1, 0.4))));
      // joined: the line reaches, the ring fills green
      const a = c01(v('a'));
      q('ah-ar').forEach((el, i) => dashM(el, Dr(win(a, i * 0.18, 0.5))));
      q('ah-ad').forEach((el, i) => popM(el, expo(win(a, i * 0.18 + 0.42, 0.4))));
      // leadership: the team forms around the founder, each joined to the founder
      const l = c01(v('l')) * 0.9, u = c01(v('u'));
      q('ah-tm').forEach((el, i) => popM(el, four ? expo(win(u, 0, 0.3)) : expo(win(l, i * 0.1, 0.4))));
      dashM(one('ah-tl'), Dr(win(l, 0.2, 0.7)));
      // systems: the network spreads out under the company's places
      const s = c01(v('s')), nc = one('ah-nc'); if (nc) putA(nc, 'r', s >= 1 ? '9999' : f1((+nc.dataset.r || 0) * Dr(s)));
      // succession: the gold travels on its arc to the one who takes over; the founder stays on, now one of the team
      const mv = Dr(win(u, four ? 0.25 : 0, four ? 0.75 : 1)), w0 = (1 - mv) * (1 - mv), w1 = 2 * (1 - mv) * mv, w2 = mv * mv;
      const bx = w0 * P.cx + w1 * P.hc[0] + w2 * P.succ[0] - P.cx, by = w0 * P.cy + w1 * P.hc[1] + w2 * P.succ[1] - P.cy;
      const gp = one('ah-pt'); if (c * 1.6 < 1 || mv <= 0) popM(gp, c * 1.6); else { put(gp, 'opacity', ''); put(gp, 'transform', `translate(${f1(bx)}px, ${f1(by)}px)`); }
      dashM(one('ah-ho'), mv); popM(one('ah-fw'), expo(win(mv, 0.3, 0.5)));
      dashM(one('ah-ln'), v('ln')); dashM(one('ah-hd'), v('hd'));
    };

    /* the row and the drawing, linked both ways: the item that lights lights its own marks and words in the drawing and
       the rest rest (CSS: a 0.35 s settle). During the film the lit item is the change in progress; once settled, the item
       under the pointer or the keyboard (each item can take focus). */
    let hover = '', filmFocus = '', shownF = null;
    const applyFocus = () => { const f = filmFocus || hover; if (f === shownF) return; shownF = f; if (f) fig.setAttribute('data-focus', f); else fig.removeAttribute('data-focus'); };
    its.forEach((li, k) => {
      if (!lev[k]) return; li.setAttribute('data-lv', lev[k]); li.tabIndex = 0;
      const on = () => { hover = lev[k]; applyFocus(); }, off = () => { if (hover === lev[k]) { hover = ''; applyFocus(); } };
      li.addEventListener('mouseenter', on); li.addEventListener('mouseleave', off); li.addEventListener('focus', on); li.addEventListener('blur', off);
    });
    const S = {}, names = ['m', 'c', 'g', 'gl', 'a', 'l', 's', 'u', 'ln', 'hd', 'z'];
    for (let k = 0; k < n; k++) names.push('t' + k, 'p' + k, 'r' + k);
    const plans = [];

    /* ---- the layout: the words on the drawing, in the homepage map's idiom: each beside the mark it names, never on a
       mark, a line or another word; a short hairline when it has to stand off. Returns their boxes (the market keeps
       clear of them). ---- */
    const sizeOf = el => { const r = el.getBoundingClientRect(); return [r.width, r.height]; };
    const base = (Wd, Hh, extra) => Object.assign({ sp: Hh > 300 ? 22 : 17, dx: Hh > 300 ? 21 : 16, lead, seed: 23, rise: clamp(Hh * 0.08, 18, 34) }, extra);
    const notesOf = box => $$(O('avh-note'), box);
    const placeNotes = (box, P, Wd, Hh, today, pre) => {
      const C = [[P.cx, P.cy, 9]].concat(P.locs.map(p => [p[0], p[1], P.sq]), P.acq.map(p => [p[0], p[1], P.rc + 2]));
      if (!today) { C.push([P.succ[0], P.succ[1], 9]); P.team.forEach(p => C.push([p[0], p[1], 6])); }
      const segs = today ? [] : P.lineS.slice(0, -48), ring = today ? P.lineS0 : P.lineS.slice(-48), placed = (pre || []).slice(), out = (pre || []).slice();
      const hits = (x0, y0, x1, y1) => { let k = 0; const pad = 4;
        C.forEach(([x, y, r]) => { if (x > x0 - r - pad && x < x1 + r + pad && y > y0 - r - pad && y < y1 + r + pad) k++; });
        const on = s => { const L = Math.hypot(s[2] - s[0], s[3] - s[1]), kk = Math.max(1, Math.ceil(L / 4)); for (let i = 0; i <= kk; i++) { const x = s[0] + (s[2] - s[0]) * i / kk, y = s[1] + (s[3] - s[1]) * i / kk; if (x > x0 - pad && x < x1 + pad && y > y0 - pad && y < y1 + pad) return true; } return false; };
        segs.forEach(s => { if (on(s)) k++; }); if (ring.some(on)) k++;   // (the territory counts once)
        placed.forEach(q => { if (x0 < q[2] + 10 && q[0] < x1 + 10 && y0 < q[3] + 6 && q[1] < y1 + 6) k += 50; else if (x0 < q[2] + 36 && q[0] < x1 + 36 && y0 < q[3] + 18 && q[1] < y1 + 18) k += 0.3; });
        if (x0 < 2 || y0 < 2 || x1 > Wd - 2 || y1 > Hh - 2) k += 20; return k; };
      // a hairline that would cross another line or mark on its way to the words costs too
      const X = (a, b) => { const o3 = (p, q, s) => Math.sign((q[0] - p[0]) * (s[1] - p[1]) - (q[1] - p[1]) * (s[0] - p[0])); return o3([a[0], a[1]], [a[2], a[3]], [b[0], b[1]]) !== o3([a[0], a[1]], [a[2], a[3]], [b[2], b[3]]) && o3([b[0], b[1]], [b[2], b[3]], [a[0], a[1]]) !== o3([b[0], b[1]], [b[2], b[3]], [a[2], a[3]]); };
      const leadCost = (A, r, x0, y0, w, h) => { const tx = clamp(A[0], x0, x0 + w), ty = clamp(A[1], y0, y0 + h), L = Math.hypot(tx - A[0], ty - A[1]); if (L <= r + 12) return 0;
        const s = [A[0] + (tx - A[0]) / L * (r + 3), A[1] + (ty - A[1]) / L * (r + 3), tx, ty]; let k = 0;
        segs.forEach(q => { if (Math.hypot(q[0] - A[0], q[1] - A[1]) > r + 6 && Math.hypot(q[2] - A[0], q[3] - A[1]) > r + 6 && X(s, q)) k++; });
        C.forEach(([x, y, rr]) => { if (Math.hypot(x - A[0], y - A[1]) > 2) { const vx = s[2] - s[0], vy = s[3] - s[1], t = clamp(((x - s[0]) * vx + (y - s[1]) * vy) / (vx * vx + vy * vy || 1), 0, 1); if (Math.hypot(s[0] + vx * t - x, s[1] + vy * t - y) < rr + 2) k++; } }); return k; };
      const netMids = () => { const m = P.netE.map(([i, j]) => [(P.nodes[i][0] + P.nodes[j][0]) / 2, (P.nodes[i][1] + P.nodes[j][1]) / 2]); return m.length ? m.sort((a, b) => b[1] - a[1]) : [[P.cx, P.cy + P.R1 * 0.7]]; };
      const spec = {
        founder: [[[P.cx, P.cy]], 7, ['r', 'ur', 'dr', 'u', 'l']],
        location: [[P.locs[0]], 5, ['l', 'dl', 'r', 'dr', 'd']],
        rivals: [P.acq, P.rc + 2, ['r', 'u', 'ur', 'l', 'ul']],
        g: [P.locs.slice(1).filter(p => P.feeds.indexOf(p) < 0).sort((p, q) => p[1] - q[1]), 5, ['u', 'ur', 'ul', 'r', 'l', 'd']],
        a: [[P.joined.reduce((s, p) => [s[0] + p[0] / P.joined.length, s[1] + p[1] / P.joined.length], [0, 0])], 0, ['l', 'ul', 'dl', 'u', 'd'], P.joined],   // (one word, a hairline to each)
        l: [P.team.length > 2 ? [P.team[2], P.team[1]] : [P.team[0]], 5, ['ul', 'u', 'l', 'dl']],
        s: [netMids(), 3, ['d', 'dl', 'dr', 'l', 'r']],
        u: [[P.succ], 9, ['ur', 'u', 'dr', 'r']]
      };
      const lds = $$('.ah-nl', box); lds.forEach(p => p.setAttribute('d', ''));
      const U = { r: [1, 0], l: [-1, 0], u: [0, -1], d: [0, 1], ur: [0.72, -0.72], ul: [-0.72, -0.72], dr: [0.72, 0.72], dl: [-0.72, 0.72] };
      // (the centre first: the team and the hand-off have the fewest good places; then the rest round them)
      const ORDER = ['u', 'l', 'founder', 'location', 'a', 'g', 'rivals', 's'];
      notesOf(box).map((el, k) => [el, k]).sort((x, y) => ORDER.indexOf(x[0].getAttribute('data-n')) - ORDER.indexOf(y[0].getAttribute('data-n'))).forEach(([el, k]) => {
        const sp = spec[el.getAttribute('data-n')]; if (!sp) return; const As = sp[0], r = sp[1], dirs = sp[2], T = sp[3], w = el.offsetWidth, h = el.offsetHeight; let A = As[0];
        const reach = (t, x0, y0) => Math.hypot(clamp(t[0], x0, x0 + w) - t[0], clamp(t[1], y0, y0 + h) - t[1]);
        const lcost = (x0, y0) => (T ? T.reduce((s, t) => s + leadCost(t, P.rc + 2, x0, y0, w, h) + (reach(t, x0, y0) > 80 ? 1 : 0), 0) : leadCost(A, r, x0, y0, w, h));
        let best = null;
        const all = dirs.concat(Object.keys(U).filter(d => dirs.indexOf(d) < 0));   // (preferred sides first, then any side)
        // (nearest first; each side also tried slid along its edge; a clear place always beats a near one)
        As.filter(Boolean).forEach((AA, ai) => { A = AA; (T ? [36, 48, 60, 76, 96, 120] : [8, 16, 24, 34, 44, 56, 68, 82, 96, 112, 128, 148]).forEach(gap => all.forEach(dn => [0, -0.35, 0.35, -0.7, 0.7].forEach(sl => {
          const ux = U[dn][0], uy = U[dn][1], ex = A[0] + ux * (r + gap), ey = A[1] + uy * (r + gap);
          const sx = Math.abs(uy) > 0.9 ? sl * w : 0, sy2 = Math.abs(ux) > 0.9 ? sl * h * 1.6 : 0;
          // (always inside the drawing: a word that would run off the edge slides back in, and its hairline finds it)
          const x0 = clamp((ux > 0.1 ? ex : ux < -0.1 ? ex - w : ex - w / 2) + sx, 2, Wd - 2 - w), y0 = clamp((uy > 0.1 ? ey : uy < -0.1 ? ey - h : ey - h / 2) + sy2, 2, Hh - 2 - h);
          // (a map's words sit outside the territory, in the open, so the marks inside stay legible)
          const inside = !today && Math.hypot(x0 + w / 2 - P.cx, y0 + h / 2 - P.cy) < P.R1 ? 350 : 0;
          const nh = hits(x0, y0, x0 + w, y0 + h), sc = nh * 1000 + lcost(x0, y0) * 400 + inside + gap + all.indexOf(dn) * 3 + Math.abs(sl) * 12;
          if (!best || sc + ai * 6 < best.sc) best = { sc: sc + ai * 6, nh, x0, y0, A: AA };
        }))); });
        if (!best) return;
        A = best.A;
        const x0 = best.x0, y0 = best.y0; placed.push([x0, y0, x0 + w, y0 + h]); out.push([x0, y0, x0 + w, y0 + h]);
        el.style.left = f1(x0) + 'px'; el.style.top = f1(y0) + 'px'; el.setAttribute('data-hits', best.nh);
        // a hairline when the words stand off from the mark
        let d = '';
        (T || [A]).forEach(t => { const rr = T ? P.rc + 2 : r; if (reach(t, x0, y0) <= rr + 12) return;
          const side = T ? (A[0] > x0 + w ? 'r' : A[0] < x0 ? 'l' : A[1] < y0 ? 't' : 'b') : null;
          const tx = side === 'r' ? x0 + w + 4 : side === 'l' ? x0 - 4 : side ? clamp(A[0], x0 + 10, x0 + w - 10) : clamp(t[0], x0, x0 + w);
          const ty = side === 'r' || side === 'l' ? y0 + h * 0.5 : side === 't' ? y0 - 3 : side === 'b' ? y0 + h + 3 : t[1] < y0 ? y0 : t[1] > y0 + h ? y0 + h : y0 + h * 0.5, L = Math.hypot(tx - t[0], ty - t[1]) || 1;
          const sx = t[0] + (tx - t[0]) / L * (rr + 3), sy = t[1] + (ty - t[1]) / L * (rr + 3), exx = tx - (tx - t[0]) / L * 5, eyy = ty - (ty - t[1]) / L * 5;
          d += `M${f1(sx)} ${f1(sy)}L${f1(exx)} ${f1(eyy)}`; });
        if (lds[k]) { lds[k].setAttribute('d', d); lds[k].setAttribute('data-lv', el.getAttribute('data-n')); }
      });
      return out;
    };
    let lastK = '';
    const layout = () => {
      const st = stacked();
      const sz0 = sizeOf(draws[0]), sz1 = sizeOf(draws[1]), Wt = sz0[0], Ht = sz0[1], Wn = sz1[0], Hn = sz1[1];
      if (!Wt || !Wn) return;
      // (the same boxes and the same words: nothing to place again, e.g. a phone's address bar resizing the view)
      const memo = [Wt, Ht, Wn, Hn].map(Math.round).join() + '|' + draws.map(d => notesOf(d).map(e => e.offsetWidth).join()).join('|');
      if (memo === lastK && plans[0] && plans[1]) return;
      lastK = memo;
      const R1 = Math.min(Hn * 0.36, Wn * (st ? 0.28 : 0.24));
      const pn = base(Wn, Hn, { acqAt: st ? ACQ_PHONE : null, cx: Wn * (st ? 0.46 : 0.45), cy: Hn * 0.5, R1, box: [0, Math.round(Hn * 0.04), Wn - 4, Math.round(Hn * 0.96)], tip: Wn - 2 });
      const cxT = Wt * (st ? 0.4 : 0.5), aqT = Math.min(1, (Math.min(cxT, Wt - cxT) - 12) / (R1 * 1.34), (Ht / 2 - 16) / (R1 * 1.3 * 0.8));   // (the other companies stay inside a short pane)
      const ptd = base(Wt, Ht, { acqAt: st ? ACQ_PHONE : null, cx: cxT, cy: Ht * 0.5, R1, aq: aqT, box: [0, Math.round(Ht * 0.04), Wt, Math.round(Ht * 0.96)], tip: Wt - 2, seed: 41 });
      [[ptd, Wt, Ht, 0], [pn, Wn, Hn, 1]].forEach(([o, Wd, Hh, k]) => {
        // (phones: the caption sits on the drawing's top left; the words and the market keep clear of it)
        const cap = draws[k].parentElement.querySelector(O('avh-cap')), pre = [];
        if (cap && getComputedStyle(cap).position === 'absolute') { const a = cap.getBoundingClientRect(), d = draws[k].getBoundingClientRect(); pre.push([a.left - d.left, a.top - d.top, a.right - d.left, a.bottom - d.top]); }
        const P = plan(o), rects = placeNotes(draws[k], P, Wd, Hh, k === 0, pre);
        o.rects = rects; plans[k] = plan(o); draw(draws[k], Wd, Hh, plans[k]);
      });
    };
    /* ---- paint ---- */
    const paint = () => {
      const v = c => nv(S[c], 1);
      const still = c => ((c === 'm' || c === 'c') ? v(c) : 0);
      paintScene(draws[0], plans[0], still); paintScene(draws[1], plans[1], v);
      const win = (x, a, w) => c01((x - a) / w), Dr = G.DRAW;
      const at = { founder: win(v('c'), 0.45, 0.55), location: win(v('c'), 0.55, 0.45), rivals: win(v('c'), 0.65, 0.35),
        g: win(v('gl'), 0.3, 0.6), a: win(v('a'), 0.55, 0.45), l: win(v('l'), 0.45, 0.55), s: win(v('s'), 0.45, 0.55), u: win(v('u'), 0.6, 0.4) };
      draws.forEach(bx => { const lds = els(bx, '.ah-nl'); els(bx, O('avh-note')).forEach((el, k) => { const t = nv(at[el.getAttribute('data-n')], 1); fadeM(el, expo(t), 6); if (lds[k]) dashM(lds[k], Dr(t)); }); });
      let lit = '';
      for (let k = 0; k < n; k++) {
        kRise(ti[k], S['t' + k]); kFade(ps[k], S['p' + k]);
        if (!stacked()) { const nx = k < n - 1 ? c01(nv(S['t' + (k + 1)], 1) * 2.5) : 0, o = 1 - 0.6 * nx * (1 - c01(nv(S.z, 1))); its[k].style.opacity = o >= 0.999 ? '' : o.toFixed(3); } else its[k].style.opacity = '';
        // (the film's lit lever: desktop, the latest item begun until the close; phones, the item whose change is playing)
        const tk = nv(S['t' + k], 1); if (lev[k] && tk > 0 && (stacked() ? tk < 1 : c01(nv(S.z, 1)) < 1)) lit = lev[k];
        const r = c01(nv(S['r' + k], 1));
        its[k].style.setProperty('--avh-rl', r >= 1 ? '' : r.toFixed(4));
      }
      if (lit !== filmFocus) { filmFocus = lit; applyFocus(); }
    };
    /* ---- the film (about 3.5 s): the market, your company, then each lever 0.5 s apart with its words ---- */
    const lever = (ch, L, b) => {
      const Dr = G.DRAW, E = G.SETTLE, A = G.arrow.duration;
      if (L === 'g') { ch('g', b + 0.1, 0.8, E); ch('gl', b + 0.4, 0.8, 'none'); }
      if (L === 'a') ch('a', b + 0.1, 1.0, 'none');
      if (L === 'l') ch('l', b + 0.1, 0.9, 'none');
      if (L === 's') ch('s', b + 0.1, 0.85, Dr);
      if (L === 'u') { ch('u', b + 0.1, 0.75, 'none'); ch('ln', b + 0.6, 0.45, Dr); ch('hd', b + 0.9, A, E); }
    };
    // (phones: a part's starts fall 0.1 s apart, so two parts arriving together, 0.24 s apart, never crowd)
    const words = (ch, k, b, phone) => { ch('t' + k, b, G.headline.duration, G.SETTLE); ch('p' + k, b + (phone ? 0.2 : 0.15), G.body.duration, G.SETTLE); ch('r' + k, b + 0.3, G.hairline.duration * 0.55, G.DRAW); };
    const film = ch => {
      const STEP = n > 4 ? 0.5 : 0.62, B0 = 0.5;
      ch('m', 0, 0.6, G.DRAW); ch('c', 0.2, 0.55, G.SETTLE);
      for (let k = 0; k < n; k++) { const b = B0 + STEP * k; words(ch, k, b); if (lev[k]) lever(ch, lev[k], b); }
      // (a list without the succession item still ends on the arrow)
      if (lev.indexOf('u') < 0) { ch('ln', B0 + STEP * n, 0.45, G.DRAW); ch('hd', B0 + 0.3 + STEP * n, G.arrow.duration, G.SETTLE); }
      // (the film's close: the items that rested while another lit come back to full, together)
      ch('z', B0 + STEP * (n - 1) + 1.0, 0.6, G.SETTLE);
    };
    /* phones: the drawing as it arrives; each item's lever as the item reaches 82% of the screen */
    const parts = () => [[$(O('avh-pair'), room) || draws[0], ch => { ch('m', 0, 0.6, G.DRAW); ch('c', 0.2, 0.55, G.SETTLE); }]]
      .concat(its.map((li, k) => [li, ch => { words(ch, k, 0, true); if (lev[k]) lever(ch, lev[k], 0);
        if (k === n - 1 && lev.indexOf('u') < 0) { ch('ln', 0.6, 0.55, G.DRAW); ch('hd', 1.0, G.arrow.duration, G.SETTLE); } }]));

    /* ---- the core (av-k.js run): one film, played once the room locks (the same lock as the process room) ---- */
    const one = () => names.forEach(c => { S[c] = 1; }), zero = () => names.forEach(c => { S[c] = 0; });
    const relayout = () => { safe('partnership layout', layout); paint(); };
    one(); relayout();
    let rz = 0; W.addEventListener('resize', () => { cancelAnimationFrame(rz); rz = requestAnimationFrame(() => { lastK = ''; relayout(); }); });
    if (D.fonts && D.fonts.ready) D.fonts.ready.then(() => { lastK = ''; relayout(); });
    if (!live) return;
    ST.addEventListener('refresh', () => requestAnimationFrame(relayout));
    const trk = $(O('av-track'), room) || room;
    const holdPx = () => Math.max(1, trk.offsetHeight - W.innerHeight);
    const top = () => flowY(room);
    const chIn = tl => (name, at, dur, ease) => tl.fromTo(S, { [name]: 0 }, { [name]: 1, duration: dur, ease: ease || G.SETTLE, immediateRender: false }, at);
    let cur = null;
    track('partnership film', () => cur);
    const mm = gsap.matchMedia();
    /* held desktop: the lock */
    mm.add(HOLDQ, () => {
      if (!held()) { one(); paint(); return undefined; }
      zero(); relayout();
      const tl = cur = gsap.timeline({ paused: true, onUpdate: paint });
      film(chIn(tl));
      let ffTw = null;
      const play = () => { if (tl.progress() < 1 && !tl.isActive() && !(ffTw && ffTw.isActive())) tl.play(); };
      const ff = () => { if (tl.progress() >= 1) return; tl.pause(); ffTw = gsap.to(tl, { progress: 1, duration: G.fastForward, ease: 'power1.out', onUpdate: paint }); };
      const reset = () => { if (ffTw) ffTw.kill(); ffTw = null; tl.pause(0); zero(); paint(); };
      room.__gfxFF = ff;   // the joins: the next room has covered it
      const sts = [
        ST.create({ start: () => top() - W.innerHeight * 0.05, end: () => top(), onEnter: play }),
        // covered by a third, a film still playing settles in 0.3 s
        ST.create({ start: () => top() + holdPx() + Math.round(W.innerHeight * 0.33), end: () => top() + holdPx() + Math.round(W.innerHeight * 0.33) + 1, onEnter: ff }),
        ST.create({ start: () => top() - W.innerHeight, end: () => top(), onLeaveBack: reset })
      ];
      const hold = ST.create({ start: top, end: () => top() + holdPx() });
      const entry = { key: 'av', st: hold }; HOLDS.push(entry);
      requestAnimationFrame(() => safe('partnership arrival', () => { const t = top() - W.scrollY; if (t < -(holdPx() + W.innerHeight * 0.33)) { tl.progress(1); paint(); } else if (t < W.innerHeight * 0.05) play(); }));
      return () => { sts.forEach(s => s.kill()); hold.kill(); const i = HOLDS.indexOf(entry); if (i > -1) HOLDS.splice(i, 1); if (ffTw) ffTw.kill(); tl.kill(); cur = null; room.__gfxFF = null; one(); paint(); };
    });
    /* short desktop: no hold; the film plays once as the room arrives */
    mm.add(SHORT, () => {
      zero(); relayout();
      const tl = cur = gsap.timeline({ paused: true, onUpdate: paint });
      film(chIn(tl));
      room.__gfxFF = () => { if (tl.progress() < 1) { tl.progress(1); paint(); } };
      const at = () => top() - W.innerHeight * 0.62;
      const st = ST.create({ start: at, end: () => at() + 1, onEnter: () => tl.play(), onLeave: () => { tl.progress(1); paint(); } });
      return () => { st.kill(); tl.kill(); cur = null; room.__gfxFF = null; one(); paint(); };
    });
    /* phones: the room stacks; each part plays as it reaches 82% of the screen */
    mm.add(STACK, () => {
      zero(); relayout();
      const made = [], tls = [];
      // (two parts reaching the line together, as a quick scroll does, start 0.24 s apart: never a crowd)
      let nextAt = 0;
      const queue = tl => { const now = performance.now() / 1000, d = Math.max(0, nextAt - now); nextAt = Math.max(now, nextAt) + 0.24; if (d) gsap.delayedCall(d, () => { if (tl.progress() < 1) tl.play(); }); else tl.play(); };
      parts().forEach(([el, build]) => {
        const tl = gsap.timeline({ paused: true, onUpdate: paint }); build(chIn(tl)); tls.push(tl);
        const at = () => flowY(el) - W.innerHeight * 0.82;
        made.push(ST.create({ start: at, end: () => at() + 1, onEnter: s => { queue(tl); s.kill(); }, onLeave: s => { tl.progress(1); paint(); s.kill(); } }));
      });
      cur = { progress: () => Math.min.apply(null, tls.map(t => t.progress())) };
      room.__gfxFF = () => tls.forEach(t => { if (t.progress() < 1) { t.progress(1); paint(); } });
      return () => { made.forEach(s => s.kill()); tls.forEach(t => t.kill()); cur = null; room.__gfxFF = null; one(); paint(); };
    });
    refresh();
  }

  /* ========================= 7 · retained ownership: the second bite (ret-v, 1.0.2) =========================
     The final room (prototype/owners/ret/ret-v.js; PORT-retained-v.md): section[data-o~="ow-retv-v"]#gfx-ow-retained
     ("gfx Owners retained" in the Navigator). The headline carries no mark (data-mark=""): the room's one arrow is the
     stake's, an Embed svg.rv-arw (.rv-a1 the line, .rv-a2 the head) between $3M and $13.4M. The figures are aria-hidden;
     each set has a screen-reader sentence ([data-o~=ow-sr]). Its CSS is the page's "gfx Owners v2 styles 2" Embed.
     ORDER (gf-grammar): the house head as the headline reaches 82% (lines rise, the paragraph +0.2, the hairline +0.45);
     then the film, at the lock on a held desktop or as the formula reaches 80% (phones, short desktops):
       0 / 0.85      each row: its caption, then $2.5M / 6.0 / $15M (and $8M / 9.0 / $72M) roll left to right, "earnings",
                     × and = settling between them (a row's six parts start 0.12 s or more apart)
       1.75          the arrow's line draws (Draw curve) as $3M rolls (+0.15), its words (+0.35)
       3.10 / 3.05   the arrow's head lands as $13.4M rolls, its words (+0.2)
       3.75 / 4.00   the total, then the note; the film ends at about 4.9 s
     Never more than two starts in any 100 ms. Scrolled past mid-film: the film jumps to its end (addFF). Reduced motion, no
     GSAP, no JavaScript: nothing runs; the room as built is the final frame (every word shown, the arrow drawn).
     Dwell: the room holds G.hold.short (0.5 screen) before the questions arrive; data-gfx-dwell="<screens>" on the section
     chooses another (0 for none). A section that still has data-placeholder plays nothing.
     THE HOOK stays: a page script that defines window.gfxOwnersRetained = function (room, ctx) {...} before the rooms start,
     or calls window.gfxOwners.retained(fn), replaces retainedV. ctx (retainedCtx): live, room, gsap, ScrollTrigger, G, O,
     $, $$, held(), flowY(el), addFF(room, fn), filmAt(room, el, build), roomHead(room, opts), makeMark/drawMark/markDone,
     ffTl, refresh(), hold(key, st), track(name, getTl), HOLDQ/FLATQ/STACK/SHORT, TAN. */
  let retainedDone = false;
  const retainedCtx = live => ({
    live, room: R.ret, gsap, ScrollTrigger: ST, G, O, $, $$, held, flowY, addFF, filmAt, roomHead, makeMark, drawMark, markDone, ffTl, refresh,
    hold: (key, st) => { HOLDS.push({ key, st }); }, track, HOLDQ, FLATQ, STACK, SHORT, TAN
  });
  // the odometer (owners.js odo): each digit a reel; one tween per figure (one clock); the figures' containers are
  // aria-hidden, so no spoken copy is added
  const retOdo = b => {
    const val = b.getAttribute('data-final') || b.textContent.trim(); b.setAttribute('data-final', val); b.textContent = '';
    const reels = []; let k = 0;
    for (let c = 0; c < val.length; c++) {
      const ch = val[c];
      if (!/\d/.test(ch)) { b.appendChild(D.createTextNode(ch)); continue; }
      const d = +ch, n = 4 + k, seq = []; for (let j = n; j >= 1; j--) seq.push((d - j + 100) % 10);
      const mask = D.createElement('gfx-odo'), reel = D.createElement('gfx-reel');
      reel.textContent = ch; reel.setAttribute('data-seq', seq.join('\n')); mask.appendChild(reel); b.appendChild(mask);
      reels.push([reel, n, k]); k++;
    }
    reels.forEach(r => gsap.set(r[0], { yPercent: r[1] * 100 }));
    gsap.set(b, { opacity: 0 });
    const settleE = gsap.parseEase(G.SETTLE), setY = reels.map(r => gsap.quickSetter(r[0], 'yPercent'));
    return (tl, at) => {
      tl.set(b, { opacity: 1 }, at); if (!reels.length) return;
      const last = reels.length - 1, T = G.figure.duration, total = last * 0.07 + T + last * 0.1, clock = { t: 0 };
      tl.fromTo(clock, { t: 0 }, { t: total, duration: total, ease: 'none', immediateRender: false, onUpdate: () => {
        reels.forEach((r, i) => { const s = Math.min(1, Math.max(0, (clock.t - r[2] * 0.07) / (T + r[2] * 0.1))); setY[i](r[1] * 100 * (1 - settleE(s))); });
      } }, at);
    };
  };
  function retainedV(room, ctx) {
    if (!room || !ctx || !ctx.live || !gsap) return;                       // the settled room, as built
    // the house head: headline lines rise, the paragraph, the rule (no mark: data-mark is empty)
    const hd = roomHead(room, { rule: $(O('ow-rule'), room) });
    if (hd) track('gfx-ow-retained head', hd.tl);
    const eq = $(O('rv-eq'), room), a1 = $('.rv-a1', room), a2 = $('.rv-a2', room);
    if (!eq || !a1 || !a2) return;
    const caps = $$(O('rv-cap'), room), vals = $$(O('rv-v'), room);
    const wds = $$(O('rv-w') + ',' + O('rv-op'), eq);                       // per row: earnings, ×, = (document order)
    const pv = $$(O('rv-pv'), room), keys = $$(O('rv-k'), room), tot = $(O('rv-tot'), room), note = $(O('rv-note'), room);
    if (vals.length !== 6 || wds.length !== 6 || pv.length !== 2 || caps.length !== 2) return;
    const rollV = vals.map(retOdo), rollP = pv.map(retOdo);
    gsap.set([a1, a2], { strokeDasharray: 1, strokeDashoffset: 1 });
    gset(caps.concat(wds, keys, [tot, note]), { opacity: 0, y: G.detail.y });
    const settle = (tl, els, at) => { const a = list(els); if (a.length) tl.to(a, { opacity: 1, y: 0, duration: G.detail.duration, stagger: G.detail.stagger, ease: G.SETTLE }, at); };
    const f = filmAt(room, eq, tl => {
      // each row: its caption, then its three figures left to right, "earnings" and the operators settling between them
      [0, 1].forEach(r => {
        const t = r * 0.85;
        settle(tl, caps[r], t);
        rollV[r * 3](tl, t + 0.12); settle(tl, wds[r * 3], t + 0.3);
        settle(tl, wds[r * 3 + 1], t + 0.42); rollV[r * 3 + 1](tl, t + 0.5);
        settle(tl, wds[r * 3 + 2], t + 0.62); rollV[r * 3 + 2](tl, t + 0.7);
      });
      // the stake: the arrow's line (Draw curve) leaves $3M as it lands; its head lands as $13.4M rolls
      const s = 1.75;
      tl.to(a1, { strokeDashoffset: 0, autoRound: false, duration: G.hairline.duration, ease: G.DRAW, clearProps: 'strokeDasharray,strokeDashoffset' }, s);
      rollP[0](tl, s + 0.15); settle(tl, keys[0], s + 0.35);
      tl.to(a2, { strokeDashoffset: 0, autoRound: false, duration: G.arrow.duration, ease: G.SETTLE, clearProps: 'strokeDasharray,strokeDashoffset' }, s + G.hairline.duration - 0.15);
      rollP[1](tl, s + 1.3); settle(tl, keys[1], s + 1.5);
      // then the total, then the note
      settle(tl, tot, s + 2.0); settle(tl, note, s + 2.25);
    });
    track('gfx-ow-retained film', f.tl);
  }
  function retainedInit(live) {
    const room = R.ret; if (!room || retainedDone) return;
    if (room.hasAttribute('data-placeholder')) return;                  // a placeholder: nothing to play
    const fn = typeof W.gfxOwnersRetained === 'function' ? W.gfxOwnersRetained : has(room, 'ow-retv-v') ? retainedV : null;
    if (!fn) return;
    retainedDone = true;
    safe('retained', () => fn(room, retainedCtx(live)));
    if (live) refresh();
  }

  /* ---------- the keyboard (owners.js): a control reached before its one-shot reveal has played is shown at once; when
     the keyboard moves onto something a held room has covered (or off screen), the page goes to where it reads: its
     room's own flow position, with the control about a third of the way down ---------- */
  function keyboardInit() {
    W.addEventListener('focusin', e => safe('focus reveal', () => {
      for (let el = e.target; el && el !== D.body; el = el.parentElement) {
        if (el.hasAttribute && el.hasAttribute('data-gfx-reveal') && +getComputedStyle(el).opacity < 0.99) gsap.set(el, { opacity: 1, y: 0, clearProps: 'pointerEvents' });
      }
    }), true);
    let kb = false;
    W.addEventListener('keydown', e => { if (e.key === 'Tab' || e.key === 'Enter' || e.key === ' ') kb = true; }, true);
    W.addEventListener('pointerdown', () => { kb = false; }, true);
    const covered = el => {
      const r = el.getBoundingClientRect(); if (!r.width && !r.height) return false;
      if (r.bottom <= 2 || r.top >= W.innerHeight - 2) return true;
      return [[0.5, 0.5], [0.15, 0.5], [0.85, 0.5]].some(([fx, fy]) => { const x = Math.min(W.innerWidth - 2, Math.max(1, r.left + r.width * fx)), y = Math.min(W.innerHeight - 2, Math.max(1, r.top + r.height * fy)); const t = D.elementFromPoint(x, y); return !!t && !(t === el || el.contains(t) || t.contains(el)); });
    };
    const heldRoomOf = el => { let room = null; for (let a = el.parentElement; a && a !== D.body; a = a.parentElement) if (a.hasAttribute('data-gfx-held')) room = a; return room; };
    const bringIntoView = el => {
      const room = heldRoomOf(el);
      if (!room) { const r = el.getBoundingClientRect(); jump(scrollNow() + r.top - W.innerHeight * 0.35); return; }
      const off = el.getBoundingClientRect().top - room.getBoundingClientRect().top;
      jump(flowY(room) + Math.min(Math.max(0, off - W.innerHeight * 0.35), Math.max(0, room.offsetHeight - W.innerHeight)));
    };
    W.addEventListener('focusin', e => {
      const el = e.target;
      if (!kb || !(el instanceof Element) || el === D.body || el.closest('.gfx-nav, .gfx-skip')) return;
      requestAnimationFrame(() => safe('focus reach', () => {
        if (D.activeElement !== el || !covered(el)) return;
        bringIntoView(el);
        requestAnimationFrame(() => { if (D.activeElement === el && covered(el)) bringIntoView(el); });
      }));
    }, true);
  }

  /* ---------- a resize keeps your place (owners.js): the hold you are in (found again by its name), or the room and how far
     into it ---------- */
  function anchorInit() {
    let anchor = null, t = 0, lastW = W.innerWidth, lastH = W.innerHeight;
    const take = () => {
      const y = scrollNow();
      const h = HOLDS.filter(x => x.st && x.st.end > x.st.start && y >= x.st.start && y <= x.st.end)[0];
      const rs = R.rooms.map(el => ({ el, top: flowY(el) })).filter(o => o.top <= y + 1);
      const r = rs.length ? rs.reduce((a, b) => (b.top > a.top ? b : a)) : null;
      return { hold: h ? { key: h.key, p: (y - h.st.start) / (h.st.end - h.st.start) } : null, room: r ? { el: r.el, f: (y - r.top) / Math.max(1, r.el.offsetHeight) } : null };
    };
    const restore = () => {
      if (!anchor) return; let y = null;
      if (anchor.hold) { const h = HOLDS.filter(x => x.key === anchor.hold.key && x.st && x.st.end > x.st.start)[0]; if (h) y = h.st.start + Math.min(1, anchor.hold.p) * (h.st.end - h.st.start); }
      if (y == null && anchor.room) y = flowY(anchor.room.el) + anchor.room.f * anchor.room.el.offsetHeight;
      if (y != null && Math.abs(y - scrollNow()) > 2) jump(y);
    };
    // (the place is noted whenever the page comes to rest: by the time a resize event arrives the layout is already the
    // new one, so the place read then would be measured in the wrong layout)
    let last = null;
    const note = () => { if (!anchor) last = safe('anchor', take) || last; };
    ST.addEventListener('scrollEnd', note); setTimeout(note, 400);
    W.addEventListener('resize', () => {
      if (W.innerWidth === lastW && W.innerHeight === lastH) return; lastW = W.innerWidth; lastH = W.innerHeight;
      if (!anchor) anchor = last || take();
      clearTimeout(t); t = setTimeout(() => { safe('restore', restore); anchor = null; setTimeout(note, 300); }, 1600);
    }, true);
    ST.addEventListener('refresh', () => { if (anchor) requestAnimationFrame(() => safe('restore', restore)); });
  }

  /* ---------- measure everything once the layout is final, and again whenever it changes (the arrows are measured after
     the fonts and on every resize, a re-split and a ScrollTrigger refresh) ---------- */
  function measureInit() {
    D.addEventListener('gfx:resplit', () => requestAnimationFrame(placeMarks));
    ST.addEventListener('refresh', () => requestAnimationFrame(placeMarks));
    let rz = 0; W.addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => { placeMarks(); refresh(); }, 200); });
    if (D.fonts && D.fonts.ready) D.fonts.ready.then(() => { placeMarks(); refresh(); });
    placeMarks();
  }

  /* for the checks (and the retained room's own script) */
  W.gfxOwners = {
    version: W.__gfxOwnersV2,
    status: () => STATUS.map(s => { const t = safe('status', s.get); return { name: s.name, progress: t && typeof t.progress === 'function' ? +t.progress().toFixed(3) : null }; }),
    retained: fn => { if (typeof fn !== 'function') return; W.gfxOwnersRetained = fn; if (H.classList.contains('gfx-rooms')) retainedInit(!!gsap && !H.classList.contains('gfx-static') && !REDUCE); },
    refresh: () => refresh()
  };
})();
