import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  // Update the session first
  const response = await updateSession(request);

  // Store current request URL in a custom header
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-url", request.url);

  // If `updateSession` already returns a NextResponse, we need to patch it
  if (response instanceof NextResponse) {
    response.headers.set("x-url", request.url);
    return response;
  }

  // Otherwise, create a fresh response with the new headers
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
