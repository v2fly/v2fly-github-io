# FAQ

Weird questions and answers

## General question

### What is the purpose of making V2Ray

People have the right to freely obtain legal information that has been disclosed. At the same time, the people also have the right to freedom of speech.

### Whether to oppose regulation

No objection to regulation. In fact, everything needs to be regulated to reduce the cost of living of the public, such as milk powder. But supervision needs to have laws to follow and evidence to follow. The supervision method recognized by the public is also reasonable and acceptable.

### Who will lead the development of Project V

We are a group of people who love freedom. Due to policy pressure, we tend to remain anonymous and try not to disclose any identity information.

## V2Ray usage related

### How to upgrade V2Ray

* Download the installation package again.
* If you use the installation script to install, just re-run the installation script.

### V2Ray crashes

* If you use Linux and open systemd, you can use `journalctl -u v2ray` to view the log when V2Ray exits.
* Generally, you can manually run `v2ray -config= <config-file> -test` to view the error message.

## V2Ray error message

### VMess: Invalid User

possible reason:

1. The user IDs on the client and server do not match.
1. The user alterId on the client and server do not match.
1. The time of the client and the server do not match, and the error exceeds 90 seconds.

### Shadowsocks: Unknown address type

possible reason:

* The encryption method or password of the Shadowsocks protocol does not match.

### Socks: Unknown Socks version: 67

possible reason:

* You turned on the Socks proxy, but configured an HTTP proxy in your browser.

solution:

* Configure an HTTP inbound proxy in V2Ray, and then point the browser settings to this proxy.

## Other software errors

### When accessing Google, the browser shows an invalid certificate

Wrong information: The attacker may be trying to steal your information from www.google.com (e.g. password, communication content, or credit card information). Learn more NET::ERR_CERT_COMMON_NAME_INVALID

Reason: Your DNS cache may be contaminated.

solution:

* You need to clear the cache and re-crawl DNS data when using a proxy.
* The `sniffing` function can be used in V2Ray to overcome some DNS pollution.

## Project authorization

Project V uses the following methods for authorization.

### V2Ray

The source code is an officially released installation package, licensed under the MIT agreement. Including the source code and installation package in the following code repository:

* [v2fly/v2ray-core](https://www.github.com/v2fly/v2ray-core/)

### Official website

The official website ([v2fly.org](https://www.v2fly.org/)) is under the [Creative Commons Attribution 4.0 International License Agreement](https://creativecommons.org/licenses/by/4.0/deed.zh) Agreement authorization.

* Including all visible text and pictures on the website.
* Include Project V icon files.
* Including the source code used to generate the website, namely [v2fly/v2fly-github-io](https://github.com/v2fly/v2fly-github-io).

### Software screenshots and other files

The copyright of the content created by a third party belongs to its creator. Project V waives ownership of this content.

* Including screenshots of Project V in use.
* Including the configuration files required to run Project V.
* Including the log files generated when Project V is running.

### Other content

The copyright of the content not mentioned above depends on the specific situation.
