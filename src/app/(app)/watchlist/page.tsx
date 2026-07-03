// src/app/(app)/watchlist/page.tsx

import React from "react";
import { prisma } from "@/lib/prisma";
import { Separator } from "@/components/ui/separator";
import { Tv, Film, Clapperboard } from "lucide-react";
import { CreateWatchItemDialog } from "@/components/watchlist/create-watch-item-dialog";
import { WatchListGrid } from "@/components/watchlist/watchlist-grid";

function serializeWatchItem(item: any) {
  return {
    ...item,
    createdAt: item.createdAt?.toISOString() || null,
    updatedAt: item.updatedAt?.toISOString() || null,
  };
}

export default async function WatchlistPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; filter?: string }>;
}) {
  const { sort, filter } = await searchParams;

  // Build where clause
  const where: any = {};
  
  if (filter === "favorites") {
    where.isFavorite = true;
  } else if (filter === "active") {
    where.status = "WATCHING";
  } else if (filter === "completed") {
    where.status = "FINISHED";
  } else if (filter === "movies") {
    where.type = "MOVIE";
  } else if (filter === "tv") {
    where.type = "TV_SHOW";
  }

  // Build orderBy
  let orderBy: any = { createdAt: "desc" };
  
  if (sort === "oldest") {
    orderBy = { createdAt: "asc" };
  } else if (sort === "az") {
    orderBy = { name: "asc" };
  } else if (sort === "za") {
    orderBy = { name: "desc" };
  }

  const items = await prisma.watchItem.findMany({
    where,
    orderBy,
  });

  const serializedItems = items.map(serializeWatchItem);

  const wantToWatch = serializedItems.filter(i => i.status === "WANT_TO_WATCH");
  const watching = serializedItems.filter(i => i.status === "WATCHING");
  const finished = serializedItems.filter(i => i.status === "FINISHED");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Watchlist</h1>
          <p className="text-muted-foreground">
            {serializedItems.length} titles
            {filter === "favorites" && " • Favorites"}
            {filter === "active" && " • Currently Watching"}
            {filter === "completed" && " • Finished"}
            {filter === "movies" && " • Movies only"}
            {filter === "tv" && " • TV Shows only"}
          </p>
        </div>
        <div>
          <CreateWatchItemDialog />
        </div>
      </div>

      <Separator />

      {serializedItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-16 text-center bg-card/50">
          <Clapperboard className="h-10 w-10 text-indigo-400 stroke-1 mb-3 animate-pulse" />
          <h3 className="font-semibold text-lg">Your Watchlist is Empty</h3>
          <p className="text-sm text-muted-foreground max-w-sm mt-1">
            {filter 
              ? "No items match your current filter. Try adjusting it." 
              : "Start adding movies and shows you want to watch! Track across Netflix, Shahid, Prime Video, and more."}
          </p>
        </div>
      ) : (
        <WatchListGrid wantToWatch={wantToWatch} watching={watching} finished={finished} />
      )}
    </div>
  );
}