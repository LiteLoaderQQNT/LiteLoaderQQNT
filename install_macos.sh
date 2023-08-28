#!/bin/bash

# 提升权限到sudo
echo "请输入您的密码以提升权限："
sudo -v

# 询问运行目的
echo "是否需要自动获取最新仓库（不获取则直接进行修补，请确认已将LiteLoader安装到指定位置）？(y/n)"
read answer
if [ "$answer" = "y" ]; then
	echo "正在拉取最新版本的仓库..."
	cd /tmp
	git clone https://github.com/LiteLoaderQQNT/LiteLoaderQQNT.git LiteLoader
	cd LiteLoader
	git submodule update --init 
	cd ..

	# 移动到安装目录
	echo "拉取完成，正在安装LiteLoader..."
	rm -rf /Applications/QQ.app/Contents/Resources/app/LiteLoader > /dev/null 2>&1
	mv LiteLoader /Applications/QQ.app/Contents/Resources/app
fi

# 进入安装目录
cd /Applications/QQ.app/Contents/Resources/app

#修改package.json
echo "正在修补package.json..."
sudo sed -i '' 's|"main": "./app_launcher/index.js"|"main": "LiteLoader"|' package.json

echo "安装完成！启动/重启QQ后生效。脚本将在3秒后退出..."
sleep 3
exit 0