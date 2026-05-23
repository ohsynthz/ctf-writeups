"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES, DIFFICULTIES } from "@/lib/utils";

const MAX_FILE_SIZE = 1_048_576;

export default function SubmitPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [title, setTitle] = useState("");
  const [challenge, setChallenge] = useState("");
  const [ctf, setCtf] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [fileName, setFileName] = useState("");
  const [preview, setPreview] = useState(false);
  const submittedBy = session?.user?.name ?? "";
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    if (!title || !challenge || !ctf || !category || !difficulty || !content) {
      setError("Missing required fields");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/writeups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            challenge,
            ctf,
            category,
            difficulty,
            content,
            tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
            submittedBy,
          }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed");
      }

      const data = await res.json();
      router.push(`/writeups/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit");
      setSubmitting(false);
    }
  }, [title, challenge, ctf, category, difficulty, content, router]);

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".md")) {
      setError("Only .md files are accepted");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("File too large (max 1MB)");
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setContent(text);
      const titleMatch = text.match(/^#\s+(.+)/m);
      if (titleMatch && !title) setTitle(titleMatch[1].trim());
    };
    reader.readAsText(file);
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-xs text-muted-foreground">
          <span className="text-primary">$</span> authenticating
          <span className="loading-dot">.</span>
          <span className="loading-dot">.</span>
          <span className="loading-dot">.</span>
        </p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="mx-auto max-w-md border border-border bg-card p-8 text-center">
        <p className="mb-4 text-sm">
          <span className="text-primary">$</span> ./submit.sh
        </p>
        <p className="mb-1 text-xs text-muted-foreground">error: permission denied</p>
        <p className="mb-6 text-xs text-muted-foreground">only the site owner can submit writeups</p>
        <button
          onClick={() => signIn("github")}
          className="border border-border px-4 py-2 text-xs text-primary hover:bg-primary/5 transition-none cursor-pointer"
        >
          $ su - github
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-6 border-b border-border pb-2 text-sm font-normal">
        <span className="text-primary">$</span> cat {'>'} writeup.md
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">title *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Baby SQL Injection"
              className="border-border bg-card font-mono text-xs"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">challenge *</label>
            <Input
              value={challenge}
              onChange={(e) => setChallenge(e.target.value)}
              placeholder="Baby SQL"
              className="border-border bg-card font-mono text-xs"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">ctf event *</label>
            <Input
              value={ctf}
              onChange={(e) => setCtf(e.target.value)}
              placeholder="HTB Cyber Apocalypse 2025"
              className="border-border bg-card font-mono text-xs"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">category *</label>
            <Select value={category} onValueChange={(v) => v && setCategory(v)}>
              <SelectTrigger className="border-border bg-card font-mono text-xs">
                <SelectValue placeholder="[select]" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>[{c}]</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">difficulty *</label>
            <Select value={difficulty} onValueChange={(v) => v && setDifficulty(v)}>
              <SelectTrigger className="border-border bg-card font-mono text-xs">
                <SelectValue placeholder="[select]" />
              </SelectTrigger>
              <SelectContent>
                {DIFFICULTIES.map((d) => (
                  <SelectItem key={d} value={d}>[{d}]</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">tags (comma-separated)</label>
            <Input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="sql, injection, web"
              className="border-border bg-card font-mono text-xs"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>author:</span>
          <span className="text-foreground">{submittedBy || "(will use GitHub name)"}</span>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">.md file *</label>
          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".md"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="border border-border bg-card px-4 py-2 text-xs text-foreground hover:border-primary transition-none cursor-pointer"
            >
              $ cat writeup.md
            </button>
            {fileName && (
              <span className="text-xs text-muted-foreground">{fileName} ({content.length} chars)</span>
            )}
          </div>
          {content && !preview && (
            <pre className="mt-2 max-h-48 overflow-y-auto border border-border bg-[#050505] p-3 text-xs text-muted-foreground">
              {content.slice(0, 500)}{content.length > 500 ? "..." : ""}
            </pre>
          )}
          {content && (
            <button
              type="button"
              onClick={() => setPreview(!preview)}
              className="mt-1 text-xs text-muted-foreground hover:text-primary transition-none"
            >
              [{preview ? "raw" : "preview"}]
            </button>
          )}
          {content && preview && (
            <div className="mt-2 max-h-96 overflow-y-auto border border-border bg-[#050505] p-4">
              <MarkdownRenderer content={content} />
            </div>
          )}
        </div>

        {error && (
          <p className="text-xs text-destructive">error: {error}</p>
        )}

        <div className="flex gap-3">
          <Button type="submit" disabled={submitting} className="font-mono text-xs">
            {submitting ? "saving..." : "$ ./publish.sh"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()} className="font-mono text-xs">
            $ ^C
          </Button>
        </div>
      </form>
    </div>
  );
}
