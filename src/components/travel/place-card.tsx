"use client";

import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Heart, Trash2, MapPin, DollarSign } from "lucide-react";
import { toggleFavoritePlaceAction, archivePlaceAction } from "@/app/actions/places";
import { PlaceEditDialog } from "./place-edit-dialog";
import { Badge } from "@/components/ui/badge";

// 1. IMPORT the shared type instead of declaring it locally to prevent mismatch
// Adjust this path based on where PlaceEditDialog gets its type (e.g., "@/types" or "@/db/schema")
import { type PlaceItemType } from "@/types"; 

interface PlaceCardProps {
  item: PlaceItemType;
}

export function PlaceCard({ item }: PlaceCardProps) {
  const [editOpen, setEditOpen] = useState(false);

  const statusStyles = {
    BUCKET_LIST: "bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400",
    PLANNING: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
    VISITED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  };

  const statusLabels = {
    BUCKET_LIST: "Wanderlist",
    PLANNING: "Planning",
    VISITED: "Explored 🎉",
  };

  return (
    <>
      <Card className="bg-card/70 backdrop-blur-sm border hover:shadow-md transition flex flex-col w-full relative group">
        <CardContent className="pt-5 space-y-3 flex-grow cursor-pointer" onClick={() => setEditOpen(true)}>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 text-rose-500" />
              <span className="line-clamp-1">{item.location}</span>
            </div>
            <Badge className={statusStyles[item.status]} variant="outline">
              {statusLabels[item.status]}
            </Badge>
          </div>

          <div className="space-y-1">
            <h3 className="font-bold tracking-tight text-xl group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
              {item.name}
            </h3>
            <div className="flex items-center text-sm font-medium text-slate-500 gap-0.5">
              <DollarSign className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>{item.costEstimate ? Number(item.costEstimate).toLocaleString() : "No budget locked"}</span>
            </div>
          </div>

          {item.notes && (
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 bg-muted/30 p-2.5 rounded-lg border border-dashed">
              {item.notes}
            </p>
          )}
        </CardContent>

        <CardFooter className="border-t bg-muted/20 px-4 py-2 flex items-center justify-between mt-auto">
          <button
            type="button"
            onClick={async (e) => {
              e.stopPropagation();
              await toggleFavoritePlaceAction(item.id, item.isFavorite ?? false);
            }}
            className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-rose-500 transition py-1"
          >
            <Heart className={`h-3.5 w-3.5 ${item.isFavorite ? "text-rose-500 fill-current" : ""}`} />
            Favorite
          </button>

          <button
            type="button"
            onClick={async (e) => {
              e.stopPropagation();
              if (confirm("Send this travel spot to archives?")) {
                await archivePlaceAction(item.id);
              }
            }}
            className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-destructive transition py-1"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Archive
          </button>
        </CardFooter>
      </Card>

      <PlaceEditDialog item={item} open={editOpen} onOpenChange={setEditOpen} />
    </>
  );
}