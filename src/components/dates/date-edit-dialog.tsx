"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Loader2, Sparkles, X, Heart, Calendar, MapPin, Activity,
  DollarSign, StickyNote, CheckCircle2, Lightbulb, Clock, Star,
  CreditCard,
} from "lucide-react";
import { updateDateAction } from "@/app/actions/dates";
import { createTransaction } from "@/app/actions/cards.actions";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

interface DateItemType {
  id: string;
  title: string;
  activity?: string;
  location?: string | null;
  date: string;
  cost?: string | null;
  status?: string;
  rating?: number | null;
  notes?: string | null;
  cardId?: string | null;
}

interface DateEditDialogProps {
  item: DateItemType;
  cards?: Array<{
    id: string;
    nickname: string;
    brand: string;
    last4: string;
    colorTheme: string;
    balance: string;
  }>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusConfig: Record<string, { label: string; icon: any; color: string; bg: string; gradient: string }> = {
  IDEA: { label: "Spark Idea", icon: Lightbulb, color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-900/30", gradient: "from-amber-400 via-orange-400 to-amber-500" },
  PLANNED: { label: "Locked In", icon: Clock, color: "text-rose-500", bg: "bg-rose-100 dark:bg-rose-900/30", gradient: "from-rose-400 via-pink-400 to-rose-500" },
  COMPLETED: { label: "Cherished", icon: CheckCircle2, color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-900/30", gradient: "from-purple-400 via-violet-400 to-purple-500" },
};

export function DateEditDialog({ item, cards = [], open, onOpenChange }: DateEditDialogProps) {
  const [updating, setUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(item.status || "PLANNED");
  const [selectedCardId, setSelectedCardId] = useState(item.cardId || "");
  const router = useRouter();

  const { register, handleSubmit, reset, watch } = useForm({
    values: {
      title: item.title || "",
      activity: item.activity || "",
      location: item.location || "",
      scheduledAt: item.date ? new Date(item.date).toISOString().split("T")[0] : "",
      costEstimate: item.cost || "",
      notes: item.notes || "",
    },
  });

  React.useEffect(() => {
    if (open) {
      reset({
        title: item.title || "",
        activity: item.activity || "",
        location: item.location || "",
        scheduledAt: item.date ? new Date(item.date).toISOString().split("T")[0] : "",
        costEstimate: item.cost || "",
        notes: item.notes || "",
      });
      setSelectedStatus(item.status || "PLANNED");
      setSelectedCardId(item.cardId || "");
    }
  }, [open, item, reset]);

  const watchCost = watch("costEstimate");
  const safeCards = Array.isArray(cards) ? cards : [];
  const currentStatus = statusConfig[selectedStatus] || statusConfig.PLANNED;
  const StatusIcon = currentStatus.icon;

  const getCardGradient = (colorTheme: string) => {
    const gradients: Record<string, string> = {
      indigo: "from-indigo-600 to-blue-500", rose: "from-rose-600 to-orange-400",
      emerald: "from-emerald-600 to-teal-500", violet: "from-violet-600 to-fuchsia-500",
      amber: "from-amber-600 to-red-500", slate: "from-slate-700 to-gray-500",
    };
    return gradients[colorTheme] || gradients.indigo;
  };

  const onSubmit = async (data: any) => {
    try {
      setUpdating(true);
      await updateDateAction(item.id, {
        ...data,
        status: selectedStatus,
        cardId: selectedCardId || undefined,
      } as any);

      // If status is COMPLETED, cost exists, and card selected - create transaction
      if (selectedStatus === "COMPLETED" && data.costEstimate && parseFloat(data.costEstimate) > 0 && selectedCardId) {
        try {
          await createTransaction({
            cardId: selectedCardId,
            amount: parseFloat(data.costEstimate),
            sourceType: "DATE_OUTING",
            sourceId: item.id,
            note: `Date: ${data.title}`,
          });
          showToast.success("Date updated & transaction recorded! 💳");
        } catch (err) {
          showToast.success("Updated but transaction failed");
        }
      } else {
        showToast.success("Date updated! ✨");
      }

      router.refresh();
      onOpenChange(false);
    } catch (err) {
      showToast.error("Failed to update date");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[92vw] max-w-[500px] rounded-2xl p-0 gap-0 overflow-hidden border-0 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className={`relative bg-gradient-to-r ${currentStatus.gradient} p-6 sm:p-8 text-white`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Heart className="h-5 w-5" />
                </div>
                <DialogTitle className="text-xl font-bold">Edit Date Night</DialogTitle>
              </div>
              <DialogDescription className="text-white/80 text-sm max-w-xs">Update details, track progress, or rate your experience</DialogDescription>
            </div>
            <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 text-xs font-medium px-3 py-1.5">
              <StatusIcon className="h-3.5 w-3.5 mr-1.5" />{currentStatus.label}
            </Badge>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase text-muted-foreground">Date Title</Label>
              <Input required {...register("title")} className="border-2 focus:border-rose-400 transition" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase text-muted-foreground">Activity</Label>
                <Input {...register("activity")} className="border-2 focus:border-rose-400 transition" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase text-muted-foreground">Venue</Label>
                <Input {...register("location")} className="border-2 focus:border-rose-400 transition" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase text-muted-foreground">Date</Label>
                <Input type="date" required {...register("scheduledAt")} className="border-2 focus:border-rose-400 transition" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1.5">
                  <DollarSign className="h-3 w-3 text-emerald-400" /> Budget ($)
                </Label>
                <Input type="number" step="0.01" min="0" placeholder="0.00" {...register("costEstimate")} className="border-2 focus:border-rose-400 transition" />
              </div>
            </div>

            {/* Status Selection */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase text-muted-foreground">Status</Label>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(statusConfig).map(([key, config]) => {
                  const Icon = config.icon;
                  const isSelected = selectedStatus === key;
                  return (
                    <button key={key} type="button" onClick={() => setSelectedStatus(key)}
                      className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${isSelected ? `${config.bg} border-rose-300 shadow-md scale-105` : "border-transparent bg-muted/30 hover:bg-muted/50"}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isSelected ? config.bg : "bg-muted"}`}>
                        <Icon className={`h-4 w-4 ${isSelected ? config.color : "text-muted-foreground"}`} />
                      </div>
                      <span className={`text-xs font-medium ${isSelected ? config.color : "text-muted-foreground"}`}>{config.label}</span>
                      {isSelected && <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 border-2 border-background flex items-center justify-center"><CheckCircle2 className="h-3 w-3 text-white" /></div>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Card Picker */}
            {safeCards.length > 0 && (
              <div className="space-y-2 p-3 rounded-xl bg-muted/30 border">
                <Label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1.5">
                  <CreditCard className="h-3 w-3" /> Linked Card
                </Label>
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
              <Textarea {...register("notes")} className="w-full resize-none min-h-[80px] border-2 focus:border-rose-400 transition" rows={2} />
            </div>

            <div className="flex items-center gap-3 pt-3">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={updating}>
                <X className="h-4 w-4 mr-1.5" /> Cancel
              </Button>
              <Button type="submit" disabled={updating} className="flex-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg">
                {updating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : <><Sparkles className="mr-2 h-4 w-4" /> Save Date Capsule</>}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}