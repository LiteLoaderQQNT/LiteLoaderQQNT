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

class Module {
    constructor(require, filename) {
        this.require = (id) => require(id, this.dirname);
        this.filename = filename;
        this.exports = {};
        this.dirname = Path.dirname(filename);
        this.loaded = false;
    }
    load() {
        if (!this.loaded) {
            switch (Path.extname(this.filename)) {
                case ".js": this.#loadJS(); break;
                case ".json": this.#loadJSON(); break;
                default: throw new Error(`Unsupported module extension: ${this.filename}`);
            }
            this.loaded = true;
        }
    }
    #loadJS() {
        const context = {
            global,
            process,
            Buffer,
            setImmediate,
            clearImmediate,
            module: this,
            require: this.require,
            exports: this.exports,
            __filename: this.filename,
            __dirname: this.dirname,
        };
        new Function(...Object.keys(context), File.read(this.filename))(...Object.values(context));
    }
    #loadJSON() {
        this.exports = JSON.parse(File.read(this.filename));
    }
}

class Require {
    #require;
    constructor(require) {
        this.#require = require;
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
            return this.#require(id);
        } catch {
            const filename = this.resolve(id, basePath);
            if (this.cache[filename]) return this.cache[filename].exports;
            const module = new Module(this.require.bind(this), filename);
            this.cache[filename] = module;
            module.load();
            return module.exports;
        }
    }
}

new Require(require).require("./src/loader_core/preload.js", LiteLoader.path.root);

document.addEventListener("DOMContentLoaded", () => {
    const script = document.createElement("script");
    script.type = "module";
    script.src = "local://root/src/renderer.js";
    document.head.prepend(script);
});