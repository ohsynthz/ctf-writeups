import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/db";
import { writeups } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { WriteupCard } from "@/components/writeup-card";

export const dynamic = "force-dynamic";

export default async function CtfPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ctf = slug.replace(/-/g, " ");

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
    .orderBy(desc(writeups.createdAt));

  if (list.length === 0) notFound();

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
        <span className="ml-2 text-muted-foreground"># {list.length} challenges</span>
      </h1>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((w) => (
          <WriteupCard key={w.id} {...w} />
        ))}
      </div>
    </div>
  );
}
