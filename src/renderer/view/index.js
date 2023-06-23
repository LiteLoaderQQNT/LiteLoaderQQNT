const css_file_path = `/${betterQQNT.path.root}/src/renderer/view/style.css`;
const html_file_path = `/${betterQQNT.path.root}/src/renderer/view/view.html`;


export async function onConfigView(view) {
    // CSS
    const css_text = await (await fetch(css_file_path)).text();
    const style = document.createElement("style");
    style.textContent = css_text;
    view.appendChild(style);


    // HTMl
    const html_text = await (await fetch(html_file_path)).text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html_text, "text/html");
    doc.querySelectorAll("section").forEach(node => view.appendChild(node));


    // 初始化
    // 版本号
    const qqnt = view.querySelector(".versions .qqnt .content");
    const betterqqnt = view.querySelector(".versions .betterqqnt .content");
    const chromium = view.querySelector(".versions .chromium .content");
    const electron = view.querySelector(".versions .electron .content");
    const nodejs = view.querySelector(".versions .nodejs .content");

    qqnt.textContent = betterQQNT.versions.qqnt;
    betterqqnt.textContent = betterQQNT.versions.betterQQNT;
    chromium.textContent = betterQQNT.versions.chrome;
    electron.textContent = betterQQNT.versions.electron;
    nodejs.textContent = betterQQNT.versions.node;
}