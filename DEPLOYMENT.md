# Shine Secure Web Deployment

This is the Next.js frontend. It runs behind Nginx on:

```text
https://shinesecure.varunkumar.online
```

The frontend calls the deployed API at:

```text
https://shinesecureapi.varunkumar.online/api
```

## DNS

In Cloudflare for `varunkumar.online`, create:

```text
Type: A
Name: shinesecure
Content: your-vps-public-ip
Proxy status: DNS only until SSL works, then Proxied if you use Cloudflare
TTL: Auto
```

## Deploy From GitHub

On the VPS:

```bash
cd /var/www
git clone YOUR_GITHUB_REPO_URL shine_secure_web
cd shine_secure_web
```

If the code is already downloaded:

```bash
cd /var/www/shine_secure_web
git pull
```

## Environment

Create `.env`:

```bash
cp .env.example .env
nano .env
```

Use:

```env
NEXT_PUBLIC_API_URL=https://shinesecureapi.varunkumar.online/api
NEXT_PUBLIC_SITE_URL=https://shinesecure.varunkumar.online
NEXT_PUBLIC_INSTAGRAM_URL=https://www.instagram.com/shine_secure?igsh=MTVidHV3ZTJmbHFuMQ%3D%3D
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_META_PIXEL_ID=
```

Important: `NEXT_PUBLIC_*` values are embedded during `next build`, so rebuild after changing `.env`.

## Start The Frontend

```bash
docker compose up -d --build
docker compose ps
docker compose logs -f --tail=100
```

The compose file maps:

```text
VPS localhost:3100 -> container:3000
```

This does not conflict with existing containers on ports `3000` and `3001` because this frontend is bound only to VPS localhost port `3100`.

## Nginx Reverse Proxy

Create `/etc/nginx/sites-available/shine-secure-web`:

```nginx
server {
  server_name shinesecure.varunkumar.online;

  location / {
    proxy_pass http://127.0.0.1:3100;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

Enable and reload:

```bash
sudo ln -s /etc/nginx/sites-available/shine-secure-web /etc/nginx/sites-enabled/shine-secure-web
sudo nginx -t
sudo systemctl reload nginx
```

Install SSL:

```bash
sudo certbot --nginx -d shinesecure.varunkumar.online
```

## Verify

```bash
curl -I http://127.0.0.1:3100
curl -I https://shinesecure.varunkumar.online
```

## Future Updates

```bash
cd /var/www/shine_secure_web
git pull
docker compose up -d --build
docker compose logs -f --tail=100
```
