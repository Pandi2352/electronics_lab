/* Starter kit page (kit.html). Standalone: it does not load app.js. */

(() => {
  const $ = id => document.getElementById(id);
  const load = key => { try{ return JSON.parse(localStorage.getItem(key) || '{}') || {}; }catch(e){ return {}; } };
  const save = (key, v) => { try{ localStorage.setItem(key, JSON.stringify(v)); }catch(e){} };
  const fold = s => s.toLowerCase().replace(/µ/g, 'u');
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const CHEVRON = `<span class="chev" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 16 16"><path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span>`;
  const ARROW = `<svg class="flow-arrow" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 7h8M8 4l3 3-3 3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const DOWN = `<svg class="k-down" width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M9 3v11M4.5 9.5 9 14l4.5-4.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  /* ---------- theme ---------- */
  $('themebtn').addEventListener('click', () => {
    const root = document.documentElement;
    const current = root.dataset.theme || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    root.dataset.theme = current === 'light' ? 'dark' : 'light';
    try{ localStorage.setItem('lab-theme', root.dataset.theme); }catch(e){}
  });

  /* ---------- sections ---------- */
  const list = $('k-list');
  const cards = [];        // { el, hay, when }
  const sections = [];     // { el, cards }
  const stars = n => n ? `<span class="k-stars" aria-label="Priority ${n} of 5">${'★'.repeat(n)}<span>${'★'.repeat(5 - n)}</span></span>` : '';

  function itemCard([name, qty, when, desc, pri], section){
    const el = document.createElement('article');
    el.className = 'k-item';
    el.innerHTML = `
      <div class="k-top"><h4>${esc(name)}</h4><span class="k-qty">${esc(qty)}</span></div>
      <div class="k-meta"><span class="tag k-w w${when}">${KIT_WHEN[when]}</span>${stars(pri)}</div>
      <p>${esc(desc)}</p>`;
    const card = { el, when, hay:fold(`${name} ${qty} ${desc} ${section.title} ${KIT_WHEN[when]}`) };
    cards.push(card);
    return card;
  }

  const NOTE_ICON = { key:'!', tip:'i', warn:'⚠' };
  const flowHTML = steps => `<div class="flow">${steps.map(s => `<span class="flowstep">${esc(s)}</span>`).join(ARROW)}</div>`;

  KIT_SECTIONS.forEach(sec => {
    const groups = [...(sec.items ? [{ items:sec.items }] : []), ...(sec.groups || [])];
    const count = groups.reduce((a, g) => a + g.items.length, 0);
    const el = document.createElement('section');
    el.className = 'cat k-sec';
    el.id = 'sec-' + sec.n;
    el.innerHTML = `
      <button type="button" class="cathead" aria-expanded="false" aria-controls="secb-${sec.n}">
        <span class="ic" aria-hidden="true">${sec.n}</span>
        <span class="text"><span class="title">${esc(sec.title)}</span><span class="note">${esc(sec.intro)}</span></span>
        <span class="meta"><span class="count">${count} ${count === 1 ? 'item' : 'items'}</span></span>
        ${CHEVRON}
      </button>
      <div class="catbody" id="secb-${sec.n}"><div><div class="k-body">
        ${(sec.notes || []).map(([kind, text]) => `<p class="k-note ${kind}"><b aria-hidden="true">${NOTE_ICON[kind]}</b>${esc(text)}</p>`).join('')}
        ${sec.flow ? `<div class="flowblock"><span class="flowlabel">${esc(sec.flowLabel)}</span>${flowHTML(sec.flow)}</div>` : ''}
      </div></div></div>`;
    const body = el.querySelector('.k-body');
    const secCards = [];
    groups.forEach(g => {
      if(g.title){
        const h = document.createElement('div');
        h.className = 'k-group';
        h.innerHTML = `<h3>${esc(g.title)}</h3>${g.note ? `<p>${esc(g.note)}</p>` : ''}`;
        body.appendChild(h);
      }
      const grid = document.createElement('div');
      grid.className = 'k-grid';
      g.items.forEach(item => {
        const c = itemCard(item, sec);
        secCards.push(c);
        grid.appendChild(c.el);
      });
      body.appendChild(grid);
    });
    el.querySelector('.cathead').addEventListener('click', () => {
      if(!list.classList.contains('searching')) setOpen(el, !el.classList.contains('open'));
    });
    list.appendChild(el);
    sections.push({ el, cards:secCards });
  });

  /* ---------- 31: buy-now checklist ---------- */
  const bought = load('lab-kit');
  const buyTotal = KIT_BUY_NOW.reduce((a, g) => a + g.items.length, 0);
  const buyEl = document.createElement('section');
  buyEl.className = 'cat k-sec k-buy';
  buyEl.id = 'sec-31';
  buyEl.innerHTML = `
    <button type="button" class="cathead" aria-expanded="false" aria-controls="secb-31">
      <span class="ic" aria-hidden="true">31</span>
      <span class="text"><span class="title">Recommended “buy now” list</span><span class="note">If you don’t want to buy 200 things at once, this is the first purchase to make. Tick items as you buy them.</span></span>
      <span class="meta"><span class="count" id="k-buycount"></span></span>
      ${CHEVRON}
    </button>
    <div class="catbody" id="secb-31"><div><div class="k-body">
      <div class="k-buygrid">${KIT_BUY_NOW.map(g => `
        <section class="k-buycol"><h3>${esc(g.group)}</h3>${g.items.map(item => {
          const key = `${g.group}:${item}`;
          return `<label class="k-check"><input type="checkbox" data-buy="${esc(key)}" ${bought[key] ? 'checked' : ''}><span>${esc(item)}</span></label>`;
        }).join('')}</section>`).join('')}
      </div>
    </div></div></div>`;
  buyEl.querySelector('.cathead').addEventListener('click', () => setOpen(buyEl, !buyEl.classList.contains('open')));
  buyEl.addEventListener('change', e => {
    const key = e.target.dataset.buy;
    if(!key) return;
    if(e.target.checked) bought[key] = true; else delete bought[key];
    save('lab-kit', bought);
    updateBuy();
  });
  list.appendChild(buyEl);

  const buyKeys = KIT_BUY_NOW.flatMap(g => g.items.map(i => `${g.group}:${i}`));
  function updateBuy(){
    const n = buyKeys.filter(k => bought[k]).length;
    $('k-buycount').textContent = `${n}/${buyTotal} bought`;
    $('k-buytxt').textContent = `${n} / ${buyTotal} bought`;
    const pct = Math.round(n / buyTotal * 100);
    $('k-buybar').style.width = pct + '%';
    $('k-buybar').parentElement.setAttribute('aria-valuenow', pct);
  }

  /* ---------- learning path diagram ---------- */
  const chips = items => `<div class="k-chips">${items.map(i => `<span class="flowstep">${esc(i)}</span>`).join('')}</div>`;
  $('k-path').innerHTML = KIT_PATH.map(tier => `
    <div class="k-tier">
      <h3>${esc(tier.title)}</h3>
      ${tier.branches ? `<div class="k-branches">${tier.branches.map(b => `<div class="k-branch"><h4>${esc(b.title)}</h4>${chips(b.items)}</div>`).join('')}</div>` : ''}
      ${tier.chains ? tier.chains.map(flowHTML).join('') : ''}
      ${tier.items ? chips(tier.items) : ''}
    </div>`).join(DOWN);
  $('k-closing').textContent = KIT_CLOSING;

  /* ---------- stats, table of contents ---------- */
  const partCount = cards.length;
  $('k-stats').innerHTML = `
    <div><b>${KIT_SECTIONS.length}</b><span>sections</span></div>
    <div><b>${partCount}</b><span>parts explained</span></div>
    <div><b>${buyTotal}</b><span>in the buy-now list</span></div>`;
  $('k-toc').innerHTML = [...KIT_SECTIONS.map(s => [s.n, s.title]), [31, 'Buy-now list']]
    .map(([n, t]) => `<a class="pill link" href="#sec-${n}" data-sec="${n}"><span>${n}</span>${esc(t)}</a>`).join('') +
    `<a class="pill link" href="#k-pathsec">Learning path</a>`;

  /* ---------- accordion helpers ---------- */
  function setOpen(el, open){
    el.classList.toggle('open', open);
    el.querySelector('.cathead').setAttribute('aria-expanded', open);
    syncToggle();
  }
  const allSecs = () => [...list.querySelectorAll('.k-sec')].filter(s => !s.classList.contains('hidden'));
  function syncToggle(){
    const secs = allSecs();
    $('k-toggle').textContent = secs.length && secs.every(s => s.classList.contains('open')) ? 'Collapse all' : 'Expand all';
  }
  $('k-toggle').addEventListener('click', () => {
    const secs = allSecs();
    const open = !secs.every(s => s.classList.contains('open'));
    secs.forEach(s => setOpen(s, open));
  });

  // Table-of-contents links open their section before scrolling to it.
  $('k-toc').addEventListener('click', e => {
    const a = e.target.closest('[data-sec]');
    if(!a) return;
    e.preventDefault();
    const sec = $('sec-' + a.dataset.sec);
    if(sec.classList.contains('hidden')) resetFilters();
    if(!sec.classList.contains('open')) setOpen(sec, true);
    sec.scrollIntoView({ behavior:'smooth', block:'start' });
  });
  $('k-startbtn').addEventListener('click', () => {
    if(!buyEl.classList.contains('open')) setOpen(buyEl, true);
    buyEl.scrollIntoView({ behavior:'smooth', block:'start' });
  });

  /* ---------- search + "when" filter ---------- */
  const search = $('k-search');
  let when = 'all';
  function apply(){
    const words = fold(search.value.trim()).split(/\s+/).filter(Boolean);
    const filtering = words.length > 0 || when !== 'all';
    let shown = 0, secsShown = 0;
    sections.forEach(({ el, cards:secCards }) => {
      let n = 0;
      secCards.forEach(c => {
        const match = (when === 'all' || String(c.when) === when) && words.every(w => c.hay.includes(w));
        c.el.classList.toggle('nomatch', !match);
        if(match) n++;
      });
      el.querySelectorAll('.k-group').forEach(h => {
        const grid = h.nextElementSibling;
        h.hidden = !grid.querySelector('.k-item:not(.nomatch)');
      });
      el.classList.toggle('hidden', filtering && n === 0);
      el.querySelector('.cathead').setAttribute('aria-expanded', filtering || el.classList.contains('open'));
      shown += n;
      if(n) secsShown++;
    });
    buyEl.classList.toggle('hidden', filtering);
    list.classList.toggle('searching', filtering);
    $('k-toggle').disabled = filtering;
    $('k-clear').hidden = !search.value;
    $('k-status').textContent = filtering
      ? (shown ? `${shown} ${shown === 1 ? 'part' : 'parts'} in ${secsShown} ${secsShown === 1 ? 'section' : 'sections'}` : 'No parts match.') : '';
    syncToggle();
  }
  function resetFilters(){
    search.value = '';
    when = 'all';
    document.querySelectorAll('#k-when button').forEach(b => { b.classList.toggle('on', b.dataset.when === 'all'); b.setAttribute('aria-pressed', b.dataset.when === 'all'); });
    apply();
  }
  $('k-when').innerHTML = `<button type="button" class="on" data-when="all" aria-pressed="true">All</button>` +
    Object.entries(KIT_WHEN).map(([k, v]) => `<button type="button" data-when="${k}" aria-pressed="false"><span class="dot w${k}"></span>${v}</button>`).join('');
  $('k-when').addEventListener('click', e => {
    const b = e.target.closest('button');
    if(!b) return;
    document.querySelectorAll('#k-when button').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); });
    when = b.dataset.when;
    apply();
  });
  search.addEventListener('input', apply);
  search.addEventListener('keydown', e => { if(e.key === 'Escape'){ search.value = ''; apply(); } });
  $('k-clear').addEventListener('click', () => { search.value = ''; apply(); search.focus(); });
  document.addEventListener('keydown', e => {
    if(e.key === '/' && !e.target.closest('input, textarea')){ e.preventDefault(); search.focus(); }
  });

  /* ---------- print ---------- */
  $('k-print').addEventListener('click', () => window.print());

  updateBuy();
  setOpen(list.querySelector('.k-sec'), true);     // open section 1
})();
