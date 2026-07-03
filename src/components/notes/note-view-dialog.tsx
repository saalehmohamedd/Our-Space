// src/components/notes/note-view-dialog.tsx
"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Lock,
  Calendar,
  X,
} from "lucide-react";

interface NoteViewDialogProps {
  note: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const moodConfig: Record<string, { label: string; emoji: string; color: string; bg: string }> = {
  HAPPY: { label: "Happy", emoji: "😊", color: "text-yellow-700", bg: "bg-yellow-50 dark:bg-yellow-950/20" },
  ROMANTIC: { label: "Romantic", emoji: "💕", color: "text-rose-700", bg: "bg-rose-50 dark:bg-rose-950/20" },
  NOSTALGIC: { label: "Nostalgic", emoji: "🌟", color: "text-purple-700", bg: "bg-purple-50 dark:bg-purple-950/20" },
  SAD: { label: "Thoughtful", emoji: "💙", color: "text-blue-700", bg: "bg-blue-50 dark:bg-blue-950/20" },
  EXCITED: { label: "Excited", emoji: "🎉", color: "text-orange-700", bg: "bg-orange-50 dark:bg-orange-950/20" },
  GRATEFUL: { label: "Grateful", emoji: "🙏", color: "text-emerald-700", bg: "bg-emerald-50 dark:bg-emerald-950/20" },
  CALM: { label: "Calm", emoji: "🌸", color: "text-teal-700", bg: "bg-teal-50 dark:bg-teal-950/20" },
};

export function NoteViewDialog({ note, open, onOpenChange }: NoteViewDialogProps) {
  const mood = note.mood ? moodConfig[note.mood] : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[92vw] max-w-[600px] max-h-[90vh] overflow-y-auto p-0 border-0 shadow-2xl">
        {/* Journal paper style */}
        <div className="relative bg-gradient-to-b from-amber-50 to-yellow-50 dark:from-stone-900 dark:to-amber-950/20 min-h-[400px]">
          {/* Paper lines */}
          <div className="absolute inset-0 overflow-hidden opacity-10">
            {[...Array(30)].map((_, i) => (
              <div key={i} className="h-6 border-b border-amber-800" style={{ marginLeft: '40px' }} />
            ))}
            <div className="absolute left-10 top-0 bottom-0 w-0.5 bg-red-300" />
          </div>

          {/* Close button */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-background/80 hover:bg-background transition z-10"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Content */}
          <div className="relative p-8 pt-12">
            {/* Privacy badge */}
            <div className="absolute top-3 left-3">
              <Badge variant="outline" className="text-xs gap-1">
                <Lock className="h-3 w-3" /> Private
              </Badge>
            </div>

            {/* Header */}
            <div className="mb-6">
              {mood && (
                <Badge className={`mb-2 text-xs ${mood.bg} ${mood.color}`}>
                  {mood.emoji} {mood.label}
                </Badge>
              )}
              <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-200">
                {note.title}
              </h2>
              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {new Date(note.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>

            {/* Body */}
            <div className="prose prose-stone dark:prose-invert max-w-none">
              <p className="text-base leading-relaxed whitespace-pre-wrap">
                {note.content}
              </p>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-4 border-t border-amber-200 dark:border-amber-900/30 text-xs text-muted-foreground text-center">
              <Lock className="h-3 w-3 inline mr-1" />
              This note is private and only visible to you
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}