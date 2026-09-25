/* The 51-project curriculum: pure electronics → Arduino → sensors → motors → data → ESP32/IoT → robotics.
   parts: [name, qty]. blocks: extra content shown with a project —
     pre (a text diagram), flow (a chain of steps), screen (what a display shows), chips (a list to create/learn),
     measure (readings to record), rules (thresholds), note. */

const CUR_PHASES = [
  { n:1, title:'Pure electronics / breadboard', range:'1–14' },
  { n:2, title:'Arduino fundamentals', range:'15–24' },
  { n:3, title:'Arduino sensors', range:'25–30' },
  { n:4, title:'Motors & robotics', range:'31–35' },
  { n:5, title:'More sensors', range:'36–40' },
  { n:6, title:'Data & communication', range:'41–43' },
  { n:7, title:'ESP32 / IoT', range:'44–48', intro:'Now move from Arduino to ESP32.' },
  { n:8, title:'Robotics + IoT', range:'49–50' },
  { n:9, title:'Your big project', range:'51' },
];

const CUR_PROJECTS = [
/* ---------- Phase 1 ---------- */
{ n:1, phase:1, title:'LED circuit', learn:'Voltage, current, resistance, polarity, Ohm’s law.',
  parts:[['Breadboard', '1'], ['Red LED', '5'], ['220Ω resistor', '10'], ['330Ω resistor', '10'], ['Jumper wires', ''], ['5V power supply', ''], ['Multimeter', '']] },

{ n:2, phase:1, title:'Multiple LED circuit', learn:'Series vs parallel, current distribution.',
  parts:[['Breadboard', ''], ['Red LED', '5'], ['Green LED', '5'], ['Blue LED', '5'], ['220Ω resistors', '15'], ['330Ω resistors', '15'], ['Jumper wires', ''], ['5V supply', '']],
  blocks:[{ t:'pre', label:'Build', text:
`Parallel LEDs
     │
 ┌───┼───┬───┐
 LED LED LED LED
 │   │   │   │
R   R   R   R
 │   │   │   │
 └───┴───┴───┘
      GND` }] },

{ n:3, phase:1, title:'Push button + LED', learn:'Switches, open/closed circuits, pull-up/pull-down.',
  parts:[['Push buttons', '10'], ['LEDs', '10'], ['220Ω resistors', '10'], ['10kΩ resistors', '10'], ['Breadboard', ''], ['Jumper wires', ''], ['5V supply', '']] },

{ n:4, phase:1, title:'Potentiometer voltage divider', learn:'Variable resistance, voltage divider, measuring voltage.',
  parts:[['10kΩ potentiometer', '5'], ['10kΩ resistor', '5'], ['Multimeter', ''], ['Breadboard', ''], ['Jumper wires', ''], ['5V supply', '']],
  blocks:[{ t:'measure', label:'Measure', items:['0%', '25%', '50%', '75%', '100%'], note:'Turn the pot to each position and record the output voltage.' }] },

{ n:5, phase:1, title:'Potentiometer LED dimmer', learn:'Variable voltage controlling an output.',
  parts:[['10kΩ potentiometer', '1'], ['LED', '3'], ['220Ω resistor', '3'], ['Breadboard', ''], ['Jumper wires', ''], ['5V supply', '']] },

{ n:6, phase:1, title:'Capacitor charging/discharging', learn:'Capacitance and the RC time constant.',
  parts:[['10µF capacitor', '5'], ['100µF capacitor', '5'], ['470µF capacitor', '3'], ['1kΩ resistor', '5'], ['10kΩ resistor', '5'], ['LED', '3'], ['220Ω resistor', '3'], ['Multimeter', ''], ['Breadboard', ''], ['Jumper wires', '']] },

{ n:7, phase:1, title:'Capacitor LED delay', learn:'How an RC circuit creates a delay.',
  parts:[['100µF capacitor', '2'], ['470µF capacitor', '2'], ['1kΩ resistor', '2'], ['10kΩ resistor', '2'], ['LED', '2'], ['220Ω resistor', '2'], ['Push button', '2'], ['Breadboard', ''], ['Jumper wires', '']] },

{ n:8, phase:1, title:'Diode protection', learn:'Diode polarity, forward voltage, reverse protection.',
  parts:[['1N4007', '10'], ['1N4148', '10'], ['1N5819', '5'], ['LEDs', '5'], ['220Ω resistors', '5'], ['Push buttons', '2'], ['Breadboard', ''], ['Multimeter', ''], ['5V supply', '']] },

{ n:9, phase:1, title:'Transistor LED switch', learn:'The transistor as a switch.',
  parts:[['BC547', '5'], ['2N2222', '5'], ['1kΩ resistors', '5'], ['10kΩ resistors', '5'], ['LEDs', '5'], ['220Ω resistors', '5'], ['Push buttons', '2'], ['Breadboard', ''], ['Jumper wires', '']] },

{ n:10, phase:1, title:'Transistor motor switch', learn:'Controlling a load with a transistor and a flyback diode.',
  parts:[['2N2222', '3'], ['BC547', '3'], ['DC motor', '2'], ['1N4007', '5'], ['1kΩ resistor', '5'], ['10kΩ resistor', '5'], ['Push button', '2'], ['Breadboard', ''], ['5V supply', '']] },

{ n:11, phase:1, title:'LDR automatic light', learn:'Light sensing using a voltage divider.',
  parts:[['LDR', '5'], ['10kΩ resistor', '5'], ['LED', '3'], ['220Ω resistor', '3'], ['2N2222', '2'], ['1kΩ resistor', '2'], ['Breadboard', ''], ['5V supply', '']] },

{ n:12, phase:1, title:'Thermistor temperature indicator', learn:'Resistance changes with temperature.',
  parts:[['10kΩ NTC thermistor', '3'], ['10kΩ resistor', '3'], ['LEDs', '3'], ['220Ω resistors', '3'], ['2N2222', '2'], ['1kΩ resistor', '2'], ['Breadboard', ''], ['Multimeter', '']] },

{ n:13, phase:1, title:'555 timer LED flasher', learn:'ICs, timing, frequency, capacitors.',
  parts:[['NE555', '5'], ['1kΩ resistors', '5'], ['10kΩ potentiometer', '2'], ['10µF capacitor', '5'], ['100µF capacitor', '2'], ['LEDs', '5'], ['220Ω resistors', '5'], ['Breadboard', ''], ['Jumper wires', ''], ['5V supply', '']] },

{ n:14, phase:1, title:'555 timer buzzer', learn:'Oscillators and frequency.',
  parts:[['NE555', '2'], ['Passive buzzer', '2'], ['1kΩ resistor', '2'], ['10kΩ potentiometer', '2'], ['10nF capacitor', '2'], ['100nF capacitor', '2'], ['Breadboard', ''], ['Jumper wires', ''], ['5V supply', '']] },

/* ---------- Phase 2 ---------- */
{ n:15, phase:2, title:'Arduino LED blink', learn:'GPIO and Arduino programming.',
  parts:[['Arduino UNO', '1'], ['LED', '5'], ['220Ω resistor', '5'], ['Breadboard', ''], ['Jumper wires', ''], ['USB data cable', '']] },

{ n:16, phase:2, title:'Arduino traffic light', learn:'Multiple GPIOs and timing.',
  parts:[['Arduino UNO', ''], ['Red LEDs', '3'], ['Yellow LEDs', '3'], ['Green LEDs', '3'], ['220Ω resistors', '9'], ['Push button', '1'], ['10kΩ resistor', '1'], ['Breadboard', ''], ['Jumper wires', '']] },

{ n:17, phase:2, title:'Arduino button counter', learn:'Digital input and variables.',
  parts:[['Arduino UNO', ''], ['Push buttons', '3'], ['10kΩ resistors', '3'], ['LEDs', '3'], ['220Ω resistors', '3'], ['Breadboard', ''], ['Jumper wires', '']] },

{ n:18, phase:2, title:'Arduino buzzer alarm', learn:'GPIO + buzzer + conditions.',
  parts:[['Arduino UNO', ''], ['Active buzzer', '2'], ['Passive buzzer', '1'], ['Push buttons', '2'], ['LEDs', '2'], ['220Ω resistors', '2'], ['Breadboard', ''], ['Jumper wires', '']] },

{ n:19, phase:2, title:'Arduino potentiometer control', learn:'ADC / analog input.',
  parts:[['Arduino UNO', ''], ['10kΩ potentiometer', '2'], ['LED', '3'], ['220Ω resistors', '3'], ['Breadboard', ''], ['Jumper wires', '']],
  blocks:[{ t:'flow', label:'Concept', steps:['Potentiometer', 'Arduino A0', 'ADC value', 'LED brightness'] }] },

{ n:20, phase:2, title:'Arduino LDR automatic light', learn:'Analog sensor + threshold.',
  parts:[['Arduino UNO', ''], ['LDR', '2'], ['10kΩ resistors', '2'], ['LED', '2'], ['220Ω resistors', '2'], ['Breadboard', ''], ['Jumper wires', '']] },

{ n:21, phase:2, title:'Arduino RGB LED', learn:'PWM and colour mixing.',
  parts:[['Arduino UNO', ''], ['RGB LED', '2'], ['220Ω resistors', '6'], ['10kΩ resistors', '3'], ['Potentiometer', '3'], ['Breadboard', ''], ['Jumper wires', '']],
  blocks:[{ t:'chips', label:'Create', items:['Red', 'Green', 'Blue', 'Yellow', 'Purple', 'Cyan', 'White'],
    swatches:['#e5484d', '#22a55b', '#3b82f6', '#f4c11e', '#8b5cf6', '#22d3ee', '#f5f5f5'] }] },

{ n:22, phase:2, title:'Arduino servo control', learn:'PWM and servo control.',
  parts:[['Arduino UNO', ''], ['SG90 servo', '2'], ['10kΩ potentiometer', '1'], ['Breadboard', ''], ['Jumper wires', ''], ['External 5V supply', '']] },

{ n:23, phase:2, title:'Arduino servo + joystick', learn:'Analog joystick + servo.',
  parts:[['Arduino UNO', ''], ['Joystick module', '1'], ['SG90 servo', '2'], ['Breadboard', ''], ['Jumper wires', '']] },

{ n:24, phase:2, title:'Arduino LCD', learn:'I2C / display communication.',
  parts:[['Arduino UNO', ''], ['16×2 I2C LCD', '1'], ['10kΩ potentiometer', '1'], ['Breadboard', ''], ['Jumper wires', '']],
  blocks:[{ t:'screen', label:'Display', kind:'lcd', lines:['Hello Pandi!', 'Electronics Lab'] }] },

/* ---------- Phase 3 ---------- */
{ n:25, phase:3, title:'DHT11 weather monitor', goal:'Temperature and humidity on an LCD, with a buzzer and LED alert.',
  parts:[['Arduino UNO', ''], ['DHT11', '2'], ['10kΩ resistor', '2'], ['16×2 I2C LCD', '1'], ['Buzzer', '1'], ['LED', '1'], ['220Ω resistor', '1'], ['Breadboard', ''], ['Jumper wires', '']],
  blocks:[{ t:'screen', label:'Display', kind:'lcd', lines:['Temp: 28.4 C', 'Hum : 62 %'] }] },

{ n:26, phase:3, title:'DHT22 temperature alarm', goal:'Show the temperature on an OLED and sound an alarm above a limit.',
  parts:[['Arduino UNO', ''], ['DHT22', '1'], ['10kΩ resistor', '1'], ['OLED 0.96″', '1'], ['Buzzer', '1'], ['LED', '1'], ['220Ω resistor', '1'], ['Breadboard', ''], ['Jumper wires', '']] },

{ n:27, phase:3, title:'Ultrasonic distance meter', goal:'Measure distance with sound and show it on an OLED.',
  parts:[['Arduino UNO', ''], ['HC-SR04', '2'], ['OLED 0.96″', '1'], ['Buzzer', '1'], ['Breadboard', ''], ['Jumper wires', '']],
  blocks:[{ t:'screen', label:'Display', kind:'oled', lines:['Distance', '27 cm'] }] },

{ n:28, phase:3, title:'Parking sensor', goal:'Green, yellow and red lights plus a buzzer as an object gets closer.',
  parts:[['Arduino UNO', ''], ['HC-SR04', '1'], ['Green LED', '1'], ['Yellow LED', '1'], ['Red LED', '1'], ['220Ω resistors', '3'], ['Buzzer', '1'], ['OLED', '1'], ['Breadboard', ''], ['Jumper wires', '']],
  blocks:[{ t:'rules', label:'Behaviour', rows:[['> 50 cm', 'Green', '#22a55b'], ['20–50 cm', 'Yellow', '#f4c11e'], ['< 20 cm', 'Red + buzzer', '#e5484d']] }] },

{ n:29, phase:3, title:'PIR motion alarm', goal:'Detect movement and raise an alarm, with a button to arm and disarm.',
  parts:[['Arduino UNO', ''], ['HC-SR501 PIR', '2'], ['Buzzer', '1'], ['Red LED', '1'], ['Green LED', '1'], ['220Ω resistors', '2'], ['Push button', '1'], ['OLED', '1'], ['Breadboard', ''], ['Jumper wires', '']] },

{ n:30, phase:3, title:'IR object detector', goal:'Detect nearby objects with IR sensors and react with LEDs, a buzzer and a servo.',
  parts:[['Arduino UNO', ''], ['IR obstacle sensor', '2'], ['LEDs', '2'], ['220Ω resistors', '2'], ['Buzzer', '1'], ['Servo', '1'], ['Breadboard', ''], ['Jumper wires', '']] },

/* ---------- Phase 4 ---------- */
{ n:31, phase:4, title:'DC motor speed controller', goal:'Set a motor’s speed with a potentiometer.',
  parts:[['Arduino UNO', ''], ['DC motor', '2'], ['L298N', '1'], ['Potentiometer', '1'], ['10kΩ resistor', '1'], ['External motor power supply', ''], ['Breadboard', ''], ['Jumper wires', '']],
  blocks:[{ t:'flow', label:'Learn', steps:['PWM', 'Motor speed'] }] },

{ n:32, phase:4, title:'Motor direction controller', goal:'Drive two geared motors forwards and backwards with buttons.',
  parts:[['Arduino UNO', ''], ['DC geared motors', '2'], ['L298N', '1'], ['Push buttons', '2'], ['Battery pack', ''], ['Jumper wires', '']],
  blocks:[{ t:'chips', label:'Create', items:['Forward', 'Reverse', 'Stop'] }] },

{ n:33, phase:4, title:'Better motor driver', goal:'Use the TB6612FNG instead of the L298N.',
  parts:[['Arduino UNO', ''], ['TB6612FNG', '1'], ['N20 gear motors', '2'], ['Wheels', '2'], ['Battery', ''], ['Breadboard', ''], ['Jumper wires', '']],
  blocks:[{ t:'note', kind:'tip', text:'This is closer to what you’ll eventually use in robotics.' }] },

{ n:34, phase:4, title:'2WD robot', goal:'Build a two-wheel-drive robot chassis that drives under Arduino control.',
  parts:[['Arduino UNO', ''], ['TB6612FNG', ''], ['N20 motors', '2'], ['Robot chassis', '1'], ['Wheels', '2'], ['Caster wheel', '1'], ['Battery holder', ''], ['Rechargeable batteries', ''], ['HC-SR04', ''], ['Jumper wires', ''], ['Switch', '']] },

{ n:35, phase:4, title:'Obstacle-avoiding robot', goal:'Scan ahead with the ultrasonic sensor and steer around obstacles.',
  parts:[['Arduino UNO', ''], ['2WD robot chassis', ''], ['N20 motors', '2'], ['TB6612FNG', ''], ['HC-SR04', ''], ['SG90 servo', ''], ['Battery', ''], ['Wheels', ''], ['Caster', ''], ['Jumper wires', '']],
  blocks:[{ t:'pre', label:'Logic', text:
`           Object
             ↓
        HC-SR04
             ↓
     ┌───────┴───────┐
     ↓               ↓
  Distance OK     Object near
     ↓               ↓
 Forward       Stop → Turn` }] },

/* ---------- Phase 5 ---------- */
{ n:36, phase:5, title:'Soil moisture monitor', goal:'Watch soil moisture, show it on an OLED and switch a pump through a relay.',
  parts:[['Arduino UNO', ''], ['Soil moisture sensor', '2'], ['OLED', '1'], ['Buzzer', '1'], ['LED', '1'], ['220Ω resistor', '1'], ['Small water pump', '1'], ['Relay module', '1'], ['External power supply', ''], ['Tubing', '']] },

{ n:37, phase:5, title:'Automatic plant watering', goal:'Water a plant automatically when the soil is dry.',
  parts:[['Arduino UNO', ''], ['Soil moisture sensor', ''], ['Relay module', ''], ['Mini water pump', ''], ['Water tube', ''], ['OLED', ''], ['Buzzer', ''], ['LED', ''], ['External power supply', ''], ['Container', '']] },

{ n:38, phase:5, title:'Light + temperature station', goal:'A small weather station with light, temperature, humidity and pressure.',
  parts:[['Arduino UNO', ''], ['LDR', ''], ['DHT22', ''], ['BMP280', ''], ['OLED', ''], ['10kΩ resistor', ''], ['Breadboard', ''], ['Jumper wires', '']],
  blocks:[{ t:'screen', label:'Display', kind:'oled', lines:['Temperature: 29°C', 'Humidity: 61%', 'Pressure: 1008 hPa', 'Light: 650'] }] },

{ n:39, phase:5, title:'MPU6050 motion detector', goal:'Read movement and rotation from an IMU over I2C.',
  parts:[['Arduino UNO', ''], ['MPU6050', '1'], ['OLED', '1'], ['Buzzer', '1'], ['LED', '1'], ['Breadboard', ''], ['Jumper wires', '']],
  blocks:[{ t:'chips', label:'Learn', items:['Accelerometer', 'Gyroscope', 'I2C', 'X / Y / Z'] }] },

{ n:40, phase:5, title:'Tilt alarm', goal:'Sound an alarm when the device is tilted too far.',
  parts:[['Arduino UNO', ''], ['MPU6050', ''], ['Buzzer', ''], ['Red LED', ''], ['Green LED', ''], ['OLED', ''], ['220Ω resistor', ''], ['Breadboard', ''], ['Jumper wires', '']] },

/* ---------- Phase 6 ---------- */
{ n:41, phase:6, title:'Arduino RFID door lock', goal:'Open a servo “lock” only for authorised RFID cards.',
  parts:[['Arduino UNO', ''], ['RC522 RFID', '1'], ['RFID cards', '5'], ['RFID key fobs', '5'], ['SG90 servo', '1'], ['Green LED', ''], ['Red LED', ''], ['Buzzer', ''], ['220Ω resistors', ''], ['OLED', ''], ['Breadboard', '']] },

{ n:42, phase:6, title:'RFID attendance system', goal:'Log who tapped a card and when, to a microSD card.',
  parts:[['Arduino UNO', ''], ['RC522', ''], ['RFID cards', ''], ['OLED / LCD', ''], ['Buzzer', ''], ['LEDs', ''], ['MicroSD module', ''], ['MicroSD card', ''], ['RTC DS3231', ''], ['Breadboard', ''], ['Jumper wires', '']] },

{ n:43, phase:6, title:'Data logger', goal:'Record environmental readings with timestamps.',
  parts:[['Arduino UNO', ''], ['MicroSD module', ''], ['MicroSD card', ''], ['DS3231 RTC', ''], ['DHT22', ''], ['BMP280', ''], ['OLED', ''], ['Breadboard', ''], ['Jumper wires', '']],
  blocks:[{ t:'chips', label:'Store', items:['Date', 'Time', 'Temperature', 'Humidity', 'Pressure'] }] },

/* ---------- Phase 7 ---------- */
{ n:44, phase:7, title:'ESP32 web LED controller', goal:'Switch LEDs from a web page in your browser.',
  parts:[['ESP32 DevKit', '1'], ['LED', '2'], ['220Ω resistors', '2'], ['Breadboard', ''], ['Jumper wires', ''], ['USB-C / data cable', '']],
  blocks:[{ t:'flow', label:'Control', steps:['Browser', 'Wi-Fi', 'ESP32', 'LED'] }] },

{ n:45, phase:7, title:'ESP32 web sensor', goal:'Serve live sensor readings to a browser.',
  parts:[['ESP32', ''], ['DHT22', ''], ['OLED', ''], ['10kΩ resistor', ''], ['Breadboard', ''], ['Jumper wires', '']],
  blocks:[{ t:'chips', label:'Browser displays', items:['Temperature', 'Humidity'] }] },

{ n:46, phase:7, title:'ESP32 MQTT sensor', goal:'Publish sensor readings to an MQTT broker and a dashboard.',
  parts:[['ESP32', ''], ['DHT22', ''], ['OLED', ''], ['10kΩ resistor', ''], ['Breadboard', ''], ['Jumper wires', '']],
  blocks:[{ t:'flow', label:'Architecture', steps:['ESP32', 'Wi-Fi', 'MQTT broker', 'Dashboard'] },
          { t:'note', kind:'key', text:'This is an important transition toward your actual IoT and backend work.' }] },

{ n:47, phase:7, title:'ESP32 MQTT relay controller', goal:'Switch a device from a web app through MQTT.',
  parts:[['ESP32', ''], ['1-channel relay module', ''], ['LED', ''], ['220Ω resistor', ''], ['MQTT broker', ''], ['Breadboard', ''], ['Jumper wires', '']],
  blocks:[{ t:'flow', label:'Flow', steps:['React / Web', 'MQTT', 'ESP32', 'Relay', 'Device'] },
          { t:'note', kind:'warn', text:'For early experiments, use low-voltage DC loads, not mains AC.' }] },

{ n:48, phase:7, title:'ESP32 RFID IoT system', goal:'An RFID lock that reports every access over Wi-Fi.',
  parts:[['ESP32', ''], ['RC522', ''], ['RFID cards', ''], ['OLED', ''], ['Buzzer', ''], ['Servo', ''], ['Wi-Fi', ''], ['Breadboard', ''], ['Jumper wires', '']] },

/* ---------- Phase 8 ---------- */
{ n:49, phase:8, title:'Wi-Fi controlled robot', goal:'Drive your robot from a phone or PC over Wi-Fi.',
  parts:[['ESP32', ''], ['TB6612FNG', ''], ['N20 motors', '2'], ['Robot chassis', ''], ['Wheels', ''], ['Caster', ''], ['Battery', ''], ['Buck converter', ''], ['Web interface', ''], ['Jumper wires', '']],
  blocks:[{ t:'flow', label:'Control from', steps:['Phone / PC', 'Wi-Fi', 'ESP32', 'Motor driver', 'Motors'] }] },

{ n:50, phase:8, title:'Wi-Fi obstacle-avoiding robot', goal:'Combine remote control with automatic obstacle avoidance.',
  parts:[['ESP32', ''], ['TB6612FNG', ''], ['N20 motors', '2'], ['HC-SR04', ''], ['SG90', ''], ['Robot chassis', ''], ['Wheels', ''], ['Caster', ''], ['Battery', ''], ['Buck converter', ''], ['OLED', ''], ['Buzzer', '']] },

/* ---------- Phase 9 ---------- */
{ n:51, phase:9, title:'ESP32 smart RC car', goal:'This becomes your larger destination project.',
  partGroups:[
    { title:'Electronics', parts:[['ESP32', ''], ['TB6612FNG / suitable motor controller', ''], ['DC geared motors', ''], ['Servo', ''], ['HC-SR04', ''], ['MPU6050', ''], ['GPS', ''], ['INA219', ''], ['OLED', ''], ['Buzzer', ''], ['LEDs', ''], ['Camera / ESP32-CAM', ''], ['Battery', ''], ['BMS / protection', ''], ['Buck converter', ''], ['Fuse', ''], ['Power switch', '']] },
    { title:'Mechanical', parts:[['RC chassis', ''], ['Wheels', ''], ['Motor mounts', ''], ['Servo mount', ''], ['Bearings', ''], ['Screws', ''], ['Nuts', ''], ['Standoffs', ''], ['Battery holder / mount', '']] },
  ],
  blocks:[{ t:'pre', label:'Software', text:
`ESP32
  │
  ├── Motor control
  ├── Sensors
  ├── Battery telemetry
  ├── GPS
  ├── Camera
  └── Wi-Fi
          │
          ↓
       NestJS
          │
          ↓
       MongoDB
          │
          ↓
     React + TypeScript
       Dashboard` }] },
];

/* The complete progression */
const CUR_STAGES = [
  ['Basic electricity', '1–5', 'V, I, R, Ohm’s law'],
  ['Components', '6–14', 'Capacitors, diodes, transistors, 555'],
  ['Arduino basics', '15–24', 'GPIO, ADC, PWM, LCD'],
  ['Sensors', '25–30', 'Temperature, distance, motion'],
  ['Motors', '31–35', 'PWM, drivers, robotics'],
  ['Advanced sensors', '36–40', 'IMU, environmental sensing'],
  ['Data', '41–43', 'RFID, SD, RTC'],
  ['ESP32', '44–48', 'Wi-Fi, MQTT, IoT'],
  ['Robotics', '49–50', 'Wireless robot'],
  ['Final project', '51', 'Smart RC / IoT vehicle'],
];

const CUR_METHOD = ['Build', 'Predict', 'Measure', 'Observe', 'Change one component', 'Measure again', 'Understand why'];

/* Buy list for Phase 1 (projects 1–14). Parts are reused from project to project, so each quantity is the most
   any one project needs, rounded up to a sensible buying amount.
   Item: [name, qty, low ₹ per unit, high ₹ per unit, projects that use it, note?]
   Prices are typical Indian online / retail ranges and will vary by seller and quality. */
const CUR_BUY = {
  phase:1,
  projects:'1–14',
  intro:'Everything for Phase 1 in one order, with estimated prices. Tick what you already have and it drops out of the total.',
  groups:[
    { title:'Prototyping & power', items:[
      ['Full-size breadboard (830-point)', 1, 90, 150, '1–14'],
      ['Breadboard power supply module (MB102)', 1, 60, 100, 'All — the 5V supply'],
      ['9V 1A DC adapter (for the power module)', 1, 120, 200, 'All', 'A USB phone charger into the module’s USB socket also works.'],
      ['Male-to-male jumper wires (pack of 40)', 1, 60, 100, '1–7, 9, 13, 14'],
    ] },
    { title:'Resistors', items:[
      ['220Ω resistor', 20, 0.5, 1, '1–3, 5–9, 11–13', 'Project 2 needs 15 at once.'],
      ['330Ω resistor', 20, 0.5, 1, '1, 2', 'Project 2 needs 15 at once.'],
      ['10kΩ resistor', 20, 0.5, 1, '3, 4, 6, 7, 9–12', 'The most-used value — spares are handy.'],
      ['1kΩ resistor', 10, 0.5, 1, '6, 7, 9–13'],
    ] },
    { title:'LEDs, buttons & pots', items:[
      ['Red 5mm LED', 10, 1, 2, '1–3, 5–9, 11–13'],
      ['Green 5mm LED', 5, 1, 2, '2, 3'],
      ['Blue 5mm LED', 5, 1.5, 3, '2'],
      ['6×6mm push button', 10, 1, 3, '3, 7–10', 'Project 3 uses 10.'],
      ['10kΩ potentiometer', 5, 10, 20, '4, 5, 13, 14'],
    ] },
    { title:'Capacitors', items:[
      ['10µF electrolytic', 5, 1, 2, '6, 13'],
      ['100µF electrolytic', 5, 2, 4, '6, 7, 13'],
      ['470µF electrolytic', 3, 4, 8, '6, 7'],
      ['10nF ceramic (103)', 5, 0.5, 1.5, '14'],
      ['100nF ceramic (104)', 10, 0.5, 1.5, '14', 'Extra ones are always useful for decoupling ICs.'],
    ] },
    { title:'Diodes & transistors', items:[
      ['1N4007 rectifier diode', 10, 0.5, 1.5, '8, 10'],
      ['1N4148 signal diode', 10, 0.5, 1.5, '8'],
      ['1N5819 Schottky diode', 5, 2, 4, '8'],
      ['BC547 NPN transistor', 5, 1.5, 3, '9, 10'],
      ['2N2222 NPN transistor', 5, 2, 4, '9–12'],
    ] },
    { title:'Sensors, ICs, motor & sound', items:[
      ['LDR (photoresistor)', 5, 3, 6, '11'],
      ['10kΩ NTC thermistor', 3, 5, 12, '12'],
      ['NE555 timer IC', 5, 5, 12, '13, 14'],
      ['Passive buzzer', 2, 8, 15, '14'],
      ['Small DC motor (3–6V)', 2, 25, 45, '10'],
    ] },
    { title:'Tools', items:[
      ['Digital multimeter', 1, 300, 800, '1, 4, 6, 8, 12', 'You already own one — ticked by default.'],
    ] },
  ],
  owned:['Digital multimeter'],
  optional:[
    ['Second full-size breadboard', 1, 90, 150, 'Keep one circuit built while you start the next.'],
    ['Pre-cut solid-core jumper wire kit', 1, 100, 200, 'Flat, tidy wiring that is much easier to debug.'],
    ['Component storage box', 1, 100, 250, 'Stops small parts turning into one mixed pile.'],
    ['Resistor assortment kit (about 600 pcs, 30 values)', 1, 200, 350, 'Replaces the four resistor lines above and covers every later project.'],
    ['5mm LED assortment (about 100 pcs, 5 colours)', 1, 100, 180, 'Replaces the three LED lines above with plenty of spares.'],
  ],
  tips:[
    'Prices are estimates — they vary a lot by seller and quality. Check before you order.',
    'Online stores often add ₹40–80 shipping below a minimum order value, so order everything together.',
    'Local electronics markets are usually cheapest for resistors, LEDs, capacitors and transistors.',
    'Buy a few spares of the tiny parts — LEDs and transistors get damaged while learning, and they cost a rupee or two.',
    'The whole of Phase 1 is plain electronics: you don’t need an Arduino yet.',
  ],
};

/* Buy list for Phase 2 (projects 15–24). Most Phase 1 parts are reused, so they are listed separately and
   pre-ticked; untick any you don't have. */
const CUR_BUY2 = {
  phase:2,
  projects:'15–24',
  intro:'Only what Phase 2 adds — most parts carry over from Phase 1 and are pre-ticked below. Untick anything you don’t have.',
  groups:[
    { title:'Board', items:[
      ['Arduino UNO', 1, 400, 700, '15–24', 'You already own one — ticked by default. A compatible (CH340) board costs this much; an original costs much more.'],
      ['USB cable for the UNO (USB-A to USB-B)', 1, 60, 120, '15–24', 'Usually comes with the board — untick if you don’t have one.'],
    ] },
    { title:'New for Phase 2', items:[
      ['Male-to-female jumper wires (pack of 40)', 1, 60, 100, '23, 24', 'Modules such as the LCD backpack and the joystick have male pins.'],
      ['Yellow 5mm LED', 5, 1, 2, '16', 'The traffic light needs 3.'],
      ['RGB LED (common cathode)', 3, 5, 10, '21', 'Project 21 uses 2; one spare.'],
      ['5V active buzzer', 2, 8, 15, '18'],
      ['SG90 micro servo', 2, 90, 150, '22, 23'],
      ['Joystick module', 1, 40, 80, '23'],
      ['16×2 LCD with I2C backpack', 1, 150, 250, '24', 'Buy it with the I2C backpack already soldered on.'],
      ['5V 2A adapter (external servo supply)', 1, 120, 200, '22, 23', 'Servos can draw more current than the UNO’s 5V pin can supply. A phone charger with a USB breakout also works.'],
      ['DC barrel jack to screw-terminal adapter', 1, 15, 30, '22, 23', 'Connects the 5V adapter to the breadboard rails.'],
    ] },
    { title:'Reuse from Phase 1', items:[
      ['Full-size breadboard (830-point)', 1, 90, 150, '15–24', 'From the Phase 1 list.'],
      ['Male-to-male jumper wires (pack of 40)', 1, 60, 100, '15–24', 'From the Phase 1 list.'],
      ['220Ω resistor', 9, 0.5, 1, '15–21', 'The traffic light uses 9 at once.'],
      ['10kΩ resistor', 3, 0.5, 1, '16, 17, 20, 21'],
      ['Red 5mm LED', 3, 1, 2, '15–20'],
      ['Green 5mm LED', 3, 1, 2, '16'],
      ['6×6mm push button', 3, 1, 3, '16–18'],
      ['10kΩ potentiometer', 3, 10, 20, '19, 21, 22, 24', 'Project 21 uses 3.'],
      ['LDR (photoresistor)', 2, 3, 6, '20'],
      ['Passive buzzer', 1, 8, 15, '18'],
    ] },
  ],
  owned:['Arduino UNO', 'USB cable for the UNO (USB-A to USB-B)', 'Full-size breadboard (830-point)', 'Male-to-male jumper wires (pack of 40)',
    '220Ω resistor', '10kΩ resistor', 'Red 5mm LED', 'Green 5mm LED', '6×6mm push button', '10kΩ potentiometer', 'LDR (photoresistor)', 'Passive buzzer'],
  optional:[
    ['Extra SG90 servo', 1, 90, 150, 'Servos are easy to strip by forcing the arm — a spare saves waiting for delivery.'],
    ['0.96″ I2C OLED display', 1, 150, 250, 'Not needed until Phase 3, but it uses the same I2C wiring you learn in project 24.'],
    ['Arduino Nano', 1, 250, 400, 'A second board lets one project stay built while you start the next.'],
  ],
  tips:[
    'Prices are estimates — they vary a lot by seller and quality. Check before you order.',
    'Order the Phase 2 parts together with anything missing from Phase 1 to save on shipping.',
    'For project 24, run the I2C scanner first to find the LCD’s address (usually 0x27 or 0x3F).',
    'Power the servos from the separate 5V supply and connect its GND to the UNO’s GND.',
  ],
};

const CUR_BUYS = [CUR_BUY, CUR_BUY2];
