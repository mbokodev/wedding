import Image from "next/image";
import "./invitation-card.css";

export type InvitationCardProps = { guestName: string; guestCount: number; reference: string; qrDataUrl?: string };

/** Le visuel fourni reste intact ; seuls le destinataire et le QR sont personnalisés. */
export function InvitationCard({ guestName, guestCount, reference, qrDataUrl }: InvitationCardProps) {
  const couple = guestCount === 2;
  const displayName = couple && !/^(m\.?\s*(&|et)\s*mme\.?|monsieur|famille)\b/i.test(guestName) ? `M. & Mme ${guestName}` : guestName;
  const nameSize = displayName.length > 60 ? "2cqw" : displayName.length > 32 ? "2.8cqw" : "3.6cqw";

  return <article className="evening-ticket" aria-label={`Invitation au mariage d’Ange et Cédric — ${displayName}`}>
    <Image className="invitation-template" src="/images/invitation-template.png" alt="Mariage d’Ange et Cédric, samedi 26 décembre 2026 à Douala. Réception à Glorious Hall, Bonamoussadi, à 100 m du Yapaki Prestige. Thème vert sauge, blanc et or." width={1024} height={1536} unoptimized />
    <div className="invitation-recipient" style={{ fontSize: nameSize }}><span>{displayName}</span></div>
    <div className="invitation-code">
      {qrDataUrl
        ? <Image src={qrDataUrl} alt={`QR code de l’invitation ${reference}`} width={480} height={480} unoptimized />
        : <span className="invitation-code-placeholder">QR code<br />du billet</span>}
    </div>
  </article>;
}
