/**
 * 拓扑排序 - 根据依赖关系排序插件
 * @param {string[]} dependencies - 需要排序的插件slug数组
 * @returns {string[]} 排序后的插件slug数组
 */
function topologicalSort(dependencies) {
    const sorted = [];
    const visited = new Set();
    const visiting = new Set();
    const visit = (slug) => {
        if (visited.has(slug)) return;
        if (visiting.has(slug)) return;
        const plugin = LiteLoader.plugins[slug];
        if (!plugin) return;
        visiting.add(slug);
        const deps = plugin.manifest?.dependencies || [];
        deps.forEach(depSlug => visit(depSlug));
        visiting.delete(slug);
        visited.add(slug);
        sorted.push(slug);
    };
    dependencies.forEach(slug => visit(slug));
    return sorted;
}

export { topologicalSort };