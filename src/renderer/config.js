export class PluginConfigView {
    constructor() {
        // 基本框架
        this.nav_bar = document.querySelector(".setting-tab .nav-bar");
        this.setting_main = document.querySelector(".setting-main");
        this.setting_title = this.setting_main.querySelector(".setting-title");
        this.setting_content = this.setting_main.querySelector(".setting-main__content");
        // 设置界面
        this.liteloader_setting_content = document.createElement("div");
        this.liteloader_setting_content.classList.add("liteloader");
        this.liteloader_setting_content.classList.add("setting-main__content");
        this.liteloader_setting_content.style.display = "none";
        this.setting_main.appendChild(this.liteloader_setting_content);
        // 处理点击
        this.nav_bar.addEventListener("click", event => {
            const target = event.target.closest(".nav-item");
            if (target && !target.classList.contains("qwq")) {
                this.nav_bar.childNodes.forEach(node => {
                    node.classList?.remove("nav-item-active", "qwq");
                });
                target.classList.add("nav-item-active", "qwq");
                // 内容显示
                const contains_liteloader = target.classList.contains("liteloader");
                this.setting_content.style.display = contains_liteloader ? "none" : "block";
                this.liteloader_setting_content.style.display = contains_liteloader ? "block" : "none";
            }
        });
        // 基本样式
        const style = document.createElement("style");
        style.textContent = `
        .liteloader.disabled {
            pointer-events: none;
            opacity: 0.5;
        }
        .liteloader.dividing_line {
            margin: 5% 30%;
            border: initial;
            border-radius: 4px;
            height: 3px;
            background: rgba(127, 127, 127, 0.5);
        }
        .liteloader.setting-main__content {
            height: calc(100% - 70px);
            margin-bottom: 20px;
            overflow-y: scroll;
        }
        `;
        document.head.appendChild(style);
    }


    // 分割线
    createDividingLine() {
        const dividing_line = document.createElement("hr");
        dividing_line.classList.add("liteloader");
        dividing_line.classList.add("dividing_line");
        this.nav_bar.appendChild(dividing_line);
    }


    // 导航栏条目
    createNavItme(name, view, enable) {
        const nav_item = this.nav_bar.querySelector(".nav-item").cloneNode(true);
        nav_item.classList.remove("nav-item-active");
        nav_item.classList.add("liteloader");
        nav_item.addEventListener("click", event => {
            const classList = event.currentTarget.classList;
            if (classList.contains("nav-item-active")) {
                return;
            }
            // 添加内容
            if (LiteLoader.os.platform == "win32") {
                this.setting_title.childNodes[1].textContent = name;
                const liteloader_setting_view = document.createElement("div");
                liteloader_setting_view.classList.add("q-scroll-view");
                liteloader_setting_view.appendChild(view);
                this.liteloader_setting_content.textContent = null;
                this.liteloader_setting_content.appendChild(liteloader_setting_view);
            }
            if (LiteLoader.os.platform == "linux") {
                this.setting_title.textContent = name;
                this.liteloader_setting_content.textContent = null;
                this.liteloader_setting_content.appendChild(view);
            }
            if (LiteLoader.os.platform == "darwin") {
                this.setting_title.textContent = name;
                this.liteloader_setting_content.textContent = null;
                this.liteloader_setting_content.appendChild(view);
            }
        });
        nav_item.querySelector(".q-icon").textContent = null;
        nav_item.querySelector(".name").textContent = name;
        // 禁用插件
        if (!enable) {
            nav_item.classList.add("disabled");
        }
        this.nav_bar.appendChild(nav_item);
    }
}