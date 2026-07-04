// src/components/cards/card-detail-client.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { CardVisual } from "./card-detaild-visual";
import { EditCardDialog } from "./edit-card-dialog";
import { SetIncomeForm } from "./set-income-form";
import { AddExpenseForm } from "./add-expense-form";
import { MonthlyBreakdown } from "./monthly-breakdown";
import { TransactionList } from "./transaction-list";
import { StatsCards } from "./stats-cards";
import {
  ArrowLeft,
  Trash2,
  Plus,
  DollarSign,
  Edit3,
  Gift,
  ShoppingBag,
  Calendar,
  Star,
} from "lucide-react";
import {
  archiveCard,
  deleteCard,
  deleteTransaction,
  getCardReport,
} from "@/app/actions/cards.actions";
import { showToast } from "@/lib/toast";

interface CardDetailClientProps {
  card: any;
}

type RangeType = "week" | "month" | "year";

const sourceIcons: Record<string, React.ReactNode> = {
  WISHLIST: <Gift className="h-3 w-3 sm:h-4 sm:w-4" />,
  SHOPPING: <ShoppingBag className="h-3 w-3 sm:h-4 sm:w-4" />,
  DATE_OUTING: <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />,
  MANUAL: <Star className="h-3 w-3 sm:h-4 sm:w-4" />,
};

const sourceLabels: Record<string, string> = {
  WISHLIST: "Wishlist",
  SHOPPING: "Shopping",
  DATE_OUTING: "Date",
  MANUAL: "Manual",
};

export function CardDetailClient({ card }: CardDetailClientProps) {
  const router = useRouter();
  const [range, setRange] = useState<RangeType>("month");
  const [report, setReport] = useState<any>(null);

  // Form visibility
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  // Delete confirmations
  const [deleteTransactionId, setDeleteTransactionId] = useState<string | null>(null);
  const [deletingTransaction, setDeletingTransaction] = useState(false);
  const [showDeleteCardDialog, setShowDeleteCardDialog] = useState(false);
  const [deletingCard, setDeletingCard] = useState(false);

  useEffect(() => {
    loadReport();
  }, [range]);

  const loadReport = async () => {
    try {
      const data = await getCardReport(card.id, range);
      if (data.success) setReport(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTransaction = async () => {
    if (!deleteTransactionId) return;
    try {
      setDeletingTransaction(true);
      await deleteTransaction(deleteTransactionId);
      showToast.success("Transaction deleted");
      setDeleteTransactionId(null);
      loadReport();
    } catch (err) {
      showToast.error("Failed to delete");
    } finally {
      setDeletingTransaction(false);
    }
  };

  const handleDeleteCard = async () => {
    try {
      setDeletingCard(true);
      await deleteCard(card.id);
      showToast.success("Card deleted");
      setShowDeleteCardDialog(false);
      router.push("/cards");
    } catch (err) {
      showToast.error("Failed to delete card");
    } finally {
      setDeletingCard(false);
    }
  };

  const handleArchiveCard = async () => {
    try {
      await archiveCard(card.id);
      showToast.success("Card archived");
      router.push("/cards");
    } catch (err) {
      showToast.error("Failed to archive");
    }
  };

  const toggleForm = (form: "income" | "expense") => {
    if (form === "income") {
      setShowIncomeForm(!showIncomeForm);
      setShowAddForm(false);
    } else {
      setShowAddForm(!showAddForm);
      setShowIncomeForm(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <Button variant="ghost" onClick={() => router.push("/cards")} className="gap-1 sm:gap-2 text-xs sm:text-sm">
        <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" /> Back
      </Button>

      <CardVisual
        last4={card.last4}
        nickname={card.nickname}
        brand={card.brand}
        colorTheme={card.colorTheme}
        balance={parseFloat(card.balance)}
      />

      <div className="flex gap-1.5 sm:gap-2 justify-center flex-wrap">
        <Button variant="outline" size="sm" onClick={() => setShowEditDialog(true)} className="text-[10px] sm:text-xs h-8 sm:h-9">
          <Edit3 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> Edit
        </Button>
        <Button variant="outline" size="sm" onClick={() => toggleForm("income")} className="text-[10px] sm:text-xs h-8 sm:h-9">
          <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> Income
        </Button>
        <Button variant="outline" size="sm" onClick={() => toggleForm("expense")} className="text-[10px] sm:text-xs h-8 sm:h-9">
          <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> Expense
        </Button>
        <Button variant="outline" size="sm" onClick={handleArchiveCard} className="text-[10px] sm:text-xs h-8 sm:h-9">
          Archive
        </Button>
        <Button variant="destructive" size="sm" onClick={() => setShowDeleteCardDialog(true)} className="text-[10px] sm:text-xs h-8 sm:h-9">
          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </div>

      {/* Forms */}
      {showIncomeForm && (
        <SetIncomeForm
          cardId={card.id}
          onSuccess={() => { setShowIncomeForm(false); loadReport(); }}
          onCancel={() => setShowIncomeForm(false)}
        />
      )}

      {showAddForm && (
        <AddExpenseForm
          cardId={card.id}
          onSuccess={() => { setShowAddForm(false); loadReport(); }}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* Range Selector */}
      <div className="flex gap-1.5 sm:gap-2 justify-center">
        {(["week", "month", "year"] as RangeType[]).map((r) => (
          <Button
            key={r}
            variant={range === r ? "default" : "outline"}
            size="sm"
            onClick={() => setRange(r)}
            className="capitalize text-[10px] sm:text-xs h-7 sm:h-8 px-2 sm:px-3"
          >
            {r}
          </Button>
        ))}
      </div>

      {/* Stats */}
      {report && (
        <StatsCards
          income={report.totalIncome}
          spent={report.totalSpent}
          saved={report.totalSaved}
          balance={report.currentBalance}
        />
      )}

      {/* Monthly Breakdown */}
      {report?.monthlyBreakdown && (
        <MonthlyBreakdown
          data={report.monthlyBreakdown}
          onDeleteTransaction={setDeleteTransactionId}
        />
      )}

      {/* Source Breakdown */}
      {report?.sourceBreakdown?.length > 0 && (
        <div className="space-y-2 sm:space-y-3">
          <h3 className="font-bold text-sm sm:text-lg">Spend by Category</h3>
          <div className="flex gap-1.5 sm:gap-2 flex-wrap">
            {report.sourceBreakdown.map((s: any) => (
              <Badge key={s.sourceType} variant="secondary" className="gap-1 sm:gap-1.5 text-[10px] sm:text-sm py-1 sm:py-1.5 px-2 sm:px-3">
                {sourceIcons[s.sourceType]}
                <span className="hidden sm:inline">{sourceLabels[s.sourceType]}:</span> ${s.amount.toFixed(2)}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <Separator />

      {/* All Transactions */}
      <TransactionList
        transactions={report?.transactions || []}
        onDelete={setDeleteTransactionId}
      />

      {/* Dialogs */}
      <EditCardDialog card={card} open={showEditDialog} onOpenChange={setShowEditDialog} />

      <ConfirmDialog
        open={!!deleteTransactionId}
        onOpenChange={(open) => { if (!open) setDeleteTransactionId(null); }}
        title="Delete Transaction"
        description="This will restore the amount to your card balance."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDeleteTransaction}
        loading={deletingTransaction}
      />

      <ConfirmDialog
        open={showDeleteCardDialog}
        onOpenChange={setShowDeleteCardDialog}
        title="Delete Card Permanently"
        description="This card and all its transactions will be permanently deleted."
        confirmLabel="Delete Card"
        variant="destructive"
        onConfirm={handleDeleteCard}
        loading={deletingCard}
      />
    </div>
  );
}