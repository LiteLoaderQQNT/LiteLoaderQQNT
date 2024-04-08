require("./liteloader_api/main.js");

const default_config = require("./setting/static/config.json");

const { protocol } = require("electron");
const path = require("node:path");
const fs = require("node:fs");


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
    const config = LiteLoader.api.config.get("LiteLoader", default_config);

    // 如果设定环境变量
    if (process.env?.LITELOADERQQNT_PROFILE) {
        output("Use LITELOADERQQNT_PROFILE environment variables:", LiteLoader.path.profile);
    }

    // 如果插件全局开关为关闭状态
    if (!config.enable_plugins) {
        output("Plugin loader is disabled, no plugins will be loaded.");
        return;
    }

    output("Start finding all plugins.");

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
                const disabled_plugin = config.disabled_plugins.includes(manifest.slug);

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
