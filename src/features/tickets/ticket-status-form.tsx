"use client";

import { useActionState } from "react";
import type { TicketActionState } from "@/features/tickets/actions";

const initialState: TicketActionState = { error: null };

/**
 * Bouton annuler/réactiver un billet.
 */
export function TicketStatusForm({
  action,
  actionType,
  guestName,
}: {
  action: (state: TicketActionState, formData: FormData) => Promise<TicketActionState>;
  actionType: "cancel" | "reactivate";
  guestName: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  const isCancel = actionType === "cancel";

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (
          isCancel &&
          !window.confirm(`Annuler le billet de ${guestName} ? Le quota sera libéré.`)
        ) {
          e.preventDefault();
        }
      }}
      className="inline"
    >
      <button
        type="submit"
        disabled={pending}
        className={
          isCancel
            ? "text-xs uppercase tracking-[0.15em] text-red-800 underline-offset-4 hover:underline disabled:opacity-50"
            : "text-xs uppercase tracking-[0.15em] text-sage-dark underline-offset-4 hover:underline disabled:opacity-50"
        }
      >
        {pending ? "…" : isCancel ? "Annuler" : "Réactiver"}
      </button>
      {state.error && (
        <span className="ml-2 text-xs text-red-800">{state.error}</span>
      )}
    </form>
  );
}
