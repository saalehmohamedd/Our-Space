// src/components/letters/create-letter-dialog.tsx
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
  Heart,
  Sparkles,
  PenLine,
} from "lucide-react";
import { createLoveLetterAction } from "@/app/actions/letters";
import { showToast } from "@/lib/toast";

const moods = [
  { value: "ROMANTIC", emoji: "💕", label: "Romantic" },
  { value: "HAPPY", emoji: "😊", label: "Happy" },
  { value: "GRATEFUL", emoji: "🙏", label: "Grateful" },
  { value: "EXCITED", emoji: "🎉", label: "Excited" },
  { value: "NOSTALGIC", emoji: "🌟", label: "Nostalgic" },
  { value: "CALM", emoji: "🌸", label: "Calm" },
  { value: "SAD", emoji: "💙", label: "Missing You" },
];

interface LetterFormInputs {
  title: string;
  content: string;
  date: string;
}

export function CreateLetterDialog() {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedMood, setSelectedMood] = useState("ROMANTIC");

  const { register, handleSubmit, reset, watch } = useForm<LetterFormInputs>({
    defaultValues: {
      title: "",
      content: "",
      date: new Date().toISOString().split("T")[0],
    },
  });

  const watchTitle = watch("title");

  const onSubmit = async (data: LetterFormInputs) => {
    try {
      setSubmitting(true);
      const promise = createLoveLetterAction({
        ...data,
        mood: selectedMood as any,
      });
      
      showToast.promise(promise, {
        loading: "Sending letter...",
        success: "Love letter sent! 💌",
        error: "Failed to send letter",
      });
      
      await promise;
      reset();
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
        <Button className="gap-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-lg shadow-rose-500/25">
          <PenLine className="h-4 w-4" />
          Write Letter
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[92vw] max-w-[550px] rounded-2xl p-0 gap-0 overflow-hidden border-0 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-rose-400 via-pink-400 to-rose-500 p-6 sm:p-8 text-white">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Heart className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold">Write a Love Letter</DialogTitle>
                <DialogDescription className="text-white/80 text-sm">
                  Pour your heart out in a beautiful digital keepsake
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
                Letter Title
              </Label>
              <Input
                required
                placeholder="My Dearest Love..."
                className="w-full border-2 focus:border-rose-400 font-serif"
                {...register("title", { required: true })}
              />
            </div>

            {/* Mood Selection */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Mood
              </Label>
              <div className="flex flex-wrap gap-2">
                {moods.map((mood) => (
                  <button
                    key={mood.value}
                    type="button"
                    onClick={() => setSelectedMood(mood.value)}
                    className={`px-3 py-1.5 rounded-full text-sm border-2 transition-all ${
                      selectedMood === mood.value
                        ? "border-rose-400 bg-rose-50 dark:bg-rose-950/20 shadow-md"
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
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Date
              </Label>
              <Input
                type="date"
                required
                className="w-full border-2 focus:border-rose-400"
                {...register("date", { required: true })}
              />
            </div>

            {/* Content */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Your Message
              </Label>
              <Textarea
                required
                placeholder="Write your heartfelt message here... 📝"
                className="w-full min-h-[200px] border-2 focus:border-rose-400 font-serif leading-relaxed text-base"
                {...register("content", { required: true })}
              />
            </div>

            <Button
              type="submit"
              disabled={submitting || !watchTitle}
              className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-lg"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {submitting ? "Sending..." : "Send with Love"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}