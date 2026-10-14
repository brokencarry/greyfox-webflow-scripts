/*!
 * Grey Fox · Home v2 motion (Webflow page script)
 * Version 1.0.6 · 2026-10-14 · one bundle, one IIFE, front-end only (nothing secret).
 *
 * 1.0.1 (live QA on staging, hv2qa): the designer's IX3 page interactions (copied with the page; class-wide on
 *   .display-1/.heading-2/.paragraph/.divider/…) are held back on this page (they split and hid the hero, moved the
 *   headings under the arrows and logged the "GSAP target not found" warnings); the nav flips OUR copy's Dark variant
 *   (6001bf23…, not the designer's 18cfdf2b…); v14's motion-mode layout (held standard 96/64 + 48 gap, pull quote gap,
 *   case head, 800 px-tall and 1100 px-tall screens, the ≥1800 px rules: process draw and figures, footer links),
 *   the phone's compact ridge above the case studies (sbx7.js §4), the portal still's phone crops, the pause-motion
 *   control and the skip link, hover marks on the buttons, eager logos, Financial Services' panel on phones;
 *   ?gfm=0 turns the whole script off.
 * 1.0.2 (final live verification, hv2fin): footer links keep their normal size above 1800 px (founder's call; v14
 *   shrank them to 16); the nav's hover marks take the on-dark tone over the film (v14 .navigation_wrapper.regular);
 *   the LinkedIn marks rise into their ↗ (.gfx-team-arw as the glyph); DM Sans 200 is loaded (the footer's small
 *   links; the site's loader stops at 300); reduced motion / no motion library at ≥992: industries in two columns
 *   (64/48 gaps, 64 top, hairline under the heading), the process stage one screen tall and centred, the case
 *   stage's v14 gap, the team's 15vh hold margin (v14 html.gf-m1 keeps it); the close + footer fill the last
 *   screen there too.
 * 1.0.3 (batch1, PORT-1013j): the process figures are part of the film: each lands as its part of the drawing
 *   completes (hairline → odometer roll → caption: 92,631 at 0.62/1.05/1.28, 1 in 3 at 1.50/1.92/2.16, 10 days at
 *   2.30/2.70/2.94 s); phones: hairline 0, roll 0.3, caption 0.55 as each figure arrives (the right one of a pair
 *   G.group later). The figures' green (#2F9A6C) is set in Webflow styles, the reels' baseline in the styles Embed.
 * 1.0.5 (herostill, 10/14; built on 1.0.3, since 1.0.4 = the big arrow, removed): the hero is a still photograph (the
 *   founder's de-icing shot) in the Embed "gfx hero still" (.gfx-hero-still, first child of .hero__video, under
 *   .gfx-hero-shade). The designer's film stays in his block, hidden by that Embed's CSS; this script holds its sources
 *   back as the parser adds them (so the film is never fetched) and gives them back if the page has no still. The
 *   photograph settles once, 1.04 → 1 over 7 s on the SETTLE curve, from the headline's cue (heroIn); reduced motion,
 *   no library, ?gfm=0 and the failsafe: still at rest. The scroll breath stays on the portraits (not the hero).
 * 1.0.6 (pausemv, 10/14, founder): "Pause motion" leaves the hero's bottom left for the standard room: it sits beside
 *   "Firms we represent" (.gfx-logos-label), the logos' label, as on the Owners page (owners-v2-motion.js: a slot in
 *   the label's row, 48 px on, centred = on the label's baseline, ink-2 / ink on hover, 44 px tall on phones; the slot
 *   keeps the label's line, so nothing moves; on a narrower row the gap gives way first, down to 16 px, the words never
 *   break, and below that the control takes the next line). It still pauses the logos (and a film, if one shows) and keeps the one
 *   gfx-still choice with Owners and Investors. Focus on it brings the firms' row in if its beat has not come yet; the
 *   hero-cover visibility rule for it is gone (it no longer belongs to the hero).
 *
 * WHAT IT IS
 *   The approved local prototype's motion (prototype/v14.html, "A+") ported onto the Webflow page Home v2
 *   (/home-v2, page 6ace6f7b7422f227be0447ed). The DOM is built natively in Webflow; this script only animates it.
 *   It finds the page through the gfx- classes listed in audit/webflow-build/home-v2-dom.md and the few designer
 *   classes that contract names. Every room is guarded: missing elements are skipped silently; nothing throws.
 *
 * PORTED FROM (v14 layers, active code paths only; DOM building, copy rewriting and removed rooms skipped)
 *   gf-grammar.js        verbatim, below (section 0)
 *   sbx-m1.js            the conductor: room() timelines, the order, makeMark arrows, holds, seams, caps, breath
 *   sbx7.js              the curtains (held room + dim + seam hairline), sbxTopOf (here: flowY), keyboard reach
 *   sbx4.js              case studies: held climb, V6 ridge in the rail's pixels, drawClimb/campReveal, go(),
 *                        the standard's held beats, the hero hold
 *   sbx5.js              odometer figures, hover marks
 *   sbx.js               Lenis, the intro (line + fly + curtain), the hero order, the nav's away state and tone
 *   sbx10.js             logo marquee (44 s, pause on hover / off screen)
 *   sbx11.js             curtain order, focus finishes a pending reveal, the close + footer fill the last screen
 *   sbx-process.js       the process room, "simpler" (pr-v-s) film; phone parts
 *   sbx13-ind.js         industries "reel" (M1: scroll picks the sector, time plays it)
 *   sbx13-ins.js         Insights cover: the green facet outline (cv-rule), arrows on "Read the article"
 *   (sbx8/9/12, sbx-plane2, sbx-process-r2, sbx-content: nothing active for Home v2 in v14's flags)
 *
 * WEBFLOW NOTES
 *   - Register as a page script in the page HEADER (Home v2 only). Safe in the header: before DOMContentLoaded it only
 *     (a) sets a few classes on <html>, (b) appends one <style id="gfx-motion-css"> to <head>, (c) traps window.Lenis,
 *     (d) queues an IX2 stop on Webflow.push. Everything else waits for DOMContentLoaded + the libraries + the fonts.
 *   - GSAP + ScrollTrigger + SplitText: taken from the page (the site-wide footer code loads 3.15.0 from Webflow's CDN;
 *     Webflow's built-in GSAP works too). If they are still missing at load (or 2.5 s after DOMContentLoaded), the
 *     script loads them itself from cdn.jsdelivr.net/npm/gsap@<page gsap version, else 3.13.0>/dist/*.min.js.
 *   - Lenis: ONE instance with v14's settings ({ lerp: .085, wheelMultiplier: .95, smoothWheel: true }), driven by
 *     gsap.ticker. The site-wide footer code runs `new Lenis({duration: 2, ...})` with its own rAF loop on every page;
 *     this script traps the global (Object.defineProperty on window.Lenis) so that call receives the shared instance,
 *     whose public raf() is a no-op (only the GSAP ticker steps it, never twice a frame). On touch screens and with
 *     reduced motion that call receives an inert stub (native scrolling, as v14). If no Lenis library is on the page
 *     the script loads https://unpkg.com/lenis@1.1.18/dist/lenis.min.js. If a foreign Lenis already exists (this script
 *     registered in the footer instead), it leaves it alone and uses native scroll events.
 *   - Webflow Interactions (IX2) never ran in v14: this page's IX2 (preloader, reveal blocks, heading reveals copied
 *     from the designer's Home) is stopped with Webflow.require('ix2').destroy(), and the initial inline states IX2
 *     left (opacity 0 on [data-w-id] elements, the preloader, the reveal blocks, the dividers) are cleared before the
 *     rooms set their own start states. The w-nav mobile menu, the IX3 button component and the embed scripts
 *     (door arrows, clocks) are not touched.
 *   - Reduced motion: no tween, no hold, no smooth scroll, no marquee. The settled page: every chapter, sector and
 *     step on view (stacked layouts via the injected CSS), the arrows under "engage", "standard" and "human" and the
 *     cover's outline drawn, the reveal blocks off, the hero film paused. The same settled layout is used if the
 *     motion libraries cannot load (html.gfx-static).
 *   - ?gfxdebug logs guarded failures to the console (silent otherwise). ?intro (force) / ?intro=0 (skip) the opening.
 */
(function () {
  'use strict';
  var W = window, D = document;
  if (W.__gfxHomeV2) return;
  // ?gfm=0: the page exactly as Webflow serves it, with none of this script (for checks and for testing a new build)
  if (/[?&]gfm=0(&|$)/.test(location.search)) { W.__gfxHomeV2 = 'off'; return; }
  W.__gfxHomeV2 = '1.0.6';

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
  const log = (where, e) => { if (DEBUG) { try { console.warn('[gfx] ' + where, e); } catch (x) { /* nothing */ } } };
  const safe = (where, fn) => { try { return fn(); } catch (e) { log(where, e); return undefined; } };
  const mq = q => { try { return W.matchMedia(q).matches; } catch (e) { return false; } };
  const REDUCE = !!G.reduced();
  const TOUCH = mq('(pointer: coarse)');
  const DESK = '(min-width: 992px) and (min-height: 681px)';    // holds, joins, the film (v14 DESK)
  const WIDE = '(min-width: 992px)';                             // the reel holds on any wide screen (sbx13-ind.js)
  const SMALL = '(max-width: 991px), (max-height: 680px)';       // the case studies without their hold
  const store = { get: k => { try { return W.sessionStorage.getItem(k); } catch (e) { return null; } }, set: (k, v) => { try { W.sessionStorage.setItem(k, v); } catch (e) { /* private mode */ } } };
  const HOLDS = { standard: G.hold.standard, cases: 1.7, process: G.hold.standard, team: 0.15, industries: 2.0 };   // sbx-m1.js GF_HOLDS
  const GROUP = G.group, LEAVE = G.leave;
  const MOTIF = true;   // v14: GF_MOTIF (the line, the arrow, the breath)

  const CSS = `
.gfx-flow-mark{display:block;height:0;width:100%;margin:0;pointer-events:none}
html.gfx-js:not(.gfx-intro) .preloader{display:none!important}
html.gfx-intro .preloader{display:flex!important;opacity:1!important;transform:none}
html.gfx-intro body{overflow:hidden}
html.gfx-intro .preloader .logo-full{opacity:0}
html:not(.gfx-m) .gfx-team-pic .reveal_block,html.gfx-failsafe .gfx-team-pic .reveal_block,html.gfx-noreveal .gfx-team-pic .reveal_block{display:none!important}
@media (prefers-reduced-motion:reduce){.gfx-team-pic .reveal_block{display:none!important}}
.gfx-nav{display:block!important;opacity:1!important}
.footer_section_wrapper{position:relative;z-index:6}
html.gfx-m:not(.gfx-rooms):not(.gfx-failsafe) .gfx-open{visibility:hidden;animation:gfx-late 0s linear 3.5s forwards}
.gfx-mark{position:absolute;left:0;top:0;overflow:visible;pointer-events:none;z-index:2}
.gfx-mark path{fill:none;stroke:var(--primary,#156946);stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter}
.gfx-mark.on-dark path,.gfx-intro-mark path{stroke:#2f9a6c}
.preloader .gfx-mark{position:fixed}
.gfx-fly{position:fixed;left:0;top:0;z-index:1000;visibility:hidden;transform-origin:0 0;pointer-events:none;overflow:hidden}
.gfx-fly-png{position:absolute;max-width:none}.gfx-fly-svg{position:absolute;inset:0;width:100%;height:100%;opacity:0}
@keyframes gfx-late{to{opacity:1;visibility:visible}}
html.gfx-m:not(.gfx-ready):not(.gfx-failsafe) .gfx-hero-h{visibility:hidden;animation:gfx-late 0s linear 3.5s forwards}
html.gfx-m:not(.gfx-ready):not(.gfx-failsafe) .gfx-hero-p{opacity:.32;animation:gfx-late .6s ease 3.8s forwards}
html.gfx-m:not(.gfx-ready):not(.gfx-failsafe) .gfx-hero-content .hero_buttons{opacity:0;animation:gfx-late .6s ease 4.1s forwards}
.gfx-nav{--gfx-away:0}
.gfx-nav .navigation-wrap>:not(.logo-link){transform:translate3d(0,calc(var(--gfx-away) * -110px),0);opacity:calc(1 - var(--gfx-away))}
.gfx-nav.gfx-away{pointer-events:none}.gfx-nav.gfx-away .logo-link{pointer-events:auto}
.gfx-nav .navigation_items,.gfx-nav .nav_desktop>a.navigation-item,.gfx-nav .nav-button,.gfx-nav .nav-button .navigation-item{transition:opacity .333s,background-color .35s,color .35s}
@media (min-width:992px){.gfx-nav.gfx-on-dark .navigation_items{background-color:rgba(22,22,22,.72)!important}}
.gfx-nav.gfx-on-dark .nav_desktop>a.navigation-item{color:#fff!important}
.gfx-nav.gfx-on-dark .button_wrapper.show .nav-button{background-color:#fff}
.gfx-nav.gfx-on-dark .button_wrapper.show .nav-button .navigation-item{color:#1e1e1e}
.gfx-nav.gfx-on-dark [class^="hamburger_line"],.gfx-nav.gfx-on-dark [class*=" hamburger_line"]{background-color:#fff!important}
.gfx-nav.gfx-top .nav_desktop>a.navigation-item{text-shadow:0 1px 14px rgba(0,0,0,.55)}
.gfx-nav.gfx-top [class^="hamburger_line"],.gfx-nav.gfx-top [class*=" hamburger_line"]{background-color:#fff!important}
@media (max-width:767px){.gfx-nav{transform:translate3d(0,calc(var(--gfx-away) * -110%),0)}.gfx-nav .navigation-wrap>:not(.logo-link){transform:none;opacity:1}}
html.gfx-m{--gfx-zone:74px}
html.gfx-caps .gfx-capped{clip-path:inset(0)}
.gfx-cap{display:block;position:fixed;top:0;left:0;right:0;z-index:40;height:var(--gfx-zone,74px);margin:0;background-color:inherit;pointer-events:auto;-webkit-mask-image:linear-gradient(180deg,#000 calc(100% - 14px),transparent);mask-image:linear-gradient(180deg,#000 calc(100% - 14px),transparent)}
html.gfx-reel .gfx-ind>.gfx-cap{display:none}
@media (max-width:767px){html.gfx-m{--gfx-zone:96px}.gfx-cap{transition:transform .6s cubic-bezier(.19,1,.22,1)}html.gfx-bar-away .gfx-cap{transform:translate3d(0,-100%,0);transition-duration:.45s;transition-timing-function:cubic-bezier(.55,.085,.68,.53)}}
.gfx-seam{position:absolute;left:0;right:0;top:0;height:1px;z-index:45;pointer-events:none;display:block;background:rgba(14,14,14,.12);transform-origin:0 50%;transform:scaleX(0)}
.gfx-seam.on-dark{background:rgba(255,255,255,.2)}
.gfx-dim{position:absolute;left:0;top:0;right:0;bottom:0;z-index:50;background:#0e0e0e;opacity:0;pointer-events:none}
@media (min-width:992px) and (min-height:681px){
html.gfx-held .gfx-case-content{min-height:calc(100vh + var(--gfx-hold-cases,1.7) * 100vh)}
html.gfx-held .gfx-case-tl{position:sticky;top:0}
html.gfx-held .gfx-pr-track{height:calc(100vh + var(--gfx-hold-pr,.7) * 100vh)}
html.gfx-held .gfx-std-sec{margin-bottom:calc(var(--gfx-hold-std,.7) * 100vh)}
html.gfx-held .gfx-std-sec.gfx-std-sec.gfx-std-sec{min-height:100vh;min-height:100svh;box-sizing:border-box;padding-top:96px;padding-bottom:64px}
html.gfx-held .gfx-std-wrap.gfx-std-wrap{row-gap:48px}
html.gfx-held .gfx-team-sec{margin-bottom:calc(var(--gfx-hold-team,.15) * 100vh)}
html.gfx-held .gfx-std-sec::after,html.gfx-held .gfx-team-sec::after{content:"";position:absolute;left:0;right:0;top:100%;height:100vh;background:#fff;pointer-events:none}
html.gfx-held .gfx-std-sec.gfx-capped,html.gfx-held .gfx-team-sec.gfx-capped{clip-path:inset(0 0 -100vh 0)}
}
@media (min-width:992px) and (min-height:681px) and (max-height:860px){html.gfx-held .gfx-std-sec.gfx-std-sec.gfx-std-sec{padding-top:64px;padding-bottom:48px}html.gfx-held .gfx-std-wrap.gfx-std-wrap{row-gap:32px}}
.gfx-std-title .span-brand{display:inline-block}
@media (max-width:991px){html.gfx-m .gfx-std-grid>.gfx-std-title{align-self:flex-start}html.gfx-m .gfx-case-when{text-wrap:wrap}}
html.gfx-m .footer_section_wrapper{margin-top:-1px}
.gfx-mini{display:none}
@media (max-width:991px){
html.gfx-m .gfx-mini{display:block;position:sticky;top:0;z-index:4;height:76px;margin:0 -20px;padding:16px 20px 0;box-sizing:border-box;background:linear-gradient(180deg,#0e0e0e 0%,#0e0e0e 78%,rgba(14,14,14,0) 100%)}
.gfx-mini>svg:first-child{display:block;width:100%;height:44px;overflow:visible}
.gfx-mini-track{fill:none;stroke:rgba(255,255,255,.3);stroke-width:1}
.gfx-mini-fill{fill:none;stroke:#2f9a6c;stroke-width:2;stroke-linejoin:miter}
.gfx-mini i{position:absolute;left:20px;top:16px;width:7px;height:7px;margin:-3.5px 0 0 -3.5px;border-radius:50%;background:#0e0e0e;border:1px solid rgba(255,255,255,.56);box-sizing:border-box;transition:background .5s,border-color .5s}
.gfx-mini i.on{background:#2f9a6c;border-color:#2f9a6c}
.gfx-mini-arrow{position:absolute;left:20px;top:16px;width:14px;height:14px;overflow:visible}
.gfx-mini-arrow path{fill:none;stroke:#2f9a6c;stroke-width:1.5}
}
@media (min-width:992px) and (min-height:681px) and (max-height:800px){
html.gfx-held .gfx-case-tl{padding-top:84px;padding-bottom:20px}
html.gfx-held .gfx-case-rail{height:11vh!important;margin-top:6.5vh!important}
html.gfx-held .gfx-case-stage{margin-top:12px!important}
html.gfx-held .gfx-case-ch{row-gap:14px!important}
html.gfx-held .gfx-case-num-lead{font-size:72px!important}
html.gfx-held .gfx-case-when{font-size:48px!important}
html.gfx-held .gfx-case-leader-a{height:56px}html.gfx-held .gfx-case-lbl-a{bottom:66px}
html.gfx-held .gfx-case-leader-b{height:44px}html.gfx-held .gfx-case-lbl-b{bottom:54px}
html.gfx-held .gfx-case-leader-c{height:26px}html.gfx-held .gfx-case-lbl-c{bottom:36px}
}
.gfx-pull .gfx-attr{margin-top:5px}
@media (min-width:992px){.gfx-case-head .gfx-lead.gfx-lead.gfx-lead{margin-bottom:3.23px}}
@media (min-width:992px) and (min-height:681px){html.gfx-held .gfx-pull.gfx-pull{row-gap:14px}}
@media (min-width:992px) and (min-height:1100px){html.gfx-held .gfx-case-tl{justify-content:center}html.gfx-held .gfx-case-stage{flex:1 1 auto;max-height:760px}}
@media (min-width:1800px){
.gfx-pr .gfx-pr-draw{height:clamp(320px,40vh,480px)}
.gfx-pr .gfx-pr-fig{font-size:56px}
.gfx-pr .gfx-pr-fcap{font-size:16px}
}
@media (min-width:1800px) and (min-height:681px){html.gfx-held .gfx-case-tl{padding-top:clamp(92px,9vh,140px);padding-bottom:clamp(32px,4vh,64px)}html.gfx-held .gfx-case-ch{row-gap:clamp(40px,4.4vh,72px)}}
html.gfx-m .gfx-case-fig,html.gfx-m .gfx-case-fig-lead{position:relative;border-top-width:0}
html.gfx-m .gfx-case-fig::before,html.gfx-m .gfx-case-fig-lead::before{content:"";position:absolute;left:0;right:0;top:-1px;height:1px;background:rgba(255,255,255,.18);transform-origin:0 50%;transform:scaleX(var(--r,1))}
html.gfx-m .gfx-pr-f,html.gfx-m .gfx-pr-f-lead{position:relative;border-top-color:transparent}
html.gfx-m .gfx-pr-f::before,html.gfx-m .gfx-pr-f-lead::before{content:"";position:absolute;left:0;right:0;top:-1px;height:1px;background:rgba(255,255,255,.14);transform-origin:0 0;transform:scaleX(var(--pr-rule,1))}
@media (min-width:992px){html.gfx-m .gfx-pr-capbox{position:relative;border-top-color:transparent}html.gfx-m .gfx-pr-capbox::before{content:"";position:absolute;left:0;right:0;top:-1px;height:1px;background:rgba(255,255,255,.14);transform-origin:0 0;transform:scaleX(var(--pr-rule,1))}}
.gfx-case-lbl-t{transition:color .6s}
html.gfx-m .gfx-case-dot{transition:background-color .6s,border-color .6s,box-shadow .6s}
html.gfx-m [class*="gfx-case-stop-"]:not(.gfx-dot-on) .gfx-case-dot{background-color:#0e0e0e;border-color:rgba(255,255,255,.56);box-shadow:none}
html.gfx-m [class*="gfx-case-stop-"]:not(.gfx-passed) .gfx-case-lbl-t{color:rgba(255,255,255,.56)}
html.gfx-m [class*="gfx-case-stop-"]{cursor:pointer;outline:none}
html.gfx-m [class*="gfx-case-stop-"]:focus-visible>[class*="gfx-case-lbl-"]{outline:1px solid #2f9a6c;outline-offset:6px}
html.gfx-m [class*="gfx-case-stop-"]::before{content:"";position:absolute;left:-18px;top:-18px;width:36px;height:36px;border-radius:50%}
gfx-odo{display:inline-block;vertical-align:top;height:1em;line-height:1;overflow:hidden}
gfx-reel{display:block;position:relative;line-height:1}
gfx-reel::before{content:attr(data-seq);content:attr(data-seq) / "";position:absolute;left:0;right:0;bottom:100%;white-space:pre;text-align:center;line-height:1}
gfx-sym,gfx-vis{display:inline}
.gfx-sr{position:absolute!important;width:1px!important;height:1px!important;padding:0!important;margin:-1px!important;overflow:hidden!important;clip:rect(0 0 0 0)!important;clip-path:inset(50%)!important;white-space:nowrap!important;border:0!important}
html.gfx-m .gfx-team-pic{--fx-to:40px;clip-path:polygon(0 0,calc(100% - var(--fx,var(--fx-to))) 0,100% calc(var(--fx,var(--fx-to)) * .787),100% 100%,0 100%)}
@media (max-width:991px){html.gfx-m .gfx-team-pic{--fx-to:28px}}
html.gfx-m .gfx-arriving .gfx-team-img{transition:filter .9s cubic-bezier(.19,1,.22,1)}
html.gfx-breath .hero__video video,html.gfx-breath .gfx-team-img,html.gfx-breath .gfx-ind-img{transform-origin:50% 50%}
@media (prefers-reduced-motion:no-preference){html.gfx-m:not(.gfx-failsafe):not(.gfx-static) .gfx-hero-still img{transform:scale(1.04)}}
html.gfx-m .gfx-marq{-webkit-mask-image:linear-gradient(90deg,transparent 0,#000 8%,#000 92%,transparent 100%);mask-image:linear-gradient(90deg,transparent 0,#000 8%,#000 92%,transparent 100%)}
html.gfx-m .gfx-marq .gfx-marq-track{flex-wrap:nowrap;width:max-content;animation:gfx-marq 44s linear infinite}
.gfx-marq:hover .gfx-marq-track,.gfx-marq.gfx-off .gfx-marq-track{animation-play-state:paused}
@keyframes gfx-marq{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.gfx-ind-edge{position:absolute;left:0;top:0;pointer-events:none;opacity:0;overflow:visible}
.gfx-ind-edge path{fill:none;stroke:#2f9a6c;stroke-width:1.5}
html.gfx-m .gfx-ind-go-m{transition:transform .6s cubic-bezier(.19,1,.22,1)}
html.gfx-m .gfx-ind-go{transition:color .6s cubic-bezier(.19,1,.22,1)}
html.gfx-m .gfx-ind-go:hover{color:#fff}
.gfx-ind-go:focus-visible{outline:2px solid #fff;outline-offset:2px}
html.gfx-reel .gfx-ind-bar-fill{width:100%;transform-origin:0 50%}
.gfx-cv-rule{position:absolute;left:0;top:0;overflow:visible;pointer-events:none}
.gfx-cv-rule path{fill:none;stroke:var(--primary,#156946);stroke-width:1;stroke-dasharray:1;stroke-dashoffset:0}
.gfx-arw{width:12px;height:12px;flex:none;overflow:visible;color:var(--primary,#156946);transition:transform .6s cubic-bezier(.19,1,.22,1)}
.gfx-arw path{fill:none;stroke:currentColor;stroke-width:1.5;stroke-linecap:butt;stroke-linejoin:miter}
a:hover .gfx-arw{transform:translate(2px,-2px)}
.gfx-hm{position:absolute;left:0;top:0;overflow:visible;pointer-events:none;z-index:3}
.gfx-hm path{fill:none;stroke:var(--primary,#156946);stroke-width:1.5;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:1;stroke-dashoffset:1}
.gfx-hm.on-dark path{stroke:#2f9a6c}
.gfx-hm .h1{transition:stroke-dashoffset .5s cubic-bezier(.7,0,.84,0) .12s}.gfx-hm .h2{transition:stroke-dashoffset .16s cubic-bezier(.7,0,.84,0) 0s}
.gfx-hm-on>.gfx-hm .h1{stroke-dashoffset:0;transition:stroke-dashoffset .75s cubic-bezier(.86,0,.07,1) 0s}
.gfx-hm-on>.gfx-hm .h2{stroke-dashoffset:0;transition:stroke-dashoffset .42s cubic-bezier(.19,1,.22,1) .62s}
.gfx-hm-host .gfx-arw,.gfx-hm-host .gfx-btn-arw{transition:opacity .35s cubic-bezier(.19,1,.22,1) .5s,transform .6s cubic-bezier(.19,1,.22,1)}
.gfx-hm-on .gfx-arw,.gfx-hm-on .gfx-btn-arw{opacity:0;transition:opacity .2s ease 0s}
.gfx-hm-host.button .button_overlap_frame{height:0!important;transition:none}
.gfx-hm-host .button-content-wrapper:hover,.gfx-hm-host.button:hover .button-content-wrapper{opacity:1!important}
.gfx-hm-host.button[class*="79f0400b-0395-da6b-f809-b97c64b85a41"]:hover{background-color:#fff}
.gfx-hm-host:focus-visible{outline:none}
.gfx-skip{position:fixed;left:16px;top:12px;z-index:10000;padding:10px 16px;background:#0e0e0e;color:#fff;font:500 14px/1 "DM Sans",sans-serif;text-decoration:none;transform:translateY(-160%);transition:transform .3s}
.gfx-skip:focus,.gfx-skip:focus-visible{transform:none;outline:2px solid #2f9a6c;outline-offset:2px}
.gfx-logos-label.gfx-firms-head{display:flex;flex-wrap:wrap;align-items:center;justify-content:flex-start;column-gap:clamp(16px,100% - 264px,48px);white-space:nowrap}
.gfx-motion-slot{display:inline-flex;align-items:center;min-width:9.5em;height:1.2em;height:1lh}
.gfx-motion{display:inline-flex;align-items:center;gap:8px;margin:-5px 0;padding:6px 0;background:none;border:0;cursor:pointer;font:400 14px/1 "DM Sans",sans-serif;letter-spacing:0;text-transform:none;color:#585e6b}
.gfx-motion:hover{color:#1e1e1e}
.gfx-motion i{display:inline-block;width:8px;height:9px;border-left:2px solid currentColor;border-right:2px solid currentColor;box-sizing:border-box}
.gfx-motion[data-still="true"] i{width:0;height:0;border:0;border-left:8px solid currentColor;border-top:5px solid transparent;border-bottom:5px solid transparent}
html.gfx-still .gfx-marq-track{animation-play-state:paused!important}
@media (max-width:767px){.gfx-motion-slot{min-width:0}html button.gfx-motion{min-height:44px;padding-top:0;padding-bottom:0;margin-top:-12px;margin-bottom:-12px;box-sizing:border-box;font-size:16px}html .gfx-skip{padding-top:15px;padding-bottom:15px}}
.gfx-nav .navigation-item.button-text:hover,.footer_section_wrapper .footer-link.button-text:hover{opacity:1!important}
@media (min-width:992px) and (max-height:680px){
html.gfx-m .gfx-case-tl{height:auto}html.gfx-m .gfx-case-stage{display:block}
html.gfx-m .gfx-case-ch{opacity:1;pointer-events:auto;padding:56px 0;border-top:1px solid rgba(255,255,255,.14)}
html.gfx-m .gfx-pr-track{height:auto}html.gfx-m .gfx-pr-stage{position:relative;height:auto}
}
@media (prefers-reduced-motion:reduce){
html .gfx-case-tl{height:auto}html .gfx-case-rail{display:none!important}html .gfx-case-stage{display:block;margin-top:clamp(20px,4vh,40px)}
html .gfx-case-ch{opacity:1!important;pointer-events:auto;padding:56px 0;border-top:1px solid rgba(255,255,255,.14)}
html .gfx-pr-track{height:auto!important}html .gfx-pr-stage{position:relative!important;height:auto!important}
html .gfx-ind-reel{display:none!important}html .gfx-ind-mhead{display:block}
html .gfx-seam{transform:none}html .gfx-cap{transform:none}
}
@media (prefers-reduced-motion:reduce) and (min-width:992px) and (min-height:681px){html .gfx-team-sec{margin-bottom:calc(var(--gfx-hold-team,.15) * 100vh)}}
@media (prefers-reduced-motion:reduce) and (min-width:992px){
html .gfx-case-stage{margin-top:clamp(14px,2.6vh,28px)}
html .gfx-pr-stage{min-height:100vh;display:flex;flex-direction:column;justify-content:center}
html .gfx-ind{padding:64px 48px clamp(144px,6.4vw,168px)}html .gfx-ind-mhead{padding-bottom:60px;border-bottom:1px solid rgba(255,255,255,.14)}
html .gfx-ind-flat{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:48px;row-gap:64px;margin-top:48px}
}
@media (prefers-reduced-motion:reduce) and (max-width:991px){html .gfx-ind{padding:64px 20px 96px}html .gfx-ind-flat{grid-template-columns:1fr}}
html.gfx-static .gfx-case-tl{height:auto}html.gfx-static .gfx-case-rail{display:none!important}html.gfx-static .gfx-case-stage{display:block;margin-top:0}
html.gfx-static .gfx-case-ch{opacity:1!important;pointer-events:auto;padding:56px 0;border-top:1px solid rgba(255,255,255,.14)}
html.gfx-static .gfx-pr-track{height:auto!important}html.gfx-static .gfx-pr-stage{position:relative!important;height:auto!important}
html.gfx-static .gfx-ind-reel{display:none!important}html.gfx-static .gfx-ind-mhead{display:block}
@media (min-width:992px) and (min-height:681px){html.gfx-static .gfx-team-sec{margin-bottom:calc(var(--gfx-hold-team,.15) * 100vh)}}
@media (min-width:992px){html.gfx-static .gfx-pr-stage{min-height:100vh;display:flex;flex-direction:column;justify-content:center}html.gfx-static .gfx-ind{padding:64px 48px clamp(144px,6.4vw,168px)}html.gfx-static .gfx-ind-mhead{padding-bottom:60px;border-bottom:1px solid rgba(255,255,255,.14)}html.gfx-static .gfx-ind-flat{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:48px;row-gap:64px;margin-top:48px}}
`;

  safe('head', () => {
    H.classList.add('gfx-js');
    if (!REDUCE) H.classList.add('gfx-m');
    const qs = location.search;
    const intro = !REDUCE && !/[?&]intro=0(&|$)/.test(qs) && (/[?&]intro(&|=1|$)/.test(qs) || (!location.hash && !store.get('gfx-intro-seen')));
    if (intro) H.classList.add('gfx-intro');
    H.style.setProperty('--gfx-hold-std', HOLDS.standard);
    H.style.setProperty('--gfx-hold-cases', HOLDS.cases);
    H.style.setProperty('--gfx-hold-pr', HOLDS.process);
    H.style.setProperty('--gfx-hold-team', HOLDS.team);
    if (!D.getElementById('gfx-motion-css')) {
      const st = D.createElement('style'); st.id = 'gfx-motion-css'; st.textContent = CSS;
      (D.head || H).appendChild(st);
    }
    filmHold();
    // v14 loads DM Sans 200 (the footer's small links, city labels and clocks); the site's font loader stops at 300
    if (!D.getElementById('gfx-dmsans-200')) {
      const ln = D.createElement('link'); ln.id = 'gfx-dmsans-200'; ln.rel = 'stylesheet';
      ln.href = 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@200&display=swap';
      (D.head || H).appendChild(ln);
    }
  });

  /* 1.0.5 · the hero photograph: the designer's film is hidden by the "gfx hero still" Embed's CSS, so it must not load
     either. Run from the header, before the body is parsed: an observer takes the film's sources away as the parser adds
     them (its callback runs before the media element's own source selection, so nothing is fetched). At
     DOMContentLoaded: no still on the page (the Embed removed) → the film gets its sources back and plays as before. */
  function filmHold() {
    if (!W.MutationObserver) return;
    const held = [];
    const strip = v => {
      if (!v.hasAttribute('data-gfx-held')) { v.setAttribute('data-gfx-held', ''); v.removeAttribute('autoplay'); v.preload = 'none'; held.push(v); }
      if (v.getAttribute('src')) { v.setAttribute('data-gfx-src', v.getAttribute('src')); v.removeAttribute('src'); }
      Array.prototype.forEach.call(v.querySelectorAll('source[src]'), s => { s.setAttribute('data-gfx-src', s.getAttribute('src')); s.removeAttribute('src'); });
    };
    const scan = () => Array.prototype.forEach.call(D.querySelectorAll('.hero__video > video'), strip);
    const mo = new MutationObserver(recs => {
      for (const r of recs) for (const n of r.addedNodes) {
        if (n.nodeName === 'VIDEO' || n.nodeName === 'SOURCE') { scan(); return; }
      }
    });
    mo.observe(D.documentElement, { childList: true, subtree: true });
    const done = () => {
      mo.disconnect(); scan();
      if (D.querySelector('.gfx-hero-still')) return;
      held.forEach(v => {
        v.removeAttribute('data-gfx-held');
        if (v.getAttribute('data-gfx-src')) v.setAttribute('src', v.getAttribute('data-gfx-src'));
        Array.prototype.forEach.call(v.querySelectorAll('source[data-gfx-src]'), s => s.setAttribute('src', s.getAttribute('data-gfx-src')));
        v.setAttribute('autoplay', ''); v.preload = 'auto'; v.load();
        const p = v.play && v.play(); if (p && p.catch) p.catch(() => {});
      });
    };
    if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', done, { once: true }); else done();
  }
  const heroFilmOn = v => !!v && !v.hasAttribute('data-gfx-held') && getComputedStyle(v).display !== 'none';

  // the failsafe: if the motion never takes the page (a blocked CDN, an error), everything shows (v14: sbx-failsafe)
  const failsafe = () => {
    if (H.classList.contains('gfx-ready')) return;
    H.classList.add('gfx-failsafe'); H.classList.remove('gfx-intro'); ix3Late();
    safe('failsafe', () => { const p = D.querySelector('.page-wrapper'); p && p.removeAttribute('inert'); });
  };
  setTimeout(failsafe, 6000);

  /* ---------- Lenis: one instance, v14's settings, one clock ---------- */
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

  /* ---------- Webflow IX2: v14 never ran it. IX2 binds to [data-w-id]: the attribute is removed as each element is
     parsed (mutation records are delivered before each parser-inserted script, so before webflow.js starts IX2). This
     detaches the designer's hero/close "Navbar Reset/Change" (they target .navigation_wrapper.solid, which our nav
     carries), the team "Reveal" and the "Divider Animation". The nav (hamburger) and component buttons keep theirs.
     The value is kept as data-gfx-wid. A destroy() of IX2 follows as a second line of defence. ---------- */
  // the Dark variant of OUR nav copy, 'gfx Navigation (Home v2)' (the solid bar). 1.0.0 named the designer's Navigation's
  // Dark variant (18cfdf2b…), which our copy does not carry, so the bar never took its regular look over the film. The
  // copy's variant class is read from its root (data-wf--gfx-navigation-home-v2--variant) as it is parsed.
  let NAV_VAR = 'w-variant-6001bf23-3a7c-ba13-070d-00867ad512f5';
  const KEEP = '.navigation_wrapper, .button, [data-wf-component-id]';
  let navTop = true;   // the page opens at the top: the bar wears the regular look (no variant) over the film
  const strip = el => {
    if (!el || el.nodeType !== 1) return;
    const one = x => {
      if (x.hasAttribute('data-wf--gfx-navigation-home-v2--variant')) { const c = Array.prototype.find.call(x.classList, k => k.indexOf('w-variant-') === 0); if (c) NAV_VAR = c; }
      if (x.hasAttribute('data-w-id') && !x.closest(KEEP)) { x.setAttribute('data-gfx-wid', x.getAttribute('data-w-id')); x.removeAttribute('data-w-id'); }
      if (navTop && x.classList.contains(NAV_VAR) && x.closest('.gfx-nav')) { x.classList.remove(NAV_VAR); x.setAttribute('data-gfx-var', ''); }
    };
    one(el);
    if (el.firstElementChild) Array.prototype.forEach.call(el.querySelectorAll('[data-w-id], [data-wf--gfx-navigation-home-v2--variant], .' + NAV_VAR), one);
  };
  let ixObs = null;
  safe('ix2 strip', () => {
    ixObs = new MutationObserver(ms => ms.forEach(m => Array.prototype.forEach.call(m.addedNodes, strip)));
    ixObs.observe(H, { childList: true, subtree: true });
    if (D.body) strip(D.body);
  });
  /* ---------- Webflow Interactions 3 (html.w-mod-ix3): the designer's PAGE interactions were copied with the page, and
     they are class-wide: on load the nav slides down, every .display-1 is split into lines that rise, the hero paragraph
     and buttons rise; on scroll every .heading-2/.heading-3/.heading-4/.paragraph/.p fades up 20-100%, every .divider
     grows over 3 s, the team members drift 60/120/180 px and the close's padding wrapper scales from 0.9. On Home v2 they
     land on our rooms (which reuse those designer classes) and fight this script: the hero headline was split twice and
     its paragraph left at 0.32, the arrows were measured mid-rise, and the dozen interactions aimed at the hidden
     designer sections log "GSAP target not found". v14 never ran them. So, on this page only, the IX3 register call is
     handed only the interactions of components that have a rendered instance on this page (none today: his Button
     instances are display:none here, his Navigation is replaced by our copy); the page-scoped ones are held back. His interactions themselves are untouched (every other page still runs them). Webflow publishes them as
     Webflow.require('ix3').getInstance().register([...interactions], [...timelines]) inside webflow.js, after
     `window.Webflow = <the core object>`: the global is trapped (as Lenis is) so its require() hands back a wrapped
     ix3 module whose instance filters the list. ---------- */
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
          // kept: an interaction of a component that has an instance on this page (none of his do once his Button
          // instances sit in the hidden holder; his Button hovers aimed at no instance log the "target not found"s)
          // (rendered: his Button instances stay in the markup on Home v2 but the page's styles Embed sets them display:none)
          const onPage = x => { const sc = x && x.scope; if (!sc || sc.type !== 'component') return false; try { return Array.prototype.some.call(D.querySelectorAll('[data-wf-component-id="' + sc.componentId + '"]'),e => e.getClientRects().length > 0); } catch (e) { return true; } };
          if (Array.isArray(ints)) args[0] = ints.filter(x => { const keep = onPage(x); if (!keep) HELD_IX3.push(x && x.id); return keep; });
          if (DEBUG && HELD_IX3.length) log('ix3: interactions held back on Home v2', HELD_IX3.join(' '));
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
  // his IX3 head style keeps the classes it animates hidden until html.w-mod-ix3; if IX3 never gets ready, show them
  const ix3Late = () => { if (!H.classList.contains('w-mod-ix3')) H.classList.add('w-mod-ix3'); };
  const stopIX2 = () => safe('ix2', () => {
    const wf = W.Webflow; if (!wf || typeof wf.require !== 'function') return;
    const ix = wf.require('ix2'); if (ix && typeof ix.destroy === 'function') ix.destroy();
  });
  safe('ix2 queue', () => { W.Webflow = W.Webflow || []; W.Webflow.push(stopIX2); });

  /* ========================= 2 · shared helpers ========================= */
  const $ = (s, r) => (r || D).querySelector(s);
  const $$ = (s, r) => Array.prototype.slice.call((r || D).querySelectorAll(s));
  const NS = 'http://www.w3.org/2000/svg', TAN = Math.tan(38.2 * Math.PI / 180);
  const shown = el => !!el && el.getClientRects().length > 0 && getComputedStyle(el).display !== 'none';
  const arr = x => (x ? [].concat(x) : []).reduce((a, e) => a.concat(typeof e === 'string' ? $$(e) : [e]), []).filter(Boolean);
  const ON = 'gfx-on';
  const rgbOf = c => { const m = /rgba?\(([^)]+)\)/.exec(c || ''); if (!m) return null; const v = m[1].split(/[\s,/]+/).filter(Boolean).map(Number); return v.length > 3 && v[3] < 0.5 ? null : v.slice(0, 3); };
  const lumOf = el => { for (let e = el; e && e.nodeType === 1; e = e.parentElement) { const v = rgbOf(getComputedStyle(e).backgroundColor); if (v) return (0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]) / 255; } return 1; };
  const darkRoom = el => lumOf(el) < 0.4;
  let ST = null, gsap = null;
  const scrollToY = (y, dur) => {
    y = Math.max(0, Math.round(y));
    if (shared) shared.scrollTo(y, { duration: dur || 1.4, easing: k => 1 - Math.pow(1 - k, 4) });
    else W.scrollTo({ top: y, behavior: REDUCE ? 'auto' : 'smooth' });
  };
  const refresh = (() => { let t = 0; return () => { clearTimeout(t); t = setTimeout(() => { if (ST) ST.refresh(); }, 90); }; })();

  /* where an element sits in the page's flow, whatever is held (v14: sbxTopOf + the flow marks). A held room is
     measured at its flow mark; an inner stage that is sticky is measured at its track; anything inside them by its
     offset from that box (which a hold never changes). */
  const MARKS = new Map();
  const INNER = '.gfx-case-tl, .gfx-ind-stage, .gfx-pr-stage';
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
    if (MARKS.has(room)) return MARKS.get(room);
    const m = D.createElement('i'); m.className = 'gfx-flow-mark'; m.setAttribute('aria-hidden', 'true');
    room.parentNode.insertBefore(m, room); MARKS.set(room, m); return m;
  };
  const dropMark = room => { const m = MARKS.get(room); if (m) { m.remove(); MARKS.delete(room); } };

  /* ---------- the mark: a line under a word that turns up at the fox ear's 38.2° into the arrow (sbx-m1.js) ---------- */
  const makeMark = (host, word, opts) => {
    const o = opts || {};
    if (!host) return null;
    if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
    const svg = D.createElementNS(NS, 'svg'); svg.setAttribute('class', 'gfx-mark' + (o.cls ? ' ' + o.cls : '') + (o.dark ? ' on-dark' : '')); svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('width', '0'); svg.setAttribute('height', '0');
    const p1 = D.createElementNS(NS, 'path'), p2 = D.createElementNS(NS, 'path');
    [p1, p2].forEach(p => { p.setAttribute('pathLength', '1'); p.style.strokeDasharray = '1'; p.style.strokeDashoffset = o.drawn ? '0' : '1'; });
    svg.appendChild(p1); svg.appendChild(p2); host.appendChild(svg);
    const place = () => safe('mark', () => {
      const w0 = word(); if (!w0) return;
      const hr = host.getBoundingClientRect(); let br = w0.getBoundingClientRect(); if (!br.width) return;
      // an inline element reports its font's content box (span-brand: 61 px); v14 measured its line box (inline-block,
      // 52 px). The mark is sized from the line box, centred on the same text.
      if (!(w0 instanceof Range)) { const cs = getComputedStyle(w0), lh = parseFloat(cs.lineHeight); if (cs.display === 'inline' && lh && lh < br.height) br = { left: br.left, width: br.width, top: br.top + (br.height - lh) / 2, height: lh }; }
      const low = !!o.low, h = br.height, y = h * (low ? 1.03 : 0.96), rise = h * 0.42, run = rise / TAN, hs = h * 0.15;
      let w = br.width;
      // a full stop or comma after the word: the line runs under it and turns up clear of it
      const end = w0 instanceof Range ? w0.endContainer : (w0.nextSibling && w0.nextSibling.nodeType === 3 ? w0.nextSibling : null);
      const eo = w0 instanceof Range ? w0.endOffset : 0;
      if (end && end.nodeType === 3 && eo < end.textContent.length && /[.,;:!?]/.test(end.textContent[eo])) { const r2 = D.createRange(); r2.setStart(end, eo); r2.setEnd(end, eo + 1); w += r2.getBoundingClientRect().width + h * 0.06; }
      // where the word rests (its line may still be rising)
      const start = w0 instanceof Range ? w0.startContainer : w0;
      const lineEl = (start.nodeType === 3 ? start.parentElement : start);
      const ln = lineEl && lineEl.closest ? lineEl.closest('.gfx-line') : null;
      let dy = 0; if (ln) { const tr = getComputedStyle(ln).transform; if (tr && tr !== 'none') dy = new DOMMatrixReadOnly(tr).m42; }
      svg.style.left = (br.left - hr.left) + 'px'; svg.style.top = (br.top - hr.top - dy) + 'px';
      svg.setAttribute('width', w + run + 4); svg.setAttribute('height', h * (low ? 1.1 : 1) + 4);
      p1.setAttribute('d', `M0 ${y} H${w} L${w + run} ${y - rise}`);
      p2.setAttribute('d', `M${w + run - hs} ${y - rise} H${w + run} V${y - rise + hs}`);
    });
    const re = () => requestAnimationFrame(place);
    W.addEventListener('resize', re); D.addEventListener('gfx:resplit', re);
    if (ST) ST.addEventListener('refresh', re);
    place();
    return { svg, p1, p2, place };
  };
  const rangeOf = (root, w) => () => {
    const el = typeof root === 'string' ? $(root) : root; if (!el) return null;
    const tw = D.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    for (let n; (n = tw.nextNode());) { const i = n.textContent.indexOf(w); if (i > -1) { const r = D.createRange(); r.setStart(n, i); r.setEnd(n, i + w.length); return r; } }
    return null;
  };
  // the accent word in the standard's heading (a split can leave an empty copy of its span beside it: take the one with text)
  const brandWord = () => $$('.gfx-std-title .span-brand').filter(e => e.textContent.trim())[0] || null;
  const elRange = sel => () => { const e = typeof sel === 'string' ? $$(sel).filter(x => x.textContent.trim())[0] : sel; if (!e) return null; const r = D.createRange(); r.selectNodeContents(e); return r; };
  // the arrow, on a timeline: the line on the designer's curve, the head settling over the line's last 0.15 s
  const drawArrow = (tl, m, at) => {
    if (!m) return;
    tl.add(m.place, at)
      .to(m.p1, { strokeDashoffset: 0, autoRound: false, duration: G.hairline.duration, ease: G.DRAW }, at)
      .to(m.p2, { strokeDashoffset: 0, autoRound: false, duration: G.arrow.duration, ease: G.SETTLE }, at + G.hairline.duration - 0.15);
  };

  // "human" in the close's heading, wrapped at runtime so the arrow and the split keep it whole (sbx4.js: sbx-w-craft)
  const wrapWord = (el, word, cls) => safe('wrap', () => {
    if (!el || el.querySelector('.' + cls)) return;
    const tw = D.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    for (let n; (n = tw.nextNode());) {
      const m = new RegExp('\\b' + word + '\\b').exec(n.textContent); if (!m) continue;
      const mid = n.splitText(m.index); mid.splitText(word.length);
      const s = D.createElement('span'); s.className = cls; mid.parentNode.insertBefore(s, mid); s.appendChild(mid); return;
    }
  });

  /* the Insights cover's green outline: 14 px outside the picture, following its corner cut (sbx13-ins.js cv-rule) */
  const coverRule = drawn => safe('cover rule', () => {
    const frame = $('.gfx-ins-frame'), fig = frame && $('.gfx-ins-pic-lead', frame); if (!fig) return null;
    if (getComputedStyle(frame).position === 'static') frame.style.position = 'relative';
    let svg = $('.gfx-cv-rule', frame);
    if (!svg) { svg = D.createElementNS(NS, 'svg'); svg.setAttribute('class', 'gfx-cv-rule'); svg.setAttribute('aria-hidden', 'true'); const p = D.createElementNS(NS, 'path'); p.setAttribute('pathLength', '1'); svg.appendChild(p); frame.appendChild(svg); }
    const path = $('path', svg);
    const draw = () => safe('cover rule draw', () => {
      const Wd = fig.offsetWidth, Hd = fig.offsetHeight, o = 14; if (!Wd) return;
      const fx = W.innerWidth <= 991 ? 40 : 64;   // the frame's own facet (Webflow: 64 px, 40 px at medium)
      const L = Math.hypot(1, TAN), px = Wd - fx + o * TAN / L, py = -o / L;
      const x1 = px + (-o - py) / TAN, y2 = py + (Wd + o - px) * TAN;
      svg.setAttribute('width', Wd + 2 * o); svg.setAttribute('height', Hd + 2 * o);
      svg.setAttribute('viewBox', `${-o - 1} ${-o - 1} ${Wd + 2 * o + 2} ${Hd + 2 * o + 2}`);
      svg.style.left = (fig.offsetLeft - o - 1) + 'px'; svg.style.top = (fig.offsetTop - o - 1) + 'px';
      svg.style.width = (Wd + 2 * o + 2) + 'px'; svg.style.height = (Hd + 2 * o + 2) + 'px';
      path.setAttribute('d', `M${-o} ${Hd + o} V${-o} H${x1.toFixed(1)} L${Wd + o} ${y2.toFixed(1)} V${Hd + o} Z`);
    });
    draw();
    if ('ResizeObserver' in W) new ResizeObserver(draw).observe(fig); else W.addEventListener('resize', draw);
    path.style.strokeDashoffset = drawn ? '0' : '1';
    return path;
  });

  const ARW = '<svg class="gfx-arw" viewBox="0 0 16 16" aria-hidden="true"><path d="M1 13 L15 2"/><path d="M8.5 2 H15 V8.5"/></svg>';
  const addArrows = () => safe('arrows', () => {
    $$('.gfx-ins-go, .gfx-ins-go-row').forEach(g => { if (!g.querySelector('svg')) g.insertAdjacentHTML('beforeend', ARW); });
  });

  /* the portal still's phone crops (sbx-process.js pic(): <picture> sources at 600 px and 479 px). Webflow's Image
     element serves one picture at every width, so the narrow crops (uploaded to gfx-home) are swapped in here. */
  const CDN = 'https://cdn.prod.website-files.com/67c0e116387e8248a0d7e10a/';
  const CROPS = {
    head: [['6acea5e24c88849009a41b77_gfx-portal-head-440-dark.webp', 880, 722], ['6acea5e3ea6c7711b5aaaab8_gfx-portal-head-340-dark.webp', 1020, 900]],
    note: [['6acea5e234eb64db176f2335_gfx-portal-note-440-dark.webp', 880, 1726], ['6acea5e39eb41a72b741b228_gfx-portal-note-340-dark.webp', 1020, 3057]],
    rest: [['6acea5e395ce9bed5edef0f9_gfx-portal-rest-440-dark.webp', 880, 960], ['6acea5e334eb64db176f2367_gfx-portal-rest-340-dark.webp', 1020, 1440]]
  };
  let cropsOn = false;
  const portalCrops = () => safe('portal crops', () => {
    if (cropsOn) return; cropsOn = true;
    const imgs = Object.keys(CROPS).map(k => [k, $('.gfx-pr-p-' + k)]).filter(x => x[1]);
    if (!imgs.length) return;
    const keep = imgs.map(([, im]) => ['src', 'srcset', 'sizes', 'width', 'height'].reduce((o, a) => { o[a] = im.getAttribute(a); return o; }, {}));
    const apply = () => safe('portal crop', () => {
      const tier = mq('(max-width: 479px)') ? 1 : mq('(max-width: 600px)') ? 0 : -1;
      imgs.forEach(([k, im], i) => {
        if (tier < 0) { Object.keys(keep[i]).forEach(a => { if (keep[i][a] == null) im.removeAttribute(a); else im.setAttribute(a, keep[i][a]); }); return; }
        const [f, w, h] = CROPS[k][tier];
        if (im.getAttribute('src') === CDN + f) return;
        im.removeAttribute('srcset'); im.removeAttribute('sizes'); im.setAttribute('width', w); im.setAttribute('height', h); im.setAttribute('src', CDN + f);
      });
    });
    apply();
    ['(max-width: 479px)', '(max-width: 600px)'].forEach(q => { try { const m = W.matchMedia(q); if (m.addEventListener) m.addEventListener('change', apply); else m.addListener(apply); } catch (e) { /* old browsers */ } });
  });

  /* the skip link (sbx-content.js landmarks): the first stop for a keyboard, it takes focus into the hero */
  const skipLink = () => safe('skip', () => {
    if ($('.gfx-skip') || !D.body) return;
    const first = $('.gfx-hero-sec'); if (!first) return;
    const a = D.createElement('a'); a.className = 'gfx-skip'; a.href = '#'; a.textContent = 'Skip to content';
    a.addEventListener('click', e => { e.preventDefault(); first.setAttribute('tabindex', '-1'); first.focus({ preventScroll: true }); });
    D.body.insertBefore(a, D.body.firstChild);
  });
  /* pause motion (sbx-content.js, WCAG 2.2.2): one quiet control stops the hero film and the client logos; it holds for
     the visit. Reduced motion needs none. 1.0.6: it sits beside "Firms we represent", the logos' label, as on Owners. */
  const pauseControl = () => safe('pause', () => {
    const label = $('.gfx-logos-label'); if (!label || $('.gfx-motion')) return null;
    const btn = D.createElement('button'); btn.type = 'button'; btn.className = 'gfx-motion';
    const vids = () => $$('.gfx-hero-sec video').filter(heroFilmOn);   // (1.0.5: the held film is left alone)
    const apply = still => {
      H.classList.toggle('gfx-still', still);
      btn.dataset.still = still ? 'true' : 'false';
      btn.innerHTML = '<i aria-hidden="true"></i><span>' + (still ? 'Play motion' : 'Pause motion') + '</span>';
      vids().forEach(v => { if (still) v.pause(); else if (v.play) { const p = v.play(); if (p && p.catch) p.catch(() => {}); } });
      store.set('gfx-still', still ? '1' : '');
    };
    btn.addEventListener('click', () => apply(!H.classList.contains('gfx-still')));
    const slot = D.createElement('span'); slot.className = 'gfx-motion-slot';
    slot.appendChild(btn); label.classList.add('gfx-firms-head'); label.appendChild(slot);
    // the row arrives with the room's beat (opacity 0 until then): a keyboard that reaches the control first brings the
    // row in at once, so focus never lands on something unseen
    btn.addEventListener('focus', () => {
      const row = [label, $('.gfx-logos')].filter(e => e && +getComputedStyle(e).opacity < 1);
      if (row.length) { if (gsap) gsap.to(row, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out', overwrite: 'auto' }); else row.forEach(e => { e.style.opacity = 1; e.style.transform = 'none'; }); }
    });
    apply(store.get('gfx-still') === '1');
    vids().forEach(v => v.addEventListener('play', () => { if (H.classList.contains('gfx-still')) v.pause(); }));
    return btn;
  });

  /* the static marks of the settled page (reduced motion, or no motion library): drawn where their words rest */
  const settledMarks = () => safe('settled marks', () => {
    const hero = $('.gfx-hero-h'); if (hero) makeMark(hero.parentElement, rangeOf(hero, 'engage'), { low: true, dark: true, drawn: true });
    const std = $('.gfx-std-title'); if (std) makeMark(std, brandWord, { drawn: true });
    const ctaH = $('.gfx-cta-title .heading-2'); if (ctaH) { wrapWord(ctaH, 'human', 'gfx-w-human'); makeMark($('.gfx-cta-title'), elRange('.gfx-cta-title .gfx-w-human'), { dark: true, drawn: true }); }
    coverRule(true); addArrows();
    if (D.fonts && D.fonts.ready) D.fonts.ready.then(() => W.dispatchEvent(new Event('resize')));
  });

  /* clear what IX2 left behind (its initial states), before the rooms set their own */
  const cleanIX = () => safe('clean ix', () => {
    const clr = (el, props) => props.forEach(p => el.style.removeProperty(p));
    $$('[data-w-id]').forEach(el => {
      if (el.closest('.w-nav, .button, .nav-button')) return;   // component interactions stay as they are
      const s = el.style; if (s.opacity === '0' || s.visibility === 'hidden') clr(el, ['opacity', 'visibility', 'transform', '-webkit-transform', 'filter']);
    });
    $$('.preloader, .preloader .logo-full').forEach(el => clr(el, ['display', 'opacity', 'visibility', 'transform', '-webkit-transform']));
    $$('.gfx-team-pic .reveal_block').forEach(el => clr(el, ['display', 'opacity', 'transform', '-webkit-transform', 'width', 'height']));
    $$('.gfx-cta-sec .divider, .footer_section_wrapper .divider').forEach(el => clr(el, ['width', 'transform', '-webkit-transform']));
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
  const fontsReady = () => {
    let capped = false;
    const cap = new Promise(r => setTimeout(() => { capped = true; r(); }, 1500));
    const fr = D.fonts && D.fonts.ready ? D.fonts.ready : Promise.resolve();
    fr.then(() => { if (capped) setTimeout(() => W.dispatchEvent(new Event('resize')), 60); });
    return Promise.race([fr, cap]);
  };

  onReady(() => {
    safe('ix2 sweep', () => { strip(D.body); if (ixObs) ixObs.disconnect(); });
    skipLink();
    stopIX2(); cleanIX();
    W.addEventListener('load', () => { stopIX2(); setTimeout(ix3Late, 3000); }, { once: true });
    if (REDUCE) { reducedInit(); return; }
    Promise.all([ensureGsap(), ensureLenis()]).then(([ok]) => {
      if (!ok) { staticInit(); return; }
      safe('start', start);
    });
  });

  /* the settled page: reduced motion (v14: the static marks, the film at rest, no smooth scroll) */
  // the close and the footer fill the last screen in the settled page too (v14 sbx11.js runs with reduced motion)
  function closeFill() {
    const c = $('.gfx-cta-sec'), f = $$('.footer_section_wrapper').filter(e => e.offsetHeight)[0];
    if (!c || !f) return;
    const fit = () => { c.style.minHeight = Math.max(0, W.innerHeight - f.offsetHeight) + 'px'; };
    fit(); W.addEventListener('resize', fit);
  }
  function reducedInit() {
    safe('reduced', () => {
      $$('.hero__video video, video[autoplay]').forEach(v => { v.removeAttribute('autoplay'); if (v.pause) v.pause(); });
      settledMarks(); navTone(); portalCrops(); closeFill();
      H.classList.add('gfx-ready');
    });
  }
  /* no motion library: the same settled page (v14: html.sbx-static) */
  function staticInit() {
    safe('static', () => {
      H.classList.remove('gfx-m', 'gfx-intro'); H.classList.add('gfx-static');
      const p = $('.page-wrapper'); p && p.removeAttribute('inert');
      settledMarks(); navTone(); portalCrops(); closeFill();
      H.classList.add('gfx-ready');
    });
  }

  /* ========================= 4 · motion ========================= */
  function start() {
    gsap = W.gsap; ST = W.ScrollTrigger;
    gsap.registerPlugin(ST, W.SplitText);
    // skipped past (a fast fling, an anchor, Ctrl+F)? a room lands finished instead of staying hidden (sbx.js)
    ST.defaults({ toggleActions: 'play complete none none' });
    if (shared && sharedRaf) {
      tickerOn = true; cancelAnimationFrame(tempLoop);
      gsap.ticker.add(() => sharedRaf(performance.now()));
      gsap.ticker.lagSmoothing(0);
      shared.on('scroll', ST.update);
    }
    const isDesk = mq(DESK);
    const BREATH = isDesk || /[?&]breath=1(&|$)/.test(location.search);   // sbx-m1.js: the breath is for wide screens
    if (BREATH) H.classList.add('gfx-breath');

    // the opening and the hero start as soon as the libraries are here (the fonts re-split the headline themselves)
    let intro = null;
    safe('intro', () => { intro = introInit(); });
    pauseControl();   // (1.0.6: beside the firms' label in the standard room, no longer hidden with the hero)
    safe('hero', () => heroInit(intro));
    safe('nav', navInit);
    safe('marquee', marqueeInit);
    portalCrops();

    fontsReady().then(() => setTimeout(() => {
      [joinsInit, capsInit, standardInit, casesInit, processInit, teamInit, industriesInit, insightsInit, closeInit, seamsInit,
        () => breathInit(BREATH), hoverInit, keyboardInit].forEach(f => safe(f.name || 'room', f));
      // a team room that could not be set up never leaves its photographs under the white reveal blocks
      if (!teamReady) H.classList.add('gfx-noreveal');
      H.classList.add('gfx-rooms');   // the room headings' pre-paint hold stands down (each is split and set by now)
      W.gfxRooms = rooms;
      refresh();
    }, 0));
  }

  /* ---------- the conductor (sbx-m1.js) ---------- */
  /* a heading splits on the lines it finally sets: before splitting, a forced break (<br class="gfx-br">) is set where the
     balanced heading breaks, so the split, the rise and the reverted heading share the same lines */
  const unbreak = el => { $$('br.gfx-br', el).forEach(b => b.remove()); el.normalize(); };
  const breakBalanced = el => {
    unbreak(el);
    const words = [], tw = D.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    for (let n; (n = tw.nextNode());) { const re = /\S+/g; let m; while ((m = re.exec(n.textContent))) words.push([n, m.index]); }
    const breaks = []; let prev = null;
    words.forEach(([n, i]) => {
      const r = D.createRange(); r.setStart(n, i); r.setEnd(n, i + 1);
      const q = r.getClientRects()[0]; if (!q) return;
      if (prev != null && q.top > prev + q.height * 0.5) breaks.push([n, i]);
      prev = q.top;
    });
    const afterBreak = (n, i) => {
      if (n.textContent.slice(0, i).trim()) return false;
      for (let x = n; x && x !== el;) {
        const s = x.previousSibling;
        if (!s) { x = x.parentNode; continue; }
        if (s.nodeType === 3 && !s.textContent.trim()) { x = s; continue; }
        return s.nodeName === 'BR';
      }
      return false;
    };
    breaks.reverse().forEach(([n, i]) => {
      if (afterBreak(n, i)) return;
      const br = D.createElement('br'); br.className = 'gfx-br';
      if (!n.textContent.slice(0, i).trim()) i = 0;
      if (i === 0) { let host = n; while (host.parentNode !== el && host.parentNode.firstChild === host) host = host.parentNode; host.parentNode.insertBefore(br, host); }
      else { const rest = n.splitText(i); rest.parentNode.insertBefore(br, rest); }
    });
  };
  const lineSplit = el => {
    const o = { lines: [], played: false, split: null, reverted: false, revert() {} };
    if (!el || !W.SplitText) return o;
    const opts = { type: 'lines', mask: 'lines', linesClass: 'gfx-line', aria: 'none',
      onSplit: self => { o.lines = self.lines; if (!o.played) gsap.set(self.lines, { yPercent: G.headline.yPercent }); } };
    breakBalanced(el);
    o.split = W.SplitText.create(el, opts);
    let lastW = W.innerWidth, rt = 0;
    W.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => safe('resplit', () => {
      if (W.innerWidth === lastW) return; lastW = W.innerWidth;
      if (!o.reverted) o.split.revert();
      breakBalanced(el);
      if (!o.reverted) { o.split = W.SplitText.create(el, opts); if (o.played) gsap.set(o.lines, { yPercent: 0 }); }
      requestAnimationFrame(() => D.dispatchEvent(new Event('gfx:resplit')));
    }), 160); });
    // (the heading returns to plain text on the same lines it rose on: its balanced breaks stay)
    o.revert = () => { if (o.reverted) return; o.reverted = true; o.split.revert(); };
    return o;
  };
  const pctOf = s => { const m = /(\d+(?:\.\d+)?)%/.exec(s || ''); return m ? +m[1] / 100 : 0.82; };
  /* room(): one room's arrival, in the house order, on one timeline (headline → body → hairline → arrow → pictures and
     figures → detail). Scrolled past while it plays, it fast-forwards (0.3 s); jumped past, it lands finished. */
  const rooms = [];
  function room(o) {
    const trig = typeof o.trigger === 'string' ? $(o.trigger) : o.trigger; if (!trig) return null;
    const headEl = o.headline ? (typeof o.headline === 'string' ? $(o.headline) : o.headline) : null;
    const head = headEl ? lineSplit(headEl) : null;
    const body = arr(o.body), hair = arr(o.hairline), pics = arr(o.pictures), det = arr(o.detail), draws = arr(o.draws);
    const mk = o.arrow ? makeMark(typeof o.arrow.host === 'string' ? $(o.arrow.host) : o.arrow.host, o.arrow.word, { low: o.arrow.low, dark: o.arrow.dark }) : null;
    const slots = { headline: head ? 0 : null, body: body.length ? G.body.at : null, hairline: hair.length || draws.length ? G.hairline.at : null,
      arrow: mk ? G.arrow.at : null,
      picture: pics.length || o.extraPicture ? (mk ? Math.max(G.picture.at, G.arrow.at) : G.picture.at) : null,
      detail: det.length || o.extraDetail ? G.detail.at : null };
    const base = Math.min.apply(null, Object.keys(slots).map(k => slots[k]).filter(v => v != null).concat(o.base != null ? [o.base] : [Infinity]));
    const at = k => (k in slots && slots[k] != null ? slots[k] : (G[k] && G[k].at) || 0) - (isFinite(base) ? base : 0);
    body.forEach(e => e.setAttribute('data-gfx-reveal', ''));
    det.forEach(e => e.setAttribute('data-gfx-reveal', ''));
    const set = (els, v) => { if (els.length) gsap.set(els, v); };
    set(body, { opacity: 0, y: G.body.y });
    set(hair, { scaleX: 0, transformOrigin: '0% 50%' });
    set(det, { opacity: 0, y: G.detail.y });
    set(pics, { clipPath: G.picture.clipFrom, scale: G.picture.scaleFrom });
    set(draws, { clipPath: 'inset(0% 100% 0% 0%)' });
    const host = o.arriving && (typeof o.arriving === 'string' ? $(o.arriving) : o.arriving);
    const tl = gsap.timeline({ paused: true, onStart: () => host && host.classList.add('gfx-arriving'), onComplete: () => safe('room done', () => {
      host && host.classList.remove('gfx-arriving');
      if (body.length + det.length) gsap.set(body.concat(det), { clearProps: 'transform' });
      if (draws.length) gsap.set(draws, { clearProps: 'clipPath' });
      if (pics.length) gsap.set(pics, { clearProps: 'clipPath' });
      if (head && head.split) { head.revert(); requestAnimationFrame(() => D.dispatchEvent(new Event('gfx:resplit'))); }
    }) });
    if (head) tl.add(() => { head.played = true; }, 0).add(() => { if (head.lines.length) gsap.to(head.lines, { yPercent: 0, duration: G.headline.duration, stagger: G.headline.stagger, ease: G.SETTLE }); }, at('headline'))
      .to({}, { duration: G.headline.duration + G.headline.stagger * 2 }, at('headline'));
    if (body.length) tl.to(body, { opacity: 1, y: 0, duration: G.body.duration, stagger: GROUP, ease: G.SETTLE }, at('body'));
    if (hair.length) tl.to(hair, { scaleX: 1, duration: G.hairline.duration, stagger: GROUP, ease: G.DRAW }, at('hairline'));
    if (draws.length) tl.to(draws, { clipPath: 'inset(0% 0% 0% 0%)', duration: G.hairline.duration, stagger: GROUP, ease: G.DRAW }, at('hairline'));
    if (mk) drawArrow(tl, mk, at('arrow'));
    if (pics.length) {
      tl.to(pics, { clipPath: 'inset(0% 0% 0% 0%)', duration: G.picture.duration, stagger: GROUP, ease: G.DRAW }, at('picture'))
        .to(pics, { scale: 1, duration: G.picture.settle || G.picture.duration, stagger: GROUP, ease: G.SETTLE }, at('picture'));
    }
    if (det.length) tl.to(det, { opacity: 1, y: 0, duration: G.detail.duration, stagger: o.group ? GROUP : (o.stagger != null ? o.stagger : G.detail.stagger), ease: G.SETTLE }, at('detail'));
    if (o.extra) safe('room extra', () => o.extra(tl, at));
    let entered = false;
    const play = () => { if (entered) return; entered = true; tl.play(); };
    const ff = () => { entered = true; if (tl.progress() < 1) { tl.pause(); gsap.to(tl, { progress: 1, duration: G.fastForward, ease: 'power1.out' }); if (head) { head.played = true; if (head.lines.length) gsap.to(head.lines, { yPercent: 0, duration: G.fastForward, overwrite: true }); } } };
    const pct = pctOf(o.start || G.headline.start);
    const startY = () => flowY(trig) - W.innerHeight * pct;
    // (the end never lies past the page's end, so a room near the foot still fast-forwards at the bottom)
    ST.create({ start: startY, end: () => { const s = startY(); return Math.max(s + 1, Math.min(s + W.innerHeight * 1.4, ST.maxScroll(W) - 2)); }, onEnter: play, onLeave: ff });
    // (and back up off the screen below while it still plays: settled there too)
    ST.create({ start: () => flowY(trig) - W.innerHeight, end: () => flowY(trig) - W.innerHeight + 1, onLeaveBack: () => { if (entered) ff(); } });
    const r = { tl, head, mk, trig }; rooms.push(r); return r;
  }

  /* ---------- the opening (sbx.js M1 + gfIntroMark): the logo settles, the line draws and turns up, the fox flies to
     the bar while the curtain rises; once a session ---------- */
  function introInit() {
    if (!H.classList.contains('gfx-intro')) return null;
    const pre = $('.preloader'), logo = pre && $('.logo-full', pre);
    if (!pre || !logo) { H.classList.remove('gfx-intro'); return null; }
    store.set('gfx-intro-seen', '1');
    const page = $('.page-wrapper'); if (page) page.setAttribute('inert', '');
    if (shared && shared.stop) shared.stop();
    const tl = gsap.timeline();
    const svg = D.createElementNS(NS, 'svg'); svg.setAttribute('class', 'gfx-mark gfx-intro-mark'); svg.setAttribute('aria-hidden', 'true');
    const p1 = D.createElementNS(NS, 'path'), p2 = D.createElementNS(NS, 'path');
    [p1, p2].forEach(p => { p.setAttribute('pathLength', '1'); p.style.strokeDasharray = '1'; p.style.strokeDashoffset = '1'; });
    svg.appendChild(p1); svg.appendChild(p2); pre.appendChild(svg);
    const place = () => safe('intro mark', () => {
      const b = logo.getBoundingClientRect(); if (!b.width) return;
      const inset = b.width * 27 / 600;   // logo-full.png: the fox starts at 27 px of 600, the word ends at 573
      const w = b.width - 2 * inset, rise = Math.max(16, b.height * 0.16), run = rise / TAN, hs = rise * 0.38;
      svg.style.left = (b.left + inset) + 'px'; svg.style.top = (b.bottom + Math.max(18, b.height * 0.14)) + 'px';
      svg.setAttribute('width', w + run + 4); svg.setAttribute('height', rise + 6);
      p1.setAttribute('d', `M0 ${rise + 2} H${w} L${w + run} 2`);
      p2.setAttribute('d', `M${w + run - hs} 2 H${w + run} V${2 + hs}`);
    });
    const navFox = $$('.gfx-nav .logo__navbar').filter(i => i.offsetWidth || i.getClientRects().length)[0];
    const FLY = !/[?&]fly=0(&|$)/.test(location.search) && !!navFox;
    let fly = null;
    if (FLY) {
      fly = D.createElement('div'); fly.className = 'gfx-fly'; fly.setAttribute('aria-hidden', 'true');
      const png = new Image(), sv = new Image(); png.alt = sv.alt = ''; png.className = 'gfx-fly-png'; sv.className = 'gfx-fly-svg';
      png.src = logo.currentSrc || logo.src; sv.src = navFox.currentSrc || navFox.src; fly.appendChild(png); fly.appendChild(sv); D.body.appendChild(fly);
    }
    const flyOff = () => safe('fly', () => {
      const b = logo.getBoundingClientRect(), t = navFox.getBoundingClientRect(), sx = b.width / 600, sy = b.height / 189;
      const w = 176 * sx, pad = (w - 172 * sy) / 2, left = b.left + 27 * sx, top = b.top + 8 * sy - pad;
      Object.assign(fly.style, { width: w + 'px', height: w + 'px', visibility: 'visible' }); gsap.set(fly, { x: left, y: top });
      Object.assign(fly.firstChild.style, { left: -27 * sx + 'px', top: pad - 8 * sy + 'px', width: b.width + 'px', height: b.height + 'px' });
      logo.style.clipPath = 'inset(0 0 0 36.2%)';   // the wordmark alone stays behind, to fade
      gsap.to(fly, { x: t.left, y: t.top, scale: t.width / w, duration: G.seam.hairline, ease: G.DRAW });
      gsap.to(fly.lastChild, { opacity: 1, duration: 0.45, ease: 'none', delay: 0.6 });
      gsap.to(fly.firstChild, { opacity: 0, duration: 0.45, ease: 'none', delay: 0.6 });
    });
    tl.fromTo(logo, { autoAlpha: 0, scale: 0.96 }, { autoAlpha: 1, scale: 1, duration: G.detail.duration, ease: G.SETTLE }, 0);
    let t = 0.5;
    tl.add(place, t)
      .to(p1, { strokeDashoffset: 0, autoRound: false, duration: G.hairline.duration, ease: G.DRAW }, t)
      .to(p2, { strokeDashoffset: 0, autoRound: false, duration: G.arrow.duration, ease: G.SETTLE }, t + G.hairline.duration - 0.15);
    t += G.hairline.duration - 0.15 + G.arrow.duration;
    tl.addLabel('out', t + 0.25);   // the breath: the whole mark at rest for a quarter of a second
    if (FLY) tl.add(flyOff, 'out');
    const CUR = G.seam.hairline;   // the curtain is the house join: the same length and curve as every seam
    tl.to([logo, svg], { autoAlpha: 0, y: -12, duration: LEAVE.duration, ease: LEAVE.ease }, 'out')
      .to(pre, { yPercent: -100, duration: CUR, ease: G.DRAW,
        onComplete: () => { H.classList.remove('gfx-intro'); if (fly) fly.remove(); gsap.set(pre, { clearProps: 'transform' }); logo.style.clipPath = ''; gsap.set([logo, svg], { clearProps: 'opacity,visibility,transform' }); svg.remove(); } }, 'out+=0.15')
      .addLabel('heroIn', 'out+=' + (0.15 + CUR * 0.6))
      .add(() => { if (page) page.removeAttribute('inert'); if (shared && shared.start) shared.start(); }, 'heroIn');
    return tl;
  }

  /* ---------- the hero (sbx.js M1): headline, then the paragraph, the arrow under "engage.", then the buttons ---------- */
  function heroInit(introTl) {
    const title = $('.gfx-hero-h'); const host = title && (title.closest('.hero_title') || title.parentElement);
    const para = $('.gfx-hero-p'), btns = $$('.gfx-hero-content .hero_buttons').concat($$('.gfx-hero-sec .hero_buttons'), $$('.gfx-hero-sec > .gfx-motion')).filter((e, i, a) => a.indexOf(e) === i);
    const late = !introTl && performance.now() > 3300;   // a slow connection: the fallback has shown the hero; set it finished
    let lines = [], started = late, first = true, tw = null;
    const rise = () => gsap.fromTo(lines, { yPercent: G.headline.yPercent }, { yPercent: 0, duration: G.headline.duration, stagger: G.headline.stagger, ease: G.SETTLE, paused: !started });
    if (title) W.SplitText.create(title, { type: 'lines', mask: 'lines', linesClass: 'gfx-line', autoSplit: true, aria: 'none',
      onSplit: self => {
        lines = self.lines;
        if (!first) requestAnimationFrame(() => D.dispatchEvent(new Event('gfx:resplit')));
        first = false;
        if (late) return undefined;
        tw = rise(); return tw;
      } });
    if (!late) { if (para) gsap.set(para, { opacity: 0.32 }); if (btns.length) gsap.set(btns, { opacity: 0, y: G.detail.y }); }
    H.classList.add('gfx-ready');   // the motion has the hero: the pre-paint states and their fallback stand down
    const mk = title && host ? makeMark(host, rangeOf(title, 'engage'), { low: true, dark: true, cls: 'gfx-hero-mark' }) : null;
    const still = $('.gfx-hero-still img');
    if (late) {
      if (still) gsap.set(still, { scale: 1 });
      if (mk) { mk.place(); gsap.set([mk.p1, mk.p2], { strokeDashoffset: 0 }); }
      [para].concat(btns).filter(Boolean).forEach(e => { const o = +getComputedStyle(e).opacity; if (o < 1) gsap.fromTo(e, { opacity: o }, { opacity: 1, duration: 0.6, ease: G.SETTLE, clearProps: 'opacity' }); });
      return;
    }
    const tl = introTl || gsap.timeline();
    if (!introTl) tl.addLabel('heroIn', 0.15);
    tl.add(() => { started = true; if (tw) tw.play(); }, 'heroIn');
    if (para) tl.to(para, { opacity: 1, y: 0, duration: G.body.duration, ease: G.SETTLE, clearProps: 'opacity,transform' }, 'heroIn+=' + G.body.at);
    if (mk) tl.add(mk.place, 'heroIn+=' + G.arrow.at)
      .to(mk.p1, { strokeDashoffset: 0, autoRound: false, duration: G.hairline.duration, ease: G.DRAW }, 'heroIn+=' + G.arrow.at)
      .to(mk.p2, { strokeDashoffset: 0, autoRound: false, duration: G.arrow.duration, ease: G.SETTLE }, 'heroIn+=' + (G.arrow.at + G.hairline.duration - 0.15));
    if (btns.length) tl.to(btns, { opacity: 1, y: 0, duration: G.detail.duration, stagger: G.detail.stagger, ease: G.SETTLE, clearProps: 'opacity,transform' }, 'heroIn+=' + G.detail.at);
    // 1.0.5 · the photograph's breath: one slow settle, 1.04 → 1 over 7 s on SETTLE, with the headline (on a first visit
    // heroIn is the curtain 60 % gone: started at the curtain's lift, the settle was all but over before it showed), or
    // once the photograph has loaded if it arrives later (a settle played before the picture shows is a settle missed)
    // ("Pause motion" chosen on an earlier visit: the photograph is simply at rest)
    if (still && H.classList.contains('gfx-still')) gsap.set(still, { scale: 1 });
    else if (still) tl.add(() => {
      const go = () => gsap.fromTo(still, { scale: 1.04 }, { scale: 1, duration: 7, ease: G.SETTLE });
      if (still.complete && still.naturalWidth) go(); else { still.addEventListener('load', go, { once: true }); still.addEventListener('error', () => gsap.set(still, { scale: 1 }), { once: true }); }
    }, 'heroIn');
  }

  /* ---------- the nav (sbx.js): the bar steps aside while you read down past the film and returns when you scroll up;
     the gold fox stays (on a phone the whole bar leaves). Links turn white over the dark rooms. ---------- */
  /* the bar's look: over the film it wears the component's regular look (the Dark variant class off every element:
     transparent, white links, the outline button); past the film, the solid Dark variant, toned over the dark rooms.
     v14 swapped two bars (regular over the film, solid after); Home v2 has one bar, so its variant is flipped. */
  const navLook = top => safe('nav look', () => {
    const bar = $('.gfx-nav'); if (!bar) return;
    navTop = top;
    $$('.' + NAV_VAR + ', [data-gfx-var]', bar).forEach(e => { e.setAttribute('data-gfx-var', ''); e.classList.toggle(NAV_VAR, !top); });
    bar.classList.toggle('gfx-top', top);
    if (top) bar.classList.remove('gfx-on-dark');
  });
  function navInit() {
    const bar = $('.gfx-nav'); if (!bar) return;
    let showing = true, lookT = null;
    gsap.set(bar, { '--gfx-away': 0 });
    const setShown = want => {
      if (want === showing) return; showing = want;
      gsap.to(bar, { '--gfx-away': want ? 0 : 1, duration: want ? 0.7 : 0.45, ease: want ? G.SETTLE : 'power2.in', overwrite: true });
      bar.classList.toggle('gfx-away', !want); H.classList.toggle('gfx-bar-away', !want);
    };
    bar.addEventListener('focusin', () => setShown(true));
    const past = ST.create({ start: () => W.innerHeight * 0.85, end: 'max',
      onUpdate: s => setShown(s.direction < 0 || s.progress < 0.002 || bar.contains(D.activeElement)),
      // reading down past the film: the links step away first, and the bar changes its look while they are away
      onEnter: () => { if (lookT) lookT.kill(); lookT = gsap.delayedCall(0.45, () => navLook(false)); },
      onLeaveBack: () => { if (lookT) lookT.kill(); navLook(true); setShown(true); } });
    navLook(!past.isActive && W.scrollY < W.innerHeight * 0.85);
    navTone();
  }
  /* the tone of the room under the links (sbx.js gfFoxWatch, its tone part): read from what is on screen there,
     every third frame while the page moves, never while it is still */
  function navTone() {
    const bar = $('.gfx-nav'); if (!bar || bar.dataset.gfxTone) return; bar.dataset.gfxTone = '1';
    const DARKS = '.gfx-hero-sec, .gfx-case-sec, .gfx-pr, .gfx-ind, .gfx-cta-sec, .footer_section_wrapper';
    const lin = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    const lumAt = (x, y) => {
      const els = D.elementsFromPoint ? D.elementsFromPoint(x, y) : [];
      for (let i = 0; i < els.length; i++) {
        const e = els[i]; if (e.closest('.gfx-nav, .gfx-fly, .preloader')) continue;
        if (e.matches(DARKS) || /^(IMG|VIDEO|PICTURE|CANVAS)$/.test(e.tagName)) return 0.02;
        const v = rgbOf(getComputedStyle(e).backgroundColor); if (v) return 0.2126 * lin(v[0]) + 0.7152 * lin(v[1]) + 0.0722 * lin(v[2]);
      }
      return 1;
    };
    let dirty = true, n = 0, dark = null, navH = 0;
    W.addEventListener('scroll', () => { dirty = true; }, { passive: true });
    W.addEventListener('resize', () => { dirty = true; navH = 0; });
    const tick = () => {
      if (dirty && (n++ % 3 === 0)) {
        dirty = false;
        safe('tone', () => {
          if (!gsap) { const t = W.scrollY < W.innerHeight * 0.85; if (t !== navTop || !bar.dataset.gfxLook) { bar.dataset.gfxLook = '1'; navLook(t); } }   // no motion: the look by position
          if (navTop) { if (dark !== false) { dark = false; bar.classList.remove('gfx-on-dark'); } return; }
          const h = navH || (navH = ($('.navbar', bar) || bar).offsetHeight || 74);
          const d = lumAt(W.innerWidth * 0.82, h / 2) < 0.18;
          if (d !== dark) { dark = d; bar.classList.toggle('gfx-on-dark', d); }
        });
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* ---------- the logos (sbx10.js): one slow line in their own colours, paused under the pointer and off screen ---------- */
  function marqueeInit() {
    const lw = $('.gfx-logos'), track = lw && $('.gfx-marq-track', lw); if (!track) return;
    const logos = $$('img', track); if (!logos.length || track.querySelector('.gfx-marq-copy')) return;
    // Webflow publishes the logos loading="lazy": in a moving line clipped by its window, a lazy image only starts loading
    // once it slides into view, so a fresh visit could show the label over an empty line. The ten are small: load them now.
    logos.forEach(l => { l.loading = 'eager'; l.decoding = 'async'; });
    // four sets: the line is always wider than its window, and moving it by exactly half returns it to the start
    for (let k = 1; k < 4; k++) logos.forEach(l => { const c = l.cloneNode(true); c.setAttribute('aria-hidden', 'true'); c.alt = ''; c.classList.add('gfx-marq-copy'); c.removeAttribute('id'); track.appendChild(c); });
    lw.classList.add('gfx-marq');
    if ('IntersectionObserver' in W) new IntersectionObserver(es => es.forEach(e => lw.classList.toggle('gfx-off', !e.isIntersecting))).observe(lw);
  }

  /* ---------- the joins (sbx7.js curtains + sbx4.js holds): each room is held (CSS sticky) while the next slides over it;
     the held room dims and a hairline draws across the arriving room's top, completing as it locks ---------- */
  const R = {};
  const findRooms = () => {
    R.hero = $('.gfx-hero-sec'); R.std = $('.gfx-std-sec'); R.cas = $('.gfx-case-sec'); R.pr = $('.gfx-pr'); R.team = $('.gfx-team-sec');
    R.ind = $('.gfx-ind'); R.ins = $('.gfx-ins-sec'); R.cta = $('.gfx-cta-sec'); R.foot = $('.footer_section_wrapper');
  };
  const mkDim = (room, colour) => { const d = D.createElement('div'); d.className = 'gfx-dim'; d.setAttribute('aria-hidden', 'true'); if (colour) d.style.background = colour; room.appendChild(d); return d; };
  const mkSeam = room => {
    let s = room.querySelector(':scope > .gfx-seam') || room.querySelector(':scope > .gfx-pr-seam');
    if (!s) { s = D.createElement('i'); s.className = 'gfx-seam' + (darkRoom(room) ? ' on-dark' : ''); s.setAttribute('aria-hidden', 'true'); if (getComputedStyle(room).position === 'static') room.style.position = 'relative'; room.insertBefore(s, room.firstChild); }
    return s;
  };
  function joinsInit() {
    findRooms();
    // the close and the footer fill the last screen, so nothing of the room above shows beneath the page's end (sbx11.js)
    if (R.cta && R.foot) { const fit = () => { R.cta.style.minHeight = Math.max(0, W.innerHeight - R.foot.offsetHeight) + 'px'; }; fit(); W.addEventListener('resize', fit); }
    gsap.matchMedia().add(DESK, () => {
      H.classList.add('gfx-held');
      const made = [];
      // the hero: held for one screen while the standard slides over it; the film dims (sbx4.js), the seam draws (sbx-m1.js)
      if (R.hero && R.std) {
        addMark(R.hero);
        R.hero.style.position = 'sticky'; R.hero.style.top = '0px';
        const dim = mkDim(R.hero, '#000');
        const tw = gsap.fromTo(dim, { opacity: 0 }, { opacity: 0.5, ease: 'none', scrollTrigger: { start: 0, end: () => W.innerHeight, scrub: true, invalidateOnRefresh: true } });
        const seam = mkSeam(R.std);
        const sw = gsap.fromTo(seam, { scaleX: 0 }, { scaleX: 1, ease: G.DRAW, scrollTrigger: { start: 0, end: () => W.innerHeight, scrub: true, invalidateOnRefresh: true } });
        // once covered, the film rests out of sight (v14's hero track let it scroll away)
        const vid = [$('video', R.hero)].filter(heroFilmOn)[0];   // (1.0.5: none while the still is the hero)
        const cover = ST.create({ start: () => W.innerHeight + 2, end: 'max', onToggle: s => { R.hero.style.visibility = s.isActive ? 'hidden' : ''; if (vid) { if (s.isActive) vid.pause(); else if (vid.play) vid.play().catch(() => {}); } } });
        made.push(() => { tw.scrollTrigger && tw.scrollTrigger.kill(); tw.kill(); sw.scrollTrigger && sw.scrollTrigger.kill(); sw.kill(); cover.kill(); dim.remove(); seam.remove(); R.hero.style.position = ''; R.hero.style.top = ''; R.hero.style.visibility = ''; dropMark(R.hero); });
      }
      const pairs = [[R.std, R.cas], [R.cas, R.pr], [R.pr, R.team], [R.team, R.ind], [R.ind, R.ins], [R.ins, R.cta]].filter(p => p[0] && p[1]);
      pairs.forEach(p => addMark(p[0]));
      pairs.forEach(([prev, next]) => {
        const setTop = () => { prev.style.top = Math.min(0, W.innerHeight - prev.offsetHeight) + 'px'; };
        setTop(); prev.style.position = 'sticky'; prev.setAttribute('data-gfx-held', '');
        ST.addEventListener('refreshInit', setTop); W.addEventListener('resize', setTop);
        // the dim follows the held room's own darkness: dark rooms 0.5 of black, light rooms 0.3 toward paper
        const dk = darkRoom(prev), dim = mkDim(prev, dk ? '#0e0e0e' : G.seam.lightTo);
        // it begins when the arriving room first reaches the held one's foot, and ends as it has covered it
        const range = () => ({ start: () => flowY(next) - Math.min(W.innerHeight, prev.offsetHeight), end: () => flowY(next), scrub: true, invalidateOnRefresh: true });
        const tw = gsap.fromTo(dim, { opacity: 0 }, { opacity: dk ? G.seam.dimDark : G.seam.dimLight, ease: 'none', scrollTrigger: range() });
        const seam = mkSeam(next);
        const sw = gsap.fromTo(seam, { scaleX: 0 }, { scaleX: 1, ease: G.DRAW, transformOrigin: '0% 50%', scrollTrigger: range() });
        made.push(() => {
          tw.scrollTrigger && tw.scrollTrigger.kill(); tw.kill(); sw.scrollTrigger && sw.scrollTrigger.kill(); sw.kill();
          dim.remove(); if (seam.classList.contains('gfx-seam')) seam.remove(); else gsap.set(seam, { clearProps: 'transform' });
          prev.style.position = ''; prev.style.top = ''; prev.removeAttribute('data-gfx-held');
          ST.removeEventListener('refreshInit', setTop); W.removeEventListener('resize', setTop);
        });
      });
      refresh();
      return () => { made.forEach(f => safe('unjoin', f)); pairs.forEach(p => dropMark(p[0])); H.classList.remove('gfx-held'); };
    });
  }

  /* ---------- the clean header zone (sbx-m1.js): a cap in each room's own colour, fixed under the bar and clipped to its
     room, so a line scrolling past goes under the room's edge, never under the fox ---------- */
  function capsInit() {
    findRooms();
    [R.std, R.cas, R.pr, R.team, R.ind, R.ins, R.cta, R.foot].filter(Boolean).forEach(r => {
      if (r.querySelector(':scope > .gfx-cap')) return;
      const c = D.createElement('div'); c.className = 'gfx-cap'; c.setAttribute('aria-hidden', 'true');
      if (getComputedStyle(r).position === 'static') r.style.position = 'relative';
      r.insertBefore(c, r.firstChild); r.classList.add('gfx-capped');
    });
    H.classList.add('gfx-caps');
  }

  /* ---------- the seams on a phone, and the footer's everywhere (sbx-m1.js): the hairline draws across the arriving
     room's top and completes as that top reaches the top of the screen (or at the page's end) ---------- */
  function seamsInit() {
    findRooms();
    const desk = mq(DESK);
    const list = desk ? [R.foot] : [R.std, R.cas, R.pr, R.team, R.ind, R.ins, R.cta, R.foot];
    list.filter(Boolean).forEach(r => {
      const seam = mkSeam(r);
      gsap.fromTo(seam, { scaleX: 0 }, { scaleX: 1, ease: G.DRAW, immediateRender: true, transformOrigin: '0% 50%',
        scrollTrigger: { start: () => flowY(r) - W.innerHeight, end: () => Math.min(ST.maxScroll(W), flowY(r)), scrub: true, invalidateOnRefresh: true } });
    });
  }

  /* ---------- the standard (sbx-m1.js room + sbx4.js held beats): the statement, the paragraph, the hairline, the arrow
     under "standard"; at the lock the client's words rise, the mark opens, the attribution follows; the firms after ---------- */
  function standardInit() {
    const sec = $('.gfx-std-sec'); if (!sec) return;
    const head = $('.gfx-std-title .heading-2');
    const stdRoom = room({ trigger: head || sec, headline: head, body: $$('.gfx-std-grid > .gfx-lead, .gfx-std-sec .paragraph.gfx-lead').slice(0, 1),
      hairline: '.gfx-std-rule', arrow: $('.gfx-std-title .span-brand') ? { host: '.gfx-std-title', word: brandWord } : null });
    const pull = $('.gfx-pull'), q = pull && $('.gfx-pull-q', pull), markImg = pull && $('.gfx-pull-mark', pull), attr = pull && $('.gfx-attr', pull);
    const logos = [$('.gfx-logos-label'), $('.gfx-logos')].filter(Boolean);
    const played = [false, false];
    let pullLines = [], pullSplit = null;
    if (q) pullSplit = W.SplitText.create(q, { type: 'lines', mask: 'lines', aria: 'none', autoSplit: true,
      onSplit: self => { pullLines = self.lines; if (!played[0]) gsap.set(self.lines, { yPercent: G.headline.yPercent }); } });
    if (markImg) gsap.set(markImg, { clipPath: G.picture.clipFrom, scale: G.picture.scaleFrom });
    if (attr) { attr.setAttribute('data-gfx-reveal', ''); gsap.set(attr, { opacity: 0, y: G.detail.y }); }
    if (logos.length) { logos.forEach(l => l.setAttribute('data-gfx-reveal', '')); gsap.set(logos, { opacity: 0, y: G.detail.y }); }
    const beats = [
      // the quote waits for the room's own arrow to start (the order), then rises like a headline
      () => pull && gsap.timeline({ delay: Math.max(0, G.arrow.at - (stdRoom && stdRoom.tl ? stdRoom.tl.time() : G.arrow.at)),
        onComplete: () => { if (pullSplit) pullSplit.revert(); D.dispatchEvent(new Event('gfx:resplit')); } })
        .to(pullLines, { yPercent: 0, duration: G.headline.duration, stagger: G.headline.stagger, ease: G.SETTLE }, 0)
        .to(markImg || {}, { clipPath: 'inset(0% 0% 0% 0%)', duration: G.picture.duration, ease: G.DRAW }, G.picture.at)
        .to(markImg || {}, { scale: 1, duration: G.picture.duration, ease: G.SETTLE }, G.picture.at)
        .to(attr || {}, { opacity: 1, y: 0, duration: G.detail.duration, ease: G.SETTLE }, G.detail.at),
      () => logos.length && gsap.to(logos, { opacity: 1, y: 0, duration: G.detail.duration, stagger: G.detail.stagger, ease: G.SETTLE })
    ];
    const beat = i => { if (played[i]) return; played[i] = true; safe('std beat', beats[i]); };
    const all = () => { beat(0); beat(1); };
    if (mq(DESK)) {
      // held: the quote at the lock with the room's first beat, the firms at 45% of the hold (sbx4.js M1, W3)
      const s0 = () => flowY(sec);
      ST.create({ start: s0, end: () => s0() + W.innerHeight * HOLDS.standard,
        onUpdate: s => { if (s.progress > 0.02) beat(0); if (s.progress > 0.45) beat(1); }, onLeave: all });
    } else {
      [[pull, 0], [$('.testimonials_wrapper', sec) || logos[0], 1]].forEach(([el, i]) => {
        if (!el) return; const y = () => flowY(el) - W.innerHeight * 0.85;
        ST.create({ start: y, end: () => y() + 1, onEnter: () => beat(i), onLeave: () => beat(i) });
      });
    }
  }

  /* ---------- the case studies (sbx-m1.js room + sbx4.js climb + sbx5.js odometers) ---------- */
  /* the figures: masked digit reels that roll up into the locked value; the text is always the locked value */
  const odoBuild = b => {
    if (b._gfxOdo) return b._gfxOdo;
    const val = b.dataset.final || (b.dataset.final = b.textContent.trim());
    b.textContent = '';
    const sr = D.createElement('gfx-say'); sr.className = 'gfx-sr'; sr.textContent = val; b.appendChild(sr);
    const vis = D.createElement('gfx-vis'); vis.setAttribute('aria-hidden', 'true'); b.appendChild(vis);
    const reels = [], syms = []; let k = 0;
    for (const ch of val) {
      if (!/\d/.test(ch)) { const y = D.createElement('gfx-sym'); y.textContent = ch; vis.appendChild(y); syms.push(y); continue; }
      const d = +ch, n = 4 + k;   // a short travel; later digits travel a little further, so the figure settles left to right
      const seq = []; for (let j = n; j >= 1; j--) seq.push((d - j + 100) % 10);
      const mask = D.createElement('gfx-odo'), reel = D.createElement('gfx-reel'); reel.textContent = ch; reel.setAttribute('data-seq', seq.join('\n'));
      mask.appendChild(reel); vis.appendChild(mask); reels.push([reel, n, k]); k++;
    }
    return (b._gfxOdo = { reels, syms });
  };
  const odo = (b, at, tlx) => {
    const { reels, syms } = odoBuild(b);
    tlx.set(b, { opacity: 1, y: 0 }, at);
    const FD = G.figure.duration;
    reels.forEach(([reel, n, i]) => tlx.fromTo(reel, { yPercent: n * 100 }, { yPercent: 0, duration: FD + i * 0.1, ease: G.SETTLE }, at + i * 0.07));
    if (syms.length) { const k = Math.max(0, reels.length - 1), end = k * 0.07 + FD + k * 0.1; tlx.fromTo(syms, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: G.SETTLE }, at + Math.max(0, end * 0.55)); }
    return tlx;
  };
  function casesInit() {
    const sec = $('.gfx-case-sec'); if (!sec) return;
    const content = $('.gfx-case-content', sec), tlBox = $('.gfx-case-tl', sec), rail = $('.gfx-case-rail', sec);
    const head = $('.gfx-case-head .heading-2', sec);
    // the room: the header arrives while it slides over the standard; its line is the climb itself, drawn before the arrow
    room({ trigger: head || sec, headline: head, body: $('.gfx-case-head .paragraph', sec), draws: MOTIF && rail && shown(rail) ? [rail] : [] });
    const chs = $$('.gfx-case-ch', sec); if (!chs.length) return;
    chs.forEach(c => c.classList.remove(ON));
    const parts = chs.map(ch => {
      const p = { ch, lines: [], meta: $$('.gfx-case-meta > *', ch), figs: $$('.gfx-case-fig-lead, .gfx-case-fig', ch), nums: $$('.gfx-case-num-lead, .gfx-case-num', ch), caps: $$('.gfx-case-cap', ch) };
      const when = $('.gfx-case-when', ch);
      if (when) W.SplitText.create(when, { type: 'lines', mask: 'lines', linesClass: 'gfx-line', aria: 'none', autoSplit: true,
        onSplit: self => { p.lines = self.lines; gsap.set(self.lines, { yPercent: ch.classList.contains(ON) ? 0 : G.headline.yPercent }); } });
      return p;
    });
    // a chapter arrives in one room's order: the date (headline), the sector and outcome (body), each figure's rule
    // (hairline), the figures rolling, their labels last (detail)
    const enter = (i, dir) => {
      dir = dir || 1;
      const p = parts[i], t = gsap.timeline();
      p.ch.classList.add(ON);
      if (p.lines.length) t.fromTo(p.lines, { yPercent: G.headline.yPercent * dir }, { yPercent: 0, duration: G.headline.duration, stagger: G.headline.stagger, ease: G.SETTLE }, 0);
      if (p.meta.length) t.fromTo(p.meta, { opacity: 0, y: G.body.y * dir }, { opacity: 1, y: 0, duration: G.body.duration, stagger: G.detail.stagger, ease: G.SETTLE }, G.body.at);
      if (p.figs.length) t.fromTo(p.figs, { '--r': 0 }, { '--r': 1, duration: G.hairline.duration, stagger: GROUP, ease: G.DRAW }, G.hairline.at);
      if (p.caps.length) t.fromTo(p.caps, { opacity: 0, y: G.detail.y }, { opacity: 1, y: 0, duration: G.detail.duration, stagger: G.detail.stagger, ease: G.SETTLE }, G.detail.at);
      p.nums.forEach((b, k) => odo(b, G.figure.at + k * GROUP, t));
      if (p.figs.length) t.set(p.figs, { opacity: 1, y: 0 }, 0);
      return t;
    };
    const leave = (i, dir) => {
      dir = dir || 1;
      const p = parts[i];
      const t = gsap.timeline({ onComplete: () => p.ch.classList.remove(ON) });
      if (p.lines.length) t.to(p.lines, { yPercent: -G.headline.yPercent * dir, duration: LEAVE.duration, stagger: G.detail.stagger, ease: LEAVE.ease }, 0);
      const rest = p.meta.concat(p.figs); if (rest.length) t.to(rest, { opacity: 0, y: -G.body.y * dir, duration: LEAVE.duration, stagger: 0.02, ease: LEAVE.ease }, 0);
      return t;
    };
    // the reels are built now, out of sight, so a chapter arriving only rolls them
    setTimeout(() => parts.forEach(p => p.nums.forEach(b => safe('odo', () => odoBuild(b)))), 0);
    parts.forEach(p => { if (p.lines.length) gsap.set(p.lines, { yPercent: 105 }); gsap.set(p.meta.concat(p.nums), { opacity: 0 }); gsap.set(p.figs, { '--r': 0 }); gsap.set(p.caps, { opacity: 0 }); });

    const mm = gsap.matchMedia();
    mm.add(DESK, () => {
      if (!content || !tlBox || !rail) { enter(0).progress(1); return undefined; }
      const arrow = $('.gfx-rail-arrow', rail), stops = ['a', 'b', 'c'].map(k => $('.gfx-case-stop-' + k, rail)).filter(Boolean);
      const svg = $('.gfx-climb-svg', rail), cTrack = $('.gfx-climb-track', rail), cRect = $('#gfxc-rect', rail) || $('clipPath rect', rail);
      if (!svg || !cTrack || !cRect || stops.length < 3) { const t0 = enter(0); t0.progress(1); return undefined; }   // (no climb: the first chapter, as published)
      let cur = -1, run = null;
      const go = i => {
        if (i === cur) return;
        const dir = i > cur ? 1 : -1;
        if (run) run.progress(1);
        const t = gsap.timeline();
        if (cur >= 0) t.add(leave(cur, dir), 0);
        t.add(enter(i, dir), cur >= 0 ? LEAVE.duration * 0.6 : 0);
        run = t; cur = i;
        stops.forEach((s, k) => { s.classList.toggle('gfx-passed', k <= i); if (k === i) s.setAttribute('aria-current', 'step'); else s.removeAttribute('aria-current'); });
      };
      const HOLD = 0.82;   // the last stretch of the hold keeps the final chapter so it can be read
      const camps = [0, 0.5, 1];
      let cF = 0, midX = 0;
      // the ridge in the rail's own pixels (v6): every facet climbs, the climb steepens, the last pitch is the ear's 38.2°
      const ridge = () => {
        const Wr = rail.offsetWidth, Hr = rail.offsetHeight, top = 14, bot = Hr - 10, span = bot - top;
        const lastV = 0.86, x1 = Wr - span * (1 - lastV) / TAN;
        const pts = [[0, 0], [0.15, 0.12], [0.23, 0.145], [0.42, 0.37], [0.5, 0.40], [0.72, 0.66], [0.8, 0.69], [1, lastV]]
          .map(([u, v]) => [u * x1, bot - v * span]).concat([[Wr, top]]);
        const d = 'M' + pts.map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L');
        svg.setAttribute('viewBox', `0 0 ${Wr} ${Hr}`);
        $$('.gfx-climb-track, .gfx-climb-fill', rail).forEach(p => p.setAttribute('d', d));
        $$('.gfx-climb-massif, .gfx-climb-climbed', rail).forEach(p => p.setAttribute('d', `${d} L${Wr} ${Hr} L0 ${Hr} Z`));
        const mr = $('mask rect', svg); if (mr) { mr.setAttribute('width', Wr); mr.setAttribute('height', Hr); }
        cRect.setAttribute('height', Hr + 40);
        midX = pts[4][0];
      };
      const cPt = t => { const p = cTrack.getPointAtLength(t * cTrack.getTotalLength()); return { x: p.x, y: p.y }; };
      const snapMid = () => { const L = cTrack.getTotalLength(); let dd = Infinity; for (let i = 0; i <= 800; i++) { const t = i / 800, e = Math.abs(cTrack.getPointAtLength(t * L).x - midX); if (e < dd) { dd = e; camps[1] = t; } } };
      const leaders = stops.map(s => $(':scope > [class*="gfx-case-leader"]', s)), labels = stops.map(s => $(':scope > [class*="gfx-case-lbl-"]', s));
      gsap.set(leaders.filter(Boolean), { transformOrigin: '50% 100%' });
      const campReveal = (k, f) => {
        const s = camps[k], win = k === 0 ? 0.07 : 0.16;
        const a = k === 0 ? Math.min(1, f / win) : gsap.utils.clamp(0, 1, (f - (s - win)) / win);
        const grow = gsap.parseEase('power2.out')(gsap.utils.clamp(0, 1, a / 0.7));
        const text = gsap.parseEase('power3.out')(gsap.utils.clamp(0, 1, (a - 0.3) / 0.7));
        if (leaders[k]) gsap.set(leaders[k], { scaleY: grow, autoAlpha: grow > 0 ? 1 : 0 });
        if (labels[k]) gsap.set(labels[k], { y: (1 - grow) * 60 + (1 - text) * 10, autoAlpha: text });
      };
      const drawClimb = f => {
        cF = f; const p = cPt(f);
        if (arrow) { arrow.style.left = p.x + 'px'; arrow.style.top = p.y + 'px'; }
        cRect.setAttribute('width', f >= 1 ? rail.offsetWidth + 30 : p.x + 10);
        camps.forEach((_, k) => campReveal(k, f));
        stops.forEach((s, k) => s.classList.toggle('gfx-dot-on', f >= camps[k] - 0.015));
      };
      const placeClimb = () => safe('climb', () => {
        ridge(); snapMid();
        camps.forEach((t, k) => { const p = cPt(t); stops[k].style.left = p.x + 'px'; stops[k].style.top = p.y + 'px'; });
        drawClimb(cF);
      });
      placeClimb(); ST.addEventListener('refresh', placeClimb);
      const s0 = () => flowY(content);
      const st = ST.create({ start: s0, end: () => s0() + W.innerHeight * HOLDS.cases,
        onUpdate: self => { const f = Math.min(1, self.progress / HOLD); drawClimb(f); go(f >= 0.985 ? 2 : f >= camps[1] ? 1 : 0); } });
      tlBox.setAttribute('data-gfx-held', '');
      // the stops take you to their chapter
      const goStop = k => scrollToY(st.start + (k === 0 ? 0.004 : k === 1 ? camps[1] + 0.02 : 1) * HOLD * (st.end - st.start), 1.6);
      const offs = stops.map((s, k) => {
        const lt = $('.gfx-case-lbl-t', s); s.setAttribute('role', 'button'); s.setAttribute('tabindex', '0'); if (lt) s.setAttribute('aria-label', lt.textContent.trim());
        const click = () => goStop(k), key = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goStop(k); } };
        s.addEventListener('click', click); s.addEventListener('keydown', key);
        return () => { s.removeEventListener('click', click); s.removeEventListener('keydown', key); };
      });
      return () => {
        if (run) run.kill(); chs.forEach(c => c.classList.remove(ON)); st.kill(); offs.forEach(f => f());
        ST.removeEventListener('refresh', placeClimb); tlBox.removeAttribute('data-gfx-held');
        stops.forEach(s => { s.style.left = ''; s.style.top = ''; s.classList.remove('gfx-passed', 'gfx-dot-on'); });
        if (arrow) { arrow.style.left = ''; arrow.style.top = ''; }
        gsap.set(leaders.concat(labels).filter(Boolean), { clearProps: 'all' });
      };
    });
    mm.add(SMALL, () => {
      parts.forEach((p, i) => { const y = () => flowY(p.ch) - W.innerHeight * pctOf(G.headline.start);
        ST.create({ start: y, end: () => y() + 1, onEnter: () => enter(i), onLeave: () => enter(i).progress(1) }); });
      return undefined;
    });
    /* phones (sbx7.js §4): the desktop rail is hidden, so a compact ridge stays at the top of the screen while the three
       periods scroll beneath it; it fills camp to camp as each period arrives, and its last pitch is the ear's 38.2° */
    const stage = $('.gfx-case-stage', sec);
    if (tlBox && stage && chs.length === 3) {
      let mini = $('.gfx-mini', sec);
      if (!mini) {
        mini = D.createElement('div'); mini.className = 'gfx-mini'; mini.setAttribute('aria-hidden', 'true');
        mini.innerHTML = '<svg><path class="gfx-mini-track"/><path class="gfx-mini-fill" pathLength="1"/></svg><i></i><i></i><i></i>' +
          '<svg class="gfx-mini-arrow" viewBox="0 0 18 18"><path d="M0 17 L14 6"/><path d="M7.5 6 H14 V12.5"/></svg>';
        stage.parentNode.insertBefore(mini, stage);
      }
      mm.add('(max-width: 991px)', () => {
        const svg = $('svg', mini), track = $('.gfx-mini-track', mini), fill = $('.gfx-mini-fill', mini);
        const dots = $$('i', mini), arrow = $('.gfx-mini-arrow', mini);
        let L = 1, camps = [0, 0.5, 1], f = 0, lut = null, onDots = -1; const LUTN = 240;
        const at = v => { if (!lut) { const p = track.getPointAtLength(v * L); return [p.x, p.y]; } const x = Math.min(LUTN, Math.max(0, v * LUTN)), i = Math.min(LUTN - 1, Math.floor(x)), u = x - i, a = lut[i], b = lut[i + 1]; return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u]; };
        const set = v => {
          f = v; gsap.set(fill, { strokeDasharray: '1 3', strokeDashoffset: 1 - v });
          const [px, py] = at(v); gsap.set(arrow, { x: px, y: py - 14 * 17 / 18 });
          const n = camps.filter(c => v >= c - 0.01).length; if (n !== onDots) { onDots = n; dots.forEach((d, k) => d.classList.toggle('on', v >= camps[k] - 0.01)); }
        };
        const draw = () => safe('mini ridge', () => {
          const Wm = svg.getBoundingClientRect().width, Hm = 44, top = 8, bot = Hm - 4, span = bot - top; if (!Wm) return;
          const lastV = 0.58, x1 = Wm - span * (1 - lastV) / TAN;
          const pts = [[0, 0], [0.15, 0.06], [0.23, 0.075], [0.42, 0.23], [0.5, 0.25], [0.72, 0.44], [0.8, 0.46], [1, lastV]]
            .map(([u, v]) => [u * x1, bot - v * span]).concat([[Wm, top]]);
          const d = 'M' + pts.map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L');
          svg.setAttribute('viewBox', `0 0 ${Wm} ${Hm}`); track.setAttribute('d', d); fill.setAttribute('d', d);
          L = track.getTotalLength(); lut = null;
          let best = 0.5, dd = Infinity;
          for (let i = 0; i <= 400; i++) { const t = i / 400, e = Math.abs(track.getPointAtLength(t * L).x - pts[4][0]); if (e < dd) { dd = e; best = t; } }
          camps = [0, best, 1];
          camps.forEach((t, k) => { const p = track.getPointAtLength(t * L); gsap.set(dots[k], { x: p.x, y: p.y }); });
          onDots = -1; lut = []; for (let i = 0; i <= LUTN; i++) { const p = track.getPointAtLength(i / LUTN * L); lut.push([p.x, p.y]); }
          set(f);
        });
        draw(); ST.addEventListener('refresh', draw);
        // camp to camp: the fill reaches each camp as that period's title reaches the reading line
        const made = [1, 2].map(k => ST.create({
          trigger: chs[k - 1], start: 'top 55%', endTrigger: chs[k], end: 'top 55%', scrub: true,
          onUpdate: s => set(camps[k - 1] + (camps[k] - camps[k - 1]) * s.progress)
        }));
        return () => { made.forEach(s => s.kill()); ST.removeEventListener('refresh', draw); };
      });
    }
  }

  /* ---------- the process room (sbx-process.js, "simpler"): one film, played in time once the room has locked ---------- */
  function processInit() {
    const room_ = $('.gfx-pr'); if (!room_) return;
    const SETTLE = G.SETTLE, DRAW = G.DRAW;
    const lk = $('.gfx-ps-lk', room_);
    if (lk) $$('.gfx-pr-call, .gfx-pr-eng, .gfx-pr-line, .gfx-pr-turn, .gfx-pr-head', lk).forEach(p => p.setAttribute('pathLength', '1'));
    // the link drawn to its box: the turn is exactly 38.2° at any width
    const size = svg => [Math.round(svg.clientWidth || svg.getBoundingClientRect().width), Math.round(svg.clientHeight || svg.getBoundingClientRect().height)];
    const turnAt = (svg, y, x1) => {
      const rise = Math.min(40, Math.max(18, (+svg.viewBox.baseVal.height) * 0.11)), run = rise / TAN, hs = Math.round(rise * 0.36);
      const tn = $('.gfx-pr-turn', svg), hd = $('.gfx-pr-head', svg);
      if (tn) tn.setAttribute('d', `M${x1.toFixed(1)} ${y}L${(x1 + run).toFixed(1)} ${(y - rise).toFixed(1)}`);
      if (hd) hd.setAttribute('d', `M${(x1 + run - hs).toFixed(1)} ${(y - rise).toFixed(1)}H${(x1 + run).toFixed(1)}V${(y - rise + hs).toFixed(1)}`);
    };
    const placeLink = svg => safe('link', () => {
      const [Wd, Hd] = size(svg); if (!Wd || !Hd) return;
      svg.setAttribute('viewBox', `0 0 ${Wd} ${Hd}`);
      const yh = Math.round(Hd / 2) + 0.5, rise = Math.min(40, Math.max(22, Hd * 0.11)), run = rise / TAN, x1 = Wd - run - 6, xc = Math.round(Wd * 0.3);
      // the strands leave the prioritized part of the map's bracket (its y 6 to 169.9 of 300)
      $$('.gfx-pr-eng, .gfx-pr-call', svg).forEach((p, i) => {
        const y = +((6 + 163.9 * (i + 0.5) / 9) / 300 * Hd).toFixed(1);
        p.setAttribute('d', p.classList.contains('gfx-pr-eng') ? `M0 ${y}H${(Wd * 0.08).toFixed(1)}C${(Wd * 0.26).toFixed(1)} ${y} ${(Wd * 0.24).toFixed(1)} ${yh} ${xc} ${yh}` : `M0 ${y}H${(Wd * 0.15).toFixed(1)}`);
      });
      const ln = $('.gfx-pr-line', svg); if (ln) ln.setAttribute('d', `M${xc} ${yh}H${x1.toFixed(1)}`);
      const t0 = xc + 14, t1 = x1 - 12;
      $$('.gfx-pr-tick', svg).forEach((p, k) => { const x = (t0 + (t1 - t0) * k / 9).toFixed(1); p.setAttribute('d', `M${x} ${yh - 4}V${yh + 4}`); });
      turnAt(svg, yh, x1);
    });
    const placeAll = () => { if (lk) placeLink(lk); };
    placeAll(); W.addEventListener('resize', () => requestAnimationFrame(placeAll)); ST.addEventListener('refresh', placeAll);

    // the headline and the set line arrive while the room slides in, on the house headline grammar (M1)
    const h = $('.gfx-pr-h', room_), lede = $('.gfx-pr-lede', room_);
    const hStart = () => flowY(h) - W.innerHeight * pctOf(G.headline.start);
    if (h) W.SplitText.create(h, { type: 'lines', mask: 'lines', linesClass: 'gfx-line', autoSplit: true, aria: 'none',
      onSplit: self => gsap.from(self.lines, { yPercent: G.headline.yPercent, duration: G.headline.duration, stagger: G.headline.stagger, ease: G.SETTLE, scrollTrigger: { start: hStart, end: () => hStart() + 1 } }) });
    if (lede) gsap.from(lede, { opacity: 0, y: G.body.y, duration: G.body.duration, delay: G.body.at, ease: G.SETTLE, scrollTrigger: { start: hStart, end: () => hStart() + 1 } });

    /* the vocabulary (every tween states its start: a sequence reverses exactly) */
    const settle = (tl, els, at, o) => { o = o || {}; els = [].concat(els).filter(Boolean); if (els.length) tl.fromTo(els, { opacity: 0, y: o.y != null ? o.y : 16 }, { opacity: 1, y: 0, duration: o.d != null ? o.d : 1.1, ease: SETTLE, stagger: o.st != null ? o.st : 0.08 }, at); };
    const rule = (tl, els, at, d, st) => { els = els.filter(Boolean); if (els.length) tl.fromTo(els, { '--pr-rule': 0 }, { '--pr-rule': 1, duration: d || 1.5, ease: DRAW, stagger: st != null ? st : 0.12 }, at); };
    const attr = (tl, el, from, to, at, d, ease, first) => { if (el) tl.fromTo(el, { attr: from }, { attr: to, duration: d, ease, immediateRender: !!first }, at); };
    const dash = (tl, els, at, d, o) => { o = o || {}; els = [].concat(els).filter(Boolean); if (els.length) tl.fromTo(els, { strokeDasharray: '1 2', strokeDashoffset: 1.01 }, { strokeDashoffset: 0, autoRound: false, duration: d, ease: o.ease || DRAW, stagger: o.st || 0, immediateRender: o.first !== false }, at); };
    const note = (tl, R0, c, at) => { const n = $('.gfx-pr-mapbox .' + c, R0); if (n) settle(tl, n, at, { y: 6, d: 0.9 }); };
    const mapTrunkFan = (tl, R0, at) => { const sw = $('.gfx-pr-sw1', R0);
      attr(tl, sw, { width: 0, y: 146, height: 8 }, { width: 40, y: 146, height: 8 }, at, 0.5, DRAW, true);
      attr(tl, sw, { width: 40, y: 146, height: 8 }, { width: 132, y: -10, height: 320 }, at + 0.45, 0.9, DRAW);
      note(tl, R0, 'gfx-pr-note-st', at + 1.05); return at + 1.35; };
    const mapRows = (tl, R0, at) => { attr(tl, $('.gfx-pr-sw1', R0), { width: 132, y: -10, height: 320 }, { width: 420, y: -10, height: 320 }, at, 0.85, DRAW); note(tl, R0, 'gfx-pr-note-ch', at + 0.3); return at + 0.85; };
    const mapCols = (tl, R0, at) => { attr(tl, $('.gfx-pr-sw1', R0), { width: 420, y: -10, height: 320 }, { width: 640, y: -10, height: 320 }, at, 0.8, DRAW); note(tl, R0, 'gfx-pr-note-own', at + 0.12); note(tl, R0, 'gfx-pr-note-svc', at + 0.4); return at + 0.8; };
    const mapLit = (tl, R0, at) => { attr(tl, $('.gfx-pr-sw2', R0), { width: 0 }, { width: 640 }, at, 1.0, DRAW, true); note(tl, R0, 'gfx-pr-note-p1', at + 0.6); return at + 1.0; };
    const shotIn = (tl, wrap, at) => { const img = $('.gfx-pr-pv', wrap);
      tl.fromTo(wrap, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.45, ease: DRAW }, at);
      if (img) tl.fromTo(img, { scale: 1.1, transformOrigin: '50% 0%' }, { scale: 1, duration: 1.9, ease: SETTLE }, at + 0.1); return at + 1.45; };
    const OPEN = W.GF_GRAMMAR && (() => { const b = (x1, y1, x2, y2) => { const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx, cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
      const X = t => ((ax * t + bx) * t + cx) * t, dX = t => (3 * ax * t + 2 * bx) * t + cx, Y = t => ((ay * t + by) * t + cy) * t;
      return p => { if (p <= 0) return 0; if (p >= 1) return 1; let t = p; for (let i = 0; i < 8; i++) { const d = dX(t); if (Math.abs(d) < 1e-6) break; t -= (X(t) - p) / d; } return Y(Math.min(1, Math.max(0, t))); }; };
      return b(0.22, 0.7, 0.22, 1); })();
    // the note opens as the portal opens it: the note unclips downward, the rows beneath slide down with it
    const noteOpen = (tl, R0, at, d) => { d = d || 1.15; const n = $('.gfx-pr-p-note', R0), r = $('.gfx-pr-p-rest', R0); if (!n || !r) return at;
      const ratio = () => n.getBoundingClientRect().height / Math.max(1, r.getBoundingClientRect().height) * 100;
      tl.fromTo(n, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: d, ease: OPEN }, at)
        .fromTo(r, { yPercent: () => -ratio() }, { yPercent: 0, duration: d, ease: OPEN }, at); return at + d; };
    const resetAttrs = () => {
      [['.gfx-pr-sw1', 640], ['.gfx-pr-sw2', 640]].forEach(([s, w]) => $$(s, room_).forEach(r => { r.setAttribute('width', w); if (s === '.gfx-pr-sw1') { r.setAttribute('y', -10); r.setAttribute('height', 320); } }));
      placeAll();
    };
    const map = $('.gfx-pr-mapcol', room_) || $('.gfx-pr-draw', room_);
    const f = $$('.gfx-pr-f-lead, .gfx-pr-f', room_), capbox = $('.gfx-pr-capbox', room_), shot = $('.gfx-pr-shotcol', room_);
    const track = $('.gfx-pr-track', room_);

    gsap.matchMedia().add(DESK, () => {
      if (!map) return undefined;
      const film = gsap.timeline({ paused: true });
      const sw1 = $('.gfx-pr-sw1', map), sw2 = $('.gfx-pr-sw2', map);
      const GA = G.arrow.duration, GG = G.group;
      // 1 · the market draws from its root: the trunk, the fan into 50 states, the 226 chains with their ownership and
      //     service, then the prioritized set lights; each note comes up on its branch (one widening wipe, summed strokes)
      const strokes = [[0, 0.5, 40], [0.30, 0.6, 92], [0.66, 0.65, 508]], mapT = 0.66 + 0.65, mapW = 640;
      const mapEase = x => { const t = x * mapT; let w = 0; strokes.forEach(([s, d, dw]) => { w += dw * DRAW(Math.min(1, Math.max(0, (t - s) / d))); }); return w / mapW; };
      attr(film, sw1, { width: 0 }, { width: mapW }, 0, mapT, mapEase, true);
      attr(film, sw1, { y: 146, height: 8 }, { y: -10, height: 320 }, 0.30, 0.6, DRAW, true);
      attr(film, sw2, { width: 0 }, { width: 640 }, 1.05, 0.6, DRAW, true);
      [['gfx-pr-note-st', 0.62], ['gfx-pr-note-ch', 0.86], ['gfx-pr-note-own', 1.02], ['gfx-pr-note-svc', 1.16], ['gfx-pr-note-p1', 1.30]].forEach(([c, t]) => { const n = $('.gfx-pr-mapbox .' + c, map); if (n) film.fromTo(n, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.6, ease: SETTLE }, t); });
      // 2 · the green line carries out of the prioritized set: the calls go out, one in three engage and converge
      if (lk) {
        dash(film, $$('.gfx-pr-call', lk), 1.41, 0.5, { st: 0.012, ease: DRAW });
        dash(film, $$('.gfx-pr-eng', lk), 1.44, 0.6, { st: 0.03, ease: DRAW });
        // 3 · the days tick by and the line turns up at 38.2° into the arrow, toward the portal
        dash(film, $('.gfx-pr-line', lk), 1.80, 0.6, { ease: DRAW });
        const ticks = $$('.gfx-pr-tick', lk); if (ticks.length) film.fromTo(ticks, { opacity: 0 }, { opacity: 1, duration: 0.2, stagger: 0.035, ease: 'none' }, 1.84);
        dash(film, $('.gfx-pr-turn', lk), 2.16, GA, { ease: DRAW }); dash(film, $('.gfx-pr-head', lk), 2.43, GA, { ease: SETTLE });
      }
      // 4 · the portal opens toward the arrow and the company's note unfolds
      if (shot) {
        film.fromTo(shot, { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.72, ease: DRAW }, 2.22);
        const pv = $('.gfx-pr-pv', shot); if (pv) film.fromTo(pv, { scale: 1.1, transformOrigin: '50% 0%' }, { scale: 1, duration: 0.9, ease: SETTLE }, 2.28);
      }
      noteOpen(film, room_, 2.40, 0.6);
      // 5 · (10/13 j, 1.0.3) the figures are part of the film: each lands as its part of the drawing completes, in the house
      //     order: its hairline (Draw 0.8 s), the figure rolling on the odometer as that part's last stroke comes home, its caption
      //       92,631 the market (wipe done 1.31) · 1 in 3 the engaged strands converge (2.10) · 10 days the arrow's head (2.88)
      //     The words by the portal keep their moment (hairline 1.86 + 3 × G.group, words 2.60).
      const FIG_AT = [[0.62, 1.05, 1.28], [1.50, 1.92, 2.16], [2.30, 2.70, 2.94]];
      const figEls = f.map(x => $('.gfx-pr-fig', x));
      f.forEach((x, i) => { const [r, n, c] = FIG_AT[i] || FIG_AT[2]; rule(film, [x], r, 0.8);
        const fe = figEls[i]; if (fe) { gsap.set(fe, { opacity: 0 }); odo(fe, n, film); }
        settle(film, $$('.gfx-pr-fcap', x), c, { d: 0.55 }); });
      if (capbox) { rule(film, [capbox], 1.86 + 3 * GG, 0.8); settle(film, $$('p', capbox), 2.60, { d: 0.54, st: 0.06 }); }
      // scroll triggers, time plays: it starts at the lock; past the lock's end it fast-forwards (0.3 s) to the settled
      // frame; back up it stays settled; only a fresh arrival (the room off the screen below) plays it again
      const top = () => flowY(room_);
      const holdPx = () => Math.max(1, (track ? track.offsetHeight : W.innerHeight) - W.innerHeight);
      let ffTw = null;
      const play = () => { if (film.progress() < 1 && !film.isActive() && !(ffTw && ffTw.isActive())) film.play(); };
      const ff = () => { if (film.progress() >= 1) return; film.pause(); ffTw = gsap.to(film, { progress: 1, duration: G.fastForward, ease: 'power1.out' }); };
      // (the figures hide again with the film's start, whatever a resize re-recorded through film.invalidate())
      const reset = () => { if (ffTw) ffTw.kill(); ffTw = null; film.pause(0, true); gsap.set(figEls.filter(Boolean), { opacity: 0 }); };
      const sts = [ST.create({ start: () => top() - W.innerHeight * 0.05, end: () => top() - W.innerHeight * 0.05 + 1, onEnter: play }),
        ST.create({ start: () => top() + holdPx() + W.innerHeight, end: () => top() + holdPx() + W.innerHeight + 1, onEnter: ff }),
        ST.create({ start: () => top() - W.innerHeight, end: () => top() - W.innerHeight + 1, onLeaveBack: reset })];
      const re = () => { const tt = film.time(); film.invalidate().time(tt); };
      ST.addEventListener('refresh', re);
      return () => { sts.forEach(t => t.kill()); if (ffTw) ffTw.kill(); film.progress(1).kill(); ST.removeEventListener('refresh', re); resetAttrs(); figEls.forEach(e => e && (e.style.opacity = '')); };
    });
    /* phones and small tablets: each part plays as it arrives (and reverses, quicker, when you scroll back above it) */
    gsap.matchMedia().add('(max-width: 991px)', () => {
      const made = [];
      const part = (trigger, build, pct) => {
        if (!trigger) return; const tl = gsap.timeline({ paused: true }); safe('pr part', () => build(tl)); made.push(tl);
        const y = () => flowY(trigger) - W.innerHeight * (pct || 0.8);
        ST.create({ start: y, end: () => y() + 1, onEnter: () => tl.timeScale(1).play(), onLeaveBack: () => tl.timeScale(2).reverse() });
      };
      if (map) part(map, tl => { let t = mapTrunkFan(tl, map, 0); t = mapRows(tl, map, t - 0.05); t = mapCols(tl, map, t - 0.05); mapLit(tl, map, t - 0.1); });
      // (10/13 j, 1.0.3) each figure as it arrives: its hairline, the figure rolling on the odometer, its caption after it
      // (two side by side arrive together: the right one follows by G.group)
      f.forEach(e => { const k = e.getBoundingClientRect().left - e.parentElement.getBoundingClientRect().left > 4 ? G.group : 0;
        part(e, tl => { rule(tl, [e], k); const fe = $('.gfx-pr-fig', e); if (fe) { gsap.set(fe, { opacity: 0 }); odo(fe, k + 0.3, tl); }
          settle(tl, $$('.gfx-pr-fcap', e), k + 0.55, { d: 0.9 }); }, 0.9); });
      if (capbox) part(capbox, tl => { rule(tl, [capbox], 0); settle(tl, Array.prototype.slice.call(capbox.children), 0.1); }, 0.9);
      if (shot) part(shot, tl => { shotIn(tl, shot, 0); noteOpen(tl, room_, 0.9); });
      return () => { made.forEach(t => t.progress(1).kill()); resetAttrs(); };
    });
  }

  /* ---------- the team (sbx-m1.js): the header, then the portraits as one group, their names, their corners cut last ---------- */
  let teamReady = false;
  function teamInit() {
    const sec = $('.gfx-team-sec'); if (!sec) { teamReady = true; return; }
    const head = $('.gfx-team-head .heading-2', sec);
    room({ trigger: head || sec, headline: head, body: $('.gfx-team-head .gfx-lead, .gfx-team-head .paragraph', sec), hairline: $('.gfx-team-hr', sec) });
    const facets = $$('.gfx-team-pic', sec);
    const fxTo = facets.map(fc => parseFloat(getComputedStyle(fc).getPropertyValue('--fx-to')) || 40);
    if (facets.length) gsap.set(facets, { '--fx': '0px' });
    const BREATH = H.classList.contains('gfx-breath');
    const imgs = $$('.gfx-team-img', sec);
    if (imgs.length && !BREATH) gsap.set(imgs, { scale: G.picture.scaleFrom });
    const members = $$('.gfx-team-m', sec), stacked = W.innerWidth < 768;
    // side by side, the three arrive as one group; on a narrow screen, grouped by the row they sit in
    const byRow = ms => { const rows = []; ms.forEach(m => { const t = m.getBoundingClientRect().top + W.scrollY, r = rows.find(x => Math.abs(x.t - t) < 8); if (r) r.ms.push(m); else rows.push({ t, ms: [m] }); }); return rows.map(x => x.ms); };
    (stacked ? byRow(members) : [members]).forEach(group => {
      if (!group.length) return;
      const pick = sel => group.reduce((a, m) => a.concat($$(sel, m)), []);
      const bl = pick('.gfx-team-pic .reveal_block'), ph = pick('.gfx-team-img'), fc = facets.filter(x => group.some(m => m.contains(x)));
      room({ trigger: stacked ? group[0] : ($('.gfx-team-grid', sec) || group[0]), start: stacked ? G.headline.start : 'top 78%', detail: pick('.team_member_description'), group: true, extraPicture: true, arriving: sec,
        extra: (tl, at) => {
          // the designer's own reveal blocks lift (a picture opening, on the designer's curve), each photo settling
          if (bl.length) tl.to(bl, { scaleY: 0, transformOrigin: '50% 0%', duration: G.picture.duration, stagger: GROUP, ease: G.DRAW }, at('picture'));
          if (!BREATH && ph.length) tl.to(ph, { scale: 1, duration: G.picture.settle || G.picture.duration, stagger: GROUP, ease: G.SETTLE }, at('picture'));
          fc.forEach((x, i) => tl.to(x, { '--fx': fxTo[facets.indexOf(x)] + 'px', duration: G.hairline.duration, ease: G.DRAW, onComplete: () => x.style.removeProperty('--fx') }, at('detail') + G.detail.duration * 0.5 + i * GROUP));
        } });
    });
    teamReady = true;
  }

  /* ---------- industries (sbx13-ind.js reel, M1): scroll picks the sector, time plays it. The hold is cut into nine equal
     stretches; reaching one plays its cut (the photograph opening along the ear's angle), the old words leave and the
     new ones rise. A jump over several plays them through quicker; past the room, it fast-forwards. ---------- */
  function industriesInit() {
    const sec = $('.gfx-ind'); if (!sec) return;
    const wide = mq(WIDE);
    const stage = $('.gfx-ind-stage', sec), track = $('.gfx-ind-track', sec);
    const bar = $('.gfx-ind-bar', sec), fill = $('.gfx-ind-bar-fill', sec);
    if (wide && stage) {
      // the room: the heading, then the first sector's words (body) and the index (detail); its line is the reel's rule
      room({ trigger: $('.gfx-ind-head .heading-2', sec) || stage, headline: $('.gfx-ind-head .heading-2', sec),
        body: [$('.gfx-ind-names', sec), $('.gfx-ind-covs', sec)].filter(Boolean), detail: $('.gfx-ind-index', sec),
        draws: MOTIF && bar ? [bar] : [] });
    } else {
      room({ trigger: $('.gfx-ind-mhead .heading-2', sec) || sec, headline: $('.gfx-ind-mhead .heading-2', sec) });
    }
    const picsBox = $('.gfx-ind-pics', sec);
    const pics = picsBox ? Array.prototype.slice.call(picsBox.children) : [];
    const names = $$('.gfx-ind-name', sec), covs = $$('.gfx-ind-cov', sec), gos = $$('.gfx-ind-go', sec);
    const N = Math.min(pics.length, names.length) || 0;
    const ui = $('.gfx-ind-ui', sec);
    if (stage && N > 1) {
      let edge = $('.gfx-ind-edge', stage);
      if (!edge) { edge = D.createElementNS(NS, 'svg'); edge.setAttribute('class', 'gfx-ind-edge'); edge.setAttribute('aria-hidden', 'true'); edge.appendChild(D.createElementNS(NS, 'path')); const shade = $('.gfx-ind-shade', stage); if (shade) shade.after(edge); else stage.appendChild(edge); }
      const edgeP = $('path', edge);
      let Ws = 0, Hs = 0;
      const measure = () => { Ws = stage.clientWidth; Hs = stage.clientHeight; edge.setAttribute('viewBox', `0 0 ${Ws} ${Hs}`); edge.setAttribute('width', Ws); edge.setAttribute('height', Hs); };
      // the cut: the region below a line that rises at the ear's angle; v = 0 shows nothing, v = 1 shows all
      const wipe = (el, v) => {
        if (v <= 0) { el.style.clipPath = 'polygon(0px 0px, 0px 0px, 0px 0px)'; edge.style.opacity = 0; return; }
        if (v >= 1) { el.style.clipPath = 'none'; edge.style.opacity = 0; return; }
        const c = (1 - v) * (Hs + TAN * Ws), far = Hs + TAN * Ws + 4;
        el.style.clipPath = `polygon(0px ${c}px, ${Ws}px ${c - TAN * Ws}px, ${Ws}px ${far}px, 0px ${far}px)`;
        edgeP.setAttribute('d', `M0 ${c} L${Ws} ${c - TAN * Ws}`); edge.style.opacity = 1;
      };
      let cur = 0;
      const mark = i => {
        if (i === cur) return; cur = i;
        gos.forEach((g, k) => { g.classList.toggle(ON, k === i); const m = $('.gfx-ind-go-m', g); if (m) m.classList.toggle(ON, k === i); if (k === i) g.setAttribute('aria-current', 'true'); else g.removeAttribute('aria-current'); });
        [names, covs, pics].forEach(list => list.forEach((e, k) => e.classList.toggle(ON, k === i)));
      };
      const setBar = p => { if (fill) gsap.set(fill, { scaleX: p }); };
      gsap.matchMedia().add(WIDE, () => {
        H.classList.add('gfx-reel');
        measure();
        pics.forEach((p, i) => { p.style.opacity = '1'; if (i) wipe(p, 0); });
        gsap.set([names[0], covs[0]].filter(Boolean), { opacity: 1, y: 0 });
        gsap.set(names.slice(1, N).concat(covs.slice(1, N)), { opacity: 0, y: 24 });
        const BREATH = H.classList.contains('gfx-breath');
        const Wt = G.picture.duration, tl = gsap.timeline({ paused: true });
        const IN = 1.09, REST = 1.04;
        tl.addLabel('s0', 0);
        for (let i = 1; i < N; i++) {
          const t0 = (i - 1) * Wt, w = { v: 0 }, im = $('img', pics[i]);
          tl.fromTo(w, { v: 0 }, { v: 1, duration: Wt, ease: G.DRAW, immediateRender: false, onUpdate: () => wipe(pics[i], w.v) }, t0);
          if (im && !BREATH) tl.fromTo(im, { scale: IN }, { scale: REST, duration: G.picture.settle || Wt, ease: G.SETTLE, immediateRender: false }, t0);
          const outs = [names[i - 1], covs[i - 1]].filter(Boolean), ins = [names[i], covs[i]].filter(Boolean);
          if (outs.length) tl.fromTo(outs, { opacity: 1, y: 0 }, { opacity: 0, y: -G.body.y, duration: LEAVE.duration, stagger: 0.03, ease: LEAVE.ease, immediateRender: false }, t0);
          if (ins.length) tl.fromTo(ins, { opacity: 0, y: G.body.y }, { opacity: 1, y: 0, duration: G.body.duration, stagger: G.detail.stagger, ease: G.SETTLE, immediateRender: false }, t0 + G.body.at + 0.1);
          tl.addLabel('s' + i, t0 + Wt);
        }
        tl.eventCallback('onUpdate', () => { const t = tl.time(); let k = 0; for (let i = 1; i < N; i++) if (t >= (i - 1) * Wt + Wt * 0.5) k = i; mark(k); setBar(tl.progress()); });
        setBar(0);
        let want = 0, tw = null;
        const go = (k, quick) => {
          if (k === want && !quick) return; want = k;
          const to = tl.labels['s' + k], dist = Math.abs(to - tl.time()); if (tw) tw.kill();
          tw = tl.tweenTo(to, { duration: quick ? Math.min(dist, G.fastForward) : Math.min(dist, Wt * 1.6), ease: 'none' });
        };
        const s0 = () => flowY(track || stage), s1 = () => s0() + Math.max(1, (track ? track.offsetHeight : W.innerHeight) - W.innerHeight);
        const st = ST.create({ start: s0, end: s1, onRefresh: measure,
          onUpdate: s => { if (s.isActive) go(Math.min(N - 1, Math.floor(s.progress * N))); },
          onLeave: () => go(N - 1, true), onLeaveBack: () => go(0, true) });
        const reelY = i => st.start + (st.end - st.start) * ((i + 0.5) / N);
        W.gfxReelY = reelY;
        // the breath: each photograph settles from 1.06 to rest across its whole time on screen, tied to the scroll
        let breath = null;
        if (BREATH) {
          const B = G.breath, ims = pics.map(p => $('img', p)), last = ims.map(() => -1);
          const span = () => st.end - st.start;
          const range = i => [i === 0 ? st.start - W.innerHeight : st.start + span() * i / N, i === N - 1 ? st.end + W.innerHeight : st.start + span() * (i + 1) / N];
          const paint = y => ims.forEach((im, i) => {
            if (!im) return; const [a, b] = range(i); const u = Math.min(1, Math.max(0, (y - a) / (b - a)));
            const v = +(B.scaleFrom + (B.scaleTo - B.scaleFrom) * u).toFixed(4); if (v === last[i]) return; last[i] = v;
            im.style.scale = v; im.style.willChange = u > 0 && u < 1 ? 'transform' : '';
          });
          breath = ST.create({ start: () => st.start - W.innerHeight, end: () => st.end + W.innerHeight, onUpdate: s => paint(s.scroll()), onRefresh: s => paint(s.scroll()) });
        }
        const onGo = e => { const i = gos.indexOf(e.currentTarget); if (i > -1) scrollToY(reelY(i)); };
        const onKey = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onGo(e); } };
        gos.forEach(g => { g.addEventListener('click', onGo); g.addEventListener('keydown', onKey); });
        W.addEventListener('resize', measure);
        return () => {
          W.gfxReelY = null; if (tw) tw.kill(); st.kill(); tl.kill(); if (breath) breath.kill();
          gos.forEach(g => { g.removeEventListener('click', onGo); g.removeEventListener('keydown', onKey); });
          W.removeEventListener('resize', measure); H.classList.remove('gfx-reel');
          pics.forEach(p => { p.style.clipPath = ''; p.style.opacity = ''; const im = $('img', p); if (im) { im.style.scale = ''; im.style.willChange = ''; } });
          gsap.set(names.concat(covs), { clearProps: 'all' }); if (fill) gsap.set(fill, { clearProps: 'all' });
        };
      });
    }
    // the plain sequence (phones): photographs open as they arrive, words follow
    gsap.matchMedia().add('(max-width: 991px)', () => {
      const made = [];
      $$('.gfx-ind-item', sec).forEach(it => {
        const pic = $('.gfx-ind-item-pic', it), im = pic && ($('img', pic) || $('.gfx-ind-item-panel', pic)), words = $$('.gfx-ind-item-t, .gfx-ind-item-c', it);
        if (im) gsap.set(im, { clipPath: 'inset(100% 0% 0% 0%)' });
        if (words.length) { words.forEach(w => w.setAttribute('data-gfx-reveal', '')); gsap.set(words, { opacity: 0, y: 16 }); }
        const yp = () => flowY(it) - W.innerHeight * 0.88, yw = () => flowY(it) - W.innerHeight * 0.80;
        const openPic = () => { if (im) gsap.to(im, { clipPath: 'inset(0% 0% 0% 0%)', duration: G.picture.duration, ease: G.DRAW, overwrite: 'auto', onComplete: () => gsap.set(im, { clearProps: 'clipPath' }) }); };
        const showWords = () => { if (words.length) gsap.to(words, { opacity: 1, y: 0, duration: 1, stagger: 0.06, delay: 0.2, ease: G.SETTLE, overwrite: true }); };
        made.push(ST.create({ start: yp, end: () => yp() + 1, onEnter: s => { openPic(); s.kill(); }, onLeave: s => { openPic(); s.kill(); } }));
        made.push(ST.create({ start: yw, end: () => yw() + 1, onEnter: s => { showWords(); s.kill(); }, onLeave: s => { showWords(); s.kill(); } }));
      });
      return () => made.forEach(s => s.kill());
    });
  }

  /* ---------- Insights (sbx-m1.js + sbx13-ins.js): the heading and "View all articles", the hairline; the cover opens and
     its green outline draws, its words follow; then the two rows and the list as groups ---------- */
  function insightsInit() {
    const sec = $('.gfx-ins-sec'); if (!sec) return;
    addArrows();
    const head = $('.gfx-ins-title .heading-2', sec);
    room({ trigger: head || sec, headline: head, body: $('.gfx-ins-title .button_wrapper', sec), hairline: $('.gfx-ins-rule', sec) });
    const top = $('.gfx-ins-top', sec);
    if (top) {
      const rulePath = coverRule(false);
      room({ trigger: top, start: 'top 80%', pictures: $$('.gfx-ins-pic-lead .gfx-ins-cvsvg', sec).concat($$('.gfx-ins-pic-lead img', sec)), detail: $$('.gfx-ins-lead > *', sec), arriving: $('.gfx-ins', sec),
        extra: (tl, at) => { if (rulePath) tl.fromTo(rulePath, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: G.hairline.duration, ease: G.DRAW, immediateRender: false }, at('picture') + G.hairline.at); } });
    }
    if ($('.gfx-ins-rows', sec)) room({ trigger: $('.gfx-ins-rows', sec), start: 'top 88%', detail: $$('.gfx-ins-row', sec), group: true });
    if ($('.gfx-ins-more', sec)) room({ trigger: $('.gfx-ins-more', sec), start: 'top 92%', detail: $$('.gfx-ins-li', sec), group: false, stagger: G.tight });
  }

  /* ---------- the close (sbx-m1.js): the line, the button, the hairline, the arrow under "human"; the doors as a group.
     The footer's dividers draw in as it rises (the designer's own interaction, on the house curve). ---------- */
  function closeInit() {
    const sec = $('.gfx-cta-sec');
    if (sec) {
      const head = $('.gfx-cta-title .heading-2', sec);
      if (head) wrapWord(head, 'human', 'gfx-w-human');
      room({ trigger: head || sec, headline: head, body: $('.gfx-cta-title .button_wrapper', sec), hairline: $('.gfx-cta-rule', sec),
        // (looked up each time: the split and its revert rebuild the heading's inner nodes)
        arrow: head && $('.gfx-w-human', head) ? { host: $('.gfx-cta-title', sec), word: elRange('.gfx-cta-title .gfx-w-human'), dark: true } : null,
        detail: $$('.gfx-door', sec), group: true });
    }
    $$('.gfx-cta-sec .divider, .footer_section_wrapper .divider').forEach(d => {
      const tw = gsap.fromTo(d, { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: G.hairline.duration, ease: G.DRAW, paused: true });
      const y = () => flowY(d) - W.innerHeight;
      ST.create({ start: y, end: 'max', onEnter: () => tw.play(), onLeaveBack: () => tw.pause(0) });
    });
  }

  /* ---------- the breath (sbx-m1.js M3): the film and the portraits keep a very slow settle while on screen, tied to the
     scroll (the reel's photographs breathe in industriesInit) ---------- */
  function breathInit(on) {
    if (!on) return;
    findRooms();
    const B = G.breath;
    const breathe = (pic, frame, range) => {
      let last = -1, q = 0.0005;
      const set = u => { const raw = B.scaleFrom + (B.scaleTo - B.scaleFrom) * u, v = u >= 1 ? B.scaleTo : u <= 0 ? B.scaleFrom : +(Math.round(raw / q) * q).toFixed(4); if (v !== last) { last = v; pic.style.scale = v; } };
      set(0);
      ST.create({ start: () => range()[0], end: () => range()[1], invalidateOnRefresh: true,
        onToggle: s => { pic.style.willChange = s.isActive ? 'transform' : ''; },
        onUpdate: s => set(s.progress), onRefresh: s => { q = 1 / Math.max(400, frame.offsetWidth || 400); set(s.progress); } });
    };
    // (1.0.5: only a film that shows; the still has its own settle in heroInit)
    const film = R.hero && [$('video', R.hero)].filter(heroFilmOn)[0];
    if (R.hero && film) breathe(film, R.hero, () => [0, Math.max(W.innerHeight, R.hero.offsetHeight)]);
    // the portraits: from the frame reaching the foot of the screen until the next room has covered it
    if (R.team) $$('.gfx-team-pic', R.team).forEach(fr => {
      const pic = $('img', fr); if (!pic) return;
      breathe(pic, fr, () => { const a = flowY(fr) - W.innerHeight; const held = R.team.hasAttribute('data-gfx-held') && R.ind;
        return [a, Math.max(a + 1, held ? flowY(R.ind) : flowY(fr) + fr.offsetHeight)]; });
    });
  }

  /* ---------- the hover mark (sbx5.js): a green line draws under the label and turns up at 38.2° into the arrow; it
     retracts on leave. Hover-capable screens only. ---------- */
  function hoverInit() {
    if (mq('(hover: none)')) return;
    const DARKS = '.gfx-hero-sec, .gfx-case-sec, .gfx-pr, .gfx-ind, .gfx-cta-sec, .footer_section_wrapper';
    const onDark = el => { for (let n = el; n && n !== D.body; n = n.parentElement) { const v = rgbOf(getComputedStyle(n).backgroundColor); if (v) return (0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]) / 255 < 0.4; if (n.matches(DARKS)) return true; } return false; };
    const textRect = label => {
      const r = D.createRange(), tw = D.createTreeWalker(label, NodeFilter.SHOW_TEXT, { acceptNode: t => (t.textContent.trim() ? 1 : 2) });
      const nodes = []; for (let t; (t = tw.nextNode());) if (!t.parentElement.closest('svg')) nodes.push(t);
      if (!nodes.length) return label.getBoundingClientRect();
      r.setStart(nodes[0], 0); r.setEnd(nodes[nodes.length - 1], nodes[nodes.length - 1].textContent.length);
      const rs = Array.prototype.slice.call(r.getClientRects()).filter(x => x.width > 0); const last = rs[rs.length - 1];
      return rs.length > 1 ? last : r.getBoundingClientRect();
    };
    const mark = (el, opts) => {
      const o = opts || {};
      if (!el || el.classList.contains('gfx-hm-host')) return;
      const label = o.label ? (typeof o.label === 'string' ? $(o.label, el) : o.label) : el; if (!label) return;
      const svg = D.createElementNS(NS, 'svg'); svg.setAttribute('class', 'gfx-hm'); svg.setAttribute('aria-hidden', 'true'); svg.setAttribute('width', '0'); svg.setAttribute('height', '0');
      const p1 = D.createElementNS(NS, 'path'), p2 = D.createElementNS(NS, 'path'); p1.setAttribute('class', 'h1'); p2.setAttribute('class', 'h2');
      [p1, p2].forEach(p => p.setAttribute('pathLength', '1')); svg.appendChild(p1); svg.appendChild(p2);
      if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
      el.classList.add('gfx-hm-host'); el.appendChild(svg);
      const place = () => safe('hover mark', () => {
        const er = el.getBoundingClientRect(); if (!er.width) return;
        const dk = typeof o.dark === 'function' ? o.dark() : o.dark;
        const dark = dk != null ? dk : onDark(el);
        let x0, x1, y, tipX, tipY;
        if (o.row) { y = er.height - 0.75; const rise = 14, run = rise / TAN; x0 = 0; tipX = er.width; x1 = tipX - run; tipY = y - rise; }
        else {
          const lr = textRect(label), h = lr.height, gap = Math.max(3, Math.round(h * 0.16));
          const glyph = o.glyph !== false && $$('.gfx-arw, .gfx-btn-arw, .gfx-team-arw', el).filter(g => g.getClientRects().length)[0], gr = glyph ? glyph.getBoundingClientRect() : null;
          x0 = lr.left - er.left; y = lr.bottom - er.top + gap;
          if (gr && gr.width) { x1 = lr.right - er.left + 2; tipX = gr.right - er.left; const run = Math.max(6, tipX - x1); tipX = x1 + run; tipY = y - run * TAN; }
          else { x1 = lr.right - er.left + h * 0.06; const rise = Math.max(5, h * 0.42), run = rise / TAN; tipX = x1 + run; tipY = y - rise; }
        }
        const hs = Math.max(4, Math.min(8, (y - tipY) * 0.42));
        svg.setAttribute('width', er.width); svg.setAttribute('height', er.height); svg.classList.toggle('on-dark', !!dark);
        p1.setAttribute('d', `M${x0} ${y} H${x1} L${tipX} ${tipY}`);
        p2.setAttribute('d', `M${tipX - hs} ${tipY} H${tipX} V${tipY + hs}`);
      });
      const on = () => { place(); requestAnimationFrame(() => el.classList.add('gfx-hm-on')); };
      const off = () => el.classList.remove('gfx-hm-on');
      el.addEventListener('mouseenter', on); el.addEventListener('mouseleave', () => { if (D.activeElement !== el || !el.matches(':focus-visible')) off(); });
      el.addEventListener('focus', () => { if (el.matches(':focus-visible')) on(); }); el.addEventListener('blur', off);
    };
    // v14 (sbx5.js DARK has .navigation_wrapper.regular): over the film the bar is transparent, so its marks take the
    // on-dark tone; past the film the bar's own background decides (light, or dark over a dark room)
    const navDark = () => (navTop ? true : null);
    $$('.gfx-nav .nav_desktop > a.navigation-item').forEach(a => mark(a, { dark: navDark }));
    // v14 (sbx5.js): every button carries the mark too (label + its arrow); the nav's bordered button marks its label
    $$('.gfx-hero-content .button, .gfx-btn-end .button').forEach(b => mark(b, { label: '.button-text' }));
    $$('.gfx-nav .nav_desktop .nav-button').forEach(a => mark(a, { label: '.navigation-item', dark: navDark }));
    $$('.gfx-team-sec .team_member_contacts a').forEach(a => mark(a, { label: a.matches('.team_member_contact_button') ? '.paragraph' : null }));
    $$('.footer_section_wrapper a').forEach(a => mark(a));
    $$('.gfx-door').forEach(d => mark(d, { label: '.heading-4', glyph: false }));
    $$('.gfx-ins-lead').forEach(a => mark(a, { label: '.gfx-ins-go' }));
    $$('.gfx-ins-row').forEach(a => mark(a, { label: '.gfx-ins-go-row' }));
    $$('.gfx-ins-text').forEach(a => mark(a, { row: true }));
    $$('.gfx-ind-go').forEach(g => mark(g, { label: '.gfx-ind-go-t', glyph: false, dark: true }));
  }

  /* ---------- the keyboard (sbx11.js + sbx7.js): a control reached before its reveal has played is shown at once; a
     control a held room has covered is brought to where it can be read ---------- */
  function keyboardInit() {
    W.addEventListener('focusin', e => safe('focus reveal', () => {
      for (let el = e.target; el && el !== D.body; el = el.parentElement) {
        if (el.hasAttribute && el.hasAttribute('data-gfx-reveal') && +getComputedStyle(el).opacity < 0.99) gsap.set(el, { opacity: 1, y: 0 });
        gsap.getTweensOf(el).forEach(t => { let root = t; while (root.parent && root.parent !== gsap.globalTimeline) root = root.parent; const st = root.scrollTrigger; if (st && st.vars.scrub) return; if (root.progress() < 1 && !root.reversed()) root.progress(1); });
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
    W.addEventListener('focusin', e => {
      const el = e.target;
      if (!kb || !mq(DESK) || !(el instanceof Element) || el === D.body || el.closest('.gfx-nav, .preloader')) return;
      requestAnimationFrame(() => safe('focus reach', () => {
        if (D.activeElement !== el || !covered(el)) return;
        const gi = el.closest('.gfx-ind-go'); if (gi && W.gfxReelY) { const i = $$('.gfx-ind-go').indexOf(gi); if (i > -1) { W.scrollTo(0, W.gfxReelY(i)); return; } }
        let held = null; for (let a = el.parentElement; a && a !== D.body; a = a.parentElement) if (a.hasAttribute('data-gfx-held') && MARKS.has(a)) held = a;
        if (!held) { el.scrollIntoView({ block: 'center' }); return; }
        const off = el.getBoundingClientRect().top - held.getBoundingClientRect().top;
        W.scrollTo(0, flowY(held) + Math.min(Math.max(0, off - W.innerHeight * 0.35), Math.max(0, held.offsetHeight - W.innerHeight)));
        if (shared && shared.resize) shared.resize();
        ST.update();
      }));
    }, true);
  }
})();
