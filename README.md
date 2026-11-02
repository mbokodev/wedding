# Mariage Ange & Cédric

Site Next.js avec invitations privées PostgreSQL et confirmations de présence via Telegram.

## Déploiement Vercel

Importer le dépôt GitLab `vlc123/ange_de_cedric`, branche `main`. Sélectionner **Next.js**, le dossier racine du dépôt et **Node.js 24.x**. Garder la commande de build `pnpm build` et le dossier de sortie par défaut. Le build génère automatiquement le client Prisma ; il ne modifie pas la base de données.

Configurer dans **Settings → Environment Variables** avant le premier déploiement :

| Variable | Valeur |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | URL HTTPS finale du site, sans chemin (également utilisée dans les QR codes). |
| `DATABASE_URL` | URL PostgreSQL hébergée, idéalement avec pool de connexions, fournie par votre hébergeur. La base Docker locale n’est pas accessible depuis Vercel. Conserver les options SSL du fournisseur. |
| `TELEGRAM_BOT_TOKEN` | Token du bot Telegram, uniquement côté serveur. |
| `TELEGRAM_CHAT_ID` | Identifiant du chat qui reçoit les confirmations. Ouvrir une conversation avec le bot et lui envoyer `/start` au préalable, ou l’ajouter au groupe destinataire. |

Utiliser une base distincte pour les déploiements **Preview**. Le formulaire accepte l’URL canonique et les URL Vercel exactes du déploiement. Les previews peuvent envoyer des messages Telegram : utiliser un chat de test ou laisser ces deux variables absentes pour désactiver les envois.

### Initialiser la base une seule fois

Dans un terminal local avec les variables de la **base hébergée cible**, exécuter :

```bash
pnpm db:generate
pnpm db:deploy
pnpm db:bootstrap
```

Pour ces commandes, définir également `SEED_SUPER_ADMIN_EMAIL` et `SEED_SUPER_ADMIN_PASSWORD` (mot de passe unique d’au moins 12 caractères). `DIRECT_URL` est facultative : elle permet aux migrations et à l’initialisation d’utiliser une connexion directe si votre fournisseur la distingue de l’URL avec pool. Ces variables d’initialisation n’ont pas besoin d’être conservées sur Vercel.

`db:bootstrap` crée le super administrateur et une capacité initiale de 500 personnes, sans effacer les invitations ni changer les comptes existants. **Ne pas utiliser `db:seed` sur une vraie base** : c’est un jeu de démonstration qui efface les données. Il est bloqué lorsque `NODE_ENV=production` ou `VERCEL` est défini.

Pour chaque évolution future du schéma, appliquer `pnpm db:deploy` à la base concernée avant de publier le code correspondant. Les migrations ne sont volontairement pas exécutées lors des builds Preview.

Après déploiement, vérifier la connexion administrateur, une invitation et l’arrivée d’une confirmation réelle dans Telegram. Une modification de `NEXT_PUBLIC_SITE_URL` nécessite un nouveau build. Le limiteur de tentatives actuel est en mémoire par instance ; pour une limitation globale sur Vercel, configurer une règle de limitation dans le pare-feu ou un stockage partagé.

## Développement local

```bash
pnpm install
# Copier .env.example en .env et renseigner les valeurs.
pnpm db:up
pnpm db:generate
pnpm db:migrate
pnpm db:bootstrap
pnpm dev
```

Vérifications : `pnpm lint`, `pnpm typecheck`, `pnpm build`. Le build utilise Webpack. Les polices sont hébergées dans le projet avec leurs licences : aucun téléchargement Google Fonts n’est nécessaire au build.
Le Dockerfile reste disponible pour un hébergement Node autonome.
