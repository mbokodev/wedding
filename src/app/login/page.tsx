import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { wedding } from "@/config/wedding";
import { getCurrentUser } from "@/server/auth/session";
import { homeForRole } from "@/server/auth/guards";
import { LoginForm } from "@/features/auth/login-form";

export const metadata: Metadata = {
  title: "Connexion",
  robots: { index: false, follow: false },
};

/** Connexion à l'espace privé (organisation / check-in). */
export default async function LoginPage() {
  // Déjà connecté → direction sa page d'accueil
  const user = await getCurrentUser();
  if (user) redirect(homeForRole(user.role));

  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-ivory-dark px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <Link href="/" className="font-script text-4xl text-gold">
            {wedding.couple.initials}
          </Link>
          <h1 className="mt-4 font-serif text-2xl font-light text-cocoa">
            Espace privé
          </h1>
          <p className="mt-2 text-sm font-light text-cocoa-light">
            Gestion des invitations et contrôle des entrées
          </p>
        </div>

        <div className="mt-8 border border-gold/30 bg-ivory p-6 sm:p-8 shadow-[0_4px_30px_rgba(62,47,35,0.08)]">
          <LoginForm />
        </div>

        <p className="mt-6 text-center">
          <Link
            href="/"
            className="text-xs uppercase tracking-[0.2em] text-cocoa-light underline-offset-4 transition-colors hover:text-gold hover:underline"
          >
            ← Retour au site du mariage
          </Link>
        </p>
      </div>
    </main>
  );
}
