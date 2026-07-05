// src/components/cards/stats-cards.tsx
"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, PiggyBank, Wallet } from "lucide-react";

interface StatsCardsProps {
  income: number;
  spent: number;
  saved: number;
  balance: number;
}

export function StatsCards({ income, spent, saved, balance }: StatsCardsProps) {
  const stats = [
    { icon: TrendingUp, label: "Income", value: income, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/20" },
    { icon: TrendingDown, label: "Spent", value: spent, color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-950/20" },
    { icon: PiggyBank, label: "Saved", value: saved, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/20" },
    { icon: Wallet, label: "Balance", value: balance, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-950/20" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} className={`p-3 sm:p-4 text-center ${stat.bg}`}>
            <Icon className={`h-4 w-4 sm:h-5 sm:w-5 mx-auto mb-1 ${stat.color}`} />
            <p className="text-[10px] sm:text-xs text-muted-foreground">{stat.label}</p>
            <p className={`text-base sm:text-xl font-bold ${stat.color}`}>
              ${stat.value.toFixed(2)}
            </p>
          </Card>
        );
      })}
    </div>
  );
}