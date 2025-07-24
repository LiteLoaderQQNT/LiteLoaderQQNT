require("./liteloader_api/main.js");
require("./loader_core/plugin_loader.js");
require("./main.js");

if (!globalThis.qwqnt) {
    const main_path = (() => {
        const version = LiteLoader.package.qqnt.buildVersion;
        if (version >= 29271) return "./application.asar/app_launcher/index.js";
        if (version >= 28060) return "./application/app_launcher/index.js";
        return "./app_launcher/index.js";
    })();
    require(require("path").join(process.resourcesPath, "app", main_path));
    setImmediate(() => global.launcher.installPathPkgJson.main = main_path);
}