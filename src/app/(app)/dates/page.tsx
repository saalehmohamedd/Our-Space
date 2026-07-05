// src/app/(app)/dates/page.tsx
import React from "react";
import { prisma } from "@/lib/prisma";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "lucide-react";
import { DateCreationDialog } from "@/components/dates/date-creation-dialog";
import { DateCard } from "@/components/dates/date-card";

function serializeDateItem(item: any) {
  return {
    id: item.id,
    title: item.title,
    date: item.date?.toISOString?.() || item.date,
    location: item.location,
    description: item.description,
    rating: item.rating,
    cost: item.cost?.toString?.() || null,
    notes: item.notes,
    tags: item.tags,
    isFavorite: item.isFavorite,
    isArchived: item.isArchived,
    cardId: item.cardId,
    createdAt: item.createdAt?.toISOString?.() || null,
    updatedAt: item.updatedAt?.toISOString?.() || null,
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

export default async function DatesPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; filter?: string }>;
}) {
  const { sort, filter } = await searchParams;

  const where: any = { isArchived: false };
  if (filter === "favorites") where.isFavorite = true;

  let orderBy: any = { date: "desc" };
  if (sort === "oldest") orderBy = { date: "asc" };
  else if (sort === "az") orderBy = { title: "asc" };
  else if (sort === "za") orderBy = { title: "desc" };

  // Fetch ALL cards (shared wallet)
  const [items, cards] = await Promise.all([
    prisma.dateOuting.findMany({ where, orderBy }),
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

  const serializedItems = items.map(serializeDateItem);
  const serializedCards = cards.map(serializeCard);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Date Night Ideas</h1>
          <p className="text-muted-foreground">
            {serializedItems.length} dates
          </p>
        </div>
        <div>
          <DateCreationDialog cards={serializedCards} />
        </div>
      </div>

      <Separator />

      {serializedItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-16 text-center bg-card/50">
          <Calendar className="h-10 w-10 text-rose-400 stroke-1 mb-3 animate-pulse" />
          <h3 className="font-semibold text-lg">No date ideas found</h3>
          <p className="text-sm text-muted-foreground max-w-sm mt-1">
            Start planning romantic dates and adventures!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {serializedItems.map((item) => (
            <DateCard key={item.id} item={item} cards={serializedCards} />
          ))}
        </div>
      )}
    </div>
  );
}