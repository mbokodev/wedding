"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { requireUserOrThrow } from "@/server/auth/guards";
import { ticketSchema } from "@/validations/tickets";
import {
  generateTicketToken,
  formatTicketReference,
} from "@/server/ticket-utils";

export type TicketActionState = {
  error: string | null;
};

/** Récupère la prochaine référence lisible depuis la séquence Postgres. */
async function nextReference(): Promise<string> {
  const [{ nextval }] = await db.$queryRaw<[{ nextval: bigint }]>`
    SELECT nextval('ticket_reference_seq')
  `;
  return formatTicketReference(nextval);
}

/** Calcule le quota utilisé par un utilisateur (billets non annulés). */
async function getQuotaUsed(userId: string): Promise<number> {
  const agg = await db.ticket.aggregate({
    where: { createdById: userId, status: { not: "CANCELLED" } },
    _sum: { guestCount: true },
  });
  return agg._sum.guestCount ?? 0;
}

function formValues(formData: FormData) {
  return {
    guestName: formData.get("guestName"),
    guestCount: formData.get("guestCount"),
  };
}

/** Création d'un billet (ADMIN / SUPER_ADMIN). */
export async function createTicket(
  _prevState: TicketActionState,
  formData: FormData
): Promise<TicketActionState> {
  const user = await requireUserOrThrow(["SUPER_ADMIN", "ADMIN"]);

  const parsed = ticketSchema.safeParse(formValues(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  }

  const { guestName, guestCount } = parsed.data;

  // Vérification du quota (SUPER_ADMIN = illimité)
  if (user.quota !== null) {
    const used = await getQuotaUsed(user.id);
    if (used + guestCount > user.quota) {
      const remaining = user.quota - used;
      return {
        error:
          remaining <= 0
            ? "Votre quota est épuisé."
            : `Quota insuffisant : il vous reste ${remaining} place${remaining > 1 ? "s" : ""}.`,
      };
    }
  }

  const reference = await nextReference();
  const token = generateTicketToken();

  await db.ticket.create({
    data: {
      reference,
      guestName,
      guestCount,
      token,
      createdById: user.id,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/tickets");
  redirect("/admin/tickets");
}

/** Modification d'un billet (propriétaire ou SUPER_ADMIN). */
export async function updateTicket(
  ticketId: string,
  _prevState: TicketActionState,
  formData: FormData
): Promise<TicketActionState> {
  const user = await requireUserOrThrow(["SUPER_ADMIN", "ADMIN"]);

  const parsed = ticketSchema.safeParse(formValues(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  }

  const { guestName, guestCount } = parsed.data;

  const ticket = await db.ticket.findUnique({
    where: { id: ticketId },
    select: {
      id: true,
      guestCount: true,
      status: true,
      createdById: true,
      createdBy: { select: { quota: true } },
    },
  });

  if (!ticket) return { error: "Billet introuvable." };

  // Seul le propriétaire ou un SUPER_ADMIN peut modifier
  const isOwner = ticket.createdById === user.id;
  if (!isOwner && user.role !== "SUPER_ADMIN") {
    return { error: "Vous ne pouvez pas modifier ce billet." };
  }

  // Un billet scanné ne peut plus être modifié
  if (ticket.status === "CHECKED_IN") {
    return { error: "Ce billet a déjà été scanné et ne peut plus être modifié." };
  }

  // Vérification du quota si guestCount augmente
  const delta = guestCount - ticket.guestCount;
  if (delta > 0) {
    // Le quota à vérifier est celui du créateur du billet, pas forcément l'utilisateur courant
    const creatorQuota = ticket.createdBy.quota;
    if (creatorQuota !== null) {
      const used = await getQuotaUsed(ticket.createdById);
      if (used + delta > creatorQuota) {
        const remaining = creatorQuota - used;
        return {
          error:
            remaining <= 0
              ? "Le quota du créateur de ce billet est épuisé."
              : `Quota insuffisant : ${remaining} place${remaining > 1 ? "s" : ""} restante${remaining > 1 ? "s" : ""}.`,
        };
      }
    }
  }

  await db.ticket.update({
    where: { id: ticketId },
    data: { guestName, guestCount },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/tickets");
  redirect("/admin/tickets");
}

/** Annulation d'un billet (propriétaire ou SUPER_ADMIN). */
export async function cancelTicket(
  ticketId: string,
  _prevState: TicketActionState,
  _formData: FormData
): Promise<TicketActionState> {
  const user = await requireUserOrThrow(["SUPER_ADMIN", "ADMIN"]);

  const ticket = await db.ticket.findUnique({
    where: { id: ticketId },
    select: { id: true, status: true, createdById: true },
  });

  if (!ticket) return { error: "Billet introuvable." };

  const isOwner = ticket.createdById === user.id;
  if (!isOwner && user.role !== "SUPER_ADMIN") {
    return { error: "Vous ne pouvez pas annuler ce billet." };
  }

  if (ticket.status === "CHECKED_IN") {
    return { error: "Ce billet a déjà été scanné et ne peut plus être annulé." };
  }

  if (ticket.status === "CANCELLED") {
    return { error: "Ce billet est déjà annulé." };
  }

  await db.ticket.update({
    where: { id: ticketId },
    data: { status: "CANCELLED" },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/tickets");
  return { error: null };
}

/** Réactivation d'un billet annulé (propriétaire ou SUPER_ADMIN). */
export async function reactivateTicket(
  ticketId: string,
  _prevState: TicketActionState,
  _formData: FormData
): Promise<TicketActionState> {
  const user = await requireUserOrThrow(["SUPER_ADMIN", "ADMIN"]);

  const ticket = await db.ticket.findUnique({
    where: { id: ticketId },
    select: {
      id: true,
      guestCount: true,
      status: true,
      createdById: true,
      createdBy: { select: { quota: true } },
    },
  });

  if (!ticket) return { error: "Billet introuvable." };

  const isOwner = ticket.createdById === user.id;
  if (!isOwner && user.role !== "SUPER_ADMIN") {
    return { error: "Vous ne pouvez pas réactiver ce billet." };
  }

  if (ticket.status !== "CANCELLED") {
    return { error: "Ce billet n'est pas annulé." };
  }

  // Vérification du quota (réactiver = consommer à nouveau du quota)
  const creatorQuota = ticket.createdBy.quota;
  if (creatorQuota !== null) {
    const used = await getQuotaUsed(ticket.createdById);
    if (used + ticket.guestCount > creatorQuota) {
      const remaining = creatorQuota - used;
      return {
        error:
          remaining <= 0
            ? "Le quota du créateur de ce billet est épuisé."
            : `Quota insuffisant pour réactiver : ${remaining} place${remaining > 1 ? "s" : ""} restante${remaining > 1 ? "s" : ""}.`,
      };
    }
  }

  await db.ticket.update({
    where: { id: ticketId },
    data: { status: "ACTIVE" },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/tickets");
  return { error: null };
}
