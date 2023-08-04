export class PluginLoader {
    #PluginConfigView = null;
    #plugins = {};


    async init() {
        // 导入PluginConfigView
        const plugin_config_view_path = `llqqnt://local-file/${LiteLoader.path.root}/src/renderer/config.js`;
        const { PluginConfigView } = await import(plugin_config_view_path);
        this.#PluginConfigView = PluginConfigView;

        // 获取插件注入渲染进程的代码
        for (const [slug, plugin] of Object.entries(LiteLoader.plugins)) {
            if (plugin.disabled) {
                continue;
            }
            const plugin_path = plugin.path.plugin;
            const renderer_path_name = plugin.manifest.injects?.renderer;
            if (renderer_path_name) {
                const path = `llqqnt://local-file/${plugin_path}/${renderer_path_name}`;
                const { onLoad, onConfigView } = await import(path);
                this.#plugins[slug] = {
                    onLoad,
                    onConfigView
                };
            }
        }
    }


    // 加载插件
    onLoad() {
        for (const [slug, plugin] of Object.entries(this.#plugins)) {
            plugin?.onLoad?.();
        }
    }


    // 初始化配置界面
    onConfigView() {
        const plugin_config_view = new this.#PluginConfigView();

        // 分割线
        plugin_config_view.createDividingLine();

        // 遍历所有插件
        for (const [slug, plugin] of Object.entries(LiteLoader.plugins)) {
            const onConfigView = this.#plugins?.[slug]?.onConfigView;
            // 隐藏没有配置界面的插件
            if (!onConfigView) {
                continue;
            }
            const name = plugin.manifest.name;
            const view = document.createElement("div");
            view.classList.add(slug, "plugin-config-view")
            plugin_config_view.createNavItme(name, view, onConfigView);
            onConfigView(view);
        }
    }
}
