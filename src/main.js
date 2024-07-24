const { ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const { protocolRegister } = require("./protocol_scheme/main.js");


const loader = (new class {

    #exports = {};

    init() {
        // 加载插件
        for (const [slug, plugin] of Object.entries(LiteLoader.plugins)) {
            if (plugin.disabled || plugin.incompatible) {
                continue;
            }
            if (plugin.path.injects.main) {
                try {
                    this.#exports[slug] = require(plugin.path.injects.main);
                }
                catch (e) {
                    plugin.error = { message: `[Main] ${e.message}`, stack: e.stack };
                }
            }
        }
        return this;
    }

    onBrowserWindowCreated(window) {
        for (const [slug, plugin] of Object.entries(this.#exports)) {
            if (plugin?.onBrowserWindowCreated) {
                plugin.onBrowserWindowCreated(window);
            }
        }
    }

    onLogin(uid) {
        for (const [slug, plugin] of Object.entries(this.#exports)) {
            if (plugin?.onLogin) {
                plugin.onLogin(uid);
            }
        }
    }

}).init();


ipcMain.handle("LiteLoader.LiteLoader.preload", (event) => {
    const qqnt_preload_path = event.sender.preload;
    return fs.readFileSync(qqnt_preload_path, "utf-8");
});


function processPreloadPath(qqnt_preload_path) {
    const qqnt_preload_dirname = path.dirname(qqnt_preload_path);
    const qqnt_preload_basename = path.basename(qqnt_preload_path);
    const new_preload_path = `${qqnt_preload_dirname}/../application/${qqnt_preload_basename}`;
    const liteloader_preload_path = path.join(LiteLoader.path.root, "src/preload.js");
    if (!fs.existsSync(new_preload_path)) {
        fs.mkdirSync(qqnt_preload_dirname, { recursive: true });
        fs.copyFileSync(liteloader_preload_path, new_preload_path);
    }
    if (fs.readFileSync(new_preload_path) != fs.readFileSync(liteloader_preload_path)) {
        fs.copyFileSync(liteloader_preload_path, new_preload_path);
    }
    return new_preload_path.replaceAll("\\", "/");
}


function proxyBrowserWindowConstruct(target, [config], newTarget) {
    const qqnt_preload_path = config.webPreferences.preload;
    const window = Reflect.construct(target, [
        {
            ...config,
            webPreferences: {
                ...config.webPreferences,
                webSecurity: false,
                preload: processPreloadPath(qqnt_preload_path),
                additionalArguments: ["--fetch-schemes=local"]
            }
        }
    ], newTarget);

    // 挂载窗口原preload
    window.webContents.preload = qqnt_preload_path;

    // 加载自定义协议
    protocolRegister(window.webContents.session.protocol);

    // 加载插件
    loader.onBrowserWindowCreated(window);

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
