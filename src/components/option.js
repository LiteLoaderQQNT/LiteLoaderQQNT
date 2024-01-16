// HTML 模板
const template = document.createElement("template");
template.innerHTML = /*html*/ `
<style>
    :host {
        display: block;
    }

    li {
        display: flex;
        justify-content: space-between;
        border-radius: 4px;
        box-sizing: border-box;
        line-height: 24px;
        color: var(--text_primary);
        font-size: 12px;
        padding: 0px 8px;
    }

    li:hover {
        background-color: var(--overlay_hover);
    }

    li:active {
        background-color: var(--overlay_pressed);
    }

    :host([is-selected]) li {
        background-color: var(--overlay_active);
    }

    span {
        margin-right: 8px;
        overflow: hidden;
        text-wrap: nowrap;
        text-overflow: ellipsis;
    }

    svg {
        flex-shrink: 0;
        display: none;
        width: 1em;
        height: 1em;
        color: var(--icon_primary);
        position: relative;
        right: -4px;
        top: 7px;
    }

    :host([is-selected]) svg {
        display: block;
    }
</style>

<li>
    <span>
        <slot></slot>
    </span>
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 7L6.00001 11L14 3" stroke="currentColor" stroke-linejoin="round"></path>
    </svg>
</li>
`;


// 自定义标签
customElements.define("setting-option", class extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: "open" });
        this.shadowRoot.append(template.content.cloneNode(true));
    }

    static observedAttributes = ["data-value", "is-selected"];
});
