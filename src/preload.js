const { ipcRenderer, contextBridge } = require("electron");


// LiteLoader
Object.defineProperty(globalThis, "LiteLoader", {
    value: {
        ...ipcRenderer.sendSync("LiteLoader.LiteLoader.LiteLoader"),
        api: {
            disablePlugin: (...args) => ipcRenderer.invoke("LiteLoader.LiteLoader.api", "disablePlugin", "disablePlugin", ...args),
            config: {
                get: (...args) => ipcRenderer.invoke("LiteLoader.LiteLoader.api", "config", "get", ...args),
                set: (...args) => ipcRenderer.invoke("LiteLoader.LiteLoader.api", "config", "set", ...args)
            },
            openExternal: (...args) => ipcRenderer.invoke("LiteLoader.LiteLoader.api", "openExternal", "openExternal", ...args),
            openPath: (...args) => ipcRenderer.invoke("LiteLoader.LiteLoader.api", "openPath", "openPath", ...args)
        }
    }
});

contextBridge.exposeInMainWorld("LiteLoader", LiteLoader);


// 加载渲染进程
window.addEventListener("DOMContentLoaded", () => {
    const script = document.createElement("script");
    script.type = "module";
    script.defer = true;
    script.src = `local:///${LiteLoader.path.root}/src/renderer.js`;
    document.head.appendChild(script);
});


const preload_codeblock = (code) => `(
    async function(
        require,
        process,
        Buffer,
        global,
        setImmediate,
        clearImmediate,
        exports,
        module
    ) {
        ${code}
    }
)`;


// 加载插件 Preload
for (const [slug, plugin] of Object.entries(LiteLoader.plugins)) {
    if (plugin.disabled || plugin.incompatible) {
        continue;
    }
    if (plugin.path.injects.preload) {
        fetch(`local:///${plugin.path.injects.preload}`).then(async res => {
            binding.createPreloadScript(preload_codeblock(await res.text()))(...arguments);
        });
    }
}


// 加载 QQNT Preload
let flag = false;
ipcRenderer.invoke("LiteLoader.LiteLoader.preload").then(preload => {
    if (!flag) {
        binding.createPreloadScript(preload_codeblock(preload))(...arguments);
        flag = true;
    }
});
