import Link from "next/link";
import { db } from "@/db";
import { writeups } from "@/db/schema";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

const BAR = "\u2588";
const BAR_EMPTY = "\u2591";

function asciiBar(value: number, max: number, width = 20): string {
  const filled = max === 0 ? 0 : Math.round((value / max) * width);
  return BAR.repeat(filled) + BAR_EMPTY.repeat(Math.max(0, width - filled));
}

export default async function StatsPage() {
  const total = await db.select({ count: sql<number>`count(*)` }).from(writeups);
  const totalCount = total[0]?.count ?? 0;

  const totalChars = await db
    .select({ sum: sql<number>`coalesce(sum(length(content)), 0)` })
    .from(writeups);
  const charsWritten = totalChars[0]?.sum ?? 0;

  const dates = await db
    .select({ createdAt: writeups.createdAt })
    .from(writeups)
    .orderBy(sql`created_at asc`);

  const firstDate = dates[0]?.createdAt ?? null;
  const lastDate = dates[dates.length - 1]?.createdAt ?? null;

  const monthlyMap = new Map<string, number>();
  for (const d of dates) {
    const key = d.createdAt.slice(0, 7);
    monthlyMap.set(key, (monthlyMap.get(key) ?? 0) + 1);
  }
  const monthlyRows = [...monthlyMap.entries()].sort(([a], [b]) => a.localeCompare(b));
  const maxMonthly = Math.max(...monthlyRows.map(([, c]) => c), 1);

  const avgDifficultyScore = await db
    .select({
      avg: sql<number>`coalesce(avg(CASE difficulty WHEN 'easy' THEN 1 WHEN 'medium' THEN 2 WHEN 'hard' THEN 3 WHEN 'insane' THEN 4 END), 0)`,
    })
    .from(writeups);
  const avgDiff = avgDifficultyScore[0]?.avg ?? 0;

  const categoryRows = await db
    .select({ category: writeups.category, count: sql<number>`count(*)` })
    .from(writeups)
    .groupBy(writeups.category)
    .orderBy(sql`count(*) desc`);
  const maxCat = Math.max(...categoryRows.map((r) => r.count), 1);

  const difficultyRows = await db
    .select({ difficulty: writeups.difficulty, count: sql<number>`count(*)` })
    .from(writeups)
    .groupBy(writeups.difficulty)
    .orderBy(sql`CASE difficulty WHEN 'easy' THEN 0 WHEN 'medium' THEN 1 WHEN 'hard' THEN 2 WHEN 'insane' THEN 3 END`);
  const maxDiff = Math.max(...difficultyRows.map((r) => r.count), 1);

  const ctfRows = await db
    .select({ ctf: writeups.ctf, count: sql<number>`count(*)` })
    .from(writeups)
    .groupBy(writeups.ctf)
    .orderBy(sql`count(*) desc`);

  const diffLabel =
    avgDiff < 1.5 ? "easy" : avgDiff < 2.5 ? "medium" : avgDiff < 3.5 ? "hard" : "insane";

  const mostActive = monthlyRows.reduce(
    (best, [m, c]) => (c > (best?.count ?? 0) ? { month: m, count: c } : best),
    null as { month: string; count: number } | null,
  );

  return (
    <div>
      <h1 className="mb-6 border-b border-border pb-2 text-sm font-normal">
        <span className="text-primary">$</span> du -sh writeups/
      </h1>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">total</p>
          <p className="mt-1 text-lg text-foreground">{totalCount}</p>
        </div>
        <div className="border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">avg difficulty</p>
          <p className="mt-1 text-lg text-foreground">{diffLabel}</p>
          <p className="text-xs text-muted-foreground">({avgDiff.toFixed(2)} / 4)</p>
        </div>
        <div className="border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">chars written</p>
          <p className="mt-1 text-lg text-foreground">{charsWritten.toLocaleString()}</p>
        </div>
        <div className="border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">ctfs</p>
          <p className="mt-1 text-lg text-foreground">{ctfRows.length}</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="mb-3 text-xs text-muted-foreground">$ cat categories/</h2>
        {categoryRows.length === 0 ? (
          <p className="text-xs text-muted-foreground">no categories yet</p>
        ) : (
          <div className="space-y-2">
            {categoryRows.map(({ category, count }) => (
              <Link
                key={category}
                href={`/writeups?category=${category}`}
                className="flex items-center gap-3 hover:opacity-80 transition-none"
              >
                <span className="w-20 shrink-0 text-right text-xs text-muted-foreground">[{category}]</span>
                <span className="text-xs text-foreground">{asciiBar(count, maxCat)}</span>
                <span className="w-8 shrink-0 text-xs text-muted-foreground">{count}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="mb-8">
        <h2 className="mb-3 text-xs text-muted-foreground">$ cat difficulties/</h2>
        {difficultyRows.length === 0 ? (
          <p className="text-xs text-muted-foreground">no difficulties yet</p>
        ) : (
          <div className="space-y-2">
            {difficultyRows.map(({ difficulty, count }) => (
              <div key={difficulty} className="flex items-center gap-3">
                <span className="w-20 shrink-0 text-right text-xs text-muted-foreground">[{difficulty}]</span>
                <span className="text-xs text-foreground">{asciiBar(count, maxDiff)}</span>
                <span className="w-8 shrink-0 text-xs text-muted-foreground">{count}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mb-8">
        <h2 className="mb-3 text-xs text-muted-foreground">$ cat timeline/</h2>
        {monthlyRows.length === 0 ? (
          <p className="text-xs text-muted-foreground">no data yet</p>
        ) : (
          <div className="space-y-1">
            {monthlyRows.map(([month, count]) => (
              <div key={month} className="flex items-center gap-3">
                <span className="w-16 shrink-0 text-right text-xs text-muted-foreground">{month}</span>
                <span className="text-xs text-foreground">{asciiBar(count, maxMonthly)}</span>
                <span className="w-8 shrink-0 text-xs text-muted-foreground">{count}</span>
              </div>
            ))}
          </div>
        )}
        {mostActive && (
          <p className="mt-2 text-xs text-muted-foreground">
            most active month: {mostActive.month} ({mostActive.count} writeups)
          </p>
        )}
        {firstDate && lastDate && (
          <p className="text-xs text-muted-foreground">
            active: {new Date(firstDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
            {" \u2014 "}
            {new Date(lastDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
          </p>
        )}
      </div>

      <div>
        <h2 className="mb-3 text-xs text-muted-foreground">$ cat ctfs/</h2>
        <div className="flex flex-wrap gap-2">
          {ctfRows.length === 0 ? (
            <p className="text-xs text-muted-foreground">no ctfs yet</p>
          ) : (
            ctfRows.map(({ ctf, count }) => (
              <Link
                key={ctf}
                href={`/ctf/${ctf.toLowerCase().replace(/\s+/g, "-")}`}
                className="border border-border bg-card px-3 py-1.5 text-xs hover:border-primary transition-none"
              >
                <span>{ctf}</span>
                <span className="ml-2 text-muted-foreground">{count}</span>
              </Link>
            ))
          )}
        </div>
        {ctfRows.length > 0 && (
          <p className="mt-2 text-xs text-muted-foreground">
            avg {totalCount > 0 ? (totalCount / ctfRows.length).toFixed(1) : "0"} challenges per CTF
          </p>
        )}
      </div>
    </div>
  );
}
