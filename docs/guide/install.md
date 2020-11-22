# 下载安装

## 平台支持

V2Ray 在以下平台中可用：

* Windows 7 及之后版本（x86 / amd64 / arm32）；
* macOS 10.10 Yosemite 及之后版本（amd64）；
* Linux 2.6.23 及之后版本（x86 / amd64 / arm / arm64 / mips64 / mips / ppc64 / s390x / riscv64）；
  * 包括但不限于 Debian 7 / 8、Ubuntu 12.04 / 14.04 及后续版本、CentOS 7 / 8、Arch Linux 等；
* FreeBSD (x86 / amd64)；
* OpenBSD (x86 / amd64)；
* Dragonfly BSD (amd64)；

## 下载 V2Ray

预编译的二进制 ZIP 格式压缩包可在 [Github Releases](https://github.com/v2fly/v2ray-core/releases) 中找到。下载对应平台的压缩包，解压后即可使用。

## 验证安装包

V2Ray 提供两种验证方式：

* ZIP 压缩包的 SHA1 / SHA256 摘要，在每个安装包对应的 `.dgst` 文件中可以找到。使用方式：`v2ctl verify --sig=Release /path/to/your/downloaded/v2ray/zip/file`
* 可复现构建：[github.com/v2fly/reproducible-builds](https://github.com/v2fly/reproducible-builds)

## Windows 安装方式

* 在 [Github Releases](https://github.com/v2fly/v2ray-core/releases) 下载适用于 Windows 平台的 ZIP 压缩包，解压后可得到可执行文件 `v2ray.exe`，然后[通过命令行带参数运行](command.md) 即可
* 通过 [Scoop](https://scoop.sh/) 包管理器安装：`scoop install v2ray`
* 通过 [Chocolatey](https://chocolatey.org/) 包管理器安装：`choco install v2ray`

## macOS 安装方式

* 在 [Github Releases](https://github.com/v2fly/v2ray-core/releases) 下载适用于 macOS 平台的 ZIP 压缩包，解压后可得到可执行文件 `v2ray`，然后[通过命令行带参数运行](command.md) 即可
* 通过 [Homebrew](https://brew.sh/) 包管理器安装：`brew install v2ray`。如需使用 `brew services`，请使用此 [Tap](https://github.com/v2ray/homebrew-v2ray)。

## Linux 安装方式

部分 Linux 发行版已收录 V2Ray 到其官方维护和支持的软件仓库／软件源中。出于兼容性和适配性考虑，建议首先选用由您所使用的发行版的维护团队维护的软件包。

### Linux 发行版包管理器

Linux 发行版 V2Ray 包（可通过发行版相应的包管理器安装）：

* Debian：[golang-v2ray-core](https://tracker.debian.org/pkg/golang-v2ray-core)
* Arch Linux：[community/x86_64/v2ray](https://www.archlinux.org/packages/community/x86_64/v2ray/)

### Linuxbrew 包管理器

[Linuxbrew](https://github.com/Homebrew/linuxbrew-core) 包管理器的使用方式与 Homebrew 一致：`brew install v2ray`

### 安装脚本

原安装脚本已被废弃，由 [fhs-install-v2ray](https://github.com/v2fly/fhs-install-v2ray) 替代。

相关讨论可前往 [#2328](https://github.com/v2ray/v2ray-core/issues/2328)。

主要改动内容：

* 依据 FHS 改善 V2Ray 的安装路径。
* 停止对诸如 CentOS 6 等上古发行版版本的支援。
* 停止对 System V 的支援。
* 启动服务由 root 用户替换为 nobody 用户。

#### FAQ

* 「[不安装或更新 geoip.dat 和 geosite.dat](https://github.com/v2fly/fhs-install-v2ray/wiki/Do-not-install-or-update-geoip.dat-and-geosite.dat)」。
* 「[使用证书时权限不足](https://github.com/v2fly/fhs-install-v2ray/wiki/Insufficient-permissions-when-using-certificates)」。
* 「[从旧脚本迁移至此](https://github.com/v2fly/fhs-install-v2ray/wiki/Migrate-from-the-old-script-to-this)」。
* 「[将 .dat 文档由 lib 目录移动到 share 目录](https://github.com/v2fly/fhs-install-v2ray/wiki/Move-.dat-files-from-lib-directory-to-share-directory)」。
* 「[使用 VLESS 协议](https://github.com/v2fly/fhs-install-v2ray/wiki/To-use-the-VLESS-protocol)」。

### Docker

* V2Ray 为 Linux 平台提供了预编译的 Docker image：[v2fly/v2ray-core](https://hub.docker.com/r/v2fly/v2fly-core)
* GitHub repo：[github.com/v2fly/docker](https://github.com/v2fly/docker)

Docker image 的文件结构：

* `/etc/v2ray/config.json`：配置文件
* `/usr/bin/v2ray`：V2Ray 主程序
* `/usr/bin/v2ctl`：V2Ray 辅助工具
* `/usr/local/share/v2ray/geoip.dat`：IP 数据文件
* `/usr/local/share/v2ray/geosite.dat`：域名数据文件
