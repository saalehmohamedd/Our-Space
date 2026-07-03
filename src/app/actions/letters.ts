// src/app/actions/letters.ts
"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUserOrThrow } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";

export async function createLoveLetterAction(data: {
  title: string;
  content: string;
  mood: "HAPPY" | "ROMANTIC" | "NOSTALGIC" | "SAD" | "EXCITED" | "GRATEFUL" | "CALM";
  date: string;
}) {
  const user = await getCurrentUserOrThrow();

  await prisma.loveLetter.create({
    data: {
      title: data.title,
      content: data.content,
      mood: data.mood,
      date: new Date(data.date),
      senderId: user.id,
    },
  });

  revalidatePath("/letters");
  revalidatePath("/dashboard");
}

export async function updateLoveLetterAction(
  id: string,
  data: {
    title: string;
    content: string;
    mood: "HAPPY" | "ROMANTIC" | "NOSTALGIC" | "SAD" | "EXCITED" | "GRATEFUL" | "CALM";
    date: string;
  }
) {
  await getCurrentUserOrThrow();

  await prisma.loveLetter.update({
    where: { id },
    data: {
      title: data.title,
      content: data.content,
      mood: data.mood,
      date: new Date(data.date),
    },
  });

  revalidatePath("/letters");
}

export async function deleteLoveLetterAction(id: string) {
  await getCurrentUserOrThrow();

  await prisma.loveLetter.delete({
    where: { id },
  });

  revalidatePath("/letters");
}

export async function toggleFavoriteLoveLetterAction(id: string, currentState: boolean) {
  await getCurrentUserOrThrow();

  await prisma.loveLetter.update({
    where: { id },
    data: { isFavorite: !currentState },
  });

  revalidatePath("/letters");
}