import Link from "next/link";
import { AuthButton } from "./auth-button";

export function Navbar() {
  return (
    <nav className="border-b border-border">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-sm font-bold tracking-wide">
          <span className="text-primary">$</span>
          <span className="text-primary">cd</span>
          <span className="text-foreground">~/ctf-writeups</span>
          <span className="cursor-blink" />
        </Link>
        <div className="flex items-center gap-5 text-sm text-muted-foreground">
          <Link href="/writeups" className="hover:text-primary transition-none">
            writeups/
          </Link>
          <Link href="/stats" className="hover:text-primary transition-none">
            stats/
          </Link>
          <Link href="/submit" className="hover:text-primary transition-none">
            submit/
          </Link>
          <AuthButton />
        </div>
      </div>
    </nav>
  );
}
