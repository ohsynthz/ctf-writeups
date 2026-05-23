import { Suspense } from "react";
import Link from "next/link";
import { db } from "@/db";
import { writeups } from "@/db/schema";
import { desc, asc, eq, like, or, and, sql } from "drizzle-orm";
import { WriteupCard } from "@/components/writeup-card";
import { FilterBar } from "@/components/filter-bar";

export const dynamic = "force-dynamic";

const LIMIT = 12;

async function getWriteups(params: Record<string, string>) {
  const category = params.category;
  const difficulty = params.difficulty;
  const ctf = params.ctf;
  const search = params.search;
  const sort = params.sort ?? "newest";
  const page = Math.max(1, parseInt(params.page ?? "1", 10));

  const conditions = [];
  if (category && category !== "all") conditions.push(eq(writeups.category, category));
  if (difficulty && difficulty !== "all") conditions.push(eq(writeups.difficulty, difficulty));
  if (ctf && ctf !== "all") conditions.push(eq(writeups.ctf, ctf));
  if (search) {
    conditions.push(
      or(
        like(writeups.title, `%${search}%`),
        like(writeups.challenge, `%${search}%`),
        like(writeups.ctf, `%${search}%`),
      ),
    );
  }

  const where = conditions.length ? and(...conditions) : undefined;

  const totalResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(writeups)
    .where(where);
  const total = totalResult[0]?.count ?? 0;

  const orderBy =
    sort === "oldest"
      ? asc(writeups.createdAt)
      : sort === "hardest"
        ? sql`CASE difficulty WHEN 'insane' THEN 0 WHEN 'hard' THEN 1 WHEN 'medium' THEN 2 WHEN 'easy' THEN 3 END`
        : desc(writeups.createdAt);

  const list = await db
    .select({
      id: writeups.id,
      title: writeups.title,
      challenge: writeups.challenge,
      ctf: writeups.ctf,
      category: writeups.category,
      difficulty: writeups.difficulty,
      tags: writeups.tags,
      submittedBy: writeups.submittedBy,
      createdAt: writeups.createdAt,
    })
    .from(writeups)
    .where(where)
    .orderBy(orderBy)
    .limit(LIMIT)
    .offset((page - 1) * LIMIT);

  return { list, total, page, pages: Math.ceil(total / LIMIT) };
}

async function getCtfs() {
  const rows = await db
    .select({ ctf: writeups.ctf })
    .from(writeups)
    .groupBy(writeups.ctf)
    .orderBy(writeups.ctf);
  return rows.map((r) => r.ctf);
}

function Pagination({ page, pages, params }: { page: number; pages: number; params: Record<string, string> }) {
  function href(p: number) {
    const p2 = new URLSearchParams(params);
    p2.set("page", String(p));
    return `/writeups?${p2.toString()}`;
  }

  return (
    <div className="mt-8 flex items-center justify-center gap-4 text-xs text-muted-foreground">
      {page > 1 ? (
        <Link href={href(page - 1)} className="hover:text-primary transition-none">[prev]</Link>
      ) : (
        <span className="text-muted-foreground/40">[prev]</span>
      )}
      <span>page {page}/{pages || 1}</span>
      {page < pages ? (
        <Link href={href(page + 1)} className="hover:text-primary transition-none">[next]</Link>
      ) : (
        <span className="text-muted-foreground/40">[next]</span>
      )}
    </div>
  );
}

export default async function WriteupsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  const [{ list, total, page, pages }, ctfs] = await Promise.all([
    getWriteups(params),
    getCtfs(),
  ]);

  return (
    <div>
      <h1 className="mb-6 border-b border-border pb-2 text-sm font-normal">
        <span className="text-primary">$</span> find /writeups -type f
        <span className="ml-2 text-muted-foreground"># {total} results</span>
      </h1>
      <div className="mb-6">
        <Suspense fallback={<div className="h-10" />}>
          <FilterBar ctfs={ctfs} />
        </Suspense>
      </div>
      {list.length === 0 ? (
        <div className="border border-border bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">No writeups found</p>
        </div>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((w) => (
              <WriteupCard key={w.id} {...w} />
            ))}
          </div>
          <Pagination page={page} pages={pages} params={params} />
        </>
      )}
    </div>
  );
}
