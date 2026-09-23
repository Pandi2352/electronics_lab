/* ============ STORAGE ============ */
// localStorage can throw (private mode, blocked site data) or hold corrupt JSON.
function loadJSON(key){
  try{
    const parsed = JSON.parse(localStorage.getItem(key) || '{}');
    return parsed && typeof parsed === 'object' ? parsed : {};
  }catch(e){ return {}; }
}
function persist(key, value){
  try{ localStorage.setItem(key, value); }catch(e){}
}

let state = loadJSON('lab-checklist');
const exState = loadJSON('lab-exercises');
const itemKey = (catId, i) => catId + '-' + i;

const CHEVRON = `<span class="chev" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 16 16"><path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span>`;
const CHECK = `<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 7.5l2.5 2.5L11 4.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

function setBar(bar, done, total){
  const pct = total ? Math.round(done / total * 100) : 0;
  bar.style.width = pct + '%';
  bar.parentElement.setAttribute('aria-valuenow', pct);
}

/* ============ ACCORDIONS ============ */
// Each accordion list has its own "Expand all" button.
const toggles = new Map();

function setOpen(card, open){
  card.classList.toggle('open', open);
  card.querySelector('.cathead').setAttribute('aria-expanded', open);
  syncToggle(card.closest('[data-accordion]'));
}
function visibleCards(list){
  return [...list.querySelectorAll('.cat')].filter(c => !c.classList.contains('hidden') && !c.closest('.hidden'));
}
function syncToggle(list){
  const btn = toggles.get(list);
  if(!btn) return;
  const cards = visibleCards(list);
  btn.textContent = cards.length && cards.every(c => c.classList.contains('open')) ? 'Collapse all' : 'Expand all';
}
function wireToggle(list, btn){
  list.dataset.accordion = '';
  toggles.set(list, btn);
  btn.addEventListener('click', () => {
    const cards = visibleCards(list);
    const open = !cards.every(c => c.classList.contains('open'));
    cards.forEach(c => setOpen(c, open));
  });
}

/* ============ RENDER: SHOP ============ */
const catlist = document.getElementById('catlist');
const catEls = [];     // { cat, el, items:[{ row, nameEl, name, hay }] }

function updateProgress(){
  let total = 0, done = 0;
  CATS.forEach(c => {
    let catDone = 0;
    c.items.forEach((it, i) => { total++; if(state[itemKey(c.id, i)]){ done++; catDone++; } });
    const count = document.getElementById('count-' + c.id);
    count.textContent = catDone + '/' + c.items.length;
    count.classList.toggle('full', catDone === c.items.length);
  });
  document.getElementById('progtxt').textContent = done + ' / ' + total + ' checked';
  setBar(document.getElementById('progbar'), done, total);
}
function saveState(){
  persist('lab-checklist', JSON.stringify(state));
  updateProgress();
}

// Lower-case, and let "uf" find "µF" (same length, so match positions stay valid).
const fold = s => s.toLowerCase().replace(/µ/g, 'u');

CATS.forEach(cat => {
  const el = document.createElement('div');
  el.className = 'cat';
  el.innerHTML = `
    <button type="button" class="cathead" aria-expanded="false" aria-controls="body-${cat.id}">
      <span class="ic" aria-hidden="true">${cat.id}</span>
      <span class="text"><span class="title">${cat.title}</span><span class="note">${cat.note}</span></span>
      <span class="meta">
        <span class="count" id="count-${cat.id}"></span>
        <span class="tag ${cat.phase}">${cat.phase === 'now' ? 'Buy now' : 'Buy later'}</span>
      </span>
      ${CHEVRON}
    </button>
    <div class="catbody" id="body-${cat.id}"><div><div class="items"></div></div></div>`;

  const itemsBox = el.querySelector('.items');
  const items = cat.items.map(([name, qty], i) => {
    const key = itemKey(cat.id, i);
    const row = document.createElement('div');
    row.className = 'item' + (state[key] ? ' checked' : '');
    row.innerHTML = `<input type="checkbox" id="chk-${key}" ${state[key] ? 'checked' : ''}>
      <label for="chk-${key}"><span class="nm"></span>${qty && qty !== '—' ? ' <span class="qty">(' + qty + ')</span>' : ''}</label>`;
    const nameEl = row.querySelector('.nm');
    nameEl.textContent = name;
    row.querySelector('input').addEventListener('change', e => {
      if(e.target.checked) state[key] = true; else delete state[key];
      row.classList.toggle('checked', e.target.checked);
      saveState();
    });
    itemsBox.appendChild(row);
    // Searchable text: item name + its category, and "ohm" for Ω values.
    const hay = fold(`${name} ${cat.title}${name.includes('Ω') ? ' ohm' : ''}`);
    return { row, nameEl, name, hay };
  });

  el.querySelector('.cathead').addEventListener('click', () => {
    if(!catlist.classList.contains('searching')) setOpen(el, !el.classList.contains('open'));
  });
  catlist.appendChild(el);
  catEls.push({ cat, el, items });
});
wireToggle(catlist, document.getElementById('togglebtn'));
updateProgress();

/* ---- search + phase filter ---- */
const searchInput = document.getElementById('search');
const searchClear = document.getElementById('searchclear');
const searchStatus = document.getElementById('searchstatus');
const shopEmpty = document.getElementById('shopempty');
let phase = 'all';

// Wrap every match of the search words in <mark>, built with DOM nodes (no HTML injection).
function highlight(nameEl, name, words){
  if(!words.length){ nameEl.textContent = name; return; }
  const f = fold(name), ranges = [];
  words.forEach(w => {
    for(let i = f.indexOf(w); i !== -1; i = f.indexOf(w, i + w.length)) ranges.push([i, i + w.length]);
  });
  ranges.sort((a, b) => a[0] - b[0]);
  const parts = [];
  let pos = 0;
  ranges.forEach(([a, b]) => {
    if(b <= pos) return;
    a = Math.max(a, pos);
    if(a > pos) parts.push(name.slice(pos, a));
    const m = document.createElement('mark');
    m.textContent = name.slice(a, b);
    parts.push(m);
    pos = b;
  });
  parts.push(name.slice(pos));
  nameEl.replaceChildren(...parts);
}

function applyShopFilters(){
  const query = searchInput.value.trim();
  const words = fold(query).split(/\s+/).filter(Boolean);
  const searching = words.length > 0;
  let shown = 0, catsShown = 0;

  catEls.forEach(({ cat, el, items }) => {
    const phaseOk = phase === 'all' || cat.phase === phase;
    let n = 0;
    items.forEach(it => {
      const match = phaseOk && words.every(w => it.hay.includes(w));
      it.row.classList.toggle('nomatch', !match);
      highlight(it.nameEl, it.name, searching ? words : []);
      if(match) n++;
    });
    el.classList.toggle('hidden', n === 0);
    el.querySelector('.cathead').setAttribute('aria-expanded', searching || el.classList.contains('open'));
    shown += n;
    if(n) catsShown++;
  });

  // While searching, every matching category is shown expanded; the user's own open/closed state is kept.
  catlist.classList.toggle('searching', searching);
  document.getElementById('togglebtn').disabled = searching;
  searchClear.hidden = !query;
  searchStatus.textContent = !searching ? '' : shown
    ? `${shown} ${shown === 1 ? 'item' : 'items'} in ${catsShown} ${catsShown === 1 ? 'category' : 'categories'}`
    : '';
  shopEmpty.hidden = !(searching && !shown);
  document.getElementById('emptyq').textContent = `“${query}”` + (phase === 'all' ? '' : ` in “${phase === 'now' ? 'Buy now' : 'Buy later'}”`);
  syncToggle(catlist);
}

function clearSearch(){
  searchInput.value = '';
  applyShopFilters();
  searchInput.focus();
}
searchInput.addEventListener('input', applyShopFilters);
searchInput.addEventListener('keydown', e => { if(e.key === 'Escape' && searchInput.value) { e.preventDefault(); clearSearch(); } });
searchClear.addEventListener('click', clearSearch);
document.getElementById('emptyclear').addEventListener('click', clearSearch);

// "/" jumps to the search box of the current view, if it has one.
document.addEventListener('keydown', e => {
  if(e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
  if(e.target.closest('input, textarea, select, [contenteditable]')) return;
  const input = document.querySelector('.view.active input[type="search"]');
  if(!input) return;
  e.preventDefault();
  input.focus();
});

const filterBtns = document.querySelectorAll('.filterrow button[data-f]');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => { b.classList.toggle('on', b === btn); b.setAttribute('aria-pressed', b === btn); });
    phase = btn.dataset.f;
    applyShopFilters();
  });
});

document.getElementById('resetbtn').addEventListener('click', () => {
  if(!confirm('Clear all checked items?')) return;
  state = {};
  saveState();
  document.querySelectorAll('#catlist .item input').forEach(i => {
    i.checked = false;
    i.closest('.item').classList.remove('checked');
  });
});

/* ============ RENDER: LEARN ============ */
const learngrid = document.getElementById('learngrid');
LEARN.forEach(l => {
  const c = document.createElement('article');
  c.className = 'lcard';
  c.innerHTML = `<h4>${l.name}</h4><p class="role">${l.role}</p><p>${l.text}</p><div class="spec">${l.spec}</div>`;
  const pins = PD.block(l.pins);
  if(pins) c.appendChild(pins);
  learngrid.appendChild(c);
});

/* ============ RENDER: EXERCISES ============ */
const exlist = document.getElementById('exlist');
const exCards = [];   // { ex, el, num, group }
let exFilter = 'all';

function updateExercises(){
  const done = EXERCISES.filter(ex => exState[ex.id]).length;
  document.getElementById('extxt').textContent = done + ' / ' + EXERCISES.length + ' done';
  setBar(document.getElementById('exbar'), done, EXERCISES.length);
  document.querySelectorAll('#exlist .stage').forEach(group => {
    const list = EXERCISES.filter(ex => ex.stage === +group.dataset.stage);
    const n = list.filter(ex => exState[ex.id]).length;
    const count = group.querySelector('.stagecount');
    count.textContent = n + '/' + list.length + ' done';
    count.classList.toggle('full', n === list.length);
  });
}

function paintExercise({ ex, el, num }){
  const done = !!exState[ex.id];
  el.classList.toggle('done', done);
  el.querySelector('.ic').innerHTML = done ? CHECK : num;
  el.querySelector('.tag.done').hidden = !done;
  const btn = el.querySelector('.donebtn');
  btn.textContent = done ? 'Mark as not done' : 'Mark as done';
  btn.classList.toggle('primary', !done);
}

function applyExFilter(){
  exCards.forEach(card => {
    const done = !!exState[card.ex.id];
    card.el.classList.toggle('hidden', exFilter === 'todo' ? done : exFilter === 'done' ? !done : false);
  });
  exlist.querySelectorAll('.stage').forEach(group => {
    group.classList.toggle('hidden', !group.querySelector('.cat:not(.hidden)'));
  });
  document.getElementById('exempty')?.remove();
  if(!exlist.querySelector('.stage:not(.hidden)')){
    const p = document.createElement('p');
    p.id = 'exempty';
    p.className = 'empty';
    p.textContent = exFilter === 'done' ? 'No exercises marked done yet.' : 'All exercises are done — nice work!';
    exlist.appendChild(p);
  }
  syncToggle(exlist);
}

const list = items => items.map(s => `<li>${s}</li>`).join('');
let exNum = 0;
STAGES.forEach(stage => {
  const group = document.createElement('section');
  group.className = 'stage';
  group.dataset.stage = stage.id;
  group.innerHTML = `<div class="stagehead"><h3><span class="stagenum">Stage ${stage.id}</span>${stage.title}</h3><span class="stagecount"></span></div>`;

  EXERCISES.filter(ex => ex.stage === stage.id).forEach(ex => {
    const num = String(++exNum).padStart(2, '0');
    const el = document.createElement('div');
    el.className = 'cat ex';
    el.innerHTML = `
      <button type="button" class="cathead" aria-expanded="false" aria-controls="ex-${ex.id}">
        <span class="ic" aria-hidden="true">${num}</span>
        <span class="text"><span class="title">${ex.title}</span><span class="note">${ex.goal}</span></span>
        <span class="meta"><span class="tag done" hidden>Done</span></span>
        ${CHEVRON}
      </button>
      <div class="catbody" id="ex-${ex.id}"><div><div class="exbody">
        <div class="exmain">
          <section class="exsec"><h5>You need</h5><ul class="parts">${list(ex.parts)}</ul></section>
          <section class="exsec"><h5>Steps</h5><ol class="steps">${list(ex.steps)}</ol></section>
          <section class="exsec callout"><h5>What you should see</h5><p>${ex.expect}</p></section>
          <section class="exsec"><h5>Why it matters</h5><p>${ex.why}</p></section>
        </div>
        <div class="exfoot"><button type="button" class="btn donebtn"></button></div>
      </div></div></div>`;

    const pins = PD.block(ex.pins);
    if(pins){
      const side = document.createElement('aside');
      side.className = 'exside';
      side.appendChild(pins);
      el.querySelector('.exmain').after(side);
    }else{
      el.querySelector('.exbody').classList.add('single');
    }

    const card = { ex, el, num, group };
    el.querySelector('.cathead').addEventListener('click', () => setOpen(el, !el.classList.contains('open')));
    el.querySelector('.donebtn').addEventListener('click', () => {
      if(exState[ex.id]) delete exState[ex.id]; else exState[ex.id] = true;
      persist('lab-exercises', JSON.stringify(exState));
      paintExercise(card);
      updateExercises();
      applyExFilter();
    });
    paintExercise(card);
    exCards.push(card);
    group.appendChild(el);
  });
  exlist.appendChild(group);
});
wireToggle(exlist, document.getElementById('extoggle'));
updateExercises();

const exFilterBtns = document.querySelectorAll('.filterrow button[data-ef]');
exFilterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    exFilterBtns.forEach(b => { b.classList.toggle('on', b === btn); b.setAttribute('aria-pressed', b === btn); });
    exFilter = btn.dataset.ef;
    applyExFilter();
  });
});

/* ============ NAV ============ */
// The active view lives in the URL hash so refresh, links and back/forward all work.
// guides.js registers per-view refresh hooks here (e.g. projects re-check the "Have it" ticks).
const viewHooks = {};
const navBtns = document.querySelectorAll('nav button');
const VIEWS = [...navBtns].map(b => b.dataset.view);

function showView(view, scroll){
  if(!VIEWS.includes(view)) view = VIEWS[0];
  navBtns.forEach(b => {
    const on = b.dataset.view === view;
    b.classList.toggle('active', on);
    if(on) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
  });
  document.querySelectorAll('.view').forEach(v => v.classList.toggle('active', v.id === 'view-' + view));
  if(scroll) window.scrollTo(0, 0);
  // Keep the active tab visible when the tab bar scrolls sideways on small screens.
  const nav = document.querySelector('nav.seg'), btn = nav.querySelector('.active');
  nav.scrollTo({ left: btn.offsetLeft - (nav.clientWidth - btn.offsetWidth) / 2 });
  viewHooks[view]?.();
}

navBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    if(location.hash !== '#' + btn.dataset.view) location.hash = btn.dataset.view;
    else showView(btn.dataset.view, true);
  });
});
window.addEventListener('hashchange', () => showView(location.hash.slice(1), true));
showView(location.hash.slice(1), false);

/* ============ THEME ============ */
document.getElementById('themebtn').addEventListener('click', () => {
  const root = document.documentElement;
  const current = root.dataset.theme ||
    (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  const next = current === 'light' ? 'dark' : 'light';
  root.dataset.theme = next;
  persist('lab-theme', next);
});
