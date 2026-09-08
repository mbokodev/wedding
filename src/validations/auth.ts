import { z } from "zod";

/**
 * Validation du formulaire de connexion.
 * Un seul champ "identifiant" acceptant email OU numéro de téléphone.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** Format international attendu en base : +237XXXXXXXXX (8 à 15 chiffres). */
const PHONE_REGEX = /^\+\d{8,15}$/;

/** Indicatif par défaut (Cameroun) appliqué aux numéros locaux à 9 chiffres. */
const DEFAULT_COUNTRY_PREFIX = "+237";

export type NormalizedIdentifier =
  | { kind: "email"; value: string }
  | { kind: "phone"; value: string };

/**
 * Normalise l'identifiant saisi :
 * - email → minuscules
 * - téléphone → suppression espaces/points/tirets, "00" → "+",
 *   numéro local à 9 chiffres commençant par 6 → préfixé +237
 * Retourne null si le format n'est ni un email ni un téléphone valide.
 */
export function normalizeIdentifier(raw: string): NormalizedIdentifier | null {
  const trimmed = raw.trim();

  if (trimmed.includes("@")) {
    const email = trimmed.toLowerCase();
    return EMAIL_REGEX.test(email) ? { kind: "email", value: email } : null;
  }

  let phone = trimmed.replace(/[\s.\-()]/g, "");
  if (phone.startsWith("00")) phone = `+${phone.slice(2)}`;
  if (/^6\d{8}$/.test(phone)) phone = `${DEFAULT_COUNTRY_PREFIX}${phone}`;

  return PHONE_REGEX.test(phone) ? { kind: "phone", value: phone } : null;
}

export const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, "Saisissez votre email ou votre numéro de téléphone")
    .max(254, "Identifiant trop long")
    .refine((value) => normalizeIdentifier(value) !== null, {
      message: "Format invalide : saisissez un email ou un numéro de téléphone",
    }),
  password: z
    .string()
    .min(1, "Saisissez votre mot de passe")
    .max(200, "Mot de passe trop long"),
});

export type LoginInput = z.infer<typeof loginSchema>;
