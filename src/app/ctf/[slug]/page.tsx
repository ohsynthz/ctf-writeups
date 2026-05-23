import Link from "next/link";
import { db } from "@/db";
import { writeups } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { WriteupCard } from "@/components/writeup-card";

export const dynamic = "force-dynamic";

const LIMIT = 12;

async function getWriteups(slug: string, page: number) {
  const ctf = slug.replace(/-/g, " ");

  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(writeups)
    .where(eq(writeups.ctf, ctf));
  const total = countResult[0]?.count ?? 0;

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
    .where(eq(writeups.ctf, ctf))
    .orderBy(desc(writeups.createdAt))
    .limit(LIMIT)
    .offset((page - 1) * LIMIT);

  return { list, total, page, pages: Math.ceil(total / LIMIT) };
}

export default async function CtfPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10));
  const { list, total, pages } = await getWriteups(slug, page);

  return (
    <div>
      <Link
        href="/writeups"
        className="mb-6 inline-block text-xs text-muted-foreground hover:text-primary transition-none"
      >
        $ cd .. &amp;&amp; ls
      </Link>
      <h1 className="mb-6 border-b border-border pb-2 text-sm font-normal">
        <span className="text-primary">$</span> ls ctf/<span className="text-foreground">{slug}</span>
        <span className="ml-2 text-muted-foreground"># {total} challenges</span>
      </h1>
      {list.length === 0 ? (
        <div className="border border-border bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">No writeups for this CTF yet</p>
        </div>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((w) => (
              <WriteupCard key={w.id} {...w} />
            ))}
          </div>
          {pages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-4 text-xs text-muted-foreground">
              {page > 1 ? (
                <Link href={`/ctf/${slug}?page=${page - 1}`} className="hover:text-primary transition-none">[prev]</Link>
              ) : (
                <span className="text-muted-foreground/40">[prev]</span>
              )}
              <span>page {page}/{pages}</span>
              {page < pages ? (
                <Link href={`/ctf/${slug}?page=${page + 1}`} className="hover:text-primary transition-none">[next]</Link>
              ) : (
                <span className="text-muted-foreground/40">[next]</span>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
