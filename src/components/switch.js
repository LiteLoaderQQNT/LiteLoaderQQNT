// HTML 模板
const template = document.createElement("template");
template.innerHTML = /*html*/ `
<style>
    div {
        background-color: var(--fill_standard_primary);
        border-radius: 14px;
        box-sizing: border-box;
        display: inline-flex;
        position: relative;
        transition-duration: 0.2s;
        transition-timing-function: cubic-bezier(0.38, 0, 0.24, 1);
        transition-delay: 0s;
        transition-property: all;
        width: 28px;
        padding: 3px;
    }

    :host([is-active]) div {
        background-color: var(--brand_standard);
    }

    span {
        border-radius: 5px;
        box-shadow: rgba(0, 0, 0, 0.09) 0px 2px 4px;
        box-sizing: border-box;
        display: inline-block;
        height: 10px;
        position: relative;
        transition-duration: 0.2s;
        transition-timing-function: cubic-bezier(0.38, 0, 0.24, 1);
        transition-delay: 0s;
        transition-property: all;
        width: 10px;
        z-index: 2;
        background: var(--icon_white);
    }

    :host([is-active]) span {
        transform: translate(12px);
    }
</style>

<div>
    <span></span>
</div>
`;


// 自定义标签
customElements.define("setting-switch", class extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: "open" });
        this.shadowRoot.append(template.content.cloneNode(true));
    }

    static observedAttributes = ["is-active"];
});
