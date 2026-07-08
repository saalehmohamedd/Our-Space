// scripts/backfill-avatars.ts
import { config } from "dotenv";
// Try loading .env.local first, fallback to .env
config({ path: [".env.local", ".env"] }); 

import { clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";// load before anything else uses env vars


async function main() {
  const users = await prisma.user.findMany();
  const client = await clerkClient();

  for (const user of users) {
    const clerkUser = await client.users.getUser(user.clerkId);
    await prisma.user.update({
      where: { id: user.id },
      data: { avatarUrl: clerkUser.imageUrl },
    });
    console.log(`${user.name} -> ${clerkUser.imageUrl}`);
  }
}

main().then(() => process.exit(0));