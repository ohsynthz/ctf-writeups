import { NextResponse } from "next/server";
import { db } from "@/db";
import { writeups } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { CATEGORIES, DIFFICULTIES } from "@/lib/utils";
import { checkBodySize, checkOrigin, bodyTooLarge, originDenied } from "@/lib/security";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const writeup = await db
    .select()
    .from(writeups)
    .where(eq(writeups.id, slug))
    .get();

  if (!writeup) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(writeup);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (!checkBodySize(request)) return bodyTooLarge();
  if (!checkOrigin(request)) return originDenied();

  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const body = await request.json();

  const existing = await db
    .select()
    .from(writeups)
    .where(eq(writeups.id, slug))
    .get();

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (body.category && !CATEGORIES.includes(body.category)) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }
  if (body.difficulty && !DIFFICULTIES.includes(body.difficulty)) {
    return NextResponse.json({ error: "Invalid difficulty" }, { status: 400 });
  }

  await db
    .update(writeups)
    .set({
      title: body.title ?? existing.title,
      challenge: body.challenge ?? existing.challenge,
      ctf: body.ctf ?? existing.ctf,
      category: body.category ?? existing.category,
      difficulty: body.difficulty ?? existing.difficulty,
      tags: body.tags ? JSON.stringify(body.tags) : "[]",
      content: body.content ?? existing.content,
      submittedBy: body.submittedBy ?? existing.submittedBy,
    })
    .where(eq(writeups.id, slug));

  return NextResponse.json({ id: slug });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (!checkOrigin(request)) return originDenied();

  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  await db.delete(writeups).where(eq(writeups.id, slug));
  return NextResponse.json({ deleted: true });
}
