// src/components/cards/cards-client.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CardVisual } from "./card-visual";
import { AddCardForm } from "./add-card-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, ArrowRight, TrendingUp, Wallet, CreditCard } from "lucide-react";

interface CardsClientProps {
  cards: any[];
  totalBalance: number;
}

export function CardsClient({ cards, totalBalance }: CardsClientProps) {
  const [addCardOpen, setAddCardOpen] = useState(false);
  const router = useRouter();

  // Empty state with the Add Card button
  if (cards.length === 0) {
    return (
      <>
        <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-16 text-center bg-card/50">
          <CreditCard className="h-10 w-10 text-indigo-400 stroke-1 mb-3" />
          <h3 className="font-semibold text-lg">No Cards Yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm mt-1">
            Add your cards to track spending across wishlist, shopping, and date outings. Only the last 4 digits are stored securely.
          </p>
          <Button
            onClick={() => setAddCardOpen(true)}
            className="mt-4 gap-2 bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white shadow-lg shadow-indigo-500/25"
          >
            <Plus className="h-4 w-4" />
            Add Your First Card
          </Button>
        </div>
        <AddCardForm open={addCardOpen} onOpenChange={setAddCardOpen} />
      </>
    );
  }

  // Populated state
  return (
    <div className="space-y-6">
      {/* Balance Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20 border-indigo-200 dark:border-indigo-800">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <Wallet className="h-4 w-4 text-indigo-500" />
            </div>
            <span className="text-sm text-muted-foreground">Total Balance</span>
          </div>
          <p className="text-2xl font-bold">${totalBalance.toFixed(2)}</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <CreditCard className="h-4 w-4 text-emerald-500" />
            </div>
            <span className="text-sm text-muted-foreground">Active Cards</span>
          </div>
          <p className="text-2xl font-bold">{cards.length}</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-amber-500" />
            </div>
            <span className="text-sm text-muted-foreground">Transactions</span>
          </div>
          <p className="text-2xl font-bold">
            {cards.reduce((sum: number, c: any) => sum + (c.transactions?.length || 0), 0)}
          </p>
        </Card>
      </div>

      {/* Cards Row */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Your Cards</h2>
          <Button
            onClick={() => setAddCardOpen(true)}
            className="gap-2 bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white shadow-lg shadow-indigo-500/25"
          >
            <Plus className="h-4 w-4" />
            Add Card
          </Button>
        </div>
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-2 px-2">
          {cards.map((card) => (
            <div
              key={card.id}
              className="snap-start flex-shrink-0 w-[300px] sm:w-[340px]"
            >
              <CardVisual
                last4={card.last4}
                nickname={card.nickname}
                brand={card.brand}
                expiryMonth={card.expiryMonth}
                expiryYear={card.expiryYear}
                colorTheme={card.colorTheme}
                balance={parseFloat(card.balance)}
                onClick={() => router.push(`/cards/${card.id}`)}
              />
              <div className="flex items-center justify-between mt-2 px-1">
                <p className="text-xs text-muted-foreground">
                  {card.transactions?.length || 0} transactions
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-indigo-500 hover:text-indigo-600"
                  onClick={() => router.push(`/cards/${card.id}`)}
                >
                  Details <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
          ))}

          {/* Add Card Tile */}
          <div className="snap-start flex-shrink-0 w-[300px] sm:w-[340px]">
            <button
              onClick={() => setAddCardOpen(true)}
              className="w-full aspect-[1.586/1] rounded-2xl border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-3 hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition group"
            >
              <div className="w-12 h-12 rounded-full bg-muted group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 flex items-center justify-center transition">
                <Plus className="h-6 w-6 text-muted-foreground group-hover:text-indigo-500 transition" />
              </div>
              <span className="text-sm font-medium text-muted-foreground group-hover:text-indigo-500 transition">
                Add New Card
              </span>
            </button>
          </div>
        </div>
      </div>

      <AddCardForm open={addCardOpen} onOpenChange={setAddCardOpen} />
    </div>
  );
}