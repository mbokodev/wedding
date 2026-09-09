import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireUser } from "@/server/auth/guards";
import { db } from "@/server/db";
import { getQuotaUsedBy } from "@/server/queries/stats";
import { updateTicket } from "@/features/tickets/actions";
import { TicketForm } from "@/features/tickets/ticket-form";

export const metadata: Metadata = {
  title: "Modifier un billet",
};

export default async function EditTicketPage({
  params,
}: PageProps<"/admin/tickets/[id]">) {
  const user = await requireUser(["SUPER_ADMIN", "ADMIN"]);

  const { id } = await params;
  const ticket = await db.ticket.findUnique({
    where: { id },
    select: {
      id: true,
      reference: true,
      guestName: true,
      guestCount: true,
      status: true,
      createdById: true,
      createdBy: { select: { fullName: true, quota: true } },
    },
  });

  if (!ticket) notFound();

  // Seul le propriétaire ou un SUPER_ADMIN peut modifier
  const isOwner = ticket.createdById === user.id;
  if (!isOwner && user.role !== "SUPER_ADMIN") {
    redirect("/admin/tickets");
  }

  // Un billet scanné ne peut plus être modifié
  if (ticket.status === "CHECKED_IN") {
    redirect("/admin/tickets");
  }

  // Quota restant du créateur du billet
  const creatorQuota = ticket.createdBy.quota;
  const quotaUsed =
    creatorQuota !== null ? await getQuotaUsedBy(ticket.createdById) : 0;
  const quotaRemaining = creatorQuota !== null ? creatorQuota - quotaUsed : null;

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/admin/tickets"
          className="text-xs uppercase tracking-[0.2em] text-cocoa-light underline-offset-4 hover:underline"
        >
          ← Billets
        </Link>
        <h1 className="mt-3 font-serif text-3xl font-light text-cocoa">
          {ticket.reference}
          {ticket.status === "CANCELLED" && (
            <span className="ml-3 align-middle text-xs font-sans uppercase tracking-wide text-red-700">
              annulé
            </span>
          )}
        </h1>
        {!isOwner && (
          <p className="mt-1 text-sm font-light text-cocoa-light">
            Créé par {ticket.createdBy.fullName}
          </p>
        )}
      </div>

      <TicketForm
        mode="edit"
        action={updateTicket.bind(null, ticket.id)}
        quotaRemaining={quotaRemaining}
        defaults={{
          guestName: ticket.guestName,
          guestCount: String(ticket.guestCount),
        }}
      />
    </div>
  );
}
