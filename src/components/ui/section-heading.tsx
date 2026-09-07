import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  /** Petit texte manuscrit au-dessus du titre. */
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  tone?: "light" | "dark";
};

/** En-tête de section : accent manuscrit + grand titre serif + filet doré. */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  tone = "light",
}: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <Reveal
      className={cn(
        "mb-12 md:mb-16 max-w-2xl",
        centered ? "mx-auto text-center" : "text-left"
      )}
    >
      {eyebrow && (
        <p className="font-script text-3xl md:text-4xl text-gold mb-3">
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "font-serif text-4xl md:text-5xl font-light tracking-wide",
          tone === "dark" ? "text-ivory" : "text-cocoa"
        )}
      >
        {title}
      </h2>
      <div
        className={cn(
          "mt-5 h-px w-16 bg-gold/60",
          centered && "mx-auto"
        )}
      />
      {subtitle && (
        <p
          className={cn(
            "mt-6 text-base md:text-lg font-light leading-relaxed",
            tone === "dark" ? "text-ivory/80" : "text-cocoa-light"
          )}
        >
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
