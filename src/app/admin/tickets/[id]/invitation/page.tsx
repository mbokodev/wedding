import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireUser } from "@/server/auth/guards";
import { db } from "@/server/db";
import { wedding } from "@/config/wedding";
import { generateQrDataUrl } from "@/lib/qrcode";
import { CopyLinkButton } from "@/components/admin/copy-link-button";
import { DownloadQrButton } from "@/components/admin/download-qr-button";

export const metadata: Metadata = {
  title: "Invitation",
};

export default async function TicketInvitationPage({
  params,
}: PageProps<"/admin/tickets/[id]/invitation">) {
  const user = await requireUser(["SUPER_ADMIN", "ADMIN"]);

  const { id } = await params;
  const ticket = await db.ticket.findUnique({
    where: { id },
    select: {
      id: true,
      reference: true,
      guestName: true,
      guestCount: true,
      token: true,
      status: true,
      createdById: true,
    },
  });

  if (!ticket) notFound();

  // Seul le propriétaire ou un SUPER_ADMIN peut voir l'invitation
  const isOwner = ticket.createdById === user.id;
  if (!isOwner && user.role !== "SUPER_ADMIN") {
    redirect("/admin/tickets");
  }

  const invitationUrl = `${wedding.meta.siteUrl}/invitation/${ticket.token}`;
  const qrDataUrl = await generateQrDataUrl(invitationUrl);

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
          Invitation {ticket.reference}
        </h1>
        <p className="mt-1 text-sm font-light text-cocoa-light">
          {ticket.guestName} · {ticket.guestCount}{" "}
          {ticket.guestCount > 1 ? "personnes" : "personne"}
        </p>
      </div>

      {ticket.status === "CANCELLED" && (
        <div className="border border-red-800/20 bg-red-50 px-5 py-4">
          <p className="text-sm text-red-900">
            Ce billet est annulé. L&apos;invitation ne sera pas valide au
            contrôle.
          </p>
        </div>
      )}

      <div className="grid gap-8 md:grid-cols-2">
        {/* QR Code */}
        <div className="flex flex-col items-center border border-cocoa/10 bg-white p-8">
          <div className="border border-gold/40 bg-white p-4">
            <Image
              src={qrDataUrl}
              alt={`QR code de l'invitation ${ticket.reference}`}
              width={240}
              height={240}
              unoptimized
            />
          </div>
          <p className="mt-4 font-mono text-sm text-gold-dark">
            {ticket.reference}
          </p>
          <div className="mt-6">
            <DownloadQrButton
              qrDataUrl={qrDataUrl}
              filename={`invitation-${ticket.reference}.png`}
            />
          </div>
        </div>

        {/* Lien et actions */}
        <div className="space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cocoa-light">
              Lien de l&apos;invitation
            </p>
            <div className="mt-2 flex items-center gap-3">
              <input
                type="text"
                readOnly
                value={invitationUrl}
                className="flex-1 border border-cocoa/20 bg-ivory-dark px-4 py-3 text-sm text-cocoa font-mono truncate"
              />
              <CopyLinkButton url={invitationUrl} />
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-cocoa-light">
              Actions
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={invitationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-cocoa/25 px-5 py-3 text-xs uppercase tracking-[0.2em] text-cocoa transition-colors hover:border-gold hover:bg-gold hover:text-ivory"
              >
                Voir l&apos;invitation
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden
                >
                  <path
                    d="M7 17L17 7M9 7h8v8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
              <Link
                href={`/admin/tickets/${ticket.id}`}
                className="inline-flex items-center gap-2 border border-cocoa/25 px-5 py-3 text-xs uppercase tracking-[0.2em] text-cocoa transition-colors hover:border-cocoa hover:bg-cocoa hover:text-ivory"
              >
                Modifier le billet
              </Link>
            </div>
          </div>

          <div className="border-t border-cocoa/10 pt-6">
            <p className="text-xs uppercase tracking-[0.2em] text-cocoa-light">
              Partager
            </p>
            <p className="mt-2 text-sm font-light text-cocoa-light">
              Envoyez ce lien par email, SMS ou WhatsApp. L&apos;invité pourra
              consulter son invitation et présenter le QR code le jour du
              mariage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
