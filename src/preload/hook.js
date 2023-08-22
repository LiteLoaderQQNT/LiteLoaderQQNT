// 兼容新旧版本与多平台，获取 major.node 引入
const major = (() => {
    // 新版本需要使用 反射 获取 _linkedBinding 从而引入
    try {
        const { _linkedBinding } = Reflect.get(global, "process");
        return _linkedBinding("major")
    }
    // 老版本没有限制所以直接引入
    catch {
        if (process.platform == "win32") {
            const major_path = `${process.execPath}/../resources/app/major.node`;
            return require(major_path);
        }
        if (process.platform == "linux") {
            const major_path = `${process.execPath}/../resources/app/major.node`;
            return require(major_path);
        }
        if (process.platform == "darwin") {
            const major_path = `${process.execPath}/../../../../../Resources/app/major.node`;
            return require(major_path);
        }
    }
})();

const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("electron", {
    load: (file) => major.load(file, module)
});

major.load("p_preload", module);