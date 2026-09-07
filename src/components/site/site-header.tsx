"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { wedding } from "@/config/wedding";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "#histoire", label: "Notre histoire" },
  { href: "#programme", label: "Programme" },
  { href: "#lieux", label: "Lieux" },
  { href: "#dress-code", label: "Dress code" },
  { href: "#galerie", label: "Galerie" },
  { href: "#infos", label: "Infos" },
] as const;

/** Header fixe : transparent sur le hero, ivoire une fois la page défilée. */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Bloque le scroll quand le menu mobile est ouvert
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500 no-print",
        menuOpen
          ? "bg-ivory"
          : scrolled
            ? "bg-ivory/90 backdrop-blur-md shadow-[0_1px_0_0_rgba(176,141,87,0.2)]"
            : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 md:h-20 max-w-6xl items-center justify-between px-5 md:px-8">
        <Link
          href="/"
          onClick={() => setMenuOpen(false)}
          className={cn(
            "font-script text-2xl md:text-3xl transition-colors",
            scrolled || menuOpen ? "text-gold-dark" : "text-ivory"
          )}
          aria-label="Retour à l'accueil"
        >
          {wedding.couple.initials}
        </Link>

        {/* Navigation desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                "text-[13px] uppercase tracking-[0.18em] font-light transition-colors hover:text-gold",
                scrolled ? "text-cocoa" : "text-ivory/90"
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Bouton menu mobile */}
        <button
          type="button"
          className="md:hidden flex h-10 w-10 items-center justify-center"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          <span className="relative block h-4 w-6">
            <span
              className={cn(
                "absolute left-0 top-0 h-px w-full transition-all duration-300",
                menuOpen ? "top-2 rotate-45 bg-cocoa" : scrolled ? "bg-cocoa" : "bg-ivory"
              )}
            />
            <span
              className={cn(
                "absolute left-0 top-2 h-px w-full transition-all duration-300",
                menuOpen ? "opacity-0" : scrolled ? "bg-cocoa" : "bg-ivory"
              )}
            />
            <span
              className={cn(
                "absolute left-0 top-4 h-px w-full transition-all duration-300",
                menuOpen ? "top-2 -rotate-45 bg-cocoa" : scrolled ? "bg-cocoa" : "bg-ivory"
              )}
            />
          </span>
        </button>
      </div>

      {/* Menu mobile plein écran */}
      <div
        className={cn(
          "md:hidden fixed inset-0 top-16 bg-ivory transition-opacity duration-300",
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <nav className="flex flex-col items-center gap-8 pt-16">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="font-serif text-2xl text-cocoa transition-colors hover:text-gold"
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              {link.label}
            </a>
          ))}
          <div className="mt-4 h-px w-12 bg-gold/50" />
          <p className="font-script text-3xl text-gold">
            {wedding.date.displayShort}
          </p>
        </nav>
      </div>
    </header>
  );
}
