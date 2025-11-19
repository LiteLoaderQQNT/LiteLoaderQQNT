import { BaseSelector } from "../selector.js"

export class Title extends BaseSelector {
    #title = "LiteLoaderNTQQ";
    #random = Math.floor(Math.random() * 1000);

    getHash() {
        return "#/setting";
    }

    getSelector() {
        return ".liteloader.nav-bar .nav-item[data-slug='config_view']";
    }

    trigger(event) {
        const setting_navtab_item = event.detail.element;
        if (this.#random == 0) {
            const name = setting_navtab_item.querySelector(".name");
            name.textContent = this.#title;
        }
    }
}