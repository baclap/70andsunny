# 70 & Sunny Coffee Co. Marketing Website

A marketing website for 70 & Sunny Coffee Co. built with Next.js and Tailwind CSS.

Site copy and SEO content live directly in code under `src/lib/site.ts`.
The homepage menu is server-rendered from Square menu categories, with a small
local item override layer so names and prices stay current without a CMS.

```bash
npm run dev
```

## Environment

Server-only Square credentials live in local/Vercel env vars.

For local development, put them in `.env` (or `.env.local` if you prefer):

```bash
SQUARE_ACCESS_TOKEN=...
SQUARE_LOCATION_ID=...
SQUARE_ENVIRONMENT=production
```

Use `.env.example` as the shape reference. Do not expose any Square secret via
`NEXT_PUBLIC_*`.

## Checks

```bash
npm test
npm run build
```
