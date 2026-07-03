"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUserOrThrow } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";

export async function createPlaceAction(data: {
  name: string;
  location: string; // mapped from form client text input
  country: string;
  costEstimate?: string | null;
  status: "BUCKET_LIST" | "PLANNING" | "VISITED";
  notes?: string | null;
}) {
  await getCurrentUserOrThrow();

  await prisma.place.create({
    data: {
      name: data.name || null,
      country: data.country ? data.country.trim() : "Unknown Country", // 🌟 Added safety trim + fallback string logic
      city: data.location ? data.location.trim() : "Unknown City",
      notes: data.notes || null,
      estimatedBudget: data.costEstimate ? parseFloat(data.costEstimate) : null,
      visited: data.status === "VISITED",
      tags: [],
      isFavorite: false,
      isArchived: false,
    },
  });

  revalidatePath("/travel");
  revalidatePath("/dashboard");
}

export async function updatePlaceAction(
  id: string,
  data: {
    name: string;
    location: string;
    country: string;
    costEstimate?: string | null;
    status: "BUCKET_LIST" | "PLANNING" | "VISITED";
    notes?: string | null;
  },
) {
  await getCurrentUserOrThrow();

  await prisma.place.update({
    where: { id },
    data: {
      name: data.name || null,
      country: data.country,
      city: data.location, // 🌟 Fixed: Maps to schema "city"
      notes: data.notes || null,
      estimatedBudget: data.costEstimate ? parseFloat(data.costEstimate) : null, // 🌟 Fixed: Maps to schema field
      visited: data.status === "VISITED", // 🌟 Fixed: Maps status state to schema boolean
    },
  });

  revalidatePath("/travel");
}

export async function toggleFavoritePlaceAction(
  id: string,
  currentState: boolean,
) {
  await getCurrentUserOrThrow();

  await prisma.place.update({
    where: { id },
    data: { isFavorite: !currentState },
  });

  revalidatePath("/travel");
}

export async function archivePlaceAction(id: string) {
  await getCurrentUserOrThrow();

  await prisma.place.update({
    where: { id },
    data: { isArchived: true },
  });

  revalidatePath("/travel");
  revalidatePath("/dashboard");
}
