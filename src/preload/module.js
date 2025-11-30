class File {
    static #request(path, method) {
        const xhr = new XMLHttpRequest();
        xhr.open(method, `local:///${path}`, false);
        xhr.send();
        return xhr.status == 200 && xhr.responseText;
    }
    static read(path) { return File.#request(path, "GET"); }
    static exists(path) { return !!File.#request(path, "HEAD"); }
}

class Path {
    static isWindows(path) { return /^[a-zA-Z]:[\\/]/.test(path); }
    static isUnix(path) { return path.startsWith("/"); }
    static isAbsolute(path) { return Path.isUnix(path) || Path.isWindows(path); }
    static getDrive(path) { return Path.isWindows(path) ? `${path.slice(0, 2)}/` : Path.isUnix(path) ? "/" : ""; }
    static normalize(path) {
        const drive = Path.getDrive(path);
        const parts = path.slice(drive.length).split(/[\\/]/);
        const stack = [];
        for (const part of parts) if (part && part != ".") part == ".." ? stack.pop() : stack.push(part);
        return `${drive}${stack.join("/")}` || ".";
    }
    static dirname(path) {
        const parts = Path.normalize(path).split("/").slice(0, -1);
        return parts.length ? `${Path.getDrive(path)}${parts.join("/")}` : ".";
    }
    static extname(path) { return path.match(/\.[^/.]+$/)?.[0] ?? ""; }
}

class Module {
    static cache = {};
    constructor(module) {
        this.id = null;
        this.exports = {};
        this.parent = module;
    }
    require(id) {
        try {
            this.id = id;
            return this.exports = module.require(id);
        }
        catch {
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
        for (const ext of ["", ".js", ".json"]) if (File.exists(resolved + ext)) return resolved + ext;
        throw new Error(`Module not found: ${id} (from ${base})`);
    }
    #load(file) {
        const context = {
            module: this, require: this.require.bind(this), exports: this.exports,
            global, process, Buffer, setImmediate, clearImmediate,
            __filename: file, __dirname: Path.dirname(file),
            LiteLoader: module.exports.LiteLoader
        };
        switch (Path.extname(file)) {
            case ".js": return new Function(...Object.keys(context), File.read(file))(...Object.values(context));
            case ".json": return this.exports = JSON.parse(File.read(file));
            default: throw new Error(`Unsupported module extension: ${file}`);
        }
    }
}

module.exports.Module = Module;