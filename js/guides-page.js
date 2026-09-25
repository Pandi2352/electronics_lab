/* Guides page (guides.html): an accordion sidebar of guides, one guide shown at a time.
   Guides: js/nano.js (NANO), js/uno.js (UNO), js/esp32.js (ESP32). The address remembers the place: guides.html#uno/shields */

(() => {
  const GUIDES = [NANO, UNO, ESP32];
  const $ = id => document.getElementById(id);
  const load = key => { try{ return JSON.parse(localStorage.getItem(key) || '{}') || {}; }catch(e){ return {}; } };
  const save = (key, v) => { try{ localStorage.setItem(key, JSON.stringify(v)); }catch(e){} };
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const ARROW = `<svg class="flow-arrow" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 7h8M8 4l3 3-3 3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const CHEV = `<svg class="g-chev" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M4 5.5l3 3 3-3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const BOARD_IC = `<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><rect x="4" y="1.5" width="8" height="13" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M2 4.5h2M2 7h2M2 9.5h2M2 12h2M12 4.5h2M12 7h2M12 9.5h2M12 12h2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`;
  const NOTE_ICON = { key:'!', tip:'i', warn:'⚠' };
  const flowHTML = steps => `<div class="flow">${steps.map(s => `<span class="flowstep">${esc(s)}</span>`).join(ARROW)}</div>`;
  const pills = items => `<div class="k-chips left">${items.map(i => `<span class="flowstep">${esc(i)}</span>`).join('')}</div>`;
  const label = l => l ? `<h5>${esc(l)}</h5>` : '';
  const money = n => '₹' + Math.round(n).toLocaleString('en-IN');
  const unit = (lo, hi) => lo === hi ? `₹${lo}` : `₹${lo}–${hi}`;
  const secId = (g, s) => `sec-${g.id}-${s}`;

  /* ---------- theme ---------- */
  $('themebtn').addEventListener('click', () => {
    const root = document.documentElement;
    const current = root.dataset.theme || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    root.dataset.theme = current === 'light' ? 'dark' : 'light';
    try{ localStorage.setItem('lab-theme', root.dataset.theme); }catch(e){}
  });

  /* ---------- a small C++ highlighter for the sketches ---------- */
  const TOKENS = new RegExp([
    /(\/\/.*$)/.source, /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)')/.source, /(#\w+.*$)/.source,
    /\b(void|int|long|float|bool|byte|char|const|unsigned|if|else|for|while|return|true|false|HIGH|LOW|INPUT|OUTPUT|INPUT_PULLUP)\b/.source,
    /\b(\d+(?:\.\d+)?)\b/.source, /\b([A-Za-z_]\w*)(?=\()/.source,
  ].join('|'), 'gm');
  const CLS = [null, 'c', 's', 'p', 'k', 'n', 'f'];
  const highlight = code => esc(code).replace(TOKENS, (...m) => {
    const i = m.slice(1, 7).findIndex(g => g !== undefined) + 1;
    return `<span class="tk-${CLS[i]}">${m[0]}</span>`;
  });
  const codeHTML = (name, code) => `<div class="code"><div class="codehead"><span>${esc(name)}</span><button type="button" class="copybtn" data-code="${esc(code)}">Copy</button></div><pre><code>${highlight(code)}</code></pre></div>`;

  /* ---------- one guide ---------- */
  function Guide(g){
    const done = load(g.keys.done);
    const buyState = load(g.keys.buy);
    const projects = g.levels.flatMap(l => l.projects);
    const B = g.buy;
    const has = name => name in buyState ? buyState[name] : B.owned.includes(name);
    const extraItems = B.extras.flatMap(x => x.items);
    const added = ([name, , , , , rec]) => (`x:${name}` in buyState ? buyState[`x:${name}`] : !!rec);
    const hasCode = projects.some(p => p[4]);

    const projectsHTML = () => g.levels.map(lv => `
      <div class="g-level">
        <h3>${esc(lv.title)}</h3>${lv.intro ? `<p class="g-muted">${esc(lv.intro)}</p>` : ''}
        <div class="tablewrap"><table class="compare g-projects">
          <thead><tr><th scope="col" class="g-done">Done</th><th scope="col">#</th><th scope="col">Project</th><th scope="col">What you learn</th><th scope="col">Main components</th>${hasCode ? '<th scope="col">Code in the lab</th>' : ''}</tr></thead>
          <tbody>${lv.projects.map(([n, name, learn, parts, lesson]) => `
            <tr data-proj="${n}">
              <td class="g-done"><input type="checkbox" data-done="${n}" aria-label="Built project ${n}: ${esc(name)}"></td>
              <td class="g-num">${n}</td>
              <th scope="row">${esc(name)}</th>
              <td>${esc(learn)}</td>
              <td class="g-parts">${esc(parts)}</td>
              ${hasCode ? `<td class="g-code">${lesson ? `<a href="index.html#arduino" target="_blank" rel="noopener">Lesson: ${esc(lesson)}</a>` : '<span class="g-muted">—</span>'}</td>` : ''}
            </tr>`).join('')}</tbody>
        </table></div>
      </div>`).join('');

    const startersHTML = () => (g.starters || []).map(p => `
      <article class="g-starter" id="${g.id}-starter-${p.n}">
        <header><span class="g-badge">${p.n}</span><div><h3>${esc(p.title)}</h3><p>${esc(p.goal)}</p></div></header>
        <div class="g-cols">
          <section class="exsec"><h5>Circuit</h5><pre class="c-pre">${esc(p.diagram)}</pre>${p.diagramNote ? `<p class="g-muted g-small">${esc(p.diagramNote)}</p>` : ''}</section>
          <div>
            <section class="exsec"><h5>Learn</h5>${pills(p.learn)}</section>
            ${p.behaviour ? `<section class="exsec"><h5>Behaviour</h5>${p.behaviour.map(flowHTML).join('')}</section>` : ''}
            ${p.rules ? `<section class="exsec"><h5>Example</h5><table class="c-rules"><tbody>${p.rules.map(([c, o, col]) =>
              `<tr><th scope="row">${esc(c)}</th><td><i class="c-sw" style="background:${col}"></i>${esc(o)}</td></tr>`).join('')}</tbody></table></section>` : ''}
            ${p.measure ? `<section class="exsec"><h5>Measure with your multimeter</h5><ul class="watch plain">${p.measure.map(m => `<li>${esc(m)}</li>`).join('')}</ul></section>` : ''}
          </div>
        </div>
        ${p.noteKey ? `<p class="k-note key"><b aria-hidden="true">!</b>${esc(p.noteKey)}</p>` : ''}
        ${p.noteTip ? `<p class="k-note tip"><b aria-hidden="true">i</b>${esc(p.noteTip)}</p>` : ''}
        <section class="exsec"><h5>Sketch</h5>${codeHTML(`${g.id}-project-${p.n}.ino`, p.code)}</section>
      </article>`).join('');

    const sequenceHTML = () => `<ol class="g-seq">${g.sequence.map((s, i) => `<li><span>${String(i + 1).padStart(2, '0')}</span>${esc(s)}</li>`).join('')}</ol>`;

    const buyHTML = () => `
      <div class="k-stats g-buystats"></div>
      <div class="tablewrap g-buywrap"><table class="c-buytable">
        <thead><tr><th scope="col" class="c-have">Have</th><th scope="col">Item</th><th scope="col" class="num">Qty</th><th scope="col">Used in projects</th><th scope="col" class="num">Price each</th><th scope="col" class="num">Estimated cost</th></tr></thead>
        ${B.groups.map(gr => `<tbody><tr class="c-grouprow"><th colspan="6" scope="colgroup">${esc(gr.title)}</th></tr>${gr.items.map(([name, qty, lo, hi, used, note]) => `
          <tr data-item="${esc(name)}">
            <td class="c-have"><input type="checkbox" data-have="${esc(name)}" aria-label="I already have: ${esc(name)}"></td>
            <td data-label="Item"><b>${esc(name)}</b>${note ? `<span class="c-rownote">${esc(note)}</span>` : ''}</td>
            <td data-label="Qty" class="num">${qty}</td>
            <td data-label="Used in">${esc(used)}</td>
            <td data-label="Price each" class="num">${unit(lo, hi)}</td>
            <td data-label="Cost" class="num"><b>${money(qty * lo)}–${money(qty * hi).slice(1)}</b></td>
          </tr>`).join('')}</tbody>`).join('')}
        <tfoot><tr><th colspan="5" scope="row">Core parts you still need</th><td class="num"><b class="g-core"></b></td></tr></tfoot>
      </table></div>
      ${B.extras.map(x => `<section class="exsec c-extra"><h5>${esc(x.title)}</h5>${x.note ? `<p class="c-hint">${esc(x.note)}</p>` : ''}
        <ul class="c-optlist">${x.items.map(([name, qty, lo, hi, why, rec]) => `
          <li data-extra="${esc(name)}">
            <label class="c-add"><input type="checkbox" data-add="${esc(name)}" aria-label="Add to my order: ${esc(name)}"><span>Add</span></label>
            <div><b>${esc(name)}${rec ? ' <i class="c-rec">Recommended</i>' : ''}</b><span>${esc(why)}</span></div>
            <em>${qty > 1 ? `${qty} × ${unit(lo, hi)}<br>` : ''}<strong>${money(qty * lo)}–${money(qty * hi).slice(1)}</strong></em>
          </li>`).join('')}</ul></section>`).join('')}
      <div class="c-grand">
        <div><span>Core parts</span><b class="g-g-core"></b></div>
        <div><span>Extras you added</span><b class="g-g-extra"></b></div>
        <div class="total"><span>Estimated total</span><b class="g-total"></b></div>
      </div>
      <section class="exsec"><h5>Money-saving tips</h5><ul class="watch plain">${B.tips.map(t => `<li>${esc(t)}</li>`).join('')}</ul></section>
      <div class="c-foot"><button type="button" class="btn g-buyprint">Print this list</button></div>`;

    function block(b){
      if(b.p) return `<p>${esc(b.p)}</p>`;
      if(b.note) return `<p class="k-note ${b.note[0]}"><b aria-hidden="true">${NOTE_ICON[b.note[0]]}</b>${esc(b.note[1])}</p>`;
      if(b.flow) return `<section class="exsec">${label(b.flow.label)}${flowHTML(b.flow.steps)}</section>`;
      if(b.list) return `<section class="exsec">${label(b.list.label)}<ul class="watch plain">${b.list.items.map(i => `<li>${esc(i)}</li>`).join('')}</ul></section>`;
      if(b.steps) return `<section class="exsec">${label(b.steps.label)}<ol class="steps">${b.steps.items.map(i => `<li>${esc(i)}</li>`).join('')}</ol></section>`;
      if(b.table) return `<section class="exsec">${label(b.table.label)}<div class="tablewrap"><table class="compare g-table cols-${b.table.head.length}">
        <thead><tr>${b.table.head.map(h => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead>
        <tbody>${b.table.rows.map(row => `<tr>${row.map((c, i) => i ? `<td>${esc(c)}</td>` : `<th scope="row">${esc(c)}</th>`).join('')}</tr>`).join('')}</tbody>
      </table></div></section>`;
      if(b.pre) return `<section class="exsec">${label(b.pre.label)}<pre class="c-pre">${esc(b.pre.text)}</pre></section>`;
      if(b.cards) return `<section class="exsec">${label(b.cards.label)}<div class="g-cards">${b.cards.items.map(([t, d]) => `<div class="g-card"><b>${esc(t)}</b><span>${esc(d)}</span></div>`).join('')}</div></section>`;
      if(b.pinout) return `<div class="g-pinout" data-pinout="${b.pinout}"></div>`;
      if(b.projects) return projectsHTML();
      if(b.starters) return startersHTML();
      if(b.sequence) return sequenceHTML();
      if(b.buy) return buyHTML();
      return '';
    }

    /* content */
    const root = document.createElement('div');
    root.className = 'g-guide';
    root.id = 'guide-' + g.id;
    root.hidden = true;
    root.innerHTML = `
      <div class="g-intro"><p class="k-eyebrow">Guide</p><h2>${esc(g.menu)}</h2><p>${esc(g.blurb)}</p></div>` +
      g.sections.map(s => `<section class="g-sec" id="${secId(g, s.id)}" data-sec="${s.id}"><h2>${esc(s.title)}</h2>${s.blocks.map(block).join('')}</section>`).join('');
    $('g-content').appendChild(root);
    root.querySelectorAll('.g-pinout').forEach(el => { const b = PD.block([el.dataset.pinout]); if(b) el.appendChild(b); });
    root.querySelectorAll('[data-have]').forEach(cb => { cb.checked = has(cb.dataset.have); });
    root.querySelectorAll('[data-add]').forEach(cb => { cb.checked = added(extraItems.find(x => x[0] === cb.dataset.add)); });

    /* sidebar accordion group */
    const group = document.createElement('div');
    group.className = 'g-group';
    group.dataset.guide = g.id;
    group.innerHTML = `
      <button type="button" class="g-grouphead" aria-expanded="false" aria-controls="links-${g.id}">
        <span class="g-groupic" aria-hidden="true">${BOARD_IC}</span>
        <span class="g-groupname">${esc(g.menu)}<small class="g-groupprog"></small></span>
        ${CHEV}
      </button>
      <div class="g-groupbody" id="links-${g.id}"><div>
        <ol class="g-links">${g.sections.map((s, i) => `<li><a href="#${g.id}/${s.id}" data-guide="${g.id}" data-sec="${s.id}"><span>${i + 1}</span>${esc(s.short)}${s.id === 'buy' ? '<em class="g-buybadge"></em>' : ''}${s.id === 'path' ? '<em class="g-pathbadge"></em>' : ''}</a></li>`).join('')}</ol>
      </div></div>`;
    $('g-nav').appendChild(group);
    const setGroupOpen = open => {
      group.classList.toggle('open', open);
      group.querySelector('.g-grouphead').setAttribute('aria-expanded', open);
    };
    group.querySelector('.g-grouphead').addEventListener('click', () => setGroupOpen(!group.classList.contains('open')));

    /* progress + buy totals */
    function updateProjects(){
      const n = projects.filter(([k]) => done[k]).length;
      root.querySelectorAll('tr[data-proj]').forEach(tr => {
        const on = !!done[tr.dataset.proj];
        tr.classList.toggle('built', on);
        tr.querySelector('input').checked = on;
      });
      group.querySelector('.g-pathbadge').textContent = `${n}/${projects.length}`;
      group.querySelector('.g-groupprog').textContent = `${n}/${projects.length} built`;
      return n;
    }
    function updateBuy(){
      let lo = 0, hi = 0, need = 0, have = 0, xlo = 0, xhi = 0, xn = 0;
      B.groups.flatMap(gr => gr.items).forEach(([name, qty, l, h]) => {
        const owned = has(name);
        root.querySelector(`tr[data-item="${CSS.escape(name)}"]`).classList.toggle('owned', owned);
        if(owned){ have++; return; }
        need++; lo += qty * l; hi += qty * h;
      });
      extraItems.forEach(item => {
        const on = added(item);
        root.querySelector(`li[data-extra="${CSS.escape(item[0])}"]`).classList.toggle('added', on);
        if(!on) return;
        xn++; xlo += item[1] * item[2]; xhi += item[1] * item[3];
      });
      const r = (a, b) => `${money(a)} – ${money(b)}`;
      root.querySelector('.g-core').textContent = r(lo, hi);
      root.querySelector('.g-g-core').textContent = r(lo, hi);
      root.querySelector('.g-g-extra').textContent = xn ? `${r(xlo, xhi)} (${xn})` : '—';
      root.querySelector('.g-total').textContent = r(lo + xlo, hi + xhi);
      root.querySelector('.g-buystats').innerHTML = `
        <div><b>${need + xn}</b><span>items to buy</span></div>
        <div><b>${r(lo + xlo, hi + xhi)}</b><span>estimated total</span></div>
        <div><b>${have}</b><span>already have</span></div>`;
      group.querySelector('.g-buybadge').textContent = `≈ ${money(lo + xlo)}–${money(hi + xhi).slice(1)}`;
    }

    root.addEventListener('change', e => {
      const t = e.target;
      if(t.dataset.done){
        if(t.checked) done[t.dataset.done] = true; else delete done[t.dataset.done];
        save(g.keys.done, done);
        updateProjects();
        updateFoot();
      }else if(t.dataset.have){
        buyState[t.dataset.have] = t.checked;
        save(g.keys.buy, buyState);
        updateBuy();
      }else if(t.dataset.add){
        buyState[`x:${t.dataset.add}`] = t.checked;
        save(g.keys.buy, buyState);
        updateBuy();
      }
    });
    root.querySelector('.g-buyprint').addEventListener('click', () => {
      const sec = root.querySelector('[data-sec="buy"]');
      document.body.dataset.print = 'buy';
      sec.classList.add('print-target');
      const off = () => { delete document.body.dataset.print; sec.classList.remove('print-target'); window.removeEventListener('afterprint', off); };
      window.addEventListener('afterprint', off);
      window.print();
    });

    updateProjects();
    updateBuy();
    return { g, root, group, setGroupOpen, projectsBuilt:updateProjects, total:projects.length };
  }

  const guides = GUIDES.map(Guide);
  const byId = id => guides.find(x => x.g.id === id);
  let active = null;

  /* ---------- sidebar footer: progress of the guide on screen ---------- */
  function updateFoot(){
    if(!active) return;
    const n = active.projectsBuilt();
    $('g-progress').style.width = Math.round(n / active.total * 100) + '%';
    $('g-progress').parentElement.setAttribute('aria-valuenow', Math.round(n / active.total * 100));
    $('g-progtxt').textContent = `${active.g.menu}: ${n} of ${active.total} projects built`;
  }

  /* ---------- copy buttons ---------- */
  $('g-content').addEventListener('click', e => {
    const btn = e.target.closest('.copybtn');
    if(!btn) return;
    const text = btn.dataset.code;
    const doneMsg = ok => { btn.textContent = ok ? 'Copied!' : 'Press Ctrl+C'; setTimeout(() => { btn.textContent = 'Copy'; }, 1500); };
    const fallback = () => {
      const ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      let ok = false; try{ ok = document.execCommand('copy'); }catch(err){}
      ta.remove(); doneMsg(ok);
    };
    if(navigator.clipboard?.writeText) navigator.clipboard.writeText(text).then(() => doneMsg(true), fallback);
    else fallback();
  });

  /* ---------- showing a guide and a section ---------- */
  function show(guideId, sectionId, smooth){
    const next = byId(guideId) || guides[0];
    if(next !== active){
      guides.forEach(x => { x.root.hidden = x !== next; });
      active = next;
      next.setGroupOpen(true);
      document.title = `Guides — ${next.g.menu}`;
      updateFoot();
    }
    const target = sectionId && next.root.querySelector(`[data-sec="${CSS.escape(sectionId)}"]`);
    if(target) target.scrollIntoView({ behavior:smooth ? 'smooth' : 'auto', block:'start' });
    else window.scrollTo(0, 0);
    onScroll();
  }
  const route = smooth => {
    const [g, s] = location.hash.slice(1).split('/');
    show(g, s, smooth);
  };
  window.addEventListener('hashchange', () => route(true));

  /* ---------- highlight the section on screen ---------- */
  function onScroll(){
    if(!active) return;
    const secs = [...active.root.querySelectorAll('.g-sec')];
    let current = secs[0].dataset.sec;
    secs.forEach(s => { if(s.getBoundingClientRect().top <= 120) current = s.dataset.sec; });
    if(window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = secs[secs.length - 1].dataset.sec;
    document.querySelectorAll('#g-nav a[data-sec]').forEach(a => {
      const on = a.dataset.guide === active.g.id && a.dataset.sec === current;
      a.classList.toggle('active', on);
      if(on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
  }
  window.addEventListener('scroll', onScroll, { passive:true });

  /* ---------- mobile drawer ---------- */
  const side = $('g-side'), menuBtn = $('g-menubtn'), backdrop = $('g-backdrop');
  const mq = matchMedia('(max-width: 900px)');
  function openMenu(open){
    document.body.classList.toggle('g-open', open);
    menuBtn.setAttribute('aria-expanded', open);
    side.toggleAttribute('inert', !open && mq.matches);
    if(open) (side.querySelector('a.active') || side.querySelector('button, a'))?.focus();
    else if(side.contains(document.activeElement)) menuBtn.focus();
  }
  menuBtn.addEventListener('click', () => openMenu(!document.body.classList.contains('g-open')));
  backdrop.addEventListener('click', () => openMenu(false));
  $('g-close').addEventListener('click', () => openMenu(false));
  document.addEventListener('keydown', e => { if(e.key === 'Escape' && document.body.classList.contains('g-open')) openMenu(false); });
  $('g-nav').addEventListener('click', e => {
    const a = e.target.closest('a[data-sec]');
    if(!a) return;
    // Same address clicked again: hashchange won't fire, so scroll directly.
    if(location.hash === a.getAttribute('href')){ e.preventDefault(); show(a.dataset.guide, a.dataset.sec, true); }
    if(mq.matches) openMenu(false);
  });
  const syncMode = () => {
    if(!mq.matches){ document.body.classList.remove('g-open'); side.removeAttribute('inert'); }
    else if(!document.body.classList.contains('g-open')) side.setAttribute('inert', '');
  };
  mq.addEventListener('change', syncMode);

  syncMode();
  route(false);
})();
