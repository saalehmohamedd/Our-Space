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
  PlusCircle,
  Loader2,
  Sparkles,
  Gift,
  DollarSign,
  Link as LinkIcon,
  StickyNote,
  Star,
  ShoppingBag,
  Heart,
  ArrowUp,
  Minus,
  ArrowDown,
  CheckCircle2,
} from "lucide-react";
import { createWishlistItemAction } from "@/app/actions/wishlist";

interface WishlistFormInputs {
  name: string;
  price: string;
  link: string;
  notes: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
}

const priorityConfig = {
  LOW: {
    label: "Low",
    icon: Minus,
    color: "text-slate-500",
    bg: "bg-slate-100 dark:bg-slate-800",
    border: "border-slate-300 dark:border-slate-600",
    description: "Nice to have",
  },
  MEDIUM: {
    label: "Medium",
    icon: ArrowUp,
    color: "text-amber-500",
    bg: "bg-amber-100 dark:bg-amber-900/30",
    border: "border-amber-300 dark:border-amber-700",
    description: "Would really like",
  },
  HIGH: {
    label: "High",
    icon: ArrowDown,
    color: "text-rose-500",
    bg: "bg-rose-100 dark:bg-rose-900/30",
    border: "border-rose-300 dark:border-rose-700",
    description: "Must have soon",
  },
};

export function WishlistCreationDialog() {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");

  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid },
    watch,
    setValue,
  } = useForm<WishlistFormInputs>({
    defaultValues: {
      priority: "MEDIUM",
    },
    mode: "onChange",
  });

  const watchName = watch("name");
  const watchPrice = watch("price");

  const handlePrioritySelect = (priority: "LOW" | "MEDIUM" | "HIGH") => {
    setSelectedPriority(priority);
    setValue("priority", priority);
  };

  const onSubmit = async (data: WishlistFormInputs) => {
    try {
      setSubmitting(true);
      await createWishlistItemAction(data);
      reset();
      setSelectedPriority("MEDIUM");
      setOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to pin wishlist item.");
    } finally {
      setSubmitting(false);
    }
  };

  const currentPriority = priorityConfig[selectedPriority];
  const PriorityIcon = currentPriority.icon;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300">
          <PlusCircle className="h-4 w-4" />
          Add Wishlist Entry
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[92vw] max-w-[500px] rounded-2xl p-0 gap-0 overflow-hidden border-0 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-indigo-400 via-purple-400 to-indigo-500 p-6 sm:p-8 text-white">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Gift className="h-5 w-5" />
              </div>
              <DialogTitle className="text-xl font-bold">
                Add to Wishlist
              </DialogTitle>
            </div>
            <DialogDescription className="text-white/80 text-sm max-w-xs">
              Save gift ideas, experiences, or things you're saving for
            </DialogDescription>
          </div>

          {/* Preview card */}
          {(watchName || watchPrice) && (
            <div className="mt-4 p-3 bg-white/10 backdrop-blur-sm rounded-xl">
              <p className="text-xs font-medium text-white/70 uppercase tracking-wider mb-1">
                Preview
              </p>
              <p className="text-lg font-bold">
                {watchName || "Untitled Item"}
              </p>
              {watchPrice && (
                <p className="text-sm text-white/80 mt-1">
                  ${parseFloat(watchPrice).toFixed(2)}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Form */}
        <div className="p-5 sm:p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Item Name */}
            <div className="space-y-1.5">
              <Label
                htmlFor="name"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"
              >
                <Heart className="h-3 w-3 text-rose-400" />
                Item Name
              </Label>
              <Input
                id="name"
                required
                placeholder="Matching winter sweaters..."
                className="w-full border-2 focus:border-indigo-400 focus:ring-indigo-400/20 transition"
                {...register("name", { required: "Item name is required" })}
              />
            </div>

            {/* Price & Link Row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label
                  htmlFor="price"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"
                >
                  <DollarSign className="h-3 w-3 text-emerald-400" />
                  Price ($)
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="w-full border-2 focus:border-indigo-400 focus:ring-indigo-400/20 transition"
                  {...register("price")}
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="link"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"
                >
                  <LinkIcon className="h-3 w-3 text-blue-400" />
                  Link
                </Label>
                <Input
                  id="link"
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
                        {config.label}
                      </span>
                      <span className="text-[10px] text-muted-foreground leading-tight text-center">
                        {config.description}
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
              <input type="hidden" {...register("priority")} value={selectedPriority} />
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <Label
                htmlFor="notes"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"
              >
                <StickyNote className="h-3 w-3 text-amber-400" />
                Notes
              </Label>
              <Textarea
                id="notes"
                placeholder="Size, color, store details..."
                className="w-full resize-none min-h-[80px] border-2 focus:border-indigo-400 focus:ring-indigo-400/20 transition"
                rows={3}
                {...register("notes")}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300"
              disabled={submitting || !watchName}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding to Wishlist...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Save to Wishlist
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-3 bg-muted/30 border-t flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${currentPriority.color.replace('text', 'bg')}`} />
            <span>{currentPriority.label} priority</span>
          </div>
          <span>
            {watchName ? "Ready to save" : "Fill in item name"}
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}