// src/components/reminders/create-reminder-dialog.tsx
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
  Bell,
  Calendar,
  Repeat,
  StickyNote,
  PlusCircle,
  Cake,
  Heart,
  Star,
  Gift,
  PartyPopper,
  Sparkles,
} from "lucide-react";
import { createReminderAction } from "@/app/actions/reminders";

const quickEvents = [
  { label: "Birthday", icon: Cake, color: "text-pink-500" },
  { label: "Anniversary", icon: Heart, color: "text-rose-500" },
  { label: "Date Night", icon: Sparkles, color: "text-purple-500" },
  { label: "Special Day", icon: Star, color: "text-amber-500" },
  { label: "Gift Day", icon: Gift, color: "text-emerald-500" },
  { label: "Celebration", icon: PartyPopper, color: "text-blue-500" },
];

export function CreateReminderDialog() {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [repeatYearly, setRepeatYearly] = useState(true);

  const { register, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: {
      eventName: "",
      date: "",
      notes: "",
    },
  });

  const watchEventName = watch("eventName");
  const watchDate = watch("date");

  const onSubmit = async (data: any) => {
    try {
      setSubmitting(true);
      await createReminderAction({
        ...data,
        repeatYearly,
      });
      reset();
      setRepeatYearly(true);
      setOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to create reminder.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickEvent = (label: string) => {
    setValue("eventName", `${label} `, { shouldValidate: true });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/25">
          <Bell className="h-4 w-4" />
          Set Reminder
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[92vw] max-w-[500px] rounded-2xl p-0 gap-0 overflow-hidden border-0 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-amber-400 via-orange-400 to-amber-500 p-6 sm:p-8 text-white">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold">Set Reminder</DialogTitle>
                <DialogDescription className="text-white/80 text-sm">
                  Never miss birthdays, anniversaries, or special dates
                </DialogDescription>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Quick Events */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Quick Select
              </Label>
              <div className="flex flex-wrap gap-2">
                {quickEvents.map((event) => {
                  const Icon = event.icon;
                  return (
                    <button
                      key={event.label}
                      type="button"
                      onClick={() => handleQuickEvent(event.label)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border-2 border-transparent bg-muted/30 hover:bg-muted/50 hover:border-amber-300 transition-all`}
                    >
                      <Icon className={`h-3.5 w-3.5 ${event.color}`} />
                      {event.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Event Name */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Event Name
              </Label>
              <Input
                required
                placeholder="Mom's Birthday, Our Anniversary..."
                className="w-full border-2 focus:border-amber-400 transition"
                {...register("eventName")}
              />
            </div>

            {/* Date */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Calendar className="h-3 w-3 text-amber-400" />
                Date
              </Label>
              <Input
                type="date"
                required
                className="w-full border-2 focus:border-amber-400 transition"
                {...register("date")}
              />
              {watchDate && (
                <p className="text-xs text-muted-foreground">
                  📅 {new Date(watchDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>

            {/* Repeat Yearly Checkbox */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border hover:bg-muted/50 transition cursor-pointer"
              onClick={() => setRepeatYearly(!repeatYearly)}
            >
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                repeatYearly 
                  ? "bg-amber-500 border-amber-500" 
                  : "border-muted-foreground/30"
              }`}>
                {repeatYearly && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div>
                <p className="text-sm font-medium">Repeat Yearly</p>
                <p className="text-xs text-muted-foreground">Remind me every year on this date</p>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <StickyNote className="h-3 w-3 text-amber-400" />
                Notes
              </Label>
              <Textarea
                placeholder="Gift ideas, special plans, important details..."
                className="w-full resize-none min-h-[80px] border-2 focus:border-amber-400 transition"
                rows={2}
                {...register("notes")}
              />
            </div>

            {/* Preview Card */}
            {watchEventName && (
              <div className="p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200 dark:border-amber-800">
                <p className="text-xs font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
                  Reminder Preview
                </p>
                <p className="font-bold text-sm">{watchEventName}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {watchDate
                    ? new Date(watchDate).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                      })
                    : "Select a date"}
                  {repeatYearly && (
                    <>
                      <span>•</span>
                      <Repeat className="h-3 w-3" />
                      <span>Repeats yearly</span>
                    </>
                  )}
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={submitting || !watchEventName || !watchDate}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg"
            >
              <Bell className="mr-2 h-4 w-4" />
              {submitting ? "Setting Reminder..." : "Set Reminder"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}