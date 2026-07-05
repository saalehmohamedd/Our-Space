// src/components/cards/cards-client.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CardVisual } from "./card-visual";
import { AddCardForm } from "./add-card-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, ArrowRight, TrendingUp, Wallet, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

interface CardsClientProps {
  cards: any[];
  totalBalance: number;
}

export function CardsClient({ cards, totalBalance }: CardsClientProps) {
  const [addCardOpen, setAddCardOpen] = useState(false);
  const router = useRouter();

  if (cards.length === 0) {
    return (
      <>
        <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-16 text-center bg-card/50">
          <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-950/30 flex items-center justify-center mb-4">
            <CreditCard className="h-8 w-8 text-indigo-400" />
          </div>
          <h3 className="font-semibold text-lg">No Cards Yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm mt-1">
            Add your cards to track shared spending across wishlist, shopping, and date outings.
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

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <Card className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20 border-indigo-200/50 dark:border-indigo-800/50 transition-all hover:shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
              <Wallet className="h-5 w-5 text-indigo-500" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Total Balance</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold tracking-tight">${totalBalance.toFixed(2)}</p>
        </Card>
        <Card className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-200/50 dark:border-emerald-800/50 transition-all hover:shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-emerald-500" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Active Cards</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold tracking-tight">{cards.length}</p>
        </Card>
        <Card className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200/50 dark:border-amber-800/50 transition-all hover:shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-amber-500" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Transactions</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold tracking-tight">
            {cards.reduce((sum: number, c: any) => sum + (c.transactions?.length || 0), 0)}
          </p>
        </Card>
      </div>

      {/* Cards Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Your Cards</h2>
        <Button
          onClick={() => setAddCardOpen(true)}
          className="gap-2 bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white shadow-lg shadow-indigo-500/25 rounded-xl"
          size="sm"
        >
          <Plus className="h-4 w-4" />
          Add Card
        </Button>
      </div>

      {/* Cards Grid - Responsive 1/2/3 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="group"
          >
            <CardVisual
              last4={card.last4}
              nickname={card.nickname}
              brand={card.brand}
              colorTheme={card.colorTheme}
              balance={parseFloat(card.balance)}
              onClick={() => router.push(`/cards/${card.id}`)}
              className="cursor-pointer"
            />
            <div className="flex items-center justify-between mt-2 px-1">
              <p className="text-xs text-muted-foreground">
                {card.transactions?.length || 0} transactions
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-indigo-500 hover:text-indigo-600 -mr-2"
                onClick={() => router.push(`/cards/${card.id}`)}
              >
                Details <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </motion.div>
        ))}

        {/* Add Card Tile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: cards.length * 0.05 }}
        >
          <button
            onClick={() => setAddCardOpen(true)}
            className="w-full aspect-[1.586/1] rounded-2xl border-2 border-dashed border-muted-foreground/25 hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition-all duration-300 flex flex-col items-center justify-center gap-3 group"
          >
            <div className="w-12 h-12 rounded-xl bg-muted group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 flex items-center justify-center transition-colors">
              <Plus className="h-6 w-6 text-muted-foreground group-hover:text-indigo-500 transition-colors" />
            </div>
            <span className="text-sm font-medium text-muted-foreground group-hover:text-indigo-500 transition-colors">
              Add New Card
            </span>
          </button>
        </motion.div>
      </div>

      <AddCardForm open={addCardOpen} onOpenChange={setAddCardOpen} />
    </div>
  );
}