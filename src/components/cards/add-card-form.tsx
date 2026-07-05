// src/components/cards/add-card-form.tsx
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Loader2, CreditCard, Shield, Check, DollarSign } from "lucide-react";
import {
  luhnCheck,
  detectCardBrand,
  getLast4,
  formatCardNumber,
  getBrandDisplayName,
} from "@/lib/card-utils";
import { createCard } from "@/app/actions/cards.actions";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

const addCardFormSchema = z.object({
  nickname: z.string().min(1, "Nickname is required").max(50),
  cardNumber: z.string().min(13, "Card number is too short"),
  balance: z.string().optional(),
});

type AddCardFormData = z.infer<typeof addCardFormSchema>;

const colorThemes = [
  { name: "indigo", label: "Indigo", class: "from-red-600 to-blue-500" },
  { name: "rose", label: "Rose", class: "from-rose-600 to-orange-400" },
  { name: "emerald", label: "Emerald", class: "from-emerald-600 to-teal-500" },
  { name: "violet", label: "Violet", class: "from-violet-600 to-fuchsia-500" },
  { name: "amber", label: "Amber", class: "from-amber-600 to-red-500" },
  { name: "slate", label: "Slate", class: "from-slate-700 to-gray-500" },
];

interface AddCardFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddCardForm({ open, onOpenChange }: AddCardFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState("indigo");
  const [cardNumberError, setCardNumberError] = useState<string | null>(null);
  const [step, setStep] = useState<"number" | "details">("number");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AddCardFormData>({
    resolver: zodResolver(addCardFormSchema),
    defaultValues: {
      nickname: "",
      cardNumber: "",
      balance: "",
    },
  });

  const watchCardNumber = watch("cardNumber");
  const watchNickname = watch("nickname");
  const watchBalance = watch("balance");
  const rawNumber = watchCardNumber?.replace(/\D/g, "") || "";
  const detectedBrand = rawNumber.length >= 13 ? detectCardBrand(rawNumber) : null;
  const isValidLuhn = rawNumber.length >= 13 ? luhnCheck(rawNumber) : false;
  const isValidLength = rawNumber.length >= 13 && rawNumber.length <= 19;

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
    setValue("cardNumber", raw, { shouldValidate: true });
    setCardNumberError(null);
  };

  const handleNextStep = () => {
    if (!rawNumber || rawNumber.length < 13) {
      setCardNumberError("Please enter a valid card number");
      return;
    }
    if (!isValidLuhn) {
      setCardNumberError("Invalid card number. Please check and try again.");
      return;
    }
    setCardNumberError(null);
    setStep("details");
  };

  const onSubmit = async (data: AddCardFormData) => {
    const finalRawNumber = data.cardNumber.replace(/\D/g, "");

    if (!luhnCheck(finalRawNumber)) {
      setCardNumberError("Invalid card number");
      return;
    }

    const brand = detectCardBrand(finalRawNumber);
    const last4 = getLast4(finalRawNumber);
    const initialBalance = data.balance ? parseFloat(data.balance) : 0;

    try {
      setSubmitting(true);
      await createCard({
        nickname: data.nickname,
        brand,
        last4,
        colorTheme: selectedTheme,
        balance: initialBalance,
      } as any);

      showToast.success("Card added securely! 🔒", "Only the last 4 digits were saved");
      reset();
      setSelectedTheme("indigo");
      setStep("number");
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      showToast.error("Failed to add card");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) {
        setStep("number");
        reset();
        setCardNumberError(null);
      }
      onOpenChange(open);
    }}>
      <DialogContent className="w-[92vw] max-w-[480px] rounded-2xl p-0 gap-0 border-0 shadow-2xl  md:max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-br from-indigo-500 via-blue-500 to-purple-600 p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">
                {step === "number" ? "Add Card" : "Card Details"}
              </DialogTitle>
              <DialogDescription className="text-white/80 text-sm">
                {step === "number" 
                  ? "Enter your card number — only the last 4 digits are saved"
                  : "Give your card a nickname, set balance, and choose a color"}
              </DialogDescription>
            </div>
          </div>
        </div>

        <div className="p-6">
          {step === "number" ? (
            /* Step 1: Card Number */
            <div className="space-y-5">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Card Number
                </Label>
                <Input
                  placeholder="1234 5678 9012 3456"
                  className="border-2 font-mono text-lg text-center tracking-wider"
                  value={formatCardNumber(rawNumber)}
                  onChange={handleCardNumberChange}
                  maxLength={19}
                  inputMode="numeric"
                  autoFocus
                />
                {cardNumberError && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <Shield className="h-3 w-3" /> {cardNumberError}
                  </p>
                )}

                {rawNumber.length >= 6 && (
                  <div className="flex items-center gap-2 mt-2">
                    {detectedBrand && (
                      <span className={cn(
                        "text-xs font-medium px-2 py-1 rounded-full",
                        isValidLuhn 
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                      )}>
                        {getBrandDisplayName(detectedBrand)}
                      </span>
                    )}
                    {isValidLuhn && (
                      <span className="text-xs text-emerald-600 flex items-center gap-1">
                        <Check className="h-3 w-3" /> Valid number
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="p-3 rounded-xl bg-muted/30 border flex items-start gap-2">
                <Shield className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground">
                  Your full card number is never stored or transmitted. Only the last 4 digits are saved for identification.
                </p>
              </div>

              <Button
                type="button"
                onClick={handleNextStep}
                disabled={!isValidLength}
                className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white"
              >
                Continue
              </Button>
            </div>
          ) : (
            /* Step 2: Details */
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Card Preview */}
              <div className="flex justify-center">
                <div className="w-full max-w-[280px]">
                  <div className={cn(
                    "aspect-[1.586/1] rounded-xl bg-gradient-to-br p-4 flex flex-col justify-between",
                    colorThemes.find(t => t.name === selectedTheme)?.class
                  )}>
                    <div>
                      <p className="text-white/70 text-xs font-medium uppercase tracking-wider">
                        {watchNickname || "Card Nickname"}
                      </p>
                      {watchBalance && (
                        <p className="text-white text-xl font-bold mt-1">
                          ${parseFloat(watchBalance).toFixed(2)}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-white/90 text-sm font-mono tracking-wider">
                        •••• •••• •••• {rawNumber.slice(-4) || "••••"}
                      </p>
                    </div>
                    <div className="flex justify-between items-end">
                      <p className="text-white/50 text-[10px]">MM/YY</p>
                      <p className="text-white/80 text-sm font-bold italic tracking-[0.2em] uppercase">
                        {detectedBrand ? getBrandDisplayName(detectedBrand) : "CARD"}
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
                  placeholder="My Everyday Card"
                  className="border-2"
                  {...register("nickname")}
                />
                {errors.nickname && (
                  <p className="text-xs text-red-500">{errors.nickname.message}</p>
                )}
              </div>

              {/* Color Theme */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Card Color
                </Label>
                <div className="grid grid-cols-6 gap-2">
                  {colorThemes.map((theme) => (
                    <button
                      key={theme.name}
                      type="button"
                      onClick={() => setSelectedTheme(theme.name)}
                      className={cn(
                        "w-full aspect-square rounded-xl bg-gradient-to-br transition-all",
                        theme.class,
                        selectedTheme === theme.name
                          ? "ring-2 ring-offset-2 ring-primary scale-110"
                          : "hover:scale-105"
                      )}
                      title={theme.label}
                    />
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep("number")}
                  className="flex-shrink-0"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-blue-500 text-white"
                >
                  {submitting ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...</>
                  ) : (
                    <><Shield className="mr-2 h-4 w-4" /> Add Card Securely</>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}