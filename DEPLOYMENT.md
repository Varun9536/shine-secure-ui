# Web Deployment

This is a standalone Next.js project.

## Production Build

```powershell
npm install
npm run build
npm run start
```

## Required Environment

Create `.env.local` from `.env.example`.

```env
NEXT_PUBLIC_API_URL=https://your-domain.com/api
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_META_PIXEL_ID=
```

## Nginx Reverse Proxy Example

```nginx
location / {
  proxy_pass http://127.0.0.1:3100;
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto $scheme;
}
```

## Docker Compose Deployment

From this `web` folder on the VPS:

```bash
cp .env.example .env.local
nano .env.local
docker compose --env-file .env.local up -d --build
docker compose logs -f --tail=100
```

This binds the web app to `127.0.0.1:3100` on the VPS.

Important: `NEXT_PUBLIC_*` values are used during `next build`, so rebuild after changing `.env.local`.
