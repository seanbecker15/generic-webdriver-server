# WebOS WebDriver Server

A [WebDriver][] server for WebOS devices, implementing the subset of the
WebDriver protocol necessary for [Karma][].  Add WebOS devices to your
[Selenium grid][]!

Part of the [Generic WebDriver Server][] family.


## Supported Models

TBD


## Prerequisites

To use these tools, you will need:
 - WebOS device in Dev Mode
 - Ares CLI


### Dev Mode Setup

1. To put your WebOS device in Dev Mode, use [LG's official docs on dev mode][].

2. Use the ares cli to [connect to your device][].

[LG's official docs on dev mode]: https://webostv.developer.lge.com/develop/getting-started/developer-mode-app
[connect to your device]: https://webostv.developer.lge.com/develop/getting-started/developer-mode-app#connecting-tv-and-pc


## Installation

```sh
npm install --save-dev generic-webdriver-server webos-webdriver-server
```


## Usage

First, please refer to the ["Setup" doc][] for [Generic WebDriver Server][].
That will explain how to set up Selenium to talk to Generic WebDriver Servers,
as well as how to set server parameters.

In the command-line for the Selenium node, set the following Java system
properties:

 - `genericwebdriver.browser.name`: We recommend the value "webos".  See also
   notes in the ["Setup" doc][].
 - `genericwebdriver.backend.exe`: The path to the executable, such as
   `node_modules/.bin/webos-webdriver-server.cmd` or
   `%APPDATA%\npm\webos-webdriver-server.cmd`.
 - `genericwebdriver.backend.params.hostname`: The hostname or IP address of the
   WebOS device with optional port number.  If omitted, this **must** be provided in the client's desired capabilities instead.  (See below.)
 - `genericwebdriver.backend.params.device`: The name of the WebOS device from ares.
   If omitted, this **must** be provided in the client's desired capabilities
   instead.  (See below.)


## Supported parameters

This backend supports the following parameters:

 - `hostname`: **(required)** The hostname or IP address of the WebOS device,
   with optional port number.
 - `device`: **(required)** The WebOS device name configured in ares cli.


## How it works

See [how-it-works.md](https://github.com/shaka-project/generic-webdriver-server/blob/main/backends/webos/how-it-works.md)
for details.


## Tunneling to an WebOS device on another network

See [tunneling.md](https://github.com/shaka-project/generic-webdriver-server/blob/main/backends/webos/tunneling.md)
for details.


## Using the CLI

In addition to running an WebOS node in Selenium, this package offers a CLI
for directing an WebOS device to a specific URL.  For example, if installed
globally with `npm install -g webos-webdriver-server`:

```sh
webos-webdriver-cli.cmd ^
  --hostname=192.168.1.42 --device=mydevice ^
  --url=https://shaka-player-demo.appspot.com/demo/
```


[Generic WebDriver Server]: https://github.com/shaka-project/generic-webdriver-server
[Karma]: https://karma-runner.github.io/
[Selenium grid]: https://www.selenium.dev/documentation/en/grid/
["Setup" doc]: https://github.com/shaka-project/generic-webdriver-server/blob/main/setup.md
[WebDriver]: https://www.w3.org/TR/webdriver2/
