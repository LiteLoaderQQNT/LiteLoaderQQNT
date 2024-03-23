const { ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");


// 禁用插件
ipcMain.handle("LiteLoader.LiteLoader_Setting.disablePlugin", (_, slug, disabled) => {
    const config_path = path.join(LiteLoader.path.profile, "config.json");
    const config = JSON.parse(fs.readFileSync(config_path, "utf-8"));
    if (disabled) {
        config.LiteLoader.disabled_plugins = config.LiteLoader.disabled_plugins.concat(slug);
    } else {
        config.LiteLoader.disabled_plugins = config.LiteLoader.disabled_plugins.filter(item => item != slug);
    }
    fs.writeFileSync(config_path, JSON.stringify(config, null, 4), "utf-8");
});
