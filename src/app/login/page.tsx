import type { Metadata } from "next";
import "./login.css";
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
    <main className="login-page">
      <header className="login-header">
        <Link href="/" className="login-brand">{wedding.couple.displayName}</Link>
      </header>
      <div className="login-content">
        <section className="login-card" aria-labelledby="login-title">
          <div className="login-ornament" aria-hidden="true"><span />♡<span /></div>
          <p className="login-eyebrow">Dans les coulisses du grand jour</p>
          <h1 id="login-title">Bienvenue <em>à nos côtés.</em></h1>
          <p className="login-description">Un espace pour préparer ensemble<br />le plus beau de nos jours.</p>
          <div className="login-form-heading"><span />Espace privé<span /></div>
          <LoginForm />
          <p className="login-caption">Invitations & accueil de nos proches</p>
        </section>
        <Link href="/" className="login-back">← Retour au site du mariage</Link>
      </div>
      <footer className="login-footer">26 décembre 2026 <span>·</span> Douala, Cameroun</footer>
    </main>
  );
}
