import { readdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { output, qq_install_dir, relativeRootPath } from "./base.js";

class PluginLoader {
    // 插件列表
    #plugins = {};

    constructor() {
        output("Start loading plugins.");

        // 插件目录插件名
        let builtin_dirnames = [];
        let plugin_dirnames = [];

        // 内置的核心插件
        try {
            builtin_dirnames = readdirSync(
                LiteLoader.path.builtins,
                "utf-8"
            );
        }
        catch (error) {
            output("The builtins directory does not exist.");
        }

        // 外置第三方插件
        try {
            plugin_dirnames = readdirSync(LiteLoader.path.plugins, "utf-8");
        }
        catch (error) {
            output("The plugins directory does not exist.");
        }

        // 加载插件
        try {
            // 获取单个插件目录名
            for (const builtin_dirname of builtin_dirnames) {
                const plugin_path = join(LiteLoader.path.builtins, builtin_dirname);
                this.#loadPlugin(plugin_path);
            }
            for (const plugin_dirname of plugin_dirnames) {
                const plugin_path = join(LiteLoader.path.plugins, plugin_dirname);
                this.#loadPlugin(plugin_path);
            }
        }
        catch (error) {
            output("Plugins loaded with error: ", error);
        }

        // 插件加载完成输出
        const plugins_length = Object.keys(this.#plugins).length;
        const not_plugins_message = "No plugins to be loaded.";
        const has_plugins_message = `Done! ${plugins_length} plugins loaded!`;
        output(plugins_length == 0 ? not_plugins_message : has_plugins_message);

        // 合并 Preload
        this.#preprocessing();
    }

    //对preload脚本进行预处理，合并
    #preprocessing() {
        output("Preprocessing plugins' preloads...");

        const code_block = (title, content) => {
            let str = "";
            str += `\n// ${title}`;
            str += "\n{\n";
            str += content;
            str += "\n}";
            return str;
        }

        // 加载hook.js、index.js、loader.js
        const hook = readFileSync(join(LiteLoader.path.root, "src/preload/hook.js"), "utf-8");
        const api = readFileSync(join(LiteLoader.path.root, "src/preload/index.js"), "utf-8");
        const loader = readFileSync(join(LiteLoader.path.root, "src/renderer/index.js"), "utf-8");

        let preloadContents = "";
        preloadContents += "// LiteLoaderQQNT 自动合并的 Preload 文件，请勿修改，否则可能会被覆盖。\n";
        preloadContents += `// 生成时间：${new Date().toLocaleString()} \n`;
        preloadContents += code_block("原始 preload.js", hook);
        preloadContents += code_block("LiteLoader 对象", api);
        preloadContents += code_block("渲染进程 Loader", loader);

        // 遍历插件
        for (const [slug, plugin] of Object.entries(this.#plugins)) {
            const preload_path = plugin.manifest.injects?.preload;
            if (preload_path) {
                const preload = readFileSync(join(plugin.path.plugin, preload_path), "utf-8");
                preloadContents += code_block(`插件：${plugin.manifest.name}`, preload);
            }
        }

        // 计算 plugin-preloads.js 路径
        const winBasePath = join(qq_install_dir, "/resources/app/versions/", LiteLoader.versions.qqnt);
        const unixBasePath = join(relativeRootPath(qq_install_dir), LiteLoader.path.profile);
        const basePath = LiteLoader.os.platform == "win32" ? winBasePath : unixBasePath;
        const dest = join(basePath, "plugin-preloads.js");

        writeFileSync(dest, preloadContents, { encoding: "utf-8" });
        output("Preprocessing plugins' preloads done!");
    }

    // 获取插件manifest内容
    #getManifest(plugin_path) {
        const file_path = join(plugin_path, "manifest.json");
        // 尝试获取插件manifest内容
        try {
            const data = readFileSync(file_path, "utf-8");
            return JSON.parse(data);
        }
        catch (err) {
            // 出错就返回null，没有获取到
            return null;
        }
    }

    // 加载插件
    #loadPlugin(plugin_path) {
        const manifest = this.#getManifest(plugin_path);

        // 没有manifest, 不是插件/插件损坏
        if (!manifest) {
            return;
        }

        // manifest与路径
        const { manifest_version, slug, name } = manifest;
        const plugin_data_path = join(LiteLoader.path.plugins_data, slug);
        const plugin_cache_path = join(LiteLoader.path.plugins_cache, slug);
        const main_path = manifest.injects?.main ?? "";
        const plugin_disabled = LiteLoader.config?.disabled?.includes(slug) ?? false;

        // 保存到插件列表
        this.#plugins[slug] = {
            manifest: manifest,
            path: {
                plugin: plugin_path,
                data: plugin_data_path,
                cache: plugin_cache_path
            },
            exports: main_path,
            disabled: plugin_disabled
        };

        // 没有渲染进程以及禁用
        if (!main_path || plugin_disabled) {
            delete this.#plugins[slug].exports;
        }
        else {
            const file_path = join(plugin_path, main_path);
            this.#plugins[slug].exports = require(file_path);
        }

        // 禁用不兼容插件
        if (Number(manifest_version) != 3) {
            output("Found incompatible plugin:", name);
            delete this.#plugins[slug];
            return;
        }
        else {
            output("Found plugin:", name);
        }

        // 放到LiteLoader对象上
        LiteLoader.plugins[slug] = { ...this.#plugins[slug] }
        delete LiteLoader.plugins[slug].exports;
    }

    onLoad() {
        // 加载插件
        for (const [slug, plugin] of Object.entries(this.#plugins)) {
            plugin.exports?.onLoad?.(plugin);
        }
    }

    onBrowserWindowCreated(window) {
        // 加载插件
        for (const [slug, plugin] of Object.entries(this.#plugins)) {
            plugin.exports?.onBrowserWindowCreated?.(window, plugin);
        }
        // 注入Preload
        const preloads = new Set([
            ...window.webContents.session.getPreloads(),
            join(LiteLoader.path.profile, "plugin-preloads.js"),
        ]);
        // 加载Set中的Preload脚本
        window.webContents.session.setPreloads([...preloads]);
    }
}

export default {
    PluginLoader
};
