import "./renderer/components/renderer.js";
import "./renderer/triggers/renderer.js";
import { loader } from "./renderer/loader.js";


/**
 * 记录 Vue 组件到 DOM 元素
 */
function recordComponent(component) {
    let element = component.vnode.el;
    while (!(element instanceof HTMLElement)) {
        element = element.parentElement;
    }
    // 将组件暴露到元素的 __VUE__ 属性
    element.__VUE__ = element.__VUE__ || [];
    element.__VUE__.push(component);
    element.classList.add("vue-component");
}

/**
 * 监听组件挂载
 */
function watchComponentMount(component) {
    let value = null;
    let hooked = false;
    Object.defineProperty(component.vnode, "el", {
        get: () => value,
        set(newValue) {
            value = newValue;
            if (!hooked && value) {
                hooked = true;
                watchComponentUnmount(component);
                recordComponent(component);
                loader.onVueComponentMount(component);
            }
        }
    });
}

/**
 * 监听组件卸载
 */
function watchComponentUnmount(component) {
    let value = null;
    let unhooked = false;
    Object.defineProperty(component, "isUnmounted", {
        get: () => value,
        set(newValue) {
            value = newValue;
            if (!unhooked && value) {
                unhooked = true;
                loader.onVueComponentUnmount(component);
            }
        }
    });
}

/**
 * 代理 Proxy 构造函数以拦截 Vue 组件创建
 */
Proxy = new Proxy(Proxy, {
    construct(target, argArray, newTarget) {
        const component = argArray[0]?._;
        const hasValidUid = component?.uid >= 0;
        if (hasValidUid) {
            const element = component.vnode?.el;
            if (element) {
                watchComponentUnmount(component);
                recordComponent(component);
                loader.onVueComponentMount(component);
            } else {
                watchComponentMount(component);
            }
        }
        return Reflect.construct(target, argArray, newTarget);
    }
});