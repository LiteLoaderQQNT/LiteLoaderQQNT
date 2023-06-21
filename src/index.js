const { output } = require("./main/base.js");

// 初始化
output("Initializing...");


// 加载
require("./main/index.js");


// 继续执行QQNT启动
output("Starting QQNT...");
require("../app_launcher/index.js");
