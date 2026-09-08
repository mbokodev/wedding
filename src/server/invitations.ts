import "server-only";
import { db } from "@/server/db";

/**
 * Accès public aux invitations (page /invitation/[token]).
 * Un billet annulé ou inexistant → null → 404 côté page.
 */

export type PublicInvitation = {
  /** Référence lisible, ex: INV-000125 */
  reference: string;
  /** Nom affiché sur l'invitation, ex: "Famille Nampa" */
  guestName: string;
  /** Nombre de personnes couvertes par le billet */
  guestCount: number;
  /** Token unique du billet (présent dans l'URL et le QR code) */
  token: string;
};

/** Retourne l'invitation correspondant au token, ou null si introuvable/annulée. */
export async function getInvitationByToken(
  token: string
): Promise<PublicInvitation | null> {
  // Garde-fou : évite une requête inutile sur un token manifestement invalide
  if (!token || token.length > 64) return null;

  const ticket = await db.ticket.findUnique({
    where: { token },
    select: {
      reference: true,
      guestName: true,
      guestCount: true,
      token: true,
      status: true,
    },
  });

  if (!ticket || ticket.status === "CANCELLED") return null;

  return {
    reference: ticket.reference,
    guestName: ticket.guestName,
    guestCount: ticket.guestCount,
    token: ticket.token,
  };
}
