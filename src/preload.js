const { ipcRenderer } = require("electron");


// 加载渲染进程
document.addEventListener("readystatechange", () => {
    if (document.readyState == "interactive") {
        const script = document.createElement("script");
        script.type = "module";
        script.src = `local://root/src/renderer.js`;
        document.head.append(script);
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
    for (const [slug, plugin] of Object.entries(LiteLoader.plugins)) {
        if (plugin.disabled || plugin.incompatible) {
            continue;
        }
        if (plugin.path.injects.preload) {
            runPreloadScript(await (await fetch(`local:///${plugin.path.injects.preload}`)).text());
        }
    }
})();


// 加载 QQNT Preload
let isLoaded = false;
ipcRenderer.invoke("LiteLoader.LiteLoader.preload").then(preload => {
    if (!isLoaded) {
        runPreloadScript(preload);
        isLoaded = true;
    }
});
