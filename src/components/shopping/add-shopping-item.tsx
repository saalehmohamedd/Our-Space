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
import { Label } from "@/components/ui/label";
import {
  PlusCircle,
  Sparkles,
  ShoppingBag,
  Apple,
  Home,
  Package,
  DollarSign,
  CreditCard,
  CheckCircle2,
  Image as ImageIcon,
} from "lucide-react";
import { createShoppingItemAction } from "@/app/actions/shopping";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

const categories = [
  { value: "groceries", label: "Groceries", icon: Apple, color: "text-green-500" },
  { value: "household", label: "Household", icon: Home, color: "text-blue-500" },
  { value: "personal", label: "Personal", icon: Package, color: "text-purple-500" },
  { value: "other", label: "Other", icon: ShoppingBag, color: "text-orange-500" },
];

interface AddShoppingItemProps {
  cards?: Array<{
    id: string;
    nickname: string;
    brand: string;
    last4: string;
    colorTheme: string;
    balance: string;
  }>;
}

export function AddShoppingItem({ cards = [] }: AddShoppingItemProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("groceries");
  const [selectedCardId, setSelectedCardId] = useState("");

  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: { name: "", quantity: "1", cost: "", productUrl: "" },
  });

  const watchName = watch("name");
  const watchCost = watch("cost");
  const watchProductUrl = watch("productUrl");
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
      setSubmitting(true);
      await createShoppingItemAction({
        name: data.name,
        category: selectedCategory || undefined,
        quantity: parseInt(data.quantity) || 1,
        productUrl: data.productUrl || undefined,
        cost: data.cost ? parseFloat(data.cost) : undefined,
        cardId: selectedCardId || undefined,
      });

      showToast.success("Item added to shopping list 🛒");
      reset();
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
        <Button className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/25">
          <PlusCircle className="h-4 w-4" />
          Add Item
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[92vw] max-w-[425px] rounded-2xl p-0 gap-0 overflow-hidden border-0 shadow-2xl">
        <div className="relative bg-gradient-to-br from-emerald-400 to-teal-500 p-6 text-white">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">Add Item</DialogTitle>
              <DialogDescription className="text-white/80 text-sm">
                Add something to your shared shopping list
              </DialogDescription>
            </div>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Item Name */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase text-muted-foreground">Item Name</Label>
              <Input required placeholder="What do you need?" className="w-full border-2 focus:border-emerald-400 transition" {...register("name")} />
            </div>

            {/* Product Image URL with Live Preview */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase text-muted-foreground flex justify-between">
                <span>Image URL</span>
                <span className="text-[10px] font-normal lowercase opacity-70">(Optional)</span>
              </Label>
              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-md bg-muted border flex items-center justify-center overflow-hidden flex-shrink-0">
                  {watchProductUrl ? (
                    <img 
                      src={watchProductUrl} 
                      alt="Preview" 
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        e.currentTarget.parentElement?.classList.add('fallback-icon');
                      }}
                      onLoad={(e) => {
                        (e.target as HTMLImageElement).style.display = 'block';
                      }}
                    />
                  ) : (
                    <ImageIcon className="h-4 w-4 text-muted-foreground/50" />
                  )}
                </div>
                <div className="flex-1">
                  <Input 
                    placeholder="Paste direct image link (e.g., .jpg, .png)" 
                    className="w-full border-2 focus:border-emerald-400 transition" 
                    {...register("productUrl")} 
                  />
                </div>
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2.5">
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

            {/* Quantity & Cost */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase text-muted-foreground">Quantity</Label>
                <Input type="number" min="1" className="w-full border-2 focus:border-emerald-400 transition" {...register("quantity")} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1">
                  <DollarSign className="h-3 w-3" /> Cost ($)
                </Label>
                <Input type="number" step="0.01" min="0" placeholder="0.00" className="w-full border-2 focus:border-emerald-400 transition" {...register("cost")} />
              </div>
            </div>

            {/* Card Picker */}
            {watchCost && parseFloat(watchCost) > 0 && safeCards.length > 0 && (
              <div className="space-y-2 p-3 rounded-xl bg-muted/30 border-2 border-dashed">
                <Label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1.5">
                  <CreditCard className="h-3 w-3 text-indigo-400" /> Link Card (Optional)
                </Label>
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  Amount will be deducted when you check this item as bought
                </p>
                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {safeCards.map((card) => (
                    <button key={card.id} type="button"
                      onClick={() => setSelectedCardId(selectedCardId === card.id ? "" : card.id)}
                      className={cn(
                        "w-full flex items-center gap-2.5 p-2.5 rounded-lg border transition-all text-left",
                        selectedCardId === card.id
                          ? "border-indigo-400 bg-indigo-50 dark:bg-indigo-950/20 shadow-sm"
                          : "border-transparent bg-background hover:bg-muted/50 dark:hover:bg-muted/30"
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

            <Button type="submit" disabled={submitting || !watchName} className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg">
              <Sparkles className="mr-2 h-4 w-4" /> Add to List
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}