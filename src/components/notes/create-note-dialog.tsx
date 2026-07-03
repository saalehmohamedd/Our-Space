// src/components/notes/create-note-dialog.tsx
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
  PenLine,
  Calendar,
  Lock,
} from "lucide-react";
import { createPrivateNoteAction } from "@/app/actions/notes";
import { showToast } from "@/lib/toast";

type MoodType = "HAPPY" | "ROMANTIC" | "NOSTALGIC" | "SAD" | "EXCITED" | "GRATEFUL" | "CALM";

const moods: { value: MoodType; emoji: string; label: string }[] = [
  { value: "HAPPY", emoji: "😊", label: "Happy" },
  { value: "GRATEFUL", emoji: "🙏", label: "Grateful" },
  { value: "CALM", emoji: "🌸", label: "Calm" },
  { value: "EXCITED", emoji: "🎉", label: "Excited" },
  { value: "ROMANTIC", emoji: "💕", label: "Romantic" },
  { value: "NOSTALGIC", emoji: "🌟", label: "Nostalgic" },
  { value: "SAD", emoji: "💙", label: "Thoughtful" },
];

interface NoteFormInputs {
  title: string;
  content: string;
  date: string;
}

export function CreateNoteDialog() {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);

  const { register, handleSubmit, reset, watch } = useForm<NoteFormInputs>({
    defaultValues: {
      title: "",
      content: "",
      date: new Date().toISOString().split("T")[0],
    },
  });

  const watchTitle = watch("title");

  const onSubmit = async (data: NoteFormInputs) => {
    try {
      setSubmitting(true);
      const promise = createPrivateNoteAction({
        ...data,
        mood: selectedMood || undefined,
      });
      
      showToast.promise(promise, {
        loading: "Saving note...",
        success: "Private note saved! 🔒",
        error: "Failed to save note",
      });
      
      await promise;
      reset();
      setSelectedMood(null);
      setOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white shadow-lg shadow-amber-500/25">
          <PenLine className="h-4 w-4" />
          New Note
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[92vw] max-w-[550px] rounded-2xl p-0 gap-0 overflow-hidden border-0 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Journal header */}
        <div className="relative bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500 p-6 sm:p-8 text-white">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold">Private Note</DialogTitle>
                <DialogDescription className="text-white/80 text-sm">
                  Your personal thoughts - only visible to you
                </DialogDescription>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Title */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Title
              </Label>
              <Input
                required
                placeholder="Today's reflection..."
                className="w-full border-2 focus:border-amber-400 transition"
                {...register("title", { required: true })}
              />
            </div>

            {/* Mood */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Mood (optional)
              </Label>
              <div className="flex flex-wrap gap-2">
                {moods.map((mood) => (
                  <button
                    key={mood.value}
                    type="button"
                    onClick={() =>
                      setSelectedMood(
                        selectedMood === mood.value ? null : mood.value,
                      )
                    }
                    className={`px-3 py-1.5 rounded-full text-sm border-2 transition-all ${
                      selectedMood === mood.value
                        ? "border-amber-400 bg-amber-50 dark:bg-amber-950/20 shadow-md"
                        : "border-transparent bg-muted/30 hover:bg-muted/50"
                    }`}
                  >
                    {mood.emoji} {mood.label}
                  </button>
                ))}
              </div>
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
                {...register("date", { required: true })}
              />
            </div>

            {/* Content */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Your Thoughts
              </Label>
              <Textarea
                required
                placeholder="Write your private thoughts here..."
                className="w-full min-h-[200px] border-2 focus:border-amber-400 transition leading-relaxed"
                {...register("content", { required: true })}
              />
            </div>

            <Button
              type="submit"
              disabled={submitting || !watchTitle}
              className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white shadow-lg"
            >
              <Lock className="mr-2 h-4 w-4" />
              {submitting ? "Saving..." : "Save Private Note"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}