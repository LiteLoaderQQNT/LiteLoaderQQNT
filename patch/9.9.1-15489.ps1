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
$oldBytes1 = [byte[]] @(0xE8, 0x91, 0xC2, 0xFF, 0xFF)
$oldBytes2 = [byte[]] @(0x0F, 0x84, 0x9F, 0x04, 0x00, 0x00)
$newBytes1 = [byte[]] @(0x90, 0x90, 0x90, 0x90, 0x90)
$newBytes2 = [byte[]] @(0x90, 0x90, 0x90, 0x90, 0x90, 0x90)

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
        if ($buffer[$i] -eq $oldBytes1[0] -and $buffer[$i+1] -eq $oldBytes1[1] -and $buffer[$i+2] -eq $oldBytes1[2] -and $buffer[$i+3] -eq $oldBytes1[3] -and $buffer[$i+4] -eq $oldBytes1[4]) {
            $buffer[$i] = $newBytes1[0]
            $buffer[$i+1] = $newBytes1[1]
            $buffer[$i+2] = $newBytes1[2]
            $buffer[$i+3] = $newBytes1[3]
            $buffer[$i+4] = $newBytes1[4]
        }
        if ($buffer[$i] -eq $oldBytes2[0] -and $buffer[$i+1] -eq $oldBytes2[1] -and $buffer[$i+2] -eq $oldBytes2[2] -and $buffer[$i+3] -eq $oldBytes2[3] -and $buffer[$i+4] -eq $oldBytes2[4] -and $buffer[$i+5] -eq $oldBytes2[5]) {
            $buffer[$i] = $newBytes2[0]
            $buffer[$i+1] = $newBytes2[1]
            $buffer[$i+2] = $newBytes2[2]
            $buffer[$i+3] = $newBytes2[3]
            $buffer[$i+4] = $newBytes2[4]
            $buffer[$i+5] = $newBytes2[5]
        }
    }

    # 将缓冲区数据写入目标文件
    $targetStream.Write($buffer, 0, $readBytes)

    # 更新进度条
    $bytesProcessed += $readBytes
    $percentComplete = ($bytesProcessed / $fileSize) * 100
    Write-Progress -Activity "Processing File" -Status "Progress" -PercentComplete $percentComplete
}

# 关闭文件流
$sourceStream.Close()
$targetStream.Close()

# 完成时显示100%的进度
Write-Progress -Activity "Processing File" -Status "Completed" -PercentComplete 100