# 第一步：学会编译

## Windows

若你正在使用 Windows，只需参考这篇文章：[[Tutorial] Windows 下手动编译、交叉编译 V2Ray 的详细方法](https://github.com/v2ray/discussion/issues/756)

## 前序工作

V2Ray 使用 [Golang](https://golang.org/) 作为主要编程语言。团队发布流程上使用 [Bazel](https://bazel.build/) 作为构建工具。推荐使用 macOS 或 Linux 进行开发，少量的脚本可能无法在 Windows 上正常运行。

* 安装 Golang: [golang.org/doc/install](https://golang.org/doc/install)
* 安装 Bazel: [docs.bazel.build/install](https://docs.bazel.build/versions/master/install.html) （手工/脚本编译方式无需）

## 拉取 V2Ray 源代码

```bash
go get -u -v v2ray.com/core/...
```

注意在无法正常访问 Google 的网络环境，此命令无法正常完成。遇情况，需先配置好一个本地的 HTTP 代理服务器，并配置本地环境变量，比如

```bash
export http_proxy=http://localhost:1080
export https_proxy=http://localhost:1080
```

go 将会使用本地的 1080 端口的 HTTP 代理进行源码拉取。

## 手工构建

```bash
cd $(go env GOPATH)/src/v2ray.com/core/main
env CGO_ENABLED=0 go build -o $HOME/v2ray -ldflags "-s -w"

cd $(go env GOPATH)/src/v2ray.com/core/infra/control/main
env CGO_ENABLED=0 go build -o $HOME/v2ctl -tags confonly -ldflags "-s -w"
```

以上命令在当前用户的 `$HOME` 目录下生成刚新构建的 `v2ray` 、 `v2ctl` 执行文件，即可正常使用。

构建其他 CPU 架构、其他系统（Windows/macOS）的过程属于 golang 的交叉编译流程，主要是控制 `GOOS` / `GOARCH` 两个变量，请参阅 golang 相关文档，本处不再赘述。

## 脚本构建

以上手工构建的只是 v2ray 可执行程序本身，发行包 zip 内还包含了地址库等其他文件。使用打包脚本可方便地制作出的发布包。

```bash
wget https://raw.githubusercontent.com/v2ray/v2ray-core/master/release/user-package.sh
chmod 755 user-package.sh
./user-package.sh
```

以上脚本直接执行即可在当前目录生成类似 `v2ray-custom-linux-amd64-20190710-000000.zip` 的文件，其即为发布包。

你可以使用一些个性化参数来定制发布包：

* `windows` 构建 Windows 版本的发布包
* `darwin` 构建 darwin（macOS）版本的发布包
* `tgz` 最后打包为 `tar.gz` 而不是非 `zip` 格式
* `386` 构建成 32 位程序
* `arm` 构建适合 arm 架构 CPU 的程序，arm arm64
* `mips` 同上，请参阅 golang 的交叉编译文档
* `nodat` 不包含域名/IP数据库 `geoip.dat` 、 `geosite.dat` ， 可以减小发布包的大小
* `noconf` 不包含范例 json, systemd/systemv 等配置文件
* `nosource` 不要执行`go get ...`，避免已拉取至本地的 v2ray 源码被覆盖

以上参数没有次序要求，只需要按需传给脚本。以构建一个适合 Windows 32 位，不带地址库，不带样例配置的发布包为例：

```bash
./user-package.sh windows 386 nodat noconf
```

脚本编译的 v2ray，其启动信息会变成用户编译的时间，以做区分：

```text
V2Ray 4.20.0 (user) 20190710-010000
A unified platform for anti-censorship.
```

用户还可修改脚本内的信息，定制属于自己的版本。

```bash
CODENAME="user"
BUILDNAME=$NOW
```

## 自动构建

bazel 构建工具主要是发布团队使用。

如果只需构建某个特定平台的安装包，如 Linux / AMD64:

```bash
cd $(go env GOPATH)/src/v2ray.com/core
bazel build --action_env=PATH=$PATH --action_env=SPWD=$PWD --action_env=GOPATH=$(go env GOPATH) --action_env=GOCACHE=$(go env GOCACHE) --spawn_strategy local //release:v2ray_linux_amd64_package
#Output: bazel-bin/release/v2ray-linux-64.zip
```

构建所有安装包:

```bash
cd $(go env GOPATH)/src/v2ray.com/core
bazel build --action_env=PATH=$PATH --action_env=SPWD=$PWD --action_env=GOPATH=$(go env GOPATH) --action_env=GOCACHE=$(go env GOCACHE) --spawn_strategy local //release:all
```

## 安装构建完成的安装包

```bash
$GOPATH/src/v2ray.com/core/release/install-release.sh --local <path/to/zip/file>
```
