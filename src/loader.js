const fs = require("fs");
const path = require("path");
const base = require("./base.js");



// 获取插件清单
function getPluginManifest(plugin_path) {
    const file_path = path.join(plugin_path, "manifest.json");
    try {
        const data = fs.readFileSync(file_path, { encoding: "utf-8" });
        const manifest = JSON.parse(data);
        return manifest;
    } catch (err) {
        return undefined;
    }
}


// 获取插件列表
function getPluginList(func) {
    fs.readdir(base.BETTERQQNT_PLUGINS, (err, files) => {
        if (err) {
            fs.mkdir(base.BETTERQQNT_PLUGINS, err => {
                if (err) throw err;
                getPluginPath.call(this);
            });
            throw err;
        }
        // 继续
        const plugins = {};
        for (const file of files) {
            const plugin_path = path.join(base.BETTERQQNT_PLUGINS, file);
            const manifest = getPluginManifest(plugin_path);
            if (!manifest) break;
            const slug = manifest["slug"];
            plugins[slug] = {
                manifest: manifest,
                pluginPath: plugin_path,
            }
            base.output("Found Plugin:", manifest["name"]);
        }
        func(plugins);
    });
}


class BetterQQNTLoader {
    constructor(webContents) {
        this.webContents = webContents;
        const code = `
        // 挂载API到全局
        window["betterQQNT"] = {};

        // 路径
        betterQQNT["path"] = {
            root: "${base.BETTERQQNT_PROFILE}",
            config: "${base.BETTERQQNT_CONFIG}",
            plugins: "${base.BETTERQQNT_PLUGINS}",
            plugins_dev: "${base.BETTERQQNT_PLUGINS_DEV}",
            plugins_data: "${base.BETTERQQNT_PLUGINS_DATA}",
            plugins_cache: "${base.BETTERQQNT_PLUGINS_CACHE}"
        }
        `;
        this.webContents.executeJavaScript(`(() => { ${code} })()`, true);
    }

    // 初始化加载插件
    loadPlugins() {
        getPluginList(plugins => {
            const code = `betterQQNT["plugins"] = ${JSON.stringify(plugins)}`
            this.webContents.executeJavaScript(code);
            // 继续
            for (const key in plugins) {
                const value = plugins[key];
                const pluginPath = value.pluginPath;
                // 主进程
                const filename = value.manifest.inject;
                const filepath = path.join(pluginPath, filename);
                const init = require(filepath);
                if (typeof init == "function") {
                    init(this.webContents);
                }
                base.output(value.manifest["name"], "Plugin Is Loaded On The Main.");
            }
        });
    }
}


module.exports = {
    BetterQQNTLoader
}
