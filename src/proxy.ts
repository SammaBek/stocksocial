import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const { auth } = NextAuth(authConfig);

const protectedRoutes = ["/watchlist", "/portfolio"];

export async function proxy(req: NextRequest) {
  const session = await auth();
  const { nextUrl } = req;

  const isProtected = protectedRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );

  if (isProtected && !session) {
    const loginUrl = new URL("/auth/login", nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
