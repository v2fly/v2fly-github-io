# 下载安装

## 平台支持

V2Ray 在以下平台中可用：

* Windows 7 及之后版本（x86 / amd64 / arm32）；
* macOS 10.10 Yosemite 及之后版本（amd64）；
* Linux 2.6.23 及之后版本（x86 / amd64 / arm / arm64 / mips64 / mips / ppc64 / s390x / riscv64）；
  * 包括但不限于 Debian 7 / 8、Ubuntu 12.04 / 14.04 及后续版本、CentOS 6 / 7、Arch Linux 等；
* FreeBSD (x86 / amd64)；
* OpenBSD (x86 / amd64)；
* Dragonfly BSD (amd64)；

## 下载 V2Ray

预编译的压缩包可以在如下几个站点找到：

1. Github Release：[github.com/v2fly/v2ray-core](https://github.com/v2fly/v2ray-core/releases)
2. Homebrew：[github.com/v2ray/homebrew-v2ray](https://github.com/v2ray/homebrew-v2ray)
3. Arch Linux：[packages/community/x86_64/v2ray/](https://www.archlinux.org/packages/community/x86_64/v2ray/)

压缩包均为 ZIP 格式，找到对应平台的压缩包，下载解压即可使用。

## 验证安装包

V2Ray 提供两种验证方式：

1. 安装包 ZIP 文件的 SHA1 / SHA256 摘要，在每个安装包对应的 `.dgst` 文件中可以找到。
2. 使用 v2ctl verify --sig=Release example-file

## Windows 和 macOS 安装方式

通过上述方式下载的压缩包，解压之后可看到 v2ray 或 v2ray.exe。

然後 [通过命令行带参数运行](command.md) 即可。

## Linux 发行版仓库

部分发行版可能已收录 V2Ray 到其官方维护和支持的软件仓库／软件源中。出于兼容性和适配性考虑，建议选用由您所使用的发行版，其维护团队维护的软件包，然后再考虑使用下文的安装脚本，亦或基于已发布的二进制文件或源代码，进行手动安装。

* Debian：[golang-v2ray-core](https://tracker.debian.org/pkg/golang-v2ray-core)。

## Linux 安装脚本

原安装脚本已被弃置，由 [fhs-install-v2ray](https://github.com/v2fly/fhs-install-v2ray) 替换。

相关讨论可前往 [#2328](https://github.com/v2ray/v2ray-core/issues/2328)。

主要改动内容：

* 依据 FHS 修改 V2Ray 的安装路径。
* 停止对类似 CentOS 6 等上古发行版版本的支援。
* 停止对 System V 的支援。
* 启动服务由 root 用户替换为 nobody 用户。

### 解决问题

* 「[不安装或更新 geoip.dat 和 geosite.dat](https://github.com/v2fly/fhs-install-v2ray/wiki/Do-not-install-or-update-geoip.dat-and-geosite.dat)」。
* 「[使用证书时权限不足](https://github.com/v2fly/fhs-install-v2ray/wiki/Insufficient-permissions-when-using-certificates)」。
* 「[从旧脚本迁移至此](https://github.com/v2fly/fhs-install-v2ray/wiki/Migrate-from-the-old-script-to-this)」。
* 「[将 .dat 文档由 lib 目录移动到 share 目录](https://github.com/v2fly/fhs-install-v2ray/wiki/Move-.dat-files-from-lib-directory-to-share-directory)」。
* 「[使用 VLESS 协议](https://github.com/v2fly/fhs-install-v2ray/wiki/To-use-the-VLESS-protocol)」。

## Docker

V2Ray 提供了预编译的 Docker Image：

* [v2fly/v2ray-core](https://hub.docker.com/r/v2fly/v2fly-core)：其中`latest`标签会跟随[v2fly](https://github.com/v2fly/docker-fly)编译仓库提交保持最新，而各个版本以 tag 方式发布，比如`4.21.3`。

Docker Image 的文件结构跟 Linux 下安装的路径相同：

* `/etc/v2ray/config.json`：配置文件
* `/usr/bin/v2ray/v2ray`：V2Ray 主程序
* `/usr/bin/v2ray/v2ctl`：V2Ray 辅助工具
* `/usr/bin/v2ray/geoip.dat`：IP 数据文件
* `/usr/bin/v2ray/geosite.dat：`域名数据文件
