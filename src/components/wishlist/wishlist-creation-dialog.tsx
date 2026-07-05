// src/components/wishlist/wishlist-creation-dialog.tsx
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
  Sparkles,
  Gift,
  DollarSign,
  Link as LinkIcon,
  StickyNote,
  Star,
  Heart,
  ArrowUp,
  Minus,
  ArrowDown,
  CheckCircle2,
  Lightbulb,
  Calendar,
  ShoppingBag,
  PiggyBank,
  TrendingUp,
  CreditCard,
  Loader2,
} from "lucide-react";
import { createWishlistItemAction } from "@/app/actions/wishlist";
import { createTransaction } from "@/app/actions/cards.actions";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

interface CardType {
  id: string;
  nickname: string;
  brand: string;
  last4: string;
  colorTheme: string;
  balance: string;
}

interface WishlistCreationDialogProps {
  cards?: CardType[];
}

const priorityConfig = {
  LOW: { label: "Low", icon: Minus, color: "text-slate-500", bg: "bg-slate-100 dark:bg-slate-800", border: "border-slate-300 dark:border-slate-600" },
  MEDIUM: { label: "Medium", icon: ArrowUp, color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-900/30", border: "border-amber-300 dark:border-amber-700" },
  HIGH: { label: "High", icon: ArrowDown, color: "text-rose-500", bg: "bg-rose-100 dark:bg-rose-900/30", border: "border-rose-300 dark:border-rose-700" },
};

const statusConfig = {
  WANT: { label: "Want It", icon: Lightbulb, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30", gradient: "from-blue-500 to-cyan-500" },
  SAVING: { label: "Saving Up", icon: PiggyBank, color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-900/30", gradient: "from-amber-500 to-orange-500" },
  BOUGHT: { label: "Secured!", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-100 dark:bg-emerald-900/30", gradient: "from-emerald-500 to-green-500" },
};

export function WishlistCreationDialog({ cards = [] }: WishlistCreationDialogProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
  const [selectedStatus, setSelectedStatus] = useState<"WANT" | "SAVING" | "BOUGHT">("WANT");
  const [selectedCardId, setSelectedCardId] = useState("");

  const { register, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: {
      name: "",
      price: "",
      link: "",
      notes: "",
      priority: "MEDIUM",
      status: "WANT",
    },
  });

  const watchName = watch("name");
  const watchPrice = watch("price");
  const watchStatus = watch("status");

  const safeCards = Array.isArray(cards) ? cards : [];
  const currentPriority = priorityConfig[selectedPriority];
  const currentStatus = statusConfig[selectedStatus];
  const StatusIcon = currentStatus.icon;

  const showCardPicker = selectedStatus === "BOUGHT" && watchPrice && parseFloat(watchPrice) > 0 && safeCards.length > 0;

  const getCardGradient = (colorTheme: string) => {
    const gradients: Record<string, string> = {
      indigo: "from-indigo-600 to-blue-500",
      rose: "from-rose-600 to-orange-400",
      emerald: "from-emerald-600 to-teal-500",
      violet: "from-violet-600 to-fuchsia-500",
      amber: "from-amber-600 to-red-500",
      slate: "from-slate-700 to-gray-500",
    };
    return gradients[colorTheme] || gradients.indigo;
  };

  const handlePrioritySelect = (priority: "LOW" | "MEDIUM" | "HIGH") => {
    setSelectedPriority(priority);
    setValue("priority", priority);
  };

  const handleStatusSelect = (status: "WANT" | "SAVING" | "BOUGHT") => {
    setSelectedStatus(status);
    setValue("status", status);
  };

  const onSubmit = async (data: any) => {
    try {
      setSubmitting(true);
      const result = await createWishlistItemAction({
        ...data,
        priority: selectedPriority,
        status: selectedStatus,
        cardId: selectedCardId || null,
      });

      // If bought with price and card, create transaction
      if (selectedStatus === "BOUGHT" && data.price && parseFloat(data.price) > 0 && selectedCardId) {
        try {
          await createTransaction({
            cardId: selectedCardId,
            amount: parseFloat(data.price),
            sourceType: "WISHLIST",
            sourceId: result.id,
            note: `Purchased: ${data.name}`,
          });
          showToast.success("Item added & transaction recorded! 💳", `$${parseFloat(data.price).toFixed(2)} deducted`);
        } catch (err) {
          showToast.success("Item added but transaction failed");
        }
      } else {
        showToast.success("Item added to wishlist! 🎁");
      }

      reset();
      setSelectedPriority("MEDIUM");
      setSelectedStatus("WANT");
      setSelectedCardId("");
      setOpen(false);
    } catch (err) {
      showToast.error("Failed to add item");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg shadow-indigo-500/25">
          <PlusCircle className="h-4 w-4" />
          Add Wishlist Entry
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[92vw] max-w-[500px] rounded-2xl p-0 gap-0 overflow-hidden border-0 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className={`relative bg-gradient-to-r ${currentStatus.gradient} p-6 sm:p-8 text-white`}>
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Gift className="h-5 w-5" />
              </div>
              <DialogTitle className="text-xl font-bold">Add to Wishlist</DialogTitle>
            </div>
            <DialogDescription className="text-white/80 text-sm max-w-xs">
              Save gift ideas, experiences, or things you're saving for
            </DialogDescription>
          </div>

          {(watchName || watchPrice) && (
            <div className="mt-4 p-3 bg-white/10 backdrop-blur-sm rounded-xl">
              <p className="text-xs font-medium text-white/70 uppercase tracking-wider mb-1">Preview</p>
              <p className="text-lg font-bold">{watchName || "Untitled Item"}</p>
              {watchPrice && <p className="text-sm text-white/80 mt-1">${parseFloat(watchPrice).toFixed(2)}</p>}
            </div>
          )}
        </div>

        <div className="p-5 sm:p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Item Name */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Heart className="h-3 w-3 text-rose-400" /> Item Name
              </Label>
              <Input required placeholder="Matching winter sweaters..." className="w-full border-2 focus:border-indigo-400 transition" {...register("name")} />
            </div>

            {/* Price & Link */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1.5">
                  <DollarSign className="h-3 w-3 text-emerald-400" /> Price ($)
                </Label>
                <Input type="number" step="0.01" min="0" placeholder="0.00" className="w-full border-2 focus:border-indigo-400 transition" {...register("price")} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1.5">
                  <LinkIcon className="h-3 w-3 text-blue-400" /> Link
                </Label>
                <Input type="url" placeholder="https://..." className="w-full border-2 focus:border-indigo-400 transition" {...register("link")} />
              </div>
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1.5">
                <Star className="h-3 w-3 text-amber-400" /> Priority
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(priorityConfig).map(([key, config]) => {
                  const Icon = config.icon;
                  const isSelected = selectedPriority === key;
                  return (
                    <button key={key} type="button" onClick={() => handlePrioritySelect(key as any)}
                      className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${isSelected ? `${config.border} ${config.bg} shadow-md scale-105` : "border-transparent bg-muted/30 hover:bg-muted/50"}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isSelected ? config.bg : "bg-muted"}`}>
                        <Icon className={`h-4 w-4 ${isSelected ? config.color : "text-muted-foreground"}`} />
                      </div>
                      <span className={`text-xs font-medium ${isSelected ? config.color : "text-muted-foreground"}`}>{config.label}</span>
                      {isSelected && <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-500 border-2 border-background flex items-center justify-center"><CheckCircle2 className="h-3 w-3 text-white" /></div>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1.5">
                <ShoppingBag className="h-3 w-3 text-indigo-400" /> Status
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(statusConfig).map(([key, config]) => {
                  const Icon = config.icon;
                  const isSelected = selectedStatus === key;
                  return (
                    <button key={key} type="button" onClick={() => handleStatusSelect(key as any)}
                      className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${isSelected ? `${config.bg} border-indigo-300 shadow-md scale-105` : "border-transparent bg-muted/30 hover:bg-muted/50"}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isSelected ? config.bg : "bg-muted"}`}>
                        <Icon className={`h-4 w-4 ${isSelected ? config.color : "text-muted-foreground"}`} />
                      </div>
                      <span className={`text-xs font-medium ${isSelected ? config.color : "text-muted-foreground"}`}>{config.label}</span>
                      {isSelected && <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-500 border-2 border-background flex items-center justify-center"><CheckCircle2 className="h-3 w-3 text-white" /></div>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Card Picker - Shown when BOUGHT + price > 0 + cards exist */}
            {showCardPicker && (
              <div className="space-y-2 p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-200 dark:border-emerald-800">
                <Label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1.5">
                  <CreditCard className="h-3 w-3 text-emerald-400" /> Pay with Card
                </Label>
                <p className="text-xs text-muted-foreground">
                  ${parseFloat(watchPrice).toFixed(2)} will be deducted from the selected card
                </p>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {safeCards.map((card) => (
                    <button
                      key={card.id}
                      type="button"
                      onClick={() => setSelectedCardId(selectedCardId === card.id ? "" : card.id)}
                      className={cn(
                        "w-full flex items-center gap-3 p-2.5 rounded-lg border-2 transition-all text-left",
                        selectedCardId === card.id
                          ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 shadow-sm"
                          : "border-transparent bg-white dark:bg-muted/20 hover:border-emerald-200"
                      )}
                    >
                      <div className={cn("w-10 h-6 rounded bg-gradient-to-br flex-shrink-0", getCardGradient(card.colorTheme))} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{card.nickname}</p>
                        <p className="text-xs text-muted-foreground">•••• {card.last4} • ${parseFloat(card.balance).toFixed(2)}</p>
                      </div>
                      {selectedCardId === card.id && <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1.5">
                <StickyNote className="h-3 w-3 text-amber-400" /> Notes
              </Label>
              <Textarea placeholder="Size, color, store details..." className="w-full resize-none min-h-[80px] border-2 focus:border-indigo-400 transition" rows={3} {...register("notes")} />
            </div>

            <Button type="submit" disabled={submitting || !watchName} className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg">
              {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...</> : <><Sparkles className="mr-2 h-4 w-4" /> Save to Wishlist</>}
            </Button>
          </form>
        </div>

        <div className="px-5 sm:px-6 py-3 bg-muted/30 border-t flex items-center justify-between text-xs text-muted-foreground">
          <span>{selectedPriority} priority</span>
          <span>{watchName ? "Ready to save" : "Fill in item name"}</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}