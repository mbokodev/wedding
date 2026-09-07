"use client";

/** Bouton d'impression / export PDF de l'invitation. */
export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print inline-flex items-center gap-2 border border-cocoa/25 px-6 py-3 text-xs uppercase tracking-[0.2em] text-cocoa transition-all duration-300 hover:border-gold hover:bg-gold hover:text-ivory"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden
      >
        <path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
        <path d="M6 14h12v7H6z" />
      </svg>
      Imprimer / PDF
    </button>
  );
}
