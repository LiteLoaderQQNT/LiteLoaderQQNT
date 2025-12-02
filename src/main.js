const store = require("./main/store.js");
const { installHook } = require("./main/hook.js");
const { loadAllPlugins } = require("./main/loader.js");
const { Runtime } = require("./main/runtime.js");

installHook();
loadAllPlugins();

const config = LiteLoader.api.config.get("LiteLoader", require("./common/static/config.json"));
for (const slug in config.deleting_plugins) store.deletePlugin(slug, [true, true], true);
for (const slug in config.installing_plugins) store.installPlugin(slug);
for (const plugin of Object.values(LiteLoader.plugins)) {
    if (plugin.disabled || plugin.incompatible || !plugin.path.injects.main) continue;
    try { Runtime.registerPlugin(plugin, require(plugin.path.injects.main)); }
    catch (error) { console.log(`[Main] [${plugin.manifest.slug}]: `, error); }
}

if (!globalThis.qwqnt) {
    const main_path = "./application.asar/app_launcher/index.js";
    require(require("path").join(process.resourcesPath, "app", main_path));
    setImmediate(() => global.launcher.installPathPkgJson.main = main_path);
}