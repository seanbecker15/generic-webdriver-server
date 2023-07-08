# Tunneling to an WebOS Device on Another Network

If your Selenium node runs on a separate network from your WebOS device,
you may need to create a tunnel to that other network.  This document will
explain how to do that with SSH.  We assume general familiarity with SSH and
that your target network has an accessible SSH server already.

The WebOS WebDriver server uses the ares cli to control the device.
(See [how-it-works.md](how-it-works.md) for details.)  This uses port 9922 of
the WebOS device.  So our tunnel will target port 9922.  Here's an example
SSH command for this tunnel:

```sh
ssh my-user@other-network-server -L 9922:webos-device-hostname-or-ip:9922
```

In this example, you would replace `other-network-server` with the SSH server on
the target network, `my-user` with your username on that server, and
`webos-device-hostname-or-ip` with the hostname or IP address of the WebOS
device on that network.  This will allow you access the remote WebOS device
on your workstation.


## Configuring your server with a tunnel

To configure the WebOS device hostname or IP server-side (recommended), use
the following system property:

```sh
java \
  -Dgenericwebdriver.backend.params.hostname=localhost \
  # ...
```

This will direct the WebOS WebDriver server to connect to your workstation's
port 9922, which will tunnel through the SSH connection to the remote device's
port 9922.

See also ["Setting parameters"][] in the ["Setup" doc][] of
[Generic WebDriver Server][].


## Tunneling to multiple WebOS devices using different ports

If you need to tunnel to multiple WebOS devices, you will need to use
different local ports for each tunnel.  If the WebOS devices are all on the
same network, you can still use a single SSH connection for multiple tunnels.
Here's an example SSH command with multiple tunnels:

```sh
ssh my-user@other-network-server \
  -L 9922:webos-A-hostname-or-ip:9922 \
  -L 9923:webos-B-hostname-or-ip:9922 \
  -L 9924:webos-C-hostname-or-ip:9922
```

This will open three ports on your workstation (9922, 9923, 9924), each
tunneled to port 9922 on a different device.  Then you would set up three
Selenium nodes, with each specifying the port number in the backend parameters:

```sh
java \
  -Dgenericwebdriver.backend.params.hostname=localhost:9924 \
  # ...
```


[Generic WebDriver Server]: https://github.com/shaka-project/generic-webdriver-server
["Setting parameters"]: https://github.com/shaka-project/generic-webdriver-server/blob/main/setup.md#setting-parameters
["Setup" doc]: https://github.com/shaka-project/generic-webdriver-server/blob/main/setup.md
