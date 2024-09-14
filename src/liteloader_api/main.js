const default_config = require("../settings/static/config.json");
const { ipcMain, shell } = require("electron");
const path = require("node:path");
const fs = require("node:fs");

const admZip = (() => {
    const major_node = path.join(process.resourcesPath, "app/major.node");
    const launcher_node = path.join(process.resourcesPath, "app/app_launcher/launcher.node");
    if (fs.existsSync(major_node)) {
        require(major_node).load("internal_admzip", module);
    }
    else {
        require(launcher_node).load("external_admzip", module);
    }
    return exports.admZip.default;
})();


const root_path = path.join(__dirname, "..", "..");
const profile_path = process.env.LITELOADERQQNT_PROFILE ?? root_path;
const data_path = path.join(profile_path, "data");
const plugins_path = path.join(profile_path, "plugins");
const liteloader_package = require(path.join(root_path, "package.json"));
const qqnt_package = require(path.join(process.resourcesPath, "app/package.json"))
const qqnt_version = (() => {
    const config_filepath = path.join(process.resourcesPath, "app/versions/config.json");
    return fs.existsSync(config_filepath) ? require(config_filepath) : qqnt_package;
})();


function setConfig(slug, new_config) {
    try {
        const config_path = path.join(data_path, slug, "config.json");
        fs.mkdirSync(path.dirname(config_path), { recursive: true });
        fs.writeFileSync(config_path, JSON.stringify(new_config, null, 4), "utf-8");
        return true;
    } catch {
        return false;
    }
}


function getConfig(slug, default_config) {
    try {
        const config_path = path.join(data_path, slug, "config.json");
        if (fs.existsSync(config_path)) {
            const config = JSON.parse(fs.readFileSync(config_path, "utf-8"));
            return Object.assign({}, default_config, config);
        }
        else {
            setConfig(slug, default_config);
            return Object.assign({}, default_config, {});
        }
    } catch {
        return default_config;
    }
}


function pluginInstall(plugin_path, undone = false) {
    try {
        if (fs.statSync(plugin_path).isFile()) {
            // 通过 ZIP 格式文件安装插件
            if (path.extname(plugin_path).toLowerCase() == ".zip") {
                const plugin_zip = new admZip(plugin_path);
                for (const entry of plugin_zip.getEntries()) {
                    if (entry.entryName == "manifest.json" && !entry.isDirectory) {
                        const { slug } = JSON.parse(entry.getData());
                        if (slug in LiteLoader.plugins) LiteLoader.api.plugin.delete(slug, false, false);
                        const config = LiteLoader.api.config.get("LiteLoader", default_config);
                        if (undone) delete config.installing_plugins[slug];
                        else config.installing_plugins[slug] = {
                            plugin_path: plugin_path,
                            plugin_type: "zip"
                        };
                        LiteLoader.api.config.set("LiteLoader", config);
                        return true;
                    }
                }
            }
            // 通过 manifest.json 文件安装插件
            if (path.basename(plugin_path) == "manifest.json") {
                const { slug } = JSON.parse(fs.readFileSync(plugin_path));
                if (slug in LiteLoader.plugins) LiteLoader.api.plugin.delete(slug, false, false);
                const config = LiteLoader.api.config.get("LiteLoader", default_config);
                if (undone) delete config.installing_plugins[slug];
                else config.installing_plugins[slug] = {
                    plugin_path: plugin_path,
                    plugin_type: "json"
                };
                LiteLoader.api.config.set("LiteLoader", config);
                return true;
            }
        }
    } catch (error) {
        console.error(error);
    }
    return false;
}


function pluginDelete(slug, delete_data = false, undone = false) {
    if (!(slug in LiteLoader.plugins)) return true;
    const { plugin, data } = LiteLoader.plugins[slug].path;
    const config = LiteLoader.api.config.get("LiteLoader", default_config);
    if (undone) delete config.deleting_plugins[slug];
    else config.deleting_plugins[slug] = {
        plugin_path: plugin,
        data_path: delete_data ? data : null
    };
    LiteLoader.api.config.set("LiteLoader", config);
}


function pluginDisable(slug, undone = false) {
    const config = LiteLoader.api.config.get("LiteLoader", default_config);
    if (undone) config.disabled_plugins = config.disabled_plugins.filter(item => item != slug);
    else config.disabled_plugins = config.disabled_plugins.concat(slug);
    LiteLoader.api.config.set("LiteLoader", config);
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
        plugin: {
            install: pluginInstall,
            delete: pluginDelete,
            disable: pluginDisable
        },
        openExternal: shell.openExternal,
        openPath: shell.openPath
    }
};


// 将LiteLoader对象挂载到全局
const whitelist = [
    LiteLoader.path.root,
    LiteLoader.path.profile,
    LiteLoader.path.data,
    LiteLoader.path.plugins,
];
try {
    whitelist.push(fs.realpathSync(LiteLoader.path.root));
    whitelist.push(fs.realpathSync(LiteLoader.path.profile));
    whitelist.push(fs.realpathSync(LiteLoader.path.plugins));
    whitelist.push(fs.realpathSync(LiteLoader.path.data));
} catch { };
Object.defineProperty(globalThis, "LiteLoader", {
    configurable: false,
    get() {
        const stack = new Error().stack.split("\n")[2];
        if (whitelist.some(item => stack.includes(item))) {
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


ipcMain.handle("LiteLoader.LiteLoader.api", (event, name, method, args) => {
    try {
        if (name == method) return LiteLoader.api[method](...args);
        else return LiteLoader.api[name][method](...args);
    } catch (error) {
        return null;
    }
});
