# LiteLoaderQQNT

LiteLoaderQQNT 是 QQNT 的插件加载器，  
一般在 QQNT 的环境内简称为 LiteLoader。  
它可以让你自由地为 QQNT 添加各种插件，  
并实现例如美化主题、增加功能等各种功能。

Telegram 闲聊群：https://t.me/LiteLoaderQQNT


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
插件模板：[LiteLoaderQQNT-Plugin-Template](https://github.com/mo-jinran/LiteLoaderQQNT-Plugin-Template)  
插件仓库：[LiteLoaderQQNT-Plugin-List](https://github.com/mo-jinran/LiteLoaderQQNT-Plugin-List)

> Windows QQNT 9.8.5 版本（除 9.9.1-15717 版本）及以上暂时无法打开自身的 DevTools，请安装 Chii Devtools 插件（推荐）或 QQNT vConsole 插件进行调试。


## 📖 安装教程

安装 LiteLoaderQQNT 之前，确保你安装好了基于 QQNT 架构的 QQ。

### 安装位置

安装位置通常情况下为：

- Windows: `C:\Program Files\Tencent\QQNT\resources\app`
- Linux: `/opt/QQ/resources/app`
- MacOS: `/Applications/QQ.app/Contents/Resources/app`

若您更改了 QQNT 的目录，请仿照上述路径确定您的安装位置。

### 下载 LiteLoader

- **稳定版**：
	1. 从 Releases 中下载最新的 `LiteLoaderQQNT.zip`。
	1. 解压出压缩包内的  `LiteLoader` 文件夹到上述[安装位置](#安装位置)。
- **CI 版**：
  1. 安装 [Git](https://git-scm.com/downloads)。
  2. 打开安装位置 (终端内 `cd` 到安装位置)
  3. 拉取项目：`git clone https://github.com/mo-jinran/LiteLoaderQQNT.git LiteLoader`
  4. 拉取子模块：`cd LiteLoader && git submodule update --init`

### 安装 LiteLoader

此时，你的目录结构应该类似于：

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

确认无误后，根据你的 QQ 版本选择执行如下操作：

#### 不带签名校验的 QQ

> Win QQ 9.9.0-xxxxx 及 9.9.1-15717, Mac 6.9.18 之前

1. 修改 `package.json` 中 `main` 的值为加载器的文件夹路径 (`LiteLoader`)，随后保存
2. 将得到类似如下结果：
3. ```js
    {
      // ...
      "homepage": "https://im.qq.com",
      "sideEffects": true,
      "main": "LiteLoader", // <- 修改这里（只需要指向文件夹即可）
      // ...
    }
    ```

> 注意：请**不要修改** LiteLoader 文件夹内的 `package.json`，应该修改 `QQNT 安装目录/resources/app/package.json`。

#### 带签名校验的 QQ

> Win QQ 9.9.1-xxxxx (除 9.9.1-15717) 及之后, Mac 6.9.18 及之后

- 法 1：Patch (开源，麻烦，不推荐)
  1. 同 "[不带签名校验的 QQ](#不带签名校验的 QQ)" 一样修改 `package.json`
  2. 在 LiteLoaderQQNT 的 patch 目录内以**管理员模式**运行终端
  3. 在终端中运行对应版本的 ps1 脚本（例如输入 `.\9.9.1-15489_x64.ps1` 后回车运行）
  4. 至此，安装完成。经过 Patch 后去除了文件校验的 QQ.exe 将**永久生效**。
- 法 2：Launcher
  1. 从 releases 中下载额外的 Launcher（`LiteLoaderQQNT-Launcher_x64.exe` 或 `LiteLoaderQQNT-Launcher_x86.exe`），Launcher 可以只用x86版本。
  2. 将额外下载的 Launcher 移动到 QQNT 安装目录下 QQ.exe 同级目录。
  3. 至此，安装完成。为了加载 LiteLoaderQQNT，你需要以后**每次运行都使用 Launcher** 而不是 QQ。

> 如果 Launcher 或 Patch 运行失败无反应请尝试使用管理员权限运行重试


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
