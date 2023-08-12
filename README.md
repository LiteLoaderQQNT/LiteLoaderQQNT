# LiteLoaderQQNT

LiteLoaderQQNT 是 QQNT 的插件加载器， 一般在 QQNT 的环境内简称为 LiteLoader。 

它可以让你自由地为 QQNT 添加各种插件， 并实现例如美化主题、增加功能等各种功能。

Telegram 闲聊群：https://t.me/LiteLoaderQQNT


## 注意事项

> 本项目仅为个人兴趣而制作，开发目的在于学习和探索，一切开发皆在学习，请勿用于非法用途。  
> 因使用本项目产生的一切问题与后果由使用者自行承担，项目开发者不承担任何责任。

- 目前仍在开发当中，可能会存在一些问题和不足。
- 仅为个人兴趣而制作，开发目的在于学习和探索。
- 能力有限，随缘更新。不过也欢迎各位来提交PR。
- 由于项目特殊性，必要时会停止开发或删除仓库。

**创建和谐社区环境，建设靠大家。开源社区需要你！**  
有问题请先发 issue，若是开发者可提交 PR 来帮助项目完善变得更好！  
普通用户也可参与项目发展，提出新想法新建议，问题再小也是问题！  
而不是进群吐槽抱怨，不仅污染社区环境，还不能解决实际问题。  
更不建议去攻击他人，请从实际问题思考解决，而不是互相攻击。


## 插件开发

如需上架插件市场，请参考最新的插件模板（暂未完工），也建议参考其他插件。  
需要打包的插件请在仓库发布 Release，文件建议使用 Github Actions 打包。  
插件模板：[LiteLoaderQQNT-Plugin-Template](https://github.com/mo-jinran/LiteLoaderQQNT-Plugin-Template)  
插件仓库：[LiteLoaderQQNT-Plugin-List](https://github.com/mo-jinran/LiteLoaderQQNT-Plugin-List)

> `Windows QQNT 9.8.5` 版本（除 9.9.1-15717 版本）及以上暂时无法打开自身的 DevTools，请安装 Chii Devtools 插件（推荐）或 QQNT vConsole 插件进行调试。


## 安装教程

安装 LiteLoaderQQNT 之前，确保你安装好了基于 QQNT 架构的 QQ。安装分为从 Releases 中下载稳定版（推荐）和通过 Git clone 安装。  
安装时请务必**不要修改** LiteLoader 内的 `package.json`，如需，请修改 `QQNT安装目录/resources/app/package.json`。


### 安装位置

正常情况下，需要将含有 LiteLoaderQQNT 本体的文件夹放到 `QQNT安装目录/resources/app` 下。

对于不同系统，默认情况下此位置可能为：

- Windows: `C:\Program Files\Tencent\QQNT\resources\app`

- Linux: `/opt/QQ/resources/app`

  对于使用 Flatpak 安装的 QQNT，安装位置请参阅 [Flatpak 文档 - Flatpak Command Reference](https://docs.flatpak.org/en/latest/flatpak-command-reference.html) 中的 Description 部分。

- MacOS: `/Applications/QQ.app/Contents/Resources/app`

安装完成后的目录结构应类似于这样：

```
├─app_launcher
├─LiteLoader    <- 含有 LiteLoader 本体的文件夹
│  ├─builtins
│  ├─src
│  ├─package.json
│  └─...
├─package.json  <- 需要修改的 package.json
└─...
```

需要修改的 `package.json` 的示例：

```
{
    ...
    "homepage": "https://im.qq.com",
    "sideEffects": true,
    "main": "LiteLoader",   <- 修改这里（只需要指向文件夹即可）
    ...
}
```

### 注意事项

**目前最新的 15820 版本已能正常使用，但如果遇到运行不正确的地方请及时提交`Issue`**  


> **Important**
>
> **请确认您正在使用的 QQNT 版本**。
>
> 对于 **`Windows QQNT 9.9.1`** 及以上的版本（**除 15717 版本外**），安装后请阅读 [启动方法](#启动方法)，或考虑降级安装更旧的版本和切换到 **15717** 版本以规避文件校验。
>
> 对于 **`MacOS QQNT 6.9.18`** 及以上的版本，请考虑降级安装更旧的版本或切换至 App Store 版本。

下文中的 **“安装位置”** 和 **“LiteLoaderQQNT 需要安装到的位置”** 均指 **`QQNT安装目录/resources/app`** ，需要修改的 **`package.json`** 文件均位于 **`QQNT安装目录/resources/app/`** 。

> **Note**
>
> 如使用 [启动方法](#启动方法) 内提到的 Launcher 则不需要修改 `package.json` 文件。

### 安装步骤

- 从 [Releases](https://github.com/mo-jinran/LiteLoaderQQNT/releases) 中下载稳定版的方式进行安装（推荐）
  1. 从 Releases 中下载最新的 `LiteLoaderQQNT.zip`。
  
  2. 解压出 `LiteLoaderQQNT.zip` 内的  `LiteLoader` 文件夹到 [安装位置](#安装位置)。
  
  3. 修改 [安装位置](#安装位置) 中提到的 `package.json`，将 `"main": "/app_launcher/index.js"` 改为 `"main": "LiteLoader"`。
  
  4. 至此，安装完成。
  
- 使用 Git clone 的方式安装（不推荐，适合高阶用户）

  1. 确保你的系统装有 [Git](https://git-scm.com/downloads)。
  2. 在终端中打开上文提到的 LiteLoaderQQNT 需要安装到的位置。
  3. 输入 `git clone https://github.com/mo-jinran/LiteLoaderQQNT.git --recursive LiteLoader` 一并拉取项目和子模块。
  4. 修改 [安装位置](#安装位置) 中提到的 `package.json`，将 `"main": "/app_launcher/index.js"` 改为 `"main": "LiteLoader"`。
  5. 至此，安装完成。
  
- 通过 AUR 安装（仅限 Arch Linux 和 Arch-based Linux）

  1. 确保你没有安装 Linux QQ 或已从 AUR 安装非 `linuxqq-appimage` 包的 Linux QQ。

  2. 使用你的 AUR Helper 安装  [**liteloader-qqnt-bin**](https://aur.archlinux.org/packages/liteloader-qqnt-bin) 包（对于想要使用最新代码的用户，请安装 [**liteloader-qqnt-git**](https://aur.archlinux.org/packages/liteloader-qqnt-git) 包而不是 [**liteloader-qqnt-bin**](https://aur.archlinux.org/packages/liteloader-qqnt-bin) 包）

     ```bash
     yay -S liteloader-qqnt-bin  # 或 liteloader-qqnt-git
     # 或
     paru -S liteloader-qqnt-bin # 或 liteloader-qqnt-git
     ```


### 启动方法

由于 **`Windows QQNT 9.9.1`** 版本和 **`MacOS QQNT 6.9.18`** 版本开始被添加文件校验，  
MacOS 目前只能通过安装老版本 QQNT 或切换至 App Store 版（目前 App Store 版仍然不含文件校验）来解决。  
更老版本 QQNT 以及 Windows QQNT 9.9.1-15717 版本没有添加文件校验，无需阅读这段教程。

- 使用 Launcher （闭源软件，不麻烦，推荐）：
  1. 如有，请将被修改的 `package.json` 文件内容还原（必须跟原文件一样）。
  2. 从 releases 中下载额外的 Launcher（`LiteLoaderQQNT-Launcher_x64.exe` 或 `LiteLoaderQQNT-Launcher_x86.exe`），Launcher 可以只用x86版本。
  3. 将额外下载的 Launcher 移动到 QQNT 安装目录下 QQ.exe 同级目录。
  4. 至此，安装完成。为了加载 LiteLoaderQQNT，你需要每次运行都使用 Launcher 而不是 QQ。

- 使用 Patch （开源方法，麻烦，不推荐）：

  1. 必须在 LiteLoaderQQNT 的 patch 目录内以**管理员模式**运行终端

  2. 在终端中运行对应版本的 ps1 脚本（例如输入 `.\9.9.1-15489_x64.ps1` 后回车运行）

  3. 至此，安装完成。经过 Patch 后去除了文件校验的 QQ.exe 将永久生效。

     > **Note**
     >
     > 若 Launcher 或 Patch 运行失败无反应请尝试使用管理员权限运行重试，另请检查 PowerShell 版本是否更新到最新版。


## 数据目录

LiteLoaderQQNT 的默认数据文件夹在 `用户目录/Documents/LiteLoaderQQNT`，修改环境变量 `LITELOADERQQNT_PROFILE` 可指定目录位置。

数据目录结构：

```
LiteLoaderQQNT
    ├─plugins           <- 插件本体目录
    │   ├─my-plugin     <- 插件本体
    │   └─...
    ├─plugins_cache     <- 插件缓存目录
    │   ├─my-plugin
    │   └─...
    ├─plugins_data      <- 插件数据目录
    │   ├─my-plugin
    │   └─...
    └─config.json       <- LiteLoader配置文件
```


## 开源协议

```
MIT License

Copyright (c) 2023 沫烬染

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
