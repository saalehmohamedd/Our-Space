// src/components/reminders/edit-reminder-dialog.tsx
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
import {
  Bell,
  Sparkles,
  X,
  Calendar,
  Repeat,
  StickyNote,
  Edit3,
} from "lucide-react";
import { updateReminderAction } from "@/app/actions/reminders";

interface ReminderItem {
  id: string;
  eventName: string;
  date: string;
  repeatYearly: boolean;
  notes: string | null;
}

interface EditReminderDialogProps {
  reminder: ReminderItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditReminderDialog({ reminder, open, onOpenChange }: EditReminderDialogProps) {
  const [updating, setUpdating] = useState(false);
  const [repeatYearly, setRepeatYearly] = useState(reminder.repeatYearly);

  const { register, handleSubmit, reset, watch } = useForm({
    values: {
      eventName: reminder.eventName,
      date: new Date(reminder.date).toISOString().split("T")[0],
      notes: reminder.notes || "",
    },
  });

  React.useEffect(() => {
    if (open) {
      reset({
        eventName: reminder.eventName,
        date: new Date(reminder.date).toISOString().split("T")[0],
        notes: reminder.notes || "",
      });
      setRepeatYearly(reminder.repeatYearly);
    }
  }, [open, reminder, reset]);

  const watchDate = watch("date");

  const onSubmit = async (data: any) => {
    try {
      setUpdating(true);
      await updateReminderAction(reminder.id, {
        ...data,
        repeatYearly,
      });
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update reminder.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[92vw] max-w-[500px] rounded-2xl p-0 gap-0 overflow-hidden border-0 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-amber-400 to-orange-500 p-6 text-white">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Edit3 className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">Edit Reminder</DialogTitle>
              <DialogDescription className="text-white/80 text-sm">
                Update event details and notification settings
              </DialogDescription>
            </div>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Event Name */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Event Name
              </Label>
              <Input
                required
                {...register("eventName")}
                className="w-full border-2 focus:border-amber-400 transition"
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
                {...register("date")}
                className="w-full border-2 focus:border-amber-400 transition"
              />
              {watchDate && (
                <p className="text-xs text-muted-foreground">
                  {new Date(watchDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>

            {/* Repeat Yearly Checkbox */}
            <div 
              className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border hover:bg-muted/50 transition cursor-pointer"
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
                <p className="text-xs text-muted-foreground">Remind every year on this date</p>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <StickyNote className="h-3 w-3 text-amber-400" />
                Notes
              </Label>
              <Textarea
                placeholder="Gift ideas, special plans..."
                className="w-full resize-none min-h-[80px] border-2 focus:border-amber-400 transition"
                rows={2}
                {...register("notes")}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                disabled={updating}
              >
                <X className="h-4 w-4 mr-1.5" />
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updating}
                className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                {updating ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}