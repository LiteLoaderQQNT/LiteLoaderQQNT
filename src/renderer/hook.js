import { Runtime } from "./runtime.js"


function recordComponent(component) {
    let element = component.vnode.el;
    while (!(element instanceof HTMLElement)) {
        element = element.parentElement;
    }
    element.__VUE__ = element.__VUE__ || [];
    element.__VUE__.push(component);
    element.classList.add("vue-component");
}


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
                Runtime.triggerHooks("onVueComponentMount", [component]);
            }
        }
    });
}


function watchComponentUnmount(component) {
    let value = null;
    let unhooked = false;
    Object.defineProperty(component, "isUnmounted", {
        get: () => value,
        set(newValue) {
            value = newValue;
            if (!unhooked && value) {
                unhooked = true;
                Runtime.triggerHooks("onVueComponentUnmount", [component]);
            }
        }
    });
}


function proxyProxy(func) {
    return new Proxy(func, {
        construct(target, argArray, newTarget) {
            const component = argArray[0]?._;
            const hasValidUid = component?.uid >= 0;
            if (hasValidUid) {
                const element = component.vnode?.el;
                if (element) {
                    watchComponentUnmount(component);
                    recordComponent(component);
                    Runtime.triggerHooks("onVueComponentMount", [component]);
                } else {
                    watchComponentMount(component);
                }
            }
            return Reflect.construct(target, argArray, newTarget);
        }
    });
}


export function installHook() {
    Proxy = proxyProxy(Proxy);
}