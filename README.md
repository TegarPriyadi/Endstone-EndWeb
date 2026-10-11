<h1>
  <img src="https://files.catbox.moe/9b3o33.jpg" width="60" align="center">
  Endstone Puglin - EndWeb [v2]
</h1>

[![API Version](https://img.shields.io/badge/API-v2.0.0-purple.svg)](docs/api.md) [![Endstone](https://img.shields.io/badge/endstone-%3E%3D0.11.9-orange.svg)](https://github.com/EndstoneMC/endstone) [![Minecraft Bedrock](https://img.shields.io/badge/bedrock-1.21%20--%201.26.50+-green.svg)](https://minecraft.net/)

A standalone web interface plugin for [Endstone](https://endstone.dev/) Minecraft servers.

EndWeb provides a lightweight HTTP server directly inside the Endstone server, allowing you to create a customizable website for your Minecraft server using standard **HTML, CSS, and JavaScript**.

## Installation

1. Download [end_web.so](https://github.com/TegarPriyadi/Endstone-EndWeb/releases)
2. Copy the plugin into the Endstone plugins directory:

```text
plugins/end_web.so
```

3. Start the Endstone server.
4. EndWeb will automatically create:

```text
plugins/end_web/
```
## With A Fresh Look

<details>
<summary>Spoiler : Home Page</summary>

![EndWeb Dashboard](https://github.com/user-attachments/assets/09de711d-aadf-4e2f-8953-2e6e209a2ffc)

</details>

<details>
<summary>Spoiler : Status Page</summary>

![EndWeb Status](https://github.com/user-attachments/assets/5e10f8be-ac78-41de-b8b0-87c9c0fbe3c3)

</details>

<details>
<summary>Spoiler : Massege Page</summary>

![EndWeb Massege](https://github.com/user-attachments/assets/a48c2427-9569-4789-876a-fb1805064889)

</details>

## Configuration

The default configuration is:

```yaml
setting:
  host: 0.0.0.0
  port: 8080

  save_messages: false

  auto_delete_messages: true
  message_retention_days: 2
```

For example:

```yaml
setting:
  host: 0.0.0.0
  port: 19132
```

The website can then be accessed using:

```text
http://SERVER_IP:19132
```

> Make sure the selected TCP port is allowed by your firewall, Docker configuration, or Pterodactyl allocation.


## Pterodactyl

EndWeb can be used with Endstone servers running inside Pterodactyl.

Make sure the web port is allocated as a **TCP** port.
Do not assume the Minecraft Bedrock port and HTTP port are the same. Bedrock normally uses UDP, while the web server uses TCP.

🚧 **Beta**

EndWebis currently under active development. APIs and internal implementation details may change between releases.
