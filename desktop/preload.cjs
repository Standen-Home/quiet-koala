const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('quietKoalaDesktop', {
  setClickThrough: (value) => ipcRenderer.invoke('quiet-koala:set-click-through', !!value),
  getClickThrough: () => ipcRenderer.invoke('quiet-koala:get-click-through'),
  showSettings: () => ipcRenderer.invoke('quiet-koala:show-settings'),
  sendLiveState: (snapshot) => ipcRenderer.send('quiet-koala:live-state', snapshot),
  notifyStateChanged: (keys = []) => ipcRenderer.send('quiet-koala:state-changed', Array.isArray(keys) ? keys : []),
  onLiveState: (callback) => {
    ipcRenderer.on('quiet-koala:live-state', (_event, snapshot) => callback(snapshot));
  },
  onStateChanged: (callback) => {
    ipcRenderer.on('quiet-koala:state-changed', (_event, keys) => callback(Array.isArray(keys) ? keys : []));
  },
  onClickThroughChanged: (callback) => {
    ipcRenderer.on('quiet-koala:click-through-changed', (_event, value) => callback(!!value));
  }
});
