## V2ray证书获取方法

#### 1. 通过CA获取可信证书
简单获取方式，使用acme.sh脚本
脚本开源地址:https://github.com/acmesh-official/acme.sh/
安装命令，注意，请将`my@example.com`改为你的邮件地址，这个邮件地址不需要收邮件，所以可以是任意的非example.com
```sh
curl https://get.acme.sh | sh -s email=my@example.com
```
或使用wget获取脚本
```sh
wget -O -  https://get.acme.sh | sh -s email=my@example.com
```
如果想要快捷使用，可以在你的`.bashrc`文件中添加`alias acme.sh=~/.acme.sh/acme.sh`
此脚本会自动为你创建 cronjob， 每天 0:00 点自动检测所有的证书，如果快过期了，需要更新，则会自动更新证书。

假设你需要部署V2Ray的服务器没有任何Web服务（80端口空闲）则可以使用一下命令申请证书，将命令中的`example.com`改为你的域名
```sh
acme.sh --issue --standalone -d example.com
```
#### 2. 使用自签名证书
使用
```sh
v2ray tls cert
```
