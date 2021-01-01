# The first step: learn to compile

## Windows

If you are using Windows, just refer to this article: [[Tutorial] Detailed methods for manual compilation and cross-compilation of V2Ray under Windows](https://github.com/v2ray/discussion/issues/756)

## Pre-work

V2Ray uses [Golang](https://golang.org/) as the main programming language. [Bazel](https://bazel.build/) is used as the build tool in the team release process. It is recommended to use macOS or Linux for development. A small amount of scripts may not run properly on Windows.

* Install Golang: [golang.org/doc/install](https://golang.org/doc/install)
* Install Bazel: [docs.bazel.build/install](https://docs.bazel.build/versions/master/install.html) (No need for manual/script compilation)

## Pull V2Ray source code

```bash
go get -u -v v2ray.com/core/...
```

Note that this command cannot be completed normally if Google’s network environment cannot be accessed normally. In case of situation, you need to configure a local HTTP proxy server first, and configure local environment variables, such as

```bash
export http_proxy=http://localhost:1080
export https_proxy=http://localhost:1080
```

go will use the local HTTP proxy on port 1080 to pull the source code.

## Manual construction

```bash
cd $(go env GOPATH)/src/v2ray.com/core/main
env CGO_ENABLED=0 go build -o $HOME/v2ray -ldflags "-s -w"

cd $(go env GOPATH)/src/v2ray.com/core/infra/control/main
env CGO_ENABLED=0 go build -o $HOME/v2ctl -tags confonly -ldflags "-s -w"
```

The above command generates the newly-built `v2ray` and `v2ctl` executable files in the current user's `$HOME` directory, and it can be used normally.

The process of building other CPU architectures and other systems (Windows/macOS) belongs to the cross-compilation process of golang. It mainly controls the two variables of `GOOS` / `GOARCH`. Please refer to the relevant golang documents, and I will not repeat them here.

## Script build

The above manual construction is only the v2ray executable program itself, the distribution package zip also contains other files such as the address library. The release package can be easily produced by using the packaging script.

```bash
wget https://raw.githubusercontent.com/v2ray/v2ray-core/master/release/user-package.sh
chmod 755 user-package.sh
./user-package.sh
```

Execute the above script directly to generate a file similar to `v2ray-custom-linux-amd64-20190710-000000.zip` in the current directory, which is the release package.

You can use some personalized parameters to customize the release package:

* `windows` build a release package for the Windows version
* `darwin` build the release package of darwin (macOS) version
* `tgz` is packaged as `tar.gz`
* `386` is built as a 32-bit program
* `arm` builds release for ARM architecture CPU，arm arm64
* `mips` Same as above, please refer to the cross-compilation document of golang
* `nodat` does not include domain name/IP database `geoip.dat` and `geosite.dat`, which can reduce the size of the release package
* `noconf` does not contain example json, systemd/systemv and other configuration files
* `nosource` Don't execute `go get ...` to avoid overwriting the v2ray source code that has been pulled locally

The above parameters have no order requirements, only need to be passed to the script as needed. Take building a distribution package suitable for Windows 32-bit without address library and sample configuration as an example:

```bash
./user-package.sh windows 386 nodat noconf
```

For v2ray compiled by the script, its startup information will become the time when the user was compiled to distinguish:

```bash
V2Ray 4.20.0 (user) 20190710-010000
A unified platform for anti-censorship.
```

Users can also modify the information in the script and customize their own version.

```bash
CODENAME="user"
BUILDNAME=$NOW
```