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
  Heart,
  Calendar,
  MapPin,
  Activity,
  DollarSign,
  StickyNote,
  CheckCircle2,
  Lightbulb,
  Clock,
  Star,
  PlusCircle,
} from "lucide-react";
import { updateDateAction } from "@/app/actions/dates";

interface DateItemType {
  id: string;
  title: string;
  activity: string;
  location: string;
  scheduledAt: Date;
  costEstimate: any;
  status: "IDEA" | "PLANNED" | "COMPLETED";
  rating: number | null;
  notes: string | null;
}

interface DateEditDialogProps {
  item: DateItemType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface EditDateInputs {
  title: string;
  activity: string;
  location: string;
  scheduledAt: string;
  costEstimate: string;
  status: "IDEA" | "PLANNED" | "COMPLETED";
  rating: string;
  notes: string;
}

type StatusType = "IDEA" | "PLANNED" | "COMPLETED";

const statusConfig: Record<StatusType, {
  label: string;
  icon: React.ComponentType<any>;
  color: string;
  bg: string;
  border: string;
  gradient: string;
  description: string;
}> = {
  IDEA: {
    label: "Spark Idea",
    icon: Lightbulb,
    color: "text-amber-500",
    bg: "bg-amber-100 dark:bg-amber-900/30",
    border: "border-amber-300 dark:border-amber-700",
    gradient: "from-amber-400 via-orange-400 to-amber-500",
    description: "Just a fun thought",
  },
  PLANNED: {
    label: "Locked In",
    icon: Clock,
    color: "text-rose-500",
    bg: "bg-rose-100 dark:bg-rose-900/30",
    border: "border-rose-300 dark:border-rose-700",
    gradient: "from-rose-400 via-pink-400 to-rose-500",
    description: "Scheduled & ready",
  },
  COMPLETED: {
    label: "Cherished",
    icon: CheckCircle2,
    color: "text-purple-500",
    bg: "bg-purple-100 dark:bg-purple-900/30",
    border: "border-purple-300 dark:border-purple-700",
    gradient: "from-purple-400 via-violet-400 to-purple-500",
    description: "Already enjoyed",
  },
};

const defaultStatusConfig = statusConfig.IDEA;

export function DateEditDialog({ item, open, onOpenChange }: DateEditDialogProps) {
  const [updating, setUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<StatusType>(
    (item.status && statusConfig[item.status]) ? item.status : "IDEA"
  );
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { isDirty },
    watch,
    reset,
    setValue,
  } = useForm<EditDateInputs>({
    values: {
      title: item.title || "",
      activity: item.activity || "",
      location: item.location || "",
      scheduledAt: item.scheduledAt ? new Date(item.scheduledAt).toISOString().split("T")[0] : "",
      costEstimate: item.costEstimate ? item.costEstimate.toString() : "",
      status: (item.status && statusConfig[item.status]) ? item.status : "IDEA",
      rating: item.rating ? item.rating.toString() : "5",
      notes: item.notes || "",
    },
  });

  React.useEffect(() => {
    if (open) {
      const validStatus = (item.status && statusConfig[item.status as StatusType]) 
        ? item.status as StatusType 
        : "IDEA";
      
      reset({
        title: item.title || "",
        activity: item.activity || "",
        location: item.location || "",
        scheduledAt: item.scheduledAt ? new Date(item.scheduledAt).toISOString().split("T")[0] : "",
        costEstimate: item.costEstimate ? item.costEstimate.toString() : "",
        status: validStatus,
        rating: item.rating ? item.rating.toString() : "5",
        notes: item.notes || "",
      });
      setSelectedStatus(validStatus);
    }
  }, [open, item, reset]);

  const handleStatusSelect = (status: StatusType) => {
    setSelectedStatus(status);
    setValue("status", status, { shouldDirty: true });
  };

  const onUpdateSubmit = async (data: EditDateInputs) => {
    try {
      setUpdating(true);
      await updateDateAction(item.id, {
        ...data,
        rating: data.status === "COMPLETED" ? Number(data.rating) : null,
      });
      router.refresh();
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      alert("Failed to modify date metrics.");
    } finally {
      setUpdating(false);
    }
  };

  const currentStatus = statusConfig[selectedStatus] || defaultStatusConfig;
  const StatusIcon = currentStatus.icon;
  const currentStatusWatch = watch("status");

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
                  <Heart className="h-5 w-5" />
                </div>
                <DialogTitle className="text-xl font-bold">
                  Edit Date Night
                </DialogTitle>
              </div>
              <DialogDescription className="text-white/80 text-sm max-w-xs">
                Update details, track progress, or rate your experience
              </DialogDescription>
            </div>
            
            <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 text-xs font-medium px-3 py-1.5">
              <StatusIcon className="h-3.5 w-3.5 mr-1.5" />
              {currentStatus.label}
            </Badge>
          </div>

          {/* Date preview */}
          <div className="mt-4 p-3 bg-white/10 backdrop-blur-sm rounded-xl">
            <p className="text-xs font-medium text-white/70 uppercase tracking-wider mb-1">
              Current Date
            </p>
            <p className="text-lg font-bold truncate">
              {item.title}
            </p>
            <div className="flex items-center gap-3 mt-1 text-sm text-white/80">
              {item.activity && (
                <span className="flex items-center gap-1">
                  <Activity className="h-3.5 w-3.5" />
                  {item.activity}
                </span>
              )}
              {item.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {item.location}
                </span>
              )}
            </div>
            {item.rating && (
              <div className="flex items-center gap-1 mt-1 text-sm text-white/80">
                <Star className="h-3.5 w-3.5 fill-current" />
                <span>{item.rating}/5 rating</span>
              </div>
            )}
          </div>
        </div>

        {/* Form */}
        <div className="p-5 sm:p-6">
          <form onSubmit={handleSubmit(onUpdateSubmit)} className="space-y-5">
            {/* Title */}
            <div className="space-y-1.5">
              <Label
                htmlFor="edit-title"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"
              >
                <Heart className="h-3 w-3 text-rose-400" />
                Date Title
              </Label>
              <Input
                id="edit-title"
                required
                placeholder="Date title..."
                className="w-full border-2 focus:border-rose-400 focus:ring-rose-400/20 transition"
                {...register("title", { required: "Title is required" })}
              />
            </div>

            {/* Activity & Location */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label
                  htmlFor="edit-activity"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"
                >
                  <Activity className="h-3 w-3 text-purple-400" />
                  Activity
                </Label>
                <Input
                  id="edit-activity"
                  required
                  placeholder="What to do..."
                  className="w-full border-2 focus:border-rose-400 focus:ring-rose-400/20 transition"
                  {...register("activity", { required: "Activity is required" })}
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="edit-location"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"
                >
                  <MapPin className="h-3 w-3 text-rose-400" />
                  Venue
                </Label>
                <Input
                  id="edit-location"
                  required
                  placeholder="Where..."
                  className="w-full border-2 focus:border-rose-400 focus:ring-rose-400/20 transition"
                  {...register("location", { required: "Location is required" })}
                />
              </div>
            </div>

            {/* Date & Budget */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label
                  htmlFor="edit-date"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"
                >
                  <Calendar className="h-3 w-3 text-blue-400" />
                  Date
                </Label>
                <Input
                  id="edit-date"
                  type="date"
                  required
                  className="w-full border-2 focus:border-rose-400 focus:ring-rose-400/20 transition"
                  {...register("scheduledAt", { required: "Date is required" })}
                />
              </div>
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
                  className="w-full border-2 focus:border-rose-400 focus:ring-rose-400/20 transition"
                  {...register("costEstimate")}
                />
              </div>
            </div>

            {/* Status Selection Cards */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-amber-400" />
                Date Status
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
                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 border-2 border-background flex items-center justify-center">
                          <CheckCircle2 className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              <input type="hidden" {...register("status")} value={selectedStatus} />
            </div>

            {/* Dynamic Rating Section */}
            {currentStatusWatch === "COMPLETED" && (
              <div className="space-y-2 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 p-4 rounded-xl border-2 border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-semibold text-sm">
                  <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <Star className="h-4 w-4 fill-current" />
                  </div>
                  <span>Rate Your Experience</span>
                </div>
                <select
                  id="edit-rating"
                  className="w-full h-10 px-3 rounded-lg border-2 border-purple-200 dark:border-purple-800 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                  {...register("rating")}
                >
                  <option value="5">⭐⭐⭐⭐⭐ Absolutely Magical (5/5)</option>
                  <option value="4">⭐⭐⭐⭐ Really Wonderful Night (4/5)</option>
                  <option value="3">⭐⭐⭐ Had Some Great Moments (3/5)</option>
                  <option value="2">⭐⭐ Not Our Best Night (2/5)</option>
                  <option value="1">⭐ Let's Not Repeat This (1/5)</option>
                </select>
                <p className="text-xs text-muted-foreground">
                  Your rating helps remember which dates were extra special!
                </p>
              </div>
            )}

            {/* Notes */}
            <div className="space-y-1.5">
              <Label
                htmlFor="edit-notes"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"
              >
                <StickyNote className="h-3 w-3 text-amber-400" />
                Memories & Notes
              </Label>
              <Textarea
                id="edit-notes"
                placeholder="Special moments, funny stories, things to remember..."
                className="w-full resize-none min-h-[80px] border-2 focus:border-rose-400 focus:ring-rose-400/20 transition"
                rows={2}
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
                className="flex-1 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Save Date Capsule
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
            {item.rating ? `⭐ ${item.rating}/5 rated` : "💝 Date night"}
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}