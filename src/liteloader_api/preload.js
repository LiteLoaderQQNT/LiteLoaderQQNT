const { ipcRenderer, contextBridge } = require("electron");


function invokeAPI(name, method, args) {
    return ipcRenderer.invoke("LiteLoader.LiteLoader.api", name, method, args);
}


// LiteLoader
Object.defineProperty(globalThis, "LiteLoader", {
    value: {
        ...ipcRenderer.sendSync("LiteLoader.LiteLoader.LiteLoader"),
        api: {
            config: {
                get: (...args) => invokeAPI("config", "get", args),
                set: (...args) => invokeAPI("config", "set", args)
            },
            plugin: {
                install: (...args) => invokeAPI("plugin", "install", args),
                delete: (...args) => invokeAPI("plugin", "delete", args),
                disable: (...args) => invokeAPI("plugin", "disable", args)
            },
            openExternal: (...args) => invokeAPI("openExternal", "openExternal", args),
            openPath: (...args) => invokeAPI("openPath", "openPath", args)
        }
    }
});

contextBridge.exposeInMainWorld("LiteLoader", LiteLoader);
