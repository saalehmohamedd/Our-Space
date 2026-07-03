// src/app/(app)/wishlist/page.tsx

import React from "react";
import { prisma } from "@/lib/prisma";
import { Separator } from "@/components/ui/separator";
import { Gift } from "lucide-react";
import { WishlistCreationDialog } from "@/components/wishlist/wishlist-creation-dialog";
import { WishlistCard } from "@/components/wishlist/wishlist-card";

function serializeWishlistItem(item: any) {
  return {
    ...item,
    price: item.price?.toString() || null,
    createdAt: item.createdAt?.toISOString() || null,
    updatedAt: item.updatedAt?.toISOString() || null,
  };
}

export default async function WishlistPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; filter?: string }>;
}) {
  const { sort, filter } = await searchParams;

  const where: any = { isArchived: false };
  
  if (filter === "favorites") {
    where.isFavorite = true;
  } else if (filter === "active") {
    where.status = { in: ["WANT", "SAVING"] };
  } else if (filter === "completed") {
    where.status = "BOUGHT";
  }

  let orderBy: any = { createdAt: "desc" };
  
  if (sort === "oldest") {
    orderBy = { createdAt: "asc" };
  } else if (sort === "az") {
    orderBy = { name: "asc" };
  } else if (sort === "za") {
    orderBy = { name: "desc" };
  }

  const items = await prisma.wishlistItem.findMany({
    where,
    orderBy,
  });

  const serializedItems = items.map(serializeWishlistItem);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Wishlist</h1>
          <p className="text-muted-foreground">
            {serializedItems.length} items
            {filter === "favorites" && " • Favorites only"}
            {filter === "active" && " • Active items"}
            {filter === "completed" && " • Purchased items"}
          </p>
        </div>
        <div>
          <WishlistCreationDialog />
        </div>
      </div>

      <Separator />

      {serializedItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-16 text-center bg-card/50">
          <Gift className="h-10 w-10 text-indigo-400 stroke-1 mb-3 animate-pulse" />
          <h3 className="font-semibold text-lg">No items found</h3>
          <p className="text-sm text-muted-foreground max-w-sm mt-1">
            {filter 
              ? "Try changing your filters to see more items." 
              : "Start adding items to your wishlist!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {serializedItems.map((item) => (
            <WishlistCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}