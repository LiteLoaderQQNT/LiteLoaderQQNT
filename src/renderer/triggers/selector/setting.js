import { Runtime } from "../../runtime.js"
import { initView, appropriateIcon } from "../../settings/renderer.js";

const liteloader_nav_bar = document.createElement("div");
const liteloader_setting_view = document.createElement("div");

function init() {
    const setting_view = document.querySelector(".setting-main .q-scroll-view");
    const setting_title = document.querySelector(".setting-main .setting-title");
    liteloader_nav_bar.classList.add("nav-bar", "liteloader");
    liteloader_setting_view.classList.add("q-scroll-view", "scroll-view--show-scrollbar", "liteloader");
    liteloader_setting_view.style.display = "none";
    document.querySelector(".setting-tab").append(liteloader_nav_bar);
    document.querySelector(".setting-main .setting-main__content").append(liteloader_setting_view);
    document.querySelector(".setting-tab").addEventListener("click", event => {
        const nav_item = event.target.closest(".nav-item");
        if (nav_item) {
            // 内容显示
            if (nav_item.parentElement.classList.contains("liteloader")) {
                setting_view.style.display = "none";
                liteloader_setting_view.style.display = "block";
            }
            else {
                setting_view.style.display = "block";
                liteloader_setting_view.style.display = "none";
            }
            // 重新设定激活状态
            setting_title.childNodes[1].textContent = nav_item.querySelector(".name").textContent;
            document.querySelectorAll(".setting-tab .nav-item").forEach(element => {
                element.classList.remove("nav-item-active");
            });
            nav_item.classList.add("nav-item-active");
        }
    });
}

function add(plugin) {
    const default_thumb = `local://root/src/common/static/default.svg`;
    const plugin_thumb = `local:///${plugin.path.plugin}/${plugin.manifest?.thumb}`;
    const thumb = plugin.manifest.thumb ? plugin_thumb : default_thumb;
    const nav_item = document.querySelector(".setting-tab .nav-item").cloneNode(true);
    const view = document.createElement("div");
    nav_item.classList.remove("nav-item-active");
    nav_item.setAttribute("data-slug", plugin.manifest.slug);
    appropriateIcon(thumb).then(async text => nav_item.querySelector(".q-icon").innerHTML = text);
    nav_item.querySelector(".name").textContent = plugin.manifest.name;
    nav_item.addEventListener("click", event => {
        if (!event.currentTarget.classList.contains("nav-item-active")) {
            liteloader_setting_view.textContent = null;
            liteloader_setting_view.append(view);
        }
    });
    liteloader_nav_bar.append(nav_item);
    view.classList.add("tab-view", plugin.manifest.slug);
    return view;
}

export default {
    hash: "#/setting",
    selector: ".setting-tab .nav-bar",
    action() {
        init();
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = "local://root/src/renderer/settings/style.css";
        document.head.append(link);
        const view = add({
            manifest: {
                slug: "config_view",
                name: "LiteLoaderQQNT"
            },
            path: {
                plugin: LiteLoader.path.root
            }
        });
        fetch("local://root/src/renderer/settings/view.html")
            .then(res => res.text())
            .then(html => initView(view, html));
        Runtime.triggerHooks("onSettingWindowCreated", (plugin) => [add(plugin)]);
    }
}