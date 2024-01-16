// HTML 模板
const template = document.createElement("template");
template.innerHTML = /*html*/ `
<style>
    h1 {
        color: var(--text_primary);
        font-weight: var(--font-bold);
        font-size: min(var(--font_size_3), 18px);
        line-height: min(var(--line_height_3), 24px);
        padding: 0px 16px;
        margin-bottom: 8px;
    }
</style>

<section>
    <h1></h1>
    <slot></slot>
</section>
`;


// 自定义标签
customElements.define("setting-section", class extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: "open" });
        this.shadowRoot.append(template.content.cloneNode(true));

        this._title = this.shadowRoot.querySelector("h1");

        this.update();
    }

    static observedAttributes = ["data-title"];

    attributeChangedCallback() {
        this.update();
    }

    update() {
        this._title.textContent = this.dataset["title"];
    }
});
