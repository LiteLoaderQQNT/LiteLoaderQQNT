export class BaseElement extends HTMLElement {
    static observedAttributes = [
        "data-title",
        "data-value",
        "data-type",
        "data-direction",
        "is-collapsible",
        "is-selected",
        "is-active",
        "is-disabled"
    ];

    attributeChangedCallback() {
        this.update();
    }

    connectedCallback() {
        this.update();
    }

    getTemplate() { }

    getStyles() { }

    update() { }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = this.getTemplate();
        const element_sheet = new CSSStyleSheet();
        const default_sheet = new CSSStyleSheet();
        element_sheet.replaceSync(this.getStyles());
        default_sheet.replaceSync(`
            :host([is-disabled]), [is-disabled] {
                opacity: 0.3;
                cursor: not-allowed;
                pointer-events: none;
            }
            :host(.hidden), .hidden {
                display: none !important;
            }
        `);
        this.shadowRoot.adoptedStyleSheets = [default_sheet, element_sheet];
    }

    setTitle(title) {
        this.setAttribute("data-title", title);
    }

    getTitle() {
        return this.getAttribute("data-title");
    }

    setValue(value) {
        this.setAttribute("data-value", value);
    }

    getValue() {
        return this.getAttribute("data-value");
    }

    setType(type) {
        if (!["primary", "secondary"].includes(type)) {
            throw new Error("Type must be 'primary' or 'secondary'");
        }
        this.setAttribute("data-type", type);
    }

    getType() {
        return this.getAttribute("data-type");
    }

    setDirection(direction) {
        if (!["column", "row"].includes(direction)) {
            throw new Error("Direction must be 'column' or 'row'");
        }
        this.setAttribute("data-direction", direction);
    }

    getDirection() {
        return this.getAttribute("data-direction");
    }

    setCollapsible(collapsible) {
        this.toggleAttribute("is-collapsible", collapsible);
    }

    getCollapsible() {
        return this.hasAttribute("is-collapsible");
    }

    setSelected(selected) {
        this.toggleAttribute("is-selected", selected);
    }

    getSelected() {
        return this.hasAttribute("is-selected");
    }

    setActive(active) {
        this.toggleAttribute("is-active", active);
    }

    getActive() {
        return this.hasAttribute("is-active");
    }

    setDisabled(disabled) {
        this.toggleAttribute("is-disabled", disabled);
    }

    getDisabled() {
        return this.hasAttribute("is-disabled");
    }
}
