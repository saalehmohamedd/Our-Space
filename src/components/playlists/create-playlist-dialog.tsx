// src/components/playlists/create-playlist-dialog.tsx
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  PlusCircle,
  Sparkles,
  Music,
  Disc3,
} from "lucide-react";
import { createPlaylistAction } from "@/app/actions/playlists";

export function CreatePlaylistDialog() {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, watch } = useForm();

  const watchName = watch("name");

  const onSubmit = async (data: any) => {
    try {
      setSubmitting(true);
      await createPlaylistAction(data);
      reset();
      setOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to create playlist.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white shadow-lg shadow-violet-500/25">
          <PlusCircle className="h-4 w-4" />
          New Playlist
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[92vw] max-w-[450px] rounded-2xl p-0 gap-0 overflow-hidden border-0 shadow-2xl">
        {/* Music header */}
        <div className="relative bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 p-6 sm:p-8 text-white overflow-hidden">
          {/* Sound waves decoration */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-1 opacity-30">
            {[8, 12, 6, 16, 10, 14, 8, 18, 6, 12, 10, 16, 8, 14, 10, 18, 6, 12, 8, 16].map((h, i) => (
              <div key={i} className="w-1 bg-white rounded-t-full animate-pulse" style={{ height: `${h}px`, animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
          
          <div className="relative space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Disc3 className="h-6 w-6 animate-spin-slow" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold">Create Playlist</DialogTitle>
                <DialogDescription className="text-white/80 text-sm">
                  Start a new vibe collection for any mood or occasion
                </DialogDescription>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Playlist Name
              </label>
              <Input
                required
                placeholder="Chill Vibes, Party Hits, Road Trip..."
                className="w-full border-2 focus:border-violet-400 transition text-lg"
                {...register("name")}
              />
            </div>

            <Button
              type="submit"
              disabled={submitting || !watchName}
              className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white shadow-lg"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Create Playlist
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}