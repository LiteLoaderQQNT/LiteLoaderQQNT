// Electron 主进程 与 渲染进程 互相交互的桥梁
const { contextBridge, ipcRenderer } = require("electron");


contextBridge.exposeInMainWorld("better_qqnt", {
    showPickDirDialog: () => ipcRenderer.invoke(
        "betterQQNT.better_qqnt.showPickDirDialog"
    ),
    setProfilePath: path => ipcRenderer.invoke(
        "betterQQNT.better_qqnt.setProfilePath",
        path
    ),
    quit: () => ipcRenderer.send(
        "betterQQNT.better_qqnt.quit"
    )
});