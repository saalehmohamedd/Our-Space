// src/app/(app)/wishlist/page.tsx
import React from "react";
import { prisma } from "@/lib/prisma";
import { getCurrentUserOrThrow } from "@/lib/auth-guard";
import { Separator } from "@/components/ui/separator";
import { Gift } from "lucide-react";
import { WishlistCreationDialog } from "@/components/wishlist/wishlist-creation-dialog";
import { WishlistCard } from "@/components/wishlist/wishlist-card";

function serializeWishlistItem(item: any) {
  return {
    id: item.id,
    name: item.name,
    price: item.price?.toString() || null,
    link: item.link,
    notes: item.notes,
    priority: item.priority,
    status: item.status,
    isFavorite: item.isFavorite,
    isArchived: item.isArchived,
    cardId: item.cardId,
    createdAt: item.createdAt?.toISOString() || null,
    updatedAt: item.updatedAt?.toISOString() || null,
  };
}

function serializeCard(card: any) {
  return {
    id: card.id,
    nickname: card.nickname,
    brand: card.brand,
    last4: card.last4,
    colorTheme: card.colorTheme,
    balance: card.balance?.toString() || "0",
  };
}

export default async function WishlistPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; filter?: string }>;
}) {
  const user = await getCurrentUserOrThrow();
  const { sort, filter } = await searchParams;

  const where: any = { isArchived: false };
  if (filter === "favorites") where.isFavorite = true;
  else if (filter === "active") where.status = { in: ["WANT", "SAVING"] };
  else if (filter === "completed") where.status = "BOUGHT";

  let orderBy: any = { createdAt: "desc" };
  if (sort === "oldest") orderBy = { createdAt: "asc" };
  else if (sort === "az") orderBy = { name: "asc" };
  else if (sort === "za") orderBy = { name: "desc" };

  // Fetch ALL cards (shared wallet)
  const [items, cards] = await Promise.all([
    prisma.wishlistItem.findMany({ where, orderBy }),
    prisma.card.findMany({
      where: { isArchived: false },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        nickname: true,
        brand: true,
        last4: true,
        colorTheme: true,
        balance: true,
      },
    }),
  ]);

  const serializedItems = items.map(serializeWishlistItem);
  const serializedCards = cards.map(serializeCard);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Wishlist</h1>
          <p className="text-muted-foreground">
            {serializedItems.length} items
          </p>
        </div>
        <div>
          <WishlistCreationDialog cards={serializedCards} />
        </div>
      </div>

      <Separator />

      {serializedItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-16 text-center bg-card/50">
          <Gift className="h-10 w-10 text-indigo-400 stroke-1 mb-3 animate-pulse" />
          <h3 className="font-semibold text-lg">No items found</h3>
          <p className="text-sm text-muted-foreground max-w-sm mt-1">
            Start adding items to your wishlist!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {serializedItems.map((item) => (
            <WishlistCard key={item.id} item={item} cards={serializedCards} />
          ))}
        </div>
      )}
    </div>
  );
}