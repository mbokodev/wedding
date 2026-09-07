import { wedding } from "@/config/wedding";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";

/** Icônes fines pour les informations pratiques. */
function InfoIcon({ name }: { name: string }) {
  const common = {
    width: 26,
    height: 26,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.25,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (name) {
    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    case "car":
      return (
        <svg {...common}>
          <path d="M5 12l1.5-4.5A2 2 0 0 1 8.4 6h7.2a2 2 0 0 1 1.9 1.5L19 12" />
          <path d="M4 12h16v5h-2m-12 0H4v-5" />
          <circle cx="7.5" cy="17" r="1.5" />
          <circle cx="16.5" cy="17" r="1.5" />
        </svg>
      );
    case "parking":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <path d="M10 16v-8h3a2.5 2.5 0 0 1 0 5h-3" />
        </svg>
      );
    case "children":
      return (
        <svg {...common}>
          <circle cx="12" cy="7" r="3" />
          <path d="M6 21v-2a6 6 0 0 1 12 0v2" />
        </svg>
      );
    case "hotel":
      return (
        <svg {...common}>
          <path d="M3 21V7l9-4 9 4v14" />
          <path d="M9 21v-6h6v6" />
          <path d="M9 10h.01M15 10h.01M12 10h.01" />
        </svg>
      );
    case "phone":
      return (
        <svg {...common}>
          <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
        </svg>
      );
    default:
      return null;
  }
}

/** Informations pratiques : grille de cartes. */
export function Infos() {
  return (
    <section
      id="infos"
      className="scroll-mt-20 bg-champagne-light/60 py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Bon à savoir"
          title="Informations pratiques"
          subtitle="Tout ce qu'il faut savoir pour profiter pleinement de la journée."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {wedding.infos.map((info, i) => (
            <Reveal
              key={info.title}
              delay={(i % 3) * 90}
              className="bg-white/80 p-7 md:p-8 shadow-[0_2px_18px_rgba(62,47,35,0.05)]"
            >
              <div className="flex items-center gap-4">
                <span className="text-gold">
                  <InfoIcon name={info.icon} />
                </span>
                <h3 className="font-serif text-xl md:text-2xl text-cocoa">
                  {info.title}
                </h3>
              </div>
              <ul className="mt-5 space-y-2.5">
                {info.lines.map((line) => (
                  <li
                    key={line}
                    className="flex gap-2.5 text-sm font-light leading-relaxed text-cocoa-light"
                  >
                    <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold/60" />
                    {line}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
