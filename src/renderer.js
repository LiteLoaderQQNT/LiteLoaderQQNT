import "./renderer/components/renderer.js";
import "./renderer/triggers/renderer.js";
import { installHook } from "./renderer/hook.js"
import { Runtime } from "./renderer/runtime.js"

installHook();

for (const plugin of Object.values(LiteLoader.plugins)) {
    if (plugin.disabled || plugin.incompatible || !plugin.path.injects.renderer) continue;
    try { Runtime.registerPlugin(plugin, await import(`local:///${plugin.path.injects.renderer}`)); }
    catch (error) { plugin.error = { message: `[Renderer] ${error.message}`, stack: error.stack }; }
}