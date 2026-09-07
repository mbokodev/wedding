import { wedding } from "@/config/wedding";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

/** Programme : timeline verticale élégante. */
export function Program() {
  return (
    <section
      id="programme"
      className="scroll-mt-20 bg-sage-light/50 py-24 md:py-32"
    >
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Le grand jour"
          title="Programme de la journée"
          subtitle={`${wedding.date.display} — ${wedding.location.display}`}
        />

        <ol className="relative">
          {/* Ligne verticale */}
          <div
            aria-hidden
            className="absolute left-[19px] top-2 bottom-2 w-px bg-gold/40 md:left-1/2"
          />

          {wedding.program.map((step, i) => {
            const right = i % 2 === 1;
            return (
              <Reveal
                as="li"
                key={step.time}
                delay={i * 80}
                className={cn(
                  "relative flex gap-6 pb-12 last:pb-0 md:w-1/2",
                  right
                    ? "md:ml-auto md:pl-12"
                    : "md:mr-auto md:flex-row-reverse md:pr-12 md:text-right"
                )}
              >
                {/* Point sur la ligne */}
                <span
                  aria-hidden
                  className={cn(
                    "absolute left-[13px] top-1.5 flex h-3.5 w-3.5 items-center justify-center",
                    right ? "md:-left-[7px]" : "md:left-auto md:-right-[7px]"
                  )}
                >
                  <span className="absolute h-3.5 w-3.5 rounded-full border border-gold/60" />
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                </span>

                <div className="pl-12 md:pl-0">
                  <p className="font-serif text-2xl md:text-3xl font-light text-gold-dark tabular-nums">
                    {step.time}
                  </p>
                  <h3 className="mt-1 font-serif text-xl md:text-2xl text-cocoa">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm md:text-base font-light leading-relaxed text-cocoa-light">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
