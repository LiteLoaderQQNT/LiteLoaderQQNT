const { contextBridge, ipcRenderer } = require("electron");

function ipcGet(channel) {
    return ipcRenderer.sendSync(channel, { eventName: "LiteLoader" });
}

const LiteLoader = {
    path: ipcGet("LiteLoader.LiteLoader.path"),
    versions: ipcGet("LiteLoader.LiteLoader.versions"),
    plugins: ipcGet("LiteLoader.LiteLoader.plugins"),
    package: ipcGet("LiteLoader.LiteLoader.package"),
    os: ipcGet("LiteLoader.LiteLoader.os"),
    config: ipcGet("LiteLoader.LiteLoader.config"),
};

// 即将废弃
contextBridge.exposeInMainWorld("betterQQNT", LiteLoader);
contextBridge.exposeInMainWorld("LiteLoader", LiteLoader);
