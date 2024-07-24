exports.MainLoader = class {

    #exports = {};

    init() {
        // 加载插件
        for (const [slug, plugin] of Object.entries(LiteLoader.plugins)) {
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
        for (const [slug, plugin] of Object.entries(this.#exports)) {
            if (plugin?.onBrowserWindowCreated) {
                plugin.onBrowserWindowCreated(window);
            }
        }
    }

    onLogin(uid) {
        for (const [slug, plugin] of Object.entries(this.#exports)) {
            if (plugin?.onLogin) {
                plugin.onLogin(uid);
            }
        }
    }

}