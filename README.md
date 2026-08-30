<h1>
  <img src="https://github.com/user-attachments/assets/d3ae1b1d-6960-4736-87de-fbee7d6b4052" width="60" align="center">
  Endstone Puglin - EndWeb
</h1>

[![API Version](https://img.shields.io/badge/API-v1.0.0-purple.svg)](docs/api.md) [![Endstone](https://img.shields.io/badge/endstone-%3E%3D0.11.9-orange.svg)](https://github.com/EndstoneMC/endstone) [![Minecraft Bedrock](https://img.shields.io/badge/bedrock-1.21%20--%201.26.40+-green.svg)](https://minecraft.net/)

A standalone web interface plugin for [Endstone](https://endstone.dev/) Minecraft servers.

EndWeb provides a lightweight HTTP server directly inside the Endstone server, allowing you to create a customizable website for your Minecraft server using standard **HTML, CSS, and JavaScript**.

<img width="1919" height="866" alt="image" src="https://github.com/user-attachments/assets/cd123a97-3bbc-4395-9304-b3a2a8da871f" />

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

with:

```text
plugins/end_web/
├── config.yml
└── web/
    ├── index.html
    ├── style.css
    └── script.js
```

## Configuration

The default configuration is:

```yaml
web:
  host: 0.0.0.0
  port: 8080
  extract_resources: true
```

For example:

```yaml
web:
  host: 0.0.0.0
  port: 19132
```

The website can then be accessed using:

```text
http://SERVER_IP:19132
```

> Make sure the selected TCP port is allowed by your firewall, Docker configuration, or Pterodactyl allocation.

## Customizing the Website

After the first server startup, edit:

```text
plugins/end_web/web/index.html
plugins/end_web/web/style.css
plugins/end_web/web/script.js
```

You can completely replace the default website with your own design.
Changes to these files do not require recompiling the plugin.

## Server Status API

EndWeb provides:

```text
GET /api/status
```

Example:

```text
http://SERVER_IP:8080/api/status
```

The API is designed to expose information directly from the running Minecraft server.

Example response:

```json
{
  "online": true,
  "motd": "My Minecraft Server",
  "level_name": "world",
  "port": 19132,
  "players": 2,
  "max_players": 20,
  "minecraft_version": "1.21.x",
  "server_name": "Endstone",
  "server_version": "0.11.x",
  "protocol_version": 898
}
```

### API Data

| Field                 | Description                        |
| --------------------- | ---------------------------------- |
| `online`            | Current server status              |
| `motd`              | Minecraft server MOTD              |
| `level_name`        | Current world/level name           |
| `port`              | Minecraft server port              |
| `players`           | Current online players             |
| `max_players`       | Maximum player slots               |
| `minecraft_version` | Minecraft version                  |
| `server_name`       | Server implementation name         |
| `server_version`    | Endstone server version            |
| `protocol_version`  | Minecraft network protocol version |

The MOTD and server information are intended to come from the running Endstone server rather than being manually entered into `config.yml`.

## Example JavaScript

Your website can request the server status using:

```javascript
fetch("/api/status")
    .then(response => response.json())
    .then(data => {
        document.getElementById("motd").textContent = data.motd;

        document.getElementById("players").textContent =
            `${data.players}/${data.max_players}`;

        document.getElementById("version").textContent =
            data.minecraft_version;

        document.getElementById("port").textContent =
            data.port;
    });
```

Example HTML:

```html
<h1 id="motd">Loading...</h1>

<p>
    Players:
    <span id="players">0/0</span>
</p>

<p>
    Minecraft:
    <span id="version">Loading...</span>
</p>

<p>
    Port:
    <span id="port">Loading...</span>
</p>
```

## Pterodactyl

EndWeb can be used with Endstone servers running inside Pterodactyl.

Make sure the web port is allocated as a **TCP** port.
Do not assume the Minecraft Bedrock port and HTTP port are the same. Bedrock normally uses UDP, while the web server uses TCP.

## Development

The website is intentionally separated from the server logic.

You can develop the frontend by editing:

```text
web/index.html
web/style.css
web/script.js
```

🚧 **Beta**

EndWebis currently under active development. APIs and internal implementation details may change between releases.
