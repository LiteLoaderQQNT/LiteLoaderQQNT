// HTML 模板
const template = document.createElement("template");
template.innerHTML = /*html*/ `
<style>
    :host([data-direction="column"]) {
        display: block;
        padding: 0px 16px;
    }

    :host([data-direction="row"]) {
        display: flex;
        justify-content: space-between;
        padding: 16px 0px;
    }

    :host([is-disabled]) {
        opacity: 0.3;
        cursor: not-allowed;
        pointer-events: none;
    }

    .title-icon {
        width: 1rem;
        height: 1rem;
        transform: rotate(0deg);
        transition-duration: 0.2s;
        transition-timing-function: ease;
        transition-delay: 0s;
        transition-property: transform;
    }

    :host([is-active]) .title-icon {
        transform: rotate(-180deg);
    }

    :host([is-collapsible]) slot {
        display: none !important;
    }

    :host([is-active]) slot {
        display: block !important;
    }

    setting-item {
        cursor: pointer;
        font-size: min(var(--font_size_3), 18px);
        line-height: min(var(--line_height_3), 24px);
    }

    h2 {
        box-sizing: border-box;
        font-size: 100%;
        font-style: inherit;
        font-weight: inherit;
        border: 0px;
        margin: 0px;
        padding: 0px;
    }

    .hidden {
        display: none !important;
    }
</style>

<setting-item data-direction="row" class="hidden">
    <h2></h2>
    <svg class="title-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 8L12 17L3 8" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"></path>
    </svg>
</setting-item>

<slot></slot>
`;


// 自定义标签
customElements.define("setting-list", class extends HTMLElement {

    static observedAttributes = ["data-title", "data-direction", "is-collapsible", "is-active", "is-disabled"];

    constructor() {
        super();

        this.attachShadow({ mode: "open" });
        this.shadowRoot.append(template.content.cloneNode(true));

        this._head = this.shadowRoot.querySelector("setting-item");
        this._title = this.shadowRoot.querySelector("h2");
        this._slot = this.shadowRoot.querySelector("slot");

        this._head.addEventListener("click", () => {
            this.toggleAttribute("is-active");
        });

        this.update();

        new MutationObserver((_, observer) => {
            observer.disconnect();
            this.update();
            observer.observe(this, { childList: true });
        }).observe(this, { childList: true });
    }

    attributeChangedCallback() {
        this.update();
    }

    update() {
        this._title.textContent = this.dataset["title"];
        const slot_children = this._slot.assignedElements();
        this.querySelectorAll("setting-divider").forEach(node => node.remove());
        // 折叠列表
        if (this.hasAttribute("is-collapsible")) {
            this._head.classList.toggle("hidden", false);
            slot_children.forEach((node, index) => {
                const setting_divider = document.createElement("setting-divider");
                if (this.dataset["direction"] == "column") {
                    setting_divider.dataset["direction"] = "row";
                    node.dataset["direction"] = "row";
                }
                if (index < slot_children.length) {
                    node.before(setting_divider);
                }
            });
        }
        // 普通列表
        else {
            this._head.classList.toggle("hidden", true);
            slot_children.forEach((node, index) => {
                const setting_divider = document.createElement("setting-divider");
                if (this.dataset["direction"] == "column") {
                    setting_divider.dataset["direction"] = "row";
                    node.dataset["direction"] = "row";
                }
                if (this.dataset["direction"] == "row") {
                    setting_divider.dataset["direction"] = "column";
                    node.dataset["direction"] = "column";
                }
                if (index + 1 < slot_children.length) {
                    node.after(setting_divider);
                }
            });
        }
    }
});
