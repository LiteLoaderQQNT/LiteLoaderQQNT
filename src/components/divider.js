// HTML 模板
const template = document.createElement("template");
template.innerHTML = /*html*/ `
<style>
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
</style>
`;


// 自定义标签
customElements.define("setting-divider", class extends HTMLElement {

    static observedAttributes = ["data-direction"];

    constructor() {
        super();

        this.attachShadow({ mode: "open" });
        this.shadowRoot.append(template.content.cloneNode(true));
    }

});
