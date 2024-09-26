import "./components/renderer.js";
import "./easter_eggs/renderer.js";
import { SettingInterface } from "./settings/renderer.js";
import { RendererLoader } from "./loader_core/renderer.js";


const loader = await new RendererLoader().init();


// 寻找指定元素
function findElement(selector, callback) {
    const observer = (_, observer) => {
        const element = document.querySelector(selector);
        if (element) {
            callback(element);
            observer?.disconnect?.();
            return true;
        }
        return false;
    }
    if (!observer()) {
        new MutationObserver(observer).observe(document, {
            subtree: true,
            attributes: false,
            childList: true
        });
    }
}


// 监听页面变化
function watchURLHash(callback) {
    if (!location.hash.includes("#/blank")) {
        callback(location.hash);
    }
    else {
        navigation.addEventListener("navigatesuccess", () => {
            callback(location.hash)
        }, { once: true });
    }
}


// 指定页面触发
watchURLHash((currentHash) => {
    if (currentHash.includes("#/setting")) {
        const settingInterface = new SettingInterface();
        findElement(".setting-tab .nav-bar", () => {
            settingInterface.SettingInit();
            loader.onSettingWindowCreated(settingInterface);
        });
    }
});


Proxy = new Proxy(Proxy, {
    construct(target, argArray, newTarget) {
        const component = argArray[0]?._;
        const element = component?.vnode?.el;
        if (component?.uid >= 0) {
            if (element) {
                watchComponentUnmount(component);
                recordComponent(component);
                loader.onVueComponentMount(component);
            } else watchComponentMount(component);
        }
        return Reflect.construct(target, argArray, newTarget);
    }
});


function recordComponent(component) {
    let element = component.vnode.el;
    while (!(element instanceof HTMLElement)) {
        element = element.parentElement;
    }

    // Expose component to element's __VUE__ property
    if (element.__VUE__) element.__VUE__.push(component);
    else element.__VUE__ = [component];

    // Add class to element
    element.classList.add("vue-component");
}


function watchComponentMount(component) {
    let value = null;
    let hooked = false;
    Object.defineProperty(component.vnode, "el", {
        get() { return value },
        set(newValue) {
            value = newValue;
            if (!hooked && this.el) {
                hooked = true;
                watchComponentUnmount(component);
                loader.onVueComponentMount(component);
            }
            if (value) {
                recordComponent(component);
            }
        }
    });
}


function watchComponentUnmount(component) {
    let value = null;
    let unhooked = false;
    Object.defineProperty(component, "isUnmounted", {
        get() { return value },
        set(newValue) {
            value = newValue;
            if (!unhooked && this.isUnmounted) {
                unhooked = true;
                loader.onVueComponentUnmount(component);
            }
        }
    });
}