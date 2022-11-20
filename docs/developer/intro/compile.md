# 第一步：学会编译

## 前序工作

V2Ray 使用 [Golang](https://golang.org/) 作为主要编程语言，团队发布流程上使用 [GitHub Actions](https://github.com/features/actions) 作为构建工具。推荐使用 Linux 或 macOS 进行开发，少量的脚本可能无法在 Windows 上正常运行。

* 安装 Golang: [golang.org/doc/install](https://golang.org/doc/install)（若无法访问，可选择[国内镜像](https://golang.google.cn/doc/install)）

## 多种构建方式

### 拉取 V2Ray 源代码和依赖

```bash
git clone https://github.com/v2fly/v2ray-core.git
cd v2ray-core && go mod download
```

注意：在无法正常访问 Google 的网络环境，依赖无法被正常拉取，需要先设置 `GOPROXY`：

```bash
go env -w GOPROXY=https://goproxy.io,direct
```

### 手工构建

:::tip
本小节的命令需要在 V2Ray 项目根目录内运行。
:::

```bash
CGO_ENABLED=0 go build -o $HOME/v2ray -trimpath -ldflags "-s -w -buildid=" ./main
```

运行以上命令会在当前用户的 `$HOME` 目录下生成刚构建的 `v2ray` 可执行文件，即可正常使用。

构建其他 CPU 架构、其他系统（Windows/macOS）的可执行文件，属于 Golang 的交叉编译流程，主要是控制 `GOOS` / `GOARCH` 两个环境变量，详情请参阅 Golang 相关文档。

下面演示如何构建可运行在 Windows 64 位系统的 `v2ray.exe`、`wv2ray.exe` 可执行文件（非 Windows 系统不需要编译 `wv2ray.exe`）：

```bash
CGO_ENABLED=0 GOOS=windows GOARCH=amd64 go build -o $HOME/v2ray.exe -trimpath -ldflags "-s -w -buildid=" ./main
CGO_ENABLED=0 GOOS=windows GOARCH=amd64 go build -o $HOME/wv2ray.exe -trimpath -ldflags "-s -w -H windowsgui -buildid=" ./main
```

执行 `go tool dist list` 查看所有支持的系统与架构。某些架构还需要控制其它环境变量，如 `arm` 的 `GOARM`，用于设置运行时 CPU 浮点协处理器的版本。

### 脚本构建

以上手工构建的只是 v2ray 可执行程序本身，发行包内还包含了地址库（`geoip.dat`、`geosite.dat`）、配置文件等其他文件。使用打包脚本可方便地制作出适用于多种操作系统、多种 CPU 架构的发布包。

```bash
wget https://raw.githubusercontent.com/v2fly/v2ray-core/master/release/user-package.sh
chmod 755 user-package.sh
./user-package.sh
```

直接执行以上脚本即可在当前目录生成适用于 64 位 linux 操作系统的可执行文件，文件名类似于 `v2ray-custom-linux-amd64-20201008-104530.zip`，即为发布包。

你还可以使用一些个性化参数来定制发布包：

* `windows` 构建 Windows 版本的发布包
* `darwin` 构建 darwin（macOS）版本的发布包
* `tgz` 发布包使用 `tar.gz` 格式
* `386` 构建 32 位可执行文件
* `arm` 构建适用于 arm 架构 CPU 的可执行文件
* `mips` 构建适合于 mips 架构 CPU 的可执行文件，请参阅 Golang 交叉编译文档
* `nodat` 不包含域名/IP 数据库 `geoip.dat`、`geosite.dat`（可以减小发布包的大小）
* `noconf` 不包含范例 JSON、Systemd/Systemv 等配置文件
* `nosource` 不要从远端拉取 V2Ray 源代码（此选项适用于本地已有 V2Ray 源代码的情况。运行脚本前必须先进入到本地 v2ray 代码根目录）

以上参数没有次序要求，只需要按需传给脚本。下面以构建一个适用于 32 位 Windows 操作系统、不带地址库、不带样例配置的发布包为例：

```bash
./user-package.sh windows 386 nodat noconf
```

脚本构建的 v2ray，其启动信息会变成用户编译的时间，以做区分：

```bash
V2Ray 4.30.0 (user) 20201008-104530
A unified platform for anti-censorship.
```

用户还可自定义 `codename`，定制属于自己的版本：

```bash
./user-package.sh windows 386 nodat noconf codename=custom-codename
```
