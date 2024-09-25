const { MainLoader } = require("./loader_core/main.js");
const { protocolRegister } = require("./protocol_scheme/main.js");
const { session } = require('electron');
const path = require("path");
const fs = require("fs");


const loader = new MainLoader().init();


function proxyBrowserWindowConstruct(target, argArray, newTarget) {
    const window = Reflect.construct(target, argArray, newTarget);

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

    // 这旧时代的方法又能用了
    session.defaultSession.setPreloads.call(window.webContents.session, [
        ...window.webContents.session.getPreloads(),
        (() => {
            const versions_path = path.join(process.resourcesPath, "app/versions");
            const prefix_old_path = path.join(versions_path, LiteLoader.versions.qqnt, "application");
            const prefix_new_path = path.join(process.resourcesPath, "app/application");
            const prefix_path = fs.existsSync(versions_path) ? prefix_old_path : prefix_new_path;
            return `${prefix_path}/../application/preload.js`.replaceAll("\\", "/");
        })()
    ]);

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
