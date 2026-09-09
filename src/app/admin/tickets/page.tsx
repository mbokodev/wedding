import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/server/auth/guards";
import { db } from "@/server/db";
import { getQuotaUsedBy } from "@/server/queries/stats";
import { cancelTicket, reactivateTicket } from "@/features/tickets/actions";
import { TicketStatusForm } from "@/features/tickets/ticket-status-form";

export const metadata: Metadata = {
  title: "Mes billets",
};

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  ACTIVE: { label: "Actif", className: "text-sage-dark" },
  CHECKED_IN: { label: "Scanné", className: "text-gold-dark" },
  CANCELLED: { label: "Annulé", className: "text-red-700" },
};

export default async function TicketsPage() {
  const user = await requireUser(["SUPER_ADMIN", "ADMIN"]);

  // SUPER_ADMIN voit tous les billets, ADMIN voit uniquement les siens
  const isSuperAdmin = user.role === "SUPER_ADMIN";

  const [tickets, quotaUsed] = await Promise.all([
    db.ticket.findMany({
      where: isSuperAdmin ? {} : { createdById: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        createdBy: { select: { fullName: true } },
        checkIn: { select: { checkedInAt: true } },
      },
    }),
    user.quota !== null ? getQuotaUsedBy(user.id) : Promise.resolve(0),
  ]);

  const quotaRemaining = user.quota !== null ? user.quota - quotaUsed : null;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-light text-cocoa">
            {isSuperAdmin ? "Tous les billets" : "Mes billets"}
          </h1>
          {quotaRemaining !== null && (
            <p className="mt-1 text-sm font-light text-cocoa-light">
              {quotaUsed} / {user.quota} personnes invitées
              {quotaRemaining > 0 && ` · ${quotaRemaining} places restantes`}
            </p>
          )}
        </div>
        <Link
          href="/admin/tickets/new"
          className="bg-cocoa px-6 py-3 text-xs uppercase tracking-[0.25em] text-ivory transition-colors hover:bg-night"
        >
          Nouveau billet
        </Link>
      </div>

      {tickets.length === 0 ? (
        <p className="text-sm font-light text-cocoa-light">
          Aucun billet pour le moment.
        </p>
      ) : (
        <div className="overflow-x-auto border border-cocoa/10 bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-cocoa/10 text-[11px] uppercase tracking-[0.18em] text-cocoa-light">
                <th className="px-5 py-4 font-medium">Référence</th>
                <th className="px-5 py-4 font-medium">Invité</th>
                <th className="px-5 py-4 font-medium">Personnes</th>
                {isSuperAdmin && (
                  <th className="px-5 py-4 font-medium">Créé par</th>
                )}
                <th className="px-5 py-4 font-medium">Statut</th>
                <th className="px-5 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => {
                const status = STATUS_LABELS[ticket.status];
                const canModify =
                  ticket.status !== "CHECKED_IN" &&
                  (isSuperAdmin || ticket.createdById === user.id);

                return (
                  <tr
                    key={ticket.id}
                    className="border-b border-cocoa/5 last:border-0"
                  >
                    <td className="px-5 py-4 font-mono text-xs text-cocoa-light">
                      {ticket.reference}
                    </td>
                    <td className="px-5 py-4 text-cocoa">{ticket.guestName}</td>
                    <td className="px-5 py-4 tabular-nums text-cocoa-light">
                      {ticket.guestCount}
                    </td>
                    {isSuperAdmin && (
                      <td className="px-5 py-4 text-cocoa-light">
                        {ticket.createdBy.fullName}
                      </td>
                    )}
                    <td className="px-5 py-4">
                      <span className={status.className}>{status.label}</span>
                      {ticket.checkIn && (
                        <span className="ml-2 text-[10px] text-cocoa/50">
                          {new Date(ticket.checkIn.checkedInAt).toLocaleString(
                            "fr-FR",
                            { dateStyle: "short", timeStyle: "short" }
                          )}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-4">
                        <Link
                          href={`/admin/tickets/${ticket.id}/invitation`}
                          className="text-xs uppercase tracking-[0.15em] text-cocoa-light underline-offset-4 hover:underline hover:text-cocoa"
                        >
                          Invitation
                        </Link>
                        {canModify && ticket.status === "ACTIVE" && (
                          <>
                            <Link
                              href={`/admin/tickets/${ticket.id}`}
                              className="text-xs uppercase tracking-[0.15em] text-gold-dark underline-offset-4 hover:underline"
                            >
                              Modifier
                            </Link>
                            <TicketStatusForm
                              action={cancelTicket.bind(null, ticket.id)}
                              actionType="cancel"
                              guestName={ticket.guestName}
                            />
                          </>
                        )}
                        {canModify && ticket.status === "CANCELLED" && (
                          <TicketStatusForm
                            action={reactivateTicket.bind(null, ticket.id)}
                            actionType="reactivate"
                            guestName={ticket.guestName}
                          />
                        )}
                        {ticket.status === "CHECKED_IN" && (
                          <span className="text-xs text-cocoa/40">
                            Scanné
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs font-light text-cocoa-light">
        Les billets scannés ne peuvent plus être modifiés. L&rsquo;annulation
        libère le quota correspondant.
      </p>
    </div>
  );
}
