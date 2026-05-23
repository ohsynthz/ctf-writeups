import Link from "next/link";
import { db } from "@/db";
import { writeups } from "@/db/schema";
import { sql } from "drizzle-orm";
import { CATEGORIES, DIFFICULTIES, categoryColor } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function StatsPage() {
  const total = await db.select({ count: sql<number>`count(*)` }).from(writeups);
  const totalCount = total[0]?.count ?? 0;

  const categoryRows = await Promise.all(
    CATEGORIES.map(async (cat) => {
      const r = await db
        .select({ count: sql<number>`count(*)` })
        .from(writeups)
        .where(sql`category = ${cat}`);
      return { category: cat, count: r[0]?.count ?? 0 };
    }),
  );

  const difficultyRows = await Promise.all(
    DIFFICULTIES.map(async (d) => {
      const r = await db
        .select({ count: sql<number>`count(*)` })
        .from(writeups)
        .where(sql`difficulty = ${d}`);
      return { difficulty: d, count: r[0]?.count ?? 0 };
    }),
  );

  const ctfRows = await db
    .select({ ctf: writeups.ctf, count: sql<number>`count(*)` })
    .from(writeups)
    .groupBy(writeups.ctf)
    .orderBy(sql`count(*) desc`);

  return (
    <div>
      <h1 className="mb-6 border-b border-border pb-2 text-sm font-normal">
        <span className="text-primary">$</span> du -sh writeups/
      </h1>

      <div className="mb-8 border border-border bg-card p-4">
        <p className="text-xs text-muted-foreground">
          total writeups: <span className="text-foreground">{totalCount}</span>
        </p>
      </div>

      <div className="mb-8">
        <h2 className="mb-3 text-xs text-muted-foreground">$ ls categories/ | wc -l</h2>
        <div className="flex flex-wrap gap-2">
          {categoryRows.map(({ category, count }) => (
            <Link
              key={category}
              href={`/writeups?category=${category}`}
              className="border border-border bg-card px-3 py-1.5 text-xs hover:border-primary transition-none"
            >
              <span>[{category}]</span>
              <span className="ml-2 text-muted-foreground">{count}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="mb-3 text-xs text-muted-foreground">$ ls difficulties/</h2>
        <div className="flex flex-wrap gap-2">
          {difficultyRows.map(({ difficulty, count }) => (
            <div
              key={difficulty}
              className="border border-border bg-card px-3 py-1.5 text-xs"
            >
              <span>[{difficulty}]</span>
              <span className="ml-2 text-muted-foreground">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-xs text-muted-foreground">$ ls ctf/</h2>
        <div className="flex flex-wrap gap-2">
          {ctfRows.map(({ ctf, count }) => (
            <Link
              key={ctf}
              href={`/ctf/${ctf.toLowerCase().replace(/\s+/g, "-")}`}
              className="border border-border bg-card px-3 py-1.5 text-xs hover:border-primary transition-none"
            >
              <span>{ctf}</span>
              <span className="ml-2 text-muted-foreground">{count}</span>
            </Link>
          ))}
          {ctfRows.length === 0 && (
            <p className="text-xs text-muted-foreground">no ctfs yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
