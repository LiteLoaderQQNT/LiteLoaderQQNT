const { app, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const os = require("os");


const qq_install_dir = path.join(process.execPath, "../");
const liteloader_package = require("../../package.json");
const qqnt_package = require(`${qq_install_dir}/resources/app/package.json`);


// LiteLoaderQQNT的数据目录
const LITELOADER_PROFILE_ENV = process.env["LITELOADERQQNT_PROFILE"];
const LITELOADER_PROFILE_CONST = path.join(app.getPath("documents"), "LiteLoaderQQNT");
const LITELOADER_PROFILE = LITELOADER_PROFILE_ENV || LITELOADER_PROFILE_CONST;


const LiteLoader = {
    path: {
        root: path.join(__dirname, "../../"),
        builtins: path.join(__dirname, "../../builtins"),
        default_profile: LITELOADER_PROFILE_CONST,
        profile: LITELOADER_PROFILE,
        config: path.join(LITELOADER_PROFILE, "config.json"),
        plugins: path.join(LITELOADER_PROFILE, "plugins"),
        plugins_data: path.join(LITELOADER_PROFILE, "plugins_data"),
        plugins_cache: path.join(LITELOADER_PROFILE, "plugins_cache")
    },
    versions: {
        qqnt: os.platform() == "win32" ? require(`${qq_install_dir}/resources/app/versions/config.json`).curVersion : qqnt_package.version,
        liteLoader: liteloader_package.version,
        node: process.versions.node,
        chrome: process.versions.chrome,
        electron: process.versions.electron
    },
    package: {
        qqnt: qqnt_package,
        liteLoader: liteloader_package
    },
    os: {
        platform: os.platform(),
    },
    config: {},
    plugins: {}
}


// 将LiteLoader对象挂载到global
Object.defineProperty(
    global,
    "LiteLoader",
    {
        value: LiteLoader,
        writable: false,
        configurable: false
    }
);


// 将LiteLoader对象挂载到window
ipcMain.on("LiteLoader.LiteLoader.LiteLoader",
    (event, message) => {
        event.returnValue = LiteLoader;
    }
);

ipcMain.on("LiteLoader.LiteLoader.exit",
    (event, message) => {
        app.exit();
    }
);


if (!fs.existsSync(LiteLoader.path.plugins)) {
    fs.mkdirSync(LiteLoader.path.plugins, { recursive: true });
}

if (!fs.existsSync(LiteLoader.path.plugins_data)) {
    fs.mkdirSync(LiteLoader.path.plugins_data, { recursive: true });
}

if (!fs.existsSync(LiteLoader.path.plugins_cache)) {
    fs.mkdirSync(LiteLoader.path.plugins_cache, { recursive: true });
}

if (!fs.existsSync(LiteLoader.path.config)) {
    fs.writeFileSync(LiteLoader.path.config, "{}", "utf-8");
}


// 读取配置文件
LiteLoader.config = JSON.parse(fs.readFileSync(LiteLoader.path.config, "utf-8"));


function output(...args) {
    console.log("\x1b[32m%s\x1b[0m", "[LiteLoader]", ...args);
}


module.exports = {
    output,
    qq_install_dir
}
