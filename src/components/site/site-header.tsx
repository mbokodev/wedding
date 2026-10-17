"use client";

import { useEffect, useRef, useState } from "react";
import { wedding } from "@/config/wedding";
import { home } from "@/config/home";

export function SiteHeader() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [activeSection, setActiveSection] = useState("#accueil");

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) setActiveSection(`#${entry.target.id}`);
      }
    }, { rootMargin: "-15% 0px -65% 0px", threshold: 0 });
    home.navigation.forEach(item => {
      const section = document.querySelector(item.href);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);

  function closeMenu() {
    dialogRef.current?.close();
    buttonRef.current?.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1200px)");
    const onResize = () => { if (media.matches) closeMenu(); };
    media.addEventListener("change", onResize);
    return () => {
      media.removeEventListener("change", onResize);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <>
      <a className="home-skip" href="#contenu">Aller au contenu</a>
      <header className="home-header">
        <a href="#accueil" className="home-monogram" aria-label="Ange et Cédric — Accueil">{wedding.couple.displayName}</a>
        <nav className="home-desktop-nav" aria-label="Navigation principale">
          {home.navigation.map((item) => <a key={item.href} href={item.href} aria-current={activeSection === item.href ? "location" : undefined}>{item.label}</a>)}
        </nav>
        <button ref={buttonRef} type="button" className="home-menu-button" aria-label="Ouvrir le menu" aria-haspopup="dialog" aria-controls="home-menu" aria-expanded="false" onClick={() => {
          dialogRef.current?.showModal();
          buttonRef.current?.setAttribute("aria-expanded", "true");
          document.body.style.overflow = "hidden";
        }}><span aria-hidden="true">☰</span></button>
      </header>
      <dialog ref={dialogRef} id="home-menu" className="home-menu" aria-labelledby="menu-title" onClose={closeMenu}>
        <div className="home-menu-top"><p id="menu-title" className="home-monogram">{wedding.couple.displayName}</p><button type="button" onClick={closeMenu} autoFocus>Fermer <span aria-hidden="true">×</span></button></div>
        <nav aria-label="Navigation mobile">
          {home.navigation.map((item, index) => <a key={item.href} href={item.href} onClick={closeMenu}><span aria-hidden="true">0{index + 1}</span>{item.label}</a>)}
        </nav>
        <p className="home-menu-date">{wedding.date.display} · Douala</p>
      </dialog>
    </>
  );
}
