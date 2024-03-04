const { Module } = require("module");
const { net, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");


const loader = (new class {

    #exports = {};

    init() {
        // 加载插件
        for (const [slug, plugin] of Object.entries(LiteLoader.plugins)) {
            if (plugin.disabled || plugin.incompatible) {
                continue;
            }
            if (plugin.path.injects.main) {
                this.#exports[slug] = require(plugin.path.injects.main);
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

}).init();


// 注册协议
function protocolRegister(protocol) {
    //协议未注册，才需要注册
    if (!protocol.isProtocolRegistered("local")) {
        protocol.handle("local", (req) => {
            const { host, pathname } = new URL(decodeURI(req.url));
            const filepath = path.normalize(pathname.slice(1));
            return net.fetch(`file://${host}/${filepath}`);
        });
    }
}


function proxyBrowserWindowConstruct(target, [config], newTarget) {
    const liteloader_preload_path = path.join(LiteLoader.path.root, "src/preload.js");
    const qqnt_preload_path = config.webPreferences.preload;
    const preload_path = `${path.dirname(qqnt_preload_path).replaceAll("\\", "/")}/../application/preload.js`;

    if (!fs.existsSync(preload_path)) {
        fs.mkdirSync(path.dirname(preload_path), { recursive: true });
        fs.copyFileSync(liteloader_preload_path, preload_path);
    }

    if (fs.readFileSync(preload_path, "utf-8") != fs.readFileSync(liteloader_preload_path, "utf-8")) {
        fs.copyFileSync(liteloader_preload_path, preload_path);
    }

    ipcMain.handleOnce("LiteLoader.LiteLoader.preload", () => fs.readFileSync(qqnt_preload_path, "utf-8"));

    const new_config = {
        ...config,
        webPreferences: {
            ...config.webPreferences,
            webSecurity: false,
            devTools: true,
            preload: preload_path,
            additionalArguments: ["--fetch-schemes=local"]
        }
    }

    const window = Reflect.construct(target, [new_config], newTarget);

    //加载自定义协议
    protocolRegister(window.webContents.session.protocol);
    loader.onBrowserWindowCreated(window);

    return window;
}


// 监听窗口创建
Module._load = new Proxy(Module._load, {
    apply(target, thisArg, argArray) {
        const module = Reflect.apply(target, thisArg, argArray);
        if (argArray[0] == "electron") {
            return new Proxy(module, {
                get(target, property, receiver) {
                    if (property == "BrowserWindow") {
                        return new Proxy(module.BrowserWindow, {
                            construct: proxyBrowserWindowConstruct
                        });
                    }
                    return Reflect.get(target, property, receiver);
                }
            });
        }
        return module;
    }
});
