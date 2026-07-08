"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  value: number;
  onChange?: (stars: number) => void;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

const sizeClasses = {
  sm: "h-3.5 w-3.5",
  md: "h-5 w-5",
  lg: "h-7 w-7",
};

const gapClasses = {
  sm: "gap-0.5",
  md: "gap-1",
  lg: "gap-1.5",
};

export function RatingStars({ value, onChange, size = "md", disabled = false }: RatingStarsProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const displayValue = hoverValue ?? value;
  const isInteractive = !!onChange && !disabled;

  return (
    <div
      className={cn("flex items-center", gapClasses[size])}
      onMouseLeave={() => setHoverValue(null)}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= displayValue;
        const halfFilled = !filled && star - 0.5 <= displayValue;

        return (
          <button
            key={star}
            type="button"
            disabled={!isInteractive}
            onClick={() => onChange?.(star)}
            onMouseEnter={() => isInteractive && setHoverValue(star)}
            className={cn(
              "transition-transform",
              isInteractive && "hover:scale-110 cursor-pointer",
              !isInteractive && "cursor-default"
            )}
          >
            <Star
              className={cn(
                sizeClasses[size],
                "transition-colors",
                filled
                  ? "text-amber-400 fill-amber-400"
                  : halfFilled
                  ? "text-amber-400 fill-amber-400/50"
                  : "text-muted-foreground/30"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}