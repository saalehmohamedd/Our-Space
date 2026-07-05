// src/components/cards/card-picker-select.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreditCard, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CardPickerSelectProps {
  cards: any[];
  selectedCardId?: string | null;
  onSelect: (cardId: string) => void;
  className?: string;
}

export function CardPickerSelect({
  cards,
  selectedCardId,
  onSelect,
  className,
}: CardPickerSelectProps) {
  const [open, setOpen] = useState(false);
  const selectedCard = cards.find((c) => c.id === selectedCardId);

  return (
    <>
      <Button
        variant="outline"
        className={cn("w-full justify-start gap-2 h-auto py-3", className)}
        onClick={() => setOpen(true)}
      >
        {selectedCard ? (
          <div className="flex items-center gap-2 w-full">
            <div className={cn(
              "w-8 h-5 rounded bg-gradient-to-br",
              selectedCard.colorTheme === "indigo" && "from-indigo-600 to-blue-500",
              selectedCard.colorTheme === "rose" && "from-rose-600 to-orange-400",
              selectedCard.colorTheme === "emerald" && "from-emerald-600 to-teal-500",
              selectedCard.colorTheme === "violet" && "from-violet-600 to-fuchsia-500",
              selectedCard.colorTheme === "amber" && "from-amber-600 to-red-500",
              selectedCard.colorTheme === "slate" && "from-slate-700 to-gray-500",
            )} />
            <span className="text-sm">{selectedCard.nickname}</span>
            <span className="text-xs text-muted-foreground ml-auto">
              •••• {selectedCard.last4}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-muted-foreground">
            <CreditCard className="h-4 w-4" />
            <span className="text-sm">Select a card</span>
          </div>
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[92vw] max-w-[500px] rounded-2xl p-0 gap-0 border-0 shadow-2xl max-h-[80vh] overflow-y-auto">
          <div className="p-6">
            <DialogHeader>
              <DialogTitle>Select Card</DialogTitle>
            </DialogHeader>

            <div className="space-y-3 mt-4">
              {cards.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No cards available. Add a card first.
                </p>
              ) : (
                cards.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => {
                      onSelect(card.id);
                      setOpen(false);
                    }}
                    className={cn(
                      "w-full p-3 rounded-xl border-2 transition-all text-left",
                      selectedCardId === card.id
                        ? "border-primary bg-primary/5"
                        : "border-transparent hover:border-muted-foreground/20 hover:bg-muted/30"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-12 h-8 rounded-md bg-gradient-to-br flex-shrink-0",
                        card.colorTheme === "indigo" && "from-indigo-600 to-blue-500",
                        card.colorTheme === "rose" && "from-rose-600 to-orange-400",
                        card.colorTheme === "emerald" && "from-emerald-600 to-teal-500",
                        card.colorTheme === "violet" && "from-violet-600 to-fuchsia-500",
                        card.colorTheme === "amber" && "from-amber-600 to-red-500",
                        card.colorTheme === "slate" && "from-slate-700 to-gray-500",
                      )} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{card.nickname}</p>
                        <p className="text-xs text-muted-foreground">
                          •••• {card.last4} • ${parseFloat(card.balance).toFixed(2)}
                        </p>
                      </div>
                      {selectedCardId === card.id && (
                        <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}