"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import type { UserActionState } from "@/features/users/actions";

const initialState: UserActionState = { error: null };

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Super admin",
  ADMIN: "Admin (peut inviter)",
  CHECK_IN_AGENT: "Agent check-in",
};

export type UserFormDefaults = {
  fullName: string;
  email: string;
  phone: string;
  role: string;
  quota: string;
};

const inputClass =
  "mt-2 w-full border border-cocoa/20 bg-white px-4 py-3 text-base text-cocoa placeholder:text-cocoa/35 outline-none transition-colors focus:border-gold";

const labelClass = "block text-xs uppercase tracking-[0.2em] text-cocoa-light";

/**
 * Formulaire de création / édition d'un utilisateur.
 * `action` est la server action déjà liée (bind) à l'utilisateur cible.
 */
export function UserForm({
  action,
  defaults,
  mode,
  quotaUsed = 0,
}: {
  action: (state: UserActionState, formData: FormData) => Promise<UserActionState>;
  defaults: UserFormDefaults;
  mode: "create" | "edit";
  quotaUsed?: number;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [role, setRole] = useState(defaults.role);

  return (
    <form action={formAction} className="max-w-xl space-y-5">
      <div>
        <label htmlFor="fullName" className={labelClass}>
          Nom complet
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          required
          defaultValue={defaults.fullName}
          placeholder="Ex : Tante Rosalie"
          className={inputClass}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className={labelClass}>
            Email <span className="normal-case text-cocoa/40">(optionnel)</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={defaults.email}
            placeholder="prenom@exemple.com"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>
            Téléphone <span className="normal-case text-cocoa/40">(optionnel)</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={defaults.phone}
            placeholder="6XX XX XX XX"
            className={inputClass}
          />
        </div>
      </div>
      <p className="text-xs font-light text-cocoa-light">
        Au moins un des deux est requis : il servira d&rsquo;identifiant de
        connexion.
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="role" className={labelClass}>
            Rôle
          </label>
          <select
            id="role"
            name="role"
            required
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className={inputClass}
          >
            {Object.entries(ROLE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        {role === "ADMIN" && (
          <div>
            <label htmlFor="quota" className={labelClass}>
              Quota (personnes)
            </label>
            <input
              id="quota"
              name="quota"
              type="number"
              min={quotaUsed}
              max={100000}
              step={1}
              required
              defaultValue={defaults.quota}
              placeholder="Ex : 80"
              className={inputClass}
            />
            {mode === "edit" && quotaUsed > 0 && (
              <p className="mt-2 text-xs font-light text-cocoa-light">
                {quotaUsed} personnes déjà invitées : le quota ne peut pas
                descendre en dessous.
              </p>
            )}
          </div>
        )}
      </div>

      <div>
        <label htmlFor="password" className={labelClass}>
          {mode === "create" ? "Mot de passe" : "Nouveau mot de passe"}
          {mode === "edit" && (
            <span className="ml-1 normal-case text-cocoa/40">
              (laisser vide pour ne pas changer)
            </span>
          )}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required={mode === "create"}
          minLength={mode === "create" ? 8 : undefined}
          className={inputClass}
        />
        {mode === "create" && (
          <p className="mt-2 text-xs font-light text-cocoa-light">
            8 caractères minimum. Communiquez-le à la personne concernée.
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
              ? "Créer le compte"
              : "Enregistrer"}
        </button>
        <Link
          href="/admin/users"
          className="text-xs uppercase tracking-[0.2em] text-cocoa-light underline-offset-4 hover:underline"
        >
          Annuler
        </Link>
      </div>
    </form>
  );
}
