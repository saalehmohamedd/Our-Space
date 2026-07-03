// src/components/shopping/shopping-list.tsx
"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ShoppingCart,
  Trash2,
  Edit3,
  CheckCircle2,
  Package,
  Apple,
  ShoppingBag,
  Home,
  Sparkles,
} from "lucide-react";
import {
  toggleShoppingItemAction,
  deleteShoppingItemAction,
  clearCheckedItemsAction,
} from "@/app/actions/shopping";
import { EditShoppingDialog } from "./edit-shopping-dialog";

interface ShoppingItem {
  id: string;
  name: string;
  category: string | null;
  quantity: number;
  checked: boolean;
  createdAt: Date;
}

interface ShoppingListProps {
  items: ShoppingItem[];
}

const categoryIcons: Record<string, React.ReactNode> = {
  groceries: <Apple className="h-4 w-4" />,
  household: <Home className="h-4 w-4" />,
  personal: <Package className="h-4 w-4" />,
  other: <ShoppingBag className="h-4 w-4" />,
};

const categoryColors: Record<string, string> = {
  groceries: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  household: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  personal: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  other: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
};

export function ShoppingList({ items }: ShoppingListProps) {
  const [editingItem, setEditingItem] = useState<ShoppingItem | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const uncheckedItems = items.filter((item) => !item.checked);
  const checkedItems = items.filter((item) => item.checked);

  const handleEdit = (item: ShoppingItem) => {
    setEditingItem(item);
    setIsEditOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Unchecked items */}
      <div className="space-y-3">
        {uncheckedItems.length > 0 && (
          <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            To Buy ({uncheckedItems.length})
          </h3>
        )}
        {uncheckedItems.map((item) => (
          <Card
            key={item.id}
            className="p-4 flex items-center gap-3 hover:shadow-md transition group"
          >
            <Checkbox
              checked={item.checked}
              onCheckedChange={async () => {
                await toggleShoppingItemAction(item.id, item.checked);
              }}
              className="h-5 w-5"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium truncate">{item.name}</p>
                {item.quantity > 1 && (
                  <Badge variant="secondary" className="text-xs">
                    x{item.quantity}
                  </Badge>
                )}
              </div>
              {item.category && (
                <Badge
                  variant="outline"
                  className={`mt-1 text-xs ${categoryColors[item.category] || categoryColors.other}`}
                >
                  {categoryIcons[item.category] || categoryIcons.other}
                  <span className="ml-1">{item.category}</span>
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleEdit(item)}
              >
                <Edit3 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={async () => {
                  if (confirm("Remove this item?")) {
                    await deleteShoppingItemAction(item.id);
                  }
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Checked items */}
      {checkedItems.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              In Cart ({checkedItems.length})
            </h3>
            <form action={clearCheckedItemsAction}>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-destructive"
                type="submit"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Clear all
              </Button>
            </form>
          </div>
          {checkedItems.map((item) => (
            <Card
              key={item.id}
              className="p-4 flex items-center gap-3 opacity-60 hover:opacity-80 transition group"
            >
              <Checkbox
                checked={item.checked}
                onCheckedChange={async () => {
                  await toggleShoppingItemAction(item.id, item.checked);
                }}
                className="h-5 w-5"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium truncate line-through">{item.name}</p>
                  {item.quantity > 1 && (
                    <Badge variant="secondary" className="text-xs">
                      x{item.quantity}
                    </Badge>
                  )}
                </div>
                {item.category && (
                  <Badge variant="outline" className="mt-1 text-xs opacity-60">
                    {item.category}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={async () => {
                    await deleteShoppingItemAction(item.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}