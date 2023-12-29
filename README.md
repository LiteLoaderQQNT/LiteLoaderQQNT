# LiteLoaderQQNT

LiteLoaderQQNT 是 QQNT 的插件加载器，一般在 QQNT 的环境内简称为 LiteLoader。  
它可以让你自由地为 QQNT 添加各种插件，并实现例如美化主题、增加功能等各种功能。

Telegram 闲聊群：https://t.me/LiteLoaderQQNT  
LiteLoaderQQNT 主页：https://llqqnt.mukapp.top



## ⚠️ 从0.5.3版本升级上来的用户请注意

0.5.3版本内置的插件商店采用了`ghproxy.com`作为 Github 镜像加速，但现在这个网站访问不稳定，这可能会导致你整个QQ加载插件缓慢，设置页不出LiteLoaderQQNT的菜单，所以从 0.5.4 版本起已经移除了这个镜像加速，你也许需要自行挂全局代理（网卡级别的，例如TUN模式）或者手动设置代理（0.5.5起支持）才能比较快速地访问市场。

但是，由于这个镜像源会写入配置文件，即使你更新到 0.5.4 版本以上，还会默认使用这个镜像导致插件市场无法加载。这时候，你需要自行去你的 LiteLoaderQQNT [数据目录](#数据目录) 下，删除`config.json`（**千万注意不要删错了！！！**是LiteLoaderQQNT的数据目录，不是QQNT的数据目录，可以在LiteLoaderQQNT主配置界面进入这个目录，存LiteLoaderQQNT插件的那个目录下面），重启QQ即可。**（新用户无此问题）**

*注意：如果你已经更新到 0.5.5 版本以上，在LiteLoaderQQNT的主配置界面就能很方便地设置**网络代理**，设置后即刻生效，随后你可以进入插件市场，多点几次刷新页面就出来了。*




## ⚠️ 注意事项

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




## 💻 插件开发

如需上架插件市场，请参考最新的插件模板（暂未完工），也建议参考其他插件。  
需要打包的插件请在仓库发布 Release，文件建议使用 Github Actions 打包。  
插件模板：[LiteLoaderQQNT-Plugin-Template](https://github.com/LiteLoaderQQNT/LiteLoaderQQNT-Plugin-Template)  
插件仓库：[LiteLoaderQQNT-Plugin-List](https://github.com/LiteLoaderQQNT/LiteLoaderQQNT-Plugin-List)

> 高版本 QQNT 无法打开自身的 DevTools，请安装第三方调试插件（推荐 Chii Devtools 插件）



## 📖 安装教程

安装 LiteLoaderQQNT 之前，确保你安装好了基于 QQNT 架构的 QQ。安装分为**使用安装脚本安装（推荐）**、从 Releases 中下载稳定版、通过 git clone 安装。  

如果你打算通过安装脚本安装，请直接跳到[使用安装脚本安装](#使用安装脚本安装)，你只需要看这一小节即可。

通过`git clone` 安装时请务必记得更新子模块，否则会导致框架无法正常使用。

新版本框架安装时新版 Windows QQNT **无需且不要修改**  `QQNT安装目录/resources/app/package.json`。

Linux & MacOS 版仍然需要修改 `QQNT安装目录/resources/app/package.json`。

具体哪些版本需要修改`package.json`，参见下方[安装方法](#安装方法)中的[支持矩阵](#支持矩阵)。

若你的系统需要修改，请**不要修改** LiteLoader 文件夹内的 `package.json`。**应该修改** `QQNT安装目录/resources/app/package.json`。



### 📍安装位置

正常情况下，需要将含有 LiteLoaderQQNT 本体的文件夹放到 `QQNT安装目录/resources/app` 下。

对于不同系统，默认情况下此位置可能为：

- Windows: `C:\Program Files\Tencent\QQNT\resources\app`
- Linux: `/opt/QQ/resources/app`
- MacOS: `/Applications/QQ.app/Contents/Resources/app`

安装完成后的目录结构应类似于这样：

```
├─app_launcher
├─LiteLoader    <- 含有 LiteLoader 本体的文件夹
│  ├─builtins
│  ├─src
│  ├─package.json
│  └─...
├─package.json  <- 具体哪些版本需要修改，参见下方安装方法中的支持矩阵
└─...
```

需要修改的 `package.json` 的示例（具体哪些版本需要修改，参见下方[安装方法](#安装方法)中的[支持矩阵](#支持矩阵)）：  
将 `"main": "./app_launcher/index.js"` 改为 `"main": "./LiteLoader"`

```diff
{
    ...
    "homepage": "https://im.qq.com",
    "sideEffects": true,
-   "main": "./app_launcher/index.js",
+   "main": "./LiteLoader",
    ...
}
```

注意，在`MacOS`下修改时请直接使用惯用的编辑器（ `VSCode` , `Sublime Text` 等均可， `Xcode` 除外）修改 `package.json` 文件，需要在 `系统设置->隐私与安全性->App管理` 中添加并允许编辑器修改和删除其他应用程序，修改时会弹出提示要求输入管理员密码确认。



### 🧰安装方法

#### 支持矩阵

| 系统或版本                                  | 启动器（Launcher） | Patch脚本和程序 | 手动修改Package.json       |
| ------------------------------------------- | ------------------ | --------- | -------------------------- |
| Linux QQ 16183以下（包含16183）                | 无需               | 可用   | 需要                       |
| MacOS QQNT 6.9.18 **以外**的官网版或者 App Store 版  | 无需         | 可用            | 需要                       |
| Windows QQNT 9.9.1 版本以下                 | 无需               | 可用            | 需要                       |
| Windows QQNT 9.9.1-15717                    | 无需               | 可用            | 需要                       |
| Windows QQNT 9.9.1版本及以上（不包含15717）但低于或等于16183 | 可用               | 可用      | 不要修改，若修改请恢复原状 |
| 任何系统 16183 以上（不包含16183） | 不可用 | 不可用 | 不可用 |

对于 `Windows QQNT 9.9.1` 版本（除 15717 版本外）以上，安装后请阅读 [启动方法](#启动方法)

对于 `任何系统的 16183 `以上（不包含16183），目前暂无法使用框架，**但已经有解决方案**，仍需一段时间开发，请耐心等待

#### 使用安装脚本安装（一键）

*你可以使用安装脚本进行方便地安装。但请注意，目前所有脚本仅支持16183版本及以下。*

1. 单独下载安装脚本（[Linux](https://raw.githubusercontent.com/LiteLoaderQQNT/LiteLoaderQQNT/main/scripts/install_linux.sh)；[MacOS](https://raw.githubusercontent.com/LiteLoaderQQNT/LiteLoaderQQNT/main/scripts/install_macos.sh)；[Windows](https://raw.githubusercontent.com/LiteLoaderQQNT/LiteLoaderQQNT/main/scripts/install_windows.ps1)）
2. MacOS/Linux开启终端，执行sh脚本（**注意，需要你QQ安装在默认目录才能成功安装**）；Windows则使用powershell执行脚本
3. 根据提示进行安装与修补
4. 安装结束
5. 你**不需要**看本文档其余部分，直接开启QQ即可
<!--
#### 使用[`LLQQNTInstaller`](https://github.com/kaixinol/LLQQNTInstaller.py)安装（一键）

1. 安装[Python3.11+](https://www.python.org/downloads/)
2. 命令行执行`pip install llqqntinstaller-py`
3. 命令行执行`python -m llqqntinstaller --use-git-proxy --proxy <你的代理>`
4. 按照流程进行安装
5. 你**不需要**看本文档其余部分，直接开启QQ即可
-->
#### 通过 AUR 安装（仅限 Arch Linux 和 Arch-based Linux）（一键）

1. 确保你没有安装 Linux QQ 或已从 AUR 安装非 linuxqq-appimage 包的 Linux QQ。
2. 使用你的 AUR Helper 安装 `liteloader-qqnt-bin` 包（对于想要使用最新代码的用户，请安装 `liteloader-qqnt-git` 包）。
3. 至此，安装完成。
4. 你**不需要**看本文档其余部分，直接开启QQ即可。

#### 从 Releases 中下载稳定版的方式进行安装

1. 从 Releases 中下载最新的 `LiteLoaderQQNT.zip`。
2. 解压出 `LiteLoaderQQNT.zip` 内的  `LiteLoader` 文件夹到 [安装位置](#安装位置)。
3. 上方[支持矩阵](#支持矩阵)中，若你的QQ是需要修改 `package.json` 的系统或版本，请按照 [安装位置](#安装位置) 中的说明对`package.json`进行修改，并请参考下方[启动方法](#启动方法)中的说明。
4. 至此，安装完成。

#### 使用 git clone 的方式安装（不推荐，适合高阶用户）

1. 确保你的系统装有 [Git](https://git-scm.com/downloads) 和 [NodeJS](https://nodejs.org)（同时你要会npm的基本使用，例如更换镜像源等）。

2. 在终端中打开上文提到的 LiteLoaderQQNT 需要安装到的位置。

3. 输入 `git clone https://github.com/LiteLoaderQQNT/LiteLoaderQQNT.git --recursive LiteLoader --depth 1` 拉取项目与子模块。

4. 在本体和每个子模块目录中执行一次 `npm i` 以安装npm包。

5. 上方[支持矩阵](#支持矩阵)中，若你的QQ是需要修改 `package.json` 的系统或版本，请按照 [安装位置](#安装位置) 中的说明对`package.json`进行修改，并请参考下方[启动方法](#启动方法)中的说明。

6. 至此，安装完成。

   


### 🏃启动方法

由于 `Windows QQNT 9.9.1` 版本和 `MacOS QQNT 6.9.18` 版本开始被添加文件校验，  
MacOS 目前只能通过安装 App Store 版 QQNT 来解决（仍然不含文件校验），或安装老版本。  
更老版本 QQNT 以及 `Windows 9.9.1-15717` 版本没有添加文件校验（但目前这个版本寄了，无法登录），所以无需阅读这段教程。

以下教程仅针对可用启动器或Patch脚本的QQ（参见上方[支持矩阵](#支持矩阵)）；而其他系统和版本的用户**请忽略本节**，正确按照上面 [安装方法](#安装方法) 操作后直接点开QQ就能用。

**以下三种方式任选其一即可**

使用全自动 Patch 程序（开源方法）**（推荐）**：

1. 去[LiteLoaderQQNT-PatcherNFixer](https://github.com/xh321/LiteLoaderQQNT-PatcherNFixer/releases)下载最新版本的修补程序。
2. 下载后直接打开即可，它会自动搜索`QQ`的安装位置。
3. 点击一键修补。
4. 至此，修补完成。经过 Patch 后去除了文件校验的 QQ.exe 将永久生效直到重新用安装包安装。
5. 如果无法正常使用（提示QQ损坏），可再次打开修补程序，点击一键修复提示QQ损坏。（目前最高支持到`9.9.2-16183`，更高版本可能无效）

使用 Launcher （闭源软件）：

1. 若你之前修改过`package.json`，请将被修改的 `package.json` 文件内容还原（必须跟QQ原始的文件一样），如果无法恢复建议重装一次QQ；若是你新安装的QQ，则无需操作。
2. 从 releases 中下载额外的 Launcher（`LiteLoaderQQNT-Launcher_x64.exe` 或 `LiteLoaderQQNT-Launcher_x86.exe`），Launcher 可以只用x86版本。
3. 将额外下载的 Launcher 移动到 QQNT 安装目录下 QQ.exe 同级目录。
4. 至此，安装完成。为了加载 LiteLoaderQQNT，你需要每次运行都使用 Launcher 而不是 QQ（可以将QQ的快捷方式目标程序修改为 Launcher），且需要以管理员身份运行（可以在文件属性-兼容性中勾选以管理员身份运行）。

使用 Patch Powershell 脚本（开源方法）（不再推荐）：

1. 若你之前修改过`package.json`，请将被修改的 `package.json` 文件内容还原（必须跟QQ原始的文件一样，一个字一个换行都不能变（换行是`LF`））；若是你新安装的QQ，则无需操作。
2. 确保你有权限能够执行本地PowerShell脚本文件（系统设置 > 开发者选项 > PowerShell中的设置）。
3. 以**管理员模式**运行`patch.ps1`脚本（任何路径均可，它会自动搜索`QQ`的安装位置）。
4. 在弹出的新窗口直接点击下方按钮开始Patch（新版本Patch脚本无需再选择QQ版本）。
5. 至此，安装完成。经过 Patch 后去除了文件校验的 QQ.exe 将永久生效直到重新用安装包安装。
6. 如果无法正常使用（例如Patch完毕后启动，提示QQ损坏），建议重装一次QQ并手动删除上次Patch遗留下来的`QQNT安装目录/resources/app/backage.json`文件。
7. 如果多次尝试未果（一直报文件损坏），建议卸载重装QQ和框架，并只使用第一种方式（全自动 Patch 程序）。

> 如果 Launcher 或 Patch 运行失败无反应请尝试使用管理员权限运行重试



## 📤框架更新

- 目前框架还没有提供自动更新功能（更新LiteLoader本体），你需要在本仓库的 [release 页面](https://github.com/LiteLoaderQQNT/LiteLoaderQQNT/releases)手动下载最新版的zip压缩包，覆盖解压到之前安装的 LiteLoaderQQNT上即可。
- 如果你是通过一键脚本安装的，重新启动一次安装脚本一般情况下就能OK。
- 如果你是 git clone 方式安装的，重新 pull 一次即可（稳妥起见，建议对本体和每个子模块执行一次 `npm i` 以防我们更新了 npm 包）



## 📄插件安装

一般情况下插件可以通过**QQ→设置→LiteLoader 插件市场**来安装，但由于插件均托管于 Github 上，中国大陆用户访问较为不便，虽然你可以在LiteLoader 配置界面手动配置代理，但为了照顾那些没有代理或者节点不顺畅的用户，在此提供手动安装插件的方法：

（此方法缺点：手动更新+仓库过多）

1.**前往各插件**作者的**仓库**，**下载**最新release，或者下载对应分支下的所有文件。

2.[插件对应的**仓库地址**可在此查看](https://github.com/LiteLoaderQQNT/LiteLoaderQQNT-Plugin-List/blob/v3/plugins.json)，“repo”代表作者的插件仓库（都在github，直接搜索可找到），”branch“代表对应分支

3.下载对应文件压缩包后，将其**解压在LiteLoaderQQNT数据目录**（LiteLoader配置页面有对应路径）下的**plugins文件夹**中，**每一个插件都要一个独立的文件夹**。

4.重启QQ。



## 📂 数据目录

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


## 📜 开源协议

[MIT License](./LICENSE)  
Copyright (c) 2023 LiteLoaderQQNT
