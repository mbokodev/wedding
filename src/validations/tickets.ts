import { z } from "zod";

/**
 * Validation des formulaires de gestion des billets (ADMIN / SUPER_ADMIN).
 */

export const ticketSchema = z.object({
  guestName: z
    .string()
    .trim()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(120, "Nom trop long"),
  guestCount: z.coerce
    .number({ message: "Nombre invalide" })
    .int("Le nombre doit être un entier")
    .min(1, "Au moins 1 personne requise")
    .max(50, "Maximum 50 personnes par billet"),
});

export type TicketFormValues = z.infer<typeof ticketSchema>;
