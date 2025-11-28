import search from "./selector/search.js";
import setting from "./selector/setting.js";
import title from "./selector/title.js";
import update from "./selector/update.js";

/**
 * 触发器注册表
 */
const TRIGGERS = [
    search,
    setting,
    title,
    update
];

/**
 * 监听指定元素，如果不存在则等待其出现
 * @param {string} target - 目标选择器
 * @param {Function} callback - 回调函数
 */
function watchElement(target, callback) {
    const check = () => {
        const element = document.querySelector(target);
        if (!element) return false;
        callback(element);
        return true;
    };
    if (check()) return;
    const observer = new MutationObserver(() => {
        if (check()) observer.disconnect();
    });
    observer.observe(document, {
        subtree: true,
        childList: true
    });
}

/**
 * 监听 hash 变化
 * @param {string} target - 目标页面
 * @param {Function} callback - 回调函数
 */
function watchHash(target, callback) {
    const check = () => {
        if (!location.hash.includes(target)) return false;
        callback();
        return true;
    };
    if (check()) return;
    navigation.addEventListener("navigatesuccess", check, { once: true });
}

/**
 * 注册所有触发器
 */
TRIGGERS.forEach((trigger) => {
    watchHash(trigger.hash, () => {
        watchElement(trigger.selector, trigger.action);
    })
});