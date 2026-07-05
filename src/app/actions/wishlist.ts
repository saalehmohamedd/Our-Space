// src/app/actions/wishlist.ts

"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUserOrThrow } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";

interface UpdateWishlistInputs {
  name: string;
  price: string;
  link: string;
  notes: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "WANT" | "SAVING" | "BOUGHT";
}

export async function updateWishlistItemAction(
  id: string,
  data: UpdateWishlistInputs
) {
  try {
    await getCurrentUserOrThrow();

    const price = data.price ? parseFloat(data.price) : null;

    await prisma.wishlistItem.update({
      where: { id },
      data: {
        name: data.name,
        price: price,
        link: data.link || null,
        notes: data.notes || null,
        priority: data.priority,
        status: data.status,
      },
    });

    revalidatePath("/wishlist");
    revalidatePath("/dashboard");

    return { success: true, message: "Wishlist item updated! ✨" };
  } catch (error) {
    console.error("Update wishlist error:", error);
    throw new Error("Failed to update wishlist item");
  }
}

// src/app/actions/wishlist.ts - Update createWishlistItemAction

export async function createWishlistItemAction(data: {
  name: string;
  price?: string;
  link?: string;
  notes?: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status?: "WANT" | "SAVING" | "BOUGHT";
  cardId?: string | null;
}) {
  try {
    await getCurrentUserOrThrow();

    const price = data.price ? parseFloat(data.price) : null;

    const item = await prisma.wishlistItem.create({
      data: {
        name: data.name,
        price: price,
        link: data.link || null,
        notes: data.notes || null,
        priority: data.priority,
        status: data.status || "WANT",
        cardId: data.cardId || null,
      },
    });

    revalidatePath("/wishlist");
    revalidatePath("/dashboard");

    return { success: true, message: "Item added to wishlist! 🎁", id: item.id };
  } catch (error) {
    console.error("Create wishlist error:", error);
    throw new Error("Failed to add item to wishlist");
  }
}

export async function deleteWishlistItemAction(id: string) {
  try {
    await getCurrentUserOrThrow();

    await prisma.wishlistItem.delete({
      where: { id },
    });

    revalidatePath("/wishlist");
    revalidatePath("/dashboard");

    return { success: true, message: "Item removed from wishlist" };
  } catch (error) {
    console.error("Delete wishlist error:", error);
    throw new Error("Failed to delete wishlist item");
  }
}

export async function toggleWishlistStatusAction(
  id: string,
  currentStatus: "WANT" | "SAVING" | "BOUGHT"
) {
  try {
    await getCurrentUserOrThrow();

    const statusCycle = {
      WANT: "SAVING" as const,
      SAVING: "BOUGHT" as const,
      BOUGHT: "WANT" as const,
    };

    const newStatus = statusCycle[currentStatus];

    await prisma.wishlistItem.update({
      where: { id },
      data: { status: newStatus },
    });

    revalidatePath("/wishlist");
    revalidatePath("/dashboard");

    return { success: true, newStatus, message: `Status updated to ${newStatus}` };
  } catch (error) {
    console.error("Toggle status error:", error);
    throw new Error("Failed to update status");
  }
}

// 🌟 ADDED: Toggle favorite action
export async function toggleFavoriteWishlistAction(id: string, currentState: boolean) {
  try {
    await getCurrentUserOrThrow();

    await prisma.wishlistItem.update({
      where: { id },
      data: { isFavorite: !currentState },
    });

    revalidatePath("/wishlist");

    return { 
      success: true, 
      isFavorite: !currentState,
      message: currentState ? "Removed from favorites 💔" : "Added to favorites ❤️"
    };
  } catch (error) {
    console.error("Toggle favorite error:", error);
    throw new Error("Failed to update favorite status");
  }
}