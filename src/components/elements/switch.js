import { BaseElement } from "../element.js";


export class Switch extends BaseElement {
    constructor() {
        super();
    }

    getTemplate() {
        return /*html*/ `
            <span>
                <slot></slot>
            </span>
        `;
    }

    getStyles() {
        return /*css*/ `
            :host {
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
            :host([is-active]) {
                background-color: var(--brand_standard);
            }
            :host([is-active]) span {
                transform: translate(12px);
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
        `;
    }
}
