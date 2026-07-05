// src/app/(app)/cards/[id]/page.tsx

import React from "react";
import { prisma } from "@/lib/prisma";
import { getCurrentUserOrThrow } from "@/lib/auth-guard";
import { notFound } from "next/navigation";
import { CardDetailClient } from "@/components/cards/card-detail-client";

export default async function CardDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUserOrThrow();

  const card = await prisma.card.findUnique({
    where: { id },
    include: {
      transactions: {
        orderBy: { date: "desc" },
      },
    },
  });

  if (!card || card.ownerId !== user.id) {
    notFound();
  }

  // Foolproof serialization: This automatically converts ALL nested Decimals 
  // and Dates into plain strings, completely bypassing the error without 
  // needing manual mapping functions.
  const serializedCard = JSON.parse(JSON.stringify(card));

  return (
    <div className="space-y-6">
      <CardDetailClient card={serializedCard} />
    </div>
  );
}