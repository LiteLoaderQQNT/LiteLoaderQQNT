const { contextBridge } = require("electron");


(new class {

    async init() {
        const preloadErrors = {}
        for (const slug in LiteLoader.plugins) {
            const plugin = LiteLoader.plugins[slug];
            if (plugin.disabled || plugin.incompatible || plugin.error) {
                continue;
            }
            if (plugin.path.injects.preload) {
                try {
                    runPreloadScript(await (await fetch(`local:///${plugin.path.injects.preload}`)).text());
                }
                catch (e) {
                    preloadErrors[slug] = { message: `[Preload] ${e.message}`, stack: e.stack };
                }
            }
        }
        contextBridge.exposeInMainWorld("LiteLoaderPreloadErrors", preloadErrors);
        return this;
    }

}).init();