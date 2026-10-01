// clawdwhip: a tray app that puts a whippable (and payable) Claude over the Claude window.
// Windows only: it finds the Claude desktop app's window through user32.
const { app, BrowserWindow, Tray, Menu, ipcMain, screen } = require('electron');
const path = require('path');

// Our own koffi if `npm install` was run, otherwise the one from a global openwhip.
let koffi;
try {
  koffi = require('koffi');
} catch (e) {
  koffi = require(path.join(process.env.APPDATA || '', 'npm', 'node_modules', 'openwhip', 'node_modules', 'koffi'));
}
const user32 = koffi.load('user32.dll');
const RECT = koffi.struct('RECT', { left: 'long', top: 'long', right: 'long', bottom: 'long' });
const FindWindowW = user32.func('void * __stdcall FindWindowW(const char16_t *cls, const char16_t *name)');
const GetWindowRect = user32.func('bool __stdcall GetWindowRect(void *hwnd, _Out_ RECT *rect)');
const IsIconic = user32.func('bool __stdcall IsIconic(void *hwnd)');
const SetForegroundWindow = user32.func('bool __stdcall SetForegroundWindow(void *hwnd)');
const keybd_event = user32.func('void __stdcall keybd_event(uint8_t vk, uint8_t scan, uint32_t flags, uintptr_t extra)');
const PostMessageW = user32.func('bool __stdcall PostMessageW(void *hwnd, uint32_t msg, uintptr_t wParam, intptr_t lParam)');
const WM_CLOSE = 0x10;

let tray, overlay, claudeHwnd = null;

/** The Claude desktop app's window and its bounds (DIP, clipped to its monitor), or null. */
function findClaudeWindow() {
  const hwnd = FindWindowW('Chrome_WidgetWin_1', 'Claude');
  const r = {};
  if (!hwnd || IsIconic(hwnd) || !GetWindowRect(hwnd, r)) return null;
  const rect = screen.screenToDipRect(null, { x: r.left, y: r.top, width: r.right - r.left, height: r.bottom - r.top });
  // Maximized windows hang a few pixels off the monitor; keep to its work area.
  const wa = screen.getDisplayMatching(rect).workArea;
  const x = Math.max(rect.x, wa.x), y = Math.max(rect.y, wa.y);
  const w = Math.min(rect.x + rect.width, wa.x + wa.width) - x;
  const h = Math.min(rect.y + rect.height, wa.y + wa.height) - y;
  if (w < 300 || h < 200) return null;
  return { hwnd, bounds: { x: Math.round(x), y: Math.round(y), width: Math.round(w), height: Math.round(h) } };
}

/** Bring Claude back to the front after the tray click stole focus. */
function focusClaude() {
  if (!claudeHwnd || SetForegroundWindow(claudeHwnd)) return;
  // Windows only lets the app that got the last input take focus; a tap of Alt counts.
  keybd_event(0x12, 0, 0, 0);
  keybd_event(0x12, 0, 2, 0);
  SetForegroundWindow(claudeHwnd);
}

function toggleOverlay() {
  if (overlay.isVisible()) return overlay.webContents.send('close-tools');
  // Cover the Claude window, or the main screen if it isn't showing.
  const target = findClaudeWindow();
  claudeHwnd = target && target.hwnd;
  const d = screen.getPrimaryDisplay();
  const bounds = target ? target.bounds : d.bounds;
  const floor = target ? bounds.height : d.workArea.y + d.workArea.height - d.bounds.y; // his feet
  overlay.setBounds(bounds);
  overlay.show(); // the page turns on click-through itself once it's open
  overlay.webContents.send('open-tools', { floor });
  setTimeout(focusClaude, 80);
}

ipcMain.on('hide-overlay', () => overlay.hide());
// The ascended Claude closes the Claude app: a normal close request, same as its ✕ button.
ipcMain.on('close-claude', () => {
  const target = findClaudeWindow();
  if (target) PostMessageW(target.hwnd, WM_CLOSE, 0, 0);
});
// Click-through except over the tool rack or while carrying a tool. `forward` keeps
// mouse moves coming so the whip and gun still follow the cursor.
ipcMain.on('set-click-through', (_e, on) => overlay.setIgnoreMouseEvents(!!on, { forward: true }));

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  const reset = () => overlay.webContents.send('reset-claude');
  app.on('second-instance', (_e, argv) => {
    if (argv.includes('--reset')) reset(); // `clawdwhip` run again while it's already up
    if (!overlay.isVisible()) toggleOverlay();
  });
  app.on('window-all-closed', e => e.preventDefault()); // keep alive in the tray

  app.whenReady().then(() => {
    overlay = new BrowserWindow({
      show: false,
      transparent: true,
      frame: false,
      focusable: false,
      skipTaskbar: true,
      resizable: false,
      hasShadow: false,
      webPreferences: { preload: path.join(__dirname, 'preload.js') },
    });
    overlay.setAlwaysOnTop(true, 'screen-saver');
    overlay.loadFile('overlay.html');
    overlay.webContents.once('did-finish-load', () => { // open once on launch
      if (process.argv.includes('--reset')) reset();
      toggleOverlay();
    });

    tray = new Tray(path.join(__dirname, 'icon', 'claude.ico'));
    tray.setToolTip('clawdwhip - click to whip Claude');
    tray.setContextMenu(Menu.buildFromTemplate([
      { label: 'Reset Claude (whips, anger, gun, crown, godhood)', click: reset },
      { type: 'separator' },
      { label: 'Quit', click: () => app.quit() },
    ]));
    tray.on('click', toggleOverlay);
  });
}
