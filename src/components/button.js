// HTML 模板
const template = document.createElement("template");
template.innerHTML = /*html*/ `
<style>
    :host {
        position: relative;
        vertical-align: text-bottom;
    }

    :host button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        overflow: visible;
        background-color: var(--brand_standard);
        border: 1px solid;
        border-radius: 4px;
        outline-style: none;
        font-size: 12px;
        line-height: 14px;
        min-width: 62px;
        margin: 0px;
        padding: 4px 7px;
    }

    :host([data-type="primary"]) button {
        background-color: var(--brand_standard);
        color: var(--on_brand_primary);
        border-color: var(--brand_standard);
    }

    :host([data-type="primary"]) button:hover {
        background: var(--nt_brand_standard_2_overlay_hover_brand_2_mix);
    }

    :host([data-type="primary"]) button:active {
        background-color: var(--nt_brand_standard_2_overlay_pressed_brand_2_mix);
    }

    :host([data-type="secondary"]) button {
        background-color: transparent;
        color: var(--text_primary);
        border-color: var(--fill_standard_primary);
    }

    :host([data-type="secondary"]) button:hover {
        background-color: var(--overlay_hover);
    }

    :host([data-type="secondary"]) button:active {
        background-color: var(--overlay_pressed);
    }

    :host([is-disabled]) button {
        opacity: 0.3;
        cursor: not-allowed;
    }
</style>

<button>
    <span>
        <slot></slot>
    </span>
</button>
`;


// 自定义标签
customElements.define("setting-button", class extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: "open" });
        this.shadowRoot.append(template.content.cloneNode(true));
    }

    static observedAttributes = ["data-type", "is-disabled"];
});
