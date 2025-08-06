import { BaseElement } from "../element.js";


export class List extends BaseElement {
    constructor() {
        super();
        this._head = this.shadowRoot.querySelector("setting-item");
        this._title = this.shadowRoot.querySelector("h2");
        this._slot = this.shadowRoot.querySelector("slot");
        this.#setupEventListeners();
        this.#setupMutationObserver();
    }

    getTemplate() {
        return /*html*/ `
            <setting-item data-direction="row" class="hidden">
                <h2></h2>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 8L12 17L3 8" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"></path>
                </svg>
            </setting-item>
            <slot></slot>
        `;
    }

    getStyles() {
        return /*css*/ `
            :host([data-direction="column"]) {
                display: block;
                padding: 0px 16px;
            }

            :host([data-direction="row"]) {
                display: flex;
                justify-content: space-between;
                padding: 16px 0px;
            }

            svg {
                width: 1rem;
                height: 1rem;
                transform: rotate(0deg);
                transition-duration: 0.2s;
                transition-timing-function: ease;
                transition-delay: 0s;
                transition-property: transform;
            }

            :host([is-collapsible]) slot {
                display: none !important;
            }

            :host([is-active]) slot {
                display: block !important;
            }

            :host([is-active]) svg {
                transform: rotate(-180deg);
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
        `;
    }

    update() {
        this.#updateTitle();
        this.#updateLayout();
        this.#updateDividers();
    }

    #setupEventListeners() {
        this._head.addEventListener("click", () => {
            this.setActive(!this.getActive());
        });
    }

    #setupMutationObserver() {
        new MutationObserver((_, observer) => {
            observer.disconnect();
            this.update();
            observer.observe(this, { childList: true });
        }).observe(this, { childList: true });
    }

    #updateTitle() {
        this._title.textContent = this.getTitle();
    }

    #updateLayout() {
        this._head.classList.toggle("hidden", !this.getCollapsible());
    }

    #updateDividers() {
        const dividers = this.querySelectorAll("setting-divider");
        const children = this._slot.assignedElements();
        dividers.forEach(node => node.remove());
        children.forEach((node, index) => {
            const divider = document.createElement("setting-divider");
            switch (this.getDirection()) {
                case "column": {
                    divider.setDirection("row");
                    node.setDirection("row");
                    break;
                }
                case "row": {
                    divider.setDirection("column");
                    node.setDirection("column");
                    break;
                }
            }
            if (this.getCollapsible()) {
                if (index < children.length) {
                    node.before(divider);
                }
            } else {
                if (index + 1 < children.length) {
                    node.after(divider);
                }
            }
        });
    }
}
