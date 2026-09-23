/* Arduino lessons view. Uses helpers from app.js and guides.js ($, pills, setOpen, wireToggle, syncToggle,
   setBar, persist, CHECK, CHEVRON, PD, openTarget, refreshRoadmap, lessonState, viewHooks). */

(() => {
  const list = $('lesson-list');
  let filter = 'all';

  /* ---------- a tiny C++ highlighter ---------- */
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const TOKENS = new RegExp([
    /(\/\/.*$)/.source,                                          // 1 comment
    /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)')/.source,               // 2 string / char
    /(#\w+.*$)/.source,                                          // 3 preprocessor
    /\b(void|int|float|bool|byte|char|const|unsigned|long|if|else|for|while|switch|case|break|return|enum|true|false|HIGH|LOW|INPUT|OUTPUT|INPUT_PULLUP|LED_BUILTIN|MSBFIRST|HEX)\b/.source, // 4 keyword
    /\b(\d+(?:\.\d+)?)\b/.source,                                // 5 number
    /\b([A-Za-z_]\w*)(?=\()/.source,                             // 6 function call
  ].join('|'), 'gm');
  const CLS = [null, 'c', 's', 'p', 'k', 'n', 'f'];
  function highlight(code){
    return esc(code).replace(TOKENS, (...m) => {
      const i = m.slice(1, 7).findIndex(g => g !== undefined) + 1;
      return `<span class="tk-${CLS[i]}">${m[0]}</span>`;
    });
  }

  function copy(text, btn){
    const done = ok => {
      btn.textContent = ok ? 'Copied!' : 'Press Ctrl+C';
      setTimeout(() => { btn.textContent = 'Copy'; }, 1500);
    };
    if(navigator.clipboard?.writeText){
      navigator.clipboard.writeText(text).then(() => done(true), () => fallback());
    }else fallback();
    function fallback(){
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try{ ok = document.execCommand('copy'); }catch(e){}
      ta.remove();
      done(ok);
    }
  }

  /* ---------- render ---------- */
  const li = items => items.map(s => `<li>${s}</li>`).join('');
  const cards = [];      // { l, el, num }
  let n = 0;

  LESSON_UNITS.forEach(unit => {
    const group = document.createElement('section');
    group.className = 'stage';
    group.dataset.unit = unit.id;
    group.innerHTML = `<div class="stagehead"><h3><span class="stagenum">Unit ${unit.id}</span>${unit.title}</h3><span class="stagecount"></span></div>`;

    LESSONS.filter(l => l.unit === unit.id).forEach(l => {
      const num = String(++n).padStart(2, '0');
      const redo = l.redo && EXERCISES.find(ex => ex.id === l.redo);
      const redoNum = redo && EXERCISES.indexOf(redo) + 1;
      const el = document.createElement('div');
      el.className = 'cat ex lesson';
      el.id = 'lesson-' + l.id;
      el.innerHTML = `
        <button type="button" class="cathead" aria-expanded="false" aria-controls="lb-${l.id}">
          <span class="ic" aria-hidden="true">${num}</span>
          <span class="text"><span class="title">${l.title}</span><span class="note">${l.goal}</span></span>
          <span class="meta"><span class="tag done" hidden>Done</span></span>
          ${CHEVRON}
        </button>
        <div class="catbody" id="lb-${l.id}"><div><div class="exbody">
          <div class="exmain">
            ${redo ? `<p class="redo">Rebuilds <button type="button" class="nlink" data-exercise="${redo.id}">exercise ${redoNum}: ${redo.title}</button> in code.</p>` : ''}
            <section class="exsec"><h5>You need</h5><ul class="parts">${li(l.parts)}</ul></section>
            <section class="exsec"><h5>Wiring</h5><ol class="steps">${li(l.wiring)}</ol></section>
            <section class="exsec"><h5>Sketch</h5>
              <div class="code">
                <div class="codehead"><span>${l.id}.ino</span><button type="button" class="copybtn">Copy</button></div>
                <pre><code>${highlight(l.code)}</code></pre>
              </div>
            </section>
            <section class="exsec callout"><h5>What you should see</h5><p>${l.expect}</p></section>
            <section class="exsec"><h5>How it works</h5><p>${l.how}</p></section>
            <section class="exsec"><h5>Try this</h5><ul class="watch plain">${li(l.tryThis)}</ul></section>
          </div>
          <div class="exfoot"><button type="button" class="btn" data-print="ls-one">Print</button><button type="button" class="btn donebtn"></button></div>
        </div></div></div>`;

      const pins = PD.block(l.pins);
      if(pins){
        const side = document.createElement('aside');
        side.className = 'exside';
        side.appendChild(pins);
        el.querySelector('.exmain').after(side);
      }else{
        el.querySelector('.exbody').classList.add('single');
      }

      el.querySelector('.cathead').addEventListener('click', () => setOpen(el, !el.classList.contains('open')));
      el.querySelector('.copybtn').addEventListener('click', e => copy(l.code, e.currentTarget));
      el.querySelector('[data-exercise]')?.addEventListener('click', e => openTarget('exercise', e.currentTarget.dataset.exercise));
      el.querySelector('.donebtn').addEventListener('click', () => {
        if(lessonState[l.id]) delete lessonState[l.id]; else lessonState[l.id] = true;
        persist('lab-lessons', JSON.stringify(lessonState));
        refresh();
        refreshRoadmap();
      });
      cards.push({ l, el, num });
      group.appendChild(el);
    });
    list.appendChild(group);
  });
  wireToggle(list, $('ls-toggle'));

  function refresh(){
    let done = 0;
    cards.forEach(({ l, el, num }) => {
      const isDone = !!lessonState[l.id];
      if(isDone) done++;
      el.classList.toggle('done', isDone);
      el.querySelector('.ic').innerHTML = isDone ? CHECK : num;
      el.querySelector('.tag.done').hidden = !isDone;
      const btn = el.querySelector('.donebtn');
      btn.textContent = isDone ? 'Mark as not done' : 'Mark as done';
      btn.classList.toggle('primary', !isDone);
      el.classList.toggle('hidden', filter === 'todo' ? isDone : filter === 'done' ? !isDone : false);
    });
    list.querySelectorAll('.stage').forEach(group => {
      const unitLessons = LESSONS.filter(l => l.unit === +group.dataset.unit);
      const d = unitLessons.filter(l => lessonState[l.id]).length;
      const count = group.querySelector('.stagecount');
      count.textContent = `${d}/${unitLessons.length} done`;
      count.classList.toggle('full', d === unitLessons.length);
      group.classList.toggle('hidden', !group.querySelector('.cat:not(.hidden)'));
    });
    $('ls-txt').textContent = `${done} / ${LESSONS.length} lessons done`;
    setBar($('ls-bar'), done, LESSONS.length);
    const empty = $('ls-empty');
    empty.hidden = !!list.querySelector('.stage:not(.hidden)');
    empty.textContent = filter === 'done' ? 'No lessons marked done yet.' : 'Every lesson is done — on to the ESP32!';
    syncToggle(list);
  }

  const btns = $('ls-filter').querySelectorAll('button');
  btns.forEach(b => b.addEventListener('click', () => {
    btns.forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); });
    filter = b.dataset.lf;
    refresh();
  }));

  viewHooks.arduino = refresh;
  refresh();
})();
