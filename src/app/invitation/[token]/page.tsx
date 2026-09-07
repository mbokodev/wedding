import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { wedding } from "@/config/wedding";
import { getInvitationByToken } from "@/server/invitations";
import { generateQrDataUrl } from "@/lib/qrcode";
import { PrintButton } from "@/components/invitation/print-button";

export const metadata: Metadata = {
  title: "Invitation",
  robots: { index: false, follow: false },
};

/** Ornement décoratif (feuillage doré stylisé). */
function Ornament({ flipped = false }: { flipped?: boolean }) {
  return (
    <svg
      width="120"
      height="28"
      viewBox="0 0 120 28"
      fill="none"
      aria-hidden
      className={flipped ? "rotate-180" : undefined}
    >
      <path
        d="M4 14h44m24 0h44"
        stroke="#B08D57"
        strokeOpacity="0.6"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M60 6c-3 3-3 13 0 16 3-3 3-13 0-16z"
        stroke="#B08D57"
        strokeWidth="1"
        fill="none"
      />
      <circle cx="52" cy="14" r="1.5" fill="#B08D57" fillOpacity="0.7" />
      <circle cx="68" cy="14" r="1.5" fill="#B08D57" fillOpacity="0.7" />
    </svg>
  );
}

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
      {/* Carte d'invitation */}
      <div className="mx-auto max-w-md print:max-w-none">
        <div className="relative border border-gold/50 bg-ivory p-2 shadow-[0_8px_40px_rgba(62,47,35,0.12)] print:shadow-none">
          <div className="border border-gold/30 px-6 py-10 md:px-10 md:py-12 text-center">
            <p className="text-[10px] uppercase tracking-[0.35em] text-gold-dark">
              Invitation
            </p>

            <div className="mt-6 flex justify-center">
              <Ornament />
            </div>

            <h1 className="mt-6 font-script text-5xl md:text-6xl leading-tight text-cocoa">
              {wedding.couple.partner1}
              <span className="mx-2 text-gold">&amp;</span>
              {wedding.couple.partner2}
            </h1>

            <p className="mx-auto mt-6 max-w-xs font-serif text-base md:text-lg font-light italic leading-relaxed text-cocoa-light">
              {wedding.texts.invitationMessage}
            </p>

            {/* Invité */}
            <div className="mt-8 bg-champagne-light/50 px-4 py-6">
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold-dark">
                Au nom de
              </p>
              <p className="mt-2 font-serif text-2xl md:text-3xl text-cocoa">
                {invitation.guestName}
              </p>
              <p className="mt-2 text-sm font-light text-cocoa-light">
                {invitation.guestCount}{" "}
                {invitation.guestCount > 1 ? "personnes" : "personne"}
              </p>
            </div>

            {/* Date & lieu */}
            <div className="mt-8 space-y-1.5">
              <p className="font-serif text-xl md:text-2xl tracking-[0.1em] text-cocoa">
                {wedding.date.display}
              </p>
              <p className="text-xs uppercase tracking-[0.25em] text-cocoa-light">
                {wedding.location.display}
              </p>
            </div>

            <div className="mt-8 flex justify-center">
              <Ornament flipped />
            </div>

            {/* QR Code */}
            <div className="mt-8 flex flex-col items-center">
              <div className="border border-gold/40 bg-white p-3">
                <Image
                  src={qrDataUrl}
                  alt={`QR code de l'invitation ${invitation.reference}`}
                  width={160}
                  height={160}
                  unoptimized
                />
              </div>
              <p className="mt-3 text-[10px] uppercase tracking-[0.25em] text-cocoa-light">
                À présenter le jour du mariage
              </p>
              <p className="mt-1 font-mono text-[11px] text-gold-dark">
                {invitation.reference}
              </p>
            </div>
          </div>
        </div>

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
