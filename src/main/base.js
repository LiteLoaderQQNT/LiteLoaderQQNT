const path = require("path");
const fs = require("fs");
const os = require("os");
const liteloader_package = require("../../package.json");
const qqnt_package = require("../../../package.json");


// LiteLoader的数据目录
const LITELOADER_PROFILE_ENV = process.env["BETTERQQNT_PROFILE"];
const LITELOADER_PROFILE_COSNT = path.join(os.homedir(),"Documents/BetterQQNT");
const LITELOADER_PROFILE = LITELOADER_PROFILE_ENV || LITELOADER_PROFILE_COSNT;


const LiteLoader = {
    path: {
        root: path.join(__dirname, "../../"),
        builtins: path.join(__dirname, "../../builtins"),
        default_profile: LITELOADER_PROFILE,
        profile: LITELOADER_PROFILE,
        config: path.join(LITELOADER_PROFILE, "config.json"),
        plugins: path.join(LITELOADER_PROFILE, "plugins"),
        plugins_dev: path.join(LITELOADER_PROFILE, "plugins_dev"),
        plugins_data: path.join(LITELOADER_PROFILE, "plugins_data"),
        plugins_cache: path.join(LITELOADER_PROFILE, "plugins_cache")
    },
    versions: {
        qqnt: qqnt_package.version,
        betterQQNT: liteloader_package.version,
        node: process.versions.node,
        chrome: process.versions.chrome,
        electron: process.versions.electron
    },
    package: {
        qqnt: qqnt_package,
        betterQQNT: liteloader_package
    },
    os: {
        platform: os.platform(),
    },
    config: {}
}


try {
    const data = fs.readFileSync(LiteLoader.path.config, "utf-8");
    LiteLoader.config = JSON.parse(data);
}
catch (error) { }


function output(...args) {
    console.log("\x1b[32m%s\x1b[0m", "LiteLoader:", ...args);
}


module.exports = {
    LiteLoader,
    output
}
