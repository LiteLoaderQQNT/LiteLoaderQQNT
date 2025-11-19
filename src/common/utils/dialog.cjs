/**
 * 显示错误对话框
 */
function showErrorDialog(title, message) {
    const showDialog = () => {
        dialog.showMessageBox(null, {
            type: "error",
            title: "LiteLoaderQQNT",
            message: `${title}\n${message}`
        });
    };
    app.isReady() ? showDialog() : app.once("ready", showDialog);
}

module.exports = { showErrorDialog };