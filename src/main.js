require("./main/api.js");
const store = require("./main/store.js");
const { installHook } = require("./main/hook.js");
const { loadAllPlugins } = require("./main/loader.js");
const { Runtime } = require("./main/runtime.js");
const default_config = require("./common/static/config.json");
const config = LiteLoader.api.config.get("LiteLoader", default_config);

installHook();
loadAllPlugins();

for (const slug in config.deleting_plugins) {
    store.uninstallPlugin(slug);
}

for (const slug in config.installing_plugins) {
    store.installPlugin(slug);
}

for (const slug in LiteLoader.plugins) {
    const plugin = LiteLoader.plugins[slug];
    const plugin_path = plugin.path.injects.main;
    if (plugin.disabled || plugin.incompatible || !plugin_path) continue;
    try { Runtime.registerPlugin(plugin, require(plugin_path)); }
    catch (error) { plugin.error = { message: `[Main] ${error.message}`, stack: error.stack }; }
}

if (!globalThis.qwqnt) {
    const main_path = "./application.asar/app_launcher/index.js";
    require(require("path").join(process.resourcesPath, "app", main_path));
    setImmediate(() => global.launcher.installPathPkgJson.main = main_path);
}