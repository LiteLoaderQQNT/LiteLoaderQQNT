exports.Runtime = class {

    static #plugins = new Map();

    static registerPlugin(plugin, exports) {
        this.#plugins.set(plugin, exports);
    }

    static unregisterPlugin(plugin) {
        this.#plugins.delete(plugin);
    }

    static triggerHooks(name, args) {
        for (const [plugin, exports] of this.#plugins) {
            try { exports[name]?.(...(typeof args == "function" ? args(plugin) : args)); }
            catch (error) { plugin.error = { message: `[Main] ${error.message}`, stack: error.stack }; }
        }
    }

}