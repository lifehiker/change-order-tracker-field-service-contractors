import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET ?? "dev-secret-change-in-production",
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token?.id && session.user) {
        session.user.id = String(token.id);
      }
      return session;
    },
  },
};
