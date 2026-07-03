// src/app/(app)/dates/page.tsx

import React from "react";
import { prisma } from "@/lib/prisma";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "lucide-react";
import { DateCreationDialog } from "@/components/dates/date-creation-dialog";
import { DateCard } from "@/components/dates/date-card";

function serializeDateItem(item: any) {
  return {
    ...item,
    cost: item.cost?.toString() || null,
    date: item.date?.toISOString() || null,
    createdAt: item.createdAt?.toISOString() || null,
    updatedAt: item.updatedAt?.toISOString() || null,
  };
}

export default async function DatesPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; filter?: string }>;
}) {
  const { sort, filter } = await searchParams;

  const where: any = { isArchived: false };
  
  if (filter === "favorites") {
    where.isFavorite = true;
  }

  let orderBy: any = { date: "desc" };
  
  if (sort === "oldest") {
    orderBy = { date: "asc" };
  } else if (sort === "az") {
    orderBy = { title: "asc" };
  } else if (sort === "za") {
    orderBy = { title: "desc" };
  }

  const items = await prisma.dateOuting.findMany({
    where,
    orderBy,
  });

  const serializedItems = items.map(serializeDateItem);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Date Night Ideas</h1>
          <p className="text-muted-foreground">
            {serializedItems.length} dates
            {filter === "favorites" && " • Favorites"}
          </p>
        </div>
        <div>
          <DateCreationDialog />
        </div>
      </div>

      <Separator />

      {serializedItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-16 text-center bg-card/50">
          <Calendar className="h-10 w-10 text-rose-400 stroke-1 mb-3 animate-pulse" />
          <h3 className="font-semibold text-lg">No date ideas found</h3>
          <p className="text-sm text-muted-foreground max-w-sm mt-1">
            {filter 
              ? "Try changing your filters." 
              : "Start planning romantic dates and adventures!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {serializedItems.map((item) => (
            <DateCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}