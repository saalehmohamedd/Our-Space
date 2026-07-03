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
} from "lucide-react";
import { updateShoppingItemAction } from "@/app/actions/shopping";

interface ShoppingItem {
  id: string;
  name: string;
  category: string | null;
  quantity: number;
  checked: boolean;
}

interface EditShoppingDialogProps {
  item: ShoppingItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categories = [
  { value: "groceries", label: "Groceries", icon: Apple, color: "text-green-500" },
  { value: "household", label: "Household", icon: Home, color: "text-blue-500" },
  { value: "personal", label: "Personal", icon: Package, color: "text-purple-500" },
  { value: "other", label: "Other", icon: ShoppingBag, color: "text-orange-500" },
];

export function EditShoppingDialog({ item, open, onOpenChange }: EditShoppingDialogProps) {
  const [updating, setUpdating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(item.category || "groceries");

  const { register, handleSubmit, reset } = useForm({
    values: {
      name: item.name,
      quantity: item.quantity.toString(),
    },
  });

  React.useEffect(() => {
    if (open) {
      reset({
        name: item.name,
        quantity: item.quantity.toString(),
      });
      setSelectedCategory(item.category || "groceries");
    }
  }, [open, item, reset]);

  const onSubmit = async (data: any) => {
    try {
      setUpdating(true);
      await updateShoppingItemAction(item.id, {
        name: data.name,
        category: selectedCategory,
        quantity: parseInt(data.quantity) || 1,
      });
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update item.");
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
              <DialogDescription className="text-white/80 text-sm">
                Update item details
              </DialogDescription>
            </div>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase">Item Name</Label>
              <Input required {...register("name")} className="border-2 focus:border-emerald-400" />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase">Category</Label>
              <div className="grid grid-cols-4 gap-2">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory === cat.value;
                  return (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setSelectedCategory(cat.value)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all ${
                        isSelected
                          ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 shadow-md"
                          : "border-transparent bg-muted/30 hover:bg-muted/50"
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${cat.color}`} />
                      <span className="text-[10px] font-medium">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase">Quantity</Label>
              <Input type="number" min="1" {...register("quantity")} className="border-2 focus:border-emerald-400" />
            </div>

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