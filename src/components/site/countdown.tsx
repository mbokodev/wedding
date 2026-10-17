"use client";

import { useSyncExternalStore } from "react";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

/** S'abonne à un tick par seconde. */
function subscribe(onTick: () => void) {
  const id = setInterval(onTick, 1000);
  return () => clearInterval(id);
}

/** Timestamp arrondi à la seconde (stable au sein d'une même seconde). */
function getNow() {
  return Math.floor(Date.now() / 1000) * 1000;
}

/** Côté serveur : pas d'heure connue → placeholder. */
function getServerNow() {
  return null;
}

/**
 * Heure courante, mise à jour chaque seconde.
 * Retourne null sur le serveur / avant hydratation (évite tout mismatch).
 */
function useNow(): number | null {
  return useSyncExternalStore(subscribe, getNow, getServerNow);
}

function computeTimeLeft(now: number, target: number): TimeLeft | null {
  const diff = target - now;
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1_000) % 60),
  };
}

/** Valeurs stables à l’hydratation ; pas d’annonce vocale chaque seconde. */
export function Countdown({ targetIso }: { targetIso: string }) {
  const now = useNow();
  const target = new Date(targetIso).getTime();
  const timeLeft = now === null ? undefined : computeTimeLeft(now, target);
  if (timeLeft === null) {
    return <p className="countdown-finished">{now !== null && now < target + 86_400_000 ? "C’est le grand jour !" : "Merci de partager notre bonheur."}</p>;
  }
  const units = [
    { value: timeLeft?.days, label: "Jours" },
    { value: timeLeft?.hours, label: "Heures" },
    { value: timeLeft?.minutes, label: "Minutes" },
    { value: timeLeft?.seconds, label: "Secondes" },
  ];
  return (
    <div className="home-countdown" role="timer" aria-label="Compte à rebours avant le mariage" aria-live="off">
      {units.map((unit) => <div key={unit.label} className="countdown-unit"><span className="countdown-number">{unit.value === undefined ? "––" : String(unit.value).padStart(2, "0")}</span><span className="countdown-label">{unit.label}</span></div>)}
    </div>
  );
}
