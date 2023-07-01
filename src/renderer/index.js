(async () => {
    const loader_path = `file:///${betterQQNT.path.root}/src/renderer/loader.js`;
    const { PluginLoader } = await import(loader_path);
    const plugin_loader = new PluginLoader();

    // 初始化
    await plugin_loader.init();

    // 加载插件
    plugin_loader.onLoad();

    // 监听页面变化
    navigation.addEventListener("navigatesuccess", function func(event) {
        const url = event.target.currentEntry.url;
        // 检测是否为设置界面
        if (url.includes("/index.html") && url.includes("#/setting")) {
            // 移除监听
            navigation.removeEventListener("navigatesuccess", func);
            const interval = setInterval(() => {
                if (document.querySelector(".setting-tab .nav-bar")) {
                    clearInterval(interval);
                    plugin_loader.onConfigView();
                }
            }, 100);
        }
    });
})();