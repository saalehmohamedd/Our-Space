// src/app/(app)/shopping/page.tsx

import React from "react";
import { prisma } from "@/lib/prisma";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag } from "lucide-react";
import { ShoppingList } from "@/components/shopping/shopping-list";
import { AddShoppingItem } from "@/components/shopping/add-shopping-item";

export default async function ShoppingPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; filter?: string }>;
}) {
  const { sort, filter } = await searchParams;

  // Build where clause
  const where: any = {};
  
  if (filter === "active") {
    where.checked = false;
  } else if (filter === "completed") {
    where.checked = true;
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

  const items = await prisma.shoppingListItem.findMany({
    where,
    orderBy,
  });

  const uncheckedCount = items.filter(item => !item.checked).length;
  const checkedCount = items.filter(item => item.checked).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shopping List</h1>
          <p className="text-muted-foreground">
            {uncheckedCount} items to buy • {checkedCount} in cart
            {filter === "active" && " • Active items"}
            {filter === "completed" && " • Checked items"}
          </p>
        </div>
        <div>
          <AddShoppingItem />
        </div>
      </div>

      <Separator />

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-16 text-center bg-card/50">
          <ShoppingBag className="h-10 w-10 text-emerald-400 stroke-1 mb-3 animate-pulse" />
          <h3 className="font-semibold text-lg">
            {filter ? "No items match your filter" : "Your shopping list is empty"}
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm mt-1">
            {filter 
              ? "Try changing your filters to see more items." 
              : "Start adding items you need to buy together!"}
          </p>
        </div>
      ) : (
        <ShoppingList items={items} />
      )}
    </div>
  );
}