import { Webhook } from "svix";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import type { WebhookEvent } from "@clerk/nextjs/server";

import { getAllowedPartnerRole } from "@/lib/clerk";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json(
      { error: "CLERK_WEBHOOK_SECRET is not configured" },
      { status: 500 },
    );
  }

  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "Missing Svix headers" }, { status: 400 });
  }

  const payload = await request.text();
  const webhook = new Webhook(webhookSecret);

  let event: WebhookEvent;

  try {
    event = webhook.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Handle both creation and updates (e.g. avatar changes via UserButton)
  if (event.type !== "user.created" && event.type !== "user.updated") {
    return NextResponse.json({ received: true });
  }

  const primaryEmail = event.data.email_addresses.find(
    (email) => email.id === event.data.primary_email_address_id,
  )?.email_address;

  if (!primaryEmail) {
    return NextResponse.json({ error: "Missing primary email" }, { status: 400 });
  }

  // On update, don't re-gate on getAllowedPartnerRole for existing rows —
  // only apply it for brand-new users. Otherwise an existing user whose
  // email somehow fails the role check would get silently skipped on update.
  if (event.type === "user.created") {
    const role = getAllowedPartnerRole(primaryEmail);
    if (!role) {
      return NextResponse.json({ received: true });
    }

    const name =
      [event.data.first_name, event.data.last_name].filter(Boolean).join(" ") ||
      primaryEmail;

    await prisma.user.upsert({
      where: { email: primaryEmail },
      update: {
        clerkId: event.data.id,
        role,
        name,
        avatarUrl: event.data.image_url,
      },
      create: {
        clerkId: event.data.id,
        role,
        name,
        email: primaryEmail,
        avatarUrl: event.data.image_url,
      },
    });
  } else {
    // user.updated: just sync profile fields for the existing row
    const name =
      [event.data.first_name, event.data.last_name].filter(Boolean).join(" ") ||
      primaryEmail;

    await prisma.user.updateMany({
      where: { clerkId: event.data.id },
      data: {
        name,
        avatarUrl: event.data.image_url,
      },
    });
  }

  return NextResponse.json({ received: true });
}