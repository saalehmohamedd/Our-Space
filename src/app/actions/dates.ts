"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUserOrThrow } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";

export async function createDateAction(data: {
  title: string;
  activity: string;
  location: string;
  scheduledAt: string;
  costEstimate?: string | null;
  status: "IDEA" | "PLANNED" | "COMPLETED";
  notes?: string | null;
}) {
  await getCurrentUserOrThrow();

  await prisma.dateOuting.create({
    data: {
      title: data.title,
      date: new Date(data.scheduledAt), // 🌟 FIXED: Maps to required 'date' field
      location: data.location,
      description: data.activity,       // 🌟 FIXED: Maps activity details into 'description'
      cost: data.costEstimate ? parseFloat(data.costEstimate) : null, // 🌟 FIXED: Maps to 'cost'
      notes: data.notes || null,
      tags: [data.status],              // 🌟 FIXED: Stores the status flag cleanly inside the tags string array
      rating: null,
      isFavorite: false,
      isArchived: false,
    },
  });

  revalidatePath("/dates");
  revalidatePath("/dashboard");
}

export async function updateDateAction(
  id: string,
  data: {
    title: string;
    activity: string;
    location: string;
    scheduledAt: string;
    costEstimate?: string | null;
    status: "IDEA" | "PLANNED" | "COMPLETED";
    rating?: number | null;
    notes?: string | null;
  }
) {
  await getCurrentUserOrThrow();

  await prisma.dateOuting.update({
    where: { id },
    data: {
      title: data.title,
      date: new Date(data.scheduledAt),
      location: data.location,
      description: data.activity,
      cost: data.costEstimate ? parseFloat(data.costEstimate) : null,
      notes: data.notes || null,
      rating: data.status === "COMPLETED" && data.rating ? Number(data.rating) : null,
      tags: [data.status],
    },
  });

  revalidatePath("/dates");
}

export async function toggleFavoriteDateAction(id: string, currentState: boolean) {
  await getCurrentUserOrThrow();

  await prisma.dateOuting.update({
    where: { id },
    data: { isFavorite: !currentState },
  });

  revalidatePath("/dates");
}

export async function archiveDateAction(id: string) {
  await getCurrentUserOrThrow();

  await prisma.dateOuting.update({
    where: { id },
    data: { isArchived: true },
  });

  revalidatePath("/dates");
  revalidatePath("/dashboard");
}