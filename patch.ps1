#加载WPF组件
Add-Type -AssemblyName PresentationCore
Add-Type -AssemblyName PresentationFramework

#底部区域 - 进度条
$progressbar = New-Object System.Windows.Controls.ProgressBar
$progressbar.Margin = New-Object System.Windows.Thickness(10, 0, 10, 10)
$progressbar.Maximum = 100
$progressbar.Minimum = 0
$progressbar.Value = 0


#底部区域 - 按钮
$button = New-Object System.Windows.Controls.Button
$button.Margin = New-Object System.Windows.Thickness(10, 0, 10, 10)
$button.Content = "开始执行补丁"
$button.IsEnabled = $true


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

$grid.Children.Add($progressbar)
$grid.Children.Add($textblock)
$grid.Children.Add($button)

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


# Patch QQ
$qq_pather = {
    param(
        $path,
        $original_bytes1,
        $replace_bytes1,
        $original_bytes2,
        $replace_bytes2,
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
    $matched = 0

    Invoke-Command -ScriptBlock $updateProgress -ArgumentList 0

    # 循环处理文件
    while ($true) {
        # 从原始文件读取缓冲区数据
        $readBytes = $sourceStream.Read($buffer, 0, $bufferSize)

        # 如果已经读取到文件末尾，则退出循环
        if ($readBytes -eq 0) {
            break
        }

        if ($matched -ne 2) {
            # 查找并替换字节序列（写成这样子是为了提高性能）
            for ($i = 0; $i -lt $readBytes; $i++) {
                if (
                    $buffer[$i + 0] -eq $original_bytes1[0] -and
                    $buffer[$i + 1] -eq $original_bytes1[1] -and
                    $buffer[$i + 2] -eq $original_bytes1[2] -and
                    $buffer[$i + 3] -eq $original_bytes1[3] -and
                    $buffer[$i + 4] -eq $original_bytes1[4] -and
                    $buffer[$i + 5] -eq $original_bytes1[5] -and
                    $buffer[$i + 6] -eq $original_bytes1[6] -and
                    $buffer[$i + 7] -eq $original_bytes1[7] -and
                    $buffer[$i + 8] -eq $original_bytes1[8] -and
                    $buffer[$i + 9] -eq $original_bytes1[9] -and
                    $buffer[$i + 10] -eq $original_bytes1[10] -and
                    $buffer[$i + 11] -eq $original_bytes1[11] -and
                    $buffer[$i + 12] -eq $original_bytes1[12]
                ) {
                    $matched = $matched + 1
                    for ($j = 0; $j -lt 13; $j++) {
                        $buffer[$i + $j] = $replace_bytes1[$j]
                    }
                } elseif  (
                    $buffer[$i + 0] -eq $original_bytes2[0] -and
                    $buffer[$i + 1] -eq $original_bytes2[1] -and
                    $buffer[$i + 2] -eq $original_bytes2[2] -and
                    $buffer[$i + 3] -eq $original_bytes2[3] -and
                    $buffer[$i + 4] -eq $original_bytes2[4] -and
                    $buffer[$i + 5] -eq $original_bytes2[5] -and
                    $buffer[$i + 6] -eq $original_bytes2[6] -and
                    $buffer[$i + 7] -eq $original_bytes2[7] -and
                    $buffer[$i + 8] -eq $original_bytes2[8] -and
                    $buffer[$i + 9] -eq $original_bytes2[9] -and
                    $buffer[$i + 10] -eq $original_bytes2[10] -and
                    $buffer[$i + 11] -eq $original_bytes2[11] -and
                    $buffer[$i + 12] -eq $original_bytes2[12]
                ) {
                    $matched = $matched + 1
                    for ($j = 0; $j -lt 13; $j++) {
                        $buffer[$i + $j] = $replace_bytes2[$j]
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

Function replace_in_file($Filename, $Oldvalue, $Newvalue)
{
    if (Test-Path $Filename) {
        $text = [IO.File]::ReadAllText($Filename) -replace $Oldvalue, $Newvalue
        [IO.File]::WriteAllText($Filename, $text)
    }
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
    if ($filePath -eq $null){
        $levelsToGoUp = 3
        $filePath = Get-Location
        for ($i = 1; $i -lt $levelsToGoUp; $i++) {
            $filePath = [System.IO.Path]::GetDirectoryName($filePath)
        }
    }
    return $filePath.Substring(0, $filePath.LastIndexOf("\"))
}

# 判断列表中是否存在匹配项
$path = & $qqDirPath

#底部区域 - 按钮
$button.Add_Click(
    {
        $button.Visibility = [Windows.Visibility]::Hidden
        $textblock.Text = "正在初始化..."

        $original_bytes1 =  [byte[]] @(0xAD, 0xA0, 0xB4, 0xAF, 0xA2, 0xA9, 0xA4, 0xB3, 0xEF, 0xAB, 0xB2, 0xAE, 0xAF, 0x00)
        $replace_bytes1 =  [byte[]] @(0xA3, 0xA0, 0xB4, 0xAF, 0xA2, 0xA9, 0xA4, 0xB3, 0xEF, 0xAB, 0xB2, 0xAE, 0xAF, 0x00)

        $original_bytes2 =  [byte[]] @(0xB1, 0xA0, 0xA2, 0xAA, 0xA0, 0xA6, 0xA4, 0xEF, 0xAB, 0xB2, 0xAE, 0xAF, 0x00)
        $replace_bytes2 =   [byte[]] @(0xA3, 0xA0, 0xA2, 0xAA, 0xA0, 0xA6, 0xA4, 0xEF, 0xAB, 0xB2, 0xAE, 0xAF, 0x00)

        if(-not (Select-String -Path ($path + "\resources\app\package.json") -Pattern "LiteLoader" -Quiet)){
            Copy-Item -Path ($path + "\resources\app\package.json") -Destination ($path + "\resources\app\backage.json") -Force
        }
        Copy-Item -Path ($path + "\resources\app\launcher.json") -Destination ($path + "\resources\app\bauncher.json") -Force

        replace_in_file ($path + "\resources\app\bauncher.json") "package.json" "backage.json"
        replace_in_file ($path + "\resources\app\package.json") "./app_launcher/index.js" "LiteLoader"

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
        $powershell.AddArgument($original_bytes1)
        $powershell.AddArgument($replace_bytes1)
        $powershell.AddArgument($original_bytes2)
        $powershell.AddArgument($replace_bytes2)
        $powershell.AddArgument($updateProgress)
        $powershell.AddArgument($finish)
        $powershell.BeginInvoke()
    }
)


# 启动程序
$app = New-Object System.Windows.Application
$app.Run($window)
