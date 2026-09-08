import "server-only";
import { db } from "@/server/db";

/**
 * Statistiques globales du mariage (dashboard SUPER_ADMIN).
 * Tout est recalculé à la demande depuis la base : aucune valeur dérivée
 * n'est stockée (source de vérité = tickets + check-ins).
 */

export type GlobalStats = {
  /** Capacité totale de la salle (WeddingSettings). */
  totalGuestCapacity: number;
  /** Somme des personnes couvertes par les billets non annulés. */
  invitedGuests: number;
  /** Capacité restante (peut être négative en cas de dépassement). */
  remainingCapacity: number;
  /** Nombre de billets non annulés. */
  ticketsTotal: number;
  /** Nombre de billets déjà scannés. */
  ticketsScanned: number;
  /** Somme des personnes réellement entrées (check-ins). */
  guestsEntered: number;
  /** Admins actifs. */
  activeAdmins: number;
  /** Agents check-in actifs. */
  activeAgents: number;
};

export async function getGlobalStats(): Promise<GlobalStats> {
  const [settings, invited, ticketsScanned, entered, activeAdmins, activeAgents] =
    await Promise.all([
      db.weddingSettings.findUnique({ where: { id: 1 } }),
      db.ticket.aggregate({
        where: { status: { not: "CANCELLED" } },
        _sum: { guestCount: true },
        _count: true,
      }),
      db.ticket.count({ where: { status: "CHECKED_IN" } }),
      db.checkIn.aggregate({ _sum: { guestCount: true } }),
      db.user.count({ where: { role: "ADMIN", isActive: true } }),
      db.user.count({ where: { role: "CHECK_IN_AGENT", isActive: true } }),
    ]);

  const totalGuestCapacity = settings?.totalGuestCapacity ?? 0;
  const invitedGuests = invited._sum.guestCount ?? 0;

  return {
    totalGuestCapacity,
    invitedGuests,
    remainingCapacity: totalGuestCapacity - invitedGuests,
    ticketsTotal: invited._count,
    ticketsScanned,
    guestsEntered: entered._sum.guestCount ?? 0,
    activeAdmins,
    activeAgents,
  };
}

/**
 * Personnes invitées (billets non annulés) par créateur de billets.
 * Utilisé pour la répartition des quotas et la liste des utilisateurs.
 */
export async function getQuotaUsageByUser(): Promise<Map<string, number>> {
  const rows = await db.ticket.groupBy({
    by: ["createdById"],
    where: { status: { not: "CANCELLED" } },
    _sum: { guestCount: true },
  });
  return new Map(rows.map((r) => [r.createdById, r._sum.guestCount ?? 0]));
}

/** Personnes invitées par un utilisateur donné (billets non annulés). */
export async function getQuotaUsedBy(userId: string): Promise<number> {
  const agg = await db.ticket.aggregate({
    where: { createdById: userId, status: { not: "CANCELLED" } },
    _sum: { guestCount: true },
  });
  return agg._sum.guestCount ?? 0;
}
