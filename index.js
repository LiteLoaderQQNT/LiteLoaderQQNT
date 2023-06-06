const { Module } = require("module");
const { app, ipcMain } = require("electron");
const path = require("path");
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
        loaded_plugins.push({
            ...loaded_plugin,
            slug: key
        });
        loaded_plugin.onLoad?.(plugin);
        output("Loaded plugin:", plugin.manifest.name);
    }

    output("Done!", Object.keys(plugins).length, "plugins loaded!");
});


// 监听窗口创建
observeNewBrowserWindow(window => {
    // DevTools切换
    window.webContents.on("before-input-event", (event, input) => {
        if (input.key == "F12" && input.type == "keyUp") {
            window.webContents.toggleDevTools();
        }
    });

    const preloads = new Set([
        ...window.webContents.session.getPreloads(),
        path.join(__dirname, "./src/preload.js")
    ]);

    // 通知插件
    for (const loaded_plugin of loaded_plugins) {
        loaded_plugin.onBrowserWindowCreated?.(window, plugins[loaded_plugin.slug]);
        preloads.add(loader.getPreload(plugins[loaded_plugin.slug]));
    }

    window.webContents.session.setPreloads([...preloads]);
});


ipcMain.on("betterQQNT.betterQQNT.path", (event, message) => {
    event.returnValue = betterQQNT.path;
});


ipcMain.on("betterQQNT.betterQQNT.versions", (event, message) => {
    event.returnValue = betterQQNT.versions;
});


ipcMain.on("betterQQNT.betterQQNT.plugins", (event, message) => {
    event.returnValue = plugins;
});


// 继续执行QQNT启动
output("Starting QQNT...");
require("../app_launcher/index.js");