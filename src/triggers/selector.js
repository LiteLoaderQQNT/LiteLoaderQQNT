export class BaseSelector extends EventTarget {
    constructor() {
        super();
        this.addEventListener("trigger", this.trigger);
    }
    getHash() {
        return "";
    }
    getSelector() {
        return "";
    }
    trigger() {
        return;
    }
}