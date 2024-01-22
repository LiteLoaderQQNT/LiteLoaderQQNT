import "./components/section.js";
import "./components/panel.js";
import "./components/list.js";
import "./components/item.js";
import "./components/select.js";
import "./components/option.js";
import "./components/switch.js";
import "./components/button.js";
import "./components/text.js";
import "./components/divider.js";

import { SettingInterface } from "./setting/index.js";


const loader = new class {


    #exports = {};


    async init() {
        for (const [slug, plugin] of Object.entries(LiteLoader.plugins)) {
            if (plugin.disabled || plugin.incompatible) {
                continue;
            }
            if (plugin.path.injects.renderer) {
                this.#exports[slug] = await import(`local:///${plugin.path.injects.renderer}`);
            }
        }
    }


    onSettingWindowCreated(settingInterface) {
        for (const [slug, plugin] of Object.entries(LiteLoader.plugins)) {
            if (plugin.disabled || plugin.incompatible) {
                continue;
            }
            const view = settingInterface.getSettingView(slug);
            settingInterface.addNavItme(plugin.manifest.name, this.#exports?.[slug]?.onSettingWindowCreated ? view : null);
            this.#exports?.[slug]?.onSettingWindowCreated?.(view);
        }
    }


};


await loader.init();


// 监听页面变化
if (location.href.includes("/index.html") && location.href.includes("#/setting")) {
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
else {
    navigation.addEventListener("navigatesuccess", function func(event) {
        const url = event.target.currentEntry.url;
        if (url.includes("/index.html") && url.includes("#/setting")) {
            navigation.removeEventListener("navigatesuccess", func);
            const settingInterface = new SettingInterface();
            const interval = setInterval(() => {
                if (document.querySelector(".setting-tab .nav-bar")) {
                    clearInterval(interval);
                    loader.onSettingWindowCreated(settingInterface);
                }
            }, 100);
        }
    });
}
