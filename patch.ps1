#!/usr/bin/env pwsh
#Requires -Version 5.1
#Requires -RunAsAdministrator

# 获取 QQ 安装目录
$Script:QQBase = Get-ChildItem `
  'HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\', `
  'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\', `
  'HKLM:\SOFTWARE\Wow6432Node\Microsoft\Windows\CurrentVersion\Uninstall\' `
| Where-Object Name -Like '*\QQ' `
| Select-Object -Property @(
  @{
    label      = 'Path'
    expression = { $_.GetValue('UninstallString') | Split-Path }
  }
) `
| Select-Object -ExpandProperty Path

if (!$QQBase) {
  throw '未能发现已安装的 NTQQ'
}

function Update-PatchProgress {
  [CmdletBinding()]
  param (
    # Parameter help description
    [Parameter(Mandatory)]
    [int]
    $Progress
  )

  process {
    Write-Progress -Activity '当前修补进度' -Status "$Progress% Complete:" -PercentComplete $Progress
  }
}

function Invoke-PatchQQ {
  [CmdletBinding()]
  param (
    # Parameter help description
    [Parameter(Mandatory)]
    [byte[]]
    $OriginalBytes1,
    # Parameter help description
    [Parameter(Mandatory)]
    [byte[]]
    $OriginalBytes2,
    # Parameter help description
    [Parameter(Mandatory)]
    [byte[]]
    $ReplaceBytes1,
    # Parameter help description
    [Parameter(Mandatory)]
    [byte[]]
    $ReplaceBytes2
  )
  begin {
    Write-Host '开始修补...' -ForegroundColor Blue
  }
  process {
    # 要修补的.exe文件路径
    $Private:SourceFilePath = "$QQBase\QQ.exe.bak"
    $Private:TargetFilePath = "$QQBase\QQ.exe"

    # 重命名QQ为.bak
    if (-not (Test-Path $SourceFilePath)) {
      Rename-Item -Path $TargetFilePath -NewName 'QQ.exe.bak'
    }

    # 使用二进制文件流打开原始文件和目标文件
    $Private:SourceStream = [System.IO.File]::OpenRead($SourceFilePath)
    $Private:TargetStream = [System.IO.File]::Create($TargetFilePath)
    try {
      # 定义缓冲区大小 (4MB)
      $Private:BufferSize = 1024 * 1024 * 4
      $Private:Buffer = [byte[]]::new($BufferSize)

      $Private:FileSize = $SourceStream.Length
      $Private:BytesProcessed = 0
      $Private:Matched = 0

      Update-PatchProgress -Progress 0

      # 循环处理文件
      while ($true) {
        # 从原始文件读取缓冲区数据
        $Private:ReadBytes = $SourceStream.Read($Buffer, 0, $BufferSize)

        # 如果已经读取到文件末尾，则退出循环
        if ($ReadBytes -eq 0) {
          break
        }

        if ($Matched -ne 2) {
          # 查找并替换字节序列（写成这样子是为了提高性能）
          for ($i = 0; $i -lt $ReadBytes; $i++) {
            if (
              $Buffer[$i + 0] -eq $OriginalBytes1[0] -and
              $Buffer[$i + 1] -eq $OriginalBytes1[1] -and
              $Buffer[$i + 2] -eq $OriginalBytes1[2] -and
              $Buffer[$i + 3] -eq $OriginalBytes1[3] -and
              $Buffer[$i + 4] -eq $OriginalBytes1[4] -and
              $Buffer[$i + 5] -eq $OriginalBytes1[5] -and
              $Buffer[$i + 6] -eq $OriginalBytes1[6] -and
              $Buffer[$i + 7] -eq $OriginalBytes1[7] -and
              $Buffer[$i + 8] -eq $OriginalBytes1[8] -and
              $Buffer[$i + 9] -eq $OriginalBytes1[9] -and
              $Buffer[$i + 10] -eq $OriginalBytes1[10] -and
              $Buffer[$i + 11] -eq $OriginalBytes1[11] -and
              $Buffer[$i + 12] -eq $OriginalBytes1[12]
            ) {
              $Matched = $Matched + 1
              for ($j = 0; $j -lt 13; $j++) {
                $Buffer[$i + $j] = $ReplaceBytes1[$j]
              }
            }
            elseif (
              $Buffer[$i + 0] -eq $OriginalBytes2[0] -and
              $Buffer[$i + 1] -eq $OriginalBytes2[1] -and
              $Buffer[$i + 2] -eq $OriginalBytes2[2] -and
              $Buffer[$i + 3] -eq $OriginalBytes2[3] -and
              $Buffer[$i + 4] -eq $OriginalBytes2[4] -and
              $Buffer[$i + 5] -eq $OriginalBytes2[5] -and
              $Buffer[$i + 6] -eq $OriginalBytes2[6] -and
              $Buffer[$i + 7] -eq $OriginalBytes2[7] -and
              $Buffer[$i + 8] -eq $OriginalBytes2[8] -and
              $Buffer[$i + 9] -eq $OriginalBytes2[9] -and
              $Buffer[$i + 10] -eq $OriginalBytes2[10] -and
              $Buffer[$i + 11] -eq $OriginalBytes2[11] -and
              $Buffer[$i + 12] -eq $OriginalBytes2[12]
            ) {
              $Matched = $Matched + 1
              for ($j = 0; $j -lt 13; $j++) {
                $Buffer[$i + $j] = $ReplaceBytes2[$j]
              }
            }
          }
        }

        # 将缓冲区数据写入目标文件
        $TargetStream.Write($Buffer, 0, $ReadBytes)
        $BytesProcessed += $ReadBytes
        $Private:Progress = [Math]::Truncate(($BytesProcessed / $FileSize) * 100)

        Update-PatchProgress -Progress $Progress
      }

      Update-PatchProgress -Progress 100

    }
    finally {
      # 关闭文件流
      $SourceStream.Dispose()
      $TargetStream.Dispose()
    }
  }
  end {
    Write-Host 'Patch 完成！' -ForegroundColor Blue
  }
}

function Invoke-ReplaceInFile {
  [CmdletBinding()]
  param (
    # Parameter help description
    [Parameter(Mandatory)]
    [string]
    $Filename,
    # Parameter help description
    [Parameter(Mandatory)]
    [string]
    $OldValue,
    # Parameter help description
    [Parameter(Mandatory)]
    [string]
    $NewValue
  )
  process {
    if (Test-Path $Filename) {
      (Get-Content $Filename -Raw ) -replace $OldValue, $NewValue | Out-File $Filename
    }
  }
}

$Private:State = Read-Host -Prompt '您要执行修补吗 [Y/n]'
if (!'y'.Equals($State, [System.StringComparison]::OrdinalIgnoreCase) `
    -and ![string]::IsNullOrWhiteSpace($State)) {
  exit
}

Write-Host '正在初始化...' -ForegroundColor Blue

[byte[]] $Private:OriginalBytes1 = @(0xAD, 0xA0, 0xB4, 0xAF, 0xA2, 0xA9, 0xA4, 0xB3, 0xEF, 0xAB, 0xB2, 0xAE, 0xAF, 0x00)
[byte[]] $Private:ReplaceBytes1 = @(0xA3, 0xA0, 0xB4, 0xAF, 0xA2, 0xA9, 0xA4, 0xB3, 0xEF, 0xAB, 0xB2, 0xAE, 0xAF, 0x00)

[byte[]] $Private:OriginalBytes2 = @(0xB1, 0xA0, 0xA2, 0xAA, 0xA0, 0xA6, 0xA4, 0xEF, 0xAB, 0xB2, 0xAE, 0xAF, 0x00)
[byte[]] $Private:ReplaceBytes2 = @(0xA3, 0xA0, 0xA2, 0xAA, 0xA0, 0xA6, 0xA4, 0xEF, 0xAB, 0xB2, 0xAE, 0xAF, 0x00)


if (-not (Select-String -Path ("$QQBase\resources\app\package.json") -Pattern 'LiteLoader' -Quiet)) {
  Copy-Item -Path ("$QQBase\resources\app\package.json") -Destination ("$QQBase\resources\app\backage.json") -Force
}
Copy-Item -Path ("$QQBase\resources\app\launcher.json") -Destination ("$QQBase\resources\app\bauncher.json") -Force

Invoke-ReplaceInFile `
  -FileName "$QQBase\resources\app\bauncher.json" `
  -OldValue 'package.json' `
  -NewValue 'backage.json'

Invoke-ReplaceInFile `
  -FileName "$QQBase\resources\app\package.json" `
  -OldValue './app_launcher/index.js' `
  -NewValue 'LiteLoader'

Invoke-PatchQQ `
  -OriginalBytes1 $OriginalBytes1 `
  -ReplaceBytes1 $ReplaceBytes1 `
  -OriginalBytes2 $OriginalBytes2 `
  -ReplaceBytes2 $ReplaceBytes2 `
