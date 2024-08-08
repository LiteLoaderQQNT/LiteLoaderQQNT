const { MainLoader } = require("./loader_core/main.js");
const { protocolRegister } = require("./protocol_scheme/main.js");
const path = require("path");


const loader = new MainLoader().init();


function processPreloadPath(preload_path) {
    if (preload_path?.includes?.(process.resourcesPath)) {
        const preload_dirname = path.dirname(preload_path);
        const preload_basename = path.basename(preload_path);
        const new_preload_path = `${preload_dirname}/../application/${preload_basename}`;
        return new_preload_path.replaceAll("\\", "/");
    }
    // 小程序啥的就不要了
    return preload_path;
}


function proxyBrowserWindowConstruct(target, [config], newTarget) {
    const window = Reflect.construct(target, [
        {
            ...config,
            webPreferences: {
                ...config.webPreferences,
                webSecurity: false,
                preload: processPreloadPath(config.webPreferences.preload)
            }
        }
    ], newTarget);

    // 监听send
    window.webContents.send = new Proxy(window.webContents.send, {
        apply(target, thisArg, [channel, ...args]) {
            if (channel.includes("IPC_DOWN_")) {
                // 账号登录
                if (args?.[1]?.[0]?.cmdName == "nodeIKernelSessionListener/onSessionInitComplete") {
                    const uid = args[1][0].payload.uid;
                    loader.onLogin(uid);
                }
            }
            return Reflect.apply(target, thisArg, [channel, ...args]);
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
