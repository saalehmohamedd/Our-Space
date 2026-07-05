// src/components/cards/card-visual.tsx
"use client";

import React from "react";
import { getCardColorClasses, formatMaskedNumber, getBrandDisplayName, getBrandColor } from "@/lib/card-utils";
import { cn } from "@/lib/utils";

interface CardVisualProps {
  last4: string;
  nickname: string;
  brand: string;
  colorTheme: string;
  balance: number;
  size?: "sm" | "lg";
  className?: string;
  onClick?: () => void;
}

const brandChipColors: Record<string, string> = {
  VISA: "bg-blue-600 text-white",
  MASTERCARD: "bg-orange-500 text-white",
  AMEX: "bg-blue-800 text-white",
  MEEZA: "bg-purple-600 text-white",
  OTHER: "bg-gray-600 text-white",
};

export function CardVisual({
  last4,
  nickname,
  brand,
  colorTheme,
  balance,
  size = "lg",
  className,
  onClick,
}: CardVisualProps) {
  const colors = getCardColorClasses(colorTheme);
  const brandColor = getBrandColor(brand as any);

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative rounded-2xl bg-gradient-to-br shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group",
        colors.gradient,
        size === "lg" ? "aspect-[1.586/1] p-5 sm:p-6" : "aspect-[1.586/1] p-4",
        className
      )}
    >
      {/* Glass/Noise overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      {/* Sheen overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />

      {/* Top row */}
      <div className="relative z-10 flex items-start justify-between">
        <div className="min-w-0 flex-1 mr-3">
          <p className="text-white/70 text-xs sm:text-sm font-medium uppercase tracking-wider truncate">
            {nickname}
          </p>
          <p className="text-white text-xl sm:text-2xl lg:text-3xl font-bold mt-1 sm:mt-2 tracking-tight">
            ${balance.toFixed(2)}
          </p>
        </div>
        {/* Chip */}
        <div className="w-10 h-8 sm:w-12 sm:h-9 rounded-md bg-gradient-to-br from-yellow-300/40 to-yellow-500/30 border border-white/20 flex-shrink-0 backdrop-blur-sm" />
      </div>

      {/* Middle row - Card number */}
      <div className="relative z-10">
        <p className="text-white/95 text-base sm:text-lg lg:text-xl font-mono tracking-[0.15em] sm:tracking-[0.2em] drop-shadow-sm">
          {formatMaskedNumber(last4)}
        </p>
      </div>

      {/* Bottom row */}
      <div className="relative z-10 flex items-end justify-between">
        <p className="text-white/60 text-[10px] sm:text-xs uppercase tracking-wider">Balance</p>
        {/* Brand chip */}
        <div className={cn(
          "px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold tracking-wider uppercase backdrop-blur-sm",
          brandChipColors[brand] || brandChipColors.OTHER
        )}>
          {getBrandDisplayName(brand as any)}
        </div>
      </div>
    </div>
  );
}