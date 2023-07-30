# LiteLoaderQQNT

LiteLoaderQQNT是一个QQNT的插件加载器  
它可以让你自由地为QQNT添加各种插件  
比如：美化主题，增加功能，做任何事情 等...

Telegram闲聊群：https://t.me/LiteLoaderQQNT


## 注意事项

> Windows QQNT 9.9.1-15293已适配并正常使用（需Clone仓库安装）（部分插件暂未适配）  
> Windows QQNT 9.9.1-15489未适配并无法使用（需Clone仓库安装）（preload环境寄了）

- 目前仍在开发当中，可能会存在一些问题和不足
- 仅为个人兴趣而制作，开发目的在于学习和探索
- 能力有限，随缘更新。不过也欢迎各位来提交PR
- 由于项目特殊性，必要时会停止开发或删除仓库


## 安装方法

请先去官网安装QQNT最新版：https://im.qq.com/  
支持Windows, Linux, MacOS的32位与64位QQNT

安装位置：
- Windows：`QQNT的根目录/resources/app`
- Linux：`QQNT的根目录/resources/app`
- MacOS：`/Applications/QQ.app/Contents/Resources/app`

### 使用Release安装（推荐）

1. 下载`Release`中最新的`LiteLoaderQQNT.zip`，解压出`LiteLoader`文件夹并放到`安装位置`
2. 编辑`安装位置/package.json`文件，将`main`键值改为`LiteLoader`（根据文件夹名字而修改）
3. 重新启动QQNT，享受LiteLoaderQQNT带来的乐趣吧！

### 使用Clone安装（不推荐）

1. 克隆`Repo`并拉取`submodule`，将文件夹放到`安装位置`，重命名文件夹为`LiteLoader`
2. 编辑`安装位置/package.json`文件，将`main`键值改为`LiteLoader`（根据文件夹名字而修改）
3. 重新启动QQNT，享受LiteLoaderQQNT带来的乐趣吧！

Windows QQNT 9.9.1以上版本，需运行`LiteLoader\patch`内对应版本的PowerShell脚本  
文件修补需要约40秒左右（取决于电脑性能）（建议打开终端运行PowerShell脚本，修补速度会快很多）

应与package.json文件同级：
```
├─app_launcher
├─LiteLoader    <--在这
│  ├─builtins
│  ├─src
│  ├─package.json
│  └─...
├─package.json
└─...

```

QQNT的package.json文件示例：
```
{
    ...
    "homepage": "https://im.qq.com",
    "sideEffects": true,
    "main": "LiteLoader",   <- 修改这里（只需要指向文件夹即可）
    ...
}
```


## 插件链接

### 开发

如需上架插件市场，要使用最新的manifest格式（建议参考已上架插件，文件来源可使用仓库源码，也可用Release指定文件）  
并在Github开源，需要打包的插件请在仓库发布Release，文件尽量使用Github Actions打包  
插件模板：[LiteLoaderQQNT-Plugin-Template](https://github.com/mo-jinran/LiteLoaderQQNT-Plugin-Template)  
插件仓库：[LiteLoaderQQNT-Plugin-List](https://github.com/mo-jinran/LiteLoaderQQNT-Plugin-List)

> Windows QQNT 9.8.5版本及以上暂时无法打开自身的DevTools  
> 请安装Chii Devtools插件（推荐）或QQNT vConsole插件进行调试


### 扩展

| 作者                                       | 名称                                                                          | 描述                                                              |
| ------------------------------------------ | ----------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| [沫烬染](https://github.com/mo-jinran)     | [Chii DevTools](https://github.com/mo-jinran/chii-devtools)                   | 使用 Chii 的 DevTools 进行远程调试                                 |
| [XiaoHe321](https://github.com/xh321)      | [QQNT vConsole](https://github.com/xh321/LiteLoaderQQNT-VConsole)             | 使用腾讯自己的 vConsole 进行前端调试                               |
| [沫烬染](https://github.com/mo-jinran)     | [窗口置顶](https://github.com/mo-jinran/window-on-top)                        | 添加窗口置顶按钮                                                   |
| [XiaoHe321](https://github.com/xh321)      | [背景插件](https://github.com/xh321/LiteLoaderQQNT-Background-Plugin)         | 窗口背景图片                                                      |
| [XiaoHe321](https://github.com/xh321)      | [链接跳转](https://github.com/xh321/LiteLoaderQQNT-Directly-Jump)             | 外链直接跳转，而不经过拦截页                                        |
| [FW27623](https://github.com/FW27623)      | [自定义侧边栏按钮](https://github.com/FW27623/remove_nav_sidebar)             | 自定义侧边栏需要保留的按钮                                          |
| [Zhoneym](https://github.com/Zhoneym)    | [关闭 QQ 空间](https://github.com/Zhoneym/LiteLoaderQQNT-RemoveZone)         | 移除 QQ 空间按钮                                                  |
| [XiaoHe321](https://github.com/xh321)      | [关闭更新弹窗](https://github.com/xh321/LiteLoaderQQNT-Kill-Update)           | 关闭 NTQQ 恼人的更新弹窗                                           |
| [沫烬染](https://github.com/mo-jinran)     | [Linux - 背景毛玻璃](https://github.com/mo-jinran/linux-qqnt-background-blur) | 给 Linux 下 KDE 桌面环境的 QQNT 添加背景毛玻璃效果                   |
| [XiaoHe321](https://github.com/xh321)      | [防撤回](https://github.com/xh321/LiteLoaderQQNT-Anti-Recall)                 | 新版防撤回在 QQNT 打开期间均生效，重启失效                          |
| [谦虚](https://github.com/qianxu2001)      | [繁化姬](https://github.com/qianxu2001/LiteLoaderQQNT-Plugin-Fanhuaji)        | 将消息从繁体转化为简体                                             |
| [xinyihl](https://github.com/xinyihl)      | [自定义移除侧栏](https://github.com/xinyihl/LiteLoaderQQNT-RemoveSidebar)     | 通过序号自定义移除主页的侧栏                                        |
| [谦虚](https://github.com/qianxu2001)      | [演示模式](https://github.com/qianxu2001/LiteLoaderQQNT-Plugin-Demo-mode)     | 对界面上的元素进行模糊处理以便演示或截图                             |
| [XiaoHe321](https://github.com/xh321)      | [聊天二维码解析](https://github.com/xh321/LiteLoaderQQNT-QR-Decode)           | 聊天中的图片二维码解析                                             |
| [Gezhe14](https://github.com/Gezhe14)      | [高亮回复](https://github.com/Gezhe14/LiteLoaderQQNT-HighlightReplies)        | 高亮右键消息后的“回复”选项 ~~没错就是这么简单~~                    |
| [d0j1a_1701](https://github.com/d0j1a1701) | [Markdown-it](https://github.com/d0j1a1701/LiteLoaderQQNT-Markdown)           | 为 QQNT 提供 Markdown 渲染                                       |
| [Nevdev](https://github.com/Nevodev)       | [Fluentify](https://github.com/Nevodev/LL-Fluentify)                          | 为 右键菜单/表情面板 添加真亚克力模糊，同时修复二级菜单漂移的问题    |
| [xinyihl](https://github.com/xinyihl)      | [JustF5](https://github.com/xinyihl/LiteLoaderQQNT-JustF5)                    | 添加 F5 刷新页面                                                 |
| [曦月](https://github.com/xiyuesaves)      | [lite_tools](https://github.com/xiyuesaves/lite_tools)                        | 轻量工具箱，添加了一些能提升使用体验的功能。                        |

### 主题

| 作者                                      | 名称                                                                                 | 描述                                   |
|-------------------------------------------|--------------------------------------------------------------------------------------|--------------------------------------|
| [MUKAPP](https://github.com/MUKAPP)       | [MSpring-Theme](https://github.com/MUKAPP/LiteLoaderQQNT-MSpring-Theme)              | LiteLoaderQQNT 主题，优雅 · 粉粉 · 细致 |
| [festoney8](https://github.com/festoney8) | [QQNT微信风格主题](https://github.com/festoney8/LiteLoaderQQNT-Wechat-Theme)         | QQNT高仿微信主题                       |
| [XiaoHe321](https://github.com/xh321)     | [自定义 CSS 样式](https://github.com/xh321/LiteLoaderQQNT-Custom-CSS)                | 用来自定义 CSS 样式                    |
| [festoney8](https://github.com/festoney8) | [QQNT仿Telegram风格主题](https://github.com/festoney8/LiteLoaderQQNT-Telegram-Theme) | 高仿Telegram的QQNT主题                 |


## 数据目录

LiteLoaderQQNT的默认数据文件夹在`用户目录/Documents/LiteLoaderQQNT`  
修改环境变量`LITELOADERQQNT_PROFILE`可指定目录位置

数据目录结构：
```
LiteLoaderQQNT
    ├─plugins           // 插件本体目录
    │   ├─my-plugin         // 插件本体
    │   └─...
    ├─plugins_cache     // 插件缓存目录
    │   ├─my-plugin
    │   └─...
    ├─plugins_data      // 插件数据目录
    │   ├─my-plugin
    │   └─...
    └─config.json       // LiteLoader配置文件
```


## 开源协议

[MIT License](./LICENSE)  
Copyright (c) 2023 沫烬染
