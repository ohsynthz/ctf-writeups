import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

const ALLOWED_ID = "285660035";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
  ],
  pages: {
    error: "/",
  },
  callbacks: {
    signIn({ profile }) {
      return String(profile?.id) === ALLOWED_ID;
    },
  },
});
