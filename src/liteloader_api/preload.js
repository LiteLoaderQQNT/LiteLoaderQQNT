const { ipcRenderer, contextBridge } = require("electron");


// LiteLoader
Object.defineProperty(globalThis, "LiteLoader", {
    value: {
        ...ipcRenderer.sendSync("LiteLoader.LiteLoader.LiteLoader"),
        api: {
            config: {
                get: (...args) => ipcRenderer.invoke("LiteLoader.LiteLoader.api", "config", "get", ...args),
                set: (...args) => ipcRenderer.invoke("LiteLoader.LiteLoader.api", "config", "set", ...args)
            },
            openExternal: (...args) => ipcRenderer.invoke("LiteLoader.LiteLoader.api", "openExternal", "openExternal", ...args),
            openPath: (...args) => ipcRenderer.invoke("LiteLoader.LiteLoader.api", "openPath", "openPath", ...args)
        }
    }
});

contextBridge.exposeInMainWorld("LiteLoader", LiteLoader);
