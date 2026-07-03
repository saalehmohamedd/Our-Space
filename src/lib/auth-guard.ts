import "server-only";

import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

export async function getCurrentUserOrThrow() {
  const { userId } = await auth();

  console.log("userId:", userId);

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  console.log("db user:", user);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}