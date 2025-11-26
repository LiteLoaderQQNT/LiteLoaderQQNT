const LiteLoader = module.exports.LiteLoader;
const preloadErrors = {};

document.addEventListener("DOMContentLoaded", () => {
    const script = document.createElement("script");
    script.type = "module";
    script.src = "local://root/src/renderer.js";
    document.head.prepend(script);
});

for (const slug in LiteLoader.plugins) {
    const plugin = LiteLoader.plugins[slug];
    const plugin_path = plugin.path.injects.preload
    if (plugin.disabled || plugin.incompatible || plugin.error || !plugin_path) continue;
    try { new module.exports.Module().require(plugin_path); }
    catch (e) { preloadErrors[slug] = { message: `[Preload] ${e.message}`, stack: e.stack }; }
}