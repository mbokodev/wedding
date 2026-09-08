import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/server/auth/guards";
import { LogoutButton } from "@/features/auth/logout-button";
import { AdminNav, type AdminNavItem } from "@/components/admin/admin-nav";

export const metadata: Metadata = {
  title: { template: "%s · Administration", default: "Administration" },
  robots: { index: false, follow: false },
};

/**
 * Layout de l'espace privé /admin (SUPER_ADMIN + ADMIN).
 * Chaque page garde son propre requireUser (défense en profondeur) ;
 * le layout gère l'en-tête et la navigation selon le rôle.
 */
export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const user = await requireUser(["SUPER_ADMIN", "ADMIN"]);

  const items: AdminNavItem[] = [
    { href: "/admin", label: "Tableau de bord" },
    ...(user.role === "SUPER_ADMIN"
      ? [
          { href: "/admin/users", label: "Utilisateurs" },
          { href: "/admin/settings", label: "Paramètres" },
        ]
      : []),
  ];

  return (
    <div className="min-h-svh bg-ivory">
      <header className="border-b border-cocoa/10 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 pt-5">
          <Link href="/admin" className="font-serif text-xl text-cocoa">
            C&nbsp;<span className="text-gold">&amp;</span>&nbsp;A
            <span className="ml-3 text-xs font-sans uppercase tracking-[0.25em] text-cocoa-light">
              Administration
            </span>
          </Link>
          <div className="flex items-center gap-5 text-xs text-cocoa-light">
            <span className="hidden sm:inline">{user.fullName}</span>
            <LogoutButton className="text-cocoa" />
          </div>
        </div>
        <div className="mx-auto max-w-5xl px-5">
          <AdminNav items={items} />
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-5 py-10">{children}</main>
    </div>
  );
}
