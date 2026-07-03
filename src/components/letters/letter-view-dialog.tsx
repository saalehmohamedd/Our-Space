// src/components/letters/letter-view-dialog.tsx
"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Calendar,
  User,
  X,
  Share2,
} from "lucide-react";
import { toggleFavoriteLoveLetterAction } from "@/app/actions/letters";

interface LetterViewDialogProps {
  letter: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const moodConfig: Record<string, { label: string; emoji: string; color: string; bg: string }> = {
  HAPPY: { label: "Happy", emoji: "😊", color: "text-yellow-700", bg: "bg-yellow-50 dark:bg-yellow-950/20" },
  ROMANTIC: { label: "Romantic", emoji: "💕", color: "text-rose-700", bg: "bg-rose-50 dark:bg-rose-950/20" },
  NOSTALGIC: { label: "Nostalgic", emoji: "🌟", color: "text-purple-700", bg: "bg-purple-50 dark:bg-purple-950/20" },
  SAD: { label: "Missing You", emoji: "💙", color: "text-blue-700", bg: "bg-blue-50 dark:bg-blue-950/20" },
  EXCITED: { label: "Excited", emoji: "🎉", color: "text-orange-700", bg: "bg-orange-50 dark:bg-orange-950/20" },
  GRATEFUL: { label: "Grateful", emoji: "🙏", color: "text-green-700", bg: "bg-green-50 dark:bg-green-950/20" },
  CALM: { label: "Calm", emoji: "🌸", color: "text-teal-700", bg: "bg-teal-50 dark:bg-teal-950/20" },
};

export function LetterViewDialog({ letter, open, onOpenChange }: LetterViewDialogProps) {
  const mood = moodConfig[letter.mood] || moodConfig.ROMANTIC;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[92vw] max-w-[600px] max-h-[90vh] overflow-y-auto p-0 border-0 shadow-2xl">
        {/* Letter Paper */}
        <div className="relative bg-gradient-to-b from-stone-50 to-amber-50 dark:from-stone-900 dark:to-amber-950/30 min-h-[500px]">
          {/* Decorative border */}
          <div className="absolute inset-2 border border-rose-200 dark:border-rose-900/30 rounded-lg pointer-events-none" />
          
          {/* Top decorations */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-300 via-pink-300 to-rose-300 dark:from-rose-800 dark:via-pink-800 dark:to-rose-800" />
          
          {/* Close button */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-background/80 hover:bg-background transition z-10"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Letter Content */}
          <div className="p-8 pt-12">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 mb-2">
                <Badge className={`text-xs ${mood.bg} ${mood.color}`}>
                  {mood.emoji} {mood.label}
                </Badge>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-rose-800 dark:text-rose-200 italic">
                {letter.title}
              </h2>
              <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-rose-300 to-transparent dark:via-rose-700 mx-auto mt-3" />
            </div>

            {/* Body */}
            <div className="font-serif text-base sm:text-lg leading-relaxed text-stone-700 dark:text-stone-300 whitespace-pre-wrap mb-8">
              {letter.content}
            </div>

            {/* Signature */}
            <div className="text-right mt-8 pt-4 border-t border-rose-200 dark:border-rose-900/30">
              <p className="font-serif italic text-rose-600 dark:text-rose-400 text-lg">
                With love,
              </p>
              <p className="font-serif font-bold text-stone-700 dark:text-stone-300 mt-1">
                {letter.sender?.name || "Anonymous"}
              </p>
            </div>

            {/* Footer metadata */}
            <div className="flex items-center justify-between mt-8 pt-4 border-t border-rose-200 dark:border-rose-900/30 text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(letter.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={async () => {
                    await toggleFavoriteLoveLetterAction(letter.id, letter.isFavorite || false);
                  }}
                >
                  <Heart className={`h-3 w-3 mr-1 ${letter.isFavorite ? "fill-rose-500 text-rose-500" : ""}`} />
                  {letter.isFavorite ? "Favorited" : "Favorite"}
                </Button>
              </div>
            </div>
          </div>

          {/* Paper texture overlay */}
          <div className="absolute inset-0 bg-[url('/paper-texture.png')] opacity-5 pointer-events-none" />
        </div>
      </DialogContent>
    </Dialog>
  );
}