const default_config = require("../settings/static/config.json");
const path = require("node:path");
const fs = require("node:fs");

const launcher_node = path.join(process.resourcesPath, "app/app_launcher/launcher.node");
require(launcher_node).load("external_admzip", module);

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

for (const slug in config.deleting_plugins) {
    try {
        const { plugin_path, data_path } = config.deleting_plugins[slug];
        if (data_path) fs.rmSync(data_path, { recursive: true });
        fs.rmSync(plugin_path, { recursive: true });
        delete config.deleting_plugins[slug];
        LiteLoader.api.config.set("LiteLoader", config);
    } catch (error) {
        console.log(error);
    }
}

for (const slug in config.installing_plugins) {
    try {
        const { plugin_path, plugin_type } = config.installing_plugins[slug];
        const dest_path = path.join(LiteLoader.path.plugins, slug);
        if (fs.existsSync(dest_path)) {
            fs.renameSync(dest_path, `${dest_path}_${parseInt(Math.random() * 100000)} `);
        }
        if (plugin_type == "zip") {
            new exports.admZip.default(plugin_path).extractAllTo(dest_path);
        }
        if (plugin_type == "json") {
            fs.cpSync(path.dirname(plugin_path), dest_path, { recursive: true });
        }
        delete config.installing_plugins[slug];
        LiteLoader.api.config.set("LiteLoader", config);
    } catch (error) {
        console.log(error);
    }
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
