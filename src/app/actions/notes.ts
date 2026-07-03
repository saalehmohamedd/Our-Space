// src/app/actions/notes.ts
"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUserOrThrow } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";

export async function createPrivateNoteAction(data: {
  title: string;
  content: string;
  mood?: "HAPPY" | "ROMANTIC" | "NOSTALGIC" | "SAD" | "EXCITED" | "GRATEFUL" | "CALM";
  date: string;
}) {
  const user = await getCurrentUserOrThrow();

  await prisma.privateNote.create({
    data: {
      title: data.title,
      content: data.content,
      mood: data.mood || null,
      date: new Date(data.date),
      ownerId: user.id,
    },
  });

  revalidatePath("/notes");
  revalidatePath("/dashboard");
}

export async function updatePrivateNoteAction(
  id: string,
  data: {
    title: string;
    content: string;
    mood?: "HAPPY" | "ROMANTIC" | "NOSTALGIC" | "SAD" | "EXCITED" | "GRATEFUL" | "CALM";
    date: string;
  }
) {
  const user = await getCurrentUserOrThrow();

  // Verify ownership before updating
  const note = await prisma.privateNote.findUnique({
    where: { id },
    select: { ownerId: true },
  });

  if (!note || note.ownerId !== user.id) {
    throw new Error("Unauthorized");
  }

  await prisma.privateNote.update({
    where: { id },
    data: {
      title: data.title,
      content: data.content,
      mood: data.mood || null,
      date: new Date(data.date),
    },
  });

  revalidatePath("/notes");
}

export async function deletePrivateNoteAction(id: string) {
  const user = await getCurrentUserOrThrow();

  // Verify ownership before deleting
  const note = await prisma.privateNote.findUnique({
    where: { id },
    select: { ownerId: true },
  });

  if (!note || note.ownerId !== user.id) {
    throw new Error("Unauthorized");
  }

  await prisma.privateNote.delete({
    where: { id },
  });

  revalidatePath("/notes");
}

export async function toggleFavoriteNoteAction(id: string) {
  // This is a placeholder since PrivateNote doesn't have isFavorite field
  revalidatePath("/notes");
  return { success: true };
}