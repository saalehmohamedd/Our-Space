// src/components/shopping/add-shopping-item.tsx
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
import { Label } from "@/components/ui/label";
import {
  PlusCircle,
  Sparkles,
  ShoppingBag,
  Apple,
  Home,
  Package,
  Hash,
} from "lucide-react";
import { createShoppingItemAction } from "@/app/actions/shopping";

interface ShoppingFormInputs {
  name: string;
  category: string;
  quantity: string;
}

const categories = [
  { value: "groceries", label: "Groceries", icon: Apple, color: "text-green-500" },
  { value: "household", label: "Household", icon: Home, color: "text-blue-500" },
  { value: "personal", label: "Personal", icon: Package, color: "text-purple-500" },
  { value: "other", label: "Other", icon: ShoppingBag, color: "text-orange-500" },
];

export function AddShoppingItem() {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("groceries");

  const { register, handleSubmit, reset, watch } = useForm<ShoppingFormInputs>({
    defaultValues: {
      quantity: "1",
    },
  });

  const watchName = watch("name");

  const onSubmit = async (data: ShoppingFormInputs) => {
    try {
      setSubmitting(true);
      await createShoppingItemAction({
        name: data.name,
        category: data.category || undefined,
        quantity: parseInt(data.quantity) || 1,
      });
      reset();
      setOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to add item.");
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
        {/* Header */}
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
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Item Name
              </Label>
              <Input
                required
                placeholder="What do you need?"
                className="w-full border-2 focus:border-emerald-400 transition"
                {...register("name")}
              />
            </div>

            {/* Category Selection */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Category
              </Label>
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
              <input type="hidden" {...register("category")} value={selectedCategory} />
            </div>

            {/* Quantity */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Quantity
              </Label>
              <Input
                type="number"
                min="1"
                className="w-full border-2 focus:border-emerald-400 transition"
                {...register("quantity")}
              />
            </div>

            <Button
              type="submit"
              disabled={submitting || !watchName}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Add to List
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}