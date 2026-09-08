"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/features/auth/actions";

const initialState: LoginState = { error: null };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label
          htmlFor="identifier"
          className="block text-xs uppercase tracking-[0.2em] text-cocoa-light"
        >
          Email ou téléphone
        </label>
        <input
          id="identifier"
          name="identifier"
          type="text"
          autoComplete="username"
          required
          autoFocus
          placeholder="vous@exemple.com ou +237 6XX XX XX XX"
          className="mt-2 w-full border border-cocoa/20 bg-white px-4 py-3 text-base text-cocoa placeholder:text-cocoa/35 outline-none transition-colors focus:border-gold"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-xs uppercase tracking-[0.2em] text-cocoa-light"
        >
          Mot de passe
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-2 w-full border border-cocoa/20 bg-white px-4 py-3 text-base text-cocoa outline-none transition-colors focus:border-gold"
        />
      </div>

      {state.error && (
        <p
          role="alert"
          className="border border-red-800/20 bg-red-50 px-4 py-3 text-sm text-red-900"
        >
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-cocoa px-6 py-3.5 text-xs uppercase tracking-[0.25em] text-ivory transition-colors hover:bg-night disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
