import { NextResponse, type NextRequest } from "next/server";
import { adminCookieName, verifyAdminSessionToken } from "@/lib/admin-session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminPage = pathname === "/admin" || pathname.startsWith("/admin/");
  const isAdminApi = pathname.startsWith("/api/admin/");
  const isLoginApi = pathname === "/api/admin/login";
  const isAccountPage = pathname === "/account";

  if (pathname === "/admin/login") {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", "/admin");
    return NextResponse.redirect(loginUrl);
  }

  if ((!isAdminPage && !isAdminApi && !isAccountPage) || isLoginApi) {
    return NextResponse.next();
  }

  const session = await verifyAdminSessionToken(request.cookies.get(adminCookieName)?.value);

  if (isAccountPage && session) {
    return NextResponse.next();
  }

  if ((isAdminPage || isAdminApi) && session?.role === "admin") {
    return NextResponse.next();
  }

  if (isAdminApi) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/account"]
};
