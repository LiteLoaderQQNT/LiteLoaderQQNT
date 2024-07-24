export class RendererLoader {

    #exports = {};

    async init() {
        // 确保preload加载完毕
        if (!window.LiteLoaderPreloadErrors) {
            await new Promise(resolve => {
                const check = () => (window.LiteLoaderPreloadErrors ? resolve() : setTimeout(check));
                check();
            });
        }

        // 加载插件
        for (const [slug, plugin] of Object.entries(LiteLoader.plugins)) {
            if (plugin.disabled || plugin.incompatible) {
                continue;
            }

            const error = plugin.error || LiteLoaderPreloadErrors[slug];
            if (error) {
                this.#exports[slug] = { error };
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
        for (const [slug, plugin] of Object.entries(this.#exports)) {
            if (plugin?.onSettingWindowCreated || plugin?.error) {
                const view = await settingInterface.add(LiteLoader.plugins[slug]);
                (async () => {
                    try {
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

    onVueComponentMount(component) {
        for (const [slug, plugin] of Object.entries(this.#exports)) {
            if (plugin?.onVueComponentMount) {
                plugin.onVueComponentMount(component);
            }
        }
    }

    onVueComponentUnmount(component) {
        for (const [slug, plugin] of Object.entries(this.#exports)) {
            if (plugin?.onVueComponentUnmount) {
                plugin.onVueComponentUnmount(component);
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

}