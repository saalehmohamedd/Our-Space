import { z } from "zod";

export const ratingSchema = z.object({
  entityType: z.string().min(1, "Entity type is required"),
  entityId: z.string().min(1, "Entity ID is required"),
  stars: z.number().int().min(1, "Minimum 1 star").max(5, "Maximum 5 stars"),
  comment: z.string().max(1000, "Comment must be under 1000 characters").optional(),
});

export type RatingInput = z.infer<typeof ratingSchema>;
