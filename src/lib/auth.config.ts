import type { NextAuthConfig } from "next-auth";

const protectedRoutes = ["/watchlist", "/portfolio"];

export const authConfig: NextAuthConfig = {
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtected = protectedRoutes.some((r) => nextUrl.pathname.startsWith(r));
      if (isProtected && !isLoggedIn) {
        const url = new URL("/auth/login", nextUrl.origin);
        url.searchParams.set("callbackUrl", nextUrl.pathname);
        return Response.redirect(url);
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (token?.id) session.user.id = token.id as string;
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
};
