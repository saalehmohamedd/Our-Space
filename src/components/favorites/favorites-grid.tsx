// src/components/favorites/favorites-grid.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Camera,
  Gift,
  MapPin,
  Calendar,
  Mail,
  Music2,
  Tv,
  ExternalLink,
} from "lucide-react";

interface FavoriteItem {
  id: string;
  category: "memory" | "wishlist" | "place" | "date" | "letter" | "song" | "watch";
  title?: string;
  name?: string;
  eventName?: string;
  description?: string;
  content?: string;
  notes?: string;
  location?: string;
  city?: string;
  country?: string;
  date?: string;
  scheduledAt?: string;
  createdAt?: string;
  images?: { id: string; url: string }[];
  albumCoverUrl?: string;
  posterUrl?: string;
  streamingPlatform?: string;
  platform?: string;
  artist?: string;
  mood?: string;
  type?: string;
  priority?: string;
  status?: string;
}

interface FavoritesGridProps {
  items: FavoriteItem[];
}

const categoryConfig = {
  memory: {
    label: "Memory",
    icon: Camera,
    color: "text-rose-500",
    bg: "bg-rose-100 dark:bg-rose-950/30",
    href: "/memories",
  },
  wishlist: {
    label: "Wishlist",
    icon: Gift,
    color: "text-indigo-500",
    bg: "bg-indigo-100 dark:bg-indigo-950/30",
    href: "/wishlist",
  },
  place: {
    label: "Place",
    icon: MapPin,
    color: "text-emerald-500",
    bg: "bg-emerald-100 dark:bg-emerald-950/30",
    href: "/travil-places",
  },
  date: {
    label: "Date Night",
    icon: Calendar,
    color: "text-pink-500",
    bg: "bg-pink-100 dark:bg-pink-950/30",
    href: "/dates",
  },
  letter: {
    label: "Love Letter",
    icon: Mail,
    color: "text-rose-500",
    bg: "bg-rose-100 dark:bg-rose-950/30",
    href: "/letters",
  },
  song: {
    label: "Song",
    icon: Music2,
    color: "text-violet-500",
    bg: "bg-violet-100 dark:bg-violet-950/30",
    href: "/playlists",
  },
  watch: {
    label: "Watchlist",
    icon: Tv,
    color: "text-blue-500",
    bg: "bg-blue-100 dark:bg-blue-950/30",
    href: "/watchlist",
  },
};

const moodEmojis: Record<string, string> = {
  HAPPY: "😊",
  ROMANTIC: "💕",
  NOSTALGIC: "🌟",
  SAD: "💙",
  EXCITED: "🎉",
  GRATEFUL: "🙏",
  CALM: "🌸",
};

function FavoriteCard({ item }: { item: FavoriteItem }) {
  const router = useRouter();
  const config = categoryConfig[item.category];
  const Icon = config.icon;

  const title = item.title || item.name || item.eventName || "Untitled";
  const subtitle = item.description || item.content || item.notes || item.artist || "";
  const location = item.location || (item.city && item.country ? `${item.city}, ${item.country}` : item.city || item.country || "");
  const dateStr = item.date || item.scheduledAt || item.createdAt || "";
  const imageUrl = item.images?.[0]?.url || item.albumCoverUrl || item.posterUrl || null;

  const previewText = subtitle.length > 100 ? subtitle.substring(0, 100) + "..." : subtitle;

  return (
    <Card
      className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
      onClick={() => router.push(config.href)}
    >
      {/* Image or Icon */}
      <div className="relative h-40 bg-muted overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center ${config.bg}`}>
            <Icon className={`h-12 w-12 ${config.color} opacity-30`} />
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-2 left-2">
          <Badge className={`${config.bg} ${config.color} border-0 text-xs font-medium`}>
            <Icon className="h-3 w-3 mr-1" />
            {config.label}
          </Badge>
        </div>

        {/* Heart indicator */}
        <div className="absolute top-2 right-2">
          <div className="w-7 h-7 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <Heart className="h-4 w-4 text-rose-500 fill-current" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-sm line-clamp-1 mb-1">{title}</h3>
        
        {previewText && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
            {previewText}
          </p>
        )}

        {/* Additional info */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {location}
            </span>
          )}
          {item.artist && (
            <span className="flex items-center gap-1">
              <Music2 className="h-3 w-3" />
              {item.artist}
            </span>
          )}
          {item.streamingPlatform && (
            <Badge variant="outline" className="text-[10px]">
              {item.streamingPlatform}
            </Badge>
          )}
          {item.mood && moodEmojis[item.mood] && (
            <span>{moodEmojis[item.mood]}</span>
          )}
        </div>

        {/* Date */}
        {dateStr && (
          <div className="mt-2 text-[10px] text-muted-foreground">
            {new Date(dateStr).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        )}
      </div>
    </Card>
  );
}

export function FavoritesGrid({ items }: FavoritesGridProps) {
  // Group by category for display
  const categories = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, FavoriteItem[]>);

  return (
    <div className="space-y-8">
      {Object.entries(categories).map(([category, categoryItems]) => {
        const config = categoryConfig[category as keyof typeof categoryConfig];
        const Icon = config.icon;

        return (
          <section key={category}>
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center`}>
                <Icon className={`h-4 w-4 ${config.color}`} />
              </div>
              <h2 className="text-lg font-bold">{config.label}s</h2>
              <Badge variant="secondary" className="text-xs">
                {categoryItems.length}
              </Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {categoryItems.map((item) => (
                <FavoriteCard key={`${item.category}-${item.id}`} item={item} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}