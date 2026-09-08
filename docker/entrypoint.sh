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

exec node /app/server.js
