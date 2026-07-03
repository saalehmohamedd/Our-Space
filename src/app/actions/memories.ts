// src/app/actions/memories.ts
"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUserOrThrow } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";

interface ImageData {
  id?: string;
  url: string;
  publicId?: string;
}

export async function updateMemoryAction(
  id: string,
  data: {
    title: string;
    description: string;
    date: string;
    images?: ImageData[];
  }
) {
  try {
    await getCurrentUserOrThrow();

    const existingMemory = await prisma.memory.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!existingMemory) {
      throw new Error("Memory not found");
    }

    if (data.images !== undefined) {
      const existingImageIds = existingMemory.images.map((img) => img.id);
      const updatedImageIds = data.images
        .filter((img) => img.id)
        .map((img) => img.id as string);
      const imagesToDelete = existingImageIds.filter(
        (existingId) => !updatedImageIds.includes(existingId)
      );

      if (imagesToDelete.length > 0) {
        await prisma.image.deleteMany({
          where: { id: { in: imagesToDelete } },
        });
      }

      const newImages = data.images.filter((img) => !img.id);
      if (newImages.length > 0) {
        // Fix: Use create instead of createMany for more control, or ensure publicId is always a string
        for (const img of newImages) {
          await prisma.image.create({
            data: {
              url: img.url,
              publicId: img.publicId || `generated-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              entityType: "MEMORY",
              entityId: id,
              memoryId: id,
            },
          });
        }
      }
    }

    await prisma.memory.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        date: new Date(data.date),
      },
    });

    revalidatePath("/memories");
    revalidatePath("/dashboard");
    
    return { success: true, message: "Memory updated successfully! ✨" };
  } catch (error) {
    console.error("Update memory error:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to update memory");
  }
}

export async function createMemoryAction(data: {
  title: string;
  description: string;
  date: string;
  url: string;
  publicId: string;
}) {
  try {
    await getCurrentUserOrThrow();
    
    await prisma.memory.create({
      data: {
        title: data.title,
        description: data.description,
        date: new Date(data.date),
        isArchived: false,
        isFavorite: false,
        images: {
          create: {
            url: data.url,
            publicId: data.publicId,
            entityType: "MEMORY",
            entityId: "CONNECTED",
          },
        },
      },
    });

    revalidatePath("/memories");
    revalidatePath("/dashboard");
    
    return { success: true, message: "Memory created successfully! 📸" };
  } catch (error) {
    console.error("Create memory error:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to create memory");
  }
}

export async function toggleFavoriteMemory(id: string, currentState: boolean) {
  try {
    await getCurrentUserOrThrow();

    await prisma.memory.update({
      where: { id },
      data: { isFavorite: !currentState },
    });

    revalidatePath("/memories");
    
    return { 
      success: true, 
      message: currentState ? "Removed from favorites 💔" : "Added to favorites ❤️",
      isFavorite: !currentState 
    };
  } catch (error) {
    console.error("Toggle favorite error:", error);
    throw new Error("Failed to update favorite status");
  }
}

export async function archiveMemoryAction(id: string) {
  try {
    await getCurrentUserOrThrow();

    await prisma.memory.update({
      where: { id },
      data: { isArchived: true },
    });

    revalidatePath("/memories");
    revalidatePath("/dashboard");
    
    return { success: true, message: "Memory archived successfully 📦" };
  } catch (error) {
    console.error("Archive memory error:", error);
    throw new Error("Failed to archive memory");
  }
}