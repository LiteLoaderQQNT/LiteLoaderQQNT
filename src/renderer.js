import { SettingInterface } from "./setting/renderer.js";


const loader = await (new class {

    #exports = {};

    async init() {
        // 加载插件
        for (const [slug, plugin] of Object.entries(LiteLoader.plugins)) {
            if (plugin.disabled || plugin.incompatible) {
                continue;
            }
            if (plugin.path.injects.renderer) {
                this.#exports[slug] = await import(`local:///${plugin.path.injects.renderer}`);
            }
        }
        return this;
    }

    onSettingWindowCreated(settingInterface) {
        for (const [slug, plugin] of Object.entries(this.#exports)) {
            if (plugin?.onSettingWindowCreated) {
                const view = settingInterface.getSettingView(slug);
                settingInterface.addNavItem(LiteLoader.plugins[slug].manifest.name, view);
                plugin.onSettingWindowCreated(view);
            }
        }
    }

}).init();


// 注入设置界面
function settingInterfaceInit() {
    const settingInterface = new SettingInterface();
    if (document.querySelector(".setting-tab .nav-bar")) {
        loader.onSettingWindowCreated(settingInterface);
    }
    else {
        new MutationObserver((_, observe) => {
            if (document.querySelector(".setting-tab .nav-bar")) {
                loader.onSettingWindowCreated(settingInterface);
                observe.disconnect();
            }
        }).observe(document.querySelector("#app"), {
            subtree: true,
            attributes: false,
            childList: true
        });
    }
}


// 监听页面变化
if (location.href.includes("/index.html") && location.href.includes("#/setting")) {
    settingInterfaceInit();
}
else {
    navigation.addEventListener("navigatesuccess", function func(event) {
        const url = event.target.currentEntry.url;
        if (url.includes("/index.html") && url.includes("#/setting")) {
            navigation.removeEventListener("navigatesuccess", func);
            settingInterfaceInit();
        }
    });
}
