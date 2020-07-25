---
refcn: chapter_00/install
refen: welcome/install
---

# 下载安装

## 平台支持 {#platform}

V2Ray 在以下平台中可用：

* Windows 7 及之后版本（x86 / amd64）；
* macOS 10.10 Yosemite 及之后版本（amd64）；
* Linux 2.6.23 及之后版本（x86 / amd64 / arm / arm64 / mips64 / mips）；
  * 包括但不限于 Debian 7 / 8、Ubuntu 12.04 / 14.04 及后续版本、CentOS 6 / 7、Arch Linux 等；
* FreeBSD (x86 / amd64)；
* OpenBSD (x86 / amd64)；
* Dragonfly BSD (amd64)；

## 下载 V2Ray {#download}

预编译的压缩包可以在如下几个站点找到：

1. Github Release：[github.com/v2ray/v2ray-core](https://github.com/v2ray/v2ray-core/releases)
2. Github 分流：[github.com/v2ray/dist](https://github.com/v2ray/dist/)
3. Homebrew：[github.com/v2ray/homebrew-v2ray](https://github.com/v2ray/homebrew-v2ray)
4. Arch Linux：[packages/community/x86_64/v2ray/](https://www.archlinux.org/packages/community/x86_64/v2ray/)
5. Snapcraft：[snapcraft.io/v2ray-core](https://snapcraft.io/v2ray-core)

压缩包均为 ZIP 格式，找到对应平台的压缩包，下载解压即可使用。

## 验证安装包 {#verify}

V2Ray 提供两种验证方式：

1. 安装包 ZIP 文件的 SHA1 / SHA256 摘要，在每个安装包对应的 `.dgst` 文件中可以找到。
2. 可运行程序（v2ray 或 v2ray.exe）的 GPG 签名，文件位于安装包中的 `v2ray.sig` 或 `v2ray.exe.sig`。签名公钥可以 [在代码库中](https://raw.githubusercontent.com/v2ray/v2ray-core/master/release/verify/official_release.asc) 找到。

## Windows 和 macOS 安装方式

通过上述方式下载的压缩包，解压之后可看到 v2ray 或 v2ray.exe。直接运行即可。

## Linux 发行版仓库 {#linuxrepo}

部分发行版可能已收录 V2Ray 到其官方维护和支持的软件仓库／软件源中。出于兼容性和适配性考虑，建議选用由您所使用的发行版，其维护团队维护的软件包，然后再考虑使用下文的安装脚本，亦或基于已发布的二进制文件或源代码，进行手动安装。

## Linux 安装脚本 {#linuxscript}

原安装脚本已被弃置，由 [fhs-install-v2ray](https://github.com/v2fly/fhs-install-v2ray) 替换。

相关讨论可前往 [#2328](https://github.com/v2ray/v2ray-core/issues/2328)。

主要改动内容：

* 依据 FHS 修改 V2Ray 的安装路径。
* 停止对类似 CentOS 6 等上古发行版版本的支援。
* 停止对 System V 的支援。
* 启动服务由 root 用户替换为 nobody 用户。

迁移方案：

1. 确认该发行版不是上古版本。
2. 确认该发行版使用 systemd：

    ```plain
    # ls -l /sbin/init
    ```

    出现 `/sbin/init -> ../lib/systemd/systemd` 即可。

3. 移除原安装脚本的安装：

    ```plain
    # bash <(curl -L https://install.direct/go.sh) --remove

    # rm -r /var/log/v2ray/
    ```

4. 迁移配置文件路径：

    ```plain
    # mv /etc/v2ray/ /usr/local/etc/
    ```

5. 使用新的安装脚本：

    ```plain
    # bash <(curl https://raw.githubusercontent.com/v2fly/fhs-install-v2ray/master/install-release.sh)
    ```

请将 Log 修改至 `/var/log/v2ray/` 文件夹下：

```json
{
    "log": {
        "access": "/var/log/v2ray/access.log",
        "error": "/var/log/v2ray/error.log"
    }
}
```

如果你需要 V2Ray 直接使用证书文件：

假设证书文件的所在路径为 `/srv/http/`，文件分别为 `/srv/http/example.com.key` 和 `/srv/http/example.com.pem`。

`/srv/http/` 的默认权限一般为 755，`/srv/http/example.com.key` 的默认权限一般为 600，`/srv/http/example.com.pem` 的默认权限一般为 644。

将 `/srv/http/example.com.key` 修改为 644 即可：

```plain
# chmod 644 /srv/http/example.com.key
```

除此之外，还有另一个方法。

```plain
# id nobody
```

显示出来的结果可能是：

```plain
uid=65534(nobody) gid=65534(nogroup) groups=65534(nogroup)
```

也可能是：

```plain
uid=65534(nobody) gid=65534(nobody) groups=65534(nobody)
```

相应的，只需要执行：

```plain
# chown -R nobody:nogroup /srv/http/
```

或是：

```plain
# chown -R nobody:nobody /srv/http/
```

---

原 go.sh 不再推薦使用。

V2Ray 提供了一个在 Linux 中的自动化安装脚本。这个脚本会自动检测有没有安装过 V2Ray，如果没有，则进行完整的安装和配置；如果之前安装过 V2Ray，则只更新 V2Ray 二进制程序而不更新配置。

以下指令假设已在 su 环境下，如果不是，请先运行 sudo su。

运行下面的指令下载并安装 V2Ray。当 yum 或 apt-get 可用的情况下，此脚本会自动安装 unzip 和 daemon。这两个组件是安装 V2Ray 的必要组件。如果你使用的系统不支持 yum 或 apt-get，请自行安装 unzip 和 daemon

```bash
bash <(curl -L -s https://install.direct/go.sh)
```

此脚本会自动安装以下文件：

* `/usr/bin/v2ray/v2ray`：V2Ray 程序；
* `/usr/bin/v2ray/v2ctl`：V2Ray 工具；
* `/etc/v2ray/config.json`：配置文件；
* `/usr/bin/v2ray/geoip.dat`：IP 数据文件；
* `/usr/bin/v2ray/geosite.dat`：域名数据文件。

此脚本会配置自动运行脚本。自动运行脚本会在系统重启之后，自动运行 V2Ray。目前自动运行脚本只支持带有 Systemd 的系统，以及 Debian / Ubuntu 全系列。

运行脚本位于系统的以下位置：

* `/etc/systemd/system/v2ray.service`: Systemd
* `/etc/init.d/v2ray`: SysV

脚本运行完成后，你需要：

1. 编辑 /etc/v2ray/config.json 文件来配置你需要的代理方式；
2. 运行 systemctl start v2ray 来启动 V2Ray 进程；
3. 之后可以使用 systemctl start | stop | restart | enable | disable | status v2ray 控制 V2Ray 的运行。

### go.sh 参数 {#gosh}

go.sh 支持如下参数，可在手动安装时根据实际情况调整：

* `-p` 或 `--proxy`：使用代理服务器来下载 V2Ray 的文件，格式与 curl 接受的参数一致，比如 `"socks5://127.0.0.1:1080"` 或 `"http://127.0.0.1:3128"`。
* `-f` 或 `--force`：强制安装。在默认情况下，如果当前系统中已有最新版本的 V2Ray，go.sh 会在检测之后就退出。如果需要强制重装一遍，则需要指定该参数。
* `--version`：指定需要安装的版本，比如 `"v1.13"`。默认值为最新版本。
* `--local`：使用一个本地文件进行安装。如果你已经下载了某个版本的 V2Ray，则可通过这个参数指定一个文件路径来进行安装。

示例：

* 使用地址为 127.0.0.1:1080 的 SOCKS 代理下载并安装最新版本：```./go.sh -p socks5://127.0.0.1:1080```
* 安装本地的 v1.13 版本：```./go.sh --version v1.13 --local /path/to/v2ray.zip```

## Docker {#docker}

V2Ray 提供了预编译的 Docker image：

* [v2fly/v2ray-core](https://hub.docker.com/r/v2fly/v2fly-core)：其中`latest`标签会跟随[v2fly](https://github.com/v2fly/docker-fly)编译仓库提交保持最新，而各个版本以 tag 方式发布，比如`4.21.3`。

docker image 的文件结构跟 Linux 下安装的路径相同：

* /etc/v2ray/config.json：配置文件
* /usr/bin/v2ray/v2ray：V2Ray 主程序
* /usr/bin/v2ray/v2ctl：V2Ray 辅助工具
* /usr/bin/v2ray/geoip.dat：IP 数据文件
* /usr/bin/v2ray/geosite.dat：域名数据文件
