// src/app/(app)/travil-places/page.tsx

import React from "react";
import { prisma } from "@/lib/prisma";
import { Separator } from "@/components/ui/separator";
import { Map } from "lucide-react";
import { PlaceCreationDialog } from "@/components/travel/place-creation-dialog";
import { PlaceCard } from "@/components/travel/place-card";

function serializePlaceItem(item: any) {
  return {
    ...item,
    estimatedBudget: item.estimatedBudget?.toString() || null,
    createdAt: item.createdAt?.toISOString() || null,
    updatedAt: item.updatedAt?.toISOString() || null,
  };
}

export default async function TravelPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; filter?: string }>;
}) {
  const { sort, filter } = await searchParams;

  const where: any = { isArchived: false };
  
  if (filter === "favorites") {
    where.isFavorite = true;
  } else if (filter === "active") {
    where.visited = false;
  } else if (filter === "completed") {
    where.visited = true;
  }

  let orderBy: any = [{ isFavorite: "desc" }, { createdAt: "desc" }];
  
  if (sort === "oldest") {
    orderBy = { createdAt: "asc" };
  } else if (sort === "az") {
    orderBy = { city: "asc" };
  } else if (sort === "za") {
    orderBy = { city: "desc" };
  }

  const items = await prisma.place.findMany({
    where,
    orderBy,
  });

  const serializedItems = items.map(serializePlaceItem);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Our Travel Explorer</h1>
          <p className="text-muted-foreground">
            {serializedItems.length} destinations
            {filter === "favorites" && " • Favorites"}
            {filter === "active" && " • Not yet visited"}
            {filter === "completed" && " • Visited"}
          </p>
        </div>
        <div>
          <PlaceCreationDialog />
        </div>
      </div>

      <Separator />

      {serializedItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-16 text-center bg-card/50">
          <Map className="h-10 w-10 text-emerald-400 stroke-1 mb-3 animate-pulse" />
          <h3 className="font-semibold text-lg">No destinations found</h3>
          <p className="text-sm text-muted-foreground max-w-sm mt-1">
            {filter 
              ? "Try adjusting your filters." 
              : "Your travel itinerary map is looking blank! Tap the action button above to plan your first shared escape."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {serializedItems.map((item) => (
            <PlaceCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}