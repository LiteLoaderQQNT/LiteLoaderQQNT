import "./components/index.js";
import "./easter_eggs/index.js";
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
                settingInterface.addNavItem(LiteLoader.plugins[slug], view);
                plugin.onSettingWindowCreated(view);
            }
        }
    }

}).init();


// 注入设置界面
async function findSettingTabNavBar() {
    const settingInterface = new SettingInterface();
    const observer = async (_, observer) => {
        if (document.querySelector(".setting-tab .nav-bar")) {
            loader.onSettingWindowCreated(settingInterface);
            observer?.disconnect?.();
            return true;
        }
        return false;
    }
    if (!await observer()) {
        new MutationObserver(observer).observe(document, {
            subtree: true,
            attributes: false,
            childList: true
        });
    }
}


// 监听页面变化
function currentPage() {
    return window.location.hash.slice(2).split("/")[0];
}
const pagePromise = new Promise((resolve, reject) => {
    if (currentPage() !== "blank") {
        resolve(currentPage());
    } else {
        navigation.addEventListener("navigatesuccess", () => {
            resolve(currentPage());
        }, { once: true });
    }
});
pagePromise.then(page => {
    if (page === "setting") {
        findSettingTabNavBar();
    }
});
