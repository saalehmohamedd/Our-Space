// src/app/actions/achievements.ts
"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUserOrThrow } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";

export async function createAchievementAction(data: {
  title: string;
  description?: string;
  targetDate?: string;
}) {
  const user = await getCurrentUserOrThrow();

  await prisma.achievement.create({
    data: {
      title: data.title,
      description: data.description || null,
      targetDate: data.targetDate ? new Date(data.targetDate) : null,
      createdById: user.id,
    },
  });

  revalidatePath("/achievements");
  revalidatePath("/dashboard");
}

export async function updateAchievementAction(
  id: string,
  data: {
    title: string;
    description?: string;
    targetDate?: string;
  }
) {
  await getCurrentUserOrThrow();

  await prisma.achievement.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description || null,
      targetDate: data.targetDate ? new Date(data.targetDate) : null,
    },
  });

  revalidatePath("/achievements");
}

export async function completeAchievementAction(id: string) {
  try {
    await getCurrentUserOrThrow();

    await prisma.achievement.update({
      where: { id },
      data: {
        isCompleted: true,
        achievedAt: new Date(),
      },
    });

    revalidatePath("/achievements");
    revalidatePath("/dashboard");
    
    return { success: true, message: "Achievement completed! 🎉" };
  } catch (error) {
    console.error("Complete achievement error:", error);
    throw new Error("Failed to complete achievement");
  }
}

export async function uncompleteAchievementAction(id: string) {
  await getCurrentUserOrThrow();

  await prisma.achievement.update({
    where: { id },
    data: {
      isCompleted: false,
      achievedAt: null,
    },
  });

  revalidatePath("/achievements");
}

export async function deleteAchievementAction(id: string) {
  await getCurrentUserOrThrow();

  await prisma.achievement.delete({
    where: { id },
  });

  revalidatePath("/achievements");
}