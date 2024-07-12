const { ipcRenderer } = require("electron");


// 加载渲染进程
document.addEventListener("readystatechange", () => {
    if (document.readyState == "interactive") {
        const script = document.createElement("script");
        script.type = "module";
        script.src = `local://root/src/renderer.js`;
        document.head.prepend(script);
    }
});


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

    const errorData = document.createElement("script");
    errorData.textContent = JSON.stringify(preloadErrors);
    errorData.id = "LL_PRELOAD_ERRORS";
    document.head.append(errorData);
})();


// 加载 QQNT Preload
let isLoaded = false;
ipcRenderer.invoke("LiteLoader.LiteLoader.preload").then(preload => {
    if (!isLoaded) {
        runPreloadScript(preload);
        isLoaded = true;
    }
});
