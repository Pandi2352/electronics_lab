/* Pinout diagrams as inline SVG. Colours come from CSS classes, so they follow the theme. */

const PD = (() => {
  const svg = (w, h, body, label, x0 = 0) =>
    `<svg viewBox="${x0} 0 ${w} ${h}" style="max-width:${w * 1.25}px" role="img" aria-label="${label}">${body}</svg>`;
  const t = (x, y, s, cls = 'pd-t', anchor = 'middle') =>
    `<text x="${x}" y="${y}" class="${cls}" text-anchor="${anchor}">${s}</text>`;
  const line = (x1, y1, x2, y2, cls = 'pd-leg') =>
    `<line class="${cls}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
  const pinCls = name =>
    /^(VCC|VDD|V\+)$/.test(name) ? 'pd-t pd-vcc' : /^(GND|VSS|V−)$/.test(name) ? 'pd-t pd-gnd' : 'pd-t';

  // DIP package, top view: notch up, pin 1 top-left, numbering runs counter-clockwise.
  function dip(name, pins){
    const half = pins.length / 2, pitch = 22, bx = 108, bw = 84, top = 14;
    const bodyH = half * pitch + 8, W = 300, H = top + bodyH + 12, cx = bx + bw / 2, cy = top + bodyH / 2;
    let s = `<rect class="pd-body" x="${bx}" y="${top}" width="${bw}" height="${bodyH}" rx="4"/>`;
    s += `<path class="pd-notch" d="M${cx - 9} ${top} a9 9 0 0 0 18 0"/>`;
    s += `<text class="pd-name" x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="middle" transform="rotate(-90 ${cx} ${cy})">${name}</text>`;
    for(let i = 0; i < half; i++){
      const y = top + 4 + pitch * i + pitch / 2, r = pins.length - 1 - i;
      s += `<rect class="pd-pin" x="${bx - 12}" y="${y - 3.5}" width="12" height="7" rx="1"/>`;
      s += `<rect class="pd-pin" x="${bx + bw}" y="${y - 3.5}" width="12" height="7" rx="1"/>`;
      s += t(bx + 7, y + 3.5, i + 1, 'pd-s', 'start') + t(bx + bw - 7, y + 3.5, r + 1, 'pd-s', 'end');
      s += t(bx - 17, y + 4, pins[i], pinCls(pins[i]), 'end') + t(bx + bw + 17, y + 4, pins[r], pinCls(pins[r]), 'start');
    }
    return svg(W, H, s, `${name} pinout`);
  }

  // TO-92, flat face toward the viewer, legs down.
  function to92(name, legs){
    const xs = [80, 120, 160];
    let s = `<path class="pd-body" d="M62 72 V34 Q62 14 84 14 H156 Q178 14 178 34 V72 Z"/>`;
    s += t(120, 48, name, 'pd-name');
    xs.forEach((x, i) => {
      s += line(x, 72, x, 106) + t(x, 124, legs[i][0], 'pd-t pd-big') + t(x, 140, legs[i][1], 'pd-s');
    });
    return svg(240, 150, s, `${name} pinout`);
  }

  // TO-220, printed face toward the viewer, legs down.
  function to220(name, legs){
    const xs = [80, 120, 160];
    let s = `<rect class="pd-tab" x="72" y="8" width="96" height="46" rx="3"/><circle class="pd-bghole" cx="120" cy="30" r="9"/>`;
    s += `<rect class="pd-body" x="72" y="50" width="96" height="62" rx="3"/>` + t(120, 86, name, 'pd-name');
    xs.forEach((x, i) => {
      s += line(x, 112, x, 146) + t(x, 164, legs[i][0], 'pd-t pd-big') + t(x, 180, legs[i][1], 'pd-s');
    });
    return svg(240, 190, s, `${name} pinout`);
  }

  function breadboard(){
    const cols = 12, x0 = 34, dx = 20, last = x0 + (cols - 1) * dx;
    const rows = { a:50, b:62, c:74, d:86, e:98, f:120, g:132, h:144, i:156, j:168 };
    const rails = [[12, '+', 'pd-railp'], [26, '−', 'pd-railn'], [192, '+', 'pd-railp'], [206, '−', 'pd-railn']];
    let s = '';
    rails.forEach(([y, sign, cls]) => {
      s += `<rect class="${cls}" x="${x0 - 8}" y="${y - 6}" width="${last - x0 + 16}" height="12" rx="3"/>`;
      s += t(16, y + 4, sign, 'pd-t');
    });
    s += `<rect class="pd-hl" x="${x0 + 2 * dx - 7}" y="43" width="14" height="62" rx="4"/>`;
    s += `<rect class="pd-hl" x="${x0 + 2 * dx - 7}" y="113" width="14" height="62" rx="4"/>`;
    Object.entries(rows).forEach(([r, y]) => { s += t(16, y + 3.5, r, 'pd-s'); });
    [12, 26, 192, 206, ...Object.values(rows)].forEach(y => {
      for(let c = 0; c < cols; c++) s += `<circle class="pd-hole" cx="${x0 + c * dx}" cy="${y}" r="2.6"/>`;
    });
    s += t((x0 + last) / 2 + 10, 112.5, 'centre gap', 'pd-s');
    return svg(280, 216, s, 'Breadboard connections');
  }

  function led(){
    let s = `<path class="pd-body" d="M104 84 V46 A26 26 0 0 1 156 46 V84 Z"/>`;
    s += `<path class="pd-body" d="M96 84 H158 V94 H96 Z"/>`;
    s += line(118, 94, 118, 166) + line(142, 94, 142, 144);
    s += t(110, 150, 'Anode (+)', 'pd-t', 'end') + t(110, 163, 'long leg', 'pd-s', 'end');
    s += t(150, 130, 'Cathode (−)', 'pd-t', 'start') + t(150, 143, 'short leg', 'pd-s', 'start');
    s += t(164, 92, '← flat edge', 'pd-s', 'start');
    return svg(260, 176, s, 'LED pinout');
  }

  function rgb(){
    const legs = [[104, 146, 'R'], [128, 168, 'COM'], [152, 152, 'G'], [176, 146, 'B']];
    let s = `<path class="pd-body" d="M100 84 V52 A40 40 0 0 1 180 52 V84 Z"/>`;
    s += `<path class="pd-body" d="M94 84 H186 V94 H94 Z"/>`;
    legs.forEach(([x, end, name]) => { s += line(x, 94, x, end) + t(x, end + 15, name, 'pd-t'); });
    return svg(280, 190, s, 'RGB LED pinout');
  }

  function button(){
    let s = line(78, 44, 100, 44) + line(78, 96, 100, 96) + line(180, 44, 202, 44) + line(180, 96, 202, 96);
    s += `<rect class="pd-body" x="100" y="30" width="80" height="80" rx="6"/><circle class="pd-act" cx="140" cy="70" r="20"/>`;
    s += line(100, 44, 180, 44, 'pd-link') + line(100, 96, 180, 96, 'pd-link');
    s += t(70, 48, '1', 'pd-t', 'end') + t(210, 48, '2', 'pd-t', 'start');
    s += t(70, 100, '3', 'pd-t', 'end') + t(210, 100, '4', 'pd-t', 'start');
    s += t(140, 134, '1–2 and 3–4 are always joined', 'pd-s') + t(140, 150, 'pressing joins 1–2 to 3–4', 'pd-s');
    return svg(280, 160, s, 'Push button pinout');
  }

  function pot(){
    let s = `<rect class="pd-body" x="70" y="16" width="120" height="74" rx="8"/><circle class="pd-act" cx="130" cy="53" r="24"/>`;
    s += line(130, 53, 130, 33, 'pd-mark');
    [[100, '1', 'end'], [130, '2', 'wiper'], [160, '3', 'end']].forEach(([x, n, name]) => {
      s += line(x, 90, x, 122) + t(x, 140, n, 'pd-t pd-big') + t(x, 156, name, 'pd-s');
    });
    return svg(260, 166, s, 'Potentiometer pinout');
  }

  function ecap(){
    let s = `<rect class="pd-body" x="92" y="14" width="56" height="96" rx="10"/>`;
    s += `<path class="pd-stripe" d="M102 14 H110 V110 H102 A10 10 0 0 1 92 100 V24 A10 10 0 0 1 102 14 Z"/>`;
    [42, 66, 90].forEach(y => { s += t(101, y, '−', 'pd-inv'); });
    s += line(108, 110, 108, 144) + line(132, 110, 132, 164);
    s += t(108, 160, '−', 'pd-t pd-big') + t(132, 180, '+', 'pd-t pd-big');
    s += t(100, 140, 'short', 'pd-s', 'end') + t(140, 140, 'long', 'pd-s', 'start');
    return svg(240, 188, s, 'Electrolytic capacitor pinout');
  }

  function diode(){
    let s = line(20, 40, 86, 40) + line(214, 40, 280, 40);
    s += `<rect class="pd-body" x="86" y="26" width="128" height="28" rx="6"/><rect class="pd-band" x="186" y="26" width="14" height="28"/>`;
    s += t(50, 70, 'Anode (A)', 'pd-t') + t(250, 70, 'Cathode (K)', 'pd-t');
    s += line(64, 110, 128, 110, 'pd-wire') + line(156, 110, 236, 110, 'pd-wire');
    s += `<path class="pd-sym" d="M128 96 L128 124 L156 110 Z"/>` + line(157, 96, 157, 124, 'pd-wire');
    s += t(56, 114, 'A', 'pd-t', 'end') + t(244, 114, 'K', 'pd-t', 'start');
    s += t(150, 146, 'current flows A → K · the stripe marks K', 'pd-s');
    return svg(300, 156, s, 'Diode pinout');
  }

  function seg7(){
    const seg = (x, y, w, h) => `<rect class="pd-seg" x="${x}" y="${y}" width="${w}" height="${h}" rx="3"/>`;
    let s = `<rect class="pd-body" x="70" y="40" width="120" height="170" rx="4"/>`;
    s += seg(102, 66, 56, 8) + seg(102, 121, 56, 8) + seg(102, 176, 56, 8);
    s += seg(92, 76, 8, 43) + seg(160, 76, 8, 43) + seg(92, 131, 8, 43) + seg(160, 131, 8, 43);
    s += `<circle class="pd-seg" cx="178" cy="182" r="4"/>`;
    s += t(130, 88, 'a', 'pd-s') + t(152, 102, 'b', 'pd-s') + t(152, 158, 'c', 'pd-s') + t(130, 170, 'd', 'pd-s');
    s += t(108, 158, 'e', 'pd-s') + t(108, 102, 'f', 'pd-s') + t(130, 143, 'g', 'pd-s');
    const top = ['g', 'f', 'COM', 'a', 'b'], bottom = ['e', 'd', 'COM', 'c', 'dp'];
    [90, 110, 130, 150, 170].forEach((x, i) => {
      s += line(x, 20, x, 40) + t(x, 13, top[i], top[i] === 'COM' ? 'pd-t pd-gnd' : 'pd-t') + t(x, 54, 10 - i, 'pd-s');
      s += line(x, 210, x, 230) + t(x, 244, bottom[i], bottom[i] === 'COM' ? 'pd-t pd-gnd' : 'pd-t') + t(x, 204, i + 1, 'pd-s');
    });
    return svg(260, 250, s, '7-segment display pinout');
  }

  /* ---- Boards ---- */
  const POWER = /^(VIN|5V|3\.3V|3V3|VBUS|VSYS|3V3\(OUT\))$/;
  const boardCls = (label, kind) =>
    kind === 'w' ? 'pd-t pd-warn' : kind === 'in' ? 'pd-t pd-in' :
    POWER.test(label) ? 'pd-t pd-vcc' : label === 'GND' ? 'pd-t pd-gnd' : 'pd-t';
  // Text rotated to read upwards (for pin labels above/below a horizontal header).
  const tr = (x, y, s, cls, anchor) =>
    `<text x="${x}" y="${y}" class="${cls}" text-anchor="${anchor}" transform="rotate(-90 ${x} ${y})">${s}</text>`;

  // One vertical row of header pins: [label, small function text, 'w' (boot pin) | 'in' (input only)].
  function pinColumn(pins, x, y0, pitch, side){
    let s = '';
    pins.forEach(([label, fn, kind], i) => {
      const y = y0 + i * pitch, left = side === 'L';
      s += `<circle class="pd-pad" cx="${x}" cy="${y}" r="3.6"/>`;
      s += t(left ? x - 12 : x + 12, y + 4, label, boardCls(label, kind), left ? 'end' : 'start');
      if(fn) s += t(left ? x + 9 : x - 9, y + 3, fn, 'pd-xs', left ? 'start' : 'end');
    });
    return s;
  }

  function esp32Devkit(){
    const L = [['EN', 'reset'], ['36', 'VP · in', 'in'], ['39', 'VN · in', 'in'], ['34', 'in only', 'in'], ['35', 'in only', 'in'],
      ['32', 'ADC1'], ['33', 'ADC1'], ['25', 'DAC1'], ['26', 'DAC2'], ['27', ''], ['14', ''], ['12', 'boot', 'w'], ['13', ''], ['GND', ''], ['VIN', '5V in']];
    const R = [['23', 'MOSI'], ['22', 'SCL'], ['1', 'TX0'], ['3', 'RX0'], ['21', 'SDA'], ['19', 'MISO'], ['18', 'SCK'], ['5', 'SS · boot', 'w'],
      ['17', 'TX2'], ['16', 'RX2'], ['4', ''], ['2', 'LED · boot', 'w'], ['15', 'boot', 'w'], ['GND', ''], ['3V3', '3.3V out']];
    const y0 = 150, pitch = 15, bottom = y0 + 14 * pitch;
    let s = `<rect class="pd-body" x="140" y="26" width="120" height="${bottom - 26 + 44}" rx="8"/>`;
    s += `<rect class="pd-tab" x="160" y="36" width="80" height="84" rx="3"/>` + t(200, 74, 'ESP32', 'pd-name') + t(200, 88, 'WROOM-32', 'pd-xs');
    s += `<rect class="pd-tab" x="150" y="${bottom + 18}" width="18" height="10" rx="2"/>` + t(159, bottom + 40, 'EN', 'pd-xs');
    s += `<rect class="pd-tab" x="232" y="${bottom + 18}" width="18" height="10" rx="2"/>` + t(241, bottom + 40, 'BOOT', 'pd-xs');
    s += `<rect class="pd-tab" x="178" y="${bottom + 30}" width="44" height="22" rx="3"/>` + t(200, bottom + 45, 'USB', 'pd-xs');
    s += pinColumn(L, 148, y0, pitch, 'L') + pinColumn(R, 252, y0, pitch, 'R');
    return svg(206, bottom + 60, s, 'ESP32 DevKit V1 30-pin pinout', 97);
  }

  function pico(){
    const L = [['GP0', '1 · TX0'], ['GP1', '2 · RX0'], ['GND', '3'], ['GP2', '4'], ['GP3', '5'], ['GP4', '6 · SDA0'], ['GP5', '7 · SCL0'],
      ['GND', '8'], ['GP6', '9'], ['GP7', '10'], ['GP8', '11'], ['GP9', '12'], ['GND', '13'], ['GP10', '14'], ['GP11', '15'],
      ['GP12', '16'], ['GP13', '17'], ['GND', '18'], ['GP14', '19'], ['GP15', '20']];
    const R = [['VBUS', '40 · USB 5V'], ['VSYS', '39 · 1.8–5.5V'], ['GND', '38'], ['3V3_EN', '37'], ['3V3(OUT)', '36'], ['ADC_VREF', '35'],
      ['GP28', '34 · ADC2'], ['GND', '33'], ['GP27', '32 · ADC1'], ['GP26', '31 · ADC0'], ['RUN', '30 · reset'], ['GP22', '29'],
      ['GND', '28'], ['GP21', '27'], ['GP20', '26'], ['GP19', '25'], ['GP18', '24'], ['GND', '23'], ['GP17', '22'], ['GP16', '21']];
    const y0 = 66, pitch = 14, bottom = y0 + 19 * pitch;
    let s = `<rect class="pd-body" x="140" y="30" width="120" height="${bottom - 30 + 22}" rx="6"/>`;
    s += `<rect class="pd-tab" x="180" y="16" width="40" height="24" rx="3"/>` + t(200, 32, 'USB', 'pd-xs');
    s += t(200, 54, 'Pico · RP2040', 'pd-xs');
    s += pinColumn(L, 148, y0, pitch, 'L') + pinColumn(R, 252, y0, pitch, 'R');
    return svg(236, bottom + 30, s, 'Raspberry Pi Pico pinout', 90);
  }

  // Classic Arduino Nano (ATmega328P), top view with the USB connector at the top.
  function nano(){
    const L = [['D13', 'SCK · LED'], ['3V3', '3.3V out'], ['AREF', ''], ['A0', ''], ['A1', ''], ['A2', ''], ['A3', ''],
      ['A4', 'SDA'], ['A5', 'SCL'], ['A6', 'analog only', 'in'], ['A7', 'analog only', 'in'], ['5V', '5V'], ['RST', 'reset'], ['GND', ''], ['VIN', '7–12V in']];
    const R = [['D12', 'MISO'], ['D11', '~ MOSI'], ['D10', '~ SS'], ['D9', '~'], ['D8', ''], ['D7', ''], ['D6', '~'], ['D5', '~'],
      ['D4', ''], ['D3', '~ INT1'], ['D2', 'INT0'], ['GND', ''], ['RST', 'reset'], ['D0', 'RX'], ['D1', 'TX']];
    const y0 = 70, pitch = 15, bottom = y0 + 14 * pitch;
    let s = `<rect class="pd-body" x="140" y="30" width="120" height="${bottom - 30 + 22}" rx="6"/>`;
    s += `<rect class="pd-tab" x="178" y="14" width="44" height="26" rx="3"/>` + t(200, 31, 'USB', 'pd-xs');
    s += `<rect class="pd-tab" x="181" y="${y0 + 70}" width="38" height="38" rx="2" transform="rotate(45 200 ${y0 + 89})"/>` + t(200, y0 + 92, '328P', 'pd-xs');
    s += pinColumn(L, 148, y0, pitch, 'L') + pinColumn(R, 252, y0, pitch, 'R');
    return svg(206, bottom + 30, s, 'Arduino Nano pinout', 97);
  }

  function uno(){
    const top1 = ['SCL', 'SDA', 'AREF', 'GND', '13', '12', '~11', '~10', '~9', '8'];
    const top2 = ['7', '~6', '~5', '4', '~3', '2', 'TX 1', 'RX 0'];
    const bot1 = ['NC', 'IOREF', 'RESET', '3.3V', '5V', 'GND', 'GND', 'VIN'];
    const bot2 = ['A0', 'A1', 'A2', 'A3', 'A4', 'A5'];
    const pitch = 18;
    let s = `<rect class="pd-body" x="40" y="86" width="470" height="190" rx="10"/>`;
    s += `<rect class="pd-tab" x="20" y="104" width="54" height="46" rx="3"/>` + t(47, 131, 'USB', 'pd-xs');
    s += `<rect class="pd-tab" x="20" y="212" width="58" height="42" rx="3"/>` + t(49, 237, 'DC 7–12V', 'pd-xs');
    s += `<rect class="pd-tab" x="250" y="182" width="180" height="32" rx="3"/>` + t(340, 202, 'ATmega328P', 'pd-name');
    const header = (labels, x0, y, labelY, anchor) => {
      let h = `<rect class="pd-tab" x="${x0 - 8}" y="${y - 8}" width="${(labels.length - 1) * pitch + 16}" height="16" rx="2"/>`;
      labels.forEach((l, i) => {
        const x = x0 + i * pitch;
        h += `<rect class="pd-hdr" x="${x - 3.5}" y="${y - 3.5}" width="7" height="7"/>`;
        h += tr(x + 4, labelY, l, boardCls(l.replace(/^~/, '')), anchor);
      });
      return h;
    };
    s += header(top1, 168, 96, 80, 'start') + header(top2, 350, 96, 80, 'start');
    s += header(bot1, 196, 266, 284, 'end') + header(bot2, 350, 266, 284, 'end');
    s += t(322, 126, 'DIGITAL  (~ = PWM)', 'pd-xs') + t(259, 246, 'POWER', 'pd-xs') + t(395, 246, 'ANALOG IN', 'pd-xs');
    return svg(540, 340, s, 'Arduino UNO R3 pinout');
  }

  const BJT_NPN = [['C', 'collector'], ['B', 'base'], ['E', 'emitter']];
  const BJT_EBC = [['E', 'emitter'], ['B', 'base'], ['C', 'collector']];

  const PINOUTS = {
    breadboard:{ title:'Breadboard', draw:breadboard,
      note:'Highlighted holes are joined inside the board: each rail runs the full length, each 5-hole strip (a–e, f–j) is one connection, and the centre gap separates the two halves.' },
    led:{ title:'LED', draw:led,
      note:'Long leg = anode (+). Short leg and the flat edge of the rim = cathode (−).' },
    rgb:{ title:'RGB LED', draw:rgb,
      note:'Longest leg is common: to GND on a common-cathode LED, to +5V on a common-anode one. This is the usual leg order — confirm with your multimeter’s diode test.' },
    button:{ title:'Push button', draw:button,
      note:'Not sure which legs are which? Use two diagonally opposite legs — they are always on opposite sides of the switch.' },
    pot:{ title:'Potentiometer', draw:pot,
      note:'Knob facing you, legs down. The outer pins are the two ends of the track; the middle pin is the wiper.' },
    ecap:{ title:'Electrolytic capacitor', draw:ecap,
      note:'The stripe with − signs marks the negative leg, which is also the shorter one. Never fit it backwards.' },
    diode:{ title:'Diode', draw:diode,
      note:'Same marking on the 1N4148, 1N400x, 1N5819 and Zener diodes. A Zener is used “backwards”, with its cathode toward +.' },
    bc547:{ title:'BC547', draw:() => to92('BC547', BJT_NPN),
      note:'NPN. Flat face toward you, legs down: C, B, E.' },
    bc557:{ title:'BC557', draw:() => to92('BC557', BJT_NPN),
      note:'PNP. Same leg order as the BC547: C, B, E.' },
    pn2222:{ title:'PN2222A', draw:() => to92('PN2222A', BJT_EBC),
      note:'NPN, plastic TO-92: E, B, C — the reverse of the BC547. A metal-can 2N2222 has a different layout.' },
    pn2907:{ title:'PN2907A', draw:() => to92('PN2907A', BJT_EBC),
      note:'PNP, plastic TO-92: E, B, C — the reverse of the BC557.' },
    '2n7000':{ title:'2N7000', draw:() => to92('2N7000', [['S', 'source'], ['G', 'gate'], ['D', 'drain']]),
      note:'N-channel MOSFET. Flat face toward you, legs down: S, G, D.' },
    bs170:{ title:'BS170', draw:() => to92('BS170', [['D', 'drain'], ['G', 'gate'], ['S', 'source']]),
      note:'Reversed compared with the 2N7000: D, G, S. Swapping one for the other without rewiring is a classic mistake.' },
    irlz44n:{ title:'IRLZ44N', draw:() => to220('IRLZ44N', [['G', 'gate'], ['D', 'drain'], ['S', 'source']]),
      note:'Printed side facing you: G, D, S. The metal tab is connected to the drain.' },
    lm78xx:{ title:'LM7805 / 7812', draw:() => to220('LM7805', [['IN', 'input'], ['GND', 'ground'], ['OUT', 'output']]),
      note:'Printed side facing you: IN, GND, OUT. The tab is connected to GND. Same pinout for the LM7812.' },
    ne555:{ title:'NE555', draw:() => dip('NE555', ['GND', 'TRIG', 'OUT', 'RESET', 'CTRL', 'THRES', 'DISCH', 'VCC']),
      note:'Tie RESET (4) to VCC unless you use it, and put 10nF from CTRL (5) to GND for stable timing.' },
    lm358:{ title:'LM358', draw:() => dip('LM358', ['OUT A', 'IN− A', 'IN+ A', 'GND', 'IN+ B', 'IN− B', 'OUT B', 'VCC']),
      note:'Two op-amps in one package. For an unused half, connect IN+ B (5) to GND and IN− B (6) to OUT B (7).' },
    lm741:{ title:'LM741', draw:() => dip('LM741', ['OFFSET', 'IN−', 'IN+', 'V−', 'OFFSET', 'OUT', 'V+', 'NC']),
      note:'One op-amp. Leave the OFFSET pins unconnected unless you need to trim the offset. NC = not connected.' },
    'hc-quad':{ title:'74HC00/08/32/86', draw:() => dip('74HC00 / 08 / 32 / 86', ['1A', '1B', '1Y', '2A', '2B', '2Y', 'GND', '3Y', '3A', '3B', '4Y', '4A', '4B', 'VCC']),
      note:'NAND, AND, OR and XOR all share this pinout. Gate n has inputs nA and nB and output nY. Tie unused inputs to GND.' },
    hc04:{ title:'74HC04', draw:() => dip('74HC04', ['1A', '1Y', '2A', '2Y', '3A', '3Y', 'GND', '4Y', '4A', '5Y', '5A', '6Y', '6A', 'VCC']),
      note:'Six inverters: each output nY is the opposite of input nA. Tie unused inputs to GND.' },
    hc02:{ title:'74HC02', draw:() => dip('74HC02', ['1Y', '1A', '1B', '2Y', '2A', '2B', 'GND', '3A', '3B', '3Y', '4A', '4B', '4Y', 'VCC']),
      note:'NOR puts each output before its inputs on pins 1–6 — a different layout from the other gate chips.' },
    hc595:{ title:'74HC595', draw:() => dip('74HC595', ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'GND', 'Q7′', 'MR', 'SHCP', 'STCP', 'OE', 'DS', 'Q0', 'VCC']),
      note:'DS = serial data in, SHCP = shift clock, STCP = latch clock. Tie MR (10) to VCC and OE (13) to GND for normal use. Q7′ chains to the next chip.' },
    cd4017:{ title:'CD4017', draw:() => dip('CD4017', ['Q5', 'Q1', 'Q0', 'Q2', 'Q6', 'Q7', 'Q3', 'VSS', 'Q8', 'Q4', 'Q9', 'CO', 'CLK INH', 'CLK', 'RESET', 'VDD']),
      note:'Outputs are not in pin order — follow the labels. Tie CLK INH (13) and RESET (15) to GND to count.' },
    uno:{ title:'Arduino UNO R3', draw:uno,
      note:'Top view, USB on the left. ~ marks PWM pins. A4/A5 double as I2C SDA/SCL, and the same signals are repeated on the SDA/SCL pins by AREF.' },
    nano:{ title:'Arduino Nano', draw:nano,
      note:'Classic Nano (ATmega328P), top view with USB at the top. ~ marks PWM pins. A6 and A7 are analog inputs only. D0/D1 are shared with USB — keep them free while uploading.' },
    'esp32-devkit':{ title:'ESP32 DevKit V1', draw:esp32Devkit,
      note:'DOIT DevKit V1, 30-pin, top view with the antenna up. Numbers are the GPIO numbers used in code. Amber = boot (strapping) pins, grey italic = input only. 38-pin boards have a different order.' },
    pico:{ title:'Raspberry Pi Pico', draw:pico,
      note:'Top view, USB at the top. Small numbers are the physical pin numbers (1–40). Same layout on the Pico W.' },
    seg7:{ title:'7-segment', draw:seg7,
      note:'Common 10-pin layout (e.g. 5161AS), front view. Both COM pins are joined inside. Makers differ — confirm each segment with diode test first.' },
  };

  const cache = {};
  const draw = k => cache[k] || (cache[k] = PINOUTS[k].draw());

  // A pinout panel for one or more parts; several parts get a small tab switcher.
  function block(keys){
    keys = (keys || []).filter(k => PINOUTS[k]);
    if(!keys.length) return null;
    const wrap = document.createElement('div');
    wrap.className = 'pinouts';
    const tabs = keys.length > 1
      ? `<div class="seg sm" role="group" aria-label="Choose part">${keys.map((k, i) =>
          `<button type="button" class="${i ? '' : 'on'}" aria-pressed="${!i}" data-k="${k}">${PINOUTS[k].title}</button>`).join('')}</div>`
      : `<span class="pinname">${PINOUTS[keys[0]].title}</span>`;
    wrap.innerHTML = `<div class="pinhead"><span class="pinlabel">Pinout</span>${tabs}</div>` +
      keys.map((k, i) => `<figure class="pinfig" data-k="${k}"${i ? ' hidden' : ''}>${draw(k)}<figcaption>${PINOUTS[k].note}</figcaption></figure>`).join('');
    wrap.querySelectorAll('.seg button').forEach(btn => btn.addEventListener('click', () => {
      wrap.querySelectorAll('.seg button').forEach(b => {
        const on = b === btn;
        b.classList.toggle('on', on);
        b.setAttribute('aria-pressed', on);
      });
      wrap.querySelectorAll('.pinfig').forEach(f => { f.hidden = f.dataset.k !== btn.dataset.k; });
    }));
    return wrap;
  }

  return { block, PINOUTS };
})();
