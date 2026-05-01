import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

const publicPaths = ["/", "/login", "/register", "/pricing", "/studio", "/approve", "/docs"];
const publicPrefixes = [
  "/plumbers",
  "/av-installers",
  "/field-service",
  "/client-approval",
  "/compare",
  "/use-cases",
  "/blog",
  "/api/auth",
  "/api/approve",
  "/_next",
  "/favicon",
  "/og",
  "/robots",
  "/sitemap",
];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isPublic =
    publicPaths.some((p) => pathname === p || pathname.startsWith(p + "/")) ||
    publicPrefixes.some((p) => pathname.startsWith(p));

  if (!isPublic && !req.auth) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
