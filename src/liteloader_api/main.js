const { ipcMain, shell, dialog } = require("electron");
const path = require("node:path");
const fs = require("node:fs");


const launcher_node = path.join(process.resourcesPath, "app/app_launcher/launcher.node");
require(launcher_node).load("external_admzip", module);


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


function pluginInstall(plugin_path) {
    try {
        if (fs.statSync(plugin_path).isFile()) {
            // 通过 ZIP 格式文件安装插件
            if (path.extname(plugin_path).toLowerCase() == ".zip") {
                const plugin_zip = new exports.admZip.default(plugin_path);
                for (const entry of plugin_zip.getEntries()) {
                    if (entry.entryName == "manifest.json" || entry.entryName.split(/\/(.+)/)[1] == "manifest.json") {
                        const { slug } = JSON.parse(entry.getData());
                        if (LiteLoader.api.plugin.uninstall(slug, false)) {
                            const dest_path = path.join(LiteLoader.path.plugins, slug);
                            plugin_zip.extractAllTo(dest_path);
                            return true;
                        }
                    }
                }
            }
            // 通过 manifest.json 文件安装插件
            if (path.basename(plugin_path) == "manifest.json") {
                const { slug } = JSON.parse(fs.readFileSync(plugin_path));
                if (LiteLoader.api.plugin.uninstall(slug, false)) {
                    const src_path = path.dirname(plugin_path);
                    const dest_path = path.join(LiteLoader.path.plugins, slug);
                    fs.cpSync(src_path, dest_path, { recursive: true });
                    return true;
                }
            }
        }
    } catch (error) {
        console.error(error);
    }
    return false;
}


function pluginUninstall(slug, delete_data = false) {
    if (!(slug in LiteLoader.plugins)) return true;
    try {
        const { plugin, data } = LiteLoader.plugins[slug].path;
        if (delete_data) {
            fs.rmdirSync(data);
        }
        fs.rmdirSync(plugin);
        return true;
    } catch (error) {
        console.log(error);
    }
    return false;
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
            uninstall: pluginUninstall,
        },
        openExternal: shell.openExternal,
        openPath: shell.openPath,
        openDialog: options => dialog.showOpenDialog(null, options)
    }
};


// 将LiteLoader对象挂载到全局
const whitelist = [
    LiteLoader.path.root,
    LiteLoader.path.profile,
    fs.realpathSync(LiteLoader.path.root),
    fs.realpathSync(LiteLoader.path.profile),
];
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
