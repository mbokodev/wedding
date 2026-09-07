import Image from "next/image";
import { wedding } from "@/config/wedding";
import { Countdown } from "@/components/site/countdown";

/** Section plein écran : photo, noms, date, lieu, compte à rebours. */
export function Hero() {
  return (
    <section id="accueil" className="relative flex min-h-svh flex-col">
      {/* Photo de fond (placeholder à remplacer) */}
      <Image
        src={wedding.heroImage}
        alt={`${wedding.couple.displayName} — photo du couple`}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/* Voile sombre pour la lisibilité */}
      <div className="absolute inset-0 bg-gradient-to-b from-night/55 via-night/35 to-night/75" />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pt-24 pb-16 text-center">
        <p className="animate-fade-in text-xs md:text-sm uppercase tracking-[0.4em] text-champagne/90">
          {wedding.texts.heroTagline}
        </p>

        <h1 className="mt-6 animate-fade-up font-serif text-6xl sm:text-7xl md:text-8xl font-light text-ivory">
          {wedding.couple.partner1}
          <span className="mx-3 md:mx-5 font-script text-5xl sm:text-6xl md:text-7xl text-champagne align-middle">
            &amp;
          </span>
          {wedding.couple.partner2}
        </h1>

        <div className="mt-8 flex items-center gap-4 animate-fade-up [animation-delay:200ms]">
          <span className="h-px w-10 md:w-16 bg-champagne/60" />
          <p className="font-serif text-xl md:text-2xl tracking-[0.15em] text-ivory">
            {wedding.date.display}
          </p>
          <span className="h-px w-10 md:w-16 bg-champagne/60" />
        </div>

        <p className="mt-3 text-sm md:text-base uppercase tracking-[0.3em] text-ivory/80 animate-fade-up [animation-delay:300ms]">
          {wedding.location.display}
        </p>

        <p className="mx-auto mt-8 max-w-md text-sm md:text-base font-light leading-relaxed text-ivory/85 animate-fade-up [animation-delay:400ms]">
          {wedding.texts.heroSubtitle}
        </p>

        <div className="mt-12 animate-fade-up [animation-delay:500ms]">
          <Countdown targetIso={wedding.date.iso} />
        </div>

        <a
          href="#programme"
          className="mt-12 inline-block border border-champagne/70 px-8 py-3.5 text-xs uppercase tracking-[0.25em] text-ivory transition-all duration-300 hover:bg-champagne hover:text-night animate-fade-up [animation-delay:600ms]"
        >
          Découvrir le programme
        </a>
      </div>

      {/* Indicateur de scroll */}
      <a
        href="#histoire"
        aria-label="Faire défiler vers Notre histoire"
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-ivory/70 transition-colors hover:text-ivory"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="animate-bounce"
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </section>
  );
}
