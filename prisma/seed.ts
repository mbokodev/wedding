/**
 * Seed de démonstration.
 *
 * Crée :
 * - 1 SUPER_ADMIN (credentials via .env)
 * - 3 ADMIN avec quotas (dont un identifié par téléphone uniquement)
 * - 2 CHECK_IN_AGENT
 * - ~20 billets (groupes de 1/2/4/6, statuts variés)
 * - les check-ins des billets CHECKED_IN
 * - les paramètres globaux (capacité totale)
 *
 * Usage : pnpm db:seed  (ou pnpm prisma db seed)
 * Le seed est idempotent : il vide les tables avant de recréer les données.
 */
import "dotenv/config";
import { hashSync } from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Role, TicketStatus } from "../src/generated/prisma/client";
import {
  generateTicketToken,
  formatTicketReference,
} from "../src/server/ticket-utils";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL n'est pas définie");

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

const SUPER_ADMIN_EMAIL =
  process.env.SEED_SUPER_ADMIN_EMAIL ?? "admin@wedding.local";
const SUPER_ADMIN_PASSWORD = process.env.SEED_SUPER_ADMIN_PASSWORD;
const DEMO_PASSWORD = process.env.SEED_DEMO_PASSWORD ?? "demo-dev-2026";

if (!SUPER_ADMIN_PASSWORD) {
  throw new Error(
    "SEED_SUPER_ADMIN_PASSWORD doit être définie dans .env (voir .env.example)"
  );
}

/** Récupère la prochaine référence lisible depuis la séquence Postgres. */
async function nextReference(): Promise<string> {
  const [{ nextval }] = await db.$queryRaw<[{ nextval: bigint }]>`
    SELECT nextval('ticket_reference_seq')
  `;
  return formatTicketReference(nextval);
}

async function main() {
  console.log("— Nettoyage des tables…");
  await db.checkIn.deleteMany();
  await db.ticket.deleteMany();
  await db.user.deleteMany();
  await db.weddingSettings.deleteMany();
  await db.$executeRaw`ALTER SEQUENCE ticket_reference_seq RESTART WITH 1`;

  console.log("— Paramètres globaux…");
  await db.weddingSettings.create({
    data: { id: 1, totalGuestCapacity: 500 },
  });

  console.log("— Utilisateurs…");
  const superAdminHash = hashSync(SUPER_ADMIN_PASSWORD!, 12);
  const demoHash = hashSync(DEMO_PASSWORD, 12);

  await db.user.create({
    data: {
      fullName: "Cédric (Super Admin)",
      email: SUPER_ADMIN_EMAIL,
      phone: "+237600000001",
      passwordHash: superAdminHash,
      role: Role.SUPER_ADMIN,
      quota: null, // illimité
    },
  });

  const [ange, papa, maman] = await Promise.all([
    db.user.create({
      data: {
        fullName: "Ange",
        email: "ange@wedding.local",
        phone: "+237600000002",
        passwordHash: demoHash,
        role: Role.ADMIN,
        quota: 80,
      },
    }),
    db.user.create({
      data: {
        fullName: "Papa",
        // Identifié uniquement par téléphone (cas de test login)
        phone: "+237600000003",
        passwordHash: demoHash,
        role: Role.ADMIN,
        quota: 60,
      },
    }),
    db.user.create({
      data: {
        fullName: "Maman",
        email: "maman@wedding.local",
        passwordHash: demoHash,
        role: Role.ADMIN,
        quota: 50,
      },
    }),
  ]);

  const [kevin] = await Promise.all([
    db.user.create({
      data: {
        fullName: "Kevin (Agent)",
        email: "kevin@wedding.local",
        phone: "+237600000004",
        passwordHash: demoHash,
        role: Role.CHECK_IN_AGENT,
        quota: null,
      },
    }),
    db.user.create({
      data: {
        fullName: "Nadia (Agent)",
        phone: "+237600000005",
        passwordHash: demoHash,
        role: Role.CHECK_IN_AGENT,
        quota: null,
      },
    }),
  ]);

  console.log("— Billets…");

  type TicketSeed = {
    guestName: string;
    guestCount: number;
    createdById: string;
    status?: TicketStatus;
  };

  const ticketSeeds: TicketSeed[] = [
    // Billets d'Ange (quota 80)
    { guestName: "Famille Nampa", guestCount: 4, createdById: ange.id, status: TicketStatus.CHECKED_IN },
    { guestName: "Famille Etoundi", guestCount: 6, createdById: ange.id },
    { guestName: "M. & Mme Talla", guestCount: 2, createdById: ange.id, status: TicketStatus.CHECKED_IN },
    { guestName: "Mlle Sandrine Ekotto", guestCount: 1, createdById: ange.id },
    { guestName: "Famille Mbarga", guestCount: 4, createdById: ange.id },
    { guestName: "Dr. Paul Essomba", guestCount: 2, createdById: ange.id },
    { guestName: "Famille Ngo Bassa", guestCount: 6, createdById: ange.id },
    // Billets de Papa (quota 60)
    { guestName: "Famille Kamdem", guestCount: 6, createdById: papa.id, status: TicketStatus.CHECKED_IN },
    { guestName: "Chef Tonye & épouse", guestCount: 2, createdById: papa.id },
    { guestName: "Famille Fotso", guestCount: 4, createdById: papa.id },
    { guestName: "M. Jean Mballa", guestCount: 1, createdById: papa.id },
    { guestName: "Famille Tchoua", guestCount: 4, createdById: papa.id, status: TicketStatus.CANCELLED },
    { guestName: "Mme Véronique Ndoumbe", guestCount: 2, createdById: papa.id },
    { guestName: "Famille Simo", guestCount: 6, createdById: papa.id },
    // Billets de Maman (quota 50)
    { guestName: "Famille Ateba", guestCount: 4, createdById: maman.id, status: TicketStatus.CHECKED_IN },
    { guestName: "Sœur Marie-Claire", guestCount: 1, createdById: maman.id },
    { guestName: "Famille Owona", guestCount: 2, createdById: maman.id },
    { guestName: "Famille Biyick", guestCount: 6, createdById: maman.id },
    { guestName: "M. & Mme Eyenga", guestCount: 2, createdById: maman.id },
    { guestName: "Tante Rosalie", guestCount: 1, createdById: maman.id },
    { guestName: "Famille Njoya", guestCount: 4, createdById: maman.id },
  ];

  const demoTokens: Record<string, string> = {};

  for (const seed of ticketSeeds) {
    const token = generateTicketToken();
    const reference = await nextReference();
    const status = seed.status ?? TicketStatus.ACTIVE;

    const ticket = await db.ticket.create({
      data: {
        reference,
        guestName: seed.guestName,
        guestCount: seed.guestCount,
        token,
        status,
        createdById: seed.createdById,
      },
    });

    // Historique de check-in pour les billets déjà scannés
    if (status === TicketStatus.CHECKED_IN) {
      await db.checkIn.create({
        data: {
          ticketId: ticket.id,
          checkedInById: kevin.id,
          guestCount: ticket.guestCount,
        },
      });
    }

    demoTokens[`${reference} · ${seed.guestName} (${status})`] = token;
  }

  console.log("\n✓ Seed terminé.\n");
  console.log("Comptes :");
  console.log(`  SUPER_ADMIN     ${SUPER_ADMIN_EMAIL} (mdp: SEED_SUPER_ADMIN_PASSWORD)`);
  console.log("  ADMIN           ange@wedding.local · +237600000003 (Papa) · maman@wedding.local (mdp: SEED_DEMO_PASSWORD)");
  console.log("  CHECK_IN_AGENT  kevin@wedding.local · +237600000005 (Nadia) (mdp: SEED_DEMO_PASSWORD)");
  console.log("\nInvitations de test (http://localhost:3000/invitation/<token>) :");
  for (const [label, token] of Object.entries(demoTokens).slice(0, 5)) {
    console.log(`  ${label}\n    → ${token}`);
  }

  const cancelled = Object.entries(demoTokens).find(([l]) => l.includes("CANCELLED"));
  if (cancelled) {
    console.log(`  ${cancelled[0]} (doit afficher 404)\n    → ${cancelled[1]}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
