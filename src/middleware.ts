import { clerkMiddleware, clerkClient, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/not-authorized",
  "/api/webhooks/clerk",
]);

const allowedEmails = [
  process.env.ALLOWED_EMAIL_A?.toLowerCase(),
  process.env.ALLOWED_EMAIL_B?.toLowerCase(),
].filter(Boolean);

export default clerkMiddleware(async (auth, request) => {
  if (isPublicRoute(request)) {
    return NextResponse.next();
  }

  const { userId } = await auth.protect();

  if (allowedEmails.length !== 2) {
    return NextResponse.redirect(new URL("/not-authorized", request.url));
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const primaryEmail = user.emailAddresses
    .find((email) => email.id === user.primaryEmailAddressId)
    ?.emailAddress.toLowerCase();

  if (!primaryEmail || !allowedEmails.includes(primaryEmail)) {
    return NextResponse.redirect(new URL("/not-authorized", request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!$|sign-in|not-authorized|api/webhooks/clerk|_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ico|ttf|woff2?|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
