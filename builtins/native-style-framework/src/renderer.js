export async function onLoad() {
    const plugin_path = LiteLoader.plugins.native_style_framework.path.plugin;
    const css_file_path = `file://${plugin_path}/src/style.css`;

    const link_element = document.createElement("link");
    link_element.rel = "stylesheet";
    link_element.href = css_file_path;

    document.head.appendChild(link_element);
}
