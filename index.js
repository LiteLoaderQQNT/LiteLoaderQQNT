const { BrowserWindow } = require("electron");
const { BetterQQNTLoader } = require("./loader.js");
const { output } = require("./utils.js")


// 初始化，加载BetterQQNT
function initialization(webContents) {
    const loader = new BetterQQNTLoader(webContents);
    output("BetterQQNTLoader Created.");
    loader.loadAPI();
    output("API Loaded.");
    loader.loadPlugins();
    output("loadPlugins Loaded.");
    loader.loadRendererLoader();
    output("loadRendererLoader Loaded.");
}


// 查找窗口
const interval = setInterval(() => {
    const getAllWindows = BrowserWindow.getAllWindows();
    for (const browserWindow of getAllWindows) {
        const webContents = browserWindow.webContents;
        const url = webContents.getURL();
        if (url.includes("app://./renderer/index.html")) {
            output("Found Index Window!");
            clearInterval(interval);
            output("Initializing...");
            initialization(webContents);
            return;
        }
    }
}, 100);


// 继续执行QQNT启动
output("Starting QQNT...");
require("../app_launcher/index.js");