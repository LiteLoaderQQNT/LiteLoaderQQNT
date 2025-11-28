const path = require("path");
const fs = require("fs");
const default_config = require("../common/static/config.json");

const AdmZip = (() => {
    const major_node = path.join(process.resourcesPath, "./app/major.node");
    require(major_node).load("internal_admzip", module);
    return module.exports.admZip.default;
})();

function getDestPath(manifest_text) {
    const { slug } = JSON.parse(manifest_text);
    let dest_path = path.join(LiteLoader.path.plugins, slug);
    if (slug in LiteLoader.plugins) LiteLoader.api.plugin.delete(slug, false, false);
    if (fs.existsSync(dest_path)) dest_path += `_${Date.now()}`;
    return dest_path;
}

exports.installPlugin = (plugin_path) => {
    const extname = path.extname(plugin_path);
    const basename = path.basename(plugin_path);
    const dirname = path.dirname(plugin_path);
    try {
        if (extname.toLowerCase() == ".zip") {
            const plugin_zip = new AdmZip(plugin_path);
            const manifest_entry = plugin_zip.getEntry("manifest.json");
            const manifest_text = plugin_zip.readAsText(manifest_entry);
            plugin_zip.extractAllTo(getDestPath(manifest_text));
            return true;
        }
        if (basename.toLowerCase() == "manifest.json") {
            const manifest_text = fs.readFileSync(plugin_path, "utf-8");
            fs.cpSync(dirname, getDestPath(manifest_text), { recursive: true });
            return true;
        }
    }
    catch (err) { showErrorDialog("安装插件时报错，请检查并手动安装", err.message); }
    return false;
}

exports.deletePlugin = (slug, [self, data], now) => {
    const config = LiteLoader.api.config.get("LiteLoader", default_config);
    const plugin = config.deleting_plugins[slug];
    if (now) {
        if (self && plugin.self) fs.rmSync(plugin.self, { recursive: true, force: true });
        if (data && plugin.data) fs.rmSync(plugin.data, { recursive: true, force: true });
        delete config.deleting_plugins[slug];
    } else {
        config.deleting_plugins[slug] = {
            self: self ? LiteLoader.plugins[slug]?.path?.plugin ?? null : null,
            data: data ? LiteLoader.plugins[slug]?.path?.data ?? null : null
        };
        if (!(self || data)) delete config.deleting_plugins[slug];
    }
    LiteLoader.api.config.set("LiteLoader", config);
}

exports.disablePlugin = (slug, disabled) => {
    const config = LiteLoader.api.config.get("LiteLoader", default_config);
    config.disabled_plugins = disabled ?
        config.disabled_plugins.filter(item => item != slug) :
        config.disabled_plugins.concat(slug);
    LiteLoader.api.config.set("LiteLoader", config);
}

exports.setPluginConfig = (slug, config) => {
    try {
        const config_path = path.join(LiteLoader.path.data, slug, "config.json");
        fs.mkdirSync(path.dirname(config_path), { recursive: true });
        fs.writeFileSync(config_path, JSON.stringify(config, null, 4), "utf-8");
        return true;
    }
    catch { return false; }
}

exports.getPluginConfig = (slug, config) => {
    try {
        const config_path = path.join(LiteLoader.path.data, slug, "config.json");
        if (fs.existsSync(config_path)) {
            const content = fs.readFileSync(config_path, "utf-8");
            return Object.assign({}, config, JSON.parse(content));
        }
        else {
            exports.setConfig(slug, config);
            return Object.assign({}, config, {});
        }
    }
    catch { return config; }
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
