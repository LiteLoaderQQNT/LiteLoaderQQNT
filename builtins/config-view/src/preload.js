// Electron 主进程 与 渲染进程 互相交互的桥梁
const { contextBridge, ipcRenderer } = require("electron");


contextBridge.exposeInMainWorld("config_view", {
    getDisabledList: () => ipcRenderer.invoke(
        "betterQQNT.config_view.getDisabledList"
    ),
    setDisabledList: list => ipcRenderer.invoke(
        "betterQQNT.config_view.setDisabledList",
        list
    ),
    showPickDirDialog: () => ipcRenderer.invoke(
        "betterQQNT.config_view.showPickDirDialog"
    ),
    setProfilePath: path => ipcRenderer.invoke(
        "betterQQNT.config_view.setProfilePath",
        path
    ),
    quit: () => ipcRenderer.send(
        "betterQQNT.config_view.quit"
    )
});