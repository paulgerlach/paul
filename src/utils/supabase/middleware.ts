import {
  ROUTE_DASHBOARD,
  ROUTE_OBJEKTE,
  ROUTE_OBJEKTE_CREATE,
} from "@/routes/routes";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const protectedRoutes = [ROUTE_DASHBOARD, ROUTE_OBJEKTE, ROUTE_OBJEKTE_CREATE];
const adminPrefix = "/admin"; // will match /admin and any subpath

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Always call getUser immediately after creating client
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // 🔒 Step 1: Auth check for protected routes
  const isProtected = protectedRoutes.some((route) => path.startsWith(route));
  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // 🔑 Step 2: Permission check for /admin and all subpaths
  const isAdminRoute = path.startsWith(adminPrefix);
  if (isAdminRoute) {
    if (!user) {
      // Not logged in → send to login
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    const { data: userRecord, error } = await supabase
      .from("users")
      .select("permission")
      .eq("id", user.id)
      .single();

    if (error || !userRecord || userRecord.permission !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = ROUTE_DASHBOARD;
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
