// src/components/cards/set-income-form.tsx
"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, X } from "lucide-react";
import { setMonthlyIncome } from "@/app/actions/cards.actions";
import { showToast } from "@/lib/toast";

const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

interface SetIncomeFormProps {
  cardId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function SetIncomeForm({ cardId, onSuccess, onCancel }: SetIncomeFormProps) {
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      showToast.error("Enter a valid amount");
      return;
    }
    try {
      setSubmitting(true);
      await setMonthlyIncome({ cardId, amount: parseFloat(amount), month, year, note: note || undefined });
      showToast.success("Monthly income updated!");
      setAmount("");
      setNote("");
      onSuccess();
    } catch (err) {
      showToast.error("Failed to set income");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="p-3 sm:p-4 space-y-3">
      <h3 className="font-bold text-sm">Set Monthly Income</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
        <div>
          <Label className="text-[10px] sm:text-xs">Month</Label>
          <select
            className="w-full h-9 sm:h-10 px-2 sm:px-3 rounded-md border text-xs sm:text-sm"
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value))}
          >
            {months.map((m, i) => <option key={i} value={i+1}>{m.slice(0,3)}</option>)}
          </select>
        </div>
        <div>
          <Label className="text-[10px] sm:text-xs">Year</Label>
          <Input type="number" value={year} onChange={(e) => setYear(parseInt(e.target.value))} className="h-9 sm:h-10 text-xs sm:text-sm" />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <Label className="text-[10px] sm:text-xs">Amount ($)</Label>
          <Input type="number" step="0.01" min="0" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} className="h-9 sm:h-10 text-xs sm:text-sm" />
        </div>
      </div>
      <Input placeholder="Note (optional)" value={note} onChange={(e) => setNote(e.target.value)} className="h-9 sm:h-10 text-xs sm:text-sm" />
      <div className="flex gap-2">
        <Button size="sm" onClick={handleSubmit} disabled={submitting} className="text-xs sm:text-sm">
          <Check className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> Save
        </Button>
        <Button size="sm" variant="ghost" onClick={onCancel} className="text-xs sm:text-sm">
          <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> Cancel
        </Button>
      </div>
    </Card>
  );
}