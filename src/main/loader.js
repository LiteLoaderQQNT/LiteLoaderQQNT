const { pathToFileURL } = require("url");
const { Log } = require("../common/utils/log.cjs");
const { topologicalSort } = require("../common/utils/sort.cjs");

class MainLoader {
    #exports = {};

    init() {
        const sortedPlugins = topologicalSort(Object.keys(LiteLoader.plugins));
        for (const slug of sortedPlugins) {
            const plugin = LiteLoader.plugins[slug];

            // 跳过禁用或不兼容的插件
            if (
                plugin.disabled ||
                plugin.incompatible ||
                !plugin.path.injects.main
            ) continue;

            this.#loadPlugin(slug, plugin);
        }

        return this;
    }

    #loadPlugin(slug, plugin) {
        try {
            if (plugin.manifest.esm) {
                this.#exports[slug] = {};
                // FIXME: 异步加载可能导致依赖错误
                import(pathToFileURL(plugin.path.injects.main))
                    .then(exported => {
                        this.#exports[slug] = exported;
                    })
                    .catch(e => this.#handleError(plugin, e));
            } else {
                this.#exports[slug] = require(plugin.path.injects.main);
            }
        } catch (e) {
            this.#handleError(plugin, e);
        }
    }

    #handleError(plugin, e) {
        Log.error(`Error loading ${plugin.manifest.name}:`, e);
        plugin.error = { message: `[Main] ${e.message}`, stack: e.stack };
    }

    onBrowserWindowCreating(target, argArray, newTarget) {
        for (const slug in this.#exports) {
            const plugin = this.#exports[slug];
            plugin.onBrowserWindowCreating?.(target, argArray, newTarget);
        }
    }

    onBrowserWindowCreated(window) {
        for (const slug in this.#exports) {
            const plugin = this.#exports[slug];
            plugin.onBrowserWindowCreated?.(window);
        }
    }

    onLogin(uid) {
        for (const slug in this.#exports) {
            const plugin = this.#exports[slug];
            plugin.onLogin?.(uid);
        }
    }
};


exports.loader = new MainLoader().init();