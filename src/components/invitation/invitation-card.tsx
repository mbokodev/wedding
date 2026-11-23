import Image from "next/image";
import { wedding } from "@/config/wedding";
import "./invitation-card.css";

export type InvitationCardProps = { guestName: string; guestCount: number; reference: string; qrDataUrl?: string };

function HeartDivider() {
  return <div className="evening-ticket-divider" aria-hidden="true"><span />♥<span /></div>;
}

/** Composition photographique du billet de soirée. */
export function InvitationCard({ guestName, guestCount, reference, qrDataUrl }: InvitationCardProps) {
  const couple = guestCount === 2;
  const displayName = couple && !/^(m\.?\s*(&|et)\s*mme\.?|monsieur|famille)\b/i.test(guestName) ? `M. & Mme ${guestName}` : guestName;
  return <article className="evening-ticket" aria-label={`Invitation à la soirée — ${displayName}`}>
    <div className="evening-ticket-frame" aria-hidden="true" />
    <div className="evening-ticket-portrait">
      <Image src="/images/generated/ange-cedric-transparent.png" alt="Ange et Cédric, ensemble et vêtus de blanc" width={1024} height={1536} unoptimized />
    </div>
    <Image src="/images/generated/hero-floral-roses.png" width={300} height={300} alt="" unoptimized className="evening-ticket-flowers evening-ticket-flowers-top" />
    <Image src="/images/generated/hero-floral-roses.png" width={300} height={300} alt="" unoptimized className="evening-ticket-flowers evening-ticket-flowers-bottom" />
    <div className="evening-ticket-content">
      <div className="evening-ticket-copy">
        <HeartDivider />
        <h1 className="evening-ticket-names">Ange Toyou<span>&amp;</span>Cédric Nampa</h1>
        <p className="evening-ticket-motto">ont le bonheur de convier</p>
        <div className="evening-ticket-guest">
          <h2>{displayName}</h2>
        </div>
        <p className="evening-ticket-invitation-ending">à la soirée de célébration<br />de leur mariage.</p>
        <HeartDivider />
        <div className="evening-ticket-info">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 2v6m10-6v6M3 11h18M7 15h2m3 0h2m3 0h1M7 18h2m3 0h2" /></svg>
          <div><p>Date &amp; heure</p><strong>{wedding.date.display}</strong><span>Samedi · À partir de 19 h</span></div>
        </div>
        <div className="evening-ticket-info evening-ticket-venue">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
          <div><p>Salle de cérémonie</p><strong>Glorious Hall</strong><span>Douala · Bonamoussadi</span><span>À 100 m du Yapaki Prestige</span></div>
        </div>
        <HeartDivider />
        <p className="evening-ticket-blessing">Venez avec amour</p>
        <div className="evening-ticket-theme" aria-label="Couleurs du thème">
          {[{ name: "Vert sauge", hex: "#a3b39a" }, { name: "Blanc", hex: "#fffdf7" }, { name: "Or", hex: "#b59658" }].map(color => (
            <div key={color.name}><span style={{ background: color.hex }} /><p>{color.name}</p></div>
          ))}
        </div>
        <p className="evening-ticket-signature">Votre présence rendra<br />ce jour encore plus précieux.</p>
      </div>
      <div className="evening-ticket-admission">
        <div className="evening-ticket-qr">
          <span className="evening-ticket-qr-corner top-left" aria-hidden="true" />
          <span className="evening-ticket-qr-corner top-right" aria-hidden="true" />
          <span className="evening-ticket-qr-corner bottom-left" aria-hidden="true" />
          <span className="evening-ticket-qr-corner bottom-right" aria-hidden="true" />
          {qrDataUrl ? <Image src={qrDataUrl} alt={`QR code de l’invitation ${reference}`} width={160} height={160} unoptimized /> : <div className="evening-ticket-qr-placeholder"><svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true"><path d="M3 9V3h6M15 3h6v6M21 15v6h-6M9 21H3v-6M8 8h2v2H8zM14 8h2v2h-2zM8 14h2v2H8zM14 14h2v2h-2z" /></svg><span>Espace QR code</span></div>}
        </div>
      </div>
    </div>
  </article>;
}
