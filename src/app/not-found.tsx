import Link from "next/link";
import { wedding } from "@/config/wedding";

/** Page 404 élégante (invitation introuvable, lien invalide…). */
export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-ivory px-6 text-center">
      <p className="font-script text-5xl text-gold">Oups…</p>
      <h1 className="mt-6 font-serif text-3xl md:text-4xl font-light text-cocoa">
        Cette page est introuvable
      </h1>
      <div className="mt-6 h-px w-16 bg-gold/50" />
      <p className="mt-6 max-w-md text-base font-light leading-relaxed text-cocoa-light">
        Le lien que vous avez suivi n&apos;existe pas ou n&apos;est plus
        valide. Si vous cherchez votre invitation, vérifiez le lien reçu ou
        contactez-nous.
      </p>
      <Link
        href="/"
        className="mt-10 inline-block border border-cocoa/25 px-8 py-3.5 text-xs uppercase tracking-[0.25em] text-cocoa transition-all duration-300 hover:border-gold hover:bg-gold hover:text-ivory"
      >
        Retour au site — {wedding.couple.displayName}
      </Link>
    </main>
  );
}
