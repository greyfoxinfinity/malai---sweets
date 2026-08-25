import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const adminRoutes = ["/admin"];
const protectedApiRoutes = ["/api/products", "/api/orders", "/api/settings"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  const isProtectedApi = protectedApiRoutes.some((route) => pathname.startsWith(route));

  if (isAdminRoute || isProtectedApi) {
    const sessionToken =
      request.cookies.get("authjs.session-token")?.value ||
      request.cookies.get("__Secure-authjs.session-token")?.value;

    if (!sessionToken) {
      if (isAdminRoute) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/products/:path*", "/api/orders/:path*", "/api/settings/:path*"],
};
