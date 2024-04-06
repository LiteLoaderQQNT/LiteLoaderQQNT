export class SettingInterface {
    #liteloader_nav_bar = document.createElement("div");
    #liteloader_setting_view = document.createElement("div");
    #setting_view = document.querySelector(".setting-main .q-scroll-view");
    #setting_title = document.querySelector(".setting-main .setting-title");

    constructor() {
        this.#liteloader_nav_bar.classList.add("nav-bar", "liteloader");
        this.#liteloader_setting_view.classList.add("q-scroll-view", "scroll-view--show-scrollbar", "liteloader");
        document.querySelector(".setting-tab").append(this.#liteloader_nav_bar);
        document.querySelector(".setting-main .setting-main__content").append(this.#liteloader_setting_view);
        document.querySelector(".setting-tab").addEventListener("click", event => {
            const nav_item = event.target.closest(".nav-item");
            if (nav_item) {
                // 重新设定激活状态
                document.querySelectorAll(".setting-tab .nav-item").forEach(element => {
                    element.classList.remove("nav-item-active");
                });
                nav_item.classList.add("nav-item-active");
                // 内容显示
                if (nav_item.parentElement.classList.contains("liteloader")) {
                    this.#setting_view.style.display = "none";
                    this.#liteloader_setting_view.style.display = "block";
                }
                else {
                    this.#setting_view.style.display = "block";
                    this.#liteloader_setting_view.style.display = "none";
                }
            }
        });
        this.#SettingInit();
    }

    async add(plugin) {
        const default_thumb = `local://root/src/setting/static/default.svg`;
        const plugin_thumb = `local:///${plugin.path.plugin}/${plugin.manifest?.thumb}`;
        const thumb = plugin.manifest.thumb ? plugin_thumb : default_thumb;
        const nav_item = document.querySelector(".setting-tab .nav-item").cloneNode(true);
        const view = document.createElement("div");
        nav_item.classList.remove("nav-item-active");
        nav_item.setAttribute("data-slug", plugin.manifest.slug);
        nav_item.querySelector(".q-icon").innerHTML = await appropriateIcon(thumb);
        nav_item.querySelector(".name").textContent = plugin.manifest.name;
        nav_item.addEventListener("click", event => {
            if (!event.currentTarget.classList.contains("nav-item-active")) {
                this.#setting_title.childNodes[1].textContent = plugin.manifest.name;
                this.#liteloader_setting_view.textContent = null;
                this.#liteloader_setting_view.append(view);
            }
        });
        this.#liteloader_nav_bar.append(nav_item);
        view.classList.add("tab-view", plugin.manifest.slug);
        return view;
    }

    async #SettingInit() {
        const style = document.createElement("link");
        style.rel = "stylesheet";
        style.type = "text/css";
        style.href = "local://root/src/setting/static/style.css";
        document.head.append(style);
        const view = await this.add({
            manifest: {
                slug: "config_view",
                name: "LiteLoaderQQNT",
                thumb: "./src/setting/static/default.svg"
            },
            path: {
                plugin: LiteLoader.path.root
            }
        });
        view.innerHTML = await (await fetch("local://root/src/setting/static/view.html")).text();
        initVersions(view);
        initPluginList(view);
        initPath(view);
        initAbout(view);
    }
}


// 禁用插件
async function disablePlugin(slug, disabled) {
    const config = await LiteLoader.api.config.get("LiteLoader", { disabled_plugins: [] });
    if (disabled) {
        config.disabled_plugins = config.disabled_plugins.concat(slug);
    }
    else {
        config.disabled_plugins = config.disabled_plugins.filter(item => item != slug);
    }
    await LiteLoader.api.config.set("LiteLoader", config);
}


async function appropriateIcon(pluginIconUrlUsingLocalPotocol) {
    if (pluginIconUrlUsingLocalPotocol.endsWith('.svg')) {
        return await (await fetch(pluginIconUrlUsingLocalPotocol)).text();
    } else {
        return `<img src="${pluginIconUrlUsingLocalPotocol}"/>`;
    }
}


async function initVersions(view) {
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
            if (LiteLoader.versions.liteloader != new_version) {
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
    const plugin_lists = {
        extension: view.querySelector(".plugins setting-list.extension"),
        theme: view.querySelector(".plugins setting-list.theme"),
        framework: view.querySelector(".plugins setting-list.framework"),
    };

    for (const [slug, plugin] of Object.entries(LiteLoader.plugins)) {
        // 跳过不兼容插件
        if (plugin.incompatible) {
            continue;
        }

        const default_icon = `local://root/src/setting/static/default.png`;
        const plugin_icon = `local:///${plugin.path.plugin}/${plugin.manifest?.icon}`;
        const icon = plugin.manifest?.icon ? plugin_icon : default_icon;

        const plugin_list = plugin_lists[plugin.manifest.type] || plugin_lists.extension;
        const plugin_item = plugin_item_template.content.cloneNode(true);

        const plugin_item_icon = plugin_item.querySelector(".icon");
        const plugin_item_name = plugin_item.querySelector(".name");
        const plugin_item_description = plugin_item.querySelector(".description");
        const plugin_item_version = plugin_item.querySelector(".version");
        const plugin_item_authors = plugin_item.querySelector(".authors");
        const plugin_item_switch = plugin_item.querySelector(".switch");

        plugin_item_icon.innerHTML = await appropriateIcon(icon);
        plugin_item_name.textContent = plugin.manifest.name;
        plugin_item_name.title = plugin.manifest.name;
        plugin_item_description.textContent = plugin.manifest.description;
        plugin_item_description.title = plugin.manifest.description;
        plugin_item_version.textContent = plugin.manifest.version;

        plugin.manifest.authors.forEach((author, index, array) => {
            const author_link = document.createElement("a");
            author_link.textContent = author.name;
            author_link.addEventListener("click", () => LiteLoader.api.openExternal(author.link));
            plugin_item_authors.append(author_link);
            if (index < array.length - 1) {
                plugin_item_authors.append(" | ");
            }
        });

        if (!LiteLoader.plugins[slug].disabled) {
            plugin_item_switch.setAttribute("is-active", "");
        }

        plugin_item_switch.addEventListener("click", (event) => {
            disablePlugin(slug, event.currentTarget.hasAttribute("is-active"));
            event.currentTarget.toggleAttribute("is-active");
        });

        plugin_list.append(plugin_item);
    }
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
    const homepage_btn = view.querySelector(".about setting-button.liteloaderqqnt");
    const github_btn = view.querySelector(".about setting-button.github");
    const telegram_btn = view.querySelector(".about setting-button.telegram");

    homepage_btn.addEventListener("click", () => LiteLoader.api.openExternal("https://liteloaderqqnt.github.io"));
    github_btn.addEventListener("click", () => LiteLoader.api.openExternal("https://github.com/LiteLoaderQQNT"));
    telegram_btn.addEventListener("click", () => LiteLoader.api.openExternal("https://t.me/LiteLoaderQQNT"));

    // Hitokoto - 一言
    const fetchHitokoto = async () => {
        const { hitokoto, creator } = await (await fetch("https://v1.hitokoto.cn")).json();
        view.querySelector(".about .hitokoto_text").textContent = hitokoto;
        view.querySelector(".about .hitokoto_author").textContent = creator;
    };
    fetchHitokoto();
    setInterval(fetchHitokoto, 1000 * 10);
}