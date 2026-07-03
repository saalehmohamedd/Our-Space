// src/components/watchlist/watchlist-grid.tsx
"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Play,
  Eye,
  CheckCircle2,
  Star,
  Tv,
  Film,
  Clock,
  Trash2,
  Edit3,
  ExternalLink,
} from "lucide-react";
import {
  deleteWatchItemAction,
  toggleFavoriteWatchItemAction,
  updateWatchStatusAction,
} from "@/app/actions/watchlist";
import { EditWatchItemDialog } from "./edit-watch-item-dialog";

interface WatchItem {
  id: string;
  name: string;
  type: "MOVIE" | "TV_SHOW";
  posterUrl: string | null;
  streamingPlatform: string | null;
  trailerUrl: string | null;
  imdbUrl: string | null;
  notes: string | null;
  status: "WANT_TO_WATCH" | "WATCHING" | "FINISHED";
  isFavorite: boolean;
}

interface WatchListGridProps {
  wantToWatch: WatchItem[];
  watching: WatchItem[];
  finished: WatchItem[];
}

const platformConfig: Record<string, { label: string; color: string; bg: string }> = {
  netflix: { label: "Netflix", color: "text-red-500", bg: "bg-red-100 dark:bg-red-950/30" },
  shahid: { label: "Shahid", color: "text-gold-500", bg: "bg-amber-100 dark:bg-amber-950/30" },
  "prime video": { label: "Prime Video", color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-950/30" },
  "amazon prime": { label: "Prime Video", color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-950/30" },
  "apple tv": { label: "Apple TV+", color: "text-gray-700", bg: "bg-gray-100 dark:bg-gray-800" },
  "apple tv+": { label: "Apple TV+", color: "text-gray-700", bg: "bg-gray-100 dark:bg-gray-800" },
  disney: { label: "Disney+", color: "text-sky-500", bg: "bg-sky-100 dark:bg-sky-950/30" },
  "disney+": { label: "Disney+", color: "text-sky-500", bg: "bg-sky-100 dark:bg-sky-950/30" },
  hbo: { label: "HBO Max", color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-950/30" },
};

function getPlatformConfig(platform: string | null) {
  if (!platform) return null;
  const lower = platform.toLowerCase();
  return platformConfig[lower] || { label: platform, color: "text-muted-foreground", bg: "bg-muted" };
}

function WatchCard({ item }: { item: WatchItem }) {
  const [isHovered, setIsHovered] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const platform = getPlatformConfig(item.streamingPlatform);
  const isMovie = item.type === "MOVIE";

  return (
    <>
      <Card
        className="relative overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Cinema curtain top */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-800 via-red-600 to-red-800" />
        
        {/* Poster/Placeholder */}
        <div className="relative aspect-[2/3] bg-gradient-to-b from-gray-900 to-gray-800 overflow-hidden">
          {item.posterUrl ? (
            <img
              src={item.posterUrl}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-white/60 p-4">
              {isMovie ? (
                <Film className="h-12 w-12 mb-2" />
              ) : (
                <Tv className="h-12 w-12 mb-2" />
              )}
              <p className="text-xs text-center font-medium">{item.name}</p>
            </div>
          )}

          {/* Hover overlay */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="text-white font-bold text-sm mb-1">{item.name}</p>
              <div className="flex items-center gap-2 mb-3">
                <Badge className="text-xs bg-white/20 text-white border-0">
                  {isMovie ? "🎬 Movie" : "📺 TV Show"}
                </Badge>
                {platform && (
                  <Badge className={`text-xs ${platform.bg} ${platform.color} border-0`}>
                    {platform.label}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  className="flex-1 bg-white/20 hover:bg-white/30 text-white text-xs"
                  onClick={() => setEditOpen(true)}
                >
                  <Eye className="h-3 w-3 mr-1" /> Details
                </Button>
                {item.trailerUrl && (
                  <Button size="icon" className="h-8 w-8 bg-white/20 hover:bg-white/30" asChild>
                    <a href={item.trailerUrl} target="_blank" rel="noopener noreferrer">
                      <Play className="h-4 w-4 text-white" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Favorite & Status badges */}
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            <button
              onClick={async () => {
                await toggleFavoriteWatchItemAction(item.id, item.isFavorite);
              }}
              className={`p-1.5 rounded-full transition ${
                item.isFavorite
                  ? "bg-yellow-400 text-yellow-900"
                  : "bg-black/40 text-white/80 hover:bg-black/60"
              }`}
            >
              <Star className={`h-3.5 w-3.5 ${item.isFavorite ? "fill-current" : ""}`} />
            </button>
          </div>

          {/* Status indicator */}
          {item.status === "WATCHING" && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-blue-500 text-white border-0 text-xs">
                <Eye className="h-3 w-3 mr-1" /> Watching
              </Badge>
            </div>
          )}
          {item.status === "FINISHED" && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-emerald-500 text-white border-0 text-xs">
                <CheckCircle2 className="h-3 w-3 mr-1" /> Watched
              </Badge>
            </div>
          )}
        </div>

        {/* Bottom info */}
        <div className="p-3">
          <h3 className="font-bold text-sm line-clamp-1">{item.name}</h3>
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-1">
              {platform && (
                <span className={`text-xs font-medium ${platform.color}`}>
                  {platform.label}
                </span>
              )}
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setEditOpen(true)}>
                <Edit3 className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-destructive"
                onClick={async () => {
                  if (confirm("Remove from watchlist?")) {
                    await deleteWatchItemAction(item.id);
                  }
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <EditWatchItemDialog item={item} open={editOpen} onOpenChange={setEditOpen} />
    </>
  );
}

export function WatchListGrid({ wantToWatch, watching, finished }: WatchListGridProps) {
  return (
    <div className="space-y-8">
      {/* Currently Watching */}
      {watching.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center">
              <Eye className="h-4 w-4 text-blue-500" />
            </div>
            <h2 className="text-lg font-bold">Currently Watching</h2>
            <Badge variant="secondary">{watching.length}</Badge>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {watching.map((item) => (
              <WatchCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Want to Watch */}
      {wantToWatch.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/30 flex items-center justify-center">
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
            <h2 className="text-lg font-bold">Want to Watch</h2>
            <Badge variant="secondary">{wantToWatch.length}</Badge>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {wantToWatch.map((item) => (
              <WatchCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Finished */}
      {finished.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </div>
            <h2 className="text-lg font-bold text-muted-foreground">Finished</h2>
            <Badge variant="secondary">{finished.length}</Badge>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 opacity-60 hover:opacity-80 transition-opacity">
            {finished.map((item) => (
              <WatchCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}