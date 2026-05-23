"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CATEGORIES, DIFFICULTIES } from "@/lib/utils";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface FilterBarProps {
  ctfs: string[];
}

export function FilterBar({ ctfs }: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`/writeups?${params.toString()}`);
  }

  function onSearchChange(value: string) {
    setSearch(value);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setParam("search", value);
    }, 300);
  }

  return (
    <div className="flex flex-wrap gap-3">
      <Input
        placeholder="$ grep -i "
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-60 border-border bg-card font-mono text-xs"
      />
      <Select
        key={`cat-${searchParams.get("category") ?? ""}`}
        defaultValue={searchParams.get("category") ?? ""}
        onValueChange={(v) => v && setParam("category", v === "all" ? "" : v)}
      >
        <SelectTrigger className="w-36 border-border bg-card text-xs">
          <SelectValue placeholder="[category]" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">[all]</SelectItem>
          {CATEGORIES.map((c) => (
            <SelectItem key={c} value={c}>[{c}]</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        key={`diff-${searchParams.get("difficulty") ?? ""}`}
        defaultValue={searchParams.get("difficulty") ?? ""}
        onValueChange={(v) => v && setParam("difficulty", v === "all" ? "" : v)}
      >
        <SelectTrigger className="w-36 border-border bg-card text-xs">
          <SelectValue placeholder="[difficulty]" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">[all]</SelectItem>
          {DIFFICULTIES.map((d) => (
            <SelectItem key={d} value={d}>[{d}]</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        key={`ctf-${searchParams.get("ctf") ?? ""}`}
        defaultValue={searchParams.get("ctf") ?? ""}
        onValueChange={(v) => v && setParam("ctf", v === "all" ? "" : v)}
      >
        <SelectTrigger className="w-48 border-border bg-card text-xs">
          <SelectValue placeholder="[ctf]" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">[all]</SelectItem>
          {ctfs.map((c) => (
            <SelectItem key={c} value={c}>[{c}]</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        key={`sort-${searchParams.get("sort") ?? "newest"}`}
        defaultValue={searchParams.get("sort") ?? "newest"}
        onValueChange={(v) => v && setParam("sort", v === "newest" ? "" : v)}
      >
        <SelectTrigger className="w-36 border-border bg-card text-xs">
          <SelectValue placeholder="[sort]" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">[newest]</SelectItem>
          <SelectItem value="oldest">[oldest]</SelectItem>
          <SelectItem value="hardest">[hardest]</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
