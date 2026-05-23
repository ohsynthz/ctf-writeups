import { NextResponse } from "next/server";
import { db } from "@/db";
import { writeups } from "@/db/schema";
import { eq } from "drizzle-orm";

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
