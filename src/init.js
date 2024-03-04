const { ipcMain, shell, protocol } = require("electron");
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


protocol.registerSchemesAsPrivileged([
    {
        scheme: "local",
        privileges: {
            standard: false,
            allowServiceWorkers: true,
            corsEnabled: false,
            supportFetchAPI: true,
            stream: true,
            bypassCSP: true
        }
    }
]);


// 找到所有插件并挂载到 LiteLoader.plugins 对象
(() => {
    const output = (...args) => console.log("\x1b[32m%s\x1b[0m", "[LiteLoader]", ...args);

    output("Start finding all plugins.");
    if (process.env?.LITELOADERQQNT_PROFILE) {
        output("Use LITELOADERQQNT_PROFILE environment variables:", LiteLoader.path.profile);
    }

    // 如果插件目录不存在
    if (!fs.existsSync(LiteLoader.path.plugins)) {
        output("The plugins directory does not exist.");
        output("A new plugin directory will be created.");
        fs.mkdir(LiteLoader.path.plugins, { recursive: true }, error => {
            if (error) {
                output("Plugins directory creation failed!");
                output("Please check the plugins directory.");
                return;
            }
            output("Plugins directory created successfully!");
        });
        return;
    }

    // 读取插件目录
    try {
        for (const plugin_pathname of fs.readdirSync(LiteLoader.path.plugins, "utf-8")) {
            try {
                const manifest_file = path.join(LiteLoader.path.plugins, plugin_pathname, "manifest.json");
                const manifest = JSON.parse(fs.readFileSync(manifest_file, "utf-8"));

                const incompatible_version = Number(manifest.manifest_version) != 4;
                const incompatible_platform = !manifest.platform.includes(LiteLoader.os.platform);
                const disabled_plugin = LiteLoader.config.LiteLoader.disabled_plugins.includes(manifest.slug);

                const plugin_path = path.join(LiteLoader.path.plugins, plugin_pathname);
                const data_path = path.join(LiteLoader.path.data, manifest.slug);

                const main_file = path.join(plugin_path, manifest?.injects?.main ?? "");
                const preload_file = path.join(plugin_path, manifest?.injects?.preload ?? "");
                const renderer_file = path.join(plugin_path, manifest?.injects?.renderer ?? "");

                LiteLoader.plugins[manifest.slug] = {
                    manifest: manifest,
                    incompatible: incompatible_version || incompatible_platform,
                    disabled: disabled_plugin,
                    path: {
                        plugin: plugin_path,
                        data: data_path,
                        injects: {
                            main: fs.statSync(main_file).isFile() ? main_file : null,
                            preload: fs.statSync(preload_file).isFile() ? preload_file : null,
                            renderer: fs.statSync(renderer_file).isFile() ? renderer_file : null
                        }
                    }
                }
            }
            catch {
                continue;
            }
        }
    }
    catch {
        output("Failed to read plugins directory!");
        output("Please check the plugins directory.");
    }

    // 输出插件状态
    for (const plugin of Object.values(LiteLoader.plugins)) {
        const dependencies = plugin.manifest?.dependencies?.filter(slug => !LiteLoader.plugins[slug]);
        // 输出不兼容
        if (plugin.incompatible) {
            output("Found plugin:", plugin.manifest.name, "(Incompatible)");
            continue;
        }
        // 输出已禁用
        if (plugin.disabled) {
            output("Found plugin:", plugin.manifest.name, "(Disabled)");
            continue;
        }
        // 缺少依赖
        if (dependencies?.length) {
            output("Found plugin:", plugin.manifest.name, "Missing dependencies:", dependencies.toString());
            continue;
        }
        output("Found plugin:", plugin.manifest.name);
    }

    // 输出找到了多少插件
    const plugins_length = Object.keys(LiteLoader.plugins).length;
    output(`Found ${plugins_length} plugins,`, plugins_length ? "start loading plugins." : "no plugin to be loaded.");
})();


require("./main.js");
require("./setting/main.js");
