class EasterEgg {

    #click_count = 0;

    constructor(check_update_button) {
        check_update_button.addEventListener("click", () => {
            this.#click_count++;
            if (this.#click_count == 20) {
                this.#click_count = 0;
                this.#execute();
            }
        });
    }

    #execute() {
        new Notification(
            "LiteLoaderQQNT",
            {
                body: "你咋这么急着更新？\n你就不能再等等？\n或者来催一下沫烬染（",
                requireInteraction: true
            }
        );
    }

}


// 寻找检查更新按钮
async function findCheckUpdateButton() {
    const observer = async (_, observer) => {
        const check_update_button = document.querySelector(".config_view .versions .new SETTING-BUTTON");
        if (check_update_button) {
            new EasterEgg(check_update_button);
            observer?.disconnect?.();
            return true;
        }
        return false;
    }
    if (!await observer()) {
        new MutationObserver(observer).observe(document, {
            subtree: true,
            attributes: false,
            childList: true
        });
    }
}


// 监听页面变化
if (location.hash.includes("#/blank")) {
    const navigatesuccess = async event => {
        if (event.target.currentEntry.url.includes("#/setting")) {
            findCheckUpdateButton();
        }
        navigation.removeEventListener("navigatesuccess", navigatesuccess);
    }
    navigation.addEventListener("navigatesuccess", navigatesuccess);
}
else if (location.hash.includes("#/setting")) {
    findCheckUpdateButton();
}
