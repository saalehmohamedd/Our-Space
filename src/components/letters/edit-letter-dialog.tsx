// src/components/letters/edit-letter-dialog.tsx
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
import { Sparkles, X, PenLine } from "lucide-react";
import { updateLoveLetterAction } from "@/app/actions/letters";

const moods = [
  { value: "ROMANTIC", emoji: "💕", label: "Romantic" },
  { value: "HAPPY", emoji: "😊", label: "Happy" },
  { value: "GRATEFUL", emoji: "🙏", label: "Grateful" },
  { value: "EXCITED", emoji: "🎉", label: "Excited" },
  { value: "NOSTALGIC", emoji: "🌟", label: "Nostalgic" },
  { value: "CALM", emoji: "🌸", label: "Calm" },
  { value: "SAD", emoji: "💙", label: "Missing You" },
];

export function EditLetterDialog({ letter, open, onOpenChange }: any) {
  const [updating, setUpdating] = useState(false);
  const [selectedMood, setSelectedMood] = useState(letter.mood);

  const { register, handleSubmit, reset } = useForm({
    values: {
      title: letter.title,
      content: letter.content,
      date: new Date(letter.date).toISOString().split("T")[0],
    },
  });

  React.useEffect(() => {
    if (open) {
      reset({
        title: letter.title,
        content: letter.content,
        date: new Date(letter.date).toISOString().split("T")[0],
      });
      setSelectedMood(letter.mood);
    }
  }, [open, letter, reset]);

  const onSubmit = async (data: any) => {
    try {
      setUpdating(true);
      await updateLoveLetterAction(letter.id, {
        ...data,
        mood: selectedMood,
      });
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update letter.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[92vw] max-w-[550px] rounded-2xl p-0 gap-0 overflow-hidden border-0 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="relative bg-gradient-to-br from-rose-400 to-pink-500 p-6 text-white">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <PenLine className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">Edit Letter</DialogTitle>
              <DialogDescription className="text-white/80 text-sm">
                Refine your heartfelt message
              </DialogDescription>
            </div>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase">Title</Label>
              <Input required {...register("title")} className="border-2 focus:border-rose-400 font-serif" />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase">Mood</Label>
              <div className="flex flex-wrap gap-2">
                {moods.map((mood) => (
                  <button
                    key={mood.value}
                    type="button"
                    onClick={() => setSelectedMood(mood.value)}
                    className={`px-3 py-1.5 rounded-full text-sm border-2 transition-all ${
                      selectedMood === mood.value
                        ? "border-rose-400 bg-rose-50 dark:bg-rose-950/20 shadow-md"
                        : "border-transparent bg-muted/30"
                    }`}
                  >
                    {mood.emoji} {mood.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase">Date</Label>
              <Input type="date" required {...register("date")} className="border-2 focus:border-rose-400" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase">Message</Label>
              <Textarea
                required
                {...register("content")}
                className="w-full min-h-[200px] border-2 focus:border-rose-400 font-serif leading-relaxed"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                <X className="h-4 w-4 mr-1" /> Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white" disabled={updating}>
                <Sparkles className="mr-2 h-4 w-4" /> Save Changes
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}