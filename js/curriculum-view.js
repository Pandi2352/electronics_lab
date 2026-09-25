/* Project curriculum page (curriculum.html). Standalone: it does not load app.js. */

(() => {
  const $ = id => document.getElementById(id);
  const load = key => { try{ return JSON.parse(localStorage.getItem(key) || '{}') || {}; }catch(e){ return {}; } };
  const save = (key, v) => { try{ localStorage.setItem(key, JSON.stringify(v)); }catch(e){} };
  const fold = s => s.toLowerCase().replace(/µ/g, 'u');
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const CHEVRON = `<span class="chev" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 16 16"><path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span>`;
  const CHECK = `<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 7.5l2.5 2.5L11 4.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const ARROW = `<svg class="flow-arrow" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 7h8M8 4l3 3-3 3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const flowHTML = steps => `<div class="flow">${steps.map(s => `<span class="flowstep">${esc(s)}</span>`).join(ARROW)}</div>`;
  const NOTE_ICON = { key:'!', tip:'i', warn:'⚠' };

  /* ---------- theme ---------- */
  $('themebtn').addEventListener('click', () => {
    const root = document.documentElement;
    const current = root.dataset.theme || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    root.dataset.theme = current === 'light' ? 'dark' : 'light';
    try{ localStorage.setItem('lab-theme', root.dataset.theme); }catch(e){}
  });

  const built = load('lab-curriculum');
  const measured = load('lab-cur-measure');

  /* ---------- blocks ---------- */
  function block(b, p){
    const head = b.label ? `<h5>${esc(b.label)}</h5>` : '';
    switch(b.t){
      case 'pre':
        return `<section class="exsec">${head}<pre class="c-pre">${esc(b.text)}</pre></section>`;
      case 'flow':
        return `<section class="exsec">${head}${flowHTML(b.steps)}</section>`;
      case 'screen':
        return `<section class="exsec">${head}<div class="c-screen ${b.kind}" role="img" aria-label="${esc(b.lines.join(', '))}">${b.lines.map(l => `<div>${esc(l)}</div>`).join('')}</div></section>`;
      case 'chips':
        return `<section class="exsec">${head}<div class="k-chips left">${b.items.map((it, i) =>
          `<span class="flowstep">${b.swatches ? `<i class="c-sw" style="background:${b.swatches[i]}"></i>` : ''}${esc(it)}</span>`).join('')}</div></section>`;
      case 'rules':
        return `<section class="exsec">${head}<table class="c-rules"><tbody>${b.rows.map(([cond, out, color]) =>
          `<tr><th scope="row">${esc(cond)}</th><td><i class="c-sw" style="background:${color}"></i>${esc(out)}</td></tr>`).join('')}</tbody></table></section>`;
      case 'measure':
        return `<section class="exsec">${head}<p class="c-hint">${esc(b.note)}</p><table class="c-measure"><thead><tr><th scope="col">Pot position</th><th scope="col">Predict (V)</th><th scope="col">Measured (V)</th></tr></thead><tbody>${b.items.map(pos => {
          const k = `${p.n}:${pos}`;
          const cell = f => `<td><input type="text" inputmode="decimal" data-measure="${esc(k + ':' + f)}" value="${esc(measured[k + ':' + f] || '')}" aria-label="${f === 'p' ? 'Predicted' : 'Measured'} voltage at ${esc(pos)}"></td>`;
          return `<tr><th scope="row">${esc(pos)}</th>${cell('p')}${cell('m')}</tr>`;
        }).join('')}</tbody></table></section>`;
      case 'note':
        return `<p class="k-note ${b.kind}"><b aria-hidden="true">${NOTE_ICON[b.kind]}</b>${esc(b.text)}</p>`;
    }
    return '';
  }
  const partsHTML = parts => `<ul class="c-parts">${parts.map(([name, qty]) =>
    `<li><span>${esc(name)}</span>${qty ? `<b>×${esc(qty)}</b>` : ''}</li>`).join('')}</ul>`;

  /* ---------- render ---------- */
  const list = $('c-list');
  const cards = [];       // { p, el, hay }
  CUR_PHASES.forEach(ph => {
    const group = document.createElement('section');
    group.className = 'stage c-phase';
    group.id = 'phase-' + ph.n;
    group.dataset.phase = ph.n;
    group.innerHTML = `<div class="stagehead"><h3><span class="stagenum">Phase ${ph.n}</span>${esc(ph.title)}</h3><span class="stagecount"></span></div>${ph.intro ? `<p class="c-intro">${esc(ph.intro)}</p>` : ''}`;

    CUR_PROJECTS.filter(p => p.phase === ph.n).forEach(p => {
      const allParts = p.parts || p.partGroups.flatMap(g => g.parts);
      const el = document.createElement('div');
      el.className = 'cat ex c-proj';
      el.id = 'p' + p.n;
      el.innerHTML = `
        <button type="button" class="cathead" aria-expanded="false" aria-controls="pb-${p.n}">
          <span class="ic" aria-hidden="true">${p.n}</span>
          <span class="text"><span class="title">${esc(p.title)}</span><span class="note">${esc(p.learn ? 'Learn: ' + p.learn : p.goal)}</span></span>
          <span class="meta"><span class="count">${allParts.length} parts</span><span class="tag done" hidden>Built</span></span>
          ${CHEVRON}
        </button>
        <div class="catbody" id="pb-${p.n}"><div><div class="k-body">
          ${p.parts ? `<section class="exsec"><h5>Components</h5>${partsHTML(p.parts)}</section>`
            : p.partGroups.map(g => `<section class="exsec"><h5>${esc(g.title)}</h5>${partsHTML(g.parts)}</section>`).join('')}
          ${(p.blocks || []).map(b => block(b, p)).join('')}
          <div class="c-foot"><button type="button" class="btn" data-printone>Print</button><button type="button" class="btn builtbtn"></button></div>
        </div></div></div>`;
      el.querySelector('.cathead').addEventListener('click', () => {
        if(!list.classList.contains('searching')) setOpen(el, !el.classList.contains('open'));
      });
      el.querySelector('.builtbtn').addEventListener('click', () => {
        if(built[p.n]) delete built[p.n]; else built[p.n] = true;
        save('lab-curriculum', built);
        refresh();
      });
      el.querySelector('[data-printone]').addEventListener('click', () => printOne(el));
      const text = [p.title, p.learn || '', p.goal || '', ...allParts.map(x => x[0]),
        ...(p.blocks || []).flatMap(b => [b.label || '', b.text || '', ...(b.steps || []), ...(b.items || []), ...(b.lines || []), b.note || ''])].join(' ');
      cards.push({ p, el, hay:fold(text) });
      group.appendChild(el);
    });
    list.appendChild(group);
  });

  /* ---------- buy list for projects 1–14 ---------- */
  const money = n => '₹' + Math.round(n).toLocaleString('en-IN');
  const unit = (lo, hi) => lo === hi ? `₹${lo}` : `₹${lo}–${hi}`;
  const haveState = load('lab-cur-buy');                       // name → true (have it) / false
  const has = name => name in haveState ? haveState[name] : CUR_BUY.owned.includes(name);
  const buyItems = CUR_BUY.groups.flatMap(g => g.items);

  const buyEl = document.createElement('div');
  buyEl.className = 'cat c-buy';
  buyEl.id = 'buy';
  buyEl.innerHTML = `
    <button type="button" class="cathead" aria-expanded="false" aria-controls="buyb">
      <span class="ic" aria-hidden="true">₹</span>
      <span class="text"><span class="title">Buy list — projects ${CUR_BUY.projects}</span><span class="note">Everything for Phase 1 in one order, with estimated prices. Tick what you already have and it drops out of the total.</span></span>
      <span class="meta"><span class="count" id="c-buymeta"></span></span>
      ${CHEVRON}
    </button>
    <div class="catbody" id="buyb"><div><div class="k-body">
      <div class="k-stats c-buystats" id="c-buystats"></div>
      <div class="tablewrap"><table class="c-buytable">
        <thead><tr><th scope="col" class="c-have">Have</th><th scope="col">Item</th><th scope="col" class="num">Qty</th><th scope="col">Used in projects</th><th scope="col" class="num">Price each</th><th scope="col" class="num">Estimated cost</th></tr></thead>
        ${CUR_BUY.groups.map(g => `<tbody><tr class="c-grouprow"><th colspan="6" scope="colgroup">${esc(g.title)}</th></tr>${g.items.map(([name, qty, lo, hi, used, note]) => `
          <tr data-item="${esc(name)}">
            <td class="c-have"><input type="checkbox" data-have="${esc(name)}" aria-label="I already have: ${esc(name)}"></td>
            <td data-label="Item"><b>${esc(name)}</b>${note ? `<span class="c-rownote">${esc(note)}</span>` : ''}</td>
            <td data-label="Qty" class="num">${qty}</td>
            <td data-label="Used in">${esc(used)}</td>
            <td data-label="Price each" class="num">${unit(lo, hi)}</td>
            <td data-label="Cost" class="num"><b>${money(qty * lo)}–${money(qty * hi).slice(1)}</b></td>
          </tr>`).join('')}</tbody>`).join('')}
        <tfoot><tr><th colspan="5" scope="row">Estimated total (items you still need)</th><td class="num"><b id="c-buytotal"></b></td></tr></tfoot>
      </table></div>
      <section class="exsec"><h5>Optional extras</h5>
        <ul class="c-optlist">${CUR_BUY.optional.map(([name, qty, lo, hi, why]) =>
          `<li><div><b>${esc(name)}</b><span>${esc(why)}</span></div><em>${unit(lo, hi)}</em></li>`).join('')}</ul>
      </section>
      <section class="exsec"><h5>Money-saving tips</h5><ul class="watch plain">${CUR_BUY.tips.map(t => `<li>${esc(t)}</li>`).join('')}</ul></section>
      <div class="c-foot"><button type="button" class="btn" id="c-buyprint">Print this list</button></div>
    </div></div></div>`;
  list.prepend(buyEl);
  buyEl.querySelector('.cathead').addEventListener('click', () => setOpen(buyEl, !buyEl.classList.contains('open')));
  buyEl.querySelectorAll('[data-have]').forEach(cb => { cb.checked = has(cb.dataset.have); });
  buyEl.addEventListener('change', e => {
    const name = e.target.dataset.have;
    if(!name) return;
    haveState[name] = e.target.checked;
    save('lab-cur-buy', haveState);
    updateBuy();
  });

  function updateBuy(){
    let lo = 0, hi = 0, need = 0, have = 0;
    buyItems.forEach(([name, qty, l, h]) => {
      const owned = has(name);
      buyEl.querySelector(`tr[data-item="${CSS.escape(name)}"]`).classList.toggle('owned', owned);
      if(owned){ have++; return; }
      need++;
      lo += qty * l;
      hi += qty * h;
    });
    const range = `${money(lo)} – ${money(hi)}`;
    $('c-buytotal').textContent = range;
    $('c-buymeta').textContent = `≈ ${money(lo)}–${money(hi).slice(1)}`;
    $('c-buysum').textContent = `${need} items to buy · estimated ${range}`;
    $('c-buystats').innerHTML = `
      <div><b>${need}</b><span>items to buy</span></div>
      <div><b>${range}</b><span>estimated total</span></div>
      <div><b>${have}</b><span>already have</span></div>`;
  }
  updateBuy();

  $('c-buybtn').addEventListener('click', () => {
    if(!buyEl.classList.contains('open')) setOpen(buyEl, true);
    buyEl.scrollIntoView({ behavior:'smooth', block:'start' });
  });
  $('c-buyprint').addEventListener('click', () => {
    document.body.dataset.print = 'buy';
    const done = () => { delete document.body.dataset.print; window.removeEventListener('afterprint', done); };
    window.addEventListener('afterprint', done);
    window.print();
  });

  list.addEventListener('input', e => {
    const k = e.target.dataset.measure;
    if(!k) return;
    if(e.target.value.trim()) measured[k] = e.target.value.trim(); else delete measured[k];
    save('lab-cur-measure', measured);
  });

  /* ---------- progression table, method, table of contents ---------- */
  $('c-stages').innerHTML = `<thead><tr><th scope="col">Stage</th><th scope="col">Projects</th><th scope="col">Main learning</th></tr></thead><tbody>${
    CUR_STAGES.map(([stage, range, learn]) => `<tr><th scope="row">${esc(stage)}</th><td><a href="#p${range.split('–')[0]}" data-jump="${range.split('–')[0]}">${esc(range)}</a></td><td>${esc(learn)}</td></tr>`).join('')}</tbody>`;
  $('c-method').innerHTML = flowHTML(CUR_METHOD);
  $('c-toc').innerHTML = CUR_PHASES.map(ph => `<a class="pill link" href="#phase-${ph.n}"><span>${ph.n}</span>${esc(ph.title)} · ${esc(ph.range)}</a>`).join('');

  document.addEventListener('click', e => {
    const a = e.target.closest('[data-jump]');
    if(!a) return;
    e.preventDefault();
    const el = $('p' + a.dataset.jump);
    if(el.classList.contains('hidden') || el.closest('.hidden')) resetFilters();
    if(!el.classList.contains('open')) setOpen(el, true);
    setTimeout(() => el.scrollIntoView({ behavior:'smooth', block:'start' }), 50);
  });

  /* ---------- accordion ---------- */
  function setOpen(el, open){
    el.classList.toggle('open', open);
    el.querySelector('.cathead').setAttribute('aria-expanded', open);
    syncToggle();
  }
  const visible = () => cards.map(c => c.el).filter(el => !el.classList.contains('hidden') && !el.closest('.hidden'));
  function syncToggle(){
    const els = visible();
    $('c-toggle').textContent = els.length && els.every(el => el.classList.contains('open')) ? 'Collapse all' : 'Expand all';
  }
  $('c-toggle').addEventListener('click', () => {
    const els = visible();
    const open = !els.every(el => el.classList.contains('open'));
    els.forEach(el => setOpen(el, open));
  });

  /* ---------- filters ---------- */
  const search = $('c-search');
  let phase = 'all', status = 'all';
  function refresh(){
    const words = fold(search.value.trim()).split(/\s+/).filter(Boolean);
    const searching = words.length > 0;
    let done = 0, shown = 0;
    cards.forEach(({ p, el, hay }) => {
      const isBuilt = !!built[p.n];
      if(isBuilt) done++;
      el.classList.toggle('done', isBuilt);
      el.querySelector('.ic').innerHTML = isBuilt ? CHECK : p.n;
      el.querySelector('.tag.done').hidden = !isBuilt;
      const btn = el.querySelector('.builtbtn');
      btn.textContent = isBuilt ? 'Mark as not built' : 'Mark as built';
      btn.classList.toggle('primary', !isBuilt);
      const match = (phase === 'all' || String(p.phase) === phase) &&
        (status === 'all' || (status === 'done') === isBuilt) && words.every(w => hay.includes(w));
      el.classList.toggle('hidden', !match);
      el.querySelector('.cathead').setAttribute('aria-expanded', searching || el.classList.contains('open'));
      if(match) shown++;
    });
    list.querySelectorAll('.c-phase').forEach(g => {
      const inPhase = cards.filter(c => c.p.phase === +g.dataset.phase);
      const d = inPhase.filter(c => built[c.p.n]).length;
      const count = g.querySelector('.stagecount');
      count.textContent = `${d}/${inPhase.length} built`;
      count.classList.toggle('full', d === inPhase.length);
      g.classList.toggle('hidden', !g.querySelector('.c-proj:not(.hidden)'));
    });
    list.classList.toggle('searching', searching);
    $('c-toggle').disabled = searching;
    $('c-clear').hidden = !search.value;
    $('c-status').textContent = searching || phase !== 'all' || status !== 'all' ? (shown ? `${shown} ${shown === 1 ? 'project' : 'projects'}` : 'No projects match.') : '';
    $('c-txt').textContent = `${done} / ${CUR_PROJECTS.length} built`;
    const pct = Math.round(done / CUR_PROJECTS.length * 100);
    $('c-bar').style.width = pct + '%';
    $('c-bar').parentElement.setAttribute('aria-valuenow', pct);
    $('c-builtstat').textContent = done;
    syncToggle();
  }
  function resetFilters(){
    search.value = '';
    phase = 'all';
    status = 'all';
    document.querySelectorAll('#c-phases button, #c-statusf button').forEach(b => {
      const on = b.dataset.v === 'all';
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', on);
    });
    refresh();
  }
  $('c-phases').innerHTML = `<button type="button" class="on" data-v="all" aria-pressed="true">All</button>` +
    CUR_PHASES.map(ph => `<button type="button" data-v="${ph.n}" aria-pressed="false" title="${esc(ph.title)}">${ph.n}. ${esc(ph.title)}</button>`).join('');
  const wireSeg = (id, set) => $(id).addEventListener('click', e => {
    const b = e.target.closest('button');
    if(!b) return;
    $(id).querySelectorAll('button').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); });
    set(b.dataset.v);
    refresh();
  });
  wireSeg('c-phases', v => { phase = v; });
  wireSeg('c-statusf', v => { status = v; });
  search.addEventListener('input', refresh);
  search.addEventListener('keydown', e => { if(e.key === 'Escape'){ search.value = ''; refresh(); } });
  $('c-clear').addEventListener('click', () => { search.value = ''; refresh(); search.focus(); });
  document.addEventListener('keydown', e => {
    if(e.key === '/' && !e.target.closest('input, textarea')){ e.preventDefault(); search.focus(); }
  });

  /* ---------- print ---------- */
  function printOne(el){
    document.body.dataset.print = 'one';
    el.classList.add('print-target');
    const done = () => {
      delete document.body.dataset.print;
      el.classList.remove('print-target');
      window.removeEventListener('afterprint', done);
    };
    window.addEventListener('afterprint', done);
    window.print();
  }
  $('c-print').addEventListener('click', () => window.print());

  $('c-stats').innerHTML = `
    <div><b>${CUR_PHASES.length}</b><span>phases</span></div>
    <div><b>${CUR_PROJECTS.length}</b><span>projects</span></div>
    <div><b id="c-builtstat">0</b><span>built so far</span></div>`;

  refresh();
  // Open the first project you haven't built yet.
  // Before anything is built, start with the buy list open; after that, open the next unbuilt project.
  const next = cards.find(c => !built[c.p.n]);
  if(!Object.keys(built).length) setOpen(buyEl, true);
  else if(next) setOpen(next.el, true);
})();
