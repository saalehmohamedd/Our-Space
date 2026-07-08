"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUserOrThrow } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";
import { ratingSchema } from "@/lib/validations/rating.schema";

// Upsert rating (create or update)
export async function upsertRating(input: {
  entityType: string;
  entityId: string;
  stars: number;
  comment?: string;
  revalidate?: string;
}) {
  try {
    const user = await getCurrentUserOrThrow();
    const validated = ratingSchema.parse(input);

    const rating = await prisma.rating.upsert({
      where: {
        entityType_entityId_raterId: {
          entityType: validated.entityType,
          entityId: validated.entityId,
          raterId: user.id,
        },
      },
      create: {
        entityType: validated.entityType,
        entityId: validated.entityId,
        raterId: user.id,
        stars: validated.stars,
        comment: validated.comment || null,
      },
      update: {
        stars: validated.stars,
        comment: validated.comment || null,
      },
    });

    if (input.revalidate) {
      revalidatePath(input.revalidate);
    }

    return {
      success: true,
      message: "Rating saved! ⭐",
      rating: {
        id: rating.id,
        stars: rating.stars,
        comment: rating.comment,
        entityType: rating.entityType,
        entityId: rating.entityId,
        createdAt: rating.createdAt.toISOString(),
        updatedAt: rating.updatedAt.toISOString(),
      },
    };
  } catch (error) {
    console.error("Upsert rating error:", error);
    throw new Error("Failed to save rating");
  }
}

// Delete current user's rating
export async function deleteRating(entityType: string, entityId: string) {
  try {
    const user = await getCurrentUserOrThrow();

    await prisma.rating.deleteMany({
      where: {
        entityType,
        entityId,
        raterId: user.id,
      },
    });

    revalidatePath("/");
    return { success: true, message: "Rating deleted" };
  } catch (error) {
    console.error("Delete rating error:", error);
    throw new Error("Failed to delete rating");
  }
}


export async function getRatingsForEntity(entityType: string, entityId: string) {
  try {
    const user = await getCurrentUserOrThrow();

    const ratings = await prisma.rating.findMany({
      where: { entityType, entityId },
      include: {
        rater: {
          select: { 
            id: true, 
            name: true, 
            avatarUrl: true,  
            role: true 
          },
        },
      },
    });


    const mine = ratings.find((r) => r.raterId === user.id) || null;
    const partner = ratings.find((r) => r.raterId !== user.id) || null;

    const allStars = ratings.map((r) => r.stars);
    const average = allStars.length > 0
      ? Math.round((allStars.reduce((sum, s) => sum + s, 0) / allStars.length) * 10) / 10
      : null;

    const result = {
      mine: mine ? {
        id: mine.id,
        stars: mine.stars,
        comment: mine.comment,
        rater: { 
          id: mine.rater.id, 
          name: mine.rater.name, 
          avatarUrl: mine.rater.avatarUrl,  // ✅ Include avatarUrl
          role: mine.rater.role 
        },
        createdAt: mine.createdAt.toISOString(),
        updatedAt: mine.updatedAt.toISOString(),
      } : null,
      partner: partner ? {
        id: partner.id,
        stars: partner.stars,
        comment: partner.comment,
        rater: { 
          id: partner.rater.id, 
          name: partner.rater.name, 
          avatarUrl: partner.rater.avatarUrl,  // ✅ Include avatarUrl
          role: partner.rater.role 
        },
        createdAt: partner.createdAt.toISOString(),
        updatedAt: partner.updatedAt.toISOString(),
      } : null,
      average: average,
      count: ratings.length,
    };


    return result;
  } catch (error) {
    console.error("Get ratings error:", error);
    return { mine: null, partner: null, average: null, count: 0 };
  }
}

// Get average ratings for multiple entities (batch)
export async function getAverageRatings(entityType: string, entityIds: string[]) {
  try {
    if (!entityIds.length) return {};

    const result = await prisma.rating.groupBy({
      by: ["entityId"],
      where: {
        entityType,
        entityId: { in: entityIds },
      },
      _avg: { stars: true },
      _count: { stars: true },
    });

    const ratingsMap: Record<string, { average: number; count: number }> = {};
    
    result.forEach((r) => {
      ratingsMap[r.entityId] = {
        average: r._avg.stars ? Math.round(r._avg.stars * 10) / 10 : 0,
        count: r._count.stars,
      };
    });

    return ratingsMap;
  } catch (error) {
    console.error("Get average ratings error:", error);
    return {};
  }
}