// src/lib/card-utils.ts

export type CardBrand = "VISA" | "MASTERCARD" | "AMEX" | "MEEZA" | "OTHER";

// MEEZA BIN ranges (Egyptian national payment network)
const MEEZA_BINS = [
  // Primary Meeza BINs
  "507803", "507804", "507805", "507806", "507807", "507808",
  "474131", "474132", "474133", "474134", "474135",
  "521300", "521301", "521302", "521303",
  "539200", "539201", "539202", "539203",
  "539500", "539501", "539502", "539503",
  "539600", "539601", "539602", "539603",
  "539800", "539801", "539802", "539803",
  // Additional Meeza BINs
  "450875", "450876", "450877", "450878",
  "498310", "498311", "498312", "498313",
  "498314", "498315", "498316", "498317",
  // Meeza prepaid cards
  "507810", "507811", "507812", "507813",
  "507814", "507815", "507816", "507817",
];

export function luhnCheck(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, "");
  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

export function detectCardBrand(cardNumber: string): CardBrand {
  const cleaned = cardNumber.replace(/\D/g, "");

  // Check MEEZA first (specific BIN list)
  for (const bin of MEEZA_BINS) {
    if (cleaned.startsWith(bin)) return "MEEZA";
  }

  // Amex: 34, 37
  if (/^3[47]/.test(cleaned)) return "AMEX";

  // Mastercard: 51-55 or 2221-2720
  if (/^5[1-5]/.test(cleaned)) return "MASTERCARD";
  if (/^2(2[2-9]|[3-6]\d|7[0-2])\d*/.test(cleaned)) return "MASTERCARD";

  // Visa: starts with 4
  if (/^4/.test(cleaned)) return "VISA";

  return "OTHER";
}

export function getLast4(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\D/g, "");
  return cleaned.slice(-4);
}

export function formatMaskedNumber(last4: string): string {
  return `•••• •••• •••• ${last4}`;
}

export function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, "");
  const groups = digits.match(/.{1,4}/g);
  return groups ? groups.join(" ") : "";
}

export function getCardColorClasses(colorTheme: string): {
  gradient: string;
  light: string;
  dark: string;
} {
  const themes: Record<string, { gradient: string; light: string; dark: string }> = {
    indigo: {
      gradient: "from-indigo-600 via-indigo-500 to-blue-500",
      light: "bg-indigo-50 text-indigo-700",
      dark: "bg-indigo-900/30 text-indigo-400",
    },
    rose: {
      gradient: "from-rose-600 via-pink-500 to-orange-400",
      light: "bg-rose-50 text-rose-700",
      dark: "bg-rose-900/30 text-rose-400",
    },
    emerald: {
      gradient: "from-emerald-600 via-teal-500 to-cyan-500",
      light: "bg-emerald-50 text-emerald-700",
      dark: "bg-emerald-900/30 text-emerald-400",
    },
    violet: {
      gradient: "from-violet-600 via-purple-500 to-fuchsia-500",
      light: "bg-violet-50 text-violet-700",
      dark: "bg-violet-900/30 text-violet-400",
    },
    amber: {
      gradient: "from-amber-600 via-orange-500 to-red-500",
      light: "bg-amber-50 text-amber-700",
      dark: "bg-amber-900/30 text-amber-400",
    },
    slate: {
      gradient: "from-slate-700 via-slate-600 to-gray-500",
      light: "bg-slate-50 text-slate-700",
      dark: "bg-slate-900/30 text-slate-400",
    },
    teal: {
      gradient: "from-teal-600 via-cyan-500 to-blue-400",
      light: "bg-teal-50 text-teal-700",
      dark: "bg-teal-900/30 text-teal-400",
    },
    black: {
      gradient: "from-black-600 via-cyan-500 to-blue-400",
      light: "bg-teal-50 text-teal-700",
      dark: "bg-teal-900/30 text-teal-400",
    },
  };

  return themes[colorTheme] || themes.indigo;
}

export function getBrandDisplayName(brand: CardBrand): string {
  const names: Record<CardBrand, string> = {
    VISA: "Visa",
    MASTERCARD: "Mastercard",
    AMEX: "American Express",
    MEEZA: "Meeza",
    OTHER: "Card",
  };
  return names[brand];
}

export function getBrandColor(brand: CardBrand): string {
  const colors: Record<CardBrand, string> = {
    VISA: "text-blue-600",
    MASTERCARD: "text-orange-600",
    AMEX: "text-blue-800",
    MEEZA: "text-purple-600",
    OTHER: "text-gray-600",
  };
  return colors[brand];
}