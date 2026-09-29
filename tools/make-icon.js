// Generates icon/claude.ico (16, 32, 48, 256 px) from the same pixel art as overlay.html.
// Run: node tools/make-icon.js
const fs = require('fs');
const path = require('path');

const BODY = [
  '  ##########  ',
  '  ##########  ',
  '  ##EE##EE##  ',
  '####EE##EE####',
  '####EE##EE####',
  '  ##########  ',
  '  ##########  ',
  '   # #  # #   ',
  '   # #  # #   ',
];
// Eyes are one pixel wide in the overlay; at icon sizes they read better as two.
const COLORS = { '#': [217, 119, 87, 255], 'E': [26, 26, 26, 255] };
const OUTLINE = [42, 22, 16, 255];

function render(size) {
  const cols = BODY[0].length, rows = BODY.length;
  const outline = size >= 32 ? Math.max(1, Math.round(size / 32)) : 0;
  const s = Math.floor((size - outline * 2) / cols);
  const ox = Math.floor((size - cols * s) / 2), oy = Math.floor((size - rows * s) / 2);
  const px = new Uint8Array(size * size * 4); // RGBA, top-down
  const cell = (x, y) => {
    const cx = Math.floor((x - ox) / s), cy = Math.floor((y - oy) / s);
    if (x < ox || y < oy || cx >= cols || cy >= rows) return ' ';
    return BODY[cy][cx];
  };
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let c = COLORS[cell(x, y)];
      if (!c && outline) {
        for (let dy = -outline; dy <= outline && !c; dy++)
          for (let dx = -outline; dx <= outline && !c; dx++)
            if (COLORS[cell(x + dx, y + dy)]) c = OUTLINE;
      }
      if (c) px.set(c, (y * size + x) * 4);
    }
  }
  return px;
}

// ICO with 32-bit BMP entries (BGRA, bottom-up, empty AND mask since alpha is used).
function bmpEntry(size) {
  const rgba = render(size);
  const maskRow = Math.ceil(size / 32) * 4;
  const buf = Buffer.alloc(40 + size * size * 4 + maskRow * size);
  buf.writeUInt32LE(40, 0);
  buf.writeInt32LE(size, 4);
  buf.writeInt32LE(size * 2, 8); // XOR + AND mask height
  buf.writeUInt16LE(1, 12);
  buf.writeUInt16LE(32, 14);
  let o = 40;
  for (let y = size - 1; y >= 0; y--) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      buf[o++] = rgba[i + 2]; buf[o++] = rgba[i + 1]; buf[o++] = rgba[i]; buf[o++] = rgba[i + 3];
    }
  }
  return buf;
}

const sizes = [16, 32, 48, 256];
const images = sizes.map(bmpEntry);
const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
sizes.forEach((size, i) => {
  const e = 6 + i * 16;
  header[e] = size === 256 ? 0 : size;
  header[e + 1] = size === 256 ? 0 : size;
  header.writeUInt16LE(1, e + 4);
  header.writeUInt16LE(32, e + 6);
  header.writeUInt32LE(images[i].length, e + 8);
  header.writeUInt32LE(offset, e + 12);
  offset += images[i].length;
});

const out = path.join(__dirname, '..', 'icon', 'claude.ico');
fs.writeFileSync(out, Buffer.concat([header, ...images]));
console.log('wrote', out);
