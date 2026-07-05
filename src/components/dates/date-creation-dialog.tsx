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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  PlusCircle,
  Sparkles,
  Heart,
  Calendar,
  MapPin,
  Activity,
  DollarSign,
  StickyNote,
  CreditCard,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { createDateAction } from "@/app/actions/dates";
import { createTransaction } from "@/app/actions/cards.actions";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

interface DateFormInputs {
  title: string;
  activity: string;
  location: string;
  scheduledAt: string;
  costEstimate: string;
  status: string;
  notes: string;
}

interface CardType {
  id: string;
  nickname: string;
  brand: string;
  last4: string;
  colorTheme: string;
  balance: string;
}

interface DateCreationDialogProps {
  cards?: CardType[];
}

export function DateCreationDialog({ cards = [] }: DateCreationDialogProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState("");

  const { register, handleSubmit, reset, watch } = useForm<DateFormInputs>({
    defaultValues: {
      scheduledAt: new Date().toISOString().split("T")[0],
      status: "PLANNED",
    },
  });

  const watchTitle = watch("title");
  const watchCost = watch("costEstimate");
  const safeCards = Array.isArray(cards) ? cards : [];

  const getCardGradient = (colorTheme: string) => {
    const gradients: Record<string, string> = {
      indigo: "from-indigo-600 to-blue-500", rose: "from-rose-600 to-orange-400",
      emerald: "from-emerald-600 to-teal-500", violet: "from-violet-600 to-fuchsia-500",
      amber: "from-amber-600 to-red-500", slate: "from-slate-700 to-gray-500",
    };
    return gradients[colorTheme] || gradients.indigo;
  };

  const onSubmit = async (data: DateFormInputs) => {
    try {
      setSubmitting(true);
      const result = await createDateAction({
        ...data,
        costEstimate: data.costEstimate || undefined,
        cardId: selectedCardId || undefined,
      } as any);

      // If cost is set and card selected, create transaction
      if (data.costEstimate && parseFloat(data.costEstimate) > 0 && selectedCardId) {
        try {
          await createTransaction({
            cardId: selectedCardId,
            amount: parseFloat(data.costEstimate),
            sourceType: "DATE_OUTING",
            sourceId: result.id,
            note: `Date: ${data.title}`,
          });
          showToast.success("Date planned & transaction recorded! 💳", `$${parseFloat(data.costEstimate).toFixed(2)} deducted`);
        } catch (err) {
          showToast.success("Date added but transaction failed");
        }
      } else {
        showToast.success("Date night planned! 💝");
      }

      reset();
      setSelectedCardId("");
      setOpen(false);
    } catch (err) {
      showToast.error("Failed to plan date");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-lg shadow-rose-500/25">
          <Heart className="h-4 w-4" />
          Pitch Date Night
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[92vw] max-w-[500px] rounded-2xl p-0 gap-0 overflow-hidden border-0 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="relative bg-gradient-to-br from-rose-400 via-pink-400 to-rose-500 p-6 sm:p-8 text-white">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Heart className="h-5 w-5" />
              </div>
              <DialogTitle className="text-xl font-bold">Pitch New Date</DialogTitle>
            </div>
            <DialogDescription className="text-white/80 text-sm max-w-xs">
              Plan a romantic evening, spontaneous adventure, or special celebration
            </DialogDescription>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase text-muted-foreground">Date Title</Label>
              <Input required placeholder="Candlelit Sushi Night..." className="w-full border-2 focus:border-rose-400 transition" {...register("title")} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase text-muted-foreground">Activity</Label>
                <Input required placeholder="Dinner & arcade..." className="w-full border-2 focus:border-rose-400 transition" {...register("activity")} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase text-muted-foreground">Venue</Label>
                <Input required placeholder="Miyako Sushi Bar" className="w-full border-2 focus:border-rose-400 transition" {...register("location")} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase text-muted-foreground">Date</Label>
                <Input type="date" required className="w-full border-2 focus:border-rose-400 transition" {...register("scheduledAt")} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1.5">
                  <DollarSign className="h-3 w-3 text-emerald-400" /> Budget ($)
                </Label>
                <Input type="number" step="0.01" min="0" placeholder="0.00" className="w-full border-2 focus:border-rose-400 transition" {...register("costEstimate")} />
              </div>
            </div>

            {/* Card Picker */}
            {watchCost && parseFloat(watchCost) > 0 && safeCards.length > 0 && (
              <div className="space-y-2 p-3 rounded-xl bg-muted/30 border-2 border-dashed">
                <Label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1.5">
                  <CreditCard className="h-3 w-3 text-indigo-400" /> Link Card (Optional)
                </Label>
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  Amount will be deducted from the selected card
                </p>
                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {safeCards.map((card) => (
                    <button key={card.id} type="button"
                      onClick={() => setSelectedCardId(selectedCardId === card.id ? "" : card.id)}
                      className={cn(
                        "w-full flex items-center gap-2.5 p-2.5 rounded-lg border transition-all text-left",
                        selectedCardId === card.id
                          ? "border-rose-400 bg-rose-50 dark:bg-rose-950/20 shadow-sm"
                          : "border-transparent bg-background hover:bg-muted/50"
                      )}>
                      <div className={cn("w-9 h-6 rounded bg-gradient-to-br flex-shrink-0", getCardGradient(card.colorTheme))} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{card.nickname}</p>
                        <p className="text-[10px] text-muted-foreground">•••• {card.last4} • ${parseFloat(card.balance).toFixed(2)}</p>
                      </div>
                      {selectedCardId === card.id && <CheckCircle2 className="h-4 w-4 text-rose-500 flex-shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase text-muted-foreground">Notes</Label>
              <Textarea placeholder="Dress codes, reservation details..." className="w-full resize-none min-h-[80px] border-2 focus:border-rose-400 transition" rows={2} {...register("notes")} />
            </div>

            <Button type="submit" disabled={submitting || !watchTitle} className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg">
              {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Planning...</> : <><Sparkles className="mr-2 h-4 w-4" /> Lock In Blueprint</>}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}