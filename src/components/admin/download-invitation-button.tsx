"use client";

import { useRef, useState, type ReactNode } from "react";
import html2canvas from "html2canvas";

/**
 * Wrapper qui permet de télécharger son contenu en image PNG.
 */
export function DownloadableInvitation({
  children,
  filename,
}: {
  children: ReactNode;
  filename: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  async function handleDownload() {
    if (!cardRef.current) return;
    setDownloading(true);

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2, // Haute résolution
        backgroundColor: "#faf7f1", // Fond ivory
        useCORS: true,
      });

      const link = document.createElement("a");
      link.download = filename;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Erreur lors de la génération de l'image:", error);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div ref={cardRef} className="inline-block">
        {children}
      </div>
      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className="inline-flex items-center gap-2 bg-cocoa px-8 py-3.5 text-xs uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-night disabled:opacity-60"
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
            <path
              d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {downloading ? "Génération…" : "Télécharger le billet"}
        </button>
      </div>
    </div>
  );
}
