#!/usr/bin/env pwsh
#Requires -Version 5.1
#Requires -RunAsAdministrator
#Requires -Modules BitsTransfer
#Requires -Modules Microsoft.PowerShell.Archive
#Requires -Modules Microsoft.PowerShell.Management
#Requires -Modules Microsoft.PowerShell.Utility

# 文件使用 UTF-8 with BOM 编码，副作用是它不能被签名。
$Script:LiteLoaderQQNT_Url = `
  'https://api.github.com/repos/LiteLoaderQQNT/LiteLoaderQQNT/releases/latest'
$Script:LiteLoaderQQNT_Name = 'LiteLoaderQQNT.zip'
$Script:LiteLoaderPatchNFixer_Url = `
  'https://api.github.com/repos/xh321/LiteLoaderQQNT-PatcherNFixer/releases/latest'
$Script:LiteLoaderPatchNFixer_Name = 'LiteLoaderPatchNFixer.exe'

function Install-LiteLoaderQQNT {
  [CmdletBinding()]
  param (
    # 下载链接
    [Parameter(Mandatory)]
    [string]
    $Url,
    # QQ 安装目录
    [Parameter(Mandatory)]
    [string]
    $QQBase
  )
  process {
    # 创建临时文件
    $Private:TempFile = New-TemporaryFile
    $TempFile = $TempFile.FullName + '.zip'
    try {
      # 下载文件
      Write-Host "下载 $LiteLoaderQQNT_Name"
      # Start-BitsTransfer cmdlet 据说下载文件的速度比 iwr 快
      Start-BitsTransfer -Source $Url -Destination $TempFile
      # 解压 zip
      Write-Host "释放 $LiteLoaderQQNT_Name"
      Expand-Archive `
        -LiteralPath $TempFile `
        -DestinationPath "$QQBase\resources\app\" `
        -Force
    }
    finally {
      # 删除临时文件
      Remove-Item $TempFile -Force
    }
  }
}

function Install-LiteLoaderQQNTLauncher {
  [CmdletBinding()]
  param (
    # 下载链接
    [Parameter(Mandatory)]
    [string]
    $Url,
    # QQ 安装目录
    [Parameter(Mandatory)]
    [string]
    $QQBase,
    # Launcher 名
    [Parameter(Mandatory)]
    [string]
    $Launcher
  )
  process {
    # 下载文件
    Write-Host "下载 $Launcher"
    Start-BitsTransfer `
      -Source $Url `
      -Destination "$QQBase\$Launcher"

    # 设置兼容性为需要管理员权限运行
    if (!(Test-Path 'HKCU:\Software\Microsoft\Windows NT\CurrentVersion\AppCompatFlags\Layers')) {
      New-Item 'HKCU:\Software\Microsoft\Windows NT\CurrentVersion\AppCompatFlags\Layers' -Force
    }
    Set-ItemProperty `
      -Path 'HKCU:\Software\Microsoft\Windows NT\CurrentVersion\AppCompatFlags\Layers' `
      -Name "$QQBase\$Launcher" `
      -Value '~ RUNASADMIN' `
      -Force
  }
}

function Install-LiteLoaderQQNTPatcherNFixer {
  [CmdletBinding()]
  param (
    # 下载链接
    [Parameter(Mandatory)]
    [string]
    $Url
  )
  process {
    # 创建临时文件
    $Private:TempFile = New-TemporaryFile
    $TempFile = $TempFile.FullName + '.exe'
    try {
      # 下载文件
      Write-Host "下载 $LiteLoaderPatchNFixer_Name"
      Start-BitsTransfer -Source $Url -Destination $TempFile
      Write-Host "运行 $LiteLoaderPatchNFixer_Name"
      Start-Process $TempFile -Wait
    }
    finally {
      # 删除临时文件
      Remove-Item $TempFile -Force
    }
  }
}

$Private:LiteLoaderQQNT = Invoke-RestMethod $LiteLoaderQQNT_Url
Write-Host "$($LiteLoaderQQNT.name) 更新日志：" -ForegroundColor Yellow
$LiteLoaderQQNT.body | Write-Host

if ($PSVersionTable.PSVersion.Major -LE 6) {
  # 是 Windows PowerShell 或不支持 $IsWindows 自动变量的老版本 PowerShell
  $Private:IsWindows = [System.Runtime.InteropServices.RuntimeInformation]::IsOSPlatform(
    [System.Runtime.InteropServices.OSPlatform]::Windows
  )
}

if ($IsWindows) {
  # Windows 才有的这些事

  # 获取 QQ 安装目录
  $Private:QQBase = Get-ChildItem `
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

  # 安装 PSMenu 模块
  Write-Host '在继续前，我们需要从 PSGallery 中导入一个 PowerShell 模块。' `
    -ForegroundColor Yellow
  Write-Host '如果可能的话请在接下来的问题中回答 ' `
    -ForegroundColor Yellow `
    -NoNewline
  Write-Host 'Y' -ForegroundColor Green

  Install-Module -Name PSMenu

  # 用户选择一种安装方式
  Write-Host '请选择一种安装方式：' -ForegroundColor Yellow
  $Private:InstallMethod = Show-Menu @(
    '使用 Launcher (推荐，闭源)',
    '使用全自动 Patch 程序 (开源)',
    '使用 Patch Powershell 脚本 (开源)'
  ) -ReturnIndex

  switch ($InstallMethod) {
    0 {
      # 使用 Launcher
      # 由于我不知道用户装的是x86版QQ还是x64版QQ 所以...我两个都下载(?
      $Private:Launcher86 = 'LiteLoaderQQNT-Launcher_x86.exe'
      $Private:Launcher64 = 'LiteLoaderQQNT-Launcher_x64.exe'
      $LiteLoaderQQNT.assets | ForEach-Object {
        $Private:Url = $PSItem.browser_download_url
        switch ($PSItem.name) {
          $Launcher86 {
            Install-LiteLoaderQQNTLauncher `
              -Url $Url `
              -QQBase $QQBase `
              -Launcher $Launcher86
          }
          $Launcher64 {
            Install-LiteLoaderQQNTLauncher `
              -Url $Url `
              -QQBase $QQBase `
              -Launcher $Launcher64
          }
          $LiteLoaderQQNT_Name {
            Install-LiteLoaderQQNT `
              -Url $Url `
              -QQBase $QQBase
          }
        }
      }
    }
    1 {
      # 使用全自动 Patch 程序
      $Private:LiteLoaderPatchNFixer = Invoke-RestMethod $LiteLoaderPatchNFixer_Url
      Write-Host "$($LiteLoaderPatchNFixer.name) 更新日志：" `
        -ForegroundColor Yellow
      $LiteLoaderPatchNFixer.body | Write-Host

      $LiteLoaderQQNT.assets | ForEach-Object {
        $Private:Url = $PSItem.browser_download_url
        switch ($PSItem.name) {
          $LiteLoaderQQNT_Name {
            Install-LiteLoaderQQNT `
              -Url $Url `
              -QQBase $QQBase
          }
        }
      }
      $LiteLoaderPatchNFixer.assets | ForEach-Object {
        $Private:Url = $PSItem.browser_download_url
        switch ($PSItem.name) {
          $LiteLoaderPatchNFixer_Name {
            Install-LiteLoaderQQNTPatcherNFixer `
              -Url $Url
          }
        }
      }
    }
    2 {
      $LiteLoaderQQNT.assets | ForEach-Object {
        $Private:Url = $PSItem.browser_download_url
        switch ($PSItem.name) {
          $LiteLoaderQQNT_Name {
            Install-LiteLoaderQQNT `
              -Url $Url `
              -QQBase $QQBase

            . "$QQBase\resources\app\LiteLoader\patch.ps1"
          }
        }
      }
    }
    Default {
      throw '???'
    }
  }
}
else {
  # 获取 QQ 安装目录
  $Private:QQBase = Read-Host -Prompt '请输入 QQ 安装目录'

  $LiteLoaderQQNT.assets | ForEach-Object {
    switch ($PSItem.name) {
      $LiteLoaderQQNT_Name {
        Install-LiteLoaderQQNT `
          -Url $PSItem.browser_download_url `
          -QQBase $QQBase
      }
    }
  }
}
