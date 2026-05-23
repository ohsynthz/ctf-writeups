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

export function categoryColor(_category: string): string {
  return "text-foreground"
}

export function difficultyColor(_difficulty: string): string {
  return "text-foreground"
}
