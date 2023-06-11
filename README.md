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
<<<<<<< HEAD
2. 编辑`package.json`文件，将`main`键值改为`./BetterQQNT/index.js`（请根据具体情况修改路径）。
4. 重新启动QQNT，享受BetterQQNT带来的乐趣吧！
=======
2. 编辑`package.json`文件，将`main`键值改为`BetterQQNT`（大小写不敏感，请根据项目目录名实际情况修改）。
3. 重新启动QQNT，享受BetterQQNT带来的乐趣吧！
>>>>>>> 3d6cbe6 (更新描述)

理论上能够支持`Windows`, `Linux`, `MacOS`  
以及支持QQNT的`32位`与`64位`版本  
（目前开发与测试都仅在Windows环境下进行）


## 目前功能

- 打开QQNT的DevTools，方便你查看和修改QQNT的内部运行情况。
- 加载插件，让你可以根据自己的喜好和需求定制QQNT的外观和功能。


## 插件链接

- [[扩展] window-on-top](https://github.com/mo-jinran/BetterQQNT-window-on-top)
- [[主题] test-theme](https://github.com/mo-jinran/BetterQQNT-test-theme)
- [[扩展] background_plugin](https://github.com/xh321/BetterQQNT-Background-Plugin)
- [[主题] MSpring-Theme](https://github.com/MUKAPP/BetterQQNT-MSpring-Theme)


## 数据目录

BetterQQNT的默认数据文件夹：

- Windows: `C:\\BetterQQNT`
- Linux: `~/Documents/BetterQQNT`
- MacOS: `~/Documents/BetterQQNT`

修改环境变量`BETTERQQNT_PROFILE`可指定目录位置

数据目录结构：
```
BetterQQNT
    ├─plugins           // 插件本体目录
    │   ├─my-plugin         // 插件本体
    │   └─...
    ├─plugins_cache     // 插件缓存目录
    │   └─...
    ├─plugins_data      // 插件数据目录
    │   └─...
    └─config.json       // BetterQQNT配置文件（暂未实现）
```

插件目录结构：
```
my-plugin
    ├─manifest.json     // 存放插件信息
    ├─main.js           // 必须存在插件入口
    └─...
```


## 开源协议

[MIT License](./LICENSE)  
Copyright (c) 2023 沫烬染
