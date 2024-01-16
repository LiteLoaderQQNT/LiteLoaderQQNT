// HTML 模板
const template = document.createElement("template");
template.innerHTML = /*html*/ `
<style>
    :host {
        display: -webkit-box;
        word-break: break-all;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
    }

    :host([data-type="secondary"]) slot {
        color: var(--text_secondary);
        font-size: min(var(--font_size_2), 16px);
        line-height: min(var(--line_height_2), 22px);
        margin-top: 4px;
    }
</style>

<slot></slot>
`;


// 自定义标签
customElements.define("setting-text", class extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: "open" });
        this.shadowRoot.append(template.content.cloneNode(true));
    }

    static observedAttributes = ["data-type"];
});
