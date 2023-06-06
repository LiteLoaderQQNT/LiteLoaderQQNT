const fs = require("fs");
const path = require("path");
const { betterQQNT, output } = require("./base.js");


// 获取插件路径列表
function getPluginPaths(base_path) {
    const plugin_paths = [];

    try {
        const plugin_dirnames = fs.readdirSync(base_path, "utf-8");
        // 获取单个插件目录名
        for (const plugin_dirname of plugin_dirnames) {
            const plugin_path = path.join(base_path, plugin_dirname);
            plugin_paths.push(plugin_path);
        }
    } catch (error) {
        // 目录不存在
        output("plugins directory does not exist, creating directory...");
        // 创建目录
        fs.mkdir(base_path, { recursive: true }, err => {
            // 创建失败
            if (err) {
                output("Failed to create plugins directory!")
            }
            output("Directory created successfully!")
        });
    }

    // 返回插件路径列表
    return plugin_paths;
}


// 获取插件清单
function getPluginManifest(plugin_path) {
    const file_path = path.join(plugin_path, "manifest.json");
    try {
        const data = fs.readFileSync(file_path, "utf-8");
        return JSON.parse(data);
    } catch (err) {
        return null;
    }
}


// 获取插件列表
function getPlugins() {
    const plugins = {};

    // 获取插件路径列表
    const plugin_paths = getPluginPaths(betterQQNT.path.plugins);
    for (const plugin_path of plugin_paths) {
        // 获取插件清单
        const manifest = getPluginManifest(plugin_path);
        if (manifest) {
            output("Found plugin:", manifest["name"]);
            plugins[manifest["slug"]] = {
                manifest: manifest,
                path: {
                    plugin: plugin_path,
                    data: path.join(betterQQNT.path.plugins_data, manifest["slug"]),
                    cache: path.join(betterQQNT.path.plugins_cache, manifest["slug"])
                }
            }
        }
    }

    // 返回插件列表
    return plugins;
}


function getPreload(plugin) {
    const pathname = plugin.manifest.injects.preload;
    const filepath = path.join(plugin.path.plugin, pathname);
    return filepath;
}


// 加载插件
function loadPlugin(plugin) {
    const pathname = plugin.manifest.injects.main;
    const filepath = path.join(plugin.path.plugin, pathname);
    return require(filepath);
}


module.exports = {
    getPlugins,
    getPreload,
    loadPlugin
}
