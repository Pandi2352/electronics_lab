/* Roadmap, Boards, Sensors, Outputs, Projects and Tools views, and printing. Uses helpers from app.js (loadJSON, persist, fold, highlight,
   setOpen, wireToggle, syncToggle, setBar, CHEVRON, CHECK, viewHooks). */

const $ = id => document.getElementById(id);
const LEVELS = { b:'Basic', i:'Intermediate', a:'Advanced' };
const ARROW = `<svg class="flow-arrow" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 7h8M8 4l3 3-3 3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const flowHTML = steps => steps.map(s => `<span class="flowstep">${s}</span>`).join(ARROW);
const pills = (label, items) =>
  `<div class="chiprow"><span class="chiplabel">${label}</span>${items.map(i => `<span class="pill">${i}</span>`).join('')}</div>`;

// Level filter buttons inside a .seg, calling back with the chosen value.
function wireLevels(seg, onChange){
  const btns = seg.querySelectorAll('button[data-lv]');
  btns.forEach(btn => btn.addEventListener('click', () => {
    btns.forEach(b => { b.classList.toggle('on', b === btn); b.setAttribute('aria-pressed', b === btn); });
    onChange(btn.dataset.lv);
  }));
  return () => btns.forEach(b => { b.classList.toggle('on', b.dataset.lv === 'all'); b.setAttribute('aria-pressed', b.dataset.lv === 'all'); });
}
function wirePressed(btn, onChange){
  btn.addEventListener('click', () => {
    const on = btn.getAttribute('aria-pressed') !== 'true';
    btn.setAttribute('aria-pressed', on);
    onChange(on);
  });
  return () => btn.setAttribute('aria-pressed', 'false');
}
// Open the accordion card that holds `el`, then scroll to `el` and flash it.
function reveal(el){
  const card = el.classList.contains('cat') ? el : el.closest('.cat');
  if(!card.classList.contains('open')) setOpen(card, true);
  setTimeout(() => {
    el.scrollIntoView({ behavior:'smooth', block:'center' });
    el.classList.remove('flash');
    void el.offsetWidth;
    el.classList.add('flash');
  }, 280);
}

/* ============ "HAVE IT" STATE ============ */
// b = boards, s = sensors, o = outputs. One tick per item, shown everywhere that item appears.
const HAVE_KEYS = { b:'lab-boards', s:'lab-sensors', o:'lab-outputs' };
const HAVE = { b:loadJSON(HAVE_KEYS.b), s:loadJSON(HAVE_KEYS.s), o:loadJSON(HAVE_KEYS.o) };
const has = (kind, id) => !!HAVE[kind][id];
const haveBox = (kind, id, text = 'Have it') =>
  `<label class="have"><input type="checkbox" data-have="${kind}:${id}" ${has(kind, id) ? 'checked' : ''}><span>${text}</span></label>`;
const onHaveChange = [];

document.addEventListener('change', e => {
  const ref = e.target.dataset?.have;
  if(!ref) return;
  const [kind, id] = ref.split(':');
  if(e.target.checked) HAVE[kind][id] = true; else delete HAVE[kind][id];
  persist(HAVE_KEYS[kind], JSON.stringify(HAVE[kind]));
  document.querySelectorAll(`input[data-have="${ref}"]`).forEach(i => { i.checked = e.target.checked; });
  onHaveChange.forEach(fn => fn(kind));
});

/* ============ CATALOGS: SENSORS & OUTPUTS ============ */
function makeCatalog({ kind, prefix, groups, kit, fields, noun }){
  const list = $(prefix + '-list'), search = $(prefix + '-search'), kitBtn = $(prefix + '-kitonly');
  const items = {};
  groups.forEach(g => g.sensors.forEach(s => { items[s.id] = { s, group:g }; }));
  const kitIds = new Set(kit.flatMap(k => k.ids));
  const info = new Map();     // card element → { s, nameEl, hay }
  const groupEls = [];
  let level = 'all', kitOnly = false;

  function card(s, g){
    const el = document.createElement('article');
    el.className = 'scard';
    el.id = `${prefix}-${s.id}`;
    el.innerHTML = `
      <div class="shead"><h4></h4>${haveBox(kind, s.id)}</div>
      <div class="stags"><span class="tag lv-${s.level}">${LEVELS[s.level]}</span>${kitIds.has(s.id) ? '<span class="tag kit">Starter kit</span>' : ''}</div>
      <dl class="smeta">${fields.map(([label, key]) => `<div><dt>${label}</dt><dd>${s[key]}</dd></div>`).join('')}</dl>
      <p class="sdesc">${s.desc}</p>
      <p class="suse"><span>Used for</span>${s.use}</p>
      ${s.tip ? `<p class="stip">${s.tip}</p>` : ''}`;
    const nameEl = el.querySelector('h4');
    nameEl.textContent = s.name;
    const hay = fold([s.name, ...fields.map(f => s[f[1]]), s.desc, s.use, s.tip || '', s.sub || '', g.title, LEVELS[s.level]].join(' '));
    info.set(el, { s, nameEl, hay });
    return el;
  }

  groups.forEach(g => {
    const el = document.createElement('div');
    el.className = 'cat sgroup';
    el.innerHTML = `
      <button type="button" class="cathead" aria-expanded="false" aria-controls="${prefix}-g${g.n}">
        <span class="ic" aria-hidden="true">${g.n}</span>
        <span class="text"><span class="title">${g.title}</span><span class="note">${g.intro}</span></span>
        <span class="meta"><span class="count">${g.sensors.length} ${g.sensors.length === 1 ? noun[0] : noun[1]}</span></span>
        ${CHEVRON}
      </button>
      <div class="catbody" id="${prefix}-g${g.n}"><div><div class="sbody">
        ${g.note ? `<p class="callout snote">${g.note}</p>` : ''}
        ${g.learn ? pills(g.learnLabel || 'What you’ll learn', g.learn) : ''}
        ${g.flow ? `<div class="flowblock"><span class="flowlabel">${g.flowLabel}</span><div class="flow">${flowHTML(g.flow)}</div></div>` : ''}
        <div class="sgrid"></div>
        ${g.also ? `<div class="chiprow also"><span class="chiplabel">${g.alsoLabel || 'Also covered earlier'}</span>${g.also.map(id =>
          `<button type="button" class="pill link" data-goto="${id}">${items[id].s.name} <span>· ${items[id].group.n}</span></button>`).join('')}</div>` : ''}
      </div></div></div>`;
    const grid = el.querySelector('.sgrid');
    let sub = null;
    g.sensors.forEach(s => {
      if(s.sub && s.sub !== sub){
        sub = s.sub;
        const h = document.createElement('h5');
        h.className = 'subhead';
        h.textContent = sub;
        grid.appendChild(h);
      }
      grid.appendChild(card(s, g));
    });
    el.querySelector('.cathead').addEventListener('click', () => {
      if(!list.classList.contains('searching')) setOpen(el, !el.classList.contains('open'));
    });
    list.appendChild(el);
    groupEls.push(el);
  });

  // Recommended starter set, as the last numbered section.
  const kitEl = document.createElement('div');
  kitEl.className = 'cat sgroup kitgroup';
  kitEl.innerHTML = `
    <button type="button" class="cathead" aria-expanded="false" aria-controls="${prefix}-kit">
      <span class="ic" aria-hidden="true">${groups.length + 1}</span>
      <span class="text"><span class="title">Recommended starter ${noun[1]}</span><span class="note">Don’t buy everything above — start with these ${kitIds.size}. Ticks here and on the cards stay in sync.</span></span>
      <span class="meta"><span class="count" id="${prefix}-kitcount"></span></span>
      ${CHEVRON}
    </button>
    <div class="catbody" id="${prefix}-kit"><div><div class="sbody"><div class="kitgrid">${kit.map(k => `
      <section class="kitcol"><h5>${k.group}</h5>${k.ids.map(id => `
        <div class="kititem">${haveBox(kind, id, items[id].s.name)}
          <button type="button" class="kitgo" data-goto="${id}" aria-label="Show ${items[id].s.name}">${ARROW}</button></div>`).join('')}
      </section>`).join('')}</div></div></div></div>`;
  kitEl.querySelector('.cathead').addEventListener('click', () => setOpen(kitEl, !kitEl.classList.contains('open')));
  list.appendChild(kitEl);
  wireToggle(list, $(prefix + '-toggle'));

  function updateKit(){
    const n = [...kitIds].filter(id => has(kind, id)).length;
    $(prefix + '-kittxt').textContent = `${n} / ${kitIds.size} starter ${noun[1]}`;
    $(prefix + '-kitcount').textContent = `${n}/${kitIds.size} owned`;
    setBar($(prefix + '-kitbar'), n, kitIds.size);
  }
  updateKit();
  onHaveChange.push(k => { if(k === kind) updateKit(); });

  function apply(){
    const query = search.value.trim();
    const words = fold(query).split(/\s+/).filter(Boolean);
    const filtering = words.length > 0 || level !== 'all' || kitOnly;
    let shown = 0, groupsShown = 0;
    groupEls.forEach(el => {
      let n = 0;
      el.querySelectorAll('.scard').forEach(c => {
        const { s, nameEl, hay } = info.get(c);
        const match = (level === 'all' || s.level === level) && (!kitOnly || kitIds.has(s.id)) && words.every(w => hay.includes(w));
        c.classList.toggle('nomatch', !match);
        highlight(nameEl, s.name, words);
        if(match) n++;
      });
      // Hide sub-headings whose items are all filtered out.
      el.querySelectorAll('.subhead').forEach(h => {
        let next = h.nextElementSibling, any = false;
        while(next && !next.classList.contains('subhead')){ if(!next.classList.contains('nomatch')) any = true; next = next.nextElementSibling; }
        h.hidden = !any;
      });
      el.classList.toggle('hidden', n === 0);
      el.querySelector('.cathead').setAttribute('aria-expanded', filtering || el.classList.contains('open'));
      shown += n;
      if(n) groupsShown++;
    });
    kitEl.classList.toggle('hidden', filtering);
    list.classList.toggle('searching', filtering);
    $(prefix + '-toggle').disabled = filtering;
    $(prefix + '-clear').hidden = !query;
    $(prefix + '-status').textContent = filtering && shown
      ? `${shown} ${shown === 1 ? noun[0] : noun[1]} in ${groupsShown} ${groupsShown === 1 ? 'category' : 'categories'}` : '';
    $(prefix + '-empty').hidden = !(filtering && !shown);
    syncToggle(list);
  }

  const resetLevels = wireLevels($(prefix + '-levels'), lv => { level = lv; apply(); });
  const resetKit = wirePressed(kitBtn, on => { kitOnly = on; apply(); });
  function reset(){
    search.value = '';
    level = 'all';
    kitOnly = false;
    resetLevels();
    resetKit();
    apply();
  }
  search.addEventListener('input', apply);
  search.addEventListener('keydown', e => { if(e.key === 'Escape' && search.value){ e.preventDefault(); search.value = ''; apply(); } });
  $(prefix + '-clear').addEventListener('click', () => { search.value = ''; apply(); search.focus(); });
  $(prefix + '-reset').addEventListener('click', reset);

  function jump(id){
    const el = $(`${prefix}-${id}`);
    if(el.classList.contains('nomatch') || el.closest('.hidden')) reset();
    reveal(el);
  }
  list.addEventListener('click', e => {
    const btn = e.target.closest('[data-goto]');
    if(btn) jump(btn.dataset.goto);
  });

  return { items, jump };
}

$('sensor-path').innerHTML = flowHTML(SENSOR_PATH);
$('sensor-example').innerHTML = flowHTML(SENSOR_EXAMPLE);
const sensorCatalog = makeCatalog({ kind:'s', prefix:'sensor', groups:SENSOR_GROUPS, kit:SENSOR_KIT,
  fields:[['Measures', 'measures'], ['Output', 'out']], noun:['sensor', 'sensors'] });

$('output-rules').innerHTML = OUTPUT_RULES.map(r => `<li>${r}</li>`).join('');
const outputCatalog = makeCatalog({ kind:'o', prefix:'output', groups:OUTPUT_GROUPS, kit:OUTPUT_KIT,
  fields:[['Control', 'control'], ['Power', 'power']], noun:['output', 'outputs'] });

/* ============ BOARDS ============ */
const BOARD_BY_ID = Object.fromEntries(BOARDS.map(b => [b.id, b]));
const boardList = $('board-list');

$('board-choices').innerHTML = BOARD_CHOICE.map(([need, id]) =>
  `<button type="button" class="choice" data-board="${id}"><span>${need}</span>${ARROW}<b>${BOARD_BY_ID[id].name}</b></button>`).join('');

$('board-table').innerHTML = `<thead><tr><th scope="col">Board</th><th scope="col">Logic</th><th scope="col">Wireless</th><th scope="col">GPIO</th><th scope="col">Analog in</th><th scope="col">Best for</th></tr></thead>
  <tbody>${BOARDS.map(b => `<tr><th scope="row"><button type="button" class="tlink" data-board="${b.id}">${b.name}</button></th>
    <td><span class="logic l${b.logic.startsWith('5') ? 5 : 3}">${b.logic.replace(' GPIO', '')}</span></td>
    <td>${b.t.wireless}</td><td>${b.t.gpio}</td><td>${b.t.adc}</td><td>${b.t.best}</td></tr>`).join('')}</tbody>`;

BOARDS.forEach((b, i) => {
  const el = document.createElement('div');
  el.className = 'cat board';
  el.id = 'board-' + b.id;
  el.innerHTML = `
    <button type="button" class="cathead" aria-expanded="false" aria-controls="bb-${b.id}">
      <span class="ic" aria-hidden="true">${i + 1}</span>
      <span class="text"><span class="title">${b.name}</span><span class="note">${b.chip} · ${b.wireless}</span></span>
      <span class="meta"><span class="logic l${b.logic.startsWith('5') ? 5 : 3}">${b.logic.replace(' GPIO', '')}</span><span class="tag lv-${b.level}">${LEVELS[b.level]}</span></span>
      ${CHEVRON}
    </button>
    <div class="catbody" id="bb-${b.id}"><div><div class="bbody${!b.pinout ? ' single' : b.pinout === 'uno' ? ' wide' : ''}">
      <div class="bmain">
        <div class="bhave">${haveBox('b', b.id, 'I have this board')}</div>
        <p class="sdesc">${b.desc}</p>
        <dl class="specs">
          <div><dt>Chip</dt><dd>${b.chip}</dd></div>
          <div><dt>Logic level</dt><dd>${b.logic}</dd></div>
          <div><dt>Wireless</dt><dd>${b.wireless}</dd></div>
          <div><dt>GPIO</dt><dd>${b.gpio}</dd></div>
          <div><dt>Analog in</dt><dd>${b.adc}</dd></div>
          <div><dt>Memory</dt><dd>${b.memory}</dd></div>
          <div><dt>Power</dt><dd>${b.power}</dd></div>
          <div><dt>USB</dt><dd>${b.usb}</dd></div>
        </dl>
        <p class="suse"><span>Best for</span>${b.best}</p>
        ${b.pins.length ? `<section class="exsec"><h5>Pins that matter</h5><table class="pintable"><tbody>${b.pins.map(([p, d]) => `<tr><th scope="row">${p}</th><td>${d}</td></tr>`).join('')}</tbody></table></section>` : ''}
        <section class="exsec"><h5>Watch out</h5><ul class="watch">${b.watch.map(w => `<li>${w}</li>`).join('')}</ul></section>
      </div>
    </div></div></div>`;
  if(b.pinout){
    const side = document.createElement('aside');
    side.className = 'exside';
    side.appendChild(PD.block([b.pinout]));
    el.querySelector('.bmain').after(side);
  }
  el.querySelector('.cathead').addEventListener('click', () => setOpen(el, !el.classList.contains('open')));
  boardList.appendChild(el);
});
boardList.dataset.accordion = '';

const jumpBoard = id => reveal($('board-' + id));
document.querySelectorAll('#view-boards [data-board]').forEach(btn => btn.addEventListener('click', () => jumpBoard(btn.dataset.board)));

/* ============ PROJECTS ============ */
const JUMP = { b:jumpBoard, s:sensorCatalog.jump, o:outputCatalog.jump };
const VIEW_OF = { b:'boards', s:'sensors', o:'outputs' };
const itemName = (kind, id) => kind === 'b' ? BOARD_BY_ID[id].name : (kind === 's' ? sensorCatalog : outputCatalog).items[id].s.name;

// Show an item in its own tab (switching tabs first if needed).
function openItem(kind, id){
  const view = VIEW_OF[kind];
  if(typeof showView === 'function') showView(view, true);
  if(typeof setViewHash === 'function') setViewHash(view);
  setTimeout(() => JUMP[kind](id), 60);
}

// "s:dht22|bme280" → { optional, kind, ids }
const parseNeed = str => {
  const optional = str.startsWith('?');
  const [kind, list] = str.replace('?', '').split(':');
  return { optional, kind, ids:list.split('|') };
};
PROJECTS.forEach(p => { p.needList = p.needs.map(parseNeed); });
const needMet = n => n.ids.some(id => has(n.kind, id));
const missingOf = p => p.needList.filter(n => !n.optional && !needMet(n));

const projState = loadJSON('lab-projects');
const projList = $('proj-list');
const projCards = [];
let projLevel = 'all', readyOnly = false;
const PLEVELS = { b:'Beginner', i:'Intermediate', a:'Advanced' };
const KIND_LABEL = { b:'Board', s:'Sensor', o:'Output' };

function needsHTML(p){
  return p.needList.map(n => {
    const met = needMet(n);
    const names = n.ids.map(id => `<button type="button" class="nlink" data-kind="${n.kind}" data-id="${id}">${itemName(n.kind, id)}</button>`).join('<span class="or">or</span>');
    return `<li class="need${met ? ' met' : ''}${n.optional ? ' opt' : ''}">
      <span class="nstat" aria-label="${met ? 'You have this' : 'Missing'}">${met ? CHECK : ''}</span>
      <span class="nbody"><span class="nkind">${KIND_LABEL[n.kind]}${n.optional ? ' · optional' : ''}</span>${names}</span></li>`;
  }).join('');
}

PROJECTS.forEach((p, i) => {
  const num = String(i + 1).padStart(2, '0');
  const el = document.createElement('div');
  el.className = 'cat proj';
  el.id = 'proj-' + p.id;
  el.innerHTML = `
    <button type="button" class="cathead" aria-expanded="false" aria-controls="pj-${p.id}">
      <span class="ic" aria-hidden="true">${num}</span>
      <span class="text"><span class="title">${p.title}</span><span class="note">${p.summary}</span></span>
      <span class="meta"><span class="tag status"></span><span class="tag lv-${p.level}">${PLEVELS[p.level]}</span></span>
      ${CHEVRON}
    </button>
    <div class="catbody" id="pj-${p.id}"><div><div class="exbody">
      <div class="exmain">
        ${pills('You’ll learn', p.learn)}
        <section class="exsec"><h5>Build it in stages</h5><ol class="stages">${p.stages.map(([t, d]) => `<li><b>${t}</b><span>${d}</span></li>`).join('')}</ol></section>
        <section class="exsec"><h5>Take it further</h5><ul class="watch plain">${p.next.map(n => `<li>${n}</li>`).join('')}</ul></section>
      </div>
      <aside class="exside">
        <div class="needs"><div class="needhead"><h5>You need</h5><span class="needcount"></span></div><ul class="needlist"></ul>
          <h5 class="otherhead">Other parts</h5><ul class="parts">${p.parts.map(x => `<li>${x}</li>`).join('')}</ul></div>
      </aside>
      <div class="exfoot"><button type="button" class="btn" data-print="proj-one">Print</button><button type="button" class="btn builtbtn"></button></div>
    </div></div></div>`;
  el.querySelector('.cathead').addEventListener('click', () => setOpen(el, !el.classList.contains('open')));
  el.querySelector('.builtbtn').addEventListener('click', () => {
    if(projState[p.id]) delete projState[p.id]; else projState[p.id] = true;
    persist('lab-projects', JSON.stringify(projState));
    refreshProjects();
  });
  el.querySelector('.needlist').addEventListener('click', e => {
    const b = e.target.closest('.nlink');
    if(b) openItem(b.dataset.kind, b.dataset.id);
  });
  projList.appendChild(el);
  projCards.push({ p, el, num });
});
wireToggle(projList, $('proj-toggle'));

function refreshProjects(){
  let built = 0, ready = 0, shown = 0;
  projCards.forEach(({ p, el, num }) => {
    const missing = missingOf(p).length, isBuilt = !!projState[p.id];
    if(isBuilt) built++;
    if(!missing) ready++;
    el.querySelector('.needlist').innerHTML = needsHTML(p);
    const required = p.needList.filter(n => !n.optional);
    el.querySelector('.needcount').textContent = `${required.length - missing}/${required.length} required`;
    const status = el.querySelector('.tag.status');
    status.className = 'tag status ' + (isBuilt ? 'built' : missing ? 'missing' : 'ready');
    status.textContent = isBuilt ? 'Built' : missing ? `Missing ${missing}` : 'Ready to build';
    el.classList.toggle('done', isBuilt);
    el.querySelector('.ic').innerHTML = isBuilt ? CHECK : num;
    const btn = el.querySelector('.builtbtn');
    btn.textContent = isBuilt ? 'Mark as not built' : 'Mark as built';
    btn.classList.toggle('primary', !isBuilt);
    const match = (projLevel === 'all' || p.level === projLevel) && (!readyOnly || !missing || isBuilt);
    el.classList.toggle('hidden', !match);
    if(match) shown++;
  });
  $('proj-txt').textContent = `${built} / ${PROJECTS.length} built · ${ready} ready to build`;
  setBar($('proj-bar'), built, PROJECTS.length);
  $('proj-empty').hidden = shown > 0;
  syncToggle(projList);
}
wireLevels($('proj-levels'), lv => { projLevel = lv; refreshProjects(); });
wirePressed($('proj-ready'), on => { readyOnly = on; refreshProjects(); });
onHaveChange.push(refreshProjects);
viewHooks.projects = refreshProjects;
refreshProjects();

/* ============ TOOLS ============ */
TOOLS.render($('tool-grid'), $('tool-jumps'));
const flashTool = id => {
  const el = $('tool-' + id);
  el.scrollIntoView({ behavior:'smooth', block:'start' });
  el.classList.remove('flash');
  void el.offsetWidth;
  el.classList.add('flash');
};
$('tool-jumps').addEventListener('click', e => {
  const b = e.target.closest('[data-tool]');
  if(b) flashTool(b.dataset.tool);
});

/* ============ ROADMAP ============ */
const roadState = loadJSON('lab-roadmap');
const roadList = $('road-list');
const goView = view => { if(location.hash !== '#' + view) location.hash = view; };

// Follow a roadmap link: another tab, a board, a project, a calculator or an exercise stage.
function openTarget(type, id){
  if(type === 'view') return goView(id);
  if(type === 'board') return openItem('b', id);
  goView({ tool:'tools', project:'projects', exstage:'exercises' }[type]);
  setTimeout(() => {
    if(type === 'tool') flashTool(id);
    else if(type === 'project') reveal($('proj-' + id));
    else document.querySelector(`#exlist .stage[data-stage="${id}"]`).scrollIntoView({ behavior:'smooth', block:'start' });
  }, 60);
}

const exercisesIn = stages => EXERCISES.filter(ex => stages.includes(ex.stage));
$('road-flow').innerHTML = flowHTML(ROADMAP.map(r => r.short));

ROADMAP.forEach((r, i) => {
  const links = [
    ...(r.exStages || []).map(n => ['exstage', n, `Exercises — stage ${n}: ${STAGES.find(s => s.id === n).title}`]),
    ...r.links,
  ];
  const el = document.createElement('div');
  el.className = 'cat road';
  el.id = 'road-' + r.id;
  el.innerHTML = `
    <button type="button" class="cathead" aria-expanded="false" aria-controls="rb-${r.id}">
      <span class="ic" aria-hidden="true">${i + 1}</span>
      <span class="text"><span class="title">${r.title}</span><span class="note">${r.goal}</span></span>
      <span class="meta"><span class="tag here" hidden>You are here</span><span class="count"></span><span class="tag weeks">${r.weeks}</span></span>
      ${CHEVRON}
    </button>
    <div class="catbody" id="rb-${r.id}"><div><div class="exbody">
      <div class="exmain">
        ${pills('You’ll learn', r.learn)}
        <section class="exsec"><h5>Milestones</h5><ul class="milestones">${r.milestones.map(([id, text]) =>
          `<li><label class="have ms"><input type="checkbox" data-ms="${id}" ${roadState[id] ? 'checked' : ''}><span>${text}</span></label></li>`).join('')}</ul></section>
        ${r.exStages ? `<section class="exsec"><h5>Exercises</h5><p class="exprog"></p></section>` : ''}
      </div>
      <aside class="exside"><div class="needs">
        <h5>Use these</h5>
        <ul class="golist">${links.map(([type, id, label]) => `<li><button type="button" class="nlink" data-go="${type}:${id}">${label}</button></li>`).join('')}</ul>
        <h5 class="otherhead">What to buy</h5><p class="buy">${r.buy}</p>
      </div></aside>
    </div></div></div>`;
  el.querySelector('.cathead').addEventListener('click', () => setOpen(el, !el.classList.contains('open')));
  roadList.appendChild(el);
});
wireToggle(roadList, $('road-toggle'));

roadList.addEventListener('change', e => {
  const id = e.target.dataset.ms;
  if(!id) return;
  if(e.target.checked) roadState[id] = true; else delete roadState[id];
  persist('lab-roadmap', JSON.stringify(roadState));
  refreshRoadmap();
});
roadList.addEventListener('click', e => {
  const b = e.target.closest('[data-go]');
  if(!b) return;
  const [type, id] = b.dataset.go.split(':');
  openTarget(type, type === 'exstage' ? +id : id);
});

function refreshRoadmap(){
  let doneAll = 0, total = 0, current = null;
  ROADMAP.forEach((r, i) => {
    const el = $('road-' + r.id);
    const ms = r.milestones.filter(([id]) => roadState[id]).length;
    const exs = r.exStages ? exercisesIn(r.exStages) : [];
    const exDone = exs.filter(ex => exState[ex.id]).length;
    doneAll += ms + exDone;
    total += r.milestones.length + exs.length;
    const complete = ms === r.milestones.length && exDone === exs.length;
    if(!complete && !current) current = r;
    el.classList.toggle('done', complete);
    el.querySelector('.ic').innerHTML = complete ? CHECK : i + 1;
    el.querySelector('.count').textContent = `${ms + exDone}/${r.milestones.length + exs.length} done`;
    el.querySelector('.tag.here').hidden = current !== r;
    const prog = el.querySelector('.exprog');
    if(prog) prog.textContent = `${exDone} of ${exs.length} exercises marked done in the Exercises tab.`;
  });
  setBar($('road-bar'), doneAll, total);
  $('road-txt').textContent = `${doneAll} / ${total} steps done`;
  $('road-now').innerHTML = current ? `Current stage: <b>${current.title}</b>` : '<b>Every stage complete — well done!</b>';
  return current;
}
viewHooks.roadmap = refreshRoadmap;
// Open the stage you are working on when the page loads.
const currentStage = refreshRoadmap();
if(currentStage) setOpen($('road-' + currentStage.id), true);

/* ============ PRINT ============ */
// Print (or save as PDF) a clean, light version of part of the page. The print CSS reads body[data-print].
const PRINT_TITLES = {
  'shop-all':'Shopping list', 'shop-todo':'Shopping list — still to buy',
  'ex-all':'Breadboard exercises', 'ex-todo':'Breadboard exercises — still to do',
  'roadmap':'Learning roadmap',
};
function printSheet(mode, target){
  const title = PRINT_TITLES[mode] || (mode === 'ex-one' ? 'Exercise' : 'Project') + ': ' + target.querySelector('.title').textContent;
  $('printhead').innerHTML = `<b>${title}</b><span>Electronics Beginner Lab · ${new Date().toLocaleDateString()}</span>`;
  document.body.dataset.print = mode;
  target?.classList.add('print-target');
  const cleanup = () => {
    delete document.body.dataset.print;
    target?.classList.remove('print-target');
    window.removeEventListener('afterprint', cleanup);
  };
  window.addEventListener('afterprint', cleanup);
  window.print();
}
document.addEventListener('click', e => {
  const b = e.target.closest('[data-print]');
  if(!b) return;
  b.closest('details')?.removeAttribute('open');
  const mode = b.dataset.print;
  printSheet(mode, mode.endsWith('-one') ? b.closest('.cat') : null);
});
// Close an open print menu when clicking elsewhere.
document.addEventListener('click', e => {
  document.querySelectorAll('details.menu[open]').forEach(d => { if(!d.contains(e.target)) d.removeAttribute('open'); });
});
