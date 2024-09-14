const { app, dialog } = require("electron");
const path = require("node:path");
const fs = require("node:fs");

const default_config = require("../settings/static/config.json");

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


const output = (...args) => console.log("\x1b[32m%s\x1b[0m", "[LiteLoader]", ...args);
const config = LiteLoader.api.config.get("LiteLoader", default_config);


function deletePlugin(slug) {
    try {
        const { plugin_path, data_path } = config.deleting_plugins[slug];
        if (data_path) fs.rmSync(data_path, { recursive: true });
        fs.rmSync(plugin_path, { recursive: true });
    }
    catch (error) {
        output("Deleting Plugin Error", error);
        app.on("ready", () => {
            dialog.showMessageBox(null, {
                type: "error",
                title: "LiteLoaderQQNT",
                message: `删除插件时报错，请检查并手动删除\n${error}`
            });
        });
    }
    finally {
        delete config.deleting_plugins[slug];
        LiteLoader.api.config.set("LiteLoader", config);
    }
}


function InstallPlugin(slug) {
    try {
        const { plugin_path, plugin_type } = config.installing_plugins[slug];
        const dest_path = path.join(LiteLoader.path.plugins, slug);
        if (fs.existsSync(dest_path)) {
            fs.renameSync(dest_path, `${dest_path}_${parseInt(Math.random() * 100000)} `);
        }
        if (plugin_type == "zip") {
            new admZip(plugin_path).extractAllTo(dest_path);
        }
        if (plugin_type == "json") {
            fs.cpSync(path.dirname(plugin_path), dest_path, { recursive: true });
        }
    }
    catch (error) {
        output("Installing Plugin Error", error);
        app.on("ready", () => {
            dialog.showMessageBox(null, {
                type: "error",
                title: "LiteLoaderQQNT",
                message: `安装插件时报错，请检查并手动安装\n${error}`
            });
        });
    }
    finally {
        delete config.installing_plugins[slug];
        LiteLoader.api.config.set("LiteLoader", config);
    }
}


function findAllPlugin() {
    const plugins = [];
    try {
        fs.mkdirSync(LiteLoader.path.plugins, { recursive: true });
        for (const pathname of fs.readdirSync(LiteLoader.path.plugins, "utf-8")) {
            try {
                const filepath = path.join(LiteLoader.path.plugins, pathname, "manifest.json");
                const manifest = JSON.parse(fs.readFileSync(filepath, "utf-8"));
                if (manifest.manifest_version == 4) plugins.push({ pathname, manifest });
            }
            catch { continue }
        }
    }
    catch (error) {
        output("Find Plugin Error", error);
        app.on("ready", () => {
            dialog.showMessageBox(null, {
                type: "warning",
                title: "LiteLoaderQQNT",
                message: `在读取数据目录时报错了！请检查插件目录或忽略继续启动\n${error}`
            });
        });
    }
    return plugins;
}


function getPluginInfo(pathname, manifest) {
    const incompatible_platform = !manifest.platform.includes(LiteLoader.os.platform);
    const disabled_plugin = config.disabled_plugins.includes(manifest.slug);
    const plugin_path = path.join(LiteLoader.path.plugins, pathname);
    const data_path = path.join(LiteLoader.path.data, manifest.slug);
    const main_file = path.join(plugin_path, manifest?.injects?.main ?? "");
    const preload_file = path.join(plugin_path, manifest?.injects?.preload ?? "");
    const renderer_file = path.join(plugin_path, manifest?.injects?.renderer ?? "");
    return {
        manifest: manifest,
        incompatible: incompatible_platform,
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


function loadAllPlugin() {
    const plugins = findAllPlugin();
    const dependencies = new Set();
    for (const { pathname, manifest } of plugins) {
        output("Found Plugin:", manifest.name);
        LiteLoader.plugins[manifest.slug] = getPluginInfo(pathname, manifest);
        manifest.dependencies?.forEach?.(slug => dependencies.add(slug));
    }
    const slugs = plugins.map(plugin => plugin.manifest.slug);
    const missing = [...dependencies].filter(slug => !slugs.includes(slug));
    for (const slug of missing) {
        output("Missing Plugin:", slug);
        app.on("ready", () => {
            dialog.showMessageBox(null, {
                type: "warning",
                title: "LiteLoaderQQNT",
                message: `插件缺少依赖：${slug}`
            });
        });
    }
}


// 删除插件
for (const slug in config.deleting_plugins) {
    deletePlugin(slug);
}

// 安装插件
for (const slug in config.installing_plugins) {
    InstallPlugin(slug);
}

// 加载插件
if (config.enable_plugins) {
    loadAllPlugin();
}