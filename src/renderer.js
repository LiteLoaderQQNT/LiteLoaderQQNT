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

            if (plugin.error) {
                this.#exports[slug] = { error: plugin.error };
                continue
            }

            if (plugin.path.injects.renderer) {
                try {
                    this.#exports[slug] = await import(`local:///${plugin.path.injects.renderer}`);
                }
                catch (e) {
                    this.#exports[slug] = { error: { message: `[Renderer] ${e.message}`, stack: e.stack } };
                }
            }
        }
        return this;
    }

    async onSettingWindowCreated(settingInterface) {
        const preloadError = JSON.parse(document.getElementById("LL_PRELOAD_ERRORS")?.textContent || "{}");

        for (const [slug, plugin] of Object.entries(this.#exports)) {
            if (plugin?.onSettingWindowCreated || plugin?.error) {
                const view = await settingInterface.add(LiteLoader.plugins[slug]);
                (async () => {
                    try {
                        if (preloadError[slug]) throw preloadError[slug];
                        if (plugin.error) throw plugin.error;
                        await plugin.onSettingWindowCreated(view);
                    }
                    catch (e) {
                        this.#createErrorView(e, slug, view);
                    }
                })();
            }
        }
    }

    #createErrorView(error, slug, view) {
        const navItem = document.querySelector(`.nav-item[data-slug="${slug}"]`);
        navItem.classList.add("error");
        navItem.title = "插件加载出错";

        view.classList.add("error");
        view.innerHTML =
            `<h2>🙀 插件加载出错！</h2>
            <p>可能是版本不兼容、Bug、冲突或文件损坏等导致的</p>
            🐞 错误信息
            <textarea readonly rows="8">${error.message}\n${error.stack}</textarea>
            🧩 插件信息
            <textarea readonly rows="12">${JSON.stringify(LiteLoader.plugins[slug])}</textarea>
            <textarea readonly rows="3">${JSON.stringify(Object.keys(LiteLoader.plugins))}</textarea>
            🖥️ 环境信息
            <textarea readonly rows="3">${JSON.stringify({ ...LiteLoader.versions, ...LiteLoader.os })}</textarea>
            <small>* 此页面仅在插件加载出现问题出现，不代表插件本身有设置页</small>`; // 没必要格式化json，方便截图
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