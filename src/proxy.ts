import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/watchlist", "/portfolio"];

export function proxy(request: NextRequest) {
  const { nextUrl } = request;

  const isProtected = protectedRoutes.some((r) =>
    nextUrl.pathname.startsWith(r)
  );

  if (!isProtected) return NextResponse.next();

  // next-auth v5 uses __Secure- prefix on HTTPS, plain on HTTP
  const sessionToken =
    request.cookies.get("__Secure-authjs.session-token")?.value ??
    request.cookies.get("authjs.session-token")?.value;

  if (!sessionToken) {
    const loginUrl = new URL("/auth/login", nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
