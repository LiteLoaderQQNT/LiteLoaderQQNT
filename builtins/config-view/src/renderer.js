export async function onConfigView(view) {
    const plugin_path = betterQQNT.plugins.better_qqnt.path.plugin;
    const css_file_path = `/${plugin_path}/src/style.css`;
    const html_file_path = `/${plugin_path}/src/view.html`;

    // CSS
    const css_text = await (await fetch(css_file_path)).text();
    const style = document.createElement("style");
    style.textContent = css_text;
    view.appendChild(style);


    // HTMl
    const html_text = await (await fetch(html_file_path)).text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html_text, "text/html");
    doc.querySelectorAll("section").forEach(node => view.appendChild(node));


    // 初始化
    // 版本号
    const qqnt = view.querySelector(".versions .qqnt .content");
    const betterqqnt = view.querySelector(".versions .betterqqnt .content");
    const chromium = view.querySelector(".versions .chromium .content");
    const electron = view.querySelector(".versions .electron .content");
    const nodejs = view.querySelector(".versions .nodejs .content");

    qqnt.textContent = betterQQNT.versions.qqnt;
    betterqqnt.textContent = betterQQNT.versions.betterQQNT;
    chromium.textContent = betterQQNT.versions.chrome;
    electron.textContent = betterQQNT.versions.electron;
    nodejs.textContent = betterQQNT.versions.node;


    // 模态窗口
    const modal_window = view.querySelector(".path .modal-window");
    const modal_dialog = view.querySelector(".path .modal-dialog");
    const first = modal_dialog.querySelector(".first");
    const second = modal_dialog.querySelector(".second");

    modal_window.addEventListener("click", event => {
        modal_window.classList.add("hidden");
    });

    modal_dialog.addEventListener("click", event => {
        event.stopPropagation();
    });


    // 数据目录
    const pick_dir = view.querySelector(".path .pick-dir");
    const path_input = view.querySelector(".path .path-input");
    const reset = view.querySelector(".path .ops-btns .reset");
    const apply = view.querySelector(".path .ops-btns .apply");

    path_input.value = betterQQNT.path.profile;

    pick_dir.addEventListener("click", async event => {
        const result = await better_qqnt.showPickDirDialog();
        const path = result.filePaths?.[0];
        if (path) {
            path_input.value = path;
        }
    });

    reset.addEventListener("click", async event => {
        better_qqnt.setProfilePath("").then(() => {
            path_input.value = betterQQNT.path.default_profile;
            first.classList.add("hidden");
            second.classList.remove("hidden");
            setTimeout(() => better_qqnt.quit(), 2000);
        });
        modal_window.classList.remove("hidden");
    });

    apply.addEventListener("click", event => {
        better_qqnt.setProfilePath(path_input.value).then(() => {
            first.classList.add("hidden");
            second.classList.remove("hidden");
            setTimeout(() => better_qqnt.quit(), 2000);
        });
        modal_window.classList.remove("hidden");
    });


    // 插件列表
    const section_plugins = view.querySelector(".plugins");
    const plugin_lists = {
        extension: view.querySelector(".plugins .wrap.extension .list"),
        theme: view.querySelector(".plugins .wrap.theme .list"),
        framework: view.querySelector(".plugins .wrap.framework .list"),
        core: view.querySelector(".plugins .wrap.core .list")
    };

    section_plugins.addEventListener("click", event => {
        const target = event.target.closest(".wrap");
        if (target) {
            const icon = target.querySelector(".title svg");
            const list = target.querySelector(".list");
            icon.classList.toggle("is-fold");
            list.classList.toggle("hidden");
        }
    });

    for (const [slug, plugin] of Object.entries(betterQQNT.plugins)) {
        const hr = document.createElement("hr");
        hr.classList.add("horizontal-dividing-line");

        const plugin_item_html = `
        <div class="vertical-list-item">
            <div>
                <h2>${plugin.manifest.name}</h2>
                <span class="secondary-text">${plugin.manifest.description}</span>
            </div>
            <div class="q-switch is-active">
                <span class="q-switch__handle"></span>
            </div>
        </div>
        `;
        const doc = parser.parseFromString(plugin_item_html, "text/html");

        const plugin_item = doc.querySelector(".vertical-list-item");
        const q_switch = plugin_item.querySelector(".q-switch");

        q_switch.addEventListener("click", () => {
            q_switch.classList.toggle("is-active");
        });

        const plugin_type = plugin.manifest.type;
        const plugin_list = plugin_lists[plugin_type] || plugin_lists.extension;

        plugin_list.appendChild(hr);
        plugin_list.appendChild(plugin_item);
    }
}