// src/app/actions/cards.actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUserOrThrow } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";

// Helper to serialize response data
function serializeCardResponse(card: any) {
  return {
    ...card,
    balance: Number(card.balance),
    createdAt: card.createdAt?.toISOString?.() || card.createdAt,
    transactions: card.transactions?.map((t: any) => ({
      ...t,
      amount: Number(t.amount),
      date: t.date?.toISOString?.() || t.date,
      createdAt: t.createdAt?.toISOString?.() || t.createdAt,
    })),
    monthlyIncomes: card.monthlyIncomes?.map((m: any) => ({
      ...m,
      amount: Number(m.amount),
      createdAt: m.createdAt?.toISOString?.() || m.createdAt,
    })),
  };
}

export async function createCard(input: {
  nickname: string;
  brand: string;
  last4: string;
  colorTheme?: string;
  expiryMonth?: number;
  expiryYear?: number;
}) {
  try {
    const user = await getCurrentUserOrThrow();

    const card = await prisma.card.create({
      data: {
        nickname: input.nickname,
        brand: input.brand as any,
        last4: input.last4,
        colorTheme: input.colorTheme || "indigo",
        balance: 0,
        expiryMonth: input.expiryMonth || null,
        expiryYear: input.expiryYear || null,
        ownerId: user.id,
      },
    });

    revalidatePath("/cards");
    return { success: true, message: "Card added successfully! 💳" };
  } catch (error) {
    console.error("Create card error:", error);
    throw new Error("Failed to create card");
  }
}

export async function updateCard(
  id: string,
  input: { nickname?: string; colorTheme?: string; expiryMonth?: number; expiryYear?: number }
) {
  try {
    await getCurrentUserOrThrow();
    // Removed ownership check - anyone can update any card
    await prisma.card.update({ where: { id }, data: input });
    revalidatePath(`/cards/${id}`);
    revalidatePath("/cards");
    return { success: true, message: "Card updated!" };
  } catch (error) {
    throw new Error("Failed to update card");
  }
}

export async function archiveCard(id: string) {
  try {
    const user = await getCurrentUserOrThrow();
    const card = await prisma.card.findUnique({ where: { id } });
    if (!card || card.ownerId !== user.id) throw new Error("Unauthorized");

    await prisma.card.update({ where: { id }, data: { isArchived: true } });
    revalidatePath("/cards");
    return { success: true, message: "Card archived" };
  } catch (error) {
    throw new Error("Failed to archive card");
  }
}

export async function deleteCard(id: string) {
  try {
    const user = await getCurrentUserOrThrow();
    const card = await prisma.card.findUnique({ where: { id } });
    if (!card || card.ownerId !== user.id) throw new Error("Unauthorized");

    await prisma.card.delete({ where: { id } });
    revalidatePath("/cards");
    return { success: true, message: "Card deleted" };
  } catch (error) {
    throw new Error("Failed to delete card");
  }
}

export async function createTransaction(input: {
  cardId: string;
  amount: number;
  sourceType: "WISHLIST" | "SHOPPING" | "DATE_OUTING" | "MANUAL";
  sourceId?: string;
  note?: string;
}) {
  try {
    await getCurrentUserOrThrow();
    // Removed ownership check - anyone can create transactions on any card
    await prisma.$transaction([
      prisma.transaction.create({
        data: {
          cardId: input.cardId,
          amount: input.amount,
          sourceType: input.sourceType,
          sourceId: input.sourceId || null,
          note: input.note || null,
        },
      }),
      prisma.card.update({
        where: { id: input.cardId },
        data: { balance: { decrement: input.amount } },
      }),
    ]);
    revalidatePath(`/cards/${input.cardId}`);
    revalidatePath("/cards");
    return { success: true, message: "Transaction added" };
  } catch (error) {
    throw new Error("Failed to create transaction");
  }
}

export async function deleteTransaction(id: string) {
  try {
    const user = await getCurrentUserOrThrow();
    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: { card: true },
    });

    if (!transaction || transaction.card.ownerId !== user.id) throw new Error("Unauthorized");

    await prisma.$transaction([
      prisma.transaction.delete({ where: { id } }),
      prisma.card.update({
        where: { id: transaction.cardId },
        data: { balance: { increment: transaction.amount } },
      }),
    ]);

    revalidatePath(`/cards/${transaction.cardId}`);
    revalidatePath("/cards");
    return { success: true, message: "Transaction deleted" };
  } catch (error) {
    throw new Error("Failed to delete transaction");
  }
}

export async function setMonthlyIncome(input: {
  cardId: string;
  amount: number;
  month: number;
  year: number;
  note?: string;
}) {
  try {
    await getCurrentUserOrThrow();
    // Removed ownership check
    const existing = await prisma.monthlyIncome.findUnique({
      where: { cardId_month_year: { cardId: input.cardId, month: input.month, year: input.year } },
    });

    if (existing) {
      const difference = input.amount - Number(existing.amount);
      await prisma.$transaction([
        prisma.monthlyIncome.update({ where: { id: existing.id }, data: { amount: input.amount, note: input.note || null } }),
        prisma.card.update({ where: { id: input.cardId }, data: { balance: { increment: difference } } }),
      ]);
    } else {
      await prisma.$transaction([
        prisma.monthlyIncome.create({
          data: { cardId: input.cardId, amount: input.amount, month: input.month, year: input.year, note: input.note || null },
        }),
        prisma.card.update({ where: { id: input.cardId }, data: { balance: { increment: input.amount } } }),
      ]);
    }
    revalidatePath(`/cards/${input.cardId}`);
    return { success: true, message: "Monthly income updated!" };
  } catch (error) {
    throw new Error("Failed to set monthly income");
  }
}

// src/app/actions/cards.actions.ts - Updated getCardReport function

export async function getCardReport(
  cardId: string, 
  range: "week" | "month" | "year",
  sourceType?: string
) {
  try {
    const user = await getCurrentUserOrThrow();
    const card = await prisma.card.findUnique({ where: { id: cardId } });
    if (!card) throw new Error("Unauthorized");

    const now = new Date();
    let startDate: Date;
    let groupBy: string;

    switch (range) {
      case "week":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        groupBy = "day";
        break;
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        groupBy = "day";
        break;
      case "year":
        startDate = new Date(now.getFullYear(), 0, 1);
        groupBy = "month";
        break;
    }

    // Build transaction where clause - apply sourceType filter if provided
    const transactionWhere: any = {
      cardId,
      date: { gte: startDate },
    };
    
    if (sourceType && sourceType !== "ALL") {
      transactionWhere.sourceType = sourceType;
    }

    // Get daily/monthly spend (filtered)
    const spendData = await prisma.$queryRawUnsafe<{ period: string; amount: number }[]>(
      `SELECT DATE_TRUNC('${groupBy}', date) as period, SUM(amount)::decimal as amount
       FROM "Transaction"
       WHERE "cardId" = $1 AND date >= $2 ${sourceType && sourceType !== "ALL" ? `AND "sourceType" = $3` : ""}
       GROUP BY DATE_TRUNC('${groupBy}', date) ORDER BY period ASC`,
      cardId,
      startDate,
      ...(sourceType && sourceType !== "ALL" ? [sourceType] : [])
    );

    // Source breakdown - ALWAYS unfiltered (show all categories)
    const sourceBreakdown = await prisma.transaction.groupBy({
      by: ["sourceType"],
      where: {
        cardId,
        date: { gte: startDate },
      },
      _sum: { amount: true },
    });

    // Get monthly incomes
    const monthlyIncomes = await prisma.monthlyIncome.findMany({
      where: { cardId, year: { gte: startDate.getFullYear() } },
      orderBy: [{ year: "asc" }, { month: "asc" }],
    });

    // Get transactions (filtered)
    const transactions = await prisma.transaction.findMany({
      where: transactionWhere,
      orderBy: { date: "desc" },
      take: 100,
    });

    // Build monthly breakdown from filtered transactions
    const monthlyBreakdown: Record<string, { income: number; spent: number; saved: number; transactions: any[] }> = {};
    const startMonth = startDate.getMonth() + 1;
    const startYear = startDate.getFullYear();
    const endMonth = now.getMonth() + 1;
    const endYear = now.getFullYear();

    for (let y = startYear; y <= endYear; y++) {
      const sm = y === startYear ? startMonth : 1;
      const em = y === endYear ? endMonth : 12;
      for (let m = sm; m <= em; m++) {
        const key = `${y}-${String(m).padStart(2, "0")}`;
        monthlyBreakdown[key] = { income: 0, spent: 0, saved: 0, transactions: [] };
      }
    }

    monthlyIncomes.forEach((inc) => {
      const key = `${inc.year}-${String(inc.month).padStart(2, "0")}`;
      if (monthlyBreakdown[key]) monthlyBreakdown[key].income = Number(inc.amount);
    });

    transactions.forEach((t) => {
      const d = new Date(t.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (monthlyBreakdown[key]) {
        monthlyBreakdown[key].spent += Number(t.amount);
        monthlyBreakdown[key].transactions.push({
          id: t.id,
          amount: Number(t.amount),
          sourceType: t.sourceType,
          note: t.note,
          date: t.date.toISOString(),
        });
      }
    });

    Object.keys(monthlyBreakdown).forEach((key) => {
      monthlyBreakdown[key].saved = monthlyBreakdown[key].income - monthlyBreakdown[key].spent;
    });

    // Total spent is calculated from filtered transactions
    const totalSpent = transactions.reduce((sum, t) => sum + Number(t.amount), 0);
    const totalIncome = Object.values(monthlyBreakdown).reduce((s, m) => s + m.income, 0);

    return {
      success: true,
      data: {
        spendData: spendData.map((d: any) => ({ period: d.period, amount: Number(d.amount) })),
        sourceBreakdown: sourceBreakdown.map((s: any) => ({
          sourceType: s.sourceType,
          amount: Number(s._sum?.amount || 0),
        })),
        monthlyBreakdown,
        transactions: transactions.map((t: any) => ({
          id: t.id,
          amount: Number(t.amount),
          sourceType: t.sourceType,
          note: t.note,
          date: t.date.toISOString(),
        })),
        totalIncome,
        totalSpent,
        totalSaved: totalIncome - totalSpent,
        currentBalance: Number(card.balance),
      },
    };
  } catch (error) {
    throw new Error("Failed to get card report");
  }
}