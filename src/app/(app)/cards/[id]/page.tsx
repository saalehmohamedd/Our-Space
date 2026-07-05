// src/app/(app)/cards/[id]/page.tsx
import React from "react";
import { prisma } from "@/lib/prisma";
import { getCurrentUserOrThrow } from "@/lib/auth-guard";
import { notFound } from "next/navigation";
import { CardDetailClient } from "@/components/cards/card-detail-client";
import { serializeCard } from "@/lib/serialize";

export default async function CardDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await getCurrentUserOrThrow();

  const card = await prisma.card.findUnique({
    where: { id },
    include: {
      transactions: {
        orderBy: { date: "desc" },
      },
    },
  });

  if (!card) {
    notFound();
  }

  const serializedCard = serializeCard(card);

  return (
    <div className="space-y-6">
      <CardDetailClient card={serializedCard} />
    </div>
  );
}