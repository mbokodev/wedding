# ============================================================
# Dockerfile — Site de mariage (Next.js 16, pnpm, standalone)
# Pensé pour un déploiement Dokploy (provider "Dockerfile").
# ============================================================

# ---------- Étape 1 : dépendances ----------
FROM node:24-alpine AS deps
WORKDIR /app

RUN npm install -g pnpm@10.18.0

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# ---------- Étape 2 : build ----------
FROM node:24-alpine AS builder
WORKDIR /app

RUN npm install -g pnpm@10.18.0

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Variables publiques inlinées au build (à définir dans Dokploy → Build args)
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL

ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

# ---------- Étape 3 : image finale ----------
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

# Utilisateur non-root
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Sortie standalone : serveur + node_modules minimal
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
