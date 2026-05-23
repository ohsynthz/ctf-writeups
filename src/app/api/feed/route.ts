import { NextResponse } from "next/server";
import { db } from "@/db";
import { writeups } from "@/db/schema";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  const list = await db
    .select({
      id: writeups.id,
      title: writeups.title,
      challenge: writeups.challenge,
      ctf: writeups.ctf,
      category: writeups.category,
      difficulty: writeups.difficulty,
      content: writeups.content,
      submittedBy: writeups.submittedBy,
      createdAt: writeups.createdAt,
    })
    .from(writeups)
    .orderBy(desc(writeups.createdAt))
    .limit(20);

  const baseUrl = "https://ctf-writeups.vercel.app";
  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>CTF Writeups</title>
  <link href="${baseUrl}/api/feed" rel="self"/>
  <link href="${baseUrl}"/>
  <updated>${new Date().toISOString()}</updated>
  <id>${baseUrl}/</id>
  <author><name>ohsynthz</name></author>
  ${list
    .map(
      (w) => `
  <entry>
    <title>${escapeXml(w.title)}</title>
    <link href="${baseUrl}/writeups/${w.id}"/>
    <id>${baseUrl}/writeups/${w.id}</id>
    <updated>${new Date(w.createdAt).toISOString()}</updated>
    <summary>${escapeXml(`${w.ctf} / ${w.challenge} — ${w.difficulty}`)}</summary>
    <category term="${w.category}"/>
  </entry>`,
    )
    .join("")}
</feed>`;

  return new NextResponse(feed, {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
    },
  });
}

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
