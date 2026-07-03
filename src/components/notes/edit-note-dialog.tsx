// src/components/notes/edit-note-dialog.tsx
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
import { Sparkles, X, Edit3, Calendar, Lock } from "lucide-react";
import { updatePrivateNoteAction } from "@/app/actions/notes";

const moods = [
  { value: "HAPPY", emoji: "😊", label: "Happy" },
  { value: "GRATEFUL", emoji: "🙏", label: "Grateful" },
  { value: "CALM", emoji: "🌸", label: "Calm" },
  { value: "EXCITED", emoji: "🎉", label: "Excited" },
  { value: "ROMANTIC", emoji: "💕", label: "Romantic" },
  { value: "NOSTALGIC", emoji: "🌟", label: "Nostalgic" },
  { value: "SAD", emoji: "💙", label: "Thoughtful" },
];

export function EditNoteDialog({ note, open, onOpenChange }: any) {
  const [updating, setUpdating] = useState(false);
  const [selectedMood, setSelectedMood] = useState(note.mood || "");

  const { register, handleSubmit, reset } = useForm({
    values: {
      title: note.title,
      content: note.content,
      date: new Date(note.date).toISOString().split("T")[0],
    },
  });

  React.useEffect(() => {
    if (open) {
      reset({
        title: note.title,
        content: note.content,
        date: new Date(note.date).toISOString().split("T")[0],
      });
      setSelectedMood(note.mood || "");
    }
  }, [open, note, reset]);

  const onSubmit = async (data: any) => {
    try {
      setUpdating(true);
      await updatePrivateNoteAction(note.id, {
        ...data,
        mood: selectedMood || undefined,
      });
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update note.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[92vw] max-w-[550px] rounded-2xl p-0 gap-0 border-0 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-br from-amber-400 to-yellow-500 p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Edit3 className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">Edit Note</DialogTitle>
              <DialogDescription className="text-white/80 text-sm">
                Update your private thoughts
              </DialogDescription>
            </div>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input required {...register("title")} className="border-2 focus:border-amber-400" placeholder="Title" />
            
            <div className="flex flex-wrap gap-2">
              {moods.map((mood) => (
                <button
                  key={mood.value}
                  type="button"
                  onClick={() => setSelectedMood(selectedMood === mood.value ? "" : mood.value)}
                  className={`px-3 py-1.5 rounded-full text-sm border-2 transition-all ${
                    selectedMood === mood.value
                      ? "border-amber-400 bg-amber-50 shadow-md"
                      : "border-transparent bg-muted/30"
                  }`}
                >
                  {mood.emoji} {mood.label}
                </button>
              ))}
            </div>

            <Input type="date" required {...register("date")} className="border-2 focus:border-amber-400" />

            <Textarea
              required
              {...register("content")}
              className="w-full min-h-[200px] border-2 focus:border-amber-400 leading-relaxed"
              placeholder="Your thoughts..."
            />

            <div className="flex gap-3">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                <X className="h-4 w-4 mr-1" /> Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-white" disabled={updating}>
                <Lock className="mr-2 h-4 w-4" /> Save Changes
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}