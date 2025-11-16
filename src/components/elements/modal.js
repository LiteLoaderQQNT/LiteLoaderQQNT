import { BaseElement } from "../element.js";


export class Modal extends BaseElement {
    #title = this.shadowRoot.querySelector(".title");
    #close = this.shadowRoot.querySelector(".close");
    #modal = this.shadowRoot.querySelector(".modal");
    #toggleActiveBound = this.#toggleActive.bind(this);

    #toggleActive() {
        this.setActive(!this.getActive());
    }

    connectedCallback() {
        super.connectedCallback();
        this.#close.addEventListener("click", this.#toggleActiveBound);
        this.#modal.addEventListener("click", this.#toggleActiveBound);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.#close.removeEventListener("click", this.#toggleActiveBound);
        this.#modal.removeEventListener("click", this.#toggleActiveBound);
    }

    update() {
        this.#title.textContent = this.getTitle();
    }

    getTemplate() {
        return /*html*/ `
            <div class="modal"></div>
            <div class="main">
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
        `;
    }

    getStyles() {
        return /*css*/ `
            :host { display: none; }
            :host([is-active]) {
                display: flex;
                justify-content: center;
                align-items: center;
                position: fixed;
                inset: 0;
                z-index: 5000;
                animation: fadeIn .2s ease;
            }
            .modal {
                position: fixed;
                inset: 0;
                background-color: rgba(0, 0, 0, .5);
                animation: fadeIn .2s ease;
            }
            .main {
                position: relative;
                display: flex;
                flex-direction: column;
                width: 480px;
                background-color: var(--bg_top_light);
                border: var(--border_primary);
                border-radius: 8px;
                box-shadow: var(--shadow_bg_middle_primary);
                overflow: hidden;
                z-index: 1;
                animation: slideDown .3s cubic-bezier(.38, 0, .24, 1);
            }
            .header {
                position: relative;
                flex-shrink: 0;
                height: 28px;
                background-color: var(--bg_bottom_standard);
                border-bottom: 1px solid rgba(255, 255, 255, .06);
            }
            .title {
                font-size: 12px;
                line-height: 28px;
                text-align: center;
            }
            .close {
                position: absolute;
                right: 4px;
                top: 50%;
                width: 16px;
                height: 16px;
                color: var(--icon-primary);
                transform: translateY(-50%);
                cursor: pointer;
            }
            .body {
                flex: 1;
                padding: 20px;
                background-color: var(--bg_bottom_standard);
                overflow-y: auto;
            }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideDown {
                from { opacity: 0; transform: translateY(-50px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
    }
}
