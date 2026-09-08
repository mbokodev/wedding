import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/server/auth/guards";
import { db } from "@/server/db";
import { getQuotaUsageByUser } from "@/server/queries/stats";
import { setUserActive } from "@/features/users/actions";
import { ToggleActiveForm } from "@/features/users/toggle-active-form";

export const metadata: Metadata = {
  title: "Utilisateurs",
};

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Super admin",
  ADMIN: "Admin",
  CHECK_IN_AGENT: "Agent check-in",
};

export default async function UsersPage() {
  const currentUser = await requireUser(["SUPER_ADMIN"]);

  const [users, usage] = await Promise.all([
    db.user.findMany({
      orderBy: [{ role: "asc" }, { fullName: "asc" }],
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
        quota: true,
        isActive: true,
      },
    }),
    getQuotaUsageByUser(),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-3xl font-light text-cocoa">Utilisateurs</h1>
        <Link
          href="/admin/users/new"
          className="bg-cocoa px-6 py-3 text-xs uppercase tracking-[0.25em] text-ivory transition-colors hover:bg-night"
        >
          Nouvel utilisateur
        </Link>
      </div>

      <div className="overflow-x-auto border border-cocoa/10 bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-cocoa/10 text-[11px] uppercase tracking-[0.18em] text-cocoa-light">
              <th className="px-5 py-4 font-medium">Nom</th>
              <th className="px-5 py-4 font-medium">Identifiants</th>
              <th className="px-5 py-4 font-medium">Rôle</th>
              <th className="px-5 py-4 font-medium">Quota</th>
              <th className="px-5 py-4 font-medium">Statut</th>
              <th className="px-5 py-4 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const used = usage.get(user.id) ?? 0;
              const isSelf = user.id === currentUser.id;

              return (
                <tr
                  key={user.id}
                  className="border-b border-cocoa/5 last:border-0"
                >
                  <td className="px-5 py-4 text-cocoa">
                    {user.fullName}
                    {isSelf && (
                      <span className="ml-2 text-[11px] uppercase tracking-wide text-gold-dark">
                        vous
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-cocoa-light">
                    <div className="space-y-0.5">
                      {user.email && <p>{user.email}</p>}
                      {user.phone && <p>{user.phone}</p>}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-cocoa-light">
                    {ROLE_LABELS[user.role]}
                  </td>
                  <td className="px-5 py-4 tabular-nums text-cocoa-light">
                    {user.role === "ADMIN" ? (
                      <span
                        className={
                          user.quota !== null && used > user.quota
                            ? "text-red-700"
                            : undefined
                        }
                      >
                        {used} / {user.quota ?? 0}
                      </span>
                    ) : (
                      <span className="text-cocoa/30">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    {user.isActive ? (
                      <span className="text-sage-dark">Actif</span>
                    ) : (
                      <span className="text-red-700">Désactivé</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-4">
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="text-xs uppercase tracking-[0.15em] text-gold-dark underline-offset-4 hover:underline"
                      >
                        Modifier
                      </Link>
                      {!isSelf && (
                        <ToggleActiveForm
                          action={setUserActive.bind(
                            null,
                            user.id,
                            !user.isActive
                          )}
                          isActive={user.isActive}
                          userName={user.fullName}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-xs font-light text-cocoa-light">
        Le quota indique les personnes déjà invitées / le quota attribué. La
        désactivation d&rsquo;un compte révoque immédiatement ses sessions.
      </p>
    </div>
  );
}
