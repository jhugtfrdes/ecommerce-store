import { NextResponse, type NextRequest } from "next/server";
import { updateSupabaseSession } from "@/lib/supabase/middleware";

type ProfileRole = {
  role: "user" | "admin";
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { response, supabase } = await updateSupabaseSession(request);

  if (pathname === "/admin/login") {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", "/admin");
    return NextResponse.redirect(loginUrl);
  }

  const isAdminPage = pathname === "/admin" || pathname.startsWith("/admin/");
  const isAdminApi = pathname.startsWith("/api/admin/");
  const isAccountPage = pathname === "/account";

  if (!isAdminPage && !isAdminApi && !isAccountPage) {
    return response;
  }

  if (!supabase) {
    if (isAdminApi) {
      return NextResponse.json({ error: "Supabase não está configurado." }, { status: 503 });
    }
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    if (isAdminApi) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAccountPage) {
    return response;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .maybeSingle<ProfileRole>();

  if (profile?.role === "admin") {
    return response;
  }

  if (isAdminApi) {
    return NextResponse.json({ error: "Apenas administradores." }, { status: 403 });
  }

  const accountUrl = request.nextUrl.clone();
  accountUrl.pathname = "/account";
  accountUrl.search = "";
  return NextResponse.redirect(accountUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/account"]
};
