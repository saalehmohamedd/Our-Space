// src/components/playlists/add-song-dialog.tsx
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
import { Sparkles, X, Music2, User, Image, Link, StickyNote } from "lucide-react";
import { addSongAction } from "@/app/actions/playlists";

interface AddSongDialogProps {
  playlistId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddSongDialog({ playlistId, open, onOpenChange }: AddSongDialogProps) {
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, watch } = useForm();

  const watchAlbumCover = watch("albumCoverUrl");

  const onSubmit = async (data: any) => {
    try {
      setSubmitting(true);
      await addSongAction({
        ...data,
        playlistId,
      });
      reset();
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      alert("Failed to add song.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[92vw] max-w-[450px] rounded-2xl p-0 gap-0 overflow-hidden border-0 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="relative bg-gradient-to-br from-violet-500 to-purple-500 p-6 text-white">
          <div className="relative flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Music2 className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">Add Song</DialogTitle>
              <DialogDescription className="text-white/80 text-sm">
                Add a track from Spotify, YouTube, or Apple Music
              </DialogDescription>
            </div>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase flex items-center gap-1">
                  <Music2 className="h-3 w-3" /> Title
                </Label>
                <Input required placeholder="Song name" className="border-2" {...register("title")} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase flex items-center gap-1">
                  <User className="h-3 w-3" /> Artist
                </Label>
                <Input required placeholder="Artist name" className="border-2" {...register("artist")} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase flex items-center gap-1">
                <Image className="h-3 w-3" /> Album Cover URL
              </Label>
              <Input placeholder="https://..." className="border-2" {...register("albumCoverUrl")} />
              {watchAlbumCover && (
                <div className="w-20 h-20 rounded-lg overflow-hidden mt-2">
                  <img src={watchAlbumCover} alt="Cover" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-semibold uppercase flex items-center gap-1">
                <Link className="h-3 w-3" /> Streaming Links
              </Label>
              <Input placeholder="Spotify URL" className="border-2" {...register("spotifyUrl")} />
              <Input placeholder="YouTube URL" className="border-2" {...register("youtubeUrl")} />
              <Input placeholder="Apple Music URL" className="border-2" {...register("appleMusicUrl")} />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase flex items-center gap-1">
                <StickyNote className="h-3 w-3" /> Notes
              </Label>
              <Textarea placeholder="Why this song is special..." className="border-2 resize-none" rows={2} {...register("notes")} />
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                <X className="h-4 w-4 mr-1" /> Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-gradient-to-r from-violet-500 to-purple-500 text-white" disabled={submitting}>
                <Sparkles className="mr-2 h-4 w-4" /> Add Song
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}