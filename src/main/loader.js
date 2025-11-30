const path = require("path");
const store = require("./store.js");
const config = LiteLoader.api.config.get("LiteLoader", require("../common/static/config.json"));

function topologicalSort(plugins) {
    const sorted = {};
    const visited = new Set();
    const visiting = new Set();
    const visit = (slug) => {
        if (visited.has(slug)) return;
        if (visiting.has(slug)) return;
        const plugin = plugins[slug];
        if (!plugin) return;
        visiting.add(slug);
        (plugin.manifest.dependencies ?? []).forEach(visit);
        visiting.delete(slug);
        visited.add(slug);
        sorted[slug] = plugin;
    };
    Object.keys(plugins).forEach(visit);
    return sorted;
}

function getPluginInstance(plugin) {
    return {
        manifest: plugin.manifest,
        incompatible: !plugin.manifest.platform.includes(LiteLoader.os.platform),
        disabled: config.disabled_plugins.includes(plugin.manifest.slug),
        path: {
            plugin: plugin.path,
            data: path.join(LiteLoader.path.data, plugin.manifest.slug),
            injects: {
                main: plugin.manifest?.injects?.main ? path.join(plugin.path, plugin.manifest.injects.main) : null,
                preload: plugin.manifest?.injects?.preload ? path.join(plugin.path, plugin.manifest.injects.preload) : null,
                renderer: plugin.manifest?.injects?.renderer ? path.join(plugin.path, plugin.manifest.injects.renderer) : null
            }
        }
    };
}

exports.loadAllPlugins = () => {
    if (config.enable_plugins) {
        const dependencies = new Set();
        const plugins = {};
        // 加载插件信息
        for (const plugin of store.scanPluginDirectory()) {
            plugin.manifest.dependencies?.forEach(slug => dependencies.add(slug));
            plugins[plugin.manifest.slug] = getPluginInstance(plugin);
        }
        LiteLoader.plugins = topologicalSort(plugins);
    }
}