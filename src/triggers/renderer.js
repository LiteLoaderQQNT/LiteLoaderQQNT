import { Search } from "./selector/search.js";
import { Setting } from "./selector/setting.js";
import { Title } from "./selector/title.js";
import { Update } from "./selector/update.js";

/**
 * 触发器注册表
 */
const TRIGGERS = [
    Search,
    Setting,
    Title,
    Update
];

/**
 * 监听指定元素，如果不存在则等待其出现
 * @param {string} target - 目标选择器
 * @param {Function} callback - 回调函数
 */
function watchElement(target, callback) {
    const check = () => {
        const element = document.querySelector(target);
        if (element) {
            callback(element);
            return true;
        }
        return false;
    };
    if (check()) return;
    const observer = new MutationObserver(() => {
        if (check()) {
            observer.disconnect();
        }
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
        if (location.hash.includes(target)) {
            callback();
            return true;
        }
        return false;
    };
    if (check()) return;
    navigation.addEventListener("navigatesuccess", check, { once: true });
}

/**
 * 注册所有触发器
 */
TRIGGERS.forEach((Trigger) => {
    const trigger = new Trigger();
    const hash = trigger.getHash();
    const selector = trigger.getSelector();
    watchHash(hash, () => {
        watchElement(selector, (element) => {
            trigger.dispatchEvent(new CustomEvent("trigger", {
                bubbles: true,
                composed: true,
                detail: { element }
            }));
        });
    })
});