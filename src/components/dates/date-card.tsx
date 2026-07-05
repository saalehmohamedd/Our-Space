"use client";

import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Heart, Trash2, CalendarDays, MapPin, DollarSign, CreditCard } from "lucide-react";
import { toggleFavoriteDateAction, archiveDateAction } from "@/app/actions/dates";
import { DateEditDialog } from "./date-edit-dialog";
import { Badge } from "@/components/ui/badge";
import { showToast } from "@/lib/toast";

interface DateItemType {
  id: string;
  title: string;
  location: string | null;
  date: string;
  cost: string | null;
  rating: number | null;
  notes: string | null;
  isFavorite: boolean;
  isArchived: boolean;
  cardId?: string | null;
}

interface DateCardProps {
  item: DateItemType;
  cards?: Array<{
    id: string;
    nickname: string;
    brand: string;
    last4: string;
    colorTheme: string;
    balance: string;
  }>;
}

export function DateCard({ item, cards = [] }: DateCardProps) {
  const [editOpen, setEditOpen] = useState(false);

  const formattedDate = new Date(item.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      <Card className="bg-card/70 backdrop-blur-sm border hover:shadow-md transition flex flex-col w-full relative group">
        <CardContent className="pt-5 space-y-3 flex-grow cursor-pointer" onClick={() => setEditOpen(true)}>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5 text-rose-500" />
              <span>{formattedDate}</span>
            </div>
            <Badge variant="outline">Date Night</Badge>
          </div>

          <h3 className="font-bold tracking-tight text-xl group-hover:text-rose-500 transition-colors line-clamp-1">
            {item.title}
          </h3>

          {item.location && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 text-rose-400" />
              <span className="line-clamp-1">{item.location}</span>
            </div>
          )}

          <div className="flex items-center gap-3">
            {item.cost && parseFloat(item.cost) > 0 && (
              <div className="flex items-center gap-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                <DollarSign className="h-3.5 w-3.5" />
                <span>${parseFloat(item.cost).toFixed(2)}</span>
              </div>
            )}
            {item.cardId && (
              <span title="Linked to card">
                <CreditCard className="h-3.5 w-3.5 text-indigo-400" />
              </span>
            )}
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
              await toggleFavoriteDateAction(item.id, item.isFavorite);
              showToast.success(item.isFavorite ? "Removed from favorites 💔" : "Added to favorites ❤️");
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
              if (confirm("Archive this date?")) {
                await archiveDateAction(item.id);
                showToast.success("Date archived");
              }
            }}
            className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-destructive transition py-1"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Archive
          </button>
        </CardFooter>
      </Card>

      <DateEditDialog item={item} cards={cards} open={editOpen} onOpenChange={setEditOpen} />
    </>
  );
}