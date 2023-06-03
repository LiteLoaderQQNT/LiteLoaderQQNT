const { Module } = require("module");
const { ipcMain } = require("electron");
const { loadPlugins } = require("./src/loader.js");
const { betterQQNT, output } = require("./src/base.js");


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

        // 加载插件
        loadPlugins(window);
    });
});


// 继续执行QQNT启动
output("Starting QQNT...");
require("../app_launcher/index.js");