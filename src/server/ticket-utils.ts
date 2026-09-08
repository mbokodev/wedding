import { randomBytes } from "node:crypto";

/**
 * Utilitaires de génération pour les billets.
 * (Pas de "server-only" ici : ce module est aussi utilisé par le seed Prisma.)
 */

/** Alphabet sans caractères ambigus (pas de 0/O, 1/I/L…). */
const TOKEN_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const TOKEN_LENGTH = 28;

/**
 * Génère un token opaque cryptographiquement aléatoire (~139 bits d'entropie).
 * Utilisé dans l'URL publique de l'invitation et encodé dans le QR code.
 */
export function generateTicketToken(): string {
  const bytes = randomBytes(TOKEN_LENGTH);
  let token = "";
  for (let i = 0; i < TOKEN_LENGTH; i++) {
    token += TOKEN_ALPHABET[bytes[i] % TOKEN_ALPHABET.length];
  }
  return token;
}

/** Formate un numéro de séquence en référence lisible : 125 → INV-000125 */
export function formatTicketReference(sequenceNumber: number | bigint): string {
  return `INV-${String(sequenceNumber).padStart(6, "0")}`;
}
