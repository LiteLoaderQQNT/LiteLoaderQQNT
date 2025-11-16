import { BaseElement } from "../element.js";


export class Section extends BaseElement {
    #title = this.shadowRoot.querySelector("h1");

    update() {
        this.#title.textContent = this.getTitle();
    }

    getTemplate() {
        return /*html*/ `
            <h1></h1>
            <slot></slot>
        `;
    }

    getStyles() {
        return /*css*/ `
            h1 {
                margin: 0px 0px 8px;
                padding: 0px 16px;
                color: var(--text_primary);
                font-weight: var(--font-bold);
                font-size: min(var(--font_size_3), 18px);
                line-height: min(var(--line_height_3), 24px);
            }
        `;
    }
}
