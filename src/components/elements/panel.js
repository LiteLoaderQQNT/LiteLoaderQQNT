import { BaseElement } from "../element.js";


export class Panel extends BaseElement {
    constructor() {
        super();
    }

    getTemplate() {
        return /*html*/ `
            <slot></slot>
        `;
    }

    getStyles() {
        return /*css*/ `
            :host {
                display: block;
                background-color: var(--fill_light_primary, var(--fg_white));
                border-radius: 8px;
                font-size: min(var(--font_size_3), 18px);
                line-height: min(var(--line_height_3), 24px);
                margin-bottom: 20px;
            }
        `;
    }
}
