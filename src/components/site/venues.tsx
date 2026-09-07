import Image from "next/image";
import { wedding } from "@/config/wedding";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";

/** Lieux : cartes cérémonie + réception avec bouton itinéraire. */
export function Venues() {
  return (
    <section id="lieux" className="scroll-mt-20 bg-ivory py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Où nous retrouver"
          title="Les lieux"
          subtitle="Deux adresses d'exception pour une journée inoubliable."
        />

        <div className="grid gap-10 md:grid-cols-2 md:gap-12">
          {wedding.venues.map((venue, i) => (
            <Reveal
              key={venue.name}
              delay={i * 120}
              className="group flex flex-col overflow-hidden bg-white shadow-[0_2px_24px_rgba(62,47,35,0.07)]"
            >
              <div className="relative aspect-[3/2] overflow-hidden">
                <Image
                  src={venue.image}
                  alt={venue.name}
                  fill
                  sizes="(max-width: 768px) 90vw, 45vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <span className="absolute left-4 top-4 bg-night/70 px-4 py-1.5 text-[11px] uppercase tracking-[0.2em] text-ivory backdrop-blur-sm">
                  {venue.role}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-7 md:p-8">
                <h3 className="font-serif text-2xl md:text-3xl font-light text-cocoa">
                  {venue.name}
                </h3>
                <p className="mt-2 flex items-start gap-2 text-sm text-gold-dark">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="mt-0.5 shrink-0"
                    aria-hidden
                  >
                    <path d="M12 21s-7-5.5-7-11a7 7 0 1 1 14 0c0 5.5-7 11-7 11z" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                  {venue.address}
                </p>
                <p className="mt-4 flex-1 text-sm md:text-base font-light leading-relaxed text-cocoa-light">
                  {venue.description}
                </p>
                <a
                  href={venue.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex w-fit items-center gap-2 border border-cocoa/25 px-6 py-3 text-xs uppercase tracking-[0.2em] text-cocoa transition-all duration-300 hover:border-gold hover:bg-gold hover:text-ivory"
                >
                  Itinéraire
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    aria-hidden
                  >
                    <path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
