# How WebOS WebDriver Server Works

The WebOS WebDriver server is composed of two parts:

1. A container application (see [app-template/](app-template/))
2. [Ares CLI][] (local copy required)


## The Container App

The WebOS WebDriver server's container app hosts an iframe which will display
any URL at the client's request.  When the client requests a URL to be loaded,
an [app template](app-template/) is built into a complete app containing the
requested URL.  The app is then installed on the WebOS device and launched.

When the WebDriver client closes the session, the WebOS WebDriver server uses
[Ares CLI][] to uninstall the app, which also shuts it down if it's running.


## Ares CLI

[Ares CLI][] is required to build the container app.


[Ares CLI]: https://webostv.developer.lge.com/develop/tools/cli-installation

