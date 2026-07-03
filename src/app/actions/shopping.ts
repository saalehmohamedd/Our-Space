// src/app/actions/shopping.ts
"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUserOrThrow } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";

export async function createShoppingItemAction(data: {
  name: string;
  category?: string; 
  quantity: number;
}) {
  try {
    await getCurrentUserOrThrow();

    await prisma.shoppingListItem.create({
      data: {
        name: data.name,
        category: data.category || null, // Convert undefined to null for Prisma
        quantity: data.quantity || 1,
      },
    });

    revalidatePath("/shopping");
    revalidatePath("/dashboard");
    
    return { success: true, message: "Item added to shopping list 🛒" };
  } catch (error) {
    console.error("Create shopping item error:", error);
    throw new Error("Failed to add shopping item");
  }
}

export async function toggleShoppingItemAction(id: string, currentState: boolean) {
  await getCurrentUserOrThrow();

  await prisma.shoppingListItem.update({
    where: { id },
    data: { checked: !currentState },
  });

  revalidatePath("/shopping");
}

export async function updateShoppingItemAction(
  id: string,
  data: {
    name: string;
    category?: string;
    quantity: number;
  }
) {
  await getCurrentUserOrThrow();

  await prisma.shoppingListItem.update({
    where: { id },
    data: {
      name: data.name,
      category: data.category || null,
      quantity: data.quantity,
    },
  });

  revalidatePath("/shopping");
}

export async function deleteShoppingItemAction(id: string) {
  await getCurrentUserOrThrow();

  await prisma.shoppingListItem.delete({
    where: { id },
  });

  revalidatePath("/shopping");
}

export async function clearCheckedItemsAction() {
  await getCurrentUserOrThrow();

  await prisma.shoppingListItem.deleteMany({
    where: { checked: true },
  });

  revalidatePath("/shopping");
}