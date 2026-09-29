# clawdwhip

![clawdwhip demo: whipping Claude until he goes Rambo, then paying him until he's king](docs/demo.gif)

A fork of [OpenWhip](https://github.com/GitFrog1111/OpenWhip) (MIT): a little pixel Claude
standing on the bottom edge of the Claude desktop app's window. Whip him, pay him, crown
him. Windows only.

## Run

```bash
git clone https://github.com/timotejdzian/clawdwhip.git
cd clawdwhip
npm install
npm start
```

`npm install -g .` in the folder adds a `clawdwhip` command you can run from anywhere.
(If you already have `npm install -g openwhip`, you can skip `npm install`: it borrows
OpenWhip's Electron and koffi.)

## Controls

- **Tray icon:** click to bring Claude and the tool rack out over the Claude window (or the
  main screen if the app is closed or minimized); click again to put it away. Right-click:
  **Reset Claude** or **Quit**.
- **Rack** (left of Claude): press and hold the whip or the money gun to carry it; let go
  and it flies back. **✕** closes everything.
- While you aren't carrying anything the overlay is click-through, so you can keep using
  Claude Code underneath.

## Claude

- **Whip** (outer half of the whip, swung fast): he reacts and gets angrier: calm →
  annoyed → irritated → angry → furious → UNHINGED. Anger cools one whip's worth every
  20 s, even while the app is closed. He sometimes ducks or sidesteps a swing (15% when
  calm, up to 45% when UNHINGED), but never twice in a row.
- **His AK-47:** whip him 10 more times once he's UNHINGED and he goes Rambo (headband,
  ammo belt, camo). While you carry the whip he fires bursts at your hand; a hit knocks
  the whip back to the rack, a miss leaves a bullet hole. Keep moving. Calm him below
  UNHINGED and he puts it away, or **grab his AK** (press on it) and fling it away: it
  flies off the way you throw it.
- **His inventory:** with the AK gone he throws a random handful (5-8) of junk at your
  cursor: cakes, tennis rackets, rubber ducks, bananas, coffee mugs, keyboards, fish and
  pizza. A cake that hits splats on your screen, anything else bonks off, and either
  knocks whatever you're holding back to the rack. Once he's out: "oh... I am empty."
  and he calms right down.
- **Ascension:** whip Rambo 5 more times and he becomes a god: white-gold, halo, a pillar
  of light, and he rises off the screen. On the way out he **closes the Claude app** (a
  normal close request, like clicking its ✕), then comes back calm next time.
- **Money gun:** sprays Supreme bills while you hold it, auto-aimed. Each bill that lands
  calms him a little (about 10 undo one whip).
- **Royalty:** keep paying once he's fully calm and he gets a crown (40 bills), a cape
  (100), a scepter (180) and a golden glow (280). Whipping a king knocks him down the
  ranks; lose the crown and it flies off.

Stats and the anger bar sit above his head.

## Tweaking

Everything is at the top of its section in `overlay.html`:

- `P`: whip physics (from OpenWhip).
- `C`: Claude's size, position, hit sensitivity, knockback.
- `DODGE`: his dodge chance per anger level, how long a dodge lasts, the cooldown.
- `ANGER`: anger per whip, cool-down, and each level's look and lines.
- `MONEY`: calming per bill, spray rate, speed, spread.
- `ROYALTY`: bills per king stage, cost of a whip, his lines.
- `ARM_AFTER`, `AK_SIZE`, `GUNFIGHT`: when he pulls the AK, its size, fire rate, aim.
- `THROW`, `THROW_LINES`: how many things he throws once you take the AK, how fast and
  often, and what they are (each item also needs a `DRAW_ITEM` entry).
- `ASCEND_AFTER`, `ASCEND_MS`: whips as Rambo before he ascends, and how long it takes.

`node tools/make-icon.js` regenerates the tray icon from the pixel art.
