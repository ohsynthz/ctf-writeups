```
  ___ _____ ___     _   _ _ _ _   _   _____ _   _ _____ ___  ___  _   _
 / __|_   _| __|   | | | | | | | | | |_   _| | | |_   _/ _ \| _ \| | | |
| |    | | | _|    | |_| | | | | | |_| | | | | |_| | | | (_) |   /| |_| |
| |    | | |___|  |  _  |_|_|_|  \___/  |_|  \___/  |_| \___/|_|_\ \___/
|_|    |_|          |_|

ohsynthz@root:~/ctf-writeups$
```

A terminal-themed, monochrome CTF writeup collection. Writeups stored as markdown, browsable like a filesystem.

![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=flat-square&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-gray?style=flat-square&logo=tailwindcss)
![SQLite](https://img.shields.io/badge/SQLite-better--sqlite3-white?style=flat-square&logo=sqlite)
![Auth](https://img.shields.io/badge/Auth-NextAuth_v5-lightgray?style=flat-square)

---

## $ cat SETUP.md

```bash
npm install
cp .env.example .env.local    # add GitHub OAuth credentials
npm run dev                    # starts on http://localhost:3000
```

## $ ls stack/

| Component | Choice |
|-----------|--------|
| Framework | Next.js 16 (App Router) |
| Database | SQLite via better-sqlite3 + Drizzle ORM |
| Auth | NextAuth v5 (GitHub provider, single-user) |
| UI | shadcn/ui + Tailwind CSS v4 |
| Styling | Monochrome terminal theme |

## $ find routes -type f

| Route | Description |
|-------|-------------|
| `/` | Landing — hero + recent writeups |
| `/writeups` | Searchable, filterable, paginated, sortable |
| `/writeups/[slug]` | Writeup detail with edit/delete |
| `/ctf/[slug]` | Challenges grouped by CTF event |
| `/stats` | Statistics dashboard |
| `/submit` | Upload new writeup (auth: ohsynthz only) |
| `/api/feed` | Atom RSS feed |

---

```
ohsynthz@root:~/ctf-writeups$ _
```
