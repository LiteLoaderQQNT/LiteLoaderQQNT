// HTML 模板
const template = document.createElement("template");
template.innerHTML = /*html*/ `
<style>
    :host([data-direction="column"]) {
        flex: 1;
        margin: 0px 10px;
        text-align: center;
    }

    :host([data-direction="row"]) {
        margin: 12px 0px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
</style>
<slot></slot>
`;


// 自定义标签
customElements.define("setting-item", class extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: "open" });
        this.shadowRoot.append(template.content.cloneNode(true));
    }

    static observedAttributes = ["data-direction"];
});
