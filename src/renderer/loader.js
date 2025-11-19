import { topologicalSort } from "../common/utils/sort.mjs"

class RendererLoader {
    #exports = {};

    async init() {
        await this.#waitForPreload();
        await this.#loadPlugins();
        return this;
    }

    async #waitForPreload() {
        if (window.LiteLoaderPreloadErrors) return;

        await new Promise(resolve => {
            const check = () => {
                if (window.LiteLoaderPreloadErrors) {
                    resolve();
                } else {
                    setTimeout(check, 10);
                }
            };
            check();
        });
    }

    async #loadPlugins() {
        const sortedPlugins = topologicalSort(Object.keys(LiteLoader.plugins));

        for (const slug of sortedPlugins) {
            const plugin = LiteLoader.plugins[slug];

            // 跳过禁用或不兼容的插件
            if (plugin.disabled || plugin.incompatible) {
                continue;
            }

            // 检查错误
            const error = plugin.error || window.LiteLoaderPreloadErrors[slug];
            if (error) {
                this.#exports[slug] = { error };
                continue;
            }

            // 加载 renderer 脚本
            if (plugin.path.injects.renderer) {
                try {
                    this.#exports[slug] = await import(`local:///${plugin.path.injects.renderer}`);
                } catch (e) {
                    this.#exports[slug] = {
                        error: {
                            message: `[Renderer] ${e.message}`,
                            stack: e.stack
                        }
                    };
                }
            }
        }
    }

    onSettingWindowCreated(settingInterface) {
        for (const slug in this.#exports) {
            const plugin = this.#exports[slug];
            const view = settingInterface.add(LiteLoader.plugins[slug]);
            try {
                if (plugin.error) throw plugin.error;
                plugin.onSettingWindowCreated?.(view);
            } catch (e) {
                settingInterface.createErrorView(e, slug, view);
            }
        }
    }

    onVueComponentMount(component) {
        for (const slug in this.#exports) {
            const plugin = this.#exports[slug];
            plugin.onVueComponentMount?.(component);
        }
    }

    onVueComponentUnmount(component) {
        for (const slug in this.#exports) {
            const plugin = this.#exports[slug];
            plugin.onVueComponentUnmount?.(component);
        }
    }
}

export const loader = await new RendererLoader().init();