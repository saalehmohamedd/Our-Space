// src/components/playlists/song-card.tsx
"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, ExternalLink, Music2, Trash2, Edit3 } from "lucide-react";
import { toggleFavoriteSongAction, deleteSongAction } from "@/app/actions/playlists";
import { EditSongDialog } from "./edit-song-dialog";

interface Song {
  id: string;
  title: string;
  artist: string;
  albumCoverUrl: string | null;
  spotifyUrl: string | null;
  youtubeUrl: string | null;
  appleMusicUrl: string | null;
  notes: string | null;
  isFavorite: boolean;
  playlistId: string;
}

export function SongCard({ song }: { song: Song }) {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/20 hover:bg-muted/40 transition group">
        {/* Album Art */}
        <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0 bg-muted">
          {song.albumCoverUrl ? (
            <img src={song.albumCoverUrl} alt={song.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Music2 className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Song Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{song.title}</p>
          <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
          {song.notes && (
            <p className="text-xs text-muted-foreground/60 truncate mt-0.5">{song.notes}</p>
          )}
        </div>

        {/* Links & Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {song.spotifyUrl && (
            <a href={song.spotifyUrl} target="_blank" rel="noopener noreferrer"
              className="p-1 rounded hover:bg-green-100 dark:hover:bg-green-900/30 text-green-500 transition">
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
          {song.youtubeUrl && (
            <a href={song.youtubeUrl} target="_blank" rel="noopener noreferrer"
              className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 transition">
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
          {song.appleMusicUrl && (
            <a href={song.appleMusicUrl} target="_blank" rel="noopener noreferrer"
              className="p-1 rounded hover:bg-pink-100 dark:hover:bg-pink-900/30 text-pink-500 transition">
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
          <button
            onClick={async () => {
              await toggleFavoriteSongAction(song.id, song.isFavorite);
            }}
            className={`p-1 rounded transition ${
              song.isFavorite ? "text-red-500" : "text-muted-foreground hover:text-red-500"
            }`}
          >
            <Heart className={`h-3 w-3 ${song.isFavorite ? "fill-current" : ""}`} />
          </button>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setEditOpen(true)}>
            <Edit3 className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-destructive"
            onClick={async () => {
              if (confirm("Remove this song?")) {
                await deleteSongAction(song.id);
              }
            }}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <EditSongDialog song={song} open={editOpen} onOpenChange={setEditOpen} />
    </>
  );
}