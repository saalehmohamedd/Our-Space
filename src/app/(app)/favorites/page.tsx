// src/app/(app)/favorites/page.tsx

import React from "react";
import { prisma } from "@/lib/prisma";
import { getCurrentUserOrThrow } from "@/lib/auth-guard";
import { Separator } from "@/components/ui/separator";
import { Heart } from "lucide-react";
import { FavoritesGrid } from "@/components/favorites/favorites-grid";

function serializeItem(item: any) {
  return {
    ...item,
    date: item.date?.toISOString?.() || item.date,
    scheduledAt: item.scheduledAt?.toISOString?.() || item.scheduledAt,
    createdAt: item.createdAt?.toISOString?.() || item.createdAt,
    updatedAt: item.updatedAt?.toISOString?.() || item.updatedAt,
    price: item.price?.toString?.() || item.price,
    costEstimate: item.costEstimate?.toString?.() || item.costEstimate,
    cost: item.cost?.toString?.() || item.cost,
    estimatedBudget: item.estimatedBudget?.toString?.() || item.estimatedBudget,
    images: item.images?.map?.((img: any) => ({
      ...img,
      createdAt: img.createdAt?.toISOString?.() || img.createdAt,
    })) || [],
    songs: item.songs?.map?.((song: any) => ({
      ...song,
      createdAt: song.createdAt?.toISOString?.() || song.createdAt,
    })) || [],
    sender: item.sender ? {
      id: item.sender.id,
      name: item.sender.name,
      avatarUrl: item.sender.avatarUrl,
    } : null,
    person: item.person ? {
      id: item.person.id,
      name: item.person.name,
      avatarUrl: item.person.avatarUrl,
    } : null,
    createdBy: item.createdBy ? {
      id: item.createdBy.id,
      name: item.createdBy.name,
      avatarUrl: item.createdBy.avatarUrl,
    } : null,
  };
}

type CategoryFilter = "all" | "memory" | "wishlist" | "place" | "date" | "letter" | "song" | "watch";

export default async function FavoritesPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; filter?: string; category?: string }>;
}) {
  const user = await getCurrentUserOrThrow();
  const { sort, filter, category } = await searchParams;

  const categoryFilter = (category as CategoryFilter) || "all";

  // Always fetch ALL favorites for counts
  const [
    allFavoriteMemories,
    allFavoriteWishlistItems,
    allFavoritePlaces,
    allFavoriteDateOutings,
    allFavoriteLetters,
    allFavoriteSongs,
    allFavoriteWatchItems,
  ] = await Promise.all([
    prisma.memory.count({ where: { isFavorite: true, isArchived: false } }),
    prisma.wishlistItem.count({ where: { isFavorite: true, isArchived: false } }),
    prisma.place.count({ where: { isFavorite: true, isArchived: false } }),
    prisma.dateOuting.count({ where: { isFavorite: true, isArchived: false } }),
    prisma.loveLetter.count(),
    prisma.song.count({ where: { isFavorite: true } }),
    prisma.watchItem.count({ where: { isFavorite: true } }),
  ]);

  // Count by category (always accurate)
  const categoryCounts = {
    memory: allFavoriteMemories,
    wishlist: allFavoriteWishlistItems,
    place: allFavoritePlaces,
    date: allFavoriteDateOutings,
    letter: allFavoriteLetters,
    song: allFavoriteSongs,
    watch: allFavoriteWatchItems,
  };

  // Fetch only the filtered category data
  const fetchPromises = [];

  if (categoryFilter === "all" || categoryFilter === "memory") {
    fetchPromises.push(
      prisma.memory.findMany({
        where: { isFavorite: true, isArchived: false },
        include: { images: true },
      })
    );
  } else {
    fetchPromises.push(Promise.resolve([]));
  }

  if (categoryFilter === "all" || categoryFilter === "wishlist") {
    fetchPromises.push(
      prisma.wishlistItem.findMany({
        where: { isFavorite: true, isArchived: false },
      })
    );
  } else {
    fetchPromises.push(Promise.resolve([]));
  }

  if (categoryFilter === "all" || categoryFilter === "place") {
    fetchPromises.push(
      prisma.place.findMany({
        where: { isFavorite: true, isArchived: false },
      })
    );
  } else {
    fetchPromises.push(Promise.resolve([]));
  }

  if (categoryFilter === "all" || categoryFilter === "date") {
    fetchPromises.push(
      prisma.dateOuting.findMany({
        where: { isFavorite: true, isArchived: false },
      })
    );
  } else {
    fetchPromises.push(Promise.resolve([]));
  }

  if (categoryFilter === "all" || categoryFilter === "letter") {
    fetchPromises.push(
      prisma.loveLetter.findMany({
        include: {
          sender: { select: { id: true, name: true, avatarUrl: true } },
        },
      })
    );
  } else {
    fetchPromises.push(Promise.resolve([]));
  }

  if (categoryFilter === "all" || categoryFilter === "song") {
    fetchPromises.push(
      prisma.song.findMany({
        where: { isFavorite: true },
        include: {
          playlist: { select: { id: true, name: true } },
        },
      })
    );
  } else {
    fetchPromises.push(Promise.resolve([]));
  }

  if (categoryFilter === "all" || categoryFilter === "watch") {
    fetchPromises.push(
      prisma.watchItem.findMany({
        where: { isFavorite: true },
      })
    );
  } else {
    fetchPromises.push(Promise.resolve([]));
  }

  const [
    favoriteMemories,
    favoriteWishlistItems,
    favoritePlaces,
    favoriteDateOutings,
    favoriteLetters,
    favoriteSongs,
    favoriteWatchItems,
  ] = await Promise.all(fetchPromises);

  // Combine filtered favorites
  const allFavorites = [
    ...favoriteMemories.map(item => ({ ...serializeItem(item), category: "memory" as const })),
    ...favoriteWishlistItems.map(item => ({ ...serializeItem(item), category: "wishlist" as const })),
    ...favoritePlaces.map(item => ({ ...serializeItem(item), category: "place" as const })),
    ...favoriteDateOutings.map(item => ({ ...serializeItem(item), category: "date" as const })),
    ...favoriteLetters.map(item => ({ ...serializeItem(item), category: "letter" as const })),
    ...favoriteSongs.map(item => ({ ...serializeItem(item), category: "song" as const })),
    ...favoriteWatchItems.map(item => ({ ...serializeItem(item), category: "watch" as const })),
  ];

  // Apply additional filters
  let filteredFavorites = allFavorites;
  if (filter === "with-images") {
    filteredFavorites = allFavorites.filter(item => 
      (item.images && item.images.length > 0) || 
      item.albumCoverUrl || 
      item.posterUrl
    );
  } else if (filter === "with-notes") {
    filteredFavorites = allFavorites.filter(item => 
      item.description || item.notes || item.content
    );
  }

  // Sort
  if (sort === "oldest") {
    filteredFavorites.sort((a, b) => {
      const dateA = new Date(a.date || a.createdAt || a.scheduledAt || 0).getTime();
      const dateB = new Date(b.date || b.createdAt || b.scheduledAt || 0).getTime();
      return dateA - dateB;
    });
  } else if (sort === "az") {
    filteredFavorites.sort((a, b) => {
      const nameA = (a.title || a.name || a.eventName || "").toLowerCase();
      const nameB = (b.title || b.name || b.eventName || "").toLowerCase();
      return nameA.localeCompare(nameB);
    });
  } else if (sort === "za") {
    filteredFavorites.sort((a, b) => {
      const nameA = (a.title || a.name || a.eventName || "").toLowerCase();
      const nameB = (b.title || b.name || b.eventName || "").toLowerCase();
      return nameB.localeCompare(nameA);
    });
  } else {
    // Default: newest first
    filteredFavorites.sort((a, b) => {
      const dateA = new Date(a.date || a.createdAt || a.scheduledAt || 0).getTime();
      const dateB = new Date(b.date || b.createdAt || b.scheduledAt || 0).getTime();
      return dateB - dateA;
    });
  }

  const totalFavorites = Object.values(categoryCounts).reduce((sum, count) => sum + count, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Heart className="h-7 w-7 text-rose-500 fill-current" />
            Favorites
          </h1>
          <p className="text-muted-foreground">
            {totalFavorites} total favorites • Showing {filteredFavorites.length}
            {categoryFilter !== "all" && ` • ${categoryFilter} only`}
            {filter === "with-images" && " • With images"}
            {filter === "with-notes" && " • With notes"}
            {sort === "oldest" && " • Oldest first"}
            {sort === "az" && " • A-Z"}
            {sort === "za" && " • Z-A"}
          </p>
        </div>
      </div>

      {/* Category Quick Stats - Always shows all counts */}
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
        {Object.entries(categoryCounts).map(([cat, count]) => {
          const isActive = categoryFilter === cat;
          return (
            <a
              key={cat}
              href={`/favorites${isActive ? "" : `?category=${cat}`}`}
              className={`p-2 rounded-lg text-center transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted/30 hover:bg-muted/50"
              }`}
            >
              <p className="text-lg font-bold">{count}</p>
              <p className="text-[10px] uppercase tracking-wider">{cat}</p>
            </a>
          );
        })}
      </div>

      <Separator />

      {filteredFavorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-16 text-center bg-card/50">
          <Heart className="h-10 w-10 text-rose-300 stroke-1 mb-3" />
          <h3 className="font-semibold text-lg">No Favorites Found</h3>
          <p className="text-sm text-muted-foreground max-w-sm mt-1">
            {categoryFilter !== "all"
              ? `No favorites in ${categoryFilter}. Try a different category.`
              : filter
              ? "No favorites match your filter. Try adjusting it."
              : "Start adding items to your favorites by clicking the heart icon on memories, wishlist items, places, and more!"}
          </p>
        </div>
      ) : (
        <FavoritesGrid items={filteredFavorites} />
      )}
    </div>
  );
}