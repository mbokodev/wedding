"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { requireUserOrThrow } from "@/server/auth/guards";
import { hashPassword } from "@/server/auth/password";
import { revokeUserSessions } from "@/server/auth/session";
import { getQuotaUsedBy } from "@/server/queries/stats";
import {
  createUserSchema,
  updateUserSchema,
  normalizeUserInput,
} from "@/validations/users";

export type UserActionState = {
  error: string | null;
};

/** Violation de contrainte unique Prisma (email ou téléphone déjà pris). */
function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "P2002"
  );
}

const UNIQUE_ERROR = "Cet email ou ce numéro de téléphone est déjà utilisé.";

function formValues(formData: FormData) {
  return {
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    role: formData.get("role"),
    quota: formData.get("quota"),
    password: formData.get("password"),
  };
}

/** Création d'un utilisateur (SUPER_ADMIN uniquement). */
export async function createUser(
  _prevState: UserActionState,
  formData: FormData
): Promise<UserActionState> {
  await requireUserOrThrow(["SUPER_ADMIN"]);

  const parsed = createUserSchema.safeParse(formValues(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  }

  const normalized = normalizeUserInput(parsed.data);
  if ("error" in normalized) return { error: normalized.error };

  try {
    await db.user.create({
      data: {
        ...normalized.data,
        passwordHash: await hashPassword(parsed.data.password),
      },
    });
  } catch (error) {
    if (isUniqueViolation(error)) return { error: UNIQUE_ERROR };
    throw error;
  }

  revalidatePath("/admin");
  revalidatePath("/admin/users");
  redirect("/admin/users");
}

/** Modification d'un utilisateur (SUPER_ADMIN uniquement). */
export async function updateUser(
  userId: string,
  _prevState: UserActionState,
  formData: FormData
): Promise<UserActionState> {
  const currentUser = await requireUserOrThrow(["SUPER_ADMIN"]);

  const parsed = updateUserSchema.safeParse(formValues(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  }

  const normalized = normalizeUserInput(parsed.data);
  if ("error" in normalized) return { error: normalized.error };
  const { data } = normalized;

  const target = await db.user.findUnique({ where: { id: userId } });
  if (!target) return { error: "Utilisateur introuvable." };

  // Garde-fou : le super admin ne peut pas se rétrograder lui-même
  // (sinon plus personne ne peut gérer les utilisateurs).
  if (target.id === currentUser.id && data.role !== "SUPER_ADMIN") {
    return { error: "Vous ne pouvez pas modifier votre propre rôle." };
  }

  // Un quota ne peut pas descendre sous le nombre de personnes déjà invitées.
  if (data.role === "ADMIN" && data.quota !== null) {
    const used = await getQuotaUsedBy(userId);
    if (data.quota < used) {
      return {
        error: `Quota trop bas : ${used} personnes sont déjà invitées par cet admin.`,
      };
    }
  }

  const passwordChanged = parsed.data.password !== "";

  try {
    await db.user.update({
      where: { id: userId },
      data: {
        ...data,
        ...(passwordChanged
          ? { passwordHash: await hashPassword(parsed.data.password) }
          : {}),
      },
    });
  } catch (error) {
    if (isUniqueViolation(error)) return { error: UNIQUE_ERROR };
    throw error;
  }

  // Sécurité : un changement de mot de passe invalide les sessions existantes.
  if (passwordChanged) await revokeUserSessions(userId);

  revalidatePath("/admin");
  revalidatePath("/admin/users");
  redirect("/admin/users");
}

/** Activation / désactivation d'un utilisateur (SUPER_ADMIN uniquement). */
export async function setUserActive(
  userId: string,
  isActive: boolean,
  _prevState: UserActionState,
  _formData: FormData
): Promise<UserActionState> {
  const currentUser = await requireUserOrThrow(["SUPER_ADMIN"]);

  if (userId === currentUser.id) {
    return { error: "Vous ne pouvez pas désactiver votre propre compte." };
  }

  const target = await db.user.findUnique({ where: { id: userId } });
  if (!target) return { error: "Utilisateur introuvable." };

  await db.user.update({ where: { id: userId }, data: { isActive } });

  // Désactivation = accès coupé immédiatement (sessions révoquées).
  if (!isActive) await revokeUserSessions(userId);

  revalidatePath("/admin");
  revalidatePath("/admin/users");
  return { error: null };
}
