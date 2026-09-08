"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { verifyPassword } from "@/server/auth/password";
import { createSession, destroySession } from "@/server/auth/session";
import { homeForRole } from "@/server/auth/guards";
import {
  isRateLimited,
  recordFailedAttempt,
  clearAttempts,
} from "@/server/auth/rate-limit";
import { loginSchema, normalizeIdentifier } from "@/validations/auth";

export type LoginState = {
  error: string | null;
};

const GENERIC_ERROR = "Identifiants invalides.";

async function clientIp(): Promise<string> {
  const headerStore = await headers();
  const forwarded = headerStore.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() ?? "unknown";
}

/** Connexion par email OU téléphone + mot de passe. */
export async function login(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    identifier: formData.get("identifier"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? GENERIC_ERROR };
  }

  const identifier = normalizeIdentifier(parsed.data.identifier);
  if (!identifier) return { error: GENERIC_ERROR };

  // Anti brute-force : clé identifiant + IP
  const ip = await clientIp();
  const rateKey = `${identifier.value}|${ip}`;
  if (isRateLimited(rateKey)) {
    return {
      error: "Trop de tentatives. Réessayez dans une quinzaine de minutes.",
    };
  }

  const user = await db.user.findUnique({
    where:
      identifier.kind === "email"
        ? { email: identifier.value }
        : { phone: identifier.value },
  });

  // Même message et vérification factice si l'utilisateur n'existe pas
  // (pas d'énumération de comptes, temps de réponse comparable).
  if (!user) {
    await verifyPassword(parsed.data.password, DUMMY_HASH);
    recordFailedAttempt(rateKey);
    return { error: GENERIC_ERROR };
  }

  const passwordOk = await verifyPassword(
    parsed.data.password,
    user.passwordHash
  );
  if (!passwordOk) {
    recordFailedAttempt(rateKey);
    return { error: GENERIC_ERROR };
  }

  // Mot de passe correct mais compte désactivé : message explicite autorisé
  if (!user.isActive) {
    return { error: "Ce compte a été désactivé. Contactez l'organisateur." };
  }

  clearAttempts(rateKey);
  await createSession(user.id);
  redirect(homeForRole(user.role));
}

/** Hash bcrypt d'une valeur aléatoire, utilisé pour égaliser les temps de réponse. */
const DUMMY_HASH =
  "$2b$12$C6UzMDM.H6dfI/f/IKcEeO7ZBpUvHzGE7ItYqEnROVFyF8xoDNdJm";

/** Déconnexion. */
export async function logout(): Promise<void> {
  await destroySession();
  redirect("/login");
}
