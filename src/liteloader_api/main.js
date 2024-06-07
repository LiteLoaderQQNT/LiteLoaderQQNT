const { ipcMain, shell } = require("electron");
const path = require("node:path");
const fs = require("node:fs");


const root_path = path.join(__dirname, "..", "..");
const profile_path = process.env.LITELOADERQQNT_PROFILE ?? root_path;
const data_path = path.join(profile_path, "data");
const plugins_path = path.join(profile_path, "plugins");
const liteloader_package = require(path.join(root_path, "package.json"));
const qqnt_package = require(path.join(process.resourcesPath, "app/package.json"))
const qqnt_version = (() => {   // 兼容无快更
    const config_filepath = path.join(process.resourcesPath, "app/versions/config.json");
    return fs.existsSync(config_filepath) ? require(config_filepath) : qqnt_package;
})();


function setConfig(slug, new_config) {
    const config_path = path.join(data_path, slug, "config.json");
    fs.mkdirSync(path.dirname(config_path), { recursive: true });
    fs.writeFileSync(config_path, JSON.stringify(new_config, null, 4), "utf-8");
}


function getConfig(slug, default_config) {
    const config_path = path.join(data_path, slug, "config.json");
    if (fs.existsSync(config_path)) {
        const config = JSON.parse(fs.readFileSync(config_path, "utf-8"));
        return Object.assign({}, default_config, config);
    }
    else {
        setConfig(slug, default_config);
        return Object.assign({}, default_config, {});
    }
}


const LiteLoader = {
    path: {
        root: root_path,
        profile: profile_path,
        data: data_path,
        plugins: plugins_path
    },
    versions: {
        qqnt: qqnt_version.curVersion ?? qqnt_version.version,
        liteloader: liteloader_package.version,
        node: process.versions.node,
        chrome: process.versions.chrome,
        electron: process.versions.electron
    },
    os: {
        platform: process.platform
    },
    package: {
        liteloader: liteloader_package,
        qqnt: qqnt_package
    },
    plugins: {},
    api: {
        config: {
            set: setConfig,
            get: getConfig
        },
        openExternal: shell.openExternal,
        openPath: shell.openPath
    }
};


// 将LiteLoader对象挂载到全局
Object.defineProperty(globalThis, "LiteLoader", {
    configurable: false,
    get() {
        const stack = new Error().stack.split("\n")[2];
        if (stack.includes(LiteLoader.path.root)) {
            return LiteLoader;
        }
        if (stack.includes(LiteLoader.path.profile)) {
            return LiteLoader;
        }
    }
});


// 将LiteLoader对象挂载到window
ipcMain.on("LiteLoader.LiteLoader.LiteLoader", (event) => {
    event.returnValue = {
        ...LiteLoader,
        api: void null
    }
});


ipcMain.handle("LiteLoader.LiteLoader.api", (event, name, method, ...args) => {
    if (name == "config") {
        if (method == "get") {
            return LiteLoader.api.config.get(...args);
        }
        if (method == "set") {
            return LiteLoader.api.config.set(...args);
        }
    }
    if (name == "openExternal") {
        if (method == "openExternal") {
            return LiteLoader.api.openExternal(...args);
        }
    }
    if (name == "openPath") {
        if (method == "openPath") {
            return LiteLoader.api.openPath(...args);
        }
    }
});
