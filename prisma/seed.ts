import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

function requiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

async function main() {
  const partners = [
    {
      role: Role.PARTNER_A,
      clerkId: requiredEnv("SEED_PARTNER_A_CLERK_ID"),
      email: requiredEnv("SEED_PARTNER_A_EMAIL"),
      name: requiredEnv("SEED_PARTNER_A_NAME"),
    },
    {
      role: Role.PARTNER_B,
      clerkId: requiredEnv("SEED_PARTNER_B_CLERK_ID"),
      email: requiredEnv("SEED_PARTNER_B_EMAIL"),
      name: requiredEnv("SEED_PARTNER_B_NAME"),
    },
  ];

  for (const partner of partners) {
    await prisma.user.upsert({
      where: { role: partner.role },
      update: {
        clerkId: partner.clerkId,
        email: partner.email,
        name: partner.name,
      },
      create: partner,
    });
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    process.exit(1);
  });
