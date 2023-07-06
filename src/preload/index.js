const { contextBridge, ipcRenderer } = require("electron");


// 即将废弃
contextBridge.exposeInMainWorld("betterQQNT", {
    path: ipcRenderer.sendSync("LiteLoader.LiteLoader.path"),
    versions: ipcRenderer.sendSync("LiteLoader.LiteLoader.versions"),
    plugins: ipcRenderer.sendSync("LiteLoader.LiteLoader.plugins"),
    package: ipcRenderer.sendSync("LiteLoader.LiteLoader.package"),
    os: ipcRenderer.sendSync("LiteLoader.LiteLoader.os"),
    config: ipcRenderer.sendSync("LiteLoader.LiteLoader.config"),
});


contextBridge.exposeInMainWorld("LiteLoader", {
    path: ipcRenderer.sendSync("LiteLoader.LiteLoader.path"),
    versions: ipcRenderer.sendSync("LiteLoader.LiteLoader.versions"),
    plugins: ipcRenderer.sendSync("LiteLoader.LiteLoader.plugins"),
    package: ipcRenderer.sendSync("LiteLoader.LiteLoader.package"),
    os: ipcRenderer.sendSync("LiteLoader.LiteLoader.os"),
    config: ipcRenderer.sendSync("LiteLoader.LiteLoader.config"),
});