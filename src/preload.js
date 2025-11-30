document.addEventListener("DOMContentLoaded", () => {
    const script = document.createElement("script");
    script.type = "module";
    script.src = "local://root/src/renderer.js";
    document.head.prepend(script);
});

for (const plugin of Object.values(module.exports.LiteLoader.plugins)) {
    if (plugin.disabled || plugin.incompatible || !plugin.path.injects.preload) continue;
    try { new module.exports.Module().require(plugin.path.injects.preload); }
    catch (error) { plugin.error = { message: `[Preload] ${error.message}`, stack: error.stack }; }
}