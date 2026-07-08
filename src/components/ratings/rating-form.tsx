// src/components/ratings/rating-form.tsx
"use client";

import React, { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RatingStars } from "./rating-stars";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Star, Trash2 } from "lucide-react";
import { upsertRating, deleteRating } from "@/app/actions/ratings.actions";
import { showToast } from "@/lib/toast";

interface RatingFormProps {
  entityType: string;
  entityId: string;
  existingRating?: { stars: number; comment?: string | null } | null;
  revalidate?: string;
  onSuccess?: () => void;
}

export function RatingForm({ entityType, entityId, existingRating, revalidate, onSuccess }: RatingFormProps) {
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Initialize from existing rating when it changes
  useEffect(() => {
    if (existingRating) {
      setStars(existingRating.stars);
      setComment(existingRating.comment || "");
    } else {
      setStars(0);
      setComment("");
    }
  }, [existingRating]);

  const handleSubmit = () => {
    if (stars === 0) {
      showToast.error("Please select a rating");
      return;
    }

    startTransition(async () => {
      try {
        await upsertRating({
          entityType,
          entityId,
          stars,
          comment: comment || undefined,
          revalidate,
        });
        showToast.success(existingRating ? "Rating updated! ⭐" : "Rating saved! ⭐");
        router.refresh();
        onSuccess?.();
      } catch (err) {
        showToast.error("Failed to save rating");
      }
    });
  };

  const handleDelete = () => {
    if (!confirm("Remove your rating?")) return;

    startTransition(async () => {
      try {
        await deleteRating(entityType, entityId);
        setStars(0);
        setComment("");
        showToast.success("Rating removed");
        router.refresh();
        onSuccess?.();
      } catch (err) {
        showToast.error("Failed to remove rating");
      }
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <RatingStars value={stars} onChange={setStars} size="lg" />
        {stars > 0 && (
          <span className="text-sm font-medium text-amber-600">
            {stars} {stars === 1 ? "star" : "stars"}
          </span>
        )}
      </div>

      <Textarea
        placeholder="Add a comment (optional)..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="resize-none min-h-[60px] text-sm"
        rows={2}
      />

      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={handleSubmit}
          disabled={isPending || stars === 0}
          className="gap-1.5"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Star className="h-4 w-4" />
          )}
          {existingRating ? "Update Rating" : "Submit Rating"}
        </Button>

        {existingRating && (
          <Button
            size="sm"
            variant="ghost"
            onClick={handleDelete}
            disabled={isPending}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}