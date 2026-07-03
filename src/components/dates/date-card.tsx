"use client";

import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Heart, Trash2, Calendar, MapPin, DollarSign, Star } from "lucide-react";
import { toggleFavoriteDateAction, archiveDateAction } from "@/app/actions/dates";
import { DateEditDialog } from "./date-edit-dialog";
import { Badge } from "@/components/ui/badge";

interface DateCardProps {
  item: {
    id: string;
    title: string;
    activity: string;
    location: string;
    scheduledAt: Date;
    costEstimate: any;
    status: "IDEA" | "PLANNED" | "COMPLETED";
    rating: number | null;
    notes: string | null;
    isFavorite: boolean;
    isArchived: boolean;
  };
}

export function DateCard({ item }: DateCardProps) {
  const [editOpen, setEditOpen] = useState(false);

  const statusStyles = {
    IDEA: "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400",
    PLANNED: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
    COMPLETED: "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400",
  };

  const statusLabels = {
    IDEA: "Spark Idea",
    PLANNED: "Locked In",
    COMPLETED: "Cherished Capsule",
  };

  const formattedDate = new Date(item.scheduledAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      <Card className="bg-card/70 backdrop-blur-sm border hover:shadow-md transition flex flex-col w-full relative group">
        <CardContent className="pt-5 space-y-3 flex-grow cursor-pointer" onClick={() => setEditOpen(true)}>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 text-rose-500" />
              <span>{formattedDate}</span>
            </div>
            <Badge className={statusStyles[item.status]} variant="outline">
              {statusLabels[item.status]}
            </Badge>
          </div>

          <div className="space-y-1">
            <h3 className="font-bold tracking-tight text-xl group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors line-clamp-1">
              {item.title}
            </h3>
            <p className="text-sm text-slate-500 font-medium line-clamp-1 italic">
              {item.activity}
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground font-semibold">
            <div className="flex items-center gap-0.5">
              <MapPin className="h-3.5 w-3.5 text-zinc-400" />
              <span className="line-clamp-1">{item.location}</span>
            </div>
            <div className="flex items-center gap-0.5">
              <DollarSign className="h-3.5 w-3.5 text-zinc-400" />
              <span>{item.costEstimate ? Number(item.costEstimate).toLocaleString() : "TBD"}</span>
            </div>
          </div>

          {/* 🌟 RATING ACCORDION DISPLAY */}
          {item.status === "COMPLETED" && item.rating && (
            <div className="flex items-center gap-0.5 pt-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < (item.rating || 0)
                      ? "text-amber-400 fill-amber-400"
                      : "text-zinc-200 dark:text-zinc-800"
                  }`}
                />
              ))}
            </div>
          )}

          {item.notes && (
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 bg-muted/40 p-2.5 rounded-lg border border-dashed">
              {item.notes}
            </p>
          )}
        </CardContent>

        <CardFooter className="border-t bg-muted/20 px-4 py-2 flex items-center justify-between mt-auto">
          <button
            type="button"
            onClick={async (e) => {
              e.stopPropagation();
              await toggleFavoriteDateAction(item.id, item.isFavorite);
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
              if (confirm("Send this date capsule archive down to vault records?")) {
                await archiveDateAction(item.id);
              }
            }}
            className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-destructive transition py-1"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Archive
          </button>
        </CardFooter>
      </Card>

      <DateEditDialog item={item} open={editOpen} onOpenChange={setEditOpen} />
    </>
  );
}