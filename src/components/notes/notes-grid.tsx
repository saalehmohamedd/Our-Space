// src/components/notes/notes-grid.tsx
"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Calendar,
  Clock,
  Trash2,
  Edit3,
  Lock,
  Eye,
  Sparkles,
} from "lucide-react";
import { deletePrivateNoteAction } from "@/app/actions/notes";
import { EditNoteDialog } from "./edit-note-dialog";
import { NoteViewDialog } from "./note-view-dialog";

interface Note {
  id: string;
  title: string;
  content: string;
  mood: string | null;
  date: string;
  owner: {
    id: string;
    name: string;
    avatarUrl: string | null;
  } | null;
}

interface NotesGridProps {
  notes: Note[];
}

const moodConfig: Record<string, { label: string; emoji: string; color: string; bg: string }> = {
  HAPPY: { label: "Happy", emoji: "😊", color: "text-yellow-700 border-yellow-300", bg: "bg-yellow-50 dark:bg-yellow-950/20" },
  ROMANTIC: { label: "Romantic", emoji: "💕", color: "text-rose-700 border-rose-300", bg: "bg-rose-50 dark:bg-rose-950/20" },
  NOSTALGIC: { label: "Nostalgic", emoji: "🌟", color: "text-purple-700 border-purple-300", bg: "bg-purple-50 dark:bg-purple-950/20" },
  SAD: { label: "Thoughtful", emoji: "💙", color: "text-blue-700 border-blue-300", bg: "bg-blue-50 dark:bg-blue-950/20" },
  EXCITED: { label: "Excited", emoji: "🎉", color: "text-orange-700 border-orange-300", bg: "bg-orange-50 dark:bg-orange-950/20" },
  GRATEFUL: { label: "Grateful", emoji: "🙏", color: "text-emerald-700 border-emerald-300", bg: "bg-emerald-50 dark:bg-emerald-950/20" },
  CALM: { label: "Calm", emoji: "🌸", color: "text-teal-700 border-teal-300", bg: "bg-teal-50 dark:bg-teal-950/20" },
};

function NoteCard({ note }: { note: Note }) {
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const mood = note.mood ? moodConfig[note.mood] : null;

  const previewContent = note.content.length > 150 
    ? note.content.substring(0, 150) + "..." 
    : note.content;

  return (
    <>
      <Card className="relative group hover:shadow-lg transition-all duration-300 overflow-hidden">
        {/* Top colored bar based on mood */}
        <div className={`absolute top-0 left-0 right-0 h-1 ${
          mood ? mood.bg.replace('bg-', 'bg-').replace('/20', '') : 'bg-amber-400'
        }`} />

        {/* Lock icon */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <Lock className="h-3 w-3 text-amber-600" />
          </div>
        </div>

        {/* Content */}
        <div className="p-5 pt-6 cursor-pointer" onClick={() => setViewOpen(true)}>
          {/* Mood badge */}
          {mood && (
            <div className="mb-2">
              <Badge className={`text-xs border ${mood.color} ${mood.bg}`}>
                {mood.emoji} {mood.label}
              </Badge>
            </div>
          )}

          <h3 className="font-bold text-lg mb-2 group-hover:text-amber-600 transition-colors line-clamp-1">
            {note.title}
          </h3>

          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-3">
            {previewContent}
          </p>

          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 mr-1" />
            {new Date(note.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        </div>

        {/* Action buttons */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={(e) => {
              e.stopPropagation();
              setEditOpen(true);
            }}
          >
            <Edit3 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive"
            onClick={async (e) => {
              e.stopPropagation();
              if (confirm("Delete this private note?")) {
                await deletePrivateNoteAction(note.id);
              }
            }}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </Card>

      <NoteViewDialog note={note} open={viewOpen} onOpenChange={setViewOpen} />
      <EditNoteDialog note={note} open={editOpen} onOpenChange={setEditOpen} />
    </>
  );
}

export function NotesGrid({ notes }: NotesGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  );
}