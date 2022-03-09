# Installation

## Supported OS Platforms

The following platforms are supported by V2Ray:

* Windows 7 and later（x86 / amd64 / arm32）
* macOS 10.10 Yosemite and later（amd64）
* Linux 2.6.23 and later（x86 / amd64 / arm / arm64 / mips64 / mips / ppc64 / s390x / riscv64）
  * including but not limited to Debian 7 / 8, Ubuntu 12.04 / 14.04 and later, CentOS 6 / 7 and Arch Linux
* FreeBSD (x86 / amd64)
* OpenBSD (x86 / amd64)
* Dragonfly BSD (amd64)

## Download V2Ray

Compiled binary packages can be found via the following links.

1. Github Release: [github.com/v2fly/v2ray-core](https://github.com/v2fly/v2ray-core/releases)
2. Arch Linux: [packages/community/x86_64/v2ray/](https://www.archlinux.org/packages/community/x86_64/v2ray/)

All packages are in the .zip format. Look for the file matching your platform and unzip it to get started.

## Package Integrity

The integrity of V2Ray can be validated in two ways:

1. The SHA1 / SHA256 digest information can be found in the corresponding `.dgst` files.
2. Run `v2ctl verify --sig=Release example-file`

## Windows Installation

- Download and unpack the zip file, you will get an executable `v2ray.exe`.
- Install via [Scoop](https://scoop.sh/) package manager: `scoop install v2ray`
- Install via [Chocolatey](https://chocolatey.org/) package manager: `choco install v2ray`

Then run V2Ray in [command line](command.md).

## macOS Installation

- Download and unpack the zip file, you will get an executable `v2ray`.
- Install via [Homebrew](https://brew.sh/) package manager: `brew install v2ray`w
  - You can continue using [`v2ray/v2ray` Tap](https://github.com/v2ray/homebrew-v2ray), however this is not recommended.

Then run V2Ray in [command line](command.md).

## Linux Distro Repository

Some distros may have included V2Ray to their repositories. It is recommended to use these repositories for better compatibility before using any installation script.

* Debian: [golang-v2ray-core](https://tracker.debian.org/pkg/golang-v2ray-core).

## Installing on Linux by Script

The original installation script is deprecated and replaced by [fhs-install-v2ray](https://github.com/v2fly/fhs-install-v2ray).

Go to [#2328](https://github.com/v2ray/v2ray-core/issues/2328) for related discussions.

What's new?

* Changed Installation Path V2Ray to comply with FHS.
* Stopped supporting stone age platforms, such as CentOS 6.
* Stopped supporting System V.
* Changed the service user from root to nobody.

### FAQ (In Chinese)

* [Install without updating geoip.dat and geosite.dat](https://github.com/v2fly/fhs-install-v2ray/wiki/Do-not-install-or-update-geoip.dat-and-geosite.dat)
* [Insufficient permissions when using certificates](https://github.com/v2fly/fhs-install-v2ray/wiki/Insufficient-permissions-when-using-certificates)
* [Migrate from the old installation script](https://github.com/v2fly/fhs-install-v2ray/wiki/Migrate-from-the-old-script-to-this)
* [Move .dat files from `lib` to `share` directory](https://github.com/v2fly/fhs-install-v2ray/wiki/Move-.dat-files-from-lib-directory-to-share-directory)
* [Use the VLESS Protocol](https://github.com/v2fly/fhs-install-v2ray/wiki/To-use-the-VLESS-protocol)

## Docker

The V2Ray Docker Image is also available:

* [v2fly/v2fly-core](https://hub.docker.com/r/v2fly/v2fly-core): The `latest` tag will be updated following [v2fly](https://github.com/v2fly/docker-fly)'s latest release. Other versions will be released using the version's tag, e.g. `4.27.0`.

The Structure of Docker Image:

* `/etc/v2ray/config.json`: Config File
* `/usr/bin/v2ray/v2ray`: V2Ray Main Process
* `/usr/bin/v2ray/v2ctl`: V2Ctl Commandline Tools
* `/usr/bin/v2ray/geoip.dat`: GeoIP Data
* `/usr/bin/v2ray/geosite.dat`: GeoSite Data
