const path = require("path");
const { protocolRegister } = require("./api.js");
const { Runtime } = require("./runtime.js");


function proxySend(func) {
    return new Proxy(func, {
        apply(target, thisArg, [channel, ...args]) {
            if (channel.includes("RM_IPCFROM_")) {
                if (args?.[1]?.cmdName == "nodeIKernelSessionListener/onSessionInitComplete") {
                    Runtime.triggerHooks("onLogin", [args[1].payload.uid]);
                }
            }
            return Reflect.apply(target, thisArg, [channel, ...args]);
        }
    });
}


function proxyPreload(func) {
    if (func?.name == "_getPreloadPaths") return new Proxy(func, {
        apply(target, thisArg, argArray) {
            return [
                path.join(LiteLoader.path.root, "./src/preload/api.js"),
                path.join(LiteLoader.path.root, "./src/preload/module.js"),
                path.join(LiteLoader.path.root, "./src/preload.js"),
                ...Reflect.apply(target, thisArg, argArray)
            ];
        }
    });
    if (func?.name == "getPreloadScripts") return new Proxy(func, {
        apply(target, thisArg, argArray) {
            return [
                {
                    filePath: path.join(LiteLoader.path.root, "./src/preload/api.js"),
                    type: "frame"
                },
                {
                    filePath: path.join(LiteLoader.path.root, "./src/preload/module.js"),
                    type: "frame"
                },
                {
                    filePath: path.join(LiteLoader.path.root, "./src/preload.js"),
                    type: "frame"
                },
                ...Reflect.apply(target, thisArg, argArray)
            ];
        }
    });
}


function proxyWindow(func) {
    return new Proxy(func, {
        construct(target, argArray, newTarget) {
            Runtime.triggerHooks("onBrowserWindowCreating", [target, argArray, newTarget]);
            const window = Reflect.construct(target, argArray, newTarget);
            protocolRegister(window.webContents.session.protocol);
            window.webContents.send = proxySend(window.webContents.send);
            window.webContents._getPreloadPaths = proxyPreload(window.webContents._getPreloadPaths);
            window.webContents.session.getPreloadScripts = proxyPreload(window.webContents.session.getPreloadScripts);
            Runtime.triggerHooks("onBrowserWindowCreated", [window]);
            return window;
        }
    });
}


function proxyElectron(func) {
    return new Proxy(func, {
        get(target, property, receiver) {
            const module = Reflect.get(target, property, receiver);
            return property != "exports" ? module : new Proxy(module, {
                get(target, property, receiver) {
                    const exports = Reflect.get(target, property, receiver);
                    return property != "BrowserWindow" ? exports : proxyWindow(exports);
                }
            });
        }
    })
}


exports.installHook = () => {
    require.cache["electron"] = proxyElectron(require.cache["electron"]);
}