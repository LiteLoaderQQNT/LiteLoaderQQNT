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
        if (this.getValue()) {
            LiteLoader.api.openExternal(this.getValue());
        }
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
