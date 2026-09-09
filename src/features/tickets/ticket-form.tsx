"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { TicketActionState } from "@/features/tickets/actions";

const initialState: TicketActionState = { error: null };

const inputClass =
  "mt-2 w-full border border-cocoa/20 bg-white px-4 py-3 text-base text-cocoa placeholder:text-cocoa/35 outline-none transition-colors focus:border-gold";

const labelClass = "block text-xs uppercase tracking-[0.2em] text-cocoa-light";

export type TicketFormDefaults = {
  guestName: string;
  guestCount: string;
};

/**
 * Formulaire de création / édition d'un billet.
 */
export function TicketForm({
  action,
  defaults,
  mode,
  quotaRemaining,
}: {
  action: (state: TicketActionState, formData: FormData) => Promise<TicketActionState>;
  defaults: TicketFormDefaults;
  mode: "create" | "edit";
  quotaRemaining?: number | null;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="max-w-xl space-y-5">
      <div>
        <label htmlFor="guestName" className={labelClass}>
          Nom de l&apos;invité / du groupe
        </label>
        <input
          id="guestName"
          name="guestName"
          type="text"
          required
          autoFocus
          defaultValue={defaults.guestName}
          placeholder="Ex : Famille Mbarga ou M. & Mme Talla"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="guestCount" className={labelClass}>
          Nombre de personnes
        </label>
        <input
          id="guestCount"
          name="guestCount"
          type="number"
          min={1}
          max={50}
          step={1}
          required
          defaultValue={defaults.guestCount}
          placeholder="Ex : 4"
          className={inputClass}
        />
        {quotaRemaining !== undefined && quotaRemaining !== null && (
          <p className="mt-2 text-xs font-light text-cocoa-light">
            {quotaRemaining > 0
              ? `Il vous reste ${quotaRemaining} place${quotaRemaining > 1 ? "s" : ""} sur votre quota.`
              : "Votre quota est épuisé."}
          </p>
        )}
      </div>

      {state.error && (
        <p
          role="alert"
          className="border border-red-800/20 bg-red-50 px-4 py-3 text-sm text-red-900"
        >
          {state.error}
        </p>
      )}

      <div className="flex items-center gap-6 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="bg-cocoa px-8 py-3.5 text-xs uppercase tracking-[0.25em] text-ivory transition-colors hover:bg-night disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending
            ? "Enregistrement…"
            : mode === "create"
              ? "Créer le billet"
              : "Enregistrer"}
        </button>
        <Link
          href="/admin/tickets"
          className="text-xs uppercase tracking-[0.2em] text-cocoa-light underline-offset-4 hover:underline"
        >
          Annuler
        </Link>
      </div>
    </form>
  );
}
