// src/components/playlists/playlist-grid.tsx
"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Music,
  Disc3,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { deletePlaylistAction } from "@/app/actions/playlists";
import { EditPlaylistDialog } from "./edit-playlist-dialog";
import { AddSongDialog } from "./add-song-dialog";
import { SongCard } from "./song-card";

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

interface Playlist {
  id: string;
  name: string;
  createdAt: string;
  songs: Song[];
}

interface PlaylistGridProps {
  playlists: Playlist[];
}

function getRandomGradient() {
  const gradients = [
    "from-violet-500 to-purple-600",
    "from-pink-500 to-rose-600",
    "from-blue-500 to-indigo-600",
    "from-emerald-500 to-teal-600",
    "from-amber-500 to-orange-600",
    "from-cyan-500 to-blue-600",
    "from-fuchsia-500 to-pink-600",
    "from-lime-500 to-green-600",
  ];
  return gradients[Math.floor(Math.random() * gradients.length)];
}

function PlaylistCard({ playlist }: { playlist: Playlist }) {
  const [expanded, setExpanded] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [addSongOpen, setAddSongOpen] = useState(false);
  const gradient = getRandomGradient();

  return (
    <>
      <Card className="overflow-hidden hover:shadow-xl transition-all">
        {/* Playlist Header */}
        <div className={`relative bg-gradient-to-br ${gradient} p-6 text-white`}>
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Disc3 className="h-6 w-6" />
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/10"
                  onClick={() => setEditOpen(true)}
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white/80 hover:text-red-400 hover:bg-white/10"
                  onClick={async () => {
                    if (confirm("Delete this playlist?")) {
                      await deletePlaylistAction(playlist.id);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <h3 className="font-bold text-xl mb-1">{playlist.name}</h3>
            <p className="text-white/70 text-sm">
              {playlist.songs.length} {playlist.songs.length === 1 ? "song" : "songs"}
            </p>
          </div>

          {/* Disc decoration */}
          <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full border-4 border-white/20" />
          <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-black/20 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-white/40" />
          </div>
        </div>

        {/* Songs List */}
        <div className="p-4">
          {playlist.songs.length === 0 ? (
            <div className="text-center py-6">
              <Music className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No songs yet</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => setAddSongOpen(true)}
              >
                <Plus className="h-3 w-3 mr-1" /> Add First Song
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-2 mb-3">
                {playlist.songs.slice(0, expanded ? undefined : 3).map((song) => (
                  <SongCard key={song.id} song={song} />
                ))}
              </div>
              
              <div className="flex items-center justify-between">
                {playlist.songs.length > 3 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                    onClick={() => setExpanded(!expanded)}
                  >
                    {expanded ? (
                      <><ChevronUp className="h-3 w-3 mr-1" /> Show Less</>
                    ) : (
                      <><ChevronDown className="h-3 w-3 mr-1" /> Show All {playlist.songs.length} Songs</>
                    )}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs ml-auto"
                  onClick={() => setAddSongOpen(true)}
                >
                  <Plus className="h-3 w-3 mr-1" /> Add Song
                </Button>
              </div>
            </>
          )}
        </div>
      </Card>

      <EditPlaylistDialog playlist={playlist} open={editOpen} onOpenChange={setEditOpen} />
      <AddSongDialog playlistId={playlist.id} open={addSongOpen} onOpenChange={setAddSongOpen} />
    </>
  );
}

export function PlaylistGrid({ playlists }: PlaylistGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {playlists.map((playlist) => (
        <PlaylistCard key={playlist.id} playlist={playlist} />
      ))}
    </div>
  );
}