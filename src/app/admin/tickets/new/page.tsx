import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/server/auth/guards";
import { getQuotaUsedBy } from "@/server/queries/stats";
import { createTicket } from "@/features/tickets/actions";
import { TicketForm } from "@/features/tickets/ticket-form";

export const metadata: Metadata = {
  title: "Nouveau billet",
};

export default async function NewTicketPage() {
  const user = await requireUser(["SUPER_ADMIN", "ADMIN"]);

  const quotaUsed = user.quota !== null ? await getQuotaUsedBy(user.id) : 0;
  const quotaRemaining = user.quota !== null ? user.quota - quotaUsed : null;

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
          Nouveau billet
        </h1>
      </div>

      <TicketForm
        mode="create"
        action={createTicket}
        quotaRemaining={quotaRemaining}
        defaults={{
          guestName: "",
          guestCount: "1",
        }}
      />
    </div>
  );
}
