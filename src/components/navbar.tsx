"use client";

import Link from "next/link";
import { AuthButton } from "./auth-button";
import { useState } from "react";
import { useSession } from "next-auth/react";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <nav className="border-b border-border">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-sm font-bold tracking-wide" onClick={() => setOpen(false)}>
          <span className="text-primary">$</span>
          <span className="text-primary">cd</span>
          <span className="text-foreground">~/ctf-writeups</span>
          <span className="cursor-blink" />
        </Link>

        <button
          onClick={() => setOpen(!open)}
          className="flex size-7 items-center justify-center border border-border sm:hidden"
          aria-label="Toggle menu"
        >
          <span className="text-xs text-muted-foreground">{open ? "x" : "="}</span>
        </button>

        <div className="hidden items-center gap-5 text-sm text-muted-foreground sm:flex">
          <Link href="/writeups" className="hover:text-primary transition-none">
            writeups/
          </Link>
          <Link href="/stats" className="hover:text-primary transition-none">
            stats/
          </Link>
          {session && (
            <Link href="/submit" className="hover:text-primary transition-none">
              submit/
            </Link>
          )}
          <AuthButton />
        </div>
      </div>

      {open && (
        <div className="flex flex-col gap-1 border-t border-border px-4 py-3 text-sm text-muted-foreground sm:hidden">
          <Link href="/writeups" className="py-1 hover:text-primary transition-none" onClick={() => setOpen(false)}>
            writeups/
          </Link>
          <Link href="/stats" className="py-1 hover:text-primary transition-none" onClick={() => setOpen(false)}>
            stats/
          </Link>
          {session && (
            <Link href="/submit" className="py-1 hover:text-primary transition-none" onClick={() => setOpen(false)}>
              submit/
            </Link>
          )}
          <div className="py-1">
            <AuthButton />
          </div>
        </div>
      )}
    </nav>
  );
}
