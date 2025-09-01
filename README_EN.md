# LiteLoaderQQNT

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub release](https://img.shields.io/github/v/release/LiteLoaderQQNT/LiteLoaderQQNT?logo=github)](https://github.com/LiteLoaderQQNT/LiteLoaderQQNT/releases)
[![Follow on Telegram](https://img.shields.io/badge/Follow-Telegram-blue?logo=telegram)](https://t.me/LiteLoaderQQNT_Channel)

> Lightweight · Simple · Open Source · Furry

[简体中文](https://github.com/LiteLoaderQQNT/LiteLoaderQQNT/blob/main/README.md) | **English**

LiteLoaderQQNT is a plugin loader for QQNT, often referred to simply as LiteLoader within the QQNT environment. It allows you to freely add various plugins to QQNT, enabling features such as theme customization, functionality enhancements, and more. For more details, visit LiteLoaderQQNT website at <https://liteloaderqqnt.github.io>.

> [!CAUTION]
> QQ Security Center may identify LiteLoaderQQNT as an "illegal cheat tool" and disconnect your device, and may also ban your account. **Please use LiteLoaderQQNT with caution.**

## Installation

> [!NOTE]
> This version of LiteLoaderQQNT requires the use of an unreleased `dbghelp.dll` from the Telegram channel to function properly.

### Download LiteLoaderQQNT

First, download LiteLoaderQQNT to any location. There are two methods:

- **Release (Stable Version)**: Go to the [LiteLoaderQQNT Releases page](https://github.com/LiteLoaderQQNT/LiteLoaderQQNT/releases), download the `LiteLoaderQQNT.zip` file, and extract it to any location.
- **Clone (Latest Commit)**: Use Git to clone the LiteLoaderQQNT repository locally.

    ```bash
    git clone --depth 1 https://github.com/LiteLoaderQQNT/LiteLoaderQQNT.git
    ```

### Bypassing QQNT File Verification on Windows

Download the `dbghelp_*.dll` file from the Telegram group according to your system architecture, rename it to `dbghelp.dll`, and place it in the same directory as `QQ.exe`.

### Modify the files to install
1. Go to the QQNT installation directory. For example, if the version is `9.9.21-38711`, the path would be `QQNT\versions\9.9.21-38711 (depending on your version)\resources\app`. 
2. Create the `app_launcher` directory. 
3. Create a `LiteLoader.js` file (the file name can be set arbitrarily, but the extension `.js` must be retained) in this directory and write the following content: 

    ```javascript
    require(String.raw`Modify to the absolute path of the LiteLoaderQQNT core, keep the backquotes`) 
    ```

4. Modify the `app\package.json` file and change the value after `main` to `./app_launcher/LiteLoader.js`, where `LiteLoader` is the name of the file you created.

    ```diff
    -   "main": "./application.asar/app_launcher/index.js",
    +   "main": "./app_launcher/LiteLoader.js",
    ```

### Change Plugin Data Directory (Optional)

You can set the `LITELOADERQQNT_PROFILE` environment variable to specify the storage location for `data` and `plugins`, allowing read and write operations to be performed outside the main directory. If the main directory lacks write permissions (e.g., QQNT on macOS and Linux platforms, or QQNT packaged with solutions like flatpak), please set this variable to a location where the current user has read and write permissions.

If you wish to merge the main directory with the storage directory, delete the `LITELOADERQQNT_PROFILE` environment variable and move the `data` and `plugins` folders back to the root directory of the main installation.

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
