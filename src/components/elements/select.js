import { BaseElement } from "../element.js";


export class Select extends BaseElement {
    #title = this.shadowRoot.querySelector("input");
    #button = this.shadowRoot.querySelector(".menu-button")
    #context = this.shadowRoot.querySelector("ul");

    constructor() {
        super();
        const pointerup = (event) => {
            if (event.target.tagName != "SETTING-SELECT") {
                click();
            }
        }
        const click = () => {
            this.#context.classList.toggle("hidden");
            if (!this.#context.classList.contains("hidden")) {
                window.addEventListener("pointerup", pointerup);
                this.#context.style.width = getComputedStyle(this).getPropertyValue("width");
            }
            else {
                window.removeEventListener("pointerup", pointerup);
                this.#context.style.width = null;
            }
        }
        this.#button.addEventListener("click", click);
        this.#context.addEventListener("click", (event) => {
            if (event.target.tagName == "SETTING-OPTION" && !event.target.getSelected()) {
                for (const node of this.querySelectorAll("setting-option[is-selected]")) {
                    node.setSelected(!node.getSelected());
                }
                event.target.setSelected(!event.target.getSelected());
                this.#title.value = event.target.textContent;
                this.dispatchEvent(new CustomEvent("selected", {
                    bubbles: true,
                    composed: true,
                    detail: {
                        name: event.target.textContent,
                        value: event.target.getValue()
                    }
                }));
            }
        });
    }

    update() {
        this.#title.value = this.querySelector("setting-option[is-selected]")?.textContent;
    }

    getTemplate() {
        return /*html*/ `
            <div class="menu-button">
                <input type="text" readonly placeholder="请选择">
                <svg viewBox="0 0 16 16">
                    <use xlink:href="/_upper_/resource/icons/arrow_down_small_16.svg#arrow_down_small_16"></use>
                </svg>
            </div>
            <ul class="hidden">
                <slot></slot>
            </ul>
        `;
    }

    getStyles() {
        return /*css*/ `
            :host {
                display: block;
                position: relative;
                width: 100px;
                color: var(--text_primary);
                font-size: 12px;
            }
            .menu-button {
                display: flex;
                justify-content: space-between;
                align-items: center;
                height: 24px;
                padding: 0px 8px;
                background-color: transparent;
                border: 1px solid var(--border_dark);
                border-radius: 4px;
                cursor: pointer;
            }
            .menu-button input {
                flex: 1;
                margin-right: 8px;
                padding: 0;
                background: none;
                border: none;
                outline: none;
                color: var(--text_primary);
                cursor: pointer;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .menu-button svg {
                width: 16px;
                height: 16px;
                color: var(--icon_primary);
            }
            ul {
                position: absolute;
                top: calc(100% + 5px);
                display: flex;
                flex-direction: column;
                gap: 4px;
                max-height: var(--q-contextmenu-max-height);
                margin: 0;
                padding: 4px;
                background-color: var(--blur_middle_standard);
                border: var(--border_secondary);
                border-radius: 4px;
                box-shadow: var(--shadow_bg_middle_secondary);
                backdrop-filter: blur(8px);
                list-style: none;
                overflow-y: auto;
                z-index: 999;
            }
        `;
    }
}
