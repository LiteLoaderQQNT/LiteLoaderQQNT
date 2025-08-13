// 加载渲染进程
document.addEventListener("DOMContentLoaded", () => {
    const script = document.createElement("script");
    script.type = "module";
    script.src = `local://root/src/renderer.js`;
    document.head.prepend(script);
});


// 运行预加载脚本
function runPreloadScript(content) {
    const objects = {
        require,
        process,
        Buffer,
        global,
        setImmediate,
        clearImmediate,
        exports,
        module,
        runPreloadScript
    };
    const keys = Object.keys(objects);
    const values = Object.values(objects);
    return new Function(...keys, content)(...values);
}


// 加载插件 Preload
(async () => {
    runPreloadScript(await (await fetch(`local://root/src/liteloader_api/preload.js`)).text());
    runPreloadScript(await (await fetch(`local://root/src/loader_core/preload.js`)).text());
})();