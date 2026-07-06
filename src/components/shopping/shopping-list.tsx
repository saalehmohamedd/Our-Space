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
  Image as ImageIcon,
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
  productUrl?: string | null;
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
  groceries: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
  household: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  personal: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800",
  other: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800",
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
      <div className="space-y-8">
        {/* Unchecked items */}
        {uncheckedItems.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2 border-b pb-2">
              <ShoppingCart className="h-4 w-4" />
              Shopping Cart ({uncheckedItems.length})
            </h3>
            <div className="grid gap-4">
              {uncheckedItems.map((item) => (
                <Card
                  key={item.id}
                  className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:shadow-md transition group overflow-hidden"
                >
                  {/* Left Controls & Image */}
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <button
                      onClick={() => handleToggle(item)}
                      className="h-6 w-6 rounded-full border-2 border-muted-foreground/30 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 flex items-center justify-center transition-all flex-shrink-0"
                    />
                  </div>

                  {/* Middle Details */}
                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                      <div>
                        <h4 className="font-semibold text-lg truncate leading-tight mb-1">{item.name}</h4>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3>{item.productUrl}</h3>
                          {item.category && (
                            <Badge
                              variant="outline"
                              className={`text-[10px] uppercase tracking-wider ${categoryColors[item.category] || categoryColors.other}`}
                            >
                              {categoryIcons[item.category] || categoryIcons.other}
                              <span className="ml-1.5">{item.category}</span>
                            </Badge>
                          )}
                          {item.cardId && (
                            <Badge variant="secondary" className="text-[10px] uppercase tracking-wider flex items-center gap-1">
                              <CreditCard className="h-3 w-3 text-indigo-500" />
                              Linked
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {/* Price & Quantity Display */}
                      <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 sm:gap-1 mt-2 sm:mt-0">
                        {item.cost && parseFloat(item.cost) > 0 ? (
                          <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                            ${parseFloat(item.cost).toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-sm font-medium text-muted-foreground italic">No price</span>
                        )}
                        <Badge variant="secondary" className="text-xs font-medium">
                          Qty: {item.quantity}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2 sm:flex-col w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 sm:border-l sm:pl-4 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 flex-1 sm:flex-none justify-center text-muted-foreground hover:text-foreground"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit3 className="h-4 w-4 sm:mr-0 mr-2" />
                      <span className="sm:hidden">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 flex-1 sm:flex-none justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(item)}
                    >
                      <Trash2 className="h-4 w-4 sm:mr-0 mr-2" />
                      <span className="sm:hidden">Remove</span>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Checked items */}
        {checkedItems.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Purchased ({checkedItems.length})
              </h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                onClick={handleClearChecked}
              >
                <Trash2 className="h-3 w-3 mr-1.5" />
                Clear Completed
              </Button>
            </div>
            
            <div className="grid gap-3">
              {checkedItems.map((item) => (
                <Card
                  key={item.id}
                  className="p-3 flex items-center gap-4 bg-muted/30 border-dashed opacity-75 hover:opacity-100 transition group"
                >
                  <button
                    onClick={() => handleToggle(item)}
                    className="h-6 w-6 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 transition-colors shadow-sm"
                  >
                    <Check className="h-3.5 w-3.5" />
                  </button>
                  
                  {/* Smaller Thumbnail for checked items */}
                  <div className="h-10 w-10 rounded overflow-hidden bg-muted flex items-center justify-center flex-shrink-0 grayscale">
                    {item.productUrl ? (
                      <img src={item.productUrl} alt={item.name} className="h-full w-full object-cover" />
                    ) : (
                      <ImageIcon className="h-4 w-4 text-muted-foreground/40" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 flex justify-between items-center">
                    <p className="font-medium truncate line-through text-muted-foreground">{item.name}</p>
                    {item.cost && parseFloat(item.cost) > 0 && (
                      <span className="text-sm text-muted-foreground font-medium ml-2">
                        ${parseFloat(item.cost).toFixed(2)}
                      </span>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDelete(item)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </Card>
              ))}
            </div>
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