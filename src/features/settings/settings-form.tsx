"use client";

import { useActionState } from "react";
import { updateSettings, type SettingsState } from "@/features/settings/actions";

const initialState: SettingsState = { error: null, success: false };

export function SettingsForm({
  currentCapacity,
  invitedGuests,
}: {
  currentCapacity: number;
  invitedGuests: number;
}) {
  const [state, formAction, pending] = useActionState(updateSettings, initialState);

  return (
    <form action={formAction} className="max-w-md space-y-5">
      <div>
        <label
          htmlFor="totalGuestCapacity"
          className="block text-xs uppercase tracking-[0.2em] text-cocoa-light"
        >
          Capacité totale (personnes)
        </label>
        <input
          id="totalGuestCapacity"
          name="totalGuestCapacity"
          type="number"
          min={Math.max(1, invitedGuests)}
          max={1000000}
          step={1}
          required
          defaultValue={currentCapacity}
          className="mt-2 w-full border border-cocoa/20 bg-white px-4 py-3 text-base text-cocoa outline-none transition-colors focus:border-gold"
        />
        <p className="mt-2 text-xs font-light text-cocoa-light">
          {invitedGuests} personnes sont déjà invitées : la capacité ne peut pas
          descendre en dessous.
        </p>
      </div>

      {state.error && (
        <p
          role="alert"
          className="border border-red-800/20 bg-red-50 px-4 py-3 text-sm text-red-900"
        >
          {state.error}
        </p>
      )}
      {state.success && !state.error && (
        <p className="border border-sage-dark/20 bg-sage-light px-4 py-3 text-sm text-sage-dark">
          Capacité mise à jour.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="bg-cocoa px-8 py-3.5 text-xs uppercase tracking-[0.25em] text-ivory transition-colors hover:bg-night disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Enregistrement…" : "Enregistrer"}
      </button>
    </form>
  );
}
