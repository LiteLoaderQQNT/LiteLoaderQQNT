import default_config from "./static/config.json" with {type: "json"};


export function initView(view, html) {
    view.innerHTML = html;
    initVersions(view);
    initPluginList(view);
    initPath(view);
    initAbout(view);
}


export async function appropriateIcon(pluginIconUrlUsingLocalPotocol) {
    if (pluginIconUrlUsingLocalPotocol.endsWith('.svg')) {
        return await (await fetch(pluginIconUrlUsingLocalPotocol)).text();
    } else {
        return `<img src="${pluginIconUrlUsingLocalPotocol}"/>`;
    }
}


// 比较版本号
function compareVersions(v1, v2) {
    const v1Parts = v1.split(/[.-]/).map(part => isNaN(part) ? 0 : Number(part));
    const v2Parts = v2.split(/[.-]/).map(part => isNaN(part) ? 0 : Number(part));
    for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
        const p1 = v1Parts[i] || 0;
        const p2 = v2Parts[i] || 0;
        if (p1 !== p2) return p1 < p2;
    }
    return false;
}


async function initVersions(view) {
    if (globalThis.qwqnt) {
        view.querySelector(".versions .qwqnt").style.display = "block";
    }

    const liteloader = view.querySelectorAll(".versions .current .liteloader setting-text");
    const qqnt = view.querySelectorAll(".versions .current .qqnt setting-text");
    const electron = view.querySelectorAll(".versions .current .electron setting-text");
    const chromium = view.querySelectorAll(".versions .current .chromium setting-text");
    const nodejs = view.querySelectorAll(".versions .current .nodejs setting-text");

    liteloader[1].textContent = LiteLoader.versions.liteloader;
    qqnt[1].textContent = LiteLoader.versions.qqnt;
    electron[1].textContent = LiteLoader.versions.electron;
    chromium[1].textContent = LiteLoader.versions.chrome;
    nodejs[1].textContent = LiteLoader.versions.node;

    const title = view.querySelector(".versions .new setting-text");
    const update_btn = view.querySelector(".versions .new setting-button");

    const jump_link = () => LiteLoader.api.openExternal(update_btn.value);
    const try_again = () => {
        // 初始化 显示
        title.textContent = "正在瞅一眼 LiteLoaderQQNT 是否有新版本";
        update_btn.textContent = "你先别急";
        update_btn.value = null;
        update_btn.removeEventListener("click", jump_link);
        update_btn.removeEventListener("click", try_again);
        // 检测是否有新版
        const repo_url = LiteLoader.package.liteloader.repository.url;
        const release_latest_url = `${repo_url.slice(0, repo_url.lastIndexOf(".git"))}/releases/latest`;
        fetch(release_latest_url).then((res) => {
            const new_version = res.url.slice(res.url.lastIndexOf("/") + 1);
            // 有新版
            if (compareVersions(LiteLoader.versions.liteloader, new_version)) {
                title.textContent = `发现 LiteLoaderQQNT 新版本 ${new_version}`;
                update_btn.textContent = "去瞅一眼";
                update_btn.value = res.url;
                update_btn.removeEventListener("click", try_again);
                update_btn.addEventListener("click", jump_link);
            }
            // 没新版
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
        const config = await LiteLoader.api.config.get("LiteLoader", default_config);
        const has_install = Object.values(config.installing_plugins).some(item => item.plugin_path == filepath);
        const is_install = await LiteLoader.api.plugin.install(filepath, has_install);
        alert(is_install ? (has_install ? "已取消安装此插件" : "将在下次启动时安装") : "无法安装无效插件");
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

    for (const [slug, plugin] of Object.entries(LiteLoader.plugins)) {
        // 跳过不兼容插件
        if (plugin.incompatible) {
            continue;
        }

        const default_icon = `local://root/src/settings/static/default.png`;
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
        const manager_modal_enable = plugin_item_manager_modal.querySelector(".enable");
        const manager_modal_keepdata = plugin_item_manager_modal.querySelector(".keepdata");
        const manager_modal_uninstall = plugin_item_manager_modal.querySelector(".uninstall");

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
            if (index < array.length - 1) {
                plugin_item_authors.append(" | ");
            }
        });

        if (plugin.manifest.repository) {
            const { repo, branch } = plugin.manifest.repository
            const repo_link = document.createElement("setting-link");
            repo_link.textContent = repo;
            repo_link.setValue(`https://github.com/${repo}/tree/${branch}`);
            plugin_item_repo.append(repo_link);
        } else plugin_item_repo.textContent = "暂无仓库信息";

        plugin_item_manager_modal.setTitle(plugin.manifest.name);
        plugin_item_manager.addEventListener("click", () => {
            const isActive = plugin_item_manager_modal.getActive();
            plugin_item_manager_modal.setActive(!isActive);
        });

        manager_modal_enable.setActive(!config.disabled_plugins.includes(slug));
        manager_modal_enable.addEventListener("click", () => {
            const isActive = manager_modal_enable.getActive();
            manager_modal_enable.setActive(!isActive);
            plugin_item.classList.toggle("disabled", isActive);
            LiteLoader.api.plugin.disable(slug, !isActive);
        });
        plugin_item.classList.toggle("disabled", !manager_modal_enable.getActive());

        manager_modal_keepdata.setActive(!!config.deleting_plugins?.[slug]?.data_path);
        manager_modal_keepdata.addEventListener("click", async () => {
            const isActive = manager_modal_keepdata.getActive();
            manager_modal_keepdata.setActive(!isActive);
            plugin_item.classList.toggle("deleted", !isActive);
            const config = await LiteLoader.api.config.get("LiteLoader", default_config);
            if (slug in config.deleting_plugins) LiteLoader.api.plugin.delete(slug, !isActive, false);
        });
        plugin_item.classList.toggle("deleted", manager_modal_keepdata.getActive());

        manager_modal_uninstall.setActive(!!config.deleting_plugins?.[slug]);
        manager_modal_uninstall.addEventListener("click", () => {
            const isActive = manager_modal_uninstall.getActive();
            manager_modal_uninstall.setActive(!isActive);
            plugin_item.classList.toggle("deleted", !isActive);
            const keepdata = manager_modal_keepdata.getActive();
            LiteLoader.api.plugin.delete(slug, keepdata, isActive);
        });
        plugin_item.classList.toggle("deleted", manager_modal_uninstall.getActive());

        plugin_list.append(plugin_item);

        plugin_counts.total++;
        plugin_counts[plugin.manifest.type]++;
    }

    plugin_lists.extension.setTitle(`扩展 （ ${plugin_counts.extension} 个插件 ）`);
    plugin_lists.theme.setTitle(`主题 （ ${plugin_counts.theme} 个插件 ）`);
    plugin_lists.framework.setTitle(`依赖 （ ${plugin_counts.framework} 个插件 ）`);
}


async function initPath(view) {
    const root_path_content = view.querySelectorAll(".path .root setting-text")[2];
    const root_path_button = view.querySelector(".path .root setting-button");
    const profile_path_content = view.querySelectorAll(".path .profile setting-text")[2];
    const profile_path_button = view.querySelector(".path .profile setting-button");

    root_path_content.textContent = LiteLoader.path.root;
    root_path_button.addEventListener("click", () => LiteLoader.api.openPath(LiteLoader.path.root));
    profile_path_content.textContent = LiteLoader.path.profile;
    profile_path_button.addEventListener("click", () => LiteLoader.api.openPath(LiteLoader.path.profile));
}


async function initAbout(view) {
    const liteloaderqqnt = view.querySelector(".about .liteloaderqqnt");
    const github = view.querySelector(".about .github");
    const group = view.querySelector(".about .group");
    const channel = view.querySelector(".about .channel");

    liteloaderqqnt.addEventListener("click", () => LiteLoader.api.openExternal("https://liteloaderqqnt.github.io"));
    github.addEventListener("click", () => LiteLoader.api.openExternal("https://github.com/LiteLoaderQQNT"));
    group.addEventListener("click", () => LiteLoader.api.openExternal("https://t.me/LiteLoaderQQNT"));
    channel.addEventListener("click", () => LiteLoader.api.openExternal("https://t.me/LiteLoaderQQNT_Channel"));

    // Hitokoto - 一言
    let visible = true;
    const hitokoto_text = view.querySelector(".about .hitokoto_text");
    const hitokoto_author = view.querySelector(".about .hitokoto_author");
    const observer = new IntersectionObserver((entries) => {
        visible = entries[0].isIntersecting;
    });
    observer.observe(hitokoto_text);
    async function trueUpdate() {
        const { hitokoto, creator } = await (await fetch("https://v1.hitokoto.cn")).json();
        hitokoto_text.textContent = hitokoto;
        hitokoto_author.textContent = creator;
    }
    async function fetchHitokoto() {
        // 页面不可见或一言不可见时不更新
        if (document.hidden || !visible) {
            return;
        }
        await trueUpdate();
    };
    trueUpdate();
    setInterval(fetchHitokoto, 1000 * 10);
}
