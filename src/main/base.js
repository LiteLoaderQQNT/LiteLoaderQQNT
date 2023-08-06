const { app, ipcMain } = require("electron");
const { execSync } = require("child_process")
const path = require("path");
const fs = require("fs");
const os = require("os");


// 读取注册表
function readRegistryValue(keyPath, valueName) {
    try {
        const command = `reg query "${keyPath}" /v "${valueName}"`;
        const stdout = execSync(command, { stdio: 'pipe' }).toString();
        const lines = stdout.split('\r\n');
        const valueLine = lines.find(line => line.includes(valueName));
        if (valueLine) {
            const parts = valueLine.split(/\s+/);
            return path.dirname(parts.slice(3).join(' '));
        }
    }
    catch (error) {
        //console.error(`Error reading registry: ${error}`);
        //此处抛异常是正常的，因为有两种路径，总有一个是读取不到的。
    }
    return null;
}


function getQQInstallDir() {
    //Windows 则暴力拉取注册表
    if (os.platform() === "win32") {
        const reg = "HKLM\\Software\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\QQ";
        const reg2 = "HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\QQ";
        return readRegistryValue(reg, "UninstallString") || readRegistryValue(reg2, "UninstallString");
    }
    else {
        /*
        ? OS X 和 Linux 不同发行版获取QQ安装路径的方法各不相同，
        ? 故 Linux 和 OS X 都先写死为相对路径，待日后解决该问题，这并不是一个非常急迫的需求。
        const stdout = execSync(`which qq`, { stdio: 'pipe' }).toString();
        return path.dirname(stdout);
        */
        return path.join(__dirname, "../../../../../");
    }
}


const qq_install_dir = getQQInstallDir();
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
