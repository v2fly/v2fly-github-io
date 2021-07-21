# 第三步：开始开发

## 基本

### 版本控制

Git

### 分支（Branch）

本项目只使用一个分支，即 master 。所有更改全部提交进 master，并确保 master 在任一时刻都是可编译可使用的。

### 发布（Release）

尽量使用自动化工具发布，比如 v2ray-core 使用 GitHub Actions 作为自动编译和发布工具。

### 引用其它项目

* Golang
  * 产品代码建议使用 Golang 标准库和 `golang.org/x/` 下的库；
  * 如需引用其它项目，请事先创建 issue 讨论；
* 其它
  * 只要不违反双方的协议（本项目为 MIT），且对项目有帮助的工具，都可以使用。

## 开发流程

### 写代码之前

发现任何问题，或对项目有任何想法，请创建 Issue 讨论以减少重复劳动和消耗在代码上的时间。

### 修改代码

* Golang
  * 请参考 [Effective Go](https://golang.org/doc/effective_go.html)；
  * 每一次 push 之前，请在项目根目录运行：`go generate format.go`；
  * 每一次 push 之前，请确保测试通过：`go test ./...`；
  * 若修改了 proto 文件，则需要重新生成 `pb.go` 文件，请在项目根目录运行：`go generate proto.go`；
  * 提交 pull request 之前，请确保新增代码有超过 70% 的代码覆盖率（code coverage）；
* 其它
  * 请注意代码的可读性。

### Pull Request

* 提交 PR 之前，请先运行 `git pull https://github.com/v2fly/v2ray-core.git` 以确保 merge 可顺利进行；
* 一个 PR 只做一件事，如有对多个 bug 的修复，请对每一个 bug 提交一个 PR；
* 由于 Golang 的特殊需求（Package path），Go 项目的 PR 流程和其它项目有所不同：
  1. 先 Fork 本项目，创建自己的 `github.com/your/v2ray-core` 仓库；
  2. 克隆自己的 v2ray 仓库到本地：`git clone https://github.com/your/v2ray-core.git`；
  3. 基于 `master` 分支创建新的分支；
  4. 在自行创建的分支上作修改并提交修改(commit)；
  5. 在推送(push)修改完成的分支到自己的仓库前，先切换到 `master` 分支，运行 `git pull https://github.com/v2fly/v2ray-core.git` 拉取最新的远端代码；
  6. 如果上一步拉取得到了新的远端代码，则切换到之前自己创建的分支，运行 `git rebase master` 执行分支合并操作。如遇到文件冲突，则需要解决冲突；
  7. 上一步处理完毕后，就可以把自己创建的分支推送到自己的仓库：`git push -u origin your-branch`
  8. 最后，把自己仓库的新推送的分支往 `v2fly/v2ray-core` 的 `master` 分支发 PR 即可；
  9. 请在 PR 的标题和正文中，完整表述此次 PR 解决的问题 / 新增的功能 / 代码所做的修改的用意等；
  10. 耐心等待开发者的回应。

### 对代码的修改

#### 功能性问题

请提交至少一个测试用例（Test Case）来验证对现有功能的改动。

#### 性能相关

请提交必要的测试数据来证明现有代码的性能缺陷，或是新增代码的性能提升。

#### 新功能

* 如果新增功能对已有功能不影响，请提供可以开启/关闭的开关（如 flag），并使新功能保持默认关闭的状态；
* 大型新功能（比如增加一个新的协议）开发之前，请先提交一个 issue，讨论完毕之后再进行开发。

#### 其它

视具体情况而定。

## V2Ray 编码规范

以下内容适用于 V2Ray 中的 Golang 代码。

### 代码结构

```bash
v2ray-core
├── app        // 应用模块
│   ├── router // 路由
├── common     // 公用代码
├── proxy      // 通讯协议
│   ├── blackhole
│   ├── dokodemo-door
│   ├── freedom
│   ├── socks
│   ├── vmess
├── transport  // 传输模块
```

### 编码规范

基本与 Golang 官方所推荐做法一致，有一些例外。写在这里以方便大家熟悉 Golang。

#### 命名

* 文件和目录名尽量使用单个英文单词，比如 hello.go；
  * 如果实在没办法，则目录使用连接线／文件名使用下划线连接两个（或多个单词），比如 hello-world/hello_again.go；
  * 测试代码使用 _test.go 结尾；
* 类型使用 Pascal 命名法，比如 ConnectionHandler；
  * 对缩写不强制小写，即 HTML 不必写成 Html；
* 公开成员变量也使用 Pascal 命名法；
* 私有成员变量使用 [小驼峰式命名法](https://zh.wikipedia.org/wiki/%E9%A7%9D%E5%B3%B0%E5%BC%8F%E5%A4%A7%E5%B0%8F%E5%AF%AB) ，如 `privateAttribute` ；
* 为了方便重构，方法建议全部使用 Pascal 命名法；
  * 完全私有的类型放入 `internal` 。

#### 内容组织

* 一个文件包含一个主要类型，及其相关的私有函数等；
* 测试相关的文件，如 Mock 等工具类，放入 testing 子目录。
