/* Arduino UNO guide (guides.html). Same block format as js/nano.js.
   Project rows: [number, name, what you learn, main components, matching lesson in the lab’s Arduino tab?] */

const UNO = {
  id:'uno',
  menu:'Arduino UNO',
  blurb:'The reference Arduino, and the board you already own. Learn the board, its shields and its power, then work through 28 projects in five levels — from Blink to robots, data loggers and an ESP32 bridge.',
  keys:{ done:'lab-uno-guide', buy:'lab-uno-guide-buy' },
  sections:[
  { id:'start', short:'Start here', title:'Start here',
    blocks:[
      { p:'The UNO is the reference Arduino: every tutorial, library and shield is written for it first. It uses the same ATmega328P chip as the Nano, so everything you learn transfers — but it is bigger, has a replaceable chip on the original R3, a barrel-jack power input and the shield header layout.' },
      { note:['key', 'You already own an UNO. Most projects below have a matching lesson with complete code in the lab’s Arduino tab — open it next to this guide.'] },
      { flow:{ label:'For every project, use the same cycle', steps:['Build', 'Measure', 'Understand', 'Break it', 'Fix it', 'Modify it'] } },
      { p:'The projects are split into five levels, from basic to advanced. Finish a level before starting the next: each one assumes the skills of the level before.' },
    ] },

  { id:'meet', short:'Meet the UNO', title:'Meet the Arduino UNO',
    blocks:[
      { cards:{ label:'What is on the board', items:[
        ['USB-B connector', 'Power and programming with the square “printer” USB cable.'],
        ['USB-to-serial chip', 'The original R3 uses a second microcontroller, the ATmega16U2. Most clones use the CH340, which may need a driver.'],
        ['ATmega328P in a DIP socket', 'On the original R3 the main chip plugs into a socket — if you damage it, you can replace a ₹200 chip instead of the board. Many clones use a soldered SMD chip.'],
        ['16 MHz crystal', 'Keeps timing accurate for delay(), millis() and serial communication.'],
        ['5V and 3.3V regulators', 'Make 5V from the barrel jack or VIN, and a small 3.3V supply for low-power sensors.'],
        ['DC barrel jack', '7–12V input (2.1mm, centre positive) for running away from the computer.'],
        ['Reset button', 'Restarts your sketch. Shields usually repeat it on top.'],
        ['LEDs: ON, L, TX, RX', 'ON = powered, L = the LED on pin 13, TX / RX = USB data activity.'],
        ['Two ICSP headers', 'One for the ATmega328P and one for the USB chip — for re-installing bootloaders or programming other chips.'],
        ['Female headers', 'Plug wires straight in, or stack a shield on top. IOREF tells shields the board’s logic voltage (5V).'],
      ] } },
      { table:{ label:'The UNO family — this guide is about the UNO R3', head:['Board', 'Chip', 'Logic', 'Notes'], rows:[
        ['UNO R3 (original)', 'ATmega328P (DIP) + ATmega16U2', '5V', 'The classic reference board. Replaceable chip.'],
        ['UNO R3 compatible (clone)', 'ATmega328P (DIP or SMD) + CH340', '5V', 'Works the same after installing the CH340 driver.'],
        ['UNO R4 Minima', 'Renesas RA4M1, 32-bit, 48 MHz', '5V', 'USB-C, more memory, a real DAC. Most sketches work; some libraries don’t.'],
        ['UNO R4 WiFi', 'RA4M1 + ESP32-S3', '5V', 'Adds Wi-Fi, Bluetooth and a 12×8 LED matrix — the UNO that can do IoT.'],
      ] } },
    ] },

  { id:'specs', short:'Specifications', title:'Specifications',
    blocks:[
      { table:{ head:['Feature', 'UNO R3'], rows:[
        ['Microcontroller', 'ATmega328P, 8-bit AVR, 16 MHz'],
        ['Operating voltage', '5V'],
        ['Input voltage', '7–12V recommended on the barrel jack or VIN (6–20V limits)'],
        ['Digital I/O pins', '14 (D0–D13), of which 6 are PWM: 3, 5, 6, 9, 10, 11'],
        ['Analog inputs', '6 (A0–A5), 10-bit: 0–5V reads as 0–1023'],
        ['Program memory', '32 KB flash (0.5 KB used by the bootloader)'],
        ['SRAM / EEPROM', '2 KB / 1 KB'],
        ['Current per I/O pin', '20 mA recommended, 40 mA absolute maximum'],
        ['Total I/O current', 'About 200 mA for all pins together'],
        ['3.3V pin', 'About 150 mA on an original R3 — less on some clones'],
        ['5V pin', 'About 500 mA from USB (protected by a resettable fuse); from the barrel jack, limited by regulator heat'],
        ['Serial / I2C / SPI', 'D0–D1 · A4–A5 (also on the SDA/SCL pins) · D10–D13 (also on the ICSP header)'],
        ['External interrupts', 'D2, D3'],
        ['Size / weight', '68.6 × 53.4 mm, about 25 g'],
      ] } },
    ] },

  { id:'pinout', short:'Pinout', title:'Pinout',
    blocks:[
      { pinout:'uno' },
      { table:{ label:'What the pins do', head:['Pins', 'Use them for'], rows:[
        ['D2–D13', 'Digital input or output. D13 also drives the L LED.'],
        ['~3, ~5, ~6, ~9, ~10, ~11', 'PWM with analogWrite(): dimming LEDs, motor speed.'],
        ['D2, D3', 'Interrupts for fast pulses (encoders, flow and Hall sensors).'],
        ['A0–A5', 'Analog input; also usable as digital pins. (The UNO has no A6/A7.)'],
        ['A4 / A5 = SDA / SCL', 'I2C — repeated on the two pins beside AREF for shields.'],
        ['D10–D13', 'SPI: SS, MOSI, MISO, SCK — also on the ICSP header.'],
        ['D0 / D1', 'Serial RX / TX, shared with USB — keep free while uploading.'],
        ['5V, 3.3V, GND, VIN', 'Power pins. VIN carries the barrel-jack voltage.'],
        ['IOREF', 'Tells shields the logic voltage (5V on the UNO).'],
        ['AREF', 'Optional reference voltage for analogRead().'],
      ] } },
    ] },

  { id:'power', short:'Powering the UNO', title:'Powering the UNO',
    blocks:[
      { table:{ label:'Four ways to power it', head:['How', 'Voltage', 'When to use it'], rows:[
        ['USB', '5V', 'At your desk. Protected by a resettable fuse.'],
        ['Barrel jack', '7–12V', 'A 9V adapter or battery pack — the UNO switches over automatically.'],
        ['VIN pin', '7–12V', 'Same as the barrel jack, from wires.'],
        ['5V pin', 'Regulated 5V only', 'Bypasses the regulator and its protection. Never above 5.5V.'],
      ] } },
      { note:['warn', 'The 5V regulator turns extra voltage into heat: (input − 5V) × current. At 12V and 300 mA that is 2.1W — too hot. Use 7–9V, and power heavy loads separately.'] },
      { note:['warn', 'Servos, motors, relays and LED strips need their own supply. Always connect that supply’s GND to the UNO’s GND.'] },
    ] },

  { id:'setup', short:'Setup & first upload', title:'Setup & first upload',
    blocks:[
      { steps:{ label:'Get Blink running', items:[
        'Install Arduino IDE 2 from arduino.cc.',
        'Connect the UNO with a USB-B cable.',
        'Clone board with no port? Install the CH340 driver.',
        'Tools → Board → Arduino AVR Boards → Arduino Uno. (An UNO R4 needs the “Arduino UNO R4 Boards” package from the Boards Manager.)',
        'Tools → Port → the port that appears when you plug it in.',
        'File → Examples → 01.Basics → Blink, then Upload.',
        'The L LED blinks. Open the Serial Monitor at 9600 baud for printed output.',
      ] } },
      { table:{ label:'If it goes wrong', head:['Problem', 'Fix'], rows:[
        ['No port', 'Try another cable and install the CH340 driver (clones).'],
        ['“stk500_getsync(): not in sync”', 'Check the board and port, and disconnect anything on D0/D1 or a shield using them.'],
        ['Port busy', 'Close the Serial Monitor or other programs using the port.'],
        ['Board resets when a motor starts', 'Separate motor supply, shared GND, and a 100 µF capacitor across the motor supply.'],
        ['Shield doesn’t work', 'Check which pins it uses — two shields or a shield plus your wiring may use the same pin.'],
      ] } },
    ] },

  { id:'shields', short:'Shields', title:'Shields — the UNO superpower',
    blocks:[
      { p:'A shield is a board that plugs straight on top of the UNO’s headers. It adds a function without wiring — and most expose the pins again on top so you can stack more.' },
      { cards:{ items:[
        ['Prototype shield', 'A small breadboard or solder area on top of the UNO — turn a breadboard circuit into a tidy, permanent one.'],
        ['Sensor shield (V5)', 'Every pin as a 3-pin G/V/S header — plug servos and sensor modules in directly.'],
        ['Multi-function shield', '4-digit display, buttons, buzzer and LEDs on one board — great for practising code without wiring.'],
        ['L293D motor shield', 'Drives 4 DC motors or 2 steppers plus 2 servos — quick robot builds (old but easy).'],
        ['LCD keypad shield', 'A 16×2 LCD with five buttons — menus and settings.'],
        ['Data-logging shield', 'SD card slot and a real-time clock — timestamped logging.'],
        ['Ethernet shield', 'Wired network for the UNO — web servers and MQTT before you move to Wi-Fi boards.'],
      ] } },
      { note:['tip', 'Before stacking, check which pins each shield uses. Two shields on the same pins will fight each other.'] },
    ] },

  { id:'compare', short:'UNO vs Nano', title:'UNO vs Nano — which to use when',
    blocks:[
      { table:{ head:['', 'UNO', 'Nano'], rows:[
        ['Chip', 'ATmega328P — same code', 'ATmega328P — same code'],
        ['Size', '68.6 × 53.4 mm', '18 × 45 mm, fits a breadboard'],
        ['Power input', 'Barrel jack + USB-B', 'VIN pin + mini/USB-C'],
        ['Analog inputs', '6', '8 (A6, A7 analog only)'],
        ['Shields', 'Yes — the whole ecosystem', 'No'],
        ['Replaceable chip', 'Yes, on the original R3', 'No'],
        ['Best for', 'Learning at the desk, shields, prototypes', 'Compact and permanent builds'],
      ] } },
    ] },

  { id:'path', short:'Project path (28)', title:'UNO project path — basic to advanced',
    blocks:[
      { p:'28 projects in five levels. Many link to a lesson with complete code in the lab’s Arduino tab. Tick each project when you have built it, measured it and understood it.' },
      { projects:true },
    ] },

  { id:'sequence', short:'First 10 sequence', title:'Your first 10 UNO projects',
    blocks:[
      { p:'If you only do ten, do these, in this order.' },
      { sequence:true },
    ] },

  { id:'mistakes', short:'Common mistakes', title:'Common UNO mistakes',
    blocks:[
      { table:{ head:['Mistake', 'What happens', 'Do this instead'], rows:[
        ['12V on the barrel jack with loads on 5V', 'The regulator overheats and shuts down.', 'Use 7–9V, and power loads separately.'],
        ['Motors or servos on the 5V pin', 'Resets and glitches.', 'Separate supply, shared GND.'],
        ['Wi-Fi modules on the 3.3V pin', 'Brown-outs — the pin can’t supply enough current.', 'Use a proper 3.3V regulator module.'],
        ['Stacked shields using the same pins', 'Neither works properly.', 'Check the pin maps before stacking.'],
        ['LED without a resistor', 'Damaged LED or pin.', '220–330Ω in series.'],
        ['Floating input', 'Random readings.', 'INPUT_PULLUP or a pull-down resistor.'],
        ['5V output into a 3.3V ESP32', 'Damages the ESP32 pin.', 'Voltage divider or level shifter.'],
      ] } },
    ] },

  { id:'iot', short:'UNO → IoT', title:'From UNO to IoT',
    blocks:[
      { p:'A classic UNO has no Wi-Fi. There are three ways forward — pick the ESP32 route for your RC and IoT goals.' },
      { flow:{ label:'Route 1 — add an ESP32 as a Wi-Fi bridge (project 28)', steps:['UNO sensors', 'Serial (UART)', 'ESP32', 'MQTT / HTTP', 'Dashboard'] } },
      { flow:{ label:'Route 2 — move to an UNO R4 WiFi', steps:['Same UNO shape', 'Built-in Wi-Fi', 'MQTT / HTTP'] } },
      { flow:{ label:'Route 3 — move straight to the ESP32 (recommended)', steps:['UNO skills', 'ESP32', 'MQTT', 'NestJS backend', 'React dashboard'] } },
    ] },

  { id:'buy', short:'Buy list', title:'Buy list for the UNO projects',
    blocks:[
      { p:'Everything the 28 projects need, grouped by level, with estimated prices in Indian rupees. Your UNO, its cable and your multimeter are ticked as already owned.' },
      { buy:true },
    ] },
  ],

  levels:[
    { n:1, title:'Level 1 — Basics: digital I/O', projects:[
      [1, 'Blink & Morse code', 'Digital output, timing', 'UNO (built-in LED)', 'Blink · SOS in Morse code'],
      [2, 'Traffic light with pedestrian button', 'Sequencing, inputs', '3 LEDs, button, resistors', 'Traffic lights · State machine'],
      [3, 'Button counter', 'Digital input, debounce, Serial Monitor', 'Button', 'Button press counter'],
      [4, 'LED chaser', 'Arrays and loops', '6 LEDs, resistors', 'LED chaser'],
      [5, 'Binary counter', 'Bits and bytes', '4 LEDs, button', 'Binary counter'],
      [6, 'Reaction timer game', 'millis(), random numbers', 'LED, button', 'Reaction timer game'],
    ] },
    { n:2, title:'Level 2 — Analog input & sound', projects:[
      [7, 'Potentiometer dimmer', 'analogRead(), PWM', 'Potentiometer, LED', 'PWM: fade and dim'],
      [8, 'RGB colour mixer', 'Three PWM channels', 'RGB LED, 3 potentiometers', 'RGB rainbow'],
      [9, 'Light meter & night light', 'LDR divider, hysteresis', 'LDR, 10kΩ, LED', 'Night light with an LDR'],
      [10, 'Melody player', 'tone(), arrays of notes', 'Passive buzzer', 'Play a melody'],
      [11, 'Light theremin', 'Sensor → frequency, calibration', 'LDR, passive buzzer', 'Light theremin'],
    ] },
    { n:3, title:'Level 3 — Sensors & displays', projects:[
      [12, 'NTC thermometer', 'Converting resistance to temperature', 'NTC 10k, 10kΩ', 'Thermometer with an NTC'],
      [13, 'Weather display', 'Digital sensors, I2C LCD', 'DHT11, 16×2 I2C LCD', 'LCD thermometer'],
      [14, 'Ultrasonic distance on an OLED', 'Pulse timing, I2C graphics', 'HC-SR04, 0.96″ OLED'],
      [15, 'PIR alarm with arm / disarm', 'Digital sensor, state logic', 'PIR, buzzer, button, LEDs'],
      [16, '7-segment dice', 'Lookup tables, random', '7-segment display, button', 'Electronic dice on the display'],
      [17, 'Keypad code lock', 'Keypad scanning, codes', '4×4 keypad, LCD, LEDs', 'Button combination lock'],
    ] },
    { n:4, title:'Level 4 — Motors & actuators', projects:[
      [18, 'Servo knob & sweep', 'Servo library, PWM pulses', 'SG90 servo, potentiometer', 'Servo control'],
      [19, 'DC motor speed with a MOSFET', 'PWM power, flyback diode', 'IRLZ44N, DC motor, 1N4007, battery pack', 'Motor speed with a MOSFET'],
      [20, 'Motor direction with an H-bridge', 'Forward / reverse / brake', 'TB6612FNG, 2 DC motors'],
      [21, 'Stepper positioner', 'Steps and precise motion', '28BYJ-48 + ULN2003'],
      [22, 'Relay-switched lamp (low voltage)', 'Isolation, switching separate loads', 'Relay module, 12V LED lamp or strip'],
    ] },
    { n:5, title:'Level 5 — Advanced systems', projects:[
      [23, 'Data logger with SD & RTC', 'SPI files, I2C clock, timestamps', 'MicroSD module, DS3231, DHT22'],
      [24, 'RFID door lock', 'SPI reader, access logic', 'RC522, SG90, buzzer, LEDs'],
      [25, 'Line-following robot', 'Sensors → motor control', 'TCRT5000 ×2, TB6612FNG, robot chassis'],
      [26, 'Obstacle-avoiding robot', 'Scanning, decisions, motors', 'HC-SR04, SG90, TB6612FNG, robot chassis'],
      [27, 'Bluetooth phone control', 'UART, phone apps', 'HC-05, LEDs or relay'],
      [28, 'UNO ↔ ESP32 serial bridge', 'Board-to-board UART, level shifting, IoT gateway', 'ESP32 DevKit, 1kΩ + 2kΩ divider'],
    ] },
  ],

  sequence:['Blink & Morse code', 'Traffic light', 'Button counter', 'Potentiometer dimmer', 'RGB colour mixer',
    'Night light', 'NTC thermometer', 'Weather display on the LCD', 'Servo knob', 'Ultrasonic distance on the OLED'],

  buy:{
    groups:[
      { title:'Board', items:[
        ['Arduino UNO R3', 1, 450, 800, '1–28', 'You already own one — ticked. Compatible board price; an original costs more.'],
        ['USB-B cable', 1, 60, 120, '1–28', 'Usually included with the board — ticked.'],
        ['9V 1A adapter for the barrel jack', 1, 120, 200, '19–28', 'Run the UNO away from the computer.'],
      ] },
      { title:'Level 1–2 — basics, analog & sound', items:[
        ['Full-size breadboard (830-point)', 1, 90, 150, '1–28'],
        ['Male-to-male jumper wires (pack of 40)', 1, 60, 100, '1–28'],
        ['Male-to-female jumper wires (pack of 40)', 1, 60, 100, '13–28', 'For modules with male pins.'],
        ['220Ω resistor', 20, 0.5, 1, '1–11'],
        ['10kΩ resistor', 10, 0.5, 1, '9, 12'],
        ['1kΩ resistor', 10, 0.5, 1, '19, 28'],
        ['5mm LEDs, mixed colours', 20, 1, 2, '1–9, 15, 17'],
        ['6×6mm push button', 6, 1, 3, '2, 3, 5, 6, 15, 16'],
        ['10kΩ potentiometer', 3, 10, 20, '7, 8, 18'],
        ['RGB LED (common cathode)', 2, 5, 10, '8'],
        ['LDR (photoresistor)', 2, 3, 6, '9, 11'],
        ['Passive buzzer', 1, 8, 15, '10, 11'],
        ['5V active buzzer', 1, 8, 15, '15, 24'],
      ] },
      { title:'Level 3 — sensors & displays', items:[
        ['NTC 10k thermistor', 1, 5, 12, '12'],
        ['DHT11 temperature & humidity sensor', 1, 60, 120, '13'],
        ['16×2 LCD with I2C backpack', 1, 150, 250, '13, 17'],
        ['0.96″ I2C OLED display', 1, 150, 250, '14'],
        ['HC-SR04 ultrasonic sensor', 1, 60, 120, '14, 26'],
        ['PIR motion sensor (HC-SR501)', 1, 80, 150, '15'],
        ['7-segment display (common cathode)', 1, 8, 15, '16'],
        ['4×4 membrane keypad', 1, 50, 100, '17'],
      ] },
      { title:'Level 4 — motors & actuators', items:[
        ['SG90 micro servo', 1, 90, 150, '18, 24, 26'],
        ['Small DC motor (3–6V)', 1, 25, 45, '19'],
        ['IRLZ44N MOSFET', 2, 25, 50, '19'],
        ['1N4007 diode', 5, 0.5, 1.5, '19, 22'],
        ['TB6612FNG motor driver', 1, 150, 250, '20, 25, 26'],
        ['28BYJ-48 stepper + ULN2003 driver', 1, 120, 200, '21'],
        ['1-channel 5V relay module', 1, 50, 90, '22, 27'],
        ['4×AA battery holder with switch', 1, 40, 70, '19, 20'],
      ] },
      { title:'Level 5 — advanced systems', items:[
        ['MicroSD card module', 1, 40, 80, '23'],
        ['MicroSD card (8GB)', 1, 200, 350, '23'],
        ['DS3231 real-time clock', 1, 120, 200, '23'],
        ['DHT22 temperature & humidity sensor', 1, 150, 250, '23'],
        ['RC522 RFID kit (card + fob)', 1, 120, 200, '24'],
        ['TCRT5000 IR line sensor module', 2, 25, 50, '25'],
        ['2WD robot chassis kit (motors, wheels, caster)', 1, 350, 600, '25, 26'],
        ['HC-05 Bluetooth module', 1, 250, 400, '27'],
        ['ESP32 DevKit', 1, 350, 600, '28'],
        ['2kΩ resistor', 5, 0.5, 1, '28', 'With 1kΩ, divides 5V TX down to 3.3V for the ESP32.'],
      ] },
      { title:'Tools', items:[
        ['Digital multimeter', 1, 300, 800, '1–28', 'You already own one — ticked.'],
      ] },
    ],
    owned:['Arduino UNO R3', 'USB-B cable', 'Digital multimeter'],
    extras:[
      { title:'Shields & extras', note:'Not required, but they make UNO projects faster and tidier.', items:[
        ['Alligator clip test leads (pack of 10)', 1, 60, 120, 'Hands-free multimeter measurements.', true],
        ['Sensor shield V5', 1, 60, 120, 'Plug servos and sensor modules straight onto the UNO.'],
        ['Multi-function shield', 1, 150, 250, 'Display, buttons, buzzer and LEDs — practise code without wiring.'],
        ['Prototype shield', 1, 60, 120, 'Make a finished circuit permanent on top of the UNO.'],
        ['L293D motor shield', 1, 150, 250, 'Quick 4-motor robot builds.'],
        ['Arduino UNO R4 WiFi', 1, 1800, 2600, 'The UNO with built-in Wi-Fi and Bluetooth — route 2 to IoT.'],
      ] },
    ],
    tips:[
      'Prices are estimates — they vary a lot by seller and quality. Check before you order.',
      'Buy by level: you don’t need the Level 5 parts until you finish Level 4.',
      'Many parts overlap with the Nano and curriculum buy lists — tick what you already have.',
      'A 2WD chassis kit usually includes motors, wheels, a caster and a battery holder — check before buying them separately.',
    ],
  },
};
