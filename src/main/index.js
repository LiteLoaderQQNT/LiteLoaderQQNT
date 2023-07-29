const { Module } = require("module");
const { app, ipcMain, session, net, protocol } = require("electron");
const path = require("path");
const { LiteLoader } = require("./base.js");
const { PluginLoader } = require("./loader.js");

app.commandLine.appendSwitch("disable-features", "OutOfBlinkCors");

// 监听窗口创建
function observeNewBrowserWindow(callback) {
    const original_load = Module._load;
    Module._load = (...args) => {
        const loaded_module = original_load(...args);

        if (args[0] != "electron") {
            return loaded_module;
        }

        // Hook BrowserWindow
        // Proxy: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy
        // 使用继承的Hook方法会导致无法使用BrowserWindow.getAllWindows()方法
        let HookedBrowserWindow = new Proxy(loaded_module.BrowserWindow, {
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
                const window = Reflect.construct(target, [config], newTarget);
                callback(window);
                return window;
            }
        });

        // Proxy的方法不需要重新解构loaded_module，提高性能
        return new Proxy(loaded_module, {
            get(target, property, receiver) {
                if (property === "BrowserWindow") {
                    return HookedBrowserWindow;
                }
                return Reflect.get(target, property, receiver);
            }
        });
    };
}

// 插件加载器
const plugin_loader = new PluginLoader();

// 让插件加载只执行一次
app.on("ready", () => {
    plugin_loader.onLoad();

    const protocolHandler = (req) => {
        const { host, pathname } = new URL(req.url);
        if (host === "local-file") {
            return net.fetch("file://" + decodeURI(pathname));
        } else if (host === "api") {
        }
    };

    //新版本Electron
    if (protocol.handle) {
        protocol.handle("llqqnt", protocolHandler);
    }
    //老版本Electron没有handle
    else {
        const oldProtocolHandler = (req, callback) => {
            const { host, pathname } = new URL(req.url);

            if (host === "local-file") {
                callback({
                    path: path.normalize(decodeURIComponent(pathname))
                });
            } else {
                callback({ path: "" });
            }
        };
        protocol.handle("llqqnt", oldProtocolHandler);
    }
});

// 监听窗口创建
observeNewBrowserWindow((window) => {
    //加载自定义协议
    const ses = window.webContents.session;

    if (ses.protocol.isProtocolRegistered("llqqnt")) {
        return;
    }

    const protocolHandler = (req) => {
        const { host, pathname } = new URL(req.url);
        if (host === "local-file") {
            return net.fetch("file://" + decodeURI(pathname));
        } else if (host === "api") {
        }
    };

    //新版本Electron
    if (protocol.handle) {
        ses.protocol.handle("llqqnt", protocolHandler);
    }
    //老版本Electron没有handle
    else {
        const oldProtocolHandler = (req, callback) => {
            const { host, pathname } = new URL(req.url);

            if (host === "local-file") {
                callback({
                    path: path.normalize(decodeURIComponent(pathname))
                });
            } else {
                callback({ path: "" });
            }
        };
        ses.protocol.registerFileProtocol("llqqnt", oldProtocolHandler);
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

ipcMain.on("LiteLoader.LiteLoader.path", (event, message) => {
    event.returnValue = LiteLoader.path;
});

ipcMain.on("LiteLoader.LiteLoader.versions", (event, message) => {
    event.returnValue = LiteLoader.versions;
});

ipcMain.on("LiteLoader.LiteLoader.plugins", (event, message) => {
    event.returnValue = LiteLoader.plugins;
});

ipcMain.on("LiteLoader.LiteLoader.package", (event, message) => {
    event.returnValue = LiteLoader.package;
});

ipcMain.on("LiteLoader.LiteLoader.os", (event, message) => {
    event.returnValue = LiteLoader.os;
});

ipcMain.on("LiteLoader.LiteLoader.config", (event, message) => {
    event.returnValue = LiteLoader.config;
});
