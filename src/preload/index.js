const { contextBridge, ipcRenderer } = require("electron");


contextBridge.exposeInMainWorld("betterQQNT", {
    path: ipcRenderer.sendSync("betterQQNT.betterQQNT.path"),
    versions: ipcRenderer.sendSync("betterQQNT.betterQQNT.versions"),
    plugins: ipcRenderer.sendSync("betterQQNT.betterQQNT.plugins"),
    package: ipcRenderer.sendSync("betterQQNT.betterQQNT.package"),
    os: ipcRenderer.sendSync("betterQQNT.betterQQNT.os"),
    config: ipcRenderer.sendSync("betterQQNT.betterQQNT.config"),
});