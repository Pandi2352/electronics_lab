/* "Before Arduino" guide (guides.html): the electronics basics to learn before the Nano.
   Same block format as js/nano.js. No code — every project is a circuit you build and measure. */

const BASICS = {
  id:'basics',
  menu:'Before Arduino',
  icon:'bolt',
  blurb:'What to learn before you touch an Arduino Nano: voltage, current and Ohm’s law, the main components, the multimeter, the breadboard and reading schematics. Then 24 hands-on circuits in five levels — no code, just parts, a battery and your meter — so that when you reach the Nano you understand every wire.',
  keys:{ done:'lab-basics-guide', buy:'lab-basics-guide-buy' },
  sections:[
  { id:'start', short:'Start here', title:'Why start before Arduino?',
    blocks:[
      { p:'An Arduino only switches pins on and off and reads voltages. Everything around it — the LED, its resistor, the button, the sensor, the transistor that drives a motor — is plain electronics. If you learn that first, the code becomes the easy part, and you stop burning LEDs and pins.' },
      { flow:{ label:'Your full path', steps:['Before Arduino', 'Arduino Nano', 'Arduino UNO', 'ESP32 DevKit', 'IoT & your backend'] } },
      { flow:{ label:'Use this cycle for every project', steps:['Build', 'Measure', 'Understand', 'Break it', 'Fix it', 'Modify it'] } },
      { list:{ label:'By the end of this guide you can', items:[
        'Explain voltage, current, resistance and power, and use Ohm’s law without thinking.',
        'Calculate the resistor for any LED.',
        'Identify and use resistors, LEDs, diodes, capacitors, buttons, potentiometers, LDRs, transistors, MOSFETs, relays, regulators and the 555 timer.',
        'Build any simple circuit on a breadboard from a schematic.',
        'Measure voltage, current, resistance and continuity with a multimeter.',
        'Solder a small circuit on perfboard.',
      ] } },
      { note:['tip', 'Time needed: about 2–4 weeks at an hour a day. You don’t have to finish everything — Levels 1–3 are the minimum before the Nano.'] },
    ] },

  { id:'concepts', short:'Voltage, current, Ohm', title:'Voltage, current, resistance & power',
    blocks:[
      { cards:{ label:'The four big ideas', items:[
        ['Voltage (V, volts)', 'The “push” or pressure between two points. A battery has 1.5V, 9V…; an Arduino pin gives 5V. Always measured between two points.'],
        ['Current (I, amps)', 'How much charge flows per second. An LED needs about 10–20 mA (0.01–0.02A). Current flows only in a closed loop.'],
        ['Resistance (R, ohms Ω)', 'How much something opposes current. Resistors set the current for LEDs and make voltage dividers.'],
        ['Power (P, watts)', 'Energy per second = heat. A ¼W resistor gets hot and burns above 0.25W.'],
      ] } },
      { table:{ label:'The formulas you will use every day', head:['Formula', 'Use it to', 'Example'], rows:[
        ['V = I × R', 'Find the voltage across a resistor', '0.01A × 470Ω = 4.7V'],
        ['I = V ÷ R', 'Find the current', '9V ÷ 1000Ω = 0.009A = 9 mA'],
        ['R = V ÷ I', 'Find the resistor you need', '(5V − 2V) ÷ 0.015A = 200Ω → use 220Ω'],
        ['P = V × I', 'Find the power (heat)', '3V × 0.015A = 0.045W — fine for ¼W'],
        ['P = I² × R', 'Resistor heat from current', '0.1A² × 100Ω = 1W — needs a 2W resistor'],
      ] } },
      { note:['key', 'Water analogy: voltage is the water pressure, current is how much water flows, resistance is a narrow pipe. More pressure or a wider pipe = more flow.'] },
      { table:{ label:'Units you will meet', head:['Prefix', 'Means', 'Example'], rows:[
        ['m (milli)', '÷ 1,000', '20 mA = 0.02A'],
        ['µ (micro)', '÷ 1,000,000', '100 µF = 0.0001 F'],
        ['n (nano)', '÷ 1,000,000,000', '100 nF = 0.1 µF (code “104”)'],
        ['p (pico)', '÷ 1,000,000,000,000', '22 pF'],
        ['k (kilo)', '× 1,000', '4.7kΩ = 4,700Ω (written 4k7)'],
        ['M (mega)', '× 1,000,000', '1MΩ'],
      ] } },
    ] },

  { id:'circuits', short:'Circuit basics', title:'Circuit basics',
    blocks:[
      { table:{ head:['Idea', 'What it means', 'Why it matters'], rows:[
        ['Closed circuit', 'A complete loop from + back to −.', 'No loop, no current — the most common reason “nothing works”.'],
        ['Open circuit', 'The loop is broken (switch off, loose wire).', 'This is how switches and buttons work.'],
        ['Short circuit', '+ connected straight to − with nothing in between.', 'Huge current: hot wires, dead batteries, fires. Never do it.'],
        ['Ground (GND)', 'The 0V reference point everything is measured from.', 'Every part of a circuit must share the same GND.'],
        ['Series', 'Parts one after another: the same current flows through all.', 'Voltages add up; resistances add up.'],
        ['Parallel', 'Parts side by side: the same voltage across all.', 'Currents add up; each LED needs its own resistor.'],
        ['Voltage divider', 'Two resistors in series; the middle gives a fraction of the voltage.', 'How sensors like LDRs and potentiometers are read by an Arduino.'],
        ['DC vs AC', 'DC flows one way (batteries, USB). AC reverses (mains 230V).', 'Everything in this lab is low-voltage DC.'],
        ['Polarity', 'Some parts only work one way round.', 'LEDs, diodes, electrolytic capacitors, batteries, ICs.'],
      ] } },
      { pre:{ label:'Series and parallel', text:
`SERIES                       PARALLEL
+ ── R1 ── R2 ── −           + ──┬── R1 ──┬── −
                                 └── R2 ──┘
R total = R1 + R2            1/R total = 1/R1 + 1/R2
same current                 same voltage

VOLTAGE DIVIDER
+V ── R1 ──┬── R2 ── GND
           └──► Vout = V × R2 ÷ (R1 + R2)` } },
    ] },

  { id:'components', short:'Components', title:'The components you need to know',
    blocks:[
      { table:{ head:['Component', 'What it does', 'Watch out for'], rows:[
        ['Resistor', 'Limits current; makes voltage dividers.', 'Read the colour bands; check the power rating (usually ¼W).'],
        ['LED', 'Lights up when current flows the right way.', 'Always use a series resistor. Long leg = + (anode).'],
        ['Diode (1N4007)', 'Lets current flow one way only; drops about 0.7V.', 'The stripe is the − (cathode) side.'],
        ['Capacitor — ceramic', 'Small, stores a little charge; filters noise. No polarity.', 'Codes: 104 = 100nF, 103 = 10nF.'],
        ['Capacitor — electrolytic', 'Larger values (1–1000µF+); smooths power, timing.', 'Has polarity (stripe = −) and a voltage rating. Reversed ones can burst.'],
        ['Push button', 'Connects while pressed.', 'The 4 legs are two connected pairs — check with the meter.'],
        ['Slide / toggle switch', 'Stays on or off.', 'Check the current rating.'],
        ['Potentiometer', 'An adjustable resistor / voltage divider (3 legs).', 'Outer legs to + and −, middle leg is the output.'],
        ['LDR (photoresistor)', 'Resistance falls in light.', 'Use it in a voltage divider.'],
        ['Buzzer (active)', 'Beeps when powered.', 'Has polarity; passive buzzers need a changing signal.'],
        ['NPN transistor (BC547 / 2N2222)', 'A small current at the base switches a bigger current.', 'Always a base resistor (1k–10k). Pins: check the datasheet — they differ.'],
        ['MOSFET (IRLZ44N)', 'A voltage at the gate switches a big current: motors, LED strips.', 'Logic-level type for 5V; add a gate pull-down resistor.'],
        ['Relay', 'An electrically controlled switch — the coil moves a contact.', 'Needs a transistor and a flyback diode across the coil.'],
        ['Voltage regulator (7805)', 'Turns 7–20V into steady 5V.', 'Needs capacitors on input and output; gets hot with big drops.'],
        ['555 timer IC', 'Makes pulses and delays: flashers, tones, timers.', 'Pin 1 is next to the notch / dot.'],
        ['Battery', 'The energy source: 1.5V AA, 9V, 3.7V lithium.', 'Never short it. Lithium needs protection.'],
      ] } },
    ] },

  { id:'colour', short:'Resistor colour code', title:'Resistor colour code & the LED resistor',
    blocks:[
      { table:{ label:'Colour code (4-band resistors)', head:['Colour', 'Digit', 'Multiplier'], rows:[
        ['Black', '0', '× 1'],
        ['Brown', '1', '× 10'],
        ['Red', '2', '× 100'],
        ['Orange', '3', '× 1,000 (k)'],
        ['Yellow', '4', '× 10,000'],
        ['Green', '5', '× 100,000'],
        ['Blue', '6', '× 1,000,000 (M)'],
        ['Violet', '7', '—'],
        ['Grey', '8', '—'],
        ['White', '9', '—'],
        ['Gold (4th band)', '±5% tolerance', '× 0.1'],
        ['Silver (4th band)', '±10% tolerance', '× 0.01'],
      ] } },
      { table:{ label:'Resistors you will use most', head:['Value', 'Bands', 'Typical use'], rows:[
        ['220Ω', 'Red Red Brown', 'LED on 5V'],
        ['330Ω', 'Orange Orange Brown', 'LED on 5V (a bit dimmer)'],
        ['470Ω', 'Yellow Violet Brown', 'LED on 9V (bright), data lines'],
        ['1kΩ', 'Brown Black Red', 'LED on 9V, transistor base'],
        ['10kΩ', 'Brown Black Orange', 'Pull-up / pull-down, dividers'],
        ['100kΩ', 'Brown Black Yellow', 'Timing, high-value dividers'],
      ] } },
      { note:['key', 'LED resistor: R = (supply − LED voltage) ÷ current. LED voltage ≈ 2V for red / yellow / green and ≈ 3V for blue / white. Use 10–15 mA. Example: (9V − 2V) ÷ 0.01A = 700Ω → use 680Ω or 1kΩ.'] },
      { note:['tip', 'Not sure of the colours? Measure the resistor with the multimeter — that is faster and never wrong. The lab’s Tools tab also has a colour-code and LED-resistor calculator.'] },
    ] },

  { id:'tools', short:'Tools', title:'The tools you need',
    blocks:[
      { cards:{ items:[
        ['Digital multimeter', 'Your eyes inside the circuit. Measures volts, amps, ohms and continuity. The most important tool.'],
        ['Breadboard (830 points)', 'Build circuits without soldering.'],
        ['Jumper wires', 'Male-to-male for the breadboard; solid-core hookup wire is neater.'],
        ['Power', '9V battery with a clip, 2–4 × AA holder, or a breadboard power module (5V / 3.3V from USB or an adapter).'],
        ['Wire stripper & cutter', 'Clean wire ends without nicking the copper.'],
        ['Soldering iron kit', 'For Level 5 and every real project after it. A temperature-controlled 60W iron is ideal.'],
        ['Perfboard', 'Where finished circuits go after the breadboard.'],
        ['Component box', 'Keeps parts sorted — you will lose less time and fewer parts.'],
      ] } },
    ] },

  { id:'multimeter', short:'Using the multimeter', title:'Using the multimeter',
    blocks:[
      { table:{ head:['Measure', 'Dial setting', 'How to connect', 'Watch out'], rows:[
        ['DC voltage', 'V⎓ (20V range if manual)', 'In parallel: across the part, black on the lower side.', 'Safe for most mistakes.'],
        ['Current', 'A⎓ / mA — red lead moved to the mA socket', 'In series: break the circuit and put the meter in the gap.', 'Never across a battery — it blows the fuse (or the meter).'],
        ['Resistance', 'Ω', 'Across the part, power OFF.', 'Measure out of circuit for accurate readings.'],
        ['Continuity', '))) beep', 'Across two points, power OFF.', 'Great for checking wires, breadboard rows and solder joints.'],
        ['Diode / LED test', 'Diode symbol', 'Red on anode (+), black on cathode (−).', 'Shows the forward voltage; many meters make an LED glow faintly.'],
        ['Capacitance', 'F (if your meter has it)', 'Across the discharged capacitor.', 'Discharge large capacitors first.'],
      ] } },
      { note:['warn', 'After measuring current, move the red lead back to the V socket. Forgetting this is how most meter fuses die.'] },
    ] },

  { id:'breadboard', short:'Breadboard', title:'How a breadboard works',
    blocks:[
      { pre:{ text:
`  + ─────────────────────────────  ← power rail: whole row connected
  − ─────────────────────────────  ← ground rail (some boards split halfway!)

    a b c d e     f g h i j
 1  ● ● ● ● ●     ● ● ● ● ●     each numbered row of 5 (a–e) is
 2  ● ● ● ● ●     ● ● ● ● ●     connected; f–j is a separate group
 3  ● ● ● ● ●  ║  ● ● ● ● ●
 4  ● ● ● ● ●  ║  ● ● ● ● ●     ║ the centre gap: ICs and buttons
 5  ● ● ● ● ●     ● ● ● ● ●       sit across it

  + ─────────────────────────────
  − ─────────────────────────────` } },
      { list:{ label:'Tips', items:[
        'Red wires for +, black for GND — always. It makes mistakes easy to spot.',
        'Check whether your rails are split in the middle with continuity mode.',
        'Never put both legs of a part in the same numbered row — it is shorted.',
        'Put buttons and ICs across the centre gap.',
        'Keep leads short and flat; messy boards hide mistakes.',
        'Build one piece, test it, then add the next.',
      ] } },
    ] },

  { id:'schematics', short:'Reading schematics', title:'Reading schematics',
    blocks:[
      { table:{ head:['Symbol', 'Looks like', 'Part'], rows:[
        ['─/\\/\\/─ or ─▭─', 'Zig-zag or box', 'Resistor'],
        ['─▷|─ with arrows out', 'Triangle, bar and arrows', 'LED (bar = cathode −)'],
        ['─▷|─', 'Triangle and bar', 'Diode'],
        ['─| |─', 'Two equal plates', 'Capacitor (ceramic)'],
        ['─| (─ with +', 'One curved plate', 'Electrolytic capacitor'],
        ['─|‖─ long / short lines', 'Long line = +', 'Battery'],
        ['─o o─ with a bar', 'A lifting contact', 'Push button / switch'],
        ['Resistor with an arrow', 'Arrow into the middle', 'Potentiometer'],
        ['Circle with B, C, E', 'Arrow on the emitter', 'Transistor (arrow out = NPN)'],
        ['⏚ / ▽', 'Stacked lines or triangle', 'Ground (GND)'],
        ['Dot where lines cross', 'A filled dot', 'The wires are connected (no dot = not connected)'],
      ] } },
      { note:['tip', 'A schematic shows connections, not positions. Build it by following one wire at a time and ticking it off on paper.'] },
    ] },

  { id:'path', short:'Project path (24)', title:'Project path — basic to advanced (no code)',
    blocks:[
      { p:'24 circuits in five levels. Every one uses only components, a power source and your multimeter. Tick each one when you have built it, measured it and understood it. The lab’s Exercises tab has 20 more breadboard exercises for extra practice.' },
      { projects:true },
    ] },

  { id:'starters', short:'First 5 projects', title:'The 5 circuits to start with',
    blocks:[
      { p:'Each one has a circuit, what it teaches, and exactly what to measure.' },
      { starters:true },
    ] },

  { id:'sequence', short:'First 10 sequence', title:'Your first 10 circuits',
    blocks:[
      { p:'The order to follow from the projects above.' },
      { sequence:true },
    ] },

  { id:'ready', short:'Ready for the Nano?', title:'Ready for the Arduino Nano?',
    blocks:[
      { list:{ label:'You are ready when you can', items:[
        'Calculate an LED resistor in your head.',
        'Build a circuit from a schematic without help.',
        'Measure voltage and current in a circuit, and explain the numbers.',
        'Explain why a button needs a pull-up or pull-down resistor.',
        'Explain why a motor needs a transistor or MOSFET and a flyback diode.',
        'Read a voltage divider and predict its output.',
        'Find a fault with the multimeter instead of guessing.',
      ] } },
      { table:{ label:'How it carries over to the Nano', head:['You learned', 'On the Nano it becomes'], rows:[
        ['LED + resistor', 'digitalWrite() on a pin — the same 220Ω resistor'],
        ['Button + pull-down resistor', 'digitalRead() with INPUT_PULLUP'],
        ['Potentiometer / LDR divider', 'analogRead() — 0–1023 for 0–5V'],
        ['555 flasher', 'delay() and millis()'],
        ['Transistor / MOSFET switch', 'A pin driving motors, relays and LED strips'],
        ['7805 regulator', 'The Nano’s VIN pin and its on-board regulator'],
        ['Capacitor smoothing', 'Stable power for sensors and servos'],
      ] } },
      { note:['key', 'Next: open the Arduino Nano menu and start with its Project 1.'] },
    ] },

  { id:'mistakes', short:'Safety & mistakes', title:'Safety & common mistakes',
    blocks:[
      { table:{ head:['Mistake', 'What happens', 'Do this instead'], rows:[
        ['LED without a resistor', 'It flashes brightly once and dies.', 'Always a series resistor.'],
        ['Shorting the battery', 'Hot wires, a dead battery, burns.', 'Check for shorts with continuity before powering up.'],
        ['Meter on current across a supply', 'The meter fuse blows.', 'Current is measured in series only.'],
        ['Electrolytic capacitor reversed', 'It heats up and can burst.', 'Stripe to −; eye protection when experimenting.'],
        ['Relay or motor without a flyback diode', 'Voltage spikes kill the transistor.', 'Diode across the coil, stripe to +.'],
        ['Transistor without a base resistor', 'The transistor (or later, the Arduino pin) burns.', '1k–10k in the base.'],
        ['Parts in the same breadboard row', 'The part is shorted out.', 'Legs in different rows.'],
        ['Forgetting a common GND', 'Circuits behave randomly.', 'Connect all grounds together.'],
        ['Touching a hot soldering iron / resistor', 'Burns.', 'Use a stand; touch parts with the back of a finger first.'],
      ] } },
      { note:['warn', 'Never work on mains (230V) wiring. Everything here uses batteries or low-voltage adapters. Charge lithium cells only with proper chargers, and solder in a ventilated place.'] },
    ] },

  { id:'buy', short:'Buy list', title:'Buy list for the basics',
    blocks:[
      { p:'Everything the 24 circuits need, with estimated prices in Indian rupees. Most of these parts are reused in the Nano, UNO and ESP32 guides — this is the foundation of your parts box.' },
      { buy:true },
    ] },
  ],

  levels:[
    { n:1, title:'Level 1 — First circuits', projects:[
      [1, 'LED + resistor on a battery', 'Closed circuits, polarity, the LED resistor', '9V battery, 1kΩ, LED'],
      [2, 'LED with a push button', 'Switches, open vs closed circuits', 'Button, LED, 1kΩ'],
      [3, 'Series vs parallel LEDs', 'How current and voltage split', '3 LEDs, resistors'],
      [4, 'Ohm’s law with your meter', 'Measure V and I, calculate R', 'Resistors, multimeter'],
      [5, 'Voltage divider', 'Predicting a voltage with two resistors', '10kΩ, 4.7kΩ, 1kΩ'],
    ] },
    { n:2, title:'Level 2 — Components in action', projects:[
      [6, 'Potentiometer dimmer', 'Variable resistance', '10k pot, 220Ω, LED'],
      [7, 'Capacitor fade-out', 'Charging, discharging, time constant', '470–1000µF, LED, resistors'],
      [8, 'Reverse-polarity protection', 'Diodes and their 0.7V drop', '1N4007, LED'],
      [9, 'Buzzer alarm with a switch', 'Active buzzers, loads', 'Active buzzer, switch'],
      [10, 'RGB colour mixing', 'Three LEDs in one, common cathode', 'RGB LED, resistors, buttons'],
    ] },
    { n:3, title:'Level 3 — Transistors & switching', projects:[
      [11, 'Transistor as a switch', 'Base current, gain, saturation', 'BC547, 10kΩ, 470Ω, LED'],
      [12, 'Dark-activated night light', 'LDR divider into a transistor', 'LDR, BC547, pot, LED'],
      [13, 'Touch switch', 'Darlington pair, very high gain', '2 × BC547, LED'],
      [14, 'Relay with a flyback diode', 'Coils, back-EMF, isolation', '5V relay, BC547, 1N4007'],
      [15, 'MOSFET motor switch', 'Switching big currents', 'IRLZ44N, DC motor, 1N4007'],
    ] },
    { n:4, title:'Level 4 — Power & timing', projects:[
      [16, 'Regulated 5V supply', '7805, input / output capacitors, heat', '7805, 9V battery, capacitors'],
      [17, '555 LED flasher', 'Astable mode, R and C set the speed', 'NE555, resistors, 10µF'],
      [18, '555 delay timer', 'Monostable mode: a button starts a timed ON', 'NE555, 100µF, button'],
      [19, 'Two-transistor flasher', 'Astable multivibrator without an IC', '2 × BC547, 2 × 47µF, LEDs'],
      [20, 'Motor speed with a potentiometer', 'Transistor as a variable driver', 'Pot, transistor / MOSFET, motor'],
    ] },
    { n:5, title:'Level 5 — Logic, ICs & soldering', projects:[
      [21, 'Logic gates with buttons', 'AND / OR, truth tables — the idea behind code', '74HC08, 74HC32, buttons, LEDs'],
      [22, 'LED chaser', '555 clock + CD4017 counter', 'NE555, CD4017, 10 LEDs'],
      [23, 'Continuity tester', 'A useful tool you build yourself', 'Buzzer, BC547, probes'],
      [24, 'Solder it on perfboard', 'Soldering, layout, a finished circuit', 'Perfboard, the 555 flasher parts'],
    ] },
  ],

  sequence:['LED + resistor on a battery', 'LED with a push button', 'Ohm’s law with your meter', 'Series vs parallel LEDs', 'Voltage divider',
    'Potentiometer dimmer', 'Capacitor fade-out', 'Transistor as a switch', 'Dark-activated night light', '555 LED flasher'],

  starters:[
    { n:1, title:'LED + resistor on a battery', goal:'Your first complete circuit — and the LED resistor rule.',
      diagram:
`9V + ── 1kΩ ── LED (long leg +) ── 9V −

R = (9V − 2V) ÷ 0.007A ≈ 1kΩ  →  about 7 mA`,
      learn:['Closed loop', 'LED polarity', 'Choosing a resistor', 'Kirchhoff: voltages add up'],
      measure:[
        'Battery voltage (about 9V; a used one reads 7.5–8.5V).',
        'Voltage across the resistor and across the LED — they add up to the battery voltage.',
        'Current in series with the meter on mA: about 7 mA.',
        'Swap 1kΩ for 470Ω and 4.7kΩ: note the brightness and the current.',
      ],
      noteTip:'Flip the LED round: it goes out. That is polarity.' },
    { n:2, title:'Ohm’s law with your meter', goal:'Prove V = I × R with your own numbers.',
      diagram:
`5V (or 9V) + ── [mA meter] ── R ── −

Try R = 1kΩ, 2.2kΩ, 4.7kΩ, 10kΩ`,
      learn:['Measuring resistance', 'Measuring current in series', 'Checking a formula'],
      rules:[
        ['1kΩ at 9V', 'expect ≈ 9 mA', '#2f9e44'],
        ['2.2kΩ at 9V', 'expect ≈ 4.1 mA', '#2f9e44'],
        ['4.7kΩ at 9V', 'expect ≈ 1.9 mA', '#e8a100'],
        ['10kΩ at 9V', 'expect ≈ 0.9 mA', '#e03131'],
      ],
      measure:[
        'Each resistor out of circuit (Ω) — compare with its colour bands.',
        'The real supply voltage.',
        'The current for each resistor, then calculate V ÷ R and compare.',
      ] },
    { n:3, title:'Voltage divider', goal:'Predict a voltage, then measure it — the basis of every analog sensor.',
      diagram:
`9V + ── R1 ──┬── R2 ── GND
             └──► Vout (measure here to GND)

Vout = 9V × R2 ÷ (R1 + R2)`,
      learn:['Voltage dividers', 'Ratios', 'Why sensors use them'],
      rules:[
        ['R1 10k, R2 10k', '≈ 4.5V (half)', '#2f9e44'],
        ['R1 10k, R2 4.7k', '≈ 2.9V', '#2f9e44'],
        ['R1 1k, R2 2k', '≈ 6V (two-thirds)', '#2f9e44'],
        ['R1 LDR, R2 10k', 'changes with light', '#e8a100'],
      ],
      measure:['Vout for each pair — compare with your calculation.', 'Vout with an LDR as R1 in light and in dark.'],
      noteKey:'This exact circuit is how you will read LDRs, thermistors and potentiometers with analogRead() on the Nano — and how you will bring 5V down to 3.3V for the ESP32.' },
    { n:4, title:'Transistor as a switch', goal:'Control a load with a tiny base current.',
      diagram:
`9V + ── 470Ω ── LED ── C
                        BC547   (flat side facing you: C B E)
button ── 10kΩ ──────── B
9V + ── button          E ── GND`,
      diagramNote:'Check your transistor’s pin order in its datasheet — BC547 and 2N2222 are different.',
      learn:['Base current', 'Saturation', 'Why an Arduino pin needs a transistor for big loads'],
      measure:[
        'Voltage from base to emitter when on: about 0.65V.',
        'Voltage from collector to emitter when on: about 0.1–0.2V (saturated).',
        'Base current (≈ 0.8 mA) vs collector current (≈ 15 mA) — a small current controls a big one.',
      ],
      noteTip:'Now replace the button with an LDR divider and you have Project 12, the night light.' },
    { n:5, title:'555 LED flasher', goal:'Your first IC: a blinking LED with no code.',
      diagram:
`              NE555 (notch at the top)
              ┌─────────┐
      GND ─── │1       8│ ─── 9V
 pins 2+6 ─── │2       7│ ─── R1 10k to 9V,  R2 47k to pins 2+6
470Ω + LED ── │3       6│ ─── joined to pin 2
       9V ─── │4       5│ ─── 10nF to GND
              └─────────┘

C 10µF (+ side) from pins 2+6 to GND
LED: pin 3 ── 470Ω ── LED ── GND`,
      diagramNote:'f ≈ 1.44 ÷ ((R1 + 2 × R2) × C) = 1.44 ÷ (104kΩ × 10µF) ≈ 1.4 flashes per second.',
      learn:['Reading IC pinouts', 'RC timing', 'Astable oscillators'],
      behaviour:[['Capacitor charges to ⅔ V', 'Output LOW', 'Capacitor discharges to ⅓ V', 'Output HIGH', 'Repeat']],
      measure:[
        'Pin 3 voltage switching between about 0V and 8V.',
        'The capacitor voltage slowly rising and falling between about 3V and 6V.',
        'Change C to 100µF: the flashing is 10 × slower. Change R2 to 10k: faster.',
      ] },
  ],

  buy:{
    groups:[
      { title:'Power & breadboard', items:[
        ['Full-size breadboard (830-point)', 1, 90, 150, '1–23'],
        ['Male-to-male jumper wires (pack of 40)', 1, 60, 100, '1–23'],
        ['9V battery', 2, 30, 60, '1–23'],
        ['9V battery clip with leads', 2, 5, 10, '1–23'],
        ['Breadboard power supply module (5V / 3.3V)', 1, 60, 100, '2, 4, 21, 22', 'Clean 5V for logic ICs (74HC need 2–6V).'],
      ] },
      { title:'Passive parts', items:[
        ['Resistor kit (600 pcs, 30 values, ¼W)', 1, 150, 300, '1–24'],
        ['5mm LEDs, mixed colours (pack of 50)', 1, 60, 120, '1–24'],
        ['RGB LED (common cathode)', 2, 5, 10, '10'],
        ['10kΩ potentiometer', 3, 10, 20, '6, 12, 20'],
        ['LDR (photoresistor)', 5, 3, 6, '5, 12'],
        ['Electrolytic capacitor kit', 1, 100, 200, '7, 16–19'],
        ['Ceramic capacitor kit', 1, 100, 200, '16, 17, 22'],
      ] },
      { title:'Switches & outputs', items:[
        ['6×6mm push buttons', 10, 1, 3, '2, 10, 11, 18, 21'],
        ['Slide switch', 2, 5, 10, '9, 16'],
        ['Active buzzer', 2, 10, 20, '9, 23'],
        ['Small DC motor (3–6V)', 1, 20, 40, '15, 20'],
        ['5V relay (bare)', 1, 20, 40, '14'],
      ] },
      { title:'Semiconductors & ICs', items:[
        ['1N4007 diodes', 10, 1, 2, '8, 14, 15'],
        ['BC547 NPN transistors', 10, 1, 3, '11–14, 19, 20, 23'],
        ['IRLZ44N logic-level MOSFET', 2, 25, 50, '15, 20'],
        ['7805 5V regulator', 2, 8, 15, '16'],
        ['NE555 timer IC', 5, 5, 10, '17, 18, 22, 24'],
        ['CD4017 decade counter', 2, 10, 20, '22'],
        ['74HC08 (AND) + 74HC32 (OR)', 2, 15, 30, '21'],
      ] },
      { title:'Tools', items:[
        ['Digital multimeter', 1, 300, 800, '1–24', 'You already own one — ticked.'],
        ['Wire stripper / cutter', 1, 100, 250, '1–24'],
        ['Solid-core hookup wire set', 1, 150, 300, '1–24'],
        ['Soldering iron kit (iron, solder, stand, wick)', 1, 400, 900, '24'],
        ['Perfboard / dot board', 2, 20, 40, '24'],
      ] },
    ],
    owned:['Digital multimeter'],
    extras:[
      { title:'Extras', note:'Not required, but they make learning easier.', items:[
        ['Component tester (LCR-T4 type)', 1, 350, 600, 'Identifies transistors, their pins, capacitors and more in one click.', true],
        ['Component organiser box', 1, 150, 300, 'Sorted parts save hours.'],
        ['Helping hands with magnifier', 1, 200, 400, 'Holds boards and wires while you solder.'],
        ['Crocodile clip leads (pack of 10)', 1, 60, 120, 'Hands-free meter and battery connections.'],
        ['Adjustable bench power supply (0–30V, 5A)', 1, 2500, 5000, 'Set any voltage, limit the current — no more blown parts.'],
        ['Book: “Make: Electronics” (Charles Platt)', 1, 600, 900, 'The classic learn-by-discovery book for exactly this stage.'],
      ] },
    ],
    tips:[
      'Prices are estimates — they vary a lot by seller and quality. Check before you order.',
      'Buy kits (resistors, capacitors) instead of single values — much cheaper per part.',
      'Almost everything here is reused in the Nano, UNO and ESP32 guides — tick what you already have from the Starter kit page.',
      'The component tester pays for itself: no more guessing transistor pins.',
    ],
  },
};
