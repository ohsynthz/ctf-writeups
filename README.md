# CTF Writeups

A personal CTF writeup collection — markdown-based writeups organized by CTF event, challenge, category, and difficulty. Terminal/monochrome aesthetic.

## Features

- Browse, search (debounced), filter, and sort writeups (newest/oldest/hardest)
- Per-CTF event pages with pagination
- Statistics dashboard (categories, difficulties, CTFs) using grouped queries
- Markdown file upload for submitting writeups (with tags support)
- Inline edit all metadata (title, challenge, CTF, category, difficulty, tags, content)
- Delete with confirmation dialog
- Atom RSS feed exposed via `<link rel="alternate">`
- GitHub OAuth (single-user, configurable via `AUTH_ALLOWED_ID`)
- Paginated list views (12 per page)
- Dynamic page titles and metadata
- 404 page, error boundary, loading skeletons
- Debounced search, auth-guarded API routes

## Tech Stack

- **Next.js 16** (App Router, Turbopack)
- **Drizzle ORM** + **Turso** (serverless SQLite)
- **NextAuth v5** (GitHub OAuth provider)
- **@base-ui/react** Dialog components
- **Tailwind CSS v4**
- **react-markdown** with GFM, syntax highlighting

## Getting Started

```bash
npm install
cp .env.example .env.local
# Fill in AUTH_GITHUB_ID, AUTH_GITHUB_SECRET, AUTH_SECRET, AUTH_ALLOWED_ID
# Fill in TURSO_DATABASE_URL and TURSO_AUTH_TOKEN (see Turso setup below)
npx drizzle-kit push   # migrate schema to Turso
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Turso Setup

```bash
curl -sSfL https://get.turso.tech | sh
turso db create ctf-writeups
turso db show ctf-writeups --url          # copy to TURSO_DATABASE_URL
turso db tokens create ctf-writeups       # copy to TURSO_AUTH_TOKEN
```

## Deploy to Vercel

1. Push repo to GitHub
2. Import in Vercel
3. Add all env vars from `.env.example` in Vercel project settings
4. Set build command: `npx drizzle-kit push && next build`
5. Deploy

## Routes

| Route | Description |
|-------|-------------|
| `/` | Landing — hero with recent writeups |
| `/writeups` | Search, filter, sort, paginate |
| `/writeups/[slug]` | Writeup detail + edit/delete |
| `/ctf/[slug]` | Writeups by CTF event (paginated) |
| `/stats` | Category/difficulty/CTF breakdowns |
| `/submit` | Upload markdown (auth required) |
| `/api/feed` | Atom RSS feed |
