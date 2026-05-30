import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userToken = request.cookies.get("user_session")?.value;
  const adminToken = request.cookies.get("admin_session")?.value;

  if ((pathname === "/login" || pathname === "/signup") && userToken) {
    const payload = await verifyToken(userToken);
    if (payload) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  if ((pathname === "/admin/login" || pathname === "/admin/signup") && adminToken) {
    const payload = await verifyToken(adminToken);
    if (payload) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login") && !pathname.startsWith("/admin/signup")) {
    if (!adminToken) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const payload = await verifyToken(adminToken);
    if (!payload) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  if (pathname.startsWith("/dashboard")) {
    if (!userToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const payload = await verifyToken(userToken);
    if (!payload) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/login", "/signup"],
};
