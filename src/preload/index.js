import { contextBridge, ipcRenderer } from "electron";

const LiteLoader = ipcRenderer.sendSync("LiteLoader.LiteLoader.LiteLoader");

contextBridge.exposeInMainWorld("LiteLoader", LiteLoader);
contextBridge.exposeInMainWorld("LiteLoaderFunc", {
    exit: () => ipcRenderer.sendSync("LiteLoader.LiteLoader.exit")
});
