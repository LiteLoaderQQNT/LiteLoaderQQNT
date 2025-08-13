import { BaseElement } from "../element.js";


export class Item extends BaseElement {
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
            :host([data-direction="column"]) {
                flex: 1;
                padding: 0px 10px;
                text-align: center;
            }
            :host([data-direction="row"]) {
                padding: 12px 0px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
        `;
    }
}
