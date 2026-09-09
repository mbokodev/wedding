"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Bouton qui copie un lien dans le presse-papier avec feedback visuel.
 */
export function CopyLinkButton({
  url,
  className,
}: {
  url: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback pour les navigateurs sans API Clipboard
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "text-xs uppercase tracking-[0.15em] underline-offset-4 hover:underline transition-colors",
        copied ? "text-sage-dark" : "text-cocoa-light",
        className
      )}
    >
      {copied ? "Copié !" : "Copier"}
    </button>
  );
}
