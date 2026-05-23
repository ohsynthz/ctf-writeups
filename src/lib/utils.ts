import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
    .slice(0, 80)
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export const CATEGORIES = [
  "web",
  "pwn",
  "crypto",
  "rev",
  "misc",
  "forensics",
  "osint",
  "hardware",
  "blockchain",
] as const

export const DIFFICULTIES = ["easy", "medium", "hard", "insane"] as const

const CATEGORY_COLORS: Record<string, string> = {
  web: "text-foreground",
  pwn: "text-foreground",
  crypto: "text-foreground",
  rev: "text-foreground",
  misc: "text-foreground",
  forensics: "text-foreground",
  osint: "text-foreground",
  hardware: "text-foreground",
  blockchain: "text-foreground",
}

export function categoryColor(category: string): string {
  return CATEGORY_COLORS[category] ?? "text-foreground"
}

export const DIFFICULTY_LABELS: Record<string, string> = {
  easy: "easy",
  medium: "medium",
  hard: "hard",
  insane: "insane",
}

export function difficultyColor(difficulty: string): string {
  return "text-foreground"
}
