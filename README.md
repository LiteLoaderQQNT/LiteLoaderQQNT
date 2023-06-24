# BetterQQNT

BetterQQNT是一个QQNT的插件加载器  
它可以让你自由地为QQNT添加各种插件  
比如：美化主题，增加新功能 等...


## 注意事项

- 目前仍在开发当中，可能会存在一些问题和不足
- 目前不建议制作插件，等完善后有模板和文档吧
- 目前没有插件商店系统，暂时只能自行寻找插件
- 仅为个人兴趣而制作，开发目的在于学习和探索
- 能力有限，随缘更新。不过也欢迎各位来提交PR
- 由于项目特殊性，必要时会停止开发或删除仓库


## 安装方法

只需三步，就可以轻松安装BetterQQNT：

1. 克隆/下载本项目，并将其放到`QQNT的根目录/resources/app`下。
2. 编辑`package.json`文件，将`main`键值改为`BetterQQNT`（大小写不敏感，请根据项目目录名实际情况修改）。
3. 重新启动QQNT，享受BetterQQNT带来的乐趣吧！

支持Windows QQNT的`32位`与`64位`版本  
（暂时去除Linux与MacOS支持，等待兼容）


## 目前功能

- 打开QQNT的DevTools，方便你查看和修改QQNT的内部运行情况。
- 加载插件，让你可以根据自己的喜好和需求定制QQNT的外观和功能。

> QQNT 9.8.5版本暂时无法通过BetterQQNT打开QQNT自身的DevTools  
> 请安装Chii Devtools插件或QQNT vConsole插件进行远程调试  
> 插件仓库地址在插件链接处，请自行根据插件介绍安装


## 插件链接

### 扩展

| 作者                                   | 名称                                                              | 描述                               |
| -------------------------------------- | ----------------------------------------------------------------- | ---------------------------------- |
| [沫烬染](https://github.com/mo-jinran) | [Chii DevTools](https://github.com/mo-jinran/chii-devtools)       | 使用Chii的DevTools进行远程调试     |
| [XiaoHe321](https://github.com/xh321)  | [QQNT vConsole](https://github.com/xh321/BetterQQNT-VConsole)     | 使用腾讯自己的vConsole进行前端调试 |
| [沫烬染](https://github.com/mo-jinran) | [窗口置顶](https://github.com/mo-jinran/window-on-top)            | 添加窗口置顶按钮                   |
| [XiaoHe321](https://github.com/xh321)  | [背景插件](https://github.com/xh321/BetterQQNT-Background-Plugin) | 窗口背景图片                       |
| [XiaoHe321](https://github.com/xh321)  | [链接跳转](https://github.com/xh321/BetterQQNT-Directly-Jump)     | 外链直接跳转，而不经过拦截页       |


### 主题

| 作者                                      | 名称                                                                     | 描述                                  |
| ----------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------- |
| [沫烬染](https://github.com/mo-jinran)    | [测试主题](https://github.com/mo-jinran/test-theme)                      | 测试用的主题                          |
| [MUK](https://github.com/MUKAPP)          | [MSpring-Theme](https://github.com/MUKAPP/BetterQQNT-MSpring-Theme)      | BetterQQNT 主题，优雅 · 粉粉 · 细致   |
| [festoney8](https://github.com/festoney8) | [QQNT微信风格主题](https://github.com/festoney8/BetterQQNT-Wechat-Theme) | BetterQQNT 插件，高仿微信风格的QQ主题 |


## 数据目录

BetterQQNT的默认数据文件夹在`C:\\BetterQQNT`
修改环境变量`BETTERQQNT_PROFILE`可指定目录位置

数据目录结构：
```
BetterQQNT
    ├─plugins           // 插件本体目录
    │   ├─my-plugin         // 插件本体
    │   └─...
    ├─plugins_cache     // 插件缓存目录
    │   └─...
    └─plugins_data      // 插件数据目录
        └─...
```

插件目录结构：
```
my-plugin
    ├─manifest.json     // 存放插件信息
    ├─main.js           // 存在插件入口
    └─...
```


## 开源协议

[MIT License](./LICENSE)  
Copyright (c) 2023 沫烬染
