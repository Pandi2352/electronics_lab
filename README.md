# Electronics Beginner Lab

A self-contained website for learning electronics from the ground up, from buying your first components to building IoT projects with an ESP32.

It is plain HTML, CSS and JavaScript: no build step, no framework, no server and no internet connection required. Open `index.html` and it works.

## Features

| Tab | What it does |
|---|---|
| **Shopping** | A master shopping list of 176 parts in 23 categories, each marked *Buy now* or *Buy later*. Tick items as you order them, search by name (`10k`, `LED`, `uf`, `ohm`) and filter by phase. |
| **Components** | A plain-language guide to 42 components. 20 of the cards have pinout diagrams (LED, transistors, MOSFETs, 555, op-amps, logic chips, 7-segment display…). |
| **Exercises** | 30 breadboard exercises in 7 stages, from measuring your 5V supply to a 555-driven LED chaser. Each one has its parts, steps, expected result and relevant pinouts. Mark exercises as done to track progress. |
| **Boards** | 10 boards (Arduino UNO/Nano/Mega, ESP8266, ESP32 DevKit/S3/C3/C6, Pico, Raspberry Pi) with specs, key pins, common mistakes and a comparison table. Full pinout diagrams for the UNO, the ESP32 DevKit V1 (30-pin) and the Pico. |
| **Sensors** | 93 sensors in 16 categories, from simple (LDR, thermistor) to advanced (BME688, GNSS). Each lists what it measures, its output type and what it is used for. Includes a recommended 28-sensor starter collection. |
| **Outputs** | 38 outputs and drivers: LEDs, displays, sound, relays, motors, servos, steppers and motor drivers. Each lists the control signal and power it needs. Includes a recommended starter set. |
| **Projects** | 10 guided builds (plant monitor, weather station, RC car, alarm, GPS tracker…). Each project checks your *Have it* ticks from Boards, Sensors and Outputs, and shows either **Ready to build** or exactly what is missing. |

Across the whole site:

- **Light and dark themes.** It follows your system setting; the 🌓 button overrides it.
- **Works on phones.** On small screens the tab bar scrolls sideways.
- **Saved progress.** Ticks and progress are stored in your browser (see [Saved data](#saved-data)).
- **Keyboard shortcuts.** Press `/` to jump to the search box on the current tab, and `Esc` to clear it.
- **Links survive refresh.** The URL remembers the current tab (e.g. `index.html#sensors`).
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
├── index.html          Page layout and the 7 tab views
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
    ├── app.js          Shopping, Components and Exercises views; tabs; theme
    └── guides.js       Boards, Sensors, Outputs and Projects views
```

The scripts are classic `<script defer>` files that share global constants, so their load order in `index.html` matters: data files first, then `app.js`, then `guides.js`.

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

### Add a pinout diagram

Add an entry to `PINOUTS` in `js/pinouts.js` with a `title`, a `note` and a `draw` function that returns SVG. The `dip()`, `to92()` and `to220()` helpers cover most IC and transistor packages. Then reference its key from a card's `pins` array (Components and Exercises) or a board's `pinout` field.

### Rules for ids

- **Never rename or reuse an `id`** in exercises, sensors, outputs, boards or projects. Saved progress is stored by `id`, so renaming one loses its tick.
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
| `lab-theme` | Light/dark choice |

Clearing site data, using a private window, or switching browser or device starts you with empty progress. If storage is blocked, the site still works; it just doesn't save anything.

## Safety

The guides are for learning with low-voltage DC circuits. Mains voltage (230V/120V) can kill: only work on mains wiring if you are qualified. The gas, smoke and CO sensors covered here are not a replacement for certified alarms.

## Roadmap

- [ ] Stable ids for shopping-list items (so editing the list never moves ticks)
- [ ] Backup and restore of all progress (export/import a file)
- [ ] Calculators tab: resistor colour code, Ohm's law, LED resistor, voltage divider, 555 timer, battery life
- [ ] Communication tab: UART, I2C, SPI, 1-Wire, Wi-Fi, BLE, ESP-NOW, LoRa, MQTT
- [ ] Power & batteries tab: Li-ion, chargers, buck/boost converters, deep sleep
- [ ] Offline install (PWA) and free hosting on GitHub Pages
- [ ] Grouped navigation once there are more tabs
