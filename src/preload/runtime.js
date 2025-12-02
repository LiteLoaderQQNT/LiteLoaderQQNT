export class Runtime {

    static #plugins = new Map();

    static registerPlugin(plugin, exports) {
        this.#plugins.set(plugin, exports);
    }

    static triggerHooks(name, args) {
        for (const [plugin, exports] of this.#plugins) {
            try { exports[name]?.(...(typeof args == "function" ? args(plugin) : args)); }
            catch (error) { console.log(`[Preload] [${plugin.manifest.slug}] [${name}]: `, error); }
        }
    }

}