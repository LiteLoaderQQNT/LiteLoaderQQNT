// Electron 主进程 与 渲染进程 互相交互的桥梁
const { contextBridge } = require("electron");


contextBridge.exposeInMainWorld("plugin_template", {

});