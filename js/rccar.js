/* RC car / robot guide (guides.html). Same block format as js/nano.js.
   Nano sketches for motors and autonomous robots, ESP32 sketches for Wi-Fi and ESP-NOW control (Arduino-ESP32 core 2.x / 3.x). */

const RCCAR = {
  id:'rccar',
  menu:'RC Car / Robot',
  icon:'car',
  blurb:'Your big project: a car you drive from your phone or a handheld remote, and robots that drive themselves. Learn chassis, motors, motor drivers, batteries, control links and sensors, then build 28 projects in five levels — from spinning one motor to an FPV camera car with live telemetry on your own NestJS + React dashboard.',
  keys:{ done:'lab-rccar-guide', buy:'lab-rccar-guide-buy' },
  sections:[
  { id:'start', short:'Start here', title:'Start here',
    blocks:[
      { p:'Every RC car and robot has the same parts: something that sends commands, a microcontroller that decides what to do, a motor driver that gives the motors real power, motors and wheels, and a battery feeding it all. Once you understand each block, you can build anything from a line follower to a camera car.' },
      { flow:{ label:'The control chain', steps:['Remote / phone', 'Radio link', 'Microcontroller', 'Motor driver', 'Motors', 'Wheels'] } },
      { flow:{ label:'The power chain', steps:['Battery', 'Switch + fuse', 'Motor driver (full voltage)', 'Buck converter → 5V', 'Microcontroller & sensors'] } },
      { table:{ label:'Two stages', head:['Stage', 'Board', 'What you build'], rows:[
        ['1. Robots that drive themselves', 'Arduino Nano', 'Motor control, obstacle avoiding, line following — learn motors and sensors without radio problems.'],
        ['2. Cars you drive', 'ESP32 DevKit', 'Wi-Fi phone control, ESP-NOW remotes, camera, telemetry — your real RC car.'],
      ] } },
      { note:['tip', 'Do the Before Arduino, Nano and ESP32 guides first (at least their first levels). This guide assumes you can wire a transistor, read a sensor and connect an ESP32 to Wi-Fi.'] },
    ] },

  { id:'anatomy', short:'Parts of a car', title:'The parts of an RC car',
    blocks:[
      { cards:{ items:[
        ['Chassis', 'The frame: acrylic plates, metal or 3D-printed. Holds everything and sets how the car turns.'],
        ['Motors', 'Usually small DC gear motors. The gearbox trades speed for pushing power (torque).'],
        ['Wheels', 'Rubber for grip, a caster ball for 2WD, mecanum wheels for sideways driving.'],
        ['Motor driver', 'A power switch board: the microcontroller says which way and how fast; the driver supplies the current.'],
        ['Microcontroller', 'Nano for simple robots, ESP32 for Wi-Fi / Bluetooth control.'],
        ['Battery', '2 × 18650 (7.4V) is the sweet spot for small cars.'],
        ['Buck converter', 'Turns battery voltage into a clean 5V for the electronics.'],
        ['Controller', 'A phone web page, a second ESP32 with a joystick, Bluetooth or a hobby transmitter.'],
        ['Sensors', 'Ultrasonic, IR line sensors, encoders, IMU, camera — for autonomy and feedback.'],
        ['Steering servo (optional)', 'For car-style front-wheel steering instead of tank-style.'],
      ] } },
    ] },

  { id:'chassis', short:'Chassis & steering', title:'Chassis & steering types',
    blocks:[
      { table:{ head:['Type', 'How it turns', 'Good', 'Not so good'], rows:[
        ['2WD + caster ball', 'Differential: one wheel faster than the other', 'Cheap, simple, turns on the spot', 'The caster struggles on rough ground'],
        ['4WD', 'Differential (skid steer)', 'Grip and pushing power on floors and outdoors', 'Needs more current; skids when turning'],
        ['Tank tracks', 'Differential', 'Rough ground, looks great', 'Tracks come off; lots of friction'],
        ['Car-style (Ackermann)', 'Servo steers the front wheels, one motor drives', 'Real-car feel, fast', 'Can’t turn on the spot; the build is harder'],
        ['Mecanum 4WD', 'Four wheels with rollers mix to move in any direction', 'Drives sideways and diagonally', 'Expensive; needs four driver channels and smooth floors'],
      ] } },
      { note:['key', 'Start with a 2WD kit with TT motors. It teaches everything, and every lesson carries over to the bigger chassis.'] },
    ] },

  { id:'motors', short:'Motors', title:'Motors: speed, torque & current',
    blocks:[
      { table:{ head:['Motor', 'Voltage', 'Current (stall)', 'Use'], rows:[
        ['TT yellow gear motor', '3–6V', 'About 1A', 'The standard for 2WD / 4WD kits'],
        ['N20 micro metal gear motor', '3–12V', '0.3–1A', 'Small, precise robots; often with encoders'],
        ['25GA / 37GA metal gear motor', '6–12V', '2–5A', 'Heavier, faster cars; encoder versions available'],
        ['SG90 micro servo', '5V', 'About 0.7A', 'Steering small cars, turning a sensor head'],
        ['MG996R metal servo', '5–6V', '2A+', 'Stronger steering'],
        ['Brushless motor + ESC', '2S–3S LiPo', '10–60A', 'Fast hobby RC cars — a different world, later'],
      ] } },
      { cards:{ label:'Words you need', items:[
        ['RPM', 'Speed with no load. Gear ratio 1:48 means slower but stronger.'],
        ['Torque', 'Turning force — how hard it can push the car.'],
        ['Stall current', 'The current when the motor is blocked or starting. Size the driver and battery for this, not the running current.'],
        ['PWM', 'Switching the motor on and off very fast to set its speed.'],
        ['Back-EMF & noise', 'Motors create spikes and radio noise; a 100nF capacitor across each motor’s terminals helps.'],
      ] } },
    ] },

  { id:'drivers', short:'Motor drivers', title:'Motor drivers',
    blocks:[
      { table:{ head:['Driver', 'Motor voltage', 'Current per channel', 'Notes'], rows:[
        ['L298N', '5–35V', '2A', 'Common in kits, but loses about 2V as heat — the motors get less voltage. Fine to start.'],
        ['L9110S', '2.5–12V', '0.8A', 'Tiny and cheap; OK for small TT-motor cars.'],
        ['TB6612FNG', '2.5–13.5V', '1.2A (3A peak)', 'Efficient MOSFET driver, works with 3.3V and 5V logic — recommended.'],
        ['DRV8833', '2.7–10.8V', '1.5A', 'Similar to the TB6612, very small.'],
        ['BTS7960 (IBT-2)', '6–27V', '43A', 'For big 12V motors and heavy robots — one channel per board.'],
        ['ESC', 'LiPo', '10–100A+', 'For brushless motors; controlled like a servo.'],
      ] } },
      { table:{ label:'How an H-bridge channel is controlled (TB6612 / L298N)', head:['IN1', 'IN2', 'PWM', 'Motor'], rows:[
        ['HIGH', 'LOW', '0–255', 'Forward at that speed'],
        ['LOW', 'HIGH', '0–255', 'Backward at that speed'],
        ['LOW', 'LOW', 'any', 'Coast (free-wheel)'],
        ['HIGH', 'HIGH', 'any', 'Brake (short brake on the TB6612)'],
      ] } },
      { pre:{ label:'TB6612FNG wiring used in this guide', text:
`                 TB6612FNG
Battery + (7.4V)─ VM          AO1 ─┐ left motor
Logic 5V / 3V3 ─ VCC          AO2 ─┘
GND ──────────── GND          BO1 ─┐ right motor
Logic 5V / 3V3 ─ STBY         BO2 ─┘

                 Nano    ESP32
PWMA ─────────── D5      GPIO25
AIN1 ─────────── D7      GPIO26
AIN2 ─────────── D8      GPIO27
PWMB ─────────── D6      GPIO32
BIN1 ─────────── D9      GPIO33
BIN2 ─────────── D10     GPIO13

All grounds (battery, driver, board) connected together.` } },
      { note:['tip', 'Using an L298N instead? ENA = PWMA, IN1 / IN2 = AIN1 / AIN2, ENB = PWMB, IN3 / IN4 = BIN1 / BIN2. Remove the ENA / ENB jumpers so the PWM pins control the speed. The same code works.'] },
    ] },

  { id:'power', short:'Batteries & power', title:'Batteries & power',
    blocks:[
      { table:{ head:['Battery', 'Voltage', 'Good for', 'Notes'], rows:[
        ['4 × AA alkaline', '6V → drops fast', 'First tests only', 'Voltage sags under motor load: resets and slow motors.'],
        ['4 × AA NiMH rechargeable', '4.8V', 'Small cars', 'Better, but low voltage for an L298N.'],
        ['2 × 18650 (2S)', '7.4V (8.4V full)', 'Most small cars — recommended', 'Needs a 2S BMS and a 2S charger.'],
        ['2S LiPo pack', '7.4V', 'Faster cars, high current', 'Needs a balance charger and care: never over-discharge or puncture.'],
        ['3S (18650 or LiPo)', '11.1V', '12V motors', 'Check every part’s maximum voltage.'],
        ['Power bank', '5V', 'The remote or an ESP32-CAM', 'Not for motors.'],
      ] } },
      { pre:{ label:'Recommended power wiring', text:
`2S 18650 pack ── BMS ── fuse 3A ── switch ──┬──► motor driver VM (7.4V)
                                            │
                                            └──► buck converter ──► 5V
                                                                     ├── ESP32 VIN / Nano 5V
                                                                     └── servo, sensors
GND of everything connected together (star point near the battery)` } },
      { list:{ label:'Stop the resets', items:[
        'Motors starting pull big current and make the voltage dip — the board resets. Power the logic from its own buck converter.',
        'Add a 470–1000µF capacitor across the driver’s VM and GND, and 100nF across each motor.',
        'Keep motor wires twisted and away from the ESP32 antenna.',
        'Ramp the speed up instead of jumping from 0 to 255.',
      ] } },
      { note:['key', 'Runtime ≈ battery mAh ÷ average current. Two TT motors at about 300 mA each plus 150 mA for the ESP32 ≈ 750 mA → a 2,000 mAh pack drives for about 2½ hours.'] },
      { note:['warn', 'Lithium cells always need a BMS, a fuse and a proper charger. Never charge a damaged or swollen cell, and never leave packs charging unattended.'] },
    ] },

  { id:'control', short:'Control options', title:'How you control it',
    blocks:[
      { table:{ head:['Method', 'Range', 'Hardware', 'Difficulty', 'Notes'], rows:[
        ['IR remote', '5–8m, line of sight', 'IR receiver + TV-style remote', 'Easy', 'Great first remote; no sunlight.'],
        ['Bluetooth Classic', '10m', 'HC-05 with a Nano, or the ESP32 itself', 'Easy', 'Phone apps like “Bluetooth RC Controller”.'],
        ['Wi-Fi web page', '20–50m', 'ESP32 only', 'Medium', 'Drive from any phone browser, no app — Project 14.'],
        ['ESP-NOW', '50–200m', 'Two ESP32s + a joystick', 'Medium', 'Low delay, no router — the best DIY remote. Projects 15 & 16.'],
        ['nRF24L01 radio', '100m+ (PA version 500m+)', 'Two nRF24L01 + two boards', 'Medium', 'Classic Arduino RC link.'],
        ['Hobby RC transmitter', '500m+', 'FlySky FS-i6X + receiver (iBUS)', 'Easy once bought', 'Real sticks and trims; the ESP32 reads iBUS.'],
      ] } },
      { note:['warn', 'Always build a failsafe: if no command arrives for about half a second, stop the motors. A car that keeps driving after the signal drops will hit something.'] },
    ] },

  { id:'sensors', short:'Sensors', title:'Sensors for robots and cars',
    blocks:[
      { table:{ head:['Sensor', 'Measures', 'Use'], rows:[
        ['HC-SR04 ultrasonic', 'Distance 2–400cm', 'Obstacle avoiding'],
        ['IR obstacle module', 'Something close (on / off)', 'Simple bump-free stops'],
        ['TCRT5000 IR line sensors', 'Black vs white under the car', 'Line following, edge detection'],
        ['5-channel line sensor array', 'Line position', 'Smooth, fast PID line following'],
        ['Wheel encoders', 'Wheel turns', 'Speed, distance, driving straight'],
        ['MPU6050 IMU', 'Rotation and tilt', 'Heading hold, crash detection'],
        ['VL53L0X laser distance', 'Distance 3–200cm, narrow beam', 'Wall following, precise stops'],
        ['INA219', 'Battery voltage and current', 'Telemetry and low-battery warning'],
        ['NEO-6M GPS', 'Position outdoors', 'Waypoint rovers'],
        ['ESP32-CAM', 'Video', 'FPV driving'],
      ] } },
      { note:['tip', 'Remember the 3.3V rule on the ESP32: the HC-SR04 ECHO pin needs a 1kΩ / 2kΩ divider.'] },
    ] },

  { id:'drive', short:'Drive logic', title:'Drive logic: mixing, ramping & failsafe',
    blocks:[
      { p:'A joystick gives you two numbers: x (left / right) and y (forward / back). A 2WD or tank-style car needs two numbers too: left motor speed and right motor speed. Mixing converts one into the other.' },
      { pre:{ label:'Tank (arcade) mixing', text:
`left  = y + x        (clamp to −100 … 100)
right = y − x

stick forward      y=100, x=0    → left 100, right 100   straight
stick right        y=0,   x=100  → left 100, right −100  spin right
forward + right    y=100, x=50   → left 100, right 50    curve right` } },
      { cards:{ items:[
        ['Deadband', 'Ignore tiny stick values around the centre, so the car doesn’t creep.'],
        ['Ramping', 'Change speed gradually — fewer brownouts, less wheel spin.'],
        ['Speed limit', 'A slow mode for indoors and for beginners.'],
        ['Trim', 'One motor is always a bit faster; a trim value evens them out.'],
        ['Failsafe', 'No command for 300–500ms → stop.'],
        ['PID', 'Uses a sensor (line position, encoder, heading) to correct steering smoothly.'],
      ] } },
    ] },

  { id:'path', short:'Project path (28)', title:'RC car & robot project path — basic to advanced',
    blocks:[
      { p:'28 projects in five levels. Levels 1–2 use the Arduino Nano; from Level 3 the ESP32 takes over. Tick each project when you have built it, measured it and understood it.' },
      { projects:true },
    ] },

  { id:'starters', short:'First 6 projects', title:'The 6 projects to start with',
    blocks:[
      { p:'Complete sketches: motor test, obstacle avoiding and line following on the Nano, then a Wi-Fi joystick car and an ESP-NOW remote (two sketches) on the ESP32.' },
      { starters:true },
    ] },

  { id:'sequence', short:'First 10 sequence', title:'Your first 10 builds',
    blocks:[
      { p:'The order to follow from the projects above.' },
      { sequence:true },
    ] },

  { id:'mistakes', short:'Common mistakes', title:'Common mistakes',
    blocks:[
      { table:{ head:['Mistake', 'What happens', 'Do this instead'], rows:[
        ['Motors powered from the Arduino 5V pin', 'Resets, a hot regulator, a dead board.', 'Motors from the battery through the driver.'],
        ['No common ground', 'The driver ignores commands or acts randomly.', 'Connect battery, driver and board GND together.'],
        ['Weak batteries (AA alkaline)', 'Slow motors, resets when accelerating.', '2S 18650 with a buck converter for the logic.'],
        ['No failsafe', 'The car drives away when the signal drops.', 'Stop after 300–500ms without a command.'],
        ['L298N expecting full speed', 'Motors get 2V less than the battery.', 'Account for the drop or use a TB6612.'],
        ['One motor wired backwards', 'The car spins instead of driving straight.', 'Swap that motor’s two wires (or flip it in code).'],
        ['Servo on the board’s 5V pin', 'Jitter and resets.', 'Power servos from the buck converter.'],
        ['5V ECHO into the ESP32', 'Damaged pin.', '1kΩ / 2kΩ divider.'],
        ['Loose wires on a moving car', 'Random stops.', 'Solder, use screw terminals, tie wires down.'],
        ['Testing at full speed on a table', 'The car jumps off the table.', 'Wheels off the ground for first tests.'],
      ] } },
    ] },

  { id:'iot', short:'Car → your system', title:'From the car to your full system',
    blocks:[
      { pre:{ text:
`Handheld remote (ESP32 + joystick)
        │ ESP-NOW (commands, 20×/s)
        ▼
RC car (ESP32)  ── motors, sensors, INA219, camera
        │ telemetry: battery, speed, distance, heading
        ├── ESP-NOW back to the remote's OLED
        └── Wi-Fi → MQTT / HTTP
                     │
                     ▼
               NestJS API ── MongoDB
                     │
                     ▼
        React + TypeScript dashboard:
        live battery, speed, trip log, map` } },
      { note:['key', 'Project 26 builds this telemetry dashboard. Project 28 combines everything into your own RC car.'] },
    ] },

  { id:'buy', short:'Buy list', title:'Buy list for the RC car & robot projects',
    blocks:[
      { p:'Everything the 28 projects need, with estimated prices in Indian rupees. The Nano, ESP32s, 18650 cells and several sensors may already be on your bench from the other guides — tick them.' },
      { buy:true },
    ] },
  ],

  levels:[
    { n:1, title:'Level 1 — Motors, drivers & power (Nano)', projects:[
      [1, 'Spin a motor with a MOSFET', 'Switching a motor, the flyback diode', 'Nano, IRLZ44N, 1N4007, TT motor'],
      [2, 'Motor driver: direction & speed', 'H-bridge, PWM speed', 'Nano, TB6612FNG, TT motor'],
      [3, 'Two motors: drive & turn', 'Differential drive, spin turns', 'Nano, TB6612FNG, 2WD chassis'],
      [4, 'Servo steering', 'Servo angles, a separate 5V supply', 'Nano, SG90, buck converter'],
      [5, 'Battery & power board', 'BMS, fuse, switch, buck converter, common GND', '2 × 18650, BMS, buck converter'],
    ] },
    { n:2, title:'Level 2 — Robots that drive themselves (Nano)', projects:[
      [6, 'Obstacle-avoiding robot', 'Ultrasonic distance, reacting to the world', 'HC-SR04, chassis'],
      [7, 'Scanning obstacle robot', 'Servo-mounted sensor, choosing the best way', 'HC-SR04, SG90'],
      [8, 'Line follower (2 sensors)', 'IR reflectance, simple steering rules', '2 × TCRT5000'],
      [9, 'PID line follower', 'Line position, proportional + derivative control', '5-channel line sensor array'],
      [10, 'Table-edge detector', 'Downward IR sensors, safety stops', '2 × TCRT5000'],
      [11, 'Light-seeking robot', 'Comparing two LDRs', '2 × LDR, resistors'],
    ] },
    { n:3, title:'Level 3 — Remote control (ESP32)', projects:[
      [12, 'IR remote car', 'IR codes, mapping buttons to moves', 'IR receiver + remote, Nano or ESP32'],
      [13, 'Bluetooth phone car', 'BluetoothSerial, phone controller apps', 'ESP32 (or Nano + HC-05)'],
      [14, 'Wi-Fi web joystick car', 'Access point, web joystick, mixing, failsafe', 'ESP32, TB6612FNG'],
      [15, 'ESP-NOW handheld remote', 'Joystick reading, sending packets', 'ESP32, joystick module'],
      [16, 'ESP-NOW car receiver', 'Receiving packets, failsafe', 'ESP32 on the car'],
      [17, 'Hobby RC transmitter', 'Reading iBUS from a real RC receiver', 'FlySky FS-i6X + receiver (optional)'],
    ] },
    { n:4, title:'Level 4 — Sensors & feedback', projects:[
      [18, 'Wheel encoders: speed & distance', 'Interrupts, counting pulses', '2 × speed encoder modules'],
      [19, 'Drive straight with encoders', 'PID speed matching', 'Encoders'],
      [20, 'Heading hold with an IMU', 'Gyroscope, turning to an angle', 'MPU6050'],
      [21, 'Battery telemetry to the remote', 'Two-way ESP-NOW, OLED on the remote', 'INA219, OLED'],
      [22, 'Wall-following robot', 'Laser distance, keeping a gap', 'VL53L0X'],
      [23, 'Lights, indicators & horn', 'Outputs driven from the remote', 'LEDs, buzzer'],
    ] },
    { n:5, title:'Level 5 — Advanced', projects:[
      [24, 'FPV camera car', 'ESP32-CAM video streaming', 'ESP32-CAM'],
      [25, 'Mecanum omni-directional car', 'Four-wheel vector mixing', 'Mecanum chassis, 2 × TB6612FNG'],
      [26, 'Telemetry dashboard', 'MQTT / HTTP → NestJS → React', 'ESP32, INA219'],
      [27, 'GPS waypoint rover', 'GPS, heading, navigation', 'NEO-6M, MPU6050'],
      [28, 'Final: your RC car', 'Everything combined, tidy and reliable', 'All of the above'],
    ] },
  ],

  sequence:['Spin a motor with a MOSFET', 'Motor driver: direction & speed', 'Two motors: drive & turn', 'Battery & power board', 'Obstacle-avoiding robot',
    'Line follower (2 sensors)', 'Wi-Fi web joystick car', 'ESP-NOW handheld remote', 'ESP-NOW car receiver', 'Wheel encoders: speed & distance'],

  starters:[
    { n:1, title:'Motor driver test (Nano)', goal:'Drive both motors forward, backward and turning — and find out which motor is wired backwards.',
      diagram:
`Nano D5 ── PWMA   AO1/AO2 ── left motor
Nano D7 ── AIN1
Nano D8 ── AIN2
Nano D6 ── PWMB   BO1/BO2 ── right motor
Nano D9 ── BIN1
Nano D10 ─ BIN2
Nano 5V ── VCC + STBY
Battery 7.4V ── VM      all GND together`,
      diagramNote:'Lift the wheels off the table for the first run.',
      learn:['H-bridge control', 'PWM speed', 'A reusable motor() function', 'Motor direction'],
      measure:['Battery voltage while idle and while both motors start.', 'Voltage on AO1–AO2 at speed 150 vs 255.'],
      noteTip:'If a motor turns the wrong way, swap its two wires on the driver (or change its sign in motor()).',
      code:`// RC car project 1 — motor driver test: forward, backward, turn, spin
// TB6612FNG (or L298N: ENA=PWMA, IN1/IN2, ENB=PWMB, IN3/IN4)
const int PWMA = 5, AIN1 = 7, AIN2 = 8;     // left motor
const int PWMB = 6, BIN1 = 9, BIN2 = 10;    // right motor

// speed from -255 (full back) to 255 (full forward)
void motor(int pwmPin, int in1, int in2, int speed) {
  speed = constrain(speed, -255, 255);
  digitalWrite(in1, speed > 0);
  digitalWrite(in2, speed < 0);
  analogWrite(pwmPin, abs(speed));
}

void drive(int left, int right) {
  motor(PWMA, AIN1, AIN2, left);
  motor(PWMB, BIN1, BIN2, right);
}

void step(const char* name, int left, int right) {
  Serial.println(name);
  drive(left, right);
  delay(1500);
  drive(0, 0);
  delay(500);
}

void setup() {
  int pins[] = {PWMA, AIN1, AIN2, PWMB, BIN1, BIN2};
  for (int p : pins) pinMode(p, OUTPUT);
  Serial.begin(9600);
  delay(2000);                // time to put the car down
}

void loop() {
  step("forward", 180, 180);
  step("backward", -180, -180);
  step("turn left", 80, 200);
  step("turn right", 200, 80);
  step("spin", 180, -180);
  delay(2000);
}` },
    { n:2, title:'Obstacle-avoiding robot (Nano)', goal:'A robot that drives until something is close, then backs up and turns away.',
      diagram:
`HC-SR04   VCC ── 5V    GND ── GND
          TRIG ── D12  ECHO ── D11
Motors: same as project 1`,
      learn:['Ultrasonic distance', 'Timeouts', 'Simple decisions', 'Tuning speeds and distances'],
      behaviour:[['Drive forward', 'Obstacle < 20cm', 'Stop', 'Back up', 'Turn right', 'Drive forward']],
      code:`// RC car project 2 — obstacle-avoiding robot
const int PWMA = 5, AIN1 = 7, AIN2 = 8;
const int PWMB = 6, BIN1 = 9, BIN2 = 10;
const int TRIG = 12, ECHO = 11;
const int SPEED = 170;
const int STOP_CM = 20;

void motor(int pwmPin, int in1, int in2, int speed) {
  speed = constrain(speed, -255, 255);
  digitalWrite(in1, speed > 0);
  digitalWrite(in2, speed < 0);
  analogWrite(pwmPin, abs(speed));
}

void drive(int left, int right) {
  motor(PWMA, AIN1, AIN2, left);
  motor(PWMB, BIN1, BIN2, right);
}

int distanceCm() {
  digitalWrite(TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG, LOW);
  long us = pulseIn(ECHO, HIGH, 25000);   // give up after 25 ms
  if (us == 0) return 999;                // nothing in range
  return us / 58;
}

void setup() {
  int pins[] = {PWMA, AIN1, AIN2, PWMB, BIN1, BIN2, TRIG};
  for (int p : pins) pinMode(p, OUTPUT);
  pinMode(ECHO, INPUT);
  Serial.begin(9600);
  delay(2000);
}

void loop() {
  int d = distanceCm();
  Serial.println(d);
  if (d < STOP_CM) {
    drive(0, 0);
    delay(200);
    drive(-SPEED, -SPEED);   // back up
    delay(400);
    drive(SPEED, -SPEED);    // spin right
    delay(350);
  } else {
    drive(SPEED, SPEED);
  }
  delay(30);
}` },
    { n:3, title:'Line follower (Nano)', goal:'Follow a black line of electrical tape on a light floor.',
      diagram:
`TCRT5000 left   VCC ── 5V  GND ── GND  DO ── A0
TCRT5000 right  VCC ── 5V  GND ── GND  DO ── A1
Sensors 1cm above the floor, either side of the line
Motors: same as project 1`,
      diagramNote:'Turn each module’s trimmer until its LED switches cleanly between the tape and the floor.',
      learn:['IR reflectance', 'Digital sensor states', 'Steering rules', 'Tuning speed vs accuracy'],
      rules:[
        ['Both on white', 'Drive straight', '#2f9e44'],
        ['Left on black', 'Turn left', '#e8a100'],
        ['Right on black', 'Turn right', '#e8a100'],
        ['Both on black', 'Stop (junction or end)', '#e03131'],
      ],
      noteTip:'Most modules output HIGH over black and LOW over white. If yours is the opposite, flip the ONLINE constant.',
      code:`// RC car project 3 — two-sensor line follower (black line on a light floor)
const int PWMA = 5, AIN1 = 7, AIN2 = 8;
const int PWMB = 6, BIN1 = 9, BIN2 = 10;
const int LEFT_SENSOR = A0, RIGHT_SENSOR = A1;
const int ONLINE = HIGH;     // the module's output when it sees the black line
const int FAST = 150, SLOW = -60;

void motor(int pwmPin, int in1, int in2, int speed) {
  speed = constrain(speed, -255, 255);
  digitalWrite(in1, speed > 0);
  digitalWrite(in2, speed < 0);
  analogWrite(pwmPin, abs(speed));
}

void drive(int left, int right) {
  motor(PWMA, AIN1, AIN2, left);
  motor(PWMB, BIN1, BIN2, right);
}

void setup() {
  int pins[] = {PWMA, AIN1, AIN2, PWMB, BIN1, BIN2};
  for (int p : pins) pinMode(p, OUTPUT);
  pinMode(LEFT_SENSOR, INPUT);
  pinMode(RIGHT_SENSOR, INPUT);
  delay(2000);
}

void loop() {
  bool left = digitalRead(LEFT_SENSOR) == ONLINE;
  bool right = digitalRead(RIGHT_SENSOR) == ONLINE;

  if (!left && !right) drive(FAST, FAST);        // line between the sensors
  else if (left && !right) drive(SLOW, FAST);    // line drifting left: turn left
  else if (!left && right) drive(FAST, SLOW);    // line drifting right: turn right
  else drive(0, 0);                              // both on black: stop
}` },
    { n:4, title:'Wi-Fi web joystick car (ESP32)', goal:'Drive from your phone’s browser — no app, no router.',
      diagram:
`Phone ── joins Wi-Fi "RC-Car" (password drive1234)
      └─ opens http://192.168.4.1  → joystick page

ESP32 GPIO25 ── PWMA   GPIO26 ── AIN1   GPIO27 ── AIN2
ESP32 GPIO32 ── PWMB   GPIO33 ── BIN1   GPIO13 ── BIN2
ESP32 3V3 ── TB6612 VCC + STBY
Buck 5V ── ESP32 VIN     Battery 7.4V ── VM     all GND together`,
      learn:['Access point mode', 'A web page stored in the sketch', 'Arcade mixing', 'Deadband', 'Failsafe'],
      noteKey:'The car makes its own Wi-Fi network, so it works outdoors. Let go of the joystick — or walk out of range — and it stops within half a second.',
      code:`// RC car project 4 — drive from your phone's browser with an on-screen joystick
#include <WiFi.h>
#include <WebServer.h>

const int PWMA = 25, AIN1 = 26, AIN2 = 27;   // left motor
const int PWMB = 32, BIN1 = 33, BIN2 = 13;   // right motor

WebServer server(80);
unsigned long lastCmd = 0;

const char PAGE[] = R"rawliteral(
<!DOCTYPE html><html><head>
<meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no">
<title>RC Car</title>
<style>
body{margin:0;height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;
background:#111;color:#eee;font-family:sans-serif;touch-action:none;user-select:none}
#pad{width:260px;height:260px;border-radius:50%;background:#222;border:2px solid #444;position:relative}
#knob{width:90px;height:90px;border-radius:50%;background:#3b82f6;position:absolute;left:85px;top:85px}
</style></head><body>
<h2>RC Car</h2>
<div id="pad"><div id="knob"></div></div>
<p id="info">x 0 · y 0</p>
<script>
var pad = document.getElementById('pad'), knob = document.getElementById('knob'), info = document.getElementById('info');
var x = 0, y = 0, busy = false;
function show(dx, dy) {
  knob.style.left = (85 + dx * 85) + 'px';
  knob.style.top = (85 - dy * 85) + 'px';
  info.textContent = 'x ' + x + ' · y ' + y;
}
function move(e) {
  var r = pad.getBoundingClientRect();
  var dx = (e.clientX - r.left - 130) / 130, dy = (r.top + 130 - e.clientY) / 130;
  var m = Math.hypot(dx, dy);
  if (m > 1) { dx /= m; dy /= m; }
  x = Math.round(dx * 100); y = Math.round(dy * 100);
  show(dx, dy);
}
function release() { x = 0; y = 0; show(0, 0); }
pad.onpointerdown = function (e) { pad.setPointerCapture(e.pointerId); move(e); };
pad.onpointermove = function (e) { if (e.buttons) move(e); };
pad.onpointerup = pad.onpointercancel = release;
setInterval(function () {
  if (busy) return;
  busy = true;
  fetch('/d?x=' + x + '&y=' + y).catch(function () {}).finally(function () { busy = false; });
}, 100);
</script></body></html>
)rawliteral";

void motor(int pwmPin, int in1, int in2, int speed) {
  speed = constrain(speed, -255, 255);
  digitalWrite(in1, speed > 0);
  digitalWrite(in2, speed < 0);
  analogWrite(pwmPin, abs(speed));
}

// x and y from -100 to 100: arcade mixing
void drive(int x, int y) {
  int left = constrain(y + x, -100, 100);
  int right = constrain(y - x, -100, 100);
  motor(PWMA, AIN1, AIN2, left * 255 / 100);
  motor(PWMB, BIN1, BIN2, right * 255 / 100);
}

void setup() {
  int pins[] = {PWMA, AIN1, AIN2, PWMB, BIN1, BIN2};
  for (int p : pins) pinMode(p, OUTPUT);
  drive(0, 0);
  Serial.begin(115200);

  WiFi.softAP("RC-Car", "drive1234");        // password: at least 8 characters
  Serial.print("Join RC-Car, then open http://");
  Serial.println(WiFi.softAPIP());            // 192.168.4.1

  server.on("/", []() { server.send(200, "text/html", PAGE); });
  server.on("/d", []() {
    int x = server.arg("x").toInt();
    int y = server.arg("y").toInt();
    if (abs(x) < 10) x = 0;                   // deadband
    if (abs(y) < 10) y = 0;
    drive(x, y);
    lastCmd = millis();
    server.send(200, "text/plain", "ok");
  });
  server.begin();
}

void loop() {
  server.handleClient();
  if (millis() - lastCmd > 500) drive(0, 0);  // failsafe: no command, no driving
}` },
    { n:5, title:'ESP-NOW handheld remote (ESP32 #1)', goal:'A real joystick remote with long range and almost no delay.',
      diagram:
`Joystick module   VCC ── 3V3   GND ── GND
                  VRx ── GPIO34
                  VRy ── GPIO35
Power: USB power bank or a 18650 + charger board`,
      diagramNote:'Upload project 6 to the car first and copy the MAC address it prints into carMac below.',
      learn:['ESP-NOW peers', 'Sending a struct', 'Joystick calibration', 'Update rate'],
      noteTip:'Hold the joystick still while the remote starts — it measures its centre position then. If forward drives backwards, flip the sign of y.',
      code:`// RC car project 5 — ESP-NOW handheld remote (upload to the REMOTE ESP32)
#include <WiFi.h>
#include <esp_now.h>

uint8_t carMac[] = {0x24, 0x6F, 0x28, 0x00, 0x00, 0x00};   // <- the car's MAC from project 6

const int JOY_X = 34, JOY_Y = 35;   // ADC1, input-only pins
int centreX, centreY;

struct Command {
  int8_t x;   // -100..100
  int8_t y;   // -100..100
};

int readAxis(int pin, int centre) {
  int v = (analogRead(pin) - centre) * 100 / 2048;
  v = constrain(v, -100, 100);
  return abs(v) < 8 ? 0 : v;         // deadband
}

void setup() {
  Serial.begin(115200);
  WiFi.mode(WIFI_STA);
  centreX = analogRead(JOY_X);
  centreY = analogRead(JOY_Y);

  if (esp_now_init() != ESP_OK) {
    Serial.println("ESP-NOW init failed");
    return;
  }
  esp_now_peer_info_t peer = {};
  memcpy(peer.peer_addr, carMac, 6);
  peer.channel = 0;
  peer.encrypt = false;
  esp_now_add_peer(&peer);
}

void loop() {
  Command cmd;
  cmd.x = readAxis(JOY_X, centreX);
  cmd.y = -readAxis(JOY_Y, centreY);   // most modules read higher when pulled back
  esp_now_send(carMac, (uint8_t*)&cmd, sizeof(cmd));
  Serial.printf("x %d  y %d\\n", cmd.x, cmd.y);
  delay(50);                           // 20 commands per second
}` },
    { n:6, title:'ESP-NOW car receiver (ESP32 #2)', goal:'The car side: receive the joystick, drive, and stop if the remote goes quiet.',
      diagram:
`Car ESP32 wiring: same as project 4
Serial Monitor at 115200 shows:  Car MAC: 24:6F:28:xx:xx:xx
Copy it into carMac in project 5 as {0x24, 0x6F, 0x28, 0x.., 0x.., 0x..}`,
      learn:['Receive callbacks', 'volatile variables', 'Failsafe timing', 'Board-to-board radio'],
      noteKey:'This sketch uses the receive-callback format of Arduino-ESP32 core 3.x. On core 2.x change the first line of onRecv as shown in the comment.',
      code:`// RC car project 6 — ESP-NOW car receiver (upload to the CAR ESP32)
#include <WiFi.h>
#include <esp_now.h>

const int PWMA = 25, AIN1 = 26, AIN2 = 27;   // left motor
const int PWMB = 32, BIN1 = 33, BIN2 = 13;   // right motor

struct Command {
  int8_t x;
  int8_t y;
};

volatile int joyX = 0, joyY = 0;
volatile unsigned long lastCmd = 0;

// Arduino-ESP32 core 3.x. On core 2.x use:
// void onRecv(const uint8_t *mac, const uint8_t *data, int len) {
void onRecv(const esp_now_recv_info_t *info, const uint8_t *data, int len) {
  if (len != sizeof(Command)) return;
  Command c;
  memcpy(&c, data, sizeof(c));
  joyX = c.x;
  joyY = c.y;
  lastCmd = millis();
}

void motor(int pwmPin, int in1, int in2, int speed) {
  speed = constrain(speed, -255, 255);
  digitalWrite(in1, speed > 0);
  digitalWrite(in2, speed < 0);
  analogWrite(pwmPin, abs(speed));
}

void drive(int x, int y) {
  int left = constrain(y + x, -100, 100);
  int right = constrain(y - x, -100, 100);
  motor(PWMA, AIN1, AIN2, left * 255 / 100);
  motor(PWMB, BIN1, BIN2, right * 255 / 100);
}

void setup() {
  int pins[] = {PWMA, AIN1, AIN2, PWMB, BIN1, BIN2};
  for (int p : pins) pinMode(p, OUTPUT);
  drive(0, 0);
  Serial.begin(115200);

  WiFi.mode(WIFI_STA);
  delay(100);
  Serial.print("Car MAC: ");
  Serial.println(WiFi.macAddress());

  if (esp_now_init() != ESP_OK) {
    Serial.println("ESP-NOW init failed");
    return;
  }
  esp_now_register_recv_cb(onRecv);
}

void loop() {
  if (millis() - lastCmd > 300) drive(0, 0);   // failsafe
  else drive(joyX, joyY);
  delay(10);
}` },
  ],

  buy:{
    groups:[
      { title:'Chassis, motors & drivers', items:[
        ['2WD robot chassis kit (2 TT motors, wheels, caster)', 1, 350, 600, '1–23'],
        ['TB6612FNG motor driver', 2, 150, 250, '2–28', 'A second one for the mecanum car (25) and as a spare.'],
        ['SG90 micro servo', 1, 90, 150, '4, 7'],
        ['IRLZ44N MOSFET + 1N4007 diodes', 1, 30, 60, '1'],
        ['100nF ceramic capacitors (for the motors)', 10, 1, 2, '1–28'],
      ] },
      { title:'Boards', items:[
        ['Arduino Nano', 1, 250, 400, '1–11', 'Skip if you have one from the Nano guide.'],
        ['ESP32 DevKit V1', 2, 350, 600, '12–28', 'One for the car, one for the remote. Maybe already owned from the ESP32 guide.'],
      ] },
      { title:'Sensors & remote', items:[
        ['HC-SR04 ultrasonic sensor', 1, 60, 120, '6, 7'],
        ['TCRT5000 IR sensor modules', 4, 25, 50, '8, 10'],
        ['5-channel IR line sensor array', 1, 250, 450, '9'],
        ['LDR + 10kΩ resistors', 2, 5, 10, '11'],
        ['IR receiver + remote kit', 1, 60, 120, '12'],
        ['Joystick module', 1, 40, 80, '15'],
        ['Speed encoder modules (with slotted discs)', 2, 40, 80, '18, 19'],
        ['MPU6050 IMU module', 1, 120, 200, '20, 27'],
        ['INA219 current / voltage sensor', 1, 150, 250, '21, 26'],
        ['0.96″ I2C OLED (for the remote)', 1, 150, 250, '21'],
        ['VL53L0X laser distance sensor', 1, 250, 400, '22'],
        ['LEDs (white, red, amber) + active buzzer', 1, 40, 80, '23'],
      ] },
      { title:'Power', items:[
        ['18650 protected cells', 2, 250, 400, '5–28'],
        ['2 × 18650 holder with switch', 1, 60, 120, '5–28'],
        ['2S BMS protection board', 1, 40, 80, '5–28'],
        ['2S USB-C charger board (8.4V)', 1, 80, 150, '5–28'],
        ['Buck converter to 5V, 3A (MP1584 / LM2596)', 2, 60, 150, '4, 5–28'],
        ['Fuse holder + 3A fuses', 1, 30, 60, '5'],
        ['470–1000µF capacitors', 2, 4, 8, '5'],
        ['USB power bank (for the remote)', 1, 400, 800, '15–28', 'Any small one you have works.'],
      ] },
      { title:'Advanced (Level 5)', items:[
        ['ESP32-CAM with MB programmer board', 1, 500, 800, '24'],
        ['NEO-6M GPS module', 1, 300, 500, '27'],
      ] },
      { title:'Build & tools', items:[
        ['Mini breadboard (170-point)', 2, 30, 60, '1–28'],
        ['Male-to-female + male-to-male jumpers', 1, 100, 180, '1–28'],
        ['Cable ties, double-sided tape, M3 standoffs & screws', 1, 150, 300, '1–28'],
        ['Soldering iron kit', 1, 400, 900, '5–28', 'Skip if you have one.'],
        ['Digital multimeter', 1, 300, 800, '1–28', 'You already own one — ticked.'],
      ] },
    ],
    owned:['Digital multimeter'],
    extras:[
      { title:'Extras', note:'Upgrades for later.', items:[
        ['Spare TT motors', 2, 40, 70, 'They wear out and get stripped — spares keep you driving.', true],
        ['4WD chassis kit', 1, 700, 1200, 'More grip and power outdoors.'],
        ['Mecanum wheel 4WD chassis', 1, 1500, 3000, 'Needed for project 25.'],
        ['N20 metal gear motors with encoders', 2, 400, 700, 'Precise, strong and quiet.'],
        ['MG996R metal gear servo', 1, 250, 400, 'Stronger steering for car-style builds.'],
        ['nRF24L01+ PA/LNA radios', 2, 150, 300, 'Very long-range link for Arduino remotes.'],
        ['FlySky FS-i6X transmitter + iA6B receiver', 1, 4000, 5500, 'Real RC sticks and range (project 17).'],
        ['2S LiPo 1500mAh + balance charger', 1, 1500, 2500, 'Much higher current for fast cars.'],
      ] },
    ],
    tips:[
      'Prices are estimates — they vary a lot by seller and quality. Check before you order.',
      'Many parts overlap with the Nano, ESP32 and Bluetooth amplifier lists — tick what you already have.',
      'Buy the TB6612FNG instead of the L298N if you can — your motors get the full battery voltage.',
      'Buy two ESP32 boards and two TB6612s: one car, one remote, and a spare driver.',
    ],
  },
};
