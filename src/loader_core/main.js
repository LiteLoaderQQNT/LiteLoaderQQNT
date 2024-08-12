exports.MainLoader = class {

    #exports = {};

    init() {
        // 加载插件
        for (const slug in LiteLoader.plugins) {
            const plugin = LiteLoader.plugins[slug];
            if (plugin.disabled || plugin.incompatible) {
                continue;
            }
            if (plugin.path.injects.main) {
                try {
                    this.#exports[slug] = require(plugin.path.injects.main);
                }
                catch (e) {
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