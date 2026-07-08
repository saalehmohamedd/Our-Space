"use client";

import React, { useState } from "react";
import { RatingStars } from "./rating-stars";
import { User } from "lucide-react";

interface RaterInfo {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string | null;
}

interface RatingSummaryProps {
  average?: number | null;
  count?: number;
  mine?: { stars: number; comment?: string | null; rater: RaterInfo } | null;
  partner?: { stars: number; comment?: string | null; rater: RaterInfo } | null;
  size?: "sm" | "md" | "lg";
}

function AvatarImage({ src, name, colorClass }: { src?: string | null; name: string; colorClass: string }) {
  const [imgError, setImgError] = useState(false);

  if (!src || imgError) {
    return (
      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${colorClass}`}>
        <User className="h-3 w-3" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      className="w-5 h-5 rounded-full object-cover"
      onError={() => setImgError(true)}
    />
  );
}

export function RatingSummary({ average, count, mine, partner, size = "md" }: RatingSummaryProps) {
  const hasAnyRatings = mine || partner || (average && average > 0);

  if (!hasAnyRatings) {
    return (
      <div className="flex items-center gap-2">
        <RatingStars value={0} size={size} />
        <span className="text-xs text-muted-foreground">No ratings yet</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="space-y-1.5">
        {mine && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 min-w-[80px]">
              <AvatarImage
                src={mine.rater.avatarUrl}
                name={mine.rater.name}
                colorClass="bg-rose-100 dark:bg-rose-900/30 text-rose-500"
              />
              <span className="text-xs font-medium">{mine.rater.name}</span>
            </div>
            <RatingStars value={mine.stars} size="sm" />
            <span className="text-xs text-amber-600 font-medium">{mine.stars}/5</span>
          </div>
        )}

        {partner && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 min-w-[80px]">
              <AvatarImage
                src={partner.rater.avatarUrl}
                name={partner.rater.name}
                colorClass="bg-blue-100 dark:bg-blue-900/30 text-blue-500"
              />
              <span className="text-xs font-medium">{partner.rater.name}</span>
            </div>
            <RatingStars value={partner.stars} size="sm" />
            <span className="text-xs text-amber-600 font-medium">{partner.stars}/5</span>
          </div>
        )}
      </div>

      {average && average > 0 && count && count > 0 && (
        <div className="flex items-center gap-2 pt-1.5 border-t border-border">
          <span className="text-xs text-muted-foreground">Average:</span>
          <RatingStars value={average} size="sm" />
          <span className="text-xs font-medium text-amber-600">
            {average.toFixed(1)} ({count} {count === 1 ? "rating" : "ratings"})
          </span>
        </div>
      )}

      {(mine?.comment || partner?.comment) && (
        <div className="space-y-1 pt-1.5 border-t border-border">
          {mine?.comment && (
            <div className="text-xs">
              <span className="font-medium text-rose-500">You:</span>{" "}
              <span className="text-muted-foreground">{mine.comment}</span>
            </div>
          )}
          {partner?.comment && (
            <div className="text-xs">
              <span className="font-medium text-blue-500">{partner.rater.name}:</span>{" "}
              <span className="text-muted-foreground">{partner.comment}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}