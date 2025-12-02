const { contextBridge } = require("electron");

for (const plugin of Object.values(module.exports.LiteLoader.plugins)) {
    if (plugin.disabled || plugin.incompatible || !plugin.path.injects.preload) continue;
    try { new module.exports.Module().require(plugin.path.injects.preload); }
    catch (error) { console.log(`[Preload] [${plugin.manifest.slug}]: `, error); }
}

contextBridge.executeInMainWorld({
    func: module => import(module),
    args: ["local://root/src/renderer.js"]
});