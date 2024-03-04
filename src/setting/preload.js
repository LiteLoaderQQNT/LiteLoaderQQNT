const { ipcRenderer, contextBridge } = require("electron");


contextBridge.exposeInMainWorld("LiteLoader_Setting", {
    disablePlugin: (...args) => ipcRenderer.invoke("LiteLoader.LiteLoader_Setting.disablePlugin", ...args)
});
