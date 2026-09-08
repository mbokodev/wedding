import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "wedding_session";

/**
 * Pré-filtrage des routes privées : sans cookie de session → /login.
 *
 * ⚠️ Ceci n'est PAS la sécurité réelle (un cookie forgé passe ce filtre) :
 * chaque page/action privée revalide la session et le rôle en base
 * via requireUser / requireUserOrThrow.
 */
export function proxy(request: NextRequest) {
  const hasSessionCookie = request.cookies.has(SESSION_COOKIE);

  if (!hasSessionCookie) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/check-in/:path*"],
};
