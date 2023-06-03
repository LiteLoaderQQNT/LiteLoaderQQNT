const path = require("path");


// BetterQQNT的数据目录
const BETTERQQNT_PROFILE = process.env["BETTERQQNT_PROFILE"] || "C:/BetterQQNT";


const betterQQNT = {
    path: {
        profile: BETTERQQNT_PROFILE,
        config: path.join(BETTERQQNT_PROFILE, "config.json"),
        plugins: path.join(BETTERQQNT_PROFILE, "plugins"),
        plugins_dev: path.join(BETTERQQNT_PROFILE, "plugins_dev"),
        plugins_data: path.join(BETTERQQNT_PROFILE, "plugins_data"),
        plugins_cache: path.join(BETTERQQNT_PROFILE, "plugins_cache")
    },
    versions: {
        betterQQNT: null,
        node: process.versions.node,
        chrome: process.versions.chrome,
        electron: process.versions.electron
    }
}


function output(...args) {
    console.log("\x1b[32m%s\x1b[0m", "BetterQQNT:", ...args);
}


module.exports = {
    betterQQNT,
    output
}
