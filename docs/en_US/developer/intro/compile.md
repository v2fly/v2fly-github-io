# The first step: learn to compile

## Pre-work

V2Ray uses [Golang](https://golang.org/) as the main programming language, and the team release process uses [GitHub Actions](https://github.com/features/actions) as the build tool. It is recommended to use Linux or macOS for development. A small amount of scripts may not run properly on Windows.

* Install Golang: [golang.org/doc/install](https://golang.org/doc/install) (If you can’t access it, you can choose [Domestic Mirror](https://golang.google.cn/doc/install))

## Multiple build methods

### Pull V2Ray source code and dependencies

```bash
git clone https://github.com/v2fly/v2ray-core.git
cd v2ray-core && go mod download
```

Note: In the network environment where Google cannot be accessed normally, and dependencies cannot be pulled normally, you need to set `GOPROXY` first:

```bash
go env -w GOPROXY=https://goproxy.io,direct
```

### Manual build

:::tip
The commands in this section need to be run in the root directory of the V2Ray project.
:::

```bash
CGO_ENABLED=0 go build -o $HOME/v2ray -trimpath -ldflags "-s -w -buildid=" ./main
CGO_ENABLED=0 go build -o $HOME/v2ctl -trimpath -ldflags "-s -w -buildid=" -tags confonly ./infra/control/main
```

Running the above command will generate the newly-built `v2ray` and `v2ctl` executable files in the current user's `$HOME` directory, which can be used normally.

Building executable files for other CPU architectures and other systems (Windows/macOS) belongs to the cross-compilation process of Golang, which mainly controls the two environment variables `GOOS` / `GOARCH`. For details, please refer to Golang related documents.

The following demonstrates how to build executable files of `v2ray.exe`, `wv2ray.exe`, and `v2ctl.exe` that can run on Windows 64-bit systems (non-Windows systems do not need to compile `wv2ray.exe`):

```bash
CGO_ENABLED=0 GOOS=windows GOARCH=amd64 go build -o $HOME/v2ray.exe -trimpath -ldflags "-s -w -buildid=" ./main
CGO_ENABLED=0 GOOS=windows GOARCH=amd64 go build -o $HOME/wv2ray.exe -trimpath -ldflags "-s -w -H windowsgui -buildid=" ./main
CGO_ENABLED=0 GOOS=windows GOARCH=amd64 go build -o $HOME/v2ctl.exe -trimpath -ldflags "-s -w -buildid=" -tags confonly ./infra/control/main
```

Execute `go tool dist list` to view all supported systems and architectures. Some architectures also need to control other environment variables, such as the `GOARM` of `arm`, which is used to set the version of the CPU floating-point coprocessor at runtime.

### Script build

The above manual construction is only the v2ray executable program itself. The distribution package also contains address libraries (`geoip.dat`, `geosite.dat`), configuration files and other files. Using packaging scripts can easily produce release packages suitable for multiple operating systems and multiple CPU architectures.

```bash
wget https://raw.githubusercontent.com/v2fly/v2ray-core/master/release/user-package.sh
chmod 755 user-package.sh
./user-package.sh
```

Execute the above script directly to generate an executable file suitable for 64-bit linux operating system in the current directory. The file name is similar to `v2ray-custom-linux-amd64-20201008-104530.zip`, which is the release package.

You can also use some personalized parameters to customize the release package:

* `windows` build a release package for the Windows version
* `darwin` build the release package of darwin (macOS) version
* `tgz` release package uses `tar.gz` format
* `386` Build a 32-bit executable
* `arm` build executable file suitable for arm architecture CPU
* `mips` build executable files suitable for mips architecture CPU, please refer to Golang cross-compilation document
* `nodat` does not include domain name/IP database `geoip.dat`, `geosite.dat` (can reduce the size of the release package)
* `noconf` does not include example JSON, Systemd/Systemv and other configuration files
* `nosource` Do not pull the V2Ray source code from the remote end (this option is suitable for the situation where the V2Ray source code is available locally. You must enter the local v2ray code root directory before running the script)

The above parameters have no order requirements, only need to be passed to the script as needed. The following is an example of building a release package suitable for 32-bit Windows operating system, without address library and without sample configuration:

```bash
./user-package.sh windows 386 nodat noconf
```

For the v2ray built by the script, the startup information will become the time when the user was compiled to distinguish:

```bash
V2Ray 4.30.0 (user) 20201008-104530
A unified platform for anti-censorship.
```

Users can also customize the `codename` to customize their own version:

```bash
./user-package.sh windows 386 nodat noconf codename=custom-codename
```
