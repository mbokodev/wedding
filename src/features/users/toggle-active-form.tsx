"use client";

import { useActionState } from "react";
import type { UserActionState } from "@/features/users/actions";

const initialState: UserActionState = { error: null };

/**
 * Bouton activer/désactiver un utilisateur.
 * `action` est setUserActive déjà lié (userId + nouvel état).
 */
export function ToggleActiveForm({
  action,
  isActive,
  userName,
}: {
  action: (state: UserActionState, formData: FormData) => Promise<UserActionState>;
  isActive: boolean;
  userName: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (
          isActive &&
          !window.confirm(
            `Désactiver ${userName} ? Ses sessions seront immédiatement révoquées.`
          )
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
          isActive
            ? "text-xs uppercase tracking-[0.15em] text-red-800 underline-offset-4 hover:underline disabled:opacity-50"
            : "text-xs uppercase tracking-[0.15em] text-sage-dark underline-offset-4 hover:underline disabled:opacity-50"
        }
      >
        {pending ? "…" : isActive ? "Désactiver" : "Réactiver"}
      </button>
      {state.error && (
        <span className="ml-2 text-xs text-red-800">{state.error}</span>
      )}
    </form>
  );
}
