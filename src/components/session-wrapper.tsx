"use client";

import { SessionProvider } from "next-auth/react";

export function SessionWrapper({ children }: { children: React.ReactNode }) {
  return <SessionProvider refetchInterval={60}>{children}</SessionProvider>;
}
