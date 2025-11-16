import { BaseElement } from "../element.js";


export class List extends BaseElement {
    #head = this.shadowRoot.querySelector("setting-item");
    #title = this.shadowRoot.querySelector("h2");
    #slot = this.shadowRoot.querySelector("slot");

    constructor() {
        super();
        this.#setupEventListeners();
        this.#setupMutationObserver();
    }

    update() {
        this.#updateTitle();
        this.#updateLayout();
        this.#updateDividers();
    }

    #setupEventListeners() {
        this.#head.addEventListener("click", () => {
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
        this.#title.textContent = this.getTitle();
    }

    #updateLayout() {
        this.#head.classList.toggle("hidden", !this.getCollapsible());
    }

    #updateDividers() {
        const direction = this.getDirection();
        const collapsible = this.getCollapsible();
        const dividers = this.querySelectorAll("setting-divider");
        const children = this.#slot.assignedElements();
        dividers.forEach(node => node.remove());
        children.forEach((node, index) => {
            const divider = document.createElement("setting-divider");
            const dividerDirection = direction == "column" ? "row" : "column";
            const shouldInsertBefore = collapsible && index < children.length;
            const shouldInsertAfter = !collapsible && index + 1 < children.length;
            requestAnimationFrame(() => {
                divider.setDirection(dividerDirection);
                node.setDirection?.(dividerDirection);
            });
            if (shouldInsertBefore) {
                node.before(divider);
            } else if (shouldInsertAfter) {
                node.after(divider);
            }
        });
    }

    getTemplate() {
        return /*html*/ `
            <setting-item data-direction="row" class="hidden">
                <h2></h2>
                <svg viewBox="0 0 24 24">
                    <use xlink:href="/_upper_/resource/icons/arrow_down_24.svg#arrow_down_24"></use>
                </svg>
            </setting-item>
            <slot></slot>
        `;
    }

    getStyles() {
        return /*css*/ `
            :host([data-direction="column"]) { display: block; padding: 0px 16px; }
            :host([data-direction="row"]) { display: flex; justify-content: space-between; padding: 16px 0px; }
            :host([is-collapsible]) slot { display: none !important; }
            :host([is-active]) slot { display: block !important; }
            :host([is-active]) svg { transform: rotate(-180deg); }
            setting-item { cursor: pointer; font-size: min(var(--font_size_3), 18px); line-height: min(var(--line_height_3), 24px); }
            svg { width: 1rem; height: 1rem; transition: transform .2s ease; }
            h2 { font: inherit; border: 0px; margin: 0px; padding: 0px; }
        `;
    }
}
