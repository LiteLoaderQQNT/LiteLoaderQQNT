# LiteLoaderQQNT

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub release](https://img.shields.io/github/v/release/LiteLoaderQQNT/LiteLoaderQQNT?logo=github)](https://github.com/LiteLoaderQQNT/LiteLoaderQQNT/releases)
[![Follow on Telegram](https://img.shields.io/badge/Follow-Telegram-blue?logo=telegram)](https://t.me/LiteLoaderQQNT_Channel)

> 轻量 · 简洁 · 开源 · 福瑞

**简体中文** | [English](https://github.com/LiteLoaderQQNT/LiteLoaderQQNT/blob/main/README_EN.md)

LiteLoaderQQNT 是 QQNT 的插件加载器，一般在 QQNT 的环境内简称为 LiteLoader。它可以让你自由地为 QQNT 添加各种插件，实现美化主题、增加功能等各种功能。详情查看 LiteLoaderQQNT 官网：<https://liteloaderqqnt.github.io>。

> [!CAUTION]
> QQ 安全中心可能会将 LiteLoaderQQNT 当作外挂软件并下线您的设备，还有可能会导致您的 QQ 账号被封禁，建议使用小号安装 LiteLoaderQQNT（目前已有人收到 QQ 安全账号的提醒）。请谨慎使用 LiteLoaderQQNT。

## 安装

> [!NOTE]
> 此文档为 LiteLoaderQQNT 1.2.4 编写。目前版本暂时仅支持 Windows 64 位，需搭配频道内未公开的 `dbghelp.dll` 方可使用。

### 下载 LiteLoaderQQNT 本体

你需要先下载 LiteLoaderQQNT 到任意位置，以下有两种方式：

- Release （稳定版）：前往 [Release](https://github.com/LiteLoaderQQNT/LiteLoaderQQNT/releases) 页，下载 `LiteLoaderQQNT.zip` 文件解压到任意位置。
- Clone （最新提交）：使用 Git 工具将 LiteLoaderQQNT 仓库 Clone 到本地任意位置。

    ```bash
    git clone --depth 1 https://github.com/LiteLoaderQQNT/LiteLoaderQQNT.git
    ```

### 在 Windows 上绕过 QQNT 文件校验

请根据你的操作系统架构在 Telegram 群内下载 `dbghelp_*.dll` 文件，将其重命名为 `dbghelp.dll` 后放入 `QQ.exe` 同级目录下。

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
