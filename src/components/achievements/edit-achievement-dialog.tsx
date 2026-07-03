// src/components/achievements/edit-achievement-dialog.tsx
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, X, Edit3, Trophy, Calendar, Flag } from "lucide-react";
import { updateAchievementAction } from "@/app/actions/achievements";
import { showToast } from "@/lib/toast";

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

interface EditAchievementDialogProps {
  achievement: Achievement;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditAchievementDialog({ achievement, open, onOpenChange }: EditAchievementDialogProps) {
  const [updating, setUpdating] = useState(false);

  const { register, handleSubmit, reset } = useForm({
    values: {
      title: achievement.title,
      description: achievement.description || "",
      targetDate: achievement.targetDate 
        ? new Date(achievement.targetDate).toISOString().split("T")[0] 
        : "",
    },
  });

  React.useEffect(() => {
    if (open) {
      reset({
        title: achievement.title,
        description: achievement.description || "",
        targetDate: achievement.targetDate 
          ? new Date(achievement.targetDate).toISOString().split("T")[0] 
          : "",
      });
    }
  }, [open, achievement, reset]);

  const onSubmit = async (data: any) => {
    try {
      setUpdating(true);
      
      const promise = updateAchievementAction(achievement.id, {
        title: data.title,
        description: data.description || undefined,
        targetDate: data.targetDate || undefined,
      });
      
      showToast.promise(promise, {
        loading: "Saving changes...",
        success: "Achievement updated! ✨",
        error: "Failed to update achievement",
      });
      
      await promise;
      onOpenChange(false);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[92vw] max-w-[500px] rounded-2xl p-0 gap-0 border-0 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500 p-6 text-white">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Edit3 className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">Edit Achievement</DialogTitle>
              <DialogDescription className="text-white/80 text-sm">
                Update goal details and target date
              </DialogDescription>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Title */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Flag className="h-3 w-3 text-amber-400" />
                Achievement Title
              </Label>
              <Input
                required
                {...register("title")}
                className="border-2 focus:border-amber-400 transition"
                placeholder="Run a marathon together..."
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Description
              </Label>
              <Textarea
                {...register("description")}
                className="border-2 focus:border-amber-400 transition resize-none"
                rows={3}
                placeholder="What does success look like?"
              />
            </div>

            {/* Target Date */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Calendar className="h-3 w-3 text-amber-400" />
                Target Date
              </Label>
              <Input
                type="date"
                {...register("targetDate")}
                className="border-2 focus:border-amber-400 transition"
              />
              <p className="text-xs text-muted-foreground">
                Optional: Set a deadline to achieve this goal
              </p>
            </div>

            {/* Status Info */}
            {achievement.isCompleted && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
                <p className="text-sm text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  This achievement was completed on{" "}
                  {achievement.achievedAt
                    ? new Date(achievement.achievedAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "a previous date"}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                disabled={updating}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4 mr-1.5" />
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white shadow-lg shadow-amber-500/25"
                disabled={updating}
              >
                {updating ? (
                  <>
                    <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Trophy className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}