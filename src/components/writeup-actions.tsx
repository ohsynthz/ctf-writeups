"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface WriteupActionsProps {
  slug: string;
}

export function WriteupActions({ slug }: WriteupActionsProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState("");

  if (!session) return null;

  async function handleDelete() {
    if (!confirm("Delete this writeup?")) return;
    setDeleting(true);
    await fetch(`/api/writeups/${slug}`, { method: "DELETE" });
    router.push("/writeups");
  }

  if (editing) {
    return (
      <div className="mt-8 border-t border-border pt-6">
        <p className="mb-3 text-xs text-muted-foreground">
          <span className="text-primary">$</span> vi {slug}.md
        </p>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mb-3 min-h-[300px] w-full border border-border bg-card p-4 font-mono text-xs text-foreground outline-none resize-y"
        />
        <div className="flex gap-3 text-xs">
          <button
            onClick={async () => {
              await fetch(`/api/writeups/${slug}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content }),
              });
              setEditing(false);
              router.refresh();
            }}
            className="border border-border bg-card px-3 py-1.5 hover:border-primary transition-none"
          >
            [save]
          </button>
          <button
            onClick={() => setEditing(false)}
            className="border border-border bg-card px-3 py-1.5 hover:border-primary transition-none"
          >
            [cancel]
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 flex gap-3 border-t border-border pt-6 text-xs">
      <button
        onClick={async () => {
          const res = await fetch(`/api/writeups/${slug}`);
          const data = await res.json();
          setContent(data.content || "");
          setEditing(true);
        }}
        className="border border-border bg-card px-3 py-1.5 hover:border-primary transition-none"
      >
        [edit]
      </button>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="border border-destructive bg-card px-3 py-1.5 text-destructive-foreground hover:border-destructive transition-none disabled:opacity-40"
      >
        {deleting ? "..." : "[delete]"}
      </button>
    </div>
  );
}
