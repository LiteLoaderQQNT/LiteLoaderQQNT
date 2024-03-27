class EasterEgg {
    #search_word = ["原神", "卧槽，原", "yuanshen", "我是山里灵活的狗"]; // 关键词列表
    #menu_item_html = `<a class="yuanshen q-context-menu-item q-context-menu-item--normal">
        <div class="q-context-menu-item__icon q-context-menu-item__head">
            <p>w</p>
        </div>
        <span class="q-context-menu-item__text">原！！</span>
    </a>`;
    #url_yuanshen = "https://ys.mihoyo.com/";
    #clickDisabled = false;

    constructor(contact_topbar) {
        // 初始化
        this.contact_topbar = contact_topbar;
        this.adder_button = contact_topbar.querySelector(".contact-adder-btn");
        this.search_input = contact_topbar.querySelector("input");
        this.adder_button.addEventListener("click", this.handleAdderButtonClick.bind(this));
    }

    handleAdderButtonClick() {
        const inputText = this.search_input.value.toLowerCase();
        // 仅检查 包含 关键词
        if (this.#search_word.some(keyword => inputText.includes(keyword.toLowerCase()))) {
            const context_menu = document.querySelector(".q-context-menu");
            // 万一呢？ 所以移除可能存在的项目
            const existingMenuItem = context_menu.querySelector(".yuanshen");
            if (existingMenuItem) {
                existingMenuItem.remove();
            }

            // 创建新菜单 and 添加点击监听
            const template = document.createElement("template");
            template.innerHTML = this.#menu_item_html;
            const menu_item = template.content.firstElementChild;
            menu_item.addEventListener("click", this.execute.bind(this));
            context_menu.append(menu_item);
        }
    }

    execute() {
        if (this.#clickDisabled) {
            return;
        }

        this.#clickDisabled = true;
        setTimeout(() => {
            this.#clickDisabled = false;
        }, 5000); // 有延迟！！！设置过一会才能解决这个问题

        if (this.search_input.value.toLowerCase() === "我是山里灵活的狗") {
            new Notification(
                "原神，启动！",
                {
                    body: "我是神里绫华的狗！",
                    requireInteraction: false
                }
            );
        } else {
            open(this.#url_yuanshen);
        }
    }
}

let search_input;

async function findContactTopBar() {
    // 查找顶栏元素
    const observer = async (_, observer) => {
        const contact_topbar = document.querySelector(".contact-top-bar");
        if (contact_topbar) {
            search_input = contact_topbar.querySelector("input");
            new EasterEgg(contact_topbar);
            observer.disconnect();
            return true;
        }
        return false;
    };
    if (!(await observer())) {
        new MutationObserver(observer).observe(document, {
            subtree: true,
            attributes: false,
            childList: true
        });
    }
}

function onNavigationSuccess(event) {
    // 移除监听 让回调只被执行一次
    if (event.target.currentEntry.url.includes("#/main")) {
        findContactTopBar();
        navigation.removeEventListener("navigatesuccess", onNavigationSuccess);
    }
}

if (location.hash.includes("#/blank")) {
    navigation.addEventListener("navigatesuccess", onNavigationSuccess);
} else if (location.hash.includes("#/main")) {
    findContactTopBar();
}
