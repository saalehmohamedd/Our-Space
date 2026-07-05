// src/components/wishlist/wishlist-edit-dialog.tsx
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { updateWishlistItemAction } from "@/app/actions/wishlist";
import { createTransaction } from "@/app/actions/cards.actions";
import { showToast } from "@/lib/toast";
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
  StickyNote,
  Sparkles,
  X,
  TrendingUp,
  ShoppingBag,
  Heart,
  Star,
  ArrowUp,
  Minus,
  ArrowDown,
  CheckCircle2,
  PiggyBank,
  Lightbulb,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WishlistItemType {
  id: string;
  name: string;
  price: any;
  link: string | null;
  notes: string | null;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "WANT" | "SAVING" | "BOUGHT";
  cardId?: string | null;
}

interface WishlistEditDialogProps {
  item: WishlistItemType;
  cards?: Array<{
    id: string;
    nickname: string;
    brand: string;
    last4: string;
    colorTheme: string;
    balance: string;
  }>;
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
  LOW: { label: "Low", icon: Minus, color: "text-slate-500", bg: "bg-slate-100 dark:bg-slate-800", border: "border-slate-300 dark:border-slate-600" },
  MEDIUM: { label: "Medium", icon: ArrowUp, color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-900/30", border: "border-amber-300 dark:border-amber-700" },
  HIGH: { label: "High", icon: ArrowDown, color: "text-rose-500", bg: "bg-rose-100 dark:bg-rose-900/30", border: "border-rose-300 dark:border-rose-700" },
};

const statusConfig = {
  WANT: { label: "Want It", icon: Lightbulb, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30", gradient: "from-blue-500 to-cyan-500" },
  SAVING: { label: "Saving Up", icon: PiggyBank, color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-900/30", gradient: "from-amber-500 to-orange-500" },
  BOUGHT: { label: "Secured!", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-100 dark:bg-emerald-900/30", gradient: "from-emerald-500 to-green-500" },
};

export function WishlistEditDialog({ item, cards = [], open, onOpenChange }: WishlistEditDialogProps) {
  const [updating, setUpdating] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState<"LOW" | "MEDIUM" | "HIGH">(item.priority);
  const [selectedStatus, setSelectedStatus] = useState<"WANT" | "SAVING" | "BOUGHT">(item.status);
  const [selectedCardId, setSelectedCardId] = useState<string>(item.cardId || "");
  const router = useRouter();

  const { register, handleSubmit, formState: { isDirty }, reset, setValue, watch } = useForm<EditWishlistInputs>({
    values: {
      name: item.name,
      price: item.price ? item.price.toString() : "",
      link: item.link || "",
      notes: item.notes || "",
      priority: item.priority,
      status: item.status,
    },
  });

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
      setSelectedCardId(item.cardId || "");
    }
  }, [open, item, reset]);

  const watchPrice = watch("price");
  const safeCards = Array.isArray(cards) ? cards : [];
  const showCardPicker = selectedStatus === "BOUGHT" && watchPrice && parseFloat(watchPrice) > 0 && safeCards.length > 0;

  const getCardGradient = (colorTheme: string) => {
    const gradients: Record<string, string> = {
      indigo: "from-indigo-600 to-blue-500", rose: "from-rose-600 to-orange-400",
      emerald: "from-emerald-600 to-teal-500", violet: "from-violet-600 to-fuchsia-500",
      amber: "from-amber-600 to-red-500", slate: "from-slate-700 to-gray-500",
    };
    return gradients[colorTheme] || gradients.indigo;
  };

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
      await updateWishlistItemAction(item.id, { ...data, cardId: selectedCardId || null } as any);

      if (data.status === "BOUGHT" && data.price && parseFloat(data.price) > 0 && selectedCardId) {
        try {
          await createTransaction({
            cardId: selectedCardId,
            amount: parseFloat(data.price),
            sourceType: "WISHLIST",
            sourceId: item.id,
            note: `Purchased: ${data.name}`,
          });
          showToast.success("Updated & transaction recorded! 💳");
        } catch (err) {
          showToast.success("Updated but transaction failed");
        }
      } else {
        showToast.success("Item updated! ✨");
      }

      router.refresh();
      onOpenChange(false);
    } catch (err) {
      showToast.error("Failed to update item");
    } finally {
      setUpdating(false);
    }
  };

  const currentPriority = priorityConfig[selectedPriority];
  const currentStatus = statusConfig[selectedStatus];
  const StatusIcon = currentStatus.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[92vw] max-w-[500px] rounded-2xl p-0 gap-0 overflow-hidden border-0 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className={`relative bg-gradient-to-r ${currentStatus.gradient} p-6 sm:p-8 text-white`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Gift className="h-5 w-5" />
                </div>
                <DialogTitle className="text-xl font-bold">Edit Item</DialogTitle>
              </div>
              <DialogDescription className="text-white/80 text-sm max-w-xs">Update your wishlist item details</DialogDescription>
            </div>
            <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 text-xs font-medium px-3 py-1.5">
              <StatusIcon className="h-3.5 w-3.5 mr-1.5" />{currentStatus.label}
            </Badge>
          </div>
          <div className="mt-4 p-3 bg-white/10 backdrop-blur-sm rounded-xl">
            <p className="text-xs font-medium text-white/70 uppercase tracking-wider mb-1">Current Item</p>
            <p className="text-lg font-bold truncate">{item.name}</p>
            {item.price && <p className="text-sm text-white/80 mt-1">${parseFloat(item.price.toString()).toFixed(2)}</p>}
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <form onSubmit={handleSubmit(onUpdateSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="edit-name" className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1.5">
                <Heart className="h-3 w-3 text-rose-400" /> Item Name
              </Label>
              <Input id="edit-name" placeholder="What do you want?" className="w-full border-2 focus:border-indigo-400 transition" required {...register("name")} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1.5">
                  <DollarSign className="h-3 w-3 text-emerald-400" /> Price ($)
                </Label>
                <Input type="number" step="0.01" min="0" placeholder="0.00" className="w-full border-2 focus:border-indigo-400 transition" {...register("price")} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1.5">
                  <TrendingUp className="h-3 w-3 text-purple-400" /> Link
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
              <input type="hidden" {...register("priority")} value={selectedPriority} />
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
              <input type="hidden" {...register("status")} value={selectedStatus} />
            </div>

            {/* Card Picker - Shows when BOUGHT + price > 0 + cards exist */}
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
              <Textarea placeholder="Any additional details..." className="w-full resize-none min-h-[80px] border-2 focus:border-indigo-400 transition" rows={3} {...register("notes")} />
            </div>

            <div className="flex items-center gap-3 pt-3">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={updating}>
                <X className="h-4 w-4 mr-1.5" /> Cancel
              </Button>
              <Button type="submit" disabled={updating || !isDirty} className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg disabled:opacity-50">
                {updating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : <><Sparkles className="mr-2 h-4 w-4" /> Save Changes</>}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}