export const hash = "#/setting";
export const selector = ".liteloader.nav-bar .nav-item[data-slug='config_view']";
export function trigger(settingn_navtab_item) {
    const new_name = "LiteLoaderNTQQ"
    const random_number = Math.floor(Math.random() * 10000);
    const name = settingn_navtab_item.querySelector(".name");
    if (random_number == 0) {
        name.textContent = new_name;
    }
}