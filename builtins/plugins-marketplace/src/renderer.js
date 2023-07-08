function createPluginItem() {
    const parser = new DOMParser();
    return plugin => {
        const temp = `
        <div class="wrap">
            <div class="vertical-list-item">
                <img src="${plugin.thumbnail}" class="thumbnail">
                <div class="info">
                    <h2 class="name">${plugin.name}</h2>
                    <p class="secondary-text description">${plugin.description}</p>
                </div>
                <div class="ops-btns">
                    <button class="q-button q-button--small q-button--secondary details">详情</button>
                    <button class="q-button q-button--small q-button--secondary install">安装</button>
                </div>
            </div>
            <hr class="horizontal-dividing-line" />
            <div class="vertical-list-item">
                <p class="secondary-text extra-information">
                    <span>类型：${plugin.type}</span>
                    <span>版本号：${plugin.version}</span>
                    <span>最后更新：${plugin.last_updated}</span>
                    <span>开发者：
                        <a href="${plugin.author.link}">${plugin.author.name}</a>
                    </span>
                </p>
            </div>
        </div>
        `;
        const doc = parser.parseFromString(temp, "text/html");
        return doc.querySelector(".wrap");
    }
}


export async function onConfigView(view) {
    const plugin_path = LiteLoader.plugins.plugins_marketplace.path.plugin;
    const css_file_path = `file://${plugin_path}/src/style.css`;
    const html_file_path = `file://${plugin_path}/src/view.html`;

    // CSS
    const link_element = document.createElement("link");
    link_element.rel = "stylesheet";
    link_element.href = css_file_path;
    document.head.appendChild(link_element);


    // HTMl
    const html_text = await (await fetch(html_file_path)).text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html_text, "text/html");
    doc.querySelectorAll("section").forEach(node => view.appendChild(node));

    const list_ctl = view.querySelector(".list-ctl");
    const search_input = list_ctl.querySelector(".search-input");
    const type = list_ctl.querySelector(".type");
    const adv_ops_btn = list_ctl.querySelector(".adv-ops-btn");
    const adv_ops_list = list_ctl.querySelector(".adv-ops-list");

    adv_ops_btn.addEventListener("click", () => {
        const icon = adv_ops_btn.querySelector(".icon");
        icon.classList.toggle("is-fold");
        adv_ops_btn.classList.toggle("is-active");
        adv_ops_list.classList.toggle("hidden");
    });

    const all_pulldown_menu_button = list_ctl.querySelectorAll(".q-pulldown-menu-button");
    for (const pulldown_menu_button of all_pulldown_menu_button) {
        pulldown_menu_button.addEventListener("click", event => {
            const context_menu = event.currentTarget.nextElementSibling;
            context_menu.classList.toggle("hidden");
        });
    }

    // 点击其他地方收起下拉选择框
    addEventListener("pointerup", event => {
        if (event.target.closest(".q-pulldown-menu-button")) {
            return
        }
        if (!event.target.closest(".q-context-menu")) {
            const all_context_menu = list_ctl.querySelectorAll(".q-context-menu");
            for (const context_menu of all_context_menu) {
                context_menu.classList.add("hidden");
            }
        }
    });

    const plugin_list = view.querySelector(".plugin-list");
    const pluginItem = createPluginItem();
    const plugin_info = {
        thumbnail: `https://avatars.githubusercontent.com/u/66980784`,
        name: "这里是插件名称",
        description: "为了测试插件市场而写的描述，为了测试插件市场而写的描述，为了测试插件市场而写的描述，为了测试插件市场而写的描述，为了测试插件市场而写的描述",
        type: "扩展",
        version: "0.0.0",
        last_updated: "2023-7-8 | 12:05",
        author: {
            name: "沫烬染",
            link: "https://github.com/mo-jinran"
        }
    }

    const fragment = document.createDocumentFragment();

    for (let _ = 0; _ < 10; _++) {
        const plugin_item = pluginItem(plugin_info);
        fragment.appendChild(plugin_item);
    }

    plugin_list.appendChild(fragment);
}