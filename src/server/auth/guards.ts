import "server-only";
import { redirect } from "next/navigation";
import { getCurrentUser, type SessionUser } from "@/server/auth/session";
import type { Role } from "@/generated/prisma/enums";

/** Page d'accueil de chaque rôle après connexion. */
export function homeForRole(role: Role): string {
  return role === "CHECK_IN_AGENT" ? "/check-in" : "/admin";
}

/**
 * Garde de page : exige un utilisateur connecté avec l'un des rôles donnés.
 * - non connecté → /login
 * - connecté mais mauvais rôle → redirigé vers sa page d'accueil
 *
 * À appeler dans chaque page/layout privé (la vraie protection est ici,
 * le proxy ne fait qu'un pré-filtrage sur la présence du cookie).
 */
export async function requireUser(roles: Role[]): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!roles.includes(user.role)) redirect(homeForRole(user.role));
  return user;
}

/**
 * Garde d'action/API : comme requireUser mais lève une erreur au lieu de
 * rediriger (adapté aux server actions et route handlers).
 */
export async function requireUserOrThrow(roles: Role[]): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  if (!roles.includes(user.role)) throw new Error("FORBIDDEN");
  return user;
}
