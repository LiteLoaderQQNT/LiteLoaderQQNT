import { BaseElement } from "../element.js";


export class Modal extends BaseElement {
    constructor() {
        super();
        this._title = this.shadowRoot.querySelector(".title");
        this._close = this.shadowRoot.querySelector(".close");
        this._modal = this.shadowRoot.querySelector(".modal");
        this._close.addEventListener("click", () => this.setActive(!this.getActive()));
        this._modal.addEventListener("click", () => this.setActive(!this.getActive()));
    }

    getTemplate() {
        return /*html*/ `
            <div class="modal"></div>
            <div class="main">
                <div class="container">
                    <div class="header">
                        <div class="title"></div>
                        <svg class="close" viewBox="0 0 24 24">
                            <use xlink:href="/_upper_/resource/icons/close_24.svg#close_24"></use>
                        </svg>
                    </div>
                    <div class="body">
                        <slot></slot>
                    </div>
                </div>
            </div>
        `;
    }

    getStyles() {
        return /*css*/ `
            :host {
                display: none;
            }
            :host([is-active]) {
                display: flex;
                justify-content: center;
                align-items: center;
                position: fixed;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                background: var(--msp-container);
                z-index: 5000;
                .modal {
                    position: fixed;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    left: 0;
                    background-color: rgba(0, 0, 0, 0.5);
                }
                .main {
                    width: 480px;
                    height: fit-content;
                    position: absolute;
                    background-clip: padding-box;
                    background-color: var(--bg_top_light);
                    box-shadow: var(--shadow_bg_middle_primary);
                    border: var(--border_primary);
                    border-radius: 8px;
                    overflow: hidden;
                    & .container {
                        background-color: var(--bg_bottom_standard);
                        overflow: hidden;
                        & .header {
                            height: 28px;
                            border-bottom: 1px solid rgba(255, 255, 255, 0.06);
                            position: relative;
                            & .title {
                                font-family: "PingFang SC";
                                font-size: 12px;
                                font-weight: 400;
                                line-height: 28px;
                                text-align: center;
                            }
                            & .close {
                                width: 16px;
                                height: 16px;
                                position: absolute;
                                right: 4px;
                                top: 50%;
                                transform: translateY(-50%);
                                color: var(--icon-primary);
                            }
                        }
                        & .body {
                            border-radius: 8px;
                            padding: 20px 20px 0px 20px;
                        }
                    }
                }
            }
        `;
    }

    update() {
        this._title.textContent = this.getTitle();
    }
}
