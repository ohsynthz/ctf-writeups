import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { SessionWrapper } from "@/components/session-wrapper";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "CTF Writeups", template: "%s — CTF Writeups" },
  description: "CTF writeup collection",
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⬡</text></svg>",
        type: "image/svg+xml",
      },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background font-mono antialiased">
        <SessionWrapper>
          <Navbar />
          <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        </SessionWrapper>
      </body>
    </html>
  );
}
