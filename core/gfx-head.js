/* Grey Fox · gfx head 1.0.0 (11/1). The site's one head script, served by Webflow before the first paint on every page
   (registered as the inline script "gfxhead"; it replaced gfxrestoreguard 1.0.0, whose reload/Back cover core 1.0.55 keeps
   on its own). THE CURTAIN: the page script composes every page from the end of the body, so the raw Webflow page showed
   for 0.2-0.3 s, jumped, vanished and animated in, on every load. From the first paint the page stays out of sight on the
   paper; the core lifts it the moment the page is composed and its opening is set (curtainOff). Safety: 3.5 s, then the
   page shows whatever happened; if the core never booted (a blocked script CDN) the stylesheet's class goes too and the
   page is the page Webflow serves. ?gfm=0 (the bundle off) is untouched. Register this file's text as is (under 2000 chars).
   visibility, not opacity: while the body is still being parsed Chrome painted the page through an opacity:0 wrapper
   (screenshots proved it, the computed value said 0); visibility:hidden holds from the first frame. */
(function () { try {
  if (/[?&]gfm=0(&|$)/.test(location.search)) return;
  if (!document.querySelector('link[href*="/core/gfx-core.dist.css"]')) return;   // a page without the site's stylesheet (the password page, a draft) is left alone
  var h = document.documentElement; h.classList.add('gfx-f3', 'gfx-curtain');
  var st = document.createElement('style'); st.id = 'gfx-curtain'; st.textContent = 'html.gfx-curtain .page-wrapper{visibility:hidden!important}'; (document.head || h).appendChild(st);
  window.__gfxCurtainT = setTimeout(function () { if (!(window.gfx && window.gfx.core)) h.classList.remove('gfx-f3'); h.classList.remove('gfx-curtain'); }, 3500);
} catch (e) { /* the page as it is */ } })();
