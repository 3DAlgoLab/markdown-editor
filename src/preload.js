const { ipcRenderer, contextBridge } = require('electron');

// window.send = function () {
//   return ipcRenderer.send;
// }

// window.receive = function () {
//   return ipcRenderer.on;
// }


contextBridge.exposeInMainWorld('api', {
  receive: function (func) {
    ipcRenderer.on("editor-event", (event, ...args) => func(event, ...args));
  },
  send: function (msg) {
    ipcRenderer.send('editor-reply', msg);
  }
});



