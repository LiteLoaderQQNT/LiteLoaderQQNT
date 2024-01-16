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


function initPluginList(view) {
    const plugin_lists = {
        extension: view.querySelector(".plugins setting-list.extension"),
        theme: view.querySelector(".plugins setting-list.theme"),
        framework: view.querySelector(".plugins setting-list.framework"),
    };

    for (const [slug, plugin] of Object.entries(LiteLoader.plugins)) {
        const thumbnail = plugin.manifest?.thumbnail;
        const plugin_icon = `local:///${plugin.path.plugin}/${thumbnail}`;
        const default_icon = `local:///${LiteLoader.path.root}/src/setting/default.png`;
        const manifest = {
            ...plugin.manifest,
            thumbnail: thumbnail ? plugin_icon : default_icon,
            author: {
                name: plugin.manifest.authors[0].name,
                link: plugin.manifest.authors[0].link
            }
        };

        const template = document.createElement("template");
        template.innerHTML = /*html*/ `
        <setting-item>
            <img src="${manifest.thumbnail}" class="thumbnail">
            <div class="info">
                <setting-text title="${manifest.name}">${manifest.name}</setting-text>
                <setting-text data-type="secondary" title="${manifest.description}">${manifest.description}</setting-text>
                <setting-text data-type="secondary" class="extra-information">
                    <span>版本：${manifest.version}</span>
                    <span>开发：<a onclick="LiteLoader.api.openExternal('${manifest.author.link}')">${manifest.author.name}</a></span>
                </setting-text>
            </div>
            <setting-switch></setting-switch>
        </setting-item>
        `;

        const plugin_list = plugin_lists[plugin.manifest.type] || plugin_lists.extension;
        const plugin_item = template.content.cloneNode(true);
        const switch_btn = plugin_item.querySelector("setting-switch");

        if (!LiteLoader.plugins[manifest.slug].disabled) {
            switch_btn.setAttribute("is-active", "");
        }

        switch_btn.addEventListener("click", (event) => {
            const isActive = event.currentTarget.hasAttribute("is-active");
            LiteLoader.api.disablePlugin(slug, isActive);
            if (isActive) {
                event.currentTarget.removeAttribute("is-active")
            } else {
                event.currentTarget.setAttribute("is-active", "");
            }
        });

        plugin_list.append(plugin_item);
    }
}


function initAbout(view) {
    const homepage_btn = view.querySelector(".about setting-button.liteloaderqqnt");
    const github_btn = view.querySelector(".about setting-button.github");
    const telegram_btn = view.querySelector(".about setting-button.telegram");

    homepage_btn.addEventListener("click", () => LiteLoader.api.openExternal("https://llqqnt.mukapp.top"));
    github_btn.addEventListener("click", () => LiteLoader.api.openExternal("https://github.com/LiteLoaderQQNT/LiteLoaderQQNT"));
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


export async function onSettingWindowCreated(view) {
    // HTMl
    view.innerHTML = await (await fetch(`local:///${LiteLoader.path.root}/src/setting/view.html`)).text();

    // 初始化
    initVersions(view);
    initPluginList(view);
    initAbout(view);
}
