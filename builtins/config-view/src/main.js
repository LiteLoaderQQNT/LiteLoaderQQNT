// 运行在 Electron 主进程 下的插件入口
const { app, shell, ipcMain, dialog } = require("electron");
const child_process = require("child_process");


ipcMain.handle(
    "betterQQNT.better_qqnt.showPickDirDialog",
    (event, message) => dialog.showOpenDialog({
        properties: [
            "openDirectory",
            "showHiddenFiles",
            "createDirectory"
        ]
    })
);


ipcMain.handle(
    "betterQQNT.better_qqnt.setProfilePath",
    (event, message) => new Promise((resolve, reject) => {
        const command = `setx BETTERQQNT_PROFILE "${message}"`;
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
    "betterQQNT.better_qqnt.quit",
    (event, message) => {
        app.quit();
    }
);
