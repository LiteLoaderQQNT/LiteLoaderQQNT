import { BaseSelector } from "../selector.js"

export class Update extends BaseSelector {
    #message = "你咋这么急着更新？\n你就不能再等等？\n或者来催一下沫烬染（";
    #counting = 0;

    getHash() {
        return "#/setting";
    }

    getSelector() {
        return ".config_view .versions .new setting-button";
    }

    trigger(event) {
        const check_update_button = event.detail.element;
        check_update_button.addEventListener("click", () => {
            this.#counting++;
            if (this.#counting == 20) {
                this.#counting = 0;
                new Notification("LiteLoaderQQNT", { body: this.#message, });
            }
        });
    }
}