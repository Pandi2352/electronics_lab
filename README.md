# Electronics Beginner Lab

A self-contained website for learning electronics from the ground up, from buying your first components to building IoT projects with an ESP32.

It is plain HTML, CSS and JavaScript: no build step, no framework, no server and no internet connection required. Open `index.html` and it works.

## Features

| Tab | What it does |
|---|---|
| **Roadmap** | The start page: an 8-stage learning path from your first LED to IoT dashboards and robots. Each stage has milestones to tick, counts your exercise progress automatically, and links to the exercises, boards, projects and calculators it needs. |
| **Shopping** | A master shopping list of 176 parts in 23 categories, each marked *Buy now* or *Buy later*. Tick items as you order them, search by name (`10k`, `LED`, `uf`, `ohm`) and filter by phase. |
| **Components** | A plain-language guide to 42 components. 20 of the cards have pinout diagrams (LED, transistors, MOSFETs, 555, op-amps, logic chips, 7-segment display…). |
| **Component Images** | A visual photo gallery of all 42 components with real physical hardware images, search by name/role, category filters, and an interactive lightbox modal to inspect component packages, pin orientations and details. |
| **Arduino** | 37 Arduino UNO lessons: 17 core lessons in 6 units, from Blink to state machines: buttons and debouncing, the Serial Monitor, analog input, PWM, an NTC thermometer, tones, servos, a MOSFET motor driver, an I2C scanner, an LCD, a 74HC595 and multitasking with millis(). Then 20 practice exercises in 4 more units (Morse code, reaction game, bar graph, theremin, 7-segment dice, stopwatch, combination lock…). Each has wiring, a complete sketch with a Copy button, the expected result, how it works and ideas to try next. |
| **Exercises** | 50 breadboard exercises: 30 in 7 core stages, from measuring your 5V supply to a 555-driven LED chaser, then 20 simpler practice builds in 4 more stages (doorbell, water detector, two-transistor flasher, half adder, electronic dice…). Each one has its parts, steps, expected result and relevant pinouts. Mark exercises as done to track progress. |
| **Boards** | 10 boards (Arduino UNO/Nano/Mega, ESP8266, ESP32 DevKit/S3/C3/C6, Pico, Raspberry Pi) with specs, key pins, common mistakes and a comparison table. Full pinout diagrams for the UNO, the ESP32 DevKit V1 (30-pin) and the Pico. |
| **Sensors** | 93 sensors in 16 categories, from simple (LDR, thermistor) to advanced (BME688, GNSS). Each lists what it measures, its output type and what it is used for. Includes a recommended 28-sensor starter collection. |
| **Outputs** | 38 outputs and drivers: LEDs, displays, sound, relays, motors, servos, steppers and motor drivers. Each lists the control signal and power it needs. Includes a recommended starter set. |
| **Projects** | 10 guided builds (plant monitor, weather station, RC car, alarm, GPS tracker…). Each project checks your *Have it* ticks from Boards, Sensors and Outputs, and shows either **Ready to build** or exactly what is missing. |
| **Tools** | 9 calculators: resistor colour code (both directions), Ohm's law, LED resistor, voltage divider with an ESP32/UNO ADC check, 555 timer, RC time constant, battery life, series & parallel, and capacitor codes. Inputs accept shorthand such as `4k7`, `2.2M`, `100n` and `4R7`. |

**Starter kit page (`kit.html`).** The yellow-and-blue **Starter kit** button at the bottom right of every tab opens it in a new tab: the complete buy list in 30 sections (tools, prototyping, resistors, capacitors, semiconductors, ICs, displays, sensors, motors, power, batteries, connectors, safety…). All 271 parts show their quantity, priority, *when* you need them (Day 1 → Later) and what they are used for. It also has the recommended 75-item “buy now” checklist, the learning-progression diagram, search, a “when” filter and printing.

**Project curriculum page (`curriculum.html`).** The violet **51 projects** button, stacked above the Starter kit button, opens the full practical curriculum: 51 projects in 9 phases, from an LED circuit to an ESP32 smart RC car. Each project lists what it teaches, every component with quantities, and its diagrams (build/logic drawings, flow chains and what each display should show). You can mark projects as built, record your predicted and measured voltages for project 4, filter by phase or status, search and print. Each phase with a shopping list starts with a **buy list**: every component for that phase merged into one order, with the projects that use it and an estimated price in ₹, plus optional extras and money-saving tips. Phase 1 (projects 1–14) is about ₹640–1,200; Phase 2 (projects 15–24) adds about ₹600–1,030, with the parts reused from Phase 1 listed separately and pre-ticked. Below the core list, Phase 1 also has **Extra components**, **Tools** and **Advanced — nice to have** sections (assortments, IC sockets, a motor battery pack, stripper and cutter, clip leads, a component tester, soldering kit, logic analyser, mini oscilloscope, bench supply…); tick “Add” on any of them and the total shows core parts + your extras. The must-have tools start ticked. Tick what you already have and it drops out of the total; each list prints on its own.

**Guides page (`guides.html`).** The teal **Guides** button (top of the three stacked buttons) opens a page with an accordion sidebar — one expandable menu per guide, a slim custom scrollbar, a sticky side menu on desktop that highlights the section you are reading, and a slide-in drawer (**Menu** button) on phones and tablets. The address remembers where you are (e.g. `guides.html#uno/shields`).

- **Before Arduino** — the electronics to learn before the Nano: voltage, current, resistance, power and Ohm’s law, circuit basics (series, parallel, dividers, ground, shorts), the main components, the resistor colour code and LED resistor, tools, **using the multimeter**, how a breadboard works, reading schematics, **24 no-code circuits in 5 levels** (first circuits → components → transistors & switching → power & 555 timing → logic ICs & soldering), the first 5 circuits with what to measure, a “ready for the Nano?” checklist, safety and a ₹ buy list. It is the first menu in the sidebar.
- **Arduino Nano** — the board and its parts, the Nano family, specifications, a pinout diagram, power, setup and troubleshooting (CH340, old bootloader), breadboard wiring, **30 projects in 4 levels** (fundamentals → sensors → small systems → advanced: interrupts, sleep, EEPROM, shift register, stepper, ESP32 bridge), the first 5 projects with circuits and complete sketches, the first-10 sequence, the Nano → IoT path, common mistakes and a ₹ buy list.
- **Arduino UNO** — the board and the UNO family (R3, clones, R4 Minima / WiFi), specifications, pinout, power (including regulator heat), setup, **shields**, UNO vs Nano, **28 projects in 5 levels** (digital I/O → analog & sound → sensors & displays → motors → advanced systems such as data loggers, RFID, robots and an ESP32 bridge) with links to the matching code lessons, the first-10 sequence, common mistakes, three routes to IoT and a ₹ buy list grouped by level.
- **ESP32 DevKit** — the board and the ESP32 family (S2, S3, C3, C6, CAM), specifications, pinout with a **safe-pins table** (boot pins, input-only pins, ADC1 vs ADC2), power and brown-outs, setup (board package, BOOT button), **3.3V rules & level shifting**, Wi-Fi / Bluetooth / MQTT / ESP-NOW / OTA explained, **27 projects in 5 levels** (basics → sensors & displays → Wi-Fi & web → IoT protocols → advanced: deep sleep, OTA, FreeRTOS, a Wi-Fi RC car, ESP32 → NestJS → React), the first 5 projects with complete sketches (including a web server and MQTT), the first-10 sequence, common mistakes and a ₹ buy list.
- **RC Car / Robot** — the parts of a car, chassis and steering types, motors (speed, torque, stall current), **motor drivers** (L298N, TB6612FNG, BTS7960…) with the H-bridge truth table and wiring, batteries and power wiring (2S 18650, BMS, buck converter, stopping resets), control options (IR, Bluetooth, Wi-Fi, ESP-NOW, nRF24, hobby RC), sensors, drive logic (arcade mixing, deadband, ramping, **failsafe**), **28 projects in 5 levels** (motors & power → self-driving Nano robots → ESP32 remote control → sensors & feedback → FPV camera, mecanum, telemetry dashboard, GPS rover), the first 6 projects with complete sketches (motor test, obstacle avoider, line follower, Wi-Fi web-joystick car, ESP-NOW remote + car), common mistakes, the path to NestJS + React and a ₹ buy list.
- **Bluetooth Amplifier** — how the module works (Bluetooth receiver → DAC → class-D amplifier), the types of board (5V PAM8403 mini boards, 12–24V TPA3116D2 stereo / 2.1 / mono), reading the specs honestly, terminals and **bridged-output wiring**, choosing a power supply (voltage vs watts, lithium packs), speakers and enclosures, first power-up and troubleshooting (hum, whine, pops), **26 projects in 5 levels** (first sound → real speakers & power → portable & battery → Arduino add-ons → your own ESP32 Bluetooth speaker), the first 5 builds with measurements (two with sketches: an LED VU meter and an ESP32 A2DP receiver), common mistakes and a ₹ buy list.

Across the whole site:

- **Light and dark themes.** It follows your system setting; the half-circle button in the header overrides it.
- **Works on phones.** On small screens the tab bar scrolls sideways.
- **Saved progress.** Ticks and progress are stored in your browser (see [Saved data](#saved-data)).
- **Keyboard shortcuts.** Press `/` to jump to the search box on the current tab, and `Esc` to clear it.
- **Links survive refresh.** The URL remembers the current tab (e.g. `index.html#sensors`).
- **Print / Save as PDF.** Print the full shopping list or only what's still to buy, all exercises or only the unfinished ones, a single exercise or project, or the roadmap. Printouts are always black-on-white, with everything expanded. Choose *Save as PDF* in the print dialog for a PDF.
- **Theme-aware diagrams.** All pinout diagrams are inline SVG, so they switch with the light/dark theme.

## Getting started

Open `index.html` in any modern browser (Chrome, Edge, Firefox or Safari). Double-clicking the file is enough.

Or serve the folder locally, for example:

```bash
# Python
python -m http.server 8000
# then open http://localhost:8000

# Node
npx serve .
```

Any static host works for publishing it: GitHub Pages, Netlify or Cloudflare Pages. Upload the folder as it is.

## Project structure

```
components/
├── index.html          Page layout and the tab views
├── kit.html            Starter-kit buy list page
├── curriculum.html     51-project curriculum page
├── guides.html         Guides page with a sidebar (Before Arduino, Arduino Nano, Arduino UNO, ESP32 DevKit, RC Car / Robot, Bluetooth Amplifier)
├── css/
│   └── styles.css      All styles, theme colours and the mobile layout
└── js/
    ├── data.js         Shopping list (CATS) and component guide (LEARN)
    ├── exercises.js    Exercise stages and steps (STAGES, EXERCISES)
    ├── pinouts.js      SVG pinout diagrams (PD.PINOUTS, PD.block)
    ├── sensors.js      Sensor guide (SENSOR_GROUPS, SENSOR_KIT)
    ├── boards.js       Board guide (BOARDS, BOARD_CHOICE)
    ├── outputs.js      Outputs & drivers (OUTPUT_GROUPS, OUTPUT_KIT)
    ├── projects.js     Guided projects (PROJECTS)
    ├── roadmap.js      Learning roadmap stages and milestones (ROADMAP)
    ├── kit.js          Starter-kit buy list (KIT_SECTIONS, KIT_BUY_NOW, KIT_PATH)
    ├── kit-view.js     kit.html view (standalone — does not load app.js)
    ├── curriculum.js   51-project curriculum (CUR_PHASES, CUR_PROJECTS, CUR_STAGES)
    ├── curriculum-view.js curriculum.html view (standalone)
    ├── basics.js       Before Arduino guide content (BASICS)
    ├── nano.js         Arduino Nano guide content (NANO)
    ├── uno.js          Arduino UNO guide content (UNO)
    ├── esp32.js        ESP32 DevKit guide content (ESP32)
    ├── rccar.js        RC car / robot guide content (RCCAR)
    ├── btamp.js        Bluetooth amplifier module guide content (BTAMP)
    ├── guides-page.js  guides.html view: sidebar, drawer, sections, buy list (standalone)
    ├── lessons.js      Arduino lessons and their sketches (LESSON_UNITS, LESSONS)
    ├── tools.js        Calculators (TOOLS)
    ├── app.js          Shopping, Components and Exercises views; tabs; theme
    ├── guides.js       Roadmap, Boards, Sensors, Outputs, Projects and Tools views; printing
    └── lessons-view.js Arduino lessons view: code highlighting, copy, progress
```

The scripts are classic `<script defer>` files that share global constants, so their load order in `index.html` matters: data files first (including `tools.js`), then `app.js`, then `guides.js`, then the views that build on it (`lessons-view.js`).

## Editing the content

All content lives in the data files. You never need to touch the view code to add or change text.

### Add a sensor or output

Add an object to the right group in `js/sensors.js` or `js/outputs.js`:

```js
{ id:'bmp390', name:'BMP390', level:'i',            // b = basic, i = intermediate, a = advanced
  measures:'Pressure + temperature', out:'I2C / SPI', // outputs use control: / power: instead
  desc:'What it is and how it works.',
  use:'What it is used for.',
  tip:'Optional warning or hint.',                  // optional
  sub:'Barometers' },                               // optional sub-heading inside the group
```

To add it to the starter set, put its `id` in `SENSOR_KIT` or `OUTPUT_KIT`.

### Add a board

Add an object to `BOARDS` in `js/boards.js`. The `t` field holds the short values shown in the comparison table. `pinout` is optional and names a diagram in `js/pinouts.js`.

### Add a project

Add an object to `PROJECTS` in `js/projects.js`. The `needs` array links to items in the other guides:

```js
needs:['b:esp32-devkit|esp32-c3',   // board: any one of these
       's:bme280',                  // sensor: required
       '?o:ssd1306'],               // output: optional (leading ?)
```

`b:` = board, `s:` = sensor, `o:` = output, `|` = any one of them, `?` = optional. Anything that is not tracked in a guide goes in `parts`.

### Add an Arduino lesson

Add an object to `LESSONS` in `js/lessons.js` with an `id`, a `unit` (from `LESSON_UNITS`), `title`, `goal`, `parts`, `wiring` steps, the full `code` as a template string, `expect`, `how`, `tryThis` and `pins` (pinout keys). `redo` optionally names the exercise it rebuilds.

### Add a roadmap stage or milestone

Edit `ROADMAP` in `js/roadmap.js`. `milestones` are `[id, text]` pairs; `exStages` lists the exercise stages whose progress counts towards the stage; `links` are `[type, id, label]`, where `type` is `view` (a tab), `tool` (a calculator), `board` or `project`.

### Add a pinout diagram

Add an entry to `PINOUTS` in `js/pinouts.js` with a `title`, a `note` and a `draw` function that returns SVG. The `dip()`, `to92()` and `to220()` helpers cover most IC and transistor packages. Then reference its key from a card's `pins` array (Components and Exercises) or a board's `pinout` field.

### Rules for ids

- **Never rename or reuse an `id`** in exercises, lessons, sensors, outputs, boards, projects or roadmap milestones. Saved progress is stored by `id`, so renaming one loses its tick.
- The shopping list is the exception: its ticks are stored by **position** (`B-3`), so inserting or removing an item shifts the ticks after it. Add new shopping items at the **end** of a category until this is fixed (see [Roadmap](#roadmap)).

## Saved data

Everything is saved in the browser's `localStorage`, on this device only:

| Key | Contents |
|---|---|
| `lab-checklist` | Shopping list ticks |
| `lab-exercises` | Exercises marked done |
| `lab-boards` | Boards you have |
| `lab-sensors` | Sensors you have |
| `lab-outputs` | Outputs you have |
| `lab-projects` | Projects marked built |
| `lab-roadmap` | Roadmap milestones ticked |
| `lab-lessons` | Arduino lessons marked done |
| `lab-kit` | Buy-now list items ticked on the starter-kit page |
| `lab-curriculum` | Curriculum projects marked built |
| `lab-cur-measure` | Voltages recorded in curriculum project 4 |
| `lab-cur-buy` | Items ticked as “have” on the phase buy lists |
| `lab-basics-guide` | Before Arduino guide projects built |
| `lab-basics-guide-buy` | Before Arduino buy-list ticks |
| `lab-nano` | Arduino Nano guide projects built |
| `lab-nano-buy` | Arduino Nano buy-list ticks |
| `lab-uno-guide` | Arduino UNO guide projects built |
| `lab-uno-guide-buy` | Arduino UNO buy-list ticks |
| `lab-esp32-guide` | ESP32 DevKit guide projects built |
| `lab-esp32-guide-buy` | ESP32 DevKit buy-list ticks |
| `lab-rccar-guide` | RC car / robot guide projects built |
| `lab-rccar-guide-buy` | RC car / robot buy-list ticks |
| `lab-btamp-guide` | Bluetooth amplifier guide projects built |
| `lab-btamp-guide-buy` | Bluetooth amplifier buy-list ticks |
| `lab-theme` | Light/dark choice |

Clearing site data, using a private window, or switching browser or device starts you with empty progress. If storage is blocked, the site still works; it just doesn't save anything.

## Safety

The guides are for learning with low-voltage DC circuits. Mains voltage (230V/120V) can kill: only work on mains wiring if you are qualified. The gas, smoke and CO sensors covered here are not a replacement for certified alarms.

## Roadmap

- [ ] Stable ids for shopping-list items (so editing the list never moves ticks)
- [ ] Backup and restore of all progress (export/import a file)
- [x] Calculators tab
- [x] Learning roadmap
- [x] Print / Save as PDF sheets
- [x] Arduino lessons
- [ ] ESP32 lessons and IoT (MQTT, dashboards) lessons
- [ ] Communication tab: UART, I2C, SPI, 1-Wire, Wi-Fi, BLE, ESP-NOW, LoRa, MQTT
- [ ] Power & batteries tab: Li-ion, chargers, buck/boost converters, deep sleep
- [ ] Offline install (PWA) and free hosting on GitHub Pages
- [ ] Grouped navigation once there are more tabs
