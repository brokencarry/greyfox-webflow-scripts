/*!
 * Grey Fox · gfx Contact (Flow 3), the Contact layer on the shared core + the inner-page layer (pages/gfx-pages.js).
 * contact 1.0.2 · 2026-10-20 · Webflow page "Contact v2 (Claude build)" (/contact-v2).
 *
 * WHAT IT IS
 *   What the approved local Contact (prototype/contact/final.html: r4.js + final.js) adds to the inner pages:
 *   - the offices' hours as figures on reels (each digit rolls), on arrival and on the minute; the band's figures settle
 *     after the hero's hairline, their labels after them;
 *   - the intake: the choice of reader (two cards), the form opening in place with that reader's own fields, polite
 *     validation, and the send. The form is Webflow's own (a native Form Block): a valid note is left to Webflow to send
 *     (notifications: Site settings > Forms); an invalid one never reaches it. The thanks is the Form Block's success
 *     state, set in the house's words; the failure line names the address for the reader's path;
 *   - the questions follow the reader the choice was made for (business owners / investment firms);
 *   - the note grows with what is written.
 * Reduced motion: no motion; everything else the same.
 */
(function () {
  'use strict';
  var W = window, D = document, gfx = W.gfx;
  if (!gfx || !gfx.pages || W.__gfxContact) return;
  W.__gfxContact = '1.0.12';
  const P = gfx.pages, O = P.O, mk = P.mk, H = D.documentElement, G = gfx.G, $ = gfx.$, $$ = gfx.$$, safe = gfx.safe, REDUCE = gfx.REDUCE;
  const GROUP = G.group;
  const el = (tag, cls, text) => { const n = D.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
  const refresh = () => gfx.refresh();
  const tellIn = (sayEl, t) => { if (!sayEl) return; sayEl.textContent = ''; setTimeout(() => { sayEl.textContent = t; }, 80); };

  /* ========================= the hours: each office's time, digits on reels (r4.js) ========================= */
  const LH = 1.1;   // em per digit
  let clocks = [];
  function clocksBuild() {
    clocks = $$(O('r4-time')).map(t => {
      let f; try { f = new Intl.DateTimeFormat('en-US', { timeZone: t.getAttribute('data-tz'), hour: 'numeric', minute: '2-digit', hour12: true }); } catch (e) { return null; }
      const vis = el('span', 'r4-roll'); vis.setAttribute('aria-hidden', 'true');
      const sr = mk('span', 'ow-sr');
      t.textContent = ''; t.append(vis, sr);
      let shape = null;
      const build = s => {
        vis.textContent = '';
        [...s].forEach(ch => {
          if (/\d/.test(ch)) { const reel = el('span', 'r4-reel'), strip = el('span', 'r4-strip'); for (let d = 0; d < 10; d++) strip.append(el('span', '', String(d))); reel.append(strip); vis.append(reel); }
          else vis.append(el('span', 'r4-sep', ch));
        });
        shape = s.replace(/\d/g, '0');
      };
      const set = (s, roll, delay0 = 0) => {
        if (s.replace(/\d/g, '0') !== shape) { build(s); if (roll) set(s.replace(/\d/g, '0'), 0); }
        $$('.r4-strip', vis).forEach((strip, k) => {
          const dg = +s.replace(/\D/g, '')[k], y = `translateY(${(-dg * LH).toFixed(2)}em)`;
          if (!roll) { strip.style.transition = 'none'; strip.style.transform = y; void strip.offsetWidth; strip.style.transition = ''; return; }
          strip.style.transitionDuration = (roll + k * 0.1).toFixed(2) + 's'; strip.style.transitionDelay = (delay0 + k * 0.07).toFixed(2) + 's';
          strip.style.transform = y;
        });
      };
      const now = () => f.format(new Date());
      const say = () => { sr.textContent = now(); try { t.setAttribute('datetime', new Date().toISOString()); } catch (e) { /* */ } };
      return { t, now, set, say };
    }).filter(Boolean);
    clocks.forEach(c => { c.say(); c.set(c.now().replace(/\d/g, '0'), 0); });
    if (clocks.length) {
      const tick = () => clocks.forEach(c => { c.set(c.now(), REDUCE ? 0 : 1.1); c.say(); });
      setTimeout(() => { tick(); setInterval(tick, 60000); }, 60000 - Date.now() % 60000 + 60);
    }
  }
  const rollIn = () => clocks.forEach((c, i) => c.set(c.now(), REDUCE ? 0 : G.figure.duration, i * GROUP));

  /* the hero's foot: the band's figures settle and roll in after the hairline; their labels follow (house order) */
  function heroDetail(tl, room) {
    const band = $(O('r4-band'), room); if (!band) { rollIn(); return; }
    const gs = gfx.gsap, figs = $$(O('r4-time') + ', ' + O('r4-tel'), band), keys = $$(O('r4-b-k'), band);
    gs.set(figs, { opacity: 0, y: G.body.y }); gs.set(keys, { opacity: 0, y: G.detail.y });
    H.classList.add('r4-on');
    tl.call(() => { gs.to(figs, { opacity: 1, y: 0, duration: G.body.duration, ease: G.SETTLE, stagger: GROUP, clearProps: 'transform' }); rollIn(); }, null, G.figure.at)
      .call(() => gs.to(keys, { opacity: 1, y: 0, duration: G.detail.duration, ease: G.SETTLE, stagger: G.detail.stagger, clearProps: 'transform' }), null, G.detail.at);
  }

  /* the window keeps its first-screen height when the form opens beneath the words (r4.js A) */
  function fitWindow() {
    const hero = P.R.hero, pic = hero && $(O('r4a-pic'), hero), hfoot = hero && $(O('r4-hfoot'), hero);
    if (!pic || !hfoot) return;
    const fit = () => { const padB = parseFloat(getComputedStyle(hero).paddingBottom) || 0; hero.style.setProperty('--r4-foot-h', Math.round(hfoot.offsetHeight + padB) + 'px'); };
    fit(); W.addEventListener('resize', fit); if (D.fonts && D.fonts.ready) D.fonts.ready.then(fit);
  }

  /* ========================= the questions: one reader at a time (r4.js) ========================= */
  let showQs = () => {};
  function qswitchWire() {
    $$(O('r4-qswitch')).forEach(sw => {
      const room = sw.closest(O('ow-room')), groups = $$(O('r4-qgroup'), room);
      showQs = k => {
        $$(O('r4-qb'), sw).forEach(b => b.setAttribute('aria-pressed', String(b.getAttribute('data-q') === k)));
        groups.forEach(g => {
          const on = g.getAttribute('data-q') === k;
          if (on && g.hidden) { g.hidden = false; if (P.qsInView) P.playList(g); }
          else if (!on) g.hidden = true;
        });
        setTimeout(refresh, 60);
      };
      $$(O('r4-qb'), sw).forEach(b => b.addEventListener('click', () => showQs(b.getAttribute('data-q'))));
    });
  }

  /* ========================= the intake (r4.js + final.js, on Webflow's own form) ========================= */
  const COPY = { subject: { owner: 'Contact page: a business owner', investor: 'Contact page: an investor' }, fail: ['This did not send. Please try again, or write to ', '.'], failTo: { owner: 'inquiries@greyfoxpartners.com', investor: 'inquiries@greyfoxpartners.com' } };
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const okReach = v => EMAIL.test(v) || (/^[\d\s()+.\-]+$/.test(v) && v.replace(/\D/g, '').length >= 7);
  const navBottom = () => { const n = $('.navigation_wrapper'); if (!n) return 74; const b = Math.max(n.getBoundingClientRect().bottom, n.offsetHeight); return b > 0 && b < W.innerHeight / 2 ? b : 74; };
  // (1.0.12, engine pass 10/29) on a touch screen there is no Lenis: the scroll is the browser's own smooth scroll, and a
  // ScrollTrigger refresh landing during it (the page grows as the fields open or the error lines show) parks the page and puts
  // it back where it was, which cancels the scroll: a phone reader stayed below the first error, the fields stayed low. Each
  // refresh in the next 1.6 s aims the scroll again once the refresh has finished (a touch of the reader's own ends that)
  const scrollTo = (target, offset) => {
    const aim = () => gfx.scrollToY(target.getBoundingClientRect().top + W.scrollY + offset, 1.2); aim();
    const ST = W.ScrollTrigger; if (gfx.lenis || !ST || !ST.addEventListener) return;
    let t = 0; const again = () => { clearTimeout(t); t = setTimeout(aim, 40); };
    const quit = () => { ST.removeEventListener('refresh', again); W.removeEventListener('touchstart', quit); };
    ST.addEventListener('refresh', again); W.addEventListener('touchstart', quit, { passive: true }); setTimeout(quit, 1600);
  };
  function formWire() {
    // (Webflow's Form Block wrapper and its success/error states carry no data-o: they are found by class)
    const box = $(O('r4-form')) || $('.gfx-pg-r4a-form') || $('.w-form'), form = box && $('form', box); if (!form) return;
    const room = box.closest(O('ow-room'));
    let copy = COPY; try { const c = JSON.parse(form.getAttribute('data-r4-copy') || 'null'); if (c && c.subject) copy = c; } catch (e) { /* the house's words */ }
    const SUBJECT = copy.subject || {}, FAIL = { lead: (copy.fail || [''])[0], end: (copy.fail || ['', ''])[1], to: copy.failTo || {} };
    form.noValidate = true;
    const radios = $$(O('r4-radio'), room);
    const sayEl = $('[data-r4-say]', box) || $(O('ow-sr') + '[aria-live]', box), fieldsBox = $(O('r4-fields'), form), done = $(O('r4-done'), box) || $('.w-form-done', box), fail = $(O('r4-fail'), box) || $('.w-form-fail', box);
    const audience = form.elements.audience, subject = form.elements._subject, gotcha = form.elements._gotcha;
    const inputs = () => $$(O('r4-in'), form);
    // (the reader's own words never reach a session capture)
    $$('input, textarea', box).concat(radios).forEach(i => i.classList.add('fs-exclude'));
    // (1.0.4) Webflow writes its default placeholder ("Example text") into every field it cannot be told to leave empty; the
    // fields carry their labels, so the default is removed (the stylesheet already hides it before this runs)
    $$('input[placeholder="Example text"], textarea[placeholder="Example text"]', form).forEach(i => i.removeAttribute('placeholder'));
    inputs().forEach(i => { if (i.getAttribute('data-kind') === 'reach') { i.setAttribute('inputmode', 'email'); i.spellcheck = false; i.setAttribute('autocapitalize', 'off'); } });
    let path = null, sent = false;
    // (1.0.10, pre-launch pass 10/23) the note's grow() reads these; declared here so an arrival with ?for= (which chooses the
    // path before the rest of this setup has run) no longer throws inside choose() and loses what follows
    let lastH = 0;
    const tas = $$('textarea' + O('r4-in'), form);
    // the fields open below the choice: bring them into view if they open low on the screen, never so far that the chosen
    // card goes under the bar (the cards keep 32 px below it)
    const bringFields = () => { const r = fieldsBox.getBoundingClientRect(); if (r.top > W.innerHeight * 0.62) {
      const doors = $(O('r4-doors'), room), cap = doors ? doors.getBoundingClientRect().top - (navBottom() + 32) : Infinity;
      scrollTo(fieldsBox, -Math.round(W.innerHeight * 0.3) - Math.max(0, (r.top - Math.round(W.innerHeight * 0.3)) - cap)); } };
    const setFail = k => { if (!fail) return; const to = FAIL.to[k] || FAIL.to.investor; const p = $('p', fail) || fail; p.textContent = ''; p.append(FAIL.lead); const a = el('a', '', to); a.href = 'mailto:' + to; p.append(a, FAIL.end); };
    const choose = (k, byUser) => {
      if (k === path || sent) return;
      const first = !path, was = path; path = k;
      room.setAttribute('data-path', k); form.setAttribute('data-path', k);
      if (audience) audience.value = k; if (subject) subject.value = SUBJECT[k] || '';
      setFail(k);
      const own = $$(O('r4-f') + '[data-path]', form);
      const leaving = own.filter(f => f.getAttribute('data-path') === was), coming = own.filter(f => f.getAttribute('data-path') === k);
      const gs = !REDUCE && W.gsap ? W.gsap : null;
      const show = () => {
        own.forEach(f => { const on = f.getAttribute('data-path') === k; f.hidden = !on; $$('input, textarea', f).forEach(i => { i.disabled = !on; i.setAttribute('aria-required', String(on)); }); });
        $$(O('r4-f') + ':not([data-path]):not(' + O('is-wide') + ') ' + O('r4-in'), form).forEach(i => i.setAttribute('aria-required', 'true'));
        const rows = first ? $$(O('r4-f') + ':not([hidden]), ' + O('r4-foot'), form) : coming;
        if (first) box.classList.add('gfx-pg-open');
        if (gs) {
          gs.fromTo(rows, { opacity: 0, y: G.detail.y }, { opacity: 1, y: 0, duration: G.body.duration, ease: G.SETTLE, stagger: first ? GROUP / 2 : GROUP, clearProps: 'transform,opacity' });
          const lines = first ? $$(O('r4-f') + ':not([hidden]) ' + O('r4-line'), form) : coming.map(f => $(O('r4-line'), f)).filter(Boolean);
          gs.fromTo(lines, { scaleX: 0 }, { scaleX: 1, duration: G.hairline.duration, ease: G.DRAW, stagger: GROUP / 2, delay: G.hairline.at - G.body.at, clearProps: 'transform' });
        }
        refresh(); grow();
        // the fields open below the choice: bring them into view if they open low on the screen (a pointer choice only),
        // never so far that the chosen card goes under the bar (the cards keep 32 px below it)
        if (byUser && first) setTimeout(bringFields, 160);
      };
      if (gs && leaving.length) gs.to(leaving, { opacity: 0, y: -8, duration: G.leave.duration, ease: G.leave.ease, onComplete: () => { gs.set(leaving, { clearProps: 'opacity,transform' }); show(); } });
      else show();
      showQs(k);
      if (byUser) tellIn(sayEl, k === 'owner' ? 'The form for business owners follows.' : 'The form for investors follows.');
    };
    radios.forEach(r => r.addEventListener('change', () => { if (r.checked) choose(r.value, true); }));
    // (1.0.8, founder 10/22) a link that names the reader (?for=owner or ?for=investor, from the door cards) opens the form
    // on that path, as if the reader had chosen it
    safe('preselect', () => { const want = (new URLSearchParams(location.search).get('for') || '').toLowerCase(); const pre = radios.find(r => r.value === want); if (pre && !path) { pre.checked = true; choose(want, false);
      // (1.0.10, pre-launch pass 10/23) once the page has settled, the arrival brings the fields into view as a hand-picked path
      // does (a scroll issued during the opening was lost); a reader already scrolling is left alone
      const go = () => setTimeout(() => { if (W.scrollY < 40) bringFields(); }, 700); if (D.readyState === 'complete') go(); else W.addEventListener('load', go, { once: true }); } });
    const pre = radios.find(r => r.checked); if (pre) choose(pre.value, false);   // (the browser restoring the choice on Back)
    // (1.0.9, polish 10/23) the door cards at the foot of this page name a path too (/contact?for=owner|investor): on Contact
    // itself they pick that path in the form above and bring the reader to it, instead of reloading the page at its top
    safe('doors here', () => $$('a[href*="for="]').forEach(a => {
      let u; try { u = new URL(a.getAttribute('href'), location.href); } catch (e) { return; } if (u.pathname !== location.pathname) return;
      const want = (u.searchParams.get('for') || '').toLowerCase(), door = radios.find(r => r.value === want); if (!door) return;
      a.addEventListener('click', e => { e.preventDefault(); if (!door.checked) { door.checked = true; choose(want, false); } scrollTo(fieldsBox || form, -(navBottom() + 24)); setTimeout(() => door.focus({ preventScroll: true }), 900); });
    }));

    // errors
    const setErr = (f, msg) => { f.setAttribute('aria-invalid', msg ? 'true' : 'false'); const e = D.getElementById(f.id + '-err'); if (e) { e.textContent = msg || ''; e.hidden = !msg; } };
    const check = () => {
      const bad = [];
      inputs().forEach(f => {
        if (f.disabled || f.closest('[hidden]')) return;
        const val = f.value.trim(), req = f.getAttribute('aria-required') === 'true'; let msg = '';
        if (req && !val) msg = f.getAttribute('data-err');
        else if (val && f.getAttribute('data-kind') === 'reach' && !okReach(val)) msg = f.getAttribute('data-err-fmt');
        setErr(f, msg); if (msg) bad.push([f, msg]);
      });
      if (bad.length) {
        const f0 = bad[0][0]; f0.focus({ preventScroll: true }); tellIn(sayEl, bad.length > 1 ? `${bad[0][1]} ${bad.length - 1} more to check.` : bad[0][1]);
        setTimeout(() => { const r = f0.getBoundingClientRect(), top = navBottom() + 16; if (r.top < top || r.bottom > W.innerHeight - 16) scrollTo(f0, -Math.max(top, Math.round(W.innerHeight * 0.3))); }, 160);
      }
      refresh();
      return !bad.length;
    };
    form.addEventListener('input', e => { if (e.target.getAttribute('aria-invalid') === 'true') setErr(e.target, ''); });
    // the keyboard's Next key moves to the next field rather than sending a half-written form
    form.addEventListener('keydown', e => {
      if (e.key !== 'Enter' || e.isComposing || !(e.target instanceof HTMLInputElement) || !e.target.matches(O('r4-in'))) return;
      const list = inputs().filter(f => !f.disabled && !f.closest('[hidden]')), i = list.indexOf(e.target);
      if (i > -1 && i < list.length - 1) { e.preventDefault(); list[i + 1].focus(); }
    });

    // the thanks: Webflow shows its success state (the form leaves); it arrives in the house's order and takes focus
    const finish = () => {
      if (sent) return; sent = true; box.classList.add('is-sent');
      radios.forEach(r => { r.disabled = true; });
      const h = done && $('h2', done); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
      if (done) tellIn(sayEl, done.textContent.replace(/\s+/g, ' ').trim());
      const gs = !REDUCE && W.gsap ? W.gsap : null;
      if (gs && done) gs.fromTo($$(':scope > *', done), { opacity: 0, y: G.detail.y }, { opacity: 1, y: 0, duration: G.body.duration, ease: G.SETTLE, stagger: GROUP, clearProps: 'transform' });
      refresh();
      // (final.js: where the headline and the thanks fit on the screen together, the headline is brought clear of the bar;
      // otherwise the thanks a third of the way down, never under the bar)
      setTimeout(() => { if (!done) return; const r = done.getBoundingClientRect(), top = navBottom() + 16, h1 = $('h1', room);
        const hr = h1 && h1.getBoundingClientRect();
        if (hr && r.bottom - hr.top <= W.innerHeight - top - 16) { if (hr.top < top || r.bottom > W.innerHeight - 16) scrollTo(h1, -top); return; }
        if (r.top < top || r.bottom > W.innerHeight - 16) scrollTo(done, -(W.innerHeight < 560 ? top : Math.max(top, Math.round(W.innerHeight * 0.3)))); }, 260);
    };
    if (done && 'MutationObserver' in W) { const mo = new MutationObserver(() => { if (getComputedStyle(done).display !== 'none') { mo.disconnect(); finish(); } }); mo.observe(done, { attributes: true, attributeFilter: ['style', 'class'] }); }
    if (fail && 'MutationObserver' in W) new MutationObserver(() => { if (getComputedStyle(fail).display !== 'none') refresh(); }).observe(fail, { attributes: true, attributeFilter: ['style'] });

    // the send: checked here first (capture), so an invalid note never reaches Webflow's own handler
    form.addEventListener('submit', e => {
      const stop = () => { e.preventDefault(); e.stopImmediatePropagation(); };
      if (sent) { stop(); return; }
      if (!path) { stop(); radios[0] && radios[0].focus(); tellIn(sayEl, 'Please choose one of the two: ' + radios.map(x => { const l = $('label[for="' + x.id + '"] ' + O('r4-door-t')); return l ? l.textContent : ''; }).join(', or ') + '.'); return; }
      if (!check()) { stop(); return; }
      if (fail) fail.style.display = 'none';
      if (gotcha && gotcha.value) { stop(); form.style.display = 'none'; if (done) done.style.display = 'block'; return; }   // a robot: thank it, send nothing
      // a valid note: Webflow sends it and shows its own success state
    }, true);

    // the note grows with what is written: no scroll bar, no resize grip (final.js)
    // (lastH and tas are declared with the form's state above: grow() runs from choose() before this point on an arrival)
    function grow() { tas.forEach(ta => { const min = parseFloat(getComputedStyle(ta).minHeight) || 96; ta.style.height = 'auto'; const h = Math.max(min, ta.scrollHeight + 2); ta.style.height = h + 'px'; if (Math.abs(h - lastH) > 1) { lastH = h; refresh(); } }); }
    tas.forEach(ta => ta.addEventListener('input', grow)); W.addEventListener('resize', grow);
  }

  P.run({
    current: 'contact',
    heroDetail,
    dom: () => {
      // (1.0.11, designer 10/26: "remove the dash on the contact form, only show text when there is an error") a field's
      // error line is hidden until it has words: the attribute is set here as well as in the Designer, and a rule keeps
      // the line away whether it is hidden or merely empty (a display rule anywhere would otherwise beat the attribute)
      safe('errs', () => { $$(O('r4-err')).forEach(e => { if (!e.textContent.trim()) e.hidden = true; });
        if (!D.getElementById('gfx-r4-err')) { const st = D.createElement('style'); st.id = 'gfx-r4-err'; st.textContent = '[data-o~="r4-err"][hidden],[data-o~="r4-err"]:empty{display:none!important}' +
          // (1.0.11, designer 10/26: "the success message's style should match the other pages") the ported sheet's rule for
          // Webflow's own done block (html body .w-form-done h2, bold) outranked the heading's light serif; the weight is restored
          'html body h2[data-o~="r4-done-h"],html body .w-form-done h2[data-o~="r4-done-h"]{font-weight:200!important}'; (D.head || H).appendChild(st); } });
      safe('clocks', clocksBuild); safe('qswitch', qswitchWire); safe('form', formWire); safe('window', fitWindow); },
    still: () => { H.classList.add('r4-shown'); rollIn(); }
  });
})();
