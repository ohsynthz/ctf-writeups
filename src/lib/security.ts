import { NextResponse } from "next/server";

const MAX_BODY_SIZE = 2_097_152;
const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "https://ctf-writeups.vercel.app",
];

export function checkBodySize(request: Request): boolean {
  const contentLength = request.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > MAX_BODY_SIZE) {
    return false;
  }
  return true;
}

export function checkOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  return ALLOWED_ORIGINS.includes(origin);
}

export function bodyTooLarge(): NextResponse {
  return NextResponse.json({ error: "Request body too large" }, { status: 413 });
}

export function originDenied(): NextResponse {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}
