const { contextBridge } = require("electron");
const { topologicalSort } = require("../common/utils/sort.cjs");


class PreloadLoader {
    init() {
        const preloadErrors = {};
        const sortedPlugins = topologicalSort(Object.keys(LiteLoader.plugins));

        for (const slug of sortedPlugins) {
            const plugin = LiteLoader.plugins[slug];

            // 跳过无效插件
            if (
                plugin.disabled ||
                plugin.incompatible ||
                plugin.error ||
                !plugin.path.injects.preload
            ) continue;

            try {
                require(plugin.path.injects.preload);
            } catch (e) {
                preloadErrors[slug] = {
                    message: `[Preload] ${e.message}`,
                    stack: e.stack
                };
            }
        }

        contextBridge.exposeInMainWorld("LiteLoaderPreloadErrors", preloadErrors);
        return this;
    }
}

exports.loader = new PreloadLoader().init();