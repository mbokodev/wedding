"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

const MotionContext = createContext({ paused: false, toggle: () => {} });
// Masqué temporairement ; passer à true pour réactiver le menu flottant.
const SHOW_FLOATING_MENU = false;
export function useWeddingMotion() { return useContext(MotionContext); }

export function WeddingExperience({ children }: { children: ReactNode }) {
  const [paused, setPaused] = useState(false);
  return (
    <MotionContext.Provider value={{ paused, toggle: () => setPaused(value => !value) }}>
      <div className={`wedding-home${paused ? " motion-paused" : ""}`}>
        <div className="reading-progress" aria-hidden="true" />
        {children}
        {SHOW_FLOATING_MENU && <nav className="wedding-dock" aria-label="Accès rapides">
          <a href="#histoire"><span aria-hidden="true">♡</span>Notre histoire</a>
          <a href="#grand-jour"><span aria-hidden="true">◇</span>Le grand jour</a>
          <a href="#infos"><span aria-hidden="true">⌖</span>Infos</a>
          <button type="button" onClick={() => setPaused(value => !value)} aria-pressed={paused} aria-label={paused ? "Reprendre toutes les animations" : "Mettre toutes les animations en pause"}><span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span>{paused ? "Animer" : "Pause"}</button>
          <a href="#accueil" aria-label="Retour en haut"><span aria-hidden="true">↑</span>Accueil</a>
        </nav>}
      </div>
    </MotionContext.Provider>
  );
}
