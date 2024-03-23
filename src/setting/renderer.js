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
        this.addNavItem("LiteLoaderQQNT", view);
        onSettingWindowCreated(view);
    }


    // Setting View
    getSettingView(slug) {
        const view = document.createElement("div");
        view.classList.add("liteloader", "tab-view", slug);
        return view;
    }


    // 导航栏条目
    addNavItem(name, view) {
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


// 对比本地与远端的版本号，有新版就返回true
function compareVersion(local_version, remote_version) {
    // 将字符串改为数组
    const local_version_arr = local_version.trim().split(".");
    const remote_version_arr = remote_version.trim().split(".");
    // 返回数组长度最大的
    const max_length = Math.max(local_version_arr.length, remote_version_arr.length);
    // 从头对比每一个
    for (let i = 0; i < max_length; i++) {
        // 将字符串改为数字
        const local_version_num = parseInt(local_version_arr?.[i] ?? "0");
        const remote_version_num = parseInt(remote_version_arr?.[i] ?? "0");
        // 版本号不相等
        if (local_version_num != remote_version_num) {
            // 有更新返回true，没更新返回false
            return local_version_num < remote_version_num;
        }
    }
    // 版本号相等，返回false
    return false;
}


function initVersions(view) {
    const qqnt = view.querySelectorAll(".versions .current .qqnt setting-text");
    const liteloader = view.querySelectorAll(".versions .current .liteloader setting-text");
    const chromium = view.querySelectorAll(".versions .current .chromium setting-text");
    const electron = view.querySelectorAll(".versions .current .electron setting-text");
    const nodejs = view.querySelectorAll(".versions .current .nodejs setting-text");

    qqnt[1].textContent = LiteLoader.versions.qqnt;
    liteloader[1].textContent = LiteLoader.versions.liteloader;
    chromium[1].textContent = LiteLoader.versions.chrome;
    electron[1].textContent = LiteLoader.versions.electron;
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
            if (compareVersion(LiteLoader.versions.liteloader, new_version)) {
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

async function getIconHtmlString(pluginSvgIconUrlUsingLocalPotocol) {
    const response = await fetch(pluginSvgIconUrlUsingLocalPotocol)
    return await response.text()
}


async function initPluginList(view) {
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

        const default_icon = `local:///${LiteLoader.path.root}/src/setting/static/default.png`;
        const plugin_icon = `local:///${plugin.path.plugin}/${plugin.manifest?.icon}`;

        const template = document.createElement("template");
        template.innerHTML = /*html*/ `
        <setting-item>
            <div>
                <div>
                    ${plugin_icon.endsWith('.svg') ? await getIconHtmlString(plugin_icon) : `<img src="${plugin.manifest?.icon ? plugin_icon : default_icon}"/>`}
                    <div>
                        <setting-text title="${plugin.manifest.name}">${plugin.manifest.name}</setting-text>
                        <setting-text data-type="secondary" title="${plugin.manifest.description}">${plugin.manifest.description}</setting-text>
                    </div>
                </div>
                <setting-text data-type="secondary">
                    <span>版本：${plugin.manifest.version}</span>
                    <span>开发：</span>
                </setting-text>
            </div>
            <setting-switch></setting-switch>
        </setting-item>
        `;

        const author_name = template.content.querySelectorAll("span")[1]
        plugin.manifest.authors.forEach((author, index, array) => {
            const author_link = document.createElement("a");
            author_link.textContent = author.name;
            author_link.addEventListener("click", () => LiteLoader.api.openExternal(author.link));
            author_name.append(author_link);
            if (index < array.length - 1) {
                author_name.append(" | ");
            }
        });

        const plugin_list = plugin_lists[plugin.manifest.type] || plugin_lists.extension;
        const plugin_item = template.content.cloneNode(true);
        const switch_btn = plugin_item.querySelector("setting-switch");

        if (!LiteLoader.plugins[slug].disabled) {
            switch_btn.setAttribute("is-active", "");
        }

        switch_btn.addEventListener("click", (event) => {
            const isActive = event.currentTarget.hasAttribute("is-active");
            LiteLoader_Setting.disablePlugin(slug, isActive);
            event.currentTarget.toggleAttribute("is-active");
        });

        plugin_list.append(plugin_item);
    }
}


function initPath(view) {
    const root_path_content = view.querySelectorAll(".path .root setting-text")[2];
    const root_path_button = view.querySelector(".path .root setting-button");
    const profile_path_content = view.querySelectorAll(".path .profile setting-text")[2];
    const profile_path_button = view.querySelector(".path .profile setting-button");

    root_path_content.textContent = LiteLoader.path.root;
    root_path_button.addEventListener("click", () => LiteLoader.api.openPath(LiteLoader.path.root));
    profile_path_content.textContent = LiteLoader.path.profile;
    profile_path_button.addEventListener("click", () => LiteLoader.api.openPath(LiteLoader.path.profile));
}


function initAbout(view) {
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


async function onSettingWindowCreated(view) {
    // HTMl
    view.innerHTML = await (await fetch(`local:///${LiteLoader.path.root}/src/setting/static/view.html`)).text();

    // 初始化
    initVersions(view);
    await initPluginList(view);
    initPath(view);
    initAbout(view);
}
