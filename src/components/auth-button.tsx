"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="text-primary">◉</span>
        <span>{session.user?.name}</span>
        <button
          onClick={() => signOut()}
          className="text-muted-foreground hover:text-primary transition-none cursor-pointer"
        >
          [logout]
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("github")}
      className="text-muted-foreground hover:text-primary transition-none cursor-pointer"
    >
      [login]
    </button>
  );
}
