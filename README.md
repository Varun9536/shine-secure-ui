# Shine Secure Web

Standalone Next.js frontend for Shine Secure.

## Run Locally

Install dependencies:

```powershell
npm install
```

Run the frontend:

```powershell
npm run dev
```

Open:

```txt
http://localhost:3000
```

## Environment

Copy `.env.example` to `.env.local` and replace values as needed.

Important local value:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Scripts

```powershell
npm run dev
npm run typecheck
npm run build
npm run start
```
