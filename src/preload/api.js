const { ipcRenderer, contextBridge, webFrame } = require("electron");

function exposeInMainWorld(key, api) {
    const script = `typeof ${key} != "undefined"`;
    const callback = (defined) => defined || contextBridge.exposeInMainWorld(key, api);
    webFrame.executeJavaScript(script, false, callback);
}

function invokeAPI(name, method, args) {
    return ipcRenderer.invoke("LiteLoader.LiteLoader.api", name, method, args);
}

module.LiteLoader = {
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

exposeInMainWorld("LiteLoader", module.LiteLoader);