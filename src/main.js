const { Module } = require("module");
const { BrowserWindow, net, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");


function output(...args) {
    console.log("\x1b[32m%s\x1b[0m", "[LiteLoader]", ...args);
}


// 插件加载器
const loader = new class {


    #exports = [];


    constructor() {
        output("Start finding all plugins.");

        if (process.env?.LITELOADERQQNT_PROFILE) {
            output("Use LITELOADERQQNT_PROFILE environment variables:", LiteLoader.path.profile);
        }

        // 如果插件目录不存在
        if (!fs.existsSync(LiteLoader.path.plugins)) {
            output("The plugins directory does not exist.");
            output("A new plugin directory will be created.");
            fs.mkdir(LiteLoader.path.plugins, { recursive: true }, error => {
                if (error) {
                    output("Plugins directory creation failed!");
                    output("Please check the plugins directory.");
                    return;
                }
                output("Plugins directory created successfully!");
            });
            return;
        }

        // 读取插件目录
        try {
            for (const plugin_pathname of fs.readdirSync(LiteLoader.path.plugins, "utf-8")) {
                try {
                    const manifest_file = path.join(LiteLoader.path.plugins, plugin_pathname, "manifest.json");
                    const manifest = JSON.parse(fs.readFileSync(manifest_file, "utf-8"));

                    const incompatible_version = Number(manifest.manifest_version) != 4;
                    const incompatible_platform = !manifest.platform.includes(LiteLoader.os.platform);
                    const disabled_plugin = LiteLoader.config.LiteLoader.disabled_plugins.includes(manifest.slug);

                    const plugin_path = path.join(LiteLoader.path.plugins, plugin_pathname);
                    const data_path = path.join(LiteLoader.path.data, manifest.slug);

                    const main_file = path.join(plugin_path, manifest?.injects?.main ?? "");
                    const preload_file = path.join(plugin_path, manifest?.injects?.preload ?? "");
                    const renderer_file = path.join(plugin_path, manifest?.injects?.renderer ?? "");

                    LiteLoader.plugins[manifest.slug] = {
                        manifest: manifest,
                        incompatible: incompatible_version || incompatible_platform,
                        disabled: disabled_plugin,
                        path: {
                            plugin: plugin_path,
                            data: data_path,
                            injects: {
                                main: fs.statSync(main_file).isFile() ? main_file : null,
                                preload: fs.statSync(preload_file).isFile() ? preload_file : null,
                                renderer: fs.statSync(renderer_file).isFile() ? renderer_file : null
                            }
                        }
                    }
                }
                catch {
                    continue;
                }
            }
        }
        catch {
            output("Failed to read plugins directory!");
            output("Please check the plugins directory.");
        }

        // 输出插件状态
        for (const plugin of Object.values(LiteLoader.plugins)) {
            const dependencies = plugin.manifest?.dependencies?.filter((slug) => !LiteLoader.plugins[slug]);

            // 输出不兼容
            if (plugin.incompatible) {
                output("Found plugin:", plugin.manifest.name, "(Incompatible)");
                continue;
            }

            // 输出已禁用
            if (plugin.disabled) {
                output("Found plugin:", plugin.manifest.name, "(Disabled)");
                continue;
            }

            // 缺少依赖
            if (dependencies) {
                output("Found plugin:", plugin.manifest.name, "Missing dependencies:", dependencies.toString());
                continue;
            }

            output("Found plugin:", plugin.manifest.name);
        }

        // 输出找到了多少插件
        const plugins_length = Object.keys(LiteLoader.plugins).length;
        output(`Found ${plugins_length} plugins,`, plugins_length ? "start loading plugins." : "no plugin to be loaded.");

        // 加载插件
        for (const plugin of Object.values(LiteLoader.plugins)) {
            if (plugin.disabled || plugin.incompatible) {
                continue;
            }
            if (plugin.path.injects.main) {
                this.#exports.push(require(plugin.path.injects.main));
            }
        }
    }


    onBrowserWindowCreated(window) {
        this.#exports.forEach((exports) => exports?.onBrowserWindowCreated?.(window));
    }


};


// 注册协议
function protocolRegister(protocol) {
    //协议未注册，才需要注册
    if (!protocol.isProtocolRegistered("local")) {
        protocol.handle("local", (req) => {
            const { host, pathname } = new URL(decodeURI(req.url));
            const filepath = path.normalize(pathname.slice(1));
            return net.fetch(`file://${host}/${filepath}`);
        });
    }
}

const liteloader_preload_path = path.join(LiteLoader.path.root, "src/preload.js");
ipcMain.handle("LiteLoader.LiteLoader.preload", (event) => {
    const browserWindow = BrowserWindow.fromWebContents(event.sender);
    const qqnt_preload_path = browserWindow.preload;
    output(qqnt_preload_path);
    return fs.readFileSync(qqnt_preload_path, "utf-8");
})

function proxyBrowserWindowConstruct(target, [config], newTarget) {
    const qqnt_preload_path = config.webPreferences.preload;
    const preload_path = `${path.dirname(qqnt_preload_path).replaceAll("\\", "/")}/../application/preload.js`;

    if (!fs.existsSync(preload_path)) {
        fs.mkdirSync(path.dirname(preload_path), { recursive: true });
        fs.copyFileSync(liteloader_preload_path, preload_path);
    }

    if (fs.readFileSync(preload_path, "utf-8") != fs.readFileSync(liteloader_preload_path, "utf-8")) {
        fs.copyFileSync(liteloader_preload_path, preload_path);
    }

    const new_config = {
        ...config,
        webPreferences: {
            ...config.webPreferences,
            webSecurity: false,
            devTools: true,
            preload: preload_path,
            additionalArguments: ["--fetch-schemes=local"]
        }
    }

    const window = Reflect.construct(target, [new_config], newTarget);
    window.preload = qqnt_preload_path;

    //加载自定义协议
    protocolRegister(window.webContents.session.protocol);
    loader.onBrowserWindowCreated(window);

    return window;
}


// 监听窗口创建
Module._load = new Proxy(Module._load, {
    apply(target, thisArg, argArray) {
        const module = Reflect.apply(target, thisArg, argArray);

        if (argArray[0] == "electron") {
            return new Proxy(module, {
                get(target, property, receiver) {
                    if (property == "BrowserWindow") {
                        return new Proxy(module.BrowserWindow, {
                            construct: proxyBrowserWindowConstruct
                        });
                    }

                    return Reflect.get(target, property, receiver);
                }
            });
        }

        return module;
    }
});
