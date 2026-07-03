// src/app/(app)/notes/page.tsx

import React from "react";
import { prisma } from "@/lib/prisma";
import { getCurrentUserOrThrow } from "@/lib/auth-guard";
import { Separator } from "@/components/ui/separator";
import { FileText, Lock, BookOpen } from "lucide-react";
import { CreateNoteDialog } from "@/components/notes/create-note-dialog";
import { NotesGrid } from "@/components/notes/notes-grid";

function serializeNote(note: any) {
  return {
    ...note,
    date: note.date?.toISOString() || null,
    createdAt: note.createdAt?.toISOString() || null,
    updatedAt: note.updatedAt?.toISOString() || null,
    owner: note.owner ? {
      id: note.owner.id,
      name: note.owner.name,
      avatarUrl: note.owner.avatarUrl,
    } : null,
  };
}

export default async function NotesPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; filter?: string }>;
}) {
  const user = await getCurrentUserOrThrow();
  const { sort, filter } = await searchParams;

  // Build where clause - only show user's own notes
  const where: any = { ownerId: user.id };
  
  if (filter === "happy") {
    where.mood = "HAPPY";
  } else if (filter === "romantic") {
    where.mood = "ROMANTIC";
  } else if (filter === "grateful") {
    where.mood = "GRATEFUL";
  }

  // Build orderBy
  let orderBy: any = { date: "desc" };
  
  if (sort === "oldest") {
    orderBy = { date: "asc" };
  } else if (sort === "az") {
    orderBy = { title: "asc" };
  } else if (sort === "za") {
    orderBy = { title: "desc" };
  }

  const notes = await prisma.privateNote.findMany({
    where,
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
        },
      },
    },
    orderBy,
  });

  const serializedNotes = notes.map(serializeNote);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Lock className="h-6 w-6 text-amber-400" />
            Private Notes
          </h1>
          <p className="text-muted-foreground">
            {serializedNotes.length} notes • Only visible to you
            {filter && ` • Mood: ${filter}`}
          </p>
        </div>
        <div>
          <CreateNoteDialog />
        </div>
      </div>

      <Separator />

      {serializedNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-16 text-center bg-card/50">
          <BookOpen className="h-10 w-10 text-amber-400 stroke-1 mb-3 animate-pulse" />
          <h3 className="font-semibold text-lg">Your Private Journal is Empty</h3>
          <p className="text-sm text-muted-foreground max-w-sm mt-1">
            {filter 
              ? "No notes match this mood. Try a different filter." 
              : "Start writing your personal thoughts, daily reflections, and private moments. This space is just for you."}
          </p>
        </div>
      ) : (
        <NotesGrid notes={serializedNotes} />
      )}
    </div>
  );
}