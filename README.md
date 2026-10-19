# Grey Fox Webflow scripts

The page motion scripts for greyfoxpartners.com, served to Webflow through jsDelivr.
One folder per page (home-v2, owners, investors). Each script is the single bundled motion layer for that page.
No secrets and no data: only front-end code that is already public on the site.

## Flow 3 layout (10/20)

- `core/` is the shared layer every Flow 3 page loads: `gfx-core.css` (tokens, field inks, bar, footer I) and `gfx-core.js` (field engine, bar, room reveals, footer I, Lenis and Webflow plumbing). It exposes `window.gfx`.
- `home/` is the Home layer. `tools/build.js` bundles core + home into `home/gfx-home.bundle.min.js` and minifies both stylesheets. `manifest.json` lists the SRI hash of each served file.
- `portal/` is the demo portal shown in the market room. It loads in an iframe through `srcdoc`, because jsDelivr serves `.html` as plain text.
- Pages pin files by commit SHA: `https://cdn.jsdelivr.net/gh/brokencarry/greyfox-webflow-scripts@<sha>/home/gfx-home.bundle.min.js`.
