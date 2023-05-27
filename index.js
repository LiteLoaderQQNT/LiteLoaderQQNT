const { BrowserWindow } = require("electron");
const { BetterQQNTLoader } = require("./loader.js");
const base = require("./base.js");


// 初始化，加载BetterQQNT
function initialization(webContents) {
    const loader = new BetterQQNTLoader(webContents);
    base.output("BetterQQNTLoader Created.");
    loader.loadAPI();
    base.output("API Loaded.");
    loader.loadPlugins();
    base.output("loadPlugins Loaded.");
    loader.loadRendererLoader();
    base.output("loadRendererLoader Loaded.");
}


// 查找窗口
const interval = setInterval(() => {
    const getAllWindows = BrowserWindow.getAllWindows();
    for (const browserWindow of getAllWindows) {
        const webContents = browserWindow.webContents;
        const url = webContents.getURL();
        if (url.includes("app://./renderer/index.html")) {
            base.output("Found Index Window!");
            clearInterval(interval);
            base.output("Initializing...");
            initialization(webContents);
            return;
        }
    }
}, 100);


// 继续执行QQNT启动
base.output("Starting QQNT...");
require("../app_launcher/index.js");