const { contextBridge, ipcRenderer } = require("electron");


contextBridge.exposeInMainWorld("betterQQNT", {
    path: ipcRenderer.sendSync("betterQQNT.betterQQNT.path"),
    versions: ipcRenderer.sendSync("betterQQNT.betterQQNT.versions"),
    plugins: ipcRenderer.sendSync("betterQQNT.betterQQNT.plugins"),
});