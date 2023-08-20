#加载WPF组件
Add-Type -AssemblyName PresentationCore
Add-Type -AssemblyName PresentationFramework


#顶部区域 - 列表
$listbox = New-Object System.Windows.Controls.ListBox
$listbox.Margin = New-Object System.Windows.Thickness(10, 10, 10, 10)


#底部区域 - 进度条
$progressbar = New-Object System.Windows.Controls.ProgressBar
$progressbar.Margin = New-Object System.Windows.Thickness(10, 0, 10, 10)
$progressbar.Maximum = 100
$progressbar.Minimum = 0
$progressbar.Value = 0


#底部区域 - 按钮
$button = New-Object System.Windows.Controls.Button
$button.Margin = New-Object System.Windows.Thickness(10, 0, 10, 10)
$button.Content = "请在上方选择对应版本的 QQ！"
$button.IsEnabled = $false


#底部区域 - 标签
$textblock = New-Object System.Windows.Controls.TextBlock
$textblock.Margin = New-Object System.Windows.Thickness(10, 0, 10, 10)
$textblock.TextAlignment = [Windows.TextAlignment]::Center
$textblock.VerticalAlignment = [Windows.VerticalAlignment]::Center


#设置窗口布局
$grid = New-Object System.Windows.Controls.Grid

$row_top = New-Object System.Windows.Controls.RowDefinition
$row_bottom = New-Object System.Windows.Controls.RowDefinition

$row_top.Height = New-Object System.Windows.GridLength(1, [System.Windows.GridUnitType]::Star)
$row_bottom.Height = New-Object System.Windows.GridLength(40)

$grid.RowDefinitions.Add($row_top)
$grid.RowDefinitions.Add($row_bottom)

$grid.Children.Add($listbox)
$grid.Children.Add($progressbar)
$grid.Children.Add($textblock)
$grid.Children.Add($button)

[System.Windows.Controls.Grid]::SetRow($listbox, 0)
[System.Windows.Controls.Grid]::SetRow($progressbar, 1)
[System.Windows.Controls.Grid]::SetRow($textblock, 1)
[System.Windows.Controls.Grid]::SetRow($button, 1)


#创建窗口
$window = New-Object System.Windows.Window
$window.Title = "Patch QQ"
$window.Width = 480
$window.Height = 320
$window.MinWidth = 480
$window.MinHeight = 320
$window.Content = $grid
$window.UseLayoutRounding = $true
[System.Windows.Media.TextOptions]::SetTextFormattingMode($window, [System.Windows.Media.TextFormattingMode]::Ideal)
[System.Windows.Media.TextOptions]::SetTextRenderingMode($window, [System.Windows.Media.TextRenderingMode]::ClearType)


# patch 对照表
$patch_hashtable = [ordered] @{
    "9.9.1-15293_x64" = @{
        "original" = [byte[]] @(0xE8, 0x91, 0xC2, 0xFF, 0xFF, 0x84, 0xC0, 0x0F, 0x84, 0x9F, 0x04, 0x00, 0x00)
        "replace"  = [byte[]] @(0x90, 0x90, 0x90, 0x90, 0x90, 0x84, 0xC0, 0x90, 0x90, 0x90, 0x90, 0x90, 0x90)
    }
    "9.9.1-15293_x86" = @{
        "original" = [byte[]] @(0xE8, 0x75, 0xCC, 0xFF, 0xFF, 0x84, 0xC0, 0x0F, 0x84, 0xC6, 0x02, 0x00, 0x00)
        "replace"  = [byte[]] @(0x90, 0x90, 0x90, 0x90, 0x90, 0x84, 0xC0, 0x90, 0x90, 0x90, 0x90, 0x90, 0x90)
    }
    "9.9.1-15489_x64" = @{
        "original" = [byte[]] @(0xE8, 0x91, 0xC2, 0xFF, 0xFF, 0x84, 0xC0, 0x0F, 0x84, 0x9F, 0x04, 0x00, 0x00)
        "replace"  = [byte[]] @(0x90, 0x90, 0x90, 0x90, 0x90, 0x84, 0xC0, 0x90, 0x90, 0x90, 0x90, 0x90, 0x90)
    }
    "9.9.1-15489_x86" = @{
        "original" = [byte[]] @(0xE8, 0x75, 0xCC, 0xFF, 0xFF, 0x84, 0xC0, 0x0F, 0x84, 0xC6, 0x02, 0x00, 0x00)
        "replace"  = [byte[]] @(0x90, 0x90, 0x90, 0x90, 0x90, 0x84, 0xC0, 0x90, 0x90, 0x90, 0x90, 0x90, 0x90)
    }
    "9.9.1-15820_x64" = @{
        "original" = [byte[]] @(0xE8, 0x96, 0xC2, 0xFF, 0xFF, 0x84, 0xC0, 0x0F, 0x84, 0x04, 0x04, 0x00, 0x00)
        "replace"  = [byte[]] @(0x90, 0x90, 0x90, 0x90, 0x90, 0x84, 0xC0, 0x90, 0x90, 0x90, 0x90, 0x90, 0x90)
    }
    "9.9.1-15820_x86" = @{
        "original" = [byte[]] @(0xE8, 0x79, 0xCC, 0xFF, 0xFF, 0x84, 0xC0, 0x0F, 0x84, 0x1E, 0x02, 0x00, 0x00)
        "replace"  = [byte[]] @(0x90, 0x90, 0x90, 0x90, 0x90, 0x84, 0xC0, 0x90, 0x90, 0x90, 0x90, 0x90, 0x90)
    }
    "9.9.2-15962_x64" = @{
        "original" = [byte[]] @(0xE8, 0x96, 0xC2, 0xFF, 0xFF, 0x84, 0xC0, 0x0F, 0x84, 0x04, 0x04, 0x00, 0x00)
        "replace"  = [byte[]] @(0x90, 0x90, 0x90, 0x90, 0x90, 0x84, 0xC0, 0x90, 0x90, 0x90, 0x90, 0x90, 0x90)
    }
    "9.9.2-15962_x86" = @{
        "original" = [byte[]] @(0xE8, 0x79, 0xCC, 0xFF, 0xFF, 0x84, 0xC0, 0x0F, 0x84, 0x1E, 0x02, 0x00, 0x00)
        "replace"  = [byte[]] @(0x90, 0x90, 0x90, 0x90, 0x90, 0x84, 0xC0, 0x90, 0x90, 0x90, 0x90, 0x90, 0x90)
    }
    "9.9.2-16183_x64" = @{
        "original" = [byte[]] @(0xE8, 0xC6, 0xC9, 0xFF, 0xFF, 0x84, 0xC0, 0x0F, 0x84, 0x04, 0x04, 0x00, 0x00)
        "replace"  = [byte[]] @(0x90, 0x90, 0x90, 0x90, 0x90, 0x84, 0xC0, 0x90, 0x90, 0x90, 0x90, 0x90, 0x90)
    }
    "9.9.2-16183_x86" = @{
        "original" = [byte[]] @(0xE8, 0xA9, 0xD2, 0xFF, 0xFF, 0x84, 0xC0, 0x0F, 0x84, 0x1E, 0x02, 0x00, 0x00)
        "replace"  = [byte[]] @(0x90, 0x90, 0x90, 0x90, 0x90, 0x84, 0xC0, 0x90, 0x90, 0x90, 0x90, 0x90, 0x90)
    }
}


# Patch QQ
$qq_pather = {
    param(
        $path,
        $original_bytes,
        $replace_bytes,
        $updateProgress,
        $finish
    )

    # 要修补的.exe文件路径
    $sourceFilePath = "$path\QQ.exe.bak"
    $targetFilePath = "$path\QQ.exe"

    # 重命名QQ为.bak
    if (-not (Test-Path $sourceFilePath)) {
        Rename-Item -Path $targetFilePath -NewName "QQ.exe.bak"
    }

    # 使用二进制文件流打开原始文件和目标文件
    $sourceStream = [System.IO.FileStream]::new($sourceFilePath, [System.IO.FileMode]::Open, [System.IO.FileAccess]::Read)
    $targetStream = [System.IO.FileStream]::new($targetFilePath, [System.IO.FileMode]::Create, [System.IO.FileAccess]::Write)

    # 定义缓冲区大小 (4MB)
    $bufferSize = 1024 * 1024 * 4
    $buffer = New-Object byte[] $bufferSize

    $fileSize = $sourceStream.Length
    $bytesProcessed = 0
    $matched = $false

    Invoke-Command -ScriptBlock $updateProgress -ArgumentList 0

    # 循环处理文件
    while ($true) {
        # 从原始文件读取缓冲区数据
        $readBytes = $sourceStream.Read($buffer, 0, $bufferSize)

        # 如果已经读取到文件末尾，则退出循环
        if ($readBytes -eq 0) {
            break
        }

        if (-not $matched) {
            # 查找并替换字节序列（写成这样子是为了提高性能）
            for ($i = 0; $i -lt $readBytes; $i++) {
                if (
                    $buffer[$i + 0] -eq $original_bytes[0] -and
                    $buffer[$i + 1] -eq $original_bytes[1] -and
                    $buffer[$i + 2] -eq $original_bytes[2] -and
                    $buffer[$i + 3] -eq $original_bytes[3] -and
                    $buffer[$i + 4] -eq $original_bytes[4] -and
                    $buffer[$i + 5] -eq $original_bytes[5] -and
                    $buffer[$i + 6] -eq $original_bytes[6] -and
                    $buffer[$i + 7] -eq $original_bytes[7] -and
                    $buffer[$i + 8] -eq $original_bytes[8] -and
                    $buffer[$i + 9] -eq $original_bytes[9] -and
                    $buffer[$i + 10] -eq $original_bytes[10] -and
                    $buffer[$i + 11] -eq $original_bytes[11] -and
                    $buffer[$i + 12] -eq $original_bytes[12]
                ) {
                    $matched = $true
                    for ($j = 0; $j -lt 13; $j++) {
                        $buffer[$i + $j] = $replace_bytes[$j]
                    }
                }
            }
        }

        # 将缓冲区数据写入目标文件
        $targetStream.Write($buffer, 0, $readBytes)
        $bytesProcessed += $readBytes
        $progress = [Math]::Truncate(($bytesProcessed / $fileSize) * 100)
        Invoke-Command -ScriptBlock $updateProgress -ArgumentList $progress
    }

    Invoke-Command -ScriptBlock $updateProgress -ArgumentList 100

    # 关闭文件流
    $sourceStream.Close()
    $targetStream.Close()

    Invoke-Command -ScriptBlock $finish
}


# 获取QQ安装位置
$qqDirPath = {
    $filePath = $null
    $reg1 = "HKLM:\Software\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\QQ"
    $reg2 = "HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\QQ"
    if (Test-Path $reg1) {
        $filePath = Get-ItemPropertyValue $reg1 "UninstallString"
    }
    elseif (Test-Path $reg2) {
        $filePath = Get-ItemPropertyValue $reg2 "UninstallString"
    }
    return $filePath.Substring(0, $filePath.LastIndexOf("\"))
}


#顶部区域 - 列表
foreach ($name in $patch_hashtable.Keys) {
    $listbox.Items.Add($name)
}

# 列表条目选择事件
$listbox.Add_SelectionChanged(
    {
        $selectedItem = $listbox.SelectedItem
        $button.IsEnabled = $selectedItem
        if ($selectedItem -ne $null) {
            $button.Content = "已选择 $selectedItem 版本，点击此按钮开始 Patch".Replace("_", "__")
        }
        else {
            $button.Content = "请在上方选择对应版本的 QQ！"
        }
    }
)

# 判断列表中是否存在匹配项
$path = & $qqDirPath
$eleArch = (Get-Content -Path ($path + "\resources\app\package.json") -Raw | ConvertFrom-Json).eleArch
$curVersion = (Get-Content -Path ($path + "\resources\app\versions\config.json") -Raw | ConvertFrom-Json).curVersion
$matchingString = "${curVersion}_${eleArch}"

# 根据文件信息和位数构建要匹配的字符串
if ($matchingString -in $patch_hashtable.Keys) {
    $matchingItem = $listbox.Items | Where-Object { $_ -eq $matchingString }
    $listbox.SelectedItem = $matchingItem
}


#底部区域 - 按钮
$button.Add_Click(
    {
        $button.Visibility = [Windows.Visibility]::Hidden
        $listbox.IsEnabled = $false
        $textblock.Text = "正在初始化..."

        $original_bytes = $patch_hashtable[$listbox.SelectedItem].original
        $replace_bytes = $patch_hashtable[$listbox.SelectedItem].replace
        $updateProgress = {
            param ($progress)
            $window.Dispatcher.Invoke(
                {
                    $textblock.Text = "当前进度：$progress %"
                    $progressbar.Value = $progress
                }
            )
        }
        $finish = {
            $window.Dispatcher.Invoke(
                {
                    $textblock.Text = "Patch 完成！"
                    $popup = new-object -comobject wscript.shell
                    $popup.popup("Patch 完成！")
                    $listbox.IsEnabled = $true
                    $button.Visibility = [Windows.Visibility]::Visible
                    $textblock.Text = ""
                    $progressbar.Value = 0
                }
            )
        }

        $runspace = [runspacefactory]::CreateRunspace()
        $runspace.Open()
        $powershell = [powershell]::Create()
        $powershell.Runspace = $runspace
        $powershell.AddScript($qq_pather)
        $powershell.AddArgument($path)
        $powershell.AddArgument($original_bytes)
        $powershell.AddArgument($replace_bytes)
        $powershell.AddArgument($updateProgress)
        $powershell.AddArgument($finish)
        $powershell.BeginInvoke()
    }
)


# 启动程序
$app = New-Object System.Windows.Application
$app.Run($window)
