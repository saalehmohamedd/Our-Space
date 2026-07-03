// src/components/achievements/create-achievement-dialog.tsx
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  PlusCircle,
  Sparkles,
  Trophy,
  Target,
  Calendar,
  Flag,
} from "lucide-react";
import { createAchievementAction } from "@/app/actions/achievements";

export function CreateAchievementDialog() {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, watch } = useForm();

  const watchTitle = watch("title");

  const onSubmit = async (data: any) => {
    try {
      setSubmitting(true);
      await createAchievementAction({
        title: data.title,
        description: data.description || undefined,
        targetDate: data.targetDate || undefined,
      });
      reset();
      setOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to create achievement.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white shadow-lg shadow-amber-500/25">
          <Trophy className="h-4 w-4" />
          New Achievement
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[92vw] max-w-[500px] rounded-2xl p-0 gap-0 overflow-hidden border-0 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Trophy header */}
        <div className="relative bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500 p-6 sm:p-8 text-white overflow-hidden">
          {/* Confetti dots */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1.5 h-1.5 bg-white/40 rounded-full"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
          
          <div className="relative space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Trophy className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold">New Achievement</DialogTitle>
                <DialogDescription className="text-white/80 text-sm">
                  Set a goal or milestone to work towards together
                </DialogDescription>
              </div>
            </div>
          </div>
        </div>

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
                placeholder="Run a marathon together..."
                className="w-full border-2 focus:border-amber-400 transition"
                {...register("title")}
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Description (optional)
              </Label>
              <Textarea
                placeholder="What does success look like?"
                className="w-full resize-none min-h-[80px] border-2 focus:border-amber-400 transition"
                rows={3}
                {...register("description")}
              />
            </div>

            {/* Target Date */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Calendar className="h-3 w-3 text-amber-400" />
                Target Date (optional)
              </Label>
              <Input
                type="date"
                className="w-full border-2 focus:border-amber-400 transition"
                {...register("targetDate")}
              />
            </div>

            <Button
              type="submit"
              disabled={submitting || !watchTitle}
              className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white shadow-lg"
            >
              <Trophy className="mr-2 h-4 w-4" />
              {submitting ? "Creating..." : "Set Achievement"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}