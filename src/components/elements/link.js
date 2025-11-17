import { BaseElement } from "../element.js";


export class Link extends BaseElement {
    #openExternalBound = this.#openExternal.bind(this);

    connectedCallback() {
        super.connectedCallback();
        this.addEventListener("click", this.#openExternalBound);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListener("click", this.#openExternalBound);
    }

    #openExternal() {
        const value = this.getValue();
        try {
            new URL(value);
            LiteLoader.api.openExternal(value);
        } catch {
            LiteLoader.api.openPath(value);
        }
    }

    update() {
        this.textContent ||= this.getValue();
    }

    getTemplate() {
        return /*html*/ `
            <slot></slot>
        `;
    }

    getStyles() {
        return /*css*/ `
            :host { color: var(--text_link); cursor: pointer; }
        `;
    }
}
