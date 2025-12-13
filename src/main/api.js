const fs = require("fs");
const path = require("path");
const electron = require("electron");
const store = require("./store.js");

const LiteLoader = Object.create(null);

LiteLoader.plugins = Object.create(null);

LiteLoader.path = Object.create(null);
LiteLoader.path.root = path.dirname(path.dirname(__dirname));
LiteLoader.path.profile = process.env.LITELOADERQQNT_PROFILE ?? (globalThis.qwqnt ?
    path.join(globalThis.qwqnt.framework.paths.data, "LiteLoader") :
    LiteLoader.path.root
);
LiteLoader.path.data = path.join(LiteLoader.path.profile, "data");
LiteLoader.path.plugins = path.join(LiteLoader.path.profile, "plugins");

LiteLoader.package = Object.create(null);
LiteLoader.package.liteloader = require(path.join(LiteLoader.path.root, "package.json"));
LiteLoader.package.qqnt = require(path.join(process.resourcesPath, "app", "package.json"));

LiteLoader.versions = Object.create(null);
LiteLoader.versions.liteloader = LiteLoader.package.liteloader.version;
LiteLoader.versions.qqnt = LiteLoader.package.qqnt.version;
LiteLoader.versions.electron = process.versions.electron;
LiteLoader.versions.node = process.versions.node;
LiteLoader.versions.chrome = process.versions.chrome;

LiteLoader.os = Object.create(null);
LiteLoader.os.platform = process.platform;

LiteLoader.api = Object.create(null);
LiteLoader.api.openExternal = (url) => (electron.shell.openExternal(url), true);
LiteLoader.api.openPath = (path) => (electron.shell.openPath(path), true);

LiteLoader.api.config = Object.create(null);
LiteLoader.api.config.set = store.setPluginConfig;
LiteLoader.api.config.get = store.getPluginConfig;

LiteLoader.api.plugin = Object.create(null);
LiteLoader.api.plugin.install = store.installPlugin;
LiteLoader.api.plugin.delete = store.deletePlugin;
LiteLoader.api.plugin.disable = store.disablePlugin;

Object.defineProperty(globalThis, "LiteLoader", {
    get() {
        const stack = new Error().stack.split("\n")[2];
        const allowed = [LiteLoader.path.root, LiteLoader.path.profile];
        return allowed.some((item) => stack.includes(item)) ? LiteLoader : null;
    }
});

electron.ipcMain.on("LiteLoader.LiteLoader.LiteLoader", (event, method, args) => {
    event.returnValue = method.length ?
        method.reduce((obj, key) => obj?.[key], LiteLoader)?.(...args) :
        JSON.parse(JSON.stringify(LiteLoader));
});

electron.protocol.registerSchemesAsPrivileged([
    {
        scheme: "local",
        privileges: {
            standard: false,
            allowServiceWorkers: true,
            corsEnabled: false,
            supportFetchAPI: true,
            stream: true,
            bypassCSP: true
        }
    }
]);

electron.app.on("ready", () => {
    const schemes = ["local"];
    const old_schemes = electron.app.commandLine.getSwitchValue("fetch-schemes");
    const new_schemes = [old_schemes, ...schemes].join(",");
    electron.app.commandLine.appendSwitch("fetch-schemes", new_schemes);
});

// MIME 映射 + 自动补 charset，避免 strict MIME 导致 ESM/JSON module 加载失败
const getMime = (p) => {
    const path = require("path");
    const ext = path.extname(p || "").toLowerCase();
    const base = {
        ".js": "text/javascript", ".mjs": "text/javascript", ".cjs": "text/javascript",
        ".json": "application/json", ".webmanifest": "application/manifest+json",
        ".css": "text/css",
        ".html": "text/html", ".htm": "text/html",
        ".txt": "text/plain", ".log": "text/plain", ".md": "text/markdown",
        ".xml": "application/xml",
        ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".gif": "image/gif", ".webp": "image/webp", ".ico": "image/x-icon", ".bmp": "image/bmp",
        ".mp3": "audio/mpeg", ".wav": "audio/wav", ".ogg": "audio/ogg",
        ".mp4": "video/mp4", ".webm": "video/webm",
        ".wasm": "application/wasm",
        ".map": "application/json",
        ".pdf": "application/pdf",
        ".ttf": "font/ttf", ".otf": "font/otf", ".ttc": "font/collection", ".woff": "font/woff", ".woff2": "font/woff2", ".eot": "application/vnd.ms-fontobject"
    }[ext];

    let mime = base;
    if (!mime) {
        try {
            const mt = require("mime-types");
            mime = mt.lookup(ext) || mt.lookup(p) || "";
            if (mime && mt.contentType) mime = String(mt.contentType(mime)).split(";")[0];
        } catch { }
    }

    if (!mime) mime = "application/octet-stream";

    if (mime.startsWith("text/") || mime === "application/json" || mime === "application/xml" || mime === "image/svg+xml" || mime === "text/javascript") {
        return `${mime}; charset=utf-8`;
    }
    return mime;
};


exports.protocolRegister = (protocol) => {
    if (!protocol.isProtocolRegistered("local")) {
        protocol.handle("local", async (req) => {
            try {
                const u = new URL(req.url);
                const host = u.host; // 可能是 root/profile/C:/...
                const pathname = decodeURIComponent(u.pathname); // /src/xxx 或 /C:/Users/...
                const filepath = path.normalize(pathname.slice(1)); // 去掉开头 /
                let abs = "";
                switch (host) {
                    case "root": abs = path.join(LiteLoader.path.root, filepath); break;
                    case "profile": abs = path.join(LiteLoader.path.profile, filepath); break;
                    default:
                        abs = host ? path.normalize(`${host}/${filepath}`) : filepath; // local://C:/... 或 local:///C:/...
                        break;
                }
                const buf = await fs.promises.readFile(abs);
                return new Response(buf, { headers: { "content-type": getMime(abs) } });
            } catch (e) {
                return new Response(String(e && e.stack || e), { status: 404, headers: { "content-type": "text/plain; charset=utf-8" } });
            }
        });
    }
};