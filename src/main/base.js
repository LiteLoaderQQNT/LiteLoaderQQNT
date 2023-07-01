const path = require("path");
const fs = require("fs");
const os = require("os");
const betterQQNT_package = require("../../package.json");
const qqnt_package = require("../../../package.json");


// BetterQQNT的数据目录
const BETTERQQNT_PROFILE_ENV = process.env["BETTERQQNT_PROFILE"];
const BETTERQQNT_PROFILE_COSNT = `${os.homedir()}/Documents/BetterQQN`;
const BETTERQQNT_PROFILE = BETTERQQNT_PROFILE_ENV || BETTERQQNT_PROFILE_COSNT;


const betterQQNT = {
    path: {
        root: path.join(__dirname, "../../"),
        builtins: path.join(__dirname, "../../builtins"),
        default_profile: BETTERQQNT_PROFILE,
        profile: BETTERQQNT_PROFILE,
        config: path.join(BETTERQQNT_PROFILE, "config.json"),
        plugins: path.join(BETTERQQNT_PROFILE, "plugins"),
        plugins_dev: path.join(BETTERQQNT_PROFILE, "plugins_dev"),
        plugins_data: path.join(BETTERQQNT_PROFILE, "plugins_data"),
        plugins_cache: path.join(BETTERQQNT_PROFILE, "plugins_cache")
    },
    versions: {
        qqnt: qqnt_package.version,
        betterQQNT: betterQQNT_package.version,
        node: process.versions.node,
        chrome: process.versions.chrome,
        electron: process.versions.electron
    },
    package: {
        qqnt: qqnt_package,
        betterQQNT: betterQQNT_package
    },
    config: {}
}


try {
    const data = fs.readFileSync(betterQQNT.path.config, "utf-8");
    betterQQNT.config = JSON.parse(data);
}
catch (error) { }


function output(...args) {
    console.log("\x1b[32m%s\x1b[0m", "BetterQQNT:", ...args);
}


module.exports = {
    betterQQNT,
    output
}
