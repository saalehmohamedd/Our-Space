// src/components/cards/transaction-list.tsx
"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Trash2, Gift, ShoppingBag, Calendar, Star } from "lucide-react";

const sourceIcons: Record<string, React.ReactNode> = {
  WISHLIST: <Gift className="h-3 w-3 sm:h-4 sm:w-4" />,
  SHOPPING: <ShoppingBag className="h-3 w-3 sm:h-4 sm:w-4" />,
  DATE_OUTING: <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />,
  MANUAL: <Star className="h-3 w-3 sm:h-4 sm:w-4" />,
};

const sourceLabels: Record<string, string> = {
  WISHLIST: "Wishlist",
  SHOPPING: "Shopping",
  DATE_OUTING: "Date",
  MANUAL: "Manual",
};

interface TransactionListProps {
  transactions: any[];
  onDelete: (id: string) => void;
}

export function TransactionList({ transactions, onDelete }: TransactionListProps) {
  if (!transactions?.length) {
    return (
      <div className="space-y-3">
        <h3 className="font-bold text-base sm:text-lg">All Transactions</h3>
        <p className="text-xs sm:text-sm text-muted-foreground">No transactions</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="font-bold text-base sm:text-lg">All Transactions</h3>
      <div className="space-y-1.5 sm:space-y-2">
        {transactions.map((t: any) => (
          <Card key={t.id} className="p-2.5 sm:p-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                {sourceIcons[t.sourceType]}
              </div>
              <div className="min-w-0">
                <p className="font-medium text-xs sm:text-sm truncate">{sourceLabels[t.sourceType]}</p>
                {t.note && (
                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{t.note}</p>
                )}
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  {new Date(t.date).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              <p className="font-bold text-xs sm:text-sm text-rose-600">-${t.amount.toFixed(2)}</p>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 sm:h-7 sm:w-7"
                onClick={() => onDelete(t.id)}
              >
                <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}