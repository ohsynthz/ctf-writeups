"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CATEGORIES, DIFFICULTIES } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface WriteupActionsProps {
  slug: string;
  isOwner: boolean;
}

export function WriteupActions({ slug, isOwner }: WriteupActionsProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [challenge, setChallenge] = useState("");
  const [ctf, setCtf] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [content, setContent] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loadingEdit, setLoadingEdit] = useState(false);

  if (!isOwner) return null;

  async function fetchWriteup() {
    setLoadingEdit(true);
    const res = await fetch(`/api/writeups/${slug}`);
    const data = await res.json();
    setTitle(data.title || "");
    setChallenge(data.challenge || "");
    setCtf(data.ctf || "");
    setCategory(data.category || "");
    setDifficulty(data.difficulty || "");
    setContent(data.content || "");
    setLoadingEdit(false);
    setEditing(true);
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");
    const res = await fetch(`/api/writeups/${slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        challenge,
        ctf,
        category,
        difficulty,
        content,
      }),
    });

    if (!res.ok) {
      setMessage("error: save failed");
      setSaving(false);
      return;
    }

    setEditing(false);
    setSaving(false);
    setMessage("saved");
    router.refresh();
  }

  async function handleDelete() {
    setDeleting(true);
    setMessage("");
    await fetch(`/api/writeups/${slug}`, { method: "DELETE" });
    setDeleteOpen(false);
    router.push("/writeups");
  }

  if (editing) {
    return (
      <div className="mt-8 border-t border-border pt-6">
        <p className="mb-3 text-xs text-muted-foreground">
          <span className="text-primary">$</span> vi {slug}.md
        </p>
        <div className="mb-4 grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border border-border bg-card px-2 py-1.5 font-mono text-xs text-foreground outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">challenge</label>
            <input value={challenge} onChange={(e) => setChallenge(e.target.value)} className="w-full border border-border bg-card px-2 py-1.5 font-mono text-xs text-foreground outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">ctf event</label>
            <input value={ctf} onChange={(e) => setCtf(e.target.value)} className="w-full border border-border bg-card px-2 py-1.5 font-mono text-xs text-foreground outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border border-border bg-card px-2 py-1.5 font-mono text-xs text-foreground outline-none">
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">difficulty</label>
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full border border-border bg-card px-2 py-1.5 font-mono text-xs text-foreground outline-none">
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mb-3 min-h-[300px] w-full border border-border bg-card p-4 font-mono text-xs text-foreground outline-none resize-y"
        />
        {message && (
          <p className="mb-2 text-xs text-muted-foreground">{message}</p>
        )}
        <div className="flex gap-3 text-xs">
          <button
            onClick={handleSave}
            disabled={saving}
            className="border border-border bg-card px-3 py-1.5 hover:border-primary transition-none disabled:opacity-40"
          >
            {saving ? "..." : "[save]"}
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
    <div className="mt-8 flex items-center gap-3 border-t border-border pt-6 text-xs">
      <button
        onClick={fetchWriteup}
        disabled={loadingEdit}
        className="border border-border bg-card px-3 py-1.5 hover:border-primary transition-none disabled:opacity-40"
      >
        {loadingEdit ? "..." : "[edit]"}
      </button>
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogTrigger
          disabled={deleting}
          className="border border-destructive bg-card px-3 py-1.5 text-destructive-foreground hover:border-destructive transition-none disabled:opacity-40"
        >
          {deleting ? "..." : "[delete]"}
        </DialogTrigger>
        <DialogContent className="border border-border bg-card font-mono">
          <DialogHeader>
            <DialogTitle className="text-sm font-normal">$ rm {slug}.md</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Are you sure? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setDeleteOpen(false)}
              className="border border-border bg-card px-3 py-1.5 text-xs hover:border-primary transition-none"
            >
              [cancel]
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="border border-destructive bg-card px-3 py-1.5 text-xs text-destructive-foreground hover:border-destructive transition-none disabled:opacity-40"
            >
              {deleting ? "..." : "[delete]"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
      {message && (
        <span className="text-xs text-muted-foreground">{message}</span>
      )}
    </div>
  );
}
