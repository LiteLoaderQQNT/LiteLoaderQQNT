const message = "你咋这么急着更新？\n你就不能再等等？\n或者来催一下沫烬染（";

export default {
    hash: "#/setting",
    selector: ".config_view .versions .new setting-button",
    action(check_update_button) {
        let counting = 0;
        check_update_button.addEventListener("click", () => {
            counting++;
            if (counting == 20) {
                counting = 0;
                new Notification("LiteLoaderQQNT", { body: message });
            }
        });
    }
}