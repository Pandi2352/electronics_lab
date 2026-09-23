/* Component Images Gallery view.
   Provides a visual photo catalog of all 42 components.
   Clicking any card opens a comprehensive popup detailing:
   - What it is used for
   - Why it is used & why it matters
   - How it works in a circuit
   - Key specifications & circuit rules
   - Interactive pinout diagrams
*/

(() => {
  const grid = document.getElementById('gallerygrid');
  const searchInput = document.getElementById('gallery-search');
  const searchClear = document.getElementById('gallery-clear');
  const catBtns = document.querySelectorAll('#gallery-cats button');
  const countEl = document.getElementById('gallery-count');
  const emptyEl = document.getElementById('gallery-empty');
  const resetBtn = document.getElementById('gallery-reset');

  if(!grid) return;

  const lightbox = document.getElementById('img-lightbox');
  const lbImg = document.getElementById('lightbox-img');
  const lbTitle = document.getElementById('lightbox-title');
  const lbCat = document.getElementById('lightbox-cat');
  const lbRole = document.getElementById('lightbox-role');
  const lbDesc = document.getElementById('lightbox-desc');
  const lbWhat = document.getElementById('lightbox-what');
  const lbWhy = document.getElementById('lightbox-why');
  const lbHow = document.getElementById('lightbox-how');
  const lbSpec = document.getElementById('lightbox-spec');
  const lbPins = document.getElementById('lightbox-pins');
  const lbPinsSection = document.getElementById('lightbox-pins-section');
  const lbClose = document.getElementById('lightbox-close');
  const lbCloseBtn = document.getElementById('lightbox-close-btn');

  // Category mapping
  const CAT_MAP = {
    passives: ['B', 'E', 'F', 'J'],
    semis: ['C', 'G', 'H', 'I', 'U'],
    ics: ['L'],
    io: ['D', 'K', 'M', 'N', 'O'],
    tools: ['A', 'P', 'Q', 'R', 'S', 'T']
  };

  const CAT_NAMES = {
    A: 'Prototyping & Wiring', B: 'Resistors', C: 'LEDs', D: 'Push Buttons & Switches',
    E: 'Potentiometers', F: 'Capacitors', G: 'Diodes', H: 'Transistors',
    I: 'MOSFETs', J: 'Light & Temp Sensors', K: 'Buzzers & Sound', L: 'ICs & Logic',
    M: 'Displays', N: 'Relays', O: 'Motors & Actuators', P: 'Power Components',
    Q: 'Measurement & Tools', R: 'Soldering', S: 'Connectors', T: 'Sockets',
    U: 'Advanced Power'
  };

  // Comprehensive details database for all 42 components
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

  let activeCat = 'all';
  let activeQuery = '';

  const cardElements = [];

  LEARN.forEach(item => {
    const card = document.createElement('article');
    card.className = 'gcard';
    card.dataset.cat = item.cat;
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `View full explanation for ${item.name}`);

    const catName = CAT_NAMES[item.cat] || `Category ${item.cat}`;

    card.innerHTML = `
      <div class="gcard-img-wrap">
        <img src="${item.img}" alt="${item.name}" loading="lazy" class="gcard-img" onerror="this.parentElement.style.opacity='0.4'">
        <span class="gcard-zoom-badge" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8">
            <circle cx="7" cy="7" r="4.5"/>
            <path d="M10.5 10.5L14 14"/>
            <path d="M7 4.5v5M4.5 7h5"/>
          </svg>
        </span>
      </div>
      <div class="gcard-body">
        <div class="gcard-meta">
          <span class="tag">${catName}</span>
        </div>
        <h4 class="gcard-title">${item.name}</h4>
        <p class="gcard-role">${item.role}</p>
        <div class="gcard-footer">
          <span class="gcard-view-btn">Click to view full explanation &rarr;</span>
        </div>
      </div>
    `;

    // Click anywhere on card opens full explanation modal
    card.addEventListener('click', () => openPopup(item));
    card.addEventListener('keydown', e => {
      if(e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openPopup(item);
      }
    });

    grid.appendChild(card);
    cardElements.push({ item, card });
  });

  function openPopup(item){
    const d = COMPONENT_DETAILS[item.name] || {};

    lbImg.src = item.img;
    lbImg.alt = item.name;
    lbTitle.textContent = item.name;
    lbCat.textContent = CAT_NAMES[item.cat] || `Category ${item.cat}`;
    lbRole.textContent = item.role;
    lbDesc.textContent = item.text;

    // What it is used for
    lbWhat.textContent = d.what || item.role;

    // Why it is used
    lbWhy.textContent = d.why || 'Essential circuit building block that regulates signals and prevents electrical damage.';

    // How it works
    lbHow.textContent = d.how || item.text;

    // Key specs & rules
    lbSpec.textContent = item.spec || 'Standard low-voltage DC breadboard component.';

    // Pinout diagram
    lbPins.innerHTML = '';
    const hasPins = item.pins && typeof PD !== 'undefined' && PD.block;
    if(hasPins){
      const pb = PD.block(item.pins);
      if(pb){
        lbPins.appendChild(pb);
        lbPinsSection.hidden = false;
      } else {
        lbPinsSection.hidden = true;
      }
    } else {
      lbPinsSection.hidden = true;
    }

    if(typeof lightbox.showModal === 'function') {
      lightbox.showModal();
    } else {
      lightbox.setAttribute('open', '');
    }
  }

  // Globally expose for component cards anywhere in the app
  window.openComponentPopup = openPopup;

  function closePopup(){
    if(typeof lightbox.close === 'function') {
      lightbox.close();
    } else {
      lightbox.removeAttribute('open');
    }
  }

  if(lbClose) lbClose.addEventListener('click', closePopup);
  if(lbCloseBtn) lbCloseBtn.addEventListener('click', closePopup);
  if(lightbox){
    lightbox.addEventListener('click', e => {
      if(e.target === lightbox) closePopup();
    });
  }

  function applyFilters(){
    const q = activeQuery.toLowerCase().trim();
    let visibleCount = 0;

    cardElements.forEach(({ item, card }) => {
      const inCat = activeCat === 'all' || (CAT_MAP[activeCat] && CAT_MAP[activeCat].includes(item.cat));
      const haystack = (item.name + ' ' + item.role + ' ' + (CAT_NAMES[item.cat] || '') + ' ' + (item.text || '')).toLowerCase();
      const inSearch = !q || haystack.includes(q);

      const show = inCat && inSearch;
      card.hidden = !show;
      if(show) visibleCount++;
    });

    if(countEl) countEl.textContent = `${visibleCount} / ${LEARN.length} components`;
    if(emptyEl) emptyEl.hidden = visibleCount > 0;
    if(searchClear) searchClear.hidden = !q;
  }

  catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      catBtns.forEach(b => {
        b.classList.toggle('on', b === btn);
        b.setAttribute('aria-pressed', b === btn);
      });
      activeCat = btn.dataset.gc;
      applyFilters();
    });
  });

  if(searchInput){
    searchInput.addEventListener('input', e => {
      activeQuery = e.target.value;
      applyFilters();
    });
    searchInput.addEventListener('keydown', e => {
      if(e.key === 'Escape' && searchInput.value){
        searchInput.value = '';
        activeQuery = '';
        applyFilters();
      }
    });
  }

  if(searchClear){
    searchClear.addEventListener('click', () => {
      searchInput.value = '';
      activeQuery = '';
      applyFilters();
      searchInput.focus();
    });
  }

  if(resetBtn){
    resetBtn.addEventListener('click', () => {
      if(searchInput) searchInput.value = '';
      activeQuery = '';
      activeCat = 'all';
      catBtns.forEach(b => {
        b.classList.toggle('on', b.dataset.gc === 'all');
        b.setAttribute('aria-pressed', b.dataset.gc === 'all');
      });
      applyFilters();
    });
  }

  applyFilters();
})();
