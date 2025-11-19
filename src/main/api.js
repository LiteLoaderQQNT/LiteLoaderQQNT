const default_config = require("../common/static/config.json");
const { ipcMain, shell } = require("electron");
const path = require("node:path");
const fs = require("node:fs");


const admZip = (() => {
    const major_node = path.join(process.resourcesPath, "app", "major.node");
    require(major_node).load("internal_admzip", module);
    return exports.admZip.default;
})();


// 路径配置
const qwqnt_path = path.join(globalThis.qwqnt?.framework?.paths?.data ?? "", "LiteLoader");
const root_path = path.join(__dirname, "..", "..");
const profile_path = process.env.LITELOADERQQNT_PROFILE ?? (globalThis.qwqnt ? qwqnt_path : root_path);
const data_path = path.join(profile_path, "data");
const plugins_path = path.join(profile_path, "plugins");
const liteloader_package = require(path.join(root_path, "package.json"));
const qqnt_package = require(path.join(process.resourcesPath, "app/package.json"))


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

/**
 * 获取插件配置
 */
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
        console.error("Plugin install error:", error);
    }
    return false;
}


/**
 * 删除插件
 */
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

/**
 * 禁用/启用插件
 */
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


/**
 * 创建白名单
 */
const whitelist = (() => {
    const whitelist = new Set([
        LiteLoader.path.root,
        LiteLoader.path.profile,
        LiteLoader.path.data,
        LiteLoader.path.plugins
    ]);
    // 添加真实路径
    for (const path of whitelist) {
        try {
            whitelist.add(fs.realpathSync(path));
        } catch { }
    }
    // 添加标准化路径（统一使用正斜杠）
    for (const path of whitelist) {
        whitelist.add(path.replaceAll("\\", "/"));
    }
    return whitelist;
})();

/**
 * 将 LiteLoader 对象挂载到全局，仅允许白名单路径访问
 */
Object.defineProperty(globalThis, "LiteLoader", {
    configurable: false,
    get() {
        const stack = new Error().stack.split("\n")[2];
        if ([...whitelist].some(item => stack.includes(item))) {
            return LiteLoader;
        }
    }
});


/**
 * 将 LiteLoader 对象暴露给渲染进程（隐藏 API）
 */
ipcMain.on("LiteLoader.LiteLoader.LiteLoader", (event) => {
    event.returnValue = {
        ...LiteLoader,
        api: null
    };
});

/**
 * 处理 API 调用请求
 */
ipcMain.handle("LiteLoader.LiteLoader.api", (event, name, method, args) => {
    try {
        // 直接调用或嵌套调用
        const target = name === method ? LiteLoader.api[method] : LiteLoader.api[name][method];
        return target?.(...args) ?? null;
    } catch (error) {
        console.error("API call error:", error);
        return null;
    }
});
