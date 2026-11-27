#!/bin/sh
set -e

# Applique les migrations Prisma avant de démarrer le serveur.
# Désactivable avec SKIP_MIGRATIONS=1 (ex: rollback d'urgence).
if [ "${SKIP_MIGRATIONS:-0}" != "1" ]; then
  echo "[entrypoint] Application des migrations Prisma…"
  cd /app/migrate
  node node_modules/prisma/build/index.js migrate deploy
  cd /app
  echo "[entrypoint] Migrations OK."
fi

# Initialisation facultative et non destructive du super administrateur.
# Le bootstrap conserve les comptes et mots de passe déjà existants.
if [ -n "${SEED_SUPER_ADMIN_EMAIL:-}" ] || [ -n "${SEED_SUPER_ADMIN_PASSWORD:-}" ]; then
  echo "[entrypoint] Initialisation du super administrateur…"
  cd /app/migrate
  node node_modules/tsx/dist/cli.mjs prisma/bootstrap.ts
  cd /app
fi

exec node /app/server.js
