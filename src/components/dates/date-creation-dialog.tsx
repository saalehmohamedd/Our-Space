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
  Sparkles,
  Loader2,
  Heart,
  Calendar,
  MapPin,
  Activity,
  DollarSign,
  StickyNote,
  Lightbulb,
  Clock,
  CheckCircle2,
  PlusCircle,
} from "lucide-react";
import { createDateAction } from "@/app/actions/dates";

interface DateFormInputs {
  title: string;
  activity: string;
  location: string;
  scheduledAt: string;
  costEstimate: string;
  status: "IDEA" | "PLANNED" | "COMPLETED";
  notes: string;
}

const statusConfig = {
  IDEA: {
    label: "Spark Idea",
    icon: Lightbulb,
    color: "text-amber-500",
    bg: "bg-amber-100 dark:bg-amber-900/30",
    border: "border-amber-300 dark:border-amber-700",
    gradient: "from-amber-400 via-orange-400 to-amber-500",
    description: "Just a fun thought",
  },
  PLANNED: {
    label: "Locked In",
    icon: Clock,
    color: "text-rose-500",
    bg: "bg-rose-100 dark:bg-rose-900/30",
    border: "border-rose-300 dark:border-rose-700",
    gradient: "from-rose-400 via-pink-400 to-rose-500",
    description: "Scheduled & ready",
  },
  COMPLETED: {
    label: "Cherished",
    icon: CheckCircle2,
    color: "text-purple-500",
    bg: "bg-purple-100 dark:bg-purple-900/30",
    border: "border-purple-300 dark:border-purple-700",
    gradient: "from-purple-400 via-violet-400 to-purple-500",
    description: "Already enjoyed",
  },
};

export function DateCreationDialog() {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<"IDEA" | "PLANNED" | "COMPLETED">("IDEA");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
  } = useForm<DateFormInputs>({
    defaultValues: {
      status: "IDEA",
      scheduledAt: new Date().toISOString().split("T")[0],
    },
    mode: "onChange",
  });

  const watchTitle = watch("title");
  const watchActivity = watch("activity");

  const handleStatusSelect = (status: "IDEA" | "PLANNED" | "COMPLETED") => {
    setSelectedStatus(status);
    setValue("status", status);
  };

  const onSubmit = async (data: DateFormInputs) => {
    try {
      setSubmitting(true);
      await createDateAction(data);
      reset();
      setSelectedStatus("IDEA");
      setOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to pitch date night idea.");
    } finally {
      setSubmitting(false);
    }
  };

  const currentStatus = statusConfig[selectedStatus];
  const StatusIcon = currentStatus.icon;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 transition-all duration-300">
          <Heart className="h-4 w-4" />
          Pitch Date Night
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[92vw] max-w-[500px] rounded-2xl p-0 gap-0 overflow-hidden border-0 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className={`relative bg-gradient-to-r ${currentStatus.gradient} p-6 sm:p-8 text-white`}>
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Heart className="h-5 w-5" />
              </div>
              <DialogTitle className="text-xl font-bold">
                Pitch New Date
              </DialogTitle>
            </div>
            <DialogDescription className="text-white/80 text-sm max-w-xs">
              Plan a romantic evening, spontaneous adventure, or special celebration
            </DialogDescription>
          </div>

          {/* Preview card */}
          {(watchTitle || watchActivity) && (
            <div className="mt-4 p-3 bg-white/10 backdrop-blur-sm rounded-xl">
              <p className="text-xs font-medium text-white/70 uppercase tracking-wider mb-1">
                Date Preview
              </p>
              <p className="text-lg font-bold">
                {watchTitle || "Untitled Date"}
              </p>
              {watchActivity && (
                <p className="text-sm text-white/80 mt-1 flex items-center gap-1">
                  <Activity className="h-3.5 w-3.5" />
                  {watchActivity}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Form */}
        <div className="p-5 sm:p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Title */}
            <div className="space-y-1.5">
              <Label
                htmlFor="title"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"
              >
                <Heart className="h-3 w-3 text-rose-400" />
                Date Title
              </Label>
              <Input
                id="title"
                required
                placeholder="Candlelit Sushi Night..."
                className="w-full border-2 focus:border-rose-400 focus:ring-rose-400/20 transition"
                {...register("title", { required: "Title is required" })}
              />
            </div>

            {/* Activity & Location */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label
                  htmlFor="activity"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"
                >
                  <Activity className="h-3 w-3 text-purple-400" />
                  Activity
                </Label>
                <Input
                  id="activity"
                  required
                  placeholder="Dinner & arcade..."
                  className="w-full border-2 focus:border-rose-400 focus:ring-rose-400/20 transition"
                  {...register("activity", { required: "Activity is required" })}
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="location"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"
                >
                  <MapPin className="h-3 w-3 text-rose-400" />
                  Venue
                </Label>
                <Input
                  id="location"
                  required
                  placeholder="Miyako Sushi Bar"
                  className="w-full border-2 focus:border-rose-400 focus:ring-rose-400/20 transition"
                  {...register("location", { required: "Location is required" })}
                />
              </div>
            </div>

            {/* Date & Budget */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label
                  htmlFor="scheduledAt"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"
                >
                  <Calendar className="h-3 w-3 text-blue-400" />
                  Target Date
                </Label>
                <Input
                  id="scheduledAt"
                  type="date"
                  required
                  className="w-full border-2 focus:border-rose-400 focus:ring-rose-400/20 transition"
                  {...register("scheduledAt", { required: "Date is required" })}
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="costEstimate"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"
                >
                  <DollarSign className="h-3 w-3 text-emerald-400" />
                  Budget ($)
                </Label>
                <Input
                  id="costEstimate"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Optional"
                  className="w-full border-2 focus:border-rose-400 focus:ring-rose-400/20 transition"
                  {...register("costEstimate")}
                />
              </div>
            </div>

            {/* Status Selection */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-amber-400" />
                Date Status
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(statusConfig).map(([key, config]) => {
                  const Icon = config.icon;
                  const isSelected = selectedStatus === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleStatusSelect(key as "IDEA" | "PLANNED" | "COMPLETED")}
                      className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200 ${
                        isSelected
                          ? `${config.border} ${config.bg} shadow-md scale-105`
                          : "border-transparent bg-muted/30 hover:bg-muted/50"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isSelected ? config.bg : "bg-muted"
                        }`}
                      >
                        <Icon className={`h-4 w-4 ${isSelected ? config.color : "text-muted-foreground"}`} />
                      </div>
                      <span
                        className={`text-xs font-medium ${
                          isSelected ? config.color : "text-muted-foreground"
                        }`}
                      >
                        {config.label}
                      </span>
                      <span className="text-[10px] text-muted-foreground leading-tight text-center">
                        {config.description}
                      </span>
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 border-2 border-background flex items-center justify-center">
                          <CheckCircle2 className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              <input type="hidden" {...register("status")} value={selectedStatus} />
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <Label
                htmlFor="notes"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"
              >
                <StickyNote className="h-3 w-3 text-amber-400" />
                Extra Reminders
              </Label>
              <Textarea
                id="notes"
                placeholder="Dress codes, reservation details, special requests..."
                className="w-full resize-none min-h-[80px] border-2 focus:border-rose-400 focus:ring-rose-400/20 transition"
                rows={2}
                {...register("notes")}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 transition-all duration-300"
              disabled={submitting || !watchTitle}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Pitching Date...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Lock In Blueprint
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-3 bg-muted/30 border-t flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${currentStatus.color.replace('text', 'bg')}`} />
            <span>{currentStatus.label} stage</span>
          </div>
          <span>
            {watchTitle ? "Ready to save" : "Fill in date title"}
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}