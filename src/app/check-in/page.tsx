import type { Metadata } from "next";
import { requireUser } from "@/server/auth/guards";
import { LogoutButton } from "@/features/auth/logout-button";

export const metadata: Metadata = {
  title: "Check-in",
  robots: { index: false, follow: false },
};

/**
 * Écran check-in (placeholder Phase 4).
 * Le scanner QR, la recherche et les stats temps réel arrivent en phases 8-10.
 */
export default async function CheckInPage() {
  const user = await requireUser(["SUPER_ADMIN", "CHECK_IN_AGENT"]);

  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-night px-5 text-center text-ivory">
      <p className="text-xs uppercase tracking-[0.3em] text-champagne/80">
        Contrôle des entrées
      </p>
      <h1 className="mt-3 font-serif text-3xl font-light">
        Bonsoir {user.fullName}
      </h1>
      <p className="mt-6 max-w-sm text-sm font-light text-ivory/70">
        Le scanner QR et les statistiques en temps réel seront disponibles dans
        une prochaine étape.
      </p>
      <div className="mt-10">
        <LogoutButton className="text-ivory/80" />
      </div>
    </main>
  );
}
