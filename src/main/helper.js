const os = require('os');
const path = require('path');
const { execSync } = require('child_process');

// 读取注册表
function readRegistryValue(keyPath, valueName) {
    try {
        const command = `reg query "${keyPath}" /v "${valueName}"`;
        const stdout = execSync(command, { stdio: 'pipe' }).toString();
        const lines = stdout.split('\r\n');
        const valueLine = lines.find(line => line.includes(valueName));
        if (valueLine) {
            const parts = valueLine.split(/\s+/);
            return path.dirname(parts.slice(3).join(' '));
        }
    } catch (error) {
        //console.error(`Error reading registry: ${error}`);
        //此处抛异常是正常的，因为有两种路径，总有一个是读取不到的。
    }
    return null;
}

function getQQInstallDir() {
    if (os.platform() === "win32") {
        //Windows 则暴力拉取注册表
        const reg = "HKLM\\Software\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\QQ";
        const reg2 = "HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\QQ";
        return readRegistryValue(reg, "UninstallString") || readRegistryValue(reg2, "UninstallString");
    } else {
        /*
        ? OS X 和 Linux 不同发行版获取QQ安装路径的方法各不相同，
        ? 故 Linux 和 OS X 都先写死为相对路径，待日后解决该问题，这并不是一个非常急迫的需求。
        const stdout = execSync(`which qq`, { stdio: 'pipe' }).toString();
        return path.dirname(stdout);
        */
        return path.join(__dirname, "../../../../../");
    }
}
console.log(getQQInstallDir());

module.exports = {
    getQQInstallDir
}