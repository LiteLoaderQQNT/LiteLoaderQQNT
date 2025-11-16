require("./liteloader_api/main.js");
require("./loader_core/plugin_loader.js");

const { MainLoader } = require("./loader_core/main.js");
const { protocolRegister } = require("./protocol_scheme/main.js");
const { ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");


const loader = new MainLoader().init();


function proxyBrowserWindowConstruct(target, argArray, newTarget) {
    const window = Reflect.construct(target, argArray, newTarget);

    // 监听send
    window.webContents.send = new Proxy(window.webContents.send, {
        apply(target, thisArg, [channel, ...args]) {
            if (channel.includes("RM_IPCFROM_")) {
                if (args?.[1]?.cmdName == "nodeIKernelSessionListener/onSessionInitComplete") {
                    loader.onLogin(args[1].payload.uid);
                }
            }
            return Reflect.apply(target, thisArg, [channel, ...args]);
        }
    });

    // 加载Preload
    window.webContents._getPreloadScript = new Proxy(window.webContents._getPreloadScript, {
        apply(target, thisArg, argArray) {
            const orig = Reflect.apply(target, thisArg, argArray);
            ipcMain.once("LiteLoader.LiteLoader.preload", (event) => {
                event.returnValue = orig.filePath ? fs.readFileSync(orig.filePath, "utf-8") : null;
            });
            return {
                filePath: path.join(LiteLoader.path.root, "src/preload.js"),
                id: "",
                type: "frame"
            }
        }
    });

    // 加载自定义协议
    protocolRegister(window.webContents.session.protocol);

    // 加载插件
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
                    construct: proxyBrowserWindowConstruct
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