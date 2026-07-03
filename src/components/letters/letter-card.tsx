// src/components/letters/letter-card.tsx
"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Trash2,
  Edit3,
  Calendar,
  User,
  Sparkles,
} from "lucide-react";
import { toggleFavoriteLoveLetterAction, deleteLoveLetterAction } from "@/app/actions/letters";
import { LetterViewDialog } from "./letter-view-dialog";
import { EditLetterDialog } from "./edit-letter-dialog";

interface LetterProps {
  letter: {
    id: string;
    title: string;
    content: string;
    mood: string;
    date: string;
    isFavorite?: boolean;
    sender: {
      id: string;
      name: string;
      avatarUrl: string | null;
    };
  };
}

const moodConfig: Record<string, { label: string; emoji: string; color: string }> = {
  HAPPY: { label: "Happy", emoji: "😊", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  ROMANTIC: { label: "Romantic", emoji: "💕", color: "bg-rose-100 text-rose-700 border-rose-200" },
  NOSTALGIC: { label: "Nostalgic", emoji: "🌟", color: "bg-purple-100 text-purple-700 border-purple-200" },
  SAD: { label: "Missing You", emoji: "💙", color: "bg-blue-100 text-blue-700 border-blue-200" },
  EXCITED: { label: "Excited", emoji: "🎉", color: "bg-orange-100 text-orange-700 border-orange-200" },
  GRATEFUL: { label: "Grateful", emoji: "🙏", color: "bg-green-100 text-green-700 border-green-200" },
  CALM: { label: "Calm", emoji: "🌸", color: "bg-teal-100 text-teal-700 border-teal-200" },
};

export function LetterCard({ letter }: LetterProps) {
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const mood = moodConfig[letter.mood] || moodConfig.ROMANTIC;
  const previewContent = letter.content.length > 120 
    ? letter.content.substring(0, 120) + "..." 
    : letter.content;

  return (
    <>
      <Card
        className="relative overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Envelope flap */}
        <div
          className={`absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-rose-100 to-transparent dark:from-rose-950/50 transition-all duration-300 ${
            isHovered ? "h-20" : "h-16"
          }`}
        >
          <div className="absolute top-0 left-0 right-0 h-8 bg-rose-200 dark:bg-rose-900/50 clip-triangle" />
        </div>

        {/* Stamp */}
        <div className="absolute top-3 right-3 w-10 h-12 bg-rose-50 dark:bg-rose-900/30 border-2 border-dashed border-rose-300 dark:border-rose-700 rounded-sm flex items-center justify-center rotate-6 transition-transform hover:rotate-12">
          <Heart className="h-4 w-4 text-rose-400" />
        </div>

        {/* Wax seal */}
        <div className="absolute top-4 left-4 w-6 h-6 rounded-full bg-gradient-to-br from-rose-400 to-red-500 shadow-md flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-rose-200" />
        </div>

        {/* Content */}
        <div className="pt-20 pb-4 px-4" onClick={() => setViewOpen(true)}>
          <div className="flex items-center gap-2 mb-2">
            <Badge className={`text-xs border ${mood.color}`}>
              {mood.emoji} {mood.label}
            </Badge>
          </div>

          <h3 className="font-serif font-bold text-lg mb-2 line-clamp-1 group-hover:text-rose-600 transition-colors">
            {letter.title}
          </h3>

          <p className="text-sm text-muted-foreground leading-relaxed font-serif italic line-clamp-3">
            {previewContent}
          </p>

          <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3 w-3" />
              {new Date(letter.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>
            <div className="flex items-center gap-1.5">
              <User className="h-3 w-3" />
              {letter.sender?.name || "Anonymous"}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={async (e) => {
              e.stopPropagation();
              await toggleFavoriteLoveLetterAction(letter.id, letter.isFavorite || false);
            }}
            className={`p-1.5 rounded-full transition ${
              letter.isFavorite
                ? "text-rose-500 bg-rose-50"
                : "text-muted-foreground hover:text-rose-500 bg-background/80"
            }`}
          >
            <Heart className={`h-3.5 w-3.5 ${letter.isFavorite ? "fill-current" : ""}`} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditOpen(true);
            }}
            className="p-1.5 rounded-full text-muted-foreground hover:text-blue-500 bg-background/80"
          >
            <Edit3 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={async (e) => {
              e.stopPropagation();
              if (confirm("Delete this love letter?")) {
                await deleteLoveLetterAction(letter.id);
              }
            }}
            className="p-1.5 rounded-full text-muted-foreground hover:text-red-500 bg-background/80"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </Card>

      <LetterViewDialog letter={letter} open={viewOpen} onOpenChange={setViewOpen} />
      <EditLetterDialog letter={letter} open={editOpen} onOpenChange={setEditOpen} />
    </>
  );
}