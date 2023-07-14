const fs = require("fs");
const path = require("path");
const { LiteLoader, output } = require("./base.js");

class PluginLoader {
    // 插件列表
    #plugins = {};

    constructor() {
        output("Start loading plugins.");

        // 插件目录插件名
        let builtin_dirnames = [];
        let plugin_dirnames = [];

        // 内置的核心插件
        try {
            builtin_dirnames = fs.readdirSync(LiteLoader.path.builtins, "utf-8");
        } catch (error) {
            output("The builtins directory does not exist.");
        }

        // 外置第三方插件
        try {
            plugin_dirnames = fs.readdirSync(LiteLoader.path.plugins, "utf-8");
        } catch (error) {
            output("The plugins directory does not exist.");
        }

        // 加载插件
        try {
            // 获取单个插件目录名
            for (const builtin_dirname of builtin_dirnames) {
                const plugin_path = path.join(LiteLoader.path.builtins, builtin_dirname);
                this.#loadPlugin(plugin_path);
            }
            for (const plugin_dirname of plugin_dirnames) {
                const plugin_path = path.join(LiteLoader.path.plugins, plugin_dirname);
                this.#loadPlugin(plugin_path);
            }
        } catch (error) {
            output("Plugins loaded with error: ", error);
        }

        // 插件加载完成输出
        const plugins_length = Object.keys(this.#plugins).length;
        const not_plugins_message = "No plugins to be loaded.";
        const has_plugins_message = `Done! ${plugins_length} plugins loaded!`;
        output(plugins_length == 0 ? not_plugins_message : has_plugins_message);
    }

    #getManifest(plugin_path) {
        const file_path = path.join(plugin_path, "manifest.json");
        // 尝试获取插件manifest内容
        try {
            const data = fs.readFileSync(file_path, "utf-8");
            return JSON.parse(data);
        } catch (err) {
            // 出错就返回null，没有获取到
            return null;
        }
    }

    #loadPlugin(plugin_path) {
        const manifest = this.#getManifest(plugin_path);

        if (!manifest) {
            return;
        }

        // manifest与路径
        const { slug, name, type } = manifest;
        const plugin_data_path = path.join(LiteLoader.path.plugins_data, slug);
        const plugin_cache_path = path.join(LiteLoader.path.plugins_cache, slug);
        const main_path = manifest.injects?.main ?? "";
        const file_path = path.join(plugin_path, main_path);
        const plugin_disabled = LiteLoader.config?.disabled?.includes(slug) ?? false;

        // 保存到插件列表
        const plugin = {
            manifest: manifest,
            path: {
                plugin: plugin_path,
                data: plugin_data_path,
                cache: plugin_cache_path
            },
            exports: main_path && !plugin_disabled ? require(file_path) : null,
            disabled: plugin_disabled
        }

        if (!main_path) {
            delete plugin.exports;
        }

        this.#plugins[slug] = plugin;

        // 放到LiteLoader对象上
        LiteLoader.plugins[slug] = { ...plugin };
        delete LiteLoader.plugins[slug].exports;

        output("Found plugin:", name);
    }

    onLoad() {
        // 加载插件
        for (const [slug, plugin] of Object.entries(this.#plugins)) {
            plugin.exports?.onLoad?.(plugin, LiteLoader);
        }
    }

    onBrowserWindowCreated(window) {
        // 渲染进程PluginLoader
        window.webContents.on("dom-ready", () => {
            const file_path = path.join(__dirname, "../renderer/index.js");
            fs.readFile(file_path, "utf-8", (err, data) => {
                if (err) throw err;
                window.webContents.executeJavaScript(data, true);
            });
        });

        // 注入插件Preload
        const preloads = new Set([
            ...window.webContents.session.getPreloads(),
            path.join(__dirname, "../preload/index.js")
        ]);

        // 通知插件
        for (const [slug, plugin] of Object.entries(this.#plugins)) {
            plugin.exports?.onBrowserWindowCreated?.(window, plugin);
            const preload_path = plugin.manifest.injects?.preload;
            // 存在preload就放Set里
            if (preload_path) {
                const file_path = path.join(plugin.path.plugin, preload_path);
                preloads.add(file_path);
            }
        }

        // 加载Set中的Preload脚本
        window.webContents.session.setPreloads([...preloads]);
    }
}

module.exports = {
    PluginLoader
};
