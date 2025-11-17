const { contextBridge } = require("electron");

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

(new class PreloadLoader {
    async init() {
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
                const scriptPath = `local:///${plugin.path.injects.preload}`;
                const scriptContent = readFileRequestSync(scriptPath);
                runPreloadScript(scriptContent);
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
}).init();