/* ESP32 DevKit guide (guides.html). Same block format as js/nano.js.
   Written for the Arduino-ESP32 core 2.x / 3.x in the Arduino IDE. */

const ESP32 = {
  id:'esp32',
  menu:'ESP32 DevKit',
  blurb:'Where IoT begins: a dual-core 3.3V board with Wi-Fi and Bluetooth built in. Learn its pins, power and 3.3V rules, then work through 27 projects in five levels — from Blink to MQTT, ESP-NOW, deep sleep, a Wi-Fi RC car and your own NestJS + React backend.',
  keys:{ done:'lab-esp32-guide', buy:'lab-esp32-guide-buy' },
  sections:[
  { id:'start', short:'Start here', title:'Start here',
    blocks:[
      { p:'The ESP32 is the board your IoT and RC-car goals are built on. You program it in the same Arduino IDE with almost the same code as the Nano and UNO — but it runs at 3.3V, is about 15× faster, has two processor cores, and has Wi-Fi and Bluetooth built in.' },
      { table:{ label:'What changes coming from the Nano / UNO', head:['', 'Nano / UNO', 'ESP32'], rows:[
        ['Logic voltage', '5V', '3.3V — pins are not 5V tolerant'],
        ['Speed', '16 MHz, 1 core', '240 MHz, 2 cores'],
        ['Memory', '2 KB RAM, 32 KB flash', '520 KB RAM, 4 MB flash'],
        ['Wireless', 'None', 'Wi-Fi + Bluetooth Classic + BLE'],
        ['Analog input', '10-bit (0–1023) at 0–5V', '12-bit (0–4095) at about 0–3.3V'],
        ['PWM', '6 fixed pins', 'Almost any output pin'],
        ['Extras', '—', 'Touch pins, 2 DACs, deep sleep, 3 hardware serial ports'],
        ['Serial Monitor', 'Usually 9600 baud', 'Usually 115200 baud'],
      ] } },
      { note:['warn', 'The one rule that matters most: never put 5V on an ESP32 pin. 5V sensor outputs need a voltage divider or a level shifter.'] },
      { flow:{ label:'Keep using the same cycle', steps:['Build', 'Measure', 'Understand', 'Break it', 'Fix it', 'Modify it'] } },
    ] },

  { id:'meet', short:'Meet the ESP32', title:'Meet the ESP32 DevKit V1',
    blocks:[
      { cards:{ label:'What is on the board', items:[
        ['ESP32-WROOM-32 module', 'The metal can holds the ESP32 chip, 4 MB flash and a crystal. The zig-zag track at the end is the Wi-Fi antenna.'],
        ['Antenna', 'Keep metal, wires and batteries away from it — they weaken the Wi-Fi signal.'],
        ['USB-to-serial chip', 'CP2102 or CH340. Install its driver if no port appears.'],
        ['3.3V regulator (AMS1117)', 'Turns 5V from USB or VIN into the 3.3V the ESP32 runs on.'],
        ['EN button', 'Enable = reset. Restarts your sketch.'],
        ['BOOT button (GPIO0)', 'Hold it while uploading if the IDE gets stuck at “Connecting…”.'],
        ['LEDs', 'A red power LED, and a blue LED on GPIO2 you can control.'],
        ['Pin headers', 'The 30-pin board is wide: on a normal breadboard it leaves one free row on each side — use two breadboards side by side.'],
      ] } },
      { table:{ label:'The ESP32 family', head:['Chip', 'Cores', 'Wireless', 'Best for'], rows:[
        ['ESP32 (WROOM-32, DevKit V1)', '2 × 240 MHz', 'Wi-Fi 4, BT Classic + BLE 4.2', 'General IoT — this guide'],
        ['ESP32-S2', '1 × 240 MHz', 'Wi-Fi only', 'Native USB devices, low cost'],
        ['ESP32-S3', '2 × 240 MHz', 'Wi-Fi, BLE 5', 'Cameras, displays, voice, AI'],
        ['ESP32-C3', '1 × 160 MHz RISC-V', 'Wi-Fi, BLE 5', 'Tiny, cheap sensor nodes'],
        ['ESP32-C6', '1 × 160 MHz RISC-V', 'Wi-Fi 6, BLE 5, Zigbee / Thread', 'Matter smart-home devices'],
        ['ESP32-CAM', '2 × 240 MHz', 'Wi-Fi, BT', 'A camera module with few free pins'],
      ] } },
    ] },

  { id:'specs', short:'Specifications', title:'Specifications',
    blocks:[
      { table:{ head:['Feature', 'ESP32 DevKit V1'], rows:[
        ['Processor', 'Xtensa LX6, dual-core, up to 240 MHz'],
        ['Memory', '520 KB SRAM, 4 MB flash'],
        ['Wi-Fi', '802.11 b/g/n, 2.4 GHz only'],
        ['Bluetooth', 'Classic (Bluetooth Serial) and BLE 4.2'],
        ['Logic level', '3.3V — pins are not 5V tolerant'],
        ['Usable GPIO', 'About 25 on the 30-pin board'],
        ['Analog input', '12-bit, 18 channels. Use ADC1 (GPIO 32–39) — ADC2 stops working while Wi-Fi is on'],
        ['DAC', '2 × 8-bit on GPIO 25 and 26'],
        ['Touch inputs', '10 capacitive touch pins (T0–T9)'],
        ['PWM (LEDC)', '16 channels, on almost any output pin'],
        ['Serial ports', '3 (UART0 is the USB port)'],
        ['I2C / SPI', 'I2C default SDA 21 / SCL 22 · SPI (VSPI) MOSI 23, MISO 19, SCK 18, SS 5'],
        ['Current per pin', 'About 20 mA recommended (40 mA absolute maximum)'],
        ['Wi-Fi current', 'About 80–240 mA while transmitting, with short peaks higher'],
        ['Deep sleep', 'About 10 µA for the chip — but a DevKit board draws several mA because of its regulator and USB chip'],
      ] } },
    ] },

  { id:'pinout', short:'Pinout & safe pins', title:'Pinout & safe pins',
    blocks:[
      { pinout:'esp32-devkit' },
      { table:{ label:'Which pins to use', head:['Group', 'GPIO', 'Notes'], rows:[
        ['Safe to use freely', '4, 13, 16, 17, 18, 19, 21, 22, 23, 25, 26, 27, 32, 33', 'Start here for LEDs, buttons and sensors.'],
        ['Input only', '34, 35, 36 (VP), 39 (VN)', 'No output and no internal pull-ups — perfect for analog sensors.'],
        ['Boot (strapping) pins', '0, 2, 5, 12, 15', 'Usable, but they decide how the board starts. GPIO12 must be LOW at boot.'],
        ['Serial to USB', '1 (TX), 3 (RX)', 'Leave free — the Serial Monitor and uploads use them.'],
        ['Never use', '6–11', 'Wired to the flash chip (not on the 30-pin headers).'],
        ['Analog with Wi-Fi on', '32, 33, 34, 35, 36, 39 (ADC1)', 'ADC2 pins (0, 2, 4, 12–15, 25–27) stop reading while Wi-Fi is on.'],
        ['Touch', '4, 0, 2, 15, 13, 12, 14, 27, 33, 32', 'T0–T9, read with touchRead().'],
      ] } },
    ] },

  { id:'power', short:'Powering the ESP32', title:'Powering the ESP32',
    blocks:[
      { table:{ label:'Ways to power it', head:['How', 'Voltage', 'Notes'], rows:[
        ['USB', '5V', 'Easiest. Use a good cable — Wi-Fi current peaks make thin cables cause resets.'],
        ['VIN pin', '5V (up to about 9V with more heat)', 'Goes through the on-board 3.3V regulator. 5V is ideal.'],
        ['3V3 pin', 'Regulated 3.3V only', 'Bypasses the regulator. Never more than 3.6V.'],
        ['Lithium battery', '3.7V cell (4.2V full)', 'Through a proper low-dropout 3.3V regulator or a buck-boost module — never straight onto 3V3.'],
      ] } },
      { note:['warn', '“Brownout detector was triggered” in the Serial Monitor means the supply dipped when Wi-Fi switched on. Use a better cable or supply, and add a 470–1000 µF capacitor across 3V3 and GND.'] },
      { note:['tip', 'For battery projects, deep sleep saves most of the energy — but the DevKit’s regulator and USB chip still draw several mA. For long battery life use a low-power board or a bare module.'] },
    ] },

  { id:'setup', short:'Setup & first upload', title:'Setup & first upload',
    blocks:[
      { steps:{ label:'Get Blink running', items:[
        'In the Arduino IDE open File → Preferences and add this to “Additional boards manager URLs”: https://espressif.github.io/arduino-esp32/package_esp32_index.json',
        'Tools → Board → Boards Manager → search “esp32” → install “esp32 by Espressif Systems”.',
        'Connect the DevKit with a data USB cable. Install the CP210x or CH340 driver if no port appears.',
        'Tools → Board → esp32 → “ESP32 Dev Module” (or “DOIT ESP32 DEVKIT V1”).',
        'Tools → Port → the new port.',
        'Upload project 1 below. If the IDE stops at “Connecting…”, hold BOOT until the upload starts.',
        'Open the Serial Monitor at 115200 baud.',
      ] } },
      { table:{ label:'If it goes wrong', head:['Problem', 'Fix'], rows:[
        ['Stuck at “Connecting…”', 'Hold BOOT when “Connecting” appears; release once uploading starts.'],
        ['“Failed to connect to ESP32”', 'Try another data cable, install the driver, and hold BOOT.'],
        ['Won’t start after wiring something to GPIO12', 'GPIO12 must be LOW at boot — move that wire to a safe pin.'],
        ['Brownout resets when Wi-Fi starts', 'Better USB cable or supply; add a large capacitor on 3V3.'],
        ['analogRead() stuck at 0 or 4095 with Wi-Fi on', 'You are on an ADC2 pin — use GPIO 32–39.'],
        ['Garbage characters in the Serial Monitor', 'Set the speed to 115200 baud.'],
      ] } },
    ] },

  { id:'rules', short:'3.3V rules', title:'3.3V rules & level shifting',
    blocks:[
      { table:{ head:['Part', 'Safe with the ESP32?', 'What to do'], rows:[
        ['3.3V sensors (BME280, BH1750, OLED, MPU6050…)', 'Yes', 'Power them from 3V3.'],
        ['HC-SR04 (5V)', 'Echo is 5V', 'Power from 5V; put a 1kΩ / 2kΩ divider on ECHO.'],
        ['PIR HC-SR501', 'Yes', 'Power from 5V (VIN); its output is already 3.3V.'],
        ['Servos (SG90…)', 'Signal yes', 'Power from a separate 5V supply; the 3.3V signal is enough. Share GND.'],
        ['5V relay modules', 'Sometimes', 'Buy 3.3V-trigger modules, or drive the input through a transistor.'],
        ['5V I2C modules (LCD backpack…)', 'Usually', 'Many work; a BSS138 bidirectional level shifter is the safe choice.'],
        ['Nano / UNO serial TX', 'No — 5V', 'Divider on the Arduino’s TX before the ESP32’s RX.'],
      ] } },
      { note:['tip', 'Divider rule: 5V → 1kΩ → ESP32 pin → 2kΩ → GND gives about 3.3V. Use the voltage divider calculator in the lab’s Tools tab to check other values.'] },
    ] },

  { id:'wireless', short:'Wi-Fi & Bluetooth', title:'Wi-Fi, Bluetooth and the IoT toolbox',
    blocks:[
      { cards:{ items:[
        ['Wi-Fi station', 'The ESP32 joins your home Wi-Fi like a phone does — the normal IoT mode.'],
        ['Access point', 'The ESP32 makes its own Wi-Fi network — for setup pages or places without a router.'],
        ['Web server', 'Serves pages and JSON to any browser on the network — control and monitor from your phone.'],
        ['HTTP client', 'Sends data to your own API (e.g. a NestJS backend) with GET / POST requests.'],
        ['MQTT', 'Publish / subscribe messaging through a broker — the standard for IoT dashboards and Home Assistant.'],
        ['ESP-NOW', 'Fast, direct messages between ESP32s without a router — remotes, sensor networks, your RC car.'],
        ['BLE', 'Bluetooth Low Energy — talk to phone apps and sensors while using little power.'],
        ['Bluetooth Classic', 'BluetoothSerial: a wireless serial link, like an HC-05 built in (classic ESP32 only).'],
        ['OTA updates', 'Upload new code over Wi-Fi — no cable once the device is installed.'],
        ['NTP time', 'Get the exact time from the internet for clocks, schedules and timestamps.'],
      ] } },
    ] },

  { id:'path', short:'Project path (27)', title:'ESP32 project path — basic to advanced',
    blocks:[
      { p:'27 projects in five levels. Tick each project when you have built it, measured it and understood it.' },
      { projects:true },
    ] },

  { id:'starters', short:'First 5 projects', title:'The 5 projects to start with',
    blocks:[
      { p:'Complete sketches for the first steps: plain GPIO, the ADC, touch, a web page and MQTT.' },
      { starters:true },
    ] },

  { id:'sequence', short:'First 10 sequence', title:'Your first 10 ESP32 projects',
    blocks:[
      { p:'The order to follow from the projects above.' },
      { sequence:true },
    ] },

  { id:'mistakes', short:'Common mistakes', title:'Common ESP32 mistakes',
    blocks:[
      { table:{ head:['Mistake', 'What happens', 'Do this instead'], rows:[
        ['5V signal into a pin', 'The pin (or chip) is damaged.', 'Divider or level shifter.'],
        ['Analog sensor on an ADC2 pin', 'Readings stop when Wi-Fi connects.', 'Use GPIO 32–39.'],
        ['Wiring on GPIO12 or other boot pins', 'The board won’t start, or boots oddly.', 'Use the safe pins first.'],
        ['Weak USB cable or supply', 'Brownout resets when Wi-Fi turns on.', 'Good cable, 5V 1A+ supply, big capacitor on 3V3.'],
        ['Servo or motor on the 3V3 pin', 'Resets and glitches.', 'Separate 5V supply, shared GND.'],
        ['delay() in a web or MQTT sketch', 'Pages load slowly; MQTT disconnects.', 'Use millis() and keep loop() fast.'],
        ['Serial Monitor at 9600', 'Garbage text.', '115200 baud.'],
        ['Wi-Fi password in code on GitHub', 'Anyone can read it.', 'Keep secrets in a separate file you don’t commit.'],
        ['Expecting µA deep sleep on a DevKit', 'Battery drains in days.', 'Low-power board or bare module for battery projects.'],
      ] } },
    ] },

  { id:'iot', short:'ESP32 → your system', title:'From the ESP32 to your full system',
    blocks:[
      { p:'This is where your electronics meets your backend work.' },
      { pre:{ text:
`ESP32
  │
  ├── Sensors (I2C, ADC, 1-Wire)
  ├── Motors & servos (PWM)
  ├── Battery telemetry (INA219)
  └── Wi-Fi
          │
          ├── MQTT ──────► Broker ──► Node-RED / Home Assistant
          │
          └── HTTP POST ─► NestJS API
                               │
                               ▼
                            MongoDB
                               │
                               ▼
                    React + TypeScript dashboard` } },
      { note:['key', 'Project 27 is exactly this: the ESP32 posts JSON to your own NestJS API, which stores it in MongoDB and serves it to a React dashboard. Project 26 (the Wi-Fi RC car) is the hardware side of your big project.'] },
    ] },

  { id:'buy', short:'Buy list', title:'Buy list for the ESP32 projects',
    blocks:[
      { p:'Everything the 27 projects need, grouped by use, with estimated prices in Indian rupees. Tick what you already have; tick Add on any extra.' },
      { buy:true },
    ] },
  ],

  levels:[
    { n:1, title:'Level 1 — Basics & what’s different', projects:[
      [1, 'Blink + Serial Monitor', 'First upload, BOOT button, 115200 baud', 'ESP32 (on-board LED, GPIO2)'],
      [2, 'Potentiometer dimmer on ADC1', '12-bit ADC, 3.3V analog, PWM on any pin', 'Potentiometer, LED'],
      [3, 'Touch lamp', 'Capacitive touch pins', 'Wire or foil pad, LED'],
      [4, 'Button with an interrupt', 'attachInterrupt(), instant response', 'Button, LED'],
      [5, 'RGB mood light', 'Three PWM channels, colour mixing', 'RGB LED, resistors'],
      [6, 'Safe 5V sensor wiring', 'Voltage dividers and level shifting', 'HC-SR04, 1kΩ + 2kΩ'],
    ] },
    { n:2, title:'Level 2 — Sensors & displays', projects:[
      [7, 'Climate display', 'I2C on GPIO 21/22, sensor libraries', 'DHT22, 0.96″ OLED'],
      [8, 'Weather station', 'A calibrated I2C sensor', 'BME280, OLED'],
      [9, 'Smart light', 'PIR + LDR on ADC1', 'PIR, LDR, LED'],
      [10, 'Distance meter', 'HC-SR04 with 3.3V logic', 'HC-SR04, divider, OLED'],
      [11, 'Servo + joystick', 'ESP32Servo library, separate 5V', 'SG90, joystick, 5V supply'],
    ] },
    { n:3, title:'Level 3 — Wi-Fi & the web', projects:[
      [12, 'Wi-Fi scanner', 'Networks, signal strength (RSSI)', 'ESP32'],
      [13, 'Web LED controller', 'WebServer, routes, HTML', 'LED'],
      [14, 'Web sensor dashboard', 'JSON endpoints, auto-refreshing pages', 'DHT22'],
      [15, 'Access-point setup page', 'softAP mode, forms', 'ESP32'],
      [16, 'Internet clock', 'NTP time, time zones', 'OLED'],
    ] },
    { n:4, title:'Level 4 — IoT protocols', projects:[
      [17, 'MQTT sensor publisher', 'Brokers, topics, JSON payloads', 'DHT22'],
      [18, 'MQTT relay controller', 'Subscribing, commands, low-voltage loads', 'Relay module (3.3V trigger), LED strip'],
      [19, 'ESP-NOW remote', 'Board-to-board messages without a router', '2 ESP32s, button, LED'],
      [20, 'BLE phone control', 'Bluetooth Low Energy services', 'ESP32, LED, phone app (nRF Connect)'],
      [21, 'Home dashboard', 'MQTT with Node-RED or Home Assistant', 'ESP32 + a PC or Raspberry Pi'],
    ] },
    { n:5, title:'Level 5 — Advanced', projects:[
      [22, 'Deep-sleep battery sensor', 'Deep sleep, timer wake-up, RTC memory', 'DHT22, 18650 + TP4056 + 3.3V LDO'],
      [23, 'Over-the-air updates', 'ArduinoOTA — upload without a cable', 'ESP32'],
      [24, 'Two tasks at once', 'FreeRTOS tasks on both cores', 'LED, sensor'],
      [25, 'Settings that survive power-off', 'Preferences (NVS) storage', 'Button'],
      [26, 'Wi-Fi RC car', 'Web joystick, motor driver, battery power', 'TB6612FNG, 2WD chassis, 2 × 18650, buck converter'],
      [27, 'ESP32 → NestJS → React', 'HTTP POST of JSON to your own backend', 'ESP32, DHT22'],
    ] },
  ],

  sequence:['Blink + Serial Monitor', 'Potentiometer dimmer on ADC1', 'Touch lamp', 'Button with an interrupt', 'Climate display (DHT22 + OLED)',
    'Wi-Fi scanner', 'Web LED controller', 'Web sensor dashboard', 'MQTT sensor publisher', 'ESP-NOW remote'],

  starters:[
    { n:1, title:'Blink + Serial Monitor', goal:'Check the board, the driver and the upload work.',
      diagram:
`ESP32 GPIO2 ── on-board blue LED
USB ────────── Serial Monitor (115200)`,
      learn:['Board package & port', 'BOOT button', '115200 baud', 'Same Arduino functions as the UNO'],
      code:`// ESP32 project 1 — blink the on-board LED and print to the Serial Monitor
const int LED = 2;            // the blue LED on most DevKit V1 boards

void setup() {
  pinMode(LED, OUTPUT);
  Serial.begin(115200);       // ESP32 sketches usually use 115200 baud
  Serial.println("ESP32 is alive!");
}

void loop() {
  digitalWrite(LED, HIGH);
  Serial.println("LED on");
  delay(500);
  digitalWrite(LED, LOW);
  Serial.println("LED off");
  delay(500);
}` },
    { n:2, title:'Potentiometer dimmer on ADC1', goal:'Read an analog voltage and set a PWM brightness.',
      diagram:
`3V3 ── POT ── GND
        │
        └── GPIO34 (ADC1)

GPIO18 ── 220Ω ── LED ── GND`,
      diagramNote:'Connect the pot to 3V3, not 5V — the ESP32 ADC must stay below 3.3V.',
      learn:['12-bit ADC (0–4095)', 'ADC1 vs ADC2', 'analogReadMilliVolts()', 'PWM on any pin'],
      code:`// ESP32 project 2 — potentiometer on an ADC1 pin sets the LED brightness
const int POT = 34;           // ADC1: keeps working when Wi-Fi is on
const int LED = 18;           // almost any output pin can do PWM on the ESP32

void setup() {
  Serial.begin(115200);
  analogReadResolution(12);   // 0–4095
}

void loop() {
  int raw = analogRead(POT);                  // about 0–4095 for 0–3.3V
  int duty = map(raw, 0, 4095, 0, 255);
  analogWrite(LED, duty);                     // needs Arduino-ESP32 core 2.0 or newer
  Serial.printf("raw=%d  duty=%d  mV=%d\\n", raw, duty, analogReadMilliVolts(POT));
  delay(50);
}` },
    { n:3, title:'Touch lamp', goal:'Use a bare wire as a touch button.',
      diagram:
`GPIO4 (T0) ── wire or foil pad (touch this)
GPIO2 ─────── on-board LED`,
      learn:['Capacitive touch', 'Thresholds', 'Edge detection', 'Calibrating with the Serial Monitor'],
      noteTip:'On the classic ESP32 the reading drops when touched. (On the ESP32-S3 it rises instead.)',
      code:`// ESP32 project 3 — touch lamp: tap the wire on GPIO4 (touch T0) to toggle the LED
const int TOUCH = 4;          // T0
const int LED = 2;
const int THRESHOLD = 30;     // below this = touched; check your values in the Serial Monitor
bool on = false;
bool wasTouched = false;

void setup() {
  pinMode(LED, OUTPUT);
  Serial.begin(115200);
}

void loop() {
  int value = touchRead(TOUCH);
  Serial.println(value);
  bool touched = value < THRESHOLD;
  if (touched && !wasTouched) {       // a new touch
    on = !on;
    digitalWrite(LED, on);
  }
  wasTouched = touched;
  delay(50);
}` },
    { n:4, title:'Web LED controller', goal:'Control the board from your phone’s browser.',
      diagram:
`Phone browser
      │  Wi-Fi
      ▼
ESP32 web server  ──  GPIO2 LED
  /      page
  /on    LED on
  /off   LED off`,
      learn:['Wi-Fi station mode', 'IP addresses', 'Web server routes', 'Sending HTML'],
      noteKey:'Put your own Wi-Fi name and password in the sketch, open the Serial Monitor, and browse to the IP address it prints (your phone must be on the same Wi-Fi).',
      code:`// ESP32 project 4 — control an LED from your phone's browser
#include <WiFi.h>
#include <WebServer.h>

const char* SSID = "YOUR_WIFI_NAME";
const char* PASSWORD = "YOUR_WIFI_PASSWORD";
const int LED = 2;

WebServer server(80);

String page() {
  String state = digitalRead(LED) ? "ON" : "OFF";
  return String("<!DOCTYPE html><html><head><meta name='viewport' content='width=device-width'>") +
         "<title>ESP32 LED</title></head><body style='font-family:sans-serif;text-align:center'>" +
         "<h1>LED is " + state + "</h1>" +
         "<p><a href='/on'><button>ON</button></a> <a href='/off'><button>OFF</button></a></p>" +
         "</body></html>";
}

void setup() {
  pinMode(LED, OUTPUT);
  Serial.begin(115200);
  WiFi.begin(SSID, PASSWORD);
  Serial.print("Connecting");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();
  Serial.print("Open http://");
  Serial.println(WiFi.localIP());

  server.on("/", []() { server.send(200, "text/html", page()); });
  server.on("/on", []() { digitalWrite(LED, HIGH); server.send(200, "text/html", page()); });
  server.on("/off", []() { digitalWrite(LED, LOW); server.send(200, "text/html", page()); });
  server.begin();
}

void loop() {
  server.handleClient();      // keep loop() fast: no long delay() here
}` },
    { n:5, title:'MQTT sensor publisher', goal:'Send real readings to an MQTT broker — your first true IoT device.',
      diagram:
`DHT22 ── GPIO4 (10kΩ pull-up to 3V3)
  │
ESP32 ── Wi-Fi ── MQTT broker ── dashboard
                  topic: my-lab/room1/climate
                  {"temp":27.4,"hum":61.0}`,
      learn:['MQTT brokers and topics', 'JSON payloads', 'Reconnecting', 'Timing with millis()'],
      noteTip:'Install the “PubSubClient” (Nick O’Leary) and “DHT sensor library” (Adafruit) libraries. Watch the messages with MQTT Explorer on your PC. The public test broker is fine for learning — use your own broker for real data.',
      code:`// ESP32 project 5 — publish temperature and humidity to MQTT every 10 seconds
// Libraries: "PubSubClient" (Nick O'Leary), "DHT sensor library" (Adafruit)
#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>

const char* SSID = "YOUR_WIFI_NAME";
const char* PASSWORD = "YOUR_WIFI_PASSWORD";
const char* BROKER = "test.mosquitto.org";      // public test broker — use your own later
const char* TOPIC = "my-lab/room1/climate";     // make this unique to you

DHT dht(4, DHT22);            // DHT22 data on GPIO4, 10k pull-up to 3V3
WiFiClient net;
PubSubClient mqtt(net);
unsigned long lastSend = 0;

void connectMqtt() {
  while (!mqtt.connected()) {
    String id = String("esp32-") + String((uint32_t)ESP.getEfuseMac(), HEX);
    Serial.print("MQTT connecting... ");
    if (mqtt.connect(id.c_str())) {
      Serial.println("ok");
    } else {
      Serial.println(mqtt.state());
      delay(2000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  dht.begin();
  WiFi.begin(SSID, PASSWORD);
  while (WiFi.status() != WL_CONNECTED) delay(500);
  Serial.println(WiFi.localIP());
  mqtt.setServer(BROKER, 1883);
}

void loop() {
  if (!mqtt.connected()) connectMqtt();
  mqtt.loop();
  if (millis() - lastSend > 10000) {
    lastSend = millis();
    float t = dht.readTemperature();
    float h = dht.readHumidity();
    if (isnan(t) || isnan(h)) {
      Serial.println("DHT read failed");
      return;
    }
    char msg[64];
    snprintf(msg, sizeof(msg), "{\\"temp\\":%.1f,\\"hum\\":%.1f}", t, h);
    mqtt.publish(TOPIC, msg);
    Serial.println(msg);
  }
}` },
  ],

  buy:{
    groups:[
      { title:'Boards', items:[
        ['ESP32 DevKit V1 (30-pin)', 2, 350, 600, '1–27', 'Two let you build the ESP-NOW remote (19) and keep one project running.'],
        ['USB data cable (Micro-USB or USB-C, to match)', 1, 60, 120, '1–27', 'A thin charge-only cable causes upload failures and brownouts.'],
      ] },
      { title:'Basics', items:[
        ['Full-size breadboard (830-point)', 2, 90, 150, '1–27', 'The ESP32 is wide — two boards side by side leave room on both sides.'],
        ['Male-to-male jumper wires (pack of 40)', 1, 60, 100, '1–27'],
        ['Male-to-female jumper wires (pack of 40)', 1, 60, 100, '7–27'],
        ['220Ω resistor', 10, 0.5, 1, '2–5, 13'],
        ['10kΩ resistor', 10, 0.5, 1, '7, 9, 14, 17', 'DHT22 pull-up and LDR divider.'],
        ['1kΩ + 2kΩ resistors (5 each)', 10, 0.5, 1, '6, 10', 'Dividers for 5V signals.'],
        ['5mm LEDs, mixed', 10, 1, 2, '2–4, 9, 13, 19, 20'],
        ['6×6mm push button', 4, 1, 3, '4, 19, 25'],
        ['10kΩ potentiometer', 1, 10, 20, '2'],
        ['RGB LED (common cathode)', 1, 5, 10, '5'],
      ] },
      { title:'Sensors & displays', items:[
        ['DHT22 temperature & humidity sensor', 1, 150, 250, '7, 14, 17, 22, 27'],
        ['BME280 sensor module', 1, 200, 350, '8', 'Make sure it says BME (with humidity), not BMP.'],
        ['0.96″ I2C OLED display', 1, 150, 250, '7, 8, 10, 16'],
        ['PIR motion sensor (HC-SR501)', 1, 80, 150, '9'],
        ['LDR (photoresistor)', 2, 3, 6, '9'],
        ['HC-SR04 ultrasonic sensor', 1, 60, 120, '6, 10'],
        ['Joystick module', 1, 40, 80, '11'],
      ] },
      { title:'Actuators & robot', items:[
        ['SG90 micro servo', 1, 90, 150, '11'],
        ['Relay module with 3.3V trigger', 1, 60, 100, '18', 'Standard 5V modules may not switch from a 3.3V pin.'],
        ['TB6612FNG motor driver', 1, 150, 250, '26'],
        ['2WD robot chassis kit (motors, wheels, caster)', 1, 350, 600, '26'],
        ['Mini buck converter (to 5V)', 1, 60, 120, '26', 'Battery 7.4V → 5V for the ESP32 and servo.'],
      ] },
      { title:'Power', items:[
        ['18650 protected cells', 2, 250, 400, '22, 26'],
        ['2 × 18650 holder with switch', 1, 60, 120, '26'],
        ['TP4056 charger module (with protection)', 1, 30, 60, '22'],
        ['3.3V low-dropout regulator module (HT7333 / MCP1700)', 1, 40, 80, '22', 'Runs the ESP32 from a single lithium cell efficiently.'],
        ['470–1000 µF capacitor', 2, 4, 8, '1–27', 'Across 3V3 and GND to stop brownouts.'],
        ['5V 2A adapter', 1, 120, 200, '11, 18'],
      ] },
      { title:'Tools', items:[
        ['Digital multimeter', 1, 300, 800, '1–27', 'You already own one — ticked.'],
      ] },
    ],
    owned:['Digital multimeter'],
    extras:[
      { title:'Extras', note:'Not required, but useful next steps.', items:[
        ['4-channel logic level shifter (BSS138)', 1, 40, 80, 'Safe two-way 5V ↔ 3.3V for I2C and serial.', true],
        ['USB power meter', 1, 150, 300, 'See how much current Wi-Fi and deep sleep really use.'],
        ['ESP32-CAM with programmer board', 1, 500, 800, 'Add a camera to the RC car.'],
        ['ESP32-S3 development board', 1, 600, 1000, 'More power for cameras, displays and voice.'],
        ['Raspberry Pi 4 / 5', 1, 4500, 7500, 'Runs your MQTT broker, Node-RED or Home Assistant 24/7.'],
      ] },
    ],
    tips:[
      'Prices are estimates — they vary a lot by seller and quality. Check before you order.',
      'Buy two ESP32 boards: ESP-NOW and many IoT projects need a pair, and a spare saves waiting.',
      'Many parts overlap with the Nano, UNO and curriculum lists — tick what you already have.',
      'Check that relay modules say “3.3V trigger” and that the BME280 really is a BME, not a BMP.',
    ],
  },
};
