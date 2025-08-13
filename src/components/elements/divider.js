import { BaseElement } from "../element.js";


export class Divider extends BaseElement {
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
                border: unset;
                margin: unset;
                background-color: rgba(127, 127, 127, 0.15);
            }
            :host([data-direction="row"]) {
                height: 1px;
            }
            :host([data-direction="column"]) {
                width: 1px;
            }
        `;
    }
}
