const index = async () => {
    const loader_path = `llqqnt://local-file/${LiteLoader.path.root}/src/renderer/loader.js`;
    const { PluginLoader } = await import(loader_path);
    const plugin_loader = new PluginLoader();

    // 初始化
    await plugin_loader.init();

    // 加载插件
    await plugin_loader.onLoad();

    // 监听页面变化
    const url = location.href;
    if (url.includes("/index.html") && url.includes("#/setting")) {
        // 判断页面是否加载完成
        if (document.querySelector(".setting-tab .nav-bar")) {
            plugin_loader.onConfigView();
        } else {
            // 监听页面变化
            new MutationObserver((_, observe) => {
                if (document.querySelector(".setting-tab .nav-bar")) {
                    plugin_loader.onConfigView();
                    observe.disconnect();
                }
            }).observe(document.querySelector("#app"), {
                subtree: true,
                attributes: false,
                childList: true,
            });
        }
    } else {
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
    }
};

// 注入代码
window.addEventListener("DOMContentLoaded", () => {
    const script = document.createElement("script");
    script.textContent = `(${index.toString()})()`;
    document.head.appendChild(script);
});
