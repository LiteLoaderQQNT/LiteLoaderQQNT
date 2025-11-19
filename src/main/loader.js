const { pathToFileURL } = require("url");

/**
 * 控制台错误输出
 * @param {...any} args - 错误参数
 */
function error(...args) {
    console.error("\x1b[31m%s\x1b[0m", "[LiteLoader]", ...args);
}

/**
 * 拓扑排序 - 根据依赖关系排序插件
 * @param {string[]} dependencies - 插件slug数组
 * @returns {string[]} 排序后的插件slug数组
 */
function topologicalSort(dependencies) {
    const sorted = [];
    const visited = new Set();
    const visit = (slug) => {
        if (visited.has(slug)) return;
        visited.add(slug);
        const plugin = LiteLoader.plugins[slug];
        plugin.manifest.dependencies?.forEach(depSlug => visit(depSlug));
        sorted.push(slug);
    };
    dependencies.forEach(slug => visit(slug));
    return sorted;
}


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
        error(`Error loading ${plugin.manifest.name}:`, e);
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