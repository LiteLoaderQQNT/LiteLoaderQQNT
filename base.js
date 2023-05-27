const path = require("path");


// BetterQQNT的数据目录
const BETTERQQNT_PROFILE = process.env["BETTERQQNT_PROFILE"] || "C:/BetterQQNT";
const BETTERQQNT_PLUGINS = path.join(BETTERQQNT_PROFILE, "/plugins");
const BETTERQQNT_PLUGINS_DEV = path.join(BETTERQQNT_PROFILE, "/plugins_dev");
const BETTERQQNT_PLUGINS_DATA = path.join(BETTERQQNT_PROFILE, "/plugins_data");
const BETTERQQNT_PLUGINS_CACHE = path.join(BETTERQQNT_PROFILE, "/plugins_cache");


module.exports = {
    BETTERQQNT_PROFILE,
    BETTERQQNT_PLUGINS,
    BETTERQQNT_PLUGINS_DEV,
    BETTERQQNT_PLUGINS_DATA,
    BETTERQQNT_PLUGINS_CACHE
}
