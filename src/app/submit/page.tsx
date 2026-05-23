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

type FieldErrors = Partial<Record<"title" | "challenge" | "ctf" | "category" | "difficulty" | "content", string>>;

export default function SubmitPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [title, setTitle] = useState("");
  const [challenge, setChallenge] = useState("");
  const [ctf, setCtf] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [content, setContent] = useState("");
  const [fileName, setFileName] = useState("");
  const [preview, setPreview] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const submittedBy = session?.user?.name ?? "";
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function validate(): boolean {
    const errors: FieldErrors = {};
    if (!title.trim()) errors.title = "required";
    if (!challenge.trim()) errors.challenge = "required";
    if (!ctf.trim()) errors.ctf = "required";
    if (!category) errors.category = "required";
    if (!difficulty) errors.difficulty = "required";
    if (!content.trim()) errors.content = "required";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/writeups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          challenge: challenge.trim(),
          ctf: ctf.trim(),
          category,
          difficulty,
          content,
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
    setError("");
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
    setExpanded(false);
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

  const contentPreview = expanded ? content : content.slice(0, 500);

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-6 border-b border-border pb-2 text-sm font-normal">
        <span className="text-primary">$</span> cat {'>'} writeup.md
      </h1>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">title *</label>
            <Input
              value={title}
              onChange={(e) => { setTitle(e.target.value); setFieldErrors((p) => ({ ...p, title: undefined })); }}
              placeholder="Baby SQL Injection"
              className={`border-border bg-card font-mono text-xs ${fieldErrors.title ? "border-destructive" : ""}`}
            />
            {fieldErrors.title && <p className="text-xs text-destructive">error: title is required</p>}
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">challenge *</label>
            <Input
              value={challenge}
              onChange={(e) => { setChallenge(e.target.value); setFieldErrors((p) => ({ ...p, challenge: undefined })); }}
              placeholder="Baby SQL"
              className={`border-border bg-card font-mono text-xs ${fieldErrors.challenge ? "border-destructive" : ""}`}
            />
            {fieldErrors.challenge && <p className="text-xs text-destructive">error: challenge is required</p>}
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">ctf event *</label>
            <Input
              value={ctf}
              onChange={(e) => { setCtf(e.target.value); setFieldErrors((p) => ({ ...p, ctf: undefined })); }}
              placeholder="HTB Cyber Apocalypse 2025"
              className={`border-border bg-card font-mono text-xs ${fieldErrors.ctf ? "border-destructive" : ""}`}
            />
            {fieldErrors.ctf && <p className="text-xs text-destructive">error: CTF event is required</p>}
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">category *</label>
            <Select value={category} onValueChange={(v) => { v && setCategory(v); setFieldErrors((p) => ({ ...p, category: undefined })); }}>
              <SelectTrigger className={`border-border bg-card font-mono text-xs ${fieldErrors.category ? "border-destructive" : ""}`}>
                <SelectValue placeholder="[select]" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>[{c}]</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldErrors.category && <p className="text-xs text-destructive">error: category is required</p>}
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">difficulty *</label>
            <Select value={difficulty} onValueChange={(v) => { v && setDifficulty(v); setFieldErrors((p) => ({ ...p, difficulty: undefined })); }}>
              <SelectTrigger className={`border-border bg-card font-mono text-xs ${fieldErrors.difficulty ? "border-destructive" : ""}`}>
                <SelectValue placeholder="[select]" />
              </SelectTrigger>
              <SelectContent>
                {DIFFICULTIES.map((d) => (
                  <SelectItem key={d} value={d}>[{d}]</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldErrors.difficulty && <p className="text-xs text-destructive">error: difficulty is required</p>}
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
          {fieldErrors.content && <p className="text-xs text-destructive">error: content is required</p>}
          {content && !preview && (
            <pre className="mt-2 max-h-96 overflow-x-auto overflow-y-auto border border-border bg-[#050505] p-3 text-xs text-muted-foreground">
              {contentPreview}{!expanded && content.length > 500 ? "..." : ""}
            </pre>
          )}
          {content && content.length > 500 && !preview && (
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="mt-1 text-xs text-muted-foreground hover:text-primary transition-none"
            >
              [{expanded ? "collapse" : "show all"}]
            </button>
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
