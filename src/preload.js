/**
 * 加载渲染进程脚本
 */
document.addEventListener("DOMContentLoaded", () => {
    const script = document.createElement("script");
    script.type = "module";
    script.src = "local://root/src/renderer.js";
    document.head.prepend(script);
});

/**
 * 同步读取本地文件内容
 * @param {string} file - 文件路径
 * @returns {string} 文件内容
 */
function readFileRequestSync(file) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", file, false);
    xhr.send();
    return xhr.responseText;
}

/**
 * 在隔离上下文中运行预加载脚本
 * @param {string} content - 脚本内容
 */
function runPreloadScript(content) {
    const context = {
        require,
        process,
        Buffer,
        global,
        setImmediate,
        clearImmediate,
        exports,
        module,
        runPreloadScript,
        readFileRequestSync
    };
    const keys = Object.keys(context);
    const values = Object.values(context);
    return new Function(...keys, content)(...values);
}


/**
 * 加载插件 Preload
 */
runPreloadScript(readFileRequestSync("local://root/src/liteloader_api/preload.js"));
runPreloadScript(readFileRequestSync("local://root/src/loader_core/preload.js"));