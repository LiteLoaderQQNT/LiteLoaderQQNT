require("./liteloader_api/main.js");
require("./loader_core/plugin_loader.js");

const { MainLoader } = require("./loader_core/main.js");
const { protocolRegister } = require("./protocol_scheme/main.js");
const path = require("path");

const loader = new MainLoader().init();

/**
 * 代理 send
 */
function proxySend(func) {
    return new Proxy(func, {
        apply(target, thisArg, [channel, ...args]) {
            if (channel.includes("RM_IPCFROM_")) {
                if (args?.[1]?.cmdName == "nodeIKernelSessionListener/onSessionInitComplete") {
                    loader.onLogin(args[1].payload.uid);
                }
            }
            return Reflect.apply(target, thisArg, [channel, ...args]);
        }
    });
}

/**
 * 代理 Preload
 */
function proxyPreload(func) {
    if (func?.name == "_getPreloadScript") return new Proxy(func, {
        apply(target, thisArg, argArray) {
            return [
                path.join(LiteLoader.path.root, "./src/liteloader_api/preload.js"),
                path.join(LiteLoader.path.root, "./src/preload.js"),
                ...Reflect.apply(target, thisArg, argArray)
            ];
        }
    });
    if (func?.name == "getPreloadScripts") return new Proxy(func, {
        apply(target, thisArg, argArray) {
            return [
                {
                    filePath: path.join(LiteLoader.path.root, "./src/liteloader_api/preload.js"),
                    id: "",
                    type: "frame"
                },
                {
                    filePath: path.join(LiteLoader.path.root, "./src/preload.js"),
                    id: "",
                    type: "frame"
                },
                ...Reflect.apply(target, thisArg, argArray)
            ];
        }
    });
}

/**
 * 代理 BrowserWindow
 */
function proxyWindow(target, argArray, newTarget) {
    loader.onBrowserWindowCreating(target, argArray, newTarget);
    const window = Reflect.construct(target, argArray, newTarget);
    protocolRegister(window.webContents.session.protocol);
    window.webContents.send = proxySend(window.webContents.send);
    window.webContents._getPreloadPaths = proxyPreload(window.webContents._getPreloadPaths);
    window.webContents.session.getPreloadScripts = proxyPreload(window.webContents.session.getPreloadScripts);
    loader.onBrowserWindowCreated(window);
    return window;
}

// 监听窗口创建
require.cache["electron"] = new Proxy(require.cache["electron"], {
    get(target, property, receiver) {
        const module = Reflect.get(target, property, receiver);
        return property != "exports" ? module : new Proxy(module, {
            get(target, property, receiver) {
                const exports = Reflect.get(target, property, receiver);
                return property != "BrowserWindow" ? exports : new Proxy(exports, {
                    construct: proxyWindow
                });
            }
        });
    }
});

if (!globalThis.qwqnt) {
    const main_path = "./application.asar/app_launcher/index.js";
    require(require("path").join(process.resourcesPath, "app", main_path));
    setImmediate(() => global.launcher.installPathPkgJson.main = main_path);
}