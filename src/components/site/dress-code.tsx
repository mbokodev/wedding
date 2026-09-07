import { wedding } from "@/config/wedding";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";

/** Dress code : palette de couleurs recommandées, sur fond sombre élégant. */
export function DressCode() {
  const { dressCode } = wedding;

  return (
    <section
      id="dress-code"
      className="scroll-mt-20 bg-night py-24 md:py-32 text-ivory"
    >
      <div className="mx-auto max-w-4xl px-5 md:px-8 text-center">
        <SectionHeading
          eyebrow="Dress code"
          title={dressCode.title}
          subtitle={dressCode.description}
          tone="dark"
        />

        <Reveal className="mt-4">
          <div className="flex flex-wrap items-start justify-center gap-8 md:gap-12">
            {dressCode.colors.map((color, i) => (
              <div
                key={color.name}
                className="flex flex-col items-center gap-3"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <span
                  className="relative h-16 w-16 md:h-20 md:w-20 rounded-full border border-ivory/20 shadow-[inset_0_0_12px_rgba(0,0,0,0.15)]"
                  style={{ backgroundColor: color.hex }}
                >
                  {"reserved" in color && color.reserved && (
                    <span
                      aria-hidden
                      className="absolute inset-0 rounded-full"
                      style={{
                        background:
                          "linear-gradient(135deg, transparent 47%, rgba(62,47,35,0.5) 49%, rgba(62,47,35,0.5) 51%, transparent 53%)",
                      }}
                    />
                  )}
                </span>
                <span className="text-xs md:text-sm uppercase tracking-[0.2em] text-ivory/80">
                  {color.name}
                </span>
                {"reserved" in color && color.reserved && (
                  <span className="-mt-2 text-[10px] uppercase tracking-widest text-gold">
                    réservé
                  </span>
                )}
              </div>
            ))}
          </div>

          <p className="mt-12 font-script text-2xl md:text-3xl text-champagne">
            {dressCode.note}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
