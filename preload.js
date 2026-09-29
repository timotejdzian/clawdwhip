const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('bridge', {
  hideOverlay: () => ipcRenderer.send('hide-overlay'),
  setClickThrough: (on) => ipcRenderer.send('set-click-through', on),
  closeClaude: () => ipcRenderer.send('close-claude'),
  onOpen: (fn) => ipcRenderer.on('open-tools', (_e, layout) => fn(layout)),
  onClose: (fn) => ipcRenderer.on('close-tools', () => fn()),
  onReset: (fn) => ipcRenderer.on('reset-claude', () => fn()),
});
