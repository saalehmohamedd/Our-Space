// src/app/api/cloudinary/sign/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import { getCurrentUserOrThrow } from "@/lib/auth-guard";

export async function GET() {
  try {
    await getCurrentUserOrThrow();

    const timestamp = Math.round(Date.now() / 1000);
    const folder = "our-space";
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!apiSecret) {
      return NextResponse.json(
        { error: "Cloudinary is not configured" },
        { status: 500 }
      );
    }

    const stringToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto
      .createHash("sha1")
      .update(stringToSign)
      .digest("hex");

    return NextResponse.json({
      timestamp,
      folder,
      signature,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    });
  } catch (error) {
    console.error("Cloudinary sign error:", error);
    return NextResponse.json(
      { error: "Failed to generate signature" },
      { status: 500 }
    );
  }
}