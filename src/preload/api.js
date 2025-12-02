const { ipcRenderer, contextBridge } = require("electron");

const sendSync = (method, args) => ipcRenderer.sendSync("LiteLoader.LiteLoader.LiteLoader", method, args);
const exposeInMainWorld = (key, value) => contextBridge.executeInMainWorld({
    func: key => key in globalThis,
    args: [key]
}) || contextBridge.exposeInMainWorld(key, value);

module.exports.LiteLoader = {
    ...sendSync([], []),
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