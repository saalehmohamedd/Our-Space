"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { updateWishlistItemAction } from "@/app/actions/wishlist";
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
  Gift,
  DollarSign,
  Link as LinkIcon,
  StickyNote,
  Sparkles,
  X,
  TrendingUp,
  Clock,
  ShoppingBag,
  Heart,
  Star,
  ArrowUp,
  Minus,
  ArrowDown,
  CheckCircle2,
  PiggyBank,
  Lightbulb,
} from "lucide-react";

interface WishlistItemType {
  id: string;
  name: string;
  price: any;
  link: string | null;
  notes: string | null;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "WANT" | "SAVING" | "BOUGHT";
}

interface WishlistEditDialogProps {
  item: WishlistItemType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface EditWishlistInputs {
  name: string;
  price: string;
  link: string;
  notes: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "WANT" | "SAVING" | "BOUGHT";
}

const priorityConfig = {
  LOW: {
    label: "Low Priority",
    icon: Minus,
    color: "text-slate-500",
    bg: "bg-slate-100 dark:bg-slate-800",
    border: "border-slate-300 dark:border-slate-600",
    badge: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  },
  MEDIUM: {
    label: "Medium Priority",
    icon: ArrowUp,
    color: "text-amber-500",
    bg: "bg-amber-100 dark:bg-amber-900/30",
    border: "border-amber-300 dark:border-amber-700",
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  },
  HIGH: {
    label: "High Priority",
    icon: ArrowDown,
    color: "text-rose-500",
    bg: "bg-rose-100 dark:bg-rose-900/30",
    border: "border-rose-300 dark:border-rose-700",
    badge: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
  },
};

const statusConfig = {
  WANT: {
    label: "Want It",
    icon: Lightbulb,
    color: "text-blue-500",
    bg: "bg-blue-100 dark:bg-blue-900/30",
    gradient: "from-blue-500 to-cyan-500",
    description: "Just an idea or desire",
  },
  SAVING: {
    label: "Saving Up",
    icon: PiggyBank,
    color: "text-amber-500",
    bg: "bg-amber-100 dark:bg-amber-900/30",
    gradient: "from-amber-500 to-orange-500",
    description: "Working towards it",
  },
  BOUGHT: {
    label: "Secured!",
    icon: CheckCircle2,
    color: "text-emerald-500",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
    gradient: "from-emerald-500 to-green-500",
    description: "Already purchased",
  },
};

export function WishlistEditDialog({
  item,
  open,
  onOpenChange,
}: WishlistEditDialogProps) {
  const [updating, setUpdating] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState<"LOW" | "MEDIUM" | "HIGH">(item.priority);
  const [selectedStatus, setSelectedStatus] = useState<"WANT" | "SAVING" | "BOUGHT">(item.status);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { isDirty },
    reset,
    setValue,
  } = useForm<EditWishlistInputs>({
    values: {
      name: item.name,
      price: item.price ? item.price.toString() : "",
      link: item.link || "",
      notes: item.notes || "",
      priority: item.priority,
      status: item.status,
    },
  });

  // Reset form when dialog opens with different item
  React.useEffect(() => {
    if (open) {
      reset({
        name: item.name,
        price: item.price ? item.price.toString() : "",
        link: item.link || "",
        notes: item.notes || "",
        priority: item.priority,
        status: item.status,
      });
      setSelectedPriority(item.priority);
      setSelectedStatus(item.status);
    }
  }, [open, item, reset]);

  const handlePrioritySelect = (priority: "LOW" | "MEDIUM" | "HIGH") => {
    setSelectedPriority(priority);
    setValue("priority", priority, { shouldDirty: true });
  };

  const handleStatusSelect = (status: "WANT" | "SAVING" | "BOUGHT") => {
    setSelectedStatus(status);
    setValue("status", status, { shouldDirty: true });
  };

  const onUpdateSubmit = async (data: EditWishlistInputs) => {
    try {
      setUpdating(true);
      await updateWishlistItemAction(item.id, data);
      router.refresh();
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      alert("Failed to modify wishlist details.");
    } finally {
      setUpdating(false);
    }
  };

  const currentPriority = priorityConfig[selectedPriority];
  const currentStatus = statusConfig[selectedStatus];
  const PriorityIcon = currentPriority.icon;
  const StatusIcon = currentStatus.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[92vw] max-w-[500px] rounded-2xl p-0 gap-0 overflow-hidden border-0 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header with Status Banner */}
        <div className={`relative bg-gradient-to-r ${currentStatus.gradient} p-6 sm:p-8 text-white`}>
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Gift className="h-5 w-5" />
                </div>
                <DialogTitle className="text-xl font-bold">
                  Edit Item
                </DialogTitle>
              </div>
              <DialogDescription className="text-white/80 text-sm max-w-xs">
                Update your wishlist item details and track your progress
              </DialogDescription>
            </div>
            
            {/* Current status badge */}
            <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 text-xs font-medium px-3 py-1.5">
              <StatusIcon className="h-3.5 w-3.5 mr-1.5" />
              {currentStatus.label}
            </Badge>
          </div>

          {/* Item name preview */}
          <div className="mt-4 p-3 bg-white/10 backdrop-blur-sm rounded-xl">
            <p className="text-xs font-medium text-white/70 uppercase tracking-wider mb-1">
              Current Item
            </p>
            <p className="text-lg font-bold truncate">
              {item.name}
            </p>
            {item.price && (
              <p className="text-sm text-white/80 mt-1">
                ${parseFloat(item.price.toString()).toFixed(2)}
              </p>
            )}
          </div>
        </div>

        {/* Form Section */}
        <div className="p-5 sm:p-6 space-y-5">
          <form onSubmit={handleSubmit(onUpdateSubmit)} className="space-y-5">
            {/* Item Name */}
            <div className="space-y-1.5">
              <Label
                htmlFor="edit-name"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"
              >
                <Heart className="h-3 w-3 text-rose-400" />
                Item Name
              </Label>
              <Input
                id="edit-name"
                placeholder="What do you want?"
                className="w-full border-2 focus:border-indigo-400 focus:ring-indigo-400/20 transition"
                required
                {...register("name")}
              />
            </div>

            {/* Price & Priority Row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label
                  htmlFor="edit-price"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"
                >
                  <DollarSign className="h-3 w-3 text-emerald-400" />
                  Price ($)
                </Label>
                <Input
                  id="edit-price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="w-full border-2 focus:border-indigo-400 focus:ring-indigo-400/20 transition"
                  {...register("price")}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <TrendingUp className="h-3 w-3 text-purple-400" />
                  Link
                </Label>
                <Input
                  id="edit-link"
                  type="url"
                  placeholder="https://..."
                  className="w-full border-2 focus:border-indigo-400 focus:ring-indigo-400/20 transition"
                  {...register("link")}
                />
              </div>
            </div>

            {/* Priority Selection */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Star className="h-3 w-3 text-amber-400" />
                Priority Level
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(priorityConfig).map(([key, config]) => {
                  const Icon = config.icon;
                  const isSelected = selectedPriority === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handlePrioritySelect(key as "LOW" | "MEDIUM" | "HIGH")}
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
                        {config.label.split(" ")[0]}
                      </span>
                      {isSelected && (
                        <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full ${config.bg} border-2 border-background flex items-center justify-center`}>
                          <CheckCircle2 className="h-3 w-3 text-indigo-500" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              <input type="hidden" {...register("priority")} value={selectedPriority} />
            </div>

            {/* Status Selection */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <ShoppingBag className="h-3 w-3 text-indigo-400" />
                Status
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(statusConfig).map(([key, config]) => {
                  const Icon = config.icon;
                  const isSelected = selectedStatus === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleStatusSelect(key as "WANT" | "SAVING" | "BOUGHT")}
                      className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200 ${
                        isSelected
                          ? `${config.bg} border-indigo-300 dark:border-indigo-600 shadow-md scale-105`
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
                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-500 border-2 border-background flex items-center justify-center">
                          <CheckCircle2 className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              <input type="hidden" {...register("status")} value={selectedStatus} />
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <Label
                htmlFor="edit-notes"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"
              >
                <StickyNote className="h-3 w-3 text-amber-400" />
                Notes
              </Label>
              <Textarea
                id="edit-notes"
                placeholder="Any additional details, size, color preferences..."
                className="w-full resize-none min-h-[80px] border-2 focus:border-indigo-400 focus:ring-indigo-400/20 transition"
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
                className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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

        {/* Footer with quick actions */}
        <div className="px-5 sm:px-6 py-3 bg-muted/30 border-t flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${currentPriority.color.replace('text', 'bg')}`} />
            <span>{currentPriority.label}</span>
          </div>
          <span>
            Updated via edit dialog
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}