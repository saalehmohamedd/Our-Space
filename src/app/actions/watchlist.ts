// src/app/actions/watchlist.ts
"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUserOrThrow } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";

export async function createWatchItemAction(data: {
  name: string;
  type: "MOVIE" | "TV_SHOW";
  posterUrl?: string;
  streamingPlatform?: string;
  trailerUrl?: string;
  imdbUrl?: string;
  notes?: string;
  status: "WANT_TO_WATCH" | "WATCHING" | "FINISHED";
}) {
  await getCurrentUserOrThrow();

  await prisma.watchItem.create({
    data: {
      name: data.name,
      type: data.type,
      posterUrl: data.posterUrl || null,
      streamingPlatform: data.streamingPlatform || null,
      trailerUrl: data.trailerUrl || null,
      imdbUrl: data.imdbUrl || null,
      notes: data.notes || null,
      status: data.status,
    },
  });

  revalidatePath("/watchlist");
  revalidatePath("/dashboard");
}

export async function updateWatchItemAction(
  id: string,
  data: {
    name: string;
    type: "MOVIE" | "TV_SHOW";
    posterUrl?: string;
    streamingPlatform?: string;
    trailerUrl?: string;
    imdbUrl?: string;
    notes?: string;
    status: "WANT_TO_WATCH" | "WATCHING" | "FINISHED";
  }
) {
  await getCurrentUserOrThrow();

  await prisma.watchItem.update({
    where: { id },
    data: {
      name: data.name,
      type: data.type,
      posterUrl: data.posterUrl || null,
      streamingPlatform: data.streamingPlatform || null,
      trailerUrl: data.trailerUrl || null,
      imdbUrl: data.imdbUrl || null,
      notes: data.notes || null,
      status: data.status,
    },
  });

  revalidatePath("/watchlist");
}

export async function deleteWatchItemAction(id: string) {
  await getCurrentUserOrThrow();

  await prisma.watchItem.delete({
    where: { id },
  });

  revalidatePath("/watchlist");
}

export async function toggleFavoriteWatchItemAction(id: string, currentState: boolean) {
  await getCurrentUserOrThrow();

  await prisma.watchItem.update({
    where: { id },
    data: { isFavorite: !currentState },
  });

  revalidatePath("/watchlist");
}

export async function updateWatchStatusAction(
  id: string,
  status: "WANT_TO_WATCH" | "WATCHING" | "FINISHED"
) {
  await getCurrentUserOrThrow();

  await prisma.watchItem.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/watchlist");
}