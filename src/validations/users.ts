import { z } from "zod";
import { normalizeIdentifier } from "@/validations/auth";

/**
 * Validation des formulaires de gestion des utilisateurs (SUPER_ADMIN).
 *
 * Règles métier :
 * - email OU téléphone requis (au moins un des deux)
 * - quota requis (>= 0) pour un ADMIN, sans objet pour les autres rôles
 * - mot de passe requis à la création, optionnel en modification
 */

const ROLES = ["SUPER_ADMIN", "ADMIN", "CHECK_IN_AGENT"] as const;

const baseFields = {
  fullName: z
    .string()
    .trim()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(120, "Nom trop long"),
  email: z.string().trim().max(254, "Email trop long"),
  phone: z.string().trim().max(30, "Numéro trop long"),
  role: z.enum(ROLES, { message: "Rôle invalide" }),
  quota: z.string().trim(),
};

const passwordRequired = z
  .string()
  .min(8, "Le mot de passe doit contenir au moins 8 caractères")
  .max(200, "Mot de passe trop long");

export const createUserSchema = z.object({
  ...baseFields,
  password: passwordRequired,
});

export const updateUserSchema = z.object({
  ...baseFields,
  // Vide = mot de passe inchangé
  password: z
    .string()
    .max(200, "Mot de passe trop long")
    .refine((v) => v === "" || v.length >= 8, {
      message: "Le mot de passe doit contenir au moins 8 caractères",
    }),
});

export type UserFormValues = z.infer<typeof createUserSchema>;

export type NormalizedUserInput = {
  fullName: string;
  email: string | null;
  phone: string | null;
  role: (typeof ROLES)[number];
  quota: number | null;
};

/**
 * Normalise et valide les champs métier communs (email/phone/quota).
 * Retourne soit les valeurs prêtes pour la base, soit un message d'erreur.
 */
export function normalizeUserInput(
  values: Omit<UserFormValues, "password">
): { data: NormalizedUserInput } | { error: string } {
  // Email
  let email: string | null = null;
  if (values.email !== "") {
    const normalized = normalizeIdentifier(values.email);
    if (!normalized || normalized.kind !== "email") {
      return { error: "Format d'email invalide." };
    }
    email = normalized.value;
  }

  // Téléphone (mêmes règles de normalisation que le login : +237 par défaut)
  let phone: string | null = null;
  if (values.phone !== "") {
    const normalized = normalizeIdentifier(values.phone);
    if (!normalized || normalized.kind !== "phone") {
      return {
        error:
          "Format de téléphone invalide (ex : 6XX XX XX XX ou +237 6XX XX XX XX).",
      };
    }
    phone = normalized.value;
  }

  if (!email && !phone) {
    return { error: "Renseignez au moins un email ou un numéro de téléphone." };
  }

  // Quota : uniquement pour les ADMIN
  let quota: number | null = null;
  if (values.role === "ADMIN") {
    if (values.quota === "") {
      return { error: "Le quota est requis pour un admin." };
    }
    const parsed = Number(values.quota);
    if (!Number.isInteger(parsed) || parsed < 0 || parsed > 100000) {
      return { error: "Le quota doit être un nombre entier positif." };
    }
    quota = parsed;
  }

  return {
    data: { fullName: values.fullName, email, phone, role: values.role, quota },
  };
}
