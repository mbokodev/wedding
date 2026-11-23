import type { Metadata } from "next";
import Link from "next/link";
import { InvitationCard } from "@/components/invitation/invitation-card";
import { requireUser } from "@/server/auth/guards";

export const metadata: Metadata = { title: "Modèle du billet soirée" };

export default async function TicketPreviewPage() {
  await requireUser(["SUPER_ADMIN", "ADMIN"]);
  return <div className="space-y-6">
    <Link href="/admin/tickets" className="text-sm text-cocoa-light">← Retour aux billets</Link>
    <div><h1 className="font-serif text-3xl text-cocoa">Une soirée à vos côtés</h1><p className="mt-2 text-sm text-cocoa-light">Aperçu du modèle · Le QR code sera ajouté sur chaque billet nominatif.</p></div>
    <div className="mx-auto w-full max-w-[720px]"><InvitationCard guestName="Nampa" guestCount={2} reference="APERÇU · NON VALABLE" /></div>
  </div>;
}
