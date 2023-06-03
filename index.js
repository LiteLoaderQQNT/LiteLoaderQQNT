const { Module } = require("module");
const { betterQQNT, output } = require("./src/base.js");
const loader = require("./src/loader.js");


// 初始化
function initialization(callback) {
    const original_load = Module._load;
    Module._load = (...args) => {
        const loaded_module = original_load(...args);

        if (args[0] === "electron") {
            function HookedBrowserWindow(original_config) {
                const config = {
                    ...original_config,
                    webPreferences: {
                        ...original_config?.webPreferences,
                        devTools: true
                    }
                }
                const window = new loaded_module.BrowserWindow(config);
                callback(window);
                return window;
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
const plugins = loader.getPlugins();
initialization(window => {
    // DevTools切换
    window.webContents.on("before-input-event", (event, input) => {
        if (input.key == "F12" && input.type == "keyUp") {
            window.webContents.toggleDevTools();
        }
    });

    // 注入插件
    window.on("ready-to-show", () => {
        const code = `
        window["betterQQNT"] = {};
        betterQQNT["path"] = ${JSON.stringify(betterQQNT.path)};
        betterQQNT["versions"] = ${JSON.stringify(betterQQNT.versions)};
        betterQQNT["plugins"] = {};
        `;
        window.webContents.executeJavaScript(code, true);

        output("Start loading plugins.");

        if (plugins.length == 0) {
            output("No plugins to be loaded.")
            return;
        }

        // 加载插件
        for (const plugin of plugins) {
            output("Loading plugin:", plugin.manifest.name);
            loader.loadPlugin(plugin, window);
            output("Loaded plugin:", plugin.manifest.name);
        }

        output("Done!", plugins.length, "plugins loaded!");
    });
});


// 继续执行QQNT启动
output("Starting QQNT...");
require("../app_launcher/index.js");