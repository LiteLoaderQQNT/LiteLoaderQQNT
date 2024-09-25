require("./liteloader_api/main.js");
require("./loader_core/plugin_loader.js");
require("./main.js");
require(require("path").join(process.resourcesPath, "app/app_launcher/index.js"));

setTimeout(() => {
    if (LiteLoader.package.qqnt.buildVersion >= 28060) {
        global.launcher.installPathPkgJson.main = "./application/app_launcher/index.js";
    } else {
        global.launcher.installPathPkgJson.main = "./app_launcher/index.js";
    }
}, 0);