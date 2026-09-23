/* Learning roadmap: electronics → Arduino → ESP32 → IoT → robotics.
   links: [type, id, label] — type is view, tool, board or project. exStages: exercise stages that count
   towards this step. Milestone ids are stable keys for saved ticks. */

const ROADMAP = [
{ id:'foundations', short:'Foundations', title:'Foundations: power, resistors & LEDs', weeks:'1–2 weeks',
  goal:'Get comfortable with the breadboard, the multimeter and Ohm’s law.',
  learn:['Breadboard & multimeter', 'Ohm’s law', 'Series & parallel', 'Voltage dividers', 'LEDs'],
  buy:'The “Buy now” items on the shopping list.',
  milestones:[
    ['m-buy-now', 'Order the “Buy now” starter cart'],
    ['m-multimeter', 'Measure voltage, current and resistance with the multimeter'],
    ['m-led-calc', 'Work out an LED resistor by hand, then check it with the calculator'],
  ],
  exStages:[1],
  links:[['view', 'shop', 'Shopping list'], ['tool', 'led', 'LED resistor calculator'], ['tool', 'color', 'Resistor colour code']] },

{ id:'logic', short:'Logic & capacitors', title:'Switches, logic, diodes & capacitors', weeks:'2 weeks',
  goal:'Control circuits with switches and logic gates, and see how diodes and capacitors behave.',
  learn:['Pull-up / pull-down', 'Logic gates', 'Diodes & Zeners', 'RC timing', 'Voltage regulators'],
  buy:'Already in the “Buy now” cart.',
  milestones:[
    ['m-truth', 'Write truth tables for AND, OR, NAND and XOR'],
    ['m-rc', 'Measure an RC time constant and compare it with the calculator'],
    ['m-7805', 'Build a regulated 5V supply from 9V'],
  ],
  exStages:[2, 3],
  links:[['tool', 'rc', 'RC time constant calculator'], ['tool', 'units', 'Capacitor codes']] },

{ id:'transistors', short:'Transistors & ICs', title:'Transistors, sensors, 555 & ICs', weeks:'2–3 weeks',
  goal:'Switch real loads, read simple sensors, and build timers and counters without any code.',
  learn:['NPN / PNP / MOSFET switches', 'Sensor dividers', '555 timer', 'Op-amp comparators', 'Counters & displays'],
  buy:'Already in the “Buy now” cart.',
  milestones:[
    ['m-mosfet', 'Switch an LED with a transistor and with a MOSFET'],
    ['m-555', 'Build a 555 blinker and predict its frequency with the calculator'],
    ['m-chaser', 'Build the CD4017 LED chaser'],
  ],
  exStages:[4, 5, 6, 7],
  links:[['tool', '555', '555 timer calculator'], ['view', 'sensors', 'Sensor guide — basic sensors']] },

{ id:'arduino', short:'Arduino', title:'Arduino basics', weeks:'3 weeks',
  goal:'Program the UNO: digital and analog I/O, PWM, the Serial Monitor and libraries.',
  learn:['Arduino IDE', 'digitalRead / digitalWrite', 'analogRead & PWM', 'Serial Monitor', 'Libraries'],
  buy:'Nothing new — you already have an Arduino UNO.',
  milestones:[
    ['m-blink', 'Upload Blink and change its timing'],
    ['m-button', 'Read a button with INPUT_PULLUP'],
    ['m-analog', 'Read a potentiometer and an LDR with analogRead()'],
    ['m-pwm', 'Fade an LED and move a servo with PWM'],
    ['m-redo', 'Rebuild three earlier exercises with code instead of chips'],
  ],
  links:[['board', 'uno', 'Arduino UNO pinout'], ['view', 'outputs', 'Outputs — light & sound'], ['tool', 'ohm', 'Ohm’s law calculator']] },

{ id:'modules', short:'Modules', title:'Sensor & output modules', weeks:'3 weeks',
  goal:'Use I2C, SPI and 1-Wire modules, displays and motor drivers.',
  learn:['I2C & SPI', '1-Wire', 'Displays', 'Motor drivers', 'Separate power supplies'],
  buy:'The recommended starter sensors and starter outputs.',
  milestones:[
    ['m-i2c', 'Run an I2C scanner and find your modules’ addresses'],
    ['m-display', 'Show sensor readings on an OLED or LCD'],
    ['m-motor', 'Drive a DC motor through a driver board with PWM speed'],
    ['m-servo', 'Power a servo from its own supply with shared ground'],
  ],
  links:[['view', 'sensors', 'Sensor guide'], ['view', 'outputs', 'Outputs & drivers'], ['tool', 'divider', 'Voltage divider calculator']] },

{ id:'esp32', short:'ESP32 & Wi-Fi', title:'ESP32 & Wi-Fi', weeks:'3 weeks',
  goal:'Move to the ESP32: 3.3V logic, Wi-Fi, a web page served by the board, and deep sleep.',
  learn:['3.3V logic & level shifting', 'Wi-Fi & web server', 'ESP32 ADC & touch', 'Deep sleep', 'OTA updates'],
  buy:'An ESP32 DevKit V1 (and a few level shifters).',
  milestones:[
    ['m-esp-blink', 'Set up the ESP32 in the Arduino IDE and upload Blink'],
    ['m-web', 'Control an LED from a web page on your phone'],
    ['m-level', 'Connect a 5V sensor safely through a divider or level shifter'],
    ['m-sleep', 'Measure deep-sleep current and estimate battery life'],
  ],
  links:[['board', 'esp32-devkit', 'ESP32 DevKit V1'], ['project', 'plant-monitor', 'Project: Plant monitor'], ['tool', 'battery', 'Battery life calculator']] },

{ id:'iot', short:'IoT', title:'IoT: MQTT, dashboards & a hub', weeks:'3–4 weeks',
  goal:'Send data to a broker, build dashboards, and automate everything from a Raspberry Pi hub.',
  learn:['MQTT', 'Node-RED / Home Assistant', 'Raspberry Pi hub', 'Data logging', 'Phone alerts'],
  buy:'A Raspberry Pi (optional — a PC can run the broker at first).',
  milestones:[
    ['m-mqtt', 'Publish sensor readings to an MQTT broker'],
    ['m-dash', 'Build a dashboard with live graphs'],
    ['m-alert', 'Send an alert to your phone'],
    ['m-hub', 'Run the broker and dashboard on a Raspberry Pi'],
  ],
  links:[['board', 'rpi', 'Raspberry Pi as a hub'], ['project', 'weather-station', 'Project: Weather station'], ['project', 'tank-monitor', 'Project: Water-tank monitor'], ['project', 'energy-monitor', 'Project: Energy monitor']] },

{ id:'advanced', short:'Advanced', title:'Robotics & advanced builds', weeks:'Ongoing',
  goal:'Combine everything into bigger builds — then make them permanent.',
  learn:['Motor control & IMUs', 'GPS & wireless control', 'Air-quality sensing', 'Soldering & enclosures', 'PCB design (KiCad)'],
  buy:'A robot chassis, and the “Buy later” soldering tools.',
  milestones:[
    ['m-car', 'Build the RC car and drive it wirelessly'],
    ['m-solder', 'Solder a finished project onto perfboard'],
    ['m-pcb', 'Design your first PCB in KiCad'],
  ],
  links:[['project', 'rc-car', 'Project: RC car'], ['project', 'gps-tracker', 'Project: GPS tracker'], ['project', 'air-quality', 'Project: Air-quality monitor']] },
];
