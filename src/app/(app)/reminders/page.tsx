// src/app/(app)/reminders/page.tsx

import React from "react";
import { prisma } from "@/lib/prisma";
import { Separator } from "@/components/ui/separator";
import { Bell } from "lucide-react";
import { CreateReminderDialog } from "@/components/reminders/create-reminder-dialog";
import { ReminderList } from "@/components/reminders/reminder-list";

function serializeReminder(reminder: any) {
  return {
    ...reminder,
    date: reminder.date?.toISOString() || null,
    createdAt: reminder.createdAt?.toISOString() || null,
    person: reminder.person ? {
      id: reminder.person.id,
      name: reminder.person.name,
      avatarUrl: reminder.person.avatarUrl,
    } : null,
  };
}

export default async function RemindersPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; filter?: string }>;
}) {
  const { sort, filter } = await searchParams;

  // Build orderBy
  let orderBy: any = { date: "asc" }; // Default: soonest first
  
  if (sort === "newest") {
    orderBy = { date: "desc" };
  } else if (sort === "oldest") {
    orderBy = { date: "asc" };
  } else if (sort === "az") {
    orderBy = { eventName: "asc" };
  } else if (sort === "za") {
    orderBy = { eventName: "desc" };
  }

  const reminders = await prisma.reminder.findMany({
    include: {
      person: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
        },
      },
    },
    orderBy,
  });

  const serializedReminders = reminders.map(serializeReminder);

  const now = new Date();
  let upcomingReminders = serializedReminders.filter(
    (r) => new Date(r.date) >= now
  );
  let pastReminders = serializedReminders.filter(
    (r) => new Date(r.date) < now
  );

  // Apply filters
  if (filter === "upcoming") {
    pastReminders = [];
  } else if (filter === "past") {
    upcomingReminders = [];
  } else if (filter === "yearly") {
    upcomingReminders = upcomingReminders.filter(r => r.repeatYearly);
    pastReminders = pastReminders.filter(r => r.repeatYearly);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reminders</h1>
          <p className="text-muted-foreground">
            {upcomingReminders.length} upcoming • {pastReminders.length} past
            {filter === "yearly" && " • Yearly repeating"}
          </p>
        </div>
        <div>
          <CreateReminderDialog />
        </div>
      </div>

      <Separator />

      {serializedReminders.length === 0 ? (
        <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-16 text-center bg-card/50">
          <Bell className="h-10 w-10 text-amber-400 stroke-1 mb-3 animate-pulse" />
          <h3 className="font-semibold text-lg">No Reminders Set Yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm mt-1">
            Set up reminders for important dates, birthdays, anniversaries, and events you don't want to forget!
          </p>
        </div>
      ) : (
        <ReminderList upcoming={upcomingReminders} past={pastReminders} />
      )}
    </div>
  );
}