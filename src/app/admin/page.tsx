import type { Metadata } from "next";
import { requireUser } from "@/server/auth/guards";
import { LogoutButton } from "@/features/auth/logout-button";

export const metadata: Metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};

/**
 * Tableau de bord (placeholder Phase 4).
 * Les vrais dashboards SUPER_ADMIN / ADMIN arrivent en phases 5 et 6.
 */
export default async function AdminPage() {
  const user = await requireUser(["SUPER_ADMIN", "ADMIN"]);

  return (
    <main className="mx-auto max-w-3xl px-5 py-16">
      <p className="text-xs uppercase tracking-[0.3em] text-gold-dark">
        Espace privé
      </p>
      <h1 className="mt-2 font-serif text-3xl font-light text-cocoa">
        Bonjour {user.fullName}
      </h1>
      <dl className="mt-8 space-y-2 text-sm text-cocoa-light">
        <div className="flex gap-2">
          <dt className="font-medium text-cocoa">Rôle :</dt>
          <dd>{user.role}</dd>
        </div>
        {user.quota !== null && (
          <div className="flex gap-2">
            <dt className="font-medium text-cocoa">Quota :</dt>
            <dd>{user.quota} personnes</dd>
          </div>
        )}
      </dl>
      <p className="mt-8 text-sm font-light text-cocoa-light">
        Le tableau de bord complet sera disponible dans la prochaine étape
        (statistiques, billets, utilisateurs).
      </p>
      <div className="mt-10">
        <LogoutButton className="text-cocoa" />
      </div>
    </main>
  );
}
