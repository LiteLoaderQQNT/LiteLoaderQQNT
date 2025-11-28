const path = require("path");
const electron = require("electron");
const store = require("./store.js");

const LiteLoader = Object.create(null);

LiteLoader.plugins = Object.create(null);

LiteLoader.path = Object.create(null);
LiteLoader.path.root = path.dirname(path.dirname(__dirname));
LiteLoader.path.profile = process.env.LITELOADERQQNT_PROFILE ?? (globalThis.qwqnt ?
    path.join(globalThis.qwqnt.framework.paths.data, "LiteLoader") :
    LiteLoader.path.root
);
LiteLoader.path.data = path.join(LiteLoader.path.profile, "data");
LiteLoader.path.plugins = path.join(LiteLoader.path.profile, "plugins");

LiteLoader.package = Object.create(null);
LiteLoader.package.liteloader = require(path.join(LiteLoader.path.root, "package.json"));
LiteLoader.package.qqnt = require(path.join(process.resourcesPath, "app", "package.json"));

LiteLoader.versions = Object.create(null);
LiteLoader.versions.liteloader = LiteLoader.package.liteloader.version;
LiteLoader.versions.qqnt = LiteLoader.package.qqnt.version;
LiteLoader.versions.electron = process.versions.electron;
LiteLoader.versions.node = process.versions.node;
LiteLoader.versions.chrome = process.versions.chrome;

LiteLoader.os = Object.create(null);
LiteLoader.os.platform = process.platform;

LiteLoader.api = Object.create(null);
LiteLoader.api.openExternal = (url) => (electron.shell.openExternal(url), true);
LiteLoader.api.openPath = (path) => (electron.shell.openPath(path), true);

LiteLoader.api.config = Object.create(null);
LiteLoader.api.config.set = store.setPluginConfig;
LiteLoader.api.config.get = store.getPluginConfig;

LiteLoader.api.plugin = Object.create(null);
LiteLoader.api.plugin.install = store.installPlugin;
LiteLoader.api.plugin.delete = store.deletePlugin;
LiteLoader.api.plugin.disable = store.disablePlugin;

Object.defineProperty(globalThis, "LiteLoader", {
    get() {
        const stack = new Error().stack.split("\n")[2];
        const allowed = [LiteLoader.path.root, LiteLoader.path.profile];
        return allowed.some((item) => stack.includes(item)) ? LiteLoader : null;
    }
});

electron.ipcMain.on("LiteLoader.LiteLoader.LiteLoader", (event, method, args) => {
    event.returnValue = method.length ?
        method.reduce((obj, key) => obj?.[key], LiteLoader)?.(...args) :
        JSON.parse(JSON.stringify(LiteLoader));
});