const path = require("path");

const zip = (() => {
    const major_node = path.join(process.resourcesPath, "./app/major.node");
    require(major_node).load("internal_admzip", module);
    return module.exports.admZip.default;
})();

module.exports = { zip };