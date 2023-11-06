import { Module } from "module";
import { app, net, protocol } from "electron";
import { normalize, join } from "path";
import { existsSync } from "fs";
import { output, qq_install_dir, relativeRootPath } from "./base.js";
import { PluginLoader } from "./loader.js";


// 计算 plugin-preloads.js 路径
const preloadPath = (() => {
    if (LiteLoader.os.platform == "win32") {
        const basePath = `${qq_install_dir}\\resources\\app\\versions\\${LiteLoader.versions.qqnt}`;
        return `${basePath}\\application\\..\\plugin-preloads.js`;
    }
    if (LiteLoader.os.platform == "linux") {
        const basePath = relativeRootPath(`${qq_install_dir}/resources/app`);
        return `${basePath}${LiteLoader.path.profile}/plugin-preloads.js`;
    }
    if (LiteLoader.os.platform == "darwin") {
        const basePath = relativeRootPath(`${qq_install_dir}/Resources/app/application`);
        return `${basePath}${LiteLoader.path.profile}/plugin-preloads.js`;
    }
})();


// 监听窗口创建
function observeNewBrowserWindow(callback) {
    const original_load = Module._load;
    Module._load = (...args) => {
        const loaded_module = original_load(...args);

        if (args[0] != "electron") {
            return loaded_module;
        }

        let ProxyBrowserWindow = new Proxy(loaded_module.BrowserWindow, {
            construct(target, [original_config], newTarget) {
                const config = {
                    ...original_config,
                    webPreferences: {
                        ...original_config?.webPreferences,
                        devTools: true,
                        webSecurity: false,
                        additionalArguments: ["--fetch-schemes=app,llqqnt"]
                    }
                };
                if (existsSync(normalize(preloadPath))) {
                    config.webPreferences.preload = preloadPath;
                }
                else {
                    output("plugin-preloads.js does not exist, check if there was any error above.");
                }
                const window = Reflect.construct(target, [config], newTarget);
                callback(window);
                return window;
            }
        });

        let ProxyMenu = new Proxy(loaded_module.Menu, {
            get(target, property, receiver) {
                if (property == "buildFromTemplate") {
                    return (template) => {
                        const quit_item = template.find(item => item.id == "quit");
                        quit_item && (quit_item.click = () => app.exit());
                        return Reflect.get(target, property, receiver)(template);
                    }
                }
                return Reflect.get(target, property, receiver);
            }
        });

        // Proxy的方法不需要重新解构loaded_module，提高性能
        return new Proxy(loaded_module, {
            get(target, property, receiver) {
                if (property == "BrowserWindow") {
                    return ProxyBrowserWindow;
                }
                if (property == "Menu") {
                    return ProxyMenu;
                }
                return Reflect.get(target, property, receiver);
            }
        });
    }
}

// 插件加载器
const plugin_loader = new PluginLoader();

// 文件协议
const protocolHandler = (req) => {
    const { host, pathname } = new URL(req.url);
    const filepath = normalize(decodeURI(pathname));
    switch (host) {
        case "local-file":
            return net.fetch(`file://${join(filepath)}`);
        case "plugins-dir":
            return net.fetch(
                `file://${join(LiteLoader.path.plugins, filepath)}`
            );
        case "plugins-data":
            return net.fetch(
                `file://${join(LiteLoader.path.plugins_data, filepath)}`
            );
        case "plugins-cache":
            return net.fetch(
                `file://${join(LiteLoader.path.plugins_cache, filepath)}`
            );
        case "liteloader-dir":
            return net.fetch(
                `file://${join(LiteLoader.path.root, filepath)}`
            );
        case "builtins-dir":
            return net.fetch(
                `file://${join(LiteLoader.path.builtins, filepath)}`
            );
        default:
            return net.fetch("");
    }
};

// 旧版本文件协议
const oldProtocolHandler = (req, callback) => {
    const { host, pathname } = new URL(req.url);
    const filepath = normalize(decodeURIComponent(pathname));
    switch (host) {
        case "local-file":
            return callback({ path: join(filepath) });
        case "plugins-dir":
            return callback({
                path: join(LiteLoader.path.plugins, filepath)
            });
        case "plugins-data":
            return callback({
                path: join(LiteLoader.path.plugins_data, filepath)
            });
        case "plugins-cache":
            return callback({
                path: join(LiteLoader.path.plugins_cache, filepath)
            });
        case "liteloader-dir":
            return callback({
                path: join(LiteLoader.path.root, filepath)
            });
        case "builtins-dir":
            return callback({
                path: join(LiteLoader.path.builtins, filepath)
            });
        default:
            return callback({ path: "" });
    }
};

// 让插件加载只执行一次
app.on("ready", () => {
    protocol.handle ? 
        protocol.handle("llqqnt", protocolHandler) : // 新版本Electron
        protocol.registerFileProtocol("llqqnt", oldProtocolHandler); // 老版本Electron没有handle
    // 加载插件
    plugin_loader.onLoad();
});

// 监听窗口创建
observeNewBrowserWindow((window) => {
    //加载自定义协议
    const ses = window.webContents.session;

    //协议未注册，才需要注册
    if (!ses.protocol.isProtocolRegistered("llqqnt")) {
        ses.protocol.handle ? 
            ses.protocol.handle("llqqnt", protocolHandler) : // 新版本Electron
            ses.protocol.registerFileProtocol("llqqnt", oldProtocolHandler); // 老版本Electron没有handle
    }

    // DevTools切换
    window.webContents.on("before-input-event", (event, input) => {
        if (input.key == "F12" && input.type == "keyUp") {
            window.webContents.toggleDevTools();
        }
    });

    // 触发窗口创建
    plugin_loader.onBrowserWindowCreated(window);
});
