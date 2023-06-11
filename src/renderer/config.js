export class PluginConfigView {
    constructor() {
        // 基本框架
        this.nav_bar = document.querySelector(".setting-tab .nav-bar");
        this.setting_title = document.querySelector(".setting-main .setting-title");
        this.scroll_view = document.querySelector(".setting-main .q-scroll-view");
        // 设置界面
        const setting_view = document.createElement("div");
        setting_view.classList.add("betterqqnt");
        setting_view.classList.add("q-scroll-view");
        setting_view.style.display = "none";
        const setting_main = document.querySelector(".setting-main .setting-main__content");
        setting_main.appendChild(setting_view);
        this.setting_view = setting_view;
        // 处理点击
        this.nav_bar.addEventListener("click", event => {
            const target = event.target.closest(".nav-item");
            if (target && !target.classList.contains("qwq")) {
                this.nav_bar.childNodes.forEach(node => {
                    node.classList?.remove("nav-item-active", "qwq");
                });
                target.classList.add("nav-item-active", "qwq");
                // 内容显示
                const contains_betterqqnt = target.classList.contains("betterqqnt");
                this.scroll_view.style.display = contains_betterqqnt ? "none" : "block";
                this.setting_view.style.display = contains_betterqqnt ? "block" : "none";
            }
        });
    }


    // 分割线
    createDividingLine() {
        const dividing_line = document.createElement("hr");
        dividing_line.style.margin = "5% 30%";
        dividing_line.style.border = "initial";
        dividing_line.style.borderRadius = "4px";
        dividing_line.style.height = "3px";
        dividing_line.style.background = "rgba(127, 127, 127, 0.5)";
        this.nav_bar.appendChild(dividing_line);
    }


    // 导航栏条目
    createNavItme(name, view) {
        const nav_item = this.nav_bar.querySelector(".nav-item").cloneNode(true);
        nav_item.classList.remove("nav-item-active");
        nav_item.classList.add("betterqqnt");
        nav_item.addEventListener("click", event => {
            const classList = event.currentTarget.classList;
            if (!classList.contains("nav-item-active")) {
                this.setting_title.childNodes[1].textContent = name;
                // 添加内容
                this.setting_view.textContent = null;
                this.setting_view.appendChild(view);
            }
        });
        nav_item.querySelector(".q-icon").textContent = null;
        nav_item.querySelector(".name").textContent = name;
        this.nav_bar.appendChild(nav_item);
    }
}