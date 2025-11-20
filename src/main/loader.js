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

            try {
                this.#exports[slug] = require(plugin.path.injects.main);
            } catch (e) {
                Log.error(`Error loading ${plugin.manifest.name}:`, e);
                plugin.error = { message: `[Main] ${e.message}`, stack: e.stack };
            }
        }

        return this;
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