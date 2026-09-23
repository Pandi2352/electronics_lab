/* Arduino UNO lessons. Each has wiring, a complete sketch, the expected result and "try this" ideas.
   redo = the breadboard exercise this lesson rebuilds in code. ids are stable progress keys. */

const LESSON_UNITS = [
  { id:1, title:'First programs' },
  { id:2, title:'Digital inputs' },
  { id:3, title:'Analog in & PWM out' },
  { id:4, title:'Sound & motion' },
  { id:5, title:'Modules & chips' },
  { id:6, title:'Writing better code' },
];

const LESSONS = [
/* ---------- Unit 1 ---------- */
{ id:'blink', unit:1, title:'Blink', goal:'Upload your first sketch and make the on-board LED flash.',
  parts:['Arduino UNO', 'USB cable'],
  wiring:[
    'No wiring — the UNO has an LED marked L connected to pin 13.',
    'Plug in the UNO. In the Arduino IDE choose Tools → Board → Arduino Uno, then Tools → Port → the port that appears.',
    'Paste the sketch and click Upload (→).',
  ],
  code:`// Blink the on-board LED (pin 13) once a second.
void setup() {
  pinMode(LED_BUILTIN, OUTPUT);     // LED_BUILTIN is pin 13 on the UNO
}

void loop() {
  digitalWrite(LED_BUILTIN, HIGH);  // LED on (5V)
  delay(1000);                      // wait 1000 ms = 1 second
  digitalWrite(LED_BUILTIN, LOW);   // LED off (0V)
  delay(1000);
}`,
  expect:'The L LED blinks: one second on, one second off. The TX and RX LEDs flicker while the sketch uploads.',
  how:'setup() runs once when the board starts; loop() then repeats forever. pinMode() makes the pin an output, and digitalWrite() sets it to 5V (HIGH) or 0V (LOW).',
  tryThis:['Change both delays to 100 for a fast flicker.', 'Make a heartbeat: two short blinks, then a long pause.', 'Blink SOS in Morse code: three short, three long, three short.'],
  pins:['uno'] },

{ id:'traffic', unit:1, title:'Traffic lights', goal:'Drive three external LEDs and organise the code with a function.',
  redo:'first-led',
  parts:['Arduino UNO', 'Breadboard', 'Red, yellow and green 5mm LEDs', '220Ω resistors ×3', 'Jumper wires'],
  wiring:[
    'UNO GND → the breadboard − rail.',
    'Pin 8 → 220Ω → red LED anode (long leg); cathode → GND rail.',
    'Pin 9 → 220Ω → yellow LED → GND. Pin 10 → 220Ω → green LED → GND.',
  ],
  code:`// Traffic lights: three LEDs on pins 8, 9 and 10.
const int RED = 8;
const int YELLOW = 9;
const int GREEN = 10;

void setup() {
  pinMode(RED, OUTPUT);
  pinMode(YELLOW, OUTPUT);
  pinMode(GREEN, OUTPUT);
}

// Turn every light off, switch one on, and wait.
void light(int pin, unsigned long ms) {
  digitalWrite(RED, LOW);
  digitalWrite(YELLOW, LOW);
  digitalWrite(GREEN, LOW);
  digitalWrite(pin, HIGH);
  delay(ms);
}

void loop() {
  light(GREEN, 4000);
  light(YELLOW, 1000);
  light(RED, 4000);
}`,
  expect:'Green for 4 seconds, yellow for 1 second, red for 4 seconds, then round again.',
  how:'Named constants (RED, YELLOW, GREEN) make the code readable and easy to rewire. The light() function removes repeated code: it is written once and called three times. Each LED draws about (5 − 2) ÷ 220 ≈ 14mA — well within the 20mA per pin limit.',
  tryThis:['Add a red + yellow phase before green, as UK traffic lights do.', 'Make the yellow light blink three times instead of staying on.'],
  pins:['uno', 'led'] },

/* ---------- Unit 2 ---------- */
{ id:'button', unit:2, title:'Read a button', goal:'Read a push button with the internal pull-up resistor.',
  redo:'pull-down',
  parts:['Arduino UNO', 'Breadboard', '6×6mm tactile push button', 'Jumper wires'],
  wiring:[
    'Place the button across the centre gap.',
    'One leg → pin 2. The diagonally opposite leg → GND. No resistor needed.',
  ],
  code:`// The on-board LED lights while the button on pin 2 is pressed.
const int BUTTON = 2;

void setup() {
  pinMode(BUTTON, INPUT_PULLUP);    // internal pull-up: reads HIGH when released
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  bool pressed = digitalRead(BUTTON) == LOW;   // pressing connects the pin to GND
  digitalWrite(LED_BUILTIN, pressed ? HIGH : LOW);
}`,
  expect:'The L LED is on only while you hold the button down.',
  how:'INPUT_PULLUP switches on a resistor of about 20–50kΩ inside the chip, from the pin to 5V. Released, the pin reads HIGH; pressed, the button pulls it to GND and it reads LOW. That is why “pressed” means LOW here — the logic is inverted.',
  tryThis:['Swap HIGH and LOW so the LED is off while pressed.', 'Change INPUT_PULLUP to INPUT and touch the wire — the floating pin makes the LED flicker, just like exercise 11.'],
  pins:['uno', 'button'] },

{ id:'toggle', unit:2, title:'Toggle with debounce', goal:'Make each press switch the LED on or off — reliably.',
  parts:['Arduino UNO', 'The button circuit from the previous lesson'],
  wiring:['Same as the previous lesson: button between pin 2 and GND.'],
  code:`// Each press toggles the LED. Debounced with millis().
const int BUTTON = 2;
const unsigned long DEBOUNCE_MS = 30;

bool ledOn = false;
int lastReading = HIGH;
int stableState = HIGH;
unsigned long lastChange = 0;

void setup() {
  pinMode(BUTTON, INPUT_PULLUP);
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  int reading = digitalRead(BUTTON);
  if (reading != lastReading) {          // the contacts moved (or bounced)
    lastChange = millis();
    lastReading = reading;
  }
  if (millis() - lastChange > DEBOUNCE_MS && reading != stableState) {
    stableState = reading;               // the change has lasted long enough
    if (stableState == LOW) {            // a new press
      ledOn = !ledOn;
      digitalWrite(LED_BUILTIN, ledOn);
    }
  }
}`,
  expect:'Every press flips the LED exactly once — no double toggles.',
  how:'Metal contacts bounce for a few milliseconds, so one press can look like several. The sketch only accepts a change once the reading has stayed the same for 30ms. millis() returns the time since start-up without pausing the program.',
  tryThis:['Set DEBOUNCE_MS to 0 and press quickly — some presses toggle twice.', 'Count the presses and blink the count back.', 'Detect a long press (over 1 second) and do something different.'],
  pins:['uno', 'button'] },

{ id:'serial', unit:2, title:'The Serial Monitor', goal:'Send text between the UNO and your computer — your main debugging tool.',
  parts:['Arduino UNO', 'USB cable'],
  wiring:['No wiring.', 'After uploading, open Tools → Serial Monitor and set the speed to 9600 baud.'],
  code:`// Send 1 or 0 from the Serial Monitor to switch the LED; see a running counter.
unsigned long lastPrint = 0;
int seconds = 0;

void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(9600);                     // must match the Serial Monitor speed
  Serial.println("Ready. Send 1 for LED on, 0 for off.");
}

void loop() {
  if (Serial.available() > 0) {           // a character has arrived
    char c = Serial.read();
    if (c == '1') { digitalWrite(LED_BUILTIN, HIGH); Serial.println("LED on"); }
    if (c == '0') { digitalWrite(LED_BUILTIN, LOW);  Serial.println("LED off"); }
  }
  if (millis() - lastPrint >= 1000) {     // once a second
    lastPrint = millis();
    seconds++;
    Serial.print("Running for ");
    Serial.print(seconds);
    Serial.println(" s");
  }
}`,
  expect:'The Serial Monitor shows “Ready…” and a counter every second. Typing 1 or 0 and pressing Enter switches the LED and replies.',
  how:'Serial.begin() starts the USB serial link. print() sends text, println() adds a new line, and available() / read() receive characters. Printing values is the quickest way to see what your sketch is doing.',
  tryThis:['Reply with the LED state when you send ?.', 'Open Tools → Serial Plotter and print a changing number to see a live graph.'],
  pins:['uno'] },

/* ---------- Unit 3 ---------- */
{ id:'analog-pot', unit:3, title:'Read a potentiometer', goal:'Measure a voltage with analogRead().',
  redo:'pot-dimmer',
  parts:['Arduino UNO', '10kΩ potentiometer', 'Jumper wires', 'Digital multimeter'],
  wiring:['Pot outer pins → 5V and GND. Middle pin (wiper) → A0.'],
  code:`// Read a potentiometer on A0 and print the raw value and the voltage.
const int POT = A0;

void setup() {
  Serial.begin(9600);
}

void loop() {
  int raw = analogRead(POT);              // 0 to 1023
  float volts = raw * 5.0 / 1023.0;       // convert to volts
  Serial.print("raw=");
  Serial.print(raw);
  Serial.print("  volts=");
  Serial.println(volts, 2);               // 2 decimal places
  delay(200);
}`,
  expect:'Turning the knob sweeps raw from 0 to 1023 and volts from 0.00 to 5.00. Your multimeter on the wiper agrees within a few hundredths.',
  how:'The UNO’s ADC turns 0–5V into a number from 0 to 1023 (10 bits). Multiplying by 5.0 / 1023 converts it back to volts. Use 5.0 rather than 5, or the division is done with whole numbers.',
  tryThis:['Open the Serial Plotter and turn the knob.', 'Print a 0–100% value with map(raw, 0, 1023, 0, 100).'],
  pins:['uno', 'pot'] },

{ id:'night-light-code', unit:3, title:'Night light with an LDR', goal:'Switch an LED from a light sensor, with hysteresis to stop flicker.',
  redo:'night-light',
  parts:['Arduino UNO', 'LDR (light-dependent resistor)', '10kΩ resistor', '220Ω resistor', 'White 5mm LED'],
  wiring:[
    '5V → LDR → A0 → 10kΩ → GND (brighter light = higher reading).',
    'Pin 9 → 220Ω → LED → GND.',
  ],
  code:`// Night light: the LED on pin 9 turns on when the LDR on A0 says it is dark.
const int LDR = A0;
const int LED = 9;
const int DARK = 300;     // below this it is dark (tune for your room)
const int LIGHT = 350;    // above this it is light again — the gap is hysteresis

bool on = false;

void setup() {
  pinMode(LED, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int level = analogRead(LDR);
  if (!on && level < DARK) on = true;
  if (on && level > LIGHT) on = false;
  digitalWrite(LED, on);
  Serial.println(level);                  // watch this to choose DARK and LIGHT
  delay(100);
}`,
  expect:'The LED stays off in room light and switches on cleanly when you cover the LDR — no flickering at the threshold.',
  how:'With a single threshold, a light level right at the edge makes the LED flicker on and off. Two thresholds (hysteresis) give a dead band: it turns on below 300 but only turns off above 350.',
  tryThis:['Print the level, cover and uncover the LDR, and set DARK and LIGHT from what you see.', 'Instead of on/off, dim the LED smoothly with analogWrite() as it gets darker.'],
  pins:['uno'] },

{ id:'pwm', unit:3, title:'PWM: fade and dim', goal:'Control brightness with analogWrite() and link it to the pot.',
  parts:['Arduino UNO', 'Red 5mm LED', '220Ω resistor', '10kΩ potentiometer'],
  wiring:['Pin 9 → 220Ω → LED → GND.', 'Pot outer pins → 5V and GND, wiper → A0.'],
  code:`// Fade an LED with PWM once, then set its brightness with the pot.
const int LED = 9;        // must be a PWM pin: 3, 5, 6, 9, 10 or 11
const int POT = A0;

void setup() {
  pinMode(LED, OUTPUT);
  for (int b = 0; b <= 255; b++) { analogWrite(LED, b); delay(5); }   // fade up
  for (int b = 255; b >= 0; b--) { analogWrite(LED, b); delay(5); }   // fade down
}

void loop() {
  int brightness = map(analogRead(POT), 0, 1023, 0, 255);   // 0–1023 in, 0–255 out
  analogWrite(LED, brightness);
}`,
  expect:'At start-up the LED fades up and down once. After that, the pot sets the brightness smoothly from off to full.',
  how:'analogWrite() does not produce a real analog voltage. It switches the pin on and off about 490 times a second (PWM); the value 0–255 sets how much of each cycle is on. Your eye averages it into brightness. map() rescales one range of numbers to another.',
  tryThis:['Make a “breathing” LED that fades up and down forever.', 'Put an RGB LED on pins 9, 10 and 11 and fade between colours.'],
  pins:['uno', 'pot'] },

{ id:'thermometer', unit:3, title:'Thermometer with an NTC', goal:'Turn a thermistor reading into degrees Celsius.',
  redo:'thermistor',
  parts:['Arduino UNO', 'NTC 10k thermistor', '10kΩ resistor'],
  wiring:['5V → 10kΩ resistor → A0 → thermistor → GND.'],
  code:`// Thermometer with a 10k NTC thermistor (Beta about 3950) and a 10k resistor.
// Wiring: 5V -> 10k resistor -> A0 -> thermistor -> GND
const int SENSOR = A0;
const float R_FIXED = 10000.0;   // the fixed 10k resistor
const float R0 = 10000.0;        // thermistor resistance at 25 °C
const float T0 = 298.15;         // 25 °C in kelvin
const float BETA = 3950.0;       // from the thermistor's datasheet

void setup() {
  Serial.begin(9600);
}

void loop() {
  int raw = analogRead(SENSOR);
  float r = R_FIXED * raw / (1023.0 - raw);                 // thermistor resistance
  float kelvin = 1.0 / (1.0 / T0 + log(r / R0) / BETA);     // Beta equation
  float celsius = kelvin - 273.15;
  Serial.print(celsius, 1);
  Serial.println(" C");
  delay(1000);
}`,
  expect:'Room temperature, give or take a degree or two. Holding the thermistor makes the reading climb towards 30°C.',
  how:'The divider turns the thermistor’s resistance into a voltage. The sketch works backwards from the reading to the resistance, then uses the Beta equation — the thermistor’s temperature curve — to get kelvin, and subtracts 273.15.',
  tryThis:['Compare it with a room thermometer and adjust BETA if it is off.', 'Sound the buzzer when it goes above 30°C.'],
  pins:['uno'] },

/* ---------- Unit 4 ---------- */
{ id:'melody', unit:4, title:'Play a melody', goal:'Make tones and tunes with tone() and a passive buzzer.',
  redo:'555-tone',
  parts:['Arduino UNO', 'Passive piezo buzzer', '100Ω resistor (optional)'],
  wiring:['Pin 8 → (100Ω) → buzzer +. Buzzer − → GND.'],
  code:`// Play a scale on a passive buzzer on pin 8.
const int BUZZER = 8;

// Note frequencies in Hz (C major scale)
const int NOTE_C4 = 262, NOTE_D4 = 294, NOTE_E4 = 330, NOTE_F4 = 349;
const int NOTE_G4 = 392, NOTE_A4 = 440, NOTE_B4 = 494, NOTE_C5 = 523;

int melody[]    = { NOTE_C4, NOTE_D4, NOTE_E4, NOTE_F4, NOTE_G4, NOTE_A4, NOTE_B4, NOTE_C5 };
int durations[] = { 250, 250, 250, 250, 250, 250, 250, 600 };     // milliseconds

void setup() {
  for (int i = 0; i < 8; i++) {
    tone(BUZZER, melody[i], durations[i]);
    delay(durations[i] * 1.3);         // a short gap between notes
  }
  noTone(BUZZER);
}

void loop() {
  // Press RESET on the UNO to play it again.
}`,
  expect:'A rising scale, do-re-mi… up to the high C, once after each reset.',
  how:'tone() makes a square wave of the chosen frequency on the pin — the same job the 555 did in exercise 27, now in code. The names use a NOTE_ prefix because A4 already means an analog pin in Arduino.',
  tryThis:['Let the pot set the pitch: tone(BUZZER, map(analogRead(A0), 0, 1023, 200, 2000)).', 'Make a two-tone siren.', 'Play the tune when a button is pressed.'],
  pins:['uno'] },

{ id:'servo', unit:4, title:'Servo control', goal:'Move a servo to an angle set by a potentiometer.',
  parts:['Arduino UNO', 'SG90 micro servo', '10kΩ potentiometer', 'Separate 5V supply (recommended)'],
  wiring:[
    'Servo brown → GND, red → 5V, orange → pin 9.',
    'For more than one servo, or a heavier one, power it from a separate 5V supply and join its GND to the UNO’s GND.',
    'Pot outer pins → 5V and GND, wiper → A0.',
  ],
  code:`// The servo follows the pot, 0–180°.
#include <Servo.h>

const int POT = A0;
Servo servo;

void setup() {
  servo.attach(9);          // signal wire to pin 9
}

void loop() {
  int angle = map(analogRead(POT), 0, 1023, 0, 180);
  servo.write(angle);
  delay(15);                // give the servo time to move
}`,
  expect:'The servo arm follows the knob across about 180°.',
  how:'A servo reads a pulse every 20ms: 1ms means one end, 2ms the other. The built-in Servo library makes those pulses for you — servo.write() just takes an angle. Note that the library uses a timer, so analogWrite() no longer works on pins 9 and 10.',
  tryThis:['Sweep back and forth on its own with a for loop.', 'Smooth jittery movement by averaging several pot readings.'],
  pins:['uno', 'pot'] },

{ id:'motor', unit:4, title:'Motor speed with a MOSFET', goal:'Control a DC motor’s speed safely with PWM.',
  parts:['Arduino UNO', 'Small DC motor or TT gear motor', 'IRLZ44N MOSFET', '1N4001 diode', '220Ω resistor', '10kΩ resistor', '4×AA battery holder', '10kΩ potentiometer'],
  wiring:[
    'IRLZ44N, printed side facing you: G, D, S. Source → GND.',
    'Pin 5 → 220Ω → gate. 10kΩ from gate to GND (keeps it off at start-up).',
    'Battery + → motor → drain. 1N4001 across the motor, stripe towards battery +.',
    'Battery − → UNO GND (the grounds must be joined). Pot wiper → A0.',
  ],
  code:`// Set a DC motor's speed with the pot, through an IRLZ44N MOSFET.
const int MOTOR = 5;      // PWM pin to the MOSFET gate
const int POT = A0;

void setup() {
  pinMode(MOTOR, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int speed = map(analogRead(POT), 0, 1023, 0, 255);
  if (speed < 20) speed = 0;          // dead zone so the motor really stops
  analogWrite(MOTOR, speed);
  Serial.println(speed);
  delay(50);
}`,
  expect:'The motor speeds up as you turn the pot and stops completely at the low end. The UNO does not reset or glitch when the motor starts.',
  how:'The MOSFET switches the motor’s ground side at PWM speed, while the motor draws its current from the batteries, not the UNO. The diode absorbs the voltage spike a motor coil makes each time it switches off — without it the MOSFET can be destroyed.',
  tryThis:['Add a soft start that ramps up the speed over a second.', 'Add a start/stop button.', 'For forward and reverse you need an H-bridge — see the TB6612FNG in the Outputs tab.'],
  pins:['irlz44n', 'uno'] },

/* ---------- Unit 5 ---------- */
{ id:'i2c-scanner', unit:5, title:'I2C scanner', goal:'Find the address of every I2C module you connect.',
  parts:['Arduino UNO', 'Any I2C module (LCD backpack, OLED, BME280, BH1750, MPU6050…)'],
  wiring:['Module VCC → 5V (or 3.3V if it needs it), GND → GND, SDA → A4, SCL → A5.'],
  code:`// I2C scanner: lists the address of every device on A4 (SDA) / A5 (SCL).
#include <Wire.h>

void setup() {
  Wire.begin();
  Serial.begin(9600);
  Serial.println("Scanning...");
  int found = 0;
  for (byte address = 1; address < 127; address++) {
    Wire.beginTransmission(address);
    if (Wire.endTransmission() == 0) {       // 0 means a device answered
      Serial.print("Found device at 0x");
      if (address < 16) Serial.print('0');
      Serial.println(address, HEX);
      found++;
    }
  }
  Serial.print(found);
  Serial.println(" device(s) found.");
}

void loop() {}`,
  expect:'The Serial Monitor lists one address per module. Common ones: LCD backpack 0x27 or 0x3F, OLED 0x3C, BME280 0x76, BH1750 0x23, MPU6050 0x68.',
  how:'Every I2C device answers to its own 7-bit address on the shared two-wire bus. The scanner calls each address in turn and reports those that reply. Run it first whenever an I2C module doesn’t work.',
  tryThis:['Connect two modules at once — both appear, sharing the same two wires.', 'Unplug SDA and run it again to see what a wiring fault looks like.'],
  pins:['uno'] },

{ id:'lcd', unit:5, title:'LCD display', goal:'Show text and live values on an LCD1602 with an I2C backpack.',
  parts:['Arduino UNO', 'LCD1602 with I2C backpack', '10kΩ potentiometer'],
  wiring:['LCD VCC → 5V, GND → GND, SDA → A4, SCL → A5.', 'Pot wiper → A0 (outer pins to 5V and GND).', 'Install the library: Sketch → Include Library → Manage Libraries → “LiquidCrystal I2C” by Frank de Brabander.'],
  code:`// Show a greeting and the live pot value on an LCD1602 with an I2C backpack.
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);   // use the address from the I2C scanner (often 0x27 or 0x3F)
const int POT = A0;

void setup() {
  lcd.init();
  lcd.backlight();
  lcd.setCursor(0, 0);                 // column 0, first line
  lcd.print("Hello, lab!");
}

void loop() {
  lcd.setCursor(0, 1);                 // column 0, second line
  lcd.print("Pot: ");
  lcd.print(analogRead(POT));
  lcd.print("    ");                   // wipe leftover digits
  delay(200);
}`,
  expect:'“Hello, lab!” on the first line and the pot value updating on the second.',
  how:'The backpack turns the LCD’s 16 wires into I2C. setCursor(column, row) chooses where the next print() goes. Printing spaces after the number clears digits left over from a longer value.',
  tryThis:['Show the temperature from the thermometer lesson.', 'Blank screen or solid blocks? Turn the blue contrast pot on the backpack.', 'Using an SSD1306 OLED instead? Install “Adafruit SSD1306” and start from its ssd1306_128x64_i2c example.'],
  pins:['uno'] },

{ id:'shift-register', unit:5, title:'8 LEDs from 3 pins', goal:'Use a 74HC595 shift register to add outputs.',
  parts:['Arduino UNO', '74HC595 shift register', '5mm LEDs ×8', '220Ω resistors ×8', 'Ceramic 100nF', '16-pin DIP socket (optional)'],
  wiring:[
    '74HC595 across the centre gap. Pin 16 (VCC) and pin 10 (MR) → 5V. Pin 8 (GND) and pin 13 (OE) → GND. 100nF from pin 16 to GND.',
    'UNO 11 → pin 14 (DS), UNO 12 → pin 11 (SHCP), UNO 8 → pin 12 (STCP).',
    'Outputs Q0 (pin 15) and Q1–Q7 (pins 1–7) → 220Ω → LED → GND.',
  ],
  code:`// Drive 8 LEDs from 3 pins with a 74HC595 shift register.
const int DATA  = 11;   // to 74HC595 pin 14 (DS)
const int CLOCK = 12;   // to 74HC595 pin 11 (SHCP)
const int LATCH = 8;    // to 74HC595 pin 12 (STCP)

void show(byte pattern) {
  digitalWrite(LATCH, LOW);
  shiftOut(DATA, CLOCK, MSBFIRST, pattern);   // send 8 bits
  digitalWrite(LATCH, HIGH);                  // copy them to the outputs
}

void setup() {
  pinMode(DATA, OUTPUT);
  pinMode(CLOCK, OUTPUT);
  pinMode(LATCH, OUTPUT);
}

void loop() {
  for (int i = 0; i < 8; i++) {      // one LED running along
    show(1 << i);
    delay(120);
  }
  for (int n = 0; n < 256; n++) {    // count in binary
    show(n);
    delay(60);
  }
}`,
  expect:'A single light runs along the eight LEDs, then they count from 0 to 255 in binary.',
  how:'shiftOut() clocks 8 bits into the chip one at a time. Nothing changes on the outputs until the latch pin rises, so all eight update together. Each bit of the byte is one LED.',
  tryThis:['Make a “Knight Rider” light that bounces back and forth.', 'Chain a second 74HC595 from Q7′ (pin 9) for 16 outputs, and send two bytes.'],
  pins:['hc595', 'uno'] },

/* ---------- Unit 6 ---------- */
{ id:'millis', unit:6, title:'Multitasking with millis()', goal:'Do several things at once by dropping delay().',
  parts:['Arduino UNO', 'LEDs ×2', '220Ω resistors ×2', 'Push button'],
  wiring:['Pin 9 → 220Ω → LED → GND. Pin 10 → 220Ω → LED → GND.', 'Button between pin 2 and GND.'],
  code:`// Blink two LEDs at different speeds without delay(), and still react to a button instantly.
const int LED_A = 9;
const int LED_B = 10;
const int BUTTON = 2;
const unsigned long PERIOD_A = 500;     // ms
const unsigned long PERIOD_B = 170;

unsigned long lastA = 0, lastB = 0;
bool stateA = false, stateB = false;

void setup() {
  pinMode(LED_A, OUTPUT);
  pinMode(LED_B, OUTPUT);
  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(BUTTON, INPUT_PULLUP);
}

void loop() {
  unsigned long now = millis();
  if (now - lastA >= PERIOD_A) { lastA = now; stateA = !stateA; digitalWrite(LED_A, stateA); }
  if (now - lastB >= PERIOD_B) { lastB = now; stateB = !stateB; digitalWrite(LED_B, stateB); }
  digitalWrite(LED_BUILTIN, digitalRead(BUTTON) == LOW);   // no delay(), so no lag
}`,
  expect:'The two LEDs blink at their own speeds, and the L LED follows the button instantly.',
  how:'delay() freezes the whole program. Instead, each task checks “has enough time passed since I last acted?” and returns straight away if not. loop() now runs thousands of times a second. Writing now − last also keeps working when millis() wraps around after about 49 days.',
  tryThis:['Add a third LED with its own period.', 'Let the pot change PERIOD_B while everything keeps running.'],
  pins:['uno'] },

{ id:'state-machine', unit:6, title:'State machine: pedestrian crossing', goal:'Structure a real behaviour as states and transitions.',
  parts:['Arduino UNO', 'Red, yellow and green LEDs', 'A white or second green LED (walk light)', '220Ω resistors ×4', 'Push button'],
  wiring:['Pins 8, 9, 10 → 220Ω → red, yellow, green LEDs → GND.', 'Pin 11 → 220Ω → walk LED → GND.', 'Button between pin 2 and GND.'],
  code:`// Pedestrian crossing as a state machine: press the button for a walk light.
const int CAR_RED = 8, CAR_YELLOW = 9, CAR_GREEN = 10;
const int WALK = 11, BUTTON = 2;

enum State { CARS_GO, CARS_SLOW, WALKING, WALK_ENDING };
State state = CARS_GO;
unsigned long since = 0;       // when the current state started
bool requested = false;

void setLights(bool red, bool yellow, bool green, bool walk) {
  digitalWrite(CAR_RED, red);
  digitalWrite(CAR_YELLOW, yellow);
  digitalWrite(CAR_GREEN, green);
  digitalWrite(WALK, walk);
}

void enter(State s) {
  state = s;
  since = millis();
}

void setup() {
  pinMode(CAR_RED, OUTPUT);
  pinMode(CAR_YELLOW, OUTPUT);
  pinMode(CAR_GREEN, OUTPUT);
  pinMode(WALK, OUTPUT);
  pinMode(BUTTON, INPUT_PULLUP);
  enter(CARS_GO);
}

void loop() {
  if (digitalRead(BUTTON) == LOW) requested = true;   // remember the press
  unsigned long t = millis() - since;                 // time in this state

  switch (state) {
    case CARS_GO:
      setLights(0, 0, 1, 0);
      if (requested && t > 3000) enter(CARS_SLOW);    // cars get at least 3 s
      break;
    case CARS_SLOW:
      setLights(0, 1, 0, 0);
      if (t > 1500) enter(WALKING);
      break;
    case WALKING:
      setLights(1, 0, 0, 1);
      requested = false;
      if (t > 5000) enter(WALK_ENDING);
      break;
    case WALK_ENDING:
      setLights(1, 0, 0, (t / 250) % 2);              // walk light flashes
      if (t > 2000) enter(CARS_GO);
      break;
  }
}`,
  expect:'Cars have green until you press the button. Then yellow, red with the walk light on for 5 seconds, the walk light flashing for 2 seconds, and back to green.',
  how:'The system is always in exactly one named state. Each state sets its outputs and checks the one condition that moves it on. Adding a feature means adding a state or a transition, not untangling nested if statements — the same pattern runs alarms, menus and robots.',
  tryThis:['Beep the buzzer during WALKING, faster during WALK_ENDING.', 'Add a NIGHT state where the yellow light flashes on its own.'],
  pins:['uno', 'button'] },
];
