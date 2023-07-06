// 运行在 Electron 主进程 下的插件入口
const { app, ipcMain, dialog } = require("electron");
const child_process = require("child_process");
const fs = require("fs");


function onLoad(plugin, liteloader) {

    ipcMain.handle(
        "LiteLoader.config_view.getDisabledList",
        (event, message) => {
            const config_path = liteloader.path.config;
            try {
                const data = fs.readFileSync(config_path, "utf-8");
                const config = JSON.parse(data);
                const disabled_list = config?.disabled;
                return disabled_list;
            }
            catch (error) {
                return []
            }
        }
    );


    ipcMain.handle(
        "LiteLoader.config_view.setDisabledList",
        (event, list) => {
            const config_path = liteloader.path.config;
            try {
                const data = fs.readFileSync(config_path, "utf-8");
                const config = JSON.parse(data);

                config["disabled"] = list;

                const new_config = JSON.stringify(config, null, 4);
                fs.writeFileSync(config_path, new_config, "utf-8");
            }
            catch (error) {
                const config = {
                    disabled: list
                }
                const new_config = JSON.stringify(config, null, 4);
                fs.writeFileSync(config_path, new_config, "utf-8");
            }
        }
    );


    ipcMain.handle(
        "LiteLoader.config_view.showPickDirDialog",
        (event, message) => dialog.showOpenDialog({
            properties: [
                "openDirectory",
                "showHiddenFiles",
                "createDirectory"
            ]
        })
    );


    ipcMain.handle(
        "LiteLoader.config_view.setProfilePath",
        (event, path) => new Promise((resolve, reject) => {
            const command = `setx LITELOADERQQNT_PROFILE "${path}"`;
            child_process.exec(command, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(stdout, stderr);
            });
        })
    );


    ipcMain.on(
        "LiteLoader.config_view.quit",
        (event, message) => {
            app.quit();
        }
    );

}


module.exports = {
    onLoad
}