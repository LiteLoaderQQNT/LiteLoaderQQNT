const { app } = require("electron");
const { output, qq_install_dir } = require("./main/base.js");

// 初始化
output("Initializing...");
output(`Found QQNT installation at ${qq_install_dir}.`);

app.commandLine.appendSwitch("disable-features", "OutOfBlinkCors");
app.quit = () => { };

// 加载
require("./main/index.js");


// 继续执行QQNT启动
output("Starting QQNT...");

if (process.platform == "win32") {
    return require(`${qq_install_dir}/resources/app/app_launcher/index.js`);
}
if (process.platform == "linux") {
    return require(`${qq_install_dir}/resources/app/app_launcher/index.js`);
}
if (process.platform == "darwin") {
    return require(`${qq_install_dir}/Resources/app/app_launcher/index.js`);
}