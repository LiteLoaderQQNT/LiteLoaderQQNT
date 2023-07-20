const { output, qq_install_dir } = require("./main/base.js");

// 初始化
output("Initializing...");
output(`Found QQNT installation at ${qq_install_dir}.`);

// 加载
require("./main/index.js");


// 继续执行QQNT启动
output("Starting QQNT...");
require(`${qq_install_dir}/resources/app/app_launcher/index.js`);