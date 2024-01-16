import { onSettingWindowCreated } from "./setting.js";


export class SettingInterface {
    #nav_bar = document.querySelector(".setting-tab .nav-bar");
    #setting_title = document.querySelector(".setting-main .setting-title");
    #qqnt_setting_view = document.querySelector(".setting-main .q-scroll-view");
    #liteloader_setting_view = document.createElement("div");


    constructor() {
        this.#liteloader_setting_view.classList.add("q-scroll-view", "scroll-view--show-scrollbar");
        document.querySelector(".setting-main .setting-main__content").append(this.#liteloader_setting_view);

        this.#nav_bar.addEventListener("click", event => {
            const target = event.target.closest(".nav-item");
            if (target) {
                // 重新设定激活状态
                this.#nav_bar.childNodes.forEach(node => {
                    node.classList?.remove("nav-item-active");
                });
                target.classList.add("nav-item-active");
                // 内容显示
                if (target.classList.contains("liteloader")) {
                    this.#qqnt_setting_view.style.display = "none";
                    this.#liteloader_setting_view.style.display = "block";
                } else {
                    this.#qqnt_setting_view.style.display = "block";
                    this.#liteloader_setting_view.style.display = "none";
                }
            }
        });

        const style = document.createElement("style");
        style.textContent = `
        .liteloader.dividing_line {
            margin: 5% 30%;
            border: initial;
            border-radius: 4px;
            height: 3px;
            background: rgba(127, 127, 127, 0.5);
        }
        .liteloader.tab-view {
            font-size: 14px;
            padding: 20px 20px 0px;
        }
        .liteloader.disabled {
            pointer-events: none;
            opacity: 0.5;
        }
        `;
        document.head.append(style);

        this.addDividingLine();

        const view = this.getSettingView("config_view");
        this.addNavItme("LiteLoaderQQNT", view);
        onSettingWindowCreated(view);
    }


    // 分割线
    addDividingLine() {
        const dividing_line = document.createElement("hr");
        dividing_line.classList.add("liteloader");
        dividing_line.classList.add("dividing_line");
        this.#nav_bar.append(dividing_line);
    }


    // Setting View
    getSettingView(slug) {
        const view = document.createElement("div");
        view.classList.add("liteloader", "tab-view", slug);
        return view;
    }


    // 导航栏条目
    addNavItme(name, view) {
        const nav_item = this.#nav_bar.querySelector(".nav-item").cloneNode(true);
        nav_item.classList.remove("nav-item-active");
        nav_item.classList.add("liteloader");
        if (!view) {
            nav_item.classList.add("disabled");
        }
        nav_item.querySelector(".q-icon").textContent = null;
        nav_item.querySelector(".name").textContent = name;
        nav_item.addEventListener("click", event => {
            if (!event.currentTarget.classList.contains("nav-item-active")) {
                this.#setting_title.childNodes[1].textContent = name;
                this.#liteloader_setting_view.textContent = null;
                this.#liteloader_setting_view.append(view);
            }
        });
        this.#nav_bar.append(nav_item);
    }
}
