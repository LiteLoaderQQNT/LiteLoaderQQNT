const { log } = require("console");
const { MainLoader } = require("./loader_core/main.js");
const { protocolRegister } = require("./protocol_scheme/main.js");
const path = require("path");


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
    window.webContents._getPreloadPaths = new Proxy(window.webContents._getPreloadPaths, {
        apply(target, thisArg, argArray) {
            return [
                ...Reflect.apply(target, thisArg, argArray),
                path.join(LiteLoader.path.root, "src/preload.js")
            ];
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
        const electron = Reflect.get(target, property, receiver);
        return property != "exports" ? electron : new Proxy(electron, {
            get(target, property, receiver) {
                const BrowserWindow = Reflect.get(target, property, receiver);
                return property != "BrowserWindow" ? BrowserWindow : new Proxy(BrowserWindow, {
                    construct: proxyBrowserWindowConstruct
                });
            }
        });
    }
});
