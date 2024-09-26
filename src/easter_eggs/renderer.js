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


// 加载彩蛋
function loadEasterEggs(easter_eggs) {
    watchURLHash((currentHash) => {
        for (const { hash, selector, trigger } of easter_eggs) {
            if (currentHash.includes(hash)) {
                findElement(selector, trigger);
            }
        }
    })
}


// 指定页面触发
loadEasterEggs([
    {
        hash: "#/setting",
        selector: ".liteloader.nav-bar .nav-item[data-slug='config_view']",
        trigger: (settingn_navtab_item) => {
            const new_name = "LiteLoaderNTQQ"
            const random_number = Math.floor(Math.random() * 10000);
            const name = settingn_navtab_item.querySelector(".name");
            if (random_number == 0) {
                name.textContent = new_name;
            }
        }
    },
    {
        hash: "#/setting",
        selector: ".config_view .versions .new setting-button",
        trigger: (check_update_button) => {
            let click_count = 0;
            check_update_button.addEventListener("click", () => {
                click_count++;
                if (click_count == 20) {
                    click_count = 0;
                    new Notification(
                        "LiteLoaderQQNT",
                        {
                            body: "你咋这么急着更新？\n你就不能再等等？\n或者来催一下沫烬染（",
                            requireInteraction: true
                        }
                    );
                }
            });
        }
    },
    {
        hash: "#/main",
        selector: ".contact-top-bar",
        trigger: (contact_topbar) => {
            const search_word = "furry";
            const images_apis = [
                "https://uapis.cn/api/imgapi/furry/img4k.php",
                "https://uapis.cn/api/imgapi/furry/imgz4k.php",
                "https://uapis.cn/api/imgapi/furry/imgs4k.php"
            ];
            const menu_item_template = document.createElement("template");
            menu_item_template.innerHTML = `
            <a class="furry q-context-menu-item q-context-menu-item--normal">
                <div class="q-context-menu-item__icon q-context-menu-item__head">
                    <svg class="q-icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                        <path d="M883.4270416 765.53910283c-24.80807549-60.6085831-112.77476016-76.35497344-154.46940381-118.09441494-87.35091856-87.48180176-66.50359717-230.6908582-216.83744297-239.31158203-150.51040664 8.62072295-129.57436494 151.8297794-217.0131249 239.31158203-41.78336309 41.74032041-129.57348692 57.48583271-154.46852578 118.09441494-30.52389375 74.50767598 19.70450947 141.80096426 57.44279092 170.78676152 75.91401123 58.10247685 197.83478408 0.65792988 279.64380937-7.9162374 11.70043067-1.27808789 23.04686162-1.45201289 34.30720899-1.45201289 11.17250596 0 22.60765635 0.173925 34.30720898 1.45201289 81.72030586 8.57416729 203.81763955 66.01783623 279.73340771 7.9162374 37.73652451-28.98579727 87.87533027-96.27908555 57.35407149-170.78676152M955.82038203 436.98626299c-19.70450947 73.84798916-80.75141895 121.74509092-136.17210761 106.87798915-55.32933428-14.91102158-84.27033281-86.73427441-64.39101944-160.66922607 19.70450947-73.84798916 80.66709141-121.70117021 136.08426709-106.83494735 55.50765205 14.86534482 84.27296777 86.73427441 64.47885996 160.62618427M268.89441523 383.28111055c19.70450947 73.84798916-9.05992823 145.84955888-64.56758027 160.62794033C148.99750068 558.7743957 87.94883428 510.92121465 68.2443248 437.07322549c-19.79322891-73.97887237 9.05904932-145.84780195 64.39101944-160.71314678 55.50589512-14.77838232 116.37800068 32.9869582 136.25907099 106.92103184M473.8548667 171.54811162c19.79322891 73.80319043-9.05992823 145.76083945-64.47885996 160.62618428-55.41805371 14.77838232-116.37975761-33.07567763-136.0842671-106.83494648-19.87931338-73.97975127 8.97296572-145.84780195 64.4806169-160.62618429C393.19041026 49.84694141 454.1503581 97.61315996 473.8548667 171.54811162M750.86080947 225.33934942c-19.79147198 73.75926972-80.75317588 121.65637148-136.2599499 106.79102577-55.2432498-14.82230214-84.18249141-86.82299385-64.39101944-160.58226357 19.79235-73.84798916 80.75317588-121.70117021 136.08426709-106.83494649 55.41893262 14.77838232 84.35817334 86.73515332 64.56670225 160.62618428" fill="currentColor"></path>
                    </svg>
                </div>
                <span class="q-context-menu-item__text">随机 Furry 图片</span>
            </a>`;
            const menu_item = menu_item_template.content.firstElementChild;
            const adder_button = contact_topbar.querySelector(".contact-adder-btn");
            const search_input = contact_topbar.querySelector("input");
            menu_item.addEventListener("click", () => {
                const random_image = images_apis[Math.floor(Math.random() * images_apis.length)];
                LiteLoader.api.openExternal(random_image);
            });
            adder_button.addEventListener("click", () => {
                if (search_input.value.toLowerCase() == search_word) {
                    const context_menu = document.querySelector(".q-context-menu");
                    context_menu.append(menu_item);
                }
            });
        }
    }
]);