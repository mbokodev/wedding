import type { CSSProperties } from "react";

/** Déterministe pour conserver un rendu identique avant et après hydratation. */
export function Petals({ gentle = false }: { gentle?: boolean }) {
  return <div className={`falling-petals${gentle ? " falling-petals-gentle" : ""}`} aria-hidden="true">
    {Array.from({ length: gentle ? 9 : 24 }, (_, i) => <span key={i} className="petal-fall" style={{ left: `${(i * 37 + 5) % 100}%`, "--fall-time": `${12 + i % 7}s`, "--fall-delay": `${-i * 2.3}s`, "--petal-size": `${9 + i % 5 * 3}px`, "--sway": `${i % 2 ? -1 : 1}` } as CSSProperties}><i /></span>)}
  </div>;
}
