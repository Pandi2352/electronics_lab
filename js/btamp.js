/* Bluetooth amplifier module guide (guides.html). Same block format as js/nano.js.
   Covers the common ready-made boards: 5V mini boards (PAM8403 class) and 12–24V class-D boards (TPA3116D2 class). */

const BTAMP = {
  id:'btamp',
  menu:'Bluetooth Amplifier',
  icon:'speaker',
  blurb:'A small board that receives music from your phone over Bluetooth and drives real speakers. Learn how the module works, how to pick speakers and power supplies, how to wire it safely, then build 26 projects — from your first sound to a portable battery speaker, a 2.1 system, an LED VU meter and your own ESP32 Bluetooth receiver.',
  keys:{ done:'lab-btamp-guide', buy:'lab-btamp-guide-buy' },
  sections:[
  { id:'start', short:'Start here', title:'Start here',
    blocks:[
      { p:'A Bluetooth amplifier module is three circuits on one board: a Bluetooth receiver that gets the music from your phone, a DAC that turns it into an audio signal, and a class-D power amplifier that makes it strong enough to move a speaker cone. Add power and two speakers and you have a working Bluetooth speaker.' },
      { flow:{ label:'The audio chain', steps:['Phone', 'Bluetooth receiver', 'DAC', 'Volume', 'Class-D amplifier', 'Speakers'] } },
      { cards:{ label:'What you will learn', items:[
        ['Power', 'Voltage, current and watts — and why the supply decides how loud it can play.'],
        ['Speakers', 'Impedance (4Ω / 8Ω), power rating, sensitivity, polarity and enclosures.'],
        ['Class-D amplifiers', 'Bridged (BTL) outputs, efficiency, heat and clipping.'],
        ['Batteries', 'Safe lithium packs with a BMS, charging and battery indicators.'],
        ['Noise', 'Hum, whine and pops — where they come from and how to kill them.'],
        ['Adding smarts', 'Arduino VU meters and auto power-off, and an ESP32 as your own Bluetooth receiver.'],
      ] } },
      { note:['warn', 'Everything in this guide runs on low-voltage DC (5–24V). Use a ready-made, certified adapter to get it from mains — never build or open a mains power supply.'] },
    ] },

  { id:'meet', short:'Meet the module', title:'Meet the Bluetooth amplifier module',
    blocks:[
      { cards:{ label:'What is on the board', items:[
        ['Bluetooth chip', 'Receives the music (A2DP), shows up on your phone with a name, and often plays voice prompts like “Bluetooth connected”.'],
        ['Antenna', 'A zig-zag track or a small wire. Keep it away from metal — inside a metal box the range drops to almost nothing.'],
        ['Amplifier IC', 'The class-D chip, e.g. PAM8403 on 5V mini boards or TPA3116D2 on 12–24V boards. It may have a small heatsink.'],
        ['Power input', 'Screw terminal, DC barrel jack or USB. Check the + and − markings — cheap boards have no reverse-polarity protection.'],
        ['Speaker terminals', 'L+ L− and R+ R− (or OUTL / OUTR). Each channel is two wires to one speaker.'],
        ['Volume', 'A potentiometer, a rotary encoder or buttons. Some boards also follow your phone’s volume.'],
        ['AUX input', 'A 3.5mm jack or L / G / R pads for a wired source; some boards also have USB-stick or TF-card playback.'],
        ['Status LED', 'Blinking = waiting to pair, steady = connected (varies by board).'],
        ['Inductors & capacitors', 'The output filter. Class-D outputs switch hundreds of thousands of times per second; the filter smooths this into audio.'],
      ] } },
      { pre:{ label:'A typical board, top view', text:
`        ┌──────────────────────────────────────────┐
 ANT ~~ │ [BT chip]              [ VOLUME knob ]    │
        │                                          │
 AUX ◯  │ [DAC]     [ AMP IC + heatsink ]   (LED)  │
        │                                          │
        │  [L][L]  [C][C]      [L][L]              │
        └──┬───┬─────┬───┬───────┬───┬─────┬───┬───┘
          VCC GND    L+  L−      R+  R−
         power in    left spk    right spk` } },
    ] },

  { id:'types', short:'Types of modules', title:'Types of Bluetooth amplifier modules',
    blocks:[
      { table:{ head:['Type', 'Typical supply', 'Real power', 'Best for'], rows:[
        ['5V mini stereo board (PAM8403 class)', '5V (USB)', '2 × 3W into 4Ω', 'First builds, desk and power-bank speakers'],
        ['Mid stereo board (TPA3110 / PAM8610 class)', '8–24V', '2 × 10–15W', 'Bookshelf speakers from a 12V adapter'],
        ['High-power stereo board (TPA3116D2, e.g. ZK-502 style)', '12–24V', '2 × 20–50W', 'Proper home and party speakers'],
        ['2.1 board (2 × TPA3116 + subwoofer channel)', '12–24V', '2 × 50W + 100W sub', 'Satellites plus a subwoofer'],
        ['Mono / subwoofer board (bridged, PBTL)', '12–24V', '1 × 50–100W', 'One big woofer'],
        ['Bluetooth receiver only (no amplifier)', '5V', 'Line-level output', 'Adding Bluetooth to an existing amplifier or speakers'],
        ['Bluetooth MP3 decoder board', '5V / 12V', 'Line-level or small amp', 'USB-stick, TF card, FM radio and Bluetooth in one'],
      ] } },
      { note:['tip', 'Start with a 5V mini board — cheap, powered from USB, and hard to damage. Move to a 12–24V TPA3116 board when you want real volume.'] },
    ] },

  { id:'specs', short:'Reading the specs', title:'Reading the specs (and ignoring the hype)',
    blocks:[
      { table:{ head:['Spec', 'What it means', 'Watch out for'], rows:[
        ['Output power (W RMS)', 'Continuous power per channel.', 'Listings quote the maximum supply voltage and 10% distortion. At 12V a “2 × 50W” board gives about 2 × 15W.'],
        ['PMPO / peak power', 'A marketing number.', 'Ignore it.'],
        ['Supply voltage', 'The range the board accepts, e.g. 12–24V.', 'Never exceed the maximum; more voltage = more possible power.'],
        ['Speaker impedance', 'The load the amp is designed for: 4Ω or 8Ω.', 'Lower impedance = more current and heat. Never go below the rated minimum.'],
        ['THD (distortion)', 'How clean the sound is; 0.1% is clean, 10% is heavy clipping.', 'Power figures are often quoted at 10% THD.'],
        ['Efficiency', 'Class-D boards are about 85–90% efficient.', 'That is why they run cool and suit batteries.'],
        ['Bluetooth version', '5.0 or newer pairs faster and holds the link better.', 'Range is about 10m indoors; walls and metal reduce it.'],
        ['Codec', 'SBC on almost all boards; some add AAC.', 'Expect a delay of about 0.15–0.25s — noticeable when watching video.'],
        ['Channels', 'Stereo (2.0), 2.1 or mono.', 'Check whether a 2.1 board expects 4Ω or 8Ω on the sub channel.'],
      ] } },
      { note:['key', 'Rule of thumb for a bridged class-D amp: maximum clean power ≈ supply voltage² ÷ (2 × speaker Ω), a little less in real life. 12V into 4Ω ≈ 18W, 24V into 4Ω ≈ 72W on paper and about 50W in practice.'] },
    ] },

  { id:'wiring', short:'Terminals & wiring', title:'Terminals & wiring',
    blocks:[
      { table:{ head:['Terminal', 'Connect to', 'Notes'], rows:[
        ['VCC / + / DC IN', 'Supply +', 'Check with a multimeter before connecting.'],
        ['GND / −', 'Supply −', 'Also the ground for the AUX input.'],
        ['L+ / L−', 'Left speaker + and −', 'Neither wire is ground on a bridged class-D output.'],
        ['R+ / R−', 'Right speaker + and −', 'Same as the left.'],
        ['AUX L / G / R', 'Audio source left, ground, right', 'Line level only — never connect speaker outputs here.'],
        ['SUB / LFE (2.1 boards)', 'Subwoofer + and −', 'Often has its own cut-off frequency knob.'],
        ['MUTE / SD / EN (some boards)', 'Low = mute or standby', 'Useful for pop-free power-up with an Arduino.'],
      ] } },
      { pre:{ label:'Stereo wiring', text:
`   Supply +  ─────────►  VCC
   Supply −  ─────────►  GND
                          │
               [ Bluetooth amp board ]
                L+   L−       R+   R−
                │    │        │    │
                +    −        +    −
              ┌─────────┐   ┌─────────┐
              │  LEFT   │   │  RIGHT  │
              │ speaker │   │ speaker │
              └─────────┘   └─────────┘

   Each speaker gets its OWN two wires.
   Never join L− and R−, and never connect either to GND.` } },
      { note:['warn', 'Class-D boards use bridged (BTL) outputs: both speaker wires carry signal, and each sits at about half the supply voltage. Connecting L− to R− or to ground shorts the amplifier and can destroy it — and you cannot plug headphones straight into the speaker terminals.'] },
    ] },

  { id:'power', short:'Power supply', title:'Choosing the power supply',
    blocks:[
      { table:{ label:'Supply voltage vs power', head:['Supply', '4Ω speaker', '8Ω speaker'], rows:[
        ['5V (USB)', '≈ 3W per channel', '≈ 1.5W per channel'],
        ['12V', '≈ 15W', '≈ 8W'],
        ['19V (laptop adapter)', '≈ 35W', '≈ 20W'],
        ['24V', '≈ 50W', '≈ 30W'],
      ] } },
      { table:{ label:'Power sources', head:['Source', 'Good for', 'Notes'], rows:[
        ['USB charger / power bank (5V)', '5V mini boards', 'Some power banks switch off when the current is low — use one with an “always on” mode.'],
        ['12V 3–5A adapter', '12–24V boards', 'Cheap and quiet. The most common choice.'],
        ['19–24V adapter (laptop style)', 'TPA3116 boards at full power', 'Check the board’s maximum voltage first.'],
        ['2S lithium pack (7.4V, 2 × 18650)', 'Portable speakers', 'Needs a 2S BMS and a proper 2S charger.'],
        ['3S lithium pack (11.1V)', 'Louder portable speakers', 'Same rules, 3S parts.'],
        ['12V lead-acid battery', 'Outdoor / car use', 'Heavy but simple and robust.'],
      ] } },
      { note:['tip', 'Current needed ≈ total watts ÷ (supply volts × 0.85). Two channels at 15W on 12V can draw about 3A on loud peaks — but music averages far less, so a 12V 3A adapter is fine and 5A gives headroom.'] },
      { note:['warn', 'Lithium cells must always have a BMS (protection board) and a fuse. A shorted 18650 can deliver over 20A and start a fire.'] },
    ] },

  { id:'speakers', short:'Speakers & boxes', title:'Speakers, polarity and enclosures',
    blocks:[
      { table:{ head:['Spec', 'What it means', 'How to choose'], rows:[
        ['Impedance (Ω)', 'The speaker’s “resistance” to AC audio. A 4Ω speaker measures about 3.2–3.6Ω with a multimeter.', 'Match the board: 4Ω for more power, 8Ω for less current and heat.'],
        ['Power rating (W RMS)', 'How much it can take continuously.', 'At least the amp’s real power per channel.'],
        ['Sensitivity (dB/W/m)', 'How loud it plays with 1W. +3dB ≈ double the efficiency.', '85dB is quiet, 90dB+ is loud from little power.'],
        ['Size', 'Bigger cones move more air for bass.', '2–3″ for desk speakers, 4–5″ for bookshelf, 6.5″+ for subwoofers.'],
        ['Full-range vs woofer + tweeter', 'One driver for everything, or split by frequency.', 'Full-range is simplest; add a tweeter with a capacitor for clearer highs.'],
      ] } },
      { cards:{ label:'Enclosures', items:[
        ['No box', 'The back wave cancels the front wave: very little bass.'],
        ['Sealed box', 'Simple, tight bass, forgiving to build — start here.'],
        ['Ported (bass reflex)', 'A tube tuned to boost the bass; the port size must match the driver.'],
        ['Passive radiator', 'A cone with no motor that works like a port — common in portable speakers.'],
        ['Damping', 'Polyfill or foam inside stops echoes in the box.'],
        ['Air-tight', 'Seal every joint. Leaks whistle and kill bass.'],
      ] } },
      { note:['key', 'Polarity check: briefly touch a 1.5V AA cell to the speaker, + to +. The cone moves outward. Wire both speakers the same way — reversed polarity makes the bass disappear.'] },
    ] },

  { id:'setup', short:'First power-up', title:'First power-up, pairing & troubleshooting',
    blocks:[
      { steps:{ label:'Step by step', items:[
        'Identify the + and − power terminals and the speaker terminals from the markings or the seller’s picture.',
        'Connect the speakers first, with the power off.',
        'Measure your supply with the multimeter: the voltage and polarity must match the board.',
        'Turn the board’s volume down, then connect the power. The LED should blink and you may hear a voice prompt.',
        'On your phone open Bluetooth, find the board’s name (often something like “BT-Speaker” or the model number) and pair.',
        'Play music with the phone volume at about half, then raise the board’s volume slowly.',
        'Listen for distortion; if it appears, turn down — that is clipping.',
      ] } },
      { table:{ label:'If it goes wrong', head:['Problem', 'Likely cause', 'Fix'], rows:[
        ['No LED, no sound', 'Wrong polarity or no power.', 'Check the voltage at the terminals with the multimeter.'],
        ['Won’t show up on the phone', 'Already paired to another phone, or in AUX mode.', 'Turn the other phone’s Bluetooth off; press the mode button; power-cycle.'],
        ['Hum or buzz', 'A ground loop (laptop charger, shared grounds).', 'Use a separate supply or a ground-loop isolator on the AUX cable.'],
        ['Whine that changes with sound', 'Noisy switching supply or boost converter.', 'Better supply, LC filter, shorter wires.'],
        ['Loud pop at power-on', 'The amp starts before the audio is stable.', 'Use the mute pin, or power the speakers after the board.'],
        ['Cuts out when loud', 'The supply sags or the battery protection trips.', 'Bigger supply, larger capacitor, fresh battery.'],
        ['Only one channel works', 'A loose screw terminal or a wrong wire.', 'Re-seat the wires; check the speaker with the multimeter.'],
        ['Quiet even at full volume', 'Phone volume low, or 8Ω speakers on a 5V board.', 'Raise the phone volume; use 4Ω speakers or a higher voltage.'],
        ['Board gets very hot', 'Impedance too low or no heatsink.', 'Use 4Ω or higher, add a heatsink, lower the volume.'],
      ] } },
    ] },

  { id:'path', short:'Project path (26)', title:'Bluetooth amplifier project path — basic to advanced',
    blocks:[
      { p:'26 projects in five levels, from first sound to building your own Bluetooth speaker around an ESP32. Tick each project when you have built it, measured it and understood it.' },
      { projects:true },
    ] },

  { id:'starters', short:'First 5 projects', title:'The 5 projects to start with',
    blocks:[
      { p:'Three wiring projects with measurements, then two with code: an Arduino VU meter and an ESP32 Bluetooth receiver.' },
      { starters:true },
    ] },

  { id:'sequence', short:'First 10 sequence', title:'Your first 10 builds',
    blocks:[
      { p:'The order to follow from the projects above.' },
      { sequence:true },
    ] },

  { id:'smarts', short:'Arduino & ESP32', title:'Adding Arduino and ESP32 control',
    blocks:[
      { cards:{ items:[
        ['Pop-free power-up', 'Hold the MUTE / SD pin low for a second after power-on, then release it with an Arduino pin or an RC delay.'],
        ['VU meter', 'A microphone module or the AUX signal into an analog pin drives an LED bar that dances with the music.'],
        ['Auto power-off', 'If no sound for 10 minutes, a MOSFET switches the amplifier off to save the battery.'],
        ['Battery monitor', 'A voltage divider into an analog pin shows the pack level on an OLED.'],
        ['Input selector', 'A relay switches the amp input between Bluetooth and AUX with a button.'],
        ['Your own receiver', 'The classic ESP32 can be a Bluetooth audio receiver (A2DP) and send sound to an I2S DAC or I2S amplifier.'],
        ['Track info', 'The ESP32 receives the song title and artist (AVRCP) to show on a display, with play / pause / next buttons.'],
        ['Internet radio', 'Over Wi-Fi the ESP32 streams web radio to the same I2S output.'],
      ] } },
      { note:['warn', 'Never connect an Arduino ground or input to the speaker terminals — they are bridged outputs, not ground-referenced. Take signals from the AUX / line input side, or use a microphone module.'] },
      { note:['tip', 'Bluetooth audio (A2DP) works only on the original ESP32 (like the DevKit V1). The ESP32-S3 and C3 have BLE only and cannot receive Bluetooth audio from a phone.'] },
    ] },

  { id:'mistakes', short:'Common mistakes', title:'Common mistakes',
    blocks:[
      { table:{ head:['Mistake', 'What happens', 'Do this instead'], rows:[
        ['Speaker − connected to GND', 'The amplifier shorts; the chip may die.', 'Each speaker gets its own + and − from the board.'],
        ['L− and R− joined together', 'Same short — common when using a 3-wire cable.', 'Four separate wires.'],
        ['Reversed power polarity', 'Cheap boards die instantly.', 'Measure first; add a series diode or a polarity-protected jack.'],
        ['Speakers below the rated impedance', 'Overheating and shutdowns.', 'Stay at 4Ω or above (or whatever the board states).'],
        ['Supply too weak', 'Distortion and cut-outs at high volume.', 'Size the supply with the rule above.'],
        ['Volume maxed out', 'Clipping burns tweeters and sounds harsh.', 'Stop just before it distorts.'],
        ['Lithium pack without a BMS or fuse', 'Over-discharge, fire risk.', 'BMS, fuse and a proper charger every time.'],
        ['Antenna inside a metal box', 'Bluetooth drops constantly.', 'Plastic or wood near the antenna, or an external antenna.'],
        ['Laptop and amp sharing grounds', 'Loud hum.', 'Ground-loop isolator or battery power.'],
        ['Tweeter without a capacitor', 'Bass destroys the tweeter.', 'A 3.3–4.7µF bipolar or film capacitor in series.'],
      ] } },
    ] },

  { id:'buy', short:'Buy list', title:'Buy list for the Bluetooth amplifier projects',
    blocks:[
      { p:'Everything the 26 projects need, grouped by use, with estimated prices in Indian rupees. Tick what you already have — the Arduino Nano, ESP32 and 18650 cells may already be on your bench from the other guides.' },
      { buy:true },
    ] },
  ],

  levels:[
    { n:1, title:'Level 1 — First sound', projects:[
      [1, 'First pairing on a 5V mini board', 'Power, pairing, speaker wiring', '5V Bluetooth amp board, 2 × 3W 4Ω speakers, USB cable'],
      [2, 'Speaker polarity & impedance check', 'Speaker markings, DC resistance, phase', 'AA cell, multimeter'],
      [3, 'Measure current vs volume', 'Watts = volts × amps, idle vs loud', 'Multimeter in series'],
      [4, 'Bluetooth vs AUX input', 'Line level, input switching', '3.5mm AUX cable'],
      [5, 'Power-bank speaker', 'Portable 5V power, auto-off problems', 'Power bank'],
    ] },
    { n:2, title:'Level 2 — Real speakers & power', projects:[
      [6, '12V desktop stereo', 'Higher voltage = more power, heatsinks', 'TPA3116 Bluetooth board, 12V adapter, 4″ speakers'],
      [7, 'Sealed speaker box', 'Enclosures, damping, air-tight joints', 'Plywood / MDF, polyfill'],
      [8, 'Adding a tweeter', 'A first-order crossover with one capacitor', 'Tweeters, 3.3–4.7µF film capacitors'],
      [9, 'Subwoofer channel', 'Bass frequencies, low-pass cut-off', '2.1 board, subwoofer driver'],
      [10, '2.1 system', 'Balancing satellites and sub', '2.1 board, speakers, subwoofer'],
    ] },
    { n:3, title:'Level 3 — Portable & battery', projects:[
      [11, '2S 18650 portable speaker', 'Series cells, BMS protection, charging', '2 × 18650, 2S BMS, 2S charger'],
      [12, 'Battery level indicator', 'Voltage vs charge left', 'Battery indicator module'],
      [13, 'Single-cell boost power', 'Boost converters, efficiency, noise', '1 × 18650, MT3608 boost'],
      [14, 'Power switch, fuse & charge port', 'Safe power entry', 'Fuse, switch, DC jack'],
      [15, 'Noise hunting', 'Ground loops, whine, filtering', 'Ground-loop isolator, ferrite, capacitor'],
    ] },
    { n:4, title:'Level 4 — Add smarts with Arduino', projects:[
      [16, 'LED VU meter', 'Sampling audio, peak-to-peak, LED bars', 'Arduino Nano, MAX4466 mic, WS2812 strip'],
      [17, 'Pop-free power-up', 'MUTE / standby pin control', 'Arduino Nano or RC delay'],
      [18, 'Auto power-off after silence', 'Sound detection, MOSFET switching', 'Nano, MOSFET module, mic'],
      [19, 'Battery monitor on OLED', 'Voltage divider, percentage estimate', 'Nano, OLED, resistors'],
      [20, 'Bluetooth / AUX selector', 'Relay switching of audio signals', 'Nano, relay, button'],
    ] },
    { n:5, title:'Level 5 — Build your own with ESP32', projects:[
      [21, 'ESP32 Bluetooth receiver', 'A2DP sink, I2S audio, DACs', 'ESP32, PCM5102A DAC, amp board'],
      [22, 'ESP32 + I2S amplifier', 'Digital audio straight to a speaker', 'ESP32, MAX98357A, 4Ω speaker'],
      [23, 'Stereo ESP32 speaker', 'Left / right channel selection', 'ESP32, 2 × MAX98357A'],
      [24, 'Track info & buttons', 'AVRCP metadata and controls', 'ESP32, OLED, buttons'],
      [25, 'Wi-Fi internet radio', 'Streaming audio over Wi-Fi', 'ESP32, I2S DAC or amp'],
      [26, 'Final: portable Bluetooth speaker', 'Everything combined in one enclosure', 'Board, speakers, battery, BMS, box, controls'],
    ] },
  ],

  sequence:['First pairing on a 5V mini board', 'Speaker polarity & impedance check', 'Measure current vs volume', 'Bluetooth vs AUX input',
    '12V desktop stereo', 'Sealed speaker box', '2S 18650 portable speaker', 'Noise hunting', 'LED VU meter', 'ESP32 Bluetooth receiver'],

  starters:[
    { n:1, title:'First pairing on a 5V mini board', goal:'Make your first Bluetooth speaker in ten minutes, and see what the outputs really are.',
      diagram:
`5V USB supply ──► VCC / GND   (check + and −)
                     │
         [ 5V Bluetooth amp board ]
          L+  L−          R+  R−
          │   │           │   │
        ┌─┴───┴─┐       ┌─┴───┴─┐
        │ LEFT  │       │ RIGHT │   4Ω, 3W
        └───────┘       └───────┘`,
      learn:['Power polarity', 'Pairing', 'Bridged outputs', 'Volume staging'],
      measure:[
        'Supply voltage at the board terminals: about 4.8–5.2V.',
        'Current with no music and with loud music (meter in series): watch it jump with the beat.',
        'Voltage from L+ to L− with no music: about 0V.',
        'Voltage from L+ to GND and from L− to GND: both about half the supply — this is why speaker − is not ground.',
      ],
      noteTip:'Keep the phone volume around half and use the board’s knob for loudness. If sound distorts, both are too high.' },
    { n:2, title:'Speaker polarity & impedance check', goal:'Read a speaker properly before you wire it.',
      diagram:
`AA cell (1.5V)
  +  ──────► speaker +   (red / marked terminal)
  −  ──────► speaker −

Touch for one second only:
cone moves OUT  = polarity correct
cone moves IN   = the wires are swapped`,
      learn:['Nominal vs DC resistance', 'Polarity', 'Phase between two speakers'],
      measure:[
        'DC resistance of each speaker: a 4Ω speaker reads about 3.2–3.6Ω, an 8Ω speaker about 6–7Ω.',
        'Compare two “identical” speakers — they should read within a few tenths of an ohm.',
      ],
      noteKey:'Play music with one speaker wired backwards, then correct it: listen to how much bass comes back. That is phase.' },
    { n:3, title:'2S 18650 portable speaker', goal:'Run a 12–24V class board safely from a lithium pack.',
      diagram:
`18650 ─┬─ 18650            (2 cells in series = 7.4V)
       │
   [ 2S BMS ]  B−  BM  B+   (BM = middle of the two cells)
       P+ ── fuse 3A ── switch ──► amp VCC
       P− ─────────────────────► amp GND

   2S charger (8.4V) ──► P+ / P−`,
      diagramNote:'A TPA3116 board on 7.4V gives about 2 × 6–8W into 4Ω — plenty for a portable speaker, and the pack lasts for hours.',
      learn:['Series cells', 'BMS protection', 'Charging voltage', 'Fuses'],
      measure:[
        'Pack voltage: 8.4V full, about 7.4V half, 6.0–6.4V empty.',
        'Current at loud volume, and how the pack voltage dips on bass hits.',
        'After charging, check both cells are close in voltage (balanced).',
      ],
      noteTip:'Never charge a 2S pack with a single-cell (4.2V) TP4056 board — use a 2S charger made for 8.4V.' },
    { n:4, title:'LED VU meter with Arduino', goal:'Make an LED bar that moves with the music — without touching the speaker outputs.',
      diagram:
`MAX4466 mic module          Arduino Nano
  VCC ─────────────────────  3V3 (quieter) or 5V
  GND ─────────────────────  GND
  OUT ─────────────────────  A0

WS2812B strip (16 LEDs)
  5V  ─────────────────────  5V
  GND ─────────────────────  GND
  DIN ──── 330Ω ───────────  D6`,
      diagramNote:'Put the microphone near the speaker. Add a 470–1000µF capacitor across the strip’s 5V and GND.',
      learn:['Sampling audio', 'Peak-to-peak loudness', 'map() and constrain()', 'Peak-hold effect'],
      noteTip:'Install the “Adafruit NeoPixel” library. Open the Serial Monitor to see the loudness numbers and tune the 10 and 600 in map().',
      code:`// Bluetooth amp project 4 — LED VU meter: a microphone module drives a WS2812 LED bar
// Library: "Adafruit NeoPixel"
#include <Adafruit_NeoPixel.h>

const int MIC = A0;          // MAX4466 OUT
const int LED_PIN = 6;
const int NUM = 16;          // LEDs in the bar
const int WINDOW_MS = 40;    // measure the loudness over 40 ms

Adafruit_NeoPixel bar(NUM, LED_PIN, NEO_GRB + NEO_KHZ800);
int peakLevel = 0;
unsigned long peakTime = 0;

void setup() {
  bar.begin();
  bar.setBrightness(40);     // keeps the current low when powered from USB
  Serial.begin(9600);
}

void loop() {
  // 1. find the lowest and highest reading in the window
  int lo = 1023, hi = 0;
  unsigned long start = millis();
  while (millis() - start < WINDOW_MS) {
    int v = analogRead(MIC);
    if (v < lo) lo = v;
    if (v > hi) hi = v;
  }
  int loudness = hi - lo;    // peak-to-peak

  // 2. turn loudness into a number of LEDs
  int level = constrain(map(loudness, 10, 600, 0, NUM), 0, NUM);

  // 3. the peak dot holds, then falls slowly
  if (level >= peakLevel) {
    peakLevel = level;
    peakTime = millis();
  } else if (peakLevel > 0 && millis() - peakTime > 400) {
    peakLevel--;
    peakTime = millis() - 300;   // fall one step every 100 ms
  }

  // 4. draw: green, then yellow, then red
  for (int i = 0; i < NUM; i++) {
    uint32_t c = 0;
    if (i < level) {
      if (i < NUM * 6 / 10) c = bar.Color(0, 150, 0);
      else if (i < NUM * 85 / 100) c = bar.Color(150, 110, 0);
      else c = bar.Color(160, 0, 0);
    }
    if (i == peakLevel - 1) c = bar.Color(80, 80, 160);
    bar.setPixelColor(i, c);
  }
  bar.show();
  Serial.println(loudness);
}` },
    { n:5, title:'ESP32 Bluetooth receiver', goal:'Make your own Bluetooth audio receiver and feed any amplifier board.',
      diagram:
`ESP32 DevKit           PCM5102A DAC module
  VIN (5V) ──────────  VIN
  GND ───────────────  GND
  GPIO26 ────────────  BCK
  GPIO25 ────────────  LCK (LRCK)
  GPIO22 ────────────  DIN
                       SCK ── GND

PCM5102A line out (3.5mm) ──► amp board AUX in`,
      diagramNote:'On the common purple PCM5102A board, bridge the back solder pads 1 L, 2 L, 3 H, 4 L (3 H un-mutes it), and tie SCK to GND if there is no pad for it.',
      learn:['Bluetooth A2DP', 'I2S digital audio', 'DACs', 'Line level into an amplifier'],
      noteKey:'Install “arduino-audio-tools” and “ESP32-A2DP” by Phil Schatzmann (download each as a ZIP from GitHub, then Sketch → Include Library → Add .ZIP Library). Choose Tools → Partition Scheme → “Huge APP” — the Bluetooth stack is large.',
      noteTip:'This needs the original ESP32 (DevKit V1). The ESP32-S3 and C3 cannot receive Bluetooth audio.',
      code:`// Bluetooth amp project 5 — your own Bluetooth receiver:
// phone ──Bluetooth──► ESP32 ──I2S──► PCM5102A DAC ──► amplifier board AUX in
// Libraries: "arduino-audio-tools" and "ESP32-A2DP" (Phil Schatzmann)
// Board: ESP32 Dev Module · Partition Scheme: Huge APP
#include "AudioTools.h"
#include "BluetoothA2DPSink.h"

I2SStream i2s;
BluetoothA2DPSink a2dp(i2s);

void setup() {
  Serial.begin(115200);

  auto cfg = i2s.defaultConfig();
  cfg.pin_bck = 26;          // PCM5102A BCK
  cfg.pin_ws = 25;           // PCM5102A LCK
  cfg.pin_data = 22;         // PCM5102A DIN
  i2s.begin(cfg);

  a2dp.start("My ESP32 Speaker");   // the name your phone will see
  Serial.println("Pair your phone with: My ESP32 Speaker");
}

void loop() {
  delay(1000);               // the audio runs in the background
}` },
  ],

  buy:{
    groups:[
      { title:'Amplifier boards', items:[
        ['Bluetooth 5.0 amp board, 2 × 3W, 5V (PAM8403 class)', 1, 150, 250, '1–5, 16'],
        ['Bluetooth 5.0 amp board, 2 × 50W, 12–24V (TPA3116D2)', 1, 450, 800, '6–8, 11–15'],
        ['Bluetooth 2.1 amp board, 2 × 50W + 100W sub (TPA3116D2)', 1, 900, 1500, '9, 10', 'Check whether the sub channel wants 4Ω or 8Ω.'],
      ] },
      { title:'Speakers & enclosures', items:[
        ['3W 4Ω mini speakers (40–50mm)', 2, 60, 120, '1–5'],
        ['4″ full-range 4Ω speakers, 15–30W', 2, 400, 800, '6–15, 26'],
        ['Dome tweeters', 2, 150, 300, '8'],
        ['6.5″ subwoofer driver, 4Ω', 1, 800, 1500, '9, 10'],
        ['Film / bipolar capacitors 3.3–4.7µF', 2, 20, 50, '8', 'The tweeter crossover.'],
        ['Speaker wire (5m, 1.0–1.5mm²)', 1, 80, 150, '1–26'],
        ['Plywood / MDF panels (or ready-made empty speaker boxes)', 1, 300, 700, '7, 26'],
        ['Polyfill damping', 1, 80, 150, '7, 26'],
      ] },
      { title:'Power', items:[
        ['12V 5A adapter', 1, 350, 600, '6–10'],
        ['18650 protected cells', 2, 250, 400, '11–14, 26', 'You may already have these from the ESP32 list.'],
        ['2S 18650 holder', 1, 40, 80, '11'],
        ['2S BMS protection board', 1, 40, 80, '11, 26'],
        ['2S USB-C charger board (8.4V)', 1, 80, 150, '11, 26'],
        ['Battery level indicator module', 1, 40, 80, '12'],
        ['MT3608 boost converter', 1, 30, 60, '13'],
        ['Fuse holder + fuses, DC jack and switch set', 1, 60, 120, '14'],
        ['Ground-loop isolator (3.5mm)', 1, 150, 300, '15'],
        ['470–1000µF capacitors', 3, 4, 8, '15, 16'],
      ] },
      { title:'Arduino add-ons', items:[
        ['Arduino Nano', 1, 250, 400, '16–20', 'Skip if you have one from the Nano guide.'],
        ['MAX4466 microphone module', 1, 80, 150, '16, 18'],
        ['WS2812B LED strip (30 LEDs)', 1, 150, 300, '16'],
        ['0.96″ I2C OLED', 1, 150, 250, '19, 24'],
        ['Logic-level MOSFET module', 1, 40, 80, '18'],
        ['1-channel 5V relay module', 1, 50, 90, '20'],
        ['Push buttons', 4, 1, 3, '20, 24'],
        ['Resistor pack (330Ω, 10k, 20k…)', 1, 50, 100, '16–20'],
      ] },
      { title:'ESP32 audio', items:[
        ['ESP32 DevKit V1', 1, 350, 600, '21–26', 'Skip if you have one from the ESP32 guide.'],
        ['PCM5102A I2S DAC module', 1, 350, 550, '21, 24, 25'],
        ['MAX98357A I2S amplifier module', 2, 200, 350, '22, 23'],
      ] },
      { title:'Tools', items:[
        ['Soldering iron kit (iron, solder, stand)', 1, 400, 900, '7–26', 'Speaker and battery wires need proper solder joints.'],
        ['3.5mm AUX cable', 1, 50, 100, '4, 15'],
        ['Breadboard and jumper wires', 1, 150, 250, '16–25'],
        ['Digital multimeter', 1, 300, 800, '1–26', 'You already own one — ticked.'],
      ] },
    ],
    owned:['Digital multimeter'],
    extras:[
      { title:'Extras', note:'Not required, but useful upgrades.', items:[
        ['24V 5A adapter', 1, 600, 1000, 'Full power from the TPA3116 boards (check the maximum voltage).'],
        ['Heatsinks for the amplifier IC', 2, 20, 50, 'For long, loud sessions.', true],
        ['Port tube + speaker terminal cups', 1, 100, 200, 'For a ported box with neat connectors.'],
        ['Speaker grille cloth or metal grilles', 1, 100, 250, 'Protects the cones and looks finished.'],
        ['USB power meter', 1, 150, 300, 'See how much the 5V boards really draw.'],
        ['DSO-138 oscilloscope kit', 1, 700, 1200, 'See audio waveforms and clipping with your own eyes.'],
      ] },
    ],
    tips:[
      'Prices are estimates — they vary a lot by seller and quality. Check before you order.',
      'Buy a 5V mini board first; it teaches everything for very little money.',
      'Many parts overlap with the Nano, ESP32 and curriculum lists — tick what you already have.',
      'Old laptop adapters (19V) and old speakers from broken systems work well with TPA3116 boards.',
    ],
  },
};
