import { BaseElement } from "../element.js";


export class Text extends BaseElement {
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
                display: -webkit-box;
                word-break: break-all;
                text-overflow: ellipsis;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1;
                overflow: hidden;
            }
            :host([data-type="secondary"]) slot {
                color: var(--text_secondary);
                font-size: min(var(--font_size_2), 16px);
                line-height: min(var(--line_height_2), 22px);
                margin-top: 4px;
            }
        `;
    }
}
