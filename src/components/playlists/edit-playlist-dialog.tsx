// src/components/playlists/edit-playlist-dialog.tsx
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
import { Sparkles, X, Edit3 } from "lucide-react";
import { updatePlaylistAction } from "@/app/actions/playlists";

export function EditPlaylistDialog({ playlist, open, onOpenChange }: any) {
  const [updating, setUpdating] = useState(false);

  const { register, handleSubmit, reset } = useForm({
    values: { name: playlist.name },
  });

  React.useEffect(() => {
    if (open) reset({ name: playlist.name });
  }, [open, playlist, reset]);

  const onSubmit = async (data: any) => {
    try {
      setUpdating(true);
      await updatePlaylistAction(playlist.id, data);
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
      <DialogContent className="w-[92vw] max-w-[400px] rounded-2xl p-0 gap-0 border-0 shadow-2xl">
        <div className="bg-gradient-to-br from-violet-500 to-purple-500 p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Edit3 className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">Rename Playlist</DialogTitle>
            </div>
          </div>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input required {...register("name")} className="border-2 text-lg" placeholder="Playlist name" />
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