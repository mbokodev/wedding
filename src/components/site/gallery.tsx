import Image from "next/image";
import { wedding } from "@/config/wedding";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";

/** Galerie responsive en colonnes (masonry léger). */
export function Gallery() {
  return (
    <section id="galerie" className="scroll-mt-20 bg-ivory py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Souvenirs"
          title="Galerie"
          subtitle="Quelques instants capturés au fil de notre histoire."
        />

        <div className="columns-2 gap-4 md:columns-3 md:gap-5 [&>*]:mb-4 md:[&>*]:mb-5">
          {wedding.gallery.map((photo, i) => (
            <Reveal
              key={photo.src}
              as="figure"
              delay={(i % 3) * 90}
              className="group relative overflow-hidden break-inside-avoid"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                width={i % 3 === 0 ? 900 : 1200}
                height={i % 3 === 0 ? 1200 : 900}
                sizes="(max-width: 768px) 45vw, 30vw"
                className="w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
              <div className="pointer-events-none absolute inset-0 bg-night/0 transition-colors duration-500 group-hover:bg-night/10" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
