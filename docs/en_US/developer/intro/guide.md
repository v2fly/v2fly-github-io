# Step 3: Start development

## Basic

### version control

Git

### Branch (Branch)

This project only uses one branch, namely master. All changes are submitted to the master, and make sure that the master is compilable and usable at any time.

### Release

Try to use automated tools to release, such as v2ray-core using GitHub Actions as an automated compilation and release tool.

### Reference other projects

* Golang
  * The product code can only use the golang standard library, that is, the package whose name does not contain any URL;
  * The test code can use golang.org/x/...;
  * If you need to reference other projects, please create an Issue in advance for discussion;
* other
  * As long as the agreement between the two parties is not violated (this project is MIT), and tools that are helpful to the project can be used.

## Development Process

### Before writing code

If you find any problems, or have any ideas about the project, please create an Issue discussion immediately to reduce duplication of work and time spent on the code.

### Modify the code

* Golang
  * Please refer to [Effective Go](https://golang.org/doc/effective_go.html);
  * Please run before every commit: gofmt -w v2ray.com/core/
  * Before each commit, please make sure that the test passes: go test v2ray.com/core/...
  * Before submitting a PR, please ensure that the newly added code has more than 70% code coverage.
* other
  * Please pay attention to the readability of the code

### Pull Request

* Please run `git pull` before submitting the PR to ensure that the merge can proceed smoothly;
* A PR only does one thing. If there are multiple bug fixes, please submit a PR for each bug;
* Due to Golang's special requirements (Package path), the PR process of the Go project is different from other projects:
  1. Fork this project first and create your own github.com/your/v2ray-core;
  1. Run in your Go workspace: `go get -u v2ray.com/core/...`;
  1. Run in the v2ray-core directory created by go get: `git remote add fork https://github.com/you/cooltool.git`;
  1. Then you can modify the code in v2ray-core. Since this is a v2ray clone, the import path will not be affected;
  1. After the modification is completed, run: `git push fork`;
  1. Then go to your fork (that is, v2ray.com/core) and send a PR;
  1. The above content is modified from [this article](http://blog.campoy.cat/2014/03/github-and-go-forking-pull-requests-and.html).

### Modifications to the code

#### Functional issues

Please submit at least one test case (Test Case) to verify the changes to existing functions.

#### Performance related

Please submit the necessary test data to prove the performance defects of the existing code or the performance improvement of the new code.

#### new function

* If the new function does not affect the existing function, please provide a switch (such as flag) that can be turned on/off, and keep the new function closed by default;
* Before developing a large new feature (such as adding a new protocol), please submit an issue first, and then develop it after the discussion.

#### other

As the case may be.

## V2Ray coding standard

The following content applies to Golang code in V2Ray.

### Code structure

```bash
v2ray-core
├── app // application module
│ ├── router // routing
├── common // common code
├── proxy // communication protocol
│ ├── blackhole
│ ├── dokodemo-door
│ ├── freedom
│ ├── socks
│ ├── vmess
├── transport // Transport module
```

### Coding Standards

It is basically the same as the official Golang recommended practice, with some exceptions. I write it here so that everyone is familiar with Golang.

#### name

* Try to use a single English word for file and directory names, such as hello.go;
  * If there is no way, the directory uses a connecting line/file name to connect two (or more words) with an underscore, such as hello-world/hello_again.go;
  * The test code ends with _test.go;
* The type uses Pascal nomenclature, such as ConnectionHandler;
  * Lower case is not mandatory for abbreviations, that is, HTML does not have to be written as Html;
* Public member variables also use Pascal nomenclature;
* Private member variables [small camel nomenclature] (https://zh.wikipedia.org/wiki/%E9%A7%9D%E5%B3%B0%E5%BC%8F%E5%A4%A7%E5%B0%8F%E5%AF%AB), such as `privateAttribute`;
* In order to facilitate refactoring, it is recommended that all methods use Pascal nomenclature;
  * Although Golang distinguishes between public and private methods by case, it is not convenient in practice.
  * Put completely private types into `internal`.

#### Content organization

* A file contains a main type, and its related private functions, etc.;
* Test-related files, such as tools such as Mock, are placed in the testing subdirectory;
