import { onSettingWindowCreated } from "./setting.js";


export class SettingInterface {
    #setting_title = document.querySelector(".setting-main .setting-title");
    #liteloader_nav_bar = document.createElement("div");
    #liteloader_setting_view = document.createElement("div");


    constructor() {
        const style = document.createElement("style");
        style.textContent = `
        .setting-tab {
            display: flex;
            flex-direction: column;
        }
        .setting-tab .nav-bar {
            flex-shrink: 0;
        }
        .liteloader.nav-bar {
            flex: 1;
            margin-top: 25px;
            overflow-x: hidden;
            overflow-y: scroll;
        }
        .liteloader.nav-bar::before {
            content: "";
            display: block;
            position: absolute;
            transform: translate(50px, -15px);
            width: 100px;
            height: 5px;
            border-radius: 5px;
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

        this.#liteloader_nav_bar.classList.add("nav-bar", "liteloader");
        document.querySelector(".setting-tab").append(this.#liteloader_nav_bar);

        this.#liteloader_setting_view.classList.add("q-scroll-view", "scroll-view--show-scrollbar");
        document.querySelector(".setting-main .setting-main__content").append(this.#liteloader_setting_view);

        const qqnt_setting_view = document.querySelector(".setting-main .q-scroll-view");
        document.querySelector(".setting-tab").addEventListener("click", event => {
            const nav_item = event.target.closest(".nav-item");
            if (nav_item) {
                // 重新设定激活状态
                document.querySelectorAll(".setting-tab .nav-item").forEach(element => {
                    element.classList.remove("nav-item-active");
                });
                nav_item.classList.add("nav-item-active");
                // 内容显示
                if (nav_item.classList.contains("liteloader")) {
                    qqnt_setting_view.style.display = "none";
                    this.#liteloader_setting_view.style.display = "block";
                }
                else {
                    qqnt_setting_view.style.display = "block";
                    this.#liteloader_setting_view.style.display = "none";
                }
            }
        });

        const view = this.getSettingView("config_view");
        this.addNavItme("LiteLoaderQQNT", view);
        onSettingWindowCreated(view);
    }


    // Setting View
    getSettingView(slug) {
        const view = document.createElement("div");
        view.classList.add("liteloader", "tab-view", slug.replace(" ", '-'));
        return view;
    }


    // 导航栏条目
    addNavItme(name, view) {
        const nav_item = document.querySelector(".setting-tab .nav-item").cloneNode(true);
        nav_item.classList.remove("nav-item-active");
        nav_item.classList.add("liteloader");
        nav_item.querySelector(".q-icon").textContent = null;
        nav_item.querySelector(".name").textContent = name;
        nav_item.addEventListener("click", event => {
            if (!event.currentTarget.classList.contains("nav-item-active")) {
                this.#setting_title.childNodes[1].textContent = name;
                this.#liteloader_setting_view.textContent = null;
                this.#liteloader_setting_view.append(view);
            }
        });
        this.#liteloader_nav_bar.append(nav_item);
    }
}
