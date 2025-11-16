import { BaseElement } from "../element.js";


export class Button extends BaseElement {
    getTemplate() {
        return /*html*/ `
            <button>
                <slot></slot>
            </button>
        `;
    }

    getStyles() {
        return /*css*/ `
            :host { position: relative; vertical-align: text-bottom; }
            button {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                background-color: var(--brand_standard);
                color: var(--on_brand_primary);
                border: 1px solid var(--brand_standard);
                border-radius: 4px;
                outline: none;
                font-size: 12px;
                line-height: 14px;
                min-width: 62px;
                margin: 0px;
                padding: 4px 7px;
                cursor: pointer;
            }
            button:hover { background-color: var(--nt_brand_standard_2_overlay_hover_brand_2_mix); }
            button:active { background-color: var(--nt_brand_standard_2_overlay_pressed_brand_2_mix); }
            :host([data-type="secondary"]) button {
                background-color: transparent;
                color: var(--text_primary);
                border-color: var(--fill_standard_primary);
            }
            :host([data-type="secondary"]) button:hover { background-color: var(--overlay_hover); }
            :host([data-type="secondary"]) button:active { background-color: var(--overlay_pressed); }
        `;
    }
}
