import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/server/auth/guards";
import { db } from "@/server/db";
import {
  getGlobalStats,
  getQuotaUsageByUser,
  getQuotaUsedBy,
} from "@/server/queries/stats";

export const metadata: Metadata = {
  title: "Tableau de bord",
};

export default async function AdminPage() {
  const user = await requireUser(["SUPER_ADMIN", "ADMIN"]);

  return user.role === "SUPER_ADMIN" ? (
    <SuperAdminDashboard />
  ) : (
    <AdminDashboard userId={user.id} quota={user.quota} />
  );
}

// ------------------------------------------------------------
// SUPER_ADMIN : vue globale
// ------------------------------------------------------------

async function SuperAdminDashboard() {
  const [stats, usage, admins] = await Promise.all([
    getGlobalStats(),
    getQuotaUsageByUser(),
    db.user.findMany({
      where: { role: "ADMIN" },
      orderBy: { fullName: "asc" },
      select: { id: true, fullName: true, quota: true, isActive: true },
    }),
  ]);

  const cards = [
    { label: "Capacité totale", value: stats.totalGuestCapacity, unit: "places" },
    { label: "Personnes invitées", value: stats.invitedGuests, unit: "personnes" },
    {
      label: "Places restantes",
      value: stats.remainingCapacity,
      unit: "places",
      alert: stats.remainingCapacity < 0,
    },
    { label: "Billets émis", value: stats.ticketsTotal, unit: "billets" },
    { label: "Billets scannés", value: stats.ticketsScanned, unit: "billets" },
    { label: "Personnes entrées", value: stats.guestsEntered, unit: "personnes" },
    { label: "Admins actifs", value: stats.activeAdmins, unit: "comptes" },
    { label: "Agents check-in", value: stats.activeAgents, unit: "comptes" },
  ];

  return (
    <div className="space-y-12">
      <section>
        <h1 className="font-serif text-3xl font-light text-cocoa">
          Vue d&rsquo;ensemble
        </h1>
        <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {cards.map((card) => (
            <div
              key={card.label}
              className="border border-cocoa/10 bg-white px-5 py-4"
            >
              <dt className="text-[11px] uppercase tracking-[0.18em] text-cocoa-light">
                {card.label}
              </dt>
              <dd
                className={`mt-2 font-serif text-3xl font-light ${
                  card.alert ? "text-red-700" : "text-cocoa"
                }`}
              >
                {card.value}
                <span className="ml-2 text-xs font-sans uppercase tracking-wide text-cocoa/40">
                  {card.unit}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section>
        <div className="flex items-baseline justify-between">
          <h2 className="font-serif text-2xl font-light text-cocoa">
            Répartition des quotas
          </h2>
          <Link
            href="/admin/users"
            className="text-xs uppercase tracking-[0.2em] text-gold-dark underline-offset-4 hover:underline"
          >
            Gérer les utilisateurs
          </Link>
        </div>

        {admins.length === 0 ? (
          <p className="mt-4 text-sm font-light text-cocoa-light">
            Aucun admin pour le moment.
          </p>
        ) : (
          <ul className="mt-5 space-y-4">
            {admins.map((admin) => {
              const used = usage.get(admin.id) ?? 0;
              const quota = admin.quota ?? 0;
              const percent =
                quota > 0 ? Math.min(100, Math.round((used / quota) * 100)) : 0;
              const over = quota > 0 && used > quota;

              return (
                <li key={admin.id} className="border border-cocoa/10 bg-white px-5 py-4">
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="text-sm text-cocoa">
                      {admin.fullName}
                      {!admin.isActive && (
                        <span className="ml-2 text-[11px] uppercase tracking-wide text-red-700">
                          désactivé
                        </span>
                      )}
                    </p>
                    <p
                      className={`text-sm tabular-nums ${
                        over ? "text-red-700" : "text-cocoa-light"
                      }`}
                    >
                      {used} / {quota} personnes
                    </p>
                  </div>
                  <div className="mt-3 h-1.5 w-full bg-ivory-dark">
                    <div
                      className={over ? "h-full bg-red-600" : "h-full bg-gold"}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

// ------------------------------------------------------------
// ADMIN : aperçu personnel (le dashboard complet arrive en phase 6)
// ------------------------------------------------------------

async function AdminDashboard({
  userId,
  quota,
}: {
  userId: string;
  quota: number | null;
}) {
  const used = await getQuotaUsedBy(userId);
  const total = quota ?? 0;
  const remaining = total - used;

  return (
    <div className="space-y-8">
      <h1 className="font-serif text-3xl font-light text-cocoa">Mes invitations</h1>
      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="border border-cocoa/10 bg-white px-5 py-4">
          <dt className="text-[11px] uppercase tracking-[0.18em] text-cocoa-light">
            Mon quota
          </dt>
          <dd className="mt-2 font-serif text-3xl font-light text-cocoa">
            {total}
          </dd>
        </div>
        <div className="border border-cocoa/10 bg-white px-5 py-4">
          <dt className="text-[11px] uppercase tracking-[0.18em] text-cocoa-light">
            Personnes invitées
          </dt>
          <dd className="mt-2 font-serif text-3xl font-light text-cocoa">{used}</dd>
        </div>
        <div className="border border-cocoa/10 bg-white px-5 py-4">
          <dt className="text-[11px] uppercase tracking-[0.18em] text-cocoa-light">
            Places restantes
          </dt>
          <dd
            className={`mt-2 font-serif text-3xl font-light ${
              remaining < 0 ? "text-red-700" : "text-cocoa"
            }`}
          >
            {remaining}
          </dd>
        </div>
      </dl>
      <p className="text-sm font-light text-cocoa-light">
        La gestion de vos billets (création, modification, invitations) sera
        disponible dans la prochaine étape.
      </p>
    </div>
  );
}
