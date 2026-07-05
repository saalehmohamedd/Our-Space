// src/components/cards/card-visual.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { getCardColorClasses, formatMaskedNumber, getBrandDisplayName } from "@/lib/card-utils";
import { cn } from "@/lib/utils";

interface CardVisualProps {
  last4: string;
  nickname: string;
  brand: string;
  expiryMonth?: number | null;
  expiryYear?: number | null;
  colorTheme: string;
  balance?: number;
  className?: string;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
}

export function CardVisual({
  last4,
  nickname,
  brand,
  expiryMonth,
  expiryYear,
  colorTheme,
  balance,
  className,
  onClick,
  size = "md",
}: CardVisualProps) {
  const colors = getCardColorClasses(colorTheme);
  const expiry = expiryMonth && expiryYear
    ? `${String(expiryMonth).padStart(2, "0")}/${String(expiryYear).slice(-2)}`
    : null;

  const sizeClasses = {
    sm: "p-3 text-sm",
    md: "p-5",
    lg: "p-6",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "relative aspect-[1.586/1] rounded-2xl bg-gradient-to-br",
        colors.gradient,
        sizeClasses[size],
        "flex flex-col justify-between cursor-pointer overflow-hidden",
        "shadow-lg hover:shadow-xl transition-shadow",
        className
      )}
    >
      {/* Sheen overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />

      {/* Top row */}
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-white/70 text-xs font-medium uppercase tracking-wider truncate max-w-[120px]">
            {nickname}
          </p>
          {balance !== undefined && (
            <p className="text-white text-xl sm:text-2xl font-bold mt-1">
              ${balance.toFixed(2)}
            </p>
          )}
        </div>
        {/* Chip */}
        <div className="w-10 h-8 rounded-md bg-gradient-to-br from-yellow-300/30 to-yellow-500/20 border border-white/20 flex-shrink-0" />
      </div>

      {/* Middle row - Card number */}
      <div className="relative z-10">
        <p className="text-white/90 text-base sm:text-lg font-mono tracking-wider">
          {formatMaskedNumber(last4)}
        </p>
      </div>

      {/* Bottom row */}
      <div className="relative z-10 flex items-end justify-between">
        <div>
          {expiry && (
            <div>
              <p className="text-white/50 text-[10px] uppercase tracking-wider">Expires</p>
              <p className="text-white/80 text-sm font-mono">{expiry}</p>
            </div>
          )}
        </div>
        <p className="text-white/80 text-lg sm:text-xl font-bold italic tracking-[0.2em] uppercase">
          {getBrandDisplayName(brand as any)}
        </p>
      </div>
    </motion.div>
  );
}