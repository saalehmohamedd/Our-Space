"use server";

import crypto from "crypto";
import { getCurrentUserOrThrow } from "@/lib/auth-guard";

export async function getCloudinarySignature() {
  // Lock down the signature endpoint to verified workspace users
  await getCurrentUserOrThrow();

  const timestamp = Math.round(new Date().getTime() / 1000);
  const folder = "relationship-capsule";
  const secret = process.env.CLOUDINARY_API_SECRET;

  if (!secret) {
    throw new Error("Server misconfiguration: Cloudinary secrets are missing.");
  }

  // Cloudinary signatures require parameters to be structured alphabetically
  const stringToSign = `folder=${folder}&timestamp=${timestamp}${secret}`;
  
  // Hash the signature parameter string using native Node crypto
  const signature = crypto.createHash("sha1").update(stringToSign).digest("hex");

  return {
    signature,
    timestamp,
    folder,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  };
}