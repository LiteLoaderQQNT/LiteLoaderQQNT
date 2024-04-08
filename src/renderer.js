import "./components/renderer.js";
import "./easter_eggs/renderer.js";
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
                settingInterface.add(LiteLoader.plugins[slug]).then(view => {
                    plugin.onSettingWindowCreated(view);
                });
            }
        }
    }

}).init();


// 注入设置界面
function findSettingTabNavBar() {
    const settingInterface = new SettingInterface();
    const observer = (_, observer) => {
        if (document.querySelector(".setting-tab .nav-bar")) {
            loader.onSettingWindowCreated(settingInterface);
            observer?.disconnect?.();
            return true;
        }
        return false;
    }
    if (!observer()) {
        new MutationObserver(observer).observe(document.body, {
            subtree: true,
            attributes: false,
            childList: true
        });
    }
}


// 监听页面变化
async function watchURLHash(callback) {
    if (!location.hash.includes("#/blank")) {
        callback(location.hash);
    }
    else {
        navigation.addEventListener("navigatesuccess", () => {
            callback(location.hash)
        }, { once: true });
    }
}


// 指定页面触发彩蛋
watchURLHash((currentHash) => {
    if (currentHash.includes("#/setting")) {
        findSettingTabNavBar();
    }
});