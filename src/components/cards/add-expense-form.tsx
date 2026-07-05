// src/components/cards/add-expense-form.tsx
"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, X, DollarSign } from "lucide-react";
import { createTransaction } from "@/app/actions/cards.actions";
import { showToast } from "@/lib/toast";

interface AddExpenseFormProps {
  cardId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function AddExpenseForm({ cardId, onSuccess, onCancel }: AddExpenseFormProps) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      showToast.error("Enter a valid amount");
      return;
    }
    try {
      setSubmitting(true);
      await createTransaction({
        cardId,
        amount: parseFloat(amount),
        sourceType: "MANUAL",
        note: note || undefined,
      });
      showToast.success("Expense added");
      setAmount("");
      setNote("");
      onSuccess();
    } catch (err) {
      showToast.error("Failed to add expense");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="p-3 sm:p-4 space-y-3">
      <h3 className="font-bold text-sm">Add Expense</h3>
      <div>
        <Label className="text-[10px] sm:text-xs">Amount ($)</Label>
        <div className="relative">
          <DollarSign className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          <Input
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            className="pl-7 sm:pl-10 h-9 sm:h-10 text-xs sm:text-sm"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
      </div>
      <Input
        placeholder="Note (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="h-9 sm:h-10 text-xs sm:text-sm"
      />
      <div className="flex gap-2">
        <Button size="sm" onClick={handleSubmit} disabled={submitting} className="text-xs sm:text-sm">
          <Check className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> Add
        </Button>
        <Button size="sm" variant="ghost" onClick={onCancel} className="text-xs sm:text-sm">
          <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> Cancel
        </Button>
      </div>
    </Card>
  );
}