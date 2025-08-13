import { BaseElement } from "../element.js";


export class Option extends BaseElement {
    constructor() {
        super();
    }

    getTemplate() {
        return /*html*/ `
            <li>
                <span>
                    <slot></slot>
                </span>
                <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 7L6.00001 11L14 3" stroke="currentColor" stroke-linejoin="round"></path>
                </svg>
            </li>
        `;
    }

    getStyles() {
        return /*css*/ `
            :host {
                display: block;
            }
            :host([is-selected]) li {
                background-color: var(--overlay_active);
            }
            :host([is-selected]) svg {
                display: block;
            }
            li {
                display: flex;
                justify-content: space-between;
                border-radius: 4px;
                box-sizing: border-box;
                line-height: 24px;
                color: var(--text_primary);
                font-size: 12px;
                padding: 0px 8px;
                &:hover {
                    background-color: var(--overlay_hover);
                }
                &:active {
                    background-color: var(--overlay_pressed);
                }
            }
            span {
                margin-right: 8px;
                overflow: hidden;
                text-wrap: nowrap;
                text-overflow: ellipsis;
            }
            svg {
                flex-shrink: 0;
                display: none;
                width: 1em;
                height: 1em;
                color: var(--icon_primary);
                position: relative;
                right: -4px;
                top: 7px;
            }
        `;
    }
}
