const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("electron", {
    load: (file) => require("./major.node").load(file, module)
});

require("./major.node").load("p_preload", module);