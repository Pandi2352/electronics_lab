/* Arduino UNO lessons. Each has wiring, a complete sketch, the expected result and "try this" ideas.
   redo = the breadboard exercise this lesson rebuilds in code. ids are stable progress keys. */

const LESSON_UNITS = [
  { id:1, title:'First programs' },
  { id:2, title:'Digital inputs' },
  { id:3, title:'Analog in & PWM out' },
  { id:4, title:'Sound & motion' },
  { id:5, title:'Modules & chips' },
  { id:6, title:'Writing better code' },
  { id:7, title:'Practice: LEDs & buttons' },
  { id:8, title:'Practice: analog & sensors' },
  { id:9, title:'Practice: sound & motion' },
  { id:10, title:'Practice: displays & logic' },
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
/* ---------- Unit 7: practice ---------- */
{ id:'sos', unit:7, title:'SOS in Morse code', goal:'Use functions and loops to blink a pattern.',
  parts:['Arduino UNO'],
  wiring:['No wiring — uses the on-board LED.'],
  code:`// Blink SOS in Morse code on the on-board LED:  ... --- ...
const int LED = LED_BUILTIN;
const int UNIT = 200;              // length of one dot in ms

void flash(int units) {           // a dot (1 unit) or a dash (3 units)
  digitalWrite(LED, HIGH);
  delay(units * UNIT);
  digitalWrite(LED, LOW);
  delay(UNIT);                     // gap inside a letter
}

void letter(int count, int units) {
  for (int i = 0; i < count; i++) flash(units);
  delay(2 * UNIT);                 // gap between letters (3 units in total)
}

void setup() {
  pinMode(LED, OUTPUT);
}

void loop() {
  letter(3, 1);                    // S
  letter(3, 3);                    // O
  letter(3, 1);                    // S
  delay(4 * UNIT);                 // gap between words (7 units in total)
}`,
  expect:'Three short, three long, three short flashes, a pause, then again.',
  how:'Morse timing is all in units: dot 1, dash 3, gap in a letter 1, between letters 3, between words 7. Two small functions build the whole pattern.',
  tryThis:['Change UNIT to speed it up or slow it down.', 'Blink your name in Morse code.'],
  pins:['uno'] },

{ id:'chaser', unit:7, title:'LED chaser', goal:'Drive six LEDs from an array.',
  redo:'4017-chaser',
  parts:['Arduino UNO', '5mm LEDs ×6', '220Ω resistors ×6'],
  wiring:['Pins 3, 4, 5, 6, 7 and 8 → 220Ω → LED → GND, in a row on the breadboard.'],
  code:`// LED chaser: a light runs back and forth along six LEDs on pins 3–8.
const int PINS[] = {3, 4, 5, 6, 7, 8};
const int COUNT = 6;
const int SPEED = 80;              // ms per step

void setup() {
  for (int i = 0; i < COUNT; i++) pinMode(PINS[i], OUTPUT);
}

void step(int i) {
  digitalWrite(PINS[i], HIGH);
  delay(SPEED);
  digitalWrite(PINS[i], LOW);
}

void loop() {
  for (int i = 0; i < COUNT; i++) step(i);            // forwards
  for (int i = COUNT - 2; i > 0; i--) step(i);        // back, without repeating the ends
}`,
  expect:'A single light sweeps left and right along the row, like the CD4017 chaser but bouncing.',
  how:'An array holds the pin numbers, so one loop drives every LED. Counting down from COUNT − 2 to 1 skips the end LEDs, which would otherwise light twice in a row.',
  tryThis:['Let the pot on A0 set SPEED.', 'Light two LEDs at once, moving in opposite directions.'],
  pins:['uno'] },

{ id:'press-counter', unit:7, title:'Button press counter', goal:'Detect each new press and count it.',
  parts:['Arduino UNO', '6×6mm tactile push button'],
  wiring:['Button between pin 2 and GND.'],
  code:`// Count button presses and print the total. Button between pin 2 and GND.
const int BUTTON = 2;
int count = 0;
int lastState = HIGH;

void setup() {
  pinMode(BUTTON, INPUT_PULLUP);
  Serial.begin(9600);
  Serial.println("Press the button...");
}

void loop() {
  int state = digitalRead(BUTTON);
  if (state != lastState) {          // the button changed
    if (state == LOW) {              // ...and it is now pressed
      count++;
      Serial.print("Presses: ");
      Serial.println(count);
    }
    delay(20);                       // ignore contact bounce
  }
  lastState = state;
}`,
  expect:'The Serial Monitor prints Presses: 1, 2, 3… — one number per press, however long you hold it.',
  how:'Comparing with the previous reading finds the moment of change (an edge), so holding the button counts once. The short delay after any change skips the bounce.',
  tryThis:['Reset the count to 0 after 10 presses.', 'Print how long each press lasted.'],
  pins:['uno', 'button'] },

{ id:'reaction', unit:7, title:'Reaction timer game', goal:'Measure how fast you react, in milliseconds.',
  parts:['Arduino UNO', 'Red 5mm LED', '220Ω resistor', '6×6mm tactile push button'],
  wiring:['Pin 9 → 220Ω → LED → GND.', 'Button between pin 2 and GND.'],
  code:`// Reaction timer: wait for the LED, then press the button as fast as you can.
const int LED = 9;
const int BUTTON = 2;

void waitForRelease() {
  while (digitalRead(BUTTON) == LOW) {}
  delay(50);
}

void setup() {
  pinMode(LED, OUTPUT);
  pinMode(BUTTON, INPUT_PULLUP);
  Serial.begin(9600);
  randomSeed(analogRead(A5));          // an unconnected pin gives random noise
}

void loop() {
  Serial.println("Get ready...");
  unsigned long wait = random(2000, 5000);   // 2 to 5 seconds
  unsigned long start = millis();
  while (millis() - start < wait) {
    if (digitalRead(BUTTON) == LOW) {        // pressed before the LED
      Serial.println("Too soon! Try again.");
      waitForRelease();
      delay(1000);
      return;                                // start loop() again
    }
  }
  digitalWrite(LED, HIGH);
  unsigned long lit = millis();
  while (digitalRead(BUTTON) == HIGH) {}     // wait for the press
  unsigned long reaction = millis() - lit;
  digitalWrite(LED, LOW);
  Serial.print("Reaction time: ");
  Serial.print(reaction);
  Serial.println(" ms");
  waitForRelease();
  delay(2000);
}`,
  expect:'After a random wait the LED lights; press and your time appears — most people score 200–300ms. Pressing early prints “Too soon!”.',
  how:'random() picks the wait so you cannot predict it; randomSeed() from a floating analog pin makes the sequence different each time. millis() before and after gives the reaction time.',
  tryThis:['Keep and print your best time.', 'Make it a two-player game with a second button.'],
  pins:['uno'] },

{ id:'binary-counter', unit:7, title:'Binary counter on four LEDs', goal:'Show a number in binary with bit operations.',
  redo:'dip-binary',
  parts:['Arduino UNO', '5mm LEDs ×4', '220Ω resistors ×4', '6×6mm tactile push button'],
  wiring:['Pins 8, 9, 10, 11 → 220Ω → LED → GND. Put pin 11 on the left (8s) and pin 8 on the right (1s).', 'Button between pin 2 and GND.'],
  code:`// Binary counter: each press adds 1, shown on four LEDs (pins 8–11).
const int LEDS[] = {8, 9, 10, 11};     // bit 0 (value 1) to bit 3 (value 8)
const int BUTTON = 2;
int value = 0;
int lastState = HIGH;

void show(int n) {
  for (int bit = 0; bit < 4; bit++) {
    digitalWrite(LEDS[bit], (n >> bit) & 1);   // is this bit set?
  }
}

void setup() {
  for (int i = 0; i < 4; i++) pinMode(LEDS[i], OUTPUT);
  pinMode(BUTTON, INPUT_PULLUP);
  show(0);
}

void loop() {
  int state = digitalRead(BUTTON);
  if (state != lastState) {
    if (state == LOW) {
      value = (value + 1) % 16;          // 0–15, then back to 0
      show(value);
    }
    delay(20);
  }
  lastState = state;
}`,
  expect:'Each press counts up in binary: 0001, 0010, 0011… up to 1111 (15), then back to 0000.',
  how:'n >> bit shifts the wanted bit into position 0, and & 1 keeps only that bit — so each LED shows one bit of the number. % 16 wraps the count after 15.',
  tryThis:['Add a second button that counts down.', 'Count automatically every half second.'],
  pins:['uno'] },

/* ---------- Unit 8: practice ---------- */
{ id:'bar-graph', unit:8, title:'Potentiometer bar graph', goal:'Turn an analog reading into a row of LEDs.',
  parts:['Arduino UNO', '5mm LEDs ×5', '220Ω resistors ×5', '10kΩ potentiometer'],
  wiring:['Pins 3–7 → 220Ω → LED → GND.', 'Pot outer pins → 5V and GND, wiper → A0.'],
  code:`// Bar graph: five LEDs on pins 3–7 show the pot position.
const int LEDS[] = {3, 4, 5, 6, 7};
const int COUNT = 5;
const int POT = A0;

void setup() {
  for (int i = 0; i < COUNT; i++) pinMode(LEDS[i], OUTPUT);
}

void loop() {
  int lit = map(analogRead(POT), 0, 1023, 0, COUNT);   // how many LEDs to light
  for (int i = 0; i < COUNT; i++) {
    digitalWrite(LEDS[i], i < lit ? HIGH : LOW);
  }
  delay(20);
}`,
  expect:'Turning the pot fills the bar from none to all five LEDs, like a volume meter.',
  how:'map() turns 0–1023 into 0–5, and every LED whose position is below that number lights up.',
  tryThis:['Make the last LED blink when the bar is full.', 'Swap the pot for the LDR divider to make a light meter.'],
  pins:['uno', 'pot'] },

{ id:'light-meter', unit:8, title:'Light meter in the Serial Monitor', goal:'Show a sensor as a percentage and a text bar.',
  parts:['Arduino UNO', 'LDR (light-dependent resistor)', '10kΩ resistor'],
  wiring:['5V → LDR → A0 → 10kΩ → GND.'],
  code:`// Light meter: the light level as a percentage and a bar of # characters.
const int LDR = A0;       // 5V -> LDR -> A0 -> 10k -> GND

void setup() {
  Serial.begin(9600);
}

void loop() {
  int percent = map(analogRead(LDR), 0, 1023, 0, 100);
  Serial.print(percent);
  Serial.print("% ");
  for (int i = 0; i < percent / 5; i++) Serial.print('#');   // one # per 5%
  Serial.println();
  delay(250);
}`,
  expect:'Lines like “63% ############” that grow when you shine a torch and shrink when you cover the LDR.',
  how:'Printing a variable number of characters is a quick way to draw a bar in plain text. Integer division (percent / 5) gives up to 20 characters.',
  tryThis:['Remember the brightest and darkest readings and rescale between them.', 'Print a warning when it gets too dark.'],
  pins:['uno'] },

{ id:'rgb-rainbow', unit:8, title:'RGB rainbow', goal:'Blend colours smoothly with three PWM channels.',
  redo:'rgb-mix',
  parts:['Arduino UNO', 'RGB LED — common cathode', '220Ω resistors ×3'],
  wiring:['Longest leg (common) → GND.', 'Red, green and blue legs → 220Ω each → pins 9, 10 and 11.'],
  code:`// RGB rainbow: cycle a common-cathode RGB LED through every colour.
const int RED = 9, GREEN = 10, BLUE = 11;    // PWM pins

void setColor(int r, int g, int b) {
  analogWrite(RED, r);
  analogWrite(GREEN, g);
  analogWrite(BLUE, b);
}

void setup() {
  pinMode(RED, OUTPUT);
  pinMode(GREEN, OUTPUT);
  pinMode(BLUE, OUTPUT);
}

void loop() {
  for (int i = 0; i < 255; i++) { setColor(255 - i, i, 0); delay(10); }   // red to green
  for (int i = 0; i < 255; i++) { setColor(0, 255 - i, i); delay(10); }   // green to blue
  for (int i = 0; i < 255; i++) { setColor(i, 0, 255 - i); delay(10); }   // blue to red
}`,
  expect:'The LED glides red → yellow → green → cyan → blue → magenta → red, about 8 seconds per cycle.',
  how:'Fading one channel down while the next fades up passes through every mixed colour in between. For a common-anode LED, connect the common leg to 5V and use 255 − value.',
  tryThis:['Set the colour from the Serial Monitor, e.g. “255,0,128”.', 'Make the speed follow the pot.'],
  pins:['uno', 'rgb'] },

{ id:'thermostat', unit:8, title:'Thermostat with hysteresis', goal:'Switch an output on temperature, without chattering.',
  redo:'heat-alarm',
  parts:['Arduino UNO', 'NTC 10k thermistor', '10kΩ resistor', 'Red 5mm LED', '220Ω resistor'],
  wiring:['5V → 10kΩ → A0 → thermistor → GND.', 'Pin 9 → 220Ω → LED (standing in for a fan) → GND.'],
  code:`// Thermostat: a "fan" LED turns on above 28 °C and off again below 27 °C.
const int SENSOR = A0;     // 5V -> 10k -> A0 -> NTC -> GND
const int FAN = 9;
const float ON_AT = 28.0;
const float OFF_AT = 27.0;
bool fanOn = false;

float readCelsius() {
  int raw = analogRead(SENSOR);
  float r = 10000.0 * raw / (1023.0 - raw);                          // thermistor resistance
  float kelvin = 1.0 / (1.0 / 298.15 + log(r / 10000.0) / 3950.0);   // Beta equation
  return kelvin - 273.15;
}

void setup() {
  pinMode(FAN, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  float t = readCelsius();
  if (!fanOn && t > ON_AT) fanOn = true;
  if (fanOn && t < OFF_AT) fanOn = false;
  digitalWrite(FAN, fanOn);
  Serial.print(t, 1);
  Serial.println(fanOn ? " C  fan ON" : " C  fan off");
  delay(500);
}`,
  expect:'Warming the thermistor above 28°C turns the LED on; it stays on until the reading drops below 27°C.',
  how:'Two thresholds with a gap between them (hysteresis) stop the output flicking on and off when the temperature hovers near one value — exactly how home thermostats behave.',
  tryThis:['Set ON_AT and OFF_AT from the Serial Monitor.', 'Drive a real fan through the MOSFET circuit instead of the LED.'],
  pins:['uno'] },

{ id:'plotter', unit:8, title:'Graph two sensors in the Serial Plotter', goal:'See live data as a graph.',
  parts:['Arduino UNO', '10kΩ potentiometer', 'LDR (light-dependent resistor)', '10kΩ resistor'],
  wiring:['Pot wiper → A0 (outer pins to 5V and GND).', '5V → LDR → A1 → 10kΩ → GND.', 'After uploading, open Tools → Serial Plotter at 9600 baud.'],
  code:`// Serial Plotter: graph the pot and the LDR at the same time.
void setup() {
  Serial.begin(9600);
}

void loop() {
  Serial.print("pot:");
  Serial.print(analogRead(A0));
  Serial.print(",light:");
  Serial.println(analogRead(A1));
  delay(50);
}`,
  expect:'Two coloured lines, labelled pot and light, that move as you turn the knob and cover the LDR.',
  how:'The Serial Plotter draws every line of numbers it receives. Label:value pairs separated by commas become separate named traces.',
  tryThis:['Add a third line: the average of the last 10 light readings.', 'Watch the LDR’s response under a flickering mains lamp.'],
  pins:['uno', 'pot'] },

/* ---------- Unit 9: practice ---------- */
{ id:'theremin', unit:9, title:'Light theremin', goal:'Play notes by waving your hand over a light sensor.',
  parts:['Arduino UNO', 'LDR (light-dependent resistor)', '10kΩ resistor', 'Passive piezo buzzer'],
  wiring:['5V → LDR → A0 → 10kΩ → GND.', 'Pin 8 → buzzer + ; buzzer − → GND.'],
  code:`// Light theremin: wave your hand over the LDR to change the pitch.
const int LDR = A0;          // 5V -> LDR -> A0 -> 10k -> GND
const int BUZZER = 8;        // passive buzzer
int darkest = 1023, brightest = 0;

void setup() {
  // Calibrate for 5 s while the L LED is on: move your hand over the LDR.
  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, HIGH);
  unsigned long start = millis();
  while (millis() - start < 5000) {
    int v = analogRead(LDR);
    if (v < darkest) darkest = v;
    if (v > brightest) brightest = v;
  }
  if (brightest <= darkest) brightest = darkest + 1;   // avoid dividing by zero
  digitalWrite(LED_BUILTIN, LOW);
}

void loop() {
  int v = constrain(analogRead(LDR), darkest, brightest);
  int pitch = map(v, darkest, brightest, 200, 2000);
  tone(BUZZER, pitch, 20);
  delay(10);
}`,
  expect:'After the 5-second calibration, the pitch rises as more light reaches the LDR and falls as your hand covers it.',
  how:'Calibration records the real range of readings in your room, so map() uses the whole 200–2000Hz range. constrain() keeps readings inside that range.',
  tryThis:['Snap the pitch to the notes of a scale.', 'Add a button that silences it.'],
  pins:['uno'] },

{ id:'siren', unit:9, title:'Two-tone siren', goal:'Toggle a siren with a button while it keeps running.',
  parts:['Arduino UNO', 'Passive piezo buzzer', '6×6mm tactile push button'],
  wiring:['Pin 8 → buzzer + ; buzzer − → GND.', 'Button between pin 2 and GND.'],
  code:`// Siren: press the button to start or stop a two-tone siren. Uses millis(), not delay().
const int BUZZER = 8, BUTTON = 2;
bool on = false;
bool highTone = false;
int lastState = HIGH;
unsigned long lastSwitch = 0;

void setup() {
  pinMode(BUTTON, INPUT_PULLUP);
}

void loop() {
  int state = digitalRead(BUTTON);
  if (state != lastState) {
    if (state == LOW) {
      on = !on;
      if (!on) noTone(BUZZER);
    }
    delay(20);
  }
  lastState = state;

  if (on && millis() - lastSwitch >= 400) {   // swap tones every 0.4 s
    lastSwitch = millis();
    highTone = !highTone;
    tone(BUZZER, highTone ? 960 : 770);
  }
}`,
  expect:'One press starts a “nee-naw” siren, the next press stops it — and the button always responds instantly.',
  how:'tone() without a duration keeps playing until changed, so the sketch only switches the frequency every 400ms. Because nothing waits with delay(), the button is checked continuously.',
  tryThis:['Make a rising and falling “wail” instead of two tones.', 'Flash an LED in time with the siren.'],
  pins:['uno'] },

{ id:'servo-sweep', unit:9, title:'Servo sweep with speed control', goal:'Move a servo smoothly with a speed you can adjust.',
  parts:['Arduino UNO', 'SG90 micro servo', '10kΩ potentiometer'],
  wiring:['Servo brown → GND, red → 5V, orange → pin 9.', 'Pot wiper → A0 (outer pins to 5V and GND).'],
  code:`// Servo sweep: the arm swings back and forth; the pot sets the speed.
#include <Servo.h>

Servo servo;
const int POT = A0;

void sweepTo(int from, int to) {
  int step = from < to ? 1 : -1;
  for (int angle = from; angle != to; angle += step) {
    servo.write(angle);
    delay(map(analogRead(POT), 0, 1023, 2, 30));   // ms per degree
  }
}

void setup() {
  servo.attach(9);
}

void loop() {
  sweepTo(0, 180);
  sweepTo(180, 0);
}`,
  expect:'The arm sweeps smoothly from one end to the other and back; turning the pot changes the speed while it moves.',
  how:'Moving one degree at a time with a short pause gives smooth motion. The pot is read inside the loop, so the speed changes immediately.',
  tryThis:['Pause for a second at each end.', 'Sweep only between angles set by two pots.'],
  pins:['uno', 'pot'] },

{ id:'servo-gauge', unit:9, title:'Servo light gauge', goal:'Use a servo as an analog meter needle.',
  parts:['Arduino UNO', 'SG90 micro servo', 'LDR (light-dependent resistor)', '10kΩ resistor', 'Card for a dial'],
  wiring:['Servo brown → GND, red → 5V, orange → pin 9.', '5V → LDR → A0 → 10kΩ → GND.', 'Tape a card pointer to the servo horn and draw a scale behind it.'],
  code:`// Light gauge: a servo needle points to the light level (dark = 0°, bright = 180°).
#include <Servo.h>

Servo needle;
const int LDR = A0;       // 5V -> LDR -> A0 -> 10k -> GND
float smooth = 0;

void setup() {
  needle.attach(9);
}

void loop() {
  smooth = smooth * 0.9 + analogRead(LDR) * 0.1;    // average out flicker
  needle.write(map((int)smooth, 0, 1023, 0, 180));
  delay(20);
}`,
  expect:'The needle swings towards 180° in bright light and back towards 0° in the dark, moving smoothly rather than twitching.',
  how:'smooth keeps 90% of the old value and adds 10% of the new reading — a simple low-pass filter that removes jitter.',
  tryThis:['Change 0.9 / 0.1 to 0.98 / 0.02 for a slower, calmer needle.', 'Show temperature instead, using the thermometer code.'],
  pins:['uno'] },

{ id:'motor-soft', unit:9, title:'Motor with soft start and stop', goal:'Ramp a motor up and down with one button.',
  parts:['Arduino UNO', 'The MOSFET motor circuit from the “Motor speed with a MOSFET” lesson', '6×6mm tactile push button'],
  wiring:['Build the MOSFET motor circuit (gate from pin 5).', 'Button between pin 2 and GND.'],
  code:`// Motor with soft start and stop: each press ramps the motor up or down.
const int MOTOR = 5, BUTTON = 2;
bool running = false;

void ramp(int from, int to) {
  int step = from < to ? 1 : -1;
  for (int s = from; s != to + step; s += step) {
    analogWrite(MOTOR, s);
    delay(8);                      // about 2 s over the full range
  }
}

void setup() {
  pinMode(MOTOR, OUTPUT);
  pinMode(BUTTON, INPUT_PULLUP);
}

void loop() {
  if (digitalRead(BUTTON) == LOW) {
    running = !running;
    if (running) ramp(0, 255);
    else ramp(255, 0);
    while (digitalRead(BUTTON) == LOW) {}    // wait for release
    delay(50);
  }
}`,
  expect:'Press once: the motor speeds up smoothly over about 2 seconds. Press again: it slows smoothly to a stop.',
  how:'Starting a motor at full power draws a big current surge and jerks the mechanism. Ramping the PWM value spreads the start over time — the same idea as an e-bike or fan controller.',
  tryThis:['Make the ramp time adjustable with the pot.', 'Add a second button for an emergency stop that skips the ramp.'],
  pins:['irlz44n', 'uno'] },

/* ---------- Unit 10: practice ---------- */
{ id:'seven-seg', unit:10, title:'Count 0–9 on a 7-segment display', goal:'Drive a raw display from a lookup table.',
  redo:'7-segment',
  parts:['Arduino UNO', '7-segment display — common cathode', '220Ω resistors ×7'],
  wiring:['Both COM pins → GND.', 'Segments a, b, c, d, e, f, g → 220Ω each → pins 2, 3, 4, 5, 6, 7, 8.'],
  code:`// Count 0–9 on a common-cathode 7-segment display. Segments a–g on pins 2–8.
const int SEG[] = {2, 3, 4, 5, 6, 7, 8};    // a, b, c, d, e, f, g

// Lit segments for each digit, as bits: g f e d c b a
const byte DIGITS[] = {
  0b0111111,  // 0
  0b0000110,  // 1
  0b1011011,  // 2
  0b1001111,  // 3
  0b1100110,  // 4
  0b1101101,  // 5
  0b1111101,  // 6
  0b0000111,  // 7
  0b1111111,  // 8
  0b1101111,  // 9
};

void showDigit(int d) {
  for (int s = 0; s < 7; s++) {
    digitalWrite(SEG[s], (DIGITS[d] >> s) & 1);
  }
}

void setup() {
  for (int s = 0; s < 7; s++) pinMode(SEG[s], OUTPUT);
}

void loop() {
  for (int d = 0; d <= 9; d++) {
    showDigit(d);
    delay(700);
  }
}`,
  expect:'The display counts 0, 1, 2 … 9 and starts again.',
  how:'Each digit is stored as one byte where every bit is a segment. This lookup table is exactly what the DIP switches did by hand in exercise 30.',
  tryThis:['Count down instead.', 'Show the pot position as 0–9.', 'Add hexadecimal A–F to the table.'],
  pins:['seg7', 'uno'] },

{ id:'dice-7seg', unit:10, title:'Electronic dice on the display', goal:'Roll a random number with a little animation.',
  redo:'dice-555',
  parts:['Arduino UNO', 'The 7-segment display circuit from the previous exercise', '6×6mm tactile push button'],
  wiring:['Keep the display on pins 2–8.', 'Button between pin 10 and GND.'],
  code:`// Electronic dice: press the button to roll; the display shows 1–6.
const int SEG[] = {2, 3, 4, 5, 6, 7, 8};
const byte DIGITS[] = {0b0111111, 0b0000110, 0b1011011, 0b1001111, 0b1100110, 0b1101101, 0b1111101};
const int BUTTON = 10;

void showDigit(int d) {
  for (int s = 0; s < 7; s++) digitalWrite(SEG[s], (DIGITS[d] >> s) & 1);
}

void setup() {
  for (int s = 0; s < 7; s++) pinMode(SEG[s], OUTPUT);
  pinMode(BUTTON, INPUT_PULLUP);
  randomSeed(analogRead(A5));
  showDigit(0);
}

void loop() {
  if (digitalRead(BUTTON) == LOW) {
    for (int i = 0; i < 15; i++) {         // a "rolling" animation that slows down
      showDigit(random(1, 7));
      delay(40 + i * 10);
    }
    showDigit(random(1, 7));               // the result, 1 to 6
    while (digitalRead(BUTTON) == LOW) {}
    delay(50);
  }
}`,
  expect:'Each press shows numbers flickering and slowing down, then settles on a result from 1 to 6.',
  how:'random(1, 7) returns 1 to 6 — the upper limit is not included. The slowing animation is just a growing delay.',
  tryThis:['Count how often each number comes up over 60 rolls.', 'Roll two dice, one after the other.'],
  pins:['seg7', 'uno'] },

{ id:'lcd-thermo', unit:10, title:'LCD thermometer with min and max', goal:'Combine a sensor, a calculation and a display.',
  parts:['Arduino UNO', 'LCD1602 with I2C backpack', 'NTC 10k thermistor', '10kΩ resistor'],
  wiring:['LCD: VCC → 5V, GND → GND, SDA → A4, SCL → A5.', '5V → 10kΩ → A0 → thermistor → GND.'],
  code:`// LCD thermometer: the temperature from the NTC, plus the lowest and highest seen.
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);    // your address from the I2C scanner
const int SENSOR = A0;                 // 5V -> 10k -> A0 -> NTC -> GND
float lowest = 999, highest = -999;

float readCelsius() {
  int raw = analogRead(SENSOR);
  float r = 10000.0 * raw / (1023.0 - raw);
  return 1.0 / (1.0 / 298.15 + log(r / 10000.0) / 3950.0) - 273.15;
}

void setup() {
  lcd.init();
  lcd.backlight();
}

void loop() {
  float t = readCelsius();
  if (t < lowest) lowest = t;
  if (t > highest) highest = t;

  lcd.setCursor(0, 0);
  lcd.print("Temp: ");
  lcd.print(t, 1);
  lcd.print((char)223);               // the degree sign on this LCD
  lcd.print("C   ");
  lcd.setCursor(0, 1);
  lcd.print("Lo ");
  lcd.print(lowest, 1);
  lcd.print(" Hi ");
  lcd.print(highest, 1);
  lcd.print("  ");
  delay(1000);
}`,
  expect:'Line 1 shows the temperature, e.g. “Temp: 26.4°C”. Line 2 keeps the lowest and highest values since power-up.',
  how:'Tracking a minimum and maximum just means comparing each new reading with the stored values. Character 223 is the degree symbol in the LCD’s built-in font.',
  tryThis:['Add a button that resets Lo and Hi.', 'Show °F on a second screen when the button is held.'],
  pins:['uno'] },

{ id:'stopwatch', unit:10, title:'Stopwatch on the LCD', goal:'Time events to a tenth of a second with start, stop and reset.',
  parts:['Arduino UNO', 'LCD1602 with I2C backpack', '6×6mm tactile push buttons ×2'],
  wiring:['LCD: VCC → 5V, GND → GND, SDA → A4, SCL → A5.', 'Start/stop button between pin 2 and GND. Reset button between pin 3 and GND.'],
  code:`// Stopwatch: button 1 starts and stops, button 2 resets (while stopped).
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);
const int START_STOP = 2, RESET_BTN = 3;
bool running = false;
unsigned long startedAt = 0;      // millis() when the current run started
unsigned long banked = 0;         // time from earlier runs
int lastState = HIGH;

void setup() {
  pinMode(START_STOP, INPUT_PULLUP);
  pinMode(RESET_BTN, INPUT_PULLUP);
  lcd.init();
  lcd.backlight();
  lcd.print("Stopwatch");
}

void loop() {
  int s = digitalRead(START_STOP);
  if (s != lastState) {
    if (s == LOW) {
      if (running) banked += millis() - startedAt;   // stop: keep the time
      else startedAt = millis();                     // start
      running = !running;
    }
    delay(20);
  }
  lastState = s;

  if (!running && digitalRead(RESET_BTN) == LOW) banked = 0;

  unsigned long total = banked + (running ? millis() - startedAt : 0);
  unsigned long tenths = total / 100;
  int minutes = tenths / 600;
  int seconds = (tenths / 10) % 60;

  lcd.setCursor(0, 1);
  if (minutes < 10) lcd.print('0');
  lcd.print(minutes);
  lcd.print(':');
  if (seconds < 10) lcd.print('0');
  lcd.print(seconds);
  lcd.print('.');
  lcd.print(tenths % 10);
  lcd.print(running ? "  run " : "  stop");
}`,
  expect:'The second line shows mm:ss.t. Start, stop and restart continue from the same time; reset returns it to 00:00.0.',
  how:'Time is kept as “banked” time from earlier runs plus the current run, so stopping and restarting never loses time. Integer division and % split milliseconds into minutes, seconds and tenths.',
  tryThis:['Add a lap button that freezes the display while the timer keeps running.', 'Beep at every full minute.'],
  pins:['uno'] },

{ id:'combo-lock', unit:10, title:'Button combination lock', goal:'Check a sequence of inputs against a secret code.',
  parts:['Arduino UNO', '6×6mm tactile push buttons ×3', 'Green and red 5mm LEDs', '220Ω resistors ×2'],
  wiring:['Buttons 1, 2, 3 between pins 2, 3, 4 and GND.', 'Pin 9 → 220Ω → green LED → GND. Pin 10 → 220Ω → red LED → GND.'],
  code:`// Combination lock: press the buttons in the right order (1, 3, 2) to unlock.
const int BUTTONS[] = {2, 3, 4};      // buttons 1, 2 and 3, each to GND
const int GREEN = 9, RED = 10;
const int CODE[] = {1, 3, 2};
const int LENGTH = 3;
int position = 0;                     // how many correct presses so far

int readButton() {                    // returns 1–3 when a button is pressed, otherwise 0
  for (int i = 0; i < 3; i++) {
    if (digitalRead(BUTTONS[i]) == LOW) {
      delay(20);
      while (digitalRead(BUTTONS[i]) == LOW) {}   // wait for release
      delay(20);
      return i + 1;
    }
  }
  return 0;
}

void blink(int pin, int times) {
  for (int i = 0; i < times; i++) {
    digitalWrite(pin, HIGH); delay(150);
    digitalWrite(pin, LOW);  delay(150);
  }
}

void setup() {
  for (int i = 0; i < 3; i++) pinMode(BUTTONS[i], INPUT_PULLUP);
  pinMode(GREEN, OUTPUT);
  pinMode(RED, OUTPUT);
}

void loop() {
  int b = readButton();
  if (b == 0) return;                 // nothing pressed
  if (b == CODE[position]) {
    position++;
    if (position == LENGTH) {         // the whole code is right
      digitalWrite(GREEN, HIGH);
      delay(3000);                    // "unlocked" for 3 seconds
      digitalWrite(GREEN, LOW);
      position = 0;
    }
  } else {
    position = 0;                     // wrong: start again
    blink(RED, 3);
  }
}`,
  expect:'Pressing 1, 3, 2 lights the green LED for 3 seconds. Any wrong button flashes red three times and starts over.',
  how:'position remembers how far through the code you are; each correct press moves it on and any mistake resets it — a small state machine.',
  tryThis:['Use a servo as the lock bolt.', 'Lock out for 10 seconds after three wrong attempts.', 'Make the code longer.'],
  pins:['uno', 'button'] },
];
