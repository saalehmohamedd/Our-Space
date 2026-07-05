// src/app/(app)/shopping/page.tsx
import React from "react";
import { prisma } from "@/lib/prisma";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag } from "lucide-react";
import { ShoppingList } from "@/components/shopping/shopping-list";
import { AddShoppingItem } from "@/components/shopping/add-shopping-item";

function serializeItem(item: any) {
  return {
    id: item.id,
    name: item.name,
    category: item.category,
    quantity: item.quantity,
    checked: item.checked,
    cost: item.cost?.toString() || null,
    cardId: item.cardId || null,
    createdAt: item.createdAt?.toISOString() || null,
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

export default async function ShoppingPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; filter?: string }>;
}) {
  const { sort, filter } = await searchParams;

  const where: any = {};
  if (filter === "active") where.checked = false;
  else if (filter === "completed") where.checked = true;

  let orderBy: any = { createdAt: "desc" };
  if (sort === "oldest") orderBy = { createdAt: "asc" };
  else if (sort === "az") orderBy = { name: "asc" };
  else if (sort === "za") orderBy = { name: "desc" };

  // Fetch ALL cards (shared wallet)
  const [items, cards] = await Promise.all([
    prisma.shoppingListItem.findMany({ where, orderBy }),
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

  const serializedItems = items.map(serializeItem);
  const serializedCards = cards.map(serializeCard);

  const uncheckedCount = serializedItems.filter(item => !item.checked).length;
  const checkedCount = serializedItems.filter(item => item.checked).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shopping List</h1>
          <p className="text-muted-foreground">
            {uncheckedCount} items to buy • {checkedCount} in cart
          </p>
        </div>
        <div>
          <AddShoppingItem cards={serializedCards} />
        </div>
      </div>

      <Separator />

      {serializedItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-16 text-center bg-card/50">
          <ShoppingBag className="h-10 w-10 text-emerald-400 stroke-1 mb-3 animate-pulse" />
          <h3 className="font-semibold text-lg">Your shopping list is empty</h3>
          <p className="text-sm text-muted-foreground max-w-sm mt-1">
            Start adding items you need to buy together!
          </p>
        </div>
      ) : (
        <ShoppingList items={serializedItems} cards={serializedCards} />
      )}
    </div>
  );
}