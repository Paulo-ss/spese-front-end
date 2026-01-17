import { NextAuthConfig } from "next-auth";

export const authConfig = {
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session) {
        return {
          ...token,
          ...session.user,
        };
      }

      if (user) {
        return { ...token, ...user };
      }

      return { ...token };
    },
    async session({ session, token }) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      session.user = token as any;

      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24,
  },
  pages: {
    signIn: "/auth/sign-in",
    signOut: "/auth/sign-in",
  },
  secret: process.env.NEXTAUTH_SECRET,
  useSecureCookies: process.env.AUTH_URL?.startsWith("https://"),
  providers: [],
  basePath: "/api/auth",
} satisfies NextAuthConfig;
