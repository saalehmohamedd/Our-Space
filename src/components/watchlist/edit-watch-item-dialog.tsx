// src/components/watchlist/edit-watch-item-dialog.tsx
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
import { Sparkles, X, Edit3, Film, Tv, Play, Globe, StickyNote } from "lucide-react";
import { updateWatchItemAction } from "@/app/actions/watchlist";

const streamingPlatforms = [
  { value: "Netflix", label: "Netflix", color: "bg-red-500" },
  { value: "Shahid", label: "Shahid", color: "bg-amber-500" },
  { value: "Prime Video", label: "Prime Video", color: "bg-blue-500" },
  { value: "Apple TV+", label: "Apple TV+", color: "bg-gray-700" },
  { value: "Disney+", label: "Disney+", color: "bg-sky-500" },
  { value: "HBO Max", label: "HBO Max", color: "bg-purple-500" },
  { value: "Other", label: "Other", color: "bg-muted-foreground" },
];

export function EditWatchItemDialog({ item, open, onOpenChange }: any) {
  const [updating, setUpdating] = useState(false);
  const [selectedType, setSelectedType] = useState(item.type);
  const [selectedPlatform, setSelectedPlatform] = useState(item.streamingPlatform || "Netflix");

  const { register, handleSubmit, reset } = useForm({
    values: {
      name: item.name,
      posterUrl: item.posterUrl || "",
      trailerUrl: item.trailerUrl || "",
      imdbUrl: item.imdbUrl || "",
      notes: item.notes || "",
      status: item.status,
    },
  });

  React.useEffect(() => {
    if (open) {
      reset({
        name: item.name,
        posterUrl: item.posterUrl || "",
        trailerUrl: item.trailerUrl || "",
        imdbUrl: item.imdbUrl || "",
        notes: item.notes || "",
        status: item.status,
      });
      setSelectedType(item.type);
      setSelectedPlatform(item.streamingPlatform || "Netflix");
    }
  }, [open, item, reset]);

  const onSubmit = async (data: any) => {
    try {
      setUpdating(true);
      await updateWatchItemAction(item.id, {
        ...data,
        type: selectedType,
        streamingPlatform: selectedPlatform,
      });
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update item.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[92vw] max-w-[500px] rounded-2xl p-0 gap-0 overflow-hidden border-0 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="relative bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900 p-6 text-white">
          <div className="absolute top-2 left-0 right-0 flex justify-center gap-1">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="w-3 h-2 rounded-full bg-yellow-500/30" />
            ))}
          </div>
          <div className="relative flex items-center gap-3 pt-4">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Edit3 className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">Edit Item</DialogTitle>
              <DialogDescription className="text-white/70 text-sm">
                Update watch details
              </DialogDescription>
            </div>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setSelectedType("MOVIE")} className={`flex items-center gap-2 p-3 rounded-xl border-2 ${selectedType === "MOVIE" ? "border-indigo-400 bg-indigo-50" : "border-transparent bg-muted/30"}`}>
                <Film className="h-5 w-5" /> Movie
              </button>
              <button type="button" onClick={() => setSelectedType("TV_SHOW")} className={`flex items-center gap-2 p-3 rounded-xl border-2 ${selectedType === "TV_SHOW" ? "border-indigo-400 bg-indigo-50" : "border-transparent bg-muted/30"}`}>
                <Tv className="h-5 w-5" /> TV Show
              </button>
            </div>

            <Input required {...register("name")} className="border-2" placeholder="Title" />
            <Input {...register("posterUrl")} className="border-2" placeholder="Poster URL" />
            
            <div className="flex flex-wrap gap-2">
              {streamingPlatforms.map((p) => (
                <button key={p.value} type="button" onClick={() => setSelectedPlatform(p.value)}
                  className={`px-3 py-1.5 rounded-full text-xs border-2 ${selectedPlatform === p.value ? "border-indigo-400 bg-indigo-50" : "border-transparent bg-muted/30"}`}>
                  <span className={`inline-block w-2 h-2 rounded-full ${p.color} mr-1.5`} />{p.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input {...register("trailerUrl")} className="border-2" placeholder="Trailer URL" />
              <Input {...register("imdbUrl")} className="border-2" placeholder="IMDb URL" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase">Status</Label>
              <select {...register("status")} className="w-full h-10 px-3 rounded-md border">
                <option value="WANT_TO_WATCH">Want to Watch</option>
                <option value="WATCHING">Currently Watching</option>
                <option value="FINISHED">Finished</option>
              </select>
            </div>

            <Textarea {...register("notes")} className="border-2" placeholder="Notes..." />

            <div className="flex gap-3">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}><X className="h-4 w-4 mr-1" /> Cancel</Button>
              <Button type="submit" className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white" disabled={updating}>
                <Sparkles className="mr-2 h-4 w-4" /> Save
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}