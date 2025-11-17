const default_config = require("../settings/static/config.json");
const { app, dialog } = require("electron");
const path = require("node:path");
const fs = require("node:fs");

const admZip = (() => {
    const major_node = path.join(process.resourcesPath, "app", "major.node");
    require(major_node).load("internal_admzip", module);
    return exports.admZip.default;
})();

const config = LiteLoader.api.config.get("LiteLoader", default_config);


/**
 * 控制台日志输出
 * @param {...any} args - 日志参数
 */
function log(...args) {
    console.log("\x1b[32m%s\x1b[0m", "[LiteLoader]", ...args);
}


/**
 * 控制台错误输出
 * @param {...any} args - 错误参数
 */
function error(...args) {
    console.error("\x1b[31m%s\x1b[0m", "[LiteLoader]", ...args);
}


/**
 * 显示错误对话框
 */
function showErrorDialog(title, message) {
    const showDialog = () => {
        dialog.showMessageBox(null, {
            type: "error",
            title: "LiteLoaderQQNT",
            message: `${title}\n${message}`
        });
    };
    app.isReady() ? showDialog() : app.once("ready", showDialog);
}

/**
 * 删除插件
 */
function deletePlugin(slug) {
    try {
        const { plugin_path, data_path } = config.deleting_plugins[slug];
        if (data_path && fs.existsSync(data_path)) {
            fs.rmSync(data_path, { recursive: true });
        }
        if (fs.existsSync(plugin_path)) {
            fs.rmSync(plugin_path, { recursive: true });
        }
    } catch (err) {
        error("Deleting Plugin Error:", err);
        showErrorDialog("删除插件时报错，请检查并手动删除", err.message);
    } finally {
        delete config.deleting_plugins[slug];
        LiteLoader.api.config.set("LiteLoader", config);
    }
}


/**
 * 安装插件
 */
function installPlugin(slug) {
    try {
        const { plugin_path, plugin_type } = config.installing_plugins[slug];
        const dest_path = path.join(LiteLoader.path.plugins, slug);

        // 备份已存在的插件
        if (fs.existsSync(dest_path)) {
            const backup_name = `${dest_path}_${Date.now()}`;
            fs.renameSync(dest_path, backup_name);
        }

        // 根据类型安装
        if (plugin_type === "zip") {
            new admZip(plugin_path).extractAllTo(dest_path);
        } else if (plugin_type === "json") {
            fs.cpSync(path.dirname(plugin_path), dest_path, { recursive: true });
        }
    } catch (err) {
        error("Installing Plugin Error:", err);
        showErrorDialog("安装插件时报错，请检查并手动安装", err.message);
    } finally {
        delete config.installing_plugins[slug];
        LiteLoader.api.config.set("LiteLoader", config);
    }
}


/**
 * 查找所有插件
 */
function findAllPlugin() {
    const plugins = [];

    try {
        fs.mkdirSync(LiteLoader.path.plugins, { recursive: true });
        const pathnames = fs.readdirSync(LiteLoader.path.plugins, "utf-8");

        for (const pathname of pathnames) {
            try {
                const filepath = path.join(LiteLoader.path.plugins, pathname, "manifest.json");
                const manifest = JSON.parse(fs.readFileSync(filepath, "utf-8"));

                if (manifest.manifest_version === 4) {
                    plugins.push({ pathname, manifest });
                }
            } catch {
                // 忽略无效插件
                continue;
            }
        }
    } catch (err) {
        error("Find Plugin Error:", err);
        showErrorDialog("在读取数据目录时报错了！请检查插件目录或忽略继续启动", err.message);
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
    };
}


/**
 * 加载所有插件
 */
function loadAllPlugin() {
    const plugins = findAllPlugin();
    const dependencies = new Set();
    const slugs = new Set();

    // 加载插件信息
    for (const { pathname, manifest } of plugins) {
        log("Found Plugin:", manifest.name);
        LiteLoader.plugins[manifest.slug] = getPluginInfo(pathname, manifest);
        slugs.add(manifest.slug);
        manifest.dependencies?.forEach(slug => dependencies.add(slug));
    }

    // 检查缺失的依赖
    const missing = [...dependencies].filter(slug => !slugs.has(slug));
    if (missing.length > 0) {
        log("Missing Dependencies:", missing.join(", "));
        showErrorDialog("插件缺少依赖", missing.join(", "));
    }
}


// 删除插件
for (const slug in config.deleting_plugins) {
    deletePlugin(slug);
}

// 安装插件
for (const slug in config.installing_plugins) {
    installPlugin(slug);
}

// 加载所有插件
if (config.enable_plugins) {
    loadAllPlugin();
}