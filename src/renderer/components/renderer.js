import { Section } from "./elements/section.js";
import { Panel } from "./elements/panel.js";
import { List } from "./elements/list.js";
import { Item } from "./elements/item.js";
import { Select } from "./elements/select.js";
import { Option } from "./elements/option.js";
import { Switch } from "./elements/switch.js";
import { Button } from "./elements/button.js";
import { Text } from "./elements/text.js";
import { Link } from "./elements/link.js";
import { Divider } from "./elements/divider.js";
import { Modal } from "./elements/modal.js";

/**
 * 组件注册表
 */
const COMPONENTS = [
    { tag: "setting-section", element: Section },
    { tag: "setting-panel", element: Panel },
    { tag: "setting-list", element: List },
    { tag: "setting-item", element: Item },
    { tag: "setting-select", element: Select },
    { tag: "setting-option", element: Option },
    { tag: "setting-switch", element: Switch },
    { tag: "setting-button", element: Button },
    { tag: "setting-text", element: Text },
    { tag: "setting-link", element: Link },
    { tag: "setting-divider", element: Divider },
    { tag: "setting-modal", element: Modal }
];

/**
 * 注册所有自定义元素
 */
COMPONENTS.forEach(({ tag, element }) => {
    if (!customElements.get(tag)) {
        customElements.define(tag, element);
    }
});