import { auth } from "@/lib/auth";
import { NextResponse, type NextRequest } from "next/server";

const authHandler = auth((req) => {
  const { pathname } = req.nextUrl;
  const method = req.method;

  if (pathname.startsWith("/admin")) {
    if (!req.auth || req.auth.user?.role !== "admin") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  if (pathname.startsWith("/api/products") && method !== "GET") {
    if (!req.auth || req.auth.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  if (pathname.startsWith("/api/orders")) {
    if (!req.auth || req.auth.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  if (pathname.startsWith("/api/settings") && method !== "GET") {
    if (!req.auth || req.auth.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }
});

export function proxy(request: NextRequest) {
  return (authHandler as (req: NextRequest) => Response | NextResponse)(request);
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/products/:path*",
    "/api/orders/:path*",
    "/api/settings/:path*",
  ],
};
