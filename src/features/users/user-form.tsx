"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import type { UserActionState } from "@/features/users/actions";
import { userEmailFromName } from "@/lib/user-email";

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
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState(defaults.fullName);

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
          value={fullName}
          onChange={event => setFullName(event.target.value)}
          placeholder="Ex : Tante Rosalie"
          className={inputClass}
        />
      </div>

      {mode === "create" && (
        <p className="rounded-lg border border-gold/30 bg-sage-light/50 px-4 py-3 text-sm text-cocoa" aria-live="polite">
          Identifiant de connexion : <strong className="break-all">{userEmailFromName(fullName) || "généré à partir du nom complet"}</strong>
        </p>
      )}
      <div className={mode === "edit" ? "grid gap-5 sm:grid-cols-2" : "grid gap-5"}>
        {mode === "edit" && <div>
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
        </div>}
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
      {mode === "edit" && <p className="text-xs font-light text-cocoa-light">
        Au moins un des deux est requis : il servira d&rsquo;identifiant de
        connexion.
      </p>}

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
        <div className="relative">
        <input
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          required={mode === "create"}
          minLength={mode === "create" ? 8 : undefined}
          className={`${inputClass} pr-14`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(value => !value)}
          aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          aria-controls="password"
          aria-pressed={showPassword}
          title={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          className="absolute right-1 bottom-1 flex h-11 w-11 items-center justify-center rounded-md text-sage-dark transition-colors hover:bg-sage-light hover:text-cocoa focus-visible:outline-2 focus-visible:outline-gold"
        >
          <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
            <circle cx="12" cy="12" r="3" />
            {showPassword && <path d="m3 3 18 18" />}
          </svg>
        </button>
        </div>
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
