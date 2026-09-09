"use client";

/**
 * Bouton pour télécharger le QR code en PNG.
 */
export function DownloadQrButton({
  qrDataUrl,
  filename,
}: {
  qrDataUrl: string;
  filename: string;
}) {
  function handleDownload() {
    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      className="inline-flex items-center gap-2 bg-cocoa px-6 py-3 text-xs uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-night"
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
      Télécharger le QR
    </button>
  );
}
