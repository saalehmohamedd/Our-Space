// src/app/(app)/cards/page.tsx
import React from "react";
import { prisma } from "@/lib/prisma";
import { getCurrentUserOrThrow } from "@/lib/auth-guard";
import { Separator } from "@/components/ui/separator";
import { CardsClient } from "@/components/cards/cards-client";
import { serializeCard } from "@/lib/serialize";

export default async function CardsPage() {
  await getCurrentUserOrThrow();

  // Fetch ALL non-archived cards (shared wallet)
  const cards = await prisma.card.findMany({
    where: { isArchived: false },
    include: {
      transactions: {
        orderBy: { date: "desc" },
        take: 5,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const serializedCards = cards.map(serializeCard);
  
  const totalBalance = serializedCards.reduce(
    (sum, card) => sum + parseFloat(card.balance),
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shared Cards</h1>
          <p className="text-muted-foreground">
            {serializedCards.length} {serializedCards.length === 1 ? "card" : "cards"} • Total balance: ${totalBalance.toFixed(2)}
          </p>
        </div>
      </div>

      <Separator />

      <CardsClient cards={serializedCards} totalBalance={totalBalance} />
    </div>
  );
}