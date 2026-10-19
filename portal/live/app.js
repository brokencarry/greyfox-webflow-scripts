/**
 * Pipeline Report — Grey Fox Partners
 * Editorial document renderer with tiered visual hierarchy.
 */
(function () {
  'use strict';

  const $ = sel => document.querySelector(sel);

  function getMandateKey() {
    // Server injects window.__MANDATE_KEY__ from config.json subdomainMap
    // so new clients work immediately without touching app.js
    const p = new URLSearchParams(window.__GF_PORTAL_Q || window.location.search);
    return p.get('mandate') || window.__MANDATE_KEY__ || 'garage-door';
  }

  function esc(s) { if (!s) return ''; const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

  // --- Full API response stored for tab switching ---
  let _fullData = null;
  let _activeTab = 'all';
  let _isAdmin = false;
  let _stageOrder = [];

  // Stage tiers — determines visual treatment
  const SIGNAL_STAGES = new Set(['Closed','Diligence','LOI','IOI','Data Received','DRL Sent','NDA Executed','Handoff','Qualified','Engaged']);
  const NURTURE_STAGES = new Set(['Nurture']);

  function stageTier(stage) {
    if (SIGNAL_STAGES.has(stage)) return 'signal';
    if (NURTURE_STAGES.has(stage)) return 'nurture';
    return 'pass';
  }

  // Deep pipeline = Handoff and beyond
  const DEEP_STAGES = new Set(['Closed','Diligence','LOI','IOI','Data Received','DRL Sent','NDA Executed','Handoff']);
  // Active = Qualified + Engaged
  const ACTIVE_STAGES = new Set(['Qualified','Engaged']);

  // BIC shown for Qualified and deeper
  const BIC_STAGES = new Set(['Qualified','Data Received','DRL Sent','NDA Executed','Handoff','IOI','LOI','Diligence','Closed','Nurture']);

  // Stages that show the v2 metadata slots (tenure, ownership, next action)
  // Excludes Closed and Nurture per Shivam's direction
  const METADATA_STAGES = new Set(['Qualified','Handoff','NDA Executed','DRL Sent','Data Received','IOI','LOI','Diligence']);

  // Feature flags (populated from API response)
  let _features = { namedOwner: false, nextAction: false };


  // Stage priority order
  const STAGE_RANK = ['Closed','Diligence','LOI','IOI','Data Received','DRL Sent','NDA Executed','Handoff','Qualified','Engaged','Nurture','Seller Pass','Internal Pass'];
  let _openStage = null;

  // --- Summary ---
  function renderSummary(data) {
    const strip = $('#summaryStrip');
    strip.innerHTML = '';
    const passStages = new Set(['Internal Pass', 'Seller Pass']);
    data.summary.forEach(s => {
      const cell = document.createElement('div');
      cell.className = 'summary-cell' + (passStages.has(s.stage) ? ' is-pass' : '');
      cell.innerHTML = `<div class="num">${s.count}</div><div class="lbl">${esc(s.stage)}</div>`;
      cell.addEventListener('click', () => scrollToStage(s.stage));
      strip.appendChild(cell);
    });
  }

  function scrollToStage(stage) {
    const id = 'stage-' + stage.replace(/\s+/g, '-').toLowerCase();
    const el = document.getElementById(id);
    if (!el) return;
    const c = el.querySelector('.stage-companies');
    const ch = el.querySelector('.stage-chevron');
    if (c && c.classList.contains('collapsed')) {
      c.classList.remove('collapsed');
      c.style.maxHeight = 'none';
      if (ch) ch.classList.remove('collapsed');
    }
    requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }

  // --- Movements ---
  function renderMovements(data) {
    const body = $('#movementBody');
    const noMv = $('#noMovements');
    body.innerHTML = '';
    if (!data.movements || !data.movements.length) { noMv.classList.remove('hidden'); return; }
    noMv.classList.add('hidden');
    data.movements.forEach(m => {
      const tr = document.createElement('tr');
      const fromTo = m.from ? `${esc(m.from)} \u2192 ${esc(m.to)}` : esc(m.to);
      tr.innerHTML = `<td class="co-name mv-link">${esc(m.company)}</td><td class="${m.isPass ? 'stage-pass' : 'stage-advance'}">${fromTo}</td>`;
      // Click company name to scroll to that company card
      const nameCell = tr.querySelector('.mv-link');
      nameCell.addEventListener('click', () => scrollToCompany(m.company));
      body.appendChild(tr);
    });
  }

  function scrollToCompany(name) {
    const row = document.querySelector(`.company-row[data-company="${CSS.escape(name)}"]`);
    const passRow = row ? null : document.querySelector(`tr[data-company="${CSS.escape(name)}"]`);
    if (!row && !passRow) return;
    // Ensure parent stage section is expanded
    const stageSection = (row || passRow).closest('.stage-section') || (row || passRow).closest('.pass-stage-section');
    if (stageSection) {
      const companies = stageSection.querySelector('.stage-companies');
      const ch = stageSection.querySelector('.stage-chevron');
      if (companies && companies.classList.contains('collapsed')) {
        companies.classList.remove('collapsed');
        companies.style.maxHeight = 'none';
        if (ch) ch.classList.remove('collapsed');
      }
    }
    const target = row || passRow;
    requestAnimationFrame(() => target.scrollIntoView({ behavior: 'smooth', block: 'center' }));
    // Brief highlight pulse
    if (row) {
      row.classList.add('mv-highlight');
      setTimeout(() => row.classList.remove('mv-highlight'), 1800);
    } else {
      passRow.classList.add('mv-highlight-row');
      setTimeout(() => passRow.classList.remove('mv-highlight-row'), 1800);
    }
  }

  // --- Company row (Option C: Split Card — Hero Data + Detail Grid) ---
  function buildCompanyRow(co, stage) {
    const domain = co.website ? co.website.replace(/^https?:\/\//, '').replace(/\/$/, '') : '';
    const href = co.website ? (co.website.startsWith('http') ? co.website : 'http://' + co.website) : '';

    const urlHtml = domain ? `<div class="co-url"><a href="${esc(href)}" target="_blank" rel="noopener" onclick="event.stopPropagation()">${esc(domain)}</a></div>` : '';

    // --- v2 metadata slots (only for METADATA_STAGES) ---
    const showMeta = METADATA_STAGES.has(stage);
    const dash = '<span class="co-empty">\u2014</span>';

    // ── HERO METRICS (top zone, right side) ──
    // Revenue, EBITDA, In Stage, Location — always shown for Qualified+ (populated or dash)
    // Dashes stay visible to push team accountability
    let heroHtml = '';
    if (showMeta) {
      const revVal = co.revenue ? esc(co.revenue) : dash;
      const ebitdaVal = co.ebitda ? esc(co.ebitda) : dash;
      let tenureVal = dash;
      if (co.stageChangeDate) {
        const days = Math.floor((Date.now() - new Date(co.stageChangeDate).getTime()) / 86400000);
        tenureVal = `${days} day${days !== 1 ? 's' : ''}`;
      }
      const locVal = co.states ? esc(co.states) : dash;
      heroHtml = `<div class="co-hero">
        <div class="co-hero-metric"><span class="co-hero-label">Revenue</span><span class="co-hero-value co-money">${revVal}</span></div>
        <div class="co-hero-metric"><span class="co-hero-label">EBITDA</span><span class="co-hero-value co-money">${ebitdaVal}</span></div>
        <div class="co-hero-metric"><span class="co-hero-label">In Stage</span><span class="co-hero-value">${tenureVal}</span></div>
        <div class="co-hero-metric"><span class="co-hero-label">Location</span><span class="co-hero-value">${locVal}</span></div>
      </div>`;
    } else {
      // Pre-Qualified: Revenue, EBITDA, Location — left to right
      const chips = [];
      chips.push(`<div class="co-chip"><span class="co-chip-label">Revenue</span><span class="co-chip-value co-money">${co.revenue ? esc(co.revenue) : dash}</span></div>`);
      chips.push(`<div class="co-chip"><span class="co-chip-label">EBITDA</span><span class="co-chip-value co-money">${co.ebitda ? esc(co.ebitda) : dash}</span></div>`);
      chips.push(`<div class="co-chip"><span class="co-chip-label">Location</span><span class="co-chip-value">${co.states ? esc(co.states) : dash}</span></div>`);
      if (chips.length) heroHtml = `<div class="co-meta-right">${chips.join('')}</div>`;
    }

    // ── OPERATIONAL STRIP (bottom zone) ──
    // Court + Action Date strip (Location moved to hero)
    // Next Action gets its own full-width row below
    let stripHtml = '';
    let nextActionRowHtml = '';
    if (showMeta) {
      const courtVal = co.ballInCourt ? esc(co.ballInCourt) : dash;

      let actionDateInner = dash;
      let actionDateClasses = '';
      if (co.nextActionDate) {
        const daysUntil = Math.floor((new Date(co.nextActionDate).getTime() - Date.now()) / 86400000);
        if (daysUntil < 0) { actionDateClasses = ' co-action-overdue'; }
        else if (daysUntil <= 2) { actionDateClasses = ' co-action-imminent'; }
        else if (daysUntil <= 7) { actionDateClasses = ' co-action-approaching'; }
        const dateStr = new Date(co.nextActionDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const dateSuffix = daysUntil < 0 ? ' (overdue)' : daysUntil <= 2 ? ' (due)' : '';
        actionDateInner = dateStr + dateSuffix;
      }

      stripHtml = `<div class="co-strip">
        <div class="co-strip-item"><span class="co-strip-label">Court</span><span class="co-strip-value">${courtVal}</span></div>
        <div class="co-strip-item"><span class="co-strip-label">Action Date</span><span class="co-strip-value${actionDateClasses}">${actionDateInner}</span></div>
      </div>`;

      // Next Action: own row with full width for longer text
      const actionVal = co.nextAction ? esc(co.nextAction) : dash;
      nextActionRowHtml = `<div class="co-next-action-row">
        <span class="co-next-action-label">Next Action</span>
        <span class="co-next-action-text">${actionVal}</span>
      </div>`;
    }

    let notesFullHtml = '';
    if (co.notes) {
      notesFullHtml = `<div class="co-notes">${esc(co.notes)}</div>`;
    }

    const hasDetail = !!(co.notes);
    const defaultOpen = hasDetail && stage === _openStage;
    const stateClass = defaultOpen ? ' co-collapsible co-expanded' : (hasDetail ? ' co-collapsible co-collapsed' : '');

    // Notes icon indicator (small doc icon next to name when notes exist)
    const notesIconHtml = hasDetail ? '<svg class="co-notes-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>' : '';

    // Admin stage badge
    let stageBadgeHtml = '';
    if (_isAdmin && co.stage) {
      stageBadgeHtml = `<span class="admin-stage-badge" data-admin-stage="true">${esc(co.stage)} ${CHEVRON_DOWN_SVG}</span>`;
    }

    const row = document.createElement('div');
    row.className = 'company-row' + stateClass;
    row.setAttribute('data-company', co.name);
    if (co.accountId) row.setAttribute('data-account-id', co.accountId);
    row.innerHTML = `
      <div class="company-card${showMeta ? ' co-structured' : ''}">
        <div class="co-header">
          <div class="co-header-left">
            <div class="co-top-line">
              <span class="co-name">${esc(co.name)}</span>
              ${stageBadgeHtml}
              ${notesIconHtml}
            </div>
            ${urlHtml}
          </div>
          ${heroHtml}
          ${hasDetail ? '<svg class="co-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>' : ''}
        </div>
        ${nextActionRowHtml}
        ${stripHtml}
        <div class="co-detail">
          ${notesFullHtml}
        </div>
      </div>
    `;

    // --- Wire up admin inline editing ---
    if (_isAdmin && co.accountId) {
      // Stage badge dropdown
      const stageBadge = row.querySelector('[data-admin-stage]');
      if (stageBadge) {
        makeEditableSelect(stageBadge, 'stage', co.stage, ALL_STAGES, co.accountId, co.oppId);
      }

      // Hero metrics (Revenue, EBITDA, In Stage, Location)
      const heroMetrics = row.querySelectorAll('.co-hero-metric');
      heroMetrics.forEach(metric => {
        const label = metric.querySelector('.co-hero-label');
        const value = metric.querySelector('.co-hero-value');
        if (!label || !value) return;
        const labelText = label.textContent.trim();
        if (labelText === 'Revenue') {
          makeEditableText(value, 'revenue', co.revenueRaw != null ? String(co.revenueRaw) : '', co.accountId, co.oppId);
        } else if (labelText === 'EBITDA') {
          makeEditableText(value, 'ebitda', co.ebitdaRaw != null ? String(co.ebitdaRaw) : '', co.accountId, co.oppId);
        } else if (labelText === 'Location') {
          makeEditableText(value, 'states', co.statesRaw || '', co.accountId, co.oppId);
        }
        // "In Stage" is calculated, not editable
      });

      // Pre-Qualified chips (Revenue, EBITDA, Location)
      const chips = row.querySelectorAll('.co-chip');
      chips.forEach(chip => {
        const label = chip.querySelector('.co-chip-label');
        const value = chip.querySelector('.co-chip-value');
        if (!label || !value) return;
        const labelText = label.textContent.trim();
        if (labelText === 'Revenue') {
          makeEditableText(value, 'revenue', co.revenueRaw != null ? String(co.revenueRaw) : '', co.accountId, co.oppId);
        } else if (labelText === 'EBITDA') {
          makeEditableText(value, 'ebitda', co.ebitdaRaw != null ? String(co.ebitdaRaw) : '', co.accountId, co.oppId);
        } else if (labelText === 'Location') {
          makeEditableText(value, 'states', co.statesRaw || '', co.accountId, co.oppId);
        }
      });

      // Strip items (Court, Action Date)
      const stripItems = row.querySelectorAll('.co-strip-item');
      stripItems.forEach(item => {
        const label = item.querySelector('.co-strip-label');
        const value = item.querySelector('.co-strip-value');
        if (!label || !value) return;
        const labelText = label.textContent.trim();
        if (labelText === 'Court') {
          makeEditableSelect(value, 'ballInCourt', co.ballInCourt || '', ['Grey Fox', 'Client', 'Founder', ''], co.accountId, co.oppId);
        } else if (labelText === 'Action Date') {
          makeEditableText(value, 'nextActionDate', co.nextActionDate || '', co.accountId, co.oppId);
        }
      });

      // Next Action text
      const nextActionText = row.querySelector('.co-next-action-text');
      if (nextActionText) {
        makeEditableText(nextActionText, 'nextAction', co.nextAction || '', co.accountId, co.oppId);
      }

      // Notes
      const notesEl = row.querySelector('.co-notes');
      if (notesEl) {
        makeEditableText(notesEl, 'notes', co.notes || '', co.accountId, co.oppId);
      }

    }

    if (hasDetail) {
      const header = row.querySelector('.co-header');
      const detail = row.querySelector('.co-detail');
      if (defaultOpen) {
        detail.style.maxHeight = 'none';
      }
      header.addEventListener('click', function(e) {
        if (e.target.closest('a')) return;
        if (row.classList.contains('co-collapsed')) {
          row.classList.remove('co-collapsed');
          row.classList.add('co-expanded');
          detail.style.maxHeight = detail.scrollHeight + 'px';
          const done = () => { if (row.classList.contains('co-expanded')) detail.style.maxHeight = 'none'; detail.removeEventListener('transitionend', done); };
          detail.addEventListener('transitionend', done);
        } else {
          // start height must exist before the 0 !important class lands,
          // or the collapse snaps instead of easing (stage sections do this)
          detail.style.maxHeight = detail.scrollHeight + 'px';
          detail.offsetHeight;
          row.classList.remove('co-expanded');
          row.classList.add('co-collapsed');
        }
      });
    }

    return row;
  }

  // --- Build a stage section ---
  function buildStageSection(section, startExpanded) {
    const id = 'stage-' + section.stage.replace(/\s+/g, '-').toLowerCase();
    const div = document.createElement('div');
    div.className = 'stage-section';
    div.id = id;
    div.setAttribute('data-stage', section.stage);

    const header = document.createElement('div');
    header.className = 'stage-header';
    header.innerHTML = `
      <div class="stage-title">${esc(section.stage)}</div>
      <div class="stage-count">${section.count}</div>
      <svg class="stage-chevron${startExpanded ? '' : ' collapsed'}" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
    `;

    const companies = document.createElement('div');
    companies.className = 'stage-companies' + (startExpanded ? '' : ' collapsed');
    section.companies.forEach(co => companies.appendChild(buildCompanyRow(co, section.stage)));

    div.appendChild(header);
    div.appendChild(companies);

    if (startExpanded) {
      companies.style.maxHeight = 'none';
    } else {
      companies.style.maxHeight = '0px';
    }

    header.addEventListener('click', () => {
      const chevron = header.querySelector('.stage-chevron');
      if (companies.classList.contains('collapsed')) {
        companies.classList.remove('collapsed');
        companies.style.maxHeight = companies.scrollHeight + 'px';
        chevron.classList.remove('collapsed');
        const done = () => { if (!companies.classList.contains('collapsed')) companies.style.maxHeight = 'none'; companies.removeEventListener('transitionend', done); };
        companies.addEventListener('transitionend', done);
      } else {
        companies.style.maxHeight = companies.scrollHeight + 'px';
        companies.offsetHeight;
        companies.style.maxHeight = '0px';
        companies.classList.add('collapsed');
        chevron.classList.add('collapsed');
      }
    });

    return div;
  }

  // --- Build a pass section ---
  function buildPassSection(section) {
    const id = 'stage-' + section.stage.replace(/\s+/g, '-').toLowerCase();
    const div = document.createElement('div');
    div.className = 'pass-stage-section';
    div.id = id;
    div.setAttribute('data-stage', section.stage);

    const header = document.createElement('div');
    header.className = 'stage-header';
    header.innerHTML = `
      <div class="stage-title">${esc(section.stage)}</div>
      <div class="stage-count">${section.count}</div>
      <svg class="stage-chevron collapsed" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
    `;

    const tableWrap = document.createElement('div');
    tableWrap.className = 'stage-companies collapsed';
    tableWrap.style.maxHeight = '0px';

    const showFin = section.showFinancials !== false;
    let rows = '';
    section.companies.forEach(co => {
      const fin = showFin ? `<td class="financial">${esc(co.revenue||'—')}</td><td class="financial">${esc(co.ebitda||'—')}</td>` : '';
      const dom = co.website ? String(co.website).replace(/^https?:\/\//, '').replace(/\/$/, '') : '';
      const domHtml = dom ? `<a class="pass-domain" href="${esc(co.website.startsWith('http') ? co.website : 'http://' + co.website)}" target="_blank" rel="noopener">${esc(dom)}</a>` : '';
      rows += `<tr data-company="${String(co.name).replace(/"/g, '&quot;')}"><td class="co">${esc(co.name)}${domHtml}</td><td class="state">${esc(co.states||'—')}</td>${fin}<td class="reason">${esc(co.reason||'—')}</td></tr>`;
    });

    const finH = showFin ? '<th style="width:8%">Rev</th><th style="width:8%">EBITDA</th>' : '';
    tableWrap.innerHTML = `<div class="pass-table-wrap"><table class="pass-table"><thead><tr><th style="width:${showFin?'22':'24'}%">Company</th><th style="width:${showFin?'8':'10'}%">State</th>${finH}<th>Reason</th></tr></thead><tbody>${rows}</tbody></table></div>`;

    div.appendChild(header);
    div.appendChild(tableWrap);

    header.addEventListener('click', () => {
      const ch = header.querySelector('.stage-chevron');
      if (tableWrap.classList.contains('collapsed')) {
        tableWrap.classList.remove('collapsed');
        tableWrap.style.maxHeight = tableWrap.scrollHeight + 'px';
        ch.classList.remove('collapsed');
        const done = () => { if (!tableWrap.classList.contains('collapsed')) tableWrap.style.maxHeight = 'none'; tableWrap.removeEventListener('transitionend', done); };
        tableWrap.addEventListener('transitionend', done);
      } else {
        tableWrap.style.maxHeight = tableWrap.scrollHeight + 'px';
        tableWrap.offsetHeight;
        tableWrap.style.maxHeight = '0px';
        tableWrap.classList.add('collapsed');
        ch.classList.add('collapsed');
      }
    });

    return div;
  }

  // --- Tiered pipeline render ---
  function renderTieredPipeline(data) {
    const container = $('#tieredPipeline');
    container.innerHTML = '';

    // Split active sections into tiers
    const deepSections = [];
    const activeSections = [];
    const nurtureSections = [];

    data.activeSections.forEach(s => {
      if (DEEP_STAGES.has(s.stage)) deepSections.push(s);
      else if (NURTURE_STAGES.has(s.stage)) nurtureSections.push(s);
      else activeSections.push(s);
    });

    // --- Deep pipeline tier ---
    if (deepSections.length) {
      // Tier divider
      const divider1 = document.createElement('div');
      divider1.className = 'tier-divider';
      divider1.innerHTML = '<span class="tier-divider-label">Advancing</span>';
      container.appendChild(divider1);

      const deepTier = document.createElement('div');
      deepTier.className = 'pipeline-tier-deep';
      const deepInner = document.createElement('div');
      deepInner.className = 'pipeline-inner';
      deepSections.forEach(s => {
        deepInner.appendChild(buildStageSection(s, true));
      });
      deepTier.appendChild(deepInner);
      container.appendChild(deepTier);
    }

    // --- Active pipeline tier (Qualified + Engaged) ---
    if (activeSections.length) {
      const divider2 = document.createElement('div');
      divider2.className = 'tier-divider';
      divider2.innerHTML = '<span class="tier-divider-label">Early Pipeline</span>';
      container.appendChild(divider2);

      const activeTier = document.createElement('div');
      activeTier.className = 'pipeline-tier-active';
      const activeInner = document.createElement('div');
      activeInner.className = 'pipeline-inner';
      activeSections.forEach(s => {
        activeInner.appendChild(buildStageSection(s, true));
      });
      activeTier.appendChild(activeInner);
      container.appendChild(activeTier);
    }

    // --- Nurture tier ---
    if (nurtureSections.length) {
      const divider3 = document.createElement('div');
      divider3.className = 'tier-divider';
      divider3.innerHTML = '<span class="tier-divider-label">Nurture</span>';
      container.appendChild(divider3);

      const nurtureTier = document.createElement('div');
      nurtureTier.className = 'pipeline-tier-nurture';
      const nurtureInner = document.createElement('div');
      nurtureInner.className = 'pipeline-inner';
      nurtureSections.forEach(s => {
        nurtureInner.appendChild(buildStageSection(s, false));
      });
      nurtureTier.appendChild(nurtureInner);
      container.appendChild(nurtureTier);
    }

    // --- Pass tier ---
    if (data.passSections && data.passSections.length) {
      const divider4 = document.createElement('div');
      divider4.className = 'tier-divider';
      divider4.innerHTML = '<span class="tier-divider-label">At Rest</span>';
      container.appendChild(divider4);

      const passTier = document.createElement('div');
      passTier.className = 'pipeline-tier-pass';
      const passInner = document.createElement('div');
      passInner.className = 'pipeline-inner';
      data.passSections.forEach(s => {
        passInner.appendChild(buildPassSection(s));
      });
      passTier.appendChild(passInner);
      container.appendChild(passTier);
    }
  }

  // --- Sector Tabs ---
  function renderTabs(data) {
    const container = $('#sectorTabs');
    const section = $('#sectorTabsSection');
    if (!container) return;
    container.innerHTML = '';

    // Only show tabs for multi-sector mandates
    if (!data.sectors || data.subSectors.length <= 1) {
      if (section) section.classList.add('hidden');
      return;
    }
    if (section) section.classList.remove('hidden');

    // "All" tab
    const allTab = document.createElement('button');
    allTab.className = 'sector-tab active';
    allTab.setAttribute('data-sector', 'all');
    allTab.innerHTML = `<span class="tab-label">All Sectors</span><span class="tab-count">${data.totalTracked}</span>`;
    allTab.addEventListener('click', () => switchTab('all', data));
    container.appendChild(allTab);

    // Per-sector tabs
    data.subSectors.forEach(ss => {
      const sd = data.sectors[ss];
      const tab = document.createElement('button');
      tab.className = 'sector-tab';
      tab.setAttribute('data-sector', ss);
      tab.innerHTML = `<span class="tab-label">${esc(ss)}</span><span class="tab-count">${sd ? sd.totalTracked : 0}</span>`;
      tab.addEventListener('click', () => switchTab(ss, data));
      container.appendChild(tab);
    });
  }

  function switchTab(sector, data) {
    _activeTab = sector;
    // Update tab active states
    document.querySelectorAll('.sector-tab').forEach(t => {
      t.classList.toggle('active', t.getAttribute('data-sector') === sector);
    });

    let view;
    if (sector === 'all') {
      view = {
        activePipeline: data.activePipeline,
        totalTracked: data.totalTracked,
        summary: data.summary,
        movements: data.movements,
        activeSections: data.activeSections,
        passSections: data.passSections
      };
    } else {
      view = data.sectors[sector];
    }

    if (!view) return;

    // Update meta stats \u2014 "All" keeps the client-name title, a single
    // sector tab takes that sector's name
    const isMulti = data.subSectors.length > 1;
    if (sector === 'all') {
      $('#metaSector').textContent = isMulti ? data.subSectors.length + ' Sectors' : data.subSectors[0];
      $('#bandTitle').innerHTML = esc(isMulti ? data.clientName : data.subSectors[0]) + ' Pipeline Report';
      $('#bandSubtitle').textContent = isMulti ? data.subSectors.join(' \u00b7 ') + ' \u2014 ' + data.period : data.period;
    } else {
      $('#metaSector').textContent = sector;
      $('#bandTitle').innerHTML = esc(sector) + ' Pipeline Report';
      $('#bandSubtitle').textContent = data.period;
    }
    $('#metaActive').textContent = view.activePipeline + ' Companies';
    $('#metaTotal').textContent = view.totalTracked + ' Companies';

    // Determine furthest open stage
    _openStage = null;
    if (view.activeSections && view.activeSections.length) {
      let bestRank = Infinity;
      view.activeSections.forEach(s => {
        const rank = STAGE_RANK.indexOf(s.stage);
        if (rank !== -1 && rank < bestRank && s.count > 0) { bestRank = rank; _openStage = s.stage; }
      });
    }

    renderSummary(view);
    renderMovements(view);
    renderTieredPipeline(view);
  }

  // --- Admin editing ---
  const PENCIL_SVG = '<svg class="admin-edit-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>';
  const CHEVRON_DOWN_SVG = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>';

  const ALL_STAGES = [
    'Closed','Diligence','LOI','IOI','Data Received','DRL Sent','NDA Executed','Handoff',
    'Qualified','Engaged','Nurture','Seller Pass','Internal Pass','DOA',
    'Top of Funnel','Initial Outreach','Retouch'
  ];

  function showToast(msg, type) {
    let toast = document.querySelector('.admin-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'admin-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.className = 'admin-toast admin-toast-' + type;
    requestAnimationFrame(() => toast.classList.add('admin-toast-visible'));
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('admin-toast-visible'), 2500);
  }

  async function adminSave(accountId, oppId, field, value, el) {
    if (el) el.classList.add('admin-saving');
    try {
      let url, body;
      if (field === 'stage') {
        url = '/api/company/' + accountId + '/stage';
        body = { oppId: oppId, stage: value };
      } else {
        url = '/api/company/' + accountId + '/field';
        body = { field: field, value: value };
      }
      const resp = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const result = await resp.json();
      if (!result.ok) throw new Error(result.error || 'Save failed');
      if (el) {
        el.classList.remove('admin-saving');
        el.classList.add('admin-save-flash');
        setTimeout(() => el.classList.remove('admin-save-flash'), 800);
      }
      const fieldLabels = { revenue: 'Revenue', ebitda: 'EBITDA', states: 'Location', notes: 'Notes', ballInCourt: 'Court', nextAction: 'Next Action', nextActionDate: 'Action Date', stage: 'Stage' };
      showToast((fieldLabels[field] || field) + ' updated', 'success');
      // Clear cache and reload after brief delay so user sees the flash
      setTimeout(async () => {
        await fetch('/api/cache-clear', { method: 'POST' });
        const prevTab = _activeTab;
        await loadReport();
        if (_fullData && _fullData.sectors && prevTab !== 'all') {
          switchTab(prevTab, _fullData);
        }
      }, 500);
      return true;
    } catch (err) {
      if (el) {
        el.classList.remove('admin-saving');
        el.classList.add('admin-error-flash');
        setTimeout(() => el.classList.remove('admin-error-flash'), 1200);
      }
      showToast('Error: ' + err.message, 'error');
      return false;
    }
  }

  function formatDisplayValue(fieldName, rawValue, currentValue) {
    if (!rawValue && rawValue !== 0) return '\u2014';
    if ((fieldName === 'revenue' || fieldName === 'ebitda')) {
      const num = parseFloat(String(rawValue).replace(/[$,mM\s]/g, ''));
      return isNaN(num) ? rawValue : '$' + num + 'M';
    }
    if (fieldName === 'nextActionDate' && rawValue) {
      const d = new Date(rawValue + 'T00:00:00');
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    return rawValue;
  }

  function buildEditActions(onConfirm, onCancel) {
    const wrap = document.createElement('div');
    wrap.className = 'admin-edit-actions';
    const confirmBtn = document.createElement('button');
    confirmBtn.className = 'admin-confirm-btn';
    confirmBtn.textContent = '\u2713';
    confirmBtn.title = 'Save';
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'admin-cancel-btn';
    cancelBtn.textContent = '\u2715';
    cancelBtn.title = 'Cancel (Esc)';
    wrap.appendChild(confirmBtn);
    wrap.appendChild(cancelBtn);
    confirmBtn.addEventListener('mousedown', function(e) { e.preventDefault(); e.stopPropagation(); onConfirm(); });
    cancelBtn.addEventListener('mousedown', function(e) { e.preventDefault(); e.stopPropagation(); onCancel(); });
    return wrap;
  }

  function makeEditableText(el, fieldName, currentValue, accountId, oppId) {
    if (!_isAdmin) return;
    el.classList.add('admin-editable');
    el.innerHTML += PENCIL_SVG;
    el.addEventListener('click', function handler(e) {
      e.stopPropagation();
      if (el.querySelector('.admin-edit-input')) return;
      const isTextarea = fieldName === 'notes';
      const tag = isTextarea ? 'textarea' : 'input';
      const input = document.createElement(tag);
      input.className = 'admin-edit-input' + (isTextarea ? ' admin-edit-textarea' : '');
      if (!isTextarea) input.type = fieldName === 'nextActionDate' ? 'date' : 'text';
      // Show clean value in input (strip formatting)
      if ((fieldName === 'revenue' || fieldName === 'ebitda') && currentValue) {
        input.value = String(currentValue);
      } else {
        input.value = currentValue || '';
      }
      el.innerHTML = '';
      el.appendChild(input);
      el.classList.add('admin-editing');

      function doSave() {
        const newVal = input.value.trim();
        el.classList.remove('admin-editing');
        const displayVal = formatDisplayValue(fieldName, newVal, currentValue);
        el.innerHTML = esc(String(displayVal)) + PENCIL_SVG;
        if (newVal !== (currentValue || '')) {
          adminSave(accountId, oppId, fieldName, newVal || null, el);
        }
      }
      function doCancel() {
        el.classList.remove('admin-editing');
        const displayVal = formatDisplayValue(fieldName, currentValue, currentValue);
        el.innerHTML = esc(String(displayVal)) + PENCIL_SVG;
      }

      const actions = buildEditActions(doSave, doCancel);
      el.appendChild(actions);

      // Auto-grow textarea for notes
      if (isTextarea) {
        input.style.height = 'auto';
        input.style.height = Math.max(80, input.scrollHeight) + 'px';
        input.addEventListener('input', function() {
          input.style.height = 'auto';
          input.style.height = input.scrollHeight + 'px';
        });
      }

      input.focus();
      if (!isTextarea) input.select();

      input.addEventListener('keydown', function(ke) {
        if (ke.key === 'Enter' && !isTextarea) { ke.preventDefault(); doSave(); }
        if (ke.key === 'Escape') { doCancel(); }
      });
    });
  }

  function makeEditableSelect(el, fieldName, currentValue, options, accountId, oppId) {
    if (!_isAdmin) return;
    el.classList.add('admin-editable');
    el.innerHTML += PENCIL_SVG;
    el.addEventListener('click', function handler(e) {
      e.stopPropagation();
      if (el.querySelector('.admin-edit-select')) return;
      const select = document.createElement('select');
      select.className = 'admin-edit-select';
      options.forEach(opt => {
        const o = document.createElement('option');
        o.value = opt;
        o.textContent = opt || '\u2014';
        if (opt === currentValue) o.selected = true;
        select.appendChild(o);
      });
      el.innerHTML = '';
      el.appendChild(select);
      el.classList.add('admin-editing');

      function doSave() {
        const newVal = select.value;
        el.classList.remove('admin-editing');
        el.innerHTML = esc(newVal || '\u2014') + PENCIL_SVG;
        if (newVal !== currentValue) {
          adminSave(accountId, oppId, fieldName, newVal || null, el);
        }
      }
      function doCancel() {
        el.classList.remove('admin-editing');
        el.innerHTML = esc(currentValue || '\u2014') + PENCIL_SVG;
      }

      const actions = buildEditActions(doSave, doCancel);
      el.appendChild(actions);
      select.focus();

      select.addEventListener('keydown', function(ke) {
        if (ke.key === 'Escape') { doCancel(); }
      });
    });
  }

  function renderAdminIndicator() {
    if (!_isAdmin) return;
    const existing = document.querySelector('.admin-indicator');
    if (existing) existing.remove();
    const indicator = document.createElement('div');
    indicator.className = 'admin-indicator';
    indicator.innerHTML = '<span class="admin-indicator-dot"></span><span class="admin-indicator-label">Admin</span>';
    const coverBand = document.querySelector('.cover-band');
    if (coverBand) coverBand.appendChild(indicator);
  }

  // --- Render ---
  function render(data) {
    _fullData = data;
    _activeTab = 'all';
    _isAdmin = !!data.isAdmin;
    _stageOrder = data.stageOrder || [];
    _features = data.features || { namedOwner: false, nextAction: false };
    if (_isAdmin) renderAdminIndicator();
    $('#clientMain').textContent = data.clientWordmarkMain;
    $('#clientSub').textContent = data.clientWordmarkSub;
    // Multi-sector mandates: client name as the title, sectors in the subtitle
    const isMulti = data.subSectors.length > 1;
    const sector = isMulti ? data.subSectors.join(' \u00b7 ') : data.subSectors[0];
    $('#bandTitle').innerHTML = esc(isMulti ? data.clientName : sector) + ' Pipeline Report';
    $('#bandSubtitle').textContent = isMulti ? sector + ' \u2014 ' + data.period : data.period;
    $('#metaSector').textContent = isMulti ? data.subSectors.length + ' Sectors' : sector;
    $('#metaActive').textContent = data.activePipeline + ' Companies';
    $('#metaTotal').textContent = data.totalTracked + ' Companies';
    $('#metaDate').textContent = data.reportDate;
    $('#printClient').textContent = data.clientName;

    // Determine the single furthest stage that has companies
    _openStage = null;
    if (data.activeSections && data.activeSections.length) {
      let bestRank = Infinity;
      data.activeSections.forEach(s => {
        const rank = STAGE_RANK.indexOf(s.stage);
        if (rank !== -1 && rank < bestRank && s.count > 0) { bestRank = rank; _openStage = s.stage; }
      });
    }

    renderTabs(data);
    renderSummary(data);
    renderMovements(data);
    renderTieredPipeline(data);

    const t = new Date(data.generatedAt);
    $('#footerTime').textContent = t.toLocaleString('en-US', { month:'short', day:'numeric', year:'numeric', hour:'numeric', minute:'2-digit' });
    document.title = `${data.clientName} - Pipeline`;

    // --- Scroll-linked summary navigation ---
    initScrollLinkedSummary();

    // --- Auto-expand first company with notes (onboarding nudge) ---
    autoExpandFirstCompany();
  }

  // --- Notes hint tooltip (first visit onboarding; client sessions only —
  // the admin stage badge crowds the name row and admins know the feature) ---
  function autoExpandFirstCompany() {
    if (_isAdmin) return;
    const storageKey = 'gfx_notes_hint';
    if (sessionStorage.getItem(storageKey)) return;
    sessionStorage.setItem(storageKey, '1');

    setTimeout(() => {
      // Find the first visible notes icon
      const icon = document.querySelector('.stage-section .company-row.co-collapsible .co-notes-icon');
      if (!icon) return;

      // Build tooltip — anchored inline next to the notes icon so it never
      // covers the hero metrics on the right side of the card
      const tip = document.createElement('span');
      tip.className = 'notes-hint';
      tip.innerHTML = '<span class="notes-hint-arrow"></span>Select any company for notes';

      const topLine = icon.closest('.co-top-line');
      if (!topLine) return;
      icon.insertAdjacentElement('afterend', tip);

      // Pulse the notes icon
      icon.classList.add('notes-icon-pulse');

      // Dismiss on any company row click, or auto-fade after 8s
      function dismiss() {
        tip.classList.add('notes-hint-out');
        icon.classList.remove('notes-icon-pulse');
        setTimeout(() => tip.remove(), 400);
        document.removeEventListener('click', onClickAnywhere);
      }
      function onClickAnywhere(e) {
        if (e.target.closest('.company-row')) dismiss();
      }
      document.addEventListener('click', onClickAnywhere);
      setTimeout(dismiss, 8000);
    }, 2500);
  }

  let _scrollObserver = null;
  function initScrollLinkedSummary() {
    // Disconnect previous observer if re-rendering
    if (_scrollObserver) { _scrollObserver.disconnect(); _scrollObserver = null; }

    const stageSections = document.querySelectorAll('.stage-section, .pass-stage-section');
    if (!stageSections.length) return;

    _scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.id; // e.g. 'stage-qualified'
        if (!id) return;
        // Find matching summary cell
        const cells = document.querySelectorAll('.summary-cell');
        cells.forEach(cell => {
          const lbl = cell.querySelector('.lbl');
          if (!lbl) return;
          const cellStage = 'stage-' + lbl.textContent.trim().replace(/\s+/g, '-').toLowerCase();
          if (cellStage === id) {
            if (entry.isIntersecting) {
              cell.classList.add('summary-active');
            } else {
              cell.classList.remove('summary-active');
            }
          }
        });
      });
    }, { rootMargin: '-10% 0px -60% 0px', threshold: 0 });

    stageSections.forEach(s => _scrollObserver.observe(s));
  }

  // --- Load ---
  async function loadReport() {
    try {
      const res = await fetch(`/api/pipeline/${getMandateKey()}`);
      if (!res.ok) throw new Error(res.status);
      const data = await res.json();
      render(data);
      const loading = $('#loading'), app = $('#app');
      loading.classList.add('fade-out');
      app.classList.remove('hidden');
      requestAnimationFrame(() => app.classList.add('visible'));
      setTimeout(() => loading.style.display = 'none', 600);
    } catch (err) {
      console.error('[pipeline]', err);
      const t = $('#loading .loading-text');
      t.textContent = 'Error loading pipeline data. Retrying...';
      t.style.color = 'rgba(139,64,73,0.8)';
      setTimeout(loadReport, 5000);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Theme switches — light is the default for everyone; dark is a
    // deliberate, remembered choice. Masthead + footer buttons are twins.
    const themeButtons = Array.from(document.querySelectorAll('.theme-btn'));
    if (themeButtons.length) {
      const themeMeta = document.querySelector('meta[name="theme-color"]');
      function isDark() {
        return document.documentElement.getAttribute('data-theme') === 'dark';
      }
      function syncIcons() {
        const dark = isDark();
        themeButtons.forEach(btn => {
          btn.querySelector('.icon-sun').style.display = dark ? '' : 'none';
          btn.querySelector('.icon-moon').style.display = dark ? 'none' : '';
        });
        if (themeMeta) themeMeta.setAttribute('content', dark ? '#0A1322' : '#EFF3F8');
      }
      syncIcons();
      themeButtons.forEach(btn => btn.addEventListener('click', () => {
        document.documentElement.classList.add('theme-fading');
        setTimeout(() => document.documentElement.classList.remove('theme-fading'), 700);
        const next = isDark() ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        try { localStorage.setItem('gf_theme', next); } catch (e) {}
        syncIcons();
      }));
    }

    const btn = $('#refreshBtn');
    if (btn) btn.addEventListener('click', async () => {
      btn.classList.add('spinning');
      try {
        await fetch('/api/cache-clear',{method:'POST'});
        const prevTab = _activeTab;
        await loadReport();
        // Restore tab if multi-sector
        if (_fullData && _fullData.sectors && prevTab !== 'all') {
          switchTab(prevTab, _fullData);
        }
      }
      finally { setTimeout(() => btn.classList.remove('spinning'), 600); }
    });

  });

  loadReport();

  // ── Bulk Selection ────────────────────────────────────────────────────────
  const selectedCards = new Set(); // accountId strings
  let selectModeActive = false;

  function enterSelectMode() {
    selectModeActive = true;
    document.body.classList.add('select-mode');
    const modeBtn = document.getElementById('selectModeBtn');
    if (modeBtn) modeBtn.classList.add('active');
    updateBulkBar();
    const bar = document.getElementById('bulkBar');
    if (bar) bar.style.display = '';
  }

  function exitSelectMode() {
    selectModeActive = false;
    selectedCards.clear();
    document.body.classList.remove('select-mode');
    // Clear all card-selected states
    document.querySelectorAll('.company-card.card-selected').forEach(c => c.classList.remove('card-selected'));
    document.querySelectorAll('.card-select-cb').forEach(cb => { cb.checked = false; });
    document.querySelectorAll('.stage-select-cb').forEach(cb => { cb.checked = false; cb.indeterminate = false; });
    const modeBtn = document.getElementById('selectModeBtn');
    if (modeBtn) modeBtn.classList.remove('active');
    const bar = document.getElementById('bulkBar');
    if (bar) bar.style.display = 'none';
  }

  function updateBulkBar() {
    const countEl = document.getElementById('bulkCount');
    const n = selectedCards.size;
    if (countEl) {
      countEl.textContent = n + ' selected';
    }
    const exp = document.getElementById('bulkExportBtn');
    if (exp) exp.textContent = n === 0 ? 'Export All CSV' : 'Export CSV';
  }

  function toggleCardSelect(accountId, card, checked) {
    if (checked) {
      selectedCards.add(accountId);
      card.classList.add('card-selected');
    } else {
      selectedCards.delete(accountId);
      card.classList.remove('card-selected');
    }
    updateBulkBar();
  }

  // --- Stage-level selection helpers ---
  function currentView() {
    if (!_fullData) return null;
    if (_activeTab !== 'all' && _fullData.sectors && _fullData.sectors[_activeTab]) {
      return _fullData.sectors[_activeTab];
    }
    return _fullData;
  }

  function companiesInStage(stage) {
    const v = currentView();
    if (!v) return [];
    const sections = [].concat(v.activeSections || [], v.passSections || []);
    const s = sections.find(x => x.stage === stage);
    return s ? s.companies : [];
  }

  function companyKey(co) { return co.accountId || co.name; }

  // Keep a stage checkbox in sync with its companies' selection state
  function syncStageCheckbox(sectionEl) {
    const cb = sectionEl.querySelector('.stage-select-cb');
    if (!cb) return;
    const cos = companiesInStage(sectionEl.getAttribute('data-stage'));
    if (!cos.length) { cb.checked = false; cb.indeterminate = false; return; }
    const sel = cos.filter(co => selectedCards.has(companyKey(co))).length;
    cb.checked = sel === cos.length;
    cb.indeterminate = sel > 0 && sel < cos.length;
  }

  function syncAllStageCheckboxes() {
    document.querySelectorAll('.stage-section, .pass-stage-section').forEach(syncStageCheckbox);
  }

  // Reflect selection state onto the visible cards of one section
  function syncSectionCards(sectionEl) {
    sectionEl.querySelectorAll('.company-row').forEach(row => {
      const card = row.querySelector('.company-card');
      const cb = card && card.querySelector('.card-select-cb');
      if (!card || !cb) return;
      const id = row.getAttribute('data-account-id') || row.getAttribute('data-company') || '';
      cb.checked = selectedCards.has(id);
      card.classList.toggle('card-selected', cb.checked);
    });
  }

  // Attach selection controls after render: stage checkboxes + card checkboxes
  function attachCardCheckboxes() {
    // Stage checkboxes — select an entire stage at once (works for card
    // sections and pass tables alike)
    document.querySelectorAll('.stage-section, .pass-stage-section').forEach(sectionEl => {
      const header = sectionEl.querySelector('.stage-header');
      if (!header || header.querySelector('.stage-select-cb')) { syncStageCheckbox(sectionEl); return; }
      const stage = sectionEl.getAttribute('data-stage') || '';
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.className = 'stage-select-cb';
      cb.title = 'Select all in ' + stage;
      cb.addEventListener('click', function(e) { e.stopPropagation(); });
      cb.addEventListener('change', function(e) {
        e.stopPropagation();
        const cos = companiesInStage(stage);
        cos.forEach(co => {
          if (cb.checked) selectedCards.add(companyKey(co));
          else selectedCards.delete(companyKey(co));
        });
        cb.indeterminate = false;
        syncSectionCards(sectionEl);
        updateBulkBar();
      });
      header.insertBefore(cb, header.firstChild);
      syncStageCheckbox(sectionEl);
    });

    // Card checkboxes — fine-tune within a stage
    document.querySelectorAll('.company-row').forEach(row => {
      const card = row.querySelector('.company-card');
      if (!card) return;
      // Skip if already has checkbox
      if (card.querySelector('.card-select-cb')) return;
      const companyName = row.getAttribute('data-company') || '';
      // Try to get accountId from admin save context (data attribute on company row)
      const accountId = row.getAttribute('data-account-id') || companyName;
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.className = 'card-select-cb';
      cb.title = 'Select ' + companyName;
      if (selectedCards.has(accountId)) {
        cb.checked = true;
        card.classList.add('card-selected');
      }
      cb.addEventListener('change', function(e) {
        e.stopPropagation();
        toggleCardSelect(accountId, card, cb.checked);
        const sectionEl = row.closest('.stage-section, .pass-stage-section');
        if (sectionEl) syncStageCheckbox(sectionEl);
      });
      // Prevent checkbox click from triggering card expand
      cb.addEventListener('click', function(e) { e.stopPropagation(); });
      card.insertBefore(cb, card.firstChild);
    });
  }

  function exportSelectedCSV() {
    if (!_fullData) return;
    // Flatten all companies from all sections
    const allCos = [];
    function collectSections(sections) {
      if (!sections) return;
      sections.forEach(s => { if (s.companies) s.companies.forEach(co => allCos.push(co)); });
    }
    if (_fullData.activeSections) collectSections(_fullData.activeSections);
    if (_fullData.passSections) collectSections(_fullData.passSections);
    // If multi-sector, also collect from sector views
    if (_fullData.sectors) {
      Object.values(_fullData.sectors).forEach(sv => {
        if (sv.activeSections) collectSections(sv.activeSections);
        if (sv.passSections) collectSections(sv.passSections);
      });
    }
    // Deduplicate by name (companies appear in multiple sectors in multi-sector)
    const seen = new Set();
    const deduped = allCos.filter(co => {
      const key = co.name;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    // Filter to selected
    const rows = selectedCards.size > 0
      ? deduped.filter(co => selectedCards.has(co.accountId || co.name))
      : deduped;
    if (rows.length === 0) return;
    const headers = ['Company', 'Website', 'Stage', 'Revenue', 'EBITDA', 'Location', 'Ball In Court', 'Notes'];
    const csvRows = rows.map(co => [
      co.name || '',
      co.website || '',
      co.stage || '',
      co.revenue || '',
      co.ebitda || '',
      co.states || '',
      co.ballInCourt || '',
      co.notes || ''
    ].map(v => '"' + String(v).replace(/"/g, '""') + '"').join(','));
    const csv = [headers.map(h => '"' + h + '"').join(',')].concat(csvRows).join('\n');
    const today = new Date().toISOString().slice(0, 10);
    const mandate = getMandateKey();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pipeline-' + mandate + '-' + today + '.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  // Wire up select mode button
  const selectModeBtn = document.getElementById('selectModeBtn');
  if (selectModeBtn) {
    selectModeBtn.addEventListener('click', function() {
      if (selectModeActive) {
        exitSelectMode();
      } else {
        enterSelectMode();
        attachCardCheckboxes();
      }
    });
  }

  // Wire up bulk bar buttons
  const selectAllPageBtn = document.getElementById('selectAllPageBtn');
  if (selectAllPageBtn) {
    selectAllPageBtn.addEventListener('click', function() {
      if (!selectModeActive) return;
      // Select every company in the current view, pass tables included
      const v = currentView();
      if (!v) return;
      [].concat(v.activeSections || [], v.passSections || []).forEach(s => {
        (s.companies || []).forEach(co => selectedCards.add(companyKey(co)));
      });
      document.querySelectorAll('.stage-section, .pass-stage-section').forEach(syncSectionCards);
      syncAllStageCheckboxes();
      updateBulkBar();
    });
  }

  const bulkExportBtn = document.getElementById('bulkExportBtn');
  if (bulkExportBtn) bulkExportBtn.addEventListener('click', exportSelectedCSV);

  const bulkClearBtn = document.getElementById('bulkClearBtn');
  if (bulkClearBtn) {
    bulkClearBtn.addEventListener('click', function() {
      selectedCards.clear();
      document.querySelectorAll('.company-card.card-selected').forEach(c => c.classList.remove('card-selected'));
      document.querySelectorAll('.card-select-cb').forEach(cb => { cb.checked = false; });
      document.querySelectorAll('.stage-select-cb').forEach(cb => { cb.checked = false; cb.indeterminate = false; });
      updateBulkBar();
    });
  }

  const bulkExitBtn = document.getElementById('bulkExitBtn');
  if (bulkExitBtn) bulkExitBtn.addEventListener('click', exitSelectMode);

  // Re-attach checkboxes after any re-render (tab switch, admin save, refresh)
  const _origRender = render;
  // Patch render to reattach checkboxes if select mode is active after re-render
  // Done via MutationObserver on tieredPipeline for lightweight hooking
  const pipelineContainer = document.getElementById('tieredPipeline');
  if (pipelineContainer) {
    const obs = new MutationObserver(function() {
      if (selectModeActive) attachCardCheckboxes();
    });
    obs.observe(pipelineContainer, { childList: true, subtree: true });
  }
})();
