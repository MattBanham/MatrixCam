const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('matrixCamPresetAPI', {
  list: () => ipcRenderer.invoke('matrix-cam-presets:list'),
  save: (preset) => ipcRenderer.invoke('matrix-cam-presets:save', preset),
});

contextBridge.exposeInMainWorld('matrixCamWindowAPI', {
  resize: (size) => ipcRenderer.invoke('matrix-cam-window:resize', size),
});
