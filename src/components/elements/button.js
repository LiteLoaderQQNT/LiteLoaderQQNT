import { BaseElement } from "../element.js";


export class Button extends BaseElement {
    constructor() {
        super();
    }

    getTemplate() {
        return /*html*/ `
            <button>
                <slot></slot>
            </button>
        `;
    }

    getStyles() {
        return /*css*/ `
            :host {
                position: relative;
                vertical-align: text-bottom;
            }
            :host([data-type="primary"]) {
                button {
                    background-color: var(--brand_standard);
                    color: var(--on_brand_primary);
                    border-color: var(--brand_standard);
                    &:hover {
                        background-color: var(--nt_brand_standard_2_overlay_hover_brand_2_mix);
                    }
                    &:active {
                        background-color: var(--nt_brand_standard_2_overlay_pressed_brand_2_mix);
                    }
                }
            }
            :host([data-type="secondary"]) {
                button {
                    background-color: transparent;
                    color: var(--text_primary);
                    border-color: var(--fill_standard_primary);
                    &:hover {
                        background-color: var(--overlay_hover);
                    }
                    &:active {
                        background-color: var(--overlay_pressed);
                    }
                }
            }
            button {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                overflow: visible;
                background-color: var(--brand_standard);
                border: 1px solid;
                border-radius: 4px;
                outline-style: none;
                font-size: 12px;
                line-height: 14px;
                min-width: 62px;
                margin: 0px;
                padding: 4px 7px;
            }
        `;
    }
}
