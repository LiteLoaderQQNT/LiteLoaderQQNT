# LiteLoaderQQNT

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub release](https://img.shields.io/github/v/release/LiteLoaderQQNT/LiteLoaderQQNT?logo=github)](https://github.com/LiteLoaderQQNT/LiteLoaderQQNT/releases)
[![Follow on Telegram](https://img.shields.io/badge/Follow-Telegram-blue?logo=telegram)](https://t.me/LiteLoaderQQNT_Channel)

> 轻量 · 简洁 · 开源 · 福瑞

**简体中文** | [English](https://github.com/LiteLoaderQQNT/LiteLoaderQQNT/blob/main/README_EN.md)

LiteLoaderQQNT 是 QQNT 的插件加载器，一般在 QQNT 的环境内简称为 LiteLoader。它可以让你自由地为 QQNT 添加各种插件，实现美化主题、增加功能等各种功能。详情查看 LiteLoaderQQNT 官网：<https://liteloaderqqnt.github.io>。

> [!CAUTION]
> QQ 安全中心可能会将 LiteLoaderQQNT 当作“非法外挂工具”并下线您的设备，还有可能封禁您的账号。**请谨慎使用 LiteLoaderQQNT。**

## 安装

> [!NOTE]
> 此版本的 LiteLoaderQQNT 需搭配频道内未公开的 `dbghelp.dll` 方可使用。

### 下载 LiteLoaderQQNT 本体

你需要先下载 LiteLoaderQQNT 到任意位置，以下有两种方式：

- Release （稳定版）：前往 [Release](https://github.com/LiteLoaderQQNT/LiteLoaderQQNT/releases) 页，下载 `LiteLoaderQQNT.zip` 文件解压到任意位置。
- Clone （最新提交）：使用 Git 工具将 LiteLoaderQQNT 仓库 Clone 到本地任意位置。

    ```bash
    git clone --depth 1 https://github.com/LiteLoaderQQNT/LiteLoaderQQNT.git
    ```

### 在 Windows 上绕过 QQNT 文件校验

请根据你的操作系统架构在 Telegram 群内下载 `dbghelp_*.dll` 文件，将其重命名为 `dbghelp.dll` 后放入 `QQ.exe` 同级目录下。

### 修改文件以安装
1. 转到 QQNT 安装目录。以 `9.9.21-38711` 为例，路径为 `QQNT\versions\9.9.21-38711（取决于你的版本）\resources\app`

2. 创建 `app_launcher`目录。

3. 在该目录内创建 `LiteLoader.js` 文件（文件名可随意设定， 需保留拓展名 `.js`），并写入以下内容：

    ```javascript
    require(String.raw`修改为 LiteLoaderQQNT 本体的绝对路径，保留反引号`)
    ```

4. 修改 `app\package.json` 文件，将 `main` 后值改为 `./app_launcher/LiteLoader.js`，其中 `LiteLoader` 即为你创建的文件名。

   ```diff
   -   "main": "./application.asar/app_launcher/index.js",
   +   "main": "./app_launcher/LiteLoader.js",
   ```

### 更改插件数据目录 （可选）

支持设置 `LITELOADERQQNT_PROFILE` 环境变量指定 `data` `plugins` 存储位置，即可不在本体目录进行读写操作。当本体目录无写权限时（如 MacOS 与 Linux 平台 QQNT，以及类似于 flatpak 打包的 QQNT），请设定该变量到当前用户具有可读写权限的位置。

如果你想将本体与存储目录合并在一起需将 `LITELOADERQQNT_PROFILE` 环境变量删除，将 `data` `plugins` 移动回本体根目录下。

### 检查是否安装成功

按照上述教程完成安装后，有两种方法检查 LiteLoaderQQNT 是否成功安装：

- 运行 QQNT 并打开设置，查看左侧列表是否出现 LiteLoaderQQNT 选项
- 使用终端运行 QQNT 查看是否有 LiteLoaderQQNT 相关内容输出显示

如果有显示，即安装成功，玩的开心！

## 插件

### 正常操作

在设置界面即可看到安装/卸载插件功能；也可以使用社区开发的插件市场类插件（例如 [plugin-list-viewer](https://github.com/ltxhhz/LL-plugin-list-viewer)），在其中进行操作。

### 手动操作

将插件目录移动到 `LiteLoaderQQNT/plugins` 文件夹内以安装，在 `plugins` 目录中删除对应目录以卸载（插件数据在 `data` 目录下对应目录）。

### 寻找

可以通过以下方式寻找插件：

- 官网首页
- 第三方插件市场
- GitHub 搜索

官方维护着一份插件列表，收录了已知的大部分插件，可在官网首页中查看详情。此外，还有一份 [JSON 格式的插件列表](https://github.com/LiteLoaderQQNT/Plugin-List/blob/v4/plugins.json)。

## 开发

详见[官方文档](https://liteloaderqqnt.github.io/docs/introduction.html)。

## 许可证

LiteLoaderQQNT 采用 [MIT 许可证](./LICENSE) 进行开源。
