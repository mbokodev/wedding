import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { cache } from "react";
import { db } from "@/server/db";
import type { Role } from "@/generated/prisma/enums";

/**
 * Sessions opaques stockées en base.
 * - Le cookie contient un token aléatoire (jamais stocké en clair côté serveur).
 * - La base stocke uniquement son SHA-256 → une fuite de la DB n'expose aucune session.
 * - Chaque requête revalide l'utilisateur (isActive) → désactivation immédiate.
 */

export const SESSION_COOKIE = "wedding_session";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 jours

export type SessionUser = {
  id: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  role: Role;
  quota: number | null;
};

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** Crée une session en base et pose le cookie. À appeler après vérification du mot de passe. */
export async function createSession(userId: string): Promise<void> {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await db.session.create({
    data: { tokenHash: hashToken(token), userId, expiresAt },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

/**
 * Utilisateur courant, ou null.
 * Mise en cache par requête (React cache) : plusieurs appels = 1 seule requête DB.
 */
export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await db.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: true },
  });

  if (!session) return null;

  // Session expirée ou utilisateur désactivé → session inerte, on nettoie
  if (session.expiresAt < new Date() || !session.user.isActive) {
    await db.session.delete({ where: { id: session.id } }).catch(() => {});
    return null;
  }

  const { user } = session;
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    quota: user.quota,
  };
});

/** Détruit la session courante (logout) : supprime la ligne en base et le cookie. */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    await db.session
      .deleteMany({ where: { tokenHash: hashToken(token) } })
      .catch(() => {});
  }
  cookieStore.delete(SESSION_COOKIE);
}

/** Révoque toutes les sessions d'un utilisateur (ex: désactivation par le super admin). */
export async function revokeUserSessions(userId: string): Promise<void> {
  await db.session.deleteMany({ where: { userId } });
}
