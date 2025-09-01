# LiteLoaderQQNT

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub release](https://img.shields.io/github/v/release/LiteLoaderQQNT/LiteLoaderQQNT?logo=github)](https://github.com/LiteLoaderQQNT/LiteLoaderQQNT/releases)
[![Follow on Telegram](https://img.shields.io/badge/Follow-Telegram-blue?logo=telegram)](https://t.me/LiteLoaderQQNT_Channel)

> Lightweight · Simple · Open Source · Furry

[简体中文](https://github.com/LiteLoaderQQNT/LiteLoaderQQNT/blob/main/README.md) | **English**

LiteLoaderQQNT is a plugin loader for QQNT, often referred to simply as LiteLoader within the QQNT environment. It allows you to freely add various plugins to QQNT, enabling features such as theme customization, functionality enhancements, and more. For more details, visit LiteLoaderQQNT website at <https://liteloaderqqnt.github.io>.

> [!CAUTION]
> QQ Security Center may flag LiteLoaderQQNT as third-party software and restrict your device access, or even result in account suspension. It is recommended to use a secondary account when installing LiteLoaderQQNT (some users have already received warnings from QQ Security). Please use LiteLoaderQQNT with caution.

## Installation

> [!NOTE]
> This documentation is written for LiteLoaderQQNT 1.2.4. Currently, it only supports Windows 64-bit and requires an unreleased `dbghelp.dll` from the Telegram channel.

### Download LiteLoaderQQNT

First, download LiteLoaderQQNT to any location. There are two methods:

- **Release (Stable Version)**: Go to the [LiteLoaderQQNT Releases page](https://github.com/LiteLoaderQQNT/LiteLoaderQQNT/releases), download the `LiteLoaderQQNT.zip` file, and extract it to any location.
- **Clone (Latest Commit)**: Use Git to clone the LiteLoaderQQNT repository locally.

    ```bash
    git clone --depth 1 https://github.com/LiteLoaderQQNT/LiteLoaderQQNT.git
    ```

### Bypassing QQNT File Verification on Windows

Download the `dbghelp_*.dll` file from the Telegram group according to your system architecture, rename it to `dbghelp.dll`, and place it in the same directory as `QQ.exe`.

### Verifying Installation

After completing the installation steps, there are two ways to check if LiteLoaderQQNT was installed successfully:

- Launch QQNT, open Settings, and check if the LiteLoaderQQNT option appears in the left sidebar.
- Run QQNT via the terminal and check if LiteLoaderQQNT-related output is displayed.

If either condition is met, the installation was successful. Enjoy!

## Plugins

### Standard Installation

You can install/uninstall plugins directly in the Settings interface. Alternatively, use community-developed plugin market plugins (e.g., [plugin-list-viewer](https://github.com/ltxhhz/LL-plugin-list-viewer)) for management.

### Manual Installation

Move the plugin folder to `LiteLoaderQQNT/plugins` to install it. To uninstall, delete the corresponding folder from the `plugins` directory (plugin data is stored in the `data` directory under the same name).

### Finding Plugins

You can discover plugins through:

- The official website homepage
- Third-party plugin markets
- GitHub searches

An official plugin list is maintained, cataloging most known plugins, which can be viewed on the website. Also, there's a [plugin list in JSON format](https://github.com/LiteLoaderQQNT/Plugin-List/blob/v4/plugins.json).

## Development

Refer to the [official documentation](https://liteloaderqqnt.github.io/docs/introduction.html) for details.

## License

LiteLoaderQQNT is open-sourced under [the MIT License](./LICENSE).
