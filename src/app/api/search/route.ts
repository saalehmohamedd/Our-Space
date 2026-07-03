// src/app/api/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserOrThrow } from "@/lib/auth-guard";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUserOrThrow();
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q")?.toLowerCase() || "";

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const results: any[] = [];

    // Search Memories
    const memories = await prisma.memory.findMany({
      where: {
        isArchived: false,
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 3,
      select: { id: true, title: true, description: true },
    });

    memories.forEach((m) => {
      results.push({
        id: m.id,
        title: m.title,
        subtitle: m.description?.substring(0, 100),
        type: "memory",
        href: `/memories`,
        icon: "❤️",
        color: "text-rose-500",
      });
    });

    // Search Wishlist
    const wishlist = await prisma.wishlistItem.findMany({
      where: {
        isArchived: false,
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { notes: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 3,
      select: { id: true, name: true, notes: true },
    });

    wishlist.forEach((w) => {
      results.push({
        id: w.id,
        title: w.name,
        subtitle: w.notes?.substring(0, 100),
        type: "wishlist",
        href: `/wishlist`,
        icon: "🎁",
        color: "text-indigo-500",
      });
    });

    // Search Shopping List
    const shopping = await prisma.shoppingListItem.findMany({
      where: {
        name: { contains: query, mode: "insensitive" },
      },
      take: 3,
      select: { id: true, name: true, category: true },
    });

    shopping.forEach((s) => {
      results.push({
        id: s.id,
        title: s.name,
        subtitle: s.category,
        type: "shopping",
        href: `/shopping`,
        icon: "🛒",
        color: "text-emerald-500",
      });
    });

    // Search Places
    const places = await prisma.place.findMany({
      where: {
        isArchived: false,
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { city: { contains: query, mode: "insensitive" } },
          { country: { contains: query, mode: "insensitive" } },
          { notes: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 3,
      select: { id: true, name: true, city: true, country: true },
    });

    places.forEach((p) => {
      results.push({
        id: p.id,
        title: p.name || p.city || "Unnamed Place",
        subtitle: [p.city, p.country].filter(Boolean).join(", "),
        type: "place",
        href: `/travil-places`,
        icon: "📍",
        color: "text-emerald-500",
      });
    });

    // Search Date Outings
    const dates = await prisma.dateOuting.findMany({
      where: {
        isArchived: false,
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { location: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 3,
      select: { id: true, title: true, location: true },
    });

    dates.forEach((d) => {
      results.push({
        id: d.id,
        title: d.title,
        subtitle: d.location,
        type: "date",
        href: `/dates`,
        icon: "💝",
        color: "text-rose-500",
      });
    });

    // Search Love Letters
    const letters = await prisma.loveLetter.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { content: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 3,
      select: { id: true, title: true, content: true },
    });

    letters.forEach((l) => {
      results.push({
        id: l.id,
        title: l.title,
        subtitle: l.content?.substring(0, 100),
        type: "letter",
        href: `/letters`,
        icon: "💌",
        color: "text-rose-500",
      });
    });

    // Search Private Notes
    const notes = await prisma.privateNote.findMany({
      where: {
        ownerId: user.id,
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { content: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 3,
      select: { id: true, title: true, content: true },
    });

    notes.forEach((n) => {
      results.push({
        id: n.id,
        title: n.title,
        subtitle: n.content?.substring(0, 100),
        type: "note",
        href: `/notes`,
        icon: "📝",
        color: "text-amber-500",
      });
    });

    // Search Songs
    const songs = await prisma.song.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { artist: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 3,
      select: { id: true, title: true, artist: true, playlistId: true },
    });

    songs.forEach((s) => {
      results.push({
        id: s.id,
        title: s.title,
        subtitle: s.artist,
        type: "song",
        href: `/playlists`,
        icon: "🎵",
        color: "text-violet-500",
      });
    });

    // Search Watchlist
    const watchlist = await prisma.watchItem.findMany({
      where: {
        name: { contains: query, mode: "insensitive" },
      },
      take: 3,
      select: { id: true, name: true, streamingPlatform: true },
    });

    watchlist.forEach((w) => {
      results.push({
        id: w.id,
        title: w.name,
        subtitle: w.streamingPlatform,
        type: "watch",
        href: `/watchlist`,
        icon: "🎬",
        color: "text-indigo-500",
      });
    });

    // Search Reminders
    const reminders = await prisma.reminder.findMany({
      where: {
        OR: [
          { eventName: { contains: query, mode: "insensitive" } },
          { notes: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 3,
      select: { id: true, eventName: true, notes: true },
    });

    reminders.forEach((r) => {
      results.push({
        id: r.id,
        title: r.eventName,
        subtitle: r.notes?.substring(0, 100),
        type: "reminder",
        href: `/reminders`,
        icon: "🔔",
        color: "text-amber-500",
      });
    });

    // Search Achievements
    const achievements = await prisma.achievement.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 3,
      select: { id: true, title: true, description: true },
    });

    achievements.forEach((a) => {
      results.push({
        id: a.id,
        title: a.title,
        subtitle: a.description?.substring(0, 100),
        type: "achievement",
        href: `/achievements`,
        icon: "🏆",
        color: "text-amber-500",
      });
    });

    return NextResponse.json({ results: results.slice(0, 10) });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ results: [], error: "Search failed" }, { status: 500 });
  }
}