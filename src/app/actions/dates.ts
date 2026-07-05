// src/app/actions/dates.ts
"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUserOrThrow } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";

export async function createDateAction(data: {
  title: string;
  activity: string;
  location: string;
  scheduledAt: string;
  costEstimate?: string;
  status?: string;
  notes?: string;
  cardId?: string;
}) {
  try {
    await getCurrentUserOrThrow();

    const item = await prisma.dateOuting.create({
      data: {
        title: data.title,
        date: new Date(data.scheduledAt),
        location: data.location,
        description: data.activity,
        cost: data.costEstimate ? parseFloat(data.costEstimate) : null,
        notes: data.notes || null,
        cardId: data.cardId || null,
      },
    });

    revalidatePath("/dates");
    revalidatePath("/dashboard");
    return { success: true, message: "Date planned! 💝", id: item.id };
  } catch (error) {
    console.error("Create date error:", error);
    throw new Error("Failed to create date");
  }
}

export async function updateDateAction(
  id: string,
  data: {
    title: string;
    activity: string;
    location: string;
    scheduledAt: string;
    costEstimate?: string;
    status?: string;
    rating?: number;
    notes?: string;
    cardId?: string;
  }
) {
  try {
    await getCurrentUserOrThrow();

    await prisma.dateOuting.update({
      where: { id },
      data: {
        title: data.title,
        date: new Date(data.scheduledAt),
        location: data.location,
        description: data.activity,
        cost: data.costEstimate ? parseFloat(data.costEstimate) : null,
        rating: data.rating || null,
        notes: data.notes || null,
        cardId: data.cardId || null,
      },
    });

    revalidatePath("/dates");
    revalidatePath("/dashboard");
    return { success: true, message: "Date updated! ✨" };
  } catch (error) {
    console.error("Update date error:", error);
    throw new Error("Failed to update date");
  }
}

export async function toggleFavoriteDateAction(id: string, currentState: boolean) {
  try {
    await getCurrentUserOrThrow();
    await prisma.dateOuting.update({
      where: { id },
      data: { isFavorite: !currentState },
    });
    revalidatePath("/dates");
    return { success: true };
  } catch (error) {
    console.error("Toggle favorite date error:", error);
    throw new Error("Failed to update favorite");
  }
}

export async function archiveDateAction(id: string) {
  try {
    await getCurrentUserOrThrow();
    await prisma.dateOuting.update({
      where: { id },
      data: { isArchived: true },
    });
    revalidatePath("/dates");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Archive date error:", error);
    throw new Error("Failed to archive date");
  }
}