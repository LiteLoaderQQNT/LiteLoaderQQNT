const { join } = require("path");
require(join(process.resourcesPath, "app", "major.node")).load("internal_launcher", module);