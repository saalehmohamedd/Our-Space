// src/components/shopping/shopping-list.tsx
"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  Trash2,
  Edit3,
  CheckCircle2,
  Package,
  Apple,
  ShoppingBag,
  Home,
  Check,
  CreditCard,
} from "lucide-react";
import {
  toggleShoppingItemAction,
  deleteShoppingItemAction,
  clearCheckedItemsAction,
} from "@/app/actions/shopping";
import { createTransaction } from "@/app/actions/cards.actions";
import { EditShoppingDialog } from "./edit-shopping-dialog";
import { showToast } from "@/lib/toast";

interface ShoppingItem {
  id: string;
  name: string;
  category: string | null;
  quantity: number;
  checked: boolean;
  cost?: string | null;
  cardId?: string | null;
  createdAt?: string | null;
}

interface ShoppingListProps {
  items: ShoppingItem[];
  cards?: Array<{
    id: string;
    nickname: string;
    brand: string;
    last4: string;
    colorTheme: string;
    balance: string;
  }>;
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

export function ShoppingList({ items, cards = [] }: ShoppingListProps) {
  const [editingItem, setEditingItem] = useState<ShoppingItem | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const uncheckedItems = items.filter((item) => !item.checked);
  const checkedItems = items.filter((item) => item.checked);

  const handleEdit = (item: ShoppingItem) => {
    setEditingItem(item);
    setIsEditOpen(true);
  };

  const handleCloseEdit = () => {
    setIsEditOpen(false);
    setTimeout(() => setEditingItem(null), 300);
  };

  const handleToggle = async (item: ShoppingItem) => {
    try {
      await toggleShoppingItemAction(item.id, item.checked);

      // Transaction ONLY when checking (buying) - not when unchecking
      if (!item.checked && item.cost && parseFloat(item.cost) > 0 && item.cardId) {
        try {
          await createTransaction({
            cardId: item.cardId,
            amount: parseFloat(item.cost),
            sourceType: "SHOPPING",
            sourceId: item.id,
            note: `Purchased: ${item.name}`,
          });
          showToast.success(
            "Item bought! 💳",
            `$${parseFloat(item.cost).toFixed(2)} deducted from card`
          );
        } catch (err) {
          showToast.success("Item checked ✓", "But transaction failed");
        }
      } else if (!item.checked) {
        showToast.success("Item checked ✓", `${item.name} added to cart`);
      } else {
        showToast.success("Item unchecked", `${item.name} moved back to list`);
      }
    } catch (err) {
      showToast.error("Failed to update item");
    }
  };

  const handleDelete = async (item: ShoppingItem) => {
    if (!confirm("Remove this item?")) return;
    try {
      await deleteShoppingItemAction(item.id);
      showToast.success(`${item.name} removed`);
    } catch (err) {
      showToast.error("Failed to remove");
    }
  };

  const handleClearChecked = async () => {
    try {
      await clearCheckedItemsAction();
      showToast.success("Cart cleared! 🧹");
    } catch (err) {
      showToast.error("Failed to clear");
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Unchecked items */}
        {uncheckedItems.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              To Buy ({uncheckedItems.length})
            </h3>
            {uncheckedItems.map((item) => (
              <Card
                key={item.id}
                className="p-4 flex items-center gap-3 hover:shadow-md transition group"
              >
                <button
                  onClick={() => handleToggle(item)}
                  className="h-5 w-5 rounded border-2 border-muted-foreground/30 hover:border-emerald-400 flex items-center justify-center transition-colors flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">{item.name}</p>
                    {item.quantity > 1 && (
                      <Badge variant="secondary" className="text-xs">
                        x{item.quantity}
                      </Badge>
                    )}
                    {item.cost && parseFloat(item.cost) > 0 && (
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                        ${parseFloat(item.cost).toFixed(2)}
                      </span>
                    )}
                    {item.cardId && (
                      <span title="Linked to card">
                        <CreditCard className="h-3 w-3 text-indigo-400" />
                      </span>
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
                    className="h-8 w-8 text-destructive"
                    onClick={() => handleDelete(item)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Checked items */}
        {checkedItems.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Bought ({checkedItems.length})
              </h3>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-destructive"
                onClick={handleClearChecked}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Clear all
              </Button>
            </div>
            {checkedItems.map((item) => (
              <Card
                key={item.id}
                className="p-4 flex items-center gap-3 opacity-60 hover:opacity-80 transition group"
              >
                <button
                  onClick={() => handleToggle(item)}
                  className="h-5 w-5 rounded border-2 bg-emerald-500 border-emerald-500 text-white flex items-center justify-center flex-shrink-0"
                >
                  <Check className="h-3 w-3" />
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate line-through">{item.name}</p>
                    {item.cost && parseFloat(item.cost) > 0 && (
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                        ${parseFloat(item.cost).toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100"
                  onClick={() => handleDelete(item)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      {editingItem && (
        <EditShoppingDialog
          item={editingItem}
          cards={cards}
          open={isEditOpen}
          onOpenChange={handleCloseEdit}
        />
      )}
    </>
  );
}