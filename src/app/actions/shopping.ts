// src/app/actions/shopping.ts
"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUserOrThrow } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";

export async function createShoppingItemAction(data: {
  name: string;
  category?: string;
  quantity: number;
  cost?: number;
  cardId?: string;
}) {
  try {
    await getCurrentUserOrThrow();
    await prisma.shoppingListItem.create({
      data: {
        name: data.name,
        category: data.category || null,
        quantity: data.quantity || 1,
        cost: data.cost || null,
        cardId: data.cardId || null,
      },
    });
    revalidatePath("/shopping");
    return { success: true };
  } catch (error) {
    throw new Error("Failed to add item");
  }
}

export async function updateShoppingItemAction(
  id: string,
  data: {
    name: string;
    category?: string;
    quantity: number;
    cost?: number;
    cardId?: string;
  }
) {
  try {
    await getCurrentUserOrThrow();
    await prisma.shoppingListItem.update({
      where: { id },
      data: {
        name: data.name,
        category: data.category || null,
        quantity: data.quantity,
        cost: data.cost || null,
        cardId: data.cardId || null,
      },
    });
    revalidatePath("/shopping");
    return { success: true };
  } catch (error) {
    throw new Error("Failed to update item");
  }
}

export async function toggleShoppingItemAction(id: string, currentState: boolean) {
  try {
    await getCurrentUserOrThrow();
    await prisma.shoppingListItem.update({
      where: { id },
      data: { checked: !currentState },
    });
    revalidatePath("/shopping");
    return { success: true };
  } catch (error) {
    throw new Error("Failed to update item");
  }
}

export async function deleteShoppingItemAction(id: string) {
  try {
    await getCurrentUserOrThrow();
    await prisma.shoppingListItem.delete({ where: { id } });
    revalidatePath("/shopping");
    return { success: true };
  } catch (error) {
    throw new Error("Failed to delete item");
  }
}

export async function clearCheckedItemsAction() {
  try {
    await getCurrentUserOrThrow();
    await prisma.shoppingListItem.deleteMany({ where: { checked: true } });
    revalidatePath("/shopping");
    return { success: true };
  } catch (error) {
    throw new Error("Failed to clear items");
  }
}