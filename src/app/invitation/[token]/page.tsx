import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { wedding } from "@/config/wedding";
import { getInvitationByToken } from "@/server/invitations";
import { generateQrDataUrl } from "@/lib/qrcode";
import { InvitationCard } from "@/components/invitation/invitation-card";
import { PrintButton } from "@/components/invitation/print-button";

export const metadata: Metadata = {
  title: "Invitation",
  robots: { index: false, follow: false },
};

export default async function InvitationPage({
  params,
}: PageProps<"/invitation/[token]">) {
  const { token } = await params;
  const invitation = await getInvitationByToken(token);

  if (!invitation) notFound();

  const invitationUrl = `${wedding.meta.siteUrl}/invitation/${invitation.token}`;
  const qrDataUrl = await generateQrDataUrl(invitationUrl);

  return (
    <main className="min-h-svh bg-ivory-dark px-4 py-10 md:py-16 print:bg-white print:p-0">
      <div className="mx-auto max-w-md print:max-w-none">
        <InvitationCard
          guestName={invitation.guestName}
          guestCount={invitation.guestCount}
          reference={invitation.reference}
          qrDataUrl={qrDataUrl}
        />

        {/* Actions (masquées à l'impression) */}
        <div className="no-print mt-8 flex flex-col items-center gap-4">
          <PrintButton />
          <Link
            href="/"
            className="text-xs uppercase tracking-[0.2em] text-cocoa-light underline-offset-4 transition-colors hover:text-gold hover:underline"
          >
            Découvrir le site du mariage
          </Link>
        </div>
      </div>
    </main>
  );
}
