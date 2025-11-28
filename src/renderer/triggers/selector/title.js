export default {
    hash: "#/setting",
    selector: ".liteloader.nav-bar .nav-item[data-slug='config_view']",
    action(setting_navtab_item) {
        if (Math.floor(Math.random() * 1000) != 0) return;
        setting_navtab_item.querySelector(".name").textContent = "LiteLoaderNTQQ";
    }
}