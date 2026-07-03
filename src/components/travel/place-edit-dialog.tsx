"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
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
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Sparkles,
  X,
  Compass,
  MapPin,
  Globe,
  DollarSign,
  StickyNote,
  CheckCircle2,
  Lightbulb,
  Calendar,
  Plane,
  Star,
} from "lucide-react";
import { updatePlaceAction } from "@/app/actions/places";

interface PlaceItemType {
  id: string;
  name: string;
  location: string;
  country: string;
  costEstimate: any;
  status: "BUCKET_LIST" | "PLANNING" | "VISITED";
  notes: string | null;
  isFavorite?: boolean;
}

interface PlaceEditDialogProps {
  item: PlaceItemType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface EditPlaceInputs {
  name: string;
  location: string;
  country: string;
  costEstimate: string;
  status: "BUCKET_LIST" | "PLANNING" | "VISITED";
  notes: string;
}

type StatusType = "BUCKET_LIST" | "PLANNING" | "VISITED";

const statusConfig: Record<StatusType, {
  label: string;
  icon: React.ComponentType<any>;
  color: string;
  bg: string;
  border: string;
  gradient: string;
  description: string;
}> = {
  BUCKET_LIST: {
    label: "Wanderlist",
    icon: Lightbulb,
    color: "text-blue-500",
    bg: "bg-blue-100 dark:bg-blue-900/30",
    border: "border-blue-300 dark:border-blue-700",
    gradient: "from-blue-500 to-cyan-500",
    description: "Someday dream",
  },
  PLANNING: {
    label: "Planning",
    icon: Calendar,
    color: "text-amber-500",
    bg: "bg-amber-100 dark:bg-amber-900/30",
    border: "border-amber-300 dark:border-amber-700",
    gradient: "from-amber-500 to-orange-500",
    description: "Making it happen",
  },
  VISITED: {
    label: "Visited",
    icon: CheckCircle2,
    color: "text-emerald-500",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
    border: "border-emerald-300 dark:border-emerald-700",
    gradient: "from-emerald-500 to-green-500",
    description: "Been there!",
  },
};

// Fallback config for invalid status
const defaultStatusConfig = statusConfig.BUCKET_LIST;

export function PlaceEditDialog({ item, open, onOpenChange }: PlaceEditDialogProps) {
  const [updating, setUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<StatusType>(
    (item.status && statusConfig[item.status]) ? item.status : "BUCKET_LIST"
  );
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { isDirty },
    reset,
    setValue,
  } = useForm<EditPlaceInputs>({
    values: {
      name: item.name || "",
      location: item.location || "",
      country: item.country || "",
      costEstimate: item.costEstimate ? item.costEstimate.toString() : "",
      status: (item.status && statusConfig[item.status]) ? item.status : "BUCKET_LIST",
      notes: item.notes || "",
    },
  });

  // Reset form when dialog opens with different item
  React.useEffect(() => {
    if (open) {
      const validStatus = (item.status && statusConfig[item.status as StatusType]) 
        ? item.status as StatusType 
        : "BUCKET_LIST";
      
      reset({
        name: item.name || "",
        location: item.location || "",
        country: item.country || "",
        costEstimate: item.costEstimate ? item.costEstimate.toString() : "",
        status: validStatus,
        notes: item.notes || "",
      });
      setSelectedStatus(validStatus);
    }
  }, [open, item, reset]);

  const handleStatusSelect = (status: StatusType) => {
    setSelectedStatus(status);
    setValue("status", status, { shouldDirty: true });
  };

  const onUpdateSubmit = async (data: EditPlaceInputs) => {
    try {
      setUpdating(true);
      await updatePlaceAction(item.id, data);
      router.refresh();
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      alert("Failed to modify travel spot properties.");
    } finally {
      setUpdating(false);
    }
  };

  // Safely get current status config with fallback
  const currentStatus = statusConfig[selectedStatus] || defaultStatusConfig;
  const StatusIcon = currentStatus.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[92vw] max-w-[500px] rounded-2xl p-0 gap-0 overflow-hidden border-0 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header with Status Banner */}
        <div className={`relative bg-gradient-to-r ${currentStatus.gradient} p-6 sm:p-8 text-white`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Plane className="h-5 w-5" />
                </div>
                <DialogTitle className="text-xl font-bold">
                  Edit Destination
                </DialogTitle>
              </div>
              <DialogDescription className="text-white/80 text-sm max-w-xs">
                Update trip details, budget, or travel status
              </DialogDescription>
            </div>
            
            <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 text-xs font-medium px-3 py-1.5">
              <StatusIcon className="h-3.5 w-3.5 mr-1.5" />
              {currentStatus.label}
            </Badge>
          </div>

          {/* Item preview */}
          <div className="mt-4 p-3 bg-white/10 backdrop-blur-sm rounded-xl">
            <p className="text-xs font-medium text-white/70 uppercase tracking-wider mb-1">
              Current Destination
            </p>
            <p className="text-lg font-bold truncate">
              {item.name}
            </p>
            {(item.location || item.country) && (
              <p className="text-sm text-white/80 mt-1 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {[item.location, item.country].filter(Boolean).join(", ")}
              </p>
            )}
            {item.costEstimate && (
              <p className="text-sm text-white/80 mt-1">
                Budget: ${parseFloat(item.costEstimate.toString()).toFixed(2)}
              </p>
            )}
          </div>
        </div>

        {/* Form */}
        <div className="p-5 sm:p-6">
          <form onSubmit={handleSubmit(onUpdateSubmit)} className="space-y-5">
            {/* Trip Name */}
            <div className="space-y-1.5">
              <Label
                htmlFor="edit-name"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"
              >
                <Compass className="h-3 w-3 text-emerald-400" />
                Trip Title
              </Label>
              <Input
                id="edit-name"
                required
                placeholder="Trip name..."
                className="w-full border-2 focus:border-emerald-400 focus:ring-emerald-400/20 transition"
                {...register("name", { required: "Name is required" })}
              />
            </div>

            {/* Location & Country */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label
                  htmlFor="edit-location"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"
                >
                  <MapPin className="h-3 w-3 text-rose-400" />
                  City / Region
                </Label>
                <Input
                  id="edit-location"
                  required
                  placeholder="City"
                  className="w-full border-2 focus:border-emerald-400 focus:ring-emerald-400/20 transition"
                  {...register("location", { required: "Location is required" })}
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="edit-country"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"
                >
                  <Globe className="h-3 w-3 text-blue-400" />
                  Country
                </Label>
                <Input
                  id="edit-country"
                  required
                  placeholder="Country"
                  className="w-full border-2 focus:border-emerald-400 focus:ring-emerald-400/20 transition"
                  {...register("country", { required: "Country is required" })}
                />
              </div>
            </div>

            {/* Budget & Status */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label
                  htmlFor="edit-cost"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"
                >
                  <DollarSign className="h-3 w-3 text-emerald-400" />
                  Budget ($)
                </Label>
                <Input
                  id="edit-cost"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="w-full border-2 focus:border-emerald-400 focus:ring-emerald-400/20 transition"
                  {...register("costEstimate")}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Star className="h-3 w-3 text-amber-400" />
                  Status
                </Label>
                <input type="hidden" {...register("status")} value={selectedStatus} />
              </div>
            </div>

            {/* Status Selection Cards */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Travel Stage
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.entries(statusConfig) as [StatusType, typeof defaultStatusConfig][]).map(([key, config]) => {
                  const Icon = config.icon;
                  const isSelected = selectedStatus === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleStatusSelect(key)}
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
                htmlFor="edit-notes"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"
              >
                <StickyNote className="h-3 w-3 text-amber-400" />
                Itinerary & Notes
              </Label>
              <Textarea
                id="edit-notes"
                placeholder="Flight ideas, restaurants, must-see spots..."
                className="w-full resize-none min-h-[80px] border-2 focus:border-emerald-400 focus:ring-emerald-400/20 transition"
                rows={3}
                {...register("notes")}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                disabled={updating}
                className="flex-shrink-0 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4 mr-1.5" />
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updating || !isDirty}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-3 bg-muted/30 border-t flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${currentStatus.color.replace('text', 'bg')}`} />
            <span>{currentStatus.label}</span>
          </div>
          <span>
            {item.isFavorite ? "⭐ Favorite destination" : "📍 Travel spot"}
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}