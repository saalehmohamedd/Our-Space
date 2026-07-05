// src/components/cards/edit-card-dialog.tsx
"use client";

import React, { useState } from "react";
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
import { Edit3, Sparkles, X } from "lucide-react";
import { updateCard } from "@/app/actions/cards.actions";
import { showToast } from "@/lib/toast";
import { formatMaskedNumber, getBrandDisplayName } from "@/lib/card-utils";
import { cn } from "@/lib/utils";

const colorThemes = [
  { name: "indigo", label: "Indigo", class: "from-indigo-600 to-blue-500" },
  { name: "rose", label: "Rose", class: "from-rose-600 to-orange-400" },
  { name: "emerald", label: "Emerald", class: "from-emerald-600 to-teal-500" },
  { name: "violet", label: "Violet", class: "from-violet-600 to-fuchsia-500" },
  { name: "amber", label: "Amber", class: "from-amber-600 to-red-500" },
  { name: "slate", label: "Slate", class: "from-slate-700 to-gray-500" },
];

interface EditCardDialogProps {
  card: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditCardDialog({ card, open, onOpenChange }: EditCardDialogProps) {
  const [editNickname, setEditNickname] = useState(card.nickname);
  const [editTheme, setEditTheme] = useState(card.colorTheme || "indigo");
  const [updating, setUpdating] = useState(false);

  React.useEffect(() => {
    if (open) {
      setEditNickname(card.nickname);
      setEditTheme(card.colorTheme || "indigo");
    }
  }, [open, card]);

  const handleSubmit = async () => {
    if (!editNickname.trim()) {
      showToast.error("Nickname is required");
      return;
    }
    try {
      setUpdating(true);
      await updateCard(card.id, { nickname: editNickname, colorTheme: editTheme });
      showToast.success("Card updated! ✨");
      onOpenChange(false);
    } catch (err) {
      showToast.error("Failed to update card");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[92vw] max-w-[450px] rounded-2xl p-0 gap-0 border-0 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-br from-indigo-400 to-blue-500 p-4 sm:p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <Edit3 className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg sm:text-xl font-bold">Edit Card</DialogTitle>
              <DialogDescription className="text-white/80 text-xs sm:text-sm">
                Update card nickname and appearance
              </DialogDescription>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
          {/* Preview */}
          <div className="flex justify-center">
            <div className="w-full max-w-[240px] sm:max-w-[280px]">
              <div className={cn(
                "aspect-[1.586/1] rounded-xl bg-gradient-to-br p-3 sm:p-4 flex flex-col justify-between",
                colorThemes.find(t => t.name === editTheme)?.class
              )}>
                <div>
                  <p className="text-white/70 text-[10px] sm:text-xs uppercase">{editNickname || "Card Name"}</p>
                </div>
                <div>
                  <p className="text-white/90 text-xs sm:text-sm font-mono tracking-wider">{formatMaskedNumber(card.last4)}</p>
                </div>
                <div className="flex justify-between items-end">
                  <p className="text-white/50 text-[8px] sm:text-[10px]">Balance</p>
                  <p className="text-white/80 text-xs sm:text-sm font-bold italic tracking-[0.2em] uppercase">
                    {getBrandDisplayName(card.brand)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Nickname */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Card Nickname
            </Label>
            <Input
              value={editNickname}
              onChange={(e) => setEditNickname(e.target.value)}
              placeholder="My Everyday Card"
              className="border-2 focus:border-indigo-400 h-10 sm:h-11"
            />
          </div>

          {/* Color Theme */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Card Color
            </Label>
            <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
              {colorThemes.map((theme) => (
                <button
                  key={theme.name}
                  type="button"
                  onClick={() => setEditTheme(theme.name)}
                  className={cn(
                    "w-full aspect-square rounded-lg sm:rounded-xl bg-gradient-to-br transition-all",
                    theme.class,
                    editTheme === theme.name
                      ? "ring-2 ring-offset-2 ring-indigo-400 scale-110"
                      : "hover:scale-105"
                  )}
                  title={theme.label}
                />
              ))}
            </div>
          </div>

          {/* Card Info */}
          <div className="p-3 rounded-xl bg-muted/30 border space-y-1">
            <div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Card Number</p>
              <p className="font-mono text-xs sm:text-sm">{formatMaskedNumber(card.last4)}</p>
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Brand</p>
              <p className="text-xs sm:text-sm">{getBrandDisplayName(card.brand)}</p>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
              <X className="h-4 w-4 mr-1" /> Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={updating || !editNickname.trim()}
              className="w-full sm:flex-1 bg-gradient-to-r from-indigo-500 to-blue-500 text-white"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {updating ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}