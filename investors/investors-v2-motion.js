/*!
 * Grey Fox · Investors v2 motion (Webflow page script)
 * Version 1.0.1 · 2026-10-14 · one bundle, one IIFE, front-end only (nothing secret).
 *
 * 1.0.1 (footg, 10/14, founder: "i love G", "go"): the footer is G, "the ending". The shared "gfx Footer (Home v2)"
 *       is restyled natively (four even columns, one 18 px size on 40 px rows, the gold fox + grey wordmark lockup on the
 *       grid, two tones, gfx-ft-* classes); this script adds the motion (footG, the same module in all three scripts): on a
 *       wide screen the footer waits fixed beneath the page, the last room lifts off it, the bar's fox flies into the
 *       lockup, the columns settle, the base hairline draws, reversed on the way up; narrow/short screens: a gentle arrival
 *       in the flow; reduced motion / no library: settled.
 *
 * WHAT IT IS
 *   The approved local Investors page's motion (prototype/investors/investors.js + the held layouts of investors.css and
 *   owners.css, gf-grammar.js) ported onto the Webflow page "Investors v2". The DOM is built natively in Webflow; this
 *   script only animates it. It finds the page through the DOM contract (audit/webflow-build/investors-v2-dom.md): every
 *   element carries data-o="<its local classes>", so a local selector .x is [data-o~="x"] here; the empty decorations
 *   (local <i>/<b>) are [data-t=i|b]; SVG internals (iv-grid, iv-gw, iv-g-*, ow-arw) keep plain classes; ids are gfx-
 *   prefixed. Every room is guarded: missing elements are skipped silently; nothing throws.
 *   Built from owners-v2-motion.js 1.0.2 (the same frame: grammar, setup, Lenis/IX traps, helpers, joins, keyboard).
 *
 * PORTED (investors.js → here)
 *   the hero        headline (split, rising), words, rule, the photograph opening with its 38.2° facet, the arrow under
 *                   "calls.", the two figures rolling (a share such as "1 in 3" rolls only its first number); the hero plays
 *                   once the rooms are set up (at most 1.2 s after load); the breath on the hero and case photographs
 *   the bar         steps aside as you read down, returns on the way up; the tone of the room beneath; the gold fox kept at
 *                   3:1; "Investors" underlined as the current page; its button goes where the hero's button goes
 *   room heads      headline lines rise, words +0.2, the room's hairline +0.45, the arrow +0.85 (owners, weeks, minutes,
 *                   Control, way, too, thesis)
 *   2 research      the grid wipes in, the chains settle, private equity steps back, Priority 1 lights; four narrowings
 *                   (rule, figure, words), 0.42 s apart
 *   3 results       the chain line draws, the arrow under "weeks" follows it, four points and stage names, four figures,
 *                   the bracket, the verdict
 *   3 delivery      three figures under their rules and the note; the portal window opens, its caption, the ring, the
 *                   second view opens from the top
 *   4 Mission Ctrl  one stage: the films load as the stage nears, the window rises out of the dark, the first film plays,
 *                   each hands on to the next (0.7 s); held, the track's thirds pick the beat; off screen it waits; skipped
 *                   past or covered, it rests on the last frame. Posters and films are read from the DOM (poster,
 *                   data-first, data-last, <source src>): wherever the films are hosted, nothing here changes
 *   5 cases         the client's words with the head; each photograph opens, its figure rolls, its words follow (0.35 s)
 *   6 care          the sentence rises, three hairlines draw, two lines follow (not held for reading)
 *   the close       headline, its rule, the row; the footer's divider; close + footer arrive as one screen
 *   the joins       every room held while the next slides over it (dims .5 dark / .3 light, a seam draws; a reading hold of
 *                   0.7 screen after research, results, delivery, MC and cases); a covered room settles out of sight and
 *                   turns transparent; phones / short desktops: flat seams, films at 80%
 *   also            keyboard reveal + bring-into-view, a resize keeps your place, hover marks (button, nav, footer), the
 *                   skip link, the held layouts' CSS (injected under html.gfx-hold), "Pause motion" parity (below)
 *   NOT PORTED      the Next line and the rail (founder 10/13), print handlers, the owners-only rooms of investors.js
 *
 * PAUSE MOTION (parity with Home v2 and Owners v2): the page's one continuous motion is the Mission Control films, which
 *   carry their own Play/Pause control. A visitor who chose "Pause motion" on Home v2 or Owners v2 (sessionStorage
 *   gfx-still = 1) keeps that choice here: the films do not start by themselves; the beats and the control still play them.
 *
 * WEBFLOW NOTES (the same architecture as home-v2-motion.js and owners-v2-motion.js)
 *   - Register as a page script in the page HEADER (Investors v2 only), a plain blocking script. Before DOMContentLoaded it
 *     only (a) sets classes on <html> (gfx-js; gfx-m unless reduced motion; gfx-hold on a desktop with room to hold),
 *     (b) appends one <style id="gfx-investors-css">, (c) traps window.Lenis, (d) traps window.Webflow to hold back
 *     page-scoped IX3 interactions and queues an IX2 stop. Everything else waits for DOMContentLoaded + the libraries + fonts.
 *   - GSAP + ScrollTrigger + SplitText: taken from the page (site-wide code, 3.15.0); loaded from jsDelivr if missing.
 *   - Lenis: ONE instance with the local settings ({ lerp: .085, wheelMultiplier: .95 }), stepped by gsap.ticker; the
 *     site-wide `new Lenis({duration: 2, ...})` receives that instance (its raf() is a no-op) or, on touch screens and with
 *     reduced motion, an inert stub (native scroll).
 *   - Webflow Interactions: IX2 is detached ([data-w-id] stripped as parsed, then ix2.destroy()); IX3 page interactions are
 *     held back (only those of a component with a rendered instance on the page are registered).
 *   - The first beat and caption carry is-on only in data-o (a combo class cannot be set natively): the script adds the
 *     real class is-on before the stage is read.
 *   - Reduced motion: no tween, no hold, no smooth scroll; the settled page (arrows drawn, figures as text, the stage on its
 *     first beat with each poster the settled last frame, the beats and Play working). The same if the motion libraries
 *     cannot load (html.gfx-static). No JS: the Webflow page as built.
 *   - ?gfm=0 turns the whole script off; ?gfxdebug logs guarded failures; ?flow=light, ?dwell=1, ?motif=1 as locally.
 *     window.gfxInvestors.status() reports each room's timeline (for the checks).
 */
(function () {
  'use strict';
  var W = window, D = document;
  if (W.__gfxInvestorsV2) return;
  // ?gfm=0: the page exactly as Webflow serves it, with none of this script
  if (/[?&]gfm=0(&|$)/.test(location.search)) { W.__gfxInvestorsV2 = 'off'; return; }
  W.__gfxInvestorsV2 = '1.0.1';

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
  const log = (where, e) => { if (DEBUG) { try { console.warn('[gfx investors] ' + where, e); } catch (x) { /* nothing */ } } };
  const safe = (where, fn) => { try { return fn(); } catch (e) { log(where, e); return undefined; } };
  const mq = q => { try { return W.matchMedia(q).matches; } catch (e) { return false; } };
  const REDUCE = !!G.reduced();
  const TOUCH = mq('(pointer: coarse)');
  const HOLDQ = '(min-width: 992px) and (min-height: 681px)';    // holds, joins, the films at the lock (investors.js HOLD)
  const FLATQ = '(max-width: 991px), (max-height: 680px)';       // nothing held: flat seams, films at 80%
  const STACK = '(max-width: 991px)';                            // the hero's corner is 48 px below this width
  const O = c => '[data-o~="' + c + '"]';                        // the DOM contract: a local class c is data-o~=c
  const store = { get: k => { try { return W.sessionStorage.getItem(k); } catch (e) { return null; } }, set: (k, v) => { try { W.sessionStorage.setItem(k, v); } catch (e) { /* private mode */ } } };
  const GROUP = G.group;
  const STILL_KEY = 'gfx-still';   // one "Pause motion" choice with Home v2 and Owners v2
  const STILL = () => store.get(STILL_KEY) === '1';

  const CSS = `
.gfx-flow-mark{display:block;height:0;width:100%;margin:0;pointer-events:none}
html.gfx-anchor-off,html.gfx-anchor-off body{overflow-anchor:none}
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
html.gfx-m:not(.gfx-hero-on) [data-o~=ow-h1],html.gfx-m:not(.gfx-hero-on) [data-o~=ow-hero-l]>:not([data-o~=ow-hwrap]),html.gfx-m:not(.gfx-hero-on) [data-o~=iv-stats]{opacity:0}
html.gfx-m:not(.gfx-hero-on) [data-o~=ow-hero-pic] img{clip-path:inset(100% 0% 0% 0%)}
html.gfx-m:not(.gfx-hero-on) [data-o~=ow-hero-foot] [data-o~=ow-rule]{transform:scaleX(0)}
html.gfx-m:not(.gfx-hero-on):not(.gfx-ready) [data-o~=ow-h1],html.gfx-m:not(.gfx-hero-on):not(.gfx-ready) [data-o~=ow-hero-l]>:not([data-o~=ow-hwrap]),html.gfx-m:not(.gfx-hero-on):not(.gfx-ready) [data-o~=iv-stats]{animation:gfx-late .6s ease 3.5s forwards}
html.gfx-m:not(.gfx-hero-on):not(.gfx-ready) [data-o~=ow-hero-pic] img{animation:gfx-late-clip .6s ease 3.5s forwards}
html.gfx-m:not(.gfx-hero-on):not(.gfx-ready) [data-o~=ow-hero-foot] [data-o~=ow-rule]{animation:gfx-late-x .6s ease 3.5s forwards}
html.gfx-m:not(.gfx-rooms):not(.gfx-failsafe) [data-o~=ow-h2]{visibility:hidden;animation:gfx-late 0s linear 3.5s forwards}
html.gfx-failsafe [data-gfx-reveal]{opacity:1!important;transform:none!important;pointer-events:auto!important}
html.gfx-failsafe .gfx-ow-line{transform:none!important}
.gfx-ow-line{white-space:nowrap}
.gfx-ow-line-mask{overflow:visible!important;clip-path:inset(0 -1.5em)}
html.gfx-m [data-o~=ow-facet-in]{--gfx-fxd:96px;clip-path:polygon(var(--gfx-fx,var(--gfx-fxd)) 0,100% 0,100% 100%,0 100%,0 calc(var(--gfx-fx,var(--gfx-fxd)) * .78687))}
@media (max-width:991px){html.gfx-m [data-o~=ow-facet-in]{--gfx-fxd:48px}}
@media (prefers-reduced-motion:reduce){[data-o~=ow-hero-pic] img,[data-o~=iv-case-bg] img{scale:none!important}}
.gfx-ow-mark{position:absolute;left:0;top:0;overflow:visible;pointer-events:none;z-index:2}
.gfx-ow-mark path{fill:none;stroke:#156946;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter}
[data-o~=ow-char] .gfx-ow-mark path,[data-o~=ow-green] .gfx-ow-mark path{stroke:#2f9a6c}
.gfx-hm{position:absolute;left:0;top:0;overflow:visible;pointer-events:none;z-index:3}
.gfx-hm path{fill:none;stroke:#156946;stroke-width:1.5;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:1;stroke-dashoffset:1}
.gfx-hm.on-dark path{stroke:#2f9a6c}
.gfx-hm .h1{transition:stroke-dashoffset .5s cubic-bezier(.7,0,.84,0) .12s}.gfx-hm .h2{transition:stroke-dashoffset .16s cubic-bezier(.7,0,.84,0) 0s}
.gfx-hm-on>.gfx-hm .h1{stroke-dashoffset:0;transition:stroke-dashoffset .75s cubic-bezier(.86,0,.07,1) 0s}
.gfx-hm-on>.gfx-hm .h2{stroke-dashoffset:0;transition:stroke-dashoffset .42s cubic-bezier(.19,1,.22,1) .62s}
.gfx-hm-host .ow-arw{transition:opacity .35s cubic-bezier(.19,1,.22,1) .5s,transform .6s cubic-bezier(.19,1,.22,1)}
.gfx-hm-on .ow-arw{opacity:0;transition:opacity .2s ease 0s}
@media (prefers-reduced-motion:reduce){.gfx-hm path,.gfx-hm-on>.gfx-hm path,.ow-arw{transition:none!important}}
.gfx-skip{position:fixed;left:16px;top:12px;z-index:10000;padding:10px 16px;background:#0e0e0e;color:#fff;font:500 14px/1 "DM Sans",sans-serif;text-decoration:none;transform:translateY(-160%);transition:transform .3s}
.gfx-skip:focus,.gfx-skip:focus-visible{transform:none;outline:2px solid #2f9a6c;outline-offset:2px}
@media (max-width:767px){html .gfx-skip{font-size:16px;padding-top:15px;padding-bottom:15px}}
.gfx-sr{position:absolute!important;width:1px!important;height:1px!important;padding:0!important;margin:-1px!important;overflow:hidden!important;clip:rect(0 0 0 0)!important;clip-path:inset(50%)!important;white-space:nowrap!important;border:0!important;font-family:inherit}
[data-o~=iv-beat],[data-o~=iv-clip-ctl]{background-color:transparent}
[data-o~=iv-clip-ctl][data-state=pause] em{width:8px;height:9px;border:0;border-left:2px solid currentColor;border-right:2px solid currentColor}
.gfx-ow-dim{position:absolute;left:0;top:0;right:0;bottom:0;z-index:50;background:#0e0e0e;opacity:0;pointer-events:none}
.gfx-ow-seam{position:absolute;left:0;right:0;top:0;height:1px;z-index:6;pointer-events:none;display:block;background:#e7e8ea;transform:scaleX(0);transform-origin:0 50%}
[data-o~=ow-char]>.gfx-ow-seam,[data-o~=ow-green]>.gfx-ow-seam,[data-o~=ow-foot]>.gfx-ow-seam{background:rgba(255,255,255,.2)}
[data-o~=ow-foot]>.gfx-ow-seam{left:calc((100vw - min(100vw - 96px,1400px))/2);right:calc((100vw - min(100vw - 96px,1400px))/2);z-index:2}
@media (max-width:991px){[data-o~=ow-foot]>.gfx-ow-seam{left:20px;right:20px}}
html.gfx-hold [data-o~=ow-foot]::before,html.gfx-seams-flat [data-o~=ow-foot]::before{display:none}
.gfx-ow-dwell{display:block;height:calc(var(--d,.4) * 100vh);pointer-events:none}
gfx-odo{display:inline-block;vertical-align:top;height:1em;line-height:1;overflow:hidden}
gfx-reel{display:block;position:relative;line-height:1;will-change:transform}
gfx-reel::before{content:attr(data-seq);position:absolute;left:0;right:0;bottom:100%;white-space:pre;text-align:center;line-height:1}
@media (prefers-reduced-motion:reduce){gfx-reel{transform:none!important}}
@media print{.gfx-ow-dim,.gfx-ow-seam,.gfx-ow-dwell,.gfx-skip{display:none!important}[data-gfx-reveal],.gfx-ow-line{opacity:1!important;transform:none!important}}
@media (min-width:992px) and (min-height:681px){
html.gfx-hold [data-o~=ow-tall]{min-height:100vh;min-height:100svh;display:flex;flex-direction:column}
html.gfx-hold [data-o~=ow-tall]>[data-o~=ow-in]{flex:1 1 auto;display:flex;flex-direction:column;justify-content:center}
html.gfx-hold [data-o~=ow-close][data-o~=ow-room]{display:flex;flex-direction:column;justify-content:center;min-height:max(300px,calc(100vh - var(--gfx-foot-h,600px)))!important;min-height:max(300px,calc(100svh - var(--gfx-foot-h,600px)))!important;padding-top:clamp(64px,10vh,112px)!important;padding-bottom:clamp(32px,5vh,56px)!important}
html.gfx-hold [data-o~=ow-close][data-o~=ow-room]>[data-o~=ow-in]{width:100%}
html.gfx-hold :is([data-o~=iv-res],[data-o~=iv-fun],[data-o~=iv-client],[data-o~=iv-mc],[data-o~=iv-cases])[data-o~=ow-room]{padding-top:clamp(104px,13vh,144px);padding-bottom:clamp(36px,6vh,72px)}
html.gfx-hold :is([data-o~=iv-res],[data-o~=iv-fun],[data-o~=iv-client],[data-o~=iv-mc],[data-o~=iv-cases])>[data-o~=ow-in]{justify-content:center}
html.gfx-hold [data-o~=iv-client][data-o~=ow-room]{padding-top:clamp(88px,10vh,120px);padding-bottom:clamp(28px,4vh,56px)}
html.gfx-hold [data-o~=iv-mc][data-o~=ow-room]{padding-top:0;padding-bottom:0}
html.gfx-hold [data-o~=iv-mc][data-o~=ow-room]>[data-o~=ow-in]{display:block}
html.gfx-hold [data-o~=iv-mc] [data-o~=iv-track]{height:calc(100vh + 28vh);height:calc(100svh + 28svh);margin-top:0}
html.gfx-hold [data-o~=iv-mc] [data-o~=iv-stage]{position:sticky;top:0;height:100vh;height:100svh;display:flex;flex-direction:column;justify-content:flex-start;padding:clamp(96px,12vh,132px) 0 clamp(16px,3vh,32px)}
[data-o~=iv-mc] [data-o~=iv-stage-in]{--iv-cap-h:30px}
html.gfx-hold [data-o~=iv-mc] [data-o~=iv-clip-win],html.gfx-hold [data-o~=iv-mc] [data-o~=iv-mc-cap]{width:min(100%,calc((100svh - var(--iv-open-h,400px) - clamp(16px,3vh,32px) - var(--iv-cap-h,30px)) * 1.7778))}
}
@media (min-width:992px) and (min-height:681px) and (max-height:960px){html.gfx-hold [data-o~=iv-fun][data-o~=ow-room]{padding-bottom:28px}}
@media (min-width:992px) and (min-height:681px) and (max-height:820px){html.gfx-hold [data-o~=iv-fun][data-o~=ow-room]{padding-bottom:20px}}
`;

  safe('head', () => {
    H.classList.add('gfx-js');
    // (scroll anchoring stands down until the rooms are set up: a reload restores the reader's place before the fonts
    // gate lets the holds' dwell blocks in, and anchoring would then carry the reader on by their height)
    if (!REDUCE) H.classList.add('gfx-anchor-off');
    if (!REDUCE) { H.classList.add('gfx-m'); if (mq(HOLDQ)) H.classList.add('gfx-hold'); }
    if (!D.getElementById('gfx-investors-css')) {
      const st = D.createElement('style'); st.id = 'gfx-investors-css'; st.textContent = CSS;
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

  // the failsafe: if the motion never takes the page (a blocked CDN, an error), everything shows (investors.js ow-failsafe)
  const failsafe = () => {
    if (H.classList.contains('gfx-ready')) return;
    H.classList.add('gfx-failsafe', 'gfx-hero-on'); H.classList.remove('gfx-hold', 'gfx-anchor-off'); ix3Late();
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
          if (DEBUG && HELD_IX3.length) log('ix3: interactions held back on Investors v2', HELD_IX3.join(' '));
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
  const has = (el, c) => !!el && el.getAttribute && (' ' + (el.getAttribute('data-o') || '') + ' ').indexOf(' ' + c + ' ') > -1;
  // the dark rooms (investors.js DARK: charcoal, green, dark) and the footer
  const isDark = r => has(r, 'ow-char') || has(r, 'ow-green') || has(r, 'ow-dark') || has(r, 'ow-foot');
  const list = x => (x ? [].concat(x) : []).filter(Boolean);
  let ST = null, gsap = null;
  // a GSAP call never receives an empty target (no "GSAP target not found")
  const gset = (t, v) => { const a = list(t); if (a.length && gsap) gsap.set(a, v); };
  const scrollNow = () => (shared ? shared.scroll : W.scrollY);
  const jump = y => { y = Math.max(0, Math.round(y)); if (shared) shared.scrollTo(y, { immediate: true, force: true }); else W.scrollTo(0, y); if (ST) ST.update(); };
  const refresh = (() => { let t = 0; return () => { clearTimeout(t); t = setTimeout(() => { if (ST) ST.refresh(); }, 90); }; })();
  const held = () => H.classList.contains('gfx-hold');

  /* the rooms, in page order (hero, research, results, delivery, Mission Control, cases, care, close) and the footer */
  const R = { rooms: [] };
  const findRooms = () => {
    R.rooms = $$(O('ow-room'));
    const k = c => R.rooms.filter(r => has(r, c))[0] || null;
    R.hero = k('ow-hero'); R.res = k('iv-res'); R.fun = k('iv-fun'); R.del = k('iv-client'); R.mc = k('iv-mc');
    R.cases = k('iv-cases'); R.care = k('iv-std'); R.close = k('ow-close');
    const fw = $('.footer_section_wrapper');
    R.foot = $(O('ow-foot')) || (fw ? fw.closest('footer') || fw : null);
  };

  /* where an element sits in the page's flow, whatever is held (investors.js topOf + the flow marks; home-v2-motion.js
     flowY). A held room is measured at its flow mark; a sticky stage inside a room at its track; anything inside them by
     its offset from that box (which a hold never changes). */
  const MARKS = new Map();
  const INNER = O('iv-stage');   // Mission Control's stage, held inside its track
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
  // (no tween is made here: a fast-forward is usually called from a held join's trigger, and anything a gsap.matchMedia
  // context records is reverted when the screen crosses the hold threshold, which would hide a finished room again; the
  // timeline plays on at the speed that ends it in G.fastForward instead)
  const ffTl = tl => { if (!tl || tl.progress() >= 1) return; const left = tl.duration() - tl.time(); tl.eventCallback('onComplete', () => tl.timeScale(1)); tl.timeScale(Math.max(1, left / G.fastForward)).play(); };
  const STATUS = [];   // { name, tl() } for the checks: every room's timeline completes
  const track = (name, get) => STATUS.push({ name, get });

  /* ---------- the mark: a line under one word of a headline (its LAST occurrence, so the turn-up never runs into the
     next word) that turns up at the fox ear's 38.2° into the arrow (investors.js makeMark). Measured where the word RESTS
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

  /* ---------- structure that does not depend on motion (investors.js) ---------- */
  const structure = () => safe('structure', () => {
    // the bar: "Investors" is the page you are on; its button goes where the page's own button goes
    $$('.gfx-nav a.navigation-item').forEach(a => { if ((a.textContent || '').trim().toLowerCase() === 'investors') { a.classList.add('gfx-current'); a.setAttribute('aria-current', 'page'); } });
    const cta = $(O('ow-hero') + ' ' + O('ow-btn'));
    const href = cta && cta.getAttribute('href');
    if (href) $$('.gfx-nav a.nav-button').forEach(a => a.setAttribute('href', href));
    // the year in the footer
    $$('.footer_section_wrapper').forEach(f => { const tw = D.createTreeWalker(f, NodeFilter.SHOW_TEXT); for (let n; (n = tw.nextNode());) if (/©\s*20\d\d/.test(n.textContent)) n.textContent = n.textContent.replace(/20\d\d/, String(new Date().getFullYear())); });
  });

  /* the skip link: the first stop for a keyboard; focus lands on the page's heading (investors.js .ow-skip) */
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

  /* ---------- the hover mark (investors.js): a green line draws under the label and turns up at 38.2° into the arrow; it
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

  /* ---------- the bar's tone and the fox's tint (investors.js navTone + gfFoxWatch, clean): the pill and links take the
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
    skipLink(); structure(); isOnPrep(); hoverInit();
    stopIX2(); cleanIX();
    W.addEventListener('load', () => { stopIX2(); setTimeout(ix3Late, 3000); }, { once: true });
    if (REDUCE) { settledInit(false); return; }
    Promise.all([ensureGsap(), ensureLenis()]).then(([ok]) => {
      if (!ok) { settledInit(true); return; }
      safe('start', start);
    });
  });

  /* the settled page: reduced motion, or no motion library (investors.js finishStatic): the drawings in their final frame,
     the arrows drawn where their words rest, nothing held */
  function settledInit(noLib) {
    safe('settled', () => {
      if (noLib) { H.classList.remove('gfx-m', 'gfx-hold'); H.classList.add('gfx-static'); }
      H.classList.remove('gfx-anchor-off');
      $$('h1[data-mark], h2[data-mark]').forEach(h => makeMark(h, true));
      safe('stage', () => mcStage(false)); safe('footer G', () => footG({ close: '[data-o~=ow-close]', still: true }));
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
      let first = true;
      st = ST.create({ trigger: host, start: 'top bottom', end: 'bottom bottom', invalidateOnRefresh: true,
        onRefresh: s => { measure(); step(s.progress, true); first = false; },
        onUpdate: s => step(s.progress, first) });
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
    safe('nav', navInit);
    navWatch();

    fontsReady().then(() => setTimeout(() => {
      // (the joins first: they set html.gfx-hold, which the rooms' own held layouts read)
      [joinsInit, headsInit, researchInit, resultsInit, deliveryInit, mcInit, casesInit, careInit, closeInit, closeFox,
        flatInit, () => footG({ close: '[data-o~=ow-close]' }), keyboardInit, anchorInit, measureInit].forEach(f => safe(f.name || 'room', f));
      H.classList.add('gfx-rooms');   // the room headings' pre-paint hold stands down (each is split and set by now)
      setTimeout(() => H.classList.remove('gfx-anchor-off'), 1500);
      refresh();
      // (investors) the hero plays once the rooms are set up, two frames later, so its first starts never share a long
      // load-time frame (at most 1.2 s after load)
      requestAnimationFrame(() => requestAnimationFrame(heroGo));
    }, 0));
  }

  /* ---------- the hero (investors.js §1): in the grammar's order. Headline 0; the photograph opens from 0.15 (between the
     headline's first and third lines) and settles from 0.49 · words +0.2 · the rule +0.45 · the arrow under "calls." +0.85
     · the two figures (+1.2, +1.5: each rolls, its words +0.15) · the photograph's corner (+1.26). The timeline waits,
     paused, until the rooms are set up (two frames later) or 1.2 s, whichever comes first. ---------- */
  let heroTl = null;
  const heroGo = () => { if (heroTl && heroTl.paused() && !heroTl.progress()) heroTl.play(); };
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
    const words = [$(O('ow-hero-k'), hero), $(O('ow-hero-lede'), hero), $(O('ow-actions'), hero)].filter(Boolean);
    const rule = $(O('ow-hero-foot') + ' ' + O('ow-rule'), hero);
    const pic = $(O('ow-hero-pic'), hero), img = pic && $('img', pic), facet = !!pic && has(pic, 'ow-facet-in');
    // the figures: in a share ("1 in 3") only the first number rolls, so the figure never passes through a false fraction
    const stats = $$(O('iv-stat'), hero), statK = stats.map(st => $(O('iv-stat-k'), st)).filter(Boolean);
    const statPlay = stats.map(st => roll($('[data-ow-odo]', st)));
    words.forEach(e => e.setAttribute('data-gfx-reveal', ''));
    gset(words, { opacity: 0, y: G.body.y }); gset(statK, { opacity: 0, y: G.detail.y }); gset(rule, { scaleX: 0, transformOrigin: '0% 50%' });
    if (img) { gsap.set(img, { clipPath: G.picture.clipFrom, scale: G.picture.scaleFrom }); if (facet) gsap.set(pic, { '--gfx-fx': '0px' }); }
    H.classList.add('gfx-hero-on', 'gfx-ready');   // the script holds them now; the pre-paint states and their fallback stand down
    tl = heroTl = gsap.timeline({ paused: true });
    setTimeout(heroGo, 1200);
    const lines = $$('.gfx-ow-line', h1);
    if (lines.length) tl.to(lines, { yPercent: 0, duration: G.headline.duration, stagger: G.headline.stagger, ease: G.SETTLE, onComplete: () => { h1.__gfxRisen = true; } }, 0);
    else h1.__gfxRisen = true;
    if (words.length) tl.to(words, { opacity: 1, y: 0, duration: G.body.duration, stagger: GROUP, ease: G.SETTLE }, G.body.at);
    if (rule) tl.to(rule, { scaleX: 1, duration: G.hairline.duration, ease: G.DRAW }, G.hairline.at);
    // the photograph opens upward like a window (DRAW) and settles (a little longer than it opens)
    const PIC_AT = 0.15;
    if (img) tl.to(img, { clipPath: 'inset(0% 0% 0% 0%)', duration: G.picture.duration, ease: G.DRAW }, PIC_AT)
      .to(img, { scale: 1, duration: G.picture.duration + 0.5, ease: G.SETTLE }, PIC_AT + 0.34);
    drawMark(hm, tl, G.arrow.at);
    stats.forEach((st, i) => { const at = G.detail.at + i * 0.3; if (statPlay[i]) statPlay[i](tl, at); const k = $(O('iv-stat-k'), st); if (k) tl.to(k, { opacity: 1, y: 0, duration: G.detail.duration, ease: G.SETTLE }, at + 0.15); });
    // the corner cuts in (its resting size is the CSS one: 96 px, 48 px below 992)
    if (img && facet) tl.to(pic, { '--gfx-fx': mq(STACK) ? '48px' : '96px', duration: G.hairline.duration, ease: G.DRAW, onComplete: () => pic.style.removeProperty('--gfx-fx') }, G.detail.at + G.detail.stagger);
    if (img) tl.add(() => gsap.set(img, { clearProps: 'clipPath' }));
    addFF(hero, () => { heroGo(); ffTl(tl); });
    track('hero', () => tl);
  }

  /* ---------- the breath (investors.js, sbx-m1.js M3): a photograph keeps a very slow settle while it is on screen, from
     the grammar's breath scale to rest, tied to the scroll: the hero's from the top until the next room has covered the
     hero; each case photograph from the moment its room starts to arrive until it has gone. The scale is the photograph's
     own CSS scale, so it composes with its arrival (a timed transform). ?motif=1 keeps the line and the arrow without it. ---------- */
  function breathInit() {
    if (/[?&]motif=1(&|$)/.test(location.search) || !G.breath) return;
    const B = G.breath;
    const breathe = (img, frame, range) => {
      let last = -1, q = 0.0005;
      const set = u => { const raw = B.scaleFrom + (B.scaleTo - B.scaleFrom) * u, v = u >= 1 ? B.scaleTo : u <= 0 ? B.scaleFrom : +(Math.round(raw / q) * q).toFixed(4); if (v !== last) { last = v; img.style.scale = v; } };
      set(0);
      ST.create({ start: () => range()[0], end: () => range()[1], invalidateOnRefresh: true,
        onToggle: s => { img.style.willChange = s.isActive ? 'transform' : ''; },
        onUpdate: s => set(s.progress), onRefresh: s => { q = 1 / Math.max(400, frame.offsetWidth || 400); set(s.progress); } });
    };
    const hero = R.hero, himg = hero && $(O('ow-hero-pic') + ' img', hero);
    if (himg) breathe(himg, himg.closest(O('ow-hero-pic')) || himg.parentElement, () => [0, Math.max(W.innerHeight, hero.offsetHeight)]);
    $$(O('iv-case-bg')).forEach(bg => {
      const img = $('img', bg), rm = bg.closest(O('ow-room'));
      if (img && rm) breathe(img, bg, () => { const t = flowY(rm); return [Math.max(0, t - W.innerHeight), t + rm.offsetHeight]; });
    });
  }

  /* ---------- the bar (investors.js): it steps aside while you read down (the links and the button; the gold fox stays; on a
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

  /* ---------- the joins (investors.js, held desktop): every room holds (CSS sticky) while the next slides over it, in page
     order; the held room dims (dark rooms .5 toward black, light rooms .3 toward their paper) and a hairline draws across
     the arriving room's top, complete as it locks. A room still playing settles once the next has covered it completely.
     The close and the footer arrive together as one screen (no hold between them). ---------- */
  // every room locks (founder 10/11); ?flow=light previews the light rule (a join only where the light changes)
  const FLOW_ALL = !/[?&]flow=light(&|$)/.test(location.search);
  // reading time once locked (investors.js HOLDS, the grammar's standard hold) after research, results, delivery, Mission
  // Control and the cases; data-gfx-dwell="<screens>" on a section chooses another (0 for none); ?dwell=1 previews 0.4 elsewhere
  const DWELL_ROOMS = ['iv-res', 'iv-fun', 'iv-client', 'iv-mc', 'iv-cases'];
  const dwellOf = room => {
    const a = room.getAttribute('data-gfx-dwell'); if (a != null && a !== '') return Math.max(0, +a || 0);
    if (DWELL_ROOMS.some(c => has(room, c))) return G.hold.standard;
    return /[?&]dwell=1(&|$)/.test(location.search) ? 0.4 : 0;
  };
  function joinsInit() {
    const foot = R.foot;
    const setFoot = () => { if (foot) H.style.setProperty('--gfx-foot-h', foot.offsetHeight + 'px'); };
    setFoot(); W.addEventListener('resize', setFoot); ST.addEventListener('refreshInit', setFoot);
    gsap.matchMedia().add(HOLDQ, () => {
      H.classList.add('gfx-hold');
      const undo = [];
      // every room locks (founder 10/11); ?flow=light previews the light rule (a join only where the light changes)
      const pairs = R.rooms.map((r, i) => [r, R.rooms[i + 1]]).filter(p => p[1] && (FLOW_ALL || isDark(p[0]) !== isDark(p[1])));
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
        // the held room is wholly covered its dim is set aside (unseen) and the room turns transparent (its layer costs no
        // paint, notably in Safari; it stays in the accessibility tree); both come back with the first pixel of the way up
        const tw = gsap.fromTo(dim, { opacity: 0 }, { opacity: light ? G.seam.dimLight : G.seam.dimDark, ease: 'none',
          scrollTrigger: { start: () => nextY() - Math.min(W.innerHeight, prev.offsetHeight), end: () => nextY(), scrub: true, invalidateOnRefresh: true,
            onLeave: () => { dim.style.visibility = 'hidden'; prev.style.opacity = '0'; }, onEnterBack: () => { dim.style.visibility = ''; prev.style.opacity = ''; } } });
        // the seam: a hairline across the arriving room's top edge, drawn by the slide, complete as it locks
        const seam = D.createElement('i'); seam.className = 'gfx-ow-seam'; seam.setAttribute('aria-hidden', 'true'); next.insertBefore(seam, next.firstChild);
        const sw = gsap.fromTo(seam, { scaleX: 0 }, { scaleX: 1, ease: G.DRAW,
          scrollTrigger: { start: () => nextY() - W.innerHeight, end: () => nextY(), scrub: true, invalidateOnRefresh: true } });
        // a room still playing settles once the next has covered it completely (out of sight)
        const ff = ST.create({ start: () => nextY(), end: () => nextY() + 1, onEnter: () => ffRoom(prev) });
        undo.push(() => {
          [tw, sw].forEach(t => { if (t.scrollTrigger) t.scrollTrigger.kill(); t.kill(); }); ff.kill(); dim.remove(); seam.remove();
          prev.style.position = ''; prev.style.top = ''; prev.style.opacity = ''; prev.removeAttribute('data-gfx-held');
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

  /* ---------- the rooms' heads (investors.js roomHead): as the headline reaches 82% of the screen its lines rise; its words
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
    // (built now, outside any gsap.matchMedia context: a film made inside a held or flat trigger's callback would be
    // recorded by that context and reverted, its room hidden again, when the screen crosses the hold threshold)
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
  const laterMarks = new Map();   // rooms whose arrow follows a line drawn in their film (results: the chain's line)
  const taken = new Set();         // the words and rules a room's head has taken (the rest play on their own: the close)
  // play once as a point in the flow is reached (or finish at once if the reader jumped past it), then the trigger is gone
  const onceAt = (at, play) => {
    let done = false;
    return ST.create({ start: at, end: () => at() + 1, invalidateOnRefresh: true,
      onEnter: s => { if (done) return; done = true; play(false); s.kill(); },
      onLeave: s => { if (done) return; done = true; play(true); s.kill(); } });
  };
  const roomHead = (room, opts) => {
    const o = opts || {};
    const open = $(O('ow-open'), room), h = open && $('h2', open); if (!h) return null;
    const words = $$('[data-ow-appear]', open).filter(e => !taken.has(e));
    const rule = o.rule !== undefined ? o.rule : ($$('[data-ow-draw]', room).filter(r => !taken.has(r))[0] || null);
    words.concat(rule ? [rule] : []).forEach(e => taken.add(e));
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
    R.rooms.filter(r => r !== R.hero).forEach(r => {
      const hd = roomHead(r, r === R.fun ? { markLater: true } : {});
      if (hd) track((r.id || 'room') + ' head', hd.tl);
    });
  }
  // a heading outside an opener (care, the close): its lines rise as it reaches 82% of the screen, its arrow follows at
  // +0.85 (investors.js headline)
  const headline = (h, room) => {
    const m = (h.getAttribute('data-mark') || '').trim() ? makeMark(h) : null;
    let shown = false, first = true, tl = null;
    W.SplitText.create(h, { type: 'lines', mask: 'lines', linesClass: 'gfx-ow-line', autoSplit: true, aria: 'none',
      onSplit: self => { gsap.set(self.lines, { yPercent: shown ? 0 : G.headline.yPercent }); if (!first) requestAnimationFrame(() => { D.dispatchEvent(new Event('gfx:resplit')); }); first = false; } });
    const play = skip => {
      shown = true; tl = gsap.timeline();
      const ls = $$('.gfx-ow-line', h);
      if (ls.length) tl.to(ls, { yPercent: 0, duration: G.headline.duration, stagger: G.headline.stagger, ease: G.SETTLE }, 0);
      if (m) drawMark(m, tl, G.arrow.at);
      if (skip) { tl.progress(1); if (m) markDone(m); }
    };
    addFF(room, () => { if (!tl) play(true); else ffTl(tl); });
    onceAt(() => flowY(h) - W.innerHeight * pctOf(G.headline.start), play);
    return { tl: () => tl };
  };
  // a rule no head took draws as it reaches 90% (+0.45); words no head took appear there (+0.2) (investors.js draw/appear)
  const drawRule = r => {
    let tw = null; gsap.set(r, { scaleX: 0, transformOrigin: '0% 50%' });
    onceAt(() => flowY(r) - W.innerHeight * 0.9, skip => { tw = gsap.to(r, { scaleX: 1, duration: skip ? 0 : G.hairline.duration, delay: skip ? 0 : G.hairline.at, ease: G.DRAW }); });
    return () => tw;
  };
  const appear = el => {
    let tw = null; el.setAttribute('data-gfx-reveal', ''); gsap.set(el, { opacity: 0, y: G.body.y, pointerEvents: 'none' });
    onceAt(() => flowY(el) - W.innerHeight * 0.9, skip => { shownNow(el); tw = gsap.to(el, { opacity: 1, y: 0, duration: skip ? 0 : G.body.duration, delay: skip ? 0 : G.body.at, ease: G.SETTLE }); });
    return () => tw;
  };
  /* ---------- the close (investors.js): its headline rises and the arrow under "thesis." follows; its rule draws and its
     row (the line and the address) appears as each reaches 90% of the screen. The same for any heading, rule or words the
     rooms' heads did not take (care's headline). ---------- */
  function closeInit() {
    R.rooms.filter(r => r !== R.hero).forEach(r => {
      const id = r.id || 'room';
      $$('h2[data-mark]', r).filter(h => !h.closest(O('ow-open'))).forEach(h => { const hd = headline(h, r); track(id + ' headline', hd.tl); });
      $$('[data-ow-draw]', r).filter(x => !taken.has(x)).forEach(x => { taken.add(x); track(id + ' rule', drawRule(x)); });
      $$('[data-ow-appear]', r).filter(x => !taken.has(x)).forEach(x => { taken.add(x); track(id + ' words', appear(x)); });
    });
  }
  // (10/12 motifs: the fox rests behind the close's words, as on the local page)
  function closeFox() { gset($(O('ow-close-fox')), { yPercent: -50 }); }

  /* ---------- the footer: its divider draws in as you arrive (the designer's own Webflow interaction on his "divider":
     from the left over 3 s, power1.inOut); back below the screen it resets out of sight ---------- */
  function footerInit() {
    $$('.footer_section_wrapper .divider').forEach(d => {
      const tw = gsap.fromTo(d, { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: 3, ease: 'power1.inOut', paused: true });
      const at = () => flowY(d) - W.innerHeight;
      ST.create({ start: at, end: 'max', onEnter: () => tw.play(), onLeaveBack: () => tw.pause(0) });
    });
  }

  /* ========================= 5 · the investors rooms (investors.js "the investors rooms", round 2) =========================
     HEAD (headline, words, hairline, arrow) plays as a room slides in (roomHead above); the FILM plays at the lock on a held
     desktop, as its part reaches 80% of the screen elsewhere; a room still playing when the next has covered it settles
     out of sight (addFF). */
  const HOLDS = [];   // held ScrollTriggers a resize finds again by name (none of this page's rooms hold inside a track
                      // of their own but Mission Control, whose place a resize keeps through its room)
  const nv = (v, d) => (v == null ? d : v);
  const settleIn = (tl, els, at, o) => {
    o = o || {}; const a = list(els); if (!a.length) return;
    tl.fromTo(a, { opacity: 0, y: nv(o.y, G.body.y) }, { opacity: 1, y: 0, duration: nv(o.d, G.body.duration), ease: G.SETTLE, stagger: nv(o.st, GROUP), immediateRender: false, onStart: () => shownNow(a) }, at);
  };
  const hideNow = els => { const a = list(els); a.forEach(e => e.setAttribute('data-gfx-reveal', '')); gset(a, { opacity: 0, y: G.body.y, pointerEvents: 'none' }); };
  const detail = { y: G.detail.y, d: G.detail.duration };

  /* the odometer (investors.js odo): each digit a reel; one figure is one gesture, so one tween paints every reel from one
     clock (each digit keeps its own start, +0.07 s, and length, +0.1 s). The figure's text stays its locked value: a
     reader hears it once, whole (a visually hidden copy; the reels are aria-hidden). Green figures are the build's. */
  function odo(b) {
    const val = b.getAttribute('data-final') || b.textContent.trim(); b.setAttribute('data-final', val);
    b.textContent = '';
    const sr = D.createElement('span'); sr.className = 'gfx-sr'; sr.textContent = val; b.appendChild(sr);
    const vis = D.createElement('span'); vis.setAttribute('aria-hidden', 'true'); b.appendChild(vis);
    const reels = []; let k = 0;
    for (let c = 0; c < val.length; c++) {
      const ch = val[c];
      if (!/\d/.test(ch)) { vis.appendChild(D.createTextNode(ch)); continue; }
      const d = +ch, n = 4 + k, seq = []; for (let j = n; j >= 1; j--) seq.push((d - j + 100) % 10);
      const mask = D.createElement('gfx-odo'), reel = D.createElement('gfx-reel');
      reel.textContent = ch; reel.setAttribute('data-seq', seq.join('\n')); mask.appendChild(reel); vis.appendChild(mask);
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
  }
  // one odometer per figure, built once; a share ("1 in 3", "28 of 31") rolls only its first number, so the figure never
  // passes through a false fraction
  const rolls = new Map();
  function roll(el) {
    if (!el) return null;
    if (!rolls.has(el)) {
      const f = /^(\d+)(\s(?:of|in|to)\s.+)$/.exec(el.textContent.trim());
      if (f) {
        el.textContent = ''; const n = D.createElement('span'); n.className = 'iv-odo-n'; n.textContent = f[1];
        el.appendChild(n); el.appendChild(D.createTextNode(f[2]));
        const play = odo(n); gsap.set(el, { opacity: 0 });
        rolls.set(el, (tl, at) => { tl.set(el, { opacity: 1 }, at); play(tl, at); });
      } else rolls.set(el, odo(el));
    }
    return rolls.get(el);
  }

  /* ---------- 2 · the research: the store field wipes in; the chains settle over it; the dozen backed by private equity
     step back; Priority 1 lights. Beside it, each narrowing's rule draws, its figure rolls, its words follow, one step
     0.42 s after another. (The outcomes branch stays inert: none on the page.) ---------- */
  function researchInit() {
    const room = R.res, body = room && $(O('iv-res-body'), room); if (!body) return;
    const wipe = $('.iv-gw', room), field = $('.iv-g-field', room), chains = $('.iv-g-chains', room), pe = $('.iv-g-pe', room), outG = $('.iv-g-out', room), p1 = $('.iv-g-p1', room), cap = $(O('iv-res-cap'), room);
    const steps = $$(O('iv-step'), room), sRoll = steps.map(s => roll($('[data-ow-odo]', s))), sText = steps.map(s => $$(O('iv-step-t') + ' > *', s));
    const outs = $$(O('iv-o'), room), oRoll = outs.map(o => roll($('[data-ow-odo]', o))), oText = outs.map(o => $(O('iv-o-k'), o)), scope = $(O('iv-out-scope'), room), outBox = $(O('iv-out-list'), room);
    if (wipe) gsap.set(wipe, { attr: { width: 0 } });
    gset([chains, p1], { opacity: 0 }); gset(steps.concat(outs), { '--ow-rl': 0 });
    hideNow([].concat.apply([], sText).concat([cap], oText, [scope]));
    const GAP = 0.42;
    const outIn = (tl, t) => {
      settleIn(tl, scope, t, detail);
      outs.forEach((o, i) => { const a = t + 0.2 + i * 0.3; tl.to(o, { '--ow-rl': 1, duration: G.hairline.duration, ease: G.DRAW }, a); if (oRoll[i]) oRoll[i](tl, a + 0.15); settleIn(tl, oText[i], a + 0.3, detail); });
    };
    const f = filmAt(room, body, tl => {
      if (wipe) tl.to(wipe, { attr: { width: 570 }, duration: 1.2, ease: G.DRAW }, 0);
      if (chains) tl.to(chains, { opacity: 1, duration: 0.8, ease: G.SETTLE }, GAP + 0.24);
      if (field) tl.to(field, { opacity: 0.4, duration: 0.8, ease: G.SETTLE }, GAP + 0.36);
      if (outG) tl.to(outG, { opacity: 0.16, duration: 0.7, ease: G.SETTLE }, GAP + 0.6);
      if (pe) tl.to(pe, { opacity: 0.16, duration: 0.7, ease: G.SETTLE }, GAP * 2 + 0.25);
      if (p1) tl.to(p1, { opacity: 1, duration: 0.9, ease: G.SETTLE }, GAP * 3 + 0.1);
      steps.forEach((s, i) => { const t = i * GAP; tl.to(s, { '--ow-rl': 1, duration: G.hairline.duration, ease: G.DRAW }, t); if (sRoll[i]) sRoll[i](tl, t + 0.1); settleIn(tl, sText[i], t + 0.15, { st: GROUP }); });
      settleIn(tl, cap, GAP * 3, detail);
      if (held() && outs.length) outIn(tl, GAP * 4 + 0.2);
    });
    track('research film', f.tl);
    if (outBox) filmAt(room, outBox, tl => { if (!held()) outIn(tl, 0); });
  }

  /* ---------- 3 · from research to results: one drawn sequence. The line draws and the room's arrow (under "weeks.")
     follows it; the four points land in order, each stage's name with it; then each figure on its stretch (the attempts
     over the first, the handoff over the last, the bracket under conversation to introduction); then the verdict. ---------- */
  function resultsInit() {
    const room = R.fun, chain = room && $(O('iv-chain'), room); if (!chain) return;
    const line = $(O('iv-chain-line'), chain), pts = $$(O('iv-chain-pt'), chain), names = $$(O('iv-cs'), chain), figs = $$(O('iv-cfg'), chain);
    const fRoll = figs.map(f => roll($('[data-ow-odo]', f))), fText = figs.map(f => $(O('iv-cfg-k'), f)), span = figs.filter(f => has(f, 'is-span'))[0] || null;
    const m = laterMarks.get(room), verdict = $(O('iv-verdict'), room);
    gset(line, { '--ow-rl': 0 }); gset(pts, { '--iv-pt': 0 }); gset(span, { '--ow-rl': 0 }); hideNow(names.concat(fText, [verdict]));
    const f = filmAt(room, chain, tl => {
      if (line) tl.to(line, { '--ow-rl': 1, duration: G.hairline.duration, ease: G.DRAW }, 0);
      if (m) drawMark(m, tl, G.arrow.at - G.hairline.at);
      pts.forEach((p, i) => { const a = 0.15 + i * 0.32; tl.to(p, { '--iv-pt': 1, duration: 0.5, ease: G.SETTLE }, a); settleIn(tl, names[i], a + 0.08, detail); });
      const at = [0.45, 0.8, 1.0, 1.15];
      figs.forEach((fg, i) => { const a = nv(at[i], 1.5); if (fg === span) tl.to(span, { '--ow-rl': 1, duration: 0.9, ease: G.DRAW }, a - 0.1); if (fRoll[i]) fRoll[i](tl, a); settleIn(tl, fText[i], a + 0.12, detail); });
      settleIn(tl, verdict, 1.65, detail);
    });
    track('results film', f.tl);
  }

  /* ---------- 3 · delivery: the figures roll under their rules, one after another, and the note follows; then the window
     opens on the Draw curve, its caption settles, the most recent introduction is picked out by a hairline frame, and its
     card opens over the view from the top. ---------- */
  function deliveryInit() {
    const room = R.del; if (!room) return;
    const figsBox = $(O('iv-dfigs'), room), dfs = $$(O('iv-df'), room), note = $(O('iv-df-note'), room);
    const win = $(O('iv-win'), room), view = win && $(O('iv-win-view'), win);
    if (figsBox) {
      const dRoll = dfs.map(d => roll($('[data-ow-odo]', d))), dText = dfs.map(d => $(O('iv-df-k'), d));
      gset(dfs, { '--ow-rl': 0 }); hideNow(dText.concat([note]));
      const f = filmAt(room, figsBox, tl => {
        dfs.forEach((d, i) => { const a = 0.1 + i * 0.3; tl.to(d, { '--ow-rl': 1, duration: G.hairline.duration, ease: G.DRAW }, a); if (dRoll[i]) dRoll[i](tl, a + 0.15); settleIn(tl, dText[i], a + 0.3, detail); });
        settleIn(tl, note, 0.1 + dfs.length * 0.3 + 0.3, detail);
      });
      track('delivery figures', f.tl);
    }
    if (view) {
      const two = $(O('iv-win-2'), view), ring = $(O('iv-win-ring'), view), cap = $(O('iv-win-cap'), win);
      gsap.set(win, { clipPath: G.picture.clipFrom }); gset(two, { clipPath: 'inset(0% 0% 100% 0%)' }); gset(ring, { opacity: 0, scale: 1.04 }); hideNow(cap);
      const f = filmAt(room, win, tl => {
        tl.to(win, { clipPath: 'inset(0% 0% 0% 0%)', duration: G.picture.duration, ease: G.DRAW }, 0.4);
        settleIn(tl, cap, 1.0, detail);
        if (ring) tl.to(ring, { opacity: 1, scale: 1, duration: 0.6, ease: G.SETTLE }, 1.5);
        if (two) tl.to(two, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: G.DRAW }, 2.1);
        if (ring) tl.to(ring, { opacity: 0, duration: 0.5, ease: 'power1.out' }, 2.4);
      });
      track('delivery window', f.tl);
    }
  }

  /* ---------- 4 · Mission Control's stage (investors.js mcStage): one frame, three films. show(k) brings beat k forward
     (its film crossfades in, its word and line change, its hairline is the one filling); with play it plays from its
     first frame (a beat already playing goes on). Live, a film that ends hands on to the next 0.7 s later. rest() is the
     stage settled: the last beat on its last frame. Posters and films come from the DOM: poster (the settled last frame),
     data-first, data-last and each <source src>, wherever they are hosted. ---------- */
  // the first beat and caption carry is-on only in data-o (Webflow cannot set a second class natively): make it real
  const isOnPrep = () => safe('is-on', () => $$(O('is-on')).forEach(e => e.classList.add('is-on')));
  function mcStage(live) {
    const room = R.mc || $(O('iv-mc')), st = room && $(O('iv-stage'), room); if (!st) return null;
    if (st.__gfxStage) return st.__gfxStage;
    const vids = $$(O('iv-clip-v'), st), beats = $$(O('iv-beat'), st), ctl = $(O('iv-clip-ctl'), st), caps = $$(O('iv-cap'), st);
    if (!vids.length || !beats.length || !ctl) return null;
    let cur = 0, raf = 0, rested = false;
    const fill = (k, p) => { if (beats[k]) beats[k].style.setProperty('--p', p); };
    const tick = () => { const v = vids[cur]; if (v && v.duration) fill(cur, Math.min(1, v.currentTime / v.duration)); raf = v && !v.paused && !v.ended ? requestAnimationFrame(tick) : 0; };
    const lab = () => {
      const v = vids[cur]; if (!v) return;
      const on = !v.paused && !v.ended, t = on ? 'Pause' : v.ended ? 'Play again' : 'Play';
      ctl.dataset.state = on ? 'pause' : 'play'; if (ctl.lastElementChild) ctl.lastElementChild.textContent = t;
      ctl.setAttribute('aria-label', t + ': ' + ((beats[cur] && beats[cur].dataset.word) || ''));
    };
    const cap = (k, instant) => caps.forEach((c, i) => {
      if (instant) { c.style.transition = 'none'; requestAnimationFrame(() => { c.style.transition = ''; }); }
      c.classList.toggle('is-on', i === k); if (i === k) c.removeAttribute('aria-hidden'); else c.setAttribute('aria-hidden', 'true');
    });
    const run = v => { v.preload = 'auto'; const p = v.play(); if (p && p.catch) p.catch(() => {}); };
    const show = (k, o) => {
      o = o || {}; const v = vids[k]; if (!v) return;
      if (k !== cur) {
        vids.forEach((x, i) => { x.classList.toggle('is-on', i === k); if (i === k) x.removeAttribute('aria-hidden'); else { x.setAttribute('aria-hidden', 'true'); if (!x.paused) x.pause(); } });
        beats.forEach((b, i) => { b.classList.toggle('is-on', i === k); b.setAttribute('aria-pressed', String(i === k)); if (live) fill(i, i < k ? 1 : i > k ? 0 : (b.style.getPropertyValue('--p') || 0)); });
        cur = k; cap(k, o.instant || !live);
      }
      if (o.play && (v.paused || v.ended)) { if (v.ended || !live) { v.currentTime = 0; fill(k, 0); } run(v); }
      lab();
    };
    vids.forEach((v, i) => {
      v.addEventListener('play', () => { if (i === cur) { cancelAnimationFrame(raf); tick(); } lab(); const nx = vids[i + 1]; if (live && nx && nx.preload !== 'auto') { nx.preload = 'auto'; nx.load(); } });
      v.addEventListener('pause', lab);
      v.addEventListener('ended', () => { fill(i, 1); lab(); if (live && !rested && i === cur && i < vids.length - 1) setTimeout(() => { if (cur === i && !rested) show(i + 1, { play: true }); }, 700); });
    });
    beats.forEach((b, i) => { if (!live) fill(i, 1); b.addEventListener('click', () => { rested = false; show(i, { play: live }); }); });
    ctl.hidden = false;
    ctl.addEventListener('click', () => { const v = vids[cur]; rested = false; if (v.paused || v.ended) { if (v.ended) v.currentTime = 0; run(v); } else v.pause(); });
    lab();
    const api = {
      show, vids, get cur() { return cur; }, get rested() { return rested; },
      first: () => vids.forEach(v => { if (v.dataset.first) v.setAttribute('poster', v.dataset.first); }),
      load: () => { const v = vids[0]; if (v.preload !== 'auto') { v.preload = 'auto'; v.load(); } },
      rest: () => {
        rested = true; const last = vids.length - 1; show(last, { instant: true });
        vids.forEach((v, i) => { if (!v.paused) v.pause(); fill(i, 1); if (v.dataset.last) v.setAttribute('poster', v.dataset.last); });
        const v = vids[last]; if (v.readyState >= 1 && v.duration) v.currentTime = v.duration; lab();
      }
    };
    st.__gfxStage = api; return api;
  }
  /* ---------- 4 · Mission Control: the films load as the stage nears the screen; as it arrives the beats and their words
     settle and the window emerges from the dark (a slow rise, a breath of scale, the veil lifting, 1.6 s on the settle
     curve), then the first film plays. Held, the scroll through the stage's short track (and the hold after it) picks the
     beat, a third each. A stage that leaves the screen mid-play waits; one skipped past, or covered by the next room, rests
     on the last beat's last frame. "Pause motion" chosen on Home v2 / Owners v2: nothing starts by itself. ---------- */
  function mcInit() {
    const room = R.mc, S = room && mcStage(true); if (!S) return;
    const st = $(O('iv-stage'), room), win = $(O('iv-clip-win'), st), veil = $(O('iv-clip-veil'), st), row = $(O('iv-stage-row'), st);
    if (!win) return;
    let shown = false, away = false;
    const auto = () => !STILL();
    S.first();
    const stIn = $(O('iv-stage-in'), st);
    const fit = () => { if (stIn) st.style.setProperty('--iv-open-h', Math.round(stIn.getBoundingClientRect().top - st.getBoundingClientRect().top) + 'px'); };
    fit(); W.addEventListener('resize', fit); ST.addEventListener('refreshInit', fit);
    gsap.set(win, { opacity: 0, y: 56, scale: 0.965, transformOrigin: '50% 100%' }); gset(veil, { opacity: 0.9 }); hideNow(row);
    const loadAt = () => flowY(st) - W.innerHeight * 1.6;
    onceAt(loadAt, () => S.load());
    const tl = gsap.timeline({ paused: true });
    settleIn(tl, row, 0, { d: G.body.duration });
    tl.to(win, { opacity: 1, y: 0, scale: 1, duration: 1.6, ease: G.SETTLE }, 0.15);
    if (veil) tl.to(veil, { opacity: 0, duration: 1.3, ease: 'power2.out' }, 0.35);
    tl.add(() => { shown = true; if (!S.rested) S.show(S.cur, { play: auto() }); }, 1.25);
    onceAt(() => flowY(win) - W.innerHeight * 0.72, skip => { if (skip) { S.rest(); tl.progress(1); } else tl.play(); });
    addFF(room, () => { if (!S.rested) S.rest(); if (tl.progress() < 1) tl.progress(1); });
    track('mc stage', () => tl);
    // held: the stage's track (and the hold after it) picks the beat
    gsap.matchMedia().add(HOLDQ, () => {
      const trk = $(O('iv-track'), room);
      if (!held() || !trk || !R.cases) return undefined;
      let seg = 0;
      const t = ST.create({ start: () => flowY(trk), end: () => flowY(R.cases) - W.innerHeight, invalidateOnRefresh: true,
        onUpdate: s => { const k = s.progress < 0.34 ? 0 : s.progress < 0.67 ? 1 : 2; if (k === seg) return; seg = k; if (shown && !S.rested) S.show(k, { play: auto() }); } });
      const entry = { key: 'mc', st: t }; HOLDS.push(entry);
      return () => { t.kill(); const i = HOLDS.indexOf(entry); if (i > -1) HOLDS.splice(i, 1); };
    });
    // off the screen mid-play, the stage waits, and goes on when it is back
    const off = () => { const v = S.vids[S.cur]; if (shown && !S.rested && v && !v.paused && !v.ended) { away = true; v.pause(); } };
    const on = () => { if (away && !S.rested) { away = false; S.show(S.cur, { play: true }); } };
    ST.create({ start: () => flowY(win) - W.innerHeight, end: () => flowY(win) + win.offsetHeight, invalidateOnRefresh: true, onLeave: off, onLeaveBack: off, onEnter: on, onEnterBack: on });
  }

  /* ---------- 5 · three searches: the client's words arrive with the head; then each search's photograph opens on the
     Draw curve, its figure rolls and its words follow, one search after another (0.35 s apart) ---------- */
  function casesInit() {
    const room = R.cases, lst = room && $(O('iv-case-list'), room); if (!lst) return;
    const cases = $$(O('iv-case'), room), bgs = cases.map(c => $(O('iv-case-bg'), c)), kRoll = cases.map(c => roll($('[data-ow-odo]', c)));
    const kText = cases.map(c => { const inn = $(O('iv-case-in'), c); return inn ? Array.prototype.slice.call(inn.children).filter(e => !has(e, 'iv-case-fig')) : []; });
    const qTop = $(O('iv-cq') + O('is-top'), room), h2 = $('h2', room);
    gset(bgs, { clipPath: G.picture.clipFrom }); hideNow([].concat.apply([], kText));
    if (qTop && h2) {
      hideNow(qTop); let qt = null;
      headAt(room, h2, skip => { qt = gsap.timeline(); settleIn(qt, qTop, G.body.at, { d: G.body.duration }); if (skip) qt.progress(1); addFF(room, () => ffTl(qt)); });
      track('cases quote', () => qt);
    }
    const f = filmAt(room, lst, tl => {
      cases.forEach((c, i) => {
        const a = i * 0.35;
        if (bgs[i]) tl.to(bgs[i], { clipPath: 'inset(0% 0% 0% 0%)', duration: G.picture.duration, ease: G.DRAW }, a);
        settleIn(tl, kText[i][0], a + 0.35, detail); if (kRoll[i]) kRoll[i](tl, a + 0.5); settleIn(tl, kText[i].slice(1), a + 0.65, { st: 0.1, y: G.detail.y, d: G.detail.duration });
      });
    });
    track('cases film', f.tl);
  }

  /* ---------- 6 · chosen with care (not held for reading): with the headline as it arrives, the sentence rises; its three
     hairlines draw beneath it (0.12 s apart); then the two quiet lines ---------- */
  function careInit() {
    const room = R.care, body = room && $(O('iv-std-r'), room), h2 = room && $('h2', room); if (!body || !h2) return;
    const line = $(O('iv-std-line'), body), rules = $$(O('iv-std-rules') + ' [data-t=i]', body), ps = $$(O('iv-std-p'), body);
    gset(rules, { '--ow-rl': 0 }); hideNow([line].concat(ps));
    let tl = null;
    headAt(room, h2, skip => {
      tl = gsap.timeline();
      settleIn(tl, line, G.body.at, { d: G.body.duration });
      if (rules.length) tl.to(rules, { '--ow-rl': 1, duration: G.hairline.duration, ease: G.DRAW, stagger: GROUP }, G.hairline.at);
      settleIn(tl, ps, G.body.at + 0.25, { y: G.detail.y, d: G.detail.duration, st: GROUP });
      if (skip) tl.progress(1); addFF(room, () => ffTl(tl));
    });
    track('care body', () => tl);
  }


  /* ---------- the keyboard (investors.js): a control reached before its one-shot reveal has played is shown at once; when
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

  /* ---------- a resize keeps your place (investors.js): the hold you are in (found again by its name), or the room and how far
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

  /* for the checks */
  W.gfxInvestors = {
    version: W.__gfxInvestorsV2,
    status: () => STATUS.map(s => { const t = safe('status', s.get); return { name: s.name, progress: t && typeof t.progress === 'function' ? +t.progress().toFixed(3) : null }; }),
    stage: () => { const S = safe('stage', () => mcStage(!!gsap && !H.classList.contains('gfx-static') && !REDUCE)); if (!S) return null; const v = S.vids[S.cur]; return { cur: S.cur, rested: S.rested, playing: !!v && !v.paused && !v.ended, t: v ? +v.currentTime.toFixed(2) : null, poster: v ? v.getAttribute('poster') : null }; },
    refresh: () => refresh()
  };
})();
