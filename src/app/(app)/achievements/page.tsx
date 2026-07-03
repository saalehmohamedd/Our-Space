// src/app/(app)/achievements/page.tsx

import React from "react";
import { prisma } from "@/lib/prisma";
import { Separator } from "@/components/ui/separator";
import { Trophy, Target } from "lucide-react";
import { CreateAchievementDialog } from "@/components/achievements/create-achievement-dialog";
import { AchievementsGrid } from "@/components/achievements/achievements-grid";

function serializeAchievement(achievement: any) {
  return {
    ...achievement,
    targetDate: achievement.targetDate?.toISOString() || null,
    achievedAt: achievement.achievedAt?.toISOString() || null,
    createdAt: achievement.createdAt?.toISOString() || null,
    createdBy: achievement.createdBy ? {
      id: achievement.createdBy.id,
      name: achievement.createdBy.name,
      avatarUrl: achievement.createdBy.avatarUrl,
    } : null,
  };
}

export default async function AchievementsPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; filter?: string }>;
}) {
  const { sort, filter } = await searchParams;

  // Build where clause
  const where: any = {};
  
  if (filter === "active") {
    where.isCompleted = false;
  } else if (filter === "completed") {
    where.isCompleted = true;
  }

  // Build orderBy
  let orderBy: any = [
    { isCompleted: "asc" },
    { createdAt: "desc" },
  ];
  
  if (sort === "oldest") {
    orderBy = { createdAt: "asc" };
  } else if (sort === "az") {
    orderBy = { title: "asc" };
  } else if (sort === "za") {
    orderBy = { title: "desc" };
  }

  const achievements = await prisma.achievement.findMany({
    where,
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
        },
      },
    },
    orderBy,
  });

  const serializedAchievements = achievements.map(serializeAchievement);

  const completed = serializedAchievements.filter(a => a.isCompleted);
  const inProgress = serializedAchievements.filter(a => !a.isCompleted);
  const completionRate = serializedAchievements.length > 0
    ? Math.round((completed.length / serializedAchievements.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Achievements</h1>
          <p className="text-muted-foreground">
            {completed.length} completed • {inProgress.length} in progress • {completionRate}%
            {filter === "active" && " • In progress only"}
            {filter === "completed" && " • Completed only"}
          </p>
        </div>
        <div>
          <CreateAchievementDialog />
        </div>
      </div>

      {/* Progress Bar */}
      {serializedAchievements.length > 0 && (
        <div className="bg-muted/30 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 rounded-full transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      )}

      <Separator />

      {serializedAchievements.length === 0 ? (
        <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-16 text-center bg-card/50">
          <Trophy className="h-10 w-10 text-amber-400 stroke-1 mb-3 animate-pulse" />
          <h3 className="font-semibold text-lg">No Achievements Yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm mt-1">
            {filter 
              ? "No achievements match your filter. Try adjusting it." 
              : "Set goals and milestones to achieve together! Track your progress and celebrate your wins."}
          </p>
        </div>
      ) : (
        <AchievementsGrid 
          inProgress={inProgress} 
          completed={completed}
          completionRate={completionRate}
        />
      )}
    </div>
  );
}