import React from "react";
import { prisma } from "@/lib/prisma";
import { Separator } from "@/components/ui/separator";
import { Heart } from "lucide-react";
import { MemoryCreationDialog } from "@/components/memories/memory-creation-dialog";
import { MemoryCard } from "@/components/memories/memory-card";
import { getAverageRatings } from "@/app/actions/ratings.actions";
import { RatingSummary } from "@/components/ratings/rating-summary";
import { getRatingsForEntity } from "@/app/actions/ratings.actions";

function serializeMemory(memory: any) {
  return {
    ...memory,
    date: memory.date?.toISOString() || null,
    createdAt: memory.createdAt?.toISOString() || null,
    updatedAt: memory.updatedAt?.toISOString() || null,
    images:
      memory.images?.map((img: any) => ({
        ...img,
        createdAt: img.createdAt?.toISOString() || null,
      })) || [],
  };
}

export default async function MemoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; filter?: string }>;
}) {
  // Await the searchParams
  const { sort, filter } = await searchParams;

  // Build where clause based on filter
  const where: any = { isArchived: false };

  if (filter === "favorites") {
    where.isFavorite = true;
  }

  // Build orderBy based on sort
  let orderBy: any = { date: "desc" }; // default newest

  if (sort === "oldest") {
    orderBy = { date: "asc" };
  } else if (sort === "az") {
    orderBy = { title: "asc" };
  } else if (sort === "za") {
    orderBy = { title: "desc" };
  }

  const memories = await prisma.memory.findMany({
    where,
    include: { images: true },
    orderBy,
  });

  const serializedMemories = memories.map(serializeMemory);

  const memoryRatingsPromises = serializedMemories.map(async (memory) => {
    const data = await getRatingsForEntity("MEMORY", memory.id);
    return { id: memory.id, ...data };
  });

  const memoryRatings = await Promise.all(memoryRatingsPromises);
  const ratingsMap = Object.fromEntries(memoryRatings.map((r) => [r.id, r]));



  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Our Scrapbook</h1>
          <p className="text-muted-foreground">
            {serializedMemories.length}{" "}
            {filter === "favorites" ? "favorite" : ""} memories
          </p>
        </div>
        <div>
          <MemoryCreationDialog />
        </div>
      </div>

      <Separator />

      {serializedMemories.length === 0 ? (
        <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-16 text-center bg-card/50">
          <Heart className="h-10 w-10 text-rose-400 stroke-1 mb-3 animate-pulse" />
          <h3 className="font-semibold text-lg">
            {filter === "favorites"
              ? "No Favorite Memories"
              : "The canvas is completely empty"}
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm mt-1">
            {filter === "favorites"
              ? "Start favoriting memories to see them here!"
              : "No memories have been locked yet. Click the capture button above to drop your first visual capsule!"}
          </p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {serializedMemories.map((memory) => (
            <MemoryCard
              key={memory.id}
              memory={memory}
              ratingsData={ratingsMap[memory.id] || null}
            />
          ))}
        </div>
      )}
    </div>
  );
}
