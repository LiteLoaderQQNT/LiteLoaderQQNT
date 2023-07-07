export async function onConfigView(view) {
    const plugin_path = LiteLoader.plugins.config_view.path.plugin;
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


    // 初始化
    // 版本号
    const qqnt = view.querySelector(".versions .qqnt .content");
    const liteloader = view.querySelector(".versions .liteloader .content");
    const chromium = view.querySelector(".versions .chromium .content");
    const electron = view.querySelector(".versions .electron .content");
    const nodejs = view.querySelector(".versions .nodejs .content");

    qqnt.textContent = LiteLoader.versions.qqnt;
    liteloader.textContent = LiteLoader.versions.liteLoader;
    chromium.textContent = LiteLoader.versions.chrome;
    electron.textContent = LiteLoader.versions.electron;
    nodejs.textContent = LiteLoader.versions.node;


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

    path_input.value = LiteLoader.path.profile;

    pick_dir.addEventListener("click", async event => {
        const result = await config_view.showPickDirDialog();
        const path = result.filePaths?.[0];
        if (path) {
            path_input.value = path;
        }
    });

    reset.addEventListener("click", async event => {
        config_view.setProfilePath("").then(() => {
            path_input.value = LiteLoader.path.default_profile;
            first.classList.add("hidden");
            second.classList.remove("hidden");
            setTimeout(() => config_view.quit(), 2000);
        });
        modal_window.classList.remove("hidden");
    });

    apply.addEventListener("click", event => {
        config_view.setProfilePath(path_input.value).then(() => {
            first.classList.add("hidden");
            second.classList.remove("hidden");
            setTimeout(() => config_view.quit(), 2000);
        });
        modal_window.classList.remove("hidden");
    });

    // 非Windows平台禁止修改
    if (LiteLoader.os.platform != "win32") {
        path_input.readOnly = true;
        pick_dir.classList.add("disabled");
        reset.classList.add("disabled");
        apply.classList.add("disabled");
        pick_dir.previousElementSibling.textContent += "（非Windows平台请手动更改环境变量）"
    }


    // 插件列表
    const section_plugins = view.querySelector(".plugins");
    const plugin_lists = {
        extension: view.querySelector(".plugins .wrap.extension ul"),
        theme: view.querySelector(".plugins .wrap.theme ul"),
        framework: view.querySelector(".plugins .wrap.framework ul"),
        core: view.querySelector(".plugins .wrap.core ul")
    };

    section_plugins.addEventListener("click", event => {
        const target = event.target.closest(".title");
        if (target) {
            const icon = target.querySelector("svg");
            const list = target.nextElementSibling;
            icon.classList.toggle("is-fold");
            list.classList.toggle("hidden");
        }
    });

    const disabled_list = await config_view.getDisabledList();

    for (const [slug, plugin] of Object.entries(LiteLoader.plugins)) {
        const hr = document.createElement("hr");
        hr.classList.add("horizontal-dividing-line");

        const plugin_item_html = `
        <li class="vertical-list-item">
            <div>
                <h2>${plugin.manifest.name}</h2>
                <span class="secondary-text">${plugin.manifest.description}</span>
            </div>
            <div class="q-switch is-active">
                <span class="q-switch__handle"></span>
            </div>
        </li>
        `;
        const doc = parser.parseFromString(plugin_item_html, "text/html");

        const plugin_item = doc.querySelector(".vertical-list-item");
        const q_switch = plugin_item.querySelector(".q-switch");

        q_switch.addEventListener("click", async () => {
            const disabled_list = await config_view.getDisabledList();
            let new_disabled_list = [];
            if (q_switch.classList.contains("is-active")) {
                new_disabled_list = [...disabled_list, slug];
            }
            else {
                new_disabled_list = disabled_list.filter(value => value != slug);
            }
            await config_view.setDisabledList(new_disabled_list);
            q_switch.classList.toggle("is-active");
        });

        if (disabled_list.includes(slug)) {
            q_switch.classList.remove("is-active");
        }

        const plugin_type = plugin.manifest.type;
        const plugin_list = plugin_lists[plugin_type] || plugin_lists.extension;

        plugin_list.appendChild(hr);
        plugin_list.appendChild(plugin_item);
    }
}