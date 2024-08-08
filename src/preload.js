const { contextBridge } = require("electron");


// 加载渲染进程
document.addEventListener("DOMContentLoaded", () => {
    const script = document.createElement("script");
    script.type = "module";
    script.src = `local://root/src/renderer.js`;
    document.head.prepend(script);
})


const runPreloadScript = code => binding.createPreloadScript(`
(async function(require, process, Buffer, global, setImmediate, clearImmediate, exports, module) {
    ${code}
});
`)(...arguments);


// 加载插件 Preload
(async () => {
    runPreloadScript(await (await fetch(`local://root/src/liteloader_api/preload.js`)).text());
    const preloadErrors = {}
    for (const [slug, plugin] of Object.entries(LiteLoader.plugins)) {
        if (plugin.disabled || plugin.incompatible || plugin.error) {
            continue;
        }
        if (plugin.path.injects.preload) {
            try {
                runPreloadScript(await (await fetch(`local:///${plugin.path.injects.preload}`)).text());
            }
            catch (e) {
                preloadErrors[slug] = { message: `[Preload] ${e.message}`, stack: e.stack };
            }
        }
    }
    contextBridge.exposeInMainWorld("LiteLoaderPreloadErrors", preloadErrors);
})();


// 加载 QQNT Preload（这后面会被自动处理）