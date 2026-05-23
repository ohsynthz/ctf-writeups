# CTF Writeups

Personal CTF writeup collection. Terminal-themed, monochrome, markdown-based.

Built with Next.js, Drizzle ORM, SQLite, and GitHub OAuth.

## Setup

```bash
npm install
cp .env.example .env.local  # add GitHub OAuth credentials
npm run dev
```

## Stack

- Next.js 16 (App Router)
- Drizzle ORM + better-sqlite3
- NextAuth v5 (GitHub provider)
- shadcn/ui + Tailwind CSS v4

## Routes

| Path | Description |
|------|-------------|
| `/` | Landing page with recent writeups |
| `/writeups` | Searchable, filterable, paginated list |
| `/writeups/[slug]` | Writeup detail |
| `/ctf/[slug]` | Writeups by CTF event |
| `/stats` | Statistics dashboard |
| `/submit` | Upload new writeup (auth required) |
| `/api/feed` | Atom RSS feed |
