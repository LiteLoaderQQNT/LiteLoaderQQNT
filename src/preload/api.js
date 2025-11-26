const { ipcRenderer, contextBridge, webFrame } = require("electron");

function exposeInMainWorld(key, api) {
    const script = `typeof ${key} != "undefined"`;
    const callback = (defined) => defined || contextBridge.exposeInMainWorld(key, api);
    webFrame.executeJavaScript(script, false, callback);
}

function sendSync(method = [], args = []) {
    return ipcRenderer.sendSync("LiteLoader.LiteLoader.LiteLoader", method, args);
}

module.exports.LiteLoader = {
    ...sendSync(),
    api: {
        config: {
            get: async (...args) => sendSync(["api", "config", "get"], args),
            set: async (...args) => sendSync(["api", "config", "set"], args)
        },
        plugin: {
            install: async (...args) => sendSync(["api", "plugin", "install"], args),
            delete: async (...args) => sendSync(["api", "plugin", "delete"], args),
            disable: async (...args) => sendSync(["api", "plugin", "disable"], args)
        },
        openExternal: async (...args) => sendSync(["api", "openExternal"], args),
        openPath: async (...args) => sendSync(["api", "openPath"], args)
    }
}

exposeInMainWorld("LiteLoader", module.exports.LiteLoader);