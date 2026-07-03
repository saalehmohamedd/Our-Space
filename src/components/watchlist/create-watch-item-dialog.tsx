// src/components/watchlist/create-watch-item-dialog.tsx
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  PlusCircle,
  Sparkles,
  Film,
  Tv,
  Clapperboard,
  Globe,
  Play,
  StickyNote,
} from "lucide-react";
import { createWatchItemAction } from "@/app/actions/watchlist";
import { showToast } from "@/lib/toast";

const streamingPlatforms = [
  { value: "Netflix", label: "Netflix", color: "bg-red-500" },
  { value: "Shahid", label: "Shahid", color: "bg-amber-500" },
  { value: "Prime Video", label: "Prime Video", color: "bg-blue-500" },
  { value: "Apple TV+", label: "Apple TV+", color: "bg-gray-700" },
  { value: "Disney+", label: "Disney+", color: "bg-sky-500" },
  { value: "HBO Max", label: "HBO Max", color: "bg-purple-500" },
  { value: "Other", label: "Other", color: "bg-muted-foreground" },
];

type WatchStatus = "WANT_TO_WATCH" | "WATCHING" | "FINISHED";

interface WatchFormInputs {
  name: string;
  posterUrl: string;
  trailerUrl: string;
  imdbUrl: string;
  notes: string;
  status: WatchStatus;
}

export function CreateWatchItemDialog() {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedType, setSelectedType] = useState<"MOVIE" | "TV_SHOW">("MOVIE");
  const [selectedPlatform, setSelectedPlatform] = useState("Netflix");

  const { register, handleSubmit, reset, watch } = useForm<WatchFormInputs>({
    defaultValues: {
      name: "",
      posterUrl: "",
      trailerUrl: "",
      imdbUrl: "",
      notes: "",
      status: "WANT_TO_WATCH" as WatchStatus,
    },
  });

  const watchName = watch("name");
  const watchPosterUrl = watch("posterUrl");

  const onSubmit = async (data: WatchFormInputs) => {
    try {
      setSubmitting(true);
      const promise = createWatchItemAction({
        name: data.name,
        type: selectedType,
        posterUrl: data.posterUrl || undefined,
        streamingPlatform: selectedPlatform || undefined,
        trailerUrl: data.trailerUrl || undefined,
        imdbUrl: data.imdbUrl || undefined,
        notes: data.notes || undefined,
        status: data.status,
      });
      
      showToast.promise(promise, {
        loading: "Adding to watchlist...",
        success: "Added to watchlist! 🎬",
        error: "Failed to add item",
      });
      
      await promise;
      reset();
      setOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg">
          <PlusCircle className="h-4 w-4" />
          Add to Watchlist
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[92vw] max-w-[500px] rounded-2xl p-0 gap-0 overflow-hidden border-0 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Cinema header */}
        <div className="relative bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900 p-6 sm:p-8 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-yellow-500/20 to-transparent" />
          </div>
          <div className="absolute top-2 left-0 right-0 flex justify-center gap-1">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="w-3 h-2 rounded-full bg-yellow-500/30" />
            ))}
          </div>
          <div className="relative space-y-2 pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Clapperboard className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold">Add to Watchlist</DialogTitle>
                <DialogDescription className="text-white/70 text-sm">
                  Track movies & shows across your streaming services
                </DialogDescription>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Type Selection */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase">Type</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedType("MOVIE")}
                  className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                    selectedType === "MOVIE"
                      ? "border-indigo-400 bg-indigo-50 dark:bg-indigo-950/20 shadow-md"
                      : "border-transparent bg-muted/30"
                  }`}
                >
                  <Film className={`h-5 w-5 ${selectedType === "MOVIE" ? "text-indigo-500" : ""}`} />
                  <span className="text-sm font-medium">Movie</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedType("TV_SHOW")}
                  className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                    selectedType === "TV_SHOW"
                      ? "border-indigo-400 bg-indigo-50 dark:bg-indigo-950/20 shadow-md"
                      : "border-transparent bg-muted/30"
                  }`}
                >
                  <Tv className={`h-5 w-5 ${selectedType === "TV_SHOW" ? "text-indigo-500" : ""}`} />
                  <span className="text-sm font-medium">TV Show</span>
                </button>
              </div>
            </div>

            {/* Name */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase">Title</Label>
              <Input required placeholder="Movie or show name..." className="border-2 focus:border-indigo-400" {...register("name")} />
            </div>

            {/* Poster URL */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase">Poster URL</Label>
              <Input placeholder="https://image.url/poster.jpg" className="border-2 focus:border-indigo-400" {...register("posterUrl")} />
              {watchPosterUrl && (
                <div className="mt-2 rounded-lg overflow-hidden aspect-[2/3] max-h-40">
                  <img src={watchPosterUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* Streaming Platform */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase">Streaming Platform</Label>
              <div className="flex flex-wrap gap-2">
                {streamingPlatforms.map((platform) => (
                  <button
                    key={platform.value}
                    type="button"
                    onClick={() => setSelectedPlatform(platform.value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-all ${
                      selectedPlatform === platform.value
                        ? "border-indigo-400 bg-indigo-50 dark:bg-indigo-950/20 shadow-md"
                        : "border-transparent bg-muted/30 hover:bg-muted/50"
                    }`}
                  >
                    <span className={`inline-block w-2 h-2 rounded-full ${platform.color} mr-1.5`} />
                    {platform.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase flex items-center gap-1">
                  <Play className="h-3 w-3" /> Trailer URL
                </Label>
                <Input placeholder="YouTube trailer..." className="border-2 focus:border-indigo-400" {...register("trailerUrl")} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase flex items-center gap-1">
                  <Globe className="h-3 w-3" /> IMDb Link
                </Label>
                <Input placeholder="IMDb page..." className="border-2 focus:border-indigo-400" {...register("imdbUrl")} />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase flex items-center gap-1">
                <StickyNote className="h-3 w-3" /> Notes
              </Label>
              <Textarea placeholder="Why you want to watch it..." className="resize-none min-h-[60px] border-2 focus:border-indigo-400" {...register("notes")} />
            </div>

            <Button
              type="submit"
              disabled={submitting || !watchName}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {submitting ? "Adding..." : "Add to Watchlist"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}