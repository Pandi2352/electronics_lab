/* Tools tab: electronics calculators. Inputs accept shorthand such as 4k7, 2.2M, 100n, 10u and 4R7. */

const TOOLS = (() => {
  /* ---------- numbers ---------- */
  const PREFIX = { p:1e-12, n:1e-9, u:1e-6, 'µ':1e-6, m:1e-3, k:1e3, K:1e3, M:1e6, G:1e9 };

  function parseEng(raw){
    let s = String(raw ?? '').trim().replace(/\s+/g, '').replace(',', '.');
    s = s.replace(/(ohms?|Ω|farads?|volts?|amps?|hz|f|v|a)$/i, '');
    if(!s) return NaN;
    let m = s.match(/^(\d+)[Rr](\d*)$/);                        // 4R7 = 4.7
    if(m) return parseFloat(`${m[1]}.${m[2] || 0}`);
    m = s.match(/^(\d*\.?\d+)([pnuµmkKMG])(\d*)$/);              // 4k7, 4.7k, 100n
    if(m) return parseFloat(m[3] ? `${m[1]}.${m[3]}` : m[1]) * PREFIX[m[2]];
    return /^\d*\.?\d+(e[-+]?\d+)?$/i.test(s) ? parseFloat(s) : NaN;
  }

  const STEPS = [[1e9, 'G'], [1e6, 'M'], [1e3, 'k'], [1, ''], [1e-3, 'm'], [1e-6, 'µ'], [1e-9, 'n'], [1e-12, 'p']];
  const sig = (n, d = 3) => String(parseFloat(n.toPrecision(d)));
  function fmt(v, unit, d = 3){
    if(!isFinite(v)) return '—';
    if(v === 0) return `0 ${unit}`;
    const a = Math.abs(v);
    const [mult, p] = STEPS.find(([m]) => a >= m * 0.9995) || STEPS[STEPS.length - 1];
    return `${sig(v / mult, d)} ${p}${unit}`;
  }
  function fmtTime(s){
    if(!isFinite(s)) return '—';
    if(s < 1) return fmt(s, 's');
    if(s < 60) return `${sig(s)} s`;
    if(s < 3600) return `${sig(s / 60)} min`;
    if(s < 86400) return `${sig(s / 3600)} h`;
    return `${sig(s / 86400)} days`;
  }

  /* ---------- standard resistor values ---------- */
  const E12 = [1, 1.2, 1.5, 1.8, 2.2, 2.7, 3.3, 3.9, 4.7, 5.6, 6.8, 8.2];
  const E24 = [1, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2, 2.2, 2.4, 2.7, 3, 3.3, 3.6, 3.9, 4.3, 4.7, 5.1, 5.6, 6.2, 6.8, 7.5, 8.2, 9.1];
  function around(v, series){
    const dec = 10 ** Math.floor(Math.log10(v));
    return [...series.map(x => x * dec / 10), ...series.map(x => x * dec), 10 * dec].map(x => parseFloat(x.toPrecision(3)));
  }
  const stdUp = (v, s = E12) => around(v, s).find(x => x >= v * (1 - 1e-9));
  const stdDown = (v, s = E12) => around(v, s).filter(x => x <= v * (1 + 1e-9)).pop();
  const stdNearest = (v, s = E12) => around(v, s).reduce((a, b) => Math.abs(Math.log(b / v)) < Math.abs(Math.log(a / v)) ? b : a);
  const isStd = (v, s) => Math.abs(stdNearest(v, s) / v - 1) < 1e-6;
  function wattage(p){
    if(p <= 0.125) return '¼W resistor is fine';
    if(p <= 0.25) return 'use a ½W resistor';
    if(p <= 0.5) return 'use a 1W resistor';
    return `use a power resistor rated at least ${sig(p * 2, 2)}W`;
  }

  /* ---------- colour code ---------- */
  const COLOR_HEX = { black:'#1b1b1b', brown:'#7b4a2a', red:'#d9342b', orange:'#f08a24', yellow:'#f2cf3a', green:'#2e9e4f',
    blue:'#2f6fdb', violet:'#8e44ad', grey:'#8c8c8c', white:'#f4f4f4', gold:'#c9a227', silver:'#b8bcc2' };
  const DIGITS = ['black', 'brown', 'red', 'orange', 'yellow', 'green', 'blue', 'violet', 'grey', 'white'];
  const MULT = { black:0, brown:1, red:2, orange:3, yellow:4, green:5, blue:6, violet:7, grey:8, white:9, gold:-1, silver:-2 };
  const TOL = { brown:1, red:2, green:0.5, blue:0.25, violet:0.1, grey:0.05, gold:5, silver:10, none:20 };
  const cap = s => s[0].toUpperCase() + s.slice(1);

  function resistorSVG(bands, tol){
    const xs = bands.length === 3 ? [78, 100, 122] : [72, 91, 110, 129];
    let s = `<line x1="4" y1="32" x2="276" y2="32" class="rz-lead"/><rect x="52" y="12" width="176" height="40" rx="16" class="rz-body"/>`;
    bands.forEach((c, i) => { s += `<rect x="${xs[i]}" y="12" width="11" height="40" fill="${COLOR_HEX[c]}" class="rz-band"/>`; });
    if(tol !== 'none') s += `<rect x="188" y="12" width="11" height="40" fill="${COLOR_HEX[tol]}" class="rz-band"/>`;
    return `<svg viewBox="0 0 280 64" class="rz" role="img" aria-label="Resistor bands: ${[...bands, tol].join(', ')}">${s}</svg>`;
  }

  /* ---------- markup helpers ---------- */
  const field = (k, label, unit, value, when = '') =>
    `<label class="field"${when ? ` data-when="${when}"` : ''}><span class="flabel">${label}</span><span class="finput"><input type="text" inputmode="decimal" data-k="${k}" value="${value}" autocomplete="off" spellcheck="false">${unit ? `<span class="funit">${unit}</span>` : ''}</span></label>`;
  const select = (k, label, options, value, extra = '') =>
    `<label class="field"${extra}><span class="flabel">${label}</span><span class="finput"><select data-k="${k}">${options.map(([v, t]) => `<option value="${v}"${v === value ? ' selected' : ''}>${t}</option>`).join('')}</select></span></label>`;
  const modes = (list, on) =>
    `<div class="seg sm tmodes" role="group" aria-label="Mode">${list.map(([v, t]) => `<button type="button" data-mode="${v}" class="${v === on ? 'on' : ''}" aria-pressed="${v === on}">${t}</button>`).join('')}</div>`;
  const row = (label, value) => `<div class="trow"><span>${label}</span><b>${value}</b></div>`;
  const msg = (kind, text) => `<p class="tmsg ${kind}">${text}</p>`;
  const main = (label, value) => `<div class="tmain"><span>${label}</span><b>${value}</b></div>`;

  /* ---------- the calculators ---------- */
  const colorOpts = list => list.map(c => [c, cap(c)]);
  const LIST = [
  { id:'color', title:'Resistor colour code', desc:'Read a resistor’s bands, or find the bands for a value.',
    html:() => `${modes([['read', 'Bands → value'], ['find', 'Value → bands']], 'read')}
      ${modes([['4', '4 bands'], ['5', '5 bands']], '4').replace('tmodes', 'tbands').replace(/data-mode/g, 'data-bands')}
      <div class="tfields">
        ${select('b1', 'Band 1', colorOpts(DIGITS.slice(1)), 'yellow', ' data-when="read"')}
        ${select('b2', 'Band 2', colorOpts(DIGITS), 'violet', ' data-when="read"')}
        ${select('b3', 'Band 3', colorOpts(DIGITS), 'black', ' data-when="read" data-five')}
        ${select('mult', 'Multiplier', colorOpts(Object.keys(MULT)), 'red', ' data-when="read"')}
        ${field('value', 'Resistance', 'Ω', '4k7', 'find')}
        ${select('tol', 'Tolerance', Object.keys(TOL).map(c => [c, `${cap(c)} (±${TOL[c]}%)`]), 'gold')}
      </div>`,
    calc(g, mode, st){
      const five = st.bands === '5', tol = g.sel('tol');
      if(mode === 'read'){
        const digits = [g.sel('b1'), g.sel('b2'), ...(five ? [g.sel('b3')] : [])];
        const num = parseInt(digits.map(c => DIGITS.indexOf(c)).join(''), 10);
        const v = num * 10 ** MULT[g.sel('mult')];
        const t = TOL[tol] / 100;
        return resistorSVG(digits.concat(g.sel('mult')), tol) + main('Value', `${fmt(v, 'Ω')} ±${TOL[tol]}%`) +
          row('Range', `${fmt(v * (1 - t), 'Ω', 4)} – ${fmt(v * (1 + t), 'Ω', 4)}`) +
          (isStd(v, E12) ? msg('ok', 'A standard E12 value — easy to buy.') : isStd(v, E24) ? msg('ok', 'A standard E24 value.') : msg('warn', 'Not a common standard value — check the band colours.'));
      }
      const v = g.num('value');
      if(!(v > 0)) return msg('bad', 'Enter a resistance such as 220, 4k7 or 1M.');
      const n = five ? 3 : 2;
      let exp = Math.floor(Math.log10(v)) - (n - 1);
      let digits = Math.round(v / 10 ** exp);
      if(digits >= 10 ** n){ digits /= 10; exp++; }
      const multName = Object.keys(MULT).find(k => MULT[k] === exp);
      if(!multName) return msg('bad', 'That value is outside the colour-code range (0.1Ω to about 99GΩ).');
      const bands = String(digits).padStart(n, '0').split('').map(d => DIGITS[+d]);
      const actual = digits * 10 ** exp;
      return resistorSVG(bands.concat(multName), tol) +
        main('Bands', [...bands, multName, tol].filter(c => c !== 'none').map(cap).join(' · ')) +
        (Math.abs(actual / v - 1) > 1e-6 ? msg('warn', `Rounded to ${fmt(actual, 'Ω')} — ${n} significant digits.`) : '') +
        (isStd(actual, E12) ? msg('ok', 'A standard E12 value.') : isStd(actual, E24) ? msg('ok', 'A standard E24 value.')
          : msg('warn', `Not a standard value. Nearest E12: ${fmt(stdNearest(actual), 'Ω')}.`));
    } },

  { id:'ohm', title:'Ohm’s law', desc:'V = I × R. Pick what to find and enter the other two.',
    html:() => `${modes([['v', 'Find V'], ['i', 'Find I'], ['r', 'Find R']], 'r')}
      <div class="tfields">
        ${field('v', 'Voltage', 'V', '5', 'i r')}
        ${field('i', 'Current', 'mA', '20', 'v r')}
        ${field('r', 'Resistance', 'Ω', '220', 'v i')}
      </div>`,
    calc(g, mode){
      let V = g.num('v'), I = g.num('i') / 1000, R = g.num('r');
      if(mode === 'v'){ if(!(I > 0 && R > 0)) return msg('bad', 'Enter current and resistance.'); V = I * R; }
      if(mode === 'i'){ if(!(V > 0 && R > 0)) return msg('bad', 'Enter voltage and resistance.'); I = V / R; }
      if(mode === 'r'){ if(!(V > 0 && I > 0)) return msg('bad', 'Enter voltage and current.'); R = V / I; }
      const P = V * I;
      return main({ v:'Voltage', i:'Current', r:'Resistance' }[mode], mode === 'v' ? fmt(V, 'V') : mode === 'i' ? fmt(I, 'A') : fmt(R, 'Ω')) +
        (mode === 'r' ? row('Nearest standard (E12)', fmt(stdNearest(R), 'Ω')) : '') +
        row('Power', fmt(P, 'W')) + msg('ok', `Power in the resistor: ${wattage(P)}.`);
    } },

  { id:'led', title:'LED resistor', desc:'The series resistor an LED needs, rounded up to a value you can buy.',
    html:() => `<div class="tfields">
        ${field('vs', 'Supply voltage', 'V', '5')}
        ${select('color', 'LED colour', [['2.0', 'Red (≈2.0V)'], ['2.0o', 'Orange (≈2.0V)'], ['2.1', 'Yellow (≈2.1V)'], ['2.2', 'Green (≈2.2V)'], ['3.1', 'Blue (≈3.1V)'], ['3.1w', 'White (≈3.1V)'], ['1.2', 'Infrared (≈1.2V)']], '2.0')}
        ${field('vf', 'Forward voltage', 'V', '2.0')}
        ${field('i', 'LED current', 'mA', '10')}
        ${field('n', 'LEDs in series', '', '1')}
      </div>`,
    init(el, update){
      el.querySelector('[data-k="color"]').addEventListener('change', e => {
        el.querySelector('[data-k="vf"]').value = parseFloat(e.target.value).toFixed(1);
        update();
      });
    },
    calc(g){
      const vs = g.num('vs'), vf = g.num('vf'), i = g.num('i') / 1000, n = Math.round(g.num('n'));
      if(!(vs > 0 && vf > 0 && i > 0 && n >= 1)) return msg('bad', 'Fill in all the fields.');
      const drop = vs - n * vf;
      if(drop <= 0) return msg('bad', `The supply must be above ${sig(n * vf)}V for ${n} LED${n > 1 ? 's' : ''} in series.`);
      const r = drop / i, std = stdUp(r), actual = drop / std, p = actual * actual * std;
      return main('Use', fmt(std, 'Ω')) + row('Exact value', fmt(r, 'Ω')) + row('Actual current', fmt(actual, 'A')) +
        row('Resistor power', fmt(p, 'W')) + msg('ok', `Rounded up to the next E12 value, so the LED gets slightly less current. ${cap(wattage(p))}.`) +
        (i > 0.02 ? msg('warn', 'Standard 5mm LEDs are rated for about 20mA — 5–10mA is plenty bright.') : '');
    } },

  { id:'divider', title:'Voltage divider', desc:'Scale a voltage down, e.g. a battery or 5V signal into an ADC pin.',
    html:() => `${modes([['out', 'Find Vout'], ['pick', 'Pick R2']], 'out')}
      <div class="tfields">
        ${field('vin', 'Input voltage', 'V', '5')}
        ${field('r1', 'R1 (top)', 'Ω', '10k')}
        ${field('r2', 'R2 (bottom)', 'Ω', '15k', 'out')}
        ${field('target', 'Wanted Vout', 'V', '3.3', 'pick')}
        ${select('adc', 'Reading it with', [['esp32', 'ESP32 (3.3V, 12-bit)'], ['uno', 'Arduino UNO (5V, 10-bit)'], ['none', 'Nothing / a meter']], 'esp32')}
      </div>`,
    calc(g, mode){
      const vin = g.num('vin'), r1 = g.num('r1');
      if(!(vin > 0 && r1 > 0)) return msg('bad', 'Enter the input voltage and R1.');
      let r2 = g.num('r2'), head = '';
      if(mode === 'pick'){
        const target = g.num('target');
        if(!(target > 0 && target < vin)) return msg('bad', 'The wanted Vout must be between 0 and the input voltage.');
        const exact = r1 * target / (vin - target);
        r2 = stdDown(exact);
        head = main('Use R2', fmt(r2, 'Ω')) + row('Exact R2', fmt(exact, 'Ω'));
      }else if(!(r2 > 0)) return msg('bad', 'Enter R2.');
      const vout = vin * r2 / (r1 + r2), ia = vin / (r1 + r2);
      let out = head + (mode === 'out' ? main('Vout', fmt(vout, 'V')) : row('Vout with this R2', fmt(vout, 'V'))) +
        row('Divider current', fmt(ia, 'A')) + row('Ratio', `${sig(vout / vin)} × Vin`);
      const adc = g.sel('adc');
      if(adc !== 'none'){
        const [vmax, bits, name] = adc === 'esp32' ? [3.3, 12, 'ESP32'] : [5, 10, 'UNO'];
        const reading = Math.min(Math.round(vout / vmax * (2 ** bits - 1)), 2 ** bits - 1);
        out += row(`${name} reading (about)`, `${reading} / ${2 ** bits - 1}`);
        if(vout > vmax) out += msg('bad', `Above ${vmax}V — this can damage the ${name} pin. Increase R1 or decrease R2.`);
        else if(adc === 'esp32' && vout > 3.1) out += msg('warn', 'The ESP32 ADC flattens out above about 3.1V — aim for 2.5–3.0V at the highest input.');
        else out += msg('ok', `Safe for the ${name} pin.`);
        if(adc === 'esp32') out += msg('note', 'ESP32 ADC readings are only approximate — calibrate against your multimeter.');
      }
      if(r1 + r2 < 1000) out += msg('warn', 'Under 1kΩ total wastes a lot of current. 10k–100k is typical.');
      if(r1 + r2 > 1e6) out += msg('warn', 'Over 1MΩ total — ADC readings may be noisy. Add 100nF from Vout to GND.');
      return out;
    } },

  { id:'555', title:'555 timer', desc:'Frequency and timing for the astable (blinker) and monostable (one-shot) circuits.',
    html:() => `${modes([['astable', 'Astable'], ['mono', 'Monostable']], 'astable')}
      <div class="tfields">
        ${field('r1', 'R1', 'Ω', '10k', 'astable')}
        ${field('r2', 'R2', 'Ω', '47k', 'astable')}
        ${field('r', 'R', 'Ω', '100k', 'mono')}
        ${field('c', 'C', 'F', '10u')}
      </div>`,
    calc(g, mode){
      const c = g.num('c');
      if(mode === 'mono'){
        const r = g.num('r');
        if(!(r > 0 && c > 0)) return msg('bad', 'Enter R and C.');
        return main('Pulse length', fmtTime(1.1 * r * c)) + msg('note', 't = 1.1 × R × C. Electrolytic capacitors are often ±20%, so expect some difference.');
      }
      const r1 = g.num('r1'), r2 = g.num('r2');
      if(!(r1 > 0 && r2 > 0 && c > 0)) return msg('bad', 'Enter R1, R2 and C.');
      const high = 0.693 * (r1 + r2) * c, low = 0.693 * r2 * c, f = 1 / (high + low);
      return main('Frequency', fmt(f, 'Hz')) + row('Period', fmtTime(high + low)) + row('High time', fmtTime(high)) +
        row('Low time', fmtTime(low)) + row('Duty cycle', `${sig((high / (high + low)) * 100)}%`) +
        msg('note', 'f = 1.44 ÷ ((R1 + 2·R2) × C). The duty cycle is always above 50% in this circuit.') +
        (r1 < 1000 ? msg('warn', 'Keep R1 at 1kΩ or more to protect the discharge pin.') : '');
    } },

  { id:'rc', title:'RC time constant', desc:'How fast a capacitor charges through a resistor, and the RC filter cut-off.',
    html:() => `<div class="tfields">
        ${field('r', 'Resistance', 'Ω', '100k')}
        ${field('c', 'Capacitance', 'F', '100u')}
        ${field('v', 'Supply voltage', 'V', '5')}
        ${field('t', 'After time', 's', '10')}
      </div>`,
    calc(g){
      const r = g.num('r'), c = g.num('c'), v = g.num('v'), t = g.num('t');
      if(!(r > 0 && c > 0)) return msg('bad', 'Enter R and C.');
      const tau = r * c;
      let out = main('τ (tau) = R × C', fmtTime(tau)) + row('Fully charged (5τ)', fmtTime(5 * tau)) + row('Filter cut-off', fmt(1 / (2 * Math.PI * tau), 'Hz'));
      if(v > 0 && t >= 0){
        out += row(`Charging, after ${fmtTime(t)}`, fmt(v * (1 - Math.exp(-t / tau)), 'V'));
        out += row(`Discharging, after ${fmtTime(t)}`, fmt(v * Math.exp(-t / tau), 'V'));
      }
      return out + msg('note', 'After one τ a capacitor reaches 63% of the supply; after 5τ it is effectively full.');
    } },

  { id:'battery', title:'Battery life', desc:'Estimate how long a battery lasts, including sleep between readings.',
    html:() => `<div class="presets"><span class="chiplabel">Presets</span>
        <button type="button" class="pill link" data-preset="2500,80,50,0,0,0">Arduino UNO, always on</button>
        <button type="button" class="pill link" data-preset="2500,80,100,0,0,0">ESP32 on Wi-Fi, always on</button>
        <button type="button" class="pill link" data-preset="2500,80,150,5,10,600">ESP32 module, wake every 10 min</button>
      </div>
      <div class="tfields">
        ${field('cap', 'Battery capacity', 'mAh', '2500')}
        ${field('use', 'Usable capacity', '%', '80')}
        ${field('ia', 'Current when awake', 'mA', '150')}
        ${field('ta', 'Awake time per wake-up', 's', '5')}
        ${field('is', 'Sleep current', 'µA', '10')}
        ${field('period', 'Wakes up every', 's', '600')}
      </div>`,
    init(el, update){
      el.querySelectorAll('[data-preset]').forEach(b => b.addEventListener('click', () => {
        const vals = b.dataset.preset.split(',');
        ['cap', 'use', 'ia', 'ta', 'is', 'period'].forEach((k, i) => { el.querySelector(`[data-k="${k}"]`).value = vals[i]; });
        update();
      }));
    },
    calc(g){
      const cap = g.num('cap'), use = g.num('use'), ia = g.num('ia'), ta = g.num('ta') || 0, is = (g.num('is') || 0) / 1000, T = g.num('period') || 0;
      if(!(cap > 0 && use > 0 && ia > 0)) return msg('bad', 'Enter capacity, usable % and the awake current.');
      const avg = T > ta && ta > 0 ? (ia * ta + is * (T - ta)) / T : ia;     // mA
      const hours = cap * use / 100 / avg;
      return main('Battery life', fmtTime(hours * 3600)) + row('Average current', fmt(avg / 1000, 'A')) +
        row('In hours', `${sig(hours)} h`) + (hours > 24 * 60 ? row('In months', sig(hours / 730)) : '') +
        msg('note', 'Set “wakes up every” to 0 for a device that is always on.') +
        msg('warn', 'Dev boards waste power in sleep: a DevKit’s regulator and USB chip draw several mA, far more than the ESP32 itself.');
    } },

  { id:'series', title:'Series & parallel', desc:'Combine resistors or capacitors. Separate values with commas or spaces.',
    html:() => `${modes([['r', 'Resistors'], ['c', 'Capacitors']], 'r')}
      <div class="tfields one">
        <label class="field"><span class="flabel">Values</span><span class="finput"><input type="text" data-k="list" value="1k, 1k, 2.2k" autocomplete="off" spellcheck="false"></span></label>
      </div>`,
    calc(g, mode){
      const vals = g.raw('list').split(/[,;+\s]+/).filter(Boolean).map(parseEng);
      if(!vals.length || vals.some(v => !(v > 0))) return msg('bad', 'Enter values like 1k, 4k7, 100n, 10u.');
      const sum = vals.reduce((a, b) => a + b, 0), inv = 1 / vals.reduce((a, b) => a + 1 / b, 0);
      const unit = mode === 'r' ? 'Ω' : 'F';
      const [series, parallel] = mode === 'r' ? [sum, inv] : [inv, sum];
      return main('In series', fmt(series, unit)) + row('In parallel', fmt(parallel, unit)) + row('Parts', vals.length) +
        msg('note', mode === 'r' ? 'Resistors add in series; in parallel the total is below the smallest one.'
          : 'Capacitors add in parallel; in series the total is below the smallest one.');
    } },

  { id:'units', title:'Capacitor codes & units', desc:'Decode a 3-digit capacitor code (104 = 100nF), or find the code for a value.',
    html:() => `<div class="tfields">
        <label class="field"><span class="flabel">Code or value</span><span class="finput"><input type="text" data-k="code" value="104" autocomplete="off" spellcheck="false"></span></label>
      </div>`,
    calc(g){
      const raw = g.raw('code').trim();
      const tolMap = { J:'±5%', K:'±10%', M:'±20%' };
      let m = raw.match(/^(\d)(\d)(\d)?([JKMjkm])?$/), pf, code;
      const rn = raw.match(/^(\d)[Rr](\d)$/);
      if(m){
        pf = parseInt(m[1] + m[2], 10) * 10 ** (m[3] ? +m[3] : 0);
        code = raw.toUpperCase();
      }else if(rn){
        pf = parseFloat(`${rn[1]}.${rn[2]}`);
        code = raw.toUpperCase();
      }else{
        const f = parseEng(raw);
        if(!(f > 0)) return msg('bad', 'Enter a code like 104, 473J or 4R7 — or a value like 100n or 0.1u.');
        pf = f * 1e12;
        if(pf < 10) code = sig(pf, 2).replace('.', 'R');
        else {
          const exp = Math.floor(Math.log10(pf)) - 1, two = Math.round(pf / 10 ** exp);
          code = exp <= 9 ? `${two}${exp}` : '—';
        }
      }
      const tol = m && m[4] ? tolMap[m[4].toUpperCase()] : '';
      return main(m || rn ? 'Value' : 'Code', m || rn ? fmt(pf * 1e-12, 'F') : code) +
        row('Picofarads', `${sig(pf, 4)} pF`) + row('Nanofarads', `${sig(pf / 1000, 4)} nF`) + row('Microfarads', `${sig(pf / 1e6, 4)} µF`) +
        (m || rn ? row('Code', code) : '') + (tol ? row('Tolerance', tol) : '') +
        msg('note', 'First two digits, then the number of zeros, in picofarads: 104 = 10 + 0000 pF = 100nF. R marks a decimal point.');
    } },
  ];

  /* ---------- render ---------- */
  function render(grid, jumps){
    jumps.innerHTML = LIST.map(t => `<button type="button" class="pill link" data-tool="${t.id}">${t.title}</button>`).join('');
    LIST.forEach(t => {
      const el = document.createElement('section');
      el.className = 'tool';
      el.id = 'tool-' + t.id;
      el.innerHTML = `<h3>${t.title}</h3><p class="tdesc">${t.desc}</p>${t.html()}<div class="tresult" aria-live="polite"></div>`;
      const st = { mode: el.querySelector('.tmodes .on')?.dataset.mode, bands: el.querySelector('.tbands .on')?.dataset.bands };
      const g = {
        raw: k => el.querySelector(`[data-k="${k}"]`).value,
        num: k => parseEng(el.querySelector(`[data-k="${k}"]`).value),
        sel: k => el.querySelector(`[data-k="${k}"]`).value,
      };
      const update = () => {
        el.querySelectorAll('[data-when]').forEach(f => { f.hidden = !f.dataset.when.split(' ').includes(st.mode); });
        el.querySelectorAll('[data-five]').forEach(f => { f.hidden = f.hidden || st.bands !== '5'; });
        el.querySelectorAll('input[data-k]').forEach(i => {
          const bad = i.dataset.k !== 'list' && i.dataset.k !== 'code' && i.value.trim() !== '' && isNaN(parseEng(i.value));
          i.setAttribute('aria-invalid', bad);
        });
        el.querySelector('.tresult').innerHTML = t.calc(g, st.mode, st);
      };
      el.addEventListener('input', update);
      el.addEventListener('change', update);
      el.querySelectorAll('.tmodes button, .tbands button').forEach(b => b.addEventListener('click', () => {
        const group = b.parentElement;
        group.querySelectorAll('button').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); });
        if(b.dataset.mode) st.mode = b.dataset.mode; else st.bands = b.dataset.bands;
        update();
      }));
      t.init?.(el, update);
      update();
      grid.appendChild(el);
    });
  }

  return { render, parseEng, fmt };
})();
