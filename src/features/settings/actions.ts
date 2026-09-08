"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/server/db";
import { requireUserOrThrow } from "@/server/auth/guards";

export type SettingsState = {
  error: string | null;
  success: boolean;
};

const settingsSchema = z.object({
  totalGuestCapacity: z.coerce
    .number({ message: "Capacité invalide" })
    .int("La capacité doit être un nombre entier")
    .min(1, "La capacité doit être d'au moins 1 personne")
    .max(1000000, "Capacité trop élevée"),
});

/** Mise à jour de la capacité totale (SUPER_ADMIN uniquement). */
export async function updateSettings(
  _prevState: SettingsState,
  formData: FormData
): Promise<SettingsState> {
  await requireUserOrThrow(["SUPER_ADMIN"]);

  const parsed = settingsSchema.safeParse({
    totalGuestCapacity: formData.get("totalGuestCapacity"),
  });
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Formulaire invalide.",
      success: false,
    };
  }

  const capacity = parsed.data.totalGuestCapacity;

  // La capacité ne peut pas descendre sous le nombre de personnes déjà invitées.
  const invited = await db.ticket.aggregate({
    where: { status: { not: "CANCELLED" } },
    _sum: { guestCount: true },
  });
  const invitedGuests = invited._sum.guestCount ?? 0;
  if (capacity < invitedGuests) {
    return {
      error: `Capacité trop basse : ${invitedGuests} personnes sont déjà invitées.`,
      success: false,
    };
  }

  await db.weddingSettings.upsert({
    where: { id: 1 },
    update: { totalGuestCapacity: capacity },
    create: { id: 1, totalGuestCapacity: capacity },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/settings");
  return { error: null, success: true };
}
