// src/app/actions/upload.ts
"use server";

import { v2 as cloudinary } from "cloudinary";
import { getCurrentUserOrThrow } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImageAction(formData: FormData) {
  // Authenticate user
  await getCurrentUserOrThrow();

  const files = formData.getAll("file") as File[];
  const memoryId = formData.get("memoryId") as string;

  if (!files || files.length === 0) {
    throw new Error("No files provided");
  }

  const uploadedImages = [];

  for (const file of files) {
    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");
    const dataURI = `data:${file.type};base64,${base64}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "memories",
      resource_type: "auto",
    });

    // If memoryId is provided, save images to database immediately
    if (memoryId) {
      const image = await prisma.image.create({
        data: {
          url: result.secure_url,
          publicId: result.public_id,
          entityType: "MEMORY",
          entityId: memoryId,
          memoryId: memoryId,
        },
      });

      uploadedImages.push({
        id: image.id,  // Return the database id
        url: image.url,
        publicId: image.publicId,
      });
    } else {
      // Return with temporary id if no memoryId
      uploadedImages.push({
        id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        url: result.secure_url,
        publicId: result.public_id,
      });
    }
  }

  return uploadedImages;
}

export async function deleteImageAction(publicId: string) {
  // Authenticate user
  await getCurrentUserOrThrow();

  if (!publicId) {
    throw new Error("No publicId provided");
  }

  try {
    // Delete from Cloudinary
    await cloudinary.uploader.destroy(publicId);

    // Delete from database
    await prisma.image.deleteMany({
      where: { publicId },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting image:", error);
    throw new Error("Failed to delete image");
  }
}