const { contextBridge, ipcRenderer } = require("electron");

const LiteLoader = ipcRenderer.sendSync("LiteLoader.LiteLoader.LiteLoader");

contextBridge.exposeInMainWorld("LiteLoader", LiteLoader);