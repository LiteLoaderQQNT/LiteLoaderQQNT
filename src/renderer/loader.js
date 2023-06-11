export class PluginLoader {
    constructor() {
        this.plugin_paths = {};
        this.plugins = {}

        // 获取插件注入渲染进程的代码
        for (const key in betterQQNT.plugins) {
            const plugin = betterQQNT.plugins[key];
            const plugin_path = plugin.path.plugin;
            const renderer_path_name = plugin.manifest.injects?.renderer;
            if (renderer_path_name) {
                const path = `/${plugin_path}/${renderer_path_name}`;
                this.plugin_paths[key] = path;
            }
        }
    }


    // 加载插件
    async loadPlugins() {
        for (const key in this.plugin_paths) {
            const plugin_path = this.plugin_paths[key];
            const plugin = await import(plugin_path);
            this.plugins[key] = plugin;
            plugin?.onLoad?.();
        }
    }


    // 初始化配置界面
    async initConfig() {
        const config_path = `/${betterQQNT.path.root}/src/renderer/config.js`;
        const { PluginConfigView } = await import(config_path);
        const plugin_config_view = new PluginConfigView();

        // 分割线
        plugin_config_view.createDividingLine();

        // 遍历所有插件
        for (const key in betterQQNT.plugins) {
            const plugin = betterQQNT.plugins[key];
            const name = plugin.manifest.name;
            const view = document.createElement("div");
            plugin_config_view.createNavItme(name, view);
            this.plugins[key]?.onConfigView?.(view);
        }
    }
}