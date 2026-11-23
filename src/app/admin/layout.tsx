import type { Metadata } from "next";
import "./admin.css";
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
    { href: "/admin/tickets", label: "Billets" },
    ...(user.role === "SUPER_ADMIN"
      ? [
          { href: "/admin/users", label: "Utilisateurs" },
          { href: "/admin/settings", label: "Paramètres" },
        ]
      : []),
  ];

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <div className="admin-header-inner">
          <Link href="/admin" className="admin-brand">Ange & Cédric<span>Les coulisses du grand jour</span></Link>
          <div className="admin-account">
            <span className="admin-avatar" aria-hidden="true">{user.fullName.charAt(0)}</span>
            <div><strong>{user.fullName}</strong><span>{user.role === "SUPER_ADMIN" ? "Super administrateur" : "Administrateur"}</span></div>
            <LogoutButton className="admin-logout" />
          </div>
        </div>
        <div className="admin-nav-wrap"><AdminNav items={items} /></div>
      </header>
      <main className="admin-main">{children}</main>
      <footer className="admin-footer"><span>26 décembre 2026 · Douala</span><Link href="/">Voir le site du mariage ↗</Link></footer>
    </div>
  );
}
