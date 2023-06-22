export class PluginLoader {
    #PluginConfigView = null;
    #plugins = {};


    async init() {
        // 导入PluginConfigView
        const plugin_config_view_path = `/${betterQQNT.path.root}/src/renderer/config.js`;
        const { PluginConfigView } = await import(plugin_config_view_path);
        this.#PluginConfigView = PluginConfigView;

        // 导入BetterQQNT配置界面
        const betterqqnt_config_path = `/${betterQQNT.path.root}/src/renderer/view/index.js`;
        this.#plugins["better_qqnt"] = await import(betterqqnt_config_path);

        // 获取插件注入渲染进程的代码
        for (const [slug, plugin] of Object.entries(betterQQNT.plugins)) {
            const plugin_path = plugin.path.plugin;
            const renderer_path_name = plugin.manifest.injects?.renderer;
            if (renderer_path_name) {
                const path = `/${plugin_path}/${renderer_path_name}`;
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

        // 加上BetterQQNT
        const plugins = {
            better_qqnt: {
                manifest: {
                    name: "BetterQQNT"
                }
            },
            ...betterQQNT.plugins
        }

        // 遍历所有插件
        for (const [slug, plugin] of Object.entries(plugins)) {
            const name = plugin.manifest.name;
            const view = document.createElement("div");
            view.classList.add(slug);
            // 如果没有onConfigView函数，就将按钮禁用
            const onConfigView = this.#plugins?.[slug]?.onConfigView;
            plugin_config_view.createNavItme(name, view, onConfigView);
            if (onConfigView) {
                onConfigView(view);
            }
        }
    }
}