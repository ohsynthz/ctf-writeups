import Link from "next/link";
import { db } from "@/db";
import { writeups } from "@/db/schema";
import { desc } from "drizzle-orm";
import { WriteupCard } from "@/components/writeup-card";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const recent = await db
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
    .orderBy(desc(writeups.createdAt))
    .limit(12);

  return (
    <div>
      <section className="mb-12 border border-border bg-card p-6">
        <p className="mb-2 text-xs text-muted-foreground">
          <span className="text-primary">$</span> cat writeups/README
        </p>
        <h1 className="mb-3 text-2xl font-normal tracking-tight">
          <span className="text-primary">~/ctf-writeups</span>
          <span className="cursor-blink" />
        </h1>
        <p className="text-sm text-muted-foreground">
          <span className="text-foreground">ohsynthz</span>@root:~/ctf-writeups
        </p>
      </section>

      <section className="mb-10">
        <div className="mb-4 flex items-center justify-between border-b border-border pb-2">
          <h2 className="text-sm font-normal">
            <span className="text-primary">$</span> ls -la writeups/ | tail -{recent.length}
          </h2>
          <Link href="/writeups" className="text-xs text-muted-foreground hover:text-primary transition-none">
            [view all]
          </Link>
        </div>
        {recent.length === 0 ? (
          <div className="border border-border bg-card p-8 text-center">
            <p className="mb-2 text-sm text-muted-foreground">No writeups yet</p>
            <Link href="/submit" className="text-xs text-primary hover:underline">
              $ touch first-writeup.md
            </Link>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((w) => (
              <WriteupCard key={w.id} {...w} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
