import { wedding } from "@/config/wedding";

/** Footer simple et élégant. */
export function SiteFooter() {
  return (
    <footer className="bg-night py-16 text-center text-ivory no-print">
      <div className="mx-auto max-w-3xl px-5">
        <p className="font-script text-4xl md:text-5xl text-champagne">
          {wedding.couple.displayName}
        </p>
        <p className="mt-4 text-xs uppercase tracking-[0.3em] text-ivory/60">
          {wedding.date.display} — {wedding.location.display}
        </p>

        <div className="mx-auto mt-8 h-px w-16 bg-gold/40" />

        <p className="mt-8 font-serif text-lg md:text-xl font-light italic text-ivory/75">
          « {wedding.texts.footerQuote} »
        </p>

        <p className="mt-10 text-[11px] uppercase tracking-[0.2em] text-ivory/40">
          Fait avec amour — {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
