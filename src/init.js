require("./liteloader_api/main.js");
require("./loader_core/plugin_loader.js");
require("./main.js");

if (!globalThis.qwqnt) {
    const main_path = "./application.asar/app_launcher/index.js";
    require(require("path").join(process.resourcesPath, "app", main_path));
    setImmediate(() => global.launcher.installPathPkgJson.main = main_path);
}