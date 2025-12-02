const { contextBridge } = require("electron");
const { Runtime } = require("./preload/runtime.js");

for (const plugin of Object.values(LiteLoader.plugins)) {
    if (plugin.disabled || plugin.incompatible || !plugin.path.injects.preload) continue;
    try { Runtime.registerPlugin(plugin, require(plugin.path.injects.preload)); }
    catch (error) { console.log(`[Preload] [${plugin.manifest.slug}]: `, error); }
}

contextBridge.executeInMainWorld({
    func: module => (import(module), true),
    args: ["local://root/src/renderer.js"]
});