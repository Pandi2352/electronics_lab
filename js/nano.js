/* Arduino Nano guide (guides.html). Each section is a list of blocks rendered by guides-page.js:
   p · note [kind, text] · flow {label, steps} · list {label, items} · steps {label, items} · table {label, head, rows}
   pre {label, text} · cards {items:[title, text]} · pinout {key} · projects · starters · sequence · buy.
   Project and buy ids are stable progress keys. */

const NANO = {
  id:'nano',
  menu:'Arduino Nano',
  blurb:'Learn the Nano fully — the board, its pins and power — then work through 30 projects in four levels, from a single LED to interrupts, sleep modes and a bridge to the ESP32.',
  keys:{ done:'lab-nano', buy:'lab-nano-buy' },
  sections:[
  { id:'start', short:'Start here', title:'Start here',
    blocks:[
      { p:'You are starting electronics and IoT from the electrical fundamentals, so this guide avoids jumping straight into Wi-Fi and cloud projects. With an Arduino Nano you first build projects that teach how electricity actually behaves, then add sensors, and only then communication.' },
      { note:['key', 'Arduino Nano ≠ IoT. A classic Nano is excellent for learning electronics and embedded control, but it has no Wi-Fi of its own. It is the step before the ESP32.'] },
      { flow:{ label:'For every project, don’t just make it work — use this cycle', steps:['Build', 'Measure', 'Understand', 'Break it', 'Fix it', 'Modify it'] } },
      { p:'For example, on the LED project, actually measure the voltage across the LED, the voltage across the resistor, and the current through the circuit with your multimeter. That is what turns Arduino tinkering into real electronics knowledge.' },
      { note:['tip', 'Don’t buy a huge collection and immediately try to use everything. Build the projects in order — the buy list at the end of this menu covers exactly what they need.'] },
    ] },

  { id:'meet', short:'Meet the Nano', title:'Meet the Arduino Nano',
    blocks:[
      { p:'The Nano is an Arduino UNO shrunk to 18 × 45 mm. It has the same ATmega328P chip, runs the same sketches, and has pins on both long edges so it plugs straight into a breadboard.' },
      { cards:{ label:'What is on the board', items:[
        ['USB connector', 'Power and programming. The original uses Mini-USB; most clones use Mini-USB, Micro-USB or USB-C — check which cable you need.'],
        ['USB-to-serial chip', 'Translates USB into the serial signals the ATmega328P understands. Originals use the FT232RL; most clones use the CH340, which may need a driver.'],
        ['ATmega328P microcontroller', 'The brain: 8-bit, 16 MHz, 32 KB of program memory. The square chip in the middle.'],
        ['16 MHz crystal / resonator', 'Sets the clock speed, so delay() and millis() are accurate.'],
        ['5V voltage regulator', 'Turns 7–12V on VIN into a steady 5V for the board.'],
        ['Reset button', 'Restarts your sketch from the beginning, exactly like unplugging and replugging.'],
        ['LEDs: PWR, L, TX, RX', 'PWR = powered. L = the LED on D13 (Blink uses it). TX / RX flash while data moves over USB.'],
        ['ICSP header (6 pins)', 'For programming the chip directly or re-installing the bootloader with a programmer. You won’t need it at first.'],
        ['Pin headers', 'Two rows of 15 pins. Many cheap Nanos arrive with the headers loose — buy one with them soldered if you can’t solder yet.'],
      ] } },
      { table:{ label:'The Nano family — this guide is about the classic Nano', head:['Board', 'Chip', 'Logic', 'Wireless', 'Notes'], rows:[
        ['Nano (classic)', 'ATmega328P', '5V', '—', 'The one in this guide. Clones are cheap and common.'],
        ['Nano Every', 'ATmega4809', '5V', '—', 'More memory (48 KB / 6 KB), mostly compatible.'],
        ['Nano 33 IoT', 'SAMD21', '3.3V', 'Wi-Fi + BLE', '3.3V pins — not 5V tolerant.'],
        ['Nano 33 BLE (Sense)', 'nRF52840', '3.3V', 'BLE', 'The Sense version adds on-board sensors.'],
        ['Nano RP2040 Connect', 'RP2040', '3.3V', 'Wi-Fi + BLE', 'Also runs MicroPython.'],
        ['Nano ESP32', 'ESP32-S3', '3.3V', 'Wi-Fi + BLE', 'The “IoT Nano” — the same step as moving to an ESP32.'],
      ] } },
    ] },

  { id:'specs', short:'Specifications', title:'Specifications',
    blocks:[
      { table:{ head:['Feature', 'Classic Nano'], rows:[
        ['Microcontroller', 'ATmega328P, 8-bit AVR'],
        ['Clock speed', '16 MHz'],
        ['Operating voltage', '5V (the logic level of every pin)'],
        ['Input voltage (VIN)', '7–12V recommended (6–20V absolute limits)'],
        ['Digital I/O pins', '14 (D0–D13), of which 6 are PWM: D3, D5, D6, D9, D10, D11'],
        ['Analog inputs', '8 (A0–A7), 10-bit: 0–5V reads as 0–1023. A6 and A7 are analog only'],
        ['Program memory (flash)', '32 KB, of which about 2 KB holds the bootloader'],
        ['SRAM', '2 KB — variables and large strings fill it fast'],
        ['EEPROM', '1 KB — keeps values after power-off'],
        ['Current per I/O pin', '20 mA recommended, 40 mA absolute maximum'],
        ['Total I/O current', 'About 200 mA for all pins together'],
        ['3.3V pin', 'Small loads only (a few tens of mA)'],
        ['Serial (UART)', 'D0 = RX, D1 = TX — shared with USB'],
        ['I2C', 'A4 = SDA, A5 = SCL'],
        ['SPI', 'D10 = SS, D11 = MOSI, D12 = MISO, D13 = SCK'],
        ['External interrupts', 'D2 (INT0), D3 (INT1)'],
        ['Size / weight', '18 × 45 mm, about 7 g'],
      ] } },
    ] },

  { id:'pinout', short:'Pinout', title:'Pinout',
    blocks:[
      { pinout:'nano' },
      { table:{ label:'What the pins do', head:['Pins', 'Use them for'], rows:[
        ['D2–D13', 'Digital input or output: LEDs, buttons, buzzers, sensor signals.'],
        ['~D3, ~D5, ~D6, ~D9, ~D10, ~D11', 'PWM with analogWrite(): LED brightness, motor speed. Servos can use any pin with the Servo library.'],
        ['D2, D3', 'Interrupts — react instantly to fast pulses (encoders, flow sensors).'],
        ['A0–A5', 'Analog input with analogRead() (potentiometers, LDRs, thermistors). They also work as digital pins.'],
        ['A6, A7', 'Analog input only — digitalRead() and digitalWrite() do not work on them.'],
        ['A4 / A5', 'I2C bus (SDA / SCL) for OLEDs, LCD backpacks and sensor modules.'],
        ['D10–D13', 'SPI bus for SD cards, RFID readers and some displays. D13 also drives the L LED.'],
        ['D0 / D1', 'Hardware serial, shared with USB. Leave them unconnected while uploading.'],
        ['5V, 3V3, GND', 'Power for sensors and modules. Every GND pin is the same ground.'],
        ['VIN', 'Power input, 7–12V, through the on-board regulator.'],
        ['RST', 'Pull LOW to reset the board (same as the button).'],
        ['AREF', 'Optional reference voltage for analogRead(). Leave it unconnected unless you know you need it.'],
      ] } },
    ] },

  { id:'power', short:'Powering the Nano', title:'Powering the Nano',
    blocks:[
      { table:{ label:'Three ways to power it', head:['How', 'Voltage', 'When to use it'], rows:[
        ['USB', '5V', 'At your desk: from the computer or a phone charger. The easiest and safest while learning.'],
        ['VIN pin', '7–12V', 'From a 9V adapter or battery pack. The on-board regulator makes 5V; higher voltage means more heat.'],
        ['5V pin', 'Regulated 5V only', 'From a 5V supply module. It bypasses the regulator and has no protection — never above 5.5V.'],
      ] } },
      { note:['warn', 'Don’t feed VIN and the 5V pin at the same time, and never put more than 5V on any I/O pin.'] },
      { note:['warn', 'Servos, motors and long LED strips draw more current than the Nano can supply. Give them their own 5V supply and connect its GND to the Nano’s GND.'] },
      { list:{ label:'Current budget', items:[
        'One I/O pin: keep it under 20 mA — one LED with a 220Ω resistor is about 14 mA.',
        'All pins together: stay under about 200 mA.',
        'Anything bigger (relays, motors, fans) goes through a transistor or MOSFET, with a flyback diode for coils and motors.',
      ] } },
    ] },

  { id:'setup', short:'Setup & first upload', title:'Setup & first upload',
    blocks:[
      { steps:{ label:'Get Blink running', items:[
        'Install the free Arduino IDE 2 from arduino.cc.',
        'Connect the Nano with a data USB cable — some cheap cables only charge.',
        'If no port appears, install the CH340 driver (most clone Nanos use this USB chip).',
        'Tools → Board → Arduino AVR Boards → Arduino Nano.',
        'Tools → Processor → “ATmega328P”, or “ATmega328P (Old Bootloader)” — most clones need the old bootloader option.',
        'Tools → Port → choose the port that appeared when you plugged the Nano in.',
        'File → Examples → 01.Basics → Blink, then click Upload (→).',
        'The L LED blinks once a second. Open Tools → Serial Monitor at 9600 baud for Serial.print() output.',
      ] } },
      { table:{ label:'If it goes wrong', head:['Problem', 'Fix'], rows:[
        ['No port appears', 'Try another cable (data, not charge-only) and install the CH340 driver.'],
        ['“stk500_getsync(): not in sync”', 'Switch the Processor to “ATmega328P (Old Bootloader)”, check the port, and unplug anything on D0/D1.'],
        ['“Access denied” / port busy', 'Close the Serial Monitor or any other program using the port, then upload again.'],
        ['Upload succeeds but nothing happens', 'Check the pin numbers in the code match your wiring, and that the LED is the right way round.'],
        ['The Nano resets when a motor or servo moves', 'Power the motor or servo separately, join the grounds, and add a 100 µF capacitor across its supply.'],
        ['An input reads random values', 'The pin is floating — use INPUT_PULLUP or a pull-down resistor.'],
      ] } },
    ] },

  { id:'breadboard', short:'Wiring on a breadboard', title:'Wiring the Nano on a breadboard',
    blocks:[
      { list:{ items:[
        'Push the Nano across the centre gap so each pin gets its own row of four holes.',
        'Soldering the headers yourself? Put them in the breadboard first and the Nano on top — the breadboard holds them straight.',
        'Run the Nano’s 5V and GND pins to the breadboard’s + and − rails, and power everything from those rails.',
        'Every part must share the same ground (GND) — including separate supplies for servos and motors.',
        'Keep the USB end at the edge of the breadboard so the cable doesn’t pull wires out.',
        'Change wiring with the USB unplugged.',
        'Use short, colour-coded wires: red for 5V, black for GND, other colours for signals.',
      ] } },
    ] },

  { id:'path', short:'Project path (30)', title:'Nano beginner project path',
    blocks:[
      { p:'30 projects in four levels, from basic to advanced. Tick each one off when you have built it, measured it and understood it.' },
      { projects:true },
    ] },

  { id:'starters', short:'First 5 projects', title:'The 5 projects to start with',
    blocks:[
      { p:'Build these in order. Each one has the circuit, what you learn, and a complete sketch to upload.' },
      { starters:true },
    ] },

  { id:'sequence', short:'First 10 sequence', title:'Your first 10-project sequence',
    blocks:[
      { p:'The exact order to follow — from the projects above.' },
      { sequence:true },
    ] },

  { id:'iot', short:'Nano → IoT', title:'Then move toward actual IoT',
    blocks:[
      { p:'Arduino Nano is not necessarily IoT: a classic Nano has no Wi-Fi. Your progression can be:' },
      { pre:{ text:
`Electronics
     │
     ▼
Arduino Nano
     │
     ├── LEDs
     ├── Buttons
     ├── Motors
     ├── Sensors
     └── Displays
             │
             ▼
       Serial Communication
             │
             ▼
       ESP32 / Wi-Fi MCU
             │
             ▼
          MQTT / HTTP
             │
             ▼
        NestJS Backend
             │
             ▼
       React Dashboard` } },
      { note:['key', 'That fits very nicely with your eventual ESP32 + React + NestJS RC / IoT system. Everything you learn on the Nano — pins, sensors, PWM, I2C — carries straight over to the ESP32.'] },
    ] },

  { id:'mistakes', short:'Common mistakes', title:'Common mistakes (and how to avoid them)',
    blocks:[
      { table:{ head:['Mistake', 'What happens', 'Do this instead'], rows:[
        ['LED without a resistor', 'Too much current — the LED or the pin is damaged.', 'Always add 220–330Ω in series.'],
        ['Floating input', 'The pin reads random HIGH/LOW values.', 'Use INPUT_PULLUP or a 10kΩ pull-down.'],
        ['Servo or motor on the 5V pin', 'The Nano resets or behaves strangely.', 'Separate 5V supply, shared GND.'],
        ['No common ground', 'Signals don’t work between two supplies.', 'Connect every GND together.'],
        ['Wires on D0/D1 while uploading', 'Upload fails.', 'Keep D0/D1 free, or unplug them while uploading.'],
        ['digitalRead() on A6/A7', 'Always reads nothing useful.', 'Use A0–A5 for digital signals.'],
        ['analogWrite() on a non-PWM pin', 'The LED is just on or off, no dimming.', 'Use ~D3, D5, D6, D9, D10 or D11.'],
        ['Motor or relay straight on a pin', 'The pin is damaged; spikes reset the board.', 'Transistor or MOSFET plus a flyback diode.'],
        ['5V sensor output into a 3.3V board later', 'Damages the ESP32 pin.', 'Voltage divider or level shifter (the Nano itself is 5V).'],
      ] } },
    ] },

  { id:'buy', short:'Buy list', title:'Buy list for the Nano projects',
    blocks:[
      { p:'Everything the 30 projects need, with estimated prices in Indian rupees. Tick what you already have and it drops out of the total; tick Add on any extra to include it.' },
      { buy:true },
    ] },
  ],

  /* ---------- the 30 projects ---------- */
  levels:[
    { n:1, title:'Level 1 — Electrical fundamentals', projects:[
      [1, 'LED ON/OFF', 'GPIO, polarity, current limiting', 'Nano, LED, 220Ω resistor'],
      [2, 'Multiple LED controller', 'Digital outputs, common ground', 'Nano, 3–5 LEDs, resistors'],
      [3, 'Traffic light', 'Sequential control, timing', 'Nano, red / yellow / green LEDs, resistors'],
      [4, 'Push button LED', 'Digital input, pull-up / pull-down', 'Nano, button, LED, resistor'],
      [5, 'LED toggle switch', 'State management', 'Nano, button, LED'],
      [6, 'Potentiometer LED dimmer', 'Analog input, voltage divider', 'Nano, potentiometer, LED'],
      [7, 'Potentiometer servo control', 'Analog → PWM', 'Nano, potentiometer, servo'],
      [8, 'Buzzer alarm', 'Output, frequency, basic sound', 'Nano, buzzer, button'],
    ] },
    { n:2, title:'Level 2 — Sensors', projects:[
      [9, 'LDR automatic light', 'Analog sensor reading', 'LDR, resistor, LED'],
      [10, 'Light level indicator', 'Sensor → multiple outputs', 'LDR, LEDs, resistors'],
      [11, 'Temperature monitor', 'Sensor measurement', 'Temperature sensor (DHT11 or LM35), Nano'],
      [12, 'Temperature alarm', 'Threshold logic', 'Temperature sensor, buzzer, LED'],
      [13, 'Ultrasonic distance meter', 'Timing + sensors', 'HC-SR04, Nano'],
      [14, 'Parking distance alert', 'Distance → buzzer frequency', 'HC-SR04, buzzer'],
      [15, 'Motion detector', 'Digital sensor input', 'PIR sensor, LED, buzzer'],
      [16, 'Automatic night light', 'Combining sensors + output', 'LDR, PIR, LED'],
    ] },
    { n:3, title:'Level 3 — Small IoT-style systems', intro:'Once the above feels comfortable.', projects:[
      [17, 'Mini weather station', 'Temperature / humidity + Serial Monitor', 'DHT11 or DHT22, Nano'],
      [18, 'Digital distance display', 'Sensor + LCD / OLED', 'HC-SR04, 0.96″ OLED or 16×2 I2C LCD'],
      [19, 'Smart room light', 'LDR + motion sensor + LED', 'LDR, PIR, LED'],
      [20, 'Temperature-controlled fan', 'Sensor + transistor / MOSFET + fan', 'DHT11, 2N2222 or MOSFET, 1N4007, 5V fan'],
      [21, 'Water level monitor', 'Sensor + threshold + alarm', 'Water-level sensor, buzzer, LED'],
      [22, 'Door open alarm', 'Magnetic / reed switch + buzzer', 'Reed switch + magnet, buzzer'],
      [23, 'Servo door lock', 'Sensor + servo + access logic', 'Keypad or button code, SG90 servo'],
      [24, 'Mini security system', 'PIR + reed switch + buzzer + keypad', 'PIR, reed switch, buzzer, 4×4 keypad'],
    ] },
    { n:4, title:'Level 4 — Advanced', intro:'Techniques that make projects fast, efficient and ready to talk to other boards.', projects:[
      [25, 'RPM meter with interrupts', 'Hardware interrupts (attachInterrupt), counting fast pulses', 'A3144 Hall sensor + magnet, OLED'],
      [26, 'Low-power battery sensor', 'Sleep modes, measuring and budgeting current', 'DHT11, 4×AA battery pack, multimeter'],
      [27, 'Settings that survive power-off', 'EEPROM storage', 'Potentiometer, button, LED (EEPROM is built in)'],
      [28, 'LED bar with a shift register', 'Serial-to-parallel shifting, more outputs', '74HC595, 8 LEDs, resistors'],
      [29, 'Stepper motor positioner', 'Steps, drivers, precise motion', '28BYJ-48 + ULN2003, potentiometer'],
      [30, 'Nano → ESP32 serial bridge', 'UART between two boards, 5V → 3.3V level shifting', 'ESP32 DevKit, 1kΩ + 2kΩ divider'],
    ] },
  ],

  sequence:['LED + resistor', 'Button + LED', 'Traffic light', 'Potentiometer + LED', 'Potentiometer + servo',
    'LDR automatic light', 'Temperature monitor', 'Ultrasonic distance meter', 'PIR security light', 'Mini smart room'],

  /* ---------- the 5 starter projects ---------- */
  starters:[
    { n:1, title:'LED + resistor', goal:'Understand the most basic circuit.',
      diagram:
`Nano D2
  │
  │
220Ω
  │
 LED
  │
 GND`,
      learn:['Voltage', 'Current', 'Resistance', 'LED polarity', 'Why the resistor is required', 'Digital HIGH / LOW', 'Measuring voltage with a multimeter'],
      measure:['Voltage across the LED (red: about 1.8–2.0V)', 'Voltage across the resistor (about 3V)', 'Current: resistor voltage ÷ 220Ω ≈ 13–14 mA — or measure it with the meter in series'],
      code:`// Project 1 — LED + resistor on D2
const int LED = 2;

void setup() {
  pinMode(LED, OUTPUT);
}

void loop() {
  digitalWrite(LED, HIGH);   // D2 = 5V: current flows through the resistor and LED
  delay(1000);
  digitalWrite(LED, LOW);    // D2 = 0V: no current
  delay(1000);
}` },
    { n:2, title:'Push button + LED', goal:'Read an input and drive an output.',
      diagram:
`Button
   │
Nano D2 ──────> read input

Nano D3 ──> LED ──> GND`,
      diagramNote:'The button goes between D2 and GND. Put a 220Ω resistor in series with the LED.',
      learn:['Digital input', 'Digital output', 'Pull-up resistor', 'Switch behaviour', 'Floating inputs', 'INPUT_PULLUP'],
      noteKey:'This is an important electronics project, not just an Arduino coding exercise.',
      code:`// Project 2 — push button + LED
const int BUTTON = 2;   // button between D2 and GND
const int LED = 3;      // D3 -> 220Ω -> LED -> GND

void setup() {
  pinMode(BUTTON, INPUT_PULLUP);   // internal pull-up: released = HIGH, pressed = LOW
  pinMode(LED, OUTPUT);
}

void loop() {
  bool pressed = digitalRead(BUTTON) == LOW;
  digitalWrite(LED, pressed);
}` },
    { n:3, title:'Potentiometer → LED brightness', goal:'Turn an analog voltage into LED brightness.',
      diagram:
`        +5V
         │
      ┌──┴──┐
      │ POT │
      └──┬──┘
         │
         └──── A0

D3 PWM ──> LED ──> resistor ──> GND`,
      diagramNote:'The pot’s other outer pin goes to GND.',
      learn:['Analog voltage', 'ADC', 'Voltage divider', 'analogRead()', 'PWM', 'analogWrite()', 'Mapping sensor values to output'],
      noteTip:'This is where electronics and programming start connecting nicely.',
      code:`// Project 3 — potentiometer sets the LED brightness
const int POT = A0;     // wiper; outer pins to 5V and GND
const int LED = 3;      // D3 is a PWM pin (~)

void setup() {
  pinMode(LED, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int raw = analogRead(POT);                    // 0–1023 for 0–5V
  int brightness = map(raw, 0, 1023, 0, 255);   // PWM range
  analogWrite(LED, brightness);
  Serial.print(raw);
  Serial.print(" -> ");
  Serial.println(brightness);
  delay(50);
}` },
    { n:4, title:'LDR automatic night light', goal:'Switch a light from a sensor, reliably.',
      diagram:
`        +5V
         │
        LDR
         │
         ├──── A0
         │
       10kΩ
         │
        GND


D3 ──> resistor ──> LED ──> GND`,
      behaviour:[['Bright', 'LDR value', 'Arduino', 'LED OFF'], ['Dark', 'LDR value', 'Arduino', 'LED ON']],
      learn:['Sensor circuits', 'Voltage divider', 'Analog measurements', 'Thresholds', 'Calibration', 'Real-world sensor noise'],
      code:`// Project 4 — LDR automatic night light
const int LDR = A0;     // 5V -> LDR -> A0 -> 10k -> GND (brighter = higher reading)
const int LED = 3;
const int DARK = 300;   // calibrate: watch the Serial Monitor in your room
const int LIGHT = 350;  // the gap between the two stops flicker (hysteresis)
bool on = false;

void setup() {
  pinMode(LED, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int level = analogRead(LDR);
  if (!on && level < DARK) on = true;     // dark   -> LED ON
  if (on && level > LIGHT) on = false;    // bright -> LED OFF
  digitalWrite(LED, on);
  Serial.println(level);
  delay(100);
}` },
    { n:5, title:'Ultrasonic parking sensor', goal:'Build a useful physical system with several outputs.',
      diagram:
`HC-SR04
 ┌──────────────┐
 │ TRIG         │── Nano
 │ ECHO         │── Nano
 │ VCC          │── 5V
 │ GND          │── GND
 └──────────────┘
        │
        ↓
   Distance
        ↓
   Arduino
        ↓
 ┌──────┴───────┐
 │              │
Buzzer         LEDs`,
      diagramNote:'In the sketch: TRIG → D9, ECHO → D10, active buzzer → D8, green / yellow / red LEDs (with 220Ω) → D4 / D5 / D6.',
      rules:[['> 100 cm', 'Green', '#22a55b'], ['50–100 cm', 'Yellow', '#f4c11e'], ['20–50 cm', 'Red', '#e5484d'], ['< 20 cm', 'Fast buzzer', '#8b5cf6']],
      learn:['Digital communication with a sensor', 'Timing', 'Distance calculation', 'Conditional logic', 'Multiple outputs', 'Building a useful physical system'],
      code:`// Project 5 — ultrasonic parking sensor
const int TRIG = 9, ECHO = 10, BUZZER = 8;     // active buzzer on D8
const int GREEN = 4, YELLOW = 5, RED = 6;

long readCm() {
  digitalWrite(TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG, HIGH);                    // a 10 µs trigger pulse
  delayMicroseconds(10);
  digitalWrite(TRIG, LOW);
  long us = pulseIn(ECHO, HIGH, 30000);        // give up after 30 ms (about 5 m)
  if (us == 0) return 999;                     // no echo: nothing in range
  return us / 58;                              // there and back at the speed of sound
}

void show(bool g, bool y, bool r) {
  digitalWrite(GREEN, g);
  digitalWrite(YELLOW, y);
  digitalWrite(RED, r);
}

void setup() {
  pinMode(TRIG, OUTPUT);
  pinMode(ECHO, INPUT);
  pinMode(BUZZER, OUTPUT);
  pinMode(GREEN, OUTPUT);
  pinMode(YELLOW, OUTPUT);
  pinMode(RED, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  long cm = readCm();
  Serial.println(cm);
  if (cm > 100)     { show(1, 0, 0); digitalWrite(BUZZER, LOW); }
  else if (cm > 50) { show(0, 1, 0); digitalWrite(BUZZER, LOW); }
  else if (cm > 20) { show(0, 0, 1); digitalWrite(BUZZER, LOW); }
  else {                                       // closer than 20 cm: fast beeps
    show(0, 0, 1);
    digitalWrite(BUZZER, HIGH);
    delay(60);
    digitalWrite(BUZZER, LOW);
  }
  delay(60);
}` },
  ],

  /* ---------- buy list: [name, qty, low ₹, high ₹, projects, note?] ---------- */
  buy:{
    groups:[
      { title:'Board', items:[
        ['Arduino Nano (CH340, headers soldered)', 1, 250, 400, '1–24', 'An original costs much more; a clone works the same once the CH340 driver is installed.'],
        ['USB cable for the Nano (data, not charge-only)', 1, 60, 120, '1–24', 'Match your Nano’s connector: Mini-USB, Micro-USB or USB-C.'],
      ] },
      { title:'Basics', items:[
        ['Full-size breadboard (830-point)', 1, 90, 150, '1–24'],
        ['Male-to-male jumper wires (pack of 40)', 1, 60, 100, '1–24'],
        ['Male-to-female jumper wires (pack of 40)', 1, 60, 100, '13–24', 'Sensor modules have male pins.'],
        ['220Ω resistor', 20, 0.5, 1, '1–4, 6, 9, 10'],
        ['10kΩ resistor', 10, 0.5, 1, '4, 9, 10, 16, 19'],
        ['1kΩ resistor', 10, 0.5, 1, '20', 'Transistor base resistor.'],
        ['5mm LEDs — red, yellow, green (5 each)', 15, 1, 2, '1–4, 9–12, 15, 16'],
        ['6×6mm push button', 5, 1, 3, '4, 5, 8'],
        ['10kΩ potentiometer', 2, 10, 20, '6, 7'],
      ] },
      { title:'Sensors', items:[
        ['LDR (photoresistor)', 2, 3, 6, '9, 10, 16, 19'],
        ['DHT11 temperature & humidity sensor', 1, 60, 120, '11, 12, 17, 20'],
        ['HC-SR04 ultrasonic sensor', 1, 60, 120, '13, 14, 18'],
        ['PIR motion sensor (HC-SR501)', 1, 80, 150, '15, 16, 19, 24'],
        ['Water-level sensor', 1, 20, 50, '21'],
        ['Reed switch + magnet', 2, 15, 40, '22, 24'],
      ] },
      { title:'Outputs & drivers', items:[
        ['5V active buzzer', 1, 8, 15, '8, 12, 14, 15, 21, 22, 24'],
        ['Passive buzzer', 1, 8, 15, '8, 14', 'For tones that change with distance.'],
        ['SG90 micro servo', 1, 90, 150, '7, 23'],
        ['0.96″ I2C OLED display', 1, 150, 250, '18'],
        ['4×4 membrane keypad', 1, 50, 100, '23, 24'],
        ['Small 5V DC fan', 1, 60, 120, '20'],
        ['2N2222 transistor', 3, 2, 4, '20', 'Switches the fan.'],
        ['1N4007 diode', 3, 0.5, 1.5, '20', 'Flyback diode across the fan.'],
      ] },
      { title:'Level 4 — advanced', items:[
        ['A3144 Hall sensor + small magnets', 2, 10, 20, '25'],
        ['74HC595 shift register', 1, 5, 12, '28'],
        ['28BYJ-48 stepper + ULN2003 driver', 1, 120, 200, '29'],
        ['2kΩ resistor', 5, 0.5, 1, '30', 'With 1kΩ, divides the Nano’s 5V TX down to 3.3V for the ESP32.'],
        ['4×AA battery holder with switch', 1, 40, 70, '26'],
      ] },
      { title:'Power & tools', items:[
        ['5V 2A adapter or USB power bank', 1, 120, 200, '7, 20, 23, 29', 'A separate supply for the servo, fan and stepper.'],
        ['Digital multimeter', 1, 300, 800, '1–24', 'You already own one — ticked by default.'],
      ] },
    ],
    owned:['Digital multimeter'],
    extras:[
      { title:'Extras', note:'Useful, but not required by the 30 projects.', items:[
        ['Alligator clip test leads (pack of 10)', 1, 60, 120, 'Hands-free multimeter measurements.', true],
        ['Nano screw-terminal expansion board', 1, 80, 150, 'Screw terminals for every pin — tidy, semi-permanent wiring.'],
        ['LM35 temperature sensor', 1, 40, 80, 'An analog alternative for projects 11–12: 10 mV per °C.'],
        ['DHT22 temperature & humidity sensor', 1, 150, 250, 'More accurate than the DHT11 for the weather station.'],
        ['16×2 LCD with I2C backpack', 1, 150, 250, 'An alternative display for project 18.'],
        ['Second Arduino Nano', 1, 250, 400, 'Keep one project built while you start the next.'],
        ['ESP32 DevKit', 1, 350, 600, 'Needed for project 30 if you don’t have one yet — your next board after the Nano.'],
      ] },
    ],
    tips:[
      'Prices are estimates — they vary a lot by seller and quality. Check before you order.',
      'Many of these parts overlap with the other buy lists in the lab — tick what you already have.',
      'If you can’t solder yet, buy a Nano with the headers already soldered.',
      'Order everything together to avoid paying ₹40–80 shipping more than once.',
    ],
  },
};
