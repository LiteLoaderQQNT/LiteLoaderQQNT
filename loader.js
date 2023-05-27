const fs = require("fs");
const path = require("path");
const api = require("./api/server.js");
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
        function injectScript(base64) {
            const code = decodeURIComponent(atob(base64));
            const element = document.createElement("script");
            element.defer = "defer";
            element.textContent = code;
            document.head.appendChild(element);
        }
        this.webContents.executeJavaScript(injectScript.toString(), true);
    }

    // 注入JS代码到渲染进程
    #injectScript(code) {
        const buffer = new Buffer(encodeURIComponent(code));
        const base64 = buffer.toString("base64")
        const text = `injectScript("${base64}");`;
        this.webContents.executeJavaScript(text, true);
    }

    // 初始化加载API到渲染进程
    loadAPI() {
        const file_path = path.join(__dirname, "./api/client.js");
        const data = fs.readFileSync(file_path, { encoding: "utf-8" });
        const code = `
        // 挂载API到全局
        window["betterQQNT"] = {};

        // 路径
        betterQQNT["path"] = {
            root: "${base.BETTERQQNT_PROFILE}",
            plugins: "${base.BETTERQQNT_PLUGINS}",
            plugins_dev: "${base.BETTERQQNT_PLUGINS_DEV}",
            plugins_data: "${base.BETTERQQNT_PLUGINS_DATA}",
            plugins_cache: "${base.BETTERQQNT_PLUGINS_CACHE}"
        }

        // 网络
        betterQQNT["net"] = {
            host: String("${api.BetterQQNT_API_HOST}"),
            port: Number("${api.BetterQQNT_API_PORT}")
        }

        ${data}
        `;
        this.#injectScript(code);
    }

    // 初始化从渲染进程加载代码
    loadRendererLoader() {

    }

    // 初始化加载插件
    loadPlugins() {
        getPluginList(plugins => {
            const code = `betterQQNT["plugins"] = ${JSON.stringify(plugins)}`
            this.#injectScript(code);
            // 继续
            for (const key in plugins) {
                const value = plugins[key];
                const pluginPath = value.pluginPath;
                // 主进程
                const main = value.manifest.injects.main;
                main.forEach(file_name => {
                    const file_path = path.join(pluginPath, file_name);
                    require(file_path);
                    base.output(value.manifest["name"], "Plugin Is Loaded On The Main.");
                });
                // 渲染进程
                const renderer = value.manifest.injects.renderer;
                renderer.forEach(file_name => {
                    const file_path = path.join(pluginPath, file_name);
                    fs.readFile(file_path, { encoding: "utf-8" }, (err, data) => {
                        if (err) {
                            plugins[key] = undefined;
                            throw err;
                        }
                        this.#injectScript(data);
                        base.output(value.manifest["name"], "Plugin Is Loaded On The Renderer.");
                    });
                });
            }
        });
    }
}


module.exports = {
    BetterQQNTLoader
}
