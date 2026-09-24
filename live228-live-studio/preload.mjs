import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('LIVE228Desktop', {
  connect: (username) => ipcRenderer.invoke('live-connect', username),
  disconnect: () => ipcRenderer.invoke('live-disconnect'),
  getStatus: () => ipcRenderer.invoke('live-status'),
  setStudioMode: (enabled) => ipcRenderer.invoke('studio-mode', Boolean(enabled)),
  onEvent: (callback) => {
    const handler = (_event, payload) => callback(payload);
    ipcRenderer.on('live-event', handler);
    return () => ipcRenderer.removeListener('live-event', handler);
  },
  onStatus: (callback) => {
    const handler = (_event, payload) => callback(payload);
    ipcRenderer.on('live-status', handler);
    return () => ipcRenderer.removeListener('live-status', handler);
  },
  onStudioMode: (callback) => {
    const handler = (_event, enabled) => callback(Boolean(enabled));
    ipcRenderer.on('studio-mode', handler);
    return () => ipcRenderer.removeListener('studio-mode', handler);
  }
});
