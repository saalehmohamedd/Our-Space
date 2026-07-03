// src/app/actions/reminders.ts
"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUserOrThrow } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";

export async function createReminderAction(data: {
  eventName: string;
  date: string;
  repeatYearly: boolean;
  notes?: string;
}) {
  const user = await getCurrentUserOrThrow();

  await prisma.reminder.create({
    data: {
      eventName: data.eventName,
      date: new Date(data.date),
      repeatYearly: data.repeatYearly,
      notes: data.notes || null,
      personId: user.id,
    },
  });

  revalidatePath("/reminders");
  revalidatePath("/dashboard");
}

export async function updateReminderAction(
  id: string,
  data: {
    eventName: string;
    date: string;
    repeatYearly: boolean;
    notes?: string;
  }
) {
  await getCurrentUserOrThrow();

  await prisma.reminder.update({
    where: { id },
    data: {
      eventName: data.eventName,
      date: new Date(data.date),
      repeatYearly: data.repeatYearly,
      notes: data.notes || null,
    },
  });

  revalidatePath("/reminders");
  revalidatePath("/dashboard");
}

export async function deleteReminderAction(id: string) {
  await getCurrentUserOrThrow();

  await prisma.reminder.delete({
    where: { id },
  });

  revalidatePath("/reminders");
  revalidatePath("/dashboard");
}