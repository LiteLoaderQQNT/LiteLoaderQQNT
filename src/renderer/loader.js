(async () => {
    // 获取插件注入渲染进程的代码
    for (const key in betterQQNT.plugins) {
        const value = betterQQNT.plugins[key];

        const plugin_path = value.path.plugin;
        const renderer_path_name = value.manifest.injects?.renderer;
        if (!renderer_path_name) {
            continue;
        }

        // 导入
        const path = `/${plugin_path}/${renderer_path_name}`;
        const plugin = await import(path);
        plugin?.onLoad();
    }
})();
