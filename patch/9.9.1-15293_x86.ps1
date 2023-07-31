# 强制结束QQ进程
Stop-Process -Name "QQ" -Force -ErrorAction SilentlyContinue

# 要修补的.exe文件路径
$sourceFilePath = "../../../../QQ.exe.bak"
$targetFilePath = "../../../../QQ.exe"

# 重命名QQ为.bak
if (!(Test-Path $sourceFilePath)) {
    Rename-Item -Path $targetFilePath -NewName "QQ.exe.bak"
}

# 要查找和替换的字节序列
$oldBytes = [byte[]] @(0xE8, 0x75, 0xCC, 0xFF, 0xFF, 0x84, 0xC0, 0x0F, 0x84, 0xC6, 0x02, 0x00, 0x00)
$newBytes = [byte[]] @(0x90, 0x90, 0x90, 0x90, 0x90, 0x84, 0xC0, 0x90, 0x90, 0x90, 0x90, 0x90, 0x90)

# 使用二进制文件流打开原始文件和目标文件
$sourceStream = [System.IO.File]::Open($sourceFilePath, [System.IO.FileMode]::Open, [System.IO.FileAccess]::Read)
$targetStream = [System.IO.File]::Open($targetFilePath, [System.IO.FileMode]::Create, [System.IO.FileAccess]::Write)

# 定义缓冲区大小 (4MB)
$bufferSize = 1024 * 1024 * 4
$buffer = New-Object byte[] $bufferSize

# 获取文件大小
$fileSize = $sourceStream.Length
$bytesProcessed = 0

# 循环处理文件
while ($true) {
    # 从原始文件读取缓冲区数据
    $readBytes = $sourceStream.Read($buffer, 0, $bufferSize)

    # 如果已经读取到文件末尾，则退出循环
    if ($readBytes -eq 0) {
        break
    }

    # 查找并替换字节序列（写成这样子是为了提高性能）
    for ($i = 0; $i -lt $readBytes; $i++) {
        if (
            $buffer[$i + 0] -eq $oldBytes[0] -and
            $buffer[$i + 1] -eq $oldBytes[1] -and
            $buffer[$i + 2] -eq $oldBytes[2] -and
            $buffer[$i + 3] -eq $oldBytes[3] -and
            $buffer[$i + 4] -eq $oldBytes[4] -and
            $buffer[$i + 5] -eq $oldBytes[5] -and
            $buffer[$i + 6] -eq $oldBytes[6] -and
            $buffer[$i + 7] -eq $oldBytes[7] -and
            $buffer[$i + 8] -eq $oldBytes[8] -and
            $buffer[$i + 9] -eq $oldBytes[9] -and
            $buffer[$i + 10] -eq $oldBytes[10] -and
            $buffer[$i + 11] -eq $oldBytes[11] -and
            $buffer[$i + 12] -eq $oldBytes[12]
        ) {
            $buffer[$i + 0] = $newBytes[0]
            $buffer[$i + 1] = $newBytes[1]
            $buffer[$i + 2] = $newBytes[2]
            $buffer[$i + 3] = $newBytes[3]
            $buffer[$i + 4] = $newBytes[4]
            $buffer[$i + 5] = $newBytes[5]
            $buffer[$i + 6] = $newBytes[6]
            $buffer[$i + 7] = $newBytes[7]
            $buffer[$i + 8] = $newBytes[8]
            $buffer[$i + 9] = $newBytes[9]
            $buffer[$i + 10] = $newBytes[10]
            $buffer[$i + 11] = $newBytes[11]
            $buffer[$i + 12] = $newBytes[12]
        }
    }

    # 将缓冲区数据写入目标文件
    $targetStream.Write($buffer, 0, $readBytes)

    # 更新进度条
    $bytesProcessed += $readBytes
    $percentComplete = ($bytesProcessed / $fileSize) * 100
    Write-Progress -Activity "正在修补QQ.exe..." -Status "当前进度：" -PercentComplete $percentComplete
}

# 关闭文件流
$sourceStream.Close()
$targetStream.Close()

# 完成时显示100%的进度
Write-Progress -Activity "正在修补QQ.exe..." -Status "修补完成！" -PercentComplete 100