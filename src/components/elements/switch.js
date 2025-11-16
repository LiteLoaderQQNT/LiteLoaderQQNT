import { BaseElement } from "../element.js";


export class Switch extends BaseElement {
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
                display: inline-flex;
                width: 28px;
                padding: 3px;
                background-color: var(--fill_standard_primary);
                border-radius: 14px;
                transition: all .2s cubic-bezier(.38, 0, .24, 1);
            }
            :host([is-active]) { background-color: var(--brand_standard); }
            :host([is-active]) span { transform: translateX(17px); }
            span {
                width: 10px;
                height: 10px;
                background: var(--icon_white);
                border-radius: 5px;
                box-shadow: 0px 2px 4px rgba(0, 0, 0, .09);
                transition: transform .2s cubic-bezier(.38, 0, .24, 1);
            }
        `;
    }
}
