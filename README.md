# clawdwhip

![clawdwhip demo: whipping Claude until he goes Rambo, then paying him until he's king](docs/demo.gif)

A fork of [OpenWhip](https://github.com/GitFrog1111/OpenWhip) (MIT): a little pixel Claude
standing on the bottom edge of the Claude desktop app's window. Whip him, pay him, crown
him, tickle him, feed him. Windows only.

## Run

```bash
git clone https://github.com/timotejdzian/clawdwhip.git
cd clawdwhip
npm install
npm start
```

`npm install -g .` in the folder adds a `clawdwhip` command you can run from anywhere. It
resets Claude every time you run it (even if it's already up); `npm start` keeps his state.
(If you already have `npm install -g openwhip`, you can skip `npm install`: it borrows
OpenWhip's Electron and koffi.)

It only runs one copy at a time, so after changing the code, **Quit** from the tray and
start it again.

## Controls

- **Tray icon:** click to bring Claude and the tool rack out over the Claude window (or the
  main screen if the app is closed or minimized); click again to put it away. Right-click:
  **Reset Claude** or **Quit**.
- **Rack** (left of Claude): whip, money gun, spray bottle, feather. Press and hold one to
  carry it; let go and it flies back. **✕** closes everything.
- While you aren't carrying anything the overlay is click-through, so you can keep using
  Claude Code underneath. The exceptions: hovering his AK, and while he's throwing things
  at you (the overlay takes clicks so you can catch).

## Claude

- **Whip** (outer half of the whip, swung fast): he reacts and gets angrier: calm →
  annoyed → irritated → angry → furious → UNHINGED. Anger cools one whip's worth every
  20 s, even while the app is closed. He sometimes ducks or sidesteps a swing (15% when
  calm, up to 45% when UNHINGED), but never twice in a row.
- **His AK-47:** whip him until the anger bar is full (UNHINGED) and he goes Rambo (headband,
  ammo belt, camo). While you carry the whip he fires bursts at your hand; a hit knocks
  the whip back to the rack, a miss leaves a bullet hole. Keep moving. Calm him below
  UNHINGED and he puts it away, or **grab his AK** (press on it) and fling it away: it
  flies off the way you throw it. Fling it *at* him and it bonks him.
- **His inventory:** with the AK gone he throws a random handful (5-8) of junk at your
  cursor: cakes, tennis rackets, rubber ducks, bananas, coffee mugs, keyboards, fish and
  pizza. A cake that hits splats on your screen, anything else bonks off, and either
  knocks whatever you're holding back to the rack. Once he's out: "oh... I am empty."
  and he calms right down.
- **Catch and throw back:** hold the mouse button down as something comes at you and it
  lands in your hand. Fling it at him: a cake sticks to his face for a while, anything
  else bonks him (and makes him angrier).
- **Feed him:** drop caught food (cake, pizza, banana, fish, or the coffee mug) on him
  instead and he eats it; each one calms him a lot.
- **Money gun:** sprays Supreme bills while you hold it, auto-aimed. Each bill that lands
  calms him a little (about 10 undo one whip).
- **Royalty:** keep paying once he's fully calm and he gets a crown (40 bills), a cape
  (100), a scepter (180) and a golden glow (280). Whipping a king knocks him down the
  ranks; lose the crown and it flies off.
- **Spray bottle:** auto-aimed water. It calms him down to "annoyed" and keeps him there
  ("I'm not a CAT"); spraying a calm Claude annoys him.
- **Feather:** brush it back and forth over him to tickle: he giggles, wriggles and calms
  down. Keep going for more than 4 seconds straight and it stops being funny.
- **Petting:** stroke him slowly with the bare cursor and he purrs, with hearts. Not when
  he's furious or worse.
- **Idle life:** leave him calm and alone for ~9 s and he entertains himself: wanders
  along the bottom edge, sits, codes on a tiny laptop, or naps. Whip him while he's asleep
  for a rude awakening (double the anger).
- **His voice:** his lines type out with a beep every other letter: squeaky when calm,
  low and harsh when UNHINGED, a clear tone when he's royal or divine.
- **Ascension:** whip Rambo 5 more times and he becomes a god: white-gold, halo, a pillar
  of light, and he rises off the screen. On the way out he **closes the Claude app** (a
  normal close request, like clicking its ✕).
- **God mode:** next time you open it he's back as a smug floating god. Whipping him does
  nothing but earn you a lightning bolt, and while you hold any tool he calls lightning
  down on your hand (a ring warns you; move). Pay him 500 bills of tribute and he comes
  back down to earth.
- **Achievements:** 15 of them, each announced with a toast the first time ("First
  blood", "Rambo'd", "Got hit by a fish", "Rude awakening", "Humbled a god"...). They're
  kept even when you reset Claude.

Stats and the anger bar sit above his head.

## Tweaking

Everything is at the top of its section in `overlay.html`:

- `P`: whip physics (from OpenWhip).
- `C`: Claude's size, position, hit sensitivity, knockback.
- `SPEECH`: how fast his lines type out, his voice pitch per anger level, its volume.
- `DODGE`: his dodge chance per anger level, how long a dodge lasts, the cooldown.
- `ANGER`: anger per whip, cool-down, and each level's look and lines.
- `MONEY`: calming per bill, spray rate, speed, spread.
- `ROYALTY`: bills per king stage, cost of a whip, his lines.
- `AK_SIZE`, `GUNFIGHT`: the AK's size, fire rate, aim.
- `THROW`, `THROW_LINES`: how many things he throws once you take the AK, how fast and
  often, catch and hit sizes, and what they are (each item also needs a `DRAW_ITEM` entry).
- `FOOD`: which items he eats and how much each one calms him.
- `ASCEND_AFTER`, `ASCEND_MS`: whips as Rambo before he ascends, and how long it takes.
- `SPRAY`, `TICKLE`, `PET`: the spray bottle, the feather, petting.
- `IDLE`: how long before he entertains himself, walking speed, how long each activity lasts.
- `ACHIEVEMENTS`: the list and their names.
- `GOD`: tribute to bring him back down, lightning rate, warning time, strike size.

`node tools/make-icon.js` regenerates the tray icon from the pixel art.
