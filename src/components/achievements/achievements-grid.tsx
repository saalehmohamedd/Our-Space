// src/components/achievements/achievements-grid.tsx
"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  Star,
  Target,
  CheckCircle2,
  Clock,
  Calendar,
  Trash2,
  Edit3,
  Sparkles,
  Award,
  Zap,
  Crown,
  Medal,
  Flag,
  Rocket,
} from "lucide-react";
import {
  completeAchievementAction,
  uncompleteAchievementAction,
  deleteAchievementAction,
} from "@/app/actions/achievements";
import { EditAchievementDialog } from "./edit-achievement-dialog";

interface Achievement {
  id: string;
  title: string;
  description: string | null;
  achievedAt: string | null;
  targetDate: string | null;
  isCompleted: boolean;
  createdBy: {
    id: string;
    name: string;
    avatarUrl: string | null;
  } | null;
}

interface AchievementsGridProps {
  inProgress: Achievement[];
  completed: Achievement[];
  completionRate: number;
}

const achievementIcons = [
  { icon: Trophy, color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-950/30" },
  { icon: Star, color: "text-yellow-500", bg: "bg-yellow-100 dark:bg-yellow-950/30" },
  { icon: Crown, color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-950/30" },
  { icon: Medal, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-950/30" },
  { icon: Zap, color: "text-orange-500", bg: "bg-orange-100 dark:bg-orange-950/30" },
  { icon: Rocket, color: "text-red-500", bg: "bg-red-100 dark:bg-red-950/30" },
  { icon: Flag, color: "text-emerald-500", bg: "bg-emerald-100 dark:bg-emerald-950/30" },
  { icon: Award, color: "text-pink-500", bg: "bg-pink-100 dark:bg-pink-950/30" },
];

function getAchievementIcon(title: string, index: number) {
  const hash = title.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return achievementIcons[(hash + index) % achievementIcons.length];
}

function getDaysUntil(targetDate: string): number {
  const now = new Date();
  const target = new Date(targetDate);
  const diffTime = target.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function AchievementsGrid({ inProgress, completed, completionRate }: AchievementsGridProps) {
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleEdit = (achievement: Achievement) => {
    setEditingAchievement(achievement);
    setIsEditOpen(true);
  };

  const handleCloseEdit = () => {
    setIsEditOpen(false);
    setTimeout(() => setEditingAchievement(null), 300);
  };

  return (
    <>
      <div className="space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 text-center bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20">
            <Trophy className="h-6 w-6 text-amber-500 mx-auto mb-1" />
            <p className="text-2xl font-bold">{completed.length}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </Card>
          <Card className="p-4 text-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
            <Target className="h-6 w-6 text-blue-500 mx-auto mb-1" />
            <p className="text-2xl font-bold">{inProgress.length}</p>
            <p className="text-xs text-muted-foreground">In Progress</p>
          </Card>
          <Card className="p-4 text-center bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20">
            <Sparkles className="h-6 w-6 text-emerald-500 mx-auto mb-1" />
            <p className="text-2xl font-bold">{completionRate}%</p>
            <p className="text-xs text-muted-foreground">Complete</p>
          </Card>
        </div>

        {/* In Progress */}
        {inProgress.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/30 flex items-center justify-center">
                <Target className="h-4 w-4 text-amber-500" />
              </div>
              <h2 className="text-lg font-bold">In Progress</h2>
              <Badge variant="secondary">{inProgress.length}</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {inProgress.map((achievement, index) => {
                const { icon: Icon, color, bg } = getAchievementIcon(achievement.title, index);
                const isOverdue = achievement.targetDate && 
                  getDaysUntil(achievement.targetDate) < 0;

                return (
                  <Card
                    key={achievement.id}
                    className="relative overflow-hidden group transition-all duration-300 hover:shadow-xl"
                  >
                    <div className="p-5">
                      {/* Icon and Status */}
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center`}>
                          <Icon className={`h-6 w-6 ${color}`} />
                        </div>
                        
                        {isOverdue ? (
                          <Badge className="bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400 border-red-200">
                            <Clock className="h-3 w-3 mr-1" />
                            Overdue
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <Target className="h-3 w-3 mr-1" />
                            In Progress
                          </Badge>
                        )}
                      </div>

                      {/* Title & Description */}
                      <h3 className="font-bold text-lg mb-1">
                        {achievement.title}
                      </h3>
                      {achievement.description && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {achievement.description}
                        </p>
                      )}

                      {/* Dates */}
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                        {achievement.targetDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Target: {new Date(achievement.targetDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        )}
                      </div>

                      {/* Complete Button */}
                      <Button
                        onClick={async () => {
                          await completeAchievementAction(achievement.id);
                        }}
                        className="w-full bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 text-white shadow-md text-sm"
                      >
                        <Trophy className="h-4 w-4 mr-1.5" />
                        Mark as Completed
                      </Button>
                    </div>

                    {/* Action buttons */}
                    <div className="absolute top-2 left-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 bg-background/80"
                        onClick={() => handleEdit(achievement)}
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 bg-background/80 text-destructive"
                        onClick={async () => {
                          if (confirm("Delete this achievement?")) {
                            await deleteAchievementAction(achievement.id);
                          }
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>
        )}

        {/* Completed */}
        {completed.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center">
                <Trophy className="h-4 w-4 text-emerald-500" />
              </div>
              <h2 className="text-lg font-bold text-muted-foreground">Completed</h2>
              <Badge variant="secondary">{completed.length}</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {completed.map((achievement, index) => {
                const { icon: Icon, color, bg } = getAchievementIcon(achievement.title, index);

                return (
                  <Card
                    key={achievement.id}
                    className="relative overflow-hidden group transition-all duration-300 hover:shadow-xl opacity-80"
                  >
                    {/* Status ribbon */}
                    <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                      <div className="absolute top-0 right-0 w-16 h-3 bg-emerald-500 rotate-45 transform origin-top-left translate-x-2 -translate-y-1" />
                      <CheckCircle2 className="absolute top-1 right-1 h-4 w-4 text-white" />
                    </div>

                    <div className="p-5">
                      {/* Icon and Status */}
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center`}>
                          <Icon className={`h-6 w-6 ${color}`} />
                        </div>
                        
                        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-200">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      </div>

                      {/* Title & Description */}
                      <h3 className="font-bold text-lg mb-1 line-through text-muted-foreground">
                        {achievement.title}
                      </h3>
                      {achievement.description && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {achievement.description}
                        </p>
                      )}

                      {/* Dates */}
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                        {achievement.achievedAt && (
                          <span className="flex items-center gap-1 text-emerald-600">
                            <Trophy className="h-3 w-3" />
                            Achieved: {new Date(achievement.achievedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        )}
                      </div>

                      {/* Uncomplete Button */}
                      <Button
                        variant="outline"
                        onClick={async () => {
                          await uncompleteAchievementAction(achievement.id);
                        }}
                        className="w-full text-sm"
                        size="sm"
                      >
                        <Target className="h-4 w-4 mr-1.5" />
                        Move Back to Progress
                      </Button>
                    </div>

                    {/* Action buttons */}
                    <div className="absolute top-2 left-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 bg-background/80"
                        onClick={() => handleEdit(achievement)}
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 bg-background/80 text-destructive"
                        onClick={async () => {
                          if (confirm("Delete this achievement?")) {
                            await deleteAchievementAction(achievement.id);
                          }
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* Edit Dialog - Single instance at the top level */}
      {editingAchievement && (
        <EditAchievementDialog
          achievement={editingAchievement}
          open={isEditOpen}
          onOpenChange={handleCloseEdit}
        />
      )}
    </>
  );
}