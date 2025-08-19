// middleware.ts
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

// ضع هنا الدومين المسموح به، بدون NEXT_PUBLIC
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN;
if (!ALLOWED_ORIGIN) {
  throw new Error("Environment variable ALLOWED_ORIGIN is not defined!");
}
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/" || pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // حماية كل الـ API routes
  if (pathname.startsWith("/api")) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const origin = req.headers.get("origin") || "";
    const referer = req.headers.get("referer") || "";

    if (
      !origin.includes(ALLOWED_ORIGIN!) &&
      !referer.includes(ALLOWED_ORIGIN!)
    ) {
      return new NextResponse(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  if (pathname.startsWith("/dashboard")) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/dashboard/:path*"],
};
