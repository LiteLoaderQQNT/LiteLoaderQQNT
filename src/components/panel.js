// HTML 模板
const template = document.createElement("template");
template.innerHTML = /*html*/ `
<style>
    :host {
        display: block;
        background-color: var(--fill_light_primary, var(--fg_white));
        border-radius: 8px;
        font-size: min(var(--font_size_3), 18px);
        line-height: min(var(--line_height_3), 24px);
        margin-bottom: 20px;
        overflow: hidden;
    }
</style>

<slot></slot>
`;


// 自定义标签
customElements.define("setting-panel", class extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: "open" });
        this.shadowRoot.append(template.content.cloneNode(true));
    }
});
