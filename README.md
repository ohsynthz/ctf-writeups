# CTF Writeups

A personal CTF writeup collection — markdown-based writeups organized by CTF event, challenge, category, and difficulty. Terminal/monochrome aesthetic.

## Features

- Browse, search, filter, and sort writeups
- Per-CTF event pages grouping related challenges
- Statistics dashboard (categories, difficulties, CTFs)
- Markdown file upload for submitting writeups
- Edit and delete existing writeups
- Atom RSS feed for writeup updates
- GitHub OAuth (single-user: ohsynthz)
- Paginated list views
- Dynamic page titles and metadata

## Tech Stack

- **Next.js 16** (App Router, Turbopack)
- **Drizzle ORM** + **better-sqlite3** (local SQLite)
- **NextAuth v5** (GitHub OAuth provider)
- **shadcn/ui** + **Tailwind CSS v4**
- **react-markdown** with GFM, syntax highlighting

## Getting Started

```bash
npm install
cp .env.example .env.local
# Fill in AUTH_GITHUB_ID and AUTH_GITHUB_SECRET
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

| Route | Description |
|-------|-------------|
| `/` | Landing — hero with recent writeups |
| `/writeups` | Search, filter, sort, paginate |
| `/writeups/[slug]` | Writeup detail + edit/delete |
| `/ctf/[slug]` | Writeups by CTF event |
| `/stats` | Category/difficulty/CTF breakdowns |
| `/submit` | Upload markdown (auth required) |
| `/api/feed` | Atom RSS feed |
