// src/components/playlists/edit-song-dialog.tsx
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, X, Edit3 } from "lucide-react";
import { updateSongAction } from "@/app/actions/playlists";

export function EditSongDialog({ song, open, onOpenChange }: any) {
  const [updating, setUpdating] = useState(false);

  const { register, handleSubmit, reset } = useForm({
    values: {
      title: song.title,
      artist: song.artist,
      albumCoverUrl: song.albumCoverUrl || "",
      spotifyUrl: song.spotifyUrl || "",
      youtubeUrl: song.youtubeUrl || "",
      appleMusicUrl: song.appleMusicUrl || "",
      notes: song.notes || "",
    },
  });

  React.useEffect(() => {
    if (open) {
      reset({
        title: song.title,
        artist: song.artist,
        albumCoverUrl: song.albumCoverUrl || "",
        spotifyUrl: song.spotifyUrl || "",
        youtubeUrl: song.youtubeUrl || "",
        appleMusicUrl: song.appleMusicUrl || "",
        notes: song.notes || "",
      });
    }
  }, [open, song, reset]);

  const onSubmit = async (data: any) => {
    try {
      setUpdating(true);
      await updateSongAction(song.id, data);
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[92vw] max-w-[450px] rounded-2xl p-0 gap-0 border-0 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-br from-violet-500 to-purple-500 p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Edit3 className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">Edit Song</DialogTitle>
            </div>
          </div>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input required {...register("title")} className="border-2" placeholder="Title" />
              <Input required {...register("artist")} className="border-2" placeholder="Artist" />
            </div>
            <Input {...register("albumCoverUrl")} className="border-2" placeholder="Album Cover URL" />
            <Input {...register("spotifyUrl")} className="border-2" placeholder="Spotify URL" />
            <Input {...register("youtubeUrl")} className="border-2" placeholder="YouTube URL" />
            <Input {...register("appleMusicUrl")} className="border-2" placeholder="Apple Music URL" />
            <Textarea {...register("notes")} className="border-2" placeholder="Notes" rows={2} />
            <div className="flex gap-3">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}><X className="h-4 w-4 mr-1" /> Cancel</Button>
              <Button type="submit" className="flex-1 bg-gradient-to-r from-violet-500 to-purple-500 text-white" disabled={updating}>
                <Sparkles className="mr-2 h-4 w-4" /> Save
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}