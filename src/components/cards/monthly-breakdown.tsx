// src/components/cards/monthly-breakdown.tsx
"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Trash2, Gift, ShoppingBag, Calendar, Star, TrendingUp, TrendingDown, PiggyBank } from "lucide-react";
import { cn } from "@/lib/utils";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const sourceIcons: Record<string, React.ReactNode> = {
  WISHLIST: <Gift className="h-3 w-3 sm:h-3.5 sm:w-3.5" />,
  SHOPPING: <ShoppingBag className="h-3 w-3 sm:h-3.5 sm:w-3.5" />,
  DATE_OUTING: <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />,
  MANUAL: <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5" />,
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

  // Sort by key (year-month) descending
  const sortedEntries = Object.entries(data).sort((a, b) => b[0].localeCompare(a[0]));

  return (
    <div className="space-y-3">
      <h3 className="font-bold text-base sm:text-lg">Monthly Breakdown</h3>
      <Accordion type="multiple" className="space-y-3">
        {sortedEntries.map(([key, monthData]: [string, any]) => {
          const [year, month] = key.split("-");
          const spentPercent = monthData.income > 0 ? (monthData.spent / monthData.income) * 100 : 0;
          const monthName = MONTHS[parseInt(month) - 1];

          return (
            <AccordionItem
              key={key}
              value={key}
              className="border rounded-2xl px-0 overflow-hidden bg-card"
            >
              <AccordionTrigger className="px-4 sm:px-5 py-3 sm:py-4 hover:no-underline hover:bg-muted/30 transition-colors rounded-2xl data-[state=open]:rounded-b-none">
                <div className="flex items-center justify-between w-full mr-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <h4 className="font-bold text-sm sm:text-base">
                      {monthName} {year}
                    </h4>
                    <Badge
                      variant={monthData.saved >= 0 ? "default" : "destructive"}
                      className="text-[10px] sm:text-xs font-medium"
                    >
                      {monthData.saved >= 0 ? (
                        <span className="flex items-center gap-1">
                          <PiggyBank className="h-3 w-3" />
                          Saved ${Math.abs(monthData.saved).toFixed(0)}
                        </span>
                      ) : (
                        <span>Overspent ${Math.abs(monthData.saved).toFixed(0)}</span>
                      )}
                    </Badge>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 sm:px-5 pb-4 pt-1">
                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-3">
                  <div className="p-2 sm:p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-center">
                    <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500 mx-auto mb-1" />
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Income</p>
                    <p className="font-bold text-xs sm:text-sm text-emerald-600">${monthData.income.toFixed(2)}</p>
                  </div>
                  <div className="p-2 sm:p-3 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-center">
                    <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-rose-500 mx-auto mb-1" />
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Spent</p>
                    <p className="font-bold text-xs sm:text-sm text-rose-600">${monthData.spent.toFixed(2)}</p>
                  </div>
                  <div className="p-2 sm:p-3 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-center">
                    <PiggyBank className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 mx-auto mb-1" />
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Saved</p>
                    <p className="font-bold text-xs sm:text-sm">${monthData.saved.toFixed(2)}</p>
                  </div>
                </div>

                {/* Progress Bar */}
                {monthData.income > 0 && (
                  <div className="w-full bg-muted rounded-full h-2 sm:h-2.5 mb-3">
                    <div
                      className={cn(
                        "h-2 sm:h-2.5 rounded-full transition-all duration-500",
                        spentPercent > 90 ? "bg-red-500" : spentPercent > 70 ? "bg-amber-500" : "bg-emerald-500"
                      )}
                      style={{ width: `${Math.min(spentPercent, 100)}%` }}
                    />
                    <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                      {spentPercent.toFixed(0)}% of income spent
                    </p>
                  </div>
                )}

                {/* Transactions */}
                {monthData.transactions.length > 0 && (
                  <div className="space-y-1 sm:space-y-1.5 mt-2 pt-2 border-t border-border">
                    <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Transactions ({monthData.transactions.length})
                    </p>
                    {monthData.transactions.map((t: any) => (
                      <div
                        key={t.id}
                        className="flex items-center justify-between py-1.5 sm:py-2 px-2 rounded-lg hover:bg-muted/30 transition-colors group"
                      >
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                            {sourceIcons[t.sourceType]}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs sm:text-sm font-medium truncate">
                              {sourceLabels[t.sourceType]}
                            </p>
                            {t.note && (
                              <p className="text-[10px] sm:text-xs text-muted-foreground truncate max-w-[120px] sm:max-w-[200px]">
                                {t.note}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                          <span className="text-[10px] sm:text-xs text-muted-foreground hidden sm:inline">
                            {new Date(t.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                          <button
                            onClick={() => onDeleteTransaction(t.id)}
                            className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity p-1"
                          >
                            <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          </button>
                          <span className="font-medium text-xs sm:text-sm text-rose-600 tabular-nums">
                            -${t.amount.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {monthData.transactions.length === 0 && (
                  <p className="text-[10px] sm:text-xs text-muted-foreground text-center py-3">
                    No transactions this month
                  </p>
                )}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}