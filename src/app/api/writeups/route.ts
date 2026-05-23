import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { writeups } from "@/db/schema";
import { slugify, CATEGORIES, DIFFICULTIES } from "@/lib/utils";
import { eq, like, or, and, desc, asc, sql } from "drizzle-orm";
import { auth } from "@/auth";
import { checkBodySize, checkOrigin, bodyTooLarge, originDenied } from "@/lib/security";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const difficulty = searchParams.get("difficulty");
  const ctf = searchParams.get("ctf");
  const search = searchParams.get("search");
  const sort = searchParams.get("sort") ?? "newest";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "30", 10)));

  const conditions = [];
  if (category && category !== "all") conditions.push(eq(writeups.category, category));
  if (difficulty && difficulty !== "all") conditions.push(eq(writeups.difficulty, difficulty));
  if (ctf && ctf !== "all") conditions.push(eq(writeups.ctf, ctf));
  if (search) {
    conditions.push(
      or(
        like(writeups.title, `%${search}%`),
        like(writeups.challenge, `%${search}%`),
        like(writeups.ctf, `%${search}%`),
      ),
    );
  }

  const where = conditions.length ? and(...conditions) : undefined;

  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(writeups)
    .where(where);
  const total = countResult[0]?.count ?? 0;

  const orderBy =
    sort === "oldest"
      ? asc(writeups.createdAt)
      : sort === "hardest"
        ? sql`CASE difficulty WHEN 'insane' THEN 0 WHEN 'hard' THEN 1 WHEN 'medium' THEN 2 WHEN 'easy' THEN 3 END`
        : desc(writeups.createdAt);

  const all = await db
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
    .where(where)
    .orderBy(orderBy)
    .limit(limit)
    .offset((page - 1) * limit);

  return NextResponse.json({ writeups: all, total, page, limit });
}

export async function POST(request: NextRequest) {
  if (!checkBodySize(request)) return bodyTooLarge();
  if (!checkOrigin(request)) return originDenied();

  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { title, challenge, ctf, category, difficulty, content, submittedBy } = body;

  if (!title || !challenge || !ctf || !category || !difficulty || !content) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (!CATEGORIES.includes(category)) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }
  if (!DIFFICULTIES.includes(difficulty)) {
    return NextResponse.json({ error: "Invalid difficulty" }, { status: 400 });
  }

  const base = slugify(title);
  const suffix = Math.random().toString(36).slice(2, 6);
  const id = `${base}-${suffix}`;

  await db.insert(writeups).values({
    id,
    title,
    challenge,
    ctf,
    category,
    tags: "[]",
    difficulty,
    content,
    submittedBy: submittedBy || null,
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ id });
}
