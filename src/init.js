const { ipcMain, shell } = require("electron");
const path = require("node:path");
const fs = require("node:fs");


const root_path = path.join(__dirname, "..");
const profile_root = process.env.LITELOADERQQNT_PROFILE ?? root_path;
const data_path = path.join(profile_root, "data");
const plugins_path = path.join(profile_root, "plugins");

// 如果数据目录不存在
if (!fs.existsSync(profile_root)) {
    fs.mkdirSync(profile_root, { recursive: true });
}

// 如果配置文件不存在
if (!fs.existsSync(path.join(profile_root, "config.json"))) {
    fs.copyFileSync(path.join(root_path, "config.json"), path.join(profile_root, "config.json"));
}

const config = require(path.join(profile_root, "config.json"));
const liteloader_package = require(path.join(root_path, "package.json"));
const qqnt_package = require(path.join(process.resourcesPath, "app/package.json"))


function disablePlugin(slug, disabled) {
    const config_path = path.join(profile_root, "config.json");
    const config = JSON.parse(fs.readFileSync(config_path, "utf-8"));
    if (disabled) {
        config.LiteLoader.disabled_plugins = config.LiteLoader.disabled_plugins.concat(slug);
    } else {
        config.LiteLoader.disabled_plugins = config.LiteLoader.disabled_plugins.filter(item => item != slug);
    }
    fs.writeFileSync(config_path, JSON.stringify(config, null, 4), "utf-8");
}


function getConfig(slug, default_config) {
    let config = {};
    const config_path = path.join(data_path, slug, "config.json");
    fs.mkdirSync(path.dirname(config_path), { recursive: true });
    if (fs.existsSync(config_path)) {
        config = JSON.parse(fs.readFileSync(config_path, "utf-8"));
    } else {
        fs.writeFileSync(config_path, JSON.stringify(default_config, null, 4), "utf-8");
    }
    return Object.assign({}, default_config, config);
}


function setConfig(slug, new_config) {
    const config_path = path.join(data_path, slug, "config.json");
    fs.mkdirSync(path.dirname(config_path), { recursive: true });
    fs.writeFileSync(config_path, JSON.stringify(new_config, null, 4), "utf-8");
}


const LiteLoader = {
    path: {
        root: root_path,
        profile: profile_root,
        data: data_path,
        plugins: plugins_path
    },
    versions: {
        qqnt: qqnt_package.version,
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
    config: config,
    plugins: {},
    api: {
        disablePlugin: disablePlugin,
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
        const stack = new Error().stack.split("\n");
        if (stack[2].includes(LiteLoader.path.root)) {
            return LiteLoader;
        }
        if (stack[2].includes(LiteLoader.path.profile)) {
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
    if (name == "disablePlugin") {
        if (method == "disablePlugin") {
            return LiteLoader.api.disablePlugin(...args);
        }
    }
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


require("./main.js");
