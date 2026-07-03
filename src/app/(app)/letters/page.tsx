// src/app/(app)/letters/page.tsx

import React from "react";
import { prisma } from "@/lib/prisma";
import { Separator } from "@/components/ui/separator";
import { Mail, Heart } from "lucide-react";
import { CreateLetterDialog } from "@/components/letters/create-letter-dialog";
import { LetterCard } from "@/components/letters/letter-card";

function serializeLetter(letter: any) {
  return {
    ...letter,
    date: letter.date?.toISOString() || null,
    createdAt: letter.createdAt?.toISOString() || null,
    sender: letter.sender ? {
      ...letter.sender,
      createdAt: letter.sender.createdAt?.toISOString() || null,
    } : null,
  };
}

export default async function LettersPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; filter?: string }>;
}) {
  const { sort, filter } = await searchParams;

  // Build where clause
  const where: any = {};
  
  if (filter === "favorites") {
    // Note: LoveLetter doesn't have isFavorite field in your schema
    // You may want to add it or filter by mood
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

  const letters = await prisma.loveLetter.findMany({
    where,
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
        },
      },
    },
    orderBy,
  });

  const serializedLetters = letters.map(serializeLetter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Love Letters</h1>
          <p className="text-muted-foreground">
            {serializedLetters.length} letters
            {sort === "oldest" && " • Oldest first"}
            {sort === "az" && " • A-Z"}
            {sort === "za" && " • Z-A"}
          </p>
        </div>
        <div>
          <CreateLetterDialog />
        </div>
      </div>

      <Separator />

      {serializedLetters.length === 0 ? (
        <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-16 text-center bg-card/50">
          <Mail className="h-10 w-10 text-rose-400 stroke-1 mb-3 animate-pulse" />
          <h3 className="font-semibold text-lg">No Love Letters Yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm mt-1">
            Start writing heartfelt messages to each other. Every letter becomes a timeless keepsake.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {serializedLetters.map((letter) => (
            <LetterCard key={letter.id} letter={letter} />
          ))}
        </div>
      )}
    </div>
  );
}