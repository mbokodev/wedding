"use client";

import { useTransition } from "react";
import { logout } from "@/features/auth/actions";
import { cn } from "@/lib/utils";

export function LogoutButton({ className }: { className?: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => logout())}
      className={cn(
        "text-xs uppercase tracking-[0.2em] underline-offset-4 transition-colors hover:underline disabled:opacity-60",
        className
      )}
    >
      {pending ? "Déconnexion…" : "Se déconnecter"}
    </button>
  );
}
