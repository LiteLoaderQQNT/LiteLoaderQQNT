require("./liteloader_api/main.js");
require("./loader_core/plugin_loader.js");
require("./main.js");

const { app, dialog } = require("electron");
const path = require("path");
const fs = require("fs");

let isLatest = true;
let preloads = {};

const liteloader_preload_path = path.join(LiteLoader.path.root, "src/preload.js");
const qqnt_application_path = (() => {
    const app_path = path.join(process.resourcesPath, "app");
    if (!fs.existsSync(path.join(app_path, "versions"))) return path.join(app_path, "application");
    else return path.join(app_path, "versions", LiteLoader.versions.qqnt, "application");
})();

const profile_application_path = path.join(LiteLoader.path.profile, "application");
const inject_application_path = `${qqnt_application_path}/../application`;

const liteloader_preload_content = fs.readFileSync(liteloader_preload_path, "utf-8");
const qqnt_application_content = fs.readdirSync(`${qqnt_application_path}.asar`, "utf-8");

for (const item_name of qqnt_application_content) {
    if (!item_name.includes("preload")) continue;

    const qqnt_preload_path = path.join(qqnt_application_path, item_name);
    const qqnt_preload_content = fs.readFileSync(qqnt_preload_path, "utf-8");

    const inject_preload_path = `${inject_application_path}/${item_name}`;
    const inject_preload_content = `${liteloader_preload_content}\n{${qqnt_preload_content}}`;

    preloads[item_name] = inject_preload_content;

    if (fs.existsSync(inject_preload_path)) {
        const injected_preload_content = fs.readFileSync(inject_preload_path, "utf-8");
        if (inject_preload_content == injected_preload_content) continue;
    }

    isLatest = false;
}

if (!isLatest) {
    try {
        if (fs.existsSync(inject_application_path)) {
            fs.rmSync(inject_application_path, { recursive: true, force: true });
        }
        fs.mkdirSync(inject_application_path, { recursive: true });

        for (const item_name in preloads) {
            const inject_preload_path = path.join(inject_application_path, item_name);
            const inject_preload_content = preloads[item_name];
            fs.writeFileSync(inject_preload_path, inject_preload_content, "utf-8");
        }
    }
    catch (error) {
        if (fs.existsSync(profile_application_path)) {
            fs.rmSync(profile_application_path, { recursive: true, force: true });
        }
        fs.mkdirSync(profile_application_path, { recursive: true });

        for (const item_name in preloads) {
            const profile_preload_path = path.join(profile_application_path, item_name);
            const profile_preload_content = preloads[item_name];
            fs.writeFileSync(profile_preload_path, profile_preload_content, "utf-8");
        }

        app.whenReady().then(() => {
            dialog.showMessageBoxSync(null, {
                type: "error",
                title: "LiteLoaderQQNT",
                message: "初始化失败！不用担心，这可能需要你手动移动某个文件夹解决\n"
                    + "错误一般由于目标文件不存在，或目标文件内容与预期不符导致\n"
                    + "由于权限不足，无法自动完成此操作，请按照下方提示手动操作\n\n"
                    + "将文件夹：\n"
                    + `${profile_application_path}\n`
                    + "移到此处：\n"
                    + `${path.join(qqnt_application_path, "..")}\n\n`
                    + `更多信息请查看官网：${LiteLoader.package.liteloader.homepage}`,
            });
            app.exit(0);
        });
    }
}
