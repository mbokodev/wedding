import Image from "next/image";
import { wedding } from "@/config/wedding";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

/** Notre histoire : chapitres alternés image / texte. */
export function Story() {
  return (
    <section id="histoire" className="scroll-mt-20 bg-ivory py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Notre histoire"
          title="Le début d'une belle aventure"
          subtitle={wedding.texts.storyIntro}
        />

        <div className="space-y-20 md:space-y-28">
          {wedding.story.map((chapter, i) => {
            const reversed = i % 2 === 1;
            return (
              <div
                key={chapter.title}
                className={cn(
                  "grid items-center gap-10 md:grid-cols-2 md:gap-16"
                )}
              >
                <Reveal
                  className={cn(reversed && "md:order-2")}
                  as="figure"
                >
                  <div className="relative mx-auto aspect-[4/5] max-w-md overflow-hidden">
                    <Image
                      src={chapter.image}
                      alt={chapter.title}
                      fill
                      sizes="(max-width: 768px) 90vw, 45vw"
                      className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                    />
                    {/* Cadre doré décalé */}
                    <div className="pointer-events-none absolute inset-0 translate-x-3 translate-y-3 border border-gold/40 md:translate-x-4 md:translate-y-4" />
                  </div>
                </Reveal>

                <Reveal
                  delay={120}
                  className={cn(
                    "text-center md:text-left",
                    reversed && "md:order-1 md:text-right"
                  )}
                >
                  <p className="font-script text-4xl text-gold">
                    {chapter.year}
                  </p>
                  <h3 className="mt-3 font-serif text-3xl md:text-4xl font-light text-cocoa">
                    {chapter.title}
                  </h3>
                  <div
                    className={cn(
                      "mt-5 h-px w-14 bg-gold/50 mx-auto md:mx-0",
                      reversed && "md:ml-auto"
                    )}
                  />
                  <p className="mt-6 text-base md:text-lg font-light leading-relaxed text-cocoa-light">
                    {chapter.text}
                  </p>
                </Reveal>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
