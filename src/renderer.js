import "./renderer/components/renderer.js";
import "./renderer/triggers/renderer.js";
import { installHook } from "./renderer/hook.js"
import { Runtime } from "./renderer/runtime.js"

installHook();

for (const slug in LiteLoader.plugins) {
    const plugin = LiteLoader.plugins[slug];
    const plugin_path = plugin.path.injects.renderer;
    if (plugin.disabled || plugin.incompatible || !plugin_path) continue;
    try { Runtime.registerPlugin(plugin, await import(`local:///${plugin_path}`)); }
    catch (error) { plugin.error = { message: `[Renderer] ${error.message}`, stack: error.stack }; }
}