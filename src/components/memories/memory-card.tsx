"use client";

import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Heart, Trash2, CalendarDays, Edit3 } from "lucide-react";
import {
  toggleFavoriteMemory,
  archiveMemoryAction,
} from "@/app/actions/memories";
import { MemoryEditDialog } from "@/components/memories/memory-edit-dialog"; // 🌟 Import our standalone form component
import { RatingSummary } from "@/components/ratings/rating-summary";
interface ImageItem {
  id: string;
  url: string;
}

interface MemoryItem {
  id: string;
  title: string;
  description: string | null;
  date: Date | string;
  isFavorite: boolean;
  isArchived: boolean;
  images: ImageItem[];
}

interface MemoryCardProps {
  memory: MemoryItem;
  ratingsData?: {
    mine: any;
    partner: any;
    average: number | null;
    count: number;
  } | null;
}

export function MemoryCard({ memory, ratingsData }: MemoryCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <>
      <Card className="break-inside-avoid bg-card/70 backdrop-blur-sm overflow-hidden border group hover:shadow-md transition flex flex-col w-full">
        <div
          className="cursor-pointer relative overflow-hidden w-full h-48 sm:h-56 md:h-64 bg-muted"
          onClick={() => setIsEditOpen(true)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={memory.images?.[0]?.url || "/placeholder-memory.png"}
            alt={memory.title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition duration-300"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
            <span className="text-white text-xs font-medium bg-background/20 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1">
              <Edit3 className="h-3 w-3" /> View / Edit Details
            </span>
          </div>
        </div>

        <CardContent
          className="pt-4 space-y-2 cursor-pointer flex-grow"
          onClick={() => setIsEditOpen(true)}
        >
          <div className="flex items-center gap-1.5 text-xs font-medium text-rose-500">
            <CalendarDays className="h-3.5 w-3.5" />
            {new Date(memory.date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </div>
          <h3 className="font-bold tracking-tight text-lg group-hover:text-rose-500 transition-colors line-clamp-2">
            {memory.title}
          </h3>
          {memory.description && (
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap line-clamp-4">
              {memory.description}
            </p>
          )}
          {ratingsData && ratingsData.average && ratingsData.average > 0 && (
            <div className="pt-1">
              <RatingSummary
                mine={ratingsData.mine}
                partner={ratingsData.partner}
                average={ratingsData.average}
                count={ratingsData.count}
                size="sm"
              />
            </div>
          )}
        </CardContent>

        <CardFooter className="border-t bg-muted/20 px-4 py-2.5 flex items-center justify-between mt-auto">
          <button
            type="button"
            onClick={async (e) => {
              e.stopPropagation(); // Avoid popping the form dialog simultaneously
              await toggleFavoriteMemory(memory.id, memory.isFavorite);
            }}
            className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-rose-500 transition"
          >
            <Heart
              className={`h-4 w-4 ${memory.isFavorite ? "text-rose-500 fill-current" : ""}`}
            />
            {memory.isFavorite ? "Favorited" : "Favorite"}
          </button>

          <button
            type="button"
            onClick={async (e) => {
              e.stopPropagation(); // Avoid popping the form dialog simultaneously
              if (confirm("Are you sure you want to archive this capsule?")) {
                await archiveMemoryAction(memory.id);
              }
            }}
            className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-destructive transition"
          >
            <Trash2 className="h-4 w-4" />
            Archive
          </button>
        </CardFooter>
      </Card>

      {/* 🌟 Render the modular dialog here controlling state globally via props */}
      <MemoryEditDialog
        memory={memory}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />
    </>
  );
}
