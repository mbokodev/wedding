import "server-only";

/**
 * Rate-limiter en mémoire pour le login (protection brute-force raisonnable).
 * Suffisant pour un déploiement mono-instance (Dokploy).
 *
 * Politique : 5 échecs par clé (identifiant + IP) sur 15 minutes,
 * puis blocage jusqu'à la fin de la fenêtre.
 */

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

type Entry = { count: number; firstAttemptAt: number };

const attempts = new Map<string, Entry>();

/** Nettoyage paresseux des entrées expirées (évite une fuite mémoire lente). */
function cleanup(now: number) {
  if (attempts.size < 1000) return;
  for (const [key, entry] of attempts) {
    if (now - entry.firstAttemptAt > WINDOW_MS) attempts.delete(key);
  }
}

/** true si la clé est actuellement bloquée. */
export function isRateLimited(key: string): boolean {
  const entry = attempts.get(key);
  if (!entry) return false;

  const now = Date.now();
  if (now - entry.firstAttemptAt > WINDOW_MS) {
    attempts.delete(key);
    return false;
  }
  return entry.count >= MAX_ATTEMPTS;
}

/** Enregistre un échec de connexion. */
export function recordFailedAttempt(key: string): void {
  const now = Date.now();
  cleanup(now);

  const entry = attempts.get(key);
  if (!entry || now - entry.firstAttemptAt > WINDOW_MS) {
    attempts.set(key, { count: 1, firstAttemptAt: now });
    return;
  }
  entry.count += 1;
}

/** Réinitialise le compteur (connexion réussie). */
export function clearAttempts(key: string): void {
  attempts.delete(key);
}
