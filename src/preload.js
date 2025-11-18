class File {
    static read(path) {
        const url = `local:///${path}`;
        const xhr = new XMLHttpRequest(); ``
        xhr.open("GET", url, false);
        xhr.send();
        if (xhr.status >= 200 && xhr.status < 300) return xhr.responseText;
        throw new Error(`Failed to read file: ${path} (status: ${xhr.status})`);
    }
    static exists(path) {
        const url = `local:///${path}`;
        const xhr = new XMLHttpRequest();
        xhr.open("HEAD", url, false);
        xhr.send();
        return xhr.status >= 200 && xhr.status < 300;
    }
}

class Path {
    static isWindows(path) {
        return /^[a-zA-Z]:[\\/]/.test(path);
    }
    static isUnix(path) {
        return path.startsWith("/");
    }
    static isAbsolute(path) {
        return Path.isUnix(path) || Path.isWindows(path);
    }
    static getDrive(path) {
        if (Path.isWindows(path)) return `${path.slice(0, 2).toUpperCase()}/`;
        if (Path.isUnix(path)) return "/";
        return "";
    }
    static normalize(path) {
        const drive = Path.getDrive(path);
        const isAbs = drive != "";
        const body = isAbs ? path.slice(drive.length) : path;
        const parts = body.split(/[\\\/]/);
        const stack = [];
        for (const part of parts) {
            if (!part || part == ".") continue;
            if (part == "..") {
                if (stack.length) stack.pop();
                else if (!isAbs) stack.push("..");
                continue;
            }
            stack.push(part);
        }
        return `${drive}${stack.join("/")}` || ".";
    }
    static resolve(base, relative) {
        return Path.normalize(Path.isAbsolute(relative) ? relative : `${base}/${relative}`)
    }
    static dirname(path) {
        const normPath = Path.normalize(path);
        const drive = Path.getDrive(normPath);
        const parts = normPath.slice(drive.length).split("/");
        parts.pop();
        const result = parts.join("/");
        return `${drive}${result}` || (drive ? drive : ".");
    }
    static extname(path) {
        const filename = path.substring(path.lastIndexOf("/") + 1);
        const dotIndex = filename.lastIndexOf(".");
        return dotIndex > 0 ? filename.slice(dotIndex) : "";
    }
}

class Loader {
    static extensions = {
        ".js": Loader.loadJS,
        ".json": Loader.loadJSON
    };
    static loadJS(module) {
        const context = {
            global,
            process,
            Buffer,
            setImmediate,
            clearImmediate,
            module,
            require: module.require,
            exports: module.exports,
            __filename: module.id,
            __dirname: module.dirname,
        };
        new Function(...Object.keys(context), File.read(module.id))(...Object.values(context));
    }
    static loadJSON(module) {
        module.exports = JSON.parse(File.read(module.id));
    }
}

class Module {
    constructor(id, requireInstance) {
        this.id = id;
        this.exports = {};
        this.dirname = Path.dirname(id);
        this.loaded = false;
        this.require = (childId) => requireInstance.require(childId, this.dirname);
    }
    load() {
        if (!this.loaded) {
            const ext = Path.extname(this.id);
            const loader = Loader.extensions[ext];
            loader?.(this);
            this.loaded = true;
        }
    }
}

class Require {
    constructor(require) {
        this.orig_require = require;
        this.cache = {};
    }
    resolve(id, basePath) {
        const resolved = Path.resolve(basePath, id);
        if (File.exists(resolved)) return resolved;
        if (File.exists(resolved + ".js")) return resolved + ".js";
        if (File.exists(resolved + ".json")) return resolved + ".json";
        if (File.exists(resolved + "/index.js")) return resolved + "/index.js";
        if (File.exists(resolved + "/index.json")) return resolved + "/index.json";
        throw new Error(`Module not found: ${id} (from ${basePath})`);
    }
    require(id, basePath) {
        try {
            return this.orig_require(id);
        } catch {
            const filename = this.resolve(id, basePath);
            if (this.cache[filename]) return this.cache[filename].exports;
            const module = new Module(filename, this);
            this.cache[filename] = module;
            module.load();
            return module.exports;
        }
    }
}

new Require(require).require("./loader_core/preload.js", LiteLoader.path.root + "/src");

document.addEventListener("DOMContentLoaded", () => {
    const script = document.createElement("script");
    script.type = "module";
    script.src = "local://root/src/renderer.js";
    document.head.prepend(script);
});