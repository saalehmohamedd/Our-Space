// src/app/(app)/playlists/page.tsx

import React from "react";
import { prisma } from "@/lib/prisma";
import { Separator } from "@/components/ui/separator";
import { Music, Disc3 } from "lucide-react";
import { CreatePlaylistDialog } from "@/components/playlists/create-playlist-dialog";
import { PlaylistGrid } from "@/components/playlists/playlist-grid";

function serializePlaylist(playlist: any) {
  return {
    ...playlist,
    createdAt: playlist.createdAt?.toISOString() || null,
    songs: playlist.songs?.map((song: any) => ({
      ...song,
      createdAt: song.createdAt?.toISOString() || null,
    })) || [],
  };
}

export default async function PlaylistsPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; filter?: string }>;
}) {
  const { sort, filter } = await searchParams;

  // Build orderBy
  let orderBy: any = { createdAt: "desc" };
  
  if (sort === "oldest") {
    orderBy = { createdAt: "asc" };
  } else if (sort === "az") {
    orderBy = { name: "asc" };
  } else if (sort === "za") {
    orderBy = { name: "desc" };
  }

  const playlists = await prisma.playlist.findMany({
    include: {
      songs: {
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy,
  });

  // Filter playlists with songs if filter is "favorites"
  let filteredPlaylists = playlists;
  if (filter === "favorites") {
    filteredPlaylists = playlists.map(playlist => ({
      ...playlist,
      songs: playlist.songs.filter(song => song.isFavorite),
    })).filter(playlist => playlist.songs.length > 0);
  } else if (filter === "active") {
    filteredPlaylists = playlists.filter(playlist => playlist.songs.length > 0);
  } else if (filter === "completed") {
    filteredPlaylists = playlists.filter(playlist => playlist.songs.length === 0);
  }

  const serializedPlaylists = filteredPlaylists.map(serializePlaylist);

  const totalSongs = serializedPlaylists.reduce(
    (acc, playlist) => acc + playlist.songs.length,
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Playlists</h1>
          <p className="text-muted-foreground">
            {serializedPlaylists.length} playlists • {totalSongs} songs
            {filter === "favorites" && " • Favorite songs"}
            {filter === "active" && " • With songs"}
            {filter === "completed" && " • Empty playlists"}
          </p>
        </div>
        <div>
          <CreatePlaylistDialog />
        </div>
      </div>

      <Separator />

      {serializedPlaylists.length === 0 ? (
        <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-16 text-center bg-card/50">
          <Disc3 className="h-10 w-10 text-violet-400 stroke-1 mb-3 animate-pulse" />
          <h3 className="font-semibold text-lg">No Playlists Found</h3>
          <p className="text-sm text-muted-foreground max-w-sm mt-1">
            {filter 
              ? "Try changing your filters." 
              : "Create playlists and add songs from Spotify, YouTube, or Apple Music. Build your perfect vibe collection!"}
          </p>
        </div>
      ) : (
        <PlaylistGrid playlists={serializedPlaylists} />
      )}
    </div>
  );
}