// src/components/shopping/edit-shopping-dialog.tsx
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
import { Label } from "@/components/ui/label";
import {
  Sparkles,
  X,
  Edit3,
  Apple,
  Home,
  Package,
  ShoppingBag,
  DollarSign,
  CreditCard,
  CheckCircle2,
} from "lucide-react";
import { updateShoppingItemAction } from "@/app/actions/shopping";
import { createTransaction } from "@/app/actions/cards.actions";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

interface ShoppingItem {
  id: string;
  name: string;
  category: string | null;
  quantity: number;
  checked: boolean;
  cost?: string | null;
  cardId?: string | null;
}

interface EditShoppingDialogProps {
  item: ShoppingItem;
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

const categories = [
  { value: "groceries", label: "Groceries", icon: Apple, color: "text-green-500" },
  { value: "household", label: "Household", icon: Home, color: "text-blue-500" },
  { value: "personal", label: "Personal", icon: Package, color: "text-purple-500" },
  { value: "other", label: "Other", icon: ShoppingBag, color: "text-orange-500" },
];

export function EditShoppingDialog({ item, cards = [], open, onOpenChange }: EditShoppingDialogProps) {
  const [updating, setUpdating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(item.category || "groceries");
  const [selectedCardId, setSelectedCardId] = useState(item.cardId || "");

  const { register, handleSubmit, reset, watch } = useForm({
    values: {
      name: item.name,
      quantity: item.quantity.toString(),
      cost: item.cost || "",
    },
  });

  React.useEffect(() => {
    if (open) {
      reset({
        name: item.name,
        quantity: item.quantity.toString(),
        cost: item.cost || "",
      });
      setSelectedCategory(item.category || "groceries");
      setSelectedCardId(item.cardId || "");
    }
  }, [open, item, reset]);

  const watchCost = watch("cost");
  const safeCards = Array.isArray(cards) ? cards : [];

  const getCardGradient = (colorTheme: string) => {
    const gradients: Record<string, string> = {
      indigo: "from-indigo-600 to-blue-500", rose: "from-rose-600 to-orange-400",
      emerald: "from-emerald-600 to-teal-500", violet: "from-violet-600 to-fuchsia-500",
      amber: "from-amber-600 to-red-500", slate: "from-slate-700 to-gray-500",
    };
    return gradients[colorTheme] || gradients.indigo;
  };

  const onSubmit = async (data: any) => {
    try {
      setUpdating(true);
      await updateShoppingItemAction(item.id, {
        name: data.name,
        category: selectedCategory,
        quantity: parseInt(data.quantity) || 1,
        cost: data.cost ? parseFloat(data.cost) : undefined,
        cardId: selectedCardId || undefined,
      });

      // If item is already checked and has cost/card, create transaction
      if (item.checked && data.cost && parseFloat(data.cost) > 0 && selectedCardId) {
        try {
          await createTransaction({
            cardId: selectedCardId,
            amount: parseFloat(data.cost),
            sourceType: "SHOPPING",
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

      onOpenChange(false);
    } catch (err) {
      showToast.error("Failed to update");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[92vw] max-w-[425px] rounded-2xl p-0 gap-0 overflow-hidden border-0 shadow-2xl">
        <div className="relative bg-gradient-to-br from-emerald-400 to-teal-500 p-6 text-white">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Edit3 className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">Edit Item</DialogTitle>
              <DialogDescription className="text-white/80 text-sm">Update item details</DialogDescription>
            </div>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase text-muted-foreground">Item Name</Label>
              <Input required {...register("name")} className="border-2 focus:border-emerald-400 transition" />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase text-muted-foreground">Category</Label>
              <div className="grid grid-cols-4 gap-2">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button key={cat.value} type="button" onClick={() => setSelectedCategory(cat.value)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all ${
                        selectedCategory === cat.value 
                          ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 shadow-md" 
                          : "border-transparent bg-muted/30 hover:bg-muted/50"
                      }`}>
                      <Icon className={`h-4 w-4 ${cat.color}`} />
                      <span className="text-[10px] font-medium">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase text-muted-foreground">Quantity</Label>
                <Input type="number" min="1" {...register("quantity")} className="border-2 focus:border-emerald-400 transition" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1">
                  <DollarSign className="h-3 w-3" /> Cost ($)
                </Label>
                <Input type="number" step="0.01" min="0" placeholder="0.00" {...register("cost")} className="border-2 focus:border-emerald-400 transition" />
              </div>
            </div>

            {/* Card Picker */}
            {safeCards.length > 0 && (
              <div className="space-y-2 p-3 rounded-xl bg-muted/30 border">
                <Label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1.5">
                  <CreditCard className="h-3 w-3" /> Linked Card
                </Label>
                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {safeCards.map((card) => (
                    <button key={card.id} type="button"
                      onClick={() => setSelectedCardId(selectedCardId === card.id ? "" : card.id)}
                      className={cn(
                        "w-full flex items-center gap-2.5 p-2.5 rounded-lg border transition-all text-left",
                        selectedCardId === card.id
                          ? "border-indigo-400 bg-indigo-50 dark:bg-indigo-950/20 shadow-sm"
                          : "border-transparent bg-background hover:bg-muted/50"
                      )}>
                      <div className={cn("w-9 h-6 rounded bg-gradient-to-br flex-shrink-0", getCardGradient(card.colorTheme))} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{card.nickname}</p>
                        <p className="text-[10px] text-muted-foreground">
                          •••• {card.last4} • ${parseFloat(card.balance).toFixed(2)}
                        </p>
                      </div>
                      {selectedCardId === card.id && (
                        <CheckCircle2 className="h-4 w-4 text-indigo-500 flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                <X className="h-4 w-4 mr-1" /> Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white" disabled={updating}>
                <Sparkles className="mr-2 h-4 w-4" /> Save
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}