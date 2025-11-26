class File {
    static read(path) {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", `local:///${path}`, false);
        xhr.send();
        if (xhr.status >= 200 && xhr.status < 300) return xhr.responseText;
        throw new Error(`Failed to read file: ${path} (status: ${xhr.status})`);
    }
    static exists(path) {
        const xhr = new XMLHttpRequest();
        xhr.open("HEAD", `local:///${path}`, false);
        xhr.send();
        return xhr.status >= 200 && xhr.status < 300;
    }
}

class Path {
    static isWindows(path) { return /^[a-zA-Z]:[\\/]/.test(path); }
    static isUnix(path) { return path.startsWith("/"); }
    static isAbsolute(path) { return Path.isUnix(path) || Path.isWindows(path); }
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
    static globals = { LiteLoader: module.exports.LiteLoader };
    static cache = {};
    constructor(module) {
        this.id = null;
        this.exports = {};
        this.parent = module;
        this.require = this.require.bind(this);
    }
    require(id) {
        try {
            this.id = id;
            this.exports = module.require(id);
            return this.exports;
        } catch {
            this.id = this.#resolve(id, Path.dirname(this.parent?.id ?? "."));
            if (!Module.cache[this.id]) {
                Module.cache[this.id] = new Module(this);
                Module.cache[this.id].#load(this.id);
            }
            return Module.cache[this.id].exports;
        }
    }
    #resolve(id, base) {
        const resolved = Path.normalize(Path.isAbsolute(id) ? id : `${base}/${id}`);
        if (File.exists(resolved)) return resolved;
        if (File.exists(resolved + ".js")) return resolved + ".js";
        if (File.exists(resolved + ".json")) return resolved + ".json";
        if (File.exists(resolved + "/index.js")) return resolved + "/index.js";
        if (File.exists(resolved + "/index.json")) return resolved + "/index.json";
        throw new Error(`Module not found: ${id} (from ${base})`);
    }
    #load(file) {
        switch (Path.extname(file)) {
            case ".js": this.#executeJS(File.read(file)); break;
            case ".cjs": this.#executeJS(File.read(file)); break;
            case ".mjs": this.#executeJS(File.read(file)); break;
            case ".json": this.#executeJSON(File.read(file)); break;
            default: throw new Error(`Unsupported module extension: ${this.filename}`);
        }
    }
    #executeJS(content) {
        const context = {
            module: this,
            require: this.require,
            exports: this.exports,
            process,
            global,
            Buffer,
            setImmediate,
            clearImmediate,
            ...Module.globals,
        };
        new Function(...Object.keys(context), content)(...Object.values(context));
    }
    #executeJSON(content) {
        this.exports = JSON.parse(content);
    }
}

module.exports.Module = Module;