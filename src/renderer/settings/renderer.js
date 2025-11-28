import default_config from "../../common/static/config.json" with {type: "json"};


export function initView(view, html) {
    view.innerHTML = html;
    initVersions(view);
    initPluginList(view);
    initPath(view);
    initAbout(view);
}


export async function appropriateIcon(icon) {
    return icon.endsWith(".svg") ? await (await fetch(icon)).text() : `<img src="${icon}"/>`;
}


async function initVersions(view) {
    if (globalThis.qwqnt) view.querySelector(".versions .qwqnt").style.display = "block";

    view.querySelector(".versions .liteloader .version").textContent = LiteLoader.versions.liteloader;
    view.querySelector(".versions .qqnt .version").textContent = LiteLoader.versions.qqnt;
    view.querySelector(".versions .electron .version").textContent = LiteLoader.versions.electron;
    view.querySelector(".versions .chromium .version").textContent = LiteLoader.versions.chrome;
    view.querySelector(".versions .nodejs .version").textContent = LiteLoader.versions.node;

    const title = view.querySelector(".versions .new setting-text");
    const update_btn = view.querySelector(".versions .new setting-button");

    const jump_link = () => LiteLoader.api.openExternal(update_btn.value);
    const try_again = () => {
        title.textContent = "正在瞅一眼 LiteLoaderQQNT 是否有新版本";
        update_btn.textContent = "你先别急";
        update_btn.value = null;
        update_btn.removeEventListener("click", jump_link);
        update_btn.removeEventListener("click", try_again);
        const repo_url = LiteLoader.package.liteloader.repository.url;
        const release_latest_url = `${repo_url.slice(0, repo_url.lastIndexOf(".git"))}/releases/latest`;
        fetch(release_latest_url).then((res) => {
            const new_version = res.url.slice(res.url.lastIndexOf("/") + 1);
            if (LiteLoader.versions.liteloader != new_version) {
                title.textContent = `发现 LiteLoaderQQNT 新版本 ${new_version}`;
                update_btn.textContent = "去瞅一眼";
                update_btn.value = res.url;
                update_btn.removeEventListener("click", try_again);
                update_btn.addEventListener("click", jump_link);
            }
            else {
                title.textContent = "暂未发现 LiteLoaderQQNT 有新版本，目前已是最新";
                update_btn.textContent = "重新发现";
                update_btn.value = null;
                update_btn.removeEventListener("click", jump_link);
                update_btn.addEventListener("click", try_again);
            }
        }).catch((e) => {
            title.textContent = `检查更新时遇到错误：${e}`;
            update_btn.textContent = "重新发现";
            update_btn.value = null;
            update_btn.removeEventListener("click", jump_link);
            update_btn.addEventListener("click", try_again);
        });
    };
    try_again();
}


async function initPluginList(view) {
    const plugin_item_template = view.querySelector("#plugin-item");
    const plugin_install_button = view.querySelector(".plugins .plugin .install setting-button");
    const plugin_loader_switch = view.querySelector(".plugins .plugin .loader setting-switch");
    const plugin_lists = {
        extension: view.querySelector(".plugins .extension"),
        theme: view.querySelector(".plugins .theme"),
        framework: view.querySelector(".plugins .framework"),
    };

    const input_file = document.createElement("input");
    input_file.type = "file";
    input_file.accept = ".zip,.json";
    input_file.addEventListener("change", async () => {
        const filepath = input_file.files?.[0]?.path;
        const is_install = await LiteLoader.api.plugin.install(filepath);
        alert(is_install ? "插件安装成功" : "无法安装无效插件");
        input_file.value = null;
    });
    plugin_install_button.addEventListener("click", () => input_file.click());

    const config = await LiteLoader.api.config.get("LiteLoader", default_config);
    plugin_loader_switch.setActive(config.enable_plugins);
    plugin_loader_switch.addEventListener("click", () => {
        const isActive = plugin_loader_switch.getActive();
        plugin_loader_switch.setActive(!isActive);
        config.enable_plugins = !isActive;
        LiteLoader.api.config.set("LiteLoader", config);
    });

    const plugin_counts = {
        extension: 0,
        theme: 0,
        framework: 0
    }

    const default_icon = `local://root/src/common/static/default.png`;
    for (const [slug, plugin] of Object.entries(LiteLoader.plugins)) {
        if (plugin.incompatible) continue;

        const plugin_icon = `local:///${plugin.path.plugin}/${plugin.manifest?.icon}`;
        const icon = plugin.manifest?.icon ? plugin_icon : default_icon;

        const plugin_list = plugin_lists[plugin.manifest.type] || plugin_lists.extension;
        const plugin_item = document.importNode(plugin_item_template.content, true).querySelector("setting-item");

        const plugin_item_icon = plugin_item.querySelector(".icon");
        const plugin_item_name = plugin_item.querySelector(".name");
        const plugin_item_description = plugin_item.querySelector(".description");
        const plugin_item_version = plugin_item.querySelector(".version");
        const plugin_item_authors = plugin_item.querySelector(".authors");
        const plugin_item_repo = plugin_item.querySelector(".repo");
        const plugin_item_manager = plugin_item.querySelector(".manager");
        const plugin_item_manager_modal = plugin_item.querySelector(".manager-modal");
        const manager_modal_switch = plugin_item_manager_modal.querySelector(".switch");
        const manager_modal_data = plugin_item_manager_modal.querySelector(".data");
        const manager_modal_self = plugin_item_manager_modal.querySelector(".self");

        plugin_item_icon.innerHTML = await appropriateIcon(icon);
        plugin_item_name.textContent = plugin.manifest.name;
        plugin_item_name.title = plugin.manifest.name;
        plugin_item_description.textContent = plugin.manifest.description;
        plugin_item_description.title = plugin.manifest.description;

        const version_link = document.createElement("setting-link");
        version_link.textContent = plugin.manifest.version;
        plugin_item_version.append(version_link);

        plugin.manifest.authors?.forEach((author, index, array) => {
            const author_link = document.createElement("setting-link");
            author_link.textContent = author.name;
            author_link.setValue(author.link);
            plugin_item_authors.append(author_link);
            if (index < array.length - 1) plugin_item_authors.append(" | ");
        });

        if (plugin.manifest.repository) {
            const { repo, branch } = plugin.manifest.repository
            const repo_link = document.createElement("setting-link");
            repo_link.textContent = repo;
            repo_link.setValue(`https://github.com/${repo}/tree/${branch}`);
            plugin_item_repo.append(repo_link);
        }
        else plugin_item_repo.textContent = "暂无仓库信息";

        plugin_item_manager_modal.setTitle(plugin.manifest.name);
        plugin_item_manager.addEventListener("click", () => {
            const isActive = plugin_item_manager_modal.getActive();
            plugin_item_manager_modal.setActive(!isActive);
        });

        manager_modal_switch.setActive(!config.disabled_plugins.includes(slug));
        manager_modal_switch.addEventListener("click", () => {
            const isActive = manager_modal_switch.getActive();
            manager_modal_switch.setActive(!isActive);
            plugin_item.classList.toggle("disabled", !isActive);
            LiteLoader.api.plugin.disable(slug, !isActive);
        });
        plugin_item.classList.toggle("disabled", !manager_modal_switch.getActive());

        manager_modal_data.setActive(!!config.deleting_plugins?.[slug]?.data_path);
        manager_modal_data.addEventListener("click", () => {
            const isActive = manager_modal_data.getActive();
            manager_modal_data.setActive(!isActive);
            plugin_item.classList.toggle("deleted", !isActive);
            LiteLoader.api.plugin.delete(slug, [manager_modal_self.getActive(), !isActive], false);
        });
        plugin_item.classList.toggle("deleted", manager_modal_data.getActive());

        manager_modal_self.setActive(!!config.deleting_plugins?.[slug]);
        manager_modal_self.addEventListener("click", () => {
            const isActive = manager_modal_self.getActive();
            manager_modal_self.setActive(!isActive);
            plugin_item.classList.toggle("deleted", !isActive);
            LiteLoader.api.plugin.delete(slug, [!isActive, manager_modal_data.getActive()], false);
        });
        plugin_item.classList.toggle("deleted", manager_modal_self.getActive());

        plugin_list.append(plugin_item);

        plugin_counts.total++;
        plugin_counts[plugin.manifest.type]++;
    }

    plugin_lists.extension.setTitle(`扩展 （ ${plugin_counts.extension} 个插件 ）`);
    plugin_lists.theme.setTitle(`主题 （ ${plugin_counts.theme} 个插件 ）`);
    plugin_lists.framework.setTitle(`依赖 （ ${plugin_counts.framework} 个插件 ）`);
}


async function initPath(view) {
    view.querySelector(".path .root").setValue(LiteLoader.path.root);
    view.querySelector(".path .profile").setValue(LiteLoader.path.profile);
}


async function initAbout(view) {
    let visible = true;
    const text = view.querySelector(".about .hitokoto_text");
    const author = view.querySelector(".about .hitokoto_author");
    const observer = new IntersectionObserver((entries) => visible = entries[0].isIntersecting);
    const update = async () => {
        if (!document.hidden && visible) {
            const { hitokoto, creator } = await (await fetch("https://v1.hitokoto.cn")).json();
            text.textContent = hitokoto;
            author.textContent = creator;
        }
    }
    observer.observe(text);
    setInterval(update, 1000 * 10);
    update();
}
