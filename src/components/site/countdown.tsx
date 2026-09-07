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

/** Compte à rebours avant le mariage. */
export function Countdown({ targetIso }: { targetIso: string }) {
  const now = useNow();
  const timeLeft =
    now === null ? undefined : computeTimeLeft(now, new Date(targetIso).getTime());

  // Jour J passé
  if (timeLeft === null) {
    return (
      <p className="font-script text-3xl md:text-4xl text-champagne">
        C&apos;est le grand jour !
      </p>
    );
  }

  const units = [
    { value: timeLeft?.days, label: "Jours" },
    { value: timeLeft?.hours, label: "Heures" },
    { value: timeLeft?.minutes, label: "Minutes" },
    { value: timeLeft?.seconds, label: "Secondes" },
  ];

  return (
    <div
      className="flex items-start justify-center gap-5 sm:gap-10"
      aria-label="Compte à rebours avant le mariage"
    >
      {units.map((unit, i) => (
        <div key={unit.label} className="flex items-start gap-5 sm:gap-10">
          {i > 0 && (
            <span className="pt-1 font-serif text-3xl sm:text-4xl font-light text-ivory/40 select-none">
              ·
            </span>
          )}
          <div className="flex flex-col items-center min-w-14 sm:min-w-16">
            <span className="font-serif text-4xl sm:text-5xl font-light tabular-nums text-ivory">
              {unit.value !== undefined
                ? String(unit.value).padStart(2, "0")
                : "--"}
            </span>
            <span className="mt-2 text-[10px] sm:text-xs uppercase tracking-[0.25em] text-ivory/70">
              {unit.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
