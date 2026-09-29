#!/usr/bin/env node
const path = require('path');
const { spawn } = require('child_process');

// Use our own Electron if `npm install` was run, otherwise borrow the one from a
// global `npm install -g openwhip`.
const OPENWHIP_MODULES = path.join(process.env.APPDATA || '', 'npm', 'node_modules', 'openwhip', 'node_modules');

let electronBinary;
for (const id of ['electron', path.join(OPENWHIP_MODULES, 'electron')]) {
  try { electronBinary = require(id); break; } catch (e) {}
}
if (!electronBinary) {
  console.error('Could not load Electron. Run `npm install` in the clawdwhip folder.');
  process.exit(1);
}

const appPath = path.resolve(__dirname, '..');

const child = spawn(electronBinary, [appPath], {
  detached: true,
  stdio: 'ignore',
  windowsHide: true,
});

child.on('error', (err) => {
  console.error('Failed to start clawdwhip:', err.message);
  process.exit(1);
});

child.unref();
