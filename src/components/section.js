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
        margin-top: 0;
        margin-bottom: 8px;
    }

    :host([is-panel]) slot {
        display: block;
        background-color: var(--fill_light_primary, var(--fg_white));
        border-radius: 8px;
        font-size: min(var(--font_size_3), 18px);
        line-height: min(var(--line_height_3), 24px);
        margin-bottom: 20px;
        overflow: hidden;
    }
</style>

<section>
    <h1></h1>
    <slot></slot>
</section>
`;


// 自定义标签
customElements.define("setting-section", class extends HTMLElement {

    static observedAttributes = ["data-title", "is-panel"];

    constructor() {
        super();

        this.attachShadow({ mode: "open" });
        this.shadowRoot.append(template.content.cloneNode(true));

        this._title = this.shadowRoot.querySelector("h1");
        this._slot = this.shadowRoot.querySelector("slot");

        this.update();
    }

    attributeChangedCallback() {
        this.update();
    }

    update() {
        this._title.textContent = this.dataset["title"];
        const slot_children = this._slot.assignedElements();
        const panel = slot_children.filter(node => node.nodeName == "SETTING-PANEL");
        this.toggleAttribute("is-panel", !panel.length);
    }

});
