// src/components/wishlist/wishlist-card.tsx
"use client";

import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Heart, Trash2, ExternalLink } from "lucide-react";
import { toggleFavoriteWishlistAction, deleteWishlistItemAction } from "@/app/actions/wishlist";
import { WishlistEditDialog } from "./wishlist-edit-dialog";
import { Badge } from "@/components/ui/badge";

interface WishlistItemProps {
  item: {
    id: string;
    name: string;
    price: any;
    link: string | null;
    notes: string | null;
    priority: "LOW" | "MEDIUM" | "HIGH";
    status: "WANT" | "SAVING" | "BOUGHT";
    isFavorite: boolean;
    isArchived: boolean;
  };
}

export function WishlistCard({ item }: WishlistItemProps) {
  const [editOpen, setEditOpen] = useState(false);

  const priorityColors = {
    LOW: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    MEDIUM: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
    HIGH: "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400",
  };

  const statusLabels = {
    WANT: { text: "Idea", variant: "outline" as const },
    SAVING: { text: "Saving", variant: "secondary" as const },
    BOUGHT: { text: "Got It", variant: "default" as const },
  };

  return (
    <>
      <Card className="bg-card/70 backdrop-blur-sm border hover:shadow-md transition flex flex-col w-full relative group">
        <CardContent className="pt-5 space-y-3 flex-grow cursor-pointer" onClick={() => setEditOpen(true)}>
          <div className="flex items-center justify-between gap-2">
            <div className="flex gap-1.5 flex-wrap">
              <Badge className={priorityColors[item.priority]} variant="outline">
                {item.priority} Priority
              </Badge>
              <Badge variant={statusLabels[item.status].variant}>
                {statusLabels[item.status].text}
              </Badge>
            </div>
            
            {item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-muted-foreground hover:text-indigo-500 transition p-1"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>

          <div className="space-y-1">
            <h3 className="font-bold tracking-tight text-xl group-hover:text-indigo-500 transition-colors line-clamp-1">
              {item.name}
            </h3>
            <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
              {item.price ? `$${Number(item.price).toFixed(2)}` : "Price Pending"}
            </p>
          </div>

          {item.notes && (
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 bg-muted/40 p-2.5 rounded-lg border border-dashed">
              {item.notes}
            </p>
          )}
        </CardContent>

        <CardFooter className="border-t bg-muted/20 px-4 py-2 flex items-center justify-between mt-auto">
          <button
            type="button"
            onClick={async (e) => {
              e.stopPropagation();
              await toggleFavoriteWishlistAction(item.id, item.isFavorite);
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
              if (confirm("Remove this item from wishlist?")) {
                await deleteWishlistItemAction(item.id);
              }
            }}
            className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-destructive transition py-1"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Remove
          </button>
        </CardFooter>
      </Card>

      <WishlistEditDialog item={item} open={editOpen} onOpenChange={setEditOpen} />
    </>
  );
}