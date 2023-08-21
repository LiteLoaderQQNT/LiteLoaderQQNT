const { contextBridge } = require("electron");


const majorPath = (() => {
    if (process.platform == "win32") {
        return "./major.node";
    }
    if (process.platform == "linux") {
        return `${process.execPath}/../resources/app/major.node`;
    }
    if (process.platform == "darwin") {
        return `${process.execPath}/../../../../../Resources/app/major.node`;
    }
})();

contextBridge.exposeInMainWorld("electron", {
    load: (file) => require(majorPath).load(file, module)
});

require(majorPath).load("p_preload", module);