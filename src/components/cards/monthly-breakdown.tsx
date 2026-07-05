// src/components/cards/monthly-breakdown.tsx
"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Gift, ShoppingBag, Calendar, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

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

interface MonthlyBreakdownProps {
  data: Record<string, { income: number; spent: number; saved: number; transactions: any[] }>;
  onDeleteTransaction: (id: string) => void;
}

export function MonthlyBreakdown({ data, onDeleteTransaction }: MonthlyBreakdownProps) {
  if (!data || Object.keys(data).length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="font-bold text-base sm:text-lg">Monthly Breakdown</h3>
      <div className="space-y-3">
        {Object.entries(data).map(([key, monthData]: [string, any]) => {
          const [year, month] = key.split("-");
          const spentPercent = monthData.income > 0 ? (monthData.spent / monthData.income) * 100 : 0;

          return (
            <Card key={key} className="p-3 sm:p-4">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <h4 className="font-bold text-sm sm:text-base">
                  {months[parseInt(month)-1]} {year}
                </h4>
                <Badge variant={monthData.saved >= 0 ? "default" : "destructive"} className="text-[10px] sm:text-xs">
                  {monthData.saved >= 0 ? "Saved" : "Overspent"}: ${Math.abs(monthData.saved).toFixed(2)}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm mb-2 sm:mb-3">
                <div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Income</p>
                  <p className="font-bold text-emerald-600">${monthData.income.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Spent</p>
                  <p className="font-bold text-rose-600">${monthData.spent.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Saved</p>
                  <p className="font-bold">${monthData.saved.toFixed(2)}</p>
                </div>
              </div>

              {monthData.income > 0 && (
                <div className="w-full bg-muted rounded-full h-1.5 sm:h-2 mb-2 sm:mb-3">
                  <div
                    className={cn(
                      "h-1.5 sm:h-2 rounded-full transition-all",
                      spentPercent > 90 ? "bg-red-500" : spentPercent > 70 ? "bg-amber-500" : "bg-emerald-500"
                    )}
                    style={{ width: `${Math.min(spentPercent, 100)}%` }}
                  />
                </div>
              )}

              {monthData.transactions.length > 0 && (
                <div className="space-y-1 sm:space-y-1.5 mt-2 sm:mt-3 pt-2 sm:pt-3 border-t">
                  <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase">
                    Transactions
                  </p>
                  {monthData.transactions.map((t: any) => (
                    <div key={t.id} className="flex items-center justify-between text-xs sm:text-sm py-0.5 sm:py-1">
                      <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                        <span className="flex-shrink-0">{sourceIcons[t.sourceType]}</span>
                        <span className="hidden sm:inline text-muted-foreground">{sourceLabels[t.sourceType]}</span>
                        {t.note && (
                          <span className="text-[10px] sm:text-xs text-muted-foreground truncate max-w-[100px] sm:max-w-[200px]">
                            - {t.note}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                        <span className="text-[10px] sm:text-xs text-muted-foreground">
                          {new Date(t.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                        <button
                          onClick={() => onDeleteTransaction(t.id)}
                          className="text-rose-600 hover:text-red-700 p-0.5"
                        >
                          <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        </button>
                        <span className="font-medium text-rose-600">-${t.amount.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}