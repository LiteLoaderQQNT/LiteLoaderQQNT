const { Module } = require("module");
const { app } = require("electron");
const { betterQQNT, output } = require("./src/base.js");
const loader = require("./src/loader.js");


// 监听窗口创建
function observeNewBrowserWindow(callback) {
    const original_load = Module._load;
    Module._load = (...args) => {
        const loaded_module = original_load(...args);

        // Hook BrowserWindow
        if (args[0] === "electron") {
            class HookedBrowserWindow extends loaded_module.BrowserWindow {
                constructor(original_config) {
                    const config = {
                        ...original_config,
                        webPreferences: {
                            ...original_config?.webPreferences,
                            devTools: true
                        }
                    };
                    super(config);
                    callback(this);
                }
            }

            return {
                ...loaded_module,
                BrowserWindow: HookedBrowserWindow
            }
        }

        return loaded_module;
    }
}


// 初始化
output("Initializing...");


// 获取插件列表
const plugins = loader.getPlugins();
const loaded_plugins = [];


// 让插件加载只执行一次
app.on("ready", () => {
    output("Start loading plugins.");

    // 如果为0就是没有插件
    if (plugins.length == 0) {
        output("No plugins to be loaded.")
        return;
    }

    // 加载插件
    for (const key in plugins) {
        const plugin = plugins[key];
        output("Loading plugin:", plugin.manifest.name);
        const loaded_plugin = loader.loadPlugin(plugin);
        loaded_plugins.push(loaded_plugin);
        loaded_plugin.onLoad?.(plugin);
        output("Loaded plugin:", plugin.manifest.name);
    }

    output("Done!", plugins.length, "plugins loaded!");
});


// 监听窗口创建
observeNewBrowserWindow(window => {
    // DevTools切换
    window.webContents.on("before-input-event", (event, input) => {
        if (input.key == "F12" && input.type == "keyUp") {
            window.webContents.toggleDevTools();
        }
    });

    // 注入一些变量
    window.webContents.executeJavaScript(`
        window["betterQQNT"] = {};
        betterQQNT["path"] = ${JSON.stringify(betterQQNT.path)};
        betterQQNT["versions"] = ${JSON.stringify(betterQQNT.versions)};
        betterQQNT["plugins"] = ${JSON.stringify(plugins)};
    `, true);

    // 通知插件
    for (const loaded_plugin of loaded_plugins) {
        loaded_plugin.onBrowserWindowCreated?.(window);
    }
});


// 继续执行QQNT启动
output("Starting QQNT...");
require("../app_launcher/index.js");