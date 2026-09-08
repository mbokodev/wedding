import type { Metadata } from "next";
import { requireUser } from "@/server/auth/guards";
import { db } from "@/server/db";
import { SettingsForm } from "@/features/settings/settings-form";

export const metadata: Metadata = {
  title: "Paramètres",
};

export default async function SettingsPage() {
  await requireUser(["SUPER_ADMIN"]);

  const [settings, invited] = await Promise.all([
    db.weddingSettings.findUnique({ where: { id: 1 } }),
    db.ticket.aggregate({
      where: { status: { not: "CANCELLED" } },
      _sum: { guestCount: true },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-light text-cocoa">Paramètres</h1>
        <p className="mt-2 text-sm font-light text-cocoa-light">
          La capacité totale sert de plafond global : la somme des quotas et des
          invitations ne devrait pas la dépasser.
        </p>
      </div>

      <SettingsForm
        currentCapacity={settings?.totalGuestCapacity ?? 500}
        invitedGuests={invited._sum.guestCount ?? 0}
      />
    </div>
  );
}
