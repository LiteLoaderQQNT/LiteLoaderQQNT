const path = require("path");
const fs = require("fs");

exports.installPlugin = (slug) => {
    try {
        const { plugin_path, plugin_type } = config.installing_plugins[slug];
        const dest_path = path.join(LiteLoader.path.plugins, slug);
        if (fs.existsSync(dest_path)) fs.rmSync(dest_path, { recursive: true });
        if (plugin_type == "zip") new zip(plugin_path).extractAllTo(dest_path);
        if (plugin_type == "json") fs.cpSync(path.dirname(plugin_path), dest_path, { recursive: true });
    }
    catch (err) { showErrorDialog("安装插件时报错，请检查并手动安装", err.message); }
    finally {
        delete config.installing_plugins[slug];
        LiteLoader.api.config.set("LiteLoader", config);
    }
}

exports.uninstallPlugin = (slug) => {
    try {
        const { plugin_path, data_path } = config.deleting_plugins[slug];
        if (data_path && fs.existsSync(data_path)) fs.rmSync(data_path, { recursive: true });
        if (fs.existsSync(plugin_path)) fs.rmSync(plugin_path, { recursive: true });
    }
    catch (err) { showErrorDialog("删除插件时报错，请检查并手动删除", err.message); }
    finally {
        delete config.deleting_plugins[slug];
        LiteLoader.api.config.set("LiteLoader", config);
    }
}

exports.scanPluginDirectory = () => {
    fs.mkdirSync(LiteLoader.path.plugins, { recursive: true });
    return fs.readdirSync(LiteLoader.path.plugins, { withFileTypes: true })
        .map(dirent => path.join(dirent.path, dirent.name, "manifest.json"))
        .filter(manifest => fs.existsSync(manifest))
        .map(manifest => ({
            path: path.dirname(manifest),
            manifest: JSON.parse(fs.readFileSync(manifest, "utf-8"))
        }));
}
