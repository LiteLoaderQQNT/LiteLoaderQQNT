echo "请输入您的密码以提升权限："
sudo -v

echo "正在拉取最新版本的仓库..."
cd /tmp
git clone https://github.com/LiteLoaderQQNT/LiteLoaderQQNT.git LiteLoader

# 移动到安装目录
echo "拉取完成，正在安装LiteLoader..."
sudo cp LiteLoader/src/preload.js /opt/QQ/resources/app/application/preload.js
mv LiteLoader /opt/QQ/resources/app

# 自定义插件，默认为~/Downloads/LiteLoaderPlugins
read -p "请输入LiteLoader插件目录（默认为$HOME/Downloads/plugins）: " custompluginsDir
pluginsDir=${custompluginsDir:-"$HOME/Downloads"}
echo "插件目录: $pluginsDir"

# 创建pluginsDir目录
if [ ! -d "$pluginsDir" ]; then
    mkdir -p "$pluginsDir"
    echo "已创建插件目录: $pluginsDir"
fi

# 进入安装目录
cd /opt/QQ/resources/app/app_launcher

# 修改index.json
echo "正在修补index.json..."
if ! grep -q "require('/opt" index.js; then
    sudo sed -i '' "1i\\
require('/opt/QQ/resources/app/LiteLoader');\
" index.js
fi

# 创建软连接
mkdir /opt/QQ/resources/app/LiteLoader/plugins
liteLoaderPluginsDir="/opt/QQ/resources/app/LiteLoader/plugins"
sudo ln -s "$liteLoaderPluginsDir" "$pluginsDir"

# 提示消息
echo "软链接已创建，从 $liteLoaderPluginsDir 到 $pluginsDir"

echo "安装完成！脚本将在3秒后退出..."

# 清理临时文件
rm -rf /tmp/LiteLoader

# 错误处理
if [ $? -ne 0 ]; then
    echo "发生错误，安装失败"
    exit 1
fi

# 等待3秒后退出
sleep 3
exit 0
