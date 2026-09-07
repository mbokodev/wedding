import "server-only";

/**
 * Accès aux invitations côté serveur.
 *
 * PHASE ACTUELLE (site public) : données de démonstration en mémoire.
 * PHASE 3+ : ce module sera branché sur PostgreSQL via Prisma —
 * seule l'implémentation de `getInvitationByToken` changera,
 * la page /invitation/[token] restera identique.
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

/** Billets fictifs pour prévisualiser le design de l'invitation. */
const DEMO_INVITATIONS: PublicInvitation[] = [
  {
    reference: "INV-000001",
    guestName: "Famille Nampa",
    guestCount: 4,
    token: "DEMO-FAMILLE-NAMPA",
  },
  {
    reference: "INV-000002",
    guestName: "M. & Mme Talla",
    guestCount: 2,
    token: "DEMO-TALLA",
  },
  {
    reference: "INV-000003",
    guestName: "Mlle Sandrine Ekotto",
    guestCount: 1,
    token: "DEMO-SANDRINE",
  },
];

/** Retourne l'invitation correspondant au token, ou null si introuvable. */
export async function getInvitationByToken(
  token: string
): Promise<PublicInvitation | null> {
  return DEMO_INVITATIONS.find((i) => i.token === token) ?? null;
}
