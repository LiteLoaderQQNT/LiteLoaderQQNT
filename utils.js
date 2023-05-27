// 防抖函数
function debounce(fn, time) {
    let timer = null;
    return function (...args) {
        timer && clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, time);
    }
}


function output(...args) {
    console.log("\x1b[32m%s\x1b[0m", "BetterQQNT:", ...args);
}


// 导出
module.exports = {
    debounce,
    output
}