// src/components/cards/card-visual.tsx
"use client";

import React from "react";
import { getCardColorClasses, formatMaskedNumber, getBrandDisplayName } from "@/lib/card-utils";
import { cn } from "@/lib/utils";

interface CardVisualProps {
  last4: string;
  nickname: string;
  brand: string;
  colorTheme: string;
  balance: number;
  size?: "sm" | "lg";
  className?: string;
}

export function CardVisual({ last4, nickname, brand, colorTheme, balance, size = "lg", className }: CardVisualProps) {
  const colors = getCardColorClasses(colorTheme);
  
  return (
    <div className={cn(
      "rounded-2xl bg-gradient-to-br flex flex-col justify-between shadow-xl mx-auto",
      colors.gradient,
      size === "lg" ? "aspect-[1.586/1] p-4 sm:p-6 max-w-md" : "aspect-[1.586/1] p-3 sm:p-4 max-w-[280px]",
      className
    )}>
      <div>
        <p className="text-white/70 text-xs sm:text-sm uppercase tracking-wider truncate">{nickname}</p>
        <p className="text-white text-xl sm:text-3xl font-bold mt-1 sm:mt-2">
          ${balance.toFixed(2)}
        </p>
      </div>
      <div>
        <p className="text-white/90 text-base sm:text-xl font-mono tracking-wider">
          {formatMaskedNumber(last4)}
        </p>
      </div>
      <div className="flex justify-between items-end">
        <p className="text-white/50 text-[10px] sm:text-xs">Balance</p>
        <p className="text-white/80 text-base sm:text-xl font-bold italic tracking-[0.2em] uppercase">
          {getBrandDisplayName(brand as any)}
        </p>
      </div>
    </div>
  );
}