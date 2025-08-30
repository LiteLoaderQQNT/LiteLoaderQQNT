const error = (...args) => console.error("\x1b[32m%s\x1b[0m", "[LiteLoader]", ...args);

function topologicalSort(dependencies) {
    const sorted = [];
    const visited = new Set();
    const visit = (slug) => {
        if (visited.has(slug)) return;
        visited.add(slug);
        const plugin = LiteLoader.plugins[slug];
        plugin.manifest.dependencies?.forEach(depSlug => visit(depSlug));
        sorted.push(slug);
    }
    dependencies.forEach(slug => visit(slug));
    return sorted;
}


exports.MainLoader = class {

    #exports = {};

    init() {
        // 加载插件
        for (const slug of topologicalSort(Object.keys(LiteLoader.plugins))) {
            const plugin = LiteLoader.plugins[slug];
            if (plugin.disabled || plugin.incompatible) {
                continue;
            }
            if (plugin.path.injects.main) {
                try {
                    if (plugin.manifest.esm) {
                        this.#exports[slug] = {};
                        // FIXME: Async and delayed loading might cause errors for dependencies
                        // TODO: Proper escaping?
                        import("file:///" + plugin.path.injects.main).then((exported) => {
                            this.#exports[slug] = exported;
                        }).catch((e) => {
                            error(`Error loading ${plugin.manifest.name}:`, e);
                            plugin.error = { message: `[Main] ${e.message}`, stack: e.stack };
                        });
                    } else {
                        this.#exports[slug] = require(plugin.path.injects.main);
                    }
                }
                catch (e) {
                    error(`Error loading ${plugin.manifest.name}:`, e);
                    plugin.error = { message: `[Main] ${e.message}`, stack: e.stack };
                }
            }
        }
        return this;
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

}
