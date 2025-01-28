# 下载安装

## 平台支持

V2Ray 在以下平台中可用：

* Windows 7 及之后版本（x86 / amd64 / arm32）；
* macOS 10.10 Yosemite 及之后版本（amd6 / arm64）；
* Linux 2.6.23 及之后版本（x86 / amd64 / arm / arm64 / mips64 / mips / riscv64）；
  * 包括但不限于 Debian 7 / 8、Ubuntu 12.04 / 14.04 及后续版本、CentOS 7 / 8、Arch Linux 等；
* FreeBSD (x86 / amd64)；
* OpenBSD (x86 / amd64)；
* Dragonfly BSD (amd64)；

## 下载 V2Ray

预编译的二进制 ZIP 格式压缩包可在 [Github Releases](https://github.com/v2fly/v2ray-core/releases) 中找到。下载对应平台的压缩包，解压后即可使用。

## 验证安装包

V2Ray 提供两种验证方式：

* ZIP 压缩包的 SHA1 / SHA256 摘要，在每个安装包对应的 `.dgst` 文件中可以找到。使用方式：`v2ray verify --sig=Release /path/to/your/downloaded/v2ray/zip/file`
* 可复现构建：[github.com/v2fly/reproducible-builds](https://github.com/v2fly/reproducible-builds)

## Windows 安装方式

* 在 [Github Releases](https://github.com/v2fly/v2ray-core/releases) 下载适用于 Windows 平台的 ZIP 压缩包，解压后可得到可执行文件 `v2ray.exe`，然后[通过命令行带参数运行](command.md)即可
* 通过 [Scoop](https://scoop.sh) 包管理器安装：`scoop install v2ray`

## macOS 安装方式

* 在 [Github Releases](https://github.com/v2fly/v2ray-core/releases) 下载适用于 macOS 平台的 ZIP 压缩包，解压后可得到可执行文件 `v2ray`，然后[通过命令行带参数运行](command.md)即可
* 通过 [Homebrew](https://brew.sh) 包管理器安装：`brew install v2ray`
* 随命令一起下载的 geosite.dat 和 geoip.dat 放置在 `/usr/local/share/v2ray/` 目录下，若是 Apple Silicon 版本则默认放置在 `/opt/homebrew/share/v2ray`

## Linux 安装方式

### 安装脚本

请查看 GitHub 仓库：[fhs-install-v2ray](https://github.com/v2fly/fhs-install-v2ray)

### Linux 发行版包管理器

Linux 发行版提供的 V2Ray 包（可通过发行版相应的包管理器安装）：

* Debian：[golang-v2ray-core](https://tracker.debian.org/pkg/golang-v2ray-core)
* Arch Linux：[community/x86_64/v2ray](https://www.archlinux.org/packages/community/x86_64/v2ray/)

#### APT pinning

目前，Debian 的 V2Ray 包仍位于 Unstable 仓库，想用新包，又不想整体转为 Unstable 的话，就可以使用 [APT pinning](https://wiki.debian.org/AptConfiguration)。

1. 向 `/etc/apt/preferences` 写入：

```
Explanation: Uninstall or do not install any Debian-originated
Explanation: package versions other than those in the stable distro
Package: *
Pin: release a=stable
Pin-Priority: 900

Package: *
Pin: release o=Debian
Pin-Priority: -10
```

这将保证主体仍为 Stable。

2. 向 `/etc/apt/preferences.d/90debian-unstable` 写入：

```
Package: v2ray
Pin: release a=unstable
Pin-Priority: 900
```

这会确保单独从 Unstable 仓库拿取 V2Ray 包。

3. 执行并写入：

```
# apt edit-sources unstable

deb https://deb.debian.org/debian/ sid main
deb-src https://deb.debian.org/debian/ sid main
```

这样就增添了 Unstable（Sid）仓库。

4. 更新软体仓库并安装 V2Ray：

```
# apt update
# apt install v2ray
```

注意：由于该包在 v2ray.service 中使用了 `DynamicUser=true`，如果你想向 `/var/log/v2ray/` 目录档中写入 Log，请执行并写入：

```
# systemctl edit v2ray.service

[Service]
LogsDirectory=v2ray
```

### Linuxbrew 包管理器

[Linuxbrew](https://github.com/Homebrew/linuxbrew-core) 包管理器的使用方式与 Homebrew 一致：`brew install v2ray`

## Docker 安装方式

* V2Ray 为 Linux 平台提供了预编译的 Docker image：[v2fly/v2fly-core](https://hub.docker.com/r/v2fly/v2fly-core)
* GitHub 仓库：[github.com/v2fly/docker](https://github.com/v2fly/docker)

Docker image 的文件结构：

* `/etc/v2ray/config.json`：配置文件
* `/usr/bin/v2ray`：V2Ray 主程序
* `/usr/bin/v2ctl`：V2Ray 辅助工具
* `/usr/local/share/v2ray/geoip.dat`：IP 数据文件
* `/usr/local/share/v2ray/geosite.dat`：域名数据文件
