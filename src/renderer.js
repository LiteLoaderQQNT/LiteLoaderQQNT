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

    async onSettingWindowCreated(settingInterface) {
        for (const [slug, plugin] of Object.entries(this.#exports)) {
            if (plugin?.onSettingWindowCreated) {
                const view = await settingInterface.add(LiteLoader.plugins[slug]);
                plugin.onSettingWindowCreated(view);
            }
        }
    }

}).init();


// 寻找指定元素
async function findElement(selector, callback) {
    const observer = (_, observer) => {
        const element = document.querySelector(selector);
        if (element) {
            callback(element);
            observer?.disconnect?.();
            return true;
        }
        return false;
    }
    if (!observer()) {
        new MutationObserver(observer).observe(document, {
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


// 加载彩蛋
async function loadSettingInterface(currentHash) {
    if (currentHash.includes("#/setting")) {
        const settingInterface = new SettingInterface();
        findElement(".setting-tab .nav-bar", async () => {
            await settingInterface.SettingInit();
            await loader.onSettingWindowCreated(settingInterface);
        });
    }
}


// 指定页面触发
watchURLHash(loadSettingInterface);