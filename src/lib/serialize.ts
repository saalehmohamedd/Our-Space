// src/lib/serialize.ts

export function serializeDecimal(value: any): string {
  if (value === null || value === undefined) return "0";
  if (typeof value === "object" && value.constructor?.name === "Decimal") {
    return value.toString();
  }
  return value?.toString() || "0";
}

export function serializeDate(value: any): string | null {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString();
  return new Date(value).toISOString();
}

export function serializeCard(card: any) {
  return {
    id: card.id,
    nickname: card.nickname,
    brand: card.brand,
    last4: card.last4,
    expiryMonth: card.expiryMonth,
    expiryYear: card.expiryYear,
    colorTheme: card.colorTheme,
    balance: serializeDecimal(card.balance),
    ownerId: card.ownerId,
    isArchived: card.isArchived,
    createdAt: serializeDate(card.createdAt),
    transactions: card.transactions?.map(serializeTransaction) || [],
  };
}

export function serializeTransaction(t: any) {
  return {
    id: t.id,
    cardId: t.cardId,
    amount: serializeDecimal(t.amount),
    date: serializeDate(t.date),
    sourceType: t.sourceType,
    sourceId: t.sourceId,
    note: t.note,
    createdAt: serializeDate(t.createdAt),
  };
}