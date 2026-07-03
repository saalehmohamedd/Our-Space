// src/app/actions/playlists.ts
"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUserOrThrow } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";

export async function createPlaylistAction(data: {
  name: string;
}) {
  await getCurrentUserOrThrow();

  const playlist = await prisma.playlist.create({
    data: {
      name: data.name,
    },
  });

  revalidatePath("/playlists");
  revalidatePath("/dashboard");

  return playlist;
}

export async function updatePlaylistAction(id: string, data: { name: string }) {
  await getCurrentUserOrThrow();

  await prisma.playlist.update({
    where: { id },
    data: { name: data.name },
  });

  revalidatePath("/playlists");
}

export async function deletePlaylistAction(id: string) {
  await getCurrentUserOrThrow();

  await prisma.playlist.delete({
    where: { id },
  });

  revalidatePath("/playlists");
}

export async function addSongAction(data: {
  title: string;
  artist: string;
  albumCoverUrl?: string;
  spotifyUrl?: string;
  youtubeUrl?: string;
  appleMusicUrl?: string;
  notes?: string;
  playlistId: string;
}) {
  await getCurrentUserOrThrow();

  const song = await prisma.song.create({
    data: {
      title: data.title,
      artist: data.artist,
      albumCoverUrl: data.albumCoverUrl || null,
      spotifyUrl: data.spotifyUrl || null,
      youtubeUrl: data.youtubeUrl || null,
      appleMusicUrl: data.appleMusicUrl || null,
      notes: data.notes || null,
      playlistId: data.playlistId,
    },
  });

  revalidatePath("/playlists");
  return song;
}

export async function updateSongAction(
  id: string,
  data: {
    title: string;
    artist: string;
    albumCoverUrl?: string;
    spotifyUrl?: string;
    youtubeUrl?: string;
    appleMusicUrl?: string;
    notes?: string;
  }
) {
  await getCurrentUserOrThrow();

  await prisma.song.update({
    where: { id },
    data: {
      title: data.title,
      artist: data.artist,
      albumCoverUrl: data.albumCoverUrl || null,
      spotifyUrl: data.spotifyUrl || null,
      youtubeUrl: data.youtubeUrl || null,
      appleMusicUrl: data.appleMusicUrl || null,
      notes: data.notes || null,
    },
  });

  revalidatePath("/playlists");
}

export async function deleteSongAction(id: string) {
  await getCurrentUserOrThrow();

  await prisma.song.delete({
    where: { id },
  });

  revalidatePath("/playlists");
}

export async function toggleFavoriteSongAction(id: string, currentState: boolean) {
  await getCurrentUserOrThrow();

  await prisma.song.update({
    where: { id },
    data: { isFavorite: !currentState },
  });

  revalidatePath("/playlists");
}