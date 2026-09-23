/* Shopping-list categories and component guide content. */


const CATS = [
{id:'A',icon:'🧩',title:'Breadboard & Wiring',phase:'now',
 note:'Foundation gear — get a board with clear +/− rails and a center gap.',
 items:[['Full-size solderless breadboard','2–3'],['Mini breadboard','1–2'],
 ['Male-to-male Dupont wires','1 set'],['Male-to-female Dupont wires','1 set'],
 ['Female-to-female Dupont wires','1 set'],['Solid-core hookup wire','1 set'],
 ['Breadboard power supply module','1'],['IC DIP adapter/socket set','1'],
 ['2-pin screw terminal','10'],['3-pin screw terminal','10']]},

{id:'B',icon:'🎨',title:'Resistors',phase:'now',
 note:'VERY IMPORTANT. Get a ¼W assortment, preferably 1% metal-film. 5–10pcs of each value — check any assortment actually includes these.',
 items:[['10Ω','5–10'],['22Ω','5–10'],['47Ω','5–10'],['100Ω','5–10'],['150Ω','5–10'],
 ['220Ω','5–10'],['330Ω','5–10'],['470Ω','5–10'],['680Ω','5–10'],['1kΩ','5–10'],
 ['2.2kΩ','5–10'],['3.3kΩ','5–10'],['4.7kΩ','5–10'],['10kΩ','5–10'],['22kΩ','5–10'],
 ['33kΩ','5–10'],['47kΩ','5–10'],['100kΩ','5–10'],['220kΩ','5–10'],['330kΩ','5–10'],
 ['470kΩ','5–10'],['1MΩ','5–10'],['2.2MΩ','5–10']]},

{id:'C',icon:'💡',title:'LEDs',phase:'now',
 note:'You will use LEDs constantly in stage one.',
 items:[['Red 5mm LED','5–10'],['Green 5mm LED','5–10'],['Yellow 5mm LED','5–10'],
 ['Blue 5mm LED','5–10'],['White 5mm LED','5–10'],['RGB LED — common cathode','2–3'],
 ['RGB LED — common anode','2–3'],['3mm LEDs (mixed)','10']]},

{id:'D',icon:'🔘',title:'Push Buttons & Switches',phase:'now',
 note:'Learn: normally open/closed, SPST, SPDT, pull-up, pull-down.',
 items:[['6×6mm tactile push button','10–20'],['SPST switch','5'],['SPDT switch','3'],
 ['DIP switch','1 set']]},

{id:'E',icon:'🎚️',title:'Potentiometers',phase:'now',
 note:'Preferably linear (B-type). Also grab a few knobs to make them usable.',
 items:[['1kΩ potentiometer','2–3'],['10kΩ potentiometer','2–3'],
 ['50kΩ potentiometer','2–3'],['100kΩ potentiometer','2–3'],['Potentiometer knobs','5+']]},

{id:'F',icon:'🔋',title:'Capacitors',phase:'now',
 note:'Watch voltage rating & polarity on every electrolytic capacitor.',
 items:[['Ceramic 100pF–1µF assortment','5–10 each'],
 ['Electrolytic 1µF','5–10'],['Electrolytic 2.2µF','5–10'],['Electrolytic 4.7µF','5–10'],
 ['Electrolytic 10µF','5–10'],['Electrolytic 22µF','5–10'],['Electrolytic 47µF','5–10'],
 ['Electrolytic 100µF','5–10'],['Electrolytic 220µF','5–10'],['Electrolytic 470µF','5'],
 ['Electrolytic 1000µF','5']]},

{id:'G',icon:'⚡',title:'Diodes',phase:'now',
 note:'Learn: forward/reverse bias, forward voltage, rectification, protection, regulation.',
 items:[['1N4148 signal diode','10+'],['1N4001–1N4007 rectifier','10+'],
 ['1N5819 Schottky diode','5+'],['Zener 3.3V','5'],['Zener 5.1V','5'],
 ['Zener 9.1V','5'],['Zener 12V','5']]},

{id:'H',icon:'🔺',title:'Transistors',phase:'now',
 note:'Don\'t buy dozens of types yet — these two pairs cover almost everything early on.',
 items:[['BC547 (NPN)','10'],['2N2222 / PN2222 (NPN)','10'],
 ['BC557 (PNP)','5'],['2N2907 (PNP)','5']]},

{id:'I',icon:'🔻',title:'MOSFETs',phase:'now',
 note:'2N7000 is convenient for small breadboard work; IRLZ44N unlocks higher-current switching later.',
 items:[['2N7000 (N-channel)','5'],['BS170 (N-channel)','5'],
 ['IRLZ44N (N-channel, logic-level)','2–3'],['Small P-channel MOSFET','3–5']]},

{id:'J',icon:'🌡️',title:'Light & Temperature Sensors',phase:'now',
 note:'Discrete parts instead of ready-made sensor modules — build your own sensor circuits.',
 items:[['LDR (light-dependent resistor)','5'],['NTC 10k thermistor','5'],
 ['PTC thermistor','2–3'],['Photodiode','5'],['IR LED','5']]},

{id:'K',icon:'🔊',title:'Buzzers & Sound',phase:'now',
 note:'Compare a self-oscillating active buzzer against a passive piezo driven by a signal.',
 items:[['5V active buzzer','2–3'],['Passive piezo buzzer','2–3'],['Small speaker','1']]},

{id:'L',icon:'🧠',title:'ICs (Timers, Op-Amps, Logic)',phase:'now',
 note:'Use DIP packages — far easier on a breadboard than SMD.',
 items:[['NE555 / LM555 timer','5'],['LM358 op-amp','3'],['LM741 op-amp','2'],
 ['74HC00 (NAND)','2–3'],['74HC02 (NOR)','2–3'],['74HC04 (NOT)','2–3'],
 ['74HC08 (AND)','2–3'],['74HC32 (OR)','2–3'],['74HC86 (XOR)','2–3'],
 ['74HC595 shift register','2'],['CD4017 decade counter','2'],
 ['LM7805 5V regulator','3'],['LM7812 12V regulator','2']]},

{id:'M',icon:'🔢',title:'Displays',phase:'now',
 note:'Learn how raw displays work before jumping to OLED/LCD modules.',
 items:[['7-segment display — common cathode','2'],['7-segment display — common anode','2'],
 ['8×8 LED matrix','1']]},

{id:'N',icon:'🧲',title:'Relays',phase:'later',
 note:'Stick to low-voltage DC loads while learning — no mains AC yet.',
 items:[['5V relay','2'],['12V relay','2'],['Relay socket','2']]},

{id:'O',icon:'⚙️',title:'Motors & Actuators',phase:'later',
 note:'Never wire a motor straight to a GPIO — learn transistor/MOSFET/driver circuits first.',
 items:[['Small 3–6V DC motor','2'],['Small geared DC motor','1–2'],['Small stepper motor','1']]},

{id:'P',icon:'🔌',title:'Power Components',phase:'now',
 note:'Since you already have lithium cells, get a proper protected charging/power solution rather than experimenting with bare cells.',
 items:[['5V DC regulated adapter','1'],['9V DC adapter','1'],['12V DC adapter','1'],
 ['2×AA battery holder','1'],['4×AA battery holder','1'],['DC barrel jack connectors','1 set'],
 ['DC terminal connectors','1 set'],['9V battery clip','2'],['On/off switch','5'],
 ['Protected Li-ion charger/module (e.g. TP4056 with protection)','1']]},

{id:'Q',icon:'📏',title:'Measurement & Testing',phase:'now',
 note:'Multimeter + breadboard is enough for your first 30 exercises. Oscilloscope/bench supply can wait.',
 items:[['Digital multimeter (already owned)','—'],['Test leads','1 set'],
 ['Alligator clip leads','10'],['Breadboard test leads','1 set'],
 ['USB power meter','1'],['Component tester (LCR-T4/M328, later)','1 — later'],
 ['Logic analyzer','later'],['Oscilloscope','later'],['Bench DC power supply','later']]},

{id:'R',icon:'🛠️',title:'Soldering & Tools',phase:'later',
 note:'Not needed immediately, but essential for the long-term lab.',
 items:[['Temperature-controlled soldering iron','1'],['Solder','1 roll'],['Flux','1'],
 ['Desoldering pump','1'],['Solder wick','1'],['Wire stripper','1'],['Flush cutter','1'],
 ['Needle-nose pliers','1'],['Precision screwdriver set','1'],['Tweezers','1 set'],
 ['Heat-shrink tubing assortment','1'],['Heat gun','1'],['Helping-hands / PCB holder','1'],
 ['Anti-static mat & wrist strap','1'],['Safety glasses','1']]},

{id:'S',icon:'🧷',title:'Connectors & Misc',phase:'later',
 note:'Surprisingly useful once you start building anything semi-permanent.',
 items:[['Dupont connector housings','1 set'],['Male header pins','1 strip'],
 ['Female header pins','1 strip'],['Breakaway header strips','1 set'],
 ['2-pin JST connector','5'],['3-pin JST connector','5'],['4-pin JST connector','5'],
 ['Terminal blocks','5'],['Hookup wire (extra spools)','1 set'],['Heat-shrink tubing','1 set'],
 ['Cable ties','1 pack'],['Small project boxes','2–3'],['Crimping tool (for JST/Dupont)','1']]},

{id:'T',icon:'🧱',title:'IC Support Components',phase:'now',
 note:'Protect your ICs and make swapping them on the breadboard painless.',
 items:[['8-pin DIP socket','5'],['14-pin DIP socket','5'],['16-pin DIP socket','5'],
 ['18-pin DIP socket','2']]},

{id:'U',icon:'🧪',title:'Advanced Semiconductors',phase:'later',
 note:'Not needed for the first 30 exercises — useful once you explore power/control circuits.',
 items:[['Phototransistor','5'],['SCR (thyristor)','3'],['TRIAC','3'],
 ['Small bridge rectifier','3'],['PC817 optocoupler (4-pin)','5'],
 ['Small-signal transistor assortment','1 kit']]},

{id:'V',icon:'📦',title:'Storage & Organization',phase:'now',
 note:'Not on the original list but you will need it fast: a resistor kit alone is 23 compartments.',
 items:[['Component storage organizer box (adjustable compartments)','2–3'],
 ['Small parts bags / bins','1 pack'],['Label stickers or printed labels','1 set']]},

{id:'W',icon:'🚀',title:'Arduino / IoT — Next Phase Only',phase:'later',
 note:'You already own an Arduino UNO, LEDs, resistors, breadboard, jumper wires, servos, Li-ion batteries + holder, a multimeter and some sensors — don\'t duplicate these. Everything below belongs to the NEXT phase.',
 items:[['ESP32 DevKit','1'],['OLED display module','1'],['DHT22 temp/humidity module','1'],
 ['HC-SR04 ultrasonic module','1'],['PIR motion sensor','1'],['MPU6050 IMU module','1'],
 ['RFID reader/tag module','1'],['GPS module','later'],['LoRa module','later'],
 ['Wi-Fi/Bluetooth module','later']]},
];

const LEARN = [
{cat:'A',name:'Breadboard',img:'img/components/breadboard.jpg',role:'Prototyping platform — no soldering',
 text:'A grid of spring clips under plastic holes. The top and bottom rows (rails) are power (+) and ground (−); the middle rows are grouped in short vertical strips of 5, split by a center gap so ICs can straddle it.',
 spec:'Look for: clearly marked rails, a firm backing, and a visible center gap.',
 pins:['breadboard']},
{cat:'A',name:'Dupont Wires',img:'img/components/dupont-wires.jpg',role:'Flexible point-to-point connections',
 text:'Pre-terminated jumper wires. Male-to-male connects breadboard to breadboard; male-to-female connects a board pin to a module header; female-to-female links two header pins directly.',
 spec:'Buy all three types — you will need each within your first week.'},

{cat:'B',name:'Resistor',img:'img/components/resistor.jpg',role:'Limits current flow',
 text:'The single most-used part in electronics. It converts excess electrical energy into heat, protecting LEDs and other parts from too much current. Color bands encode its value in ohms (Ω).',
 spec:'Ohm\'s Law: V = I × R — this is the formula you\'ll use constantly to pick a resistor value.'},

{cat:'C',name:'LED',img:'img/components/led.jpg',role:'Light-emitting diode',
 text:'A diode that emits light when current flows the correct direction through it. It only conducts one way and needs a current-limiting resistor in series, or it burns out instantly.',
 spec:'Longer leg = anode (+). Always pair with a resistor sized for your supply voltage.',
 pins:['led']},
{cat:'C',name:'RGB LED',img:'img/components/rgb-led.jpg',role:'Three LEDs in one package',
 text:'Contains a red, green and blue die sharing either one common cathode (−) or one common anode (+). Mixing the three at different brightnesses produces any color.',
 spec:'Each color channel still needs its own resistor.',
 pins:['rgb']},

{cat:'D',name:'Tactile Push Button',img:'img/components/push-button.jpg',role:'Momentary switch',
 text:'Closes a circuit only while pressed, then springs back open. The 4-leg version has two internally-shorted pairs, so orientation on the breadboard matters.',
 spec:'Pair with a pull-up or pull-down resistor so the input has a defined state when not pressed.',
 pins:['button']},
{cat:'D',name:'SPST / SPDT Switches',img:'img/components/switches.jpg',role:'Maintained on/off or A/B selection',
 text:'SPST (Single Pole, Single Throw) is a plain on/off switch. SPDT (Single Pole, Double Throw) connects one common pin to either of two outputs — useful for routing a signal one of two ways.',
 spec:'DIP switches pack several SPST switches into one small block for configuration settings.'},
{cat:'D',name:'Pull-up / Pull-down',img:'img/components/pullup-pulldown.jpg',role:'Concept, not a part',
 text:'A resistor connecting an input pin to +V (pull-up) or GND (pull-down) so the pin reads a solid HIGH or LOW when a button isn\'t pressed, instead of "floating" and picking up noise.',
 spec:'Most microcontroller pins have internal pull-ups you can enable in software too.'},

{cat:'E',name:'Potentiometer',img:'img/components/potentiometer.jpg',role:'Variable resistor (3-terminal)',
 text:'A resistive track with a wiper that slides along it. Used as a voltage divider (volume knobs, sensors) or, with only two pins used, as a variable resistor (rheostat).',
 spec:'Linear (B-type) changes evenly with rotation — best for learning and most sensor/voltage work.',
 pins:['pot']},

{cat:'F',name:'Ceramic Capacitor',img:'img/components/ceramic-cap.jpg',role:'Small-value, fast, non-polarized',
 text:'Stores a small electric charge and releases it quickly. Used for high-frequency filtering, decoupling noisy power rails, and timing circuits. No polarity — install either way.',
 spec:'Values from picofarads (pF) to about 1µF are typical for ceramics.'},
{cat:'F',name:'Electrolytic Capacitor',img:'img/components/electrolytic-cap.jpg',role:'Large-value, polarized',
 text:'Stores much more charge than a ceramic cap, used for power smoothing and slower timing. It IS polarized — the stripe marks the negative leg, and reversing it can cause it to fail or even vent.',
 spec:'Always check both the µF value and the voltage rating printed on the case.',
 pins:['ecap']},

{cat:'G',name:'Signal Diode (1N4148)',img:'img/components/signal-diode.jpg',role:'Fast, low-current one-way valve',
 text:'Lets current flow in one direction (anode → cathode) only. Used for logic-level clamping, signal steering, and small rectification tasks.',
 spec:'Marked by a stripe on the cathode (−) end.',
 pins:['diode']},
{cat:'G',name:'Rectifier Diode (1N4001–07)',img:'img/components/rectifier-diode.jpg',role:'Converts AC to pulsing DC',
 text:'A beefier diode built for higher current. Used in power supplies to only let current through in one direction, and to protect circuits from reverse-connected batteries.',
 spec:'The higher the number (4001→4007), the higher the reverse voltage it can block.',
 pins:['diode']},
{cat:'G',name:'Schottky Diode (1N5819)',img:'img/components/schottky-diode.jpg',role:'Low forward-voltage-drop diode',
 text:'Drops less voltage than a standard diode and switches faster, so it wastes less energy. Common in reverse-polarity protection and efficient power circuits.',
 spec:'Lower forward voltage (~0.3V) vs ~0.7V for a standard silicon diode.',
 pins:['diode']},
{cat:'G',name:'Zener Diode',img:'img/components/zener-diode.jpg',role:'Voltage-reference / clamp',
 text:'Behaves like a normal diode forward, but when reverse-biased past its rated "Zener voltage," it conducts and holds that voltage steady — perfect for simple voltage references and protection clamps.',
 spec:'Install backwards (cathode toward +) compared to a normal diode to use the Zener effect.',
 pins:['diode']},

{cat:'H',name:'NPN Transistor',img:'img/components/npn-transistor.jpg',role:'Current amplifier / electronic switch',
 text:'A small current into the base lets a much larger current flow collector-to-emitter. Used to switch loads, amplify signals, and build logic gates from discrete parts.',
 spec:'BC547 and 2N2222 are the "workhorse" NPNs — cheap, common, and forgiving.',
 pins:['bc547','pn2222']},
{cat:'H',name:'PNP Transistor',img:'img/components/pnp-transistor.jpg',role:'Current amplifier — opposite polarity',
 text:'Works like an NPN but conducts when the base is pulled LOW relative to the emitter, and current flows emitter-to-collector. Useful for high-side switching.',
 spec:'BC557 is the PNP counterpart to BC547.',
 pins:['bc557','pn2907']},

{cat:'I',name:'N-channel MOSFET',img:'img/components/n-mosfet.jpg',role:'Voltage-controlled switch',
 text:'Unlike a bipolar transistor (current-controlled), a MOSFET switches based on gate voltage and draws almost no control current. Great for switching higher currents/loads efficiently.',
 spec:'"Logic-level" MOSFETs like the IRLZ44N fully switch on with just 5V from a microcontroller pin.',
 pins:['2n7000','bs170','irlz44n']},

{cat:'J',name:'LDR (Photoresistor)',img:'img/components/ldr.jpg',role:'Light sensor',
 text:'Its resistance drops as light hitting it increases. Pair with a fixed resistor as a voltage divider to read light level as a voltage.',
 spec:'Great first sensor circuit — no extra ICs required.'},
{cat:'J',name:'NTC Thermistor',img:'img/components/ntc-thermistor.jpg',role:'Temperature sensor',
 text:'Resistance decreases as temperature rises (Negative Temperature Coefficient). Used the same way as an LDR — as one arm of a voltage divider.',
 spec:'A PTC thermistor does the opposite: resistance rises with temperature.'},
{cat:'J',name:'Photodiode / IR LED',img:'img/components/photodiode-ir.jpg',role:'Light emitter/detector pair',
 text:'An IR LED emits invisible infrared light; a photodiode\'s conductivity changes when light (including IR) hits it. Together they form simple beam-break or proximity sensors.',
 spec:'The building blocks behind IR remote controls and object-detection sensors.'},

{cat:'K',name:'Active Buzzer',img:'img/components/active-buzzer.jpg',role:'Self-driven tone generator',
 text:'Contains its own oscillator — just apply DC voltage and it beeps at a fixed tone. Simple, but you can\'t control pitch.',
 spec:'Look for the "5V active" marking to tell it apart from a passive buzzer.'},
{cat:'K',name:'Passive Buzzer / Piezo',img:'img/components/passive-buzzer.jpg',role:'Driven speaker element',
 text:'Has no internal oscillator — you must feed it a square wave at the frequency you want to hear. This is how you play actual tones and melodies.',
 spec:'Drive it from a 555 timer or a microcontroller PWM pin.'},

{cat:'L',name:'NE555 Timer',img:'img/components/ne555.jpg',role:'The classic timing/oscillator IC',
 text:'One of the most-used ICs ever made. Configurable with a couple of resistors and a capacitor to produce delays (monostable) or continuous pulses (astable) — the heart of blinkers, tone generators, and timers.',
 spec:'8-pin DIP — put it in a socket so you can reuse it across many exercises.',
 pins:['ne555']},
{cat:'L',name:'Op-Amp (LM358 / LM741)',img:'img/components/op-amp.jpg',role:'Signal amplifier / comparator',
 text:'Amplifies the voltage difference between its two inputs by a huge factor. Used for amplifying weak sensor signals, comparing voltages, and building filters.',
 spec:'LM358 runs from a single 5V supply; LM741 is the classic teaching op-amp but needs dual supply for full range.',
 pins:['lm358','lm741']},
{cat:'L',name:'Logic Gate ICs (74HC00/02/04/08/32/86)',img:'img/components/logic-gates.jpg',role:'Digital building blocks',
 text:'Each chip packs several gates of one type — NAND, NOR, NOT, AND, OR, XOR. Combine them to build counters, decoders, and simple digital logic without a microcontroller.',
 spec:'74HC family runs happily at 5V and is very breadboard-friendly.',
 pins:['hc-quad','hc04','hc02']},
{cat:'L',name:'74HC595 Shift Register',img:'img/components/shift-register.jpg',role:'Turns 3 pins into 8 outputs',
 text:'Lets a microcontroller control 8 outputs (like a row of LEDs) using only 3 control pins, by shifting data in serially.',
 spec:'Essential once you want more outputs than your Arduino has pins.',
 pins:['hc595']},
{cat:'L',name:'CD4017 Decade Counter',img:'img/components/decade-counter.jpg',role:'Counts pulses, lights one output at a time',
 text:'Each clock pulse moves an active-HIGH output to the next of its 10 outputs — a classic chip for chaser lights and simple sequencing without any code.',
 spec:'Combine with a 555 astable for a self-contained LED chaser.',
 pins:['cd4017']},
{cat:'L',name:'LM7805 / LM7812 Regulator',img:'img/components/voltage-regulator.jpg',role:'Fixed voltage regulator',
 text:'Takes a higher, messier input voltage and outputs a clean, fixed 5V (7805) or 12V (7812), as long as the input is a few volts above the output.',
 spec:'Add small capacitors on input and output for stability, per the datasheet.',
 pins:['lm78xx']},

{cat:'M',name:'7-Segment Display',img:'img/components/seven-segment.jpg',role:'Digit display, 8 LEDs in one package',
 text:'Seven bar-shaped LED segments (plus a decimal point) that combine to show digits 0–9. "Common cathode" ties all segment cathodes together; "common anode" ties all anodes together — this changes how you wire and drive it.',
 spec:'Each segment still needs its own current-limiting resistor.',
 pins:['seg7']},
{cat:'M',name:'8×8 LED Matrix',img:'img/components/led-matrix.jpg',role:'64 LEDs, row/column wired',
 text:'LEDs arranged in a grid where rows and columns are wired together internally, letting you address 64 LEDs with only 16 pins by scanning row-by-row.',
 spec:'Usually driven with a dedicated driver chip (e.g. MAX7219) once you go beyond manual scanning.'},

{cat:'N',name:'Relay',img:'img/components/relay.jpg',role:'Electromagnetically-controlled mechanical switch',
 text:'A small electromagnet pulls a physical switch contact open or closed, letting a low-power signal control a completely separate, often higher-power, circuit.',
 spec:'Start with low-voltage DC loads only — mains AC switching needs extra safety knowledge.'},

{cat:'O',name:'DC Motor',img:'img/components/dc-motor.jpg',role:'Converts electrical energy to rotation',
 text:'Spins continuously when powered; reversing polarity reverses direction. Draws far more current than a GPIO pin can safely supply, so it must be switched via a transistor/MOSFET/driver, never directly.',
 spec:'A flyback diode across the motor protects your switching transistor from voltage spikes.'},
{cat:'O',name:'Stepper Motor',img:'img/components/stepper-motor.jpg',role:'Motor that moves in precise fixed steps',
 text:'Instead of spinning freely, it rotates in discrete steps when its coils are energized in sequence — giving precise, repeatable positioning.',
 spec:'Needs a driver chip (e.g. ULN2003 or A4988), not a direct GPIO connection.'},

{cat:'P',name:'Voltage Regulated Adapter',img:'img/components/power-adapter.jpg',role:'Wall-to-DC power source',
 text:'Converts mains AC to a fixed DC voltage for your breadboard supply module or projects.',
 spec:'Match voltage/current to what your project actually needs — more current capacity is fine, higher voltage is not.'},
{cat:'P',name:'Battery Holder',img:'img/components/battery-holder.jpg',role:'Removable cell power',
 text:'Holds AA/AAA cells in series to reach a target voltage (e.g. 4×AA ≈ 6V) with simple spring-clip terminals.',
 spec:'For lithium cells, always use a protected charging module rather than bare cells.'},

{cat:'Q',name:'Digital Multimeter',img:'img/components/multimeter.jpg',role:'Your most important diagnostic tool',
 text:'Measures voltage, current, resistance and continuity. You will reach for it in nearly every exercise to check a circuit before and after powering it.',
 spec:'Learn continuity mode first — it\'s the fastest way to catch wiring mistakes.'},

{cat:'R',name:'Soldering Iron',img:'img/components/soldering-iron.jpg',role:'Permanent joint tool',
 text:'Melts solder to permanently bond wires and components to boards. Not needed for breadboard work, but essential once you build anything that has to survive being moved.',
 spec:'A temperature-controlled iron (not a fixed-wattage pencil iron) makes learning far easier.'},

{cat:'S',name:'Header Pins & JST Connectors',img:'img/components/header-pins.jpg',role:'Modular connection standards',
 text:'Header pins let you build pluggable pin rows onto your own boards; JST connectors are small locking connectors popular for battery and sensor leads.',
 spec:'Match JST pin-count and pitch exactly — they are not interchangeable between sizes.'},

{cat:'T',name:'DIP Socket',img:'img/components/dip-socket.jpg',role:'Protects and future-proofs your ICs',
 text:'A socket you solder or place on the breadboard once; the actual IC plugs into it, so a damaged chip is just unplugged and swapped rather than desoldered.',
 spec:'Cheap insurance — always socket a chip rather than soldering it directly.'},

{cat:'U',name:'Optocoupler (PC817)',img:'img/components/optocoupler.jpg',role:'Electrically-isolated signal link',
 text:'An LED and a phototransistor sealed together — a signal on one side controls the other side purely by light, with no electrical connection between them. Used to isolate a microcontroller from higher-voltage or noisy circuits.',
 spec:'Essential once you start interfacing low-voltage logic with mains-adjacent circuits.'},
{cat:'U',name:'SCR / TRIAC',img:'img/components/scr-triac.jpg',role:'High-power switching devices',
 text:'An SCR (thyristor) latches on and stays on until current drops to zero; a TRIAC does the same for AC in both directions. Both are the building blocks of dimmers and high-power control.',
 spec:'Handle with respect — these are typically used on mains-adjacent circuits.'},
];


const CAT_NAMES = {
    A: 'Prototyping & Wiring', B: 'Resistors', C: 'LEDs', D: 'Push Buttons & Switches',
    E: 'Potentiometers', F: 'Capacitors', G: 'Diodes', H: 'Transistors',
    I: 'MOSFETs', J: 'Light & Temp Sensors', K: 'Buzzers & Sound', L: 'ICs & Logic',
    M: 'Displays', N: 'Relays', O: 'Motors & Actuators', P: 'Power Components',
    Q: 'Measurement & Tools', R: 'Soldering', S: 'Connectors', T: 'Sockets',
    U: 'Advanced Power'
  };

const COMPONENT_DETAILS = {
    'Breadboard': {
      what: 'Temporary circuit prototyping, experiment testing, rapid component swapping, educational electronics lab setups.',
      why: 'Eliminates the need to solder and desolder during early design. Lets you immediately test ideas, swap resistor/capacitor values, and diagnose errors non-destructively.',
      how: 'Internal conductive nickel-bronze spring clips grip component leads beneath a plastic grid. Rails along the edges provide continuous +5V/VCC and GND lines, while central 5-hole rows connect ICs and passives across an insulating center ditch.'
    },
    'Dupont Wires': {
      what: 'Point-to-point connections between breadboard rows, sensor breakout boards, Arduino/ESP32 headers, and display modules.',
      why: 'Pre-stripped, color-coded, and ready to plug in. Saves hours of manual wire cutting and stripping while preventing loose, exposed bare wire shorts.',
      how: 'Flexible stranded copper wire terminated in molded male pins (plugs into breadboards and female headers) or female sockets (grips standard 2.54mm header pins).'
    },
    'Resistor': {
      what: 'Limiting current to LEDs and transistors, setting gain in op-amps, forming voltage dividers with sensors, timing networks in 555 circuits.',
      why: 'Without resistance, semiconductors draw uncontrolled current, resulting in instant overheating and burn-out. Resistors drop voltage and limit current to safe, predictable levels governed by Ohm’s Law (V = I × R).',
      how: 'A ceramic rod coated in a precision metal-film or carbon-film spiral. The physical thickness and path length restrict the free flow of charge carriers, dissipating excess electrical energy as harmless warmth.'
    },
    'LED': {
      what: 'Visual status indication, power lights, logic state verification, optical signaling, decorative lighting.',
      why: 'Draws tiny currents (typically 5–20mA), generates minimal heat, responds in nanoseconds, and lasts for over 50,000 hours compared to fragile filament bulbs.',
      how: 'Electroluminescent semiconductor p-n junction. When forward-biased, passing electrons recombine with electron holes in the active bandgap, releasing quantized photons as colored light.'
    },
    'RGB LED': {
      what: 'Multi-status indication (e.g. Blue = Wi-Fi connecting, Green = OK, Red = Error), color-mixing ambient lamps, mood indicators.',
      why: 'Packages three primary colors into a single 5mm bulb. By adjusting the current or PWM duty cycle to each pin, you can produce any shade in the 16-million-color spectrum.',
      how: 'Houses three separate semiconductor dies (Red, Green, Blue) sharing either a single Common Cathode (connected to GND) or Common Anode (connected to +V).'
    },
    'Tactile Push Button': {
      what: 'User input triggers, reset switches, manual clock pulses, mode selection.',
      why: 'Provides crisp tactile "click" feedback, compact footprint that fits directly into breadboard holes, and reliable momentary action.',
      how: 'A curved internal spring-steel disc. Pressing the plunger flexes the disc to short opposing terminal pairs together; releasing springs it back open immediately.'
    },
    'SPST / SPDT Switches': {
      what: 'Main circuit power on/off switches, dual-mode selectors, signal routing between two alternate circuits.',
      why: 'Maintains its state mechanically without consuming any quiescent power or needing software memory.',
      how: 'SPST connects or disconnects two terminals. SPDT connects a central Common pin to either terminal A or terminal B, acting as a physical signal router.'
    },
    'Pull-up / Pull-down': {
      what: 'Holding microcontroller and digital logic inputs at a stable, defined HIGH or LOW state when switches or sensors are open.',
      why: 'CMOS inputs have high impedance; without a pull-up or pull-down resistor, unconnected pins act like tiny radio antennas, randomly oscillating HIGH and LOW from ambient electrostatic noise.',
      how: 'A high-value resistor (typically 10kΩ) softly connects the input pin to VCC (pull-up) or GND (pull-down). When the button presses, it easily overrides the resistor to flip the pin cleanly.'
    },
    'Potentiometer': {
      what: 'Volume knobs, manual LED dimming, speed controllers, calibration trimmers, analog sensor emulation.',
      why: 'Allows continuous real-time manual control of voltage and resistance without needing to swap fixed components.',
      how: 'A circular carbon or conductive-plastic resistive track with terminals at both ends and a central wiper contact that slides along the track as the shaft rotates, acting as an adjustable voltage divider.'
    },
    'Ceramic Capacitor': {
      what: 'High-frequency noise filtering, power-rail decoupling, clock oscillators, transient spike suppression.',
      why: 'Extremely fast response time and low internal inductance (ESR), allowing it to absorb high-frequency electrical switching noise right at digital IC power pins.',
      how: 'Alternating layers of metal electrodes and ceramic dielectric. Stores electrostatic energy ($Q = C \\times V$) and passes high-frequency AC noise straight to ground while blocking steady DC voltage.'
    },
    'Electrolytic Capacitor': {
      what: 'Bulk power supply filtering, smoothing rectified AC into DC, preventing voltage sags during high-current surges (motors, Wi-Fi transmit bursts).',
      why: 'Provides massive energy storage (1µF to 10,000µF) in a small can, acting as a local energy reservoir that stabilizes power rails.',
      how: 'Uses an ultra-thin anodized aluminum oxide film as the dielectric bathed in a liquid electrolyte, achieving huge capacitance. Polarized: must connect positive to + and negative to GND.'
    },
    'Signal Diode (1N4148)': {
      what: 'Fast signal routing, diode logic gates, voltage clamping, wave shaping, reverse-polarity protection for low-current signal lines.',
      why: 'Switches in nanoseconds (approx 4ns) with low junction capacitance, making it ideal for high-speed digital and analog waveforms.',
      how: 'A glass-encapsulated silicon p-n junction that allows current to flow freely from Anode to Cathode (forward bias, ~0.7V drop) and blocks reverse current.'
    },
    'Rectifier Diode (1N4001–07)': {
      what: 'Mains AC to DC power rectification, reverse-battery protection, flyback diode suppression across relay coils and DC motors.',
      why: 'Rugged current capacity (1A continuous, 30A surge) capable of absorbing violent high-voltage inductive kickback spikes when coils are switched off.',
      how: 'Heavy-duty silicon junction with a reverse breakdown voltage of 50V (1N4001) up to 1000V (1N4007). Silver cathode band marks the negative end.'
    },
    'Schottky Diode (1N5819)': {
      what: 'High-efficiency power supplies, battery-ORing circuits, solar panel charge blockers, buck/boost converters.',
      why: 'Has half the forward voltage drop of standard silicon diodes (~0.2V to 0.3V vs 0.7V), which reduces power waste and heat by more than 50%.',
      how: 'Uses a metal-to-semiconductor barrier rather than a p-n junction, eliminating minority charge storage and enabling near-instantaneous recovery with minimal drop.'
    },
    'Zener Diode': {
      what: 'Simple voltage regulation, fixed voltage references, microcontroller input overvoltage protection clamps.',
      why: 'Maintains a constant, predictable breakdown voltage across its terminals without requiring active multi-pin regulator ICs.',
      how: 'Heavily doped p-n junction designed to conduct in reverse without damage once the voltage exceeds its rated Zener breakdown voltage ($V_z$).'
    },
    'NPN Transistor': {
      what: 'Electronic switching for relays, buzzers, and LEDs; analog small-signal audio amplifiers; building discrete logic gates.',
      why: 'A low-power microcontroller GPIO pin (providing only ~5mA) can switch a 100mA–500mA load safely, multiplying control currents by a factor of 100 to 300 ($\beta$).',
      how: 'Bipolar junction with Collector, Base, and Emitter. Injecting a small forward current into the Base opens the floodgates for a large current to flow from Collector to Emitter.'
    },
    'PNP Transistor': {
      what: 'High-side load switching (connecting the positive rail to a load), push-pull output driver pairs, complementary amplifiers.',
      why: 'Turns ON when the base voltage drops LOW relative to the supply rail, making it ideal for switching the top (+) side of a circuit.',
      how: 'Current flows from Emitter to Collector when the Base is pulled roughly 0.7V below the Emitter voltage.'
    },
    'N-channel MOSFET': {
      what: 'High-power switching: DC motors, high-power LED strips, solenoid valves, heating elements.',
      why: 'Voltage-controlled device with near-zero steady-state gate current. Ultra-low on-resistance ($R_{DS(on)}$) produces almost zero heat compared to bipolar transistors.',
      how: 'Applying a positive voltage to the insulated Gate creates an electrostatic field that opens an electron channel between Drain and Source, switching massive currents effortlessly.'
    },
    'LDR (Photoresistor)': {
      what: 'Automatic street lights, night lights, ambient light meters, optical beam-break counters.',
      why: 'Simplest possible optical sensor: no digital communication protocols or complex libraries required—just two leads that change resistance with light.',
      how: 'Cadmium sulfide (CdS) semiconductor. Incoming photons excite valence electrons into the conduction band, causing resistance to plunge from ~1MΩ in darkness to under 1kΩ in bright light.'
    },
    'NTC Thermistor': {
      what: 'Temperature readouts, fan speed regulation, 3D printer hotend thermal sensing, battery pack overheat monitoring.',
      why: 'Inexpensive, rugged, highly responsive, and compact. Delivers large, easily measurable resistance changes over ordinary temperature ranges.',
      how: 'Negative Temperature Coefficient metal-oxide ceramic. As thermal energy increases, more charge carriers are freed, causing resistance to decrease smoothly as temperature rises.'
    },
    'Photodiode / IR LED': {
      what: 'Infrared remote control links, tachometer wheel encoders, reflective line-follower sensors, optical proximity detectors.',
      why: 'Operates in invisible infrared light (940nm), ignoring human vision and responding with nanosecond-level optical speeds.',
      how: 'The IR LED emits invisible infrared photons; the photodiode operates in reverse-bias and produces a microamp leakage current directly proportional to incoming IR photons.'
    },
    'Active Buzzer': {
      what: 'Simple audible feedback, error alerts, alarm beeps, microwave/timer alerts.',
      why: 'Self-oscillating: simply apply 5V DC and it produces an immediate, piercing 2.3kHz tone without needing software code, PWM signals, or external oscillators.',
      how: 'Contains a built-in transistorized oscillator and piezo element potted inside a cylindrical plastic chamber that vibrates automatically when powered.'
    },
    'Passive Buzzer / Piezo': {
      what: 'Playing musical melodies, variable-pitch alert tones, audio synthesizers, ultrasonic generators.',
      why: 'Full software frequency control: feed it a square wave (e.g. Arduino `tone()`) to play any frequency from 100Hz to 10kHz.',
      how: 'A bare piezoelectric ceramic disc bonded to a brass diaphragm that flexes back and forth when driven with alternating voltages, generating sound waves.'
    },
    'NE555 Timer': {
      what: 'LED blinkers, square-wave clock generators, tone synthesizers, one-shot delay timers, PWM motor speed controllers.',
      why: 'The most popular analog timing IC ever manufactured: highly stable, operates from 4.5V to 15V, and drives up to 200mA directly without output transistors.',
      how: 'Internal 3×5kΩ voltage divider sets 1/3 and 2/3 VCC reference levels. Dual comparators trigger and reset an internal flip-flop, alternating between charging and discharging an external capacitor.'
    },
    'Op-Amp (LM358 / LM741)': {
      what: 'Weak sensor signal pre-amplification, analog active filters, voltage comparators, audio mixers, voltage buffers.',
      why: 'Gigantic open-loop gain ($>100,000$). By adding just two external resistors in a negative feedback loop, you can set precise, distortion-free amplification.',
      how: 'Amplifies the differential voltage between non-inverting (+) and inverting (-) inputs ($V_{out} = A \\times (V_+ - V_-)$). LM358 runs on a single 5V rail.'
    },
    'Logic Gate ICs (74HC00/02/04/08/32/86)': {
      what: 'Hardware decision logic, clock gating, debouncing, address decoders, combinatorial logic circuits.',
      why: 'Executes boolean logic in nanoseconds with zero code, zero software boot-time, and zero firmware crashes.',
      how: 'CMOS transistor arrangements implementing standard logic gates: NAND (74HC00), NOR (74HC02), NOT (74HC04), AND (74HC08), OR (74HC32), XOR (74HC86).'
    },
    '74HC595 Shift Register': {
      what: 'Controlling 8, 16, or more LEDs/relays from just 3 microcontroller pins, driving 7-segment and matrix displays.',
      why: 'Solves microcontroller pin exhaustion. Instead of using 8 separate pins, you send serial data over 3 lines to control unlimited cascaded outputs.',
      how: 'Serial data (DS) is clocked into an 8-bit internal shift register on shift clock (SHCP), then latched simultaneously to output pins on latch clock (STCP).'
    },
    'CD4017 Decade Counter': {
      what: 'Sequenced LED chasers (Knight Rider lights), 10-step sequencers, rotary counters, frequency division.',
      why: 'Automatically steps an active-HIGH output across 10 outputs in sequence with each clock pulse without any software code.',
      how: '5-stage Johnson decade counter that decodes 10 sequential outputs. Each positive clock edge advances the counter to the next pin.'
    },
    'LM7805 / LM7812 Regulator': {
      what: 'Providing a rock-solid, fixed 5V or 12V power rail from noisy wall adapters or higher-voltage batteries.',
      why: 'Simple 3-pin setup with internal thermal-overload protection, current-limiting, and short-circuit shutdown.',
      how: 'A linear series pass transistor continuously adjusts its internal resistance to drop excess input voltage as heat, maintaining a constant output voltage.'
    },
    '7-Segment Display': {
      what: 'Digital clocks, scoreboards, countdown timers, instrument readouts, sensor value displays.',
      why: 'High contrast and immediate visibility in bright sunlight or pitch darkness from across a room compared to small LCD screens.',
      how: 'Arranges 7 bar-shaped LEDs (segments A through G) plus a decimal point into a digit "8". Illuminating specific combinations forms digits 0–9.'
    },
    '8×8 LED Matrix': {
      what: 'Scrolling signboards, character displays, retro games (Snake/Pong), animated icons and audio visualizers.',
      why: 'Packs 64 individual pixels into a compact block while requiring only 16 pins (8 rows + 8 columns) via rapid multiplexing.',
      how: 'Row anodes and column cathodes cross inside. Lighting row 1 and column 1 activates only the top-left LED; scanning rows rapidly creates the illusion of a solid image.'
    },
    'Relay': {
      what: 'Switching 120V/240V AC mains lamps, home appliances, water pumps, and solenoids from low-voltage microcontrollers.',
      why: 'Provides complete physical and galvanic isolation between sensitive 3.3V/5V logic and hazardous high-power AC loads.',
      how: 'A low-voltage DC electromagnet pulls an internal mechanical armature, toggling switch contacts between Normally Open (NO) and Normally Closed (NC).'
    },
    'DC Motor': {
      what: 'Wheeled robots, fans, toy cars, water pumps, motorized tools.',
      why: 'Produces continuous, powerful rotary motion directly from DC voltage. Reversing voltage polarity immediately reverses spin direction.',
      how: 'Electromagnetic rotor coils interact with permanent stator magnets; carbon brushes and a commutator mechanically reverse coil currents as the shaft spins.'
    },
    'Stepper Motor': {
      what: '3D printers, CNC routers, robotic arms, camera sliders, precision positioning stages.',
      why: 'Rotates in precise, repeatable step angles (e.g. 1.8° per step) and holds position rigidly without needing external encoder feedback.',
      how: 'Multiple electromagnetic stator coils are energized in precise sequence, pulling a toothed magnetic rotor forward step by step.'
    },
    'Voltage Regulated Adapter': {
      what: 'Continuous DC power for breadboard modules, Arduino boards, and benchtop testing from standard wall outlets.',
      why: 'Eliminates dead batteries during lengthy prototyping sessions, delivering steady, clean DC voltage with overcurrent protection.',
      how: 'Switch-mode power supply (SMPS) that rectifies AC mains, chops it at high frequency, steps it down via a transformer, and regulates it to fixed DC.'
    },
    'Battery Holder': {
      what: 'Portable power for autonomous mobile robots, field sensor monitors, portable electronics gadgets.',
      why: 'Quick battery replacement; wiring standard AA/AAA cells in series adds voltages together (e.g. 4×AA = 6.0V).',
      how: 'Molded plastic carrier with series nickel-plated spring clips and color-coded lead wires (Red = +, Black = -).'
    },
    'Digital Multimeter': {
      what: 'Measuring DC/AC voltage, testing current draw, checking resistor values, testing diode junctions, checking continuity.',
      why: 'The absolute essential diagnostic tool for every electronics lab. Lets you verify circuit health and catch dead shorts before applying power.',
      how: 'High-precision internal ADC coupled with precision resistive divider ladders, low-resistance current shunts, and an audible continuity beeper.'
    },
    'Soldering Iron': {
      what: 'Permanent component bonding, assembling PCBs, building custom cable harnesses, repairing electronic equipment.',
      why: 'Breadboard circuits can vibrate loose; soldering creates a permanent, electrically sound, mechanically rigid metallic bond.',
      how: 'An internal ceramic heating element heats a copper-core plated tip to ~350°C, melting tin-lead or lead-free solder alloy to fuse pads and component leads.'
    },
    'Header Pins & JST Connectors': {
      what: 'Modular cable connections, removable battery plugs, sensor wiring harnesses, board-to-board interconnects.',
      why: 'Enables quick modular swapping and disconnection of modules without desoldering or cutting wires.',
      how: 'Standard 2.54mm (0.1") pitch male and female pin headers; polarized locking JST plastic housings prevent accidental reverse-polarity plugging.'
    },
    'DIP Socket': {
      what: 'Mounting sensitive ICs onto breadboards, stripboards, and printed circuit boards.',
      why: 'Protects expensive chips from thermal damage during soldering and enables instant replacement of blown or reprogrammed chips without desoldering.',
      how: 'Insulated plastic carrier with dual rows of internal spring-wipe contacts that securely grip IC pins.'
    },
    'Optocoupler (PC817)': {
      what: 'Galvanic signal isolation, protecting microcontrollers from high-voltage spikes, ground loop elimination, noisy motor feedback.',
      why: 'Protects delicate microcontrollers from inductive spikes and high voltages by transferring signals purely across an optical beam of light.',
      how: 'An internal infrared LED illuminates a photosensitive silicon transistor across a sealed, opaque gap, providing up to 5,000V of electrical isolation.'
    },
    'SCR / TRIAC': {
      what: 'AC mains dimmers, electric motor speed regulators, solid-state AC relays, crowbar overvoltage protection.',
      why: 'Solid-state switching of high-power AC loads without moving parts, mechanical contact arcing, or relay click noise.',
      how: 'An SCR latches ON when triggered by a gate pulse and stays ON until current drops to zero. A TRIAC conducts AC in both directions when pulsed.'
    }
  };
