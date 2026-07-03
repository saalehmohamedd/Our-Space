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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Compass,
  Loader2,
  Sparkles,
  MapPin,
  Globe,
  DollarSign,
  StickyNote,
  CheckCircle2,
  Lightbulb,
  Calendar,
  Plane,
} from "lucide-react";
import { createPlaceAction } from "@/app/actions/places";

interface PlaceFormInputs {
  name: string;
  location: string;
  country: string;
  costEstimate: string;
  status: "BUCKET_LIST" | "PLANNING" | "VISITED";
  notes: string;
}

const statusConfig = {
  BUCKET_LIST: {
    label: "Wanderlist",
    icon: Lightbulb,
    color: "text-blue-500",
    bg: "bg-blue-100 dark:bg-blue-900/30",
    border: "border-blue-300 dark:border-blue-700",
    description: "Someday dream",
  },
  PLANNING: {
    label: "Planning",
    icon: Calendar,
    color: "text-amber-500",
    bg: "bg-amber-100 dark:bg-amber-900/30",
    border: "border-amber-300 dark:border-amber-700",
    description: "Making it happen",
  },
  VISITED: {
    label: "Visited",
    icon: CheckCircle2,
    color: "text-emerald-500",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
    border: "border-emerald-300 dark:border-emerald-700",
    description: "Been there!",
  },
};

export function PlaceCreationDialog() {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<"BUCKET_LIST" | "PLANNING" | "VISITED">("BUCKET_LIST");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
  } = useForm<PlaceFormInputs>({
    defaultValues: {
      name: "",
      location: "",
      country: "",
      costEstimate: "",
      status: "BUCKET_LIST",
      notes: "",
    },
    mode: "onChange",
  });

  const watchName = watch("name");
  const watchLocation = watch("location");
  const watchCountry = watch("country");

  const handleStatusSelect = (status: "BUCKET_LIST" | "PLANNING" | "VISITED") => {
    setSelectedStatus(status);
    setValue("status", status);
  };

  const onSubmit = async (data: PlaceFormInputs) => {
    try {
      setSubmitting(true);
      
      await createPlaceAction({
        name: data.name,
        location: data.location,
        country: data.country,
        costEstimate: data.costEstimate,
        status: data.status,
        notes: data.notes,
      });

      reset();
      setSelectedStatus("BUCKET_LIST");
      setOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to pin travel spot.");
    } finally {
      setSubmitting(false);
    }
  };

  const currentStatus = statusConfig[selectedStatus];
  const StatusIcon = currentStatus.icon;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300">
          <Compass className="h-4 w-4" />
          Pin New Destination
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[92vw] max-w-[500px] rounded-2xl p-0 gap-0 overflow-hidden border-0 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-emerald-400 via-teal-400 to-emerald-500 p-6 sm:p-8 text-white">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Plane className="h-5 w-5" />
              </div>
              <DialogTitle className="text-xl font-bold">
                Pin Destination
              </DialogTitle>
            </div>
            <DialogDescription className="text-white/80 text-sm max-w-xs">
              Map out future journeys, plan trips, or save places you've loved
            </DialogDescription>
          </div>

          {/* Location preview */}
          {(watchName || watchLocation) && (
            <div className="mt-4 p-3 bg-white/10 backdrop-blur-sm rounded-xl">
              <p className="text-xs font-medium text-white/70 uppercase tracking-wider mb-1">
                Destination Preview
              </p>
              <p className="text-lg font-bold">
                {watchName || "Untitled Trip"}
              </p>
              {(watchLocation || watchCountry) && (
                <p className="text-sm text-white/80 mt-1 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {[watchLocation, watchCountry].filter(Boolean).join(", ")}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Form */}
        <div className="p-5 sm:p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Trip Name */}
            <div className="space-y-1.5">
              <Label
                htmlFor="name"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"
              >
                <Compass className="h-3 w-3 text-emerald-400" />
                Trip Title / Attraction
              </Label>
              <Input
                id="name"
                required
                placeholder="Summer trip to England..."
                className="w-full border-2 focus:border-emerald-400 focus:ring-emerald-400/20 transition"
                {...register("name", { required: "Name is required" })}
              />
            </div>

            {/* City & Country Row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label
                  htmlFor="location"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"
                >
                  <MapPin className="h-3 w-3 text-rose-400" />
                  City / Region
                </Label>
                <Input
                  id="location"
                  required
                  placeholder="London"
                  className="w-full border-2 focus:border-emerald-400 focus:ring-emerald-400/20 transition"
                  {...register("location", { required: "City is required" })}
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="country"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"
                >
                  <Globe className="h-3 w-3 text-blue-400" />
                  Country
                </Label>
                <Input
                  id="country"
                  required
                  placeholder="United Kingdom"
                  className="w-full border-2 focus:border-emerald-400 focus:ring-emerald-400/20 transition"
                  {...register("country", { required: "Country is required" })}
                />
              </div>
            </div>

            {/* Budget & Status Row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label
                  htmlFor="costEstimate"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"
                >
                  <DollarSign className="h-3 w-3 text-emerald-400" />
                  Est. Budget ($)
                </Label>
                <Input
                  id="costEstimate"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Optional"
                  className="w-full border-2 focus:border-emerald-400 focus:ring-emerald-400/20 transition"
                  {...register("costEstimate")}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-purple-400" />
                  Status
                </Label>
                <input type="hidden" {...register("status")} value={selectedStatus} />
              </div>
            </div>

            {/* Status Selection Cards */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                Travel Stage
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(statusConfig).map(([key, config]) => {
                  const Icon = config.icon;
                  const isSelected = selectedStatus === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleStatusSelect(key as "BUCKET_LIST" | "PLANNING" | "VISITED")}
                      className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200 ${
                        isSelected
                          ? `${config.border} ${config.bg} shadow-md scale-105`
                          : "border-transparent bg-muted/30 hover:bg-muted/50"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isSelected ? config.bg : "bg-muted"
                        }`}
                      >
                        <Icon className={`h-4 w-4 ${isSelected ? config.color : "text-muted-foreground"}`} />
                      </div>
                      <span
                        className={`text-xs font-medium ${
                          isSelected ? config.color : "text-muted-foreground"
                        }`}
                      >
                        {config.label}
                      </span>
                      <span className="text-[10px] text-muted-foreground leading-tight text-center">
                        {config.description}
                      </span>
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-background flex items-center justify-center">
                          <CheckCircle2 className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <Label
                htmlFor="notes"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"
              >
                <StickyNote className="h-3 w-3 text-amber-400" />
                Itinerary Ideas & Notes
              </Label>
              <Textarea
                id="notes"
                placeholder="Flight ideas, must-visit spots, local restaurants..."
                className="w-full resize-none min-h-[80px] border-2 focus:border-emerald-400 focus:ring-emerald-400/20 transition"
                rows={3}
                {...register("notes")}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300"
              disabled={submitting || !watchName}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Pinning Destination...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Save Destination
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-3 bg-muted/30 border-t flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${currentStatus.color.replace('text', 'bg')}`} />
            <span>{currentStatus.label} stage</span>
          </div>
          <span>
            {watchName ? "Ready to pin" : "Fill in destination name"}
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}