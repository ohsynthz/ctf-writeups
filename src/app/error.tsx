"use client";

import Link from "next/link";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="mb-2 text-xs text-muted-foreground">
        <span className="text-primary">$</span> ./app --serve
      </p>
      <p className="mb-1 text-lg text-muted-foreground">
        panic: {error.message || "something went wrong"}
      </p>
      <div className="mt-6 flex gap-4 text-xs text-muted-foreground">
        <button onClick={reset} className="hover:text-primary transition-none">
          [try again]
        </button>
        <Link href="/" className="hover:text-primary transition-none">
          [cd ~/]
        </Link>
      </div>
    </div>
  );
}
