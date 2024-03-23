// HTML 模板
const template = document.createElement("template");
template.innerHTML = /*html*/ `
<style>
    :host {
        display: block;
        width: 100px;
    }

    :host([is-disabled]) {
        opacity: 0.3;
        cursor: not-allowed;
        pointer-events: none;
    }

    .select {
        width: 100%;
        color: var(--text_primary);
        font-size: 12px;
        position: relative;
        z-index: inherit;
    }

    .menu-button {
        width: 100%;
        height: 24px;
        line-height: 24px;
        padding: 0px 8px;
        background-color: transparent;
        border-radius: 4px;
        cursor: default;
        display: flex;
        justify-content: space-between;
        position: relative;
        z-index: 5;
        box-sizing: border-box;
        border: 1px solid var(--border_dark);
    }

    input {
        appearance: none;
        border-radius: 0px;
        box-sizing: border-box;
        background: none;
        border: none;
        padding: 0px;
        cursor: default;
        background-color: transparent;
        color: var(--text_primary);
        flex: 1;
        margin-right: 8px;
        outline: none;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    svg {
        width: 16px;
        height: 16px;
        color: var(--icon_primary);
        position: relative;
        top: 3px;
    }

    ul {
        position: absolute;
        top: 100%;
        backdrop-filter: blur(8px);
        display: flex;
        flex-direction: column;
        gap: 4px;
        list-style: none;
        font-size: 12px;
        background-color: var(--blur_middle_standard);
        background-clip: padding-box;
        border-radius: 4px;
        box-shadow: var(--shadow_bg_middle_secondary);
        border: var(--border_secondary);
        padding: 4px;
        app-region: no-drag;
        box-sizing: border-box;
        max-height: var(--q-contextmenu-max-height);
        overflow-x: hidden;
        overflow-y: auto;
        margin: 5px 0px;
        z-index: 999;
    }

    .hidden {
        display: none;
    }
</style>

<div class="select">
    <div class="menu-button">
        <input type="text" readonly spellcheck="false" placeholder="请选择">
        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 6.0001L8.00004 10L4 6" stroke="currentColor" stroke-linejoin="round"></path>
        </svg>
    </div>
    <ul class="hidden">
        <slot></slot>
    </ul>
</div>
`;


// 自定义标签
customElements.define("setting-select", class extends HTMLElement {

    static observedAttributes = ["is-disabled"];

    constructor() {
        super();

        this.attachShadow({ mode: "open" });
        this.shadowRoot.append(template.content.cloneNode(true));

        this._title = this.shadowRoot.querySelector("input");
        this._button = this.shadowRoot.querySelector(".menu-button");
        this._context = this.shadowRoot.querySelector("ul");

        const click = () => {
            this._context.classList.toggle("hidden");
            if (!this._context.classList.contains("hidden")) {
                window.addEventListener("pointerup", pointerup);
                this._context.style.width = getComputedStyle(this).getPropertyValue("width");
            }
            else {
                window.removeEventListener("pointerup", pointerup);
                this._context.style.width = null;
            }
        }

        const pointerup = (event) => {
            if (event.target.tagName != "SETTING-SELECT") {
                click();
            }
        }

        this._button.addEventListener("click", click);
        this._context.addEventListener("click", (event) => {
            if (event.target.tagName == "SETTING-OPTION" && !event.target.hasAttribute("is-selected")) {
                for (const node of this.querySelectorAll("setting-option[is-selected]")) {
                    node.toggleAttribute("is-selected");
                }
                event.target.toggleAttribute("is-selected");
                this._title.value = event.target.textContent;
                this.dispatchEvent(new CustomEvent("selected", {
                    bubbles: true,
                    composed: true,
                    detail: {
                        name: event.target.textContent,
                        value: event.target.dataset["value"]
                    }
                }));
            }
        });

        this._title.value = this.querySelector("setting-option[is-selected]").textContent;
    }

});
