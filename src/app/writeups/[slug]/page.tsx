import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/db";
import { writeups } from "@/db/schema";
import { eq } from "drizzle-orm";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { WriteupActions } from "@/components/writeup-actions";
import { ErrorBoundary } from "@/components/error-boundary";
import { categoryColor, difficultyColor, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const writeup = db
    .select()
    .from(writeups)
    .where(eq(writeups.id, slug))
    .get();

  if (!writeup) return { title: "Not Found" };

  return {
    title: writeup.title,
    description: `${writeup.ctf} / ${writeup.challenge}`,
  };
}

export default async function WriteupPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const writeup = db
    .select()
    .from(writeups)
    .where(eq(writeups.id, slug))
    .get();

  if (!writeup) notFound();

  const tags: string[] = JSON.parse(writeup.tags || "[]");

  return (
    <ErrorBoundary>
      <article>
        <Link
          href="/writeups"
          className="mb-6 inline-block text-xs text-muted-foreground hover:text-primary transition-none"
        >
          $ cd .. &amp;&amp; ls
        </Link>

        <header className="mb-8 border border-border bg-card p-5">
          <div className="mb-3 flex items-center gap-2 text-xs">
            <span className={categoryColor(writeup.category)}>
              [{writeup.category}]
            </span>
            <span className={difficultyColor(writeup.difficulty)}>
              [{writeup.difficulty}]
            </span>
          </div>

          <h1 className="mb-2 text-lg font-normal tracking-tight">
            <span className="text-primary">$</span> cat {writeup.id}.md
          </h1>

          <div className="mb-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <Link
              href={`/ctf/${writeup.ctf.toLowerCase().replace(/\s+/g, "-")}`}
              className="hover:text-primary transition-none"
            >
              {writeup.ctf}
            </Link>
            <span className="text-border">/</span>
            <span>{writeup.challenge}</span>
            <span className="text-border">|</span>
            <span>{formatDate(writeup.createdAt)}</span>
            {writeup.submittedBy && (
              <>
                <span className="text-border">|</span>
                <span>by {writeup.submittedBy}</span>
              </>
            )}
          </div>

          {tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
              {tags.map((tag: string) => (
                <Link
                  key={tag}
                  href={`/writeups?search=${tag}`}
                  className="hover:text-primary transition-none"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}
        </header>

        <div className="border-t border-border pt-6">
          <MarkdownRenderer content={writeup.content} />
        </div>

        <WriteupActions slug={writeup.id} />
      </article>
    </ErrorBoundary>
  );
}
