const { Module } = require("module");
const { BetterQQNTLoader } = require("./loader.js");
const base = require("./base.js");


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
                        devTools: true,
                    },
                };
                const window = new loaded_module.BrowserWindow(config);
                callback(window);
                return window;
            }
            return {
                ...loaded_module,
                BrowserWindow: HookedBrowserWindow,
            }
        }

        return loaded_module;
    };
}


// 初始化
base.output("Initializing...");
initialization(window => {
    // DevTools切换
    window.webContents.on("before-input-event", (event, input) => {
        if (input.key == "F12" && input.type == "keyUp") {
            window.webContents.toggleDevTools();
        }
    });
    // 注入插件
    window.once("ready-to-show", () => {
        const url = window.webContents.getURL();
        if (url.includes("app://./renderer/index.html")) {
            // 初始化，加载BetterQQNT
            const loader = new BetterQQNTLoader(window.webContents);
            base.output("BetterQQNTLoader Created.");
            loader.loadPlugins();
            base.output("loadPlugins Loaded.");
        }
    });
});


// 继续执行QQNT启动
base.output("Starting QQNT...");
require("../app_launcher/index.js");