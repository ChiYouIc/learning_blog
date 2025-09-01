---
title: v2ray 部署
short_title: ''
date: 2025-08-28 03:09:58
article: true
timeline: false
isOriginal: true
---


<!-- more -->




# v2ray 部署

1. 配置合适的代理协议（VMess / VLess / Shadowsocks / Trojan）；
2. 使用 Websocket + TSL + Nginx 做域名的掩护，并在 Nginx 上部署一个网页，将流量伪装成网页的访问流量；
3. 使用 CDN 代理，将服务器 IP 隐藏，降低 IP 被封的风险。

## 代理协议的作用

V2ray 支持的代理协议有 VMess / VLess / Shadowsocks / Trojan，他们的作用：

- 用户认证

  - VMess / VLess 都带有 **UUID 认证**，保证只有授权客户端可以使用服务端。
  - Shadowsocks 通过 **密码/加密方式**做简单认证。
  - Trojan 通过 **TLS + 密码**做认证。
  - **作用**：即便流量被拦截，没有正确的协议认证，服务端不会响应，防止滥用。
- 流量封装和加密

  - 虽然 TLS 已经加密，但协议本身可以：

    - 对流量做混淆（VMess/VMess+TLS）
    - 防止中间人攻击（Trojan/VMess/VLess）
  - **作用**：增加安全层次，确保协议本身不被篡改。

- 特性

  - VMess/VLess 支持

    - 多路复用
    - 连接重用
    - 传输优化（分流、路由规则）
  - Shadowsocks 主要是加密 + 轻量代理。
  - Trojan 完全伪装成 HTTPS，但需要正确协议交互。
  - **作用**：提供代理逻辑和功能，TLS 只是底层加密，不能替代协议本身的功能。

## 安装 v2ray

```bash
sudo apt-get v2ray

# 安装输出
[Unit]
Description=V2Ray Service
Documentation=https://www.v2fly.org/
After=network.target nss-lookup.target

[Service]
User=nobody
CapabilityBoundingSet=CAP_NET_ADMIN CAP_NET_BIND_SERVICE
AmbientCapabilities=CAP_NET_ADMIN CAP_NET_BIND_SERVICE
NoNewPrivileges=true
ExecStart=/usr/local/bin/v2ray run -config /usr/local/etc/v2ray/config.json # 配置文件
Restart=on-failure
RestartPreventExitStatus=23

[Install]
WantedBy=multi-user.target

# /etc/systemd/system/v2ray.service.d/10-donot_touch_single_conf.conf
# In case you have a good reason to do so, duplicate this file in the same directory and make your customizes there.
# Or all changes you made will be lost!  # Refer: https://www.freedesktop.org/software/systemd/man/systemd.unit.html
[Service]
ExecStart=
ExecStart=/usr/local/bin/v2ray run -config /usr/local/etc/v2ray/config.json

installed: /usr/local/bin/v2ray
installed: /usr/local/share/v2ray/geoip.dat
installed: /usr/local/share/v2ray/geosite.dat
installed: /usr/local/etc/v2ray/config.json
installed: /var/log/v2ray/
installed: /var/log/v2ray/access.log
installed: /var/log/v2ray/error.log
installed: /etc/systemd/system/v2ray.service
installed: /etc/systemd/system/v2ray@.service
removed: /tmp/tmp.dBzz5uStdu
info: V2Ray v5.38.0 is installed.
You may need to execute a command to remove dependent software: apt purge curl unzip
Please execute the command: systemctl enable v2ray; systemctl start v2ray
```

## 配置文件 config.json

配置文件路径 `/usr/local/etc/v2ray/config.json`​

```json
{
  "inbounds": [ // 入口
    {
      "port": 10086,		// 接口
      "protocol": "vmess",	// 协议
      "settings": {
        "clients": [
          {
            "id": "73cad282-900d-4d4e-a31d-269c1896de13", // 必要的id
            "alterId": 0
          }
        ]
      },
      "streamSettings": {
        "network": "tcp" // 协议
      }
    }
  ],
  "outbounds": [ // 出口
    {
      "protocol": "freedom",
      "settings": {}
    }
  ]
}
```

uuid 使用命令

```bash
cat /proc/sys/kernel/random/uuid
```

## 增强配置

### TSL + Websocket + Nginx + VMess(TCP)

这个方案的优点是可隐藏端口、IP，抗封能力较强，但是延迟略高。

```bash
# 安装 nginx 
sudo apt-get install nginx

# 配置文件目录
cd /etc/nginx
```

#### nginx 配置

在 `/etc/nginx/sites-available` 目录中创建一个配置文件 `blog.hetengyue.site.conf`，并将文件软链到 `/etc/nginx/sites-available`​

```nginx
server {
    listen 443 ssl http2;
    server_name blog.hetengyue.site;
	
	# 证书
    ssl_certificate      /root/blog.hetengyue.site_nginx/blog.hetengyue.site_bundle.crt;
    ssl_certificate_key  /root/blog.hetengyue.site_nginx/blog.hetengyue.site.key;
    ssl_session_timeout 5m;
    #请按照以下协议配置
    ssl_protocols TLSv1.2 TLSv1.3;
    #请按照以下套件配置，配置加密套件，写法遵循 openssl 标准。
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE;
    ssl_prefer_server_ciphers on;

    location /msg {
        proxy_redirect off;
        proxy_pass http://127.0.0.1:10000;   # 转发到 V2Ray

        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }

	location /ss {
        proxy_redirect off;
        proxy_pass http://127.0.0.1:10000;   # 转发到 V2Ray

        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}

# 强制使用 https
server {
    listen 80;
    server_name blog.hetengyue.site;
    return 301 https://$host$request_uri;
}
```

#### v2ray 配置文件

```json
{
  "inbounds": [
    {
      "port": 10000, 			// 本地监听端口（Nginx 转发到这里）
      "listen": "127.0.0.1", 	// 只允许本机访问
      "protocol": "vmess",		// vmess协议
      "settings": {
        "clients": [
          {
            "id": "73cad282-900d-4d4e-a31d-269c1896de13",	// 用 `uuidgen` 生成
            "alterId": 0
          }
        ]
      },
      "streamSettings": {
        "network": "ws",	// WebSocket
        "wsSettings": {
           "path": "/msg" 	// 与 nginx 转发路径保持一致
        }
      }
    },
	{
      "port": 10000, 			// 本地监听端口（Nginx 转发到这里）
      "listen": "127.0.0.1", 	// 只允许本机访问
      "protocol": "shadowsocks",// shadowsocks
      "settings": {
        "method": "aes-256-gcm",
		"password": "73cad282-900d-4d4e-a31d-269c1896de13"
      },
      "streamSettings": {
        "network": "ws",	// WebSocket
        "wsSettings": {
           "path": "/ss" 	// 与 nginx 转发路径保持一致
        }
      }
    }
  ],
  "outbounds": [
    {
      "protocol": "freedom",
      "settings": {}
    }
  ]
}
```

#### 配置 CDN

将域名托管至 Cloudflare，并开启 CND 代理，这是为了隐藏真实 IP。

- 将域名的 DNS 解析服务修改到 Cloudflare

  - demi.ns.cloudflare.com
  - vin.ns.cloudflare.com

  ![image](assets/image-20250829181010-sg87xza.png)
- 到 Cloudflare 中添加 DNS 解析记录

  ![image](assets/image-20250829181224-7i6nxh4.png)
- 开启 SSL/TLS

  ![image](assets/image-20250829181314-ceqiyw1.png)
- 配置缓存策略

  配置缓存时，不要缓存 v2ray 的转发路由

  ![image](assets/image-20250829181359-udd51fk.png)

### mKCP + VMess(UDP)

mKCP + VMess 是建立在 UDP 之上，相比 TCP 方案，虽然丢包率增加了，但高速、低延迟，特别适合流媒体。

```json
{
  "inbounds": [
    {
      "port": 端口号,
      "protocol": "vmess",
      "settings": {
        "clients": [
          {
            "id": "你的UUID",
            "alterId": 0,
            "security": "auto"
          }
        ]
      },
      "streamSettings": {
        "network": "kcp",
        "kcpSettings": {
          "mtu": 1350,
          "tti": 50,
          "uplinkCapacity": 12,
          "downlinkCapacity": 100,
          "congestion": false,
          "header": {
            "type": "utp"
          }
        }
      }
    }
  ],
  "outbounds": [
    { "protocol": "freedom", "settings": {} }
  ]
}
```

- [ ] ### QUIC + VMess (UDP)

‍
