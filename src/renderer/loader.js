(async () => {
    const plugins = {}


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


    async function initConfig() {
        // 导入PluginManager
        const path = `/${betterQQNT.path.root}/src/renderer/index.js`;
        const PluginConfigViewManager = await import(path);
        const plugin_config_view_manager = PluginConfigViewManager.init();
        // 遍历插件
        for (const key in betterQQNT.plugins) {
            const name = betterQQNT.plugins[key].manifest.name;
            const view = plugins[key]?.onConfigView() ?? null;
            // 添加
            plugin_config_view_manager.createNavItme(name, view);
        }
    }


    // 监听页面变化
    navigation.addEventListener("navigatesuccess", async function func(event) {
        const url = event.target.currentEntry.url;
        // 检测是否为设置界面
        if (url.includes("/index.html") && url.includes("#/setting")) {
            // 移除监听
            navigation.removeEventListener("navigatesuccess", func);
            initConfig();
        }
    });
})();
