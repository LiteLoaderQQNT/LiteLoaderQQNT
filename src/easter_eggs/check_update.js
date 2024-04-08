export const hash = "#/setting";
export const selector = ".config_view .versions .new setting-button";
export function trigger(check_update_button) {
    let click_count = 0;
    check_update_button.addEventListener("click", () => {
        click_count++;
        if (click_count == 20) {
            click_count = 0;
            new Notification(
                "LiteLoaderQQNT",
                {
                    body: "你咋这么急着更新？\n你就不能再等等？\n或者来催一下沫烬染（",
                    requireInteraction: true
                }
            );
        }
    });
}